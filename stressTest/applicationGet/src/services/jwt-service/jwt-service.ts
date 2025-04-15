
import * as jwt from "jsonwebtoken";

export class JwtService{

    async generateToken (user){        
        const token = await jwt.sign({ userId : user.id,phoneNumber : user.phoneNumber}, "0258f34c736db4a7603d2e6d8b45ef3ef742af9256f8b821f9a51b3c54b11a72", { expiresIn: "1H" });
        return token 
    } 

}
