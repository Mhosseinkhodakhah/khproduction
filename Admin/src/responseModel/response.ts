import { responseInterface } from "../interface/interfaces.interface"
import monitor from "./statusMonitor"



export class response{
    constructor(req : any , res : any , scope : string , statusCode : number , error : string | null , data : string | {} | null ) {
        console.log('its here interceptor')
        if (statusCode >= 400 && statusCode<500 ){
        // statusCode = 500
        console.log('its here intercepto 1')
            let recordeStatus = monitor.addStatus({
                scope,
                status : 0,
                error,
            })   
        }
        if (statusCode >= 200 && statusCode<300){
        console.log('its here interceptor22')
            let recordeStatus = monitor.addStatus({
                scope,
                status : 1,
                error,
            })
        } 
        if (statusCode >= 500){
        console.log('its here interceptor33')
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
        console.log('its here interceptor444')
        return res.status(statusCode).json(payload)
    }

}


