const {parentPort ,workerData , isMainThread , threadId} =require('worker_threads')


function start(){
    
    setInterval(()=>{
        parentPort?.postMessage(
            `worker1 runed , ${isMainThread} , ${threadId}`
        );
    } , 1000)
}


start()