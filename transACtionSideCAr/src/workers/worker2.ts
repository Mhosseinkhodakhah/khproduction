

// const {parentPort ,workerData , isMainThread , threadId} =require('worker_threads')


function start2(){
    
    setInterval(()=>{
        parentPort?.postMessage(
            `worker2 runed , ${isMainThread} , ${threadId}`
        );
    } , 1000)
}



start2()