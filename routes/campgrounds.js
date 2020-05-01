var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");

router.get("/",function(req,res){
    Campground.find({},function(err,allCampgrounds){
        if(err){
            console.log(err);
        } else{
            res.render("campgrounds/index",{campgrounds:allCampgrounds,currentUser:req.user}); 
        }
    });
});

router.post("/",middleware.isLoggedIn,function(req,res){
    var author = {
        id : req.user._id,
        username: req.user.username
    }
    newCampground = {name:req.body.name, src:req.body.image, price:req.body.price, description:req.body.description, author:author, date:moment().format('MMMM Do YYYY')};
    Campground.create(newCampground,function(err,newlyCampround){
        if(err){
            console.log(err);
        } else{
            res.redirect("/campgrounds");
        }
    });
});

router.get("/new",middleware.isLoggedIn,function(req,res){
    res.render("campgrounds/new");
});

router.get("/:id",function(req,res){
    Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
        if(err || !foundCampground){
            req.flash("error","Campground not found");
            res.redirect("back");
        } else{
            Campground.find({},function(err,allCampgrounds){
                if(err){
                    console.log(err);
                } else{
                    res.render("campgrounds/show",{campground:foundCampground,campgrounds:allCampgrounds}); 
                }
            });  
        }
    });
    
});

router.get("/:id/edit",middleware.checkOwner,function(req,res){
    Campground.findById(req.params.id,function(err,foundCampground){
        res.render("campgrounds/edit",{campground:foundCampground});
    });
});

router.put("/:id",middleware.checkOwner,function(req,res){
    Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,updatedCampground){
        if(err){
            res.redirect("/campgrounds");
        } else{
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

router.delete("/:id",middleware.checkOwner,function(req,res){
    Campground.findByIdAndRemove(req.params.id,function(err){
        res.redirect("/campgrounds");
    });
});

module.exports = router;