import blackList from "./service/blackList";
import monitor from "./service/statusMonitor";



export async function blackListMiddleWare(req : any, res : any, next : any) {


    if (req.headers.authorization){
             if (await blackList.checker(req.headers.authorization)) {
                 console.log('تلاش برای ورود با توکن غیر مجاز')
                console.log('ttttttt >>> ' , await blackList.checker(req.headers.authorization))
                console.log('check the blacklist>>>>>', blackList.checker(req.headers.authorization))
                monitor.error.push(`تلاش برای ورود با توکن غیر مجاز`)
                return res.status(401).json({
                  error: "token is in the blackList"
                });
              }else{
                console.log('token is not in blacklist')
                next()
              }
    }else{
        console.log('no token provided')
        next()
    }

}