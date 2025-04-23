import { AppDataSource } from "../data-source";
import { User } from "../entity/User";
import { NextFunction, Request, Response } from "express"
import { responseModel } from "../util/response.model";
import { Wallet } from "../entity/Wallet";
import { Invoice } from "../entity/Invoice";
import { VerificationStatus } from "../entity/enums/VerificationStatus";
import { WalletTransaction } from "../entity/WalletTransaction";
import { PaymentInfo } from "../entity/PaymentInfo";
import { ZarinPalService } from "../services/zarinpal-service/ZarinPal-service";
import { SmsService } from "../services/sms-service/message-service";
import { GoldPriceService } from "../services/gold-price-service/gold-price-service";
import { validationResult } from "express-validator";
import logger from "../services/interservice/logg.service";
import { EstimateTransactions } from "../entity/EstimateTransactions";
import cacher from "../services/cacher";
import instance from "../util/tradePerision";
import { handleGoldPrice } from "../entity/handleGoldPrice.entity";



export default class adminController {
    private userRepository = AppDataSource.getRepository(User)
    private walletRepository = AppDataSource.getRepository(Wallet)
    private invoicesRepository = AppDataSource.getRepository(Invoice)
    private walletTransActions = AppDataSource.getRepository(WalletTransaction)
    private walletTransactionRepository = AppDataSource.getRepository(WalletTransaction);
    private paymentInfoRepository = AppDataSource.getRepository(PaymentInfo);
    private handleGoldPrice = AppDataSource.getRepository(handleGoldPrice)
    private zpService = new ZarinPalService()
    private interservice = new logger()
    private smsService = new SmsService()
    private goldPriceService = new GoldPriceService()
    private esitmate = AppDataSource.getRepository(EstimateTransactions)
    private loggerService = new logger()


    /**
     * this function is for getting all users
     * @param req 
     * @param res 
     * @param next 
     * @returns 
     */
    async getAllUsers(req: Request, res: Response, next: NextFunction) {
        let queryBuilder = this.userRepository.createQueryBuilder('user')
            .leftJoinAndSelect('user.bankAccounts', 'bankAccounts')
            .leftJoinAndSelect('user.wallet', 'wallet')
            .orderBy('user.id' , 'ASC')
            .where('user.isSystemUser = :bool', { bool: false })
        let users = await queryBuilder.getMany()
        return next(new responseModel(req, res,'' ,'admin service', 200, null, users))
    }


    async getTradePermision(req: Request, res: Response, next: NextFunction){
        // let tradePerimision = await cacher.getter('tradePermision')
        let tradePerimision = await instance.getter()
        console.log( 'trade permision is >>>>', tradePerimision)
        return next(new responseModel(req, res,'' ,'admin service', 200, null, tradePerimision))
    }
        
    async tradePermision(req: Request, res: Response, next: NextFunction){
        // let tradePerimision = await cacher.getter('tradePermision')
        // let tradePerimision = await instance.getter()
        await instance.setter()
        let tradePerimision = await instance.getter()
        console.log(tradePerimision)
        return next(new responseModel(req, res,'' ,'admin service', 200, null, tradePerimision))
    }


    async checkStatus(req: Request, res: Response, next: NextFunction) {
        let status = await this.zpService.getTransActionStatus(req.params.authority)
        let final = '' ;
        if (status == null){
            return next(new responseModel(req, res, '', 'admin service', 200, null, 'شماره پیگیری تراکنش نا معتبر میباشد'))
        }
        if (status.status == 'IN_BANK'){
            final = 'تراکنش در درگاه میباشد'
        }
        if (status.status == 'FAILED'){
            final = 'تراکنش نا موفق'

        }
        if (status.status == 'VERIFIED'){
            final = 'تراکنش موفق'
        }
        if (status.status == 'REVERSED'){
            final = 'تراکنش بازگشت خورده'
            
        }
        if (status.status == 'unknown'){
            final = 'تراکنش نامشخص'
        }

        return next(new responseModel(req, res,'' ,'admin service', 200, null, final))        
    }


    /**
     * this function is for getting user info
     * @param req 
     * @param res 
     * @param next 
     * @returns 
     */
    async getUserInfo(req: Request, res: Response, next: NextFunction) {
        let userId = +req.params.userId;
        let queryBuilder = await this.userRepository.createQueryBuilder('user')
            .leftJoinAndSelect('user.bankAccounts' , 'bankAccounts')
            .leftJoinAndSelect('user.wallet', 'wallet')
            .leftJoinAndSelect('wallet.transactions', 'transactions')
            .leftJoinAndSelect('user.sells', 'sells')
            .leftJoinAndSelect('user.buys', 'buys')
            .where('user.id = :userId', { userId }).getOne()

        // let queryBuilder = await this.userRepository.findOne({where : {
        //     id : userId,            
        // } , relations : ['wallet' , 'wallet.transactions' ,'wallet.transactions.seller' , 'wallet.transactions.buyer' , 'wallet.transactions.type']})
        console.log('returned data', queryBuilder)
        return next(new responseModel(req, res,'' ,'admin service', 200, null, queryBuilder))
    }



    /**
     * this is for getting all wallets for admin
     * @param req 
     * @param res 
     * @param next 
     * @returns 
     */
    async getAllWallet(req: Request, res: Response, next: NextFunction) {
        // let wallet = await this.walletRepository.find({ relations: ['user', 'transactions'] })
        let wallet = await this.walletRepository.createQueryBuilder('wallet')
        .leftJoinAndSelect('wallet.user' , 'user')
        .leftJoinAndSelect('user.bankAccounts' , 'bankAccounts')
        .leftJoinAndSelect('wallet.transactions' , 'transactions')
        .orderBy('wallet.updatedAt' , 'DESC')
        .andWhere('user.isSystemUser = :bool' , {bool : false}).getMany()
        return next(new responseModel(req, res,'' ,'admin service', 200, null, wallet))
    }




    /**
     * this is for get all transActions for admin
     * @param req
     * @param res
     * @param next
     * @returns
     */
    async getAllTransActions(req: Request, res: Response, next: NextFunction) {
        let queryBuilder = this.invoicesRepository.createQueryBuilder('invoice')
            .leftJoinAndSelect('invoice.seller', 'seller')
            .leftJoinAndSelect('invoice.buyer', 'buyer')
            .leftJoinAndSelect('invoice.type', 'type')

        let inits = (await queryBuilder.where('invoice.status = :status', { status: 'init' }).getMany()).reverse()
        let pendings = (await queryBuilder.where('invoice.status = :status', { status: 'pending' }).getMany()).reverse()
        let failed = (await queryBuilder.where('invoice.status = :status', { status: 'failed' }).getMany()).reverse()
        let completed = (await queryBuilder.where('invoice.status = :status', { status: 'completed' }).getMany()).reverse()

        return next(new responseModel(req, res,'' ,'admin service', 200, null, { inits, pendings, failed, completed }))
    }

    

    /**
     * its for getting all  buy transActions
     * @param req 
     * @param res 
     * @param next 
     */
    async getBuyTransAction(req: Request, res: Response, next: NextFunction){
        let type = req.query.type;
        let queryBuilder = this.invoicesRepository.createQueryBuilder('invoice')
            .leftJoinAndSelect('invoice.seller', 'seller')
            .leftJoinAndSelect('invoice.buyer', 'buyer')
            .leftJoinAndSelect('buyer.bankAccounts' , 'bankAccounts')
            .leftJoinAndSelect('invoice.type', 'type')
            .orderBy('invoice.updatedAt', 'DESC')
            .where('invoice.fromPhone = :boolean' , {boolean : false})
            // .where('invoice.status = :status AND type.title = :title' , {status : 'completed' , title : 'buy'})

        let transActions;
        if (type == 0) {
            transActions = await queryBuilder.where('invoice.status = :status AND type.title = :title AND invoice.fromPhone = :boolean AND invoice.tradeType = :trade', { status: 'failed', title: 'buy' , boolean : false , trade : 0}).getMany()
        } else if (type == 1) {
            transActions = await queryBuilder.where('invoice.status = :status AND type.title = :title AND invoice.fromPhone = :boolean AND invoice.tradeType = :trade', { status: 'completed', title: 'buy' , boolean : false , trade : 0}).getMany()
        } else if (type == 2) {
            transActions = await queryBuilder.where('invoice.status = :status AND type.title = :title AND invoice.fromPhone = :boolean AND invoice.tradeType = :trade', { status: 'pending', title: 'buy' , boolean :  false, trade : 0}).getMany()
        }else if(type == 3){
            transActions = await queryBuilder.where('invoice.status = :status AND type.title = :title AND invoice.fromPhone = :boolean AND invoice.tradeType = :trade', { status: 'init', title: 'buy' , boolean : false , trade : 0}).getMany()
        }else{
            return next(new responseModel(req, res,'' ,'admin service', 400 , 'bad request', null))
        }
        return next(new responseModel(req, res,'' ,'admin service', 200, null, transActions))
    }


    /**
     * its for getting all users that have init transactions
     * @param req 
     * @param res 
     * @param next 
     * @returns 
     */
    async getUserForInitTransactions(req: Request, res: Response, next: NextFunction){
        let queryBuilder = this.userRepository.createQueryBuilder('user')
        .leftJoinAndSelect('user.buys' , 'buys')
        .leftJoinAndSelect('user.bankAccounts' , 'bankAccounts')
        .leftJoinAndSelect('user.sells' , 'sells')
        .where('buys.status = :Bstatus OR sells.status = :Bstatus' , {Bstatus : 'init'})

        let users = await queryBuilder.getMany()

        return next(new responseModel(req, res,'' ,'admin service', 200, null, users))
    }


    async getSpecificUserTransAction(req: Request, res: Response, next: NextFunction){
        let userId = req.params.userId;

        let invoices = await this.userRepository.findOne({where : {id : userId} , relations : ['buys' , 'sells' , 'bankAccounts']})

    }




    /**
     * its for getting all sell transactions by admin
     * @param req 
     * @param res 
     * @param next 
     * @returns 
     */
    async getSellTransAction(req: Request, res: Response, next: NextFunction){
        let type = req.query.type;
        let queryBuilder = this.invoicesRepository.createQueryBuilder('invoice')
            .leftJoinAndSelect('invoice.seller', 'seller')
            .leftJoinAndSelect('seller.bankAccounts' , 'bankAccounts')
            .leftJoinAndSelect('invoice.buyer', 'buyer')
            .leftJoinAndSelect('invoice.type', 'type')
            .orderBy('invoice.updatedAt', 'DESC')

        let transActions;
        if (type == 0) {
            transActions = await queryBuilder.where('invoice.status = :status AND type.title = :title', { status: 'failed', title: 'sell' }).getMany()
        } else if (type == 1) {
            transActions = await queryBuilder.where('invoice.status = :status AND type.title = :title', { status: 'completed', title: 'sell' }).getMany()
        } else if (type == 2) {
            transActions = await queryBuilder.where('invoice.status = :status AND type.title = :title', { status: 'pending', title: 'sell' }).getMany()
        }else{
            return next(new responseModel(req, res,'' ,'admin service', 400, 'bad request', null))
        }
        return next(new responseModel(req, res,'' ,'admin service', 200, null, transActions))
    }


    /**
     * this is for the dashboard of pannel
     * @param req 
     * @param res 
     * @param next 
     * @returns 
     */
    async homeData(req: Request, res: Response, next: NextFunction) {
        let queryBuilder = this.invoicesRepository.createQueryBuilder('invoice')
            .leftJoinAndSelect('invoice.seller', 'seller')
            .leftJoinAndSelect('invoice.buyer', 'buyer')
            .leftJoinAndSelect('invoice.type', 'type')

        let successUsers = await this.userRepository.count({
            where: {
                verificationStatus: 0,
                isSystemUser : false
            },
        })

        let failedUsers = await this.userRepository.count({
            where: {
                verificationStatus: 1,
                isSystemUser : false
            }
        })

        let oldUser = await this.interservice.getAllOldUser()
        console.log('ssss' , oldUser)
        failedUsers += oldUser;
        let allUsers = await this.userRepository.count({where :{
            isSystemUser : false
        }})

        allUsers += oldUser;

        let chart = await this.interservice.getChartData()
        console.log('chartData' , chart.data)
        let barChart = chart.data.barChart;

        let lineChart = chart.data.lineChart;

        let pieChart = {
            label :['کاربران احراز شده' , 'کاربران احراز نشده'],
            data : [successUsers , failedUsers]
        }

        let allBuy ;

        let allSell ;

        let weights = await this.esitmate.findOne({where : {date : 'localDate'}})
        console.log('all weights' , weights)
        if (!weights){
            allBuy = 0;
            allSell = 0;
        }
        allBuy = +weights?.boughtGold;
        allSell = +weights?.soldGold

        console.log('all buy>>>', allBuy)
        console.log('all sell>>>', allSell)

        let inits = await queryBuilder.where('invoice.status = :status', { status: 'init' }).getCount()
        let pendings = await queryBuilder.where('invoice.status = :status', { status: 'pending' }).getCount()
        let failed = await queryBuilder.where('invoice.status = :status', { status: 'failed' }).getCount()
        let completed = await queryBuilder.where('invoice.status = :status', { status: 'completed' }).getCount()
        let all = inits + pendings + failed + completed;

        let data = {
            successUsers: successUsers,
            failedUsers: failedUsers,
            allUsers: allUsers,
            pendingsTransactions: pendings,
            failedTransactions: failed,
            completeTransactions: completed,
            allTransActions: all,
            allBuy,
            allSell,
            allWeight: (allBuy + allSell).toFixed(3),
            barChart,
            pieChart,
            lineChart
        }
        return next(new responseModel(req, res,'' ,'admin service', 200, null, data))
    }



    /**
     * get all withdrawalls by admin
     * @param req 
     * @param res 
     * @param next 
     * @returns 
     */
    async getAllWithdrawals(req: Request, res: Response, next: NextFunction) {
        let withdrawalRequests = await this.walletTransActions.find({
            where: {
                status: 'pending',
                type: "withdraw"
            },relations : ['wallet' , 'wallet.user' , 'wallet.user.bankAccounts']
        ,order : {updatedAt : 'DESC'}})

        return next(new responseModel(req, res,'' ,'admin service', 200, null, withdrawalRequests))
    }


    /**
     * this is for geting all pendings deposit that admin must verify by himself
     * @param req 
     * @param res 
     * @param next 
     * @returns 
     */
    async getAllPendingsDeposit(req: Request, res: Response, next: NextFunction) {
        let pendingsDeposits = await this.walletTransActions.find({
            where: {
                status: 'pending',
                type: 'deposit'
            },relations : ['wallet' , 'wallet.user' , 'wallet.user.bankAccounts']
        ,order : {updatedAt : 'DESC'}})
        return next(new responseModel(req, res,'' ,'admin service', 200, null, pendingsDeposits))
    }



    /**
     * this is for getting just succeeded deposit transActions for admin
     * @param req 
     * @param res 
     * @param next 
     * @returns 
     */
    async getAllSucceedDeposit(req: Request, res: Response, next: NextFunction){
        let succeedDposit = await this.walletTransActions.find({where : {
            status : 'completed',
            type : 'deposit' 
        },relations : ['wallet' , 'wallet.user' , 'wallet.user.bankAccounts'],order : {updatedAt : 'DESC'}})
        // let sss = await this.walletTransActions.find()
        // console.log(sss)
        return next(new responseModel(req, res,'' ,'admin service', 200, null, succeedDposit))
    }



    /**
     * this is for getting all succeeded transactions such as withdraws and deposit
     * @param req 
     * @param res 
     * @param next 
     * @returns 
     */
    async getSucceedWithdrawal(req: Request, res: Response, next: NextFunction) {
        let succeedTransActions = await this.walletTransActions.find({
            where: {
                status: 'completed'
            },relations : ['wallet' , 'wallet.user' , 'wallet.user.bankAccounts'],order : {updatedAt : 'DESC'}
        })

        return next(new responseModel(req, res,'' ,'admin service', 200, null, succeedTransActions))
    }



    /**
     * this is for approval the pending transaction
     * @param req 
     * @param res 
     * @param next 
     * @returns 
     */
    async approveWithdrawal(req: Request, res: Response, next: NextFunction) {
        let {withdrawalId} = req.body;
        const error = validationResult(req)
        if (!error.isEmpty()) {
            return next(new responseModel(req, res,'' ,'admin service', 400, error['errors'][0].msg, null))
        }

        let transACtion = await this.walletTransActions.findOne({
            where: {
                id: req.params.transActionId
            }, relations: ['wallet' , 'wallet.user' , 'wallet.user.bankAccounts']
        })

        if (!transACtion) {
            return next(new responseModel(req, res,'' ,'admin service', 400, `the withdraw request not found!`, null))
        }
        const queryRunner = AppDataSource.createQueryRunner()
        await queryRunner.connect()
        await queryRunner.startTransaction()
        try {
            transACtion.status = 'completed';
            transACtion.withdrawalId = withdrawalId;
            console.log('amountssssssssssss' , transACtion.wallet.blocked , transACtion.amount)
            // if (transACtion.wallet.blocked > transACtion.amount){
                // }else{
                //     await queryRunner.rollbackTransaction()
                //     await queryRunner.release()
                //     return next(new responseModel(req, res,'' ,'admin service', 200, 'این تراکنش معتبر نمیباشد', null))
            // }
            transACtion.wallet.blocked -= transACtion.amount;
            transACtion.date = new Date().toLocaleString('fa-IR').split(',')[0]
            transACtion.time = new Date().toLocaleString('fa-IR').split(',')[1]
            let walletUpdated = await queryRunner.manager.save(transACtion.wallet)
            let transaction = await queryRunner.manager.save(transACtion)
            console.log('wallet', walletUpdated)
            console.log('transaction', transaction)
            await queryRunner.commitTransaction()
            await this.smsService.sendGeneralMessage(transACtion.wallet.user.phoneNumber,"approveWithdrawal" ,transACtion.wallet.user.firstName,transACtion.amount ,transACtion.wallet.user.bankAccounts[0].cardNumber)
            await this.loggerService.addNewAdminLog({firstName : req.user.firstName , lastName : req.user.lastName , phoneNumber : req.user.phoneNumber} ,
                 'تایید برداشت' , ` ${req.user.firstName} برداشت کاربر را تایید کرد` , {
                userName : transACtion.wallet.user.firstName,
                lastName : transACtion.wallet.user.lastName,
                amount : transACtion.amount,
                balance : transACtion.wallet.balance
            } , 1) 
            return next(new responseModel(req, res,'' ,'admin service', 200, null, transaction))
        } catch (error) {
            console.log('error occured while trying to approved withdraw', error)
            await queryRunner.rollbackTransaction()
            return next(new responseModel(req, res,'' ,'admin service', 503, `${error}`, null))
        } finally {
            await queryRunner.release()
        }
    }


    /**
     * this endpoint is for handle verifying the pending deposit . . .
     * @param request 
     * @param response 
     * @returns 
     */
    async handleVerifyDeposit(req: Request, res: Response , next : NextFunction) {
        try {
            let { authority
            } = req.body
            const error = validationResult(req)
            if (!error.isEmpty()) {
                console.log(error)
                return next(new responseModel(req, res ,'' ,'admin service', 400, error['errors'][0].msg, null))
            }
            let statusOfTransAction = await this.zpService.getTransActionStatus(authority)
            if (statusOfTransAction.status == 'IN_BANK') {
                return next(new responseModel(req, res, 'تراکنش در درگاه میباشد', 'admin service', 400, 'تراکنش در درگاه میباشد', null))
            }
            else if (statusOfTransAction.status == 'VERIFIED') {
                return next(new responseModel(req, res, 'تراکنش قبلا اعتبار سنجی شده است', 'admin service', 400, 'تراکنش قبلا اعتبار سنجی شده است', null))
            } else if (statusOfTransAction.status == 'REVERSED') {
                return next(new responseModel(req, res, 'تراکنش از سمت درگاه برگشت خورده است', 'admin service', 400, 'تراکنش از سمت درگاه برگشت خورده است', null))
            } else if (statusOfTransAction.status == 'PAID' || statusOfTransAction.status == 'FAILED') {
                console.log('its first entry . . .' , authority)
                let info = { status : 'OK', authority }
                let res2 = await this.zpService.verifyPayment(info)
                const paymentInfo = await this.paymentInfoRepository.findOneByOrFail({ authority: info.authority })
                let queryRunner = AppDataSource.createQueryRunner()
                await queryRunner.connect()
                await queryRunner.startTransaction()
                const savedTransaction = await this.walletTransactionRepository.findOneBy({ id: paymentInfo.invoiceId })
                if (savedTransaction.status != "pending") {
                    await queryRunner.release()
                    return res.status(400).json({ msg: "تراکنش قبلا اعتبارسنجی شده است" })
                }
                if (res2.status == 'unknown'){
                    return res.status(400).json({msg : 'سیستم قادر به اعتبار سنجی تراکنش نمیباشد'})
                }
                let updatedtransaction;
                try {
                    const user = await this.userRepository.findOne({ where: { id: paymentInfo.userId }, relations: { wallet: true, bankAccounts: true } })
                    if (!res2.status) {
                        savedTransaction.status = "failed";                                // set failed transaction status
                        updatedtransaction = await queryRunner.manager.save(savedTransaction)        // save the trasnaction
                        await queryRunner.commitTransaction()
                        await this.loggerService.addNewAdminLog({firstName : req.user.firstName , lastName : req.user.lastName , phoneNumber : req.user.phoneNumber} , 
                            'تایید برداشت' , ` ${req.user.firstName} واریز را به صورت دستی اعتبار سنجی کرد` , {
                            userName : user.firstName,
                            lastName : user.lastName,
                            amount : savedTransaction.amount,
                            balance : user.wallet.balance
                        } , 1) 
    
                        return res.status(200).json({ msg: "تراکنش از جانب بانک رد شد و به لیست تراکنش های نا موفق منتقل شد", transaction: savedTransaction, bank: user.bankAccounts[0].cardNumber })
                    } else if ((res2.status && res2.code == 100 )|| (res2.status && res2.code == 101)) {
                        const currentBalance = +user.wallet.balance;
                        const paymentAmount = +paymentInfo.amount;
                        user.wallet.balance = Math.round(currentBalance + paymentAmount);
                        await queryRunner.manager.save(user.wallet)
                        // await this.walletRepository.save([user.wallet]);
                        savedTransaction.status = "completed";                         // make status completed
                        savedTransaction.invoiceId = res2.data.ref_id
                        updatedtransaction = await queryRunner.manager.save(savedTransaction)
                        // let updatedtransaction = await this.walletTransactionRepository.save(savedTransaction);
                        // let nameFamily = user.firstName +' '+  user.lastName
                        await queryRunner.commitTransaction()
                        // this.smsService.sendGeneralMessage(user.phoneNumber, "deposit", user.firstName, paymentAmount / 10, null)
                        await this.loggerService.addNewAdminLog({firstName : req.user.firstName , lastName : req.user.lastName , phoneNumber : req.user.phoneNumber} , 
                            'تایید برداشت' , ` ${req.user.firstName} واریز را به صورت دستی اعتبار سنجی کرد` , {
                            userName : user.firstName,
                            lastName : user.lastName,
                            amount : paymentAmount,
                            balance : user.wallet.balance
                        } , 1) 
                        
                        return res.status(200).json({ msg: "تراکنش از سمت بانک تایید شد و به لیست تراکنش های موفق اضافه شد.", transaction: updatedtransaction, bank: res2.data.card_pan, referenceId: res2.data.ref_id })
                    }
                } catch (error) {
                    await queryRunner.rollbackTransaction()
                    console.log("error in save transaction status", error);
                    return res.status(500).json({ msg: "خطای داخلی سیستم" });
                } finally {
                    await queryRunner.release()
                }
            }else{
                return next(new responseModel(req, res, 'سیستم قادر به تعیین وضعیت تراکنش نیست', 'admin service', 400, 'سیستم قادر به تعیین وضعیت تراکنش نیست', null))
            }
        } catch (error) {
            console.log("error in verify transaction", error);
            return res.status(500).json({ msg: "خطای داخلی سیستم" });
        }
    }



    /**
     * this function is for handle verifying the transactions
     * @param request 
     * @param response 
     * @returns 
     */
    async handledVerify(req: Request, res: Response, next: NextFunction) {
        try {
            let { authority } = req.body;
            const error = validationResult(req)
            if (!error.isEmpty()) {
                console.log(error)
                return next(new responseModel(req, res, '', 'admin service', 400, error['errors'][0].msg, null))
            }
            let statusOfTransAction = await this.zpService.getTransActionStatus(authority)
            console.log('returned data >>> ' , statusOfTransAction)
            if (statusOfTransAction.status == 'IN_BANK') {
                return next(new responseModel(req, res, 'تراکنش در درگاه میباشد', 'admin service', 400, 'تراکنش در درگاه میباشد', null))
            }
            else if (statusOfTransAction.status == 'VERIFIED') {
                return next(new responseModel(req, res, 'تراکنش قبلا اعتبار سنجی شده است', 'admin service', 400, 'تراکنش قبلا اعتبار سنجی شده است', null))
            } else if (statusOfTransAction.status == 'REVERSED') {
                return next(new responseModel(req, res, 'تراکنش از سمت درگاه برگشت خورده است', 'admin service', 400, 'تراکنش از سمت درگاه برگشت خورده است', null))
            } else if (statusOfTransAction.status == 'PAID' || statusOfTransAction.status == 'FAILED') {
                let res2 = await this.zpService.handledVerify(authority)           // verify in zarinpal
                const paymentInfo = await this.paymentInfoRepository.findOneByOrFail({ authority: authority })   // find the paymentInfo
                const queryRunner = AppDataSource.createQueryRunner()
                await queryRunner.connect()
                await queryRunner.startTransaction()               // start the transAction for database
                let updatedtransaction: any;
                try {
                    const systemUser = await this.userRepository.findOne({ where: { isSystemUser: true }, relations: ["wallet"] });     // get khazane tala
                    let savedTransaction = await this.invoicesRepository.findOne({ where: { id: paymentInfo.invoiceId }, relations: { seller: { wallet: true }, buyer: { wallet: true, bankAccounts: true } } }) // get the transaction that saved in database
                    if (savedTransaction.status != "pending") {
                        console.log('the status was not pending . . .', savedTransaction)
                        // await queryRunner.release()
                        return res.status(400).json({ msg: "تراکنش قبلا اعتبارسنجی شده است" })
                    }
                    if (res2.status == 'unknown'){
                        return res.status(400).json({ msg: "سیستم قادر به اعتبار سنجی تراکنش نمیباشد." })
                    }
                    if (!res2.status) {                                              //!!! if the zarinpal failed the transActions !!!//
                        console.log('the zarinpal failed the transaction', res2)
                        savedTransaction.status = "failed";                                     // just here is for failed . . .
                        updatedtransaction = await queryRunner.manager.save(savedTransaction)       // save the transaction
                        await queryRunner.commitTransaction()
                        await queryRunner.release()                                        // release the transaction
                        console.log('after failed the transaction buy zarinpal>>>', updatedtransaction)
                        return res.status(200).json({ msg: "پرداخت ناموفق", transaction: updatedtransaction, bank: savedTransaction.buyer.bankAccounts[0].cardNumber, response: res2.data })
                    } else if (res2.code && res2.code == 100) {                                                   // if the zarinpal approve the transction
                        const buyerGoldWeight = parseFloat(savedTransaction.buyer.wallet.goldWeight.toString());
                        const transactionGoldWeight = parseFloat(savedTransaction.goldWeight.toString());
                        const systemUserGoldWeight = parseFloat(systemUser.wallet.goldWeight.toString());
                        const systemUserBalance = parseFloat(systemUser.wallet.balance.toString());
                        const transactionTotalPrice = parseFloat(savedTransaction.totalPrice.toString());
                        savedTransaction.buyer.wallet.goldWeight = parseFloat((buyerGoldWeight + transactionGoldWeight).toFixed(3)); // update the gold weight
                        console.log('after updating the goldwaeight', savedTransaction.buyer.wallet.goldWeight)
                        systemUser.wallet.goldWeight = parseFloat((systemUserGoldWeight - transactionGoldWeight).toFixed(3));   // update the system goldWeight
                        console.log('after updating the goldwaeight222222', savedTransaction.buyer.wallet.goldWeight)
                        systemUser.wallet.balance = parseFloat((systemUserBalance + transactionTotalPrice).toFixed(3));             // update the systemuser wallet balance
                        console.log('beforrrrrrrrrrrrr', systemUserBalance)
                        console.log('beforrrrrrrrrrrrr22222222222222', transactionTotalPrice)
                        console.log('come till here . . .<<<<<<<>>>>>>>>>>>>>', systemUser.wallet.balance)
                        await queryRunner.manager.save(savedTransaction.buyer.wallet)                // save the transactions
                        await queryRunner.manager.save(systemUser.wallet)
                        // await this.walletRepository.save([savedTransaction.buyer.wallet, systemUser.wallet]);

                        savedTransaction.status = "completed";                        // change transaction status
                        savedTransaction.invoiceId = res2.data.ref_id
                        await queryRunner.manager.save(savedTransaction)
                        // updatedtransaction = await this.invoiceRepository.save(savedTransaction);
                        // let nameFamily = savedTransaction.buyer.firstName +' '+ savedTransaction.buyer.lastName
                        this.smsService.sendGeneralMessage(savedTransaction.buyer.phoneNumber, "buy", savedTransaction.buyer.firstName, transactionGoldWeight, transactionTotalPrice / 10)
                        console.log('after completed the transactional db>>>', updatedtransaction)
                        await queryRunner.commitTransaction()

                        await this.loggerService.addNewAdminLog({ firstName: req.user.firstName, lastName: req.user.lastName, phoneNumber: req.user.phoneNumber }, 'اعتبار سنجی خرید از درگاه', ` ${req.user.firstName} خرید انلاین را به صورت دستی اعتبار سنجی کرد`, {
                            userName: savedTransaction.buyer.firstName,
                            lastName: savedTransaction.buyer.lastName,
                            amount: savedTransaction.goldWeight,
                            balance: savedTransaction.buyer.wallet.goldWeight
                        }, 1)

                        return res.status(200).json({ msg: "پرداخت موفق", transaction: updatedtransaction, bank: res2.data.card_pan, data: res2.data, referenceID: res2.data?.ref_id })
                    }
                } catch (error) {    // if inner error occured . . .
                    console.log('here is heppend caust we catched error . . .', `${error}`)
                    await queryRunner.rollbackTransaction()            // role back
                    // let savedTransaction = await this.invoiceRepository.findOne({where:{ id : paymentInfo.invoiceId}})
                    // savedTransaction.status = "pending";
                    // await this.invoiceRepository.save(savedTransaction);
                    // let updatedTransAction = await this.invoiceRepository.findOne({ where: { id: paymentInfo.invoiceId }, relations: { seller: { wallet: true }, buyer: { wallet: true, bankAccounts: true } } })
                    // console.log('after catching error in verification>>>>', updatedTransAction)
                    console.log("error in save transaction status and transAction rolledBack  and relaesed . . .", error);
                    return res.status(500).json({ msg: "خطای داخلی سیستم" });
                } finally {
                    await queryRunner.release()
                }
            }
            else {
                return next(new responseModel(req, res, 'سیستم قادر به تعیین وضعیت تراکنش نیست', 'admin service', 400, 'سیستم قادر به تعیین وضعیت تراکنش نیست', null))
            }

        } catch (error) {                   // if outer error catched
            console.log("error in verify transaction", error);
            // let savedTransaction = await this.invoiceRepository.findOne({where : { id : paymentInfo.invoiceId} , relations : { seller : {wallet : true},buyer : {wallet : true, bankAccounts : true}}})
            // console.log('after catching error in verification>>>>' , savedTransaction)
            return res.status(500).json({ msg: "خطای داخلی سیستم", data: { msg: 'system error internal' } });
        }
    }



    async allFailedDeposit(req: Request, res: Response, next: NextFunction){
        let failedDposit = await this.walletTransActions.find({where : {
            status : 'failed',
            type : 'deposit'
        },relations : ['wallet' , 'wallet.user'] , order : {
            updatedAt : 'DESC'
        }})
        return next(new responseModel(req, res,'' ,'admin service', 200, null, failedDposit))
    }



    async setPrice(req: Request, res: Response, next: NextFunction){
        let admin = `${req.user.firstName} ${req.user.lastName}`
        let queryRunner = AppDataSource.createQueryRunner()
        await queryRunner.connect()
        await queryRunner.startTransaction()
        try {
            let handleGold = await this.handleGoldPrice.find()
            let handlePrice = handleGold[0]
            let {price} = req.body
            handlePrice.price = +price
            handlePrice.admin = admin;
            await queryRunner.manager.save(handlePrice)
            await queryRunner.commitTransaction()
            let handleGoldUpdated = await this.handleGoldPrice.find()
            return next(new responseModel(req, res,'قیمت طلا با موفقیت ثبت شد' ,'admin service', 200, null, handleGoldUpdated))
        } catch (error) {
            await queryRunner.rollbackTransaction()
            return next(new responseModel(req, res,'قیمت طلا ثبت نشد.لطفا دقایقی دیگر مجددا تلاش کنید.' ,'admin service', 500, null, null))
        }finally{
            await queryRunner.release()
        }
    }

}