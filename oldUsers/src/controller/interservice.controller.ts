import { NextFunction, Request, Response } from "express";
import monitor from "../responseModel/statusMonitor";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";
import { response } from "../responseModel/response.model";




export default class interServiceController{


    private userRepository = AppDataSource.getRepository(User)


    async getLoggs(req: Request, res: Response, next: NextFunction){
        let status = await monitor.getter()
        return res.status(200).json(status)
    }



    async changeUserStatus(req: Request, res: Response, next: NextFunction){
        let user = await this.userRepository.findOne({where : {id : +req.params.id} , relations : ['wallet']})
        let body = req.body
        user.firstName = body.firstName;
        user.lastName = body.lastName;
        user.gender = body.gender;
        user.fullName = `${body.firstName} ${body.lastName}`
        user.phoneNumber = req.params.phoneNumber;
        user.birthDate = body.birthDate;
        user.verificationStatus = 1
        let savedUser = await this.userRepository.save(user)
        return next(new response(req , res  , 'old user' , 200 , null , savedUser))        
    }


    async checkOldUser(req: Request, res: Response, next: NextFunction){
        let user = await this.userRepository.exists({where : {phoneNumber : req.params.phoneNumber}})
        if (!user){
            return next(new response(req , res  , 'old user' , 400 , 'user not found' , null))
        }
        let userr = await this.userRepository.findOne({where : {phoneNumber : req.params.phoneNumber} , relations : ['wallet']})
        console.log('usssss' , userr)
        return next(new response(req , res  , 'old user' , 200 , null , userr))        
    }



    async getAllUsers(req: Request, res: Response, next: NextFunction){
        let allUsers = await this.userRepository.find({relations : ['wallet' , 'sells' , 'buys' ]})
        return res.status(200).json({
            data:allUsers
        })
    }


        /**
         * this function is for geting all old users with their relations
         * @param req 
         * @param res 
         * @param next 
         * @returns 
         */
        async allUsers(req: Request, res: Response, next: NextFunction) {
            let users = await this.userRepository.count({ where : {
                verificationStatus : 2
            }})
            return res.status(200).json({
                users:users
            })
            // return next(new response(req, res, 'get all users', 200, null, users))
        }
    
    


}


