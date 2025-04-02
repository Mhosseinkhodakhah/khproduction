import { NextFunction, Request, Response } from "express"
import  axios from 'axios'
import { config } from "dotenv";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";
import { VerificationStatus } from "../entity/enums/VerificationStatus";
import { JwtService } from "../services/jwt-service/jwt-service";
import { Wallet } from "../entity/Wallet";
import { SmsService } from "../services/sms-service/message-service";
import { trackIdInterface } from "../interfaces/interface.interface";
import { internalDB } from "../services/selfDB/saveDATA.service";
import monitor from "../util/statusMonitor";
config();
export class ShahkarController {
    private userRepository  = AppDataSource.getRepository(User)
    private jwtService = new JwtService()
    private walletRepository = AppDataSource.getRepository(Wallet)
    private smsService = new SmsService()


    async checkMatchOfPhoneAndNationalCode(request: Request, response: Response, next: NextFunction) {
        let {phoneNumber,nationalCode} = request.body
        let checkMatchationUrl = process.env.SHAHKAR_BASE_URL + '/istelamshahkar'
        let isMatch = false
        let token = await this.getToken()
        if (token == null || token == undefined) {
            monitor.addStatus({
                scope: 'shahkar controller',
                status: 0,
                error: 'error from get token in shahkar get token checkMatchOfPhoneAndNationalCode endPoint'
            })
            return response.status(500).json({ err : "error get token from server"} )
        }
        axios.post(checkMatchationUrl , {mobileNumber : phoneNumber
             , nationalCode} , {headers : { 'Authorization' : token }}).then(async(res)=>{
            isMatch  = res.data.isMatched ? true : false 
            if (isMatch) {
                let trackIdData : trackIdInterface = {
                    trackId : res.headers['track-code'],
                    // firstName : firstName,
                    // lastName : lastName,
                    // fatherName : fatherName,
                    phoneNumber : phoneNumber,
                    status : true
                }
                let trackIdService = new internalDB()
                let DBStatus = await trackIdService.saveData(trackIdData)
                console.log('returned db status>>>>' , DBStatus)
                monitor.addStatus({
                    scope: 'shahkar controller',
                    status: 1,
                    error: null
                })
                return response.json({ isMatch , msg : "number and national code matched successfully"})                
            }else{
                let trackIdData : trackIdInterface = {
                    trackId : res.headers['track-code'],
                    // firstName : firstName,
                    // lastName : lastName,
                    // fatherName : fatherName,
                    phoneNumber : phoneNumber,
                    status : false
                }
                let trackIdService = new internalDB()
                let DBStatus = await trackIdService.saveData(trackIdData)
                console.log('returned db status>>>>' , DBStatus)
                monitor.addStatus({
                    scope: 'shahkar controller',
                    status: 0,
                    error: `there is no match between number and national code`
                })
                return  response.status(404).json({ isMatch , msg : "there is no match between number and national code"})
            }
                
        }).catch((err)=>{
            monitor.addStatus({
                scope: 'shahkar controller',
                status: 0,
                error: `${err}`
            })
            return  response.status(500).json({ err : err.message , msg : "there is an error "} )
        })
    }

    async identityInformationOfUser(request: Request, response: Response, next: NextFunction){
        let {phoneNumber ,birthDate ,nationalCode} = request.body
        let identityInfoUrl = process.env.IDENTITY_INFO_URL 
        if (nationalCode) { 
            let user = await this.userRepository.findOneBy({nationalCode})
            if (user) {
                monitor.addStatus({
                    scope: 'shahkar controller',
                    status: 0,
                    error: `کاربر قبلا با شماره دیگری ثبت نام کرده`
                })
               return  response.status(500).json({msg : "کاربر قبلا با شماره دیگری در سامانه خانه طلا ثبت نام کرده است"})
            }
        }
        let shahkarToken = await this.getToken()
        if (shahkarToken == null || shahkarToken == undefined) {
            monitor.addStatus({
                scope: 'shahkar controller',
                status: 0,
                error: `error from get token in shahkar get token identityInformationOfUser endPoint`
            })
            return response.status(500).json({ err : "error get token from server"} )
        }else{
        let body = {birthDate : birthDate , nationalCode : nationalCode}
        try {
            let res = await axios.post(identityInfoUrl , body , {headers : { 'Authorization' : shahkarToken }})
            let info  = res.data 
            // console.log('trach code . . .',res.headers['track-code'])
            console.log('shahkar info>>>>' , res)
            if(res.status == 200){
                let  {
                    firstName,
                    lastName,
                    gender,
                    liveStatus,
                    identificationNo,
                    fatherName,
                    identificationSerial,
                    identificationSeri,
                    officeName,
                  } = info
                let user = this.userRepository.create({
                    fatherName,
                    identityTraceCode : res.headers['track-code'],
                    gender:(gender == 0) ? false : true
                    ,officeName,
                    birthDate,
                    identityNumber : identificationNo,
                    identitySeri : identificationSeri,
                    identitySerial: identificationSerial,
                    firstName,lastName,phoneNumber,nationalCode,liveStatus,
                    verificationStatus : VerificationStatus.SUCCESS
                })
                let savedUser = await  this.userRepository.save(user)
                console.log(savedUser)
                const wallet = this.walletRepository.create({
                    balance: 0, 
                    goldWeight: 0, 
                    user: savedUser,
                });
                await this.walletRepository.save(wallet)
                let token =await this.jwtService.generateToken(savedUser)
                let trackIdData : trackIdInterface = {
                    trackId : res.headers['track-code'],
                    firstName : firstName,
                    lastName : lastName,
                    fatherName : fatherName,
                    phoneNumber : phoneNumber,
                    status : true
                }
                let trackIdService = new internalDB()
                let DBStatus = await trackIdService.saveData(trackIdData)
                console.log('returned db status>>>>' , DBStatus)
                // let nameFamily = firstName + ' ' + lastName
                this.smsService.sendGeneralMessage(wallet.user.phoneNumber,"identify" ,firstName ,null ,null)
                
                monitor.addStatus({
                    scope: 'shahkar controller',
                    status: 1,
                    error: null
                })
                return response.json({ user :savedUser , msg : "ثبت نام شما با موفقیت انجام شد", token})    

            }else if(res.status == 400){
                console.log('track id>>>>' , res.headers['track-code'])
                let trackIdData : trackIdInterface = {
                    trackId : res.headers['track-code'],
                    // firstName : firstName,
                    // lastName : lastName,
                    // fatherName : fatherName,
                    phoneNumber : phoneNumber,
                    status : false
                }
                let trackIdService = new internalDB()
                let DBStatus = await trackIdService.saveData(trackIdData)
                console.log('returned db status>>>>' , DBStatus)
                
                monitor.addStatus({
                    scope: 'shahkar controller',
                    status: 0,
                    error: 'خطا در احراز هویت کاربر در اند پوینت شاهکار'
                })
                return response.status(500).json({ err : res.data.details , msg : "خطا در احراز هویت کاربر"} )            
            }
        } catch (error) {
            // console.log(error.response.data.error);
            console.log(error)

            monitor.addStatus({
                scope: 'shahkar controller',
                status: 0,
                error: `${error}`
            })
            let trackIdData : trackIdInterface = {
                trackId : error.response.headers['track-code'],
                // firstName : firstName,
                // lastName : lastName,
                // fatherName : fatherName,
                phoneNumber : phoneNumber,
                status : false
            }
            let trackIdService = new internalDB()
            let DBStatus = await trackIdService.saveData(trackIdData)
            console.log('data base saver result>>>' , DBStatus)
            return response.status(500).json({ msg : "خطای داخلی سیستم"})           
        }     
        }
                
    }

    async checkMatchPhoneNumberAndCartNumber(info){
        try {
            const username = 'khanetala_pigsb'; 
            const password = 'Ttb@78f7hLR'; 
            
            const credentials = `${username}:${password}`;
            const base64Credentials = Buffer.from(credentials).toString('base64');   
            const authHeader = `Basic ${base64Credentials}`;
            const url = 'https://op2.pgsb.ir/NoavaranSP4/CardBirthDate';
            const headers = {
                'Accept-Language': 'fa',
                'CLIENT-DEVICE-ID': '',
                'CLIENT-IP-ADDRESS': '',
                'CLIENT-USER-AGENT': 'User Agent',
                'CLIENT-USER-ID': '09120000000',
                'CLIENT-PLATFORM-TYPE': 'WEB',
                'Content-Type': 'application/json',
                'Cookie': 'cookiesession1=678B2889F7A5EFE5780B165D4D6783F0;',
                'Authorization': authHeader 
            };
            
            const data = {
                card_number: info.cardNumber,
                national_code: info.nationalCode,
                birth_date: info.birthDate
            };
            let response = await axios.post(url, data, { headers }) 
              if(response.status == 200){
                if (response.data) {
                    return response.data.match
                }
              }  else{
                return false
              }
        } catch (error) {
            monitor.error.push(`${error}`)
            console.log("error in checkMatchPhoneNumberAndCartNumber" , error);
            return false
        }
    }
    async convertCardToSheba(cardNumber){
        try {
            let body = {
                cardNumber
            }
            let url = "https://drapi.ir/rest/api/main/convertCardToSheba/v1.0/convertcardtosheba"
            let shahkarToken = await this.getToken()
            let res = await axios.post(url,body, {headers : { 'Authorization' : shahkarToken }})
            if(res.status == 200){
                return res.data
            }else{
                return null
            }
        } catch (error) {
            monitor.error.push(`${error}`)
            console.log('error in convert to sheba' , error.message);
            return null
        }
    }

    async getToken(){
        let authUrl = process.env.AUTH_URL
        try {
            let res =  await axios.post(authUrl,{username: "TLS_khanetalla",password: "1M@k8|H43O9S"})
            let token = `Bearer ${res.data.access_token}`
            return token
            
        } catch (error) {
            monitor.error.push(`${error}`)
            console.log("error in getToken ShahkarController   " + error);
            return null
        }
    } 
}