



export default class interConnection {

    async getStatus(serviceName : string){
        let response : any = null;
        switch (serviceName) {
            case 'user':
                let rawRespons = await fetch('http://localhost:3000/monitor/all' , {method : 'GET'})
                response = await rawRespons.json()
                console.log('response from user status . . .')
            break;
            default:
                response = 'service not exist'
            break;
        }
        return response
    }
    
}