import { AppDataSource } from "../data-source"
import { EstimateTransactions } from "../entity/EstimateTransactions"
import monitor from "./statusMonitor"






export class estimatier{

    private estimate = AppDataSource.getRepository(EstimateTransactions)

    async estimateWeight(goldWeight: number, type: number) {
        try {
            console.log(goldWeight)
            goldWeight = +goldWeight
            if (type == 0) {
                let month = new Date().toLocaleString('fa-IR').split(",")[0].split("/")[1]  
                console.log('monthhhhh' , month)
                let monthEstimate = await this.estimate.exists({where : {
                    month : month
                }})
                if (monthEstimate){
                    let exEstimate1 =  await this.estimate.findOne({where : {
                        month : month
                    }})
                    exEstimate1.soldGold = (parseFloat(((+exEstimate1.soldGold) + goldWeight).toFixed(3))).toString()
                    await this.estimate.save(exEstimate1)
                }else{
                    let newMonth = this.estimate.create({month : month , boughtGold : '0' , soldGold : ((goldWeight).toFixed(3)).toString()})
                    await this.estimate.save(newMonth)
                }
                let estimate2 = await this.estimate.exists({
                    where: {
                        date: new Date().toLocaleString("fa-IR").split(",")[0]
                    }
                })
                let totalEstimate = await this.estimate.findOne({
                    where: {
                        date: 'localDate'
                    }
                })
                totalEstimate.soldGold = (parseFloat(((+totalEstimate.soldGold) + goldWeight).toFixed(3))).toString()
                await this.estimate.save(totalEstimate)
                if (estimate2) {
                    let exEstimate = await this.estimate.findOne({
                        where: {
                            date: new Date().toLocaleString("fa-IR").split(",")[0]
                        }
                    })
                    exEstimate.soldGold = (parseFloat(((+exEstimate.soldGold) + goldWeight).toFixed(3))).toString()
                    await this.estimate.save(exEstimate)
                } else {
                    let estimate32 = this.estimate.create({
                        date: new Date().toLocaleString("fa-IR").split(",")[0],
                        boughtGold: '0', soldGold: (parseFloat(((goldWeight).toFixed(3))).toString())
                    })
                    let a = await this.estimate.save(estimate32)
                    console.log('sold Estimate>>>' , a)
                }
            }
            if (type == 1) {
                let month = new Date().toLocaleString('fa-IR').split(",")[0].split("/")[1]
                let monthEstimate = await this.estimate.exists({where : {
                    month : month
                }})
                console.log('month for creation' , monthEstimate)
                
                if (monthEstimate){
                console.log('month for creation 1')

                    let monthT = await this.estimate.findOne({where : {
                        month : month
                    }})
                    monthT.boughtGold = ((+monthT.boughtGold) + +goldWeight).toFixed(3)
                    await this.estimate.save(monthT)
                }else{
                console.log('month for creation2')

                    let newMonth =  this.estimate.create({month : month , boughtGold : ((goldWeight).toFixed(3)).toString() , soldGold : '0'})
                    await this.estimate.save(newMonth)
                }
                
                let estimate2 = await this.estimate.exists({
                    where: {
                        date: new Date().toLocaleString("fa-IR").split(",")[0]
                    }
                })
                let totalEstimate = await this.estimate.findOne({
                    where: {
                        date: 'localDate'
                    }
                })
                totalEstimate.boughtGold = (parseFloat(((+totalEstimate.boughtGold) + +goldWeight).toFixed(3))).toString()
                await this.estimate.save(totalEstimate)
                if (estimate2) {
                    let exEstimate = await this.estimate.findOne({
                        where: {
                            date: new Date().toLocaleString("fa-IR").split(",")[0]
                        }
                    })
                    exEstimate.boughtGold = (parseFloat(((+exEstimate.boughtGold) + +goldWeight).toFixed(3))).toString()
                    await this.estimate.save(exEstimate)
                } else {
                    let estimate2 = this.estimate.create({
                        date: new Date().toLocaleString("fa-IR").split(",")[0],
                        boughtGold: (parseFloat((goldWeight).toFixed(3))).toString(),
                        soldGold: '0'
                    })
                    let sold = await this.estimate.save(estimate2)
                    console.log('soldddddddd?>>>' , sold)
                }
            }
            return true
        } catch (error) {
            monitor.error.push(`${error}`)
            console.log('error>>>>' , error)
            return false
        }
    }


}