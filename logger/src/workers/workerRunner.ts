import { Worker } from "worker_threads"
import cacher from "../service/cache.service"

export default class workerRunner{

    async start(){
        const worker = new Worker('./src/workers/worker.js', {})
        worker.on('message' , async(result)=>{
            console.log('worker send a data . . .')
            await cacher.setter('status' , result)
        })
    }
}