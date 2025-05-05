import express from "express"
import bodyParser from "body-parser"
import { Request, Response } from "express"
import { AppDataSource } from "./data-source"
import { Routes } from "./routes"
import winston from 'winston'
import expressWinston from 'express-winston'
import { createLogger, format, transports } from 'winston'
import cors from 'cors'
const { combine, timestamp, label, prettyPrint } = format;


AppDataSource.initialize().then(async () => {

    // create express app
    const app = express()
    app.use(cors())


    
    app.use(
        expressWinston.logger({
            transports: [new winston.transports.Console(), new (winston.transports.File)({ filename: 'myLogs.log' })],
            format: format.combine(
                label({ label: 'right meow!' }),
                timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                prettyPrint()
            ),
            statusLevels: true,
            meta: false,
            msg: "HTTP {{req.method}} {{req.url}} {{res.statusCode}} {{res.responseTime}}ms",
            expressFormat: true,
            ignoreRoute() {
                return false;
            },
        })
    );

    // inside logger!!!!
    winston.configure({
        format: format.combine(

            label({ label: 'right meow!' }),
            timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            prettyPrint()
        ),
        transports: [
            new (winston.transports.File)({ filename: 'inside.log' }),
            // new winston.transports.Console()
        ],
    })




    app.use(bodyParser.json())

    // register express routes from defined application routes
    Routes.forEach(route => {
        (app as any)[route.method](route.route, route.middlewares , (req: Request, res: Response, next: Function) => {
            const result = (new (route.controller as any))[route.action](req, res, next)
        })
    })

    // setup express app here
    // ...

    // start express server
    app.listen(3006)

    // insert new users for test

    console.log("Express server has started on port 3006. Open http://localhost:3006/users to see results")

}).catch(error => console.log(error))
