import { body, validationResult } from 'express-validator';

export const addAdmin = [
    body('firstName').notEmpty().isString().withMessage('نام نامعتبر'),
    body('lastName').notEmpty().isString().withMessage('نام خانوادگی نامعتبر'),
    body('phoneNumber').notEmpty().isString().withMessage('شماره همراه نامعتبر'),
    body('password').notEmpty().isString().withMessage('پسوورد نامعتبر'),
]
