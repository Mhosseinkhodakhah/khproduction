import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Wallet } from "../entity/Wallet";
import { User } from "../entity/User";
import { ZarinPalService } from "../services/zarinpal-service/ZarinPal-service";
import { PaymentInfo } from "../entity/PaymentInfo";
import { WalletTransaction } from "../entity/WalletTransaction";
import { GoldPriceService } from "../services/gold-price-service/gold-price-service";
import { SmsService } from "../services/sms-service/message-service";
import { transportInvoice } from "../entity/transport";
import monitor from "../util/statusMonitor";
import instance from "../util/tradePerision";
import { systemSetting } from "../entity/systemSetting";
import { BankAccount } from "../entity/BankAccount";

export class WalletController {
    private walletRepository = AppDataSource.getRepository(Wallet);
    private userRepository = AppDataSource.getRepository(User);
    private walletTransactionRepository = AppDataSource.getRepository(WalletTransaction);
    private paymentInfoRepository = AppDataSource.getRepository(PaymentInfo);
    private transportInvoices = AppDataSource.getRepository(transportInvoice)
    private systemSetting  = AppDataSource.getRepository(systemSetting)
    private bankAccountRepository = AppDataSource.getRepository(BankAccount);
    private zpService = new ZarinPalService()
    private smsService = new SmsService()
    private goldPriceService = new GoldPriceService()
    
    private async generateInvoice(){
        return (new Date().getTime()).toString()
    }

    private async generateOtp(){
        let firstRandomoe = Math.random()
        if (firstRandomoe<0.1){
            firstRandomoe = firstRandomoe*100000
        }else{      
            firstRandomoe = firstRandomoe*10000
        }
        return Math.floor(firstRandomoe)
    }

    /**
     * first step for transport the gold by user
     * @param req 
     * @param res 
     * @param next 
     * @returns 
     */
    async transport(req : Request , res : Response , next : any){
        const{goldWeight  , nationalCode} = req.body;
        const userId = req['user_id']
        let user = await this.userRepository.findOne({where : {
            id : +userId
        } , relations : ['wallet']})

        let reciever = await this.userRepository.findOne({where : {
            nationalCode : nationalCode
        }})

        if (+user.wallet.goldWeight < +goldWeight ){
            return res.status(400).json({ msg: "موجودی کیف پول شما برای انتقال کافی نیست." });
        }

        let otpCode = await this.generateOtp()
        let invoiceId = await this.generateInvoice()
        let queryRunner = AppDataSource.createQueryRunner()
        await queryRunner.connect()
        await queryRunner.startTransaction()
        try {
            user.wallet.goldWeight = +((+user.wallet.goldWeight) - (+goldWeight.toFixed(3))).toFixed(3)
            user.wallet.goldBlock = +goldWeight.toFixed(3)
            let createTransAction = this.transportInvoices.create({
                goldWeight : goldWeight,
                sender : user,
                reciever : reciever,
                invoiceId : invoiceId,
                status : 'init',
                date : new Date().toLocaleString('fa-IR').split(',')[0],
                time : new Date().toLocaleString('fa-IR').split(',')[1],
                type : 'transport',
                otpApproved : false,
                otpCode : otpCode.toString(),
                otptime : (new Date().getTime()).toString(),
            })
            let newWallet = await queryRunner.manager.save(user.wallet)
            console.log('new wallet after block gold>>>>' , newWallet.goldBlock , newWallet.goldWeight)
            let savedTransACtion = await queryRunner.manager.save(createTransAction)
            await this.smsService.sendOtpMessage(user.phoneNumber , otpCode)
            await queryRunner.commitTransaction()
            return res.status(200).json({ msg: "کد تایید ارسال شد"  , data : savedTransACtion});
        } catch (error) {
            console.log('error occured and transaction rollback')
            await queryRunner.rollbackTransaction()
            return res.status(500).json({ msg: "فرایند انتقال ناموفق بود.لطفا دقایقی دیگر تلاش کنید" });
        }finally{
            await queryRunner.release()
        }
    }
    

    /**
     * its for confirm the transport for user to another user
     * @param req 
     * @param res 
     * @param next 
     * @returns 
     */
    async confirmTransport(req : Request , res : Response , next : any){
        const {otp , transportId} = req.body;
        const userId = req['user_id']
        
        const sender = await this.userRepository.findOne({where : {
            id : +userId
        } , relations : ['wallet']})
        
        let transport = await this.transportInvoices.findOne({where : {
            id : +transportId,
            sender :  sender
        } , relations : ['sender' , 'reciever' , 'reciever.wallet']})

        let now = new Date().getTime()
        
        if (+otp != +transport.otpCode){
            return res.status(403).json({ msg: "کد وارد شده نادرست است" });
        }
        
        if ((now - (+transport.otptime)) >= 2.1 * 60 * 1000) {
            return res.status(403).json({ msg: "زمان استفاده از کد به اتمام رسیده است." });
        }

        let queryRunner = AppDataSource.createQueryRunner()
        await queryRunner.connect()
        await queryRunner.startTransaction()
        try {
            let senderGoldWeight = ((+sender.wallet.goldWeight) - (+transport.goldWeight)).toFixed(3)
            let recieverGoldWeight = ((+transport.reciever.wallet.goldWeight) + (+transport.goldWeight)).toFixed(3)
            console.log('sender goldWe' , senderGoldWeight , typeof(senderGoldWeight))
            console.log('reciever goldWe' , recieverGoldWeight , typeof(recieverGoldWeight))
            sender.wallet.goldWeight = +senderGoldWeight;
            transport.reciever.wallet.goldWeight = +recieverGoldWeight;
            transport.otpApproved = true
            transport.otptime = null
            transport.status = 'completed'
            await queryRunner.manager.save([sender.wallet , transport.reciever.wallet])
            let savedTransACtion = await queryRunner.manager.save(transport)
            await queryRunner.commitTransaction()
            return res.status(200).json({ msg: "طلای شما با موفقیت منتقل شد" , data : savedTransACtion});
        } catch (error) {
            await queryRunner.rollbackTransaction()
            return res.status(500).json({ msg: "انتقال طلا موفقیت آمیز نبود" });
        }finally{
            await queryRunner.release()
        }
    }

    async getWallet(request: Request, response: Response) {
        try {
            let userId = request['user_id']
            // if (isNaN(userId)) {
            //     return response.status(400).json({ message: "Invalid user ID" });
            // }
            
            const user = await this.userRepository.findOne({
                where: { id: userId },
                relations: ["wallet"],
            });            
            if (!user || !user.wallet) {
                monitor.addStatus({
                    scope : 'wallet controller',
                    status :  0,
                    error : 'کیف پول یافت نشد'
                })    
                return response.status(404).json({ msg: "Wallet not found." });
            }
            let result : any = await this.goldPriceService.getGoldPrice()
            let wallet : any= user.wallet
            const goldWeight = parseFloat(user.wallet.goldWeight.toString());
            const balance = parseFloat(user.wallet.balance.toString());
            
            const totalAssets = goldWeight * result.price + balance;
            wallet.totalAssets = parseFloat(totalAssets.toFixed(2));
            monitor.addStatus({
                scope : 'wallet controller',
                status :  1,
                error : null
            })
            response.status(200).json(wallet);
        } catch (error) {
            monitor.addStatus({
                scope : 'wallet controller',
                status :  0,
                error :`${error}`
            })

            console.error("Error fetching wallet:", error);
            return response.status(500).json({msg : "خطای داخلی سیستم"})
        }
    }

    async getWalletTransactions(request: Request, response: Response) {
        try {
            let userId = request['user_id'];
            const { type, status } = request.body; 
            let whereClause: any = { wallet: { user: { id: userId } } };

            if (type) {
                whereClause.type = type;
            }

            if (status) {
                whereClause.status = status;
            }
    
            const transactions = await this.walletTransactionRepository.find({
                where: whereClause,
                relations: { wallet: { user: true } }, order : {updatedAt : 'DESC'} 
            });
            monitor.addStatus({
                scope : 'wallet controller',
                status :  1,
                error : null
            })
            response.status(200).json(transactions);
        } catch (error) {
            monitor.addStatus({
                scope : 'wallet controller',
                status :  0,
                error :`${error}`
            })
            console.error("Error fetching wallet transactions:", error);
            return response.status(500).json({ msg: "خطای داخلی سیستم" });
        }
    }

    async updateWallet(request: Request, response: Response) {
        try {
            const userId = parseInt(request.body.userId);
            if (isNaN(userId)) {
                monitor.addStatus({
                    scope : 'wallet controller',
                    status :  0,
                    error : 'ورودی نادرست در اپدیت کیف پول'
                })    
                return response.status(400).json({ msg: "Invalid user ID" });
            }

            const goldAmount = parseFloat(request.body.goldWeight) || 0;
            const balanceAmount = parseFloat(request.body.balance) || 0;

            if (goldAmount <= 0 && balanceAmount <= 0) {
                monitor.addStatus({
                    scope : 'wallet controller',
                    status :  0,
                    error : 'مقدار نامناسب در اپدیت ولت'
                })    
                return response.status(400).json({ msg: "Invalid amount" });
            }

            const user = await this.userRepository.findOne({
                where: { id: userId },
                relations: ["wallet"],
            });
            if (!user) {
                monitor.addStatus({
                    scope : 'wallet controller',
                    status :  0,
                    error : 'کاربر یافت نشد در اپدیت کیف پول'
                })
    
                return response.status(404).json({ msg: "User not found" });
            }

            let wallet = user.wallet;

            if (!wallet) {
                wallet = this.walletRepository.create({ user, goldWeight: 0, balance: 0 });
            }

            wallet.goldWeight += goldAmount;
            wallet.balance += balanceAmount;

            await this.walletRepository.save(wallet);
            monitor.addStatus({
                scope : 'wallet controller',
                status :  1,
                error : null
            })

            response.status(200).json({ msg: "Wallet updated successfully", wallet });
        } catch (error) {
            monitor.addStatus({
                scope : 'wallet controller',
                status :  0,
                error : `${error}`
            })

            console.error("Error updating wallet:", error);
            return response.status(500).json({msg : "خطای داخلی سیستم"})
        }
    }

    async depositToWallet(request: Request, response: Response){
        try {
            let trade = await this.systemSetting.find()
            console.log('permision is >>>>>', trade[0].tradePermision)
            if (!trade[0].tradePermision) {
                return response.status(400).json({ msg: 'کاربر گرامی با عرض پوزش امکان ثبت معامله برای دقایقی امکان پذیر نمی باشد.لطفا دقایقی دیگر مجددا تلاش کنید.' });
            }
            const {amount , cartId} = request.body
            const userId = request.user_id;
            if (+amount < 100000) {
                monitor.addStatus({
                    scope : 'wallet controller',
                    status :  0,
                    error : 'مبلغ وارد شده برای واریزی باید حداقل 100 هزارتومن باشد.'
                })
                return response.status(400).json({msg : "مبلغ وارد شده از حداقل مبلغ واریز کمتر است"})
            }
            let bankAccount = await this.bankAccountRepository.findOne({where : {id : +cartId} , relations : ['owner']})    
            if (+bankAccount.owner.id != userId){
                return response.status(403).json({
                    msg : 'خرید از مبدا این کارت بانکی مجاز نمیباشد.'
                })
            }
            const info = {
                description: "شارژ کیف پول",
                amount,
                userId: userId,
                invoiceId : null,
                callback_url : 'https://app.khanetala.ir/Bankinfo',
                cardPan : bankAccount.cardNumber,
                phoneNumber:null
            }
            let wallet = await this.walletRepository.findOne({where : {user : {id :userId}},relations:{user : {bankAccounts : true}}})
            if (!wallet.user.isHaveBank){
                monitor.addStatus({
                    scope : 'wallet controller',
                    status :  0,
                    error : 'تلاش برای واریز قبل از ثبت کارت بانکی'
                })    
                return response.status(400).json({msg : "ابتدا کارت بانکی خود را ثبت کنید"})
            }
            let date = new Date().toLocaleString('fa-IR').split(',')[0]
            let time = new Date().toLocaleString('fa-IR').split(',')[1]
            let queryRunner = AppDataSource.createQueryRunner()
            await queryRunner.connect()
            await queryRunner.startTransaction()
            try {
                let transactionToCreate = this.walletTransactionRepository.create({description  : info.description, status : "pending", type : "deposit" ,wallet : wallet,amount,time,date})
                let savedTransaction = await queryRunner.manager.save(transactionToCreate)
                console.log('its here for savedTransActions' , savedTransaction)
                info.invoiceId = savedTransaction.id
                info.cardPan = wallet.user.bankAccounts[0].cardNumber
                info.phoneNumber = wallet.user.phoneNumber
                const url = await this.zpService.initiatePayment(info);
                console.log('after get url' , url)
                if (url === 'tooMuch'){
                    return response.status(500).json({
                        msg : 'مبلغ وارد شده بیش از حد مجاز است.'
                    }) 
                }
                if (url == 'error'){
                    return response.status(500).json({
                        msg : 'درگاه پرداخت موقتا در دسترس نمیباشد.لطفا دقایقی دیگر مجددا تلاش کنید.'
                    })
                }
                if (!url.authority){
                    return response.status(500).json({
                        msg : 'درگاه پرداخت موقتا در دسترس نمیباشد.لطفا دقایقی دیگر مجددا تلاش کنید.'
                    })
                }
                // let transAction = await this.walletTransactionRepository.findOne({where : {id : savedTransaction.id}})
                // console.log( 'transAction', transAction)
                transactionToCreate.authority = url.authority;
                transactionToCreate.invoiceId = await this.generateInvoice();
                let addedAuthority = await queryRunner.manager.save(transactionToCreate)
                console.log('added authority >>>>' , addedAuthority)
                monitor.addStatus({
                    scope : 'wallet controller',
                    status :  1,
                    error : null
                })
                await queryRunner.commitTransaction()
                return response.status(200).json({msg : "انتقال به درگاه پرداخت" , url : url.url})
            } catch (error) {
               await queryRunner.rollbackTransaction()
               console.log('error in initiate payment>>>' , error )
               return response.status(200).json({msg : "ایجاد فاکتور با مشکل مواجه شده است."})
            }finally{
                console.log('transaction released>>>')
                await queryRunner.release()
            }
            } catch (error) {
                monitor.addStatus({
                    scope : 'wallet controller',
                    status :  0,
                    error : `error in transfer to gateway zarinpal ::: ${error}`
                })
    
                console.error("Error charge wallet:", error);
                return response.status(500).json({msg : "خطای داخلی سیستم"})
            }
    }   

    async verifyDeposit(request: Request, response: Response){
        try {
            let {status,authority
            } = request.body
            
            let info = {status,authority}
            let res =  await this.zpService.verifyPayment(info)
            const paymentInfo = await this.paymentInfoRepository.findOneByOrFail({authority : info.authority})
            const savedTransaction = await this.walletTransactionRepository.findOneBy({id : paymentInfo.invoiceId})
            if (savedTransaction.status != "pending") {
                monitor.addStatus({
                    scope : 'wallet controller',
                    status :  0,
                    error : 'واریزی قبلا اعتبار سنچی شده است'
                })    
                return response.status(400).json({msg : "تراکنش قبلا اعتبارسنجی شده است"})
            }
            const user = await this.userRepository.findOne({where : {id : paymentInfo.userId},relations : {wallet : true,bankAccounts : true}})
            try {
                if (!res.status) {
                    savedTransaction.status = "failed";
                    let updatedtransaction = await this.walletTransactionRepository.save(savedTransaction);
                    monitor.addStatus({
                        scope : 'wallet controller',
                        status :  1,
                        error : null
                    })
                    return response.status(200).json({msg : "پرداخت ناموفق", transaction : savedTransaction , bank : user.bankAccounts[0].cardNumber})
                }else if(res.status && res.code == 100 ){
                const currentBalance = +user.wallet.balance;
                const paymentAmount = +paymentInfo.amount;
                user.wallet.balance = Math.round(currentBalance + paymentAmount);
                await this.walletRepository.save([user.wallet]);
                savedTransaction.status = "completed";
                savedTransaction.invoiceId = res.data.ref_id;
                let updatedtransaction = await this.walletTransactionRepository.save(savedTransaction);
                // let nameFamily = user.firstName +' '+  user.lastName
                this.smsService.sendGeneralMessage(user.phoneNumber,"deposit" ,user.firstName ,paymentAmount ,null)
                monitor.addStatus({
                    scope : 'wallet controller',
                    status :  1,
                    error : null
                })    
                return response.status(200).json({msg : "پرداخت موفق" , transaction : updatedtransaction , bank : res.data.card_pan,referenceId : res.data.ref_id})
            }
            } catch (error) {
                let savedTransaction = await this.walletTransactionRepository.findOne({where:{ id : paymentInfo.invoiceId}})
                savedTransaction.status = "failed";
                await this.walletTransactionRepository.save(savedTransaction);
                monitor.addStatus({
                    scope : 'wallet controller',
                    status :  0,
                    error : `${error}`
                })    
                console.log("error in save transaction status" , error);
                return response.status(500).json({ msg: "خطای داخلی سیستم" });
            }
           
        } catch (error) {
            monitor.addStatus({
                scope : 'wallet controller',
                status :  0,
                error :`${error}`
            })
            console.log("error in verify transaction" , error);
            return response.status(500).json({ msg: "خطای داخلی سیستم" });
        }
    }
    
    async withdrawFromWallet(request: Request, response: Response){
        try {
            let {amount , cartId} = request.body
            if (!cartId || cartId == ''){
                return response.status(400).json({
                    msg : 'لطفا کارت بانکی را انتخاب کنید'
                })
            }
            const userId = request.user_id;
            let wallet = await this.walletRepository.findOne({where : {user : {id :userId}},relations : {user : {bankAccounts : true}}})
            if (+amount == 0){
                monitor.addStatus({
                    scope : 'wallet controller',
                    status :  0,
                    error : 'برداشت مبلغ صفر'
                })
    
                return response.status(400).json({msg : "مقدار برداشت نمیتواند صفر باشد"})
            }

            if (+amount < 99000){
                monitor.addStatus({
                    scope : 'wallet controller',
                    status :  0,
                    error : 'برداشت کمتر از 100 هزارتومن'
                })    
                return response.status(400).json({msg : "حداق میزان برداشت 100 هزارتومن است"})
            }

            if (wallet && parseFloat(wallet.balance.toString()) < +amount) {
                monitor.addStatus({
                    scope : 'wallet controller',
                    status :  0,
                    error : 'برداشت بیشتر از مبلغ موجودی'
                })
    
                return response.status(400).json({msg : "مقدار برداشت نمی تواند از موجودی کیف پول بیشتر باشد"})
            }
            let allCards = await this.bankAccountRepository.findOne({where : {id : +cartId}})
            const withdrawAmount = +amount
            const currentBalance = wallet.balance;
            wallet.balance = Math.round(currentBalance - withdrawAmount)     // decrease wallet balance 
            wallet.blocked += withdrawAmount                                 // increase blocked money for time that admin approved . . .
            console.log(wallet.balance)
            let date = new Date().toLocaleString('fa-IR').split(',')[0]
            let time = new Date().toLocaleString('fa-IR').split(',')[1]
            let walletUpdated = await this.walletRepository.save([wallet]);
            console.log('wallet creation>>>' , walletUpdated)
            let transactionToCreate = this.walletTransactionRepository.create({ description: "برداشت از کیف پول", cardPan: allCards.cardNumber, date, time, status: "pending", type: "withdraw", wallet: wallet, amount })
            let savedTransaction = await this.walletTransactionRepository.save(transactionToCreate)
            await this.smsService.sendGeneralMessage(wallet.user.phoneNumber,"withdraw" ,withdrawAmount,wallet.user.bankAccounts[0].cardNumber ,wallet.balance)
            monitor.addStatus({
                scope : 'wallet controller',
                status :  1,
                error : null
            })
            return response.json(savedTransaction)
        } catch (error) {
            monitor.addStatus({
                scope : 'wallet controller',
                status :  0,
                error : `${error}`
            })

            console.log(error);
            return response.status(500).json({ msg: "خطای داخلی سیستم" });
        }
    }

    // async completeWithdraw(request: Request, response: Response){
    //     try {
    //         let {invoiceId,status} = request.body
    //         const userId = request.user_id;
    //         const foundTransaction = await this.walletTransactionRepository.findOneBy({id : invoiceId})
    //         if (foundTransaction.status != "pending") {
    //             return response.status(400).json({msg : "تراکنش قبلا اعتبارسنجی شده است"})
    //         }
    //         foundTransaction.status == status
    //         let wallet = await this.walletRepository.findOne({where : {user : {id :userId}}})
    //         const currentBalance = parseFloat( wallet.balance .toString());
    //         const paymentAmount = parseFloat(foundTransaction.amount.toString());
    //         wallet.balance = parseFloat((currentBalance + paymentAmount).toFixed(1))
    //         wallet.balance -= foundTransaction.amount
    //         await this.walletRepository.save([wallet]);
    //         let savedTransaction = await this.walletTransactionRepository.save(foundTransaction)
    //         return response.json(savedTransaction)
    //     } catch (error) {
    //         return response.status(500).json({ msg: "خطای داخلی سیستم" });
    //     }
    // }
}
