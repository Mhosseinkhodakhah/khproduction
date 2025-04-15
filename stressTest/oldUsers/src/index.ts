import express from "express"
import * as bodyParser from "body-parser"
import { Request, Response } from "express"
import { AppDataSource } from "./data-source"
import { Routes } from "./routes"
import { User } from "./entity/User"
import helmet from 'helmet'
import hpp from 'hpp'
import { config } from "dotenv";
import cors from 'cors'
import axios from "axios"
import fs from 'fs'
import analyzor from "../data.analyze"
import monitor from "./responseModel/statusMonitor"
import { UserController } from "./controller/UserController"

config()

AppDataSource.initialize().then(async () => {



    // let us = new UserController()
    // let a = await us.delet()
    // console.log(a)
    // create express app
    const app = express()
    app.use(bodyParser.json())

    app.use(cors())
    app.use(helmet())
    app.use(hpp())

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
   
    

    // let d = await axios.get('http://localhost:5010/exel')
    // console.log(d.data.data)
    // fs.writeFileSync('data.json' , JSON.stringify(d.data.data))

    // d.data.data.forEach((elem:any)=>{
    // })
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
    

    app.listen(7004)


    console.log("Express server has started on port 5004. Open http://localhost:5004/users to see results")

}).catch(error => console.log(error))
