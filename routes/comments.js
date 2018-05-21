// We are adding all of the routes to the express "router" variable and then exporting that variable.
var express = require("express");
var router = express.Router({ mergeParams: true });
var Campground = require("../models/campground");
var Comment = require("../models/comment");

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

                    res.redirect("/campgrounds/" + campground._id);
                }
            });
        }
    });
});

// EDIT
router.get("/:comment_id/edit", checkCommentOwnership, function (req, res) {
    Comment.findById(req.params.comment_id, function (error, foundComment) {
        if (error) {
            res.redirect("back");
        } else {
            res.render("comments/edit.ejs", { campground: req.params.id, comment: foundComment });
        }
    });
});

// UPDATE
router.put("/:comment_id", checkCommentOwnership, function (req, res) {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function (err, updatedComment) {
        if (err) {
            res.redirect("back");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

// DESTROY
router.delete("/:comment_id", checkCommentOwnership, function (req, res) {
    Comment.findByIdAndRemove(req.params.comment_id, function (err) {
        if (err) {
            res.redirect("back");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
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

// Check if the user is logged in and owns the comment.
function checkCommentOwnership(req, res, next) {
    if (req.isAuthenticated()) {

        Comment.findById(req.params.comment_id, function (error, foundComment) {
            if (error) {
                res.redirect("back");
            } else {

                if (foundComment.author.id.equals(req.user._id)) {
                    return next();
                } else {
                    res.redirect("back");
                }

            }
        });

    } else {
        res.redirect("back");
    }
}

module.exports = router;