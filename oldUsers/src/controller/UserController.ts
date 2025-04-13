import { AppDataSource } from "../data-source"
import {LastService} from "../services/intrnal-service/lastService-serivce"
import { ShahkarService } from "../services/shahkar-service/shahkar-service"
import { OtpSerivce } from "../services/otp-service/otp-service"
import { NextFunction, Request, Response } from "express"
import { User } from "../entity/User"
import { oldInvoice } from "../entity/oldInvoice"
import {v4 as uuidv4} from 'uuid';
import { WalletTransaction } from "../entity/WalletTransaction"
import { Wallet } from "../entity/wallet"
import { VerificationStatus } from "../entity/enums/VerificationStatus"
import fs from 'fs'
import analyzor from "../../data.analyze"
import { response } from "../responseModel/response.model";
import { start } from "repl"
import { validationResult } from "express-validator"
import { internalDB } from "../selfDB/saveDATA.service"
import { Like } from "typeorm"

export class UserController {

    private userRepository = AppDataSource.getRepository(User)
    private invoiceRepository = AppDataSource.getRepository(oldInvoice)
    private transActionRepository = AppDataSource.getRepository(WalletTransaction)
    private walletRepository = AppDataSource.getRepository(Wallet)
    private lastServiceService=new LastService()
    private shakarService=new ShahkarService()
    private otpService=new OtpSerivce()
    // private saveData = new internalDB()
    

    /**
     * get all users
     * @param req 
     * @param res 
     * @param next 
     * @returns 
     */
    async getAllOldUsers(req: Request, res: Response, next: NextFunction){
        let data = await this.walletRepository.find({relations : ['user'],take:100})
        // for (let i =0 ; i < data2.length ; i++){
        //     await this.walletRepository.remove(data2[i])
        // }
        return res.status(200).json(data)
    }

    /**
     * get one user from old user
     * @param req 
     * @param res 
     * @param next 
     * @returns 
     */
    async getOneUser(req: Request, res: Response, next: NextFunction){
        let userId: number = +req.params.id
        let user = await this.userRepository.findOne({
            where: {
                id: userId
            }
        })
        if(!user){
            return next(new response(req, res, 'get one user', 404, "کاربر پیدا نشد",null))
        }
        return next(new response(req, res, 'get one user', 200, null,user))
    } 
    

    /**
     * this function is for checking the user verification of identity 
     * @param req 
     * @param res
     * @param next 
     * @returns 
     */
    async checkIdentity(req: Request, res: Response, next: NextFunction) {
        const {phoneNumber}=req.body
        const resultFromLastService=await this.lastServiceService.checkExistUserInLastService(phoneNumber)
        try{ let user = await this.userRepository.findOne({
            where: {
                phoneNumber
            }
        })
        if(resultFromLastService.exist){
            return next(new response(req, res, 'checkIdentity', 200, null, {userExist:true, userVerified: true ,user:resultFromLastService.user}))
        }else{
            return next(new response(req, res, 'checkIdentity', 200, null, {userExist:false, userVerified: false ,user:{}}))
            // if(user){
            //     return next(new response(req, res, 'checkIdentity', 200, null, {userExist:true,userVerified: false ,user:user }))

            // }else{

            //     return next(new response(req, res, 'checkIdentity', 200, null, {userExist:false, userVerified: false,user:{}}))
            // }
        }
        
    }
    catch(err){
            console.log(err);
            return next(new response(req, res, 'checkIdentity', 500 , 'مشکل داخلی سرویس یوزر' , null))
        }
    }


    /**
     * 
     * @param req send otp and check it in approve
     * @param res 
     * @param next 
     */

    async sendOtpForApprove(req: Request, res: Response, next: NextFunction){
          const phoneNumber=req.params.phone
          try{
            const otpSendSmsStatus=await this.otpService.sendOtpMessage(phoneNumber)
            if(!otpSendSmsStatus.success){
              return next(new response(req, res, 'send otp for approve', 500 , otpSendSmsStatus.msg , null)) 
            }else{
              return next(new response(req, res, 'send otp for approve', 200 , null , otpSendSmsStatus.msg)) 
            }
          }catch(err){
            return next(new response(req, res, 'checkIdentity', 500 , 'مشکل داخلی سرویس یوزر' , null))
          }
         
    }

    /**
     * this function is for geting all old users with their relations
     * @param req 
     * @param res 
     * @param next 
     * @returns 
     */
    async getAllUsersByAdmin(req: Request, res: Response, next: NextFunction) {
        const page = parseInt(req.params.page) || 1; 
        const pageSize =parseInt(req.params.size) || 100;
        let totalItem = await this.userRepository.count({where : {
            verificationStatus : 2
        }})
        const users = await this.userRepository.find({
            where: {
                verificationStatus: 2
            },
            relations: ['wallet', 'sells', 'buys'],
            take: pageSize,  
            skip: (page - 1) * pageSize 
        });
        console.log( 'tedad users', users.length)
        return next(new response(req, res, 'get all users', 200, null, {users , totalItem}))
    }


    async all(req: Request, res: Response, next: NextFunction) {
        // const page = parseInt(req.params.page) || 1; 
        // const pageSize =parseInt(req.params.size) || 100;
        
        const users = await this.userRepository.find({
            where: {
                verificationStatus: 2
            },
            relations: ['wallet', 'sells', 'buys'],
            take: 100,
        });
        return next(new response(req, res, 'get all users', 200, null, users))
    }

    /**
     * this function is for creating the invoice of buy
     * @param req 
     * @param res 
     * @param next 
     * @returns 
     */
    async createInvoice(req: Request, res: Response, next: NextFunction){
        let invoiceBody : {goldWeight : number , goldPrice : number , totalPrice : number , phoneNumber : string} = req.body;
        let phoneNumber = invoiceBody.phoneNumber;
        let user = await this.userRepository.findOne({where : {
            phoneNumber : invoiceBody.phoneNumber
        }})
        delete invoiceBody.phoneNumber;
        let invoiceNumber = uuidv4();
        let newInvoice = this.invoiceRepository.create(invoiceBody)
        newInvoice.buyer = user;
        newInvoice.invoiceNumber = invoiceNumber;
        let invoice = await this.invoiceRepository.save(newInvoice)
        // now it needs to send sms to user for creating a invoice
        return next(new response(req, res, 'create new invoice', 200, null, invoice))
    }


    /**
     * this function is for creating the transAction
     * @param req 
     * @param res 
     * @param next 
     * @returns 
     */
    async createTransAction(req: Request, res: Response, next: NextFunction) {
        let transactionBody: {
            type: string,
            description: string,
            amount: number
        } = req.body;
        let transActionEntity = this.transActionRepository.create(transactionBody)
        let transAction = await this.transActionRepository.save(transActionEntity)
        return next(new response(req, res, 'create new transaction', 200, null, transAction))
    }


    async clean(request: Request, response: Response, next: NextFunction){
        let users = await this.userRepository.find({relations : ['wallet']})
        // users.forEach(async(elem)=>{
        //     await this.userRepository.remove(elem)
        // })
        let wallet = await this.walletRepository.find()
        // wallet.forEach(async(elem)=>{
        //     await this.walletRepository.remove(elem)
        // })
        console.log(await this.userRepository.find())
        console.log(await this.walletRepository.find())
        return response.status(200).json({users , wallet})
    }


    async script(request: Request, response: Response, next: NextFunction){
        let users = await this.userRepository.find({relations : ['wallet']})
        console.log('userssss>>>>' , users)
        users.forEach(async(elem)=>{
            await this.userRepository.remove(elem)
        })
        let wallet = await this.walletRepository.find()
        wallet.forEach(async(elem)=>{
            await this.walletRepository.remove(elem)
        })   
        let saver = new analyzor()
        console.log(await saver.startProcess())
        let users2 = await this.userRepository.find({relations : ['wallet']})
        return response.status(200).json(users)
    }


    /**
     * approve old user and create in lastService 
     * 1-check match phone and nationalcode
     * 2-check birth day and nationalcode 
     * 3-create in last service
     * @param req 
     * @param res 
     * @param next 
     * @returns 
     */
    async approveOldUser(req: Request, res: Response, next: NextFunction){
        console.log("approve old user");
        
        const bodyError = validationResult(req)
        if (!bodyError.isEmpty()) {
            return next(new response(req, res, 'approve old user', 400, bodyError['errors'][0].msg, null))
        }   
        const userId=+req.params.id
        let {phoneNumber ,birthDate ,nationalCode,otp} = req.body

        try{
        // const otpResult= await this.otpService.checkOtpVerification(phoneNumber,otp)  
        // if(!otpResult.success){
        //     return next(new response(req, res, 'approve old user', 400,otpResult.msg, null))
        // } 
        let user = await this.userRepository.findOne({
            where: {
                id: userId
            },
            relations:["wallet"]
        })
        if(!user){
            return next(new response(req, res, 'approve old user', 400, "کاربر پیدا نشد", null))
        }
        if (user.verificationStatus==1) {
            return next(new response(req, res, 'approve old user', 400, "کاربر قبلا احراز شده است", user))
        }
             
        const resultMatch=await this.shakarService.checkMatchOfPhoneAndNationalCode({phoneNumber,nationalCode})        
        if (resultMatch == 'noToken'){
            console.log('111')
            return res.status(400).json({ msg: 'سیستم احراز هویت موقتا در دسترس نمیباشد.لطفا دقایقی دیگر مجددا تلاش کنید.' })
        }
        
        if (resultMatch == 'unknown'){
            console.log('222')
            return res.status(400).json({ msg: 'مشکلی در در احراز هویت بوجود آمده است.لطفا دقایقی دیگر مجددا تلاش کنید.' })
        }
        if (resultMatch == 500){
            console.log('333')
            return res.status(400).json({ msg: 'سیستم احراز هویت موقتا در دسترس نمیباشد.لطفا دقایقی دیگر مجددا تلاش کنید.' })
        }

        if (resultMatch == false) {
            console.log('444')
            return res.status(400).json({ msg: 'شماره تلفن با شماره ملی مطابقت ندارد' })
        }
        const userInfo=await this.shakarService.identityInformationOfUser(phoneNumber,birthDate,nationalCode)
        
        if(!userInfo){
            return next(new response(req, res, 'approve old user', 400, " مشکلی در استعلام اطلاعات کاربر رخ داده است لطفا از درست بودن اطلاعات اطمینان حاصل کنید", null))
        }
        user.fatherName=userInfo.fatherName,
        user.gender=userInfo.gender
        user.officeName=userInfo.officeName
        user.birthDate=userInfo.birthDate
        user.identityNumber=userInfo.identityNumber
        user.identitySeri=userInfo.identitySeri
        user.identitySerial=userInfo.identitySerial
        user.firstName=userInfo.firstName
        user.lastName=userInfo.lastName
        user.nationalCode=userInfo.nationalCode
        user.phoneNumber=phoneNumber
        user.liveStatus=userInfo.liveStatus
        user.verificationStatus=userInfo.verificationStatus
        user.identityTraceCode=userInfo.identityTraceCode
        user.fullName=`${userInfo.firstName} ${userInfo.lastName}`

        await this.userRepository.save(user)

        delete user.id
        delete user.wallet.id
        const result=await  this.lastServiceService.sendUserDataToMainService(user)
        if(!result.data){
            console.log("resulttttttt",result.response.status);
            console.log("resulttttttt",result.response.data.error);
            user.verificationStatus=2
            await this.userRepository.save(user)
            return next(new response(req, res, 'approve old user',result.response.status,result.response.data.error, null))
        }
        //! internalRequest 
        delete user.identityTraceCode
        return next(new response(req, res, 'approve old user', 200, null,result.data.data))
        }catch(err){
           
            console.log("errr",err);
            return next(new response(req, res, 'approve old user', 500 , 'مشکل داخلی سرویس یوزر' , null))
        }
    }

     
    /**
     * create and approve for user not exist in olduser and lastservice user
     * @param req 
     * @param res 
     * @param next 
     * @returns 
     */
    async approveNewUser(req: Request, res: Response, next: NextFunction){
        console.log("approve new user");
        
        const bodyError = validationResult(req)
        if (!bodyError.isEmpty()) {
            return next(new response(req, res, 'approve new user', 400, bodyError['errors'][0].msg, null))
        }
        let {phoneNumber ,birthDate ,nationalCode,otp} = req.body
        console.log(req.body);
        
        try{    
            // const otpResult= await this.otpService.checkOtpVerification(phoneNumber,otp)  
            // if(!otpResult.success){
            //     return next(new response(req, res,'approve new User', 400,otpResult.msg, null))
            // } 
            const exist = await this.userRepository.findOne({where:{phoneNumber}})
            if(exist){

                return next(new response(req, res, 'approve new User', 400, "کاربر در سیستم وجود دارد", exist))
            }

            const resultMatch=await this.shakarService.checkMatchOfPhoneAndNationalCode({phoneNumber,nationalCode})        
            
            if (resultMatch == 'unknown') {
                return res.status(500).json({ msg: 'خطای داخلی سیستم' })
            
            }
            if (resultMatch == 500) {
                return res.status(500).json({ msg: 'سیستم شاهکار موقتا در دسترس نمیباشد.لطفا دقایقی دیگر مجددا تلاش کنید.' })
            }

            if (resultMatch == false) {
                return res.status(400).json({ msg: 'شماره تلفن با شماره ملی مطابقت ندارد' })
            }


            console.log("after Is Match");
    
            const userInfo=await this.shakarService.identityInformationOfUser(phoneNumber,birthDate,nationalCode)
            if(!userInfo){
                return next(new response(req, res, 'approve new user', 400, " مشکلی در استعلام اطلاعات کاربر رخ داده است لطفا از درست بودن اطلاعات اطمینان حاصل کنید", null))
            }

            console.log("after get user info");
            
            let wallet = this.walletRepository.create({ goldWeight:0,balance:0})
            const user= this.userRepository.create({
                fatherName:userInfo.fatherName,
                gender:userInfo.gender,
                officeName:userInfo.officeName,
                birthDate:userInfo.birthDate,
                identityNumber:userInfo.identityNumber,
                identitySeri:userInfo.identitySeri,
                identitySerial:userInfo.identitySerial,
                firstName:userInfo.firstName,
                lastName:userInfo.lastName,
                nationalCode:userInfo.nationalCode,
                phoneNumber:phoneNumber,
                liveStatus:userInfo.liveStatus,
                verificationStatus:userInfo.verificationStatus,
                verificationType:0,
                identityTraceCode:userInfo.identityTraceCode,
                fullName:`${userInfo.firstName} ${userInfo.lastName}`,
                wallet
            })
            
            
            console.log("after create in local data base");
            
            
            delete user.id
            delete user.wallet.id
            const result=await  this.lastServiceService.sendUserDataToMainService(user)
            
            console.log("after interservice");
            
            console.log("result", result);
            
            
            if(!result.data){
                console.log("here",result.data);
                user.verificationStatus=2
                await this.userRepository.save(user)
                return next(new response(req, res, 'approve new user',result.response.status,result.response.data.error, null))
            }
            //! internalRequest 
            delete user.identityTraceCode
            console.log("after every thing done");
            await this.userRepository.save(user)
            
            return next(new response(req, res, 'approve new user', 200, null, result.data.data))
           
        }catch(err){
            console.log("errr",err);
            return next(new response(req, res, 'approve new User', 500 , 'مشکل داخلی سرویس یوزر' , null))
        }
    }



    async delet(){
        let user = await this.userRepository.findOne({where : {phoneNumber : '09128704093'}})
        await this.userRepository.remove(user)
        return true
    }


    async search(req: Request, res: Response, next: NextFunction){
        
        let serachWord = req.params.search;
        console.log('query' , req.query.page , req.query.size)
        let reg = `%${serachWord}%`
        const page = req.query.page ? req.query.page : 1; 
        const pageSize =req.query.size ? req.query.size : 100;
        let totalItem = await this.userRepository.count({where : {
            verificationStatus : 2 , 
        }})

        let user = await this.userRepository.createQueryBuilder('user')
        .where('user.verificationStatus = :status  AND (user.firstName LIKE :search OR user.firstName LIKE :search OR user.lastName LIKE :search OR user.phoneNumber LIKE :search OR user.nationalCode LIKE :search)' , {status : 2 , search : reg})
        .take(+pageSize)
        .skip(+((+page - 1) * +pageSize))
        .getMany()
        // const users = await this.userRepository.find({
        //     where: {
        //         verificationStatus: 2 ,
            
        //     },
        //     relations: ['wallet', 'sells', 'buys'],
        //     take: pageSize,  
        //     skip: (page - 1) * pageSize 
        // });
        // console.log( 'tedad users', users.length)
        
        
        // console.log(req)

        // let all = await this.userRepository.find({where :[{
        //     firstName : Like(`%${serachWord}%`)
        // },{
        //     lastName : Like(`%${serachWord}%`)
        // },{
        //     phoneNumber : Like(`%${serachWord}%`)
        // } , {
        //     nationalCode : Like(`%${serachWord}%`)
        // }]})
        console.log('its here >>>' , user)
        return next(new response(req, res, 'get serach', 200 , null , {user , totalItem}))

    }
}