const { parentPort, workerData, isMainThread, threadId } = require ('worker_threads')


parentPort.on('message', (data) => {
    if (data == 'first task') {
        setInterval(()=>{
            console.log('first task is run >>>> ' , isMainThread , threadId)
        } , 60*1000)
    } else if (data == 'second task') {
        setInterval(()=>{
            console.log('second task is run >>>> ' , isMainThread , threadId)
        } , 60*1000)
    }
    else if (data == 'thirdTask task') {
        setInterval(()=>{
            console.log('third task is run >>>> ' , isMainThread , threadId)
        } , 60*1000)
    }else{
        console.log('its here with unprocceble tasks')
    }
});

