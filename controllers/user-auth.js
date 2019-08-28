// all user authorisation middleware
const Campground = require("../models/campgrounds");
const Comment = require("../models/comments");
const UserProfile = require("../models/user-profile");
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
        Campground.findById(req.params.id, (err, foundCampground)=>{
            if (foundCampground.author.id.equals(req.user._id)){
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
			if (foundComment.author.id.equals(req.user._id)){
				return next();
			} else {
				req.flash("error", "You don't have permission to do that!");
			}
		});
	} else {
		req.flash("error", "You need to login first!");
		res.redirect("back");
	}
};

middlewareObj.isUserProfile = function(req, res, next){
	if (req.isAuthenticated()){
		if (req.params.id == req.user._id){
			return next();
		} else {
			res.redirect("/user/" + req.user._id);
		}
	} else{
		res.redirect("/login");
	}
};
module.exports = middlewareObj;