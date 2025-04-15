import { body } from 'express-validator';

const PhoneCondition = {
    COMPLETED: 'success',
    FAILED: 'failed',
    PENDING: 'pending',
    ALL:''
};

export const transactionStatusBody = [
    body('status').isIn([PhoneCondition.COMPLETED, PhoneCondition.FAILED, PhoneCondition.PENDING , PhoneCondition.ALL])
    .withMessage('ورودی نامعتبر است')
   
]