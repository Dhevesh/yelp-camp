const express = require("express");
const router = express.Router();

const user = require("../models/users")
const campgrounds = require("../models/campgrounds");
const isAuthUser = require("../controllers/user-auth");

router.get("/:id", (req, res)=>{
    user.findById(req.params.id, (err, foundUser)=>{
        if (!err){
            campgrounds.find((err, foundCampgrounds)=>{
                res.render("profile/show", {user: foundUser, posts: foundCampgrounds});
            });
        } else{
            console.log(err);
            res.redirect("/campgrounds");
        }
    });
});

// UPDATE USER ROUTES

router.get("/:id/edit", isAuthUser.isUserProfile, (req, res)=>{
    user.findById(req.params.id, (err, foundUser)=>{
        if (!err){
            var getUrl = req.session.redirect;
            delete req.session.redirect;
            res.render("profile/edit", {user: foundUser, url : getUrl});
        }
    });
});

router.put("/:id/edit", isAuthUser.isUserProfile, (req, res)=>{
    user.findByIdAndUpdate(req.params.id, req.body.profile, (err, updatedUser)=>{
        if (!err){
            res.redirect("/user/" + req.user._id);
        } else{
            console.log(err);
            res.redirect("back");
        }
    });
});

module.exports = router;
