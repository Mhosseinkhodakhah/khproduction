import { body, validationResult } from 'express-validator';

export const verifyTransActinon = [
    body('authority').notEmpty().withMessage('شناسه واریز نامعتبر است'),
    body('authority').isString().withMessage('authority is required and should be string'),
]

export const approveWithdrawalDTO=[
    body('withdrawalId').notEmpty().withMessage('شناسه پرداخت نامعتبر است'),
    body('withdrawalId').isString().withMessage('withdrawalId is required and should be string')
]

export const verifyIdentityInperson=[
    body('phoneNumber').notEmpty().withMessage('شماره تلفن نامعتبر است'),
    body('phoneNumber').isString().withMessage('phone number is required and should be string'),
    body('birthDate').notEmpty().isString().withMessage('تاریخ تولد نا معتبر است'),
    body('nationalCode').notEmpty().isString().withMessage('کد ملی  نا معتبر است'),
    body('id').notEmpty().withMessage('   ای دی نا معتبر است'),
]


export const changeInpersonStatus=[
    body('status').notEmpty().isNumeric().withMessage(' وضعیت نامشخص نا معتبر است'),
    body('id').notEmpty().withMessage('   ای دی نا معتبر است'),
]   


export const createBuyTransAction=[
    body('goldPrice').notEmpty().isNumeric().withMessage('قیمت ورودی نامعتبر است'),
    body('goldWeight').notEmpty().isString().withMessage('حجم ورودی نا معتبر'),
    body('nationalCode').notEmpty().isString().withMessage('کد ملی  نا معتبر است'),
    body('totalPrice').notEmpty().withMessage(' قیمت کل نا معتبر است'),
]


export const creatSellTransAction=[
    body('goldPrice').notEmpty().isNumeric().withMessage('قیمت ورودی نامعتبر است'),
    body('goldWeight').notEmpty().isString().withMessage('حجم ورودی نا معتبر'),
    body('nationalCode').notEmpty().isString().withMessage('کد ملی  نا معتبر است'),
    body('totalPrice').notEmpty().withMessage(' قیمت کل نا معتبر است'),
]


export const verifyOtp=[
    body('otp').notEmpty().isString().withMessage('کد نامعتبر است'),
    body('phoneNumber').notEmpty().isString().withMessage('شماره تلفن نا معتبر'),
]



export const getOtp=[
    body('phoneNumber').notEmpty().isString().withMessage('شماره تلفن نا معتبر'),
]



