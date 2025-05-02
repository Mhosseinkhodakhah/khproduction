
import { Worker , isMainThread , threadId } from "worker_threads"



export class runTheWorkers{
    private worker1 = new Worker('./src/workers/worker1.ts', {})
    
    private worker2 = new Worker('./src/workers/worker1.ts', {})

    private worker3 = new Worker('./src/workers/worker1.ts' , {})

    async start(){
        this.worker1.on('message', async(result) => {
            console.log('worker1 message is >>> ' , result)
        })

        this.worker1.postMessage('sending data to worker')
        
        this.worker2.on('message', async (result) => {
            console.log('worker2 message is >>> ' , result)
        })

        this.worker3.on('message' , async(result)=>{
            console.log('worker3 message is >>> ' , result)
        })
    }

}