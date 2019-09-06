const express = require("express");
const router = express.Router({ mergeParams : true});

const User = require("../models/users");
const Campground = require("../models/campgrounds");
const Review = require("../models/reviews");
const isAuthUser = require("../controllers/user-auth");

// REVIEW CREATE ROUTE
router.get("/new",isAuthUser.isUniqueReview, (req,res)=>{
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
router.post("/",isAuthUser.isUniqueReview,(req,res)=>{
	Campground.findById(req.params.id).populate("reviews").exec(function (err,foundCampground){
		if (!err){
			Review.create(req.body.review, (err, newReview)=>{
				if (!err){
                    newReview.author.id = req.user._id;
                    newReview.author.name = req.user.alias;
                    newReview.save();
					foundCampground.reviews.push(newReview);
					foundCampground.rating = calculateAverage(foundCampground.reviews);
					foundCampground.save();
					User.findById(req.user._id, (err, foundUser)=>{
						if (!err){
							foundUser.reviews.push(newReview._id);
							foundUser.save();
							req.flash("Thank you for adding a review");
							res.redirect("/campgrounds/"+foundCampground._id);
						} else {
							return res.redirect("/campgrounds/" + req.params.id);
						}
					});
					
				} else{
					console.log(err);
				}
			});
		} else{
			req.flash("error", "Unable to add review.");
			console.log(err);
			res.redirect("/campgrounds");
		}
	});
});

// REVIEW EDIT ROUTE
router.get("/:review_id/edit", isAuthUser.isReviewAuth, (req, res)=>{
	Review.findById(req.params.review_id, (err, foundReview)=>{
		res.render("reviews/edit", { campground_id : req.params.id, review : foundReview });
	});
});

router.put("/:review_id", isAuthUser.isReviewAuth, (req, res)=>{
	Review.findByIdAndUpdate(req.params.review_id, req.body.review, (err, updatedReview)=>{
		if (!err){
			Campground.findById(req.params.id).populate("reviews").exec(function (err, foundCampground){
				if (!err){
					foundCampground.rating = calculateAverage(foundCampground.reviews);
					foundCampground.save();
					req.flash("success", "You updated your review.");
					res.redirect("/campgrounds/" + req.params.id);

				} else {
					console.log(err);
					return res.redirect("back");
				}
			});
		} else {
			res.redirect("back");
		}
	});
});

// REVIEW DELETE ROUTE
router.delete("/:review_id", isAuthUser.isReviewAuth, (req, res)=>{
	Review.findByIdAndDelete(req.params.review_id, (err, deletedReview)=>{
		if (!err){
			Campground.findById(req.params.id).populate("reviews").exec(function (err, foundCampground){
				if (!err){
					foundCampground.reviews.pull(deletedReview.id);
					foundCampground.rating = calculateAverage(foundCampground.reviews);
					foundCampground.save();
					User.findById(req.user._id, (err, foundUser)=>{
						if (!err){
							foundUser.reviews.pull(deletedReview.id);
							foundUser.save();
							req.flash("info", "Review deleted!");
							res.redirect("/campgrounds/" + req.params.id);
						}
					});
					
				} else {
					console.log(err);
					res.redirect("back");
				}
			});
		} else {
			res.redirect("back");
		}
	});
});

function calculateAverage(reviews) {
    if (reviews.length === 0) {
        return 0;
    }
    var sum = 0;
    reviews.forEach(function (element) {
        sum += element.rating;
    });
    return sum / reviews.length;
}


module.exports = router;