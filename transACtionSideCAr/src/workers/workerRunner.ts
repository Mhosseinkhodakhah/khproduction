
import path from "path"
import { Worker , isMainThread , threadId } from "worker_threads"




export class runTheWorkers{
    private worker1 = new Worker('./worker1.js',  {})
    
    private worker2 = new Worker('./worker1.js', {})
    
    private worker3 = new Worker('./worker1.js' , {})
    
    async start(){
        console.log('directory is >>>>>>>>' , __dirname)
        this.worker1.on('message', async(result) => {
            console.log('worker1 message is >>> ' , result)
        })

        this.worker1.postMessage('first task')
        this.worker2.postMessage('second task')
        this.worker3.postMessage('thirdTask task')
        
        
        this.worker2.on('message', async (result) => {
            console.log('worker2 message is >>> ' , result)
        })

        this.worker3.on('message' , async(result)=>{
            console.log('worker3 message is >>> ' , result)
        })
    }

}