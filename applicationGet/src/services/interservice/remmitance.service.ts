import axios from "axios"
import monitor from "../../util/statusMonitor"

// import fetch from 'fetch'


export  class RemmitanceService{
   async getSellRmmitanceForUser(phoneNumber : string , status :string  ){
      try {
         let reponse = await axios.get(`http://localhost:5007/invoice/sell/${phoneNumber}/${status}`)
         return reponse.data.data
      } catch (error) {
         monitor.error.push(`error in getting sell remitance invoice in remitance service :: ${error}`)
         return []
      }
   }

   async getBuyRmmitanceForUser(phoneNumber : string , status : string){
      try {
         let reponse = await axios.get(`http://localhost:5007/invoice/buy/${phoneNumber}/${status}`)
         return reponse.data.data
      } catch (error) {
         monitor.error.push(`error in getting sell remitance invoice in remitance service :: ${error}`)
         return []
      }
   }

}