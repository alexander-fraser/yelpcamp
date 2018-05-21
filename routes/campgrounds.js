// We are adding all of the routes to the express "router" variable and then exporting that variable.
var express = require("express");
var router  = express.Router();
var Campground = require("../models/campground");

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

// CREATE
router.post("/", isLoggedIn, function (req, res) {
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

// NEW
router.get("/new", isLoggedIn, function (req, res) {
    res.render("campgrounds/new.ejs");
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

// Middleware for authentication.
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

module.exports = router;