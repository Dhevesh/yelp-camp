const express = require("express");
const router = express.Router();

const users = require("../models/users")
const userProfile = require("../models/user-profile");
const isAuthUser = require("../controllers/user-auth");

router.get("/:id", isAuthUser.isUserProfile, (req, res)=>{
    userProfile.findOne({"userId.id": req.params.id}, (err, foundUser)=>{
        if (!err){
            res.render("profile/show", {user: foundUser});
        }
    });
});

// NEW PROFILE ROUTES
router.get("/:id/new", isAuthUser.isLoggedIn, (req, res)=>{
    res.render("profile/new");
});

router.post("/:id/new", isAuthUser.isLoggedIn, (req, res)=>{
    userProfile.create(req.body.profile, (err, newUserProfile)=>{
        if (!err){
            newUserProfile.userId.id = req.user._id;
            newUserProfile.save();
            res.redirect("/campgrounds");
        } else{
            console.log(err);
        }
    });
    
});

// UPDATE USER ROUTES

router.get("/:id/edit", isAuthUser.isUserProfile, (req, res)=>{
    userProfile.findOne({"userId.id": req.params.id}, (err, foundUser)=>{
        if (!err){
            res.render("profile/edit", {user: foundUser});
        }
    });
});

router.put("/:id/edit", isAuthUser.isUserProfile, (req, res)=>{
    console.log(req.params.id);
    userProfile.findOne({"userId.id": req.params.id}, (err, foundUser)=>{
        if (!err){
            userProfile.findOneAndUpdate({"userId.id": req.params.id}, req.body.profile, (err, updatedUser)=>{
                if (!err){
                    res.redirect("/user/" + req.user._id);
                } else{
                    console.log(err);
                    res.redirect("back");
                }
            });
        } else {
            console.log(err);
            res.redirect("back");
        }
    });
});

module.exports = router;
