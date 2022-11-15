const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Schema for user, userId have relation to userModel _id
const paymentSchema = new Schema(
    {
       userId: {
            type: mongoose.Types.ObjectId,
            ref: "User"
        },
        telephone: { type: Number, require: true },
        amount: { type: Number, require: true },
        comments: {type: String},
        paidon: { type: Date }
    }
);

const paymentModel = mongoose.model("Payment", paymentSchema);

module.exports = paymentModel;   // payment export
