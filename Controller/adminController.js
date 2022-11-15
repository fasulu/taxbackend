const express = require('express');
const router = express.Router();

const { validationResult } = require('express-validator');  // to process error results

const bcrypt = require('bcryptjs');     // to crypt sensible datas
const jwt = require('jsonwebtoken');    // to create jsonwebtoken

const adminModel = require('../Model/adminModel');
const userModel = require('../Model/userModel');
const activityModel = require('../Model/activityModel');
const communeModel = require('../Model/communeModel');
const paymentModel = require('../Model/paymentModel');

const getAdminList = (async (req, res) => {

    try {

        // find all records in admin collection

        const userlist = await adminModel.find().select(
            {
                _id: 1,
                surname: 1,
                firstname: 1,
                role: 1,
                telephone: 1,
                email: 1,
                status: 1
            }).lean()

        res.json({
            message: "List of administrators currently available in database",
            userlist
        })

    } catch (error) {

        res.status(400).json({
            message: "Error while getting admins list",
            error
        })
    }
})

const getAdminTelephoneNum = (async (req, res) => {

    console.log(req.params.telephone)

    try {
        // find admin given telephone number record from admin list

        const validUser = await adminModel.findOne({ telephone: req.params.telephone }).select(
            {
                _id: 1,
                surname: 1,
                firstname: 1,
                telephone: 1,
                email: 1,
                role: 1,
                status: 1
            }).lean()

        if (validUser) {

            res.json({
                message: "User Found",
                validUser
            })

        } else {

            res.status(400).json({
                message: "User not found",
                validUser

            })
        }

    } catch (error) {

        res.status(400).json({
            message: "Error while verifing the user telephone number",
            error
        })
    }
})

const getAdminAdminTelephoneNum = (async (req, res) => {

    console.log(req.params.telephone)

    try {
        // find admin given telephone number record from admin list

        const validUser = await adminModel.findOne({ telephone: req.params.telephone }).select(
            {
                _id: 1,
                surname: 1,
                firstname: 1,
                telephone: 1,
                email: 1,
                role: 1,
                status: 1
            }).lean()

        if (validUser) {

            res.json({
                message: "User Found",
                validUser
            })

        } else {

            res.status(400).json({
                message: "User not found",
                validUser

            })
        }

    } catch (error) {

        res.status(400).json({
            message: "Error while verifing the user telephone number",
            error
        })
    }
})

const getUserTelephoneNumForAdmin = (async (req, res) => {

    console.log(req.params.telephone)

    try {
        // find user given telephone number record from user list

        const validUser = await userModel.findOne({ telephone: req.params.telephone }).select(
            {
                _id: 1,
                surname: 1,
                firstname: 1,
                dateofbirth: 1,
                address_personal: 1,
                address_activity: 1,
                activityID: 1,
                activity_communeID: 1,
                telephone: 1,
                email: 1,
                status: 1
            }).lean()

        if (validUser) {

            const activity = validUser.activityID
            const commune = validUser.activity_communeID

            const userActivityName = await activityModel.findById(activity).exec()
            const userCommuneName = await communeModel.findById(commune).exec()

            const userActivity = userActivityName.name
            const userActivityPrix = userActivityName.prix
            const activityCommune = userCommuneName.name


            res.json({
                message: "User Found",
                validUser,
                userActivity,
                userActivityPrix,
                activityCommune
            })

        } else {

            res.status(400).json({
                message: "User not found",
                validUser

            })
        }

    } catch (error) {

        res.status(400).json({
            message: "Error while verifing the user telephone number",
            error
        })
    }
})

const deleteUser = (async (req, res) => {

    try {

        const userID = req.params.id
        console.log("In getAdmimList controller", userID)

        // check is the user is exist

        const userExist = await userModel.findById(userID).lean()

        if (userExist) {

            console.log(userExist)

            // find and delete user by given _id

            const userDeleted = await userModel.findByIdAndDelete({ _id: userID }).exec()

            res.json({
                message: "List of administrators currently available in database",
                userDeleted
            })
        }

    } catch (error) {

        res.status(400).json({
            message: "Error while getting admins list",
            error
        })
    }
})

const addActivity = (async (req, res) => {

    const errorVal = validationResult(req);

    try {

        const activity = req.body.name
        const prix = req.body.prix

        const activityExist = await activityModel.findOne({ name: activity }).lean()    // check whether the activity is already registered 

        if (activityExist) {

            res.json({
                message: `Activité ${activity} déjà enregistrée`,
                activityExist
            })

        } else {

            const addedActivity = await activityModel.create({ name: activity, prix: prix })

            res.json({
                message: 'Activité et prix ajoutés avec succès',
                addedActivity
            })
        }

    } catch (error) {

        res.status(400).json({
            message: 'Error while adding activity', error,
            errorVal
        })
    }
})

const modifyActivity = (async (req, res) => {

    const errorVal = validationResult(req);

    try {

        const activity = req.params.name
        const prix = req.body.prix

        const list = await activityModel.findOne({ name: activity }).lean()

        if (list) {

            const updateActivity = await activityModel.updateOne({ name: activity },
                {
                    "$set": {
                        "prix": prix
                    }
                }, { upset: true }).lean()

            const updatedActivity = await activityModel.findOne({ name: activity }).select(
                {
                    _id: 1,
                    name: 1,
                    prix: 1
                }
            ).lean()

            if (updatedActivity) {

                res.json({
                    message: `L'activité ${activity} a été modifiée avec succès`,
                    updatedActivity
                })
            }

        } else {
            res.json({
                message: `Activity ${activity} not found`
            })
        }


    } catch (error) {

        res.status(400).json({
            message: 'Error while editing activity', error,
            errorVal
        })
    }
})

const deleteActivity = (async (req, res) => {

    try {

        const activityID = req.params.id
        console.log("Im activityDelete controller", activityID)

        // check is the activity is exist

        const activityExist = await activityModel.findById(activityID).lean()

        if (activityExist) {

            const activityExistInUserList = await userModel.findOne({ activityID: activityID }).lean()

            if (activityExistInUserList) {

                console.log(`User is registered in this activity, you cant delete this activity`)

                res.status(200).json({
                    message: "User registered in this activity\nUnable to delete",
                    activityExistInUserList,
                    activityExist
                })

            } else {

                console.log(activityExist)

                // find and delete activity by given _id

                const activityDeleted = await activityModel.findByIdAndDelete({ _id: activityID }).exec()

                res.json({
                    message: "L'activité ajoutée avec succès",
                    activityDeleted
                })

            }

        } else {
            res.status(400).json({
                message: "Requested Activity not found",
                error
            })
        }

    } catch (error) {

        res.status(400).json({
            message: "Requested item not found, error while deleting activity from list",
            error
        })
    }
})

const addCommune = (async (req, res) => {

    const errorVal = validationResult(req);

    try {

        const commune = req.body.name
        const info = req.body.information


        const communeExist = await communeModel.findOne({ name: commune }).lean()    // check whether the commune is already registered 

        if (communeExist) {

            res.json({
                message: `Activity ${commune} already registered`,
                communeExist
            })

        } else {

            const addedCommune = await communeModel.create({ name: commune, information: info })

            res.json({
                message: 'Commune ajoutée avec succès',
                addedCommune
            })
        }

    } catch (error) {

        res.status(400).json({
            message: 'Error while adding commune', error,
            errorVal
        })
    }
})

const modifyCommune = (async (req, res) => {

    const errorVal = validationResult(req);

    try {

        const commune = req.params.name
        const communeInfo = req.body.information

        console.log(commune, communeInfo)

        const list = await communeModel.findOne({ name: commune }).lean()

        if (list) {

            const updateCommune = await communeModel.updateOne({ name: commune },
                {
                    "$set": {
                        "information": communeInfo
                    }
                }, { upset: true }).lean()

            const updatedCommune = await communeModel.findOne({ name: commune }).select(
                {
                    _id: 1,
                    name: 1,
                    information: 1
                }
            ).lean()

            if (updatedCommune) {

                res.json({
                    message: `Les informations de la commune ${commune} ont été modifiées avec succès`,
                    updatedCommune
                })
            }

        } else {
            res.json({
                message: `Commune ${commune} not found`
            })
        }


    } catch (error) {

        res.status(400).json({
            message: 'Error while editing commune', error,
            errorVal
        })
    }
})

const deleteCommune = (async (req, res) => {

    try {

        const communeID = req.params.id
        console.log("Im communeDelete controller", communeID)

        // check is the commune is exist

        const communeExist = await communeModel.findById(communeID).lean()

        if (communeExist) {

            console.log(communeExist)

            const communeExistInUserList = await userModel.findOne({ activity_communeID: communeID }).lean()

            if (communeExistInUserList) {

                console.log(`User is registered in this commune, you cant delete this commune`)

                res.status(200).json({
                    message: "User registered in this commune\nUnable to delete",
                    communeExistInUserList,
                    communeExist
                })

            } else {

                // find and delete commune by given _id

                const communeDeleted = await communeModel.findByIdAndDelete({ _id: communeID }).exec()

                res.json({
                    message: "Commune supprimée avec succès",
                    communeDeleted
                })

            }

        } else {
            res.status(400).json({
                message: "Requested Commune not found",
                error
            })
        }

    } catch (error) {

        res.status(400).json({
            message: "Requested item not found, error while deleting commune from list",
            error
        })
    }
})

const modificationAgentInfo = (async (req, res) => {

    try {

        // update agent information by given telephone number

        const errorVal = validationResult(req);

        const oldTelephone = req.params.telephone
        const newTelephone = req.body.telephone
        const newFirstname = req.body.firstname
        const newsurname = req.body.surname
        const newEmail = req.body.email


        if (errorVal.isEmpty()) {

            const telephoneExist = await adminModel.findOne({ telephone: req.params.telephone }).lean()

            if (telephoneExist) {

                const updateAgentInfo = await adminModel.updateOne({ _id: telephoneExist._id },
                    {
                        "$set": {
                            "telephone": newTelephone,
                            "firstname": newFirstname,
                            "surname": newsurname,
                            "email": newEmail
                        }
                    }, { upsert: true }).lean()

                const updatedInfo = await adminModel.findOne({ _id: telephoneExist._id }).select(
                    {
                        _id: 1,
                        surname: 1,
                        firstname: 1,
                        telephone: 1,
                        email: 1
                    }).lean()

                res.json({
                    message: `L'agent a été mis à jour`,
                    updatedInfo
                })

            } else {

                res.json({
                    message: `Agent telephone number ${req.params.telephone} does not exist in the list`
                })
            }

        } else {

            res.json({
                message: `Error while processing your ${oldTelephone, newTelephone, newFirstname, newsurname, newEmail}`,
                errorVal
            })
        }

    } catch (error) {

        res.status(400).json({
            message: "Error while updating agent information",
            errorVal
        })
    }
})

const changeAgentPwd = (async (req, res) => {

    try {

        // update agent password by given telephone number

        const errorVal = validationResult(req);

        const userPassword = req.body.password

        if (errorVal.isEmpty()) {

            const telephoneExist = await adminModel.findOne({ telephone: req.params.telephone }).lean()

            if (telephoneExist) {

                const password = bcrypt.hashSync(userPassword)       // crypts the given password in to Bearer Token

                const updateUserInfo = await adminModel.updateOne({ _id: telephoneExist._id },
                    {
                        "$set": {
                            "password": password
                        }
                    }, { upsert: true }).lean()

                const updatedInfo = await adminModel.findOne({ _id: telephoneExist._id }).select(
                    {
                        _id: 1,
                        surname: 1,
                        firstname: 1,
                        telephone: 1,
                        email: 1,
                        password: 1
                    }).lean()

                res.json({
                    message: `Mot de passe mis à jour`,
                    updatedInfo
                })

            } else {

                res.json({
                    message: `Agent telephone number ${req.params.telephone} does not exist in the list`
                })
            }

        } else {

            res.json({
                message: `Error while processing your password change`,
                errorVal
            })
        }

    } catch (error) {

        res.status(400).json({
            message: "Error while updating user password change",
            errorVal
        })
    }
})

const modificationAdminInfo = (async (req, res) => {

    // update admin information by given telephone number

    const errorVal = validationResult(req);

    try {

        const oldTelephone = req.params.telephone
        const newTelephone = req.body.telephone
        const newFirstname = req.body.firstname
        const newsurname = req.body.surname
        const newEmail = req.body.email

        if (errorVal.isEmpty()) {

            const telephoneExist = await adminModel.findOne({ telephone: req.params.telephone }).lean()

            if (telephoneExist) {

                const updateAdminInfo = await adminModel.updateOne({ _id: telephoneExist._id },
                    {
                        "$set": {
                            "telephone": newTelephone,
                            "firstname": newFirstname,
                            "surname": newsurname,
                            "email": newEmail
                        }
                    }, { upsert: true }).lean()

                const updatedInfo = await adminModel.findOne({ _id: telephoneExist._id }).select(
                    {
                        _id: 1,
                        surname: 1,
                        firstname: 1,
                        telephone: 1,
                        email: 1
                    }).lean()

                res.json({
                    message: `L'administrateur a été mis à jour`,
                    updatedInfo
                })

            } else {

                res.json({
                    message: `Admin telephone number ${req.params.telephone} does not exist in the list`
                })
            }

        } else {

            res.json({
                message: `Error while processing your ${oldTelephone, newTelephone, newFirstname, newsurname, newEmail}`,
                errorVal
            })
        }

    } catch (error) {

        // res.status(400).json({
        res.json({
            message: "User telephone number already exist",
            errorVal
        })
    }
})

const changeAdminPwd = (async (req, res) => {

    try {

        // update admin password by given telephone number

        const errorVal = validationResult(req);

        const userPassword = req.body.password

        if (errorVal.isEmpty()) {

            const telephoneExist = await adminModel.findOne({ telephone: req.params.telephone }).lean()

            if (telephoneExist) {

                const password = bcrypt.hashSync(userPassword)       // crypts the given password

                const updateAdminInfo = await adminModel.updateOne({ _id: telephoneExist._id },
                    {
                        "$set": {
                            "password": password
                        }
                    }, { upsert: true }).lean()

                const updatedInfo = await adminModel.findOne({ _id: telephoneExist._id }).select(
                    {
                        _id: 1,
                        surname: 1,
                        firstname: 1,
                        telephone: 1,
                        email: 1,
                        password: 1
                    }).lean()

                res.json({
                    message: `Le mot de passe a été modifié`,
                    updatedInfo
                })

            } else {

                res.json({
                    message: `Admin telephone number ${req.params.telephone} does not exist in the list`
                })
            }

        } else {

            res.json({
                message: `Error while processing your password change`,
                errorVal
            })
        }

    } catch (error) {

        res.status(400).json({
            message: "Error while updating user password change",
            errorVal
        })
    }
})

const changeAgentStatus = (async (req, res) => {

    try {

        // update agent status by given telephone number

        const errorVal = validationResult(req);

        const agentStatus = req.body.status

        if (errorVal.isEmpty()) {

            const telephoneExist = await adminModel.findOne({ telephone: req.params.telephone }).lean()

            if (telephoneExist) {

                const updateUserInfo = await adminModel.updateOne({ _id: telephoneExist._id },
                    {
                        "$set": {
                            "status": agentStatus
                        }
                    }, { upsert: true }).lean()

                const updatedInfo = await adminModel.findOne({ _id: telephoneExist._id }).select(
                    {
                        _id: 1,
                        surname: 1,
                        firstname: 1,
                        telephone: 1,
                        email: 1,
                        status: 1
                    }).lean()

                res.json({
                    message: `Le statut de l'agent a été changé ${updatedInfo.status}`,
                    updatedInfo
                })

            } else {

                res.json({
                    message: `Agent telephone number ${req.params.telephone} does not exist in the list`
                })
            }

        } else {

            res.json({
                message: `Error while processing your agent status change`,
                errorVal
            })
        }

    } catch (error) {

        res.status(400).json({
            message: "Error while updating agent status change",
            errorVal
        })
    }

})

const deleteAgent = (async (req, res) => {

    try {

        const telephone = req.params.telephone
        console.log("Im delete agent controller", telephone)

        // check is the commune is exist

        const agentExist = await adminModel.findOne({ telephone: telephone }).lean()

        console.log(agentExist)

        if (agentExist) {

            // find and delete agent by given _id

            const agentDeleted = await adminModel.findByIdAndDelete({ _id: agentExist._id }).exec()

            res.json({
                message: "List of delete currently deleted from database",
                agentDeleted
            })
        } else {
            res.status(400).json({
                message: "Requested item not found",
                error
            })
        }

    } catch (error) {

        res.status(400).json({
            message: "Requested item not found, error while deleting agent from list",
            error
        })
    }
})

const requestAdminPassword = (async (req, res) => {

    // update admin password after requesting forget password

    try {

        const errorVal = validationResult(req);

        const userPassword = req.body.password

        if (errorVal.isEmpty()) {

            const telephoneExist = await adminModel.findOne({ telephone: req.params.telephone }).lean()

            if (telephoneExist) {

                const password = bcrypt.hashSync(userPassword)       // crypts the given password

                const updateAdminInfo = await adminModel.updateOne({ _id: telephoneExist._id },
                    {
                        "$set": {
                            "password": password
                        }
                    }, { upsert: true }).lean()

                const updatedInfo = await adminModel.findOne({ _id: telephoneExist._id }).select(
                    {
                        _id: 1,
                        surname: 1,
                        firstname: 1,
                        telephone: 1,
                        email: 1
                    }).lean()

                res.json({
                    message: `Le mot de passe a été modifié`,
                    updatedInfo
                })

            } else {

                res.json({
                    message: `Admin telephone number ${req.params.telephone} does not exist in the list`
                })
            }

        } else {

            res.json({
                message: `Error while processing your password change`,
                errorVal
            })
        }

    } catch (error) {

        res.status(400).json({
            message: "Error while updating user password change",
            errorVal
        })
    }
})

module.exports = {
    getAdminList,
    getAdminTelephoneNum,
    getAdminAdminTelephoneNum,
    getUserTelephoneNumForAdmin,
    deleteUser,
    addActivity,
    modifyActivity,
    deleteActivity,
    modifyCommune,
    addCommune,
    deleteCommune,
    modificationAgentInfo,
    changeAgentPwd,
    modificationAdminInfo,
    changeAdminPwd,
    changeAgentStatus,
    deleteAgent,
    requestAdminPassword
}