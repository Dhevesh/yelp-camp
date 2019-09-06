// all user authorisation middleware
const Campground = require("../models/campgrounds");
const Comment = require("../models/comments");
const Review = require("../models/reviews");
var middlewareObj = {};

// user logged in
middlewareObj.isLoggedIn = function(req, res, next){
	if (req.isAuthenticated()){
		return next();
	}
	req.session.redirectTo = req.originalUrl;
	req.flash("error", "You need to log in first");
	res.redirect("/login");
};

// campground author
middlewareObj.isCampAuth = function(req, res, next){
    if (req.isAuthenticated()){
        Campground.findOne({slug: req.params.slug}, (err, foundCampground)=>{
            if (foundCampground.author.id.equals(req.user._id) || req.user.role =="admin"){
                return next();
            } else {
				req.flash("error", "You don't have permission to do that!");
                res.redirect("/");
            }
        });
    }
}

//comment author
middlewareObj.isCommAuth = function(req, res, next){
	if (req.isAuthenticated()){
		Comment.findById(req.params.comment_id, (err, foundComment)=>{
			if (foundComment.author.id.equals(req.user._id) || req.user.role =="admin"){
				return next();
			} else {
				req.flash("error", "You don't have permission to do that!");
			}
		});
	} else {
		req.session.redirectTo = req.originalUrl;
		req.flash("error", "You need to login first!");
		res.redirect("back");
	}
};

//review author
middlewareObj.isReviewAuth = function(req, res, next){
	if (req.isAuthenticated()){
		Review.findById(req.params.review_id, (err, foundReview)=>{
			if (foundReview.author.id.equals(req.user._id) || req.user.role =="admin"){
				return next();
			} else {
				req.flash("error", "You don't have permission to do that!");
			}
		});
	} else {
		req.session.redirectTo = req.originalUrl;
		req.flash("error", "You need to login first!");
		res.redirect("back");
	}
};

middlewareObj.isUniqueReview = function(req, res, next){
	if (req.isAuthenticated()){
		Campground.findById(req.params.id).populate("reviews").exec((err, foundCampground)=>{
			if (!err){
				var isReviewed = foundCampground.reviews.some(function(review){
					return review.author.id.equals(req.user._id);
				});
			} else {
				console.log (err);
			}
			if (isReviewed){
				req.flash("error", "You have already submitted a review for this post.");
				res.redirect("/campgrounds/" + req.params.id);
			} else{
				return next();
			}
		});
	} else {
		req.session.redirectTo = req.originalUrl;
		req.flash("error", "You need to login first!");
		res.redirect("back");
	}
}

middlewareObj.isUserProfile = function(req, res, next){
	if (req.isAuthenticated()){
		if (req.params.id == req.user._id || req.user.role =="admin"){
			return next();
		} else {
			res.redirect("/user/" + req.user._id);
		}
	} else{
		req.session.redirectTo = req.originalUrl;
		req.flash("error", "You need to login first!");
		res.redirect("/login");
	}
};
module.exports = middlewareObj;