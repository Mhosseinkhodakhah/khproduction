
import { body, validationResult } from 'express-validator';


export const createTransActionDto = [
    body('branchId').notEmpty().isNumeric().withMessage('ای دی شعبه صحیح نمی باشد'),
    body('sellerId').notEmpty().isNumeric().withMessage('ای دی فروشنده صحیح نمی باشد'),
    body('goldWeight').notEmpty().isString().withMessage('حجم طلا صحیح نمی باشد'),
]


export const approveDataDto = [
    body('transActionId').notEmpty().isNumeric().withMessage('ای دی تراکنش صحیح نمی باشد'),
]


export const approveOtpDataDto = [
    body('transActionId').notEmpty().isNumeric().withMessage('ای دی تراکنش صحیح نمی باشد'),
    body('otp').notEmpty().isString().withMessage('کد تایید صحیح نمیباشد'),
]
