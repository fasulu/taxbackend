
const { body } = require('express-validator');

const loginUserValidator =

    [
        body("telephone").not().isEmpty().trim().escape().isInt().isLength({ min: 9, max: 9 }),
        body("password").not().isEmpty().trim().escape().isLength({ min: 6, max: 15 }),
    ]

const userPwdChangeValidator =

    [
        body("password").not().isEmpty().trim().escape().isLength({ min: 6, max: 15 }),
    ]

const userModificationValidator =

    [
        body('surname').notEmpty().trim().escape(),
        body('firstname').notEmpty().trim().escape(),
        body("telephone").not().isEmpty().trim().escape().isInt().isLength({ min: 9, max: 9 }),
        body('email').notEmpty().trim().escape().isLength({ min: 9, max: 50 }),
    ]

const communeValidator =
    [
        body('commune').notEmpty().trim().escape().isLength({ min: 3, max: 25 }),

    ]

const emailValidator =

    [
        body('email').notEmpty().trim().escape().isLength({ min: 9, max: 50 }),
    ]

module.exports = {
    loginUserValidator,
    userPwdChangeValidator,
    userModificationValidator,
    communeValidator,
    emailValidator
};