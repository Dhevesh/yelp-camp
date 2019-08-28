const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const methodOverride = require("method-override");
const flash = require("connect-flash");

const User = require("./models/users");
const seed = require("./seed"); //for testing purposes. seed the db with dummy data.
const indexRoutes = require("./controllers/index");
const campgroundRoutes = require("./controllers/campgrounds");
const commentRoutes = require("./controllers/comments");
const profileRoutes = require("./controllers/profile");

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

var dbUrl = process.env.DATABASEURL || "mongodb://localhost:27017/yelp_camp_db";
mongoose.connect(dbUrl, {useNewUrlParser: true});



// PASSPORT CONFIGURATION
app.use(require("express-session")({
	secret: "mySimpleSecret",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Adding useraccount on all routes
app.use((req,res,next)=>{
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	res.locals.info = req.flash("info");
	next();
});

// Setting up routes
app.use("/", indexRoutes);
app.use("/user", profileRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);


// all other routes
app.get("*",(req,res)=>{
	res.render("errorpage");
});

// Server Listener
app.listen(process.env.PORT, process.env.IP, ()=>{
	console.log("Yelp Camp started on port 3000");
});