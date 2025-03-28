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

    async getAllUsers(){
            let users = await this.userRepository.find({relations : ['buys' , 'sells' , 'wallet' , 'wallet.transactions']})
            let invoices = await this.invoiceRepository.find()
            let estimates = await this.estimate.find()
            let prices = await this.goldPrice.find()
            console.log('users>>>' , users)
            let finalDate = {users : users , invoices : invoices , estimates : estimates , prices : prices}
            return finalDate 
    }

}