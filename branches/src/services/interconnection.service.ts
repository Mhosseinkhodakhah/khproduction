
import fetch from 'node-fetch';


export default class interConnections{

    async getWalletData(id : number){
        try {
            let rawResponse = await fetch(`http://localhost:3003/interService/wallet/${id}` , {method : 'GET'})
            let response : any= await rawResponse.json()
            if (response.status == 0){
                return 400
            }
            if (response.status == 1){
                return response.data
            }
            if (response.status == 2){
                return 500
            }
            console.log(response)
           return response
        } catch (error) {
            console.log('error occured in getting data from fucking query service' , error)
            return 'unknown'
        }
    }



    async updateWallet(id : number , amount){
        try {
            let rawResponse = await fetch(`http://localhost:3000/interService/wallet/update/${id}` ,{
                method : 'POST',
                headers: {
                    "Content-Type": "application/json"
                  },   
                body : JSON.stringify({ amount: amount , state : 0 })
            })
            let response : any= await rawResponse.json()
            if (response.success == false){
                if (response.error == 'insufficient'){
                    return 'insufficent'
                }else{
                    return 500
                }
            }
            if (response.success == true){
                return response.data
            }
            console.log('response of update wallet' , response)
           return response
        } catch (error) {
            console.log('error occured in getting data from fucking query service' , error)
            return 'unknown'
        }
    }

}