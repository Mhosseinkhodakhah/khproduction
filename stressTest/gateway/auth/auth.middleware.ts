import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: number;
                firstName: string;
                lastName: string;
                isBlocked: boolean,
                phone: string,
                role: number
            };
        }
    }
}


export const adminMiddleware = async (req: any, res: any, next: any) => {
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No token provided' });
    }
    const token = authHeader.replace('Bearer ', '');
    try {
        const secretKey = process.env.ADMIN_JWT || '69b9381954141365ff7be95516f16c252edcb37eb39c7a42eaaf6184d93bccb2';
        const decoded : any = jwt.verify(token, secretKey) as JwtPayload;
        req.header['user'] = decoded
        console.log('its done' , req.header.user)
        if (decoded.isBlocked) {
            console.log('admin is blocked . . .')
            return res.status(403).json({
                success : false , 
                scope : 'admin service',
                data : null,
                error : 'admin is blocked'
            })
        }
        next();
    } catch (error) {
        console.error(error);
        return res.status(401).json({
            success : false , 
            scope : 'admin service',
            data : null,
            error : 'invalid token'
        })
    }
};