import { AppDataSource } from "../data-source"
import { NextFunction, Request, Response } from "express"
import { OldUser } from "../entity/OldUser"
import  * as xlsx from "xlsx"
import {response} from "../responseModel/response"
import {validationResult} from "express-validator"


export class OldUserController {
    

    private oldUserRepository = AppDataSource.getRepository(OldUser)
   


    async all(req: Request, res: Response, next: NextFunction) {
        
    }

    async extractExel(req: Request, res: Response, next: NextFunction) {
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
        console.log();
        
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
            }
        }
        
        const finalObject={
            completeUser,
            withOutNationalCode,
            withOutPhone,
            notValidData
        }
       

        return res.status(200).json({success:true,data:finalObject})
        
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