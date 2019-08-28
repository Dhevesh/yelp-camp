const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const profileSchema = new Schema ({
    fName: String,
    lName: String,
    dateOfBirth: Date,
    gender: String,
    profilePicUrl: String,
    about: String,
    phone: String,
    country: String,
    interests: String,
    userId: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    }

});


module.exports = mongoose.model("UserProfile", profileSchema);