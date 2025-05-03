import { AppDataSource } from "../data-source"
import { NextFunction, Request, Response } from "express"
import { sellers } from "../entity/sellers"
import { branche } from "../entity/branche"
import { responseModel } from "../util/response.model"
import { validationResult } from "express-validator"
import interConnections from "../services/interconnection.service"
import { transAction } from "../entity/transAction.entity"
import { user } from "../entity/user.entity"
import { SmsService } from "../services/message-service"

export class UserController {

    private sellerRepository = AppDataSource.getRepository(sellers)
    private branchRepository = AppDataSource.getRepository(branche)
    private userRepository = AppDataSource.getRepository(user)
    private interService = new interConnections()
    private transAction = AppDataSource.getRepository(transAction)
    private smsService = new SmsService()


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
        const userId = req.user_id
        console.log(userId)
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

            let data = await this.interService.getWalletData(+userId)
            if (!data || data == 400 || data == 500 || data == 'unknown') {
                return next(new responseModel(req, res, 'در حال حاظر امکان استفاده از سرویس استفاده از صندوق طلا وجود ندارد', 'branch', 500, 'در حال حاظر امکان استفاده از سرویس استفاده از صندوق طلا وجود ندارد', null))
            }

            console.log('response of data>>>>>>>>', data)
            let newDatat = data.data
            if (+newDatat.user.wallet.goldWeight < +goldWeight) {
                return next(new responseModel(req, res, 'موجودی صندوق طلای کاربر کافی نمی باشد', 'branch', 500, 'موجودی صندوق طلای کاربر کافی نمی باشد', null))
            }

            let userExistance = await this.userRepository.exists({ where: { nationalCode: newDatat.user.nationalCode } })
            let userData;
            if (!userExistance) {
                let newUser = this.userRepository.create({
                    firstName: newDatat.user.firstName,
                    lastName: newDatat.user.lastName,
                    nationalCode: newDatat.user.nationalCode,
                    birthDate: newDatat.user.birthDate,
                    age: newDatat.user.age,
                    fatherName: newDatat.user.fatherName,
                    phoneNumber: newDatat.user.phoneNumber,
                    userId: newDatat.user.id
                })
                userData = await queryRunner.manager.save(newUser)
            } else {
                userData = await this.userRepository.findOne({ where: { nationalCode: newDatat.user.nationalCode } })
            }


            let totalPrice = +(goldWeight * newDatat.goldPrice.Geram18).toFixed()
            let invoiceId = await this.generateInvoice()

            let TrnasAction = this.transAction.create({
                status: 'init',
                user: userData,
                goldPrice: +newDatat.goldPrice.Geram18,
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


    async approveTransACtionDataByUser(req: Request, res: Response, next: NextFunction) {
        let bodyValidation = validationResult(req.body)
        console.log(req.body)
        if (!bodyValidation.isEmpty()) {
            return next(new responseModel(req, res, '', 'branch', 400, bodyValidation['errors'][0].msg, null))
        }
        let { transActionId } = req.body;
        let createdTransAction = await this.transAction.findOne({ where: { id: transActionId }, relations: ['user', 'seller'] })
        if (!createdTransAction) {
            return next(new responseModel(req, res, 'تراکنش مورد نظر در سامانه ثبت نشده است', 'branch', 400, 'تراکنش مورد نظر در سامانه ثبت نشده است', null))
        }

        let queryRunner = AppDataSource.createQueryRunner()
        await queryRunner.connect()
        await queryRunner.startTransaction()
        try {
            let otp = await this.generateOtp()
            createdTransAction.otpCode = otp.toString()
            createdTransAction.otpApproved = false;
            createdTransAction.status = 'waitForOtp'
            createdTransAction.otpTime = (new Date().getTime()).toString()
            await queryRunner.manager.save(createdTransAction)
            this.smsService.sendOtpMessage(createdTransAction.seller.phoneNumber, otp)
            await queryRunner.commitTransaction()
            return next(new responseModel(req, res, 'کد تایید برای فروشنده ارسال شد', 'branch', 200, null, null))
        } catch (error) {
            console.log('error in approve data by user >>>>', error)
            await queryRunner.rollbackTransaction()
            return next(new responseModel(req, res, 'خطای داخلی سرور در  ارسال کد تایید برای فروشنده استفاده از صندوق طلا', 'branch', 500, 'خطای داخلی سرور در  ارسال کدد تایید برای فروشنده استفاده از صندوق طلا', null))
        } finally {
            await queryRunner.release()
        }
    }



    async approveOtpCodeFor(req: Request, res: Response, next: NextFunction) {
        let bodyValidation = validationResult(req.body)
        console.log(req.body)
        if (!bodyValidation.isEmpty()) {
            return next(new responseModel(req, res, '', 'branch', 400, bodyValidation['errors'][0].msg, null))
        }
        let { transActionId, otp } = req.body;

        let TrnasAction = await this.transAction.findOne({ where: { id: transActionId }, relations: ['user', 'seller' , 'seller.branch'] })
        console.log('ttttttt' , TrnasAction.seller.branch.name)
        if (!TrnasAction) {
            return next(new responseModel(req, res, 'تراکنش مورد نظر در سامانه ثبت نشده است', 'branch', 400, 'تراکنش مورد نظر در سامانه ثبت نشده است', null))
        }

        if (TrnasAction.status != 'waitForOtp') {
            return next(new responseModel(req, res, 'تراکنش مورد نظر قبلا اعتبار سنجی شده است', 'branch', 400, 'تراکنش مورد نظر قبلا اعتبار سنجی شده است', null))
        }

        if (TrnasAction.otpCode.toString() != otp.toString()) {
            return next(new responseModel(req, res, '', 'branch', 412, `کد وارد شده نادرست است`, null))
        }
        let timeNow = new Date().getTime()

        if (timeNow - (+TrnasAction.time) > 2.1 * 60 * 1000) {
            return next(new responseModel(req, res, '', 'branch', 412, `کد وارد شده منقضی شده است`, null))
        }

        let queryRunner = AppDataSource.createQueryRunner()
        await queryRunner.connect()
        await queryRunner.startTransaction()
        try {
            TrnasAction.otpApproved = true;
            TrnasAction.date = new Date().toLocaleString('fa-IR').split(',')[0]
            TrnasAction.time = new Date().toLocaleString('fa-IR').split(',')[1]
            let updator = await this.interService.updateWallet(TrnasAction.user.userId, TrnasAction.goldWeight)
            console.log('Traaaa' , TrnasAction.user)
            if (!updator) {
                TrnasAction.status = 'failed';
                await queryRunner.manager.save(TrnasAction)
                await queryRunner.commitTransaction()
                return next(new responseModel(req, res, 'خطای داخلی سرور', 'branch', 500, 'خطای داخلی سرور', null))
            }
            if (updator == 'insufficent') {
                TrnasAction.status = 'failed';
                await queryRunner.manager.save(TrnasAction)
                await queryRunner.commitTransaction()
                return next(new responseModel(req, res, 'موجودی صندوق طلای کاربر کافی نمیباشد', 'branch', 400, 'موجودی صندوق طلای کاربر کافی نمیباشد', null))
            }
            if (updator == 500) {
                TrnasAction.status = 'failed';
                await queryRunner.manager.save(TrnasAction)
                await queryRunner.commitTransaction()
                return next(new responseModel(req, res, 'خطای داخلی سرور', 'branch', 500, 'خطای داخلی سرور', null))
            }
            if (updator == 'unknown') {
                TrnasAction.status = 'failed';
                await queryRunner.manager.save(TrnasAction)
                await queryRunner.commitTransaction()
                return next(new responseModel(req, res, 'خطای داخلی سرور', 'branch', 500, 'خطای داخلی سرور', null))
            }

            TrnasAction.status = 'completed';
            let finalInvoice = await queryRunner.manager.save(TrnasAction)
            this.smsService.sendGeneralMessage(TrnasAction.seller.phoneNumber, "approveForAdmin", TrnasAction.seller.lastName, TrnasAction.user.nationalCode, TrnasAction.goldWeight)
            this.smsService.sendGeneralMessage(TrnasAction.user.phoneNumber, "tellToUserForUseGildBox", TrnasAction.user.firstName, TrnasAction.goldWeight, TrnasAction.seller.lastName)
            await queryRunner.commitTransaction()
            return next(new responseModel(req, res, 'طلای مورد نظر با موفقیت کسر شد.', 'branch', 200, null, finalInvoice))
        } catch (error) {
            console.log('error in fucking approve transAction>>>', error)
            await queryRunner.rollbackTransaction()
            return next(new responseModel(req, res, 'خطای داخلی سرور در  ارسال کد تایید برای فروشنده استفاده از صندوق طلا', 'branch', 500, 'خطای داخلی سرور در  ارسال کدد تایید برای فروشنده استفاده از صندوق طلا', null))
        } finally {
            await queryRunner.release()
        }
    }
}