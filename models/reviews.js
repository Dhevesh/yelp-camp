const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    text: String,
    rating: { type : Number, default : 0 },
    author: {
        id: { type : mongoose.Schema.Types.ObjectId, ref: "User" },
        name: String
    },
    dateAdded: { type : Date, default : Date.now },
    dateUpdated: Date
});

module.exports = mongoose.model("Review", reviewSchema);