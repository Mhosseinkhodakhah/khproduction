import express from "express"
import bodyParser from "body-parser"
import { Request, Response } from "express"
import { AppDataSource } from "./data-source"
import { Routes } from "./routes"
import cors from 'cors'
import { SystemService } from "./services/system-service/system-service"
import { GoldPriceService } from "./services/gold-price-service/gold-price-service"
import { startCronJob } from "./jobs/GoldPriceSchedule"
import winston from 'winston'
import expressWinston from 'express-winston'
import { createLogger, format, transports } from 'winston'
import workerRunner from "./workers/workerRunner"
import monitor from "./util/statusMonitor"
const { combine, timestamp, label, prettyPrint } = format;
let workerStarter = new workerRunner()

AppDataSource.initialize().then(async () => {

    workerStarter.startWorker()

    // create express app
    const app = express()
    app.use(bodyParser.json())
    app.use(cors({
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE" , "PATCH"],
        allowedHeaders: ["Content-Type", "Authorization"]
    }));

    

    //set logger
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



    // register express routes from defined application routes
    Routes.forEach(route => {
        //  const middlewares = route.middlwares ?? null
        (app as any)[route.method](route.route, route.middlwares, async (req: Request, res: Response, next: Function) => {
            const result = await (new (route.controller as any))[route.action](req, res, next)
        })
    })
    // startCronJob()
    const systemService = new SystemService();                   // what the fuck?????
    await systemService.initializeSystemUser();
    await systemService.initializeTransactionTypes();

    app.listen(3000)


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

    console.log("Express server has started on port 3000. Open http://localhost:3000/users to see results")

}).catch(error => console.log(error))
