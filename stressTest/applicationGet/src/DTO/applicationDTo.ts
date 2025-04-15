import { body, validationResult } from 'express-validator';


export const createNewUser = [
    body('age').notEmpty().isNumeric().withMessage(' invalid body'),
    body('gender').notEmpty().isString().withMessage(' invalid body'),
    body('identityNumber').notEmpty().isString().withMessage(' invalid body'),
    body('email').notEmpty().isString().withMessage(' invalid body'),
    body('identitySeri').notEmpty().isString().withMessage(' invalid body'),
    body('fatherName').notEmpty().isString().withMessage(' invalid body'),
    body('firstName').notEmpty().isString().withMessage(' invalid body'),
    body('lastName').notEmpty().isString().withMessage(' invalid body'),
    body('nationalCode').notEmpty().isString().withMessage(' invalid body'),
    body('officeName').notEmpty().isString().withMessage(' invalid body'),
    body('password').isString().withMessage(' invalid body'),
    body('phoneNumber').notEmpty().isString().withMessage(' invalid body'),
]
