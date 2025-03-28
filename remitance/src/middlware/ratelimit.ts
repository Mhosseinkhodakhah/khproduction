
let bulk: any = {}

export default (req: any, res: any, next: any) => {
    let Ip = req.headers['x-real-ip']
    console.log('ip requested . . .', Ip)
    if (bulk[Ip]) {
        console.log('this ip is requested befor . . .')
        if (bulk[Ip].tokens <= 0) {
            console.log('this ip is out of range . . .')
            if (new Date().getTime() - bulk[Ip].exceededTime < 50 * 1000) {
                console.log('this ip had too many requestes . . .')
                return res.status(429).json({
                    success: false,
                    scope: 'gateway ratelimit',
                    error: 'maximum try exceeded',
                    data: null
                })
            } else if (new Date().getTime() - bulk[Ip].exceededTime >= 50 * 1000) {
                console.log('this ips time passed 50 seconds . . .')
                bulk[Ip].tokens = 1;
                bulk[Ip].exceededTime = new Date().getTime()
                next()
            }
        } else {
            console.log('this ip has token yet . . .')
            if (new Date().getTime() - bulk[Ip].exceededTime <= 50 * 1000) {
                console.log('this ip has time for expend tokens . . .')
                bulk[Ip].tokens--;
                console.log(`mines bulk[Ip] ${Ip}`, bulk[Ip])
                next()
            } else {
                console.log('this ip passed its time , so reset its tokens and time . . .')
                bulk[Ip].tokens = 1;
                bulk[Ip].exceededTime = new Date().getTime()
                next()
            }
        }
    } else {
        bulk[Ip] = { tokens: 1, exceededTime: new Date().getTime() }
        next()
    }
}

