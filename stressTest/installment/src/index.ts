import express from "express"
import * as bodyParser from "body-parser"
import { Request, Response } from "express"
import { AppDataSource } from "./data-source"
import { Routes } from "./routes"
import { User } from "./entity/User"
import dotenv from 'dotenv'
import winston from 'winston'
import expressWinston from 'express-winston'
import helmet from 'helmet'
import hpp from 'hpp'
import cors from 'cors'

import { createLogger, format, transports } from 'winston'
import monitor from "./responseModel/statusMonitor"

const { combine, timestamp, label, prettyPrint } = format;

AppDataSource.initialize().then(async () => {

    // create express app
    const app = express()
    app.use(bodyParser.json())
    app.use(cors())
    app.use(helmet())
    app.use(hpp())
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
    Routes.forEach(async(route) => {
        (app as any)[route.method](route.route, route.middlwares , (req: Request, res: Response, next: Function) => {
            const result = (new (route.controller as any))[route.action](req, res, next)
        })
    })



    // start express server
    app.listen(5008)


    console.log("Express server has started on port 5008. Open http://localhost:5008/users to see results")

}).catch(error => console.log(error))
