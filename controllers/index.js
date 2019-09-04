const express = require("express");
const router = express.Router();
const passport = require("passport");

const User = require("../models/users");
const isAuthUser = require("../controllers/user-auth");

// INDEX
router.get("/",(req,res)=>{
	res.render("index");
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
			return res.render("register");
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
		if (!user) { return res.redirect('/login'); }
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
	req.flash("success", "You have successfully logged out.");
	res.redirect("/");
});

module.exports = router;