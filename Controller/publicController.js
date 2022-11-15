const express = require('express');
const router = express.Router();

const { validationResult } = require('express-validator');  // to process error results

const communeModel = require('../Model/communeModel');
const activityModel = require('../Model/activityModel');
const userModel = require('../Model/userModel');
const adminModel = require('../Model/adminModel');

const getActivityList = (async (req, res) => {

    try {

        // console.log("Im in getActivityList", req.body)

        // find all records in activity collection

        const list = await activityModel.find().select(
            {
                name: 1,
                prix: 1

            })

        res.json({
            message: "List of activity currently available in database",
            list
        })

    } catch (error) {
        console.log("Error while getting data for activity")

        res.json({
            message: "Error while getting data for activity",
            error
        })
    }
})

const getCommuneList = (async (req, res) => {

    try {

        // console.log("Im in getCommuneList", req.body)

        // find all records in commune collection

        const list = await communeModel.find().select(
            {
                _id: 1,
                name: 1,
                information: 1
            }).lean()

        res.json({
            message: "List of Commune currently available in database",
            list

        })

    } catch (error) {
        console.log("Error while getting data for Commune")

        res.json({
            message: "Error while getting data for Commune",
            error
        })
    }
})

const getCommuneAccueilInfo = (async (req, res) => {

    // console.log("Im in getCommuneInfo", req.params.name)

    try {

        const communeID = await communeModel.findOne({ name: req.params.name })   // get information for given commune from commune collection    // 

        // console.log("communeInfo", communeID.name)
        // console.log("communeInfo", communeID._id)
        // console.log("communeInfo", communeID.information)

        res.json({
            message: "List of community information available for**** ",
            communeID

        })

    } catch (error) {
        console.log("Error while getting data for activity", error)

        res.json({
            message: "Error while getting data for activity",
            error
        })
    }
})

const getUserEmail = (async (req, res) => {

    console.log(req.params.email)
    
    try {
        // find user email from user list
        console.log(req.params.email)

        const validUser = await userModel.findOne({ email: req.params.email }).select(
            {
                _id: 1, telephone: 1, firstname: 1
            }).lean()

        if (validUser) {

            console.log(validUser)

            res.status(200).json({
                message: "User Found",
                validUser
            })

        } else {

            res.json({
                message: "User not found"
            })
        }

    } catch (error) {

        res.status(400).json({
            message: "Error while verifing the user email",
            error
        })
    }
})

const getAdminEmail = (async (req, res) => {

    console.log(req.params.email)
    
    try {
        // find admin email from admin list
        console.log(req.params.email)


        const validAdmin = await adminModel.findOne({ email: req.params.email }).select(
            {
                _id: 1, telephone: 1, firstname: 1
            }).lean()

        if (validAdmin) {

            console.log(validAdmin)
            
            res.status(200).json({
                message: "User Found",
                validAdmin
            })

        } else {

            res.json({
                message: "User not found"
            })
        }

    } catch (error) {

        res.status(400).json({
            message: "Error while verifing the Admin email",
            error
        })
    }
})
module.exports = {
    getCommuneAccueilInfo,
    getActivityList,
    getCommuneList,
    getUserEmail,
    getAdminEmail
}