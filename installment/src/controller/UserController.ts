import { AppDataSource } from "../data-source"
import { NextFunction, Request, Response } from "express"
import { User } from "../entity/User"
import { installments } from "../entity/installments"
import { SmsService } from "../services/message-service"
import { response } from "../responseModel/response"
import { Or } from "typeorm"
import { validationResult } from "express-validator"
import cities from "../cities"
let iranCity = require('iran-city');

export class UserController {

    private userRepository = AppDataSource.getRepository(User)
    private installmentsRepo = AppDataSource.getRepository(installments)
    private smsServices = new SmsService()

    async submitRequests(req: Request, res: Response, next: NextFunction) {
        const error = validationResult(req)
        if (!error.isEmpty()) {
            return next(new response(req, res, 'installment service', 400, error['errors'][0].msg, null))
        }

        // let all = await this.installmentsRepo.find()
        // await this.installmentsRepo.remove(all)


        let phoneExistance = await this.installmentsRepo.exists({
            where: [{
                phoneNumber: req.body.phoneNumber, status: 2
            }, { nationalCode: req.body.nationalCode }]
        })
        if (phoneExistance) {
            return next(new response(req, res, 'installMents service', 409, 'این کاربر قبلا درخواست ثبت کرده است.لطفا تا بررسی درخواست قبلی منتظر بمانید', null))
        }

        let provinceCode = req.body.province;
        let cityCode = req.body.city;
        req.body.province = await cities(+provinceCode)
        req.body.city = iranCity.cityById(+cityCode)?.name;
        
        let city = iranCity.citiesOfProvince(+provinceCode);

        let categories = ['النگو' , 'دستبند' , 'گوشواره' , 'زنجیر' , 'مدال' , 'سرویس']

        // if (req.body.category.length == 2){
        //     req.body.category = `${categories[req.body.category[0]]} - ${categories[req.body.category[1]]}`
        // }else if (req.body.category.length == 1){
        //     req.body.category = `${categories[req.body.category[0]]}`
        // }

        req.body.category = (req.body.category.length == 2) ? `${categories[req.body.category[0]]}-${categories[req.body.category[1]]}` : `${categories[req.body.category[0]]}`;
        let queryRunner = AppDataSource.createQueryRunner()
        queryRunner.connect()
        queryRunner.startTransaction()
        try {
            let installment = this.installmentsRepo.create({
                ...req.body,
                time: new Date().toLocaleString('fa-IR').split(',')[1],
                date: new Date().toLocaleString('fa-IR').split(',')[0]

            })

            await queryRunner.manager.save(installment)
            await queryRunner.commitTransaction()
            let token = `${req.body.firstName}`
            console.log('token is this', token)
            let message = await this.smsServices.sendGeneralMessage(req.body.phoneNumber, "installment", token, null, null)
            console.log('returned mesage', message)
            return next(new response(req, res, 'installMent service', 200, null, installment))
        } catch (error) {
            console.log('error occured >>>', error)
            await queryRunner.rollbackTransaction()
            return next(new response(req, res, 'installMents service', 500, null, null))
        } finally {
            console.log('transAction released')
            await queryRunner.release()
        }
    }


    async getAllCities(req: Request, res: Response, next: NextFunction){
        let provinceCode = req.params.cityId;
        let AllProvinces = iranCity.allProvinces();
        console.log(AllProvinces)
        let AllCities = iranCity.citiesOfProvince(+provinceCode);
        let finalCities = []
        for (let i = 0 ; i < AllCities.length ; i++){
            let data = {
                label:AllCities[i].name,
                value : AllCities[i].id
            }
            finalCities.push(data)
        }
        // console.log(AllCities)
        return next(new response(req, res, 'installMents service', 200, null, finalCities))
    }

    async getAllInstallments(req: Request, res: Response, next: NextFunction) {
        let installMents = await this.installmentsRepo.find({order : {createdAt : 'DESC'}})
        return next(new response(req, res, 'installMents service', 200, null, installMents))
    }


    async checkRequests(req: Request, res: Response, next: NextFunction) {
        try {
            let installment = await this.installmentsRepo.createQueryBuilder('installMent')
                .where('installMent.id = :id', { id: req.params.id })
                .getOne()
            installment.status = 1;
            installment.describtion = req.body?.describtion;
            installment.admin = `${req.user.userId}-${req.user.firstName}-${req.user.lastName}`
            await this.installmentsRepo.save(installment);
            return next(new response(req, res, 'installMents service', 200, null, installment))
        } catch (error) {
            console.log('error occured', error)
            return next(new response(req, res, 'installMents service', 200, `${error}`, null))
        }
    }

}