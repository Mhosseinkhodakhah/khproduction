import axios from "axios"

// import fetch from 'fetch'


export  class RemmitanceService{
   async getSellRmmitanceForUser(phoneNumber : string , status :string  ){
    let reponse = await axios.get(`http://localhost:5007/invoice/sell/${phoneNumber}/${status}`)
    return reponse.data.data
   }

   async getBuyRmmitanceForUser(phoneNumber : string , status : string){
    let reponse = await axios.get(`http://localhost:5007/invoice/buy/${phoneNumber}/${status}`)
    return reponse.data.data
   }

}