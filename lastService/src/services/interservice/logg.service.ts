import axios from "axios"
import { adminLoggInterface, userLoggInterface } from "../../interfaces/interface.interface"
import monitor from "../../util/statusMonitor"
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
           monitor.error.push(` error in interservice add new log :: ${error}`)
            console.log(error)
            return false            
        }
    }


    async checkCardNuber(info){
        try {
            console.log('its hereeeeeeeee>>>>>>>>>>')
            let response = await axios.post('https://khaneetala.ir/api/card/check' , info)
            console.log('returned data' , response.data)
            return response.data.isMatch;
        } catch (error) {
           console.log(` error in checkcardnumber :: `, error.response)
           monitor.error.push(` error in checkcardnumber :: ${error}`)
           return false;
        }
    }

    async addNewAdminLog(user:adminLoggInterface , title : string , description : string , action : {} , status : number):Promise<boolean>{
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
           monitor.error.push(` error in add new admin log interservice :: ${error}`)

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
           monitor.error.push(` error in get all oldUser interservice request:: ${error}`)

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
           monitor.error.push(` error in get chart data from usersidecar:: ${error}`)

            console.log('error in get all chart from sidecar' , error)
            return null
        }
    }

    async appChartData(userId : number){
        try {
            let resss = await axios.get(`http://localhost:3001/charts/app/${userId}`)
            console.log(resss.data)
            return resss.data;
        } catch (error) {
            monitor.error.push(` error in get app chart data from usersidecar:: ${error}`)
            
            console.log('error in get all chart from sidecar' , error)
            return null
        }
    }



    async checkUser(phoneNumber : string){
        try {
            let resss = await axios.get(`http://localhost:5004/interservice/check-user/${phoneNumber}`)
            console.log(resss.data)
            return resss.data;
        } catch (error) {
           monitor.error.push(` error in check user from oldUser interservice :: ${error}`)
            console.log('error in get all chart from sidecar' , error)
            return error.response.data
        }
    }


    async changeUserStatus(phoneNumber : string , body){
        try {
            let resss = await axios.post(`http://localhost:5004/interservice/approve-user/${phoneNumber}` , body)
            console.log(resss.data)
            return resss.data;
        } catch (error) {
           monitor.error.push(` error in change user status in interserivce :: ${error}`)

            console.log('error in get all chart from sidecar' , error)
            return error.response
        }
    }

}