import { AppDataSource } from "../data-source"
import { NextFunction, Request, Response } from "express"
import { Category } from "../entity/Category"
import {response} from "../responseModel/response"
import {validationResult} from "express-validator"
import mqConnection from "../rabbitmq/rabbitmq.service"

export class CategoryController {
    private categoryRepository = AppDataSource.getTreeRepository(Category)

    async testApi(req: Request, res: Response, next: NextFunction) {
        const bodyError = validationResult(req)
        if (!bodyError.isEmpty()) {
            return next(new response(req, res, 'category test', 400, bodyError['errors'][0].msg, null))
        }
        return next(new response(req , res , 'category test' , 200 , null , 'its passed from test . . .'))
    }

    async all(req: Request, res: Response, next: NextFunction) {

        try {
            const categories = await this.categoryRepository.findTrees();
            return next(new response(req , res , 'all category' , 200 , null ,categories ))
        } catch (error) {
            return next(new response(req, res, 'all category', 400, error, null))
        }
    }

    async one(req: Request, res: Response, next: NextFunction) {
        const  id  = +req.params.id

        try {
            const category = await this.categoryRepository.findOne({where:{id}, relations: ["products"]});
            if (!category) {
                return next(new response(req, res, 'one category', 404, "Category not found", null))
            }

             return next(new response(req , res , 'one category' , 200 , null ,category ))
        } catch (error) {
            return next(new response(req, res, 'one category', 500, error, null))
        }


       
    }

    async save(req: Request, res: Response, next: NextFunction) {
        const bodyError = validationResult(req)
        if (!bodyError.isEmpty()) {
            return next(new response(req, res, 'create category', 400, bodyError['errors'][0].msg, null))
        } 
        const { name, description} = req.body;
        const parentId=+req.params.id
        const category = this.categoryRepository.create({ name, description });

        if (parentId) {
            const parentCategory = await this.categoryRepository.findOne({where:{id:parentId}});
            if (!parentCategory) {
                return next(new response(req, res, 'create category', 400,'Parent category not found', null))
            }
            category.parent = parentCategory;
        }

        try {
            const savedCategory = await this.categoryRepository.save(category);
             
            return next(new response(req , res , 'create category' , 200 , null ,savedCategory ))
        } catch (error) {
            return next(new response(req, res, 'create category', 500,error, null))
        }
    }

    async saveParent(req: Request, res: Response, next: NextFunction) {
        const bodyError = validationResult(req)
        if (!bodyError.isEmpty()) {
            return next(new response(req, res, 'create category', 400, bodyError['errors'][0].msg, null))
        } 
        const { name, description} = req.body;
        const category = this.categoryRepository.create({ name, description });
        try {
            const savedCategory = await this.categoryRepository.save(category);
            return next(new response(req , res , 'create category' , 200 , null ,savedCategory ))
        } catch (error) {
            return next(new response(req, res, 'create category', 500,error, null))
        }
    }

    async remove(req: Request, res: Response, next: NextFunction) {
        const id = +req.params.id
        let categoryToRemove = await this.categoryRepository.findOneBy({ id })
        if (!categoryToRemove) {
            return next(new response(req, res, 'remove category', 404,' category  not found', null))
        }
        await this.categoryRepository.remove(categoryToRemove)
        return next(new response(req , res , 'remove category' , 200 , null ,null ))
        
    }

    async update(req: Request, res: Response, next: NextFunction){
        const bodyError = validationResult(req)
        if (!bodyError.isEmpty()) {
            return next(new response(req, res, 'update category', 400, bodyError['errors'][0].msg, null))
        } 
        const { name, description} = req.body;
        const id=+req.params.id
        try {
            const category = await this.categoryRepository.findOne({where:{id:id}});
            if (!category) {
                return next(new response(req, res, 'update category', 404, "Category not found", null))
            }
            category.name=name
            category.description=description
            await this.categoryRepository.save(category)
            
            return next(new response(req , res , 'update category' , 200 , null ,category ))
        } catch (error) {
            return next(new response(req, res, 'update category', 500,error, null))
        }


    }

}