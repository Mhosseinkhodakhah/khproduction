import cron = require('node-cron');
import { GoldPriceService } from '../services/gold-price-service/gold-price-service';
let gpService = new GoldPriceService()
export function startCronJob() {
    try {
        cron.schedule('*/5 * * * *', async() => {
            console.log(21312313);
            
            // gpService.setGoldPrice()
        });
        console.log('Cron job started');
        
    } catch (error) {
        console.log("error in runing job", error);     
    }
}