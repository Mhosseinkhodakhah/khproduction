import express , {Router} from 'express'
import interServiceController from './controller';


const interservice = Router();

const controller = new interServiceController()

interservice.put('/logg/user' , controller.putNewLog)

interservice.put('/logg/admin' , controller.putNewLogOfAdmin)

export default interservice;