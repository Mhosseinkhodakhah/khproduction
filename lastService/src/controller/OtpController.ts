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
 

export class OtpController {
    private otpRepository  = AppDataSource.getRepository(Otp)
    private userRepository  = AppDataSource.getRepository(User)
    private jwtService = new JwtService()
    private smsService = new SmsService()
    private loggerService =new logger()
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
                await this.loggerService.addNewLog({firstName : '' , lastName : '' , phoneNumber : phoneNumber} , 'otp sms' , `getting otp code succeed for user : ${phoneNumber}` , otpExist , 1) 
                monitor.addStatus({
                    scope: 'otp controller controller',
                    status: 1,
                    error: null
                })
                
                response.status(200).json({ msg: res.msg });
            } else {
                await this.loggerService.addNewLog({firstName : '' , lastName : '' , phoneNumber : phoneNumber} , 'otp sms' , `getting otp code failed for user : ${phoneNumber}` , {
                    statusCode : 500,
                    error : 'kavenegar error . . .',
                    msg : res.msg
                } , 0) 
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
            await this.loggerService.addNewLog({firstName : '' , lastName : '' , phoneNumber : phoneNumber} , 'otp sms' , `getting otp code failed for user : ${phoneNumber}` , {
                statusCode : 500,
                error : 'internal error . . .',
                msg : `${error}`
            } , 0) 
            return response.status(500).json({ msg: "خطای داخلی سیستم" });
        }
    }

    async checkOtpVerification(request: Request, response: Response, next: NextFunction) {
        const { phoneNumber, otp } = request.body;
            if (!phoneNumber || !otp) {
                await this.loggerService.addNewLog({ firstName: '', lastName: '', phoneNumber: phoneNumber }, 'otp sms', `getting otp code failed for user : ${phoneNumber}`, {
                    statusCode: 400,
                    error: 'bad request',
                    msg: `Phone number and OTP are required`
                }, 0) 
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
