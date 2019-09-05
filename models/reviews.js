const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    text: String,
    rating: Number,
    author: {
        id: { type : mongoose.Schema.Types.ObjectId, ref: "User" },
        name: String
    },
    dateAdded: { type : Date, default : Date.now },
    dateUpdated: Date
});

module.exports = mongoose.model("Review", reviewSchema);