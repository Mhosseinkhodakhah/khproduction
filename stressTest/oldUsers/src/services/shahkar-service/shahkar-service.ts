import axios from "axios"
import {internalDB} from "../../selfDB/saveDATA.service"
import {trackIdInterface} from "../../interface/interfaces.interface"
import { userInfo } from "os"
import monitor from "../../responseModel/statusMonitor"


export class ShahkarService {
    


    async checkMatchOfPhoneAndNationalCode(body) {
        let { phoneNumber, nationalCode } = body
        let checkMatchationUrl = process.env.SHAHKAR_BASE_URL + '/istelamshahkar'
        let isMatch = false
        let token = await this.getToken()
        if (token == null || token == undefined) {
            console.log('token is not defined....')
            return 'noToken'
        }
        try {
            let res = await axios.post(checkMatchationUrl, {
                mobileNumber: phoneNumber
                , nationalCode
            }, { headers: { 'Authorization': token } })

            isMatch = res.data.isMatched ? true : false

            if (isMatch) {
                let trackIdData: trackIdInterface = {
                    trackId: res.headers['track-code'],
                    // firstName : firstName,
                    // lastName : lastName,
                    // fatherName : fatherName,
                    phoneNumber: phoneNumber,
                    status: true
                }
                let trackIdService = new internalDB()
                let DBStatus = await trackIdService.saveData(trackIdData)
                // console.log('returned db status>>>>', DBStatus)
                return isMatch
            } else {
                let trackIdData: trackIdInterface = {
                    trackId: res.headers['track-code'],
                    // firstName : firstName,
                    // lastName : lastName,
                    // fatherName : fatherName,
                    phoneNumber: phoneNumber,
                    status: false
                }
                let trackIdService = new internalDB()
                let DBStatus = await trackIdService.saveData(trackIdData)
                // console.log('returned db status>>>>', DBStatus)
                return isMatch
            }
        } catch (error) {
            monitor.error.push(`error in check phone and national code of userssss ` + error.response.data.message)
            console.log('error>>>>>', error)
            if (error.response.headers['track-code']) {
                let trackIdData: trackIdInterface = {
                    trackId: error.response.headers['track-code'],
                    // firstName : firstName,
                    // lastName : lastName,
                    // fatherName : fatherName,
                    phoneNumber: phoneNumber,
                    status: false
                }
                let trackIdService = new internalDB()
                let DBStatus = await trackIdService.saveData(trackIdData)
                // console.log('data base saver result>>>', DBStatus)
                if (+error.response.status >= 500) {
                    return 500
                }
            }
            // console.log('error in ismatch national code', `${error}`)
            return 'unknown'
        }
    }


    //  async checkMatchOfPhoneAndNationalCode (phoneNumber: string ,nationalCode : string)  {

    //     console.log(phoneNumber , nationalCode)

    //     let checkMatchationUrl = process.env.SHAHKAR_BASE_URL + '/istelamshahkar'
    //     let isMatch = false
    //     let token = await this.getToken()
    //     if (token == null || token == undefined) {
    //         return false
    //     }
    //     console.log(token);
    //     try{
    //      const result =await  axios.post(checkMatchationUrl , {mobileNumber : phoneNumber
    //             , nationalCode} , {headers : { 'Authorization' : token }})
    //    //     , nationalCode} , {headers : { 'Authorization' : token }})
    //    // axios.post(checkMatchationUrl , {mobileNumber : phoneNumber
    //    //      , nationalCode} , {headers : { 'Authorization' : token }}).then((res)=>{
    //    //        isMatch  = res.data.isMatched ? true : false 
    //    // }).catch((err)=>{
    //    //     console.log(err);
    //    //     return  err
    //    // })
    //    let trackIdData : trackIdInterface = {
    //        trackId : result.headers['track-code'],
    //        // firstName : firstName,
    //        // lastName : lastName,
    //        // fatherName : fatherName,
    //        phoneNumber : phoneNumber,
    //        status : result.data.isMatched
    //    }
    //    let trackIdService = new internalDB()
    //    let DBStatus = await trackIdService.saveData(trackIdData)
    //    console.log('returned db status>>>>' , DBStatus)
    //    return result.data.isMatched
    //     }
       
    //     catch(err){
    //         console.log(err);
    //         return null
            
    //     }
    // }

     async identityInformationOfUser(phoneNumber : string ,birthDate : string ,nationalCode : string){
        let identityInfoUrl = process.env.IDENTITY_INFO_URL 
        let shahkarToken = await this.getToken()
        if (shahkarToken == null || shahkarToken == undefined) {
            return null
        }else{
        // let body = {birthDate : birthDate , nationalCode : nationalCode}   
        let body = { birthDate: birthDate, nationalCode: nationalCode }
        try {
           let res = await axios.post(identityInfoUrl , body , {headers : { 'Authorization' : shahkarToken }})
            let info  = res.data 
            console.log('trach code . . .',res.headers['track-code'])
            console.log('shahkar info>>>>' , res)
            if(res.status == 200){
                if (typeof(res.data) == "string" ){
                    let trackIdData: trackIdInterface = {
                        trackId: res.headers['track-code'],
                        firstName: '',
                        lastName: '',
                        fatherName: '',
                        phoneNumber: '',
                        status: false
                    }
                    let trackIdService = new internalDB()
                    let DBStatus = await trackIdService.saveData(trackIdData)
                    return 400
                }
                if (!res.data || typeof(res.data.fristName) === undefined) {
                    let trackIdData: trackIdInterface = {
                        trackId: res.headers['track-code'],
                        firstName: '',
                        lastName: '',
                        fatherName: '',
                        phoneNumber: '',
                        status: false
                    }
                    let trackIdService = new internalDB()
                    let DBStatus = await trackIdService.saveData(trackIdData)
                    console.log('returned db status>>>>', DBStatus)
                    return 500
                }
                let  {
                    firstName,
                    lastName,
                    gender,
                    liveStatus,
                    identificationNo,
                    fatherName,
                    identificationSerial,
                    identificationSeri,
                    officeName,
                  } = info
                let user = {
                    fatherName,
                    gender:(gender == 0) ? false : true
                    ,officeName,
                    birthDate,
                    identityNumber : identificationNo,
                    identitySeri : identificationSeri,
                    identitySerial: identificationSerial,
                    firstName,
                    lastName,
                    phoneNumber,
                    nationalCode,
                    liveStatus,
                    verificationStatus : 1,
                    identityTraceCode : res.headers['track-code'],
                }
                const trackObj : trackIdInterface = {
                    phoneNumber:user.phoneNumber,
                    trackId:user.identityTraceCode,
                    fatherName:user.fatherName,
                    firstName:user.fatherName,
                    lastName:user.lastName,
                    status:true
                }
                let saveData=new internalDB()
                const DBStatus=await saveData.saveData(trackObj)
                // console.log('returned db status>>>>' , DBStatus)
                return user 
            }else {
                const trackObj : trackIdInterface = {
                    phoneNumber:phoneNumber,
                    trackId:res.headers['track-code'],
                    status:false
                }
                let saveData=new internalDB()
                await saveData.saveData(trackObj)
                const DBStatus=await saveData.saveData(trackObj)
                console.log('returned db status>>>>' , DBStatus)
                return null          
            }
        } catch (error) {
            console.log(error);
            return null
        }     
        }
    }

    private async getToken(){
        let authUrl = process.env.AUTH_URL
        try {
            let res =  await axios.post(authUrl,{username: "TLS_khanetalla",password: "1M@k8|H43O9S"})
            let token = `Bearer ${res.data.access_token}`
            return token
            
        } catch (error) {
            console.log("error in getToken ShahkarController   " + error);
            return null
        }
    } 
}