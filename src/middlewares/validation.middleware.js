import { check, validationResult } from 'express-validator';

export const dataValidation = (view) => [
    check('password')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
        .matches(/\d/).withMessage('Password must contain a number')
        .matches(/\W/).withMessage('Password must contain a special character'),
    
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errorMsgs = errors.array().map(err => err.msg).join(', ');
            return res.render(view, { errorMsg: errorMsgs });
        }
        next();
    }
];
