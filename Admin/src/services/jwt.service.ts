import jwt from 'jsonwebtoken'
import { jwtGeneratorInterface } from '../interface/interfaces.interface'

export default class jwtGenerator{
    async tokenize(data:jwtGeneratorInterface){
        return jwt.sign(data , '69b9381954141365ff7be95516f16c252edcb37eb39c7a42eaaf6184d93bccb2' , {'expiresIn' : '1H'})
    }

}