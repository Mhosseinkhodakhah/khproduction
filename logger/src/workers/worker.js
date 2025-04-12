const { parentPort, workerData } = require('worker_threads');
// require('ts-node').register();
const path = require('path');

// require(path.resolve(__dirname, './worker.ts'));
console.log('worker started . . .')

class interConnection {

    async getStatus(serviceName) {
        let response = null;
        switch (serviceName) {
            case 'gateway':
                try {
                    let rawRespons = await fetch('http://localhost:8010/monitor/all', { method: 'GET' })
                    response = await rawRespons.json()
                    console.log('response from gateway status . . .', response)
                } catch (error) {
                    console.log(error)
                }
                break;
            case 'product':
                try {
                    let rawRespons = await fetch('http://localhost:5000/monitor/all', { method: 'GET' })
                    response = await rawRespons.json()
                    console.log('response from product status . . .', response)
                } catch (error) {
                    console.log(error)
                }
                break;
            case 'user':
                try {
                    let rawRespons = await fetch('http://localhost:3000/monitor/all', { method: 'GET' })
                    response = await rawRespons.json()
                    console.log('response from user status . . .', response)
                } catch (error) {
                    console.log(error)
                }
                break;
            case 'adminNode':
                try {
                    let rawRespons = await fetch('http://localhost:3002/monitor/all', { method: 'GET' })
                    response = await rawRespons.json()
                    console.log('response from user status . . .', response)
                } catch (error) {
                    console.log(error)
                }
                break;
            case 'queryService':
                try {
                    let rawRespons = await fetch('http://localhost:3003/monitor/all', { method: 'GET' })
                    response = await rawRespons.json()
                    console.log('response from user status . . .', response)
                } catch (error) {
                    console.log(error)
                }
                break;
            case 'admin':
                try {
                    let rawRespons = await fetch('http://localhost:5005/monitor/all', { method: 'GET' })
                    response = await rawRespons.json()
                    console.log('response from admin status . . .', response)
                } catch (error) {
                    console.log(error)
                }
                break;
            case 'oldUser':
                try {
                    let rawRespons = await fetch('http://localhost:5004/monitor/all', { method: 'GET' })
                    response = await rawRespons.json()
                    console.log('response from olduser status . . .', response)
                } catch (error) {
                    console.log(error)
                }
                break;
            case 'installment':
                try {
                    let rawRespons = await fetch('http://localhost:5008/monitor/all', { method: 'GET' })
                    response = await rawRespons.json()
                    console.log('response from installment status . . .', response)
                } catch (error) {
                    console.log(error)
                }
                break;
            case 'product':
                try {
                    let rawRespons = await fetch('http://localhost:5000/monitor/all', { method: 'GET' })
                    response = await rawRespons.json()
                    console.log('response from product status . . .', response)
                } catch (error) {
                    console.log(error)
                }
                break;
            case 'userSideCar':
                try {
                    let rawRespons = await fetch('http://localhost:3001/monitor/all', { method: 'GET' })
                    response = await rawRespons.json()
                    console.log('response from installment status . . .', response)
                } catch (error) {
                    console.log(error)
                }
                break;
                case 'remmitance':
                try {
                    let rawRespons = await fetch('http://localhost:5007/monitor/all', { method: 'GET' })
                    response = await rawRespons.json()
                    console.log('response from remmitance status . . .', response)
                } catch (error) {
                    console.log(error)
                }
                break;
            case 'product':
                try {
                    let rawRespons = await fetch('http://localhost:5000/monitor/all', { method: 'GET' })
                    response = await rawRespons.json()
                    console.log('response from product status . . .', response)
                } catch (error) {
                    console.log(error)
                }
                break;

            default:
                console.log('the service is not exist')
                break;
        }
        return response
    }

}


let interConnectionService = new interConnection()


setInterval(async () => {
    let gatewayResponse = await interConnectionService.getStatus('gateway')
    let adminNodeResponse = await interConnectionService.getStatus('adminNode')
    let queryServiceResponse = await interConnectionService.getStatus('queryService')
    let userResponse = await interConnectionService.getStatus('user')
    let adminResponse = await interConnectionService.getStatus('admin')
    let oldUserResponse = await interConnectionService.getStatus('oldUser')
    let installmentResponse = await interConnectionService.getStatus('installment')
    let productResponse = await interConnectionService.getStatus('product')
    let userSideCarResponse = await interConnectionService.getStatus('userSideCar')
    let remmitanceResponse = await interConnectionService.getStatus('remmitance')
    let result = []
    if (!gatewayResponse) {
        console.log('gateway service seems like is down . . .')
        result.push({ status: 0, service: 'gateway' })
    } else {
        result.push({  status: 1,  total : gatewayResponse, service: 'gateway' })
    }
    if (!userResponse) {
        console.log('user service seems like is down . . .')
        result.push({ status: 0, service: 'user' })
    } else {
        result.push({  status: 1,  total : userResponse, service: 'user' })
    } 
    if (!adminNodeResponse) {
        console.log('adminNode service seems like is down . . .')
        result.push({ status: 0, service: 'adminNode' })
    } else {
        result.push({  status: 1,  total : adminNodeResponse, service: 'adminNode' })
    } 
    if (!queryServiceResponse) {
        console.log('query service seems like is down . . .')
        result.push({ status: 0, service: 'query' })
    } else {
        result.push({  status: 1,  total : queryServiceResponse, service: 'query' })
    }
    if (!adminResponse) {
        console.log('admin service seems like is down . . .')
        result.push({ status: 0, service: 'admin' })
    } else {
        result.push({  status: 1,  total : adminResponse, service: 'admin' })
    }
    if (!oldUserResponse) {
        console.log('oldUser service seems like is down . . .')
        result.push({ status: 0, service: 'oldUser' })
    } else {
        result.push({ status: 1,  total : oldUserResponse, service: 'oldUser' })
    }
    if (!installmentResponse) {
        console.log('installment service seems like is down . . .')
        result.push({ status: 0, service: 'installment' })
    } else {
        result.push({  status: 1,  total : installmentResponse, service: 'installment' })
    }
    if (!productResponse) {
        console.log('product service seems like is down . . .')
        result.push({ status: 0, service: 'product' })
    } else {
        result.push({  status: 1,  total :productResponse, service: 'product' })
    }
    if (!userSideCarResponse) {
        console.log('userSideCar service seems like is down . . .')
        result.push({ status: 0, service: 'userSideCar' })
    } else {
        result.push({  status: 1,  total : userSideCarResponse, service: 'userSideCar' })
    }
    if (!remmitanceResponse) {
        console.log('remmitance service seems like is down . . .')
        result.push({ status: 0, service: 'remmitance' })
    } else {
        result.push({  status: 1,  total : remmitanceResponse, service: 'remmitance' })
    }
    parentPort.postMessage(
        result
    )
}, 60 * 1000)