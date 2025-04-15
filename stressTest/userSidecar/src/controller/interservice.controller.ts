import { NextFunction, Request, Response } from "express"
import monitor from "../responseModel/statusMonitor"


export default class interservice{
    async getStatus(req : Request , res : Response , next : NextFunction){
        let data = {
            all :  monitor.requestCount,
            statusCount : monitor.status,
            error : monitor.error
        }
        console.log('status data till here . . .' , data)
        return res.status(200).json(data)
    }
}