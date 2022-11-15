const express = require('express')
const router = express.Router();

const { paymentValidator, activityPrixValidator } = require('../Middleware/paymentValidation');

const { signupUserValidator } = require('../Middleware/signupUserValidator');

const { signupAdminValidator } = require('../Middleware/signupAdminValidatore');

const { verifyUserToken, verifyAdminToken } = require('../Middleware/verifyToken');

const
    {
        loginUserValidator, userPwdChangeValidator,
        userModificationValidator, communeValidator, emailValidator } = require('../Middleware/userValidator')

const
    {
        getAdminList,
        getAdminTelephoneNum,
        getAdminAdminTelephoneNum,
        getUserTelephoneNumForAdmin,
        addActivity,
        modifyActivity,
        modifyCommune,
        addCommune,
        deleteCommune,
        deleteActivity,
        modificationAgentInfo,
        changeAgentPwd,
        modificationAdminInfo,
        changeAdminPwd,
        deleteAgent,
        requestAdminPassword
    } = require('../Controller/adminController');

const
    {
        signupNewUser,
        login,
        signupNewAdmin,
        loginAdmin } = require('../Controller/authController');       // route auth

const
    {
        getCommuneAccueilInfo,
        getActivityList,
        getCommuneList, 
        getUserEmail,
        getAdminEmail} = require('../Controller/publicController')       // public route

const
    {
        getUserList,
        getUserTelephoneNum,
        modificationUserInfo,
        editUserPassword,
        payment,
        getActivityInfo,
        getCommuneInfo,
        getPaymentByUser,
        getAllUsersPayment,
        setUserStatus,
        modifyActivityAddress,
        requestUserPassword
    } = require('../Controller/privateController');     // private route


router.get("/users", getUserList);        // http://localhost:9001/users     --for all users in the database

router.get("/uemail/:email", emailValidator, getUserEmail);        // http://localhost:9001/uemail/dotnet@msn.com     --find email in user list

router.get("/aemail/:email", emailValidator, getAdminEmail);        // http://localhost:9001/aemail/dotnet@msn.com     --find email in admin list

router.get("/adminusers", verifyAdminToken, getAdminList)   // http://localhost:9001/adminusers  -- for all admin users from database

router.get("/atelephone/:telephone", verifyAdminToken, getAdminTelephoneNum)     // http://localhost:9001/atelephone/248382222    --search by given admin telephone number for admin

router.get("/aatelephone/:telephone", verifyAdminToken, getAdminAdminTelephoneNum)     // http://localhost:9001/aatelephone/248382222    --search by given admin telephone number for another admin

router.get("/uatelephone/:telephone", verifyAdminToken, getUserTelephoneNumForAdmin)     // http://localhost:9001/uatelephone/148381111    --search by given user telephone number for admin

router.get("/utelephone/:telephone", verifyUserToken, getUserTelephoneNum)     // http://localhost:9001/utelephone/148381111    --search by given user telephone number for user

router.get("/homepageinfo/:name", getCommuneAccueilInfo)        // http://localhost:9001/homepageinfo/champs-elysées --base on selected commune 

router.get("/upayment/:telephone", verifyUserToken, getPaymentByUser);     // http://localhost:9001/upayment/148381111  -- give information to user based on selected user by login id

router.get("/apayment/:telephone", verifyAdminToken, getPaymentByUser);     // http://localhost:9001/apayment/148381111  -- give information to admin based on selected user by login id 

router.get("/activities", getActivityList);              // http://localhost:9001/activities    --for all activities in the database

router.get("/activities/:name", getActivityInfo);       // http://localhost:9001/activities/bijoutier     --for prix of selected activity requested by admin   

router.get("/communes", getCommuneList);                 // http://localhost:9001/communes   --for all communes in the database

router.get("/communeinfo/:name", getCommuneInfo);        // http://localhost:9001/communeinfo/Test Commune --base on selected commune 

router.get("/paymentlist", getAllUsersPayment);         // http://localhost:9001/paymentlist --for payment list for all users

router.post("/signup", signupUserValidator, signupNewUser);      // http://localhost:9001/signup     --to signup new user

router.post("/login", loginUserValidator, login);        // http://localhost:9001/login   --to login for registered user

router.post("/apayment", paymentValidator, verifyAdminToken, payment);      // http://localhost:9001/spayment --for make payment for specified used by admin

router.post("/adminsignup", signupAdminValidator, signupNewAdmin)   // http://localhost:9001/adminsignup

router.post("/adminlogin", loginUserValidator, loginAdmin);     // http://localhost:9001/adminlogin

router.put("/modif/:telephone", verifyUserToken, userModificationValidator, modificationUserInfo)     // http://localhost:9001/modif/148381111  modify current user telephone

router.put("/modifpwd/:telephone", verifyUserToken, userPwdChangeValidator, editUserPassword)     // http://localhost:9001/modifpwd/148381111  modify current user pwd

router.put("/userforgetpwd/:telephone", userPwdChangeValidator, requestUserPassword)            // http://localhost:9001/userforgetpwd/148381111  reset current user password

router.put("/adminforgetpwd/:telephone", userPwdChangeValidator, requestAdminPassword)            // http://localhost:9001/adminforgetpwd/248382222  reset current admin password

router.put("/modifyagent/:telephone", userModificationValidator, modificationAgentInfo)     // http://localhost:9001/modifyagent/148381111  modify current agent telephone

router.put("/modifyagentpwd/:telephone", userPwdChangeValidator, changeAgentPwd)     // http://localhost:9001/modifyagentpwd/148381111  modify current agent pwd

router.delete("/deleteagent/:telephone", verifyAdminToken, deleteAgent)     // http://localhost:9001/deleteagent/148381111  delete currently selected agent

router.put("/modifyadmin/:telephone", userModificationValidator, modificationAdminInfo)     // http://localhost:9001/modifyadmin/148381111  modify current admin telephone

router.put("/modifyadminpwd/:telephone", userPwdChangeValidator, changeAdminPwd)     // http://localhost:9001/modifyadminpwd/148381111  modify current agent pwd

router.put("/setstatus/:telephone", verifyAdminToken, setUserStatus)     // http://localhost:9001/setstatus/148381111  modify current user status

router.put("/modifyactaddress/:telephone", verifyAdminToken, modifyActivityAddress)     // http://localhost:9001/modifyactaddress/148381111  modify current user activity address

router.post("/addactivity", verifyAdminToken, activityPrixValidator, addActivity)     // http://localhost:9001/addactivity    add new activity and price

router.put("/modifyactivity/:name", verifyAdminToken, activityPrixValidator, modifyActivity)     // http://localhost:9001/modifyactivit/bijoutier    modify activity price

router.delete("/deleteactivity/:id", verifyAdminToken, deleteActivity)        // http://localhost:9001/deleteactivity/60e34a307e7f396786678127   delete activity from collection

router.post("/addcommune", communeValidator, addCommune)     // http://localhost:9001/addcommune    add new commune

router.put("/modifycommune/:name", communeValidator, modifyCommune)     // http://localhost:9001/modifycommune/antony    modify commune information

router.delete("/deletecommune/:id", verifyAdminToken, deleteCommune)        // http://localhost:9001/deletecommune/60e34a307e7f396786678127   delete commune from user collection

router.all("*", (req, res) => {
    res.status(404).json({
        message: "Request not found"
    })
})

module.exports = router;
