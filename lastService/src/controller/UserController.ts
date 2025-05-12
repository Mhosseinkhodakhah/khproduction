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
import { Wallet } from "../entity/Wallet"
import { convertTradeInvoice } from "../entity/inpersonConvertTrade.entity"
import { productList } from "../entity/producList.entity"
import blackList from "../util/blackList"
import { oldUserService } from "../services/oldUser.service"
import { redisCache } from "../services/redis.service"


export class UserController {
    private userRepository = AppDataSource.getRepository(User)
    private invoiceRepository = AppDataSource.getRepository(Invoice)
    private walletRepository=AppDataSource.getRepository(Wallet)
    private productLists = AppDataSource.getRepository(productList)
    private redis = new redisCache()
    private oldUSerService = new oldUserService()
    
    private goldPrice = AppDataSource.getRepository(goldPrice)
    private convertInvoice = AppDataSource.getRepository(convertTradeInvoice)
    private interservice = new logger()
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
        const phoneNumber =request.params.phoneNumber
        try {
            const userToRemove = await this.userRepository.findOne({where : {phoneNumber:phoneNumber},relations:[ "wallet" , 'buys' , 'sells']})
            if (!userToRemove) {
                return response.status(404).json({ err: "User with this id not found" })
            }

            // let producList = await this.productLists.find()
            // await this.productLists.remove(producList)

            // let all = await this.convertInvoice.find()

            // await this.convertInvoice.remove(all)

            // await this.convertInvoice.remove(userToRemove.convertSells)
            // await this.convertInvoice.remove(userToRemove.convertBuys)
            await this.invoiceRepository.remove(userToRemove.sells)
            await this.invoiceRepository.remove(userToRemove.buys)
            // await this.walletRepository.remove(userToRemove.wallet)
            await this.userRepository.remove(userToRemove)
            
            // const wallet=await this.walletRepository.findOne({where:{
            //     user:userToRemove
            // }})
            // if (!wallet) {
            //     return response.status(404).json({ err: "wallet with this id not found" })
            // }
            // const walletTransaction=await this.walletTransactionRepository.find({where:{
            //     wallet
            // }})
            // const invoices=await this.invoiceRepository.find({where:[{seller:userToRemove},{buyer:userToRemove}]})
            // const bankAccount=await this.bankAccountRepository.find({where:{owner:userToRemove}})
            // await this.bankAccountRepository.remove(bankAccount)
            // await this.walletTransactionRepository.remove(walletTransaction)
            // console.log("walletT");
            
            // await this.invoiceRepository.remove(invoices)
            console.log("invoice");
            
            // await this.walletRepository.remove(wallet)
            // console.log("wallet");
            
            // await this.userRepository.remove(userToRemove)
            console.log("finaly");
            
            return response.json({ msg: "user has been removed" })

        } catch (error) {
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


    // async userAndOld(request: Request, response: Response, next: NextFunction){
    //     let users = await this.userRepository.find()
    //     let allFuckedUps = []
    //     for (let i of users){
    //         const oldUserData = await this.oldUSerService.checkExistAndGetGoldWallet(i.phoneNumber, i.nationalCode)
    //         if (oldUserData == 500) {
    //             return response.status(500).json({ msg: 'کاربر گرامی سیستم احراز هویت در دسترس نمی باشد.' })
    //         }
    //         if (oldUserData.success){
    //             allFuckedUps.push(oldUserData.data)
    //         }
    //         console.log("oldUserData", oldUserData);
    //     }

    //     return response.status(200).json({
    //         fuckedUps : allFuckedUps
    //     })
        
    // }

    async logOut(request: Request, response: Response, next: NextFunction) {
        let blackList : any = await this.redis.getter('blackList')
        if (!blackList){
            let data = []
            data.push(request.headers.authorization)
            await this.redis.setter('blackList' , data)    
        }else {
            await this.redis.deleter('blackList')
            blackList.push(request.headers.authorization)
            await this.redis.setter('blackList' , blackList)
        }

        return response.status(200).json({
            token: request.headers.authorization
        })
    }


}