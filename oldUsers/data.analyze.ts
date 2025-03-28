
import fs from "fs"
import { AppDataSource } from "./src/data-source"
import { User } from "./src/entity/User"
import { oldInvoice } from "./src/entity/oldInvoice"
import { WalletTransaction } from "./src/entity/WalletTransaction"
import { Wallet } from "./src/entity/wallet"

export default class analyzor {

    private userRepository = AppDataSource.getRepository(User)
    private invoiceRepository = AppDataSource.getRepository(oldInvoice)
    private transActionRepository = AppDataSource.getRepository(WalletTransaction)
    private walletRepository = AppDataSource.getRepository(Wallet)


    private async readData() {
        const data = fs.readFileSync('data.json', 'utf-8')
        let data2 = JSON.parse(data)
        console.log(typeof (data2))
        return data2
    }


    async startProcess() {
        let data = await this.readData()
        // console.log(data)
        // data.completeUser.forEach(element => {
        //     console.log(element)  
        // })
        console.log(Object.keys(data))

        let finalData: {}[] = []
        // {code:23730,firstName:"کیمیا",lastName:"جوادنژاد","fullname":"کیمیا جوادنژاد","phone":"09365040299","goldWallet":"400/160","nationalcode":"2581054492"}


        for (let i = 0; i < data.completeUser.length; i++) {
            let data2 = data.completeUser[i]
            // console.log(data2)
            let gold = data2.goldWallet.split('/')
            let goldForWallet = `${gold[0]}.${gold[1]}`

            let wallet = this.walletRepository.create({ goldWeight: (+goldForWallet)?+goldForWallet:0,balance:0})
            console.log('wallet>>>>>' , wallet)
            console.log(goldForWallet)
            let newData = {
                Code: data2.code,
                firstName: data2.firstName,
                lastName: data2.lastName,
                fullName: data2.fullname,
                phoneNumber: data2.phone,
                nationalCode: data2.nationalcode,
                verificationType: 0,
                verificationStatus : 2,
                wallet
            }
            console.log(newData)
            finalData.push(newData)
        }

        for (let i = 0 ;i<data.withOutNationalCode.length ; i++){
            let data2 = data.withOutNationalCode[i]
            // console.log(data2)
            let gold = data2.goldWallet.split('/')
            let goldForWallet = `${gold[0]}.${gold[1]}`
            let wallet = this.walletRepository.create({ goldWeight: (+goldForWallet)?+goldForWallet:0,balance:0})

            console.log('wallet>>>>>' , wallet)

            console.log(goldForWallet)
            let newData = {
                Code : data2.code,
                firstName : data2.firstName,
                lastName : data2.lastName,
                fullName : data2.fullname,
                phoneNumber : data2.phone,
                nationalCode : '',
                verificationStatus : 2,
                verificationType : 1,
                wallet
            }
            finalData.push(newData)
        }


        for (let i = 0 ;i<data.withOutPhone.length ; i++){
            let data2 = data.withOutPhone[i]
            // console.log(data2)
            let gold = data2.goldWallet.split('/')
            let goldForWallet = `${gold[0]}.${gold[1]}`
            let wallet = this.walletRepository.create({ goldWeight: (+goldForWallet)?+goldForWallet:0,balance:0})

            console.log('wallet>>>>>' , wallet)


            let newData = {
                Code : data2.code,
                firstName : data2.firstName,
                lastName : data2.lastName,
                fullName : data2.fullname,
                phoneNumber : data2.phone,
                nationalCode : '',
                verificationStatus : 2,
                verificationType : 2,
                wallet
            }
            finalData.push(newData)
        }
    

        for (let i = 0 ;i<data.notValidData.length ; i++){
            let data2 = data.notValidData[i]
            // console.log(data2)
            let gold = data2.goldWallet.split('/')
            let goldForWallet = `${gold[0]}.${gold[1]}`
            let wallet = this.walletRepository.create({ goldWeight: (+goldForWallet)?+goldForWallet:0,balance:0})
            console.log('wallet>>>>>' , wallet)

            console.log(goldForWallet)
            let newData = {
                Code : data2.code,
                firstName : data2.firstName,
                lastName : data2.lastName,
                fullName : data2.fullname,
                phoneNumber : data2.phone,
                nationalCode : '',
                verificationStatus : 2,
                verificationType : 3,
                wallet
            }
            finalData.push(newData)
        }

        let users = this.userRepository.create(finalData)
        await this.userRepository.save(users)

        // let newUserData = []
        // let walletData = []
        return 'test';
    }
}