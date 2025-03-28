import axios from 'axios'
import NodeCache = require('node-cache')
export class GoldPriceService{
    private lastGoldPrice 
    private lastPriceChange
    private cache = new NodeCache();
    async setGoldPrice (){
       try {
           let response = await axios.get('http://nerkh-api.ir/api/8a5de17133f55c651c75bb4d4480521c/gold/')            
           
           this.lastGoldPrice = response.data.data.prices.geram18.current
            this.lastPriceChange = parseInt(response.data.data.prices.geram18.max) - parseInt(response.data.data.prices.geram18.min)
            const success = this.cache.mset([
                {key: "lastGoldPrice", val: this.lastGoldPrice},
                {key: "lastPriceChange", val: this.lastPriceChange},
            ])            
       } catch (error) {
           console.log(error.response.data);
       } finally{
         return {price :this.lastGoldPrice , change : this.lastPriceChange}
       }
    }

    async getGoldPrice(){
        try {
           let price = this.cache.get("lastGoldPrice")
           let change = this.cache.get("lastPriceChange")
            if (!price && !change) {
              let res = await this.setGoldPrice()
              price = res.price 
              change = res.change
            }
            return{price,change}
        } catch (error) {
            console.log("error in get gold price" , error);
        }
    }
}
