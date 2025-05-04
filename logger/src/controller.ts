import adminLogsModel from "./DB/adminLogger";
import userLogsModel from "./DB/models";
import logsModel from "./DB/models";
import cacher from "./service/cache.service";
import { response } from "./service/responseService";


export default class logsController{

    async getAllLogs(req : any , res : any , next:any){
        const logs = await logsModel.find().sort({createdAt : -1})
        return next(new response(req , res , 'get all user logs by admin' , 200 , null , logs))
    }


    async getAllAdminLogs(req : any , res : any , next:any){
        const logs = await adminLogsModel.find().sort({createdAt : -1})
        return next(new response(req , res , 'get all admin logs' , 200 , null , logs))
    }


    async statuses (req : any , res : any , next:any){
        let RES = null;
        try {
            const statuses = await cacher.getter('status')
            RES = statuses
        } catch (error) {
            console.log('error' , `${error}`)
        }
        return next(new response(req , res , 'service status' , 200 , null , RES))
    }


    async deleteAll (req : any , res : any , next : any){
        let all = await adminLogsModel.find()
        await adminLogsModel.deleteMany()
        let b = await userLogsModel.find()
        await userLogsModel.deleteMany()
        res.status(200).json('done')
    }


}