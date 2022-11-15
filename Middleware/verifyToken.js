const jwt = require("jsonwebtoken")
const userModel=require("../Model/userModel");
const adminModel=require("../Model/adminModel");
const config = require("../Utiles/config")

const verifyUserToken = async (req, res, next) => {

    try {
        const token = req.headers.authorization.split(" ")[1]
        
        console.log(`This is the token value ${token}`)


        if (!token) {
            return res.status(403).json({
                message: "No token provided"
            });
        }

        const result = jwt.verify(token, config.secret)

        if (result.id) {
            const user = await userModel.findById({ _id: result.id }).lean()

            req.user = user

            console.log(`this value is from verifyToken middleware ${user._id}`)
            console.log(`this value is from verifyToken middleware ${result.id}`)

            next()
        }
    } catch (error) {
        console.log("Error: ", error)
        res.status(401).json(
            { message: "You don't have access right for this information"
        
        });

    }
}

const verifyAdminToken = async (req, res, next) => {

    try {
        const token = req.headers.authorization.split(" ")[1]
        
        console.log(`This is the token value ${token}`)


        if (!token) {
            return res.status(403).json({
                message: "No token provided"
            });
        }

        const result = jwt.verify(token, config.secret)

        if (result.id) {
            const admin = await adminModel.findById({ _id: result.id }).lean()

            req.admin = admin       // Can use this value in following next() middleware as a req.admin to get admin details

            console.log(`this value is from verifyToken middleware ${admin._id}`)
            console.log(`this value is from verifyToken middleware ${result.id}`)

            next()
        }
    } catch (error) {
        // console.log("Error: ", error)
        res.status(401).json(
            { message: "You don't have access right for this information"
        
        });

    }
}

const verifyAgentToken = async (req, res, next) => {

    try {
        const token = req.headers.authorization.split(" ")[1]
        
        console.log(`This is the token value ${token}`)


        if (!token) {
            return res.status(403).json({
                message: "No token provided"
            });
        }

        const result = jwt.verify(token, config.secret)

        if (result.id) {
            const admin = await adminModel.findById({ _id: result.id }).lean()

            req.admin = admin       // Can use this value in following next() middleware as a req.admin to get admin details

            console.log(`this value is from verifyToken middleware ${admin._id}`)
            console.log(`this value is from verifyToken middleware ${result.id}`)

            next()
        }
    } catch (error) {
        // console.log("Error: ", error)
        res.status(401).json(
            { message: "You don't have access right for this information"
        
        });

    }
}

module.exports = { verifyUserToken, verifyAdminToken, verifyAgentToken }