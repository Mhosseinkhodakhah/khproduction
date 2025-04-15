import { NextFunction, Request, Response } from "express"
import { AppDataSource } from "../../data-source"
import { Otp } from "../../entity/Otp"
import { User } from "../../entity/User"
import { VerificationStatus } from "../../entity/enums/VerificationStatus"
const  Kavenegar = require('kavenegar')
import azios from "axios"
import { SmsService } from "../sms-service/sms-service"
import logger from "../interservice/logg.service"
 

export class OtpSerivce {
    private otpRepository  = AppDataSource.getRepository(Otp)
    private userRepository  = AppDataSource.getRepository(User)
    private smsService = new SmsService()
    private loggerService=new logger()

    async sendOtpMessage(phoneNumber : string) {
        try {
            let otp = this.generateOTP(4);
            console.log('find the body' , phoneNumber)
            console.log('code ,' , otp)
            const otpExist = await this.otpRepository.findOne({where : {
                phoneNumber : phoneNumber
            }});
            console.log('otpExisttttttt' , otpExist)
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
                return {success:true,msg:res.msg}
            } else {
                await this.loggerService.addNewLog({firstName : '' , lastName : '' , phoneNumber : phoneNumber} , 'otp sms' , `getting otp code failed for user : ${phoneNumber}` , {
                    statusCode : 500,
                    error : 'kavenegar error . . .',
                    msg : res.msg
                } , 0) 
                return {success:false,msg:res.msg}
            }
        } catch (error) {
            console.log(error);
            await this.loggerService.addNewLog({firstName : '' , lastName : '' , phoneNumber : phoneNumber} , 'otp sms' , `getting otp code failed for user : ${phoneNumber}` , {
                statusCode : 500,
                error : 'internal error . . .',
                msg : `${error}`
            } , 0) 
            return {success:false,msg:'internal error . . .'}
        }
    }

    async checkOtpVerification(phoneNumber: string ,otp : string) {
        try {
            const foundUserOtp = await this.otpRepository.findOneByOrFail({ phoneNumber });
            console.log('founded user otp' , foundUserOtp)
            const currentTime = new Date();
            const otpCreationTime = foundUserOtp.time; 
            const otpExpirationTime = new Date(+otpCreationTime + 2 * 60 * 1000); 
            // console.log()
            if (currentTime > otpExpirationTime) {
                // await this.otpRepository.delete({ phoneNumber });
                return {success:false,msg:'کد تایید منقضی شده است '}
            }
    
            if (foundUserOtp.otp !== otp) {
                return {success:false,msg:'کد تایید صحیح نیست .لطفا دوباه تلاش کنید.'}
            }
            
            const user = await this.userRepository.findOneBy({ phoneNumber });
    
            if (!user || user.verificationStatus !== VerificationStatus.SUCCESS) {
                // await this.otpRepository.delete({ phoneNumber });
                return {success:true,msg:'با موفقیت وارد شدید'}
            }
            
            
            // await this.otpRepository.delete({ phoneNumber });
    
        } catch (error) {
            console.error('Error in OTP verification:', error);
            return {success:false,msg:'internal error . . .'}
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
