import { NextFunction, Request, Response } from "express"
import { AppDataSource } from "../data-source"
import { User } from "../entity/User"
import { Wallet } from "../entity/Wallet"
import { Invoice } from "../entity/Invoice"
import { WalletTransaction } from "../entity/WalletTransaction"
import { PaymentInfo } from "../entity/PaymentInfo"
import { Otp } from "../entity/Otp"
import { responseModel } from "../util/response.model"
import { SmsService } from "../services/sms-service/message-service"
import logger from "../services/interservice/logg.service"
import { InvoiceType } from "../entity/InvoiceType"
import axios from "axios"
import { VerificationStatus } from "../entity/enums/VerificationStatus"
import { trackIdInterface } from "../interfaces/interface.interface"
import { internalDB } from "../services/selfDB/saveDATA.service"
import { JwtService } from "../services/jwt-service/jwt-service"
import { query, validationResult } from "express-validator"
import monitor from "../util/statusMonitor"
import { EstimateTransactions } from "../entity/EstimateTransactions"
import { oldUserService } from "../services/oldUser.service"
import { estimatier } from "../util/estimate.util"



export default class inPersonController {
    
    private userRepository = AppDataSource.getRepository(User)
    private walletRepository = AppDataSource.getRepository(Wallet)
    private invoicesRepository = AppDataSource.getRepository(Invoice)
    private invoicesTypeRepository = AppDataSource.getRepository(InvoiceType)
    private walletTransActions = AppDataSource.getRepository(WalletTransaction)
    private walletTransactionRepository = AppDataSource.getRepository(WalletTransaction);
    private paymentInfoRepository = AppDataSource.getRepository(PaymentInfo);
    private otpRepository = AppDataSource.getRepository(Otp)
    private estimate = AppDataSource.getRepository(EstimateTransactions)
    private smsService = new SmsService()
    private interservice = new logger()
    private jwtService = new JwtService()
    private oldUserService = new oldUserService()
    private estimateWeight = new estimatier()
    

    // private async estimateWeight(goldWeight: number, type: number) {
    //     try {
    //         if (type == 0) {
    //             let month = new Date().toLocaleString('fa-IR').split(",")[0].split("/")[1]  
    //             console.log('monthhhhh' , month)
    //             let monthEstimate = await this.estimate.exists({where : {
    //                 month : month
    //             }})
    //             if (monthEstimate){
    //                 let exEstimate1 =  await this.estimate.findOne({where : {
    //                     month : month
    //                 }})
    //                 exEstimate1.soldGold = (parseFloat(((+exEstimate1.soldGold) + goldWeight).toFixed(3))).toString()
    //                 await this.estimate.save(exEstimate1)
    //             }else{
    //                 let newMonth = this.estimate.create({month : month , boughtGold : '0' , soldGold : ((goldWeight).toFixed(3)).toString()})
    //                 await this.estimate.save(newMonth)
    //             }
    //             let estimate2 = await this.estimate.exists({
    //                 where: {
    //                     date: new Date().toLocaleString("fa-IR").split(",")[0]
    //                 }
    //             })
    //             let totalEstimate = await this.estimate.findOne({
    //                 where: {
    //                     date: 'localDate'
    //                 }
    //             })
    //             totalEstimate.soldGold = (parseFloat(((+totalEstimate.soldGold) + goldWeight).toFixed(3))).toString()
    //             await this.estimate.save(totalEstimate)
    //             if (estimate2) {
    //                 let exEstimate = await this.estimate.findOne({
    //                     where: {
    //                         date: new Date().toLocaleString("fa-IR").split(",")[0]
    //                     }
    //                 })
    //                 exEstimate.soldGold = (parseFloat(((+exEstimate.soldGold) + goldWeight).toFixed(3))).toString()
    //                 await this.estimate.save(exEstimate)
    //             } else {
    //                 let estimate32 = this.estimate.create({
    //                     date: new Date().toLocaleString("fa-IR").split(",")[0],
    //                     boughtGold: '0', soldGold: (parseFloat(((goldWeight).toFixed(3))).toString())
    //                 })
    //                 let a = await this.estimate.save(estimate32)
    //                 console.log('sold Estimate>>>' , a)
    //             }
    //         }
    //         if (type == 1) {
    //             let month = new Date().toLocaleString('fa-IR').split(",")[0].split("/")[1]
    //             let monthEstimate = await this.estimate.exists({where : {
    //                 month : month
    //             }})
    //             console.log('month for creation' , monthEstimate)
                
    //             if (monthEstimate){
    //             console.log('month for creation 1')

    //                 let monthT = await this.estimate.findOne({where : {
    //                     month : month
    //                 }})
    //                 monthT.boughtGold = (parseFloat(((+monthT.boughtGold) + goldWeight).toFixed(3))).toString()
    //                 await this.estimate.save(monthT)
    //             }else{
    //             console.log('month for creation2')

    //                 let newMonth =  this.estimate.create({month : month , boughtGold : ((goldWeight).toFixed(3)).toString() , soldGold : '0'})
    //                 await this.estimate.save(newMonth)
    //             }
                
    //             let estimate2 = await this.estimate.exists({
    //                 where: {
    //                     date: new Date().toLocaleString("fa-IR").split(",")[0]
    //                 }
    //             })
    //             let totalEstimate = await this.estimate.findOne({
    //                 where: {
    //                     date: 'localDate'
    //                 }
    //             })
    //             totalEstimate.boughtGold = (parseFloat(((+totalEstimate.boughtGold) + goldWeight).toFixed(3))).toString()
    //             await this.estimate.save(totalEstimate)
    //             if (estimate2) {
    //                 let exEstimate = await this.estimate.findOne({
    //                     where: {
    //                         date: new Date().toLocaleString("fa-IR").split(",")[0]
    //                     }
    //                 })
    //                 exEstimate.boughtGold = (parseFloat(((+exEstimate.boughtGold) + goldWeight).toFixed(3))).toString()
    //                 await this.estimate.save(exEstimate)
    //             } else {
    //                 let estimate2 = this.estimate.create({
    //                     date: new Date().toLocaleString("fa-IR").split(",")[0],
    //                     boughtGold: (parseFloat((goldWeight).toFixed(3))).toString(),
    //                     soldGold: '0'
    //                 })
    //                 let sold = await this.estimate.save(estimate2)
    //                 console.log('soldddddddd?>>>' , sold)
    //             }
    //         }
    //         return true
    //     } catch (error) {
    //         monitor.error.push(`${error}`)
    //         console.log('error>>>>' , error)
    //         return false
    //     }
    // }



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



    private async getToken() {
        let authUrl = process.env.AUTH_URL
        try {
            let res = await axios.post(authUrl, { username: "TLS_khanetalla", password: "1M@k8|H43O9S" })
            let token = `Bearer ${res.data.access_token}`
            return token

        } catch (error) {
            monitor.error.push(`error in get token from shahkar ${error}`)
            console.log('error>>>>>' , `${error}`)
            // console.log("error in getToken ShahkarController   " + error);
            return null
        }
    }


    private async generateInvoice() {
        return (new Date().getTime()).toString()
    }

    
    private async generateOtp() {
        let firstRandomoe = Math.floor(1000 + Math.random() * 9000)
        return firstRandomoe
    }



    /**
     * its for sending otp for creating the inPerson buy  
     * @param req 
     * @param res 
     * @param next 
     * @returns 
     */
    async otp(req: Request, res: Response, next: NextFunction) {
        const error = validationResult(req)
        if (!error.isEmpty()) {
            return next(new responseModel(req, res, error['errors'][0].msg , 'admin service', 400, error['errors'][0].msg, null))
        }
        let validate = (req.body.phoneNumber).substring(0,2) === '09' ? true : false;
        console.log( 'phone validator', validate);
        let { phoneNumber } = req.body;
        let queryRunner = AppDataSource.createQueryRunner()
        await queryRunner.connect()
        await queryRunner.startTransaction()
        try {
            let user = await this.userRepository.findOne({
                where: {
                    phoneNumber: phoneNumber
                }
            })
            let otpCode = await this.generateOtp()

            let otpExist = await this.otpRepository.exists({
                where: {
                    phoneNumber: phoneNumber
                }
            })
            let userOtp;
            if (!otpExist) {
                let newOtp = this.otpRepository.create({
                    phoneNumber: phoneNumber,
                    time: new Date().getTime().toString()
                })
                userOtp = await this.otpRepository.save(newOtp)
            } else {
                userOtp = await this.otpRepository.findOne({
                    where: {
                        phoneNumber: phoneNumber
                    }
                })
            }
            userOtp.otp = otpCode;
            userOtp.time = new Date().getTime().toString();
            await this.otpRepository.save(userOtp)
            await this.smsService.sendOtpMessage(phoneNumber, otpCode)
            console.log(otpCode)
            return next(new responseModel(req, res, '' ,'admin service', 200, null, otpCode))
        } catch (error) {
            console.log('error>>>>>' , `${error}`)
            console.log('error in creating otp in buy inperson part')
            await queryRunner.rollbackTransaction()
            return next(new responseModel(req, res, '' ,'admin service', 500, `${error}`, null))
        } finally {
            await queryRunner.release()
        }
    }


    /**
     * its for checking otp and verifing user in the inperson buy
     * @param req 
     * @param res 
     * @param next 
     * @returns 
     */
    async verifyOtp(req: Request, res: Response, next: NextFunction) {
        try {
            let { otp, phoneNumber } = req.body;
            const error = validationResult(req)
            if (!error.isEmpty()) {
                return next(new responseModel(req, res, error['errors'][0].msg , 'admin service', 400, error['errors'][0].msg, null))
            }
            let otpData = await this.otpRepository.findOne({
                where: {
                    phoneNumber: phoneNumber
                }
            })
    
            let userExist = await this.userRepository.exists({
                where: {
                    phoneNumber: phoneNumber
                }
            })
    
            if (otpData.otp.toString() != otp.toString()) {
                return next(new responseModel(req, res, '' ,'admin service', 412, `کد وارد شده نادرست است`, null))
            }
            let timeNow = new Date().getTime()
    
            if (timeNow - (+otpData.time) > 2.1 * 60 * 1000) {
                return next(new responseModel(req, res, '' ,'admin service', 412, `کد وارد شده منقضی شده است`, null))
            }
    
            // اگر کاربر در لیست کاربران جدید باشد
            // اگر کاربر در لیست کاربران قدیمی باشد
    
            let isVerified: number = 0;           // not verified user            
            let data = null
            if (userExist) {             // if user exists in the main database;
                let user = await this.userRepository.findOne({ where: { phoneNumber: phoneNumber }, relations: ['wallet'] })
                if (user.verificationStatus == 0) {
                    console.log('user is approved in the new user database')
                    isVerified = 1;                    // verified user
                    data = user;
                }
            } else {                         // if user didnt exists in the main database
                let oldUser = await this.interservice.checkUser(phoneNumber)     // check the oldService database
                if (oldUser.success == true) {                // if user was exist in oldUser database 
                    console.log('this user is in the oldUsers')
                    isVerified = 2                 // is oldUser and not verified
                    data = oldUser.data;
                } else {
                    console.log('this user is not in the oldUsers')
                }
            }
            let action = `\u202B را ایجاد کرد ${data?.firstName} تراکنش خرید حضوری مربوط به کاربر ${req.user.firstName} حسابدار\u202C`
            let logRespons = await this.interservice.addNewAdminLog({firstName : req.user.firstName , lastName : req.user.lastName , phoneNumber : req.user.phoneNumber} , '' , ` را شروع کرد  ${phoneNumber} فرایند   خرید تلفنی مربوط به  ${req.user.firstName} کارشناس` , {
                action : action
            } , 1) 
            return next(new responseModel(req, res, '' ,'admin service', 200, null, { isVerified: isVerified, ...data }))
        } catch (error) {
            return next(new responseModel(req, res, '' ,'admin service', 500, `حطای داخلی سیستم`, null))            
        }
    }




    /**here we should check if we want the verifing the users */
    /**
     * its for identity of oldusers
     * @param req 
     * @param res 
     * @param next 
     * @returns 
     */
    async identityInformationOfUser(req: Request, res: Response, next: NextFunction) {
        let { phoneNumber, birthDate, nationalCode, id } = req.body
        const error = validationResult(req)
        if (!error.isEmpty()) {
            return next(new responseModel(req, res, error['errors'][0].msg , 'admin service', 400, error['errors'][0].msg, null))
        }
        let identityInfoUrl = process.env.IDENTITY_INFO_URL
        let user = await this.userRepository.find({ where: [{ nationalCode: nationalCode }, { phoneNumber: phoneNumber }] })
        if (user.length) {
            return res.status(400).json({ msg: "کاربر قبلا در سامانه خانه طلا ثبت نام کرده است" })
        }
        let queryRunner = AppDataSource.createQueryRunner()
        await queryRunner.connect()
        await queryRunner.startTransaction()
        try {
            let isMatchNationalCod = await this.checkMatchOfPhoneAndNationalCode({ phoneNumber, nationalCode })
            
            if (isMatchNationalCod == 'noToken') {
                console.log('111')
                return res.status(400).json({ msg: 'سیستم احراز هویت موقتا در دسترس نمیباشد.لطفا دقایقی دیگر مجددا تلاش کنید.' })
            }

            if (isMatchNationalCod == 'unknown') {
                console.log('222')
                return res.status(400).json({ msg: 'مشکلی در در احراز هویت بوجود آمده است.لطفا دقایقی دیگر مجددا تلاش کنید.' })
            }
            if (isMatchNationalCod == 500) {
                console.log('333')
                return res.status(400).json({ msg: 'سیستم احراز هویت موقتا در دسترس نمیباشد.لطفا دقایقی دیگر مجددا تلاش کنید.' })
            }

            if (isMatchNationalCod == false) {
                console.log('444')
                return res.status(400).json({ msg: 'شماره تلفن با شماره ملی مطابقت ندارد' })
            }


            let shahkarToken = await this.getToken()
            if (shahkarToken == null || shahkarToken == undefined) {
                return res.status(500).json({ err: "کاربر گرامی سیستم احراز هویت موقتا در دسترس نمی باشد.لطفا دقایقی دیگر مجددا تلاش بفرمایید" })
            }
            let body = { birthDate: birthDate, nationalCode: nationalCode }
            let res2 = await axios.post(identityInfoUrl, body, { headers: { 'Authorization': shahkarToken } })
            let info = res2.data
            // console.log('trach code . . .',res.headers['track-code'])
            console.log('shahkar info>>>>', res2)
            if (res2.status == 200) {
                if (typeof(res2.data) == "string" ){
                    return next(new responseModel(req, res, 'کاربر گرامی لطفا مقادیر ورودی را چک و از صحت اطلاعات اطمینان حاصل فرمایید' ,'admin service', 502, 'کاربر گرامی لطفا مقادیر ورودی را چک و از صحت اطلاعات اطمینان حاصل فرمایید', null))
                }
                if (!res2.data  || typeof(res2.data.fristName) === undefined) {
                    let trackIdData: trackIdInterface = {
                        trackId: res2.headers['track-code'],
                        firstName: '',
                        lastName: '',
                        fatherName: '',
                        phoneNumber: '',
                        status: false
                    }
                    let trackIdService = new internalDB()
                    let DBStatus = await trackIdService.saveData(trackIdData)
                    console.log('returned db status>>>>', DBStatus)
                    return next(new responseModel(req, res, 'کاربر گرامی سیستم احراز هویت موقتا در دسترس نمیباشد' ,'admin service', 502, 'کاربر گرامی سیستم احراز هویت موقتا در دسترس نمیباشد', null))
                }
                let {
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

                const oldUserData = await this.oldUserService.checkExistAndGetGoldWallet(phoneNumber, nationalCode, info)  
                console.log("after verify in oldUserData",oldUserData);
                const time= new Date().toLocaleString('fa-IR').split(',')[1]
                const date= new Date().toLocaleString('fa-IR').split(',')[0]

                let user = this.userRepository.create({
                    fatherName,
                    identityTraceCode: res2.headers['track-code'],
                    gender: (gender == 0) ? false : true
                    , officeName,
                    birthDate,
                    date: date,
                    time: time,
                    identityNumber: identificationNo,
                    identitySeri: identificationSeri,
                    identitySerial: identificationSerial,
                    firstName, lastName, phoneNumber, nationalCode, liveStatus,
                    verificationStatus: VerificationStatus.SUCCESS,
                    // aldUser : true,
                })
                let savedUser = await queryRunner.manager.save(user)
                // console.log(savedUser)
                const wallet = this.walletRepository.create({
                    balance: 0,
                    goldWeight: oldUserData.isExist ? oldUserData.updatedUser.wallet.goldWeight : 0,
                    user: savedUser,
                });
                // let token = await this.jwtService.generateToken(savedUser)
                let trackIdData: trackIdInterface = {
                    trackId: res2.headers['track-code'],
                    firstName: firstName,
                    lastName: lastName,
                    fatherName: fatherName,
                    phoneNumber: phoneNumber,
                    status: true
                }
                if (id != '') {
                    let oldUserUpdated = await this.interservice.changeUserStatus(id, savedUser)                // change the user
                    console.log('olllldddd>>>' , oldUserData)
                    if (!oldUserUpdated.success) {
                        await queryRunner.rollbackTransaction()
                        console.log('interservice oldUser is not in access')
                        return next(new responseModel(req, res, '' ,'admin service', 502, 'oldUser service is out of access', null))
                    }
                    // console.log('goldWeight', oldUserUpdated.data.wallet.goldWeight)
                    wallet.goldWeight = +(oldUserUpdated.data.wallet.goldWeight)
                }
                let trackIdService = new internalDB()
                let DBStatus = await trackIdService.saveData(trackIdData)
                await queryRunner.manager.save(wallet)
                await queryRunner.commitTransaction()
                await this.smsService.sendGeneralMessage(wallet.user.phoneNumber, "identify", firstName, null, null)
                let action = `\u202Bرا ایجاد کرد ${user.firstName} ${user.lastName} احراز هویت مربوط به کاربر ${req.user.firstName} ادمین\u202C`
                let logRespons = await this.interservice.addNewAdminLog({firstName : req.user.firstName , lastName : req.user.lastName , phoneNumber : req.user.phoneNumber} , 'احراز هویت در معاملات حضوری' , action , {
                } , 1) 
                return next(new responseModel(req, res, '' ,'admin service', 200, null, { ...savedUser, isVerified: 1 }))
                // return res.status(200).json({ data: { ...savedUser, isVerified: 1 }, msg: "ثبت نام شما با موفقیت انجام شد" })
            } else if (res.status == 400) {
                console.log('track id>>>>', res.headers['track-code'])
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
                await queryRunner.rollbackTransaction()
                console.log('transAction rolledBack because of the fucking ')
                console.log('errorrrrrrrrrrrrrr', res.data.error)
                return next(new responseModel(req, res, '' ,'admin service', 200, 'خطا در احراز هویت', null))
                // return res.status(500).json({ err: res.data.details, msg: "خطا در احراز هویت کاربر" })
            }
        } catch (error) {
            console.log('error>>>>>' , error)
            console.log('transaction rolledBack beacause of error....', `${error}`)
            await queryRunner.rollbackTransaction()
            return next(new responseModel(req, res, '' ,'admin service', 500, `${error}`, null))
        } finally {
            await queryRunner.release()
            console.log('transAction released....')
        }
    }

    
    /**
     * its for creating the buy transAction and make it pending for approvation admin with inPerson true
     * here just create the invoice and make it ready for accountant approvations
     * @param req 
     * @param res 
     * @param next 
     */
    async creatBuyTransActions(req: Request, res: Response, next: NextFunction) {
        // console.log(goldPrice, goldWeight, invoiceId, totalPrice, nationalCode)
        const error = validationResult(req)
        if (!error.isEmpty()) {
            return next(new responseModel(req, res, error['errors'][0].msg , 'admin service', 400, error['errors'][0].msg, null))
        }
        let { goldPrice, goldWeight, invoiceId, totalPrice, nationalCode, description , destCardPan , paymentMethod} = req.body;
        if (!goldPrice || !goldWeight || !invoiceId || !totalPrice || !nationalCode) {
            return next(new responseModel(req, res, '' ,'admin service', 400, 'لطفا ورودی هارا با دقت پر کنید', null))
        }
        
        if (totalPrice.toString().includes(',')){
            totalPrice  = totalPrice.replaceAll(',' , '')
            console.log('new totalPrice , ' , totalPrice)
        }
        console.log('tot' , totalPrice)

        let admin = `${req.user.firstName}-${req.user.lastName}`
        let queryRunner = AppDataSource.createQueryRunner()
        await queryRunner.connect()
        await queryRunner.startTransaction()
        try {
            console.log('body>>>' , req.body)
            let user = await this.userRepository.findOne({ where: { nationalCode: nationalCode } })
            let systemUser = await this.userRepository.findOne({ where: { isSystemUser: true } })
            let type = await this.invoicesTypeRepository.findOne({ where: { title: 'buy' } });
            let newInvoice = this.invoicesRepository.create({
                type: type,
                buyer: user,
                seller: systemUser,
                goldPrice,
                goldWeight: goldWeight,
                totalPrice: totalPrice,
                invoiceId: invoiceId,
                destCardPan : destCardPan,
                tradeType:2,
                paymentMethod : paymentMethod,
                description: description,
                status: 'pending',
                date: new Date().toLocaleString('fa-IR').split(',')[0],
                time: new Date().toLocaleString('fa-IR').split(',')[1],
                inPerson: true,
                adminId: admin,
            })
            let createdInvoice = await queryRunner.manager.save(newInvoice)
            await queryRunner.commitTransaction()
            let finalInvoice = await this.invoicesRepository.findOne({ where: { id: createdInvoice.id }, relations: ['buyer', 'seller', 'buyer.wallet'] })
            let action = `\u202Bادمین ${req.user.firstName} ${req.user.lastName} تراکنش حضوری مربوط به کاربر ${user.firstName} ${user.lastName} را شروع کرد\u202C`
            this.interservice.addNewAdminLog({firstName : req.user.firstName , lastName : req.user.lastName , phoneNumber : req.user.phoneNumber} , 'ایجاد تراکنش خرید حضوری' , action , {
            } , 1) 
            this.smsService.sendGeneralMessage(user.phoneNumber, "sellcall", user.firstName, goldWeight, totalPrice)
            return next(new responseModel(req, res, '' ,'admin service', 200, null, { ...finalInvoice, wallet: finalInvoice.buyer.wallet }))
        } catch (error) {
            console.log('error>>>>>' , `${error}`)
            console.log('error>>>>>' , `${error}`)
            await queryRunner.rollbackTransaction()
            return next(new responseModel(req, res, '' ,'admin service', 500, `${error}`, null))
        } finally {
            console.log('release the transActions')
            await queryRunner.release()
        }
    }




    /**
     * its for creating the sell transaction and make it pending for approvation accountant with inperson true
     * @param req 
     * @param res 
     * @param next 
     */
    async creatSellTransActions(req: Request, res: Response, next: NextFunction) {
        let { goldPrice, goldWeight, invoiceId, totalPrice, nationalCode ,description } = req.body;
        const error = validationResult(req)
        if (!error.isEmpty()) {
            return next(new responseModel(req, res, error['errors'][0].msg , 'admin service', 400, error['errors'][0].msg, null))
        }
        if (totalPrice.toString().includes(',')){
            totalPrice  = totalPrice.replaceAll(',' , '')
            console.log('new totalPrice , ' , totalPrice)
        }
        console.log('tot' , totalPrice)
        console.log(req.body)
        let admin = `${req.user.firstName}-${req.user.lastName}`
        let queryRunner = AppDataSource.createQueryRunner()
        await queryRunner.connect()
        await queryRunner.startTransaction()
        try {
            let user = await this.userRepository.findOne({ where: { nationalCode: nationalCode }, relations: ['wallet'] })
            console.log('uuuu' , user.wallet)
            if (+user.wallet.goldWeight < +goldWeight) {
                await queryRunner.rollbackTransaction()
                return next(new responseModel(req, res, '' ,'admin service', 400, 'حجم صندوق طلای کاربر کافی نمی باشد', null))
            }
            let systemUser = await this.userRepository.findOne({ where: { isSystemUser: true } , relations : ['wallet']})
            let type = await this.invoicesTypeRepository.findOne({ where: { title: 'sell' } });
            console.log('its type >>>>' , type)
            let newInvoice = this.invoicesRepository.create({
                type: type,
                description : description,
                buyer: systemUser,
                seller: user,
                goldPrice,
                tradeType:2,
                goldWeight: +goldWeight,
                totalPrice: +totalPrice,
                invoiceId: invoiceId,
                status: 'completed',
                date: new Date().toLocaleString('fa-IR').split(',')[0],
                time: new Date().toLocaleString('fa-IR').split(',')[1],
                inPerson: true,
                adminId: admin,
            })
            user.wallet.balance = (+user.wallet.balance) + (+totalPrice)
            user.wallet.goldWeight = (+user.wallet.goldWeight) - (+goldWeight)
            systemUser.wallet.goldWeight = (+systemUser.wallet.goldWeight) +  (+goldWeight)
            await queryRunner.manager.save(systemUser.wallet)
            await queryRunner.manager.save(user.wallet)
            let createdInvoice = await queryRunner.manager.save(newInvoice)
            console.log('passed')
            let rr = await this.estimateWeight.estimateWeight(+createdInvoice.goldWeight , 0)
            await queryRunner.commitTransaction()
            let finalInvoice = await this.invoicesRepository.findOne({ where: { id: createdInvoice.id }, relations: ['buyer', 'seller', 'seller.wallet'] })
            let action = `\u202Bادمین ${req.user.firstName} ${req.user.lastName} تراکنش فروش حضوری مربوط به کاربر ${user.firstName} ${user.lastName} را ایجاد کرد\u202C`
            let logRespons = await this.interservice.addNewAdminLog({firstName : req.user.firstName , lastName : req.user.lastName , phoneNumber : req.user.phoneNumber} , ' ایجاد تراکنش فروش حضوری' , action , {
            } , 1)
            this.smsService.sendGeneralMessage(user.phoneNumber, "selldasti", user.firstName, goldWeight, totalPrice)
            return next(new responseModel(req, res, '' ,'admin service', 200, null, { ...finalInvoice, wallet: finalInvoice.seller.wallet }))
        } catch (error) {
            console.log('error>>>>>' , `${error}`)
            await queryRunner.rollbackTransaction()
            return next(new responseModel(req, res, '' ,'admin service', 500 , `خطای داخلی سیستم لطفا دقایقی دیگر دوباره تلاش کنید`, null))
        } finally {
            await queryRunner.release()
        }
    }



    /**
     * its for getting all pending inperson transActions for accountant
     * @param req 
     * @param res 
     * @param next 
     * @returns 
     */
    async getAllSellPending(req: Request, res: Response, next: NextFunction) {
        let transActions;
        let status = req.params.status
        if (!status){
            return next(new responseModel(req, res, '' ,'admin service', 400, 'invalid input value in params', null))
        }
        // if (status !== 'pending' || status !== 'completed' || status !== 'failed'){
        //     return next(new responseModel(req, res, '' ,'admin service', 400, 'invalid input value in params', null))
        // }
        try {
            transActions = await this.invoicesRepository.createQueryBuilder('invoice')
            .leftJoinAndSelect('invoice.seller' , 'seller')
            .leftJoinAndSelect('seller.wallet' , 'wallet')
            .leftJoinAndSelect('seller.bankAccounts' , 'bankAccounts')
            .leftJoinAndSelect('invoice.type' , 'type')
            .where('invoice.inPerson = :bool AND invoice.status = :status AND type.title = :type' , {bool : true , status : status , type : 'sell'})
            .orderBy('invoice.updatedAt' , 'DESC')
            .getMany()
    
            // console.log('query builder transaction' , transActions[0])
    
        } catch (error) {
            console.log(`${error}`)            
        }


        // let type = await this.invoicesTypeRepository.findOne({where : {
        //     title : 'buy'
        // }})
        // console.log('type' , type)
        // let transActions2 = await this.invoicesRepository.find({
        //     where: {
        //         inPerson: true,
        //         status: 'pending',
        //         type : type
        //     }, relations : ['seller' , 'seller.wallet' , 'seller.bankAccounts'] ,order: { updatedAt: 'DESC' }
        // })
        return next(new responseModel(req, res, '' ,'admin service', 200, null, transActions))
    }



    /**
     * its for getting all pending inperson transActions for accountant
     * @param req 
     * @param res 
     * @param next 
     * @returns 
     */
    async getAllBuyPending(req: Request, res: Response, next: NextFunction) {
        let status = req.params.status
        if (!status){
            return next(new responseModel(req, res, '' ,'admin service', 400, 'invalid input value in params', null))
        }
        // if (status !== 'pending' || status !== 'completed' || status !== 'failed'){
        //     return next(new responseModel(req, res, '' ,'admin service', 400, 'invalid input value in params', null))
        // }
        let transActions = await this.invoicesRepository.createQueryBuilder('invoice')
        .leftJoinAndSelect('invoice.buyer' , 'buyer')
        .leftJoinAndSelect('buyer.wallet' , 'wallet')
        .leftJoinAndSelect('buyer.bankAccounts' , 'bankAccounts')
        .leftJoinAndSelect('invoice.type' , 'type')
        .where('invoice.inPerson = :bool AND invoice.status = :status AND type.title = :type' , {bool : true , status : status , type : 'buy'})
        .orderBy('invoice.updatedAt' , 'DESC')
        .getMany()
        // console.log('query builder transaction' , transActions[0])
        // let type = await this.invoicesTypeRepository.findOne({where : {
        //     title : 'sell'
        // }})
        // let transActions2 = await this.invoicesRepository.find({
        //     where: {
        //         inPerson: true,
        //         status: 'pending',
        //         // type : type
        //     }, relations : ['buyer' , 'buyer.wallet' , 'buyer.bankAccounts'] ,order: { updatedAt: 'DESC' }
        // })
        return next(new responseModel(req, res, '' ,'admin service', 200, null, transActions))
    }


    /**
     * its for chanage status of the inperson transactions with accountant
     * @param req 
     * @param res 
     * @param next 
     */
    async changeTransActionsStatusByAccountant(req: Request, res: Response, next: NextFunction) {
        let { id, status, description } = req.body;
        console.log(req.body)
        const error = validationResult(req)
        if (!error.isEmpty()) {
            return next(new responseModel(req, res, error['errors'][0].msg , 'admin service', 400, error['errors'][0].msg, null))
        }
        let accountant = `${req.user.firstName}-${req.user.lastName}`
        let inPersonTransAction = await this.invoicesRepository.findOne({ where: { id: id }, relations: ['buyer', 'seller', 'buyer.wallet', 'seller.wallet' , 'type'] })

        if (!inPersonTransAction) {
            return next(new responseModel(req, res, '' ,'admin service', 400, 'invalid input transAction id', null))
        }
        if (inPersonTransAction.status != 'pending') {
            return next(new responseModel(req, res, '' ,'admin service', 400, 'این تراکنش قبلا اعتبار سنجی شده است', null))
        }

        let queryRunner = AppDataSource.createQueryRunner()
        await queryRunner.connect()
        await queryRunner.startTransaction()
        try {
            if (status == 0) {                               // if reject the transActions
                inPersonTransAction.status = 'failed';
                inPersonTransAction.accounterDescription = description;
                inPersonTransAction.accounterId = accountant;
                let savedTransActions = await queryRunner.manager.save(inPersonTransAction)
                await queryRunner.commitTransaction()
                if (inPersonTransAction.type.title == 'sell'){
                    let action = `\u202Bادمین ${req.user.firstName} ${req.user.lastName} تراکنش حضوری مربوط به کاربر ${inPersonTransAction.seller.firstName} ${inPersonTransAction.seller.lastName} را تایید کرد\u202C`
                    this.interservice.addNewAdminLog({firstName : req.user.firstName , lastName : req.user.lastName , phoneNumber : req.user.phoneNumber} , 'تایید تراکنش حضوری' , action , {} , 1)                         
                }else{
                    let action = `\u202Bادمین ${req.user.firstName} ${req.user.lastName} تراکنش حضوری مربوط به کاربر ${inPersonTransAction.buyer.firstName} ${inPersonTransAction.buyer.lastName} را تایید کرد\u202C`
                    this.interservice.addNewAdminLog({firstName : req.user.firstName , lastName : req.user.lastName , phoneNumber : req.user.phoneNumber} , 'تایید تراکنش حضوری' , action , {} , 1) 
                }
                this.smsService.sendGeneralMessage(inPersonTransAction.buyer.phoneNumber, "rejectcall", inPersonTransAction.buyer.firstName, inPersonTransAction.goldWeight, inPersonTransAction.totalPrice)
                return next(new responseModel(req, res, 'این تراکنش با موفقیت رد شد' ,'admin service', 200, null, savedTransActions))
            } else if (status == 1) {                          // if approved the transActions
                console.log('level1')
                inPersonTransAction.status = 'completed';
                inPersonTransAction.accounterDescription = description;
                inPersonTransAction.accounterId = accountant;
                console.log('level2')
                console.log('goldWeight' , (+inPersonTransAction.buyer.wallet.goldWeight) + (+inPersonTransAction.goldWeight) , typeof((+inPersonTransAction.buyer.wallet.goldWeight) + (+inPersonTransAction.goldWeight)))
                console.log('goldWeight' ,  (+inPersonTransAction.seller.wallet.goldWeight) - inPersonTransAction.goldWeight , typeof( (+inPersonTransAction.seller.wallet.goldWeight) - inPersonTransAction.goldWeight))
                console.log('level3')
                
                inPersonTransAction.buyer.wallet.goldWeight = (+inPersonTransAction.buyer.wallet.goldWeight) + (+inPersonTransAction.goldWeight);
                inPersonTransAction.seller.wallet.goldWeight =   (+inPersonTransAction.seller.wallet.goldWeight) - inPersonTransAction.goldWeight;
                await queryRunner.manager.save(inPersonTransAction.buyer.wallet)
                await queryRunner.manager.save(inPersonTransAction.seller.wallet)
                let savedTransActions = await queryRunner.manager.save(inPersonTransAction)
                await this.estimateWeight.estimateWeight(+inPersonTransAction.goldWeight, 1)
                await queryRunner.commitTransaction()
                if (inPersonTransAction.type.title == 'sell'){
                    let action = `\u202Bادمین ${req.user.firstName} ${req.user.lastName} تراکنش حضوری مربوط به کاربر ${inPersonTransAction.seller.firstName} ${inPersonTransAction.seller.lastName} را تایید کرد\u202C`
                    this.interservice.addNewAdminLog({firstName : req.user.firstName , lastName : req.user.lastName , phoneNumber : req.user.phoneNumber} , 'تایید تراکنش حضوری' , action , {} , 1)                         
                }else{
                    let action = `\u202Bادمین ${req.user.firstName} ${req.user.lastName} تراکنش حضوری مربوط به کاربر ${inPersonTransAction.buyer.firstName} ${inPersonTransAction.buyer.lastName} را تایید کرد\u202C`
                    this.interservice.addNewAdminLog({firstName : req.user.firstName , lastName : req.user.lastName , phoneNumber : req.user.phoneNumber} , 'تایید تراکنش حضوری' , action , {} , 1) 
                }
                this.smsService.sendGeneralMessage(inPersonTransAction.buyer.phoneNumber, "buy", inPersonTransAction.buyer.firstName, inPersonTransAction.goldWeight, inPersonTransAction.totalPrice)
                return next(new responseModel(req, res, 'این تراکنش با موفقیت تایید شد' ,'admin service', 200, null, savedTransActions))
            } else {
                return next(new responseModel(req, res, 'مقادیر ورودی نادرست میباشد' ,'admin service', 400, 'invalid input status', null))
            }
        } catch (error) {
            console.log('error>>>>>' , `${error}`)
            await queryRunner.rollbackTransaction()
            console.log('error occured in change status ', `${error}`)
            return next(new responseModel(req, res, 'خطای داخلی سرور' ,'admin service', 400, `${error}`, null))
        } finally {
            await queryRunner.release()
        }
    }
}