// const {parentPort ,workerData , isMainThread , threadId} =require('worker_threads')


function start3(){
    
    setInterval(()=>{
        parentPort?.postMessage(
            `worker3 runed , ${isMainThread} , ${threadId}`
        );
    } , 1000)
}



start3()