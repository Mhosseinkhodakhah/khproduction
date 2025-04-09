import { Request, Response , NextFunction} from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";
import { Invoice } from "../entity/Invoice";
import { Wallet } from "../entity/Wallet";
import { startOfDay } from "date-fns";
import { MoreThanOrEqual } from "typeorm";
import { InvoiceType } from "../entity/InvoiceType";
import { ZarinPalService } from "../services/zarinpal-service/ZarinPal-service";
import {WalletTransaction} from "../entity/WalletTransaction"
import { PaymentInfo } from "../entity/PaymentInfo";
import { formatGoldWeight } from "../util/HelperFunctions";
import { SmsService } from "../services/sms-service/message-service";
import {v4 as uuidv4} from 'uuid';
import { EstimateTransactions } from "../entity/EstimateTransactions";
import { responseModel } from "../util/response.model";
import { validationResult } from "express-validator";
import monitor from "../util/statusMonitor";
import logger from "../services/interservice/logg.service";



export class PhoneInvoiceController {
    private userRepository = AppDataSource.getRepository(User);
    private invoiceRepository = AppDataSource.getRepository(Invoice);
    private walletRepository = AppDataSource.getRepository(Wallet);
    private invoiceTypeRepository = AppDataSource.getRepository(InvoiceType)
    private walletTransactionRepository=AppDataSource.getRepository(WalletTransaction)
    private zpService = new ZarinPalService()
    private paymentInfoRepository = AppDataSource.getRepository(PaymentInfo)
    private estimate = AppDataSource.getRepository(EstimateTransactions)
    private smsService = new SmsService()
    private loggerService = new logger()
    

    validateRequiredFields(fields: Record<string, any>): string | null {
        const missingFields = Object.keys(fields).filter(key => fields[key] === undefined || fields[key] === null);
        if (missingFields.length > 0) {
            return `Missing required fields: ${missingFields.join(", ")}`;
        }
        return null;
    }


    private async estimateWeight(goldWeight: number, type: number) {
        try {
            if (type == 0) {
                let month = new Date().toLocaleString('fa-IR').split(",")[0].split("/")[1]  
                console.log('monthhhhh' , month)
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
                        date: 'localDate'
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
                    let estimate32 = this.estimate.create({
                        date: new Date().toLocaleString("fa-IR").split(",")[0],
                        boughtGold: '0', soldGold: (parseFloat(((goldWeight).toFixed(3))).toString())
                    })
                    let a = await this.estimate.save(estimate32)
                    console.log('sold Estimate>>>' , a)
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
                        date: 'localDate'
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
                    let sold = await this.estimate.save(estimate2)
                    console.log('soldddddddd?>>>' , sold)
                }
            }
            return true
        } catch (error) {
            monitor.error.push(`${error}`)
            console.log('error>>>>' , error)
            return false
        }
    }

    private async generateInvoice(){
        return (Math.floor(Math.random()*10000)).toString()
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
        if (!user ) {
            throw new Error("کاربر در سیستم پیدا نشد");
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
        const today = startOfDay(new Date()).toISOString();
        const transactionsToday = await invoiceRepository.count({
            where: [
                { buyer: { id: userId }, time: MoreThanOrEqual(today) },
                { seller: { id: userId }, time: MoreThanOrEqual(today) },
            ],
        });
        const totalGoldToday = await invoiceRepository
            .createQueryBuilder("invoice")
            .select("SUM(CAST(invoice.goldWeight AS decimal))", "total")
            .where("(invoice.buyerId = :userId OR invoice.sellerId = :userId) AND invoice.time >= :today", {
                userId,
                today,
            }).getRawOne();
        if (transactionsToday >= 5 || (totalGoldToday?.total || 0) + goldWeight > 10) {
            return "میزان معامله از سقف معاملات در روز بیشتر است";
        }
        return null
    }

   
    async getAllBuyPhoneInvoice(req: Request, res: Response , next: NextFunction ){
        const all=await this.invoiceRepository.find({where:{fromPhone:true,type:{title:"buy"}},relations:["buyer"],order: {
            createdAt: 'DESC' // Order by createdAt in descending order
        }})
        return next(new responseModel(req, res,'' ,'get all buy call invoice', 200, null, all))
    }

    async getAllPhoneTransactionForUser(req: Request, res: Response, next : NextFunction){
        const userId = req['user_id']
        const all=await this.invoiceRepository.find({where:{fromPhone:true,buyer:{id:userId},type:{title:"buy"}},relations:["buyer"],order: {
            createdAt: 'DESC' // Order by createdAt in descending order
        }})
        return next(new responseModel(req, res, '','get all buy call invoice for user', 200, null, all))
    }
    
    async getBuyPhoneInvoice(req: Request, res: Response, next : NextFunction){
        const status=req.params.status

        const invoices=await this.invoiceRepository.find({
            where:{
                status,
                fromPhone:true,
                type:{title:"buy"}
            },relations : ['buyer'],
            order: {
                createdAt: 'DESC' // Order by createdAt in descending order
            }
        })
        
        return next(new responseModel(req, res, '','get buy call invoice with status ', 200, null, invoices))
    }
   
    async createPhoneBuyInvoice(req: Request, res: Response, next : NextFunction){
        console.log('req.body>>>>' , req.body)
        let { goldPrice, goldWeight, totalPrice , userId  ,description , invoiceId} = req.body;
        if (totalPrice.toString().includes(',')){
            totalPrice  = totalPrice.replaceAll(',' , '')
            console.log('new totalPrice , ' , totalPrice)
        }
        console.log('tot' , totalPrice)
        //  const error = validationResult(req)
        //         if (!error.isEmpty()) {
        //             return next(new responseModel(req, res, error['errors'][0].msg , 'create call buy invoice', 400, error['errors'][0].msg, null))
        //         }
        if(goldPrice==0 || goldWeight==0 || totalPrice==0){
            return next(new responseModel(req, res, 'مقدار نمیتواند صفر باشد','create call buy invoice', 400 , "مقدار نمی تواند صفر باشد", null))
        }
        const adminId=`${req.user.id}-${req.user.firstName}-${req.user.lastName}`;

        const { user, systemUser } = await this.fetchUsers(this.userRepository, userId);
        await this.ensureWalletsExist(this.walletRepository, user, systemUser);
        // let limitError = await this.checkDailyLimits(this.invoiceRepository, userId, goldWeight);
        // if (limitError) {
        //     return next(new responseModel(req, res, 'create call buy invoce', 400 ,limitError, null))
        // }
        goldWeight = formatGoldWeight(goldWeight)
        const queryRunner = AppDataSource.createQueryRunner()
        await queryRunner.connect()
        await queryRunner.startTransaction()

        try {
            const invoiceType = await this.invoiceTypeRepository.findOneBy({ title: "buy" });
            const invoiceTransaction = this.invoiceRepository.create({                                    // here is the making the transActions
                goldPrice: parseFloat(goldPrice),
                goldWeight: parseFloat(goldWeight),
                totalPrice: Math.floor(+totalPrice),
                seller:systemUser ,
                buyer:user ,
                type: invoiceType,
                tradeType:1,
                time: new Date().toLocaleString('fa-IR').split(',')[1],
                date: new Date().toLocaleString('fa-IR').split(',')[0],
                status: "pending",
                adminId,
                description,    
                invoiceId,
                fromPhone:true
            });
            
            const paymentInfo=this.paymentInfoRepository.create({
                amount:totalPrice,
                userId,
                authority : invoiceId
            })

            
            let savedTransAction = await queryRunner.manager.save(invoiceTransaction)
            paymentInfo.invoiceId = savedTransAction.id;
            await queryRunner.manager.save(paymentInfo)
            await queryRunner.commitTransaction()
           this.smsService.sendGeneralMessage(user.phoneNumber, "sellcall", user.firstName, goldWeight, totalPrice)
           
          try {
            await this.loggerService.addNewAdminLog({firstName : req.user.firstName , lastName : req.user.lastName , phoneNumber : req.user.phoneNumber} ,
                'ایجاد تراکنش خرید' , `admin ${req.user.firstName} create new buy invoice in phone transAction` ,{
               userName : savedTransAction.buyer.firstName,
               lastName : savedTransAction.buyer.lastName,
               amount : savedTransAction.goldWeight,
               balance : savedTransAction.totalPrice
           } , 1)
          } catch (error) {
            console.log('here is the fucking error in record the log')
          }


           return next(new responseModel(req, res, '' ,'create call buy invoice', 201, null,{
            msg: "فاکتور با موفقیت ثبت شد",
            invoice:invoiceTransaction,
            buyer: user.wallet,
            }))
        } catch (error) {
            console.log('transaction failed' , error)
            await queryRunner.rollbackTransaction()
            return next(new responseModel(req, res, 'ایجاد فاکتور انجام نشد لطفا دقایقی دیگر دوباره تلاش کنید' ,'create call buy invoice',500,"ایجاد فاکتور انجام نشد", null))
        } finally {
            console.log('transaction released')
            await queryRunner.release()
        }

    }


    async approvePhoneBuyInvoice (req: Request, res: Response, next : NextFunction){
        const invoiceId=+req.params.id
        // const error = validationResult(req)
        // if (!error.isEmpty()) {
        //     return next(new responseModel(req, res, error['errors'][0].msg , 'approve call buy invoice', 400, error['errors'][0].msg, null))
        // }
        const accounterId=`${req.user.id}-${req.user.firstName}-${req.user.lastName}`;
        const {description}=req.body


        const queryRunner = AppDataSource.createQueryRunner()
        await queryRunner.connect()
        await queryRunner.startTransaction()
        const invoice = await this.invoiceRepository.findOne({
            where: { id: invoiceId },
            relations: { seller: { wallet: true }, buyer: { wallet: true, bankAccounts: true } },
        });
        if (!invoice) {
            return next(new responseModel(req, res, 'سند مورد نظر یافت نشد' ,'approve call buy invoce', 422 ,"سند یافت نشد" , null))
        }
        const systemUser = await this.userRepository.findOne({            //  what is system user
            where: { isSystemUser: true },
            relations: ["wallet"],
        });

        try{

            const buyerGoldWeight = parseFloat(invoice.buyer.wallet.goldWeight.toString());
            const transactionGoldWeight = parseFloat(invoice.goldWeight.toString());
            const systemUserGoldWeight = parseFloat(systemUser.wallet.goldWeight.toString());
            const systemUserBalance = parseFloat(systemUser.wallet.balance.toString());
            const transactionTotalPrice = parseFloat(invoice.totalPrice.toString());
    

            
            invoice.buyer.wallet.goldWeight = parseFloat((buyerGoldWeight + transactionGoldWeight).toFixed(3));
            console.log('after updating the goldwaeight', invoice.buyer.wallet.goldWeight)
            systemUser.wallet.goldWeight = parseFloat((systemUserGoldWeight - transactionGoldWeight).toFixed(3));
            console.log('after updating the goldwaeight222222', invoice.buyer.wallet.goldWeight)
            systemUser.wallet.balance = parseFloat((systemUserBalance + transactionTotalPrice).toFixed(3));
            console.log('beforrrrrrrrrrrrr', systemUserBalance)
            console.log('beforrrrrrrrrrrrr22222222222222', transactionTotalPrice)
            console.log('come till here . . .<<<<<<<>>>>>>>>>>>>>', systemUser.wallet.balance)
            invoice.accounterId=accounterId
            invoice.status = "completed";
            invoice.accounterDescription=description


             
            let updated = await queryRunner.manager.save(invoice)
            await queryRunner.manager.save([invoice.buyer.wallet, systemUser.wallet])
 
            await this.estimateWeight(buyerGoldWeight,1)
            await queryRunner.commitTransaction()
            this.smsService.sendGeneralMessage(invoice.buyer.phoneNumber, "buy", invoice.buyer.firstName,invoice.goldWeight ,invoice.totalPrice )
            
          try {
            await this.loggerService.addNewAdminLog({firstName : req.user.firstName , lastName : req.user.lastName , phoneNumber : req.user.phoneNumber} ,
                'تایید تراکنش خرید' , `accountant ${req.user.firstName} approved new buy invoice in phone transAction` ,{
               userName : updated.buyer.firstName,
               lastName : updated.buyer.lastName,
               amount : updated.goldWeight,
               balance : updated.totalPrice
           } , 1)
          } catch (error) {
            console.log('here is the fucking error in record the log')
          }
            
            return next(new responseModel(req, res, '','approve call buy invoce', 200, null,invoice))
        }catch(err){
            console.log(err);
            await queryRunner.rollbackTransaction()
            return next(new responseModel(req, res,  'تایید فاکتور انجام نشد لطفا دقایقی دیگر مجددا تلاش کنید' , 'approve call buy invoce',500,"تایید فاکتور انجام نشد", null))
        }finally{
            console.log('transaction released')
            await queryRunner.release()
            
        }  
    }

    async rejectPhoneBuyInvocie(req: Request, res: Response, next : NextFunction){
        const invoiceId=+req.params.id
        // const error = validationResult(req)
        // if (!error.isEmpty()) {
        //     return next(new responseModel(req, res, error['errors'][0].msg , 'reject call buy invoice', 400, error['errors'][0].msg, null))
        // }
        const accounterId=`${req.user.id}-${req.user.firstName}-${req.user.lastName}`;
        const {description}=req.body

        const invoice = await this.invoiceRepository.findOne({
            where: { id: invoiceId },
            relations: { seller: { wallet: true }, buyer: { wallet: true, bankAccounts: true } },
        });
        if(!invoice){
            return next(new responseModel(req, res, 'سند یافت نشد' ,'reject call buy invoice', 422 ,"سند یافت نشد" , null))
        }
        const queryRunner = AppDataSource.createQueryRunner()
        await queryRunner.connect()
        await queryRunner.startTransaction() 

        try{
            invoice.status="failed"
            invoice.accounterId=accounterId
            invoice.accounterDescription=description
           
            
            let updated = await queryRunner.manager.save(invoice)
            await queryRunner.commitTransaction()
            this.smsService.sendGeneralMessage(invoice.buyer.phoneNumber, "rejectcall", invoice.buyer.firstName, invoice.goldWeight ,invoice.totalPrice )
            
            try {
                await this.loggerService.addNewAdminLog({firstName : req.user.firstName , lastName : req.user.lastName , phoneNumber : req.user.phoneNumber} ,
                    'رد کردن تراکنش خرید' , `accountant ${req.user.firstName} reject buy invoice in phone transAction` ,{
                   userName : updated.buyer.firstName,
                   lastName : updated.buyer.lastName,
                   amount : updated.goldWeight,
                   balance : updated.totalPrice
               } , 1)
              } catch (error) {
                console.log('here is the fucking error in record the log')
              }

            return next(new responseModel(req, res, '' ,'reject call buy invoice', 200, null,invoice))
        }catch(err){
            await queryRunner.rollbackTransaction()
            return next(new responseModel(req, res, 'رد فاکتور انجام نشد لطفا دقایقی دیگر مجددا تلاش کنید' ,'reject call buy invoice',500,"ریجکت فاکتور انجام نشد", null))
        }
        finally{
            console.log('transaction released')
            await queryRunner.release()
        }

    }

    async updatePhoneInvoice(req: Request, res: Response, next : NextFunction){
        let { goldPrice, goldWeight, totalPrice } = req.body;
        const invoiceId=req.params.id
        // const error = validationResult(req)
        // if (!error.isEmpty()) {
        //     return next(new responseModel(req, res, error['errors'][0].msg , 'update call buy invoice', 400, error['errors'][0].msg, null))
        // }
        // if(goldPrice==0 || goldWeight==0 || totalPrice==0){
        //     return next(new responseModel(req, res, 'update call buy invoce', 400 , "مقدار نمی تواند صفر باشد", null))
        // }
        const adminId=`${req.user.id}-${req.user.firstName}-${req.user.lastName}`;
        const invoice = await this.invoiceRepository.findOne({
            where: { id: invoiceId },
            relations: { seller: { wallet: true }, buyer: { wallet: true, bankAccounts: true } },
        });
        if (!invoice) {
            return next(new responseModel(req, res, 'سند یافت نشد' ,'update call buy invoce', 422 ,"سند یافت نشد" , null))
        }
        const queryRunner = AppDataSource.createQueryRunner()
        await queryRunner.connect()
        await queryRunner.startTransaction()

        try{
            invoice.goldPrice=goldPrice?goldPrice:invoice.goldPrice
            invoice.goldWeight=goldWeight?goldWeight:invoice.goldWeight
            invoice.totalPrice=totalPrice?totalPrice:invoice.totalPrice
            invoice.accounterId=adminId


            await queryRunner.manager.save(invoice)
            await queryRunner.commitTransaction()

            return next(new responseModel(req, res, '' ,'update call buy invoce', 200, null,invoice))

        }catch(err){
            await queryRunner.rollbackTransaction()
            return next(new responseModel(req, res, 'آپدیت فاکتور انجام نشد' ,'reject call buy invoce',500,"آپدیت فاکتور انجام نشد", null))
        }finally{
            console.log('transaction released')
            await queryRunner.release()
        }
        
    }
    
    
    async createSellCall (req: Request, res: Response, next : NextFunction){
        let { goldPrice, goldWeight, totalPrice , userId  ,description ,invoiceId} = req.body;
        const accounterId=`${req.user.id}-${req.user.firstName}-${req.user.lastName}`;
        if (totalPrice.toString().includes(',')){
            totalPrice  = totalPrice.replaceAll(',' , '')
            console.log('new totalPrice , ' , totalPrice)
        }
        console.log(totalPrice)
        // const error = validationResult(req)
        // if (!error.isEmpty()) {
        //     return next(new responseModel(req, res, error['errors'][0].msg , 'create call sell invoice', 400, error['errors'][0].msg, null))
        // } 
        
        const { user, systemUser } = await this.fetchUsers(this.userRepository, userId);

        await this.ensureWalletsExist(this.walletRepository, user, systemUser);


        goldWeight = formatGoldWeight(goldWeight)
        console.log('start the transaction')
        const queryRunner = AppDataSource.createQueryRunner()
        await queryRunner.connect()
        await queryRunner.startTransaction()

        try {
            const transactionGoldWeight = parseFloat(goldWeight.toString());
            const sellerGoldWeight = parseFloat(user.wallet.goldWeight.toString());
            const systemUserGoldWeight = parseFloat(systemUser.wallet.goldWeight.toString());
        
            if(transactionGoldWeight>sellerGoldWeight){
                return next(new responseModel(req, res, 'موجودی صندوق طلای کاربر کافی نمی باشد','create sell Invoice call',400,"موجودی صندوق طلای کاربر کافی نمی باشد", null))
            }

            const invoiceType = await this.invoiceTypeRepository.findOneBy({ title: "sell" });
            const invoiceTransaction = this.invoiceRepository.create({                                    // here is the making the transActions
                goldPrice: parseFloat(goldPrice),
                goldWeight: parseFloat(goldWeight),
                totalPrice: Math.floor(+totalPrice),
                seller:user ,
                buyer:systemUser ,
                type: invoiceType,
                tradeType:1,
                time: new Date().toLocaleString('fa-IR').split(',')[1],
                date: new Date().toLocaleString('fa-IR').split(',')[0],
                status: "completed",
                adminId : accounterId,
                accounterDescription:description,    
                invoiceId,
                fromPhone:true
            });

            user.wallet.goldWeight=parseFloat((sellerGoldWeight - transactionGoldWeight).toFixed(3));
            user.wallet.balance = ((+user.wallet.balance) + (+totalPrice))
            systemUser.wallet.goldWeight=parseFloat((systemUserGoldWeight + transactionGoldWeight).toFixed(3));
            
            await queryRunner.manager.save([user.wallet,systemUser.wallet])
            let updated = await queryRunner.manager.save(invoiceTransaction)
            await this.estimateWeight(goldWeight,0)
            await queryRunner.commitTransaction()
            this.smsService.sendGeneralMessage(user.phoneNumber, "selldasti", user.firstName, goldPrice, totalPrice)
            
            try {
                await this.loggerService.addNewAdminLog({firstName : req.user.firstName , lastName : req.user.lastName , phoneNumber : req.user.phoneNumber} ,
                    'ایجاد فاکتور فروش تلفنی' , `accountant ${req.user.firstName} approved new sell invoice in phone transAction` ,{
                   userName : updated.buyer.firstName,
                   lastName : updated.buyer.lastName,
                   amount : updated.goldWeight,
                   balance : updated.totalPrice
               } , 1)
              } catch (error) {
                console.log('here is the fucking error in record the log')
              }
              
            return next(new responseModel(req, res,'','create call buy invoice', 201, null,{
                msg: "فاکتور با موفقیت ثبت شد",
                invoice:invoiceTransaction,
                wallet: user.wallet,
                }))
        } catch (error) {
            await queryRunner.rollbackTransaction()
            return next(new responseModel(req, res,'ایجاد فاکتور انجام نشد' ,'create call buy invoice',500,"ایجاد فاکتور انجام نشد", null))
        } finally {
            console.log('transaction released')
            await queryRunner.release()
        }
    }

    async getAllSellPhoneInvoice(req: Request, res: Response, next : NextFunction){
        const all=await this.invoiceRepository.find({where:{fromPhone:true,type:{title:"sell"}},relations:["seller"],order: {
            createdAt: 'DESC' // Order by createdAt in descending order
        }})
        return next(new responseModel(req, res, '','get all sell call invoice', 200, null, all))
    }

    async getAllSellPhoneTransactionForUser(req: Request, res: Response, next : NextFunction){
        const userId = req['user_id']
        const all=await this.invoiceRepository.find({where:{fromPhone:true,seller:{id:userId},type:{title:"sell"}},relations:["seller"],order: {
            createdAt: 'DESC' // Order by createdAt in descending order
        }})
        return next(new responseModel(req, res, '','get all sell call invoice for user', 200, null, all))
    }

    async getSellPhoneInvoice(req: Request, res: Response, next : NextFunction){
        const status=req.params.status

        const invoices=await this.invoiceRepository.find({
            where:{
                status,
                fromPhone:true,
                type:{title:"sell"}
            },relations : ['seller'],
            order: {
                createdAt: 'DESC' // Order by createdAt in descending order
            }
        })
        
        return next(new responseModel(req, res, '','get sell call invoice with status ', 200, null, invoices))  
    }

    
}



