import { NextFunction, Request, Response } from "express";
import monitor from "../responseModel/statusMonitor";




export default class interServiceController{
    async getLoggs(req: Request, res: Response, next: NextFunction){
        let status = await monitor.getter()
        return res.status(200).json(status)
    }
   
}