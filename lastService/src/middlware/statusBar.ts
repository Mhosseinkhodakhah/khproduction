import cacher from "../services/cacher"



export default async (req: any, res: any, next: any)=>{
    try {
        let counts = await cacher.getter('requestCounter')
        await cacher.setter('requestCounter' , counts++)
        console.log('request in statusBar' , counts)
    } catch (error) {
        console.log('first count . . .')
        await cacher.setter('requestCounter' , 1)
    }finally{
        next()
    }
}
