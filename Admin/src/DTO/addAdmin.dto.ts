import { body, validationResult } from 'express-validator';

export const addAdmin = [
    body('firstName').notEmpty().isString().withMessage('نام صحیح نمیباشد'),
    body('lastName').notEmpty().isString().withMessage('نام خانوادگی صحیح نمیباشد'),
    body('phoneNumber').notEmpty().isString().withMessage('شماره همراه صحیح نمیباشد'),
    body('password').notEmpty().isString().withMessage('پسوورد صحیح نمیباشد'),
]
