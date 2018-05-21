var Campground = require("../models/campground");
var Comment = require("../models/comment");

// Middleware for authentication and authorization.
var middlewareObj = {};

// Middleware for authentication.
middlewareObj.isLoggedIn = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "You need to be logged in to do that.");         // This will create a flash message that is used in the next route call.
    res.redirect("/login");
}

// Check if the user is logged in and owns the campground post.
middlewareObj.checkCampgroundOwnership = function(req, res, next) {
    if (req.isAuthenticated()) {

        Campground.findById(req.params.id, function (error, foundCampground) {
            if (error) {
                req.flash("error", "Campground not found.");
                res.redirect("back");
            } else {

                if (foundCampground.author.id.equals(req.user._id)) {
                    return next();
                } else {
                    req.flash("error", "You don't have permission to do that.");
                    res.redirect("back");
                }

            }
        });

    } else {
        req.flash("error", "You need to be logged in to do that.");
        res.redirect("back");
    }
}

// Check if the user is logged in and owns the comment.
middlewareObj.checkCommentOwnership = function(req, res, next) {
    if (req.isAuthenticated()) {

        Comment.findById(req.params.comment_id, function (error, foundComment) {
            if (error) {
                res.redirect("back");
            } else {

                if (foundComment.author.id.equals(req.user._id)) {
                    return next();
                } else {
                    req.flash("error", "You don't have permission to do that.");
                    res.redirect("back");
                }

            }
        });

    } else {
        req.flash("error", "You need to be logged in to do that.");
        res.redirect("back");
    }
}

module.exports = middlewareObj;