import axios from "axios"

// import fetch from 'fetch'


export  class oldUserService{
   
   async checkExistAndGetGoldWallet(phoneNumber : string , nationalCode :string,userInfo: any  ){
      try {
         let reponse = await axios.post(`http://localhost:5004/interservice/check/${phoneNumber}/${nationalCode}`,userInfo)
         return reponse.data.data
      } catch (error) {
         console.log(error.response)
         return 500
      }
   }
}