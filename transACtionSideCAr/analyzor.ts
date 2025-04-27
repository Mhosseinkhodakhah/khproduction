import { AppDataSource } from "./src/data-source";
import { Invoice } from "./src/entity/Invoice";
import { transActionQeue, transPortQueue } from "./src/entity/transActionQueue.entity";
import { transportInvoice } from "./src/entity/transport";
import { User } from "./src/entity/User";
import { Wallet } from "./src/entity/Wallet";
import { WalletTransaction } from "./src/entity/WalletTransaction";






class checkTransActions{
    private qeueu = AppDataSource.getRepository(transActionQeue)
    private transportQeueu = AppDataSource.getRepository(transPortQueue)
    private invoice = AppDataSource.getRepository(Invoice)
    private wallet = AppDataSource.getRepository(Wallet)
    private user = AppDataSource.getRepository(User)
    private walletTR = AppDataSource.getRepository(WalletTransaction)
    private transPort = AppDataSource.getRepository(transportInvoice)
    
    async start(){
        let nanInvoice = await this.invoice.find()
        let blackList = []
        for (let i of nanInvoice){
            if (+i.goldWeight > 0){
                console.log('its okkkkk')
            }else{
                console.log('its not okk>>')
                blackList.push(i)
            }
        }

        // await this.invoice.remove(blackList)

        let userWallet = await this.user.findOne({where : {nationalCode : '2581199458'} , relations : ['wallet']})
        console.log('its fucking wallet >>>>> ' , userWallet)

        // let allQeueu = await this.qeueu.find({where : {state : 0}})
        // let allTransPortQueue = await this.transportQeueu.find({where : {state : 0}})
        // if (allQeueu.length){
        //     let res = await this.updateTheTransAction(allQeueu[0].transActionId, allQeueu[0].id)
        // }
        // if (allTransPortQueue.length){
        //     let res2 = await this.updateTheWalletForTransport(allTransPortQueue[0].transPortId , allTransPortQueue[0])
        // }
    }
    
    async updateTheTransAction(invoiceId : number , queueId : number){
        let invoice = await this.invoice.findOne({where : {id : invoiceId}})
        console.log('invoice founded successfully >>>>' , invoice)
        let queue2 = await this.qeueu.findOne({where : {id : queueId}})
        queue2.state = 1;
        await this.qeueu.save(queue2)
        console.log('queue task done successfully >>>> ')
    }

    async updateTheWalletForTransport(transPortId : number , queue){
        let transport = await this.transPort.findOne({where : {id : transPortId} , relations : ['']})
        
        queue.state = 1;
        let transportQueue = await this.transPort.save(queue)
    }
}



let checker = new checkTransActions()

export function transActionDoer() {   
    setInterval(async()=>{
        await checker.start()
    } , 1000*60)
}