import { AppDataSource } from "../data-source";
import { Wallet } from "../entity/Wallet";
import { GoldPriceService } from "../services/gold-price-service/gold-price-service";
import { NextFunction, Request, Response } from "express";

export class GoldPriceController {

    private goldPriceService = new GoldPriceService()
    private 

    async getGoldPrice(request: Request, response: Response, next: NextFunction) {
        try {
            let userId = request["userId"]
            let result :any = await this.goldPriceService.getGoldPrice()
            let sellFee = 1
            let buyFee = 0
            let data = {
                sellPrice : parseInt(result.price) - ((result.price * sellFee) / 100),
                buyPrice : parseInt(result.price) + ((result.price * buyFee) / 100),
                change : result.change,
            }
            return response.json(data)

        } catch (error) {
            console.log(error);
            return response.status(500).json({ msg: "خطای داخلی سیستم" });
        }
    }

    async getGoldPriceForDate(request: Request, response: Response, next: NextFunction){
    const date=parseInt(request.params.date)
    try{
        const result= await this.goldPriceService.getGoldPriceInSpeceficTime(date)
        if(!result){
            response.status(409).json({ msg: "قیمتی برای این تاریخ وجود ندارد" })
        }
        console.log("result from data base",result);
        
        let sellFee = 1
        let buyFee = 0
        let data = {
            sellPrice : parseInt(result.Geram18) - ((parseInt(result.Geram18) * sellFee) / 100),
            buyPrice : parseInt(result.Geram18) + ((parseInt(result.Geram18 )* buyFee) / 100),
        }

        return response.status(200).json(data)
    }catch(err){
        console.log(err);
        response.status(500).json({ msg: "خطای داخلی سیستم" })
        
    }
    }  
    
}
