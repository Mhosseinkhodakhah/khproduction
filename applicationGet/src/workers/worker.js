const path = require('path');
const { parentPort ,workerData } = require('worker_threads');
require('ts-node').register();
require(path.resolve(__dirname, './worker.ts'));
const axios = require('axios')



class GoldPriceService {
    #lastGoldPrice
    #lastPriceChange
    #token;
    #allData;
    
    /**
     * this function is for 
     * @returns 
     */
    async #getToken(){
        let body = {
            UserName: "MM9124",
            Password: "07115102"
        }
        let apitoken  = await axios.post('https://web.zarbaha-co.ir/api/authentication' , body )
        console.log('token set successfully')
        return {token : `Bearer ${apitoken.data.Value}`}
    }


    async setGoldPrice() {
        try {
            console.log('its here for test haaa. . . .')
            
            let newApiToken = this.#token
            let newRespons = await axios.get('https://web.zarbaha-co.ir/api/Price_V2', {
                headers: {
                    'Authorization': newApiToken
                },
            })
            console.log('response >>>>> ' , newRespons.data)
            console.log( 'testestesetes>>>>>>', newRespons.status)            
            this.#lastGoldPrice = newRespons.data.data.Geram18
            this.#allData = newRespons.data.data
            try {
                let formPrice = await cacher.getter('price')   
                this.#lastPriceChange = ((+this.#lastGoldPrice)) - formPrice.lastPrice
            } catch (error) {
                this.#lastPriceChange = 0
            }
            console.log('allData' , this.#allData)
            return {lastPrice : ((+this.#lastGoldPrice)) , lastChange : this.#lastPriceChange , allData : this.#allData}

        } catch (error) {
            console.log(`${error}`);
            let token = await this.#getToken()
            this.#token = token.token;
            console.log('returned token>>>>>>>>>>>>>>' , token.token)
           return {token : token.token}
        } finally {
            return {lastPrice : ((+this.#lastGoldPrice)) , lastChange : this.#lastPriceChange , allData : this.#allData}
        }
    }
}

let gpService = new GoldPriceService()


setInterval(async() => {
    let response = await gpService.setGoldPrice()
    // let createTime = new Date().getTime("fa-IR")
    response['createTime'] = new Date().getTime("fa-IR")
    parentPort.postMessage(
        response
    );
}, 1000 * 60 * 5)

