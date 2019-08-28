const express = require("express");
const router = express.Router();

const Campground = require("../models/campgrounds");
const isAuthUser = require("../controllers/user-auth");

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
            newCampground.author.name = req.user.username;
            newCampground.save();
			res.redirect("campgrounds/new");
		}else{
			console.log("error");
			console.log(err);
			res.redirect("/errorpage");
		}
	});
	
});

// SHOW - shows more info about one campground

router.get("/:id",(req,res)=>{
	Campground.findById(req.params.id).populate("comments").exec((err,result)=>{
		if (!err){
			res.render("campgrounds/show",{campground:result});		
		}else{
			console.log("campground not found");
			console.log(err);
		}
	});
	
});

// EDIT ROUTE
router.get("/:id/edit", isAuthUser.isCampAuth, (req,res)=>{
	Campground.findById(req.params.id, (err, foundCampground)=>{
		if ("err"){
			res.render("campgrounds/edit", { campground : foundCampground });		
		} else {
			res.redirect("/campgrounds");
		}
	});
});

// UPDATE ROUTE
router.put("/:id", isAuthUser.isCampAuth, (req,res)=>{
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCampground)=>{
		if (!err){
			res.redirect("/campgrounds/" + req.params.id);
		} else{ 
			console.log(err);
			res.redirect("back");
		}
	});
});

// DELETE ROUTE
router.delete("/:id/delete", isAuthUser.isCampAuth, (req,res)=>{
	Campground.findById(req.params.id, (err, campground)=>{
		if (!err){
			campground.remove();
			res.redirect("/campgrounds");
		} else {
			console.log(err);
			res.redirect("back");
		}
	});
});

module.exports = router;