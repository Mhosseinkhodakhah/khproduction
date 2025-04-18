import { NextFunction, Request, Response } from "express"
import axios from 'axios'
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
import { oldUserService } from "../services/oldUser.service";
config();
export class ShahkarController {
    private userRepository = AppDataSource.getRepository(User)
    private jwtService = new JwtService()
    private walletRepository = AppDataSource.getRepository(Wallet)
    private smsService = new SmsService()
    private oldUSerService = new oldUserService()

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

    // async checkUsers(){
    //     try {
    //         let users = await this.userRepository.find()
    //     let unverifiedUser = []
    //     for (let i of users){
    //         let check = await this.checkMatchOfPhoneAndNationalCode({phoneNumber : i.phoneNumber , nationalCode: i.nationalCode})
    //         console.log('user>>>>>>' , check)
    //         if (!check){
    //             unverifiedUser.push(i)
    //         }
    //         return unverifiedUser.length
    //     }
    //     } catch (error) {
    //      console.log(error)   
    //     }
    // }


    // async checkMatchOfPhoneAndNationalCode(request: Request, response: Response, next: NextFunction) {
    //     let {phoneNumber,nationalCode} = request.body
    //     let checkMatchationUrl = process.env.SHAHKAR_BASE_URL + '/istelamshahkar'
    //     let isMatch = false
    //     let token = await this.getToken()
    //     if (token == null || token == undefined) {
    //         monitor.addStatus({
    //             scope: 'shahkar controller',
    //             status: 0,
    //             error: 'error from get token in shahkar get token checkMatchOfPhoneAndNationalCode endPoint'
    //         })
    //         return response.status(500).json({ err : "error get token from server"} )
    //     }
    //     axios.post(checkMatchationUrl , {mobileNumber : phoneNumber
    //          , nationalCode} , {headers : { 'Authorization' : token }}).then(async(res)=>{
    //         isMatch  = res.data.isMatched ? true : false 
    //         if (isMatch) {
    //             let trackIdData : trackIdInterface = {
    //                 trackId : res.headers['track-code'],
    //                 // firstName : firstName,
    //                 // lastName : lastName,
    //                 // fatherName : fatherName,
    //                 phoneNumber : phoneNumber,
    //                 status : true
    //             }
    //             let trackIdService = new internalDB()
    //             let DBStatus = await trackIdService.saveData(trackIdData)
    //             console.log('returned db status>>>>' , DBStatus)
    //             monitor.addStatus({
    //                 scope: 'shahkar controller',
    //                 status: 1,
    //                 error: null
    //             })
    //             return response.json({ isMatch , msg : "number and national code matched successfully"})                
    //         }else{
    //             let trackIdData : trackIdInterface = {
    //                 trackId : res.headers['track-code'],
    //                 // firstName : firstName,
    //                 // lastName : lastName,
    //                 // fatherName : fatherName,
    //                 phoneNumber : phoneNumber,
    //                 status : false
    //             }
    //             let trackIdService = new internalDB()
    //             let DBStatus = await trackIdService.saveData(trackIdData)
    //             console.log('returned db status>>>>' , DBStatus)
    //             monitor.addStatus({
    //                 scope: 'shahkar controller',    
    //                 status: 0,
    //                 error: `there is no match between number and national code`
    //             })
    //             return  response.status(404).json({ isMatch , msg : "there is no match between number and national code"})
    //         }
    //     }).catch((err)=>{
    //         monitor.addStatus({
    //             scope: 'shahkar controller',
    //             status: 0,
    //             error: err
    //         })
    //         return  response.status(500).json({ err : err.message , msg : "there is an error "} )
    //     })
    // }

    async identityInformationOfUser(request: Request, response: Response, next: NextFunction) {
        let { phoneNumber, birthDate, nationalCode } = request.body
        let identityInfoUrl = process.env.IDENTITY_INFO_URL
        let isMatch = await this.checkMatchOfPhoneAndNationalCode({ phoneNumber, nationalCode })
        // console.log(isMatch)
        if (isMatch == 'unknown'){
            return response.status(400).json({ msg: 'خطای داخلی سیستم' })
        }
        if (isMatch == 500){
            return response.status(400).json({ msg: 'سیستم شاهکار موقتا در دسترس نمیباشد.لطفا دقایقی دیگر مجددا تلاش کنید.' })
        }

        if (isMatch == false) {
            return response.status(400).json({ msg: 'شماره تلفن با شماره ملی مطابقت ندارد' })
        }
        if (nationalCode) {
            let user = await this.userRepository.findOneBy({ nationalCode })
            if (user) {
                monitor.addStatus({
                    scope: 'shahkar controller',
                    status: 0,
                    error: `کاربر قبلا با شماره دیگری ثبت نام کرده`
                })
                return response.status(500).json({ msg: "کاربر قبلا با شماره دیگری در سامانه خانه طلا ثبت نام کرده است" })
            }
        }
        let shahkarToken = await this.getToken()
        if (shahkarToken == null || shahkarToken == undefined) {
            monitor.addStatus({
                scope: 'shahkar controller',
                status: 0,
                error: `error from get token in shahkar get token identityInformationOfUser endPoint`
            })
            return response.status(500).json({ err: "error get token from server" })
        } else {
            let body = { birthDate: birthDate, nationalCode: nationalCode }
            let queryRunner = AppDataSource.createQueryRunner()
            await queryRunner.connect()
            await queryRunner.startTransaction()
            try {
                let res = await axios.post(identityInfoUrl, body, { headers: { 'Authorization': shahkarToken } })
                let info = res.data
                // console.log('trach code . . .',res.headers['track-code'])
                console.log('shahkar info>>>>', res)
                if (res.status == 200) {
                    if (!res.data || res.data == '') {
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
                        console.log('returned db status>>>>', DBStatus)
                        return response.status(500).json({ msg: 'کاربر گرامی موقتا سیستم احراز هویت ثبت احوال در دسترس نمیباشد.لطفا دقایقی دیگر مجددا تلاش کنید' })
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

                    // check the oldUser existance
                    const oldUserData = await this.oldUSerService.checkExistAndGetGoldWallet(phoneNumber, nationalCode, info)  
                    console.log("oldUserData", oldUserData);
                    // setting date and time
                    const time= new Date().toLocaleString('fa-IR').split(',')[1]
                    const date= new Date().toLocaleString('fa-IR').split(',')[0]

                    let user = this.userRepository.create({
                        fatherName,
                        identityTraceCode: res.headers['track-code'],
                        gender: (gender == 0) ? false : true
                        , officeName,
                        birthDate,
                        time : time,
                        date : date,
                        identityNumber: identificationNo,
                        identitySeri: identificationSeri,
                        identitySerial: identificationSerial,
                        firstName, lastName, phoneNumber, nationalCode, liveStatus,
                        verificationStatus: VerificationStatus.SUCCESS
                    })
                    let savedUser = await queryRunner.manager.save(user)
                    console.log(savedUser)
                    const wallet = this.walletRepository.create({
                        balance: 0,
                        goldWeight: oldUserData.isExist ? oldUserData.user.wallet.goldWeight : 0,
                        user: savedUser,
                    });
                    // await this.walletRepository.save(wallet)
                    await queryRunner.manager.save(wallet)
                    let token = await this.jwtService.generateToken(savedUser)
                    await queryRunner.commitTransaction()
                    let trackIdData: trackIdInterface = {
                        trackId: res.headers['track-code'],
                        firstName: firstName,
                        lastName: lastName,
                        fatherName: fatherName,
                        phoneNumber: phoneNumber,
                        status: true
                    }
                    let trackIdService = new internalDB()
                    let DBStatus = await trackIdService.saveData(trackIdData)
                    console.log('returned db status>>>>', DBStatus)
                    // let nameFamily = firstName + ' ' + lastName
                    this.smsService.sendGeneralMessage(wallet.user.phoneNumber, "identify", firstName, null, null)

                    monitor.addStatus({
                        scope: 'shahkar controller',
                        status: 1,
                        error: null
                    })
                    return response.json({ user: savedUser, msg: "ثبت نام شما با موفقیت انجام شد", token })
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
                    console.log('returned db status>>>>', DBStatus)

                    monitor.addStatus({
                        scope: 'shahkar controller',
                        status: 0,
                        error: 'خطا در احراز هویت کاربر در اند پوینت شاهکار'
                    })
                    await queryRunner.rollbackTransaction()
                    return response.status(500).json({ err: res.data.details, msg: "خطا در احراز هویت کاربر" })
                } else if (+res.status >= 500) {
                    return response.status(500).json({ msg: 'کاربر گرامی موقتا سیستم احراز هویت ثبت احوال در دسترس نمیباشد.لطفا دقایقی دیگر مجددا تلاش کنید' })
                }
            } catch (error) {
                // console.log(error.response.data.error);
                console.log(`${error}`, 'transAction rollback')
                await queryRunner.rollbackTransaction()

                monitor.addStatus({
                    scope: 'shahkar controller',
                    status: 0,
                    error: error
                })

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
                        return response.status(500).json({ msg: 'کاربر گرامی موقتا سیستم احراز هویت ثبت احوال در دسترس نمیباشد.لطفا دقایقی دیگر مجددا تلاش کنید' })
                    }
                }
                return response.status(500).json({ msg: "خطای داخلی سیستم" })
            } finally {
                console.log('transaction released')
                await queryRunner.release()
            }
        }
    }



    async checkMatchPhoneNumberAndCartNumber(info) {
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
            if (response.status == 200) {
                if (response.data) {
                    return response.data.match
                }
            } else {
                return false
            }
        } catch (error) {
            monitor.error.push(error)
            console.log("error in checkMatchPhoneNumberAndCartNumber", error);
            return false
        }
    }

    async convertCardToSheba(cardNumber) {
        try {
            let body = {
                cardNumber
            }
            let url = "https://drapi.ir/rest/api/main/convertCardToSheba/v1.0/convertcardtosheba"
            let shahkarToken = await this.getToken()
            let res = await axios.post(url, body, { headers: { 'Authorization': shahkarToken } })
            if (res.status == 200) {
                return res.data
            } else {
                return null
            }
        } catch (error) {
            // console.log(error.response)
            monitor.error.push(`error in convertCardToSheba :: ${error.response}`)
            console.log('error in convert to sheba', error.message);
            return null
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
}