import { AppDataSource } from "./src/data-source";
import { TradeType } from "./src/entity/enums/TradeType";
import { Invoice } from "./src/entity/Invoice";
import { oldUserQeue } from "./src/entity/oldUserQeue.entity";
import { transActionQeue, transPortQueue } from "./src/entity/transActionQueue.entity";
import { transportInvoice } from "./src/entity/transport";
import { User } from "./src/entity/User";
import { Wallet } from "./src/entity/Wallet";
import { WalletTransaction } from "./src/entity/WalletTransaction";
import { SmsService } from "./src/services/sms-service/message-service";






class checkTransActions {
    private qeueu = AppDataSource.getRepository(transActionQeue)
    private transportQeueu = AppDataSource.getRepository(transPortQueue)
    private invoice = AppDataSource.getRepository(Invoice)
    private wallet = AppDataSource.getRepository(Wallet)
    private user = AppDataSource.getRepository(User)
    private walletTR = AppDataSource.getRepository(WalletTransaction)
    private smsService = new SmsService()
    private transPort = AppDataSource.getRepository(transportInvoice)

    async start() {

        let allQeueu = await this.qeueu.find({ where: { state: 0 } })
        let allTransPortQueue = await this.transportQeueu.find({ where: { state: 0 } })
        // if (allQeueu.length > 0){
        //     let res = await this.updateTheTransAction(allQeueu[0].transActionId, allQeueu[0].id)
        // }
        if (allTransPortQueue.length > 0) {
            console.log('the qeueu is full')
            let res2 = await this.updateTheWalletForTransport(allTransPortQueue[0].transPortId, allTransPortQueue[0])
        } else {
            console.log('the transport qeueu is empty >>>> ')
        }
    }

    async checkInits() {

        let date = new Date().toLocaleString('fa-IR').split(',')[1].split(':')
        if ((date[0] == '23' && date[1] == '59') || (date[0] == '۲۳' && date[1] == '۵۹')) {
            console.log('its a time for removing the inits transActions')
            let today = `${new Date().toISOString().split('T')[0]}T00:00:00.645Z`
            console.log("today", today);
            let transactionsToday = await this.invoice.createQueryBuilder('invoice')
                .where('invoice.tradeType = :bool AND status = :status AND invoice.createdAt < :today', { bool: TradeType.ONLINE, status: 'init', today: today })
                .getMany()
            await this.invoice.remove(transactionsToday)
            console.log('len of inits', 'transAction inits removed')

        } else {
            console.log('its not a time for removing the inits transActions')
        }
    }

    async updateTheTransAction(invoiceId: number, queueId: number) {
        let invoice = await this.invoice.findOne({ where: { id: invoiceId } })
        console.log('invoice founded successfully >>>>', invoice)
        let queue2 = await this.qeueu.findOne({ where: { id: queueId } })
        queue2.state = 1;
        await this.qeueu.save(queue2)
        console.log('queue task done successfully >>>> ')
    }
    async updateTheWalletForTransport(transPortId: number, queue) {
        let queryRunner = AppDataSource.createQueryRunner()
        await queryRunner.connect()
        await queryRunner.startTransaction()
        let transport = await this.transPort.findOne({ where: { id: transPortId }, relations: ['sender', 'reciever', 'sender.wallet', 'reciever.wallet'] })
        try {
            let transferAmount = +transport.goldWeight
            transport.reciever.wallet.goldWeight = (+transport.reciever.wallet.goldWeight) + (+transferAmount);
            transport.sender.wallet.goldBlock = (+transport.sender.wallet.goldBlock) - (+transferAmount);
            transport.status = 'completed';
            queue.state = 1;
            let transportQueue = await this.transportQeueu.save(queue)
            await queryRunner.manager.save(transport)
            await queryRunner.manager.save(transport.reciever.wallet)
            await queryRunner.manager.save(transport.sender.wallet)
            await queryRunner.manager.save(queue)
            await queryRunner.commitTransaction()
            this.smsService.sendGeneralMessage(transport.sender.phoneNumber, "approveTranport", transport.sender.firstName, transport.goldWeight, transport.reciever.nationalCode)
            this.smsService.sendGeneralMessage(transport.reciever.phoneNumber, "approveReciever", transport.reciever.firstName, transport.goldWeight, transport.sender.firstName)
            console.log('its don the fucking transport for >>> ', transport)
            console.log('its don the fucking transport for walletssssss >>> ', transport.sender.wallet)
            console.log('its don the fucking transport for >>> ', transport.reciever.wallet)
        } catch (error) {
            console.log('error occured in fucking finishing transfer >>>>', transport)
            await queryRunner.rollbackTransaction()
        } finally {
            await queryRunner.release()
        }
    }
}



/**
 * this class is for old user goldweight transfor 
 */
class transforGoldWeight{
    private oldQeue = AppDataSource.getRepository(oldUserQeue)
    private user = AppDataSource.getRepository(User)
    
    async start(){
        let queryRunner = AppDataSource.createQueryRunner()
        await queryRunner.connect()
        await queryRunner.startTransaction()
        let all = await this.oldQeue.find()
        if (all.length){
            let mainQeue = all[0]
            try {
                let user = await this.user.findOne({where : {nationalCode : mainQeue.user} , relations : ['wallet']})
                user.wallet.goldWeight = +((+user.wallet.goldWeight) + (+mainQeue.oldGoldWeigth)).toFixed(3)
                await queryRunner.manager.save(user.wallet.goldWeight)
                await queryRunner.commitTransaction()
                console.log(`wallet updated for user ${mainQeue.user}`)
            } catch (error) {
                console.log(`error in handling qeue for user ${mainQeue.user}` , error)
                await queryRunner.rollbackTransaction()
            }finally{
                console.log('transaction released>>>>')
                await queryRunner.release()
            }
        }else{
            console.log('old wallet qeueu is empty')
        }
    }
}


let checker = new checkTransActions()
export function transActionDoer() {
    setInterval(() => {
        checker.start()
    }, 1000 * 15)
}


export function initChecker() {
    setInterval(() => {
        checker.checkInits()
    }, 1000 * 60)
}


export function transferGoldWeightInterval(){
    try {
        console.log('its here for transfor goldWeight')
        let qeueuHandler = new transforGoldWeight()
        setInterval(()=>{
            qeueuHandler.start()
        } , 1000*60)
    } catch (error) {
        console.log('error occured in fucking goldWeight estimator' , error)
    }
}
