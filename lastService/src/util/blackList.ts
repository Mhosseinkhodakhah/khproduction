import { redisCache } from "../services/redis.service";





class blackListClass{
    private list = new redisCache();

    getter(){
        return this.list
    }


    // setter(newToken : string){
    //     this.list.push(newToken)
    // }

    async checker(token:string){
        let blackList = await this.list.getter('blackList')
        if (blackList.includes(token)){
            return true
        }else{
            return false
        }
    }
}



const blackList = new blackListClass()

export default blackList;