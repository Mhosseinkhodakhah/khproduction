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
    
    







        /**
         * its for last service for checking the fucking oldUser
         * @param req 
         * @param res 
         * @param next 
         * @returns 
         */
        async checkOldWithPhoneOrNatnialCode(req: Request, res: Response, next: NextFunction){
            console.log("phoneNumber",req.params.phoneNumber);
            console.log("nationalCode",req.params.nationalCode);
            const  {
                firstName,
                lastName,
                gender,
                liveStatus,
                identificationNo,
                fatherName,
                identificationSerial,
                identificationSeri,
                officeName,
              } = req.body

              let queryRunner = AppDataSource.createQueryRunner()
              await queryRunner.connect()
              await queryRunner.startTransaction()

              try {
                  console.log(req.body);
                  
                  let user = await this.userRepository.findOne({where : [  
                      { phoneNumber: req.params.phoneNumber },
                      { nationalCode: req.params.nationalCode }
                    ] , relations : ['wallet']})
                    console.log('user is >>>>' , user)
                if(!user){
                    console.log("false");
                    return next(new response(req , res  , 'old user' , 200 , null , {isExist:false,user:null}))   
                }
                user.verificationStatus=1
                user.firstName=firstName,
                user.lastName=lastName,
                user.gender=gender,
                user.liveStatus=liveStatus,
                user.fullName=`${firstName} ${lastName}`
                user.identitySeri=identificationSeri,
                user.nationalCode= req.params.nationalCode,
                user.identityNumber=identificationNo,
                user.identitySerial=identificationSerial,
                user.fatherName=fatherName,
                user.officeName=officeName
                
                let updatedUser = await queryRunner.manager.save(user)
                
                await queryRunner.commitTransaction()
                const newUSer = await this.userRepository.findOne({where:{phoneNumber:req.params.phoneNumber} , relations : ['wallet']})
                console.log("true");
                console.log("userrr after updating >>>>" , newUSer);
                return next(new response(req, res, 'old user', 200, null, { isExist: true, updatedUser }))                            
            } catch (error) {
                console.log('error>>>>' , error)
                await queryRunner.rollbackTransaction()                
                return next(new response(req, res, 'old user', 500, `${error}` , null))
            }finally{
                console.log('release transAction')
                await queryRunner.release()
            }
            
        }
    







}


