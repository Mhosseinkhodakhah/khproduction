import { AppDataSource } from "../data-source"
import { EstimateTransactions } from "../entity/EstimateTransactions"
import monitor from "./statusMonitor"


export class estimatier{

    private estimate = AppDataSource.getRepository(EstimateTransactions)

    async estimateWeight(goldWeight: number, type: number) {
        try {
            if (+goldWeight > 0){
            if (type == 0) {
                
                let totalEstimate = await this.estimate.findOne({
                    where: {
                        date: 'localDate'
                    }
                })
                totalEstimate.soldGold = (parseFloat(((+totalEstimate.soldGold) + goldWeight).toFixed(3))).toString()
                await this.estimate.save(totalEstimate)
            }
            if (type == 1) {
                let totalEstimate = await this.estimate.findOne({
                    where: {
                        date: 'localDate'
                    }
                })
                totalEstimate.boughtGold = (parseFloat(((+totalEstimate.boughtGold) + goldWeight).toFixed(3))).toString()
                await this.estimate.save(totalEstimate)
            
            return true
        }
    }
    } catch (error) {
            monitor.error.push(`${error}`)
            console.log('error>>>>' , error)
            return false
        }
    }

}