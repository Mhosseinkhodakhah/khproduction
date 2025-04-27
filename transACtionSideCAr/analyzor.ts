import { AppDataSource } from "./src/data-source";
import { Invoice } from "./src/entity/Invoice";
import { transActionQeue } from "./src/entity/transActionQueue.entity";






class checkTransActions{
    private qeueu = AppDataSource.getRepository(transActionQeue)
    private invoice = AppDataSource.getRepository(Invoice)


    async start(){
        let allQeueu = await this.qeueu.find({where : {state : 0} , order : {'createdAt' : 'DESC'}})
        for(let i = 0 ; i < allQeueu.length ; i ++){
            let res = await this.updateTheTransAction(allQeueu[i].transActionId ,allQeueu[i].id)
        }
    }
    
    async updateTheTransAction(invoiceId : number , queueId : number){
        let invoice = await this.invoice.findOne({where : {id : invoiceId}})
        console.log('invoice founded successfully >>>>' , invoice)
        let queue2 = await this.qeueu.findOne({where : {id : queueId}})
        queue2.state = 1;
        await this.qeueu.save(queue2)
        console.log('queue task done successfully >>>> ')
    }
}



let checker = new checkTransActions()

export function transActionDoer() {   
    setInterval(async()=>{
        await checker.start()
    } , 1000*60)
}