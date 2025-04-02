import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { responseModel } from '../util/response.model';
import { jwtGeneratorInterface } from '../interfaces/interface.interface';
import monitor from '../util/statusMonitor';


declare global {
    namespace Express {
        interface Request {
            user?: {
                userId: number;
                phone: string;
                role: any;
            };
        }
    }
}

export const adminMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No token provided' });
    }
    const token = authHeader.replace('Bearer ', '');
    try {
        const secretKey = process.env.ADMIN_JWT || '69b9381954141365ff7be95516f16c252edcb37eb39c7a42eaaf6184d93bccb2';
        const decoded: jwtGeneratorInterface = jwt.verify(token, secretKey);
        req.user = decoded
        if (decoded.isBlocked) {
            console.log('admin is blocked . . .')
            return next(new responseModel(req, res, 'این ادمین بلاک میباشد' ,'admin service', 403, 'admin is blocked',  null))
        }
        next();
    } catch (error) {
        monitor.error.push(`${error}`)
        console.error(error);
        return next(new responseModel(req, res, 'توکن نا معتبر می باشد' ,'admin service', 401, 'Invalid token', null))
    }
};