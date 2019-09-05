const express = require("express");
const router = express.Router({ mergeParams : true});

const Campground = require("../models/campgrounds");
const Review = require("../models/reviews");
const isAuthUser = require("../controllers/user-auth");

// REVIEW CREATE ROUTE
router.get("/new",isAuthUser.isLoggedIn, (req,res)=>{
	Campground.findById(req.params.id,(err,foundCampground)=>{
		if (!err){
			res.render("reviews/new",{campground:foundCampground});
		} else{
			console.log("could not find campground");
			console.log(err);
		}
	});
});

// REVIEW POST ROUTE
router.post("/",isAuthUser.isLoggedIn,(req,res)=>{
	Campground.findById(req.params.id,(err,foundCampground)=>{
		if (!err){
            console.log(req.body.review);
			Review.create(req.body.review, (err, newReview)=>{
				if (!err){
                    newReview.author.id = req.user._id;
                    newReview.author.name = req.user.alias;
                    newReview.save();
					console.log(newReview);
					foundCampground.reviews.push(newReview);
					foundCampground.save();
					
				} else{
					console.log(err);
				}
			});
			res.redirect("/campgrounds/"+foundCampground._id)
		} else{
			req.flash("error", "Unable to add review.");
			console.log(err);
			res.redirect("/campgrounds");
		}
	});
});

// REVIEW EDIT ROUTE
router.get("/:review_id/edit", isAuthUser.isCommAuth, (req, res)=>{
	Review.findById(req.params.review_id, (err, foundReview)=>{
		res.render("reviews/edit", { campground_id : req.params.id, review : foundReview });
	});
});

router.put("/:review_id", isAuthUser.isCommAuth, (req, res)=>{
	Review.findByIdAndUpdate(req.params.review_id, req.body.review, (err, updatedReview)=>{
		if (!err){
			res.redirect("/campgrounds/" + req.params.id);
		} else {
			res.redirect("back");
		}
	});
});

// REVIEW DELETE ROUTE
router.delete("/:review_id", isAuthUser.isCommAuth, (req, res)=>{
	Review.findByIdAndDelete(req.params.review_id, (err, deletedReview)=>{
		if (!err){
			Campground.findById(req.params.id, function(err, foundCampground){
				if (!err){
					foundCampground.reviews.pull(deletedReview.id);
					foundCampground.save();
				} else {
					console.log(err);
					res.redirect("back");
				}
			});
			req.flash("info", "Review deleted!");
			res.redirect("/campgrounds/" + req.params.id);
		} else {
			res.redirect("back");
		}
	});
});


module.exports = router;