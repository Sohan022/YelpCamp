var express = require("express");
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    methodOverride = require("method-override"),
    flash = require("connect-flash"),
    passport = require("passport"),
    localStrategy = require("passport-local"),
    User = require("./models/user"),
    Campground = require("./models/campground"),
    Comment = require("./models/comment");
    moment = require("moment");

var campgroundRoutes = require("./routes/campgrounds"),
    commentRoutes = require("./routes/comments"),
    indexRoutes = require("./routes/index")

app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
mongoose.connect("mongodb://localhost/yelp_camp_v8",{useNewUrlParser:true, useUnifiedTopology:true});
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
// app.locals.moment = require('moment');
mongoose.set('useFindAndModify', false);

app.use(require("express-session")({
    secret:"Once again Rusty is the cutest dog.",
    resave:false,
    saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);
app.use(indexRoutes);


app.listen(3000,function(){
    console.log("YelpCamp has Started...");
});