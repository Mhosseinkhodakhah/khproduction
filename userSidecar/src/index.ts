import express from "express"
import * as bodyParser from "body-parser"
import { Request, Response } from "express"
import { AppDataSource } from "./data-source"
import { Routes } from "./routes"
import { User } from "./entity/User"
import dotenv, { config } from 'dotenv'

import winston from 'winston'

import expressWinston from 'express-winston'

import helmet from 'helmet'

import hpp from 'hpp'

import cors from 'cors'

import { createLogger, format, transports } from 'winston'
import monitor from "./responseModel/statusMonitor"
import { startCronJob } from "../analyzor"
import { goldPrice } from "./entity/goldPrice"
import axios from "axios"

const { combine, timestamp, label, prettyPrint } = format;

AppDataSource.initialize().then(async () => {


      let all = await axios.get("https://khaneetala.ir/api/test/09123460671")
    //   console.log(all.data[0])
    //     let goldPrice2 = AppDataSource.getRepository(goldPrice)
    //     let dataMaker = []  
    //     all.data.forEach((elem)=>{
    //         delete elem.id
    //         // console.log(elem)
    //         dataMaker.push(elem)
    //         // console.log(data)
    //     })
    //     console.log(dataMaker[10])
        // let datas1 = goldPrice2.create(dataMaker)
        // let datas2 = await goldPrice2.save(datas)
        // console.log(datas2)
    

    // create express app
    const app = express()
    app.use(bodyParser.json())

    app.use(cors({
        origin: ['*'],
        methods: ["GET"],
        allowedHeaders: ["Content-Type", "Authorization"]
    }));

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

    startCronJob()

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
   
    config({path : './config.env'})
    
    // register express routes from defined application routes
    Routes.forEach(route => {
        (app as any)[route.method](route.route, (req: Request, res: Response, next: Function) => {
            const result = (new (route.controller as any))[route.action](req, res, next)
            // if (result instanceof Promise) {
            //     result.then(result => result !== null && result !== undefined ? res.send(result) : undefined)
            // } else if (result !== null && result !== undefined) {
            //     res.json(result)
            // }
        })
    })



    // start express server
    app.listen(3001)


    console.log("Express server has started on port 3000. Open http://localhost:3001/users to see results")

}).catch(error => console.log(error))
