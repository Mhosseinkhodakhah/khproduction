import cron = require('node-cron');
import { GoldPriceService } from '../services/gold-price-service/gold-price-service';
import monitor from '../util/statusMonitor';
let gpService = new GoldPriceService()
export function startCronJob() {
    try {
        cron.schedule('*/5 * * * *', async() => {
            console.log(21312313);
            
            // gpService.setGoldPrice()
        });
        console.log('Cron job started');
        
    } catch (error) {
        monitor.error.push(`error in startCron job :::: ${error}`)
        console.log("error in runing job", error);     
    }
}