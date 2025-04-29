import monitor from "../util/statusMonitor"
import { NextFunction, Request, Response } from "express"



export class interService{

    async getStatus(req : Request , res : Response , next : NextFunction){
        try {
            let data = {
                all :  monitor  .requestCount,
                statusCount : monitor.status,
                error : monitor.error
            }
            console.log('status data till here . . .' , data)
            monitor.addStatus({
                scope : 'interservice controller',
                status :  1,
                error : null
            })
            return res.status(200).json(data)
        } catch (error) {
            monitor.addStatus({
                scope : 'interservice controller',
                status :  0,
                error : `${error}`
            })
            console.log(error)
            return res.status(500).json({success : false})
        }
    }


} 