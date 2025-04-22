import { AppDataSource } from "../data-source"
import { NextFunction, Request, Response } from "express"
import { sellers } from "../entity/sellers"
import { branche } from "../entity/branche"

export class UserController {

    private sellerRepository = AppDataSource.getRepository(sellers)
    private branchRepository = AppDataSource.getRepository(branche)
    async createNewBranch(req: Request, res: Response, next: NextFunction){
        
        

    }

}