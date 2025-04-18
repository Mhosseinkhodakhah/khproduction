import { AppDataSource } from "../data-source"
import { NextFunction, Request, Response } from "express"
import { User } from "../entity/User"
import { responseModel } from "../util/response.model";
import { Wallet } from "../entity/Wallet";
import { SmsService } from "../services/sms-service/message-service";
import { Invoice } from "../entity/Invoice";
import { TradeType } from "../entity/enums/TradeType";
import { InvoiceType } from "../entity/InvoiceType";
import { estimatier } from "../util/estimate.util";


export class RemittanceController {
    private userRepository = AppDataSource.getRepository(User)
    private walletRepository = AppDataSource.getRepository(Wallet)
    private remittanceRepository = AppDataSource.getRepository(Invoice)
    private typeRepo = AppDataSource.getRepository(InvoiceType)
    private estimateWeight = new estimatier()
    
    private smsService = new SmsService()
    private async generateInvoice() {
        return (new Date().getTime()).toString()
    }

    async all(req: Request, res: Response, next: NextFunction) {
        try {
            let remittances = await this.remittanceRepository.find({where : {tradeType : TradeType.REMMITANCE}})
            return next(new responseModel(req, res, '','get all remmitance', 200, null, remittances))

        } catch (error) {
            console.log("error in find all of remittances", error);
            return next(new responseModel(req , res, '','get all remmitance', 500, error, null))
        }
    }

    async one(req: Request, res: Response, next: NextFunction) {
        const id = parseInt(req.params.id)

        try {
            const remittance = await this.remittanceRepository.findOne({
                where: { id : id , tradeType : TradeType.REMMITANCE}
            })
            if (!remittance) {
                return next(new responseModel(req, res,'', 'get one remmitance', 400, 'حواله پیدا نشد', null))
            }

            return next(new responseModel(req, res,'', 'get one remmitance', 200, null, remittance))

        } catch (error) {
            console.log("error in find remittance by id ", error);
            return next(new responseModel(req, res,'', 'create sell remmitance ', 500, error, null))
        }
    }

    async createBuy(req: Request, res: Response, next: NextFunction) {
        const adminId = `${req.user.id}-${req.user.firstName}-${req.user.lastName}`;
        let { goldPrice, goldWeight, totalPrice, phoneNumber, description, date, destCardPan, originCardPan, time } = req.body;
        console.log('phone' , phoneNumber)
        
        console.log('test body', req.body)
        if (totalPrice.toString().includes(',')){
            totalPrice  = totalPrice.replaceAll(',' , '')
            console.log('new totalPrice , ' , totalPrice)
        }
        console.log('tot' , totalPrice)
        // const user = await this.userRepository.findOneBy({ phoneNumber })
        let user = await this.userRepository.findOne({where : {phoneNumber : phoneNumber}})
        if (!user) {
            return next(new responseModel(req, res,'', 'create buy remmitance ', 422, "کاربر وجود ندارد", null))
        }   
        let type = await this.typeRepo.findOne({where : {title : 'buy'}})
        let systemUser = await this.userRepository.findOne({where : {isSystemUser : true}})
        const queryRunner = AppDataSource.createQueryRunner()
        await queryRunner.connect()
        await queryRunner.startTransaction()
        try {
            const createRemmitance = this.remittanceRepository.create({
                goldPrice,
                totalPrice,
                goldWeight,
                description,
                originCardPan,
                time,
                date,
                adminId,
                status: "pending",
                type: type,
                buyer: user,
                seller : systemUser,
                tradeType : TradeType.REMMITANCE
            })
            createRemmitance.destCardPan = destCardPan
            createRemmitance.originCardPan = originCardPan
            let savedRemitance1 = await queryRunner.manager.save(createRemmitance)
            console.log('remitanceId', savedRemitance1)
            await queryRunner.commitTransaction()
            let savedRemmitance2 = await this.remittanceRepository.findOne({ where: { id: savedRemitance1.id }, relations: ['buyer', 'buyer.wallet'] })
            console.log('after getting from databse >>>' , savedRemmitance2)
            await this.smsService.sendGeneralMessage(user.phoneNumber, "sellcall", user.firstName, goldWeight, totalPrice)
            return next(new responseModel(req, res,'', 'create buy remmitance ', 200, null, savedRemmitance2))
        }
        catch (err) {
            console.log(err);
            await queryRunner.rollbackTransaction()
            return next(new responseModel(req, res,'', 'create buy remmitance', 500, err, null))
        }
        finally {
            console.log('transaction released')
            await queryRunner.release()
        }
    }

    async createSell(req: Request, res: Response, next: NextFunction) {

        const adminId=`${req.user.id}-${req.user.firstName}-${req.user.lastName}`;
        let { goldPrice, goldWeight, totalPrice , phoneNumber  ,description ,date , destCardPan , originCardPan,time} = req.body;
        console.log(phoneNumber);

        if (totalPrice.toString().includes(',')){
            totalPrice  = totalPrice.replaceAll(',' , '')
            console.log('new totalPrice , ' , totalPrice)
        }
        console.log('tot' , totalPrice)

        const user=await this.userRepository.findOne({where : {phoneNumber : phoneNumber} , relations : ['wallet']})
        let systemUser = await this.userRepository.findOne({where : {isSystemUser : true}})
        console.log('wallet>>>' , user.wallet)
        if(!user){
            return next(new responseModel(req, res,'', 'create buy remmitance ',422,"کاربر وجود ندارد",null))
        }
        if (+user.wallet.goldWeight < +goldWeight){
            return next(new responseModel(req, res,'', 'create buy remmitance ',422,"موجودی صندوق طلای کاربر کافی نمیباشد",null))
        }
        let type = await this.typeRepo.findOne({where : {title : 'sell'}})
        const queryRunner = AppDataSource.createQueryRunner()
        await queryRunner.connect()
        await queryRunner.startTransaction()
        try {
            const createRemmitance = this.remittanceRepository.create({
                goldPrice,
                totalPrice,
                goldWeight,
                description,
                destCardPan,
                originCardPan,
                time,
                date,
                adminId,
                status: "pending",
                type: type,
                seller: user,
                buyer : systemUser,
                tradeType : TradeType.REMMITANCE
            })
            
            let savedRemitance1 = await queryRunner.manager.save(createRemmitance)
            console.log('after creations', savedRemitance1)
            await queryRunner.commitTransaction()
            await this.smsService.sendGeneralMessage(user.phoneNumber, "selldasti", user.firstName, goldPrice, totalPrice)
            let savedRemmitance2 = await this.remittanceRepository.findOne({ where: { id: savedRemitance1.id }, relations: ['seller', 'seller.wallet'] })
            return next(new responseModel(req, res,'', 'create sell remmitance ', 200, null, savedRemmitance2))
        }
        catch (err) {
            console.log(err);
            await queryRunner.rollbackTransaction()
            return next(new responseModel(req, res,'', 'create sell remmitance', 500, err, null))
        }
        finally {
            console.log('transaction released')
            await queryRunner.release()
        }
    }


    async updateRemmitance(req: Request, res: Response, next: NextFunction) {
        const adminId = `${req.user.id}-${req.user.firstName}-${req.user.lastName}`;
        const { goldPrice, goldWeight, totalPrice, description, date, destCardPan, originCardPan } = req.body;
        const remmitanceId = req.params.id
        const remmitance = await this.remittanceRepository.findOne({ where: { id: remmitanceId } })
        const queryRunner = AppDataSource.createQueryRunner()
        await queryRunner.connect()
        await queryRunner.startTransaction()
        try {
            remmitance.goldPrice = goldPrice ? goldPrice : remmitance.goldPrice
            remmitance.goldWeight = goldWeight ? goldWeight : remmitance.goldWeight
            remmitance.totalPrice = totalPrice ? totalPrice : remmitance.totalPrice
            remmitance.destCardPan = destCardPan ? destCardPan : remmitance.destCardPan
            remmitance.originCardPan = originCardPan ? originCardPan : remmitance.originCardPan
            remmitance.description = description ? description : remmitance.description
            remmitance.time = date ? new Date(date).toLocaleString('fa-IR').split(',')[1] : remmitance.time
            remmitance.date = date ? new Date(date).toLocaleString('fa-IR').split(',')[0] : remmitance.date
            remmitance.adminId = adminId

            await queryRunner.manager.save(remmitance)
            await queryRunner.commitTransaction()
            return next(new responseModel(req, res,'', 'update remmitance ', 200, null, remmitance))

        }
        catch (err) {
            console.log(err);
            await queryRunner.rollbackTransaction()
            return next(new responseModel(req, res,'', 'update buy remmitance', 500, err, null))
        }
        finally {
            console.log('transaction released')
            await queryRunner.release()
        }

    }


    async approveRemmitance(req: Request, res: Response, next: NextFunction) {
        const remmitanceId = req.params.id
        const {description} = req.body
        const accounterId = `${req.user.id}-${req.user.firstName}-${req.user.lastName}`;
        const remmitance = await this.remittanceRepository.findOne({ where: { id: remmitanceId } , relations : ['buyer' , 'seller' ,'type' ,'buyer.wallet' , 'seller.wallet']})
        const queryRunner = AppDataSource.createQueryRunner()
        await queryRunner.connect()
        await queryRunner.startTransaction()
        const invoiceId = await this.generateInvoice()
        try {
            remmitance.status = "completed"
            remmitance.accounterId = accounterId;
            remmitance.invoiceId = invoiceId;
            remmitance.accounterDescription = description;
            if (remmitance.type.title == 'sell'){
                remmitance.seller.wallet.goldWeight = +((+remmitance.seller.wallet.goldWeight) - (+remmitance.goldWeight)).toFixed(3)
                remmitance.buyer.wallet.goldWeight = +((+remmitance.buyer.wallet.goldWeight) + (+remmitance.goldWeight)).toFixed(3)
                await this.estimateWeight.estimateWeight(+remmitance.goldWeight , 0)
            }else if (remmitance.type.title == 'buy'){
                remmitance.buyer.wallet.goldWeight = +((+remmitance.buyer.wallet.goldWeight) + (+remmitance.goldWeight)).toFixed(3)
                remmitance.seller.wallet.goldWeight = +((+remmitance.seller.wallet.goldWeight) - (+remmitance.goldWeight)).toFixed(3)
                await this.estimateWeight.estimateWeight(+remmitance.goldWeight , 1)
            }
            console.log( 'goldweights logs', remmitance.buyer.wallet.goldWeight
                ,remmitance.seller.wallet.goldWeight)
            await queryRunner.manager.save(remmitance.buyer.wallet)
            await queryRunner.manager.save(remmitance.seller.wallet)
            await queryRunner.manager.save(remmitance)
            
            await queryRunner.commitTransaction()
            if (remmitance.type.title == 'sell'){
                await this.smsService.sendGeneralMessage(remmitance.seller.phoneNumber, "buy", remmitance.seller.firstName,remmitance.goldWeight ,remmitance.totalPrice )
            }else if (remmitance.type.title == 'buy'){
                await this.smsService.sendGeneralMessage(remmitance.buyer.phoneNumber, "buy", remmitance.buyer.firstName,remmitance.goldWeight ,remmitance.totalPrice )
            }            
            return next(new responseModel(req, res,'حواله با موفقیت ایجاد شد', 'approve remmitance ', 200, null, remmitance))
        }catch (err) {
            console.log(err);
            await queryRunner.rollbackTransaction() 
            return next(new responseModel(req, res,'', ' approve remmitance', 500, 'مشکلی در تایید فاکتور حواله بوجود آمده است.', null))
        }
        finally {
            console.log('transaction released')
            await queryRunner.release()
        }
    }


    async rejectRemmitance(req: Request, res: Response, next: NextFunction) {
        const remmitanceId = req.params.id
        const {description} = req.body
        const accounterId = `${req.user.id}-${req.user.firstName}-${req.user.lastName}`;
        const remmitance = await this.remittanceRepository.findOne({ where: { id: remmitanceId } , relations : ['buyer' , 'type' ,'seller']})
        const queryRunner = AppDataSource.createQueryRunner()
        await queryRunner.connect()
        await queryRunner.startTransaction()
        const invoiceId = await this.generateInvoice()
        try {
            remmitance.status = "failed"
            remmitance.accounterId = accounterId
            remmitance.invoiceId = invoiceId
            remmitance.accounterDescription = description;
            await queryRunner.manager.save(remmitance)
            await queryRunner.commitTransaction()
            if (remmitance.type.title == 'sell'){
                await this.smsService.sendGeneralMessage(remmitance.seller.phoneNumber, "rejectcall", remmitance.seller.firstName, remmitance.goldWeight ,remmitance.totalPrice )
            }else if (remmitance.type.title == 'buy'){
                await this.smsService.sendGeneralMessage(remmitance.buyer.phoneNumber, "rejectcall", remmitance.buyer.firstName, remmitance.goldWeight ,remmitance.totalPrice )
            }        
            return next(new responseModel(req, res,'رد حواله با موفقیت انجام شد', 'reject remmitance ', 200, null, remmitance))
        }
        catch (err) {
            console.log(err);
            await queryRunner.rollbackTransaction()
            return next(new responseModel(req, res,'', 'reject remmitance', 500, 'مشکلی در رد حواله ایجاد شده است', null))
        }
        finally {
            console.log('transaction released')
            await queryRunner.release()
        }


    }


    async getByStatusBuyRemmitance(req: Request, res: Response, next: NextFunction) {
        const status = req.params.status
        let type  = await this.typeRepo.findOne({where : {title : 'buy'}})
        try {
            let remm = await this.remittanceRepository.createQueryBuilder('invoice')
            .leftJoinAndSelect('invoice.buyer' , 'buyer')
            .leftJoinAndSelect('invoice.type' , 'type')
            .where('invoice.status = :status AND invoice.tradeType = :trade AND type.title = :title' , {status : status , trade : TradeType.REMMITANCE , title : 'buy'})
            .getMany()
            // const remmitances = await this.remittanceRepository.find({
            //     where: {
            //         status,
            //         tradeType : TradeType.REMMITANCE
            //     }, relations: ["buyer"], order: { updatedAt: 'DESC' }
            // })


            return next(new responseModel(req, res,'', 'get  buy remmitance with status ', 200, null, remm))
        }
        catch (err) {
            return next(new responseModel(req, res,'', 'get  buy remmitance with status', 500, err, null))
        }

    }


    async getByStatusSellRemmitance(req: Request, res: Response, next: NextFunction) {
        const status = req.params.status
        let type  = await this.typeRepo.findOne({where : {title : 'sell'}})
        try {
            let remm = await this.remittanceRepository.createQueryBuilder('invoice')
            .leftJoinAndSelect('invoice.seller' , 'seller')
            .leftJoinAndSelect('invoice.type' , 'type')
            .where('invoice.status = :status AND invoice.tradeType = :trade AND type.title = :title' , {status : status , trade : TradeType.REMMITANCE , title : 'sell'})
            .getMany()
            // const remmitances = await this.remittanceRepository.find({
            //     where: {
            //         status,
            //         tradeType : TradeType.REMMITANCE
            //     }, relations: ["seller"], order: { updatedAt: 'DESC' }
            // })

            return next(new responseModel(req, res,'', 'get  sell remmitance with status ', 200, null, remm))
        }
        catch (err) {
            return next(new responseModel(req, res,'', 'get  sell remmitance with status', 500, err, null))
        }

    }


    async remove(request: Request, response: Response, next: NextFunction) {
        const id = parseInt(request.params.id)
        try {
            let remittanceToRemove = await this.remittanceRepository.findOneBy({ id })

            if (!remittanceToRemove) {
                return response.status(404).json({ err: "remittance with this id not found" })
            }

            await this.remittanceRepository.remove(remittanceToRemove)

            return response.json({ msg: "remittance has been removed" })

        } catch (error) {
            console.log("error in deleting remittance ", error);
            response.status(500).json({ err: "error in deleting remittance" })
        }
    }
}