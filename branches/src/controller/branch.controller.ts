
import { NextFunction, Request, Response } from "express"
import { AppDataSource } from "../data-source"
import { sellers } from "../entity/sellers"
import { branche } from "../entity/branche"
import { responseModel } from "../util/response.model"
import { query, validationResult } from "express-validator"
import { transAction } from "../entity/transAction.entity"


export default class branchController {

    private sellerRepository = AppDataSource.getRepository(sellers)
    private branchRepository = AppDataSource.getRepository(branche)
    private transAction = AppDataSource.getRepository(transAction)
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
            let newBranch = this.branchRepository.create(req.body)
            let newData = await this.branchRepository.save(newBranch)
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
            let selelrExistance = await this.sellerRepository.exists({where : [{
             nationalCode : req.body.nationalCode,   
            },
            {
                phoneNumber : req.body.phoneNumber
            },{
                firstName : req.body.firstName,
                lastName : req.body.lastName
            }
        ]})
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
                nationalCode : req.body.nationalCode,
                phoneNumber : req.body.phoneNumber,
                branch : branch
             })
             console.log( 'after entity >>>>> ', newSeller)
            await this.sellerRepository.save(newSeller)
            return next(new responseModel(req, res, 'ایجاد فروشنده با موفقیت انجام شد.', 'branch', 200, null, newSeller))
        } catch (error) {
            console.log('eror in add seller', error)
            return next(new responseModel(req, res, 'ایجاد فروشنده موفق نبود.خطای داخلی سیستم.', 'branch', 500, 'خطای داخلی سیستم', null))
        }
    }



    async deleteSeller(req: Request, res: Response, next: NextFunction){
        
        try {
            let sellerId = req.params.sellerId;

        let seller = await this.sellerRepository.findOne({where : {id : sellerId}})
        if (!seller){
            return next(new responseModel(req, res, 'فروشنده مورد نظر یافت نشد.', 'branch', 400, 'فروشنده مورد نظر یافت نشد', null))
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
        let branch = await this.branchRepository.findOne({where : {id : branchId} , relations : ['sellers']})
        if (!branch){
            return next(new responseModel(req, res, 'شعبه مورد نظر یافت نشد.', 'branch', 400, 'شعبه مورد نظر یافت نشد', null))
        }

        await this.sellerRepository.remove(branch.sellers)
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