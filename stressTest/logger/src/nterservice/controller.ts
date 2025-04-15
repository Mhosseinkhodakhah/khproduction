import { number } from "joi";
import { response } from "../service/responseService";
import userLogsModel from "../DB/models";
import adminLogsModel from "../DB/adminLogger";
// import logsModel from "../DB/models";



export default class interServiceController {

  async putNewLog(req:any , res : any , next : any){
    const data = req.body;
    data['date'] = new Date().toLocaleString('fa-IR').split(',')[0]
    data['time'] = new Date().toLocaleString('fa-IR').split(',')[1]
    const newLog = await userLogsModel.create(data)
    return next(new response(req , res , 'put new log ' , 200 , null , newLog))
  }

  async putNewLogOfAdmin(req:any , res : any , next : any){
    const data = req.body;
    data['date'] = new Date().toLocaleString('fa-IR').split(',')[0]
    data['time'] = new Date().toLocaleString('fa-IR').split(',')[1]
    const newLog = await adminLogsModel.create(data)
    return next(new response(req , res , 'put new log ' , 200 , null , newLog))
  }

}