import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';



declare global {
    namespace Express {
        interface Request {
            user?: {
                userId: number;
                phone: string;
                role: any;
                isBlocked : boolean
            };
        }
    }
}

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.header('Authorization');
    if (!authHeader  || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No token provided' });
    }
    const token = authHeader.replace('Bearer ', '');
    try {
        const secretKey = process.env.JWT_SECRET_KEY || '69b9381954141365ff7be95516f16c252edcb37eb39c7a42eaaf6184d93bccb2'; 
        const decoded = jwt.verify(token, secretKey) as JwtPayload;
        req.user = { userId: decoded.id, phone: decoded.phone, role: decoded.role, isBlocked: decoded.isBlocked };
        console.log('rest for req.user', req.user)
        if (decoded.isBlocked) {
            return res.status(401).json({ message: 'شما اجازه دستسرسی به پنل را ندارید' });
        } else {
            next();
        }
    } catch (error) {
        console.error(error);
        return res.status(401).json({ message: 'Invalid token' }); 
    }
};