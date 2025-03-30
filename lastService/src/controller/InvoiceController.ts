import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";
import { Invoice } from "../entity/Invoice";
import { Wallet } from "../entity/Wallet";
import { startOfDay } from "date-fns";
import { MoreThanOrEqual } from "typeorm";
import { InvoiceType } from "../entity/InvoiceType";
import { ZarinPalService } from "../services/zarinpal-service/ZarinPal-service";
import { PaymentInfo } from "../entity/PaymentInfo";
import { formatGoldWeight } from "../util/HelperFunctions";
import { SmsService } from "../services/sms-service/message-service";
import {RemmitanceService} from "../services/interservice/remmitance.service"
import {v4 as uuidv4} from 'uuid';
import { EstimateTransactions } from "../entity/EstimateTransactions";
import { time } from "console";
import { validationResult } from "express-validator";
import { goldPrice } from "../entity/goldPrice";


export class InvoiceController {
    private userRepository = AppDataSource.getRepository(User);
    private invoiceRepository = AppDataSource.getRepository(Invoice);
    private walletRepository = AppDataSource.getRepository(Wallet);
    private invoiceTypeRepository = AppDataSource.getRepository(InvoiceType)
    private zpService = new ZarinPalService()
    private paymentInfoRepository = AppDataSource.getRepository(PaymentInfo)
    private smsService = new SmsService()
    private goldPriceRepo = AppDataSource.getRepository(goldPrice)
    private estimate = AppDataSource.getRepository(EstimateTransactions)
    private remmitanceService=new RemmitanceService()

    validateRequiredFields(fields: Record<string, any>): string | null {
        const missingFields = Object.keys(fields).filter(key => fields[key] === undefined || fields[key] === null);
        if (missingFields.length > 0) {
            return `Missing required fields: ${missingFields.join(", ")}`;
        }
        return null;
    }


    private async generateInvoice(){
        return (new Date().getTime()).toString()
    }
    
    private async estimateWeight(goldWeight: number, type: number) {
        try {
            if (type == 0) {
                let month = new Date().toLocaleString('fa-IR').split(",")[0].split("/")[1]
                console.log('monthhhhh' , +month)
                let monthEstimate = await this.estimate.exists({where : {
                    month : month
                }})
                if (monthEstimate){
                    let exEstimate1 =  await this.estimate.findOne({where : {
                        month : month
                    }})
                    exEstimate1.soldGold = (parseFloat(((+exEstimate1.soldGold) + goldWeight).toFixed(3))).toString()
                    await this.estimate.save(exEstimate1)
                }else{
                    let newMonth = this.estimate.create({month : month , boughtGold : '0' , soldGold : ((goldWeight).toFixed(3)).toString()})
                    await this.estimate.save(newMonth)
                }
                let estimate2 = await this.estimate.exists({
                    where: {
                        date: new Date().toLocaleString("fa-IR").split(",")[0]
                    }
                })
                let totalEstimate = await this.estimate.findOne({
                    where: {
                        date: 'localeDate'
                    }
                })
                totalEstimate.soldGold = (parseFloat(((+totalEstimate.soldGold) + goldWeight).toFixed(3))).toString()
                await this.estimate.save(totalEstimate)
                if (estimate2) {
                    let exEstimate = await this.estimate.findOne({
                        where: {
                            date: new Date().toLocaleString("fa-IR").split(",")[0]
                        }
                    })
                    exEstimate.soldGold = (parseFloat(((+exEstimate.soldGold) + goldWeight).toFixed(3))).toString()
                    await this.estimate.save(exEstimate)
                } else {
                    let estimate2 = this.estimate.create({
                        date: new Date().toLocaleString("fa-IR").split(",")[0],
                        boughtGold: '0', soldGold: (parseFloat(((goldWeight).toFixed(3))).toString())
                    })
                    await this.estimate.save(estimate2)
                }
            }
            if (type == 1) {
                let month = new Date().toLocaleString('fa-IR').split(",")[0].split("/")[1]
                let monthEstimate = await this.estimate.exists({where : {
                    month : month
                }})
                console.log('month for creation' , monthEstimate)
                
                if (monthEstimate){
                console.log('month for creation 1')

                    let monthT = await this.estimate.findOne({where : {
                        month : month
                    }})
                    monthT.boughtGold = (parseFloat(((+monthT.boughtGold) + goldWeight).toFixed(3))).toString()
                    await this.estimate.save(monthT)
                }else{
                console.log('month for creation2')

                    let newMonth =  this.estimate.create({month : month , boughtGold : ((goldWeight).toFixed(3)).toString() , soldGold : '0'})
                    await this.estimate.save(newMonth)
                }
    
                let estimate2 = await this.estimate.exists({
                    where: {
                        date: new Date().toLocaleString("fa-IR").split(",")[0]
                    }
                })
                let totalEstimate = await this.estimate.findOne({
                    where: {
                        date: 'localeDate'
                    }
                })
                totalEstimate.boughtGold = (parseFloat(((+totalEstimate.boughtGold) + goldWeight).toFixed(3))).toString()
                await this.estimate.save(totalEstimate)
                if (estimate2) {
                    let exEstimate = await this.estimate.findOne({
                        where: {
                            date: new Date().toLocaleString("fa-IR").split(",")[0]
                        }
                    })
                    exEstimate.boughtGold = (parseFloat(((+exEstimate.boughtGold) + goldWeight).toFixed(3))).toString()
                    await this.estimate.save(exEstimate)
                } else {
                    let estimate2 = this.estimate.create({
                        date: new Date().toLocaleString("fa-IR").split(",")[0],
                        boughtGold: (parseFloat((goldWeight).toFixed(3))).toString(),
                        soldGold: '0'
                    })
                    await this.estimate.save(estimate2)
                }
            }
            return true
        } catch (error) {
            console.log('error>>>>' , error)
            return false
        }
    }

    async fetchUsers(userRepository: any, userId: string) {
        const user = await userRepository.findOne({
            where: { id: userId },
            relations: ["wallet", "bankAccounts"],
        });
        const systemUser = await userRepository.findOne({
            where: { isSystemUser: true },
            relations: ["wallet"],
        });
        if (!user || !systemUser) {
            throw new Error("User or system account not found.");
        }
        return { user, systemUser };
    }

    async ensureWalletsExist(walletRepository: any, user: any, systemUser: any) {
        if (!user.wallet) {
            user.wallet = new Wallet();
            user.wallet.user = user;
            user.wallet.goldWeight = 0;
            user.wallet.balance = 0;
            await walletRepository.save(user.wallet);
        }
        if (!systemUser.wallet) {
            systemUser.wallet = new Wallet();
            systemUser.wallet.user = systemUser;
            systemUser.wallet.goldWeight = 0;
            systemUser.wallet.balance = 0;
            await walletRepository.save(systemUser.wallet);
        }
    }

    async checkDailyLimits(invoiceRepository: any, userId: string, goldWeight: number) {
        // const today = startOfDay(new Date()).toISOString();
        let today = `${new Date().toISOString().split('T')[0]}T00:00:00.645Z`
        
        console.log("today",today);
        
        let transactionsToday =await invoiceRepository.createQueryBuilder('invoice')
        .leftJoinAndSelect('invoice.buyer' , 'buyer')
        .where('invoice.fromGateway = :bool AND status != :status AND invoice.createdAt >= :today' , {bool : true , status : 'init' ,  today : today})
        .andWhere('buyer.id = :id' , {id : userId})
        .getMany()

        let totalGoldToday = 0;

        transactionsToday.forEach((element) => {
            totalGoldToday += (+element.goldWeight)
            console.log('its for limitation weight' , totalGoldToday)
        });

        console.log(transactionsToday.length)
        

        // const transactionsToday = await invoiceRepository.count({
        //     where: [
        //         { buyer: { id: userId }, createdAt: MoreThanOrEqual(today) },
        //         { seller: { id: userId }, createdAt: MoreThanOrEqual(today) },
        //     ],
        // });
        // console.log('trtrtrtr' , transactionsToday)
        // const totalGoldToday = await invoiceRepository
        //     .createQueryBuilder("invoice")
        //     .select("SUM(CAST(invoice.goldWeight AS decimal))", "total")
        //     .where("(invoice.buyerId = :userId AND invoice.fromGateway = :bool AND invoice.status != :status) AND invoice.createdAt >= :today", {
        //         userId,
        //         today,
        //         status : 'init'
        //     }).getRawOne();
        console.log('trtrtrtr' , totalGoldToday)
        if (transactionsToday.length >= 5 || (+totalGoldToday) + (+goldWeight) > 10 ) {
            return "میزان معامله از سقف معاملات در روز بیشتر است";
        }
        return null
    }

    async createTransaction(request: Request, response: Response) {
        let { goldPrice, goldWeight, type, totalPrice } = request.body;
        try {
            let realGoldPrice = await this.goldPriceRepo.find({order : {createdAt : 'DESC'}})
            const realGoldPrice2 = +realGoldPrice[0].Geram18
            console.log('price>>>' , realGoldPrice2 , (+goldPrice))   
            console.log('weight>>>' , (realGoldPrice2*(+goldWeight)) , totalPrice)
            // console.log('total' , totalPrice , typeof(totalPrice))
            if ((totalPrice.toString()).split('').length > 10){
                return response.status(400).json({ msg: 'مبلغ بیش از حد مجاز' });
            }
            if ( +goldWeight < 0.01){
                return response.status(400).json({ msg: 'میزان طلای درخاستی نمی تواند کمتر از 0.01 باشد' });
            }
            if (+goldWeight > 10){
                return response.status(400).json({ msg: 'حداکثر میزان مجاز خرید در هر روز 10 گرم میباشد' });
            }
            if (goldWeight == '0' || goldPrice == '0' || totalPrice == '0' ){
                return response.status(400).json({ msg: 'لطفا مقادیر درست را وارد کنید' });
            }
            const userId = request.user_id;
            const validationError = this.validateRequiredFields({ goldPrice, goldWeight, type });
            // برای انجام معامله ابتدا کارت بانکی خود را ثبت کنید
            if (validationError) {
                return response.status(400).json({ msg: validationError });
            }
            if (!["buy", "sell"].includes(type)) {
                return response.status(400).json({ msg: "Invalid transaction type." });
            }
            const { user, systemUser } = await this.fetchUsers(this.userRepository, userId);
            // let user = await this.userRepository.findOne()
            await this.ensureWalletsExist(this.walletRepository, user, systemUser);
            if (!user.isHaveBank && (user.bankAccounts || user.bankAccounts.length > 0)) {
                const hasVerifiedAccount = user.bankAccounts.some(account => account.isVerified);
                if (!hasVerifiedAccount) {
                    return response.status(400).json({ msg: "برای انجام معامله ابتدا کارت بانکی خود را ثبت کنید" });
                }
            }
            console.log('walletIs' , user.wallet)
            if (type === "buy") {
                if (realGoldPrice2 - (+goldPrice) >= 10000){
                    console.log('condition1')
                    goldPrice = realGoldPrice2
                    // return response.status(400).json({ msg: 'امکان ثبت معامله در این قیمت وجود ندارد' });
                }
                if (((realGoldPrice2*(+goldWeight)) - (+totalPrice)) >= (10*(+goldWeight))){
                    console.log('condition2')
                    totalPrice = realGoldPrice2*(+goldWeight)
                    // return response.status(400).json({ msg: 'امکان ثبت معامله در این قیمت وجود ندارد' });
                }
                let limitError = await this.checkDailyLimits(this.invoiceRepository, userId, goldWeight);
                if (limitError) {
                    return response.status(400).json({ msg: limitError });
                }
            }
            console.log('body>>>>>' , goldPrice, goldWeight, type, totalPrice )
            goldWeight = formatGoldWeight(goldWeight)
            console.log('start the transaction',goldWeight)
            const queryRunner = AppDataSource.createQueryRunner()
            await queryRunner.connect()
            await queryRunner.startTransaction()
            let savedTransaction: any;
            try {
                const invoiceType = await this.invoiceTypeRepository.findOneBy({ title: type });
                const transaction = this.invoiceRepository.create({                                    // here is the making the transActions
                    goldPrice: parseFloat(goldPrice),
                    goldWeight: parseFloat(goldWeight),
                    totalPrice: Math.floor(+totalPrice),
                    seller: type === "buy" ? systemUser : user,
                    buyer: type === "buy" ? user : systemUser,
                    fromGateway : true,
                    type: invoiceType,
                    time: new Date().toLocaleString('fa-IR').split(',')[1],
                    date: new Date().toLocaleString('fa-IR').split(',')[0],
                    status: "init",
                });
                savedTransaction = await queryRunner.manager.save(transaction)
                await queryRunner.commitTransaction()
                return response.status(201).json({
                    msg: "Transaction created successfully",
                    transactionId: savedTransaction.id,
                    wallet: user.wallet,
                });
            } catch (error) {
                console.log('transaction failed>>>>>>' , error)
                await queryRunner.rollbackTransaction()
                return response.status(503).json({
                    msg: "Transaction created failed",
                    // transactionId: savedTransaction.id,
                    wallet: user.wallet,
                });
            } finally {
                console.log('transaction released')
                await queryRunner.release()
                console.log('first transAction>>>>>>', savedTransaction);
            }

        } catch (error) {
            console.error("Transaction creation error:", error);
            return response.status(500).json({ msg: "خطای داخلی سیستم" });
        }
    }


    async completeBuyTransaction(request: Request, response: Response) {
        try {
            const { invoiceId, amount, isFromWallet } = request.body;
            const validationError = this.validateRequiredFields({ invoiceId, amount, isFromWallet });
            if (validationError) {
                return response.status(400).json({ msg: validationError });
            }
            const createdInvoice = await this.invoiceRepository.findOne({
                where: { id: invoiceId },
                relations: { seller: { wallet: true }, buyer: { wallet: true, bankAccounts: true } },
            });
            if (!createdInvoice) {
                return response.status(404).json({ err: "سند یافت نشد" });
            }

            const systemUser = await this.userRepository.findOne({            //  what is system user
                where: { isSystemUser: true },
                relations: ["wallet"],
            });

            if (isFromWallet) {
                console.log('check check check ...............', typeof (createdInvoice.buyer.wallet.balance), createdInvoice.buyer.wallet.balance)
                console.log('check check check ...............', typeof (createdInvoice.totalPrice), createdInvoice.totalPrice)
                if (+createdInvoice.buyer.wallet.balance < +createdInvoice.totalPrice) {
                    // should we failed the transaction???
                    return response.status(400).json({ msg: "موجودی کیف پول کافی نیست" });
                }
                const queryRunner = AppDataSource.createQueryRunner()
                await queryRunner.connect()
                await queryRunner.startTransaction()
                let savedTransaction;
                try {
                    const buyerGoldWeight = parseFloat(createdInvoice.buyer.wallet.goldWeight.toString());
                    const buyerBalance = parseFloat(createdInvoice.buyer.wallet.balance.toString());
                    const systemUserGoldWeight = parseFloat(systemUser.wallet.goldWeight.toString());
                    const systemUserBalance = parseFloat(systemUser.wallet.balance.toString());
                    const invoiceGoldWeight = parseFloat(createdInvoice.goldWeight.toString());
                    const invoiceTotalPrice = parseFloat(createdInvoice.totalPrice.toString());

                    createdInvoice.buyer.wallet.goldWeight = parseFloat((buyerGoldWeight + invoiceGoldWeight).toFixed(3));
                    createdInvoice.buyer.wallet.balance = Math.round(buyerBalance - invoiceTotalPrice);

                    systemUser.wallet.goldWeight = parseFloat((systemUserGoldWeight - invoiceGoldWeight).toFixed(3));
                    systemUser.wallet.balance = Math.round(systemUserBalance + invoiceTotalPrice);

                    // await this.walletRepository.save([createdInvoice.buyer.wallet, systemUser.wallet]);
                    let wallet = await queryRunner.manager.save(createdInvoice.buyer.wallet)
                    let wallet2 = await queryRunner.manager.save(systemUser.wallet)
                    console.log('wallet1', wallet)
                    console.log('wallet1', wallet2)
                    createdInvoice.status = "completed";
                    createdInvoice.invoiceId = await this.generateInvoice();
                    createdInvoice.invoiceId = await this.generateInvoice();
                    // const savedTransaction = await this.invoiceRepository.save(createdInvoice);
                    savedTransaction = await queryRunner.manager.save(createdInvoice)
                    await queryRunner.commitTransaction()
                    console.log('coomplete buy from wallet', savedTransaction)
                    await this.estimateWeight(invoiceGoldWeight, 1)
                    return response.status(200).json({
                        msg: "معامله با موفقیت انجام شد.",
                        transaction: savedTransaction,
                        isFromWallet,
                    });
                } catch (error) {
                    console.log('error occured in database . . .')
                    await queryRunner.rollbackTransaction()
                    return response.status(200).json({
                        msg: "معامله ایجاد نشد . . .",
                        // transaction: savedTransaction,
                        isFromWallet,
                    });
                } finally {
                    console.log('transaction released')
                    await queryRunner.release()
                }
            } else {                                   // buy with the zarinpal
                const info = {
                    description: "خرید طلای اب شده",
                    amount,
                    userId: createdInvoice.buyer.id,
                    invoiceId: createdInvoice.id,
                    callback_url: 'https://khanetala.ir/goldBox',
                    cardPan: createdInvoice.buyer.bankAccounts[0].cardNumber,
                    phoneNumber: createdInvoice.buyer.phoneNumber
                };
                console.log('>>>>>>>>>for javad', info.cardPan)
                // console.log('amount>>>>>><<<<<<<<<<<>>>>>>>>>' , amount)
                // console.log(Math.floor(amount))
                const url = await this.zpService.initiatePayment(info);              // get dargah url from zarinpal
                const queryRunner = AppDataSource.createQueryRunner()
                await queryRunner.connect()
                await queryRunner.startTransaction()
                let updated : any;
                try {
                    createdInvoice.status = 'pending';
                    createdInvoice.authority = url.authority;
                    createdInvoice.invoiceId = await this.generateInvoice();
                    updated = await queryRunner.manager.save(createdInvoice);
                    await queryRunner.commitTransaction()
                    console.log('coomplete buy from zarinpal', updated)
                    return response.status(200).json({
                        msg: "Redirecting to payment gateway...",
                        paymentUrl: url.url,
                        invoiceId: createdInvoice.id,
                        isFromWallet,
                    });
                } catch (error) {
                    await queryRunner.rollbackTransaction()
                    console.log('transACtion failed in database in part complete transACtion>>>' , updated)
                    return response.status(502).json({
                        msg: "Redirecting to payment gateway failed",
                        // paymentUrl: url.url,
                        invoiceId: createdInvoice.id,
                        isFromWallet,
                    });
                }finally{
                    console.log('transAction completed>>>>' , updated)
                    await queryRunner.release()
                }
            }
        } catch (error) {
            console.error("Error in complete transaction:", error);
            // const createdInvoice = await this.invoiceRepository.findOne({
            //     where: { id: request.body.invoiceId },
            //     relations: { seller: { wallet: true }, buyer: { wallet: true , bankAccounts : true } },
            // });
            // console.log('after catch error in complete buy , , ,' , createdInvoice)            
            return response.status(500).json({ msg: "خطای داخلی سیستم" });
        }
    }

    async completeSellTransaction(request: Request, response: Response) {
        const { invoiceId } = request.body;
        try {
            const userId = request.user_id;
            const validationError = this.validateRequiredFields({ invoiceId });
            if (validationError) {
                return response.status(400).json({ msg: validationError });
            }
            const createdInvoice = await this.invoiceRepository.findOne({
                where: { id: invoiceId },
                relations: { seller: { wallet: true }, buyer: { wallet: true } },
            });
            const { user, systemUser } = await this.fetchUsers(this.userRepository, userId);
            console.log('wallet>>>>' , user.wallet.goldWeight , typeof(user.wallet.goldWeight))
            console.log('sellll>>>>' , createdInvoice.goldWeight , typeof(createdInvoice.goldWeight))
            if (+user.wallet.goldWeight < +createdInvoice.goldWeight) {
                createdInvoice.status = 'failed';
                let updated = await this.invoiceRepository.save(createdInvoice)
                console.log('after failed in complete sell>>>', updated)
                return response.status(400).json({
                    code: "1102",
                    msg: "موجودی صندوق طلا کافی نیست.",
                });
            }
            const queryRunner = AppDataSource.createQueryRunner()
            await queryRunner.connect()
            await queryRunner.startTransaction()
            let savedTransaction : any;
            try {
                const systemUserGoldWeight = parseFloat(systemUser.wallet.goldWeight);
                const userGoldWeight = parseFloat(user.wallet.goldWeight);
                const invoiceGoldWeight = parseFloat(createdInvoice.goldWeight.toString());
                
                const systemUserBalance = parseFloat(systemUser.wallet.balance);
                const userBalance = parseFloat(user.wallet.balance);
                const invoiceTotalPrice = parseFloat(createdInvoice.totalPrice.toString());
                
                systemUser.wallet.goldWeight = parseFloat((systemUserGoldWeight + invoiceGoldWeight).toFixed(3));
                systemUser.wallet.balance = Math.round(systemUserBalance - invoiceTotalPrice);

                user.wallet.goldWeight = parseFloat((userGoldWeight - invoiceGoldWeight).toFixed(3));
                user.wallet.balance = Math.round(userBalance + invoiceTotalPrice);
                await queryRunner.manager.save(user.wallet)
                await queryRunner.manager.save(systemUser.wallet)
                // await this.walletRepository.save([user.wallet, systemUser.wallet]);
                createdInvoice.status = "completed"
                createdInvoice.invoiceId = await this.generateInvoice()
                savedTransaction = await queryRunner.manager.save(createdInvoice)
                // savedTransaction = await this.invoiceRepository.save(createdInvoice);
                // let nameFamily = user.firstName +' '+  user.lastName
                this.smsService.sendGeneralMessage(user.phoneNumber, "sell", user.firstName, invoiceGoldWeight, invoiceTotalPrice)
                let rr = await this.estimateWeight(invoiceGoldWeight , 0)
                console.log('rr' , rr)
                // let estimate2 = await this.estimate.findOne({where : {
                //     date : new Date().toLocaleString("fa-IR").split(",")[0]
                // }})
                // let totalEstimate = await this.estimate.findOne({where : {
                //     date : 'localeDate'
                // }})
                // totalEstimate.soldGold = (parseFloat(((+totalEstimate.soldGold) + invoiceGoldWeight).toFixed(3))).toString()
                // await this.estimate.save(totalEstimate)
                // if (estimate2){
                //     estimate2.soldGold = (parseFloat(((+estimate2.soldGold) + invoiceGoldWeight).toFixed(3))).toString()
                //     await this.estimate.save(estimate2)
                //  }else{
                //     let estimate2 = this.estimate.create({date : new Date().toLocaleString("fa-IR").split(",")[0] ,
                //          boughtGold : '0' , soldGold : (parseFloat(((invoiceGoldWeight).toFixed(3))).toString())})
                //     await this.estimate.save(estimate2)
                //  }
                await queryRunner.commitTransaction()
                console.log('after failed in complete sell and transaction commited . . .>>>', savedTransaction)
                return response.status(200).json({
                    msg: "معامله با موفقیت ثبت شد",
                    transaction: savedTransaction,
                });
            } catch (error) {
                await queryRunner.rollbackTransaction()
                console.log('the sell transAction failed and rolled back' , error)
                return response.status(502).json({
                    msg: "معامله انجام نشد",
                    transaction: savedTransaction,
                });
            }finally{
                await queryRunner.release()
                console.log('transACtion released . . .' , savedTransaction)
                
            }
        } catch (error) {
            const createdInvoice = await this.invoiceRepository.findOne({
                where: { id: invoiceId },
                relations: { seller: { wallet: true }, buyer: { wallet: true } },
            });
            createdInvoice.status = "failed"
            const savedTransaction = await this.invoiceRepository.save(createdInvoice);
            console.log('after catch error in complete sell>>>>', savedTransaction)
            console.error("Error in sell transaction:", error);
            return response.status(500).json({ msg: "خطای داخلی سیستم" });
        }
    }



    async verifyTransaction(request: Request, response: Response) {
        try {
            let { status, authority
            } = request.body

            let info = { status, authority }
            let res = await this.zpService.verifyPayment(info)

            const paymentInfo = await this.paymentInfoRepository.findOneByOrFail({ authority: info.authority })
            try {
                const systemUser = await this.userRepository.findOne({ where: { isSystemUser: true }, relations: ["wallet"] });
                let savedTransaction = await this.invoiceRepository.findOne({ where: { id: paymentInfo.invoiceId }, relations: { seller: { wallet: true }, buyer: { wallet: true, bankAccounts: true } } })
                if (savedTransaction.status != "pending") {
                    console.log('the status was not pending . . .', savedTransaction)
                    return response.status(400).json({ msg: "تراکنش قبلا اعتبارسنجی شده است" })
                }
                if (!res.status) {
                    console.log('the zarinpal failed the transaction', res)
                    savedTransaction.status = "failed";                                     // just here is for failed . . .
                    let updatedtransaction = await this.invoiceRepository.save(savedTransaction);
                    console.log('after failed the transaction buy zarinpal>>>', updatedtransaction)
                    return response.status(200).json({ msg: "پرداخت ناموفق", transaction: updatedtransaction, bank: savedTransaction.buyer.bankAccounts[0].cardNumber })
                }
                else if (res.status && res.code == 100) {
                    console.log('success the payment . . .')
                    const buyerGoldWeight = parseFloat(savedTransaction.buyer.wallet.goldWeight.toString());
                    const transactionGoldWeight = parseFloat(savedTransaction.goldWeight.toString());
                    const systemUserGoldWeight = parseFloat(systemUser.wallet.goldWeight.toString());
                    const systemUserBalance = parseFloat(systemUser.wallet.balance.toString());
                    const transactionTotalPrice = parseFloat(savedTransaction.totalPrice.toString());
                    
                    savedTransaction.buyer.wallet.goldWeight = parseFloat((buyerGoldWeight + transactionGoldWeight).toFixed(3));
                    console.log('after updating the goldwaeight', savedTransaction.buyer.wallet.goldWeight)
                    systemUser.wallet.goldWeight = parseFloat((systemUserGoldWeight - transactionGoldWeight).toFixed(3));
                    console.log('after updating the goldwaeight222222', savedTransaction.buyer.wallet.goldWeight)
                    systemUser.wallet.balance = parseFloat((systemUserBalance + transactionTotalPrice).toFixed(3));
                    console.log('beforrrrrrrrrrrrr', systemUserBalance)
                    console.log('beforrrrrrrrrrrrr22222222222222', transactionTotalPrice)
                    console.log('come till here . . .<<<<<<<>>>>>>>>>>>>>', systemUser.wallet.balance)
                    await this.walletRepository.save([savedTransaction.buyer.wallet, systemUser.wallet]);
                
                    savedTransaction.status = "completed";
                    savedTransaction.invoiceId = res.data.ref_id
                    let updatedtransaction = await this.invoiceRepository.save(savedTransaction);
                    // let nameFamily = savedTransaction.buyer.firstName +' '+ savedTransaction.buyer.lastName
                    await this.smsService.sendGeneralMessage(savedTransaction.buyer.phoneNumber, "buy", savedTransaction.buyer.firstName, transactionGoldWeight, transactionTotalPrice / 10)
                    console.log('after completed the transaction buy zarinpal>>>', updatedtransaction)
                    await this.estimateWeight(transactionGoldWeight , 1)
                    // let estimate2 = await this.estimate.findOne({where : {
                    //     date : new Date().toLocaleString("fa-IR").split(",")[0]
                    // }})
                    // let totalEstimate = await this.estimate.findOne({where : {
                    //     date : 'localeDate'
                    // }})
                    // totalEstimate.boughtGold = (parseFloat(((+totalEstimate.boughtGold) + transactionGoldWeight).toFixed(3))).toString()
                    // await this.estimate.save(totalEstimate)
                    // if (estimate2){
                    //     estimate2.boughtGold = (parseFloat(((+estimate2.boughtGold) + transactionGoldWeight).toFixed(3))).toString()
                    //     await this.estimate.save(estimate2)
                    //  }else{
                    //     let estimate2 = this.estimate.create({date : new Date().toLocaleString("fa-IR").split(",")[0] , 
                    //         boughtGold : (parseFloat((transactionGoldWeight).toFixed(3))).toString() , 
                    //         soldGold : '0'})
                    //     await this.estimate.save(estimate2)
                    //  }
                    return response.status(200).json({ msg: "پرداخت موفق", transaction: updatedtransaction, bank: res.data.card_pan, referenceID: res.data?.ref_id })
                }
            } catch (error) {
                console.log('here is heppend caust we catched error . . .', `${error}`)
                // let savedTransaction = await this.invoiceRepository.findOne({where:{ id : paymentInfo.invoiceId}})
                // savedTransaction.status = "pending";
                // await this.invoiceRepository.save(savedTransaction);
                let savedTransaction = await this.invoiceRepository.findOne({ where: { id: paymentInfo.invoiceId }, relations: { seller: { wallet: true }, buyer: { wallet: true, bankAccounts: true } } })
                console.log('after catching error in verification>>>>', savedTransaction)
                console.log("error in save transaction status", error);
                return response.status(500).json({ msg: "خطای داخلی سیستم" });
            }
        } catch (error) {
            console.log("error in verify transaction", error);
            // let savedTransaction = await this.invoiceRepository.findOne({where : { id : paymentInfo.invoiceId} , relations : { seller : {wallet : true},buyer : {wallet : true, bankAccounts : true}}})
            // console.log('after catching error in verification>>>>' , savedTransaction)
            return response.status(500).json({ msg: "خطای داخلی سیستم" });
        }
    }

    async getTransactions(request: Request, response: Response) {
        const { type } = request.params;
        try {
            const userId = request.user_id;
            const transactions = await this.invoiceRepository.find({
                where: [{ seller: { id: userId } }, { buyer: { id: userId } }, type],
                relations: ["seller", "buyer", "type"],
            });
            response.status(200).json(
                transactions
            );
        } catch (error) {
            console.error("Fetch transactions error:", error);
            response.status(500).json({ msg: "خطای داخلی سیستم" });
        }
    }
    async getTransactionById(request: Request, response: Response) {
        const { id } = request.params;
        try {
            const transactions = await this.invoiceRepository.find({
                where: [{ id }],
                relations: ["seller", "buyer", "type"],
            });
            if (!transactions) {
                response.status(404).json({ msg: "invoice with this id not found" })
            }
            response.status(200).json(
                transactions
            );
        } catch (error) {
            console.error("Fetch transactions error:", error);
            return response.status(500).json({ msg: "خطای داخلی سیستم" });
        }
    }

    async getAllTransactionsSellType(request: Request, response: Response) {
        try {
            const userId = request.user_id;
            const { status } = request.body;
            const error = validationResult(request)
            if (!error.isEmpty()) {
                return response.status(400).json({ msg: error['errors'][0].msg  });
            }
            console.log(status)
            const typeInstance = await this.invoiceTypeRepository.findOneBy({ title: 'sell' })
            const user=await this.userRepository.findOneBy({id:userId})
            let remmitance
            console.log("typeInstance for sell", typeInstance);
 
            

            const queryBuilder = this.invoiceRepository.createQueryBuilder('invoice')
                .leftJoinAndSelect('invoice.seller', 'seller')
                .leftJoinAndSelect('invoice.type', 'type')
                .where('seller.id = :userId AND type.id = :id', { userId, id: typeInstance.id });


            if (status) {
                remmitance=await this.remmitanceService.getSellRmmitanceForUser(user.phoneNumber,"completed")
                if (status == "success") {
                    queryBuilder.andWhere('invoice.status = :status', { status: "completed" });
                } else {
                    remmitance=await this.remmitanceService.getSellRmmitanceForUser(user.phoneNumber,status)
                    queryBuilder.andWhere('invoice.status = :status', { status: status });
                }
            }else{
                remmitance=await this.remmitanceService.getSellRmmitanceForUser(user.phoneNumber,"all")
            }

            const transactions = await queryBuilder
                .orderBy('invoice.createdAt', 'DESC')
                .getMany();

               
                
            const all=[...transactions,...remmitance]

        
            response.status(200).json(all);
        } catch (error) {
            console.error("Fetch transactions error:", error);
            return response.status(500).json({ msg: "خطای داخلی سیستم" });
        }
    }

    async getAllTransactionsBuyType(request: Request, response: Response) {
        try {
            const userId = request.user_id;
            const { status } = request.body;
             const error = validationResult(request)
                            if (!error.isEmpty()) {
                                return response.status(400).json({ msg: error['errors'][0].msg  });
                            }
            
            const typeInstance = await this.invoiceTypeRepository.findOneBy({ title: 'buy' })
            const user=await this.userRepository.findOneBy({id:userId})
            let remmitance
            const queryBuilder = this.invoiceRepository.createQueryBuilder('invoice')
                .leftJoinAndSelect('invoice.buyer', 'buyer')
                .leftJoinAndSelect('invoice.type', 'type')
                .where('buyer.id = :userId AND type.id = :id', { userId, id: typeInstance.id });

            console.log("typeInstance for buy", typeInstance);
           
            if (status) {
                if (status == "success") {
                    remmitance=await this.remmitanceService.getBuyRmmitanceForUser(user.phoneNumber,"completed")
                    queryBuilder.andWhere('invoice.status = :status', { status: "completed" });
                } else {
                    remmitance=await this.remmitanceService.getBuyRmmitanceForUser(user.phoneNumber,status)
                    queryBuilder.andWhere('invoice.status = :status', { status: status });
                }
            }else{
                remmitance=await this.remmitanceService.getBuyRmmitanceForUser(user.phoneNumber,"all")
            }
            const transactions = await queryBuilder
                .orderBy('invoice.createdAt', 'DESC')
                .getMany();

            console.log("remiitance",remmitance);
                

            // for (let index = 0; index < remmitance.length; index++) {
            //     const element = remmitance[index];
            //     transactions.push(element)
            // }
            
          const all=[...transactions,...remmitance]

        //   console.log("allllll",all);
           console.log("remi",remmitance);

            response.status(200).json(all);
        } catch (error) {
            console.error("Fetch transactions error:", error);
            return response.status(500).json({ msg: "خطای داخلی سیستم" });
        }
    }


}
