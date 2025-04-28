import { AppDataSource } from "./src/data-source"
import { goldPrice } from "./src/entity/goldPrice"
import { handleGoldPrice } from "./src/entity/handleGoldPrice.entity"
import { SmsService } from "./src/services/sms-service/message-service"




class checker{
    
    private goldPriceRepository = AppDataSource.getRepository(goldPrice)
    private handleGoldPrice = AppDataSource.getRepository(handleGoldPrice)
    private smsService = new SmsService()
    
    async start(){
        let handleGoldPriceData = await this.handleGoldPrice.find()
        let realPrice = await this.goldPriceRepository.find({order : {'createdAt' : "DESC"}})
        if (handleGoldPriceData[0].active){
            console.log('handle gold price is active')
            let ashkanPhone = '09124279124'
            let motahar = '09118468910'
            let mehrshad = '09375925640'
            this.smsService.sendGeneralMessage( ashkanPhone , "handleGoldPrice" , 'رنجبخش' ,handleGoldPriceData[0].price , realPrice[0].Geram18)
            this.smsService.sendGeneralMessage( motahar , "handleGoldPrice" , 'معصومی' ,handleGoldPriceData[0].price , realPrice[0].Geram18)
            this.smsService.sendGeneralMessage( mehrshad , "handleGoldPrice" , 'دلشادپور' ,handleGoldPriceData[0].price , realPrice[0].Geram18)
        }else{
            console.log('handle gold price is deActive')
        }
    }
}

let startChecker = new checker()

export function smsHandleChecker() {
    setInterval(async () => {
        console.log('start the fucking sms checker for handle price')
        await startChecker.start()
        console.log('finish the fucking sms checker for handle price')
    }, 1000 * 60 )
}