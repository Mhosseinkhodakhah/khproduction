import axios from "axios";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";
import { Invoice } from "../entity/Invoice";
import { EstimateTransactions } from "../entity/EstimateTransactions";
import { goldPrice } from "../entity/goldPrice";


export default class connection {
    private readonly userRepository = AppDataSource.getRepository(User)
    private readonly invoiceRepository = AppDataSource.getRepository(Invoice)
    private readonly estimate = AppDataSource.getRepository(EstimateTransactions)
    private readonly goldPrice = AppDataSource.getRepository(goldPrice)





    private async estimateMaker(){
        let a = await this.invoiceRepository.find({where : {status :"completed"} , relations : ['type']})
        let biught = 0;
        let sold = 0;
        for (let i = 0; i < a.length; i++) {
            if (a[i].goldWeight > 0){
                if (a[i].type.title == 'sell'){
                    sold += +a[i].goldWeight
                }else{
                    biught += +a[i].goldWeight
                }
            }
        }
        let ees = await this.estimate.findOne({where : {
            date : 'localDate'
        }})
        console.log(biught , sold)
        ees.boughtGold = biught.toFixed(3);
        ees.soldGold = sold.toFixed(3);
        await this.estimate.save(ees)
    }




    async getAllUsers(){
            let users = await this.userRepository.find({relations : ['buys' , 'sells' , 'wallet' , 'wallet.transactions']})
            let invoices = await this.invoiceRepository.find({where : {status : 'completed'},relations : ['type']})
            // await this.estimateMaker()
            let estimates = await this.estimate.find()
            let all = await axios.get("https://gateway.khaneetala.ir/v1/main/test/09123460671") 
            let prices;
            if (all){
                prices = all.data;
            }else{
                prices = await this.goldPrice.find()
            }
            console.log(prices)
            let finalDate = {users : users , invoices : invoices , estimates : estimates , prices : prices}
            return finalDate 
    }
}