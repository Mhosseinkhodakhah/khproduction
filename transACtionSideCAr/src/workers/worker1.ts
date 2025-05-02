const {parentPort ,workerData , isMainThread , threadId} =require('worker_threads')


function start(){
    setInterval(()=>{
        parentPort?.postMessage(
            `worker1 runed , ${isMainThread} , ${threadId}`
        );
    } , 1000)
}

parentPort.on('message', (data) => {
    console.log('data recieved from main thread >>> ' , data)
    if (data == 'first task'){
        setInterval(()=>{
            console.log('first task is runnign')
        } , 1000)
    }else if (data == 'second task'){
        setInterval(()=>{
            console.log('second task is runnign')
        } , 1000)        
    }
    else if (data == 'thirdTask task'){
        setInterval(()=>{
            console.log('third task is runnign')
        } , 1000)        
    }
    // if (data.task === 'calculate') {
    //   const result = data.number * 2; // Simple calculation
    //   // Send the result back to the main thread
    //   parentPort.postMessage({ result });
    // }
});

start()