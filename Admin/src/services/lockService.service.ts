import { redisCache } from "./redis.service";


export class lockService {

    private redisService = new redisCache()


    async check(id) {
        let a = await this.redisService.getter(`lock-${id}`)
        if (!a) {
            await this.redisService.setter(`lock-${id}` , 1)
            console.log(`admin ${id} locked`)
            return false;
        }
        if (+a == 1) {
            return true
        } else {
            await this.redisService.setter(`lock-${id}` , 1)
            console.log(`admin ${id} locked`)
            return false
        }
    }
    
    async disablor(id){
        await this.redisService.setter(`lock-${id}`, 0)
        console.log(`admin ${id} unLocked`)
        return true
    } 
}