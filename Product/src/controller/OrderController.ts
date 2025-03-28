import { AppDataSource } from "../data-source"
import { NextFunction, Request, Response } from "express"
import {response} from "../responseModel/response"
import {validationResult} from "express-validator"
import { Cart } from "../entity/Cart";
import { ProductItems } from "../entity/ProductItem";
import { Order } from "../entity/Order";



export class OrderController {
       private cartRepository=AppDataSource.getRepository(Cart)
       private orderRepository=AppDataSource.getRepository(Order)
       private productItemsRepository=AppDataSource.getRepository(ProductItems)

    async createOrder(req: Request, res: Response, next: NextFunction) {
        const userId=req.user.id        
        try {
            const cart =await this.cartRepository.findOne({where:{userId},relations:["items", "items.productItem.product"]}) 
            if (!cart || cart.items.length === 0) {
                return next(new response(req, res, 'create order', 500, 'cart is empty', null))
            }  
 
            



            return next(new response(req , res , 'create order' , 200 , null ,cart ))
        } catch (error) {
            return next(new response(req, res, 'create order', 500, error, null))
        }
    }
    async getCart(req: Request, res: Response, next: NextFunction) {
        const userId=req.user.id
        try {
        const cart = await this.cartRepository.findOne({ where: { id: Number(userId)}, relations: ["items", "items.productItem.product"] });
        if (!cart){
           const newCart=this.cartRepository.create({
            userId,
            items:[]
           })
           await this.cartRepository.save(newCart)
           return next(new response(req , res , 'get cart' , 200 , null ,newCart ))
        }
        return next(new response(req , res , 'get cart' , 200 , null ,cart ))
        } catch (error) {
            return next(new response(req, res, 'get cart', 500, error, null))
        }
    }
    async removeFromCart(req: Request, res: Response, next: NextFunction) {
        const userId=req.user.id
        const productItemId=+req.params.id
        try {
            const cart = await this.cartRepository.findOne({ where: { userId:userId }, relations: ["items"] });
            if (!cart) {
                return next(new response(req, res, 'remove from  cart', 404,'Cart not found', null))
            }
            cart.items = cart.items.filter((item) => item.productItem.id !== productItemId);
            await this.cartRepository.save(cart);
            return next(new response(req , res , 'remove from  cart' , 200 , null ,cart ))
        } catch (error) {
            return next(new response(req, res, 'remove from  cart', 500, error, null))
        } 
    }

}