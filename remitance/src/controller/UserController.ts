import { AppDataSource } from "../data-source"
import { LastService } from "../services/intrnal-service/lastService-serivce"
import { ShahkarService } from "../services/shahkar-service/shahkar-service"
import { NextFunction, Request, Response } from "express"
import { User } from "../entity/User"
import { Wallet } from "../entity/wallet"
import { response } from "../responseModel/response.model";
import { validationResult } from "express-validator"
import monitor from "../responseModel/statusMonitor"
import { Remmitance } from "../entity/Remmitance"


export class UserController {

    private userRepository = AppDataSource.getRepository(User)
    private walletRepository = AppDataSource.getRepository(Wallet)
    private lastServiceService = new LastService()
    private shakarService = new ShahkarService()
    private remittanceRepository = AppDataSource.getRepository(Remmitance)
    
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
            let user = await this.userRepository.findOne({
                where: {
                    phoneNumber
                }
            })
            if (user) {
                return next(new response(req, res, 'checkIdentity', 200, null, { userExist: true, userVerified: true, user: user }))
            } else {
                const resultFromLastService = await this.lastServiceService.checkExistUserInLastService(phoneNumber)
                console.log('response for user>>>>>>>', resultFromLastService)
                if (resultFromLastService.exist) {
                    const userInfo = resultFromLastService.user
                    let wallet = this.walletRepository.create({ goldWeight: resultFromLastService.user.wallet.goldWeight, balance: resultFromLastService.user.wallet.balance })
                    console.log(wallet)
                    const user = this.userRepository.create({
                        fatherName: userInfo.fatherName,
                        gender: userInfo.gender,
                        officeName: userInfo.officeName,
                        birthDate: userInfo.birthDate,
                        identityNumber: userInfo.identityNumber,
                        identitySeri: userInfo.identitySeri,
                        identitySerial: userInfo.identitySerial,
                        firstName: userInfo.firstName,
                        lastName: userInfo.lastName,
                        nationalCode: userInfo.nationalCode,
                        phoneNumber: phoneNumber,
                        liveStatus: userInfo.liveStatus,
                        verificationStatus: 1,
                        verificationType: 0,
                        fullName: `${userInfo.firstName} ${userInfo.lastName}`,
                        wallet
                    })
                    await this.userRepository.save(user)
                    return next(new response(req, res, 'checkIdentity', 200, null, { userExist: true, userVerified: true, user: resultFromLastService.user }))
                } else {
                    return next(new response(req, res, 'checkIdentity', 200, null, { userExist: false, userVerified: false, user: {} }))
                }
            }


            //     if (resultFromLastService.exist && !user) {
            //     const userInfo=resultFromLastService.user
            //     let wallet = this.walletRepository.create({ goldWeight:resultFromLastService.user.wallet.goldWeight , balance:resultFromLastService.user.wallet.balance})
            //     const user= this.userRepository.create({
            //         fatherName:userInfo.fatherName,
            //         gender:userInfo.gender,
            //         officeName:userInfo.officeName,
            //         birthDate:userInfo.birthDate,
            //         identityNumber:userInfo.identityNumber,
            //         identitySeri:userInfo.identitySeri,
            //         identitySerial:userInfo.identitySerial,
            //         firstName:userInfo.firstName,
            //         lastName:userInfo.lastName,
            //         nationalCode:userInfo.nationalCode,
            //         phoneNumber:phoneNumber,
            //         liveStatus:userInfo.liveStatus,
            //         verificationStatus:1,
            //         verificationType:0,
            //         fullName:`${userInfo.firstName} ${userInfo.lastName}`,
            //         wallet
            //     })
            //     await this.userRepository.save(user)
            // }

            // if(resultFromLastService.exist){
            //     return next(new response(req, res, 'checkIdentity', 200, null, {userExist:true, userVerified: true ,user:resultFromLastService.user}))
            // }
        }
        catch (err) {
            console.log(err);
            return next(new response(req, res, 'checkIdentity', 500, 'مشکل داخلی سرویس یوزر', null))
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
            return next(new response(req, res, 'approve new user', 400, bodyError['errors'][0].msg, null))
        }
        let { phoneNumber, birthDate, nationalCode } = req.body
        console.log(req.body);

        try {
            const resultFromLastService = await this.lastServiceService.checkExistUserInLastService(phoneNumber)
            if (resultFromLastService.exist) {
                console.log("im delete this");
                return next(new response(req, res, 'approve new User', 400, "کاربر در سیست وجود دارد", resultFromLastService.user))
            }

            const resultMatch = await this.shakarService.checkMatchOfPhoneAndNationalCode(phoneNumber, nationalCode)
            const isMatch = resultMatch ? true : false
            console.log("isMatch", isMatch);

            if (!isMatch) {
                return next(new response(req, res, 'approve new user', 400, "شماره تلفن و شماره ملی باهم مطابقت ندارد", null))
            }


            console.log("after Is Match");

            const userInfo = await this.shakarService.identityInformationOfUser(phoneNumber, birthDate, nationalCode)
            if (!userInfo) {
                return next(new response(req, res, 'approve new user', 400, " مشکلی در استعلام اطلاعات کاربر رخ داده است لطفا از درست بودن اطلاعات اطمینان حاصل کنید", null))
            }

            console.log("after get user info");

            let wallet = this.walletRepository.create({ goldWeight: 0, balance: 0 })
            const user = this.userRepository.create({
                fatherName: userInfo.fatherName,
                gender: userInfo.gender,
                officeName: userInfo.officeName,
                birthDate: userInfo.birthDate,
                identityNumber: userInfo.identityNumber,
                identitySeri: userInfo.identitySeri,
                identitySerial: userInfo.identitySerial,
                firstName: userInfo.firstName,
                lastName: userInfo.lastName,
                nationalCode: userInfo.nationalCode,
                phoneNumber: phoneNumber,
                liveStatus: userInfo.liveStatus,
                verificationStatus: userInfo.verificationStatus,
                verificationType: 0,
                identityTraceCode: userInfo.identityTraceCode,
                fullName: `${userInfo.firstName} ${userInfo.lastName}`,
                wallet
            })
            
            console.log("after create in local data base");
            
            delete user.id
            delete user.wallet.id
            const result = await this.lastServiceService.sendUserDataToMainService(user)

            console.log("after interservice");

            console.log("result", result);

            if (!result.data) {
                console.log("here", result.data);
                user.verificationStatus = 2
                await this.userRepository.save(user)
                return next(new response(req, res, 'approve new user', result.response.status, result.response.data.error, null))
            }
            //! internalRequest 
            delete user.identityTraceCode
            console.log("after every thing done");
            await this.userRepository.save(user)

            return next(new response(req, res, 'approve new user', 200, null, result.data.data))

        } catch (err) {
            console.log("errr", err);
            return next(new response(req, res, 'approve new User', 500, 'مشکل داخلی سرویس یوزر', null))
        }
    }

    async deleteUserWithPhoneNumber(req: Request, res: Response, next: NextFunction) {
        const { phoneNumber } = req.body
        const user = await this.userRepository.findOne({ where: { phoneNumber } , relations : ['wallet' , 'buys' , 'sells'] })

        if (!user) {
            return next(new response(req, res, 'deleteUser', 400, "کاربر در سیستم وجود ندارد", null))
        }
        await this.remittanceRepository.remove(user.buys)
        await this.remittanceRepository.remove(user.sells)
        await this.walletRepository.remove(user.wallet)
        await this.userRepository.remove(user)
        res.status(200).json({ success: true })
    }


}   