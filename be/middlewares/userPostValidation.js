const {body, validationResult} = require('express-validator');

const userBodyParams = [
    body('nickname')
        .notEmpty()
        .isString()
        .isLength({min:1})
        .withMessage('Nickname is required, min 1 character'),

    body('email')
        .notEmpty()
        .isEmail()
        .withMessage('Email is required and must be a valid email'),

    body('password')
        .notEmpty()
        .isString()
        .isLength({min:7})
        .withMessage('Password is required, min 7 characters'),

    body('avatar')
        .notEmpty()
        .isURL()
        .withMessage('Avatar is required')
];

const validatePostUser = (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()})
    }

    next()
}

module.exports = {userBodyParams, validatePostUser}