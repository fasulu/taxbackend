const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Schema for user, _id has relationship with paymentModel as userId
const userSchema = new Schema(
    {
        surname: { type: String, require: true },
        firstname: { type: String, require: true },
        dateofbirth: { type: Date },
        address_personal: { type: String, max: 200 },
        address_activity: { type: String, max: 200 },
        telephone: { type: Number, unique: true, require: true },
        email: { type: String, unique: true, require: true },
        password: { type: String, require: true, min: 6, max: 15 },
        activity_communeID: {
            type: mongoose.Types.ObjectId,
            ref: "Commune"
        },
        activityID: {
            type: mongoose.Types.ObjectId,
            ref: "Activity"
        },
        status: { type: String, require: true, default: "inactive" },
        created: { type: Date, default: Date.now }
    }
);

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;   // userModel export