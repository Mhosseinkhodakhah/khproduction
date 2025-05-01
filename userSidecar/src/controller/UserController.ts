import { AppDataSource } from "../data-source"
import { NextFunction, Request, Response } from "express"
import { User } from "../entity/User"
import cacher from "../cacher"
import { response } from "../responseModel/response"
import connection from "../interservice/connection"
import { Invoice } from "../entity/Invoice"
import { EstimateTransactions } from "../entity/EstimateTransactions"
import { goldPrice } from "../entity/goldPrice"
import { Jalali } from 'jalali-ts';
import { WalletTransaction } from "../entity/WalletTransaction"
import { Between, MoreThan } from "typeorm"
import profitService from "../services/makeProfit.service"
import axios from "axios"


export class UserController {

    private readonly userRepository = AppDataSource.getRepository(User)
    private readonly invoiceRepository = AppDataSource.getRepository(Invoice)
    private readonly estimate = AppDataSource.getRepository(EstimateTransactions)
    private readonly goldPrice = AppDataSource.getRepository(goldPrice)
    private readonly walletTransActions = AppDataSource.getRepository(WalletTransaction)
    private interservice = new connection()
    private profitService = new profitService()
    async getAllInvoicesForDjango(req : Request , res : Response , next : NextFunction){
        let invoices = await this.invoiceRepository.find({relations : ['type' , 'buyer' , 'seller'  ] , order : {createdAt : 'DESC'}})
        return next(new response(req, res, 'internal service', 200 , null , invoices))
    }

    async getAllWalletTransactionsForDjango(req : Request , res : Response , next : NextFunction){
        let transActions = await this.walletTransActions.find({relations : ['wallet' , 'wallet.user' , 'wallet.user.bankAccounts' ] , order : {createDate : 'DESC'}})
        return next(new response(req, res, 'internal service', 200 , null , transActions))
    }

    async getAllUserForDjango(req : Request , res : Response , next : NextFunction){
        let allUsers = await this.userRepository.find({where : {isSystemUser : false} , relations : ['wallet' ,'bankAccounts', 'wallet.transactions' , 'sells' , 'buys']})
        return next(new response(req, res, 'internal service', 200 , null , allUsers))
    }

    async getHourlyForDjango(req : Request , res : Response , next : NextFunction){
        let allUsers = await this.userRepository.find({where : {isSystemUser : false} , relations : ['wallet' ,'bankAccounts', 'wallet.transactions' , 'sells' , 'buys']})
        let transActions = await this.walletTransActions.find({ relations : ['wallet' , 'wallet.user' , 'wallet.user.bankAccounts' ] , order : {createDate : 'DESC'}})
        let invoices = await this.invoiceRepository.find({relations : ['type' , 'buyer' , 'seller'  ] , order : {createdAt : 'DESC'}})
        console.log('allUsers' , allUsers)
        console.log('transActions' , transActions)
        console.log('invoices' , invoices)
        return next(new response(req, res, 'internal service', 200 , null , {allUsers , transActions , invoices}))
    }

    async checkUserExistance(req : Request , res : Response , next : NextFunction){
        let exist = await  this.userRepository.exists({where : {
            phoneNumber : req.params.phoneNumber
        }});
        
        let user = null;
        
        if (exist){
            user =await this.userRepository.findOne({where :{
                phoneNumber : req.params.phoneNumber
            },relations:["bankAccounts" , "wallet"]})
        }

        return next(new response(req, res, 'internal service', 200, null, {exist , user}))
    }

    async charts(req: Request, res: Response, next: NextFunction) {
        let barChart = {    
            label: ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'],
            data: [5,4,8,9,6,2,3,6,5,7,11,6]
        }

        let date = []

        for (let i =0 ; i <30 ; i++){
            date.push(i++)
        }

        let lineChart = [{
            label: date,
            data: [5,4,8,9,6,2,3,6,5,7,11,6]
        } , {
            label: date,
            data: [5,4,8,9,6,2,3,6,5,7,11,6]
        }]
        
        try {
            let data = await cacher.getter('pannelCharts')
            // console.log('pannelCharts' , data)
            if (!data){
                data = {
                    barChart,
                    lineChart
                }
            }
            return next(new response(req, res, 'user sideCar service', 200, null, data))            
        } catch (error) {
            console.log(`${error}`)
            let data = {
                barChart,
                lineChart
            }
            return next(new response(req, res, 'user sideCar service', 200, null, data))
        }
    }





    async appCharts(){
        let priceChart = {    
            label: ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'],
            data: [5,4,8,9,6,2,3,6,5,7,11,6]
        }

        try {
            let data = await cacher.getter('appDashboard')
            console.log('appDashboard' , data)
            if (!data){
                data = {
                    priceChart,
                }
            }
            return data            
        } catch (error) {
            console.log(`${error}`)
            let data = {
                priceChart,
            }
            return data
        }
    }

    
     /**
     * its here for home charts in application
     * @param request 
     * @param response 
     * @param next 
     * @returns 
     */
     async applicationCharts(request: Request, response: Response, next: NextFunction) {
         let userId = request.params.id
         console.log('its here for application chart >>>> ')
        let queryBuilder = this.userRepository.createQueryBuilder('user')
            .leftJoinAndSelect('user.buys', 'buys')
            .where('user.id = :id', { id: +userId })
            
        let user = await this.userRepository.findOne({ where: { id: +userId }, relations: ['wallet'] })
        // let buyInMonthData = queryBuilder.andWhere('invoice.createdAt BETWEEN :start AND :end' , {})

        
        let monthlyPrice = await this.appCharts()

        console.log('monthlyChart', monthlyPrice.priceChart)
        
        let livePrice = await this.goldPrice.find({ order: { createdAt: 'DESC' } })
        console.log('livePrice', livePrice[0].Geram18, typeof (livePrice[0].Geram18))
        let gram = (+livePrice[0].Geram18)
        let gold = +user.wallet.goldWeight
        let balance = +user.wallet.balance
        console.log(gram, gold, balance)
        console.log((gram * gold) + balance)
        
        let assets = {
            label: ['دارایی ریالی', 'دارایی طلایی'],
            data: [user.wallet.balance, (user.wallet.goldWeight * gram)]
        }
        
        let georgianMonth = []
        
        
        const jalali = Jalali.now()
        const now = new Date(jalali.valueOf())
        const start = new Date((jalali.valueOf()) - (30*24*60*60*1000))
        console.log('now time>>>' , now)
        console.log('start time>>>' , start)
        // let profit = ''
        // try {
            //     profit = await cacher.getter('profitPerMonth')
        //     console.log('profit is>>' , profit)
        //     let time = new Date().toLocaleString('fa-IR').split(',')[1].split(':')[0]
        //     if (time == '23' || time == '۲۳'){
        //         let invoiceForProfit = await this.invoiceRepository.createQueryBuilder("invoice")
        //             .leftJoinAndSelect('invoice.buyer', 'buyer')
        //             .leftJoinAndSelect('invoice.seller', 'seller')
        //             .leftJoinAndSelect('invoice.type', 'type')
        //             .where('(buyer.id = :userId OR seller.id = :userId) AND invoice.status = :status AND invoice.createdAt >= :today AND invoice.createdAt <= :finaly', { status: 'completed', userId, today: start, finaly: now })
        //             .getMany()
        //         profit = await this.profitService.makeProfit(invoiceForProfit, (user.wallet.goldWeight).toString(), gram.toString())
        //         console.log('cache set ' , profit)
        //         await cacher.setter('profitPerMonth', profit)
        //     }
        //     console.log('cache exist already' , profit)
        // } catch (error) {
        //     console.log(`cache is empty , ${error}`)
        //     let invoiceForProfit = await this.invoiceRepository.createQueryBuilder("invoice")
        //         .leftJoinAndSelect('invoice.buyer', 'buyer')
        //         .leftJoinAndSelect('invoice.seller', 'seller')
        //         .leftJoinAndSelect('invoice.type', 'type')
        //         .where('(buyer.id = :userId OR seller.id = :userId) AND invoice.status = :status AND invoice.createdAt >= :today AND invoice.createdAt <= :finaly', { status: 'completed', userId, today: start, finaly: now })
        //         .getMany()
        //     profit = await this.profitService.makeProfit(invoiceForProfit, (user.wallet.goldWeight).toString(), gram.toString())
        //     console.log('user profit till here . . . ' , profit)
        //     await cacher.setter('profitPerMonth' , profit)
        // }

        
        let topBoxes = { balance: user.wallet.balance, goldWeight: user.wallet.goldWeight, monthlyProfit: 0, totalBalance: ((gram * gold) + balance).toFixed() }
        
        let monthes = ['01',
            '02',
            '03',
            '04',
            '05',
            '06',
            '07',
            '08',
            '09',
            '10',
            '11',
            '12',
        ]

        let buyInMonth = {
            label: ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'],
            data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
        }
        try {
            for (let i = 0; i < monthes.length; i++) {
                let element: string = monthes[i]
                if (+element > 6) {
                    const startJalali = new Date(Jalali.parse(`1404/${element}/1`).gregorian())
                    const endJalali = new Date(Jalali.parse(`1404/${element}/31`).gregorian())
                    console.log('11111', startJalali, endJalali)
                    let allInvoices = await this.invoiceRepository.createQueryBuilder("invoice")
                    .leftJoinAndSelect('invoice.type' , 'type')
                        .where('invoice.status = :status AND type.title = :type' , {status : 'completed' , type : 'buy'})
                        .select("SUM(CAST(invoice.goldWeight AS decimal))", "total")
                        .andWhere("(invoice.buyerId = :userId) AND invoice.createdAt >= :today AND invoice.createdAt <= :finaly", {
                            userId,
                            today: startJalali,
                            finaly: endJalali
                        }).getRawOne();
                    let allSellInvoices = await this.invoiceRepository.createQueryBuilder("invoice")
                        .leftJoinAndSelect('invoice.type', 'type')
                        .where('invoice.status = :status AND type.title = :type', { status: 'completed', type: 'sell' })
                        .select("SUM(CAST(invoice.goldWeight AS decimal))", "total")
                        .andWhere("(invoice.buyerId = :userId) AND invoice.createdAt >= :today AND invoice.createdAt <= :finaly", {
                            userId,
                            today: startJalali,
                            finaly: endJalali
                        }).getRawOne();
                        buyInMonth.data[+element - 1] = (+allInvoices.total - +allSellInvoices.total)
                        console.log('aggregate the fucking monthly buy', allInvoices)

                } else {
                    const startJalali = Jalali.parse(`1404/${element}/1`).gregorian()
                    const endJalali = Jalali.parse(`1404/${element}/30`).gregorian()
                    console.log('22222', startJalali, endJalali)
                    let allInvoices = await this.invoiceRepository.createQueryBuilder("invoice")
                    .leftJoinAndSelect('invoice.type' , 'type')
                        .where('invoice.status = :status AND type.title = :type' , {status : 'completed' , type : 'buy'})
                        .select("SUM(CAST(invoice.goldWeight AS decimal))", "total")
                        .andWhere("(invoice.buyerId = :userId) AND invoice.createdAt >= :today AND invoice.createdAt <= :finaly", {
                            userId,
                            today: startJalali,
                            finaly: endJalali
                        }).getRawOne();
                    let allSellInvoices = await this.invoiceRepository.createQueryBuilder("invoice")
                        .leftJoinAndSelect('invoice.type', 'type')
                        .where('invoice.status = :status AND type.title = :type', { status: 'completed', type: 'sell' })
                        .select("SUM(CAST(invoice.goldWeight AS decimal))", "total")
                        .andWhere("(invoice.buyerId = :userId) AND invoice.createdAt >= :today AND invoice.createdAt <= :finaly", {
                            userId,
                            today: startJalali,
                            finaly: endJalali
                        }).getRawOne();
                    buyInMonth.data[+element - 1] = (+allInvoices.total -  - +allSellInvoices.total)
                    console.log('aggregate the fucking monthly buy', allInvoices)
                }
            }
        } catch (error) {
            console.log('error occured in data aggregation in buy in month', error)
        }
        console.log('app charts is ready . . .')
        return response.status(200).json({ buyInMonth, monthlyPrice: monthlyPrice.priceChart, assets, topBoxes })
    }

    

    async one(request: Request, response: Response, next: NextFunction) {
        const id = parseInt(request.params.id)


        const user = await this.userRepository.findOne({
            where: { id }
        })

        if (!user) {
            return "unregistered user"
        }
        return user
    }

    async save(request: Request, response: Response, next: NextFunction) {
        const { firstName, lastName, age } = request.body;

        const user = Object.assign(new User(), {
            firstName,
            lastName,
            age
        })

        return this.userRepository.save(user)
    }
    
    async test(request: Request, response: Response, next: NextFunction) {
        let all =await this.estimate.find()
        return all;
    }



}