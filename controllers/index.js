const express = require("express");
const router = express.Router();
const passport = require("passport");

const User = require("../models/users");
const Campground = require("../models/campgrounds");

// INDEX
router.get("/",(req,res)=>{
	Campground.find({}).sort({dateAdded : -1}).exec(function(err, foundCampgrounds){
		if (!err){
			var images = [];
			var topRated = [];
			foundCampgrounds.forEach((campground)=>{
				images.push(campground.image);
				topRated.push(campground); // currently returns all rating. could be changed to only return rating of a certain value eg. only 4 or 5 star campgrounds
			});
			topRated.sort((a,b)=>(a.rating > b.rating)?-1:1);
			res.render("index", {campgrounds : foundCampgrounds, images : images, topRated : topRated});
		}
	});
	
});

// AUTH ROUTES
// REGISTER ROUTE
router.get("/register",(req,res)=>{
	res.render("register");
});
// handle sign up logic
router.post("/register",(req,res)=>{
	User.register(new User({username: req.body.username}), req.body.password, (err,user)=>{
		if (!err) {
			passport.authenticate("local")(req, res, ()=>{
				req.flash("success", "Welcome to Yelp Camp! " + user.username);
				res.redirect("/user/"+user._id+"/edit");
			});
		} else {
			req.flash("error", err.message);
			return res.redirect("/register");
		}
	});
});

// LOGIN ROUTES
router.get("/login", (req,res)=>{
	res.render("login");
});
// handling login logic
router.post("/login", function(req, res, next) { 
	passport.authenticate('local', function(err, user, info) {
		if (err) { return next(err); }
		if (!user) { 
			req.flash("error", "Invalid username or password"); 
			return res.redirect("/login"); 
		}
		req.logIn(user, function(err) {
		  if (err) { return next(err); }
		  var redirectTo = req.session.redirectTo ? req.session.redirectTo : '/campgrounds';
		  delete req.session.redirectTo;
		  res.redirect(redirectTo);
		});
	  })(req, res, next);
	});

// LOGOUT
router.get("/logout",(req,res)=>{
	req.logout();
	req.flash("logout", "You have successfully logged out.");
	res.redirect("/");
});

module.exports = router;