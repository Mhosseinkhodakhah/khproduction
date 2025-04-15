




class blackListClass{
    private list = [];

    getter(){
        return this.list
    }


    setter(newToken : string){
        this.list.push(newToken)
    }

    checker(token:string){
        if (this.list.includes(token)){
            return true
        }else{
            return false
        }
    }
}



const blackList = new blackListClass()

export default blackList;