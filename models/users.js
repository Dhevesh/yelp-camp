const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: String,
    password: String,
    role: { type : String, default : "member" },
    created: { type : Date, default : Date.now },
    fName: String,
    lName: String,
    alias: String,
    dateOfBirth: Date,
    gender: String,
    profilePicUrl: String,
    coverImageUrl: String,
    about: String,
    phone: String,
    country: String,
    interests: String,
    posts: [{
        id: { type : mongoose.Schema.Types.ObjectId, ref: "Campground" }
    }],
    reviews: [{
        id: { type : mongoose.Schema.Types.ObjectId, ref: "Review" }
    }],
    comments: [{
        id: { type : mongoose.Schema.Types.ObjectId, ref: "Comment" }
    }]

});

userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User", userSchema);