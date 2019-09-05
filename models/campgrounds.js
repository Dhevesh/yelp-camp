const mongoose = require("mongoose");

const Comment = require('../models/comments');

// SCHEMA SETUP
const campgroundSchema = new mongoose.Schema({
	name: String,
	image: String,
	description: String,
	price: Number,
	dateAdded: { type: Date, default : Date.now},
	reviews: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: "Review"
	}],
	comments: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: "Comment"
	}],
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		name: String
	},
	likes: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: "User"
	}],
	dislikes: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: "User"
	}]

});

campgroundSchema.pre('remove', async function(next) {
	try{
		await Comment.remove({
			_id: {
				$in: this.comments
			}
		});
		next();

	} catch(err) {
		next(err);
	}
});

module.exports = mongoose.model("Campground", campgroundSchema);