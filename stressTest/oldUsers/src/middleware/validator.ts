import { body } from 'express-validator';

export const validatorApproveBody = [
    body('phoneNumber').notEmpty().isString().withMessage('شماره تلفن باید وارد شود'),
    body('birthDate').notEmpty().isString().withMessage('تاریخ تولد باید وارد شود'),
    body('nationalCode').notEmpty().isString().withMessage('شماره ملی باید وارد شود'),
    // body('otp').notEmpty().withMessage('کد اس ام اس شده باید وارد شود')
];

export const validatorCheckIdentifyBody = [
    body('phoneNumber').notEmpty().isString().withMessage('شماره تلفن باید وارد شود'),
];




