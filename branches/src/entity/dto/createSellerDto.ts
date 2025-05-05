

import { body, validationResult } from 'express-validator';

export const addSellerDto = [
    body('firstName').notEmpty().isString().withMessage('نام فروشنده نا معتبر'),
    body('lastName').notEmpty().isString().withMessage('نام خانوادگی فروشنده نامعتب'),
    body('phoneNumber').notEmpty().isString().withMessage('شماره همراه فروشنده نا معتبر'),
]
