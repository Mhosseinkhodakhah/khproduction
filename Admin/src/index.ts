import express from "express"
import * as bodyParser from "body-parser"
import { Request, Response } from "express"
import { AppDataSource } from "./data-source"
import dotenv, { config } from 'dotenv'
import winston from 'winston'
import expressWinston from 'express-winston'
import helmet from 'helmet'
// import xss from "xss-clean"
// import ratelimit from 'express-rate-limit'
import hpp from 'hpp'
import cors from 'cors'
import responseTime from 'response-time'
import { createLogger, format, transports } from 'winston'
import { Routes } from "./routes"
import mqConnection from "./rabbitMq/rabbitMq.service"
const { combine, timestamp, label, prettyPrint } = format;
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import axios from 'axios'
import monitor from "./responseModel/statusMonitor"
import { connectRedis, redisCache } from "./services/redis.service"

AppDataSource.initialize().then(async () => {

    // create express app
    const app = express()
    app.use(bodyParser.json())
    config()
    console.log('////' , process.env.DB_PASS)
    app.use(cors())
    app.use(helmet())
    app.use(hpp())
    // await mqConnection.connect();                                                   // this is for test
    // await mqConnection.sendToQueue('userLogs' , {message : 'test passed????'});
    
    app.use(
        expressWinston.logger({
            transports: [new winston.transports.Console(), new (winston.transports.File)({ filename: 'myLogs.log' })],
            format: format.combine(
                label({ label: 'right meow!' }),
                timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                prettyPrint()
            ),
            statusLevels: true,
            meta: true,
            msg: "HTTP {{req.method}} {{req.url}} {{res.statusCode}} {{res.responseTime}}ms",
            expressFormat: true,
            ignoreRoute() {
                return false;
            },
        })
    );

    process.on('unhandledRejection', (error) => {
        monitor.error.push(`${error}`)
        console.log('error occured . . .', error)
    });

    process.on('uncaughtException', (error) => {
        monitor.error.push(`${error}`)
        console.log('error occured', error)
    })

    process.on('unhandledException', (error) => {
        monitor.error.push(`${error}`)
        console.log('error occured . . .', error)
    })
   

    dotenv.config({path : './config/config.env'})

    // register express routes from defined application routes
    // app.use('/' , router)
    Routes.forEach(route => {
        (app as any)[route.method](route.route ,route.middleware,(req: Request, res: Response, next: Function) => {
            const result = (new (route.controller as any))[route.action](req, res, next)
        })
    })

    // setup express app here
    // ...
    
    // start express server
    app.listen(5005)

    console.log("Express server has started on port 3000. Open http://localhost:5005 to see results")

}).catch(error => console.log(error))



connectRedis()

let a = new redisCache()

