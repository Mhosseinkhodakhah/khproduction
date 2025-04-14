import { AppDataSource } from "../data-source"
import { NextFunction, Request, Response } from "express"
import { User } from "../entity/User"
import { responseModel } from "../util/response.model";
import { Wallet } from "../entity/Wallet";
import { SmsService } from "../services/sms-service/message-service";
import { Invoice } from "../entity/Invoice";
import { TradeType } from "../entity/enums/TradeType";
import { InvoiceType } from "../entity/InvoiceType";


export class RemittanceController {
    private userRepository = AppDataSource.getRepository(User)
    private walletRepository = AppDataSource.getRepository(Wallet)
    private remittanceRepository = AppDataSource.getRepository(Invoice)
    private typeRepo = AppDataSource.getRepository(InvoiceType)
    // private estimateWeight = new estimatier()
    


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