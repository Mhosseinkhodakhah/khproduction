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



export class UserController {

    private userRepository = AppDataSource.getRepository(Admin)
    private accessPointRepository = AppDataSource.getTreeRepository(accessPoint)
    private cooperationRepository = AppDataSource.getRepository(cooperation)
    private tokenService = new jwtGenerator()
    private InterService = new interservice()
    private adminRepository = AppDataSource.getRepository(Admin)

    // async testApi(req: Request, res: Response, next: any) {
    //     // const bodyError = validationResult(req)
    //     // if (!bodyError.isEmpty()) {
    //     //     return next(new response(req, res, 'create lesson', 400, bodyError['errors'][0].msg, null))
    //     // }
    // return next(new response(req , res , 'test' , 200 , null , 'its passed from test . . .'))
    // }

    async createNewAdmin(req: Request, res: Response, next: NextFunction) {
        const newAdmin = new Admin()
        newAdmin.firstName = 'hossein';
        newAdmin.lastName = 'khodakhah';
        await this.adminRepository.save(newAdmin);
    }

    async createNewMenu(req: Request, res: Response, next: NextFunction) {
        const newMenu = this.accessPointRepository.create(req.body.menu)
        let data = await this.accessPointRepository.save(newMenu)
        await this.InterService.addNewLog({firstName : '', lastName : '' , phoneNumber : req.user.phone} , 'create new menu' , `${req.user.phone} create new menu with name ${req.body.menu}` , { statusCode : 200,
            error : null,
            msg : `creating new menu successfully done.`},
            1)
        return next(new response(req, res, 'create new menu', 200, null, data))
    }

    async creatNewSubMenu(req: Request, res: Response, next: NextFunction) {
        let menuId: string = req.params.menuId;
        console.log(menuId)
        let Menu = await this.accessPointRepository.findOne({ where: { id: +menuId } })
        console.log(Menu)
        let newData = { ...req.body, parent: Menu }
        let newSubMenu = this.accessPointRepository.create(newData)
        console.log(newSubMenu)
        let data = await this.accessPointRepository.save(newSubMenu)
        console.log(data)
        await this.InterService.addNewLog({firstName : '', lastName : '' , phoneNumber : req.user.phone} , 'create new menu' , `${req.user.phone} create new menu with name ${req.body.menu}` , { statusCode : 200,
            error : null,
            msg : `creating new menu successfully done.`},
            1)
        return next(new response(req, res, 'create new sub menu', 200, null, data))
    }

    async getAllMenu(req: Request, res: Response, next: NextFunction) {
        let id = req.params.id
        let menu = await this.accessPointRepository.find({order : {id : 'ASC'}})
        let Adminmenu = await this.adminRepository.findOne({where : {id : +id} , relations : ['accessPoints']})
        // console.log('admin access' , Adminmenu.accessPoints)
        // console.log('admin access22222' , menu)
        let access = Adminmenu.accessPoints;
        let accessed = []
        for (let i =0 ; i < access.length ; i++ ) {
            access[i]['isAccess'] = true
            console.log('access' , access[i])
            accessed.push(access[i])
        }

        let final = {...menu , ...access}

        let lastFinal = []

        for (let j of Object.keys(final)){
            if (final[j].isAccess == undefined){
                final[j]['isAccess'] = false;
            }else if (final[j].isAccess == null){
                final[j]['isAccess'] = false;
            }
            lastFinal.push(final[j])
        }
        return next(new response(req, res, 'get All SubMenu', 200, null, lastFinal))
    }


    async addNewAdmin(req: Request, res: Response, next: NextFunction) {
        // const admin = req.user.role
        // console.log('')
        // if (admin == 0) {
        //     return next(new response(req, res, 'create new admin', 403, 'permision denied!', null))
        // }
        req.body.password = await bcrypt.hash(req.body.password, 10)
        console.log(req.body)
        let newAdmin = this.adminRepository.create(req.body)
        await this.adminRepository.save(newAdmin)
        await this.InterService.addNewLog({firstName : '', lastName : '' , phoneNumber : req?.user?.phone} , 'create new admin' , `${req?.user?.phone} create new admin with name ${req.body.firstName}` , { statusCode : 200,
            error : null,
            msg : `creating new admin successfully done.`},
            1)
        return next(new response(req, res, 'create new admin', 200, null, newAdmin))
    }


    async login(req: any, res: any, next: any) {
        console.log('body' , req.body)
        let admin = await this.adminRepository.findOne({
            where: {
                phoneNumber: req.body.phoneNumber
            },relations : ['accessPoints']
        })
        let newAccessPoints = ['Dashboard']
        for (let i of admin.accessPoints){
            newAccessPoints.push(i.englishName)
        }
        if (!admin) {
            console.log('its here')
            return next(new response(req, res, 'login admin', 403, 'account not found!', null))
        }
        if (admin.isBlocked) {
            console.log('its here222')
            return next(new response(req, res, 'login admin', 403, 'permision denied!', null))
        }
        const compare = await bcrypt.compare(req.body.password, admin.password)
        if (!compare) {
            console.log('its here password')
            return next(new response(req, res, 'login', 403, 'password is incorrect!', null))
        }
        let accessPoints = await this.accessPointRepository.find({where : {
            Admin : admin
        }})
        console.log(accessPoints)
        let tokenData: jwtGeneratorInterface = {
            id: admin.id,
            firstName: admin.firstName,
            lastName: admin.lastName,
            isBlocked: admin.isBlocked,
            phone : admin.phoneNumber,
            role : admin.role
        }
        console.log('token>>' , tokenData)
        let token = await this.tokenService.tokenize(tokenData)
        let responseData = { ...admin,accessPoints : newAccessPoints, token: token}
        console.log('ttoken' , token)
        return next(new response(req, res, 'login admin', 200, null, responseData))
    }


    async updateAccessPoints(req: Request, res: Response, next: NextFunction) {
        let bodyValidation = validationResult(req.body)
        console.log(req.body)
        if (!bodyValidation.isEmpty()){
            return next(new response(req, res, 'update accessPoints admin', 400, bodyValidation['errors'][0].msg, null))
        }
        let admin = await this.adminRepository.findOne({
            where: {
                id: +req.params.userId
            },
            relations: ['accessPoints']
        })
        if (!admin) {
        return next(new response(req, res, 'update accessPoints admin', 404, null, admin))
        }
        // for (let i of req.body.accessPoints){
        //     let id = i.id;
        //     let menu = await this.accessPointRepository.findOne({where : {id : id}})
        //     menu.Admin.push(admin)
        //     // admin.accessPoints.push(menu)
        // }
        let finalAccess = []
        for (let i of req.body.accessPoints){
            if (i.isAccess == true){
                delete i.isAccess
                // i.Admin.push(admin) 
                finalAccess.push(i)
            }
        }
        admin.accessPoints = finalAccess
        await this.adminRepository.save(admin)
        await this.InterService.addNewLog({firstName : '', lastName : '' , phoneNumber : req.user.phone} , 'update new admin accesspoint' , `${req.user.phone} update accesspoint ` , req.body,
            1)
        return next(new response(req, res, 'update accessPoints admin', 200, null, admin))
    }


    async updateAdmin(req: Request, res: Response, next: NextFunction){
        let adminId = req.params.adminId || req.user.userId;
        let admin = await this.adminRepository.findOne({where : {id : +adminId}})
        admin = {...admin , ...req.body}
        await this.adminRepository.save(admin)
        return next(new response(req, res, 'update admin', 200, null, admin))
    }

    async getAllAdmins(req: Request, res: Response, next: NextFunction){
        let admins = await this.adminRepository.find({relations : ['accessPoints']})
        // let all = await this.accessPointRepository.find()
        // await this.accessPointRepository.remove(all)
        return next(new response(req, res, 'get all admins', 200, null, admins))
    }

    async getAdmin(req: Request, res: Response, next: NextFunction){
        let adminId : string = req.params.adminId
        let admin = await this.adminRepository.findOne({where:{
            id : +adminId
        },relations : ['accessPoints']
    })
    return next(new response(req, res, 'get specific admin', 200, null, admin))
    }



    async createCooprationRequests(req: Request, res: Response, next: NextFunction){
        try {
            const error = validationResult(req)
            if (!error.isEmpty()) {
                console.log(error)
                return next(new response(req, res , 'admin service', 400, error['errors'][0].msg, null))
            }
            let coorporation = this.cooperationRepository.create(req.body)
            await this.cooperationRepository.save(coorporation)
            return next(new response(req, res , 'admin service', 200, null, coorporation))    
        } catch (error) {
            console.log('error>>>' , error)
            return next(new response(req, res , 'admin service', 500, `${error}`, null))    
        }
    }


    async getAllCoorporation(req: Request, res: Response, next: NextFunction){
        try {
            let coorporation = await this.cooperationRepository.find({order : {'updatedAt' : 'DESC'}})
            return next(new response(req, res , 'admin service', 200, null , coorporation))    
        } catch (error) {
            console.log('error>>>' , error)
            return next(new response(req, res , 'admin service', 200, `${error}` , null))    
        }
    }



}