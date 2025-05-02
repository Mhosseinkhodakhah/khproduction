const {parentPort ,workerData , isMainThread , threadId} =require('worker_threads')


function start(){
    
    setInterval(()=>{
        parentPort?.postMessage(
            `worker1 runed , ${isMainThread} , ${threadId}`
        );
    } , 1000)
    
    parentPort.on('message', (data) => {
        console.log('data recieved from main thread >>> ' , data)
        // if (data.task === 'calculate') {
        //   const result = data.number * 2; // Simple calculation
        //   // Send the result back to the main thread
        //   parentPort.postMessage({ result });
        // }
    });
}


start()