// We are adding all of the routes to the express "router" variable and then exporting that variable.
var express = require("express");
var router  = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");          // Don't need to specify the js file because it is called "index.js", which is default.

// ROOT
router.get("/", function (req, res) {
    Campground.find({}, function (error, allCampgrounds) {
        if (error) {
            console.log(error);
        } else {
            res.render("campgrounds/index.ejs", { campgrounds: allCampgrounds });
        }
    });
});

// NEW
router.get("/new", middleware.isLoggedIn, function (req, res) {
    res.render("campgrounds/new.ejs");
});

// CREATE
router.post("/", middleware.isLoggedIn, function (req, res) {
    // Get data from form and add to campgrounds array.
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };

    var newCampground = { name: name, image: image, description: description, author: author };

    Campground.create(newCampground, function (error, newlyCreated) {
        if (error) {
            console.log(error);
        } else {
            res.redirect("/campgrounds");
        }
    });
});

// SHOW
router.get("/:id", function (req, res) {
    Campground.findById(req.params.id).populate("comments").exec(function (error, foundCampground) {
        if (error) {
            console.log(error);
        } else {
            res.render("campgrounds/show.ejs", { campground: foundCampground });
        }
    });
});

// EDIT
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findById(req.params.id, function (error, foundCampground) {
        if (error) {
            res.redirect("/campgrounds");
        } else {
            res.render("campgrounds/edit.ejs", { campground: foundCampground });
        }
    });
});

// UPDATE
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground) {
        if(err){
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

// DESTROY
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findByIdAndRemove(req.params.id, function (err) {
        if (err) {
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds");
        }
    });
});

module.exports = router;