
import * as jwt from "jsonwebtoken";

export  function authenticateUser (req, res, next) {
{
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY_USER);    
    req.user_id = decodedToken.userId;
    next();

  } catch {
    res.status(401).json({
      error: "Unauthorized request"
    });
  }

}
}

export  function authenticateAdmin (req, res, next) {
  {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY_ADMIN);    
      req.admin_id = decodedToken.adminId;
      next();
  
    } catch {
      res.status(401).json({
        error: "Unauthorized request"
      });
    }
  
  }
}

