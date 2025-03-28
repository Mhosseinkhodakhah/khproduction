import axios from "axios"

export class LastService {
     async sendUserDataToMainService(userInfo : any){
        try{
            const response = await axios.patch("http://localhost:3000/interservice/create" , {user:userInfo} )
            console.log("response from lastService create user",response.data);
            return response
        }catch(err){
            return err
        }
          
     }

     async checkExistUserInLastService(phone:string){
        try{
            const response = await axios.get(`http://localhost:3001/interservice/userExistance/${phone}`)
            console.log("response from lastService get user",response.data.data);
            return response.data.data
        }catch(err){
            return err
        }
     }

     

}