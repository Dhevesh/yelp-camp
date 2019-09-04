const express = require("express");
const router = express.Router({ mergeParams : true});

const Campground = require("../models/campgrounds");
const Comment = require("../models/comments");
const isAuthUser = require("../controllers/user-auth");

// COMMENTS ROUTES
// COMMENT CREATE ROUTE
router.get("/new",isAuthUser.isLoggedIn,(req,res)=>{
	Campground.findById(req.params.id,(err,foundCampground)=>{
		if (!err){
			res.render("comments/new",{campground:foundCampground});
		} else{
			console.log("could not find campground");
			console.log(err);
		}
	});
});

// COMMENT POST ROUTE
router.post("/",isAuthUser.isLoggedIn,(req,res)=>{
	Campground.findById(req.params.id,(err,foundCampground)=>{
		if (!err){
			Comment.create(req.body.comment, (err, newComment)=>{
				if (!err){
                    newComment.author.id = req.user._id;
                    newComment.author.name = req.user.username;
                    newComment.save();
					console.log(newComment);
					foundCampground.comments.push(newComment);
					foundCampground.save();
					
				} else{
					console.log(err);
				}
			})
			res.redirect("/campgrounds/"+foundCampground._id)
		} else{
			req.flash("error", "Unable to add comment.");
			console.log(err);
			res.redirect("/campgrounds");
		}
	});
});

// COMMENT EDIT ROUTE
router.get("/:comment_id/edit", isAuthUser.isCommAuth, (req, res)=>{
	Comment.findById(req.params.comment_id, (err, foundComment)=>{
		res.render("comments/edit", { campground_id : req.params.id, comment : foundComment });
	});
});

router.put("/:comment_id", isAuthUser.isCommAuth, (req, res)=>{
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment)=>{
		if (!err){
			res.redirect("/campgrounds/" + req.params.id);
		} else {
			res.redirect("back");
		}
	});
});

// COMMENT DELETE ROUTE
router.delete("/:comment_id", isAuthUser.isCommAuth, (req, res)=>{
	Comment.findByIdAndDelete(req.params.comment_id, (err, deletedComment)=>{
		if (!err){
			Campground.findById(req.params.id, function(err, foundCampground){
				if (!err){
					foundCampground.comments.pull(deletedComment.id);
					foundCampground.save();
				} else {
					console.log(err);
					res.redirect("back");
				}
			});
			req.flash("info", "Comment deleted!");
			res.redirect("/campgrounds/" + req.params.id);
		} else {
			res.redirect("back");
		}
	});
});


module.exports = router;