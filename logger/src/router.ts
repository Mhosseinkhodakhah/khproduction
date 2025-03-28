import { Router } from "express";
import logsController from "./controller";



const router = Router()


const controller = new logsController()


router.get('/user/all' , controller.getAllLogs)


router.get('/admin/all' , controller.getAllAdminLogs)


router.get('/status' , controller.statuses)


export default router
