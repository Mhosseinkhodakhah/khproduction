import axios from 'axios'
import cacher from '../cacher'
import { AppDataSource } from '../../data-source';
import { goldPrice } from '../../entity/goldPrice';
import { Between, LessThan } from 'typeorm';
// import NodeCache = require('node-cache')



export class GoldPriceService {
    private lastGoldPrice
    private lastPriceChange
    // private cache = new NodeCache();
    private token:string;
    private goldPriceRepository = AppDataSource.getRepository(goldPrice)

    // private async getToken(){
    //     let body = {
    //         UserName: "MM9124",
    //         Password: "07115102"
    //     }
    //     let apitoken  = await axios.post('https://web.zarbaha-co.ir/api/authentication' , body )
    //     // console.log(apitoken.data.Value)
    //     console.log('token set successfully')
    //     return {token : `Bearer ${apitoken.data.Value}`}
    // }


    // async  setGoldPrice() {
    //     try {
    //         console.log('its here for test haaa. . . .')
           
    //         let newApiToken: string = await cacher.getter('token')
            
    //         console.log(this.token)
    //         let newRespons = await axios.get('https://web.zarbaha-co.ir/api/Price_V2', {
    //             headers: {
    //                 'Authorization': newApiToken
    //             },
    //         })
    //         console.log( 'testestesetes>>>>>>', newRespons.status)            
    //         this.lastGoldPrice = newRespons.data.data.Geram18
    //         try {
    //             let formPrice = await cacher.getter('price')   
    //             this.lastPriceChange = ((+this.lastGoldPrice)*10) - formPrice.lastPrice
    //         } catch (error) {
    //             this.lastPriceChange = 0
    //         }
    //         console.log('this last price' , this.lastGoldPrice)
    //         await cacher.setter('price' , {lastPrice : ((+this.lastGoldPrice)*10) , lastChange : this.lastPriceChange})
    //         let testCache = await cacher.getter('price')

    //         console.log('cacheeeeeeeeeeeeeeeeee>>>>>>>>' , testCache);

    //     } catch (error) {
    //         console.log(`${error}`);
    //         let token = await this.getToken()
    //         console.log('returned token>>>>>>>>>>>>>>' , token.token)
    //         await cacher.setter('token' , token.token)
    //     } finally {
    //         return { price: this.lastGoldPrice, change: this.lastPriceChange }
    //     }
    // }
    
    /**
     * this function is end point for getting the price of the gold
     * @returns 
     */
    async getGoldPrice() {
        let lastGoldPrice = await this.goldPriceRepository.find()
        if (lastGoldPrice.length){
            // console.log('lastGold price in database',lastGoldPrice)
            try {
                let totalPrice : any = await cacher.getter("price")
                let price = totalPrice.lastPrice;
                let change = totalPrice.lastChange;
                console.log( 'what happened for cache . . .', price , change)
                if (!price && !change) {
                    console.log('cache is empty for gold price ....')
                    let lastIndex = lastGoldPrice.length-1
                    price = +lastGoldPrice[lastIndex].Geram18
                    change = 0
                }
                let lastIndex = lastGoldPrice.length-2
                let lastPrice = (+lastGoldPrice[lastIndex].Geram18)
                let firstChange = ((price - lastPrice)/lastPrice)*100
                change = (firstChange < 0.1) ? 0 : (firstChange).toFixed(1)
                return { price, change }
            } catch (error) {
                let lastIndex = lastGoldPrice.length-1
                let price = (+lastGoldPrice[lastIndex].Geram18)
                let change = 0
                // console.log("error in get gold price", error);
                return { price, change }
            }
        }else{
            return {price : 6543000 , change : 1000}
        }
    }
    async getGoldPriceInSpeceficTime(date : number){
        
        const prices = await this.goldPriceRepository.find({
            where: {
                createTime: LessThan(date) 
            },
            order :{
                createTime : 'DESC'
            },
            take:1
        });
 
        console.log(prices);
        
        
        return prices[0];
    }
}
