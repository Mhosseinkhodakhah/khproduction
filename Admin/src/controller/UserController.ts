import { AppDataSource } from "../data-source"
import { NextFunction, Request, Response } from "express"
import { accessPoint } from "../entity/accessPoint"
import { Admin } from "../entity/Admin"
import { response } from "../responseModel/response"
import jwtGenerator from "../services/jwt.service"
import { jwtGeneratorInterface } from "../interface/interfaces.interface"
import bcrypt from 'bcrypt'
import { validationResult } from "express-validator"
import monitor from "../responseModel/statusMonitor"
import { interservice } from "../services/interservice.service"
import { cooperation } from "../entity/cooperation"
import { SmsService } from "../services/message-service"
import { redisCache } from "../services/redis.service"
import { lockService } from "../services/lockService.service"



export class UserController {

    private userRepository = AppDataSource.getRepository(Admin)
    private accessPointRepository = AppDataSource.getTreeRepository(accessPoint)
    private cooperationRepository = AppDataSource.getRepository(cooperation)
    private tokenService = new jwtGenerator()
    private InterService = new interservice()
    private redisService = new redisCache()
    private lockService = new lockService()
    private smsService = new SmsService()
    private adminRepository = AppDataSource.getRepository(Admin)

    async createNewAdmin(req: Request, res: Response, next: NextFunction) {
        const newAdmin = new Admin()
        newAdmin.firstName = 'hossein';
        newAdmin.lastName = 'khodakhah';
        await this.adminRepository.save(newAdmin);
    }

    async createNewMenu(req: Request, res: Response, next: NextFunction) {
        const newMenu = this.accessPointRepository.create(req.body.menu)
        // await this.accessPointRepository.remove(menus)
        let data = await this.accessPointRepository.save(newMenu[0])
        let menus = await this.accessPointRepository.find()
        console.log(menus)
        // await this.InterService.addNewLog({firstName : '', lastName : '' , phoneNumber : req.user.phone} , 'create new menu' , `${req.user.phone} create new menu with name ${req.body.menu}` , { statusCode : 200,
        //     error : null,
        //     msg : `creating new menu successfully done.`},
        //     1)
        let mainAdmin = await this.adminRepository.findOne({ where: { id: +req.user.userId } })
        let actions = `\u202B${mainAdmin.firstName} ${mainAdmin.lastName} یک منوی جدید با نام ${data.englishName} و نام فارسی ${data.persianName} ایجاد کرد\u202C`
        this.InterService.addNewAdminLog({ firstName: mainAdmin.firstName, lastName: mainAdmin.lastName, phoneNumber: mainAdmin.phoneNumber },
            'ایجاد منوی جدید', actions, {
            data
        }, 1)
        return next(new response(req, res, 'create new menu', 200, null, data))
    }

    async creatNewSubMenu(req: Request, res: Response, next: NextFunction) {
        let menuId: string = req.params.menuId;
        let mainAdmin = await this.adminRepository.findOne({ where: { id: +req.user.userId } })
        console.log(menuId)
        let Menu = await this.accessPointRepository.findOne({ where: { id: +menuId } })
        console.log(Menu)
        let newData = { ...req.body, parent: Menu }
        let newSubMenu = this.accessPointRepository.create(newData)
        console.log(newSubMenu)
        let data = await this.accessPointRepository.save(newSubMenu)
        return next(new response(req, res, 'create new sub menu', 200, null, data))
    }

    async getAllMenu(req: Request, res: Response, next: NextFunction) {
        let id = req.params.id
        let menu = await this.accessPointRepository.find({ order: { id: 'ASC' } })
        let Adminmenu = await this.adminRepository.findOne({ where: { id: +id }, relations: ['accessPoints'] })
        // console.log('admin access' , Adminmenu.accessPoints)
        // console.log('admin access22222' , menu)
        let access = Adminmenu.accessPoints;
        let accessed = []
        // console.log('adminAccess,,,' , access)
        for (let i = 0; i < access.length; i++) {
            access[i]['isAccess'] = true
            console.log('access', access[i])
            accessed.push(access[i])
        }

        console.log('menuuuuuuuu111>>>', menu)

        console.log('menuuuuu2>>>', access)

        let finalT = []

        for (let k = 0; k < menu.length; k++) {
            let mainMenu = menu[k]
            let isAccess = 0
            for (let m = 0; m < access.length; m++) {
                let accessedMenu = access[m];
                if (mainMenu.englishName === accessedMenu.englishName) {
                    isAccess = 1
                }
            }
            if (isAccess == 0) {
                mainMenu['isAccess'] = false
            } else {
                mainMenu['isAccess'] = true
            }
            finalT.push(mainMenu)
        }

        console.log('its finallTests >>>> ', finalT)

        // let final = {...menu , ...access}
        // // console.log('after finaling the accessed >>>>>' , final)
        // let lastFinal = []

        // for (let j of Object.keys(final)){
        //     if (final[j].isAccess == undefined){
        //         final[j]['isAccess'] = false;
        //     }else if (final[j].isAccess == null){
        //         final[j]['isAccess'] = false;
        //     }
        //     lastFinal.push(final[j])
        // }
        return next(new response(req, res, 'get All SubMenu', 200, null, finalT))
    }


    async addNewAdmin(req: Request, res: Response, next: NextFunction) {

        console.log(req.body)
        if (!req.body.firstName || !req.body.lastName || !req.body.phoneNumber || !req.body.password || !req.body.userName) {
            console.log('its fucking innnnnnn')
            return next(new response(req, res, 'admin', 400, 'مقادیر را وارد کنید', null))
        }
        let bodyValidation = validationResult(req.body)
        console.log('bodyValidations', bodyValidation)
        if (!bodyValidation.isEmpty()) {
            return next(new response(req, res, 'admin', 400, bodyValidation['errors'][0].msg, null))
        }
        // let validAdmins = [3,4,8,1,5]
        // if (!validAdmins.includes(+req.user.userId)){
        //     return next(new response(req, res ,'admin service', 503, 'شما اجازه این فعالیت را ندارید', null))
        // }
        const admin = req.user.role
        console.log('admin role >>>', admin)
        if (admin == 0) {
            return next(new response(req, res, 'create new admin', 403, 'permision denied!', null))
        }
        let adminPassword = req.body.password
        req.body.password = await bcrypt.hash(req.body.password, 10)
        console.log(req.body)
        let newAdmin = this.adminRepository.create(req.body)
        await this.adminRepository.save(newAdmin)
        let mainAdmin = await this.adminRepository.findOne({ where: { id: +req.user.userId } })
        let actions = `\u202B${mainAdmin.firstName} ${mainAdmin.lastName} ادمین جدید با مشخصات ${req.body.firstName} ${req.body.lastName} ایجاد کرد\u202C`
        this.InterService.addNewAdminLog({ firstName: mainAdmin.firstName, lastName: mainAdmin.lastName, phoneNumber: mainAdmin.phoneNumber },
            'ایجاد ادمین جدید', actions, {
            newAdmin
        }, 1)
        this.smsService.sendGeneralMessage(req.body.phoneNumber, "admin", req.body.firstName, req.body.userName, adminPassword)
        return next(new response(req, res, 'create new admin', 200, null, newAdmin))
    }


    async login(req: any, res: any, next: any) {
        console.log('body', req.body)
        // if (!req.body.userName || !req.body.password){
        //     return next(new response(req, res, 'login admin', 403, 'اطلاعات ورود نا درست', null))
        // }
        let admin = await this.adminRepository.findOne({
            where: {
                phoneNumber: req.body.phoneNumber
            }, relations: ['accessPoints']
        })
        if (!admin) {
            console.log('its here')
            return next(new response(req, res, 'login admin', 403, 'حساب کاربری یافت نشد', null))
        }
        let newAccessPoints = ['Dashboard']
        for (let i of admin.accessPoints) {
            newAccessPoints.push(i.englishName)
        }
        if (admin.isBlocked) {
            console.log('its here222')
            return next(new response(req, res, 'login admin', 403, 'دسترسی شما از سمت ادمین اصلی برداشته شده است', null))
        }
        const compare = await bcrypt.compare(req.body.password, admin.password)
        if (!compare) {
            console.log('its here password')
            return next(new response(req, res, 'login', 403, 'رمز عبور نادرست است', null))
        }
        let accessPoints = await this.accessPointRepository.find({
            where: {
                Admin: admin
            }
        })
        console.log('admin accessPoints', accessPoints)
        let tokenData: jwtGeneratorInterface = {
            id: admin.id,
            firstName: admin.firstName,
            lastName: admin.lastName,
            isBlocked: admin.isBlocked,
            phone: admin.phoneNumber,
            role: admin.role
        }
        console.log('token>>', tokenData)
        let token = await this.tokenService.tokenize(tokenData)
        let responseData = { ...admin, accessPoints: newAccessPoints, token: token }
        console.log('ttoken', token)
        let actions = `\u202B${admin.firstName} ${admin.lastName} وارد پنل شد\u202C`
        this.InterService.addNewAdminLog({ firstName: admin.firstName, lastName: admin.lastName, phoneNumber: admin.phoneNumber },
            ' ورود ادمین', actions, {
        }, 1)
        return next(new response(req, res, 'login admin', 200, null, responseData))
    }


    async updateAccessPoints(req: Request, res: Response, next: NextFunction) {
        let bodyValidation = validationResult(req.body)
        console.log(req.body)
        if (!bodyValidation.isEmpty()) {
            return next(new response(req, res, 'update accessPoints admin', 400, bodyValidation['errors'][0].msg, null))
        }
        let adminRole = req.user.role;
        if (adminRole == 0) {
            return next(new response(req, res, 'update accessPoints admin', 403, 'شما اجازه تغییرات دسترسی کارشناسان را ندارید', null))
        }
        let admin = await this.adminRepository.findOne({
            where: {
                id: +req.params.userId
            },
            relations: ['accessPoints']
        })
        if (!admin) {
            return next(new response(req, res, 'update accessPoints admin', 400, 'ادمین مورد نظر یافت نشد', null))
        }
        let queryRunner = AppDataSource.createQueryRunner()
        await queryRunner.connect()
        await queryRunner.startTransaction()
        try {
            // checking locked of admin
            let lock = await this.lockService.check(admin.id)
            if (lock){
                return next(new response(req, res, 'update accessPoints admin', 400, 'در حال حاظر امکان آپدیت این ادمین وجود ندارد لطفا دقایقی دیگر تلاش کنید', null))
            }
            // locking admin
            let finalAccess = []
            console.log('befor update the accessPoints >>>> ', req.body.accessPoints)
            for (let i of req.body.accessPoints) {
                if (i.isAccess == true) {
                    delete i.isAccess
                    finalAccess.push(i)
                }
            }
            console.log('after update accessPoints', finalAccess)
            admin.accessPoints = finalAccess
            await queryRunner.manager.save(admin)
            console.log(req.user.userId)
            let mainAdmin = await this.adminRepository.findOne({ where: { id: +req.user.userId } })
            let actions = `\u202B${mainAdmin.firstName} ${mainAdmin.lastName} سطح دسترسی مربوط به ادمین ${admin.firstName} ${admin.lastName} را تغییر داد\u202C`
            this.InterService.addNewAdminLog({ firstName: mainAdmin.firstName, lastName: mainAdmin.lastName, phoneNumber: mainAdmin.phoneNumber },
                'تغییر سطح دسترسی', actions, {
                finalAccess
            }, 1)
            await this.lockService.disablor(admin.id)
            await queryRunner.commitTransaction()
            return next(new response(req, res, 'update accessPoints admin', 200, null, admin))
        } catch (error) {
            console.log('updating accesspoints successfully done . . .' , error)
            await queryRunner.rollbackTransaction()
        }finally{
            await queryRunner.release()
        }
    }

    /**
     * this endpoint is for updating admin by super admin
     * @param req 
     * @param res 
     * @param next 
     * @returns 
     */
    async updateAdmin(req: Request, res: Response, next: NextFunction) {
        let adminId = req.params.adminId;
        if (!adminId) {
            return next(new response(req, res, 'update admin', 400, 'مقدار ورودی نادرست', null))
        }
        if (req.user.role == 0) {
            return next(new response(req, res, 'update admin', 403, 'permision denied', null))
        }
        let admin = await this.adminRepository.findOne({ where: { id: +adminId } })
        if (!admin) {
            return next(new response(req, res, 'update accessPoints admin', 400, 'ادمین مورد نظر یافت نشد', null))
        }
        let queryRunner = AppDataSource.createQueryRunner()
        await queryRunner.connect()
        await queryRunner.startTransaction()
        try {
            // checking locking admin
            let lock = await this.lockService.check(admin.id)
            if (lock) {
                return next(new response(req, res, 'update accessPoints admin', 400, 'در حال حاظر امکان آپدیت این ادمین وجود ندارد لطفا دقایقی دیگر تلاش کنید', null))
            }

            if (req.body.password) {
                req.body.password = await bcrypt.hash(req.body.password, 10)
            }
            
            admin = { ...admin, ...req.body }
            // admin.password = req.body.password;
            // await this.adminRepository.save(admin)
            // await this.adminRepository.remove(admin)
            // admin.role = 1;
            await queryRunner.manager.save(admin)
            await this.lockService.disablor(admin.id)
            await queryRunner.commitTransaction()
            return next(new response(req, res, 'update admin', 200, null, admin))
        } catch (error) {
            console.log('error occured in updating admin >>>>> ', error)
            await queryRunner.rollbackTransaction()
        } finally {
            await queryRunner.release()
            console.log('transaction released successfully . . . . ')
        }
    }

    async getAllAdmins(req: Request, res: Response, next: NextFunction) {
        let admins = await this.adminRepository.find({ relations: ['accessPoints'] })
        // let all = await this.accessPointRepository.find()
        // await this.accessPointRepository.remove(all)
        return next(new response(req, res, 'get all admins', 200, null, admins))
    }

    async getAdmin(req: Request, res: Response, next: NextFunction) {
        let adminId: string = req.params.adminId
        let admin = await this.adminRepository.findOne({
            where: {
                id: +adminId
            }, relations: ['accessPoints']
        })
        return next(new response(req, res, 'get specific admin', 200, null, admin))
    }


    async createCooprationRequests(req: Request, res: Response, next: NextFunction) {
        try {
            const error = validationResult(req)
            if (!error.isEmpty()) {
                console.log(error)
                return next(new response(req, res, 'admin service', 400, error['errors'][0].msg, null))
            }
            // let all = await this.cooperationRepository.find()
            // await this.cooperationRepository.remove(all)
            let existance = await this.cooperationRepository.exists({ where: [{ phoneNumber: req.body.phoneNumber }, { nationalCode: req.body.nationalCode }] })
            if (existance) {
                return res.status(400).json({
                    error: 'شما قبلا درخواست همکاری با خانه طلارا ثبت کرده اید.لطفا تا بررسی درخواست قبلی منتظر بمانید'
                })
            }
            let coorporation = this.cooperationRepository.create(req.body)
            await this.cooperationRepository.save(coorporation)
            return next(new response(req, res, 'admin service', 200, null, coorporation))
        } catch (error) {
            console.log('error>>>', error)
            return next(new response(req, res, 'admin service', 500, `${error}`, null))
        }
    }


    async getAllCoorporation(req: Request, res: Response, next: NextFunction) {
        try {
            let coorporation = await this.cooperationRepository.find({ order: { 'updatedAt': 'DESC' } })
            return next(new response(req, res, 'admin service', 200, null, coorporation))
        } catch (error) {
            console.log('error>>>', error)
            return next(new response(req, res, 'admin service', 200, `${error}`, null))
        }
    }


    async deActiveAdmin(req: Request, res: Response, next: NextFunction) {

        try {
            let admin = await this.adminRepository.findOneOrFail({ where: { id: +req.params.adminId } })
            if (!admin){
                return next(new response(req, res, 'admin service', 400, 'ادمین مورد نظر یافت نشد', null))
            }

            let lock = await this.lockService.check(admin.id)
            if (lock) {
                return next(new response(req, res, 'update accessPoints admin', 400, 'در حال حاظر امکان آپدیت این ادمین وجود ندارد لطفا دقایقی دیگر تلاش کنید', null))
            }
            let queryRunner = AppDataSource.createQueryRunner()
            await queryRunner.connect()
            await queryRunner.startTransaction()
            try {
                if (admin.isBlocked) {
                    admin.isBlocked = false;
                    await this.adminRepository.save(admin)
                    let mainAdmin = await this.adminRepository.findOne({ where: { id: +req.user.userId } })
                    let actions = `\u202B${mainAdmin.firstName} ${mainAdmin.lastName} ادمین ${admin.firstName} ${admin.lastName} را  فعال کرد\u202C`
                    this.InterService.addNewAdminLog({ firstName: mainAdmin.firstName, lastName: mainAdmin.lastName, phoneNumber: mainAdmin.phoneNumber },
                        ' فعال کردن ادمین', actions, {
    
                    }, 1)
                    process.nextTick(async()=>{
                        this.lockService.disablor(admin.id)
                    })
                    return next(new response(req, res, 'admin service', 200, null, null))
                } else {
                    admin.isBlocked = true;
                    await this.adminRepository.save(admin)
                    let mainAdmin = await this.adminRepository.findOne({ where: { id: +req.user.userId } })
                    let actions = `\u202B${mainAdmin.firstName} ${mainAdmin.lastName} ادمین ${admin.firstName} ${admin.lastName} را غیر فعال کرد\u202C`
                    this.InterService.addNewAdminLog({ firstName: mainAdmin.firstName, lastName: mainAdmin.lastName, phoneNumber: mainAdmin.phoneNumber },
                        'غیر فعال کردن ادمین', actions, {
    
                    }, 1)
                    process.nextTick(async()=>{
                        this.lockService.disablor(admin.id)
                    })
                    return next(new response(req, res, 'admin service', 200, null, null))
                }
            } catch (error) {
                console.log('error in deactivation admin ' , error)
                await queryRunner.rollbackTransaction()
            }finally{
                await queryRunner.release()
            }
        } catch (error) {
            console.log('error in de activation of admins', error)
            return next(new response(req, res, 'admin service', 500, 'خطای داخلی سیستم', null))
        }
    }



    async deleteAdmin(req: Request, res: Response, next: NextFunction) {
        try {
            let admin = await this.adminRepository.findOne({ where: { id: +req.params.adminId } })
            if (!admin) {
                return next(new response(req, res, 'admin service', 400, 'ادمین مورد نظر یافت نشد', null))
            }
            await this.adminRepository.remove(admin)
            let mainAdmin = await this.adminRepository.findOne({ where: { id: +req.user.userId } })
            let actions = `\u202B${mainAdmin.firstName} ${mainAdmin.lastName} ادمین ${admin.firstName} ${admin.lastName} را حذف کرد\u202C`
            this.InterService.addNewAdminLog({ firstName: mainAdmin.firstName, lastName: mainAdmin.lastName, phoneNumber: mainAdmin.phoneNumber },
                '  حذف ادمین', actions, {

            }, 1)
            return next(new response(req, res, 'admin service', 200, null, null))
        } catch (error) {
            console.log('error occured in removing admin >>>> ', error)
            return next(new response(req, res, 'admin service', 500, 'خطای داخلی سیستم', null))
        }
    }
}