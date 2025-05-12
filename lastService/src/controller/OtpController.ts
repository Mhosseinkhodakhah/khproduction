import { NextFunction, Request, Response } from "express"
import { AppDataSource } from "../data-source"
import { Otp } from "../entity/Otp"
import { User } from "../entity/User"
import { VerificationStatus } from "../entity/enums/VerificationStatus"
import { JwtService } from "../services/jwt-service/jwt-service"
const  Kavenegar = require('kavenegar')
import azios from "axios"
import { SmsService } from "../services/sms-service/message-service"
import logger from "../services/interservice/logg.service"
import monitor from "../util/statusMonitor"
import { internalDB } from "../services/selfDB/saveDATA.service"
import { trackIdInterface } from "../interfaces/interface.interface"
import axios from "axios"
import { NotMatch } from "../entity/notMatch"
import { redisCache } from "../services/redis.service"


export class OtpController {
    private otpRepository  = AppDataSource.getRepository(Otp)
    private userRepository  = AppDataSource.getRepository(User)
    private notMatchRepo  = AppDataSource.getRepository(NotMatch)
    private jwtService = new JwtService()
    private smsService = new SmsService()
    private loggerService =new logger()
    private redis = new redisCache()

    async getToken() {
        let authUrl = process.env.AUTH_URL
        try {
            let res = await axios.post(authUrl, { username: "TLS_khanetalla", password: "1M@k8|H43O9S" })
            let token = `Bearer ${res.data.access_token}`
            console.log(res?.headers)
            return token

        } catch (error) {
            console.log(error?.response?.headers)
            // monitor.error.push(`error in get token shahkar :: ${error.response}`)
            monitor.error.push(`error in get token shahkar :: ${error}`)
            console.log("error in getToken ShahkarController   " + error);
            return null
        }
    }
    
    async checkMatchOfPhoneAndNationalCode(body) {
        let { phoneNumber, nationalCode } = body
        let checkMatchationUrl = process.env.SHAHKAR_BASE_URL + '/istelamshahkar'
        let isMatch = false
        let token = await this.getToken()
        if (token == null || token == undefined) {
            console.log('token is not defined....')
            return 'noToken'
        }
        try {
            let res = await axios.post(checkMatchationUrl, {
                mobileNumber: phoneNumber
                , nationalCode
            }, { headers: { 'Authorization': token } })

            isMatch = res.data.isMatched ? true : false

            if (isMatch) {
                let trackIdData: trackIdInterface = {
                    trackId: res.headers['track-code'],
                    // firstName : firstName,
                    // lastName : lastName,
                    // fatherName : fatherName,
                    phoneNumber: phoneNumber,
                    status: true
                }
                let trackIdService = new internalDB()
                let DBStatus = await trackIdService.saveData(trackIdData)
                // console.log('returned db status>>>>', DBStatus)
                return isMatch
            } else {
                let trackIdData: trackIdInterface = {
                    trackId: res.headers['track-code'],
                    // firstName : firstName,
                    // lastName : lastName,
                    // fatherName : fatherName,
                    phoneNumber: phoneNumber,
                    status: false
                }
                let trackIdService = new internalDB()
                let DBStatus = await trackIdService.saveData(trackIdData)
                // console.log('returned db status>>>>', DBStatus)
                return isMatch
            }
        } catch (error) {
            monitor.error.push(`error in check phone and national code of userssss ` + error.response.data.message)
            console.log('error>>>>>', error)
            if (error.response.headers['track-code']) {
                let trackIdData: trackIdInterface = {
                    trackId: error.response.headers['track-code'],
                    // firstName : firstName,
                    // lastName : lastName,
                    // fatherName : fatherName,
                    phoneNumber: phoneNumber,
                    status: false
                }
                let trackIdService = new internalDB()
                let DBStatus = await trackIdService.saveData(trackIdData)
                // console.log('data base saver result>>>', DBStatus)
                if (+error.response.status >= 500) {
                    return 500
                }
            }
            // console.log('error in ismatch national code', `${error}`)
            return 'unknown'
        }
    }


    async sendOtpMessage(request: Request, response: Response, next: NextFunction) {
        let {phoneNumber} = request.body
        try {
            let otp = this.generateOTP(4);
            console.log('find the body' , phoneNumber)
            console.log('code ,' , otp)
            const otpExist = await this.otpRepository.findOne({where : {
                phoneNumber : phoneNumber
            }});
            console.log('otpExisttttttt' , otpExist)
            // console.log('time' , ((new Date().getTime())-(+otpExist.time)))
            // console.log(parseInt(otpExist.time))
            // console.log()
            // if (otpExist && ((new Date().getTime())-(+otpExist.time)) < 110*1000){
            //     return response.status(429).json({msg : "لطفا پس از چند ثانیه دوباره تلاش کنید "})
            // }
            let res : any = await this.smsService.sendOtpMessage(phoneNumber , otp);                // Await the response
            // console.log('res from code sender' , res)            
            if (res.success) {
                if (otpExist) {
                    console.log('otp existtt')
                    otpExist.time = new Date().getTime().toString();
                    otpExist.otp = otp;
                    let saved = await this.otpRepository.save(otpExist);
                    console.log('saved transActions' , saved)
                } else {
                    let createdOtp = this.otpRepository.create({ otp, phoneNumber, time: new Date().getTime().toString()});
                    console.log('created>>>' , createdOtp)
                    let saved =  await this.otpRepository.save(createdOtp);
                    console.log('saved transActions2222' , saved)
                }
                response.status(200).json({ msg: res.msg });
            } else {
                monitor.addStatus({
                    scope: 'otp  controller',
                    status: 0,
                    error: `${res.msg}`
                })
    
                return response.status(500).json({ msg: res.msg });
            }
        } catch (error) {
            console.log(error);
            monitor.addStatus({
                scope: 'otp  controller',
                status: 0,
                error: `${error}`
            })
            return response.status(500).json({ msg: "خطای داخلی سیستم" });
        }
    }

    async checkOtpVerification(request: Request, response: Response, next: NextFunction) {
        const { phoneNumber, otp } = request.body;
            if (!phoneNumber || !otp) {
                monitor.addStatus({
                    scope: 'otp controller',
                    status: 0,
                    error: `مقادیر لازم را وارد کنید`
                })
            return response.status(400).json({ msg: 'Phone number and OTP are required' });
        }
        try {
            const foundUserOtp = await this.otpRepository.findOneByOrFail({ phoneNumber });
            console.log('founded user otp' , foundUserOtp)
            const currentTime = new Date();
            const otpCreationTime = foundUserOtp.time; 
            const otpExpirationTime = new Date(+otpCreationTime + 2 * 60 * 1000); 
            // console.log()
            if (currentTime > otpExpirationTime) {
                // await this.otpRepository.delete({ phoneNumber });
                monitor.addStatus({
                    scope: 'otp controller',
                    status: 0,
                    error: `کد وارد شده منقضی شده است`
                })
                return response.status(400).json({ msg: 'کد تایید منقضی شده است ' });
            }
    
            if (foundUserOtp.otp !== otp) {
                monitor.addStatus({
                    scope: 'otp controller',
                    status: 0,
                    error: `کد وارد شده نادرست است`
                })

                return response.status(400).json({ msg: 'کد تایید صحیح نیست .لطفا دوباه تلاش کنید.' });
            }
            
            const user = await this.userRepository.findOneBy({ phoneNumber });
            if (!user || user.verificationStatus !== VerificationStatus.SUCCESS) {
                // await this.otpRepository.delete({ phoneNumber });
                monitor.addStatus({
                    scope: 'otp controller',
                    status: 1,
                    error: null
                })
                return response.status(200).json({ 
                    msg: 'با موفقیت وارد شدید', 
                    userVerificationStatus: "FAILED" 
                });
            }
            
            
            const token = await this.jwtService.generateToken(user);
            // await this.otpRepository.delete({ phoneNumber });
            
            monitor.addStatus({
                scope: 'otp controller',
                status: 1,
                error: null
            })

            // let isNotMatch = await this.notMatchRepo.exists({where : {nationalCode : user.nationalCode}})
            // if (!isNotMatch){
            //     let isMatch = await this.checkMatchOfPhoneAndNationalCode({ phoneNumber : user.phoneNumber , nationalCode : user.nationalCode})
            //     try {
            //         if (isMatch == false){
            //             console.log('isMatch is false',isMatch)
            //             let isNotMatch = await this.notMatchRepo.exists({where : {nationalCode : user.nationalCode}})
            //             if (isNotMatch){
            //                 console.log('isNotMatch exist >>>>')
            //             }else{
            //                 let newNotMatch = this.notMatchRepo.create({
            //                     firstName : user.firstName,
            //                     lastName : user.lastName,
            //                     phoneNumber : user.phoneNumber,
            //                     nationalCode : user.nationalCode
            //                 })
            //                 let addIsNOtMatch = await this.notMatchRepo.save(newNotMatch)
            //                 console.log('saved to database >>>>>>>>>>>>' , addIsNOtMatch)
            //             }
            //         }
            //     } catch (error) {
            //         console.log(error)
            //     }
            // }
            let actions= `\u202Bکاربر با شماره تلفن ${phoneNumber} وارد اپلیکیشن شد\u202C`
            await this.loggerService.addNewLog({firstName : '' , lastName : '' , phoneNumber : phoneNumber} , 'ورود کاربر' , actions , {type : 8} , 1) 
            monitor.addStatus({
                scope: 'otp controller controller',
                status: 1,
                error: null
            })

            /// its for setting loging user
            process.nextTick(async() => {
                this.redis.setter(`login-${user.phoneNumber}`, request.headers['x-real-ip'])
                let xx = await this.redis.getter(`login-${user.id}`)
                console.log('after getting cache in redis' , xx)
            })
            return response.status(200).json({ 
                token, 
                msg: 'با موفقیت وارد شدید', 
                userVerificationStatus: "SUCCESS" 
            });
    
        } catch (error) {
            monitor.addStatus({
                scope: 'otp controller',
                status: 0,
                error:`${error}`
            })
            console.error('Error in OTP verification:', error);
            return response.status(500).json({ msg: 'An error occurred during verification' });
        }
    }
    async clearOtpTable(request: Request, response: Response, next: NextFunction){
        try {
            this.otpRepository.delete({})
            response.json("ok")
        } catch (error) {
            response.status(500).json("error")
        }
    }
    generateOTP(limit) {          
        var digits = '0123456789';
        let OTP = '';
        for (let i = 0; i < limit; i++ ) {
            OTP += digits[Math.floor(Math.random() * 10)];
        }
        return OTP;
    }
    
}
