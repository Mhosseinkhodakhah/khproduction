import { AppDataSource } from "../data-source"
import { NextFunction, Request, Response } from "express"
import { Product } from "../entity/Product"
import { ProductItems } from "../entity/ProductItem"
import {response} from "../responseModel/response"
import {validationResult} from "express-validator"

export class ProductItemController {
    private productRepository = AppDataSource.getRepository(Product)
    private productItemsRepository=AppDataSource.getRepository(ProductItems)


    async allForProduct(req: Request, res: Response, next: NextFunction) {
        const productId=+req.params.id
        try {
            const productsItems = await this.productItemsRepository.findBy({productId})
            return next(new response(req , res , 'all items for one product' , 200 , null ,productsItems ))
        } catch (error) {
            return next(new response(req, res, 'all items for one product', 400, error, null))
        }
    }

    async one(req: Request, res: Response, next: NextFunction) {
        const id = +req.params.id
        try {
            const item = await this.productItemsRepository.findOne({
                where: { id },relations:["product"]
            })
            if(!item){
                return next(new response(req, res, 'one product item', 404, "product not found", null))
            }

             return next(new response(req , res , 'one product item' , 200 , null ,item ))
        } catch (error) {
            return next(new response(req, res, 'one product item', 500, error, null))
        }
    }

    async save(req: Request, res: Response, next: NextFunction) {
        const id=+req.params.id
        const bodyError = validationResult(req)
        if (!bodyError.isEmpty()) {
            return next(new response(req, res, 'create product items', 400, bodyError['errors'][0].msg, null))
        }  
       try{
        console.log(req.body);
        
        const findedProduct=await this.productRepository.findOneBy({id})
        if(!findedProduct){
            return next(new response(req, res, 'create product items', 404,' product  not found', null))
        }
        console.log('test pass')
        const a= this.productItemsRepository.create(req.body.items)
        console.log('ssssssssssssssss',a)
        const items=await this.productItemsRepository.save(a)
        
        console.log(items);
        
        findedProduct.items=items
        console.log("nice",findedProduct);
        
        const product=await this.productRepository.save(findedProduct)

        return next(new response(req , res , 'create product' , 200 , null ,product ))

       }catch(error){
        console.log('errrrrrrrrrr' , error)
        return next(new response(req, res, 'create product', 500, error, null))
       } 
       
    }

    async remove(req: Request, res: Response, next: NextFunction) {
        const id = +req.params.id

        const productItemToRemove= await this.productItemsRepository.findOneBy({id}) 

        if (!productItemToRemove) {
            return next(new response(req, res, 'remove product item', 404,' product item  not found', null))
        }

        await this.productItemsRepository.remove(productItemToRemove)
        return next(new response(req , res , 'remove product item' , 200 , null ,null ))
       
    }

    async update (req: Request, res: Response, next: NextFunction) {
        const bodyError = validationResult(req)
        if (!bodyError.isEmpty()) {
            return next(new response(req, res, 'update product item', 400, bodyError['errors'][0].msg, null))
        }  
        const id =+req.params.id
       try{ 

        const updateProductItem=await this.productItemsRepository.findOneBy({id})
        if(updateProductItem){
            return next(new response(req, res, 'update product item', 404,' update item  not found', null))
        }
        this.productItemsRepository.merge(updateProductItem,req.body.item)
        return next(new response(req , res , 'update product item' , 200 , null ,updateProductItem ))
       }catch(error){
        return next(new response(req, res, 'update product item', 500, error, null))
       } 
    }

    async updateCount(req: Request, res: Response, next: NextFunction){
        const productId=+req.params.pid
        const produtctItemId=+req.params.id
        const count=req.body.count
        try{
        const updateProductItem=await this.updateCountOfItems(productId,produtctItemId,count)
        return next(new response(req , res , 'update count of product item' , 200 , null ,updateProductItem ))
     }
        catch(error){
            return next(new response(req, res, 'update countof product item', 500, error, null))
        }
    }   


    private async updateCountOfItems(productId : number ,produtctItemId : number,count : number) : Promise<ProductItems> {
        const productItem=await this.productItemsRepository.findOne({where:{id:produtctItemId,productId}})
        productItem.count=-count
        return await this.productItemsRepository.save(productItem)
    }
}   