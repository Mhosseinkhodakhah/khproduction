import axios from "axios";
import { userLoggInterface } from "../interface/interfaces.interface";



export class interservice{
    async addNewLog(user:userLoggInterface , title : string , description : string , action : {} , status : number):Promise<boolean>{
        try {
            let data = {
                user : user,
                title,
                description,
                action,
                status
            }
            let rawRespons = await axios.put('http://localhost:5010/log/interservice/logg/admin' , data)
            console.log('response of the logger' ,rawRespons.data)
            return true
        } catch (error) {
            console.log(error)
            return false            
        }
    }
}