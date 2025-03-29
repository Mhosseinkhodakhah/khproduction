import { AppDataSource } from "../data-source"
import { goldPrice } from "../entity/goldPrice"
import { convertTradeInvoice } from "../entity/inpersonConvertTrade.entity"
import { Invoice } from "../entity/Invoice"
import { InvoiceType } from "../entity/InvoiceType"
import { Otp } from "../entity/Otp"
import { PaymentInfo } from "../entity/PaymentInfo"
import { User } from "../entity/User"
import { Wallet } from "../entity/Wallet"
import { WalletTransaction } from "../entity/WalletTransaction"
import logger from "../services/interservice/logg.service"
import { JwtService } from "../services/jwt-service/jwt-service"
import { SmsService } from "../services/sms-service/message-service"
import { Request, Response, NextFunction } from "express";






export default class invoiceConvertorController{
    private userRepository = AppDataSource.getRepository(User)
    private walletRepository = AppDataSource.getRepository(Wallet)
    private invoicesRepository = AppDataSource.getRepository(Invoice)
    private invoicesTypeRepository = AppDataSource.getRepository(InvoiceType)
    private walletTransActions = AppDataSource.getRepository(WalletTransaction)
    private walletTransactionRepository = AppDataSource.getRepository(WalletTransaction);
    private paymentInfoRepository = AppDataSource.getRepository(PaymentInfo);
    private convertInvoice = AppDataSource.getRepository(convertTradeInvoice)
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
        let userId = req.params.id;
        let user = await this.userRepository.findOne({where : {
            id : +userId
        }})
        let systemUser = await this.userRepository.findOne({where : {
            isSystemUser:true
        }})
        let { productList } = req.body;
        let goldPrice = await this.goldPrice2.findOne({order : {createdAt : 'DESC'}})
        let invoice = this.invoicesRepository.create({goldPrice : +goldPrice[0].Geram18 , goldWeight : 0 , 
            date : new Date().toLocaleString('fa-IR').split(',')[0],
            time : new Date().toLocaleString('fa-IR').split(',')[1],
            invoiceId : await this.generateInvoice()
        })
        // for (let i = 0; i < productList.length; i++) {
        //     productList[i]['buyer'] = user;
        //     productList[i]['seller'] = systemUser
            
        // }
        // let invoiceConver = this.convertInvoice.create({

        // })


    }




}