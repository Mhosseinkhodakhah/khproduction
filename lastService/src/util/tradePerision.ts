


class tradePermision {
    private permision = 1;

    async getter(){
        return this.permision;
    }

    async setter(){
        if (this.permision ==1){
            this.permision = 0 ;
        }else if (this.permision == 0){
            this.permision = 1 ;
        }
        return true;
    }

  
}



let instance = new tradePermision()


export default instance;