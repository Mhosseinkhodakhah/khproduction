import { AppDataSource } from "../data-source"
import { TradeType } from "../entity/enums/TradeType"
import { goldPrice } from "../entity/goldPrice"
import { convertTradeInvoice } from "../entity/inpersonConvertTrade.entity"
import { Invoice } from "../entity/Invoice"
import { InvoiceType } from "../entity/InvoiceType"
import { Otp } from "../entity/Otp"
import { PaymentInfo } from "../entity/PaymentInfo"
import { productList } from "../entity/producList.entity"
import { User } from "../entity/User"
import { Wallet } from "../entity/Wallet"
import { WalletTransaction } from "../entity/WalletTransaction"
import logger from "../services/interservice/logg.service"
import { JwtService } from "../services/jwt-service/jwt-service"
import { SmsService } from "../services/sms-service/message-service"
import { Request, Response, NextFunction } from "express";
import { responseModel } from "../util/response.model"



export default class invoiceConvertorController{
    private userRepository = AppDataSource.getRepository(User)
    private walletRepository = AppDataSource.getRepository(Wallet)
    private invoicesRepository = AppDataSource.getRepository(Invoice)
    private invoicesTypeRepository = AppDataSource.getRepository(InvoiceType)
    private walletTransActions = AppDataSource.getRepository(WalletTransaction)
    private walletTransactionRepository = AppDataSource.getRepository(WalletTransaction);
    private paymentInfoRepository = AppDataSource.getRepository(PaymentInfo);
    private convertInvoice = AppDataSource.getRepository(convertTradeInvoice)
    private productLists = AppDataSource.getRepository(productList)
    private otpRepository = AppDataSource.getRepository(Otp)
    private goldPrice2 = AppDataSource.getRepository(goldPrice)
    private smsService = new SmsService()
    private interservice = new logger()
    private jwtService = new JwtService()
    

    private async generateInvoice() {
        return (new Date().getTime()).toString()
    }
    
    async createTransAction(req : Request , res : Response , next  : NextFunction){
        let admin = `${req.user.firstName}-${req.user.lastName}`;
        console.log('bodyyyy>>>>>>>>>>>' , req.body)
        let nationalCode = req.body.nationalCode;
        let user = await this.userRepository.findOne({where : {
            nationalCode : nationalCode
        }})
        let systemUser = await this.userRepository.findOne({where : {
            isSystemUser:true
        }})
        let { productList } = req.body;
        let queryRunner = AppDataSource.createQueryRunner()
        await queryRunner.connect()
        await queryRunner.startTransaction()
        try {
            let goldPrice = await this.goldPrice2.find({order : {createdAt : 'DESC'}})
            let invoice = this.convertInvoice.create({goldPrice : +goldPrice[0].Geram18 , goldWeight : 0 , 
                buyer : user,
                seller : systemUser,
                date : new Date().toLocaleString('fa-IR').split(',')[0],
                time : new Date().toLocaleString('fa-IR').split(',')[1],
                invoiceId : await this.generateInvoice(),
                totalInvoicePrice : +req.body.totalInvoicePrice,
                adminId : admin,
                status : 'init',
                description : '',
                tradeType : TradeType.INPERSONCONVERT,
            })
            console.log('created invoice>>>' , invoice)
            let createdInvoice = await queryRunner.manager.save(invoice)
            for (let i = 0; i < productList.length; i++) {
                productList[i]['invoice'] = createdInvoice
            }
            let productLists = this.productLists.create(productList)
            console.log('created productList>>>' , productList)
            await queryRunner.manager.save(productLists)
            await queryRunner.commitTransaction()
            let finalInvoice = await this.convertInvoice.findOne({where : {id : createdInvoice.id} , relations : [ 'buyer', 'productList']})
            return next(new responseModel(req, res,'پیش فاکتور با موفقیت ایجاد شد', 'admin service', 200, null, finalInvoice))
        } catch (error) {
            console.log('error in occured in creating first transAction in converting inperson' , error)
            await queryRunner.rollbackTransaction()
            return next(new responseModel(req, res,'مشکلی در ایجاد فاکتور پیش امده لطفا دقایقی دیگر مچددا تلاش کنید', 'admin service', 400, 'مشکلی در ایجاد فاکتور پیش امده لطفا دقایقی دیگر مچددا تلاش کنید.', null))
        }finally{
            console.log('transAction released')
            await queryRunner.release()
        }
    }




    async setPayment(req: Request, res: Response, next: NextFunction) {
        let id = req.params.id;
        let invoice = await this.convertInvoice.findOne({
            where: {
                id: +id
            }, relations: ['buyer', 'buyer.wallet']
        })
        if (!invoice) {
            return next(new responseModel(req, res, 'فاکتور یافت نشد', 'admin service', 400, 'فاکتور یافت نشد.', null))
        }

        let { paymentType,
            cash,
            totalCash,
            installmentType,
            payment,
            creditCard,
            transfer,
            chequeNumber,
            goldWeight,
            creditCardId,
            transferId
        } = req.body;

        let queryRunner = AppDataSource.createQueryRunner()
        await queryRunner.connect()
        await queryRunner.startTransaction()
        try {
            invoice.paymentType = +paymentType;
            if (paymentType == 0) {      // when user wanted to pay cash
                if (payment == 0) {                                         // when the user wanted to pay ghesti
                    invoice.payment = +payment        
                    invoice.totalCash = totalCash
                    invoice.installmentType = +installmentType;
                    invoice.requiredToPay = ((+invoice.totalInvoicePrice - (+totalCash))).toString()
                    // invoice.paymentMethod = +paymentMethod;     // how to pay the cash
                    invoice.creditCard = creditCard;
                    invoice.transfer = transfer;
                    invoice.cash = cash,
                    invoice.creditCardId = creditCardId      // transaction id for paying cash
                    invoice.transferId = transferId
                } else if (payment == 1) {                  // when the user wanted to pay whole cashe
                    invoice.payment = +payment
                    // invoice.paymentMethod = +paymentMethod;
                    invoice.creditCard = creditCard;
                    invoice.transfer = transfer;
                    invoice.cash = cash,
                    invoice.creditCardId = creditCardId      // transaction id for paying cash
                    invoice.transferId = transferId
                } else if (payment == 2) {                                    // when the user wanted to pay checki
                    invoice.payment = +payment;
                    invoice.totalCash = totalCash;
                    // invoice.paymentMethod = +paymentMethod;     // how to pay the cash
                    invoice.creditCardId = creditCardId      // transaction id for paying cash
                    invoice.creditCard = creditCard;
                    invoice.transfer = transfer;
                    invoice.cash = cash,
                    invoice.transferId = transferId;      // transaction id for paying cash
                    invoice.chequeNumber = chequeNumber;
                }
            }
            if (paymentType == 1) {          // when user wanted to pay cash and goldBox
                invoice.goldWeight = goldWeight;
                if (+goldWeight > +invoice.buyer.wallet.goldWeight) {
                    return next(new responseModel(req, res, 'موجودی صندوق طلا کافی نمیباشد', 'admin service', 400, 'موجودی صندوق طلا کافی نمیباشد.', null))
                }
                invoice.buyer.wallet.goldWeight = (+invoice.buyer.wallet.goldWeight) - (+goldWeight)
                if (payment == 0) {                                         // when the user wanted to pay ghesti
                    invoice.payment = +payment
                    invoice.totalCash = totalCash
                    invoice.installmentType = +installmentType;
                    invoice.requiredToPay = ((invoice.totalInvoicePrice - (+totalCash)) - (+goldWeight * +invoice.goldPrice)).toString()
                    // invoice.paymentMethod = +paymentMethod;     // how to pay the cash
                    invoice.creditCard = creditCard;
                    invoice.transfer = transfer;
                    invoice.cash = cash,
                    invoice.creditCardId = creditCardId      // transaction id for paying cash
                    invoice.transferId = transferId      // transaction id for paying cash
                } else if (payment == 1) {                                    // when the user wanted to pay whole cashe
                    invoice.payment = +payment
                    // invoice.paymentMethod = +paymentMethod;
                    invoice.creditCard = creditCard;
                    invoice.transfer = transfer;
                    invoice.cash = cash,
                    invoice.creditCardId = creditCardId      // transaction id for paying cash
                    invoice.transferId = transferId
                } else if (payment == 2) {                                    // when the user wanted to pay checki
                    invoice.payment = +payment;
                    invoice.totalCash = totalCash;
                    // invoice.paymentMethod = +paymentMethod;     // how to pay the cash
                    invoice.creditCard = creditCard;
                    invoice.transfer = transfer;
                    invoice.cash = cash,
                    invoice.creditCardId = creditCardId      // transaction id for paying cash
                    invoice.transferId = transferId;      // transaction id for paying cash
                    invoice.chequeNumber = chequeNumber;
                }
            }
            if (paymentType == 2) {                      // when user wanted to pay just in goldBox
                invoice.goldWeight = goldWeight;
                if (+goldWeight > +invoice.buyer.wallet.goldWeight) {
                    return next(new responseModel(req, res, 'موجودی صندوق طلا کافی نمیباشد', 'admin service', 400, 'موجودی صندوق طلا کافی نمیباشد.', null))
                }
                invoice.buyer.wallet.goldWeight = (+invoice.buyer.wallet.goldWeight) - (+goldWeight)
            }
            invoice.status = 'pending'
            let wallet = await queryRunner.manager.save(invoice.buyer.wallet)
            let updatedInvoice = await queryRunner.manager.save(invoice)
            await queryRunner.commitTransaction()
            return next(new responseModel(req, res, 'فاکتور با موفقیت ایجاد شد', 'admin service', 200, null, updatedInvoice))
        } catch (error) {
            console.log('error occured in creating paymentmethod' , error)
            await queryRunner.rollbackTransaction()
            return next(new responseModel(req, res, 'مشکلی در ایجاد فاکتور نهایی بوجود آمده . . .لطفا مقادیر ورودی خود را چک کنید', 'admin service', 500, 'مشکلی در ایجاد فاکتور نهایی بوجود آمده . . .لطفا مقادیر ورودی خود را چک کنید.', null))
        } finally {
            console.log('transaction released >>>')
            await queryRunner.release()
        }
    }



    async getAllConvertsInvoice(req: Request, res: Response, next: NextFunction){
        let invoices = await this.convertInvoice.find({where : {status : 'pending'} , relations : ['buyer' , 'buyer.wallet']})
        return next(new responseModel(req, res, '', 'admin service', 200, null, invoices))
    }


    async getSpecificConvertInvoice(req: Request, res: Response, next: NextFunction){
        let invoice = await this.convertInvoice.findOne({where : {id : req.params.id}})
        return next(new responseModel(req, res, '', 'admin service', 200, null, invoice))
    }

}