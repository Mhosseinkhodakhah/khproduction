import { AppDataSource } from "../data-source";
import { Wallet } from "../entity/Wallet";
import { GoldPriceService } from "../services/gold-price-service/gold-price-service";
import { NextFunction, Request, Response } from "express";
import monitor from "../util/statusMonitor";
import { handleGoldPrice } from "../entity/handleGoldPrice.entity";

export class GoldPriceController {

    private goldPriceService = new GoldPriceService()
    private handleGoldPrice = AppDataSource.getRepository(handleGoldPrice)


    async getGoldPrice(request: Request, response: Response, next: NextFunction) {
        try {
            let userId = request["userId"]
            let handleGold = await this.handleGoldPrice.find()
            let result;
            if (handleGold[0].active){
                result = {price : handleGold[0].price , change : 0}
                console.log('result is here>>>>' , handleGold[0].price)
            }else {
                console.log('result is not here>>>>' , handleGold[0].price)
            }
            result = await this.goldPriceService.getGoldPrice()

            let sellFee = 1
            let buyFee = 0
            let data = {
                sellPrice : parseInt(result.price) - ((result.price * sellFee) / 100),
                buyPrice : parseInt(result.price) + ((result.price * buyFee) / 100),
                change : result.change,
            }
            monitor.addStatus({
                scope: 'goldPrice controller',
                status: 1,
                error: null
            })
            return response.json(data)
        } catch (error) {
            monitor.addStatus({
                scope: 'goldPrice controller',
                status: 0,
                error: `${error}`
            })
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
        monitor.addStatus({
            scope: 'goldPrice controller',
            status: 1,
            error: null
        })
        return response.status(200).json(data)
    }catch(err){
        monitor.addStatus({
            scope: 'goldPrice controller',
            status: 0,
            error: `${err}`
        })
        console.log(err);
        response.status(500).json({ msg: "خطای داخلی سیستم" })   
    }
    }  

    async getHandleGoldPrice(request: Request, response: Response, next: NextFunction){
        let goldPrice = await this.handleGoldPrice.find()
        response.status(200).json({ data : goldPrice[0] })
    }
    
}
