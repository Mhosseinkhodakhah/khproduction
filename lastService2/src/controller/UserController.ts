import { AppDataSource } from "../data-source"
import { NextFunction, Request, Response } from "express"
import { User } from "../entity/User"
import { Between, Equal } from "typeorm"
import { Invoice } from "../entity/Invoice"
import { startOfDay } from "date-fns"
import cacher from "../services/cacher"
import { goldPrice } from "../entity/goldPrice"
import logger from "../services/interservice/logg.service"
import { Jalali } from 'jalali-ts';
import { validationResult } from "express-validator"
import monitor from "../util/statusMonitor"
import { responseModel } from "../util/response.model"
import { internalDB } from "../services/selfDB/saveDATA.service"
import { trackIdInterface } from "../interfaces/interface.interface"
import axios from "axios"
import { ShahkarController } from "./ShahkarController"
import { oldUserService } from "../services/oldUser.service"
import { Wallet } from "../entity/Wallet"
import { VerificationStatus } from "../entity/enums/VerificationStatus"


export class UserController {
    private userRepository = AppDataSource.getRepository(User)
    private invoiceRepository = AppDataSource.getRepository(Invoice)
    private goldPrice = AppDataSource.getRepository(goldPrice)
    private interservice = new logger()
    private shakarService = new ShahkarController()
    private oldUserService=new oldUserService()
    private walletRepository = AppDataSource.getRepository(Wallet)




    async identityInformationOfUser(phoneNumber : string ,birthDate : string ,nationalCode : string){
        let identityInfoUrl = process.env.IDENTITY_INFO_URL 
        let shahkarToken = await this.getToken()
        if (shahkarToken == null || shahkarToken == undefined) {
            return null
        }else{
        let body = {birthDate : birthDate , nationalCode : nationalCode}   
        try {
           let res = await axios.post(identityInfoUrl , body , {headers : { 'Authorization' : shahkarToken }})
            let info  = res.data 
            console.log('trach code . . .',res.headers['track-code'])
            console.log('shahkar info>>>>' , res)
            if(res.status == 200){
                if (typeof(res.data) == "string" ){
                    let trackIdData: trackIdInterface = {
                        trackId: res.headers['track-code'],
                        firstName: '',
                        lastName: '',
                        fatherName: '',
                        phoneNumber: '',
                        status: false
                    }
                    let trackIdService = new internalDB()
                    let DBStatus = await trackIdService.saveData(trackIdData)
                    return 400
                }
                if (!res.data  || typeof(res.data.fristName) === undefined) {
                    let trackIdData: trackIdInterface = {
                        trackId: res.headers['track-code'],
                        firstName: '',
                        lastName: '',
                        fatherName: '',
                        phoneNumber: '',
                        status: false
                    }
                    let trackIdService = new internalDB()
                    let DBStatus = await trackIdService.saveData(trackIdData)
                    // console.log('returned db status>>>>', DBStatus)
                    return 500
                }
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
                let user = {
                    fatherName,
                    gender:(gender == 0) ? false : true
                    ,officeName,
                    birthDate,
                    identityNumber : identificationNo,
                    identitySeri : identificationSeri,
                    identitySerial: identificationSerial,
                    firstName,
                    lastName,
                    phoneNumber,
                    nationalCode,
                    liveStatus,
                    verificationStatus : 1,
                    identityTraceCode : res.headers['track-code'],
                }
                const trackObj : trackIdInterface = {
                    phoneNumber:user.phoneNumber,
                    trackId:user.identityTraceCode,
                    fatherName:user.fatherName,
                    firstName:user.fatherName,
                    lastName:user.lastName,
                    status:true
                }
                let saveData=new internalDB()
                const DBStatus=await saveData.saveData(trackObj)
                console.log('returned db status>>>>' , DBStatus)
                return  user 

            }else {
                const trackObj : trackIdInterface = {
                    phoneNumber:phoneNumber,
                    trackId:res.headers['track-code'],
                    status:false
                }
                let saveData=new internalDB()
                await saveData.saveData(trackObj)
                const DBStatus=await saveData.saveData(trackObj)
                console.log('returned db status>>>>' , DBStatus)
                return null          
            }
        } catch (error) {
            console.log(error);
            return null
        }     
        }
    }



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
            return false
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
                console.log('returned db status>>>>', DBStatus)
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
                console.log('returned db status>>>>', DBStatus)
                return isMatch
            }
        } catch (error) {
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
                console.log('data base saver result>>>', DBStatus)
                if (+error.response.status >= 500) {
                    return 500
                }
            }
            console.log('error>>>>>', `${error}`)
            monitor.error.push(`error in check card and national code of userssss ${error}`)
            // console.log('error in ismatch national code', `${error}`)
            return 'unknown'
        }
    }


    // private saveData = new internalDB()
    /**
     * check identity and if user not exist in local userDB create it 
     * @param req 
     * @param res 
     * @param next 
     * @returns
     */
    async checkIdentity(req: Request, res: Response, next: NextFunction) {
        const { phoneNumber } = req.body
        try {
            const resultFromLastService = await this.userRepository.findOne({ where: { phoneNumber: phoneNumber } })
            let user = {};
            let isVerified = false;
            let userExist = false;
            if (resultFromLastService) {
                user = resultFromLastService
                isVerified = true;
                userExist = true;
            }
            if (!resultFromLastService) {
                let oldUser = await this.interservice.checkUser(phoneNumber)
                if (oldUser.success == true) {                // if user was exist in oldUser database 
                    console.log('this user is in the oldUsers')
                    // user = oldUser.data;
                    userExist = true
                    user = oldUser.data
                } else {
                    console.log('this user is not in the oldUsers')
                }
            }
            return next(new responseModel(req, res, '', 'checkIdentity', 200, null, { userExist: userExist, userVerified: isVerified, user: user }))
        }
        catch (err) {
            console.log(err);
            return next(new responseModel(req, res, '', 'checkIdentity', 500, 'مشکل داخلی سرویس یوزر', null))
        }
    }


    async getStatus(req: Request, res: Response, next: NextFunction) {
        let data = {
            all: monitor.requestCount,
            statusCount: monitor.status,
            error: monitor.error
        }
        // console.log('status data till here . . .' , data)
        return res.status(200).json(data)
    }


    /**
     * create and approve for user not exist in olduser and lastservice user
     * @param req 
     * @param res 
     * @param next 
     * @returns 
     */
    async approveNewUser(req: Request, res: Response, next: NextFunction) {
        console.log("approve new user");

        const bodyError = validationResult(req)
        if (!bodyError.isEmpty()) {
            return next(new responseModel(req, res,'', 'approve new user', 400, bodyError['errors'][0].msg, null))
        }
        let { phoneNumber, birthDate, nationalCode } = req.body
        console.log(req.body);

        let queryRunner = AppDataSource.createQueryRunner()
        await queryRunner.connect()
        await queryRunner.startTransaction()
        try {
            const resultMatch = await this.checkMatchOfPhoneAndNationalCode({ phoneNumber, nationalCode })
            if (resultMatch == 'unknown'){
                return res.status(400).json({ msg: 'خطای داخلی سیستم' })
            }
            if (resultMatch == 500){
                return res.status(400).json({ msg: 'سیستم شاهکار موقتا در دسترس نمیباشد.لطفا دقایقی دیگر مجددا تلاش کنید.' })
            }
    
            if (resultMatch == false) {
                return res.status(400).json({ msg: 'شماره تلفن با شماره ملی مطابقت ندارد' })
            }
            console.log("after Is Match");
            console.log(phoneNumber)
            const userInfo = await this.identityInformationOfUser(phoneNumber, birthDate, nationalCode)
            if (userInfo == 400){
                return next(new responseModel(req, res,'', 'approve new user', 400, "ورودی های خود را چک کرده و مجددا تلاش کنید", null))
            }
            if (userInfo ==500){
                return next(new responseModel(req, res,'', 'approve new user', 500, " سرویس استعلام هویت موقتا در دسترس نمیباشد.لطفا دقایقی دیگر مجددا تلاش کنید.", null))
            }
            if (!userInfo) {
                return next(new responseModel(req, res,'', 'approve new user', 400, " مشکلی در استعلام اطلاعات کاربر رخ داده است لطفا از درست بودن اطلاعات اطمینان حاصل کنید", null))
            }

            const oldUserData = await this.oldUserService.checkExistAndGetGoldWallet(phoneNumber, nationalCode, userInfo)
            console.log("oldUserData", oldUserData);
            const time = new Date().toLocaleString('fa-IR').split(',')[1]
            const date = new Date().toLocaleString('fa-IR').split(',')[0]

            let wallet = this.walletRepository.create({ goldWeight: oldUserData.isExist ? oldUserData.updatedUser.wallet.goldWeight : 0 , balance: 0 })
            const user = this.userRepository.create({
                fatherName: userInfo.fatherName,
                gender: userInfo.gender,
                officeName: userInfo.officeName,
                birthDate: userInfo.birthDate,
                identityNumber: userInfo.identityNumber,
                identitySeri: userInfo.identitySeri,
                identitySerial: userInfo.identitySerial,
                firstName: userInfo.firstName,
                date: date,
                time: time,
                lastName: userInfo.lastName,
                nationalCode: userInfo.nationalCode,
                phoneNumber: phoneNumber,
                liveStatus: userInfo.liveStatus,
                verificationStatus: VerificationStatus.SUCCESS,
                // verificationType: VerificationStatus.SUCCESS,
                identityTraceCode: userInfo.identityTraceCode,
                // fullName: `${userInfo.firstName} ${userInfo.lastName}`,
                wallet
            })
            console.log("after create in local data base");
            console.log("after interservice");
            delete user.identityTraceCode
            console.log("after every thing done");
            let savedUser = await queryRunner.manager.save(user)
            await queryRunner.commitTransaction()
            let userUpdated = await this.userRepository.findOne({where : {id : savedUser.id} , relations : ['wallet']})
            return next(new responseModel(req, res,'', 'approve new user', 200, null, userUpdated))
        } catch (err) {
            await queryRunner.rollbackTransaction()
            console.log("errr", err);
            return next(new responseModel(req, res,'', 'approve new User', 500, 'مشکل داخلی سرویس یوزر', null))
        } finally {
            console.log('release')
            await queryRunner.release()
        }
    }



    async all(request: Request, response: Response, next: NextFunction) {
        try {
            let users = await this.userRepository.find()
            monitor.addStatus({
                scope : 'user controller',
                status :  1,
                error : null
            })

            response.json(users).status(200)

        } catch (error) {
            monitor.addStatus({
                scope : 'user controller',
                status :  0,
                error : `${error}`
            })

            console.log("error in find all of users", error);
            response.sttus(500).json({ err: "error in find all of users" })
        }
    }


    async checkToken(request: Request, response: Response, next: NextFunction){
        return response.status(200).json('its done')
    }

    async profile(request: Request, response: Response, next: NextFunction) {
        try {
            const userId = request['user_id']
            const user = await this.userRepository.findOne({
                where: { id: Equal(userId) }, relations: ['bankAccounts' , 'wallet']})

            if (!user) {
                monitor.addStatus({
                    scope : 'user controller',
                    status :  0,
                    error :'account not found in user controller profile'
                })
    
                return response.status(404).json({ err: "User with this id not found" })
            }
            if (!user.isHaveBank && (user.bankAccounts || user.bankAccounts.length > 0)) {
                const hasVerifiedAccount = user.bankAccounts.some(account => account.isVerified);
                if (hasVerifiedAccount) {
                    user.isHaveBank = true
                }
            }
            // return response.sta
            monitor.addStatus({
                scope : 'user controller',
                status :  1,
                error : null
            })

            return response.json(user).status(200)

        } catch (error) {
            monitor.addStatus({
                scope : 'user controller',
                status :  0,
                error : `${error}`
            })

            console.log("error in find user by id ", error);
            return response.status(500).json({ err: "error in find user by id" })
        }
    }


    
    async one(request: Request, response: Response, next: NextFunction) {
        const id = parseInt(request.params.id)

        try {
            const user = await this.userRepository.findOne({
                where: { id }
            })

            if (!user) {
                monitor.addStatus({
                    scope : 'user controller',
                    status :  0,
                    error : 'user not found'
                })
    
                return response.status(404).json({ err: "User with this id not found" })
            }
            monitor.addStatus({
                scope : 'user controller',
                status :  1,
                error : null
            })

            return response.json(user).status(200)

        } catch (error) {
            monitor.addStatus({
                scope : 'user controller',
                status :  0,
                error : `${error}`
            })

            console.log("error in find user by id ", error);
            return response.status(500).json({ err: "error in find user by id" })
        }

    }

    async save(request: Request, response: Response, next: NextFunction) {
        const { age, buys, email, fatherName, firstName, gender, identityNumber, identitySeri, identitySerial, lastName, liveStatus, nationalCode, officeName, password, phoneNumber } = request.body;
        
        try {
            if (!firstName || !lastName || !fatherName || !gender || !identityNumber || !identitySerial || !identitySeri || !officeName || !liveStatus || !phoneNumber || !nationalCode) {
                monitor.addStatus({
                    scope : 'user controller',
                    status :  0,
                    error : 'invalid input in save user controller'
                })
    
                return response.status(400).json({ err: "fields (firstName lastName fatherName gender identityNumber identitySerial identitySeri officeName liveStatus phoneNumber nationalCode  are required" })
            }
            let userForCreate = this.userRepository.create({ age, buys, email, fatherName, firstName, gender, identityNumber, identitySeri, identitySerial, lastName, liveStatus, nationalCode, officeName, password, phoneNumber })
            let savedUser = this.userRepository.save(userForCreate)
            monitor.addStatus({
                scope : 'user controller',
                status :  1,
                error : null
            })

            response.json(savedUser)
        } catch (error) {
            monitor.addStatus({
                scope : 'user controller',
                status :  0,
                error : `${error}`
            })

            console.log("error in creating user ", error);
            response.status(500).json({ err: "error in creating user" })
        }
    }


    async remove(request: Request, response: Response, next: NextFunction) {
        const id = parseInt(request.params.id)
        try {
            let userToRemove = await this.userRepository.findOneBy({ id })

            if (!userToRemove) {
                monitor.addStatus({
                    scope : 'user controller',
                    status :  0,
                    error : 'account not found in remove user controller'
                })
    
                return response.status(404).json({ err: "User with this id not found" })
            }

            await this.userRepository.remove(userToRemove)
            monitor.addStatus({
                scope : 'user controller',
                status :  1,
                error : null
            })

            return response.json({ msg: "user has been removed" })

        } catch (error) {
            monitor.addStatus({
                scope : 'user controller',
                status :  0,
                error : `${error}`
            })

            console.log("error in deleting user ", error);
            response.status(500).json({ err: "error in deleting user" })
        }
    }


    /**
     * its here for home charts in application
     * @param request 
     * @param response 
     * @param next 
     * @returns 
     */
    async charts(request: Request, response: Response, next: NextFunction) {
        // let queryBuilder = this.userRepository.createQueryBuilder('user')
        //     .leftJoinAndSelect('user.buys', 'buys')
        //     .where('user.id = :id', { id: request['user_id'] })
        let userId = request['user_id']

        // let user = await this.userRepository.findOne({ where: { id: request['user_id'] }, relations: ['wallet'] })
        // // let buyInMonthData = queryBuilder.andWhere('invoice.createdAt BETWEEN :start AND :end' , {})

        // let buyInMonth = {
        //     label: ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'],
        //     data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
        // }

        let allCharts = await this.interservice.appChartData(userId)
        
        // console.log('monthlyChart', monthlyPrice.data.priceChart)

        // let livePrice = await this.goldPrice.find({ order: { createdAt: 'DESC' } })
        // console.log('livePrice', livePrice[0].Geram18, typeof (livePrice[0].Geram18))
        // let gram = (+livePrice[0].Geram18) * 10
        // let gold = +user.wallet.goldWeight
        // let balance = +user.wallet.balance
        // console.log(gram, gold, balance)
        // console.log((gram * gold) + balance)
        // let topBoxes = { balance: user.wallet.balance, goldWeight: user.wallet.goldWeight, monthlyProfit: 30, totalBalance: (gram * gold) + balance }

        // let assets = {
        //     label: ['دارایی ریالی', 'دارایی طلایی'],
        //     data: [user.wallet.balance, (user.wallet.goldWeight * gram)]
        // }

        // let georgianMonth = []

        // let monthes = ['01',
        //     '02',
        //     '03',
        //     '04',
        //     '05',
        //     '06',
        //     '07',
        //     '08',
        //     '09',
        //     '10',
        //     '11',
        //     '12',]

        // try {
        //     for (let i = 0; i < monthes.length; i++) {
        //         let element: string = monthes[i]
        //         if (+element > 6) {
        //             const startJalali = new Date(Jalali.parse(`1403/${element}/1`).gregorian())
        //             const endJalali = new Date(Jalali.parse(`1403/${element}/31`).gregorian())
        //             console.log('11111', startJalali, endJalali)
        //             let allInvoices = await this.invoiceRepository.createQueryBuilder("invoice")
        //                 .select("SUM(CAST(invoice.goldWeight AS decimal))", "total")
        //                 .where("(invoice.buyerId = :userId) AND invoice.createdAt >= :today AND invoice.createdAt <= :finaly", {
        //                     userId,
        //                     today: startJalali,
        //                     finaly: endJalali
        //                 }).getRawOne();
        //             buyInMonth.data[+element - 1] = +allInvoices.total
        //             console.log('aggregate the fucking monthly buy', allInvoices)

        //         } else {
        //             const startJalali = Jalali.parse(`1403/${element}/1`).gregorian()
        //             const endJalali = Jalali.parse(`1403/${element}/30`).gregorian()
        //             console.log('22222', startJalali, endJalali)
        //             let allInvoices = await this.invoiceRepository.createQueryBuilder("invoice")
        //                 .select("SUM(CAST(invoice.goldWeight AS decimal))", "total")
        //                 .where("(invoice.buyerId = :userId) AND invoice.createdAt >= :today AND invoice.createdAt <= :finaly", {
        //                     userId,
        //                     today: startJalali,
        //                     finaly: endJalali
        //                 }).getRawOne();
        //             buyInMonth.data[+element - 1] = +allInvoices.total
        //             console.log('aggregate the fucking monthly buy', allInvoices)
        //         }
        //     }
        // } catch (error) {
        //     console.log('error occured in data aggregation in buy in month', error)
        // }
        console.log( 'allChartsssssssssssssss', allCharts)
        monitor.addStatus({
            scope : 'user controller',
            status :  1,
            error : null
        })
        return response.status(200).json(allCharts)
    }
}