import { AppDataSource } from "../data-source"
import { NextFunction, Request, Response } from "express"
import { User } from "../entity/User"
import { Remmitance } from "../entity/Remmitance"
import { response } from "../responseModel/response.model";
import { LastService } from "../services/intrnal-service/lastService-serivce";
import { Wallet } from "../entity/wallet";
import { SmsService } from "../services/sms-service/sms-service";


export class RemittanceController {
    private remittanceRepository = AppDataSource.getRepository(Remmitance)
    private userRepository = AppDataSource.getRepository(User)
    private interservice = new LastService()
    private walletRepository = AppDataSource.getRepository(Wallet)
    private smsService = new SmsService()
    private lastServiceService = new LastService()
    private async generateInvoice() {
        return (new Date().getTime()).toString()
    }

    async all(req: Request, res: Response, next: NextFunction) {
        try {
            let remittances = await this.remittanceRepository.find()
            return next(new response(req, res, 'get all remmitance', 200, null, remittances))

        } catch (error) {
            console.log("error in find all of remittances", error);
            return next(new response(req, res, 'get all remmitance', 500, error, null))
        }
    }

    async one(req: Request, res: Response, next: NextFunction) {
        const id = parseInt(req.params.id)

        try {
            const remittance = await this.remittanceRepository.findOne({
                where: { id }
            })
            if (!remittance) {
                return next(new response(req, res, 'get one remmitance', 400, 'حواله پیدا نشد', null))
            }

            return next(new response(req, res, 'get one remmitance', 200, null, remittance))

        } catch (error) {
            console.log("error in find remittance by id ", error);
            return next(new response(req, res, 'create sell remmitance ', 500, error, null))
        }
    }

    async createBuy(req: Request, res: Response, next: NextFunction) {
        const adminId = `${req.user.id}-${req.user.firstName}-${req.user.lastName}`;
        let { goldPrice, goldWeight, totalPrice, phoneNumber, description, date, destCardPan, originCardPan, time } = req.body;
        console.log('phone' , phoneNumber)
        const resultFromLastService = await this.lastServiceService.checkExistUserInLastService(phoneNumber)
        
        if (resultFromLastService.response){
            if (resultFromLastService.response.status >= 500) {
                return next(new response(req, res, 'create buy remmitance ', 500, "خطای داخلی سرویس", null))
            }
            if (resultFromLastService.response.status >= 500) {
                return next(new response(req, res, 'create buy remmitance ', 500, "خطای داخلی سرویس", null))
            }
        }
        if (resultFromLastService.exist == false ){
            return next(new response(req, res, 'create buy remmitance ', 400 , "کاربر وجود ندارد", null))
        }
        if (!resultFromLastService.exist){
            return next(new response(req, res, 'create buy remmitance ', 500 , "خطای داخلی سرویس" , null))
        }

        console.log('test body', req.body)
        if (totalPrice.toString().includes(',')){
            totalPrice  = totalPrice.replaceAll(',' , '')
            console.log('new totalPrice , ' , totalPrice)
        }
        console.log('tot' , totalPrice)
        // const user = await this.userRepository.findOneBy({ phoneNumber })
        let user = resultFromLastService.user;
        if (!user) {
            return next(new response(req, res, 'create buy remmitance ', 422, "کاربر وجود ندارد", null))
        }

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
                type: 1,
                buyer: resultFromLastService.user
            })
            createRemmitance.destCardPan = destCardPan
            createRemmitance.originCardPan = originCardPan
            let savedRemitance1 = await queryRunner.manager.save(createRemmitance)
            console.log('remitanceId', savedRemitance1)
            await queryRunner.commitTransaction()
            let savedRemmitance2 = await this.remittanceRepository.findOne({ where: { id: savedRemitance1.id }, relations: ['buyer', 'buyer.wallet'] })
            console.log('after getting from databse >>>' , savedRemmitance2)
            await this.smsService.sendGeneralMessage(user.phoneNumber, "sellcall", user.firstName, goldWeight, totalPrice)
            return next(new response(req, res, 'create buy remmitance ', 200, null, savedRemmitance2))
        }
        catch (err) {
            console.log(err);
            await queryRunner.rollbackTransaction()
            return next(new response(req, res, 'create buy remmitance', 500, err, null))
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
        const resultFromLastService = await this.lastServiceService.checkExistUserInLastService(phoneNumber)
        
        if (resultFromLastService.response.status >= 500){
            return next(new response(req, res, 'create buy remmitance ', 500 , "خطای داخلی سرویس" , null))
        }

        if (resultFromLastService.response.status >= 500){
            return next(new response(req, res, 'create buy remmitance ', 500 , "خطای داخلی سرویس" , null))
        }

        if (!resultFromLastService.exist){
            return next(new response(req, res, 'create buy remmitance ', 500 , "خطای داخلی سرویس" , null))
        }
        
        if (resultFromLastService.exist == false ){
            return next(new response(req, res, 'create buy remmitance ', 400 , "کاربر وجود ندارد", null))
        }
        if (totalPrice.toString().includes(',')){
            totalPrice  = totalPrice.replaceAll(',' , '')
            console.log('new totalPrice , ' , totalPrice)
        }
        console.log('tot' , totalPrice)

        const user=resultFromLastService.user
        console.log('wallet>>>' , user.wallet)
        if(!user){
            return next(new response(req, res, 'create buy remmitance ',422,"کاربر وجود ندارد",null))
        }


        if (+user.wallet.goldWeight < +goldWeight){
            return next(new response(req, res, 'create buy remmitance ',422,"موجودی صندوق طلای کاربر کافی نمیباشد",null))
        }

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
                type: 0,
                seller: user
            })
            
            let savedRemitance1 = await queryRunner.manager.save(createRemmitance)
            console.log('after creations', savedRemitance1)
            await queryRunner.commitTransaction()
            await this.smsService.sendGeneralMessage(user.phoneNumber, "selldasti", user.firstName, goldPrice, totalPrice)
            let savedRemmitance2 = await this.remittanceRepository.findOne({ where: { id: savedRemitance1.id }, relations: ['seller', 'seller.wallet'] })
            return next(new response(req, res, 'create sell remmitance ', 200, null, savedRemmitance2))
        }
        catch (err) {
            console.log(err);
            await queryRunner.rollbackTransaction()
            return next(new response(req, res, 'create sell remmitance', 500, err, null))
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
            return next(new response(req, res, 'update remmitance ', 200, null, remmitance))

        }
        catch (err) {
            console.log(err);
            await queryRunner.rollbackTransaction()
            return next(new response(req, res, 'update buy remmitance', 500, err, null))
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
        const remmitance = await this.remittanceRepository.findOne({ where: { id: remmitanceId } , relations : ['buyer' , 'seller' , 'buyer.wallet' , 'seller.wallet']})
        const queryRunner = AppDataSource.createQueryRunner()
        await queryRunner.connect()
        await queryRunner.startTransaction()
        const invoiceId = await this.generateInvoice()
        try {
            remmitance.status = "completed"
            remmitance.accounterId = accounterId;
            remmitance.invoiceId = invoiceId;
            remmitance.accounterDescription = description;
            if (remmitance.type == 0){
                remmitance.seller.wallet.goldWeight = (+remmitance.seller.wallet.goldWeight) - (+remmitance.goldWeight)
                let lastService = await this.interservice.updateUserWallet(0 , remmitance.seller.phoneNumber , remmitance.goldWeight)
                if (!lastService){
                    await queryRunner.rollbackTransaction()
                    return next(new response(req, res, ' approve remmitance', 500, 'مشکلی در اپدیت موجودی کیف پول کاربر بوجود امده', null))
                }
            }else if (remmitance.type == 1){
                remmitance.buyer.wallet.goldWeight = (+remmitance.buyer.wallet.goldWeight) + (+remmitance.goldWeight)
                let lastService = await this.interservice.updateUserWallet(1 , remmitance.buyer.phoneNumber , remmitance.goldWeight)
                if (!lastService){
                    await queryRunner.rollbackTransaction()
                    return next(new response(req, res, ' approve remmitance', 500, 'مشکلی در اپدیت موجودی کیف پول کاربر بوجود امده', null))
                }
            }
            await queryRunner.manager.save(remmitance)
            await queryRunner.commitTransaction()
            await this.smsService.sendGeneralMessage(remmitance.buyer.phoneNumber, "buy", remmitance.buyer.firstName,remmitance.goldWeight ,remmitance.totalPrice )
            return next(new response(req, res, 'approve remmitance ', 200, null, remmitance))
        }
        catch (err) {
            console.log(`${err}`);
            await queryRunner.rollbackTransaction()
            return next(new response(req, res, ' approve remmitance', 500, err, null))
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
        const remmitance = await this.remittanceRepository.findOne({ where: { id: remmitanceId } , relations : ['buyer' , 'seller']})
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
            await this.smsService.sendGeneralMessage(remmitance.buyer.phoneNumber, "rejectcall", remmitance.buyer.firstName, remmitance.goldWeight ,remmitance.totalPrice )
            return next(new response(req, res, 'reject remmitance ', 200, null, remmitance))
        }
        catch (err) {
            console.log(err);
            await queryRunner.rollbackTransaction()
            return next(new response(req, res, 'reject remmitance', 500, err, null))
        }
        finally {
            console.log('transaction released')
            await queryRunner.release()
        }


    }


    async getByStatusBuyRemmitance(req: Request, res: Response, next: NextFunction) {
        const status = req.params.status
        try {
            const remmitances = await this.remittanceRepository.find({
                where: {
                    status,
                    type: 1,
                }, relations: ["buyer"], order: { updatedAt: 'DESC' }
            })


            return next(new response(req, res, 'get  buy remmitance with status ', 200, null, remmitances))
        }
        catch (err) {
            return next(new response(req, res, 'get  buy remmitance with status', 500, err, null))
        }

    }


    async getByStatusSellRemmitance(req: Request, res: Response, next: NextFunction) {
        const status = req.params.status
        try {
            const remmitances = await this.remittanceRepository.find({
                where: {
                    status,
                    type: 0,
                }, relations: ["seller"], order: { updatedAt: 'DESC' }
            })

            return next(new response(req, res, 'get  sell remmitance with status ', 200, null, remmitances))
        }
        catch (err) {
            return next(new response(req, res, 'get  sell remmitance with status', 500, err, null))
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