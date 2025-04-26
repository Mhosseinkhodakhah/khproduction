import { AppDataSource } from "../data-source";
import { InvoiceType } from "../entity/InvoiceType";
import { Request, Response, NextFunction } from "express";
import { User } from "../entity/User";
import { WalletTransaction } from "../entity/WalletTransaction";
import { Wallet } from "../entity/Wallet";
import { Otp } from "../entity/Otp";
import { Invoice } from "../entity/Invoice";
import { EstimateTransactions } from "../entity/EstimateTransactions";
import monitor from "../util/statusMonitor";
import { goldPrice } from "../entity/goldPrice";

export class InvoiceTypeController {

    private typeRepository = AppDataSource.getRepository(InvoiceType);
    private userRepository = AppDataSource.getRepository(User)
    private walletTransActions = AppDataSource.getRepository(WalletTransaction)
    private wallet = AppDataSource.getRepository(Wallet)
    private ivoice = AppDataSource.getRepository(Invoice)
    private otp = AppDataSource.getRepository(Otp)
    private goldPrice = AppDataSource.getRepository(goldPrice)
    private estimate =AppDataSource.getRepository(EstimateTransactions)

    async all(request: Request, response: Response, next: NextFunction) {
        try {
            const types = await this.typeRepository.find();
            monitor.addStatus({
                scope: 'invoice type controller',
                status: 1,
                error: null
            })
            response.status(200).json(types);
        } catch (error) {
            monitor.addStatus({
                scope: 'invoice type controller',
                status: 0,
                error: `${error}`
            })
            console.log("Error in finding types", error);
            return response.status(500).json({msg : "خطای داخلی سیستم"})
        }
    }

    async one(request: Request, response: Response, next: NextFunction) {
        const id = parseInt(request.params.id);

        if (isNaN(id)) {
            monitor.addStatus({
                scope: 'invoice type controller',
                status: 0,
                error: 'invalid type id'
            })

            return response.status(400).json({ error: "Invalid type ID" }); 
        }

        try {
            const type = await this.typeRepository.findOne({
                where: { id },
            });

            if (!type) {
                return response.status(404).json({ error: "type not found" });
            }
            monitor.addStatus({
                scope: 'invoice type controller',
                status: 1,
                error: null
            })

            response.status(200).json(type);
        } catch (error) {
            monitor.addStatus({
                scope: 'invoice type controller',
                status: 0,
                error: `${error}`
            })

            console.log("Error in type by id", error);
            return response.status(500).json({msg : "خطای داخلی سیستم"})
        }
    }

    async save(request: Request, response: Response, next: NextFunction) {
        const { title , persianTitle } = request.body;
        try {

            const typeToCreate = this.typeRepository.create({
                persianTitle,
                title
            });
            const createBankAccount = await this.typeRepository.save(typeToCreate);
            monitor.addStatus({
                scope: 'invoice type controller',
                status: 1,
                error: null
            })

            return response.status(200).json({bank: createBankAccount , msg : "تایپ با موفقیت ساخته شد"});                

            } catch (error) {
                console.log("Error in creating type", error);
                monitor.addStatus({
                    scope: 'invoice type controller',
                    status: 0,
                    error: `${error}`
                })
    
                return response.status(500).json({msg : "خطای داخلی سیستم"})
            }
        }

    async remove(request: Request, response: Response, next: NextFunction) {
        const id = parseInt(request.params.id);

        if (isNaN(id)) {
            monitor.addStatus({
                scope: 'invoice type controller',
                status: 0,
                error: `invalid type id`
            })

            return response.status(400).json({ msg: "Invalid type ID" });
        }

        try {
            const type = await this.typeRepository.findOneBy({ id });

            if (!type) {
                return response.status(404).json({ msg: "تایپ یافت نشد" });
            }

            await this.typeRepository.remove(type);
            response.status(200).json({ msg: "تایپ با موفقیت حذف شد" });
        } catch (error) {
            console.log("Error in deleting bank account", error);
            return response.status(500).json({msg : "خطای داخلی سیستم"})
        }
    }


    async test(request: Request, response: Response, next: NextFunction){
        // const user = await this.userRepository.findOne({where:{
        //     phoneNumber : '09123460671'
        // } , relations : ['wallet']})
        // let user = await this.userRepository.find({relations:['bankAccounts']})
        
        // let updated = []
        // for (let i of user){
        //     if (i.bankAccounts.length){
        //         i.isHaveBank = true;
        //     }
        //     updated.push(i)
        // }

        // await this.userRepository.save(updated)


        // const queryRunner = AppDataSource.createQueryRunner()
        // await queryRunner.connect()
        // await queryRunner.manager.remove(user.sells)
        // await queryRunner.manager.remove(user.buys)
        // await queryRunner.manager.remove(user.wallet)
        // await queryRunner.manager.remove(user)
        // await this.walletTransActions.remove(user.wallet.transactions)
        // await this.ivoice.remove(user.sells)
        // await this.ivoice.remove(user.buys)
        // await this.wallet.remove(user.wallet)
        // await this.userRepository.remove(user)
        
        // let monthes = [{month : '۰۱' , boughtGold : '0' , soldGold : '0'} ,
        //      {month : '۰۲' , boughtGold : '0' , soldGold : '0'} , 
        //      {month : '۰۳' , boughtGold : '0' , soldGold : '0'} ,
        //      {month : '۰۴' , boughtGold : '0' , soldGold : '0'},
        //      {month : '۰۵' , boughtGold : '0' , soldGold : '0'},
        //      {month : '۰۶' , boughtGold : '0' , soldGold : '0'},
        //      {month : '۰۷' , boughtGold : '0' , soldGold : '0'},
        //      {month : '۰۸' , boughtGold : '0' , soldGold : '0'},
        //      {month : '۰۹' , boughtGold : '0' , soldGold : '0'},
        //      {month : '۱۰' , boughtGold : '0' , soldGold : '0'},
        //      {month : '۱۱' , boughtGold : '0' , soldGold : '0'},
        //  ]
        // let newEstimate = this.estimate.create({date : 'localDate' , boughtGold : '0' , soldGold : '0'})
        // await this.estimate.save(newEstimate)
        // let estimates = await this.estimate.find()
        // let system = await this.userRepository.findOne({where : {
        //     isSystemUser : true,
        // } , relations : ['wallet']})
        // system.wallet.balance = 0;
        // system.wallet.goldWeight = 500;
        // await this.wallet.save(system.wallet);

        // let newWallet = await this.userRepository.findOne({where : {
        //     isSystemUser : true
        // } , relations : ['wallet']})

        let estimates = await this.goldPrice.find()
        // await this.estimate.save(estimates)
        // let estimate = await this.estimate.find()
        // let estimate = await this.estimate.createQueryBuilder('estimate')
        // .innerJoin('month' , "month").getMany()

        // const u =await this.otp.find()
        // await this.otp.remove(u)
        // user.blocked = 1300000;
        // await this.wallet.save(user)
        return response.status(200).json(estimates)
    }
}