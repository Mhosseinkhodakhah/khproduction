import { AppDataSource } from "./src/data-source";
import { TradeType } from "./src/entity/enums/TradeType";
import { Invoice } from "./src/entity/Invoice";
import { oldUserQeue } from "./src/entity/oldUserQeue.entity";
import { transActionQeue, transPortQueue } from "./src/entity/transActionQueue.entity";
import { transportInvoice } from "./src/entity/transport";
import { User } from "./src/entity/User";
import { Wallet } from "./src/entity/Wallet";
import { WalletTransaction } from "./src/entity/WalletTransaction";
import logger from "./src/services/interservice/logg.service";
import { SmsService } from "./src/services/sms-service/message-service";

import * as cron from 'node-cron'


class checkTransActions {
    private qeueu = AppDataSource.getRepository(transActionQeue)
    private transportQeueu = AppDataSource.getRepository(transPortQueue)
    private invoice = AppDataSource.getRepository(Invoice)
    private wallet = AppDataSource.getRepository(Wallet)
    private user = AppDataSource.getRepository(User)
    private walletTR = AppDataSource.getRepository(WalletTransaction)
    private smsService = new SmsService()
    private transPort = AppDataSource.getRepository(transportInvoice)
    transActionQeueInProcess = false
    checkInitQeueInProcess = false
    async start() {
        this.transActionQeueInProcess = true
        try {
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
        } catch (error) {
            console.log('error in checking transAction qeueu >>>> ', error)
        } finally {
            this.transActionQeueInProcess = false;
        }
    }

    async checkInits() {
        this.checkInitQeueInProcess = true
        try {
            let date = new Date().toLocaleString('fa-IR').split(',')[1].split(':')
            console.log('time>>', date)
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
        } catch (error) {
            console.log('error in checking initss >>>> ', error)
        } finally {
            this.checkInitQeueInProcess = false;
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
            this.smsService.sendGeneralMessage(transport.reciever.phoneNumber, "approveReciever", transport.reciever.firstName, transport.goldWeight, transport.sender.nationalCode)
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
class transforGoldWeight {
    private oldQeue = AppDataSource.getRepository(oldUserQeue)
    private user = AppDataSource.getRepository(User)
    private interService = new logger()
    transForInProcess = false;
    async start() {
        this.transForInProcess = true                // make inprocess true 
        try {
            let all = await this.user.find({ where: { oldUserCheck: false }, relations: ['wallet'] })        // get all user that the oldUsers checker is false
            if (all.length) {                                                   // if the qeueu was not empty
                let queryRunner = AppDataSource.createQueryRunner()          // start the transAction
                await queryRunner.connect()                                             // connecting the transaction
                await queryRunner.startTransaction()                            // strat the transAction
                let mainQeue = all[0]                                       // select the first in to qeueu
                try {
                    let user = await this.interService.checkingOldQeue(mainQeue.phoneNumber, mainQeue.nationalCode)   // check the oldUser database for checking the existance of user
                    if (user == 400) {                                                    // if (response of the oldDB checeker was 400) means that the user was not exist on oldUser databse
                        console.log('user not exists in oldUser' , mainQeue.firstName , mainQeue.lastName)
                        mainQeue.oldUserCheck = true                                 // make the user checked in database
                        await queryRunner.manager.save(mainQeue)                        // save it
                        await queryRunner.commitTransaction()                        // commit transAction and done
                    }
                    else if (user == 500) {                                 // if (response of the oldDB checkere was 500) it means the interservice connection failed
                        console.log('internal service failed to connect with 500', mainQeue.firstName , mainQeue.lastName)
                        return 'internal services error'
                    }
                    else if (user == 'unknown') {                          // if (resposne was 'unknown') it means the internal error occured and connection is not done
                        console.log('internal connection has error in tr sideCar', mainQeue.firstName , mainQeue.lastName)
                        return 'internal services error occured >>>'
                    } else if (user.user) {                                  // if (user was exists)
                        console.log('user found in oldUser >>>', mainQeue.firstName , mainQeue.lastName)
                        mainQeue.wallet.goldWeight = +((+mainQeue.wallet.goldWeight) + (+user.Wallet.goldWeight)).toFixed(3)      // update the current goldWeight wallet of user
                        mainQeue.oldUserCheck = true                                                                    // make user oldUserChed true
                        await queryRunner.manager.save(mainQeue.wallet.goldWeight)                                       // save the current user wallet
                        let removeOld = await this.interService.removeOldUser(mainQeue.phoneNumber, mainQeue.nationalCode)          // request to oldDB for remove the current user from oldUser for next time
                        if (removeOld == 500) {                                          // if response of remove user was 500 it means the interservice connection failed so the wallet should not be done
                            return 'internal service error'
                        }
                        if (removeOld == 400) {         // if response was 400 it means the current user not found in old user db so the wallet should not be update
                            return 'user not found for removing >>> '
                        }
                        if (removeOld == 'unknown') {              // if response was uknown it means the internal service error occured and the connection is intrupt
                            return 'internal service error occured in sideCar'
                        }
                        if (removeOld == 200) {                     // if response was 200 it means the olduserdata removed successfully and the wallet should update
                            await queryRunner.commitTransaction()           // commit the transaction
                            console.log(`wallet updated for user ${mainQeue.firstName}`)
                            return 'task done'
                        }
                    } else {                                  // if response of check oldUser db was unknown
                        console.log('something  went wrong >>> ', user)
                        return 'unknown answer'
                    }
                } catch (error) {              // if some error occured in process
                    console.log(`error in handling qeue for user ${mainQeue.firstName}`, error)
                    await queryRunner.rollbackTransaction()      // rolle back the change
                } finally {                 // after all
                    console.log('transaction released>>>>')
                    await queryRunner.release()             // release the tranasAction
                }
            } else {          // if the qeueu was empty that means we dont have new registered user
                console.log('old wallet qeueu is empty')
            }
        } catch (error) {             // if some error occured in first layer
            console.log('error in transfor checking >>>>', error)
        } finally {
            console.log('inprocess false done')
            this.transForInProcess = false                // and at the end make in process false for next task
        }
    }
}


let checker = new checkTransActions()
let qeueuHandler = new transforGoldWeight()

export function transActionDoer() {
    cron.schedule('*/15 * * * * *', async () => {
        if (!checker.transActionQeueInProcess) {
            console.log('1-transActionQeue is false');
            await checker.start()
        } else {
            console.log('1-transActionQeue is true');
        }
    });
}


export function initChecker() {
    console.log('satrt the init checker')
    // cron.schedule('*/15 * * * * *', async () => {
    //     if (!checker.checkInitQeueInProcess) {
    //         console.log('2-check init is false >> ');
    //         // await checker.checkInits()
    //     } else {
    //         console.log('2-check init is true >> ');
    //     }
    // });
}


export function transferGoldWeightInterval() {
    try {
        cron.schedule('*/15 * * * * *', async () => {
            if (!qeueuHandler.transForInProcess) {
                console.log('3-transFor qeueu checker is false');
                // checker.checkInits()
                await qeueuHandler.start()
            } else {
                console.log('3-transFor qeueu checker is true');
            }
        });
    } catch (error) {
        console.log('error occured in fucking goldWeight estimator', error)
    }
}
