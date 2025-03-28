import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import {jwtGeneratorInterface} from "../interface/interfaces.interface"



declare global {
    namespace Express {
        interface Request {
            user?:jwtGeneratorInterface
        }
    }
}  


export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.header('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.replace('Bearer ', '');

    try {
        
        const secretKey = process.env.JWT_SECRET_KEY || 'your-secret-key'; 
        const decoded = jwt.verify(token, secretKey) as JwtPayload;

      
        req.user = { id: decoded.id , firstName:decoded.firstName ,lastName:decoded.lastName , isBlocked:decoded.isBlocked  };

        console.log(decoded);
        

        next(); 

    } catch (error) {
        console.error(error);
        return res.status(401).json({ message: 'Invalid token' }); 
    }
};
