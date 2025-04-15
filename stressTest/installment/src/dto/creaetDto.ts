import { body, validationResult } from 'express-validator';


export const verificationOfCreateInstallment = [
    body('firstName').notEmpty().withMessage('نام را وارد کنید'),
    body('firstName').isString().withMessage('نام نا معتبر است'),
    body('lastName').notEmpty().withMessage('نام خانوادگی را وارد کنید'),
    body('lastName').isString().withMessage('نام خانوادگی نا معتبر است'),
    body('nationalCode').notEmpty().withMessage('کد ملی را وارد کنید'),
    body('nationalCode').isString().withMessage('کد ملی نا معتبر است'),
    body('phoneNumber').notEmpty().withMessage('شماره تلفن را وارد کنید'),
    body('phoneNumber').isString().withMessage('شماره تلفن نا معتبر است'),
    body('category').notEmpty().withMessage('دسته بندی را وارد کنید'),
    body('category').isNumeric().withMessage('دسته بندی نا معتبر است'),
    body('city').notEmpty().withMessage('شهر را وارد کنید'),
    body('city').isNumeric().withMessage('شهر نا معتبر است'),
    body('province').notEmpty().withMessage('استان را وارد کنید'),
    body('province').isNumeric().withMessage('استان نا معتبر است'),

]

export const approveWithdrawalDTO=[
    body('withdrawalId').notEmpty().withMessage('شناسه پرداخت نامعتبر است'),
    body('withdrawalId').isString().withMessage('withdrawalId is required and should be string')
]


