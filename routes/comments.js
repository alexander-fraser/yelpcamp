// We are adding all of the routes to the express "router" variable and then exporting that variable.
var express = require("express");
var router = express.Router({ mergeParams: true });
var Campground = require("../models/campground");
var Comment = require("../models/comment");

// COMMENT CREATE
router.post("/", isLoggedIn, function (req, res) {
    Campground.findById(req.params.id, function (error, campground) {
        if (error) {
            console.log(error);
            res.redirect("/campgrounds");
        } else {
            Comment.create(req.body.comment, function (err, comment) {
                if (err) {
                    console.log(err);
                } else {
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();

                    campground.comments.push(comment);
                    campground.save();

                    console.log(comment);
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
        }
    });
});

// COMMENT NEW
router.get("/new", isLoggedIn, function (req, res) {
    Campground.findById(req.params.id, function (error, campground) {
        if (error) {
            console.log(error);
        } else {
            res.render("comments/new.ejs", { campground: campground });
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