const mongoose = require("mongoose");
const contactSchema = mongoose.Schema(
    {
    user_id:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:"User"
    },
    name: {
        type: String,
        required: [true, "Pls add your cantact name"],
        trim: true,
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        trim: true,
    },
    phone: {
        type: String,
        required: [true, "Phone is required"],
        trim: true,
        }
    }, {
        timestamps: true
});

module.exports = mongoose.model("Contact", contactSchema);
