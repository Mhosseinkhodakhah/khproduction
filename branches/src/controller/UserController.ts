import { AppDataSource } from "../data-source"
import { NextFunction, Request, Response } from "express"
import { sellers } from "../entity/sellers"
import { branche } from "../entity/branche"
import { responseModel } from "../util/response.model"
import { validationResult } from "express-validator"
import interConnections from "../services/interconnection.service"
import { transAction } from "../entity/transAction.entity"
import { user } from "../entity/user.entity"

export class UserController {

    private sellerRepository = AppDataSource.getRepository(sellers)
    private branchRepository = AppDataSource.getRepository(branche)
    private userRepository = AppDataSource.getRepository(user)
    private interService = new interConnections()
    private transAction = AppDataSource.getRepository(transAction)


    private async generateOtp() {
        let firstRandomoe = Math.floor(1000 + Math.random() * 9000)
        return firstRandomoe
    }


    private async generateInvoice() {
        return (new Date().getTime()).toString()
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



    async createTransAction(req: Request, res: Response, next: NextFunction) {
        let bodyValidation = validationResult(req.body)
        console.log(req.body)
        if (!bodyValidation.isEmpty()) {
            return next(new responseModel(req, res, '', 'create transAction', 400, bodyValidation['errors'][0].msg, null))
        }

        let { branchId, sellerId, goldWeight } = req.body;

        let queryRunner = AppDataSource.createQueryRunner()
        await queryRunner.connect()
        await queryRunner.startTransaction()
        try {
            let branch = await this.branchRepository.findOne({ where: { id: branchId } })
            if (!branch) {
                return next(new responseModel(req, res, 'شعبه مورد نظر در سامانه ثبت نشده است', 'branch', 400, 'شعبه مورد نظر در سامانه ثبت نشده است', null))
            }

            let seller = await this.sellerRepository.findOne({
                where: {
                    branch: branch
                }
            })

            if (!seller) {
                return next(new responseModel(req, res, 'فروشنده مورد نظر در لیست فروشندگان این شعبه وجود ندارد', 'branch', 400, 'فروشنده مورد نظر در لیست فروشندگان این شعبه وجود ندارد', null))
            }

            let data = await this.interService.getWalletData(2)
            if (!data || data == 400 || data == 500 || data == 'unknown') {
                return next(new responseModel(req, res, 'در حال حاظر امکان استفاده از سرویس استفاده از صندوق طلا وجود ندارد', 'branch', 500, 'در حال حاظر امکان استفاده از سرویس استفاده از صندوق طلا وجود ندارد', null))
            }

            console.log('response of data>>>>>>>>', data)

            if (+data.user.wallet.goldWeight < +goldWeight) {
                return next(new responseModel(req, res, 'موجودی صندوق طلای کاربر کافی نمی باشد', 'branch', 500, 'موجودی صندوق طلای کاربر کافی نمی باشد', null))
            }

            let userExistance = await this.userRepository.exists({ where: { nationalCode: data.user.nationalCode } })
            let userData;
            if (!userExistance) {
                let newUser = this.userRepository.create({
                    firstName: data.user.firstName,
                    lastName: data.user.lastName,
                    nationalCode: data.user.nationalCode,
                    birthDate: data.user.birthDate,
                    age: data.user.age,
                    fatherName: data.user.fatherName,
                    phoneNumber: data.user.phoneNumber,
                })
                userData = await queryRunner.manager.save(newUser)
            } else {
                userData = await this.userRepository.findOne({ where: { nationalCode: data.user.nationalCode } })
            }


            let totalPrice = +(goldWeight * data.goldPrice).toFixed()
            let invoiceId = await this.generateInvoice()

            let TrnasAction = this.transAction.create({
                status: 'init',
                user: userData,
                goldPrice: data.goldPrice,
                goldWeight: goldWeight,
                totalPrice: totalPrice,
                invoiceId: invoiceId,
                date: new Date().toLocaleString('fa-IR').split(',')[0],
                time: new Date().toLocaleString('fa-IR').split(',')[1],
                seller: seller,
            })


            let createdTransAction = await queryRunner.manager.save(TrnasAction)
            await queryRunner.commitTransaction()
            return next(new responseModel(req, res, 'تراکنش با موفقیت ایجاد شد', 'branch', 200, null, createdTransAction))
        } catch (error) {
            console.log('error in create transACtion >>>> ', error)
            await queryRunner.rollbackTransaction()
            return next(new responseModel(req, res, 'خطای داخلی سرور در ایجاد تراکنش استفاده از صندوق طلا', 'branch', 500, 'خطای داخلی سرور در ایجاد تراکنش استفاده از صندوق طلا', null))
        } finally {
            await queryRunner.release()
        }
    }


    async approveTransACtionDataByUser(req: Request, res: Response, next: NextFunction){

        let {transActionId} = req.body;
        let createdTransAction = await this.transAction.findOne({where : {id : transActionId}})
        if (!createdTransAction){
            return next(new responseModel(req, res, 'تراکنش مورد نظر در سامانه ثبت نشده است', 'branch', 400, 'تراکنش مورد نظر در سامانه ثبت نشده است', null))
        }

        let queryRunner = AppDataSource.createQueryRunner()
        await queryRunner.connect()
        await queryRunner.startTransaction()
        try {
            let otp = await this.generateOtp()
            createdTransAction.otpCode = otp.toString()
            createdTransAction.otpApproved = false;
            createdTransAction.otpTime = (new Date().getTime()).toString()
            await queryRunner.manager.save(createdTransAction)
            await queryRunner.commitTransaction()
            return next(new responseModel(req, res, 'کد تایید برای فروشنده ارسال شد', 'branch' , 200 , null, null))
        } catch (error) {
            await queryRunner.rollbackTransaction()
        }finally {
            await queryRunner.release()
        }


    }

}