
import { NextFunction, Request, Response } from "express"
import { AppDataSource } from "../data-source"
import { sellers } from "../entity/sellers"
import { branche } from "../entity/branche"
import { responseModel } from "../util/response.model"


export default class branchController {

    private sellerRepository = AppDataSource.getRepository(sellers)
    private branchRepository = AppDataSource.getRepository(branche)


    async createNewBranch(req: Request, res: Response, next: NextFunction) {
        let newBranch = this.branchRepository.create(req.body)
        let newData = await this.branchRepository.save(newBranch)
        return next(new responseModel(req , res , 'ایجاد شعبه جدید با موفقیت انجام شد' , 'branch' , 200 , null , newData))
    }


    async addSeller(req: Request, res: Response, next: NextFunction){
        let branch = await this.branchRepository.findOne({where : {id : req.params.branchId}})
        if (!branch){
            return next(new responseModel(req, res, 'شعبه مورد نظر یافت نشد', 'branch', 400, 'شعبه مورد نظر یافت نشد', null))
        }
        let newSeller = this.sellerRepository.create({...req.body , branch : branch})
        await this.sellerRepository.save(branch)
        return next(new responseModel(req , res , 'ایجاد فروشنده با موفقیت انجام شد.' , 'branch' , 200 , null , newSeller))
    }


    


}