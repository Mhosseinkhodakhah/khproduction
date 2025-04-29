import { NextFunction, Request, Response } from "express"
import monitor from "../util/statusMonitor"
import { oldUserInterfacelet } from "../interfaces/interface.interface"
import { AppDataSource } from "../data-source"
import { User } from "../entity/User"
import { Wallet } from "../entity/Wallet"
import { responseModel } from "../util/response.model"
import { Invoice } from "../entity/Invoice"
import { EstimateTransactions } from "../entity/EstimateTransactions"
import { goldPrice } from "../entity/goldPrice"



export default class interServiceController{

    private userRepository = AppDataSource.getRepository(User)
    private walletRepository = AppDataSource.getRepository(Wallet)
    private invoiceRepository = AppDataSource.getRepository(Invoice)
    private estimate = AppDataSource.getRepository(EstimateTransactions)
    private goldPrice = AppDataSource.getRepository(goldPrice)

    async getStatus(req : Request , res : Response , next : NextFunction){
        try {
            let data = {
                all :  monitor.requestCount,
                statusCount : monitor.status,
                error : monitor.error
            }
            console.log('status data till here . . .' , data)
            monitor.addStatus({
                scope : 'interservice controller',
                status :  1,
                error : null
            })
            return res.status(200).json(data)
        } catch (error) {
            monitor.addStatus({
                scope : 'interservice controller',
                status :  0,
                error : `${error}`
            })
            console.log(error)
            return res.status(500).json({success : false})
        }
    }


    async updateWallet(req : Request , res : Response , next : NextFunction){
        let user = await this.userRepository.findOne({where : {phoneNumber : req.params.phoneNumber} , relations : ['wallet']})
        console.log('bodyyyyyyyyy' , req.body)
        let queryRunner = AppDataSource.createQueryRunner()
        await queryRunner.connect()
        await queryRunner.startTransaction()
        try {
            if (req.body.state == 0){
                user.wallet.goldWeight = +(((+user.wallet.goldWeight) - (+req.body.goldWeight)).toFixed(3))
            }
            
            if (req.body.state == 1){
                user.wallet.goldWeight = +(((+user.wallet.goldWeight) + (+req.body.goldWeight)).toFixed(3))
            }
            console.log('updated wallet' , user.wallet)
            await queryRunner.manager.save(user.wallet)
            let wallet = await queryRunner.manager.save(user)
            await queryRunner.commitTransaction()
            monitor.addStatus({
                scope : 'interservice controller',
                status :  1,
                error : null
            })
            return next(new responseModel(req, res, '' ,'internal service', 200, null, wallet))
        } catch (error) {
            monitor.addStatus({
                scope : 'interservice controller',
                status :  0,
                error : `${error}`
            })
            console.log('error in erroooooooor' , `${error}`)
            await queryRunner.rollbackTransaction()
            return next(new responseModel(req, res, '' ,'internal service', 500, `${error}`, null))

        }finally {
            await queryRunner.release()
        }
    }


    async addNewUser(req : Request , res : Response , next : NextFunction){
        try {
            let userBody  = req.body.user;
            delete userBody.verificationType;
            console.log(userBody)
            let phoneExist = await this.userRepository.find({where : {
                phoneNumber : userBody.phoneNumber
            }})
            let nationalExist = await this.userRepository.find({where : {
                nationalCode : userBody.nationalCode
            }})
            
            if (phoneExist.length || nationalExist.length){
                console.log('t2')
                return next(new responseModel(req, res,  '' ,'internal service', 429 , 'این کاربر در لیست کاربران جدید موجود است', null))
            }
            let newUser = this.userRepository.create({...userBody , verificationStatus : 0})
            let savedUser = await this.userRepository.save(newUser)
            return next(new responseModel(req, res, '' ,'internal service', 200, null, savedUser))
        } catch (error) {
            console.log('error>>>' , `${error}`)
            return next(new responseModel(req, res, '' ,'internal service', 500, null, null))
        }
    }


    async getWallet(req: Request, res: Response, next: NextFunction) {
        let id = req.params.id
        try{

        let user = await this.userRepository.findOne({where : {id : +id} , relations : ['wallet']})
        if (!user){ 
            return res.status(400).json ({
                success : false,
                stataus : 0,
                error : 'user not found'
            })
        }

        return res.status(200).json({
            success : true,
            stataus: 1,
            data : user
        })

        }catch (error) {
            console.log('error in getting data from brancg service >>>> ' , error)
            return res.status(500).json({
                success : false,
                stataus: 2,
                error : 'internal service error'
            })
        }


    }

    // async getAllUsersData(req : Request , res : Response , next : NextFunction){
    //     let users = await this.userRepository.find({relations : ['buys' , 'sells' , 'wallet' , 'wallet.transactions']})
    //     let invoices = await this.invoiceRepository.find()
    //     let estimates = await this.estimate.find()
    //     let prices = await this.goldPrice.find()
    //     return next(new response(req, res, 'internal service', 200, null, {users , invoices , estimates , prices}))
    // }

}