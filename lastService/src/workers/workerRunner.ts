import { Worker } from "worker_threads"
import cacher from "../services/cacher";
import { AppDataSource } from "../data-source";
import { goldPrice } from "../entity/goldPrice";


export default class workerRunner{

    private goldPriceRepository = AppDataSource.getRepository(goldPrice)
    
    async startWorker(){
        const worker = new Worker('./src/workers/worker.js', {
            // workerData: {
            //     path: './src/worker.ts'
            // }
        });
        
        
        worker.on('message', async(result) => {
            console.log('result of workerrrr >>>><<<<<' , result);
            if (result.token){
                await cacher.setter('token' , result.token)
            }
            if (result.lastPrice){
                await cacher.setter('price' , result)
                let newData = this.goldPriceRepository.create({...result.allData , createTime : +result.createTime})
                let datainDB = await this.goldPriceRepository.save(newData)
                console.log('data in db' , datainDB)
            }else{
                console.log('nothing happended . . .' , result)
            }
        });
        
        
        worker.on("error", (msg: any) => {
            console.log(msg);
        });
        
        }

} 
