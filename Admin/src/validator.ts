import { body, validationResult } from 'express-validator';

export const menuValidation = [
    body('menu').notEmpty().isString().withMessage('name is required'),
];


export const adminValidation = [
    body('firstName').notEmpty().isString().withMessage('fullName is required'),
    body('lastName').notEmpty().isString().withMessage('lastName is required'),
    body('phoneNumber').notEmpty().isString().withMessage('phoneNumber is required'),
    body('password').notEmpty().isString().withMessage('password is required'),
    // body('role').notEmpty().isString().withMessage('role is required'),
]


export const accessPointsValidation = [
    body('accessPoints').notEmpty().isArray().withMessage('the accesspoints should be array')
]

