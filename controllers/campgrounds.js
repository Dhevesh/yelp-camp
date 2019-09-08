const express = require("express");
const router = express.Router();

const Campground = require("../models/campgrounds");
const isAuthUser = require("../controllers/user-auth");
const User = require("../models/users");

router.get("/",(req,res)=>{
	Campground.find((err,result)=>{
		if (!err){
			res.render("campgrounds/campgrounds",{campground:result});
		}else{
			console.log("Unable to find campgrounds");
			console.log(err);
			res.redirect("/erropage");
		}
	});
});

// NEW - Displays a form to add new campgrounds
router.get("/new",isAuthUser.isLoggedIn,(req,res)=>{
	res.render("campgrounds/new.ejs");
});

//  CREATE
router.post("/",isAuthUser.isLoggedIn,(req,res)=>{
	Campground.create(req.body.campground, (err,newCampground)=>{
		if (!err){
            newCampground.author.id = req.user._id;
            newCampground.author.name = req.user.alias;
			newCampground.save();
			User.findById(req.user._id, (err, foundUser)=>{
				if (!err){
					foundUser.posts.push(newCampground._id);
					foundUser.save();
				} else { return next();}
			});
			req.flash("info","Campground added");
			res.redirect("campgrounds/new");
		}else{
			console.log("error");
			console.log(err);
			res.redirect("/errorpage");
		}
	});
	
});

// SHOW - shows more info about one campground

router.get("/:slug",(req,res)=>{
	User.find((err, foundUsers)=>{
		if (!err){
			Campground.findOne({slug: req.params.slug}).populate("reviews").exec((err,result)=>{
				if (!err){
					res.render("campgrounds/show",{campground:result, author : foundUsers});		
				}else{
					console.log("campground not found");
					console.log(err);
					res.redirect("/campgrounds");
				}
			});
		} else {
			console.log(err);
			res.redirect("/campgrounds");
		}
	})
	
});

// EDIT ROUTE
router.get("/:slug/edit", isAuthUser.isCampAuth, (req,res)=>{
	Campground.findOne({slug: req.params.slug}, (err, foundCampground)=>{
		if ("err"){
			res.render("campgrounds/edit", { campground : foundCampground });		
		} else {
			res.redirect("/campgrounds");
		}
	});
});

// UPDATE ROUTE
router.put("/:slug", isAuthUser.isCampAuth, (req,res)=>{
	Campground.findOneAndUpdate({slug : req.params.slug}, req.body.campground, (err, updatedCampground)=>{
		if (!err){
			res.redirect("/campgrounds/" + req.params.slug);
		} else{ 
			console.log(err);
			res.redirect("back");
		}
	});
});

// DELETE ROUTE
router.delete("/:slug/delete", isAuthUser.isCampAuth, (req,res)=>{
	Campground.findOne({slug : req.params.slug}, (err, campground)=>{
		if (!err){
			User.findById(req.user._id, (err, foundUser)=>{
				if (!err){
					var foundPost = foundUser.posts.some(function (postId) {
						return postId.equals(campground.slug);
					});
					if (foundPost){
						foundUser.posts.pull(campground._id); //NEEDS TO BE REFACTORED TO ACCOUNT FOR ADMIN USER DELETING THE POST
					}
					foundUser.save();
					campground.remove();
					res.redirect("/campgrounds");
				} else{
					res.redirect("/campgrounds");
				}
			});
		} else {
			console.log(err);
			res.redirect("back");
		}
	});
});


/*BELOW NEEDS TO BE REFACTORED TO WORK IF A USER TRIES TO LIKE OR DISLIKE WHILST NOT LOGGED IN
CURRENTLY YOU ARE REDIRECTED TO THE LOGIN PAGE ONCE YOU LOGIN YOU LIKE OR DISLIKE IS NOT COUNTED AND YOU HAVE TO
PRESS THE BUTTON AGAIN */
// LIKE ROUTE
router.get("/:slug/like", (req, res)=>{
	res.redirect("/campgrounds/" + req.params.slug);
});
router.post("/:slug/like", isAuthUser.isLoggedIn, (req, res)=>{
	Campground.findOne({slug : req.params.slug}, (err, foundCampground)=>{
		if (!err){
			var foundUserLike = foundCampground.likes.some(function (like){
				return like.equals(req.user._id);
			});
			var foundUserDislike = foundCampground.dislikes.some(function(dislike){
				return dislike.equals(req.user._id);
			})
			if (foundUserLike){
				foundCampground.likes.pull(req.user._id);
			} else{
				foundCampground.likes.push(req.user._id);
			}
			if (foundUserDislike){
				foundCampground.dislikes.pull(req.user._id);
			} 
			foundCampground.save(function (err){
				if (!err){
					return res.redirect("/campgrounds/" + foundCampground.slug);
				} else{
					console.log(err);
					return res.redirect("/campgrounds");
				}
			});
		} else{
			console.log(err);
			res.redirect("/campgrounds");
		}
	});
});

// DISKLIKE ROUTE
router.get("/:slug/disklike", (req, res)=>{
	res.redirect("/campgrounds" + req.params.slug);
});
router.post("/:slug/dislike", isAuthUser.isLoggedIn, (req, res)=>{
	Campground.findOne({slug : req.params.slug}, (err, foundCampground)=>{
		if (!err){
			var foundUserDislike = foundCampground.dislikes.some(function (like){
				return like.equals(req.user._id);
			});
			var foundUserLike = foundCampground.likes.some(function(like){
				return like.equals(req.user._id);
			});
			if (foundUserDislike){
				foundCampground.dislikes.pull(req.user._id);
			} else{
				foundCampground.dislikes.push(req.user._id);
			}
			if (foundUserLike){
				foundCampground.likes.pull(req.user._id);
			}
			foundCampground.save(function (err){
				if (!err){
					return res.redirect("/campgrounds/" + foundCampground.slug);
				} else{
					console.log(err);
					return res.redirect("/campgrounds");
				}
			});
		} else{
			console.log(err);
			res.redirect("/campgrounds");
		}
	});
});

module.exports = router;