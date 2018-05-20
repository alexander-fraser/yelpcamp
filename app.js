var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    Campground  = require("./models/campground"),
    Comment     = require("./models/comment"),
    seedDB      = require("./seeds");

mongoose.connect("mongodb://localhost/yelp_camp");
app.use(bodyParser.urlencoded( {extended: true} ));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

app.get("/", function (req, res) {
    res.render("landing.ejs");
});

// INDEX
app.get("/campgrounds", function (req, res) {
    Campground.find({}, function(error, allCampgrounds) {
        if (error) {
            console.log(error);
        } else {
            res.render("campgrounds/index.ejs", { campgrounds: allCampgrounds });
        }
    });
});

// CREATE
app.post("/campgrounds", function (req, res) {
    // Get data from form and add to campgrounds array.
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var newCampground = {name: name, image: image, description: description};
    
    Campground.create(newCampground, function (error, newlyCreated) {
        if (error) {
            console.log(error);
        } else {
            res.redirect("/campgrounds");
        }
    });    
});

// NEW
app.get("/campgrounds/new", function(req, res) {
    res.render("campgrounds/new.ejs");
});

// SHOW
app.get("/campgrounds/:id", function (req, res) {
    Campground.findById(req.params.id).populate("comments").exec(function(error, foundCampground) {
        if(error) {
            console.log(error);
        } else {
            res.render("campgrounds/show.ejs", {campground: foundCampground});
        }
    });
});


// COMMENT ROUTES
app.get("/campgrounds/:id/comments/new", function(req, res) {
    Campground.findById(req.params.id, function(error, campground) {
        if (error) {
            console.log(error);
        } else {
            res.render("comments/new.ejs", { campground: campground });
        }
    });
});

app.post("/campgrounds/:id/comments", function(req, res) {
    Campground.findById(req.params.id, function (error, campground) {
        if (error) {
            console.log(error);
            res.redirect("/campgrounds");
        } else {
            Comment.create(req.body.comment, function(err, comment) {
                if(err){
                    console.log(err);
                } else {
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
        }
    });
});

// SERVER
app.listen(5000, function() {
    console.log("The YelpCamp server has started!");
});