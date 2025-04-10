
import fs from "fs"
import { AppDataSource } from "./src/data-source"
import { User } from "./src/entity/User"
import { oldInvoice } from "./src/entity/oldInvoice"
import { WalletTransaction } from "./src/entity/WalletTransaction"
import { Wallet } from "./src/entity/wallet"
import  * as xlsx from "xlsx"
import { buffer } from "stream/consumers"
import { fail } from "assert"

export default class analyzor {

    private userRepository = AppDataSource.getRepository(User)
    private invoiceRepository = AppDataSource.getRepository(oldInvoice)
    private transActionRepository = AppDataSource.getRepository(WalletTransaction)
    private walletRepository = AppDataSource.getRepository(Wallet)
    

    private async readData() {
        // const data = fs.readFileSync('data.json', 'utf-8')
        const data=fs.readFileSync('output.json','utf-8')
        let data2 = JSON.parse(data)
        console.log(typeof (data2))
        return data2
    }

    private async extractExel(){
        const workbook = xlsx.readFile('./olduser.xlsx');

        // Get the names of all the sheets
        const sheetNames = workbook.SheetNames;
        
        console.log(sheetNames);
        
        
        const sheet = workbook.Sheets['Page 1'];

    
    

        const data = xlsx.utils.sheet_to_json(sheet);
        
        
        const dateOfsendData=data[0]

        const letterInfo=data[1]

        const headers=data[2]
      
        
        console.log(headers);
        

        const iDontNow=data[3]


        // {
        //     "__EMPTY": "مبلغ بستانکار",
        //     "__EMPTY_3": "مبلغ بدهکار",
        //     "__EMPTY_8": "طلا بس",
        //     "__EMPTY_9": "طلا بد",
        //     "__EMPTY_14": "همراه",
        //     "__EMPTY_16": "تلفن",
        //     "__EMPTY_18": "نام طرف حساب",
        //     "__EMPTY_20": "کد",
        //     "__EMPTY_21": "ردیف"
        // },
        // {
        //     __EMPTY: 'مبلغ بستانکار',
        //     __EMPTY_3: 'مبلغ بدهکار',
        //     __EMPTY_8: 'طلا بس',
        //     __EMPTY_9: 'طلا بد',
        //     __EMPTY_14: 'همراه',
        //     __EMPTY_16: 'تلفن',
        //     __EMPTY_18: 'نام طرف حساب',
        //     __EMPTY_20: 'کد',
        //     __EMPTY_21: 'ردیف'
        //   }
        

        const completeUser=[]
        const withOutNationalCode=[]
        const withOutPhone=[]
        const notValidData=[]
        
        
        for (let index = 4; index < data.length; index++){
            const element = data[index];
            
            const fullname=this.splitAtFirstSpace(element['__EMPTY_18'])
            const nationalValidete=this.isValidNationalCode(element['__EMPTY_16'])
            const phoneValidate=this.isValidNationalCode(element['__EMPTY_14'])
            // console.log(nationalValidete);
            // console.log(phoneValidate);
            
            const newUser={
                code:(element['__EMPTY_20'])?+element['__EMPTY_20']:0,
                firstName:fullname[0],
                lastName:fullname[1],
                fullname:element['__EMPTY_18'],
                phone:element['__EMPTY_14'],
                goldWallet:element['__EMPTY_8'],
                nationalcode:(element['__EMPTY_16'])?element['__EMPTY_16']:"",
            }
            if (element['__EMPTY_18']&&element['__EMPTY_16']&&element['__EMPTY_14']) {
                completeUser.push(newUser)
            } else if(element['__EMPTY_18']&&element['__EMPTY_14']&&!element['__EMPTY_16']){    
                withOutNationalCode.push(newUser)
            } else if(element['__EMPTY_18']&&!element['__EMPTY_14']&&element['__EMPTY_16']){
                withOutPhone.push(newUser)
            } else if(element['__EMPTY_18']&&!element['__EMPTY_14']&&!element['__EMPTY_16']){
                notValidData.push(newUser) 
            }else{
                console.log(newUser)
            }
        }
        
        const finalObject={
            completeUser,
            withOutNationalCode,
            withOutPhone,
            notValidData
        }

        fs.writeFileSync('output.json', JSON.stringify(finalObject, null, 2));
        console.log(typeof(finalObject) , finalObject.withOutPhone)
        console.log("exelExtracted" , finalObject);
        return finalObject
    }

    async startProcess() {
        await this.extractExel()
        // console.log(  'it comes hereeeeeeeeeeee', Object.keys(data))
        // return 'he
        let data = await this.readData()
        // let data=await this.extractExel()
        // console.log(data)
        data.completeUser.forEach(element => {
            console.log(element)  
        })
        console.log(Object.keys(data))
        const testUser={
            code:0,
            firstName:"محمدجواد",
            lastName:"مهدی پور",
            fullname:"محمدجواد مهدی پور",
            phone:"09394255660",
            goldWallet:"2/9",
            nationalcode:"4980323707",
        }
        data.completeUser.push(testUser)
        let finalData: {}[] = []
        // {code:23730,firstName:"کیمیا",lastName:"جوادنژاد","fullname":"کیمیا جوادنژاد","phone":"09365040299","goldWallet":"400/160","nationalcode":"2581054492"}


        for (let i = 0; i < data.completeUser.length; i++) {
            let data2 = data.completeUser[i]
            // console.log(data2)
            console.log('withOutPhone>>>>>11111' , data2)
            let gold = data2.goldWallet.split('/')
            let goldForWallet = `${gold[0]}.${gold[1]}`
            
            let wallet = this.walletRepository.create({ goldWeight: (+goldForWallet)?+goldForWallet:0,balance:0})
            console.log('withOutPhone>>>>>11111' , wallet)
            // console.log(goldForWallet)
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
            console.log('withOutPhone>>>>>2222' , data2)
            // console.log(data2)
            let gold = data2.goldWallet.split('/')
            let goldForWallet = `${gold[0]}.${gold[1]}`
            let wallet = this.walletRepository.create({ goldWeight: (+goldForWallet)?+goldForWallet:0,balance:0})

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
            console.log('withOutPhone>>>>>3' , data2)
            let gold = data2.goldWallet.split('/')
            let goldForWallet = `${gold[0]}.${gold[1]}`
            let wallet = this.walletRepository.create({ goldWeight: (+goldForWallet)?+goldForWallet:0,balance:0})
            console.log('withOutPhone>>>>>' , wallet , data2)



            let newData = {
                Code : data2.code,
                firstName : data2.firstName,
                lastName : data2.lastName,
                fullName : data2.fullname,
                phoneNumber : '',
                nationalCode : data2.nationalCode,
                verificationStatus : 2,
                verificationType : 2,
                wallet
            }
            finalData.push(newData)
        }
    

        for (let i = 0 ;i<data.notValidData.length ; i++){
            let data2 = data.notValidData[i]
            // console.log(data2)
            console.log('withOutPhone>>>>>4444' , data2)
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
                phoneNumber : '',
                nationalCode : '',
                verificationStatus : 2,
                verificationType : 3,
                wallet
            }
            finalData.push(newData)
        }
        try {
            let users = this.userRepository.create(finalData)
            await this.userRepository.save(users)
        } catch (error) {
            console.log(error)
        }
        console.log('after loops')
        // let newUserData = []
        // let walletData = []
        return 'old users created :)';
    }
    private  isValidNationalCode = v => {
        if(!v){
            return false
        }
        const isValidate=(v.length==10)?true:false

        return isValidate
    }
    private  isValidPhone = v => {
        if(!v){
            return false
        }
        const isValidate=(v.length==11&&typeof v == "string")?true:false

        return isValidate
    }
    private  splitAtFirstSpace(str) {
        if(str){
            const index = str.indexOf(' ');
        if (index === -1) {
            return [str]; // No spaces found, return the original string
        }
        const firstPart = str.substring(0, index);
        const secondPart = str.substring(index + 1);
        return [firstPart, secondPart];
        }else{
            return ["",""]
        }
        
    }      
}
