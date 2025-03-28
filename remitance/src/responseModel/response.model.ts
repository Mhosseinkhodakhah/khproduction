import { responseInterface } from "../interfaces/interface.interface"
import monitor from "./statusMonitor"
import interceptor from "./statusMonitor"




export class response{
    constructor(req : any , res : any , scope : string , statusCode : number , error : string | null , data : string | {} | null ) {
        if (statusCode >= 400 && statusCode<500 ){
            let recordeStatus = monitor.addStatus({
                scope,
                status : 0,
                error,
            })   
        }
        if (statusCode >= 200 && statusCode<300){
            let recordeStatus = monitor.addStatus({
                scope,
                status : 1,
                error,
            })
        } 
        if (statusCode >= 500){
            let recordeStatus = monitor.addStatus({
                scope,
                status : 2,
                error,
            })
        }
        const payload : responseInterface  = {
            success : (statusCode === 200) ? true : false,
            scope : scope,
            error : error,
            data : data , 
        }
        return res.status(statusCode).json(payload)
    }

}


