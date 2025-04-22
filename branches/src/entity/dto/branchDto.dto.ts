import { body, validationResult } from 'express-validator';

export const createBranchDto = [
    body('name').notEmpty().isString().withMessage('نام شعبه نامعتبر'),
    body('code').notEmpty().isString().withMessage('کد شعبه نامعتبر'),
    body('manager').notEmpty().isString().withMessage('نام مدیر شعبه نامعتبر'),
]
