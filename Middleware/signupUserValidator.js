const { body } = require('express-validator');

const signupUserValidator =
    [
        body('surname').notEmpty().trim().escape(),
        body('firstname').notEmpty().trim().escape(),
        body('dateofbirth').notEmpty(),
        body('address_personal').notEmpty().trim().escape().isLength({ min: 4, max: 75 }),
        body('address_activity').notEmpty().trim().escape().isLength({ min: 4, max: 75 }),
        body('activity_commune').notEmpty().trim().escape(),
        body('activity').notEmpty().trim().escape(),
        body('telephone').notEmpty().trim().escape().isInt().isLength({ min: 9 }),
        body('email').notEmpty().trim().escape().isLength({min:9, max:25}),
        body('password').notEmpty().trim().escape().isLength({ min: 6, max: 15 })
    ]

module.exports = { signupUserValidator };