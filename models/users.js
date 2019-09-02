const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: String,
    password: String,
    created: { type : Date, default : Date.now }
});

userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User", userSchema);