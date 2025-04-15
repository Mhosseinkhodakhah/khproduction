import { AppDataSource } from "../data-source"
import { NextFunction, Request, Response } from "express"
import {response} from "../responseModel/response"
import {validationResult} from "express-validator"
import { Cart } from "../entity/Cart";
import { ProductItems } from "../entity/ProductItem";
import { CartItem } from "../entity/CartItem";


export class CartController {
       private cartRepository=AppDataSource.getRepository(Cart)
       private cartItemsRepository=AppDataSource.getRepository(CartItem)
       private productItemsRepository=AppDataSource.getRepository(ProductItems)

    async addToCart(req: Request, res: Response, next: NextFunction) {
        const bodyError = validationResult(req)
        if (!bodyError.isEmpty()) {
            return next(new response(req, res, 'add to cart', 400, bodyError['errors'][0].msg, null))
        }   
        const userId=req.user.id
        const { productItemId, quantity } = req.body;
        
        try {
          const cart =await this.cartRepository.findOne({where:{userId},relations:['items']})
          if(!cart){
            return next(new response(req, res, 'add to cart', 404,'Cart not found for this user', null))
          }
          const productItem=await this.productItemsRepository.findOne({where:{id:productItemId},relations:["product"]})  
           
          if(!productItem || productItem.count<quantity){
            return next(new response(req, res, 'add to cart', 404,'ProductItem not available', null))
          }

          let cartItem=cart.items.find((item)=>item.productItem.id===productItemId)

          if(cartItem){
            cartItem.quantity += quantity;
          }else{
             cartItem=new CartItem()
             cartItem.productItem=productItem
             cartItem.quantity=quantity
             cart.items.push(cartItem) 
          }
    
            await this.cartRepository.save(cart)
            return next(new response(req , res , 'all products' , 200 , null ,cart ))
        } catch (error) {
            return next(new response(req, res, 'all products', 500, error, null))
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