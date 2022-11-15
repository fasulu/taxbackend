const express = require('express');

const { validationResult } = require('express-validator');  // to process error results

const bcrypt = require('bcryptjs');     // to crypt sensible datas
const jwt = require('jsonwebtoken');    // to create jsonwebtoken

const userModel = require('../Model/userModel');
const activityModel = require('../Model/activityModel')
const communeModel = require('../Model/communeModel');
const paymentModel = require('../Model/paymentModel');
const adminModel = require('../Model/adminModel');

const config = require('../Utiles/config')

const signupNewUser = (async (req, res, next) => {

    const errorVal = validationResult(req);

    console.log(errorVal)

    const userSurname = req.body.surname
    const userFirstname = req.body.firstname
    const userDateofbirth = req.body.dateofbirth
    const userAddress_personal = req.body.address_personal
    const userAddress_Activity = req.body.address_activity
    const userActivityCommune = req.body.activity_commune
    const userActivity = req.body.activity
    const userTelephone = req.body.telephone
    const userEmail = req.body.email
    const userPassword = req.body.password
    const userStatus = "inactive"

    if (errorVal.isEmpty()) {

        try {

            const telephoneExist = await userModel.findOne({ telephone: userTelephone }).lean()    // check whether the user is already registered 
            const userEmailExist = await userModel.findOne({ email: userEmail }).lean()    // check whether the user email is already registered 

            if (telephoneExist) {

                res.json({
                    message: `User already registered in ${userTelephone} telephone number`,
                    telephoneExist
                })
            } else if (userEmailExist) {

                res.json({
                    message: `User email ${userEmail} already registered`,
                    userEmailExist
                })

            } else {

                const activityID = await activityModel.findOne({ name: userActivity }).lean()  // take activity id to save with user collection

                const communeID = await communeModel.findOne({ name: userActivityCommune }).lean()     // take commune id to save with user collection

                const password = bcrypt.hashSync(userPassword)       // crypts the given password in to Bearer Token

                const userAdded = await userModel.create(
                    {
                        surname: userSurname,
                        firstname: userFirstname,
                        dateofbirth: userDateofbirth,
                        address_personal: userAddress_personal,
                        address_activity: userAddress_Activity,
                        activityID: activityID._id,
                        activity_communeID: communeID._id,
                        telephone: userTelephone,
                        email: userEmail,
                        password: password,
                        status: userStatus
                    })

                const userAccountAdded = await paymentModel.insertMany([
                    {
                        userId: userAdded._id,
                        telephone: userTelephone,
                        amount: activityID.prix,
                        comments: "Frais d'inscription",
                        paidon: new Date()
                    }
                ])

                res.json({
                    message: "Utilisateur ajouté avec succès",
                    userAdded,
                    userAccountAdded
                })
            }

        } catch (error) {

            res.json({
                message: `Error while processing your ${userTelephone} and ${userEmail} as new user`,
                userTelephone
            })
        }

    } else {

        res.status(400).json({
            message: `Error while processing your ${userTelephone} as new user`,
            userTelephone,
            errorVal
        })
    }
})

const login = (async (req, res) => {

    const tokenExpire = config.tokenExpire      // setting for token expires in 4h

    const userTelephone = req.body.telephone
    const userPassword = req.body.password

    console.log(userTelephone, userPassword)

    try {

        const errorVal = validationResult(req);

        if (errorVal.isEmpty()) {

            const validUser = await userModel.findOne({ telephone: userTelephone }).select({
                surname: 1, firstname: 1, dateofbirth: 1, address_personal: 1, address_activity: 1, activity_communeID: 1, activityID: 1, telephone: 1, password: 1, status: 1
            }).lean()    // check is the user registered in collection

            console.log(validUser.status)

            if (validUser.status === 'inactive') {
                res.json({
                    message: `User ${validUser.telephone} status is ${validUser.status}, please contact administrator`,
                    validUser
                })

            } else {

                const validPassword = bcrypt.compareSync(userPassword, validUser.password)     // if yes, compare the user password  with saved password 

                if (validPassword) {

                    const validToken = jwt.sign({     // creates token using jwt with "secret" code and time to expires the token
                        id: validUser._id

                    }, config.secret, {      // "secret",   // secret word from config.js file 
                        expiresIn: tokenExpire       // token expiry time from config.js file
                    })

                    res.json({                                                                  // pass on login details to frontend for further process
                        message: `${validUser.firstname} ${validUser.surname} is logged in as ${userTelephone}`,
                        validUser,
                        validToken,
                        tokenExpire
                    })

                } else {

                    res.status(400).json({
                        message: `User ${userTelephone} login problem`,
                        error
                    })
                }
            }

        } else {

            res.json({
                message: `Error while login ${userTelephone}`,
                errorVal
            })
        }

    } catch (error) {

        res.json({
            message: `Telephone or Password incorrect`,
            error
        })
    }
})

const signupNewAdmin = (async (req, res, next) => {

    const errorVal = validationResult(req);

    const userFirstname = req.body.firstname
    const userSurname = req.body.surname
    const userRole = req.body.role
    const userTelephone = req.body.telephone
    const userEmail = req.body.email
    const userPassword = req.body.password
    // const userStatus = "active"

    let userRoleType = ""

    if (errorVal.isEmpty()) {

        try {

            if (userRole === "admin") {

                userRoleType = "1"

            } else if (userRole === "agent") {

                userRoleType = "2"

            } else {

                res.json({
                    message: `Invalid text in role :- ${userRole}`,
                    userRoleType
                })
            }

            const userExist = await adminModel.findOne({ telephone: userTelephone }).lean()    // check whether the user is already registered 
            const userEmailExist = await adminModel.findOne({ email: userEmail }).lean()    // check whether the user email is already registered 

            if (userExist) {

                res.json({
                    message: `User already registered in ${userTelephone} telephone number`,
                    userExist
                })
            } else if (userEmailExist) {

                res.json({
                    message: `User email ${userEmail} already registered`,
                    userEmailExist
                })
            } else {

                const password = bcrypt.hashSync(userPassword)       // crypts the given password in to Bearer Token

                const userAdded = await adminModel.create(
                    {
                        firstname: userFirstname,
                        surname: userSurname,
                        role: userRoleType,
                        telephone: userTelephone,
                        email: userEmail,
                        password: password
                    })

                res.json({
                    message: `${userTelephone} successfully added`,
                    userAdded
                })

            }

        } catch (error) {

            res.json({
                message: `Error while processing your ${userTelephone} and ${userEmail} as new user`,
                userTelephone,
                error

            })
        }

    } else {

        res.status(400).json({
            message: `Error while processing your ${userTelephone} as new user`,
            userTelephone,
            errorVal
        })
    }

})

const loginAdmin = (async (req, res) => {

    const tokenExpire = config.tokenExpire      // setting expiry time for token 

    const userTelephone = req.body.telephone
    const userPassword = req.body.password

    try {

        const errorVal = validationResult(req);

        if (errorVal.isEmpty()) {

            const validUser = await adminModel.findOne({ telephone: userTelephone }).select({
                surname: 1, firstname: 1, role: 1, telephone: 1, email: 1, password: 1
            }).lean()    // check is the user registered in collection

            // const validUser = await adminModel.findOne({ telephone: userTelephone }).select({
            //     surname: 1, firstname: 1, role: 1, telephone: 1, email: 1, password: 1, status: 1
            // }).lean()    // check is the user registered in collection

            // if (validUser.status === 'inactive') {
            //     res.json({
            //         message: `User ${validUser.telephone} status is ${validUser.status}, please contact administrator`,
            //         validUser
            //     })

            // } else {

                if (validUser) {

                    const validPassword = bcrypt.compareSync(userPassword, validUser.password)     // if yes, compare the user password  with saved password 

                    console.log("validPassword", validPassword)

                    if (validPassword) {

                        const validToken = jwt.sign({     // creates token using jwt with "secret" code and time to expires the token
                            id: validUser._id
                            
                        }, "secret", {      // config.secret,   // when you connect with congig.js file use this
                            expiresIn: tokenExpire       // token expiry time mentioned in const above
                        })

                        res.json({                                                                  // pass on login details to frontend for further process
                            message: `${validUser.surname} ${validUser.firstname} is logged in as ${userTelephone}`,
                            validUser,
                            validToken,
                            tokenExpire
                        })

                    } else {

                        res.json({
                            message: `User ${userTelephone} login problem`,
                            error
                        })
                    }
                } else {
                    res.json({
                        message: `User (${userTelephone}) does not exist`,
                        errorVal
                    })
                }

            // }

        } else {

            res.json({
                message: `Please verify your details matches the regulation, error while login ${userTelephone}`,
                errorVal
            })
        }

    } catch (error) {

        res.status(400).json({
            message: `Error while login user ${userTelephone}`,
            error
        })
    }
})

module.exports = {
    signupNewUser,
    login,
    signupNewAdmin,
    loginAdmin
}
