
import fetch from 'node-fetch';


export default class interConnections{

    async getWalletData(id : number){
        try {
            let rawResponse = await fetch(`http://localhost:3003/interService/wallet/${id}`)
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


}