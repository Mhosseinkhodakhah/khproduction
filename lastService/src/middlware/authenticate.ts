
import * as jwt from "jsonwebtoken";
import monitor from "../util/statusMonitor";
import blackList from "../util/blackList";

export  function authenticate (req, res, next) {
{
  try {
    const token = req.headers.authorization.split(' ')[1];
    if ( blackList.checker(token)){
      console.log('check the blacklist>>>>>' , blackList.checker(token))
      monitor.error.push(`تلاش برای ورود با توکن غیر مجاز`)
      res.status(401).json({
        error: "token is in the blackList"
      });
    }
    const decodedToken = jwt.verify(token, '0258f34c736db4a7603d2e6d8b45ef3ef742af9256f8b821f9a51b3c54b11a72');    
    req.user_id = decodedToken.userId;
    next();
  } catch {
    monitor.error.push(`invalid user token`)
    res.status(401).json({
      error: "Unauthorized request"
    });
  }

}
}