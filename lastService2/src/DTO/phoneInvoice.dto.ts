import { body } from 'express-validator';
import { isString } from 'util';

export const createSellPhone = [
    body('goldPrice').notEmpty().isNumeric().withMessage('قیمت ورودی نامعتبر است'),
    body('goldWeight').notEmpty().isString().withMessage('حجم ورودی نا معتبر'),
    body('invoiceId').notEmpty().isString().withMessage(' شماره پیگیری تراکنش نا معتبر است'),
    body('userId').notEmpty().isNumeric().withMessage('کد کاربر  نا معتبر است'),
    body('totalPrice').notEmpty().withMessage(' قیمت کل نا معتبر است'),
    body('description').isString().withMessage('فرمت توضیحانادرست است')
]

export const updatePhoneInvoice=[
    body('goldPrice').isNumeric().withMessage('قیمت ورودی نامعتبر است'),
    body('goldWeight').isString().withMessage('حجم ورودی نا معتبر'),
    body('totalPrice').isString().withMessage('قیمت کل نا معتبر است'),
]


export const createBuyPhone=[
    body('goldPrice').notEmpty().isNumeric().withMessage('قیمت ورودی نامعتبر است'),
    body('goldWeight').notEmpty().isString().withMessage('حجم ورودی نا معتبر'),
    body('invoiceId').notEmpty().isString().withMessage(' شماره پیگیری تراکنش نا معتبر است'),
    body('userId').notEmpty().isNumeric().withMessage('کد کاربر  نا معتبر است'),
    body('totalPrice').notEmpty().withMessage(' قیمت کل نا معتبر است'),
    body('description').isString().withMessage('فرمت توضیحانادرست است')
]

export const approveBuyPhone=[
    body('description').isString().withMessage('فرمت توضیحانادرست است')
]


export const rejectBuyPhone=[
    body('description').isString().withMessage('فرمت توضیحانادرست است')
]






