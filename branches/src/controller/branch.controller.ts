
import { NextFunction, Request, Response } from "express"
import { AppDataSource } from "../data-source"
import { sellers } from "../entity/sellers"
import { branche } from "../entity/branche"
import { responseModel } from "../util/response.model"
import { query, validationResult } from "express-validator"
import { transAction } from "../entity/transAction.entity"
import logger from "../services/logg.service"


export default class branchController {

    private sellerRepository = AppDataSource.getRepository(sellers)
    private branchRepository = AppDataSource.getRepository(branche)
    private transAction = AppDataSource.getRepository(transAction)
    private loggerService = new logger()



    /**
     * its for creating new branch by admin . . .
     * @param req 
     * @param res 
     * @param next 
     * @returns 
     */
    async createNewBranch(req: Request, res: Response, next: NextFunction) {
        try {
            let bodyValidation = validationResult(req.body)
            console.log(req.body)
            if (!bodyValidation.isEmpty()){
                return next(new responseModel(req, res, '' , 'admin', 400, bodyValidation['errors'][0].msg, null))
            }
            console.log('its innnnn create branch')
            let newBranch = this.branchRepository.create({
                name : req.body.name , 
                code : req.body.code,
                manager : req.body.manager
            })
            let newData = await this.branchRepository.save(newBranch)

            let actions = `\u202Bادمین ${req.user.firstName} ${req.user.lastName} یک شعبه جدید با نام ${newData.name} و کد ${newData.code} و مدیریت ${newData.manager} ایجاد کرد\u202C`
            await this.loggerService.addNewAdminLog({ firstName: req.user.firstName, lastName: req.user.lastName, phoneNumber: req.user.phoneNumber },
                'اضاف کردن شعبه جدید', actions, newData , 1) 
            return next(new responseModel(req, res, 'ایجاد شعبه جدید با موفقیت انجام شد', 'branch', 200, null, newData))
        } catch (error) {
            console.log('error in create branch', error)
            return next(new responseModel(req, res, 'ایجاد شعبه جدید ', 'branch', 500, 'خطای داخلی سیستم', null))
        }
    }

    /**
     * its for add new seller for specific branch by admin
     * @param req 
     * @param res 
     * @param next 
     * @returns 
     */
    async addSeller(req: Request, res: Response, next: NextFunction) {
        try {
            console.log('its in add sellerrrrrrrr' , req.body)
            let bodyValidation = validationResult(req.body)
            if (!bodyValidation.isEmpty()){
                return next(new responseModel(req, res, '' , 'admin', 400, bodyValidation['errors'][0].msg, null))
            }
            let branch = await this.branchRepository.findOne({ where: { id: req.params.branchId } })
            let sellers = await this.sellerRepository.find({order : {'createdAt' : 'DESC'}})
            // let code = `${sellers.length+1}-${req.body.firstName.split('')[0]}.${req.body.lastName}`
            let selelrExistance = await this.sellerRepository.exists({where : {
                firstName : req.body.firstName,
                lastName : req.body.lastName,
                
            }
        })
        if (selelrExistance){
            return next(new responseModel(req, res, 'این فروشنده قبلا در سیستم ثبت شده است', 'branch', 400, 'این فروشنده قبلا در سیستم ثبت شده است', null))
        }
            console.log('branch >>>> ' , branch)
            if (!branch) {
                return next(new responseModel(req, res, 'شعبه مورد نظر یافت نشد', 'branch', 400, 'شعبه مورد نظر یافت نشد', null))
            }
            let newSeller = this.sellerRepository.create({ 
                firstName : req.body.firstName,
                lastName : req.body.lastName,
                phoneNumber : req.body.phoneNumber,
                branch : branch,
                code : (sellers.length+1).toString()
             })

             await this.sellerRepository.save(newSeller)
             let actions = `\u202Bادمین ${req.user.firstName} ${req.user.lastName} یک فروشنده جدید با نام ${req.body.firstName} ${req.body.lastName} و مدیریت شعبه ی  ${branch.name} ایجاد کرد\u202C`
             await this.loggerService.addNewAdminLog({ firstName: req.user.firstName, lastName: req.user.lastName, phoneNumber: req.user.phoneNumber },
                 'اضاف کردن فروشنده جدید', actions, newSeller , 1) 
             return next(new responseModel(req, res, 'ایجاد فروشنده با موفقیت انجام شد.', 'branch', 200, null, newSeller))
        } catch (error) {
            console.log('eror in add seller', error)
            return next(new responseModel(req, res, 'ایجاد فروشنده موفق نبود.خطای داخلی سیستم.', 'branch', 500, 'خطای داخلی سیستم', null))
        }
    }

    
    async deleteSeller(req: Request, res: Response, next: NextFunction){
        
        try {
            let sellerId = req.params.sellerId;

        let seller = await this.sellerRepository.findOne({where : {id : sellerId} , relations : ['transActions']})
        if (!seller){
            return next(new responseModel(req, res, 'فروشنده مورد نظر یافت نشد.', 'branch', 400, 'فروشنده مورد نظر یافت نشد', null))
        }
        if (seller.transActions.length > 0){
            await this.transAction.remove(seller.transActions)
        }
        await this.sellerRepository.remove(seller)
        return next(new responseModel(req, res, 'فروشنده مورد نظرد با موفقیت حذف شد.', 'branch', 200, null, null))
        } catch (error) {
            console.log('the selelr removing error >>> ' , error)
            return next(new responseModel(req, res, 'خطای داخلی سیستم.', 'branch', 500, 'خطای داخلی سیستم', null))

        }

    }



    async deleteBranch(req: Request, res: Response, next: NextFunction){
        try {
        let branchId = req.params.sellerId;
        let branch : any = await this.branchRepository.findOne({where : {id : branchId} , relations : ['sellers' , 'sellers.transActions']})
        if (!branch){
            return next(new responseModel(req, res, 'شعبه مورد نظر یافت نشد.', 'branch', 400, 'شعبه مورد نظر یافت نشد', null))
        }
        // console.log('branch is  >>>>' , branch)
        if (branch.sellers.length > 0){
            for (let i =0 ; i <branch.sellers.length ; i ++){
                if (branch.sellers[i].transActions.length>0){
                    await this.transAction.remove(branch.sellers[i].transActions)
                }
            }
            await this.sellerRepository.remove(branch.sellers)
        }
        await this.branchRepository.remove(branch)
        return next(new responseModel(req, res, 'شعبه مورد نظرد با موفقیت حذف شد.', 'branch', 200, null, null))
        } catch (error) {
            console.log('the selelr removing error >>> ' , error)
            return next(new responseModel(req, res, 'خطای داخلی سیستم.', 'branch', 500, 'خطای داخلی سیستم', null))
        }
    }



    /**
     * its for get all branches by users
     * @param req 
     * @param res 
     * @param next 
     * @returns 
     */
    async getAllBranches(req: Request, res: Response, next: NextFunction) {
        try {
            let branches = await this.branchRepository.find()
            return next(new responseModel(req, res, '', 'branch', 200, null, branches))
        } catch (error) {
            console.log('get all branches hass error >>> ', error)
            return next(new responseModel(req, res, 'خطای داخلی سیستم', 'branch', 500, 'خطای داخلی سیستم', null))
        }
    }



    /**
     * its for get all sellers of specific branch
     * @param req 
     * @param res 
     * @param next 
     * @returns 
     */
    async getSellers(req: Request, res: Response, next: NextFunction) {
        try {
            let branchId = req.params.branchId;
            let branch = await this.branchRepository.findOne({ where: { id: +branchId }, relations: ['sellers'] })
            if (!branch) {
                return next(new responseModel(req, res, 'شعبه مورد نظر در سیستم ثبت نشده است', 'branch', 500, 'شعبه مورد نظر در سیستم ثبت نشده است', null))
            }
            for (let i= 0 ; i < branch.sellers.length ; i ++){
                let elem = branch.sellers[i]
                branch.sellers[i].code = `کد ${branch.sellers[i].code}-${branch.sellers[i].firstName[0]}.${branch.sellers[i].lastName}`
            }
            return next(new responseModel(req, res, '', 'branch', 200, null, branch.sellers))
        } catch (error) {
            console.log('error >>> ', error)
            return next(new responseModel(req, res, 'خطای داخلی سیستم', 'branch', 500, 'خطای داخلی سیستم', null))
        }
    }




     /**
     * its for get all branches by users
     * @param req 
     * @param res 
     * @param next 
     * @returns 
     */
     async getAllBranchesByAdmin(req: Request, res: Response, next: NextFunction) {
        try {
            let branches = await this.branchRepository.find()
            return next(new responseModel(req, res, '', 'branch', 200, null, branches))
        } catch (error) {
            console.log('get all branches hass error >>> ', error)
            return next(new responseModel(req, res, 'خطای داخلی سیستم', 'branch', 500, 'خطای داخلی سیستم', null))
        }
    }



    /**
     * its for get all sellers of specific branch
     * @param req 
     * @param res 
     * @param next 
     * @returns 
     */
    async getSellersByAdmin(req: Request, res: Response, next: NextFunction) {
        try {
            let branchId = req.params.branchId;
            let branch = await this.branchRepository.findOne({ where: { id: +branchId }, relations: ['sellers'] })
            if (!branch) {
                return next(new responseModel(req, res, 'شعبه مورد نظر در سیستم ثبت نشده است', 'branch', 500, 'شعبه مورد نظر در سیستم ثبت نشده است', null))
            }
            return next(new responseModel(req, res, '', 'branch', 200, null, branch.sellers))
        } catch (error) {
            console.log('error >>> ', error)
            return next(new responseModel(req, res, 'خطای داخلی سیستم', 'branch', 500, 'خطای داخلی سیستم', null))
        }
    }

    async getAllTransACtions(req: Request, res: Response, next: NextFunction){
       try {
        let type = req.query.type;
        let allTransAction ;
        if (!!type){
            allTransAction = await this.transAction.find({
                where : {
                    status : type
                }
            })
        }
        return next(new responseModel(req, res, '', 'branch', 200, null, allTransAction))
       } catch (error) {
        console.log('errorororor in get all transActions' , error)
        return next(new responseModel(req, res, 'خطای داخلی سیستم', 'branch', 500, 'خطای داخلی سیستم', null))
       }
    }



}