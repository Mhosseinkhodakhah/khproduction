import { AppDataSource } from "../data-source"
import { NextFunction, Request, Response } from "express"
import { sellers } from "../entity/sellers"
import { branche } from "../entity/branche"
import { responseModel } from "../util/response.model"
import { validationResult } from "express-validator"
import interConnections from "../services/interconnection.service"
import { transAction } from "../entity/transAction.entity"

export class UserController {

    private sellerRepository = AppDataSource.getRepository(sellers)
    private branchRepository = AppDataSource.getRepository(branche)
    private interService = new interConnections()
    private transAction = AppDataSource.getRepository(transAction)

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
    


    async createTransAction(req: Request, res: Response, next: NextFunction) {
        let bodyValidation = validationResult(req.body)
        console.log(req.body)
        if (!bodyValidation.isEmpty()) {
            return next(new responseModel(req, res, '', 'create transAction', 400, bodyValidation['errors'][0].msg, null))
        }

        let {branchId , sellerId , goldWeight} = req.body;

        let branch= await this.branchRepository.findOne({where : {id : branchId}})
        if (!branch){
            return next(new responseModel(req, res, 'شعبه مورد نظر در سامانه ثبت نشده است', 'branch', 400, 'شعبه مورد نظر در سامانه ثبت نشده است', null))
        }

        let seller = await this.sellerRepository.findOne({where : {
            branch : branch
        }})

        // if (!seller){
        //     return next(new responseModel(req, res, 'فروشنده مورد نظر در لیست فروشندگان این شعبه وجود ندارد', 'branch', 400, 'فروشنده مورد نظر در لیست فروشندگان این شعبه وجود ندارد', null))
        // }

        let wallet = await this.interService.getWalletData(2)
        if (!wallet || wallet == 400 || wallet == 500 || wallet == 'unknown'){
            return next(new responseModel(req, res, 'در حال حاظر امکان استفاده از سرویس استفاده از صندوق طلا وجود ندارد', 'branch', 500, 'در حال حاظر امکان استفاده از سرویس استفاده از صندوق طلا وجود ندارد', null))
        }

        console.log('response of wallet>>>>>>>>', wallet)

        if (+wallet.wallet.goldWeight < +goldWeight){
            return next(new responseModel(req, res, 'موجودی صندوق طلای کاربر کافی نمی باشد', 'branch', 500, 'موجودی صندوق طلای کاربر کافی نمی باشد', null))
        }

        



        // let createdTrnasAction = this.transAction.create({
        //     status : 'init',
        //     user : wallet.id,
        //     goldPrice ,
        //     goldWeight :,
        //     totalPrice,
        //     invoiceId,
        //     status,
        //     date,
        //     time,
        //     seller,
        // })

        return next(new responseModel(req, res, 'تراکنش با موفقیت ایجاد شد', 'branch', 200, null, null))


       }
   

}