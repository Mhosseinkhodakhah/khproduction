import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { response } from '../responseModel/response';
import { jwtGeneratorInterface } from '../interfaces/interface.interface';


declare global {
    namespace Express {
        interface Request {
            user?: {
                userId: number;
                firstName: string;
                lastName: string;
                isBlocked: boolean,
                phone: string,
                role: number
            };
        }
    }
}

export const adminMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next(new response(req, res, 'admin service', 401, 'no token provided', null))
    }
    const token = authHeader.replace('Bearer ', '');
    try {
        const secretKey = process.env.ADMIN_JWT || '69b9381954141365ff7be95516f16c252edcb37eb39c7a42eaaf6184d93bccb2';
        const decoded: any = jwt.verify(token, secretKey);
        req.user = decoded
        if (decoded.isBlocked) {
            console.log('admin is blocked . . .')
            return next(new response(req, res, 'admin service', 403, 'admin is blocked', null))
        }
        next();
    } catch (error) {
        console.error(error);
        return next(new response(req, res, 'admin service', 401, 'Invalid token', null))
    }
};