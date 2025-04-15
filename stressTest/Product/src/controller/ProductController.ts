import { AppDataSource } from "../data-source"
import { NextFunction, Request, Response } from "express"
import { Category } from "../entity/Category"
import { Product } from "../entity/Product"
import { ProductItems } from "../entity/ProductItem"
import {response} from "../responseModel/response"
import {validationResult} from "express-validator"

export class ProductController {
    

    private productRepository = AppDataSource.getRepository(Product)

    async all(req: Request, res: Response, next: NextFunction) {
        try {
            const products = await this.productRepository.find({relations:["items"]})
            return next(new response(req , res , 'all products' , 200 , null ,products ))
        } catch (error) {
            return next(new response(req, res, 'all products', 400, error, null))
        }
    }

    async one(req: Request, res: Response, next: NextFunction) {
        const id = +req.params.id
        try {
            const product = await this.productRepository.findOne({
                where: { id },relations:["items"]
            })
            if(!product){
                return next(new response(req, res, 'one product', 404, "product not found", null))
            }

             return next(new response(req , res , 'one product' , 200 , null ,product ))
        } catch (error) {
            return next(new response(req, res, 'one product', 500, error, null))
        }
    }

    async save(req: Request, res: Response, next: NextFunction) {
        const bodyError = validationResult(req)
        if (!bodyError.isEmpty()) {
            return next(new response(req, res, 'create product', 400, bodyError['errors'][0].msg, null))
        }   
       try{
        const createdBy=`${req.admin.firstName} ${req.admin.lastName}` 
        const productData={...req.body,createdBy}
        const product=await this.productRepository.save(productData)
        return next(new response(req , res , 'create product' , 200 , null ,product ))  
       }catch(error){
        return next(new response(req, res, 'create product', 500, error, null))
       } 
       
    }

    async remove(req: Request, res: Response, next: NextFunction) {
        const id = +req.params.id

        let userToRemove = await this.productRepository.findOneBy({ id })

        if (!userToRemove) {
            return next(new response(req, res, 'remove product', 404,' product  not found', null))
        }

        await this.productRepository.remove(userToRemove)
        return next(new response(req , res , 'remove product' , 200 , null ,null ))
       
    }

    async update (req: Request, res: Response, next: NextFunction) {
        const bodyError = validationResult(req)
        if (!bodyError.isEmpty()) {
            return next(new response(req, res, 'update product', 400, bodyError['errors'][0].msg, null))
        }  
        const id =+req.params.id
        const product=await this.productRepository.findOneBy({id})
        if(!product){
            return next(new response(req, res, 'update product', 404, "product not found", null))
        }
       try{ 
        const updatedBy =`${req.admin.firstName} ${req.admin.lastName}` 
        const productData={...req.body,updatedBy}
        this.productRepository.merge(product,productData)
        const updatedProduct=await this.productRepository.save(product)
        return next(new response(req , res , 'update product' , 200 , null ,updatedProduct ))
       }catch(error){
        return next(new response(req, res, 'update product', 500, error, null))
       } 
    }
    
}