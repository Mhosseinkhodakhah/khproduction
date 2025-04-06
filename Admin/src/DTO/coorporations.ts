import { body, validationResult } from 'express-validator';

export const createCooprationRequests = [
    body('firstName').notEmpty().withMessage('نام را وارد کنید'),
    body('firstName').isString().withMessage('فرمت نام صحیح نمیباشد'),
    body('lastName').notEmpty().withMessage('نام خانوادگی را وارد کنید'),
    body('lastName').isString().withMessage('فرمت نام صحیح نمیباشد'),
    body('nationalCode').notEmpty().withMessage('فرمت نام صحیح نمیباشد'),
    body('nationalCode').isString().withMessage('فرمت نام صحیح نمیباشد'),
    body('city').notEmpty().withMessage('فرمت شهر صحیح نمیباشد'),
    body('city').isString().withMessage('فرمت شهر صحیح نمیباشد'),
    body('birthDate').notEmpty().withMessage('فرمت تولد صحیح نمیباشد'),
    body('birthDate').isString().withMessage('فرمت تولد صحیح نمیباشد'),
    // body('province').notEmpty().withMessage('فرمت منطقه صحیح نمیباشد'),
    // body('province').isString().withMessage('فرمت منطقه صحیح نمیباشد'),
]
