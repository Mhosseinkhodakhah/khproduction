import axios from "axios"
import { userLoggInterface } from "../../interfaces/interface.interface"
// import fetch from 'fetch'


export default class logger{
    async addNewLog(user:userLoggInterface , title : string , description : string , action : {} , status : number):Promise<boolean>{
        try {
            let data = {
                user : user,
                title,
                description,
                action,
                status
            }
            let rawRespons = await axios.put('http://localhost:5010/log/interservice/logg/user' , data)
            console.log('response of the logger' ,rawRespons.data)
            return true
        } catch (error) {
            console.log(error)
            return false            
        }
    }


    async getAllOldUser(){
        try {
            let resss = await axios.get('http://localhost:5004/interservice/getAll')
            // let rawRespons = await axios()
            console.log(resss.data)
            return resss.data.users;
        } catch (error) {
            console.log('eror in interservice' , `${error}`)
            return 0
        }
    }


    async getChartData(){
        try {
            let resss = await axios.get('http://localhost:3001/charts')
            console.log(resss.data)
            return resss.data;
        } catch (error) {
            console.log('error in get all chart from sidecar' , error)
            return null
        }
    }

    async appChartData(){
        try {
            let resss = await axios.get('http://localhost:3001/app/charts')
            console.log(resss.data)
            return resss.data;
        } catch (error) {
            console.log('error in get all chart from sidecar' , error)
            return null
        }
    }


}