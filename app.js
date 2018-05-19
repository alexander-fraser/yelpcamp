var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    Campground  = require("./models/campground"),
    seedDB      = require("./seeds");

mongoose.connect("mongodb://localhost/yelp_camp");
app.use(bodyParser.urlencoded( {extended: true} ));
app.set("view engine", "ejs");

app.get("/", function (req, res) {
    res.render("landing.ejs");
});

// INDEX
app.get("/campgrounds", function (req, res) {
    Campground.find({}, function(error, allCampgrounds) {
        if (error) {
            console.log(error);
        } else {
            res.render("index.ejs", { campgrounds: allCampgrounds });
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
    res.render("new.ejs");
});

// SHOW
app.get("/campgrounds/:id", function (req, res) {
    Campground.findById(req.params.id, function(error, foundCampground) {
        if(error) {
            console.log(error);
        } else {
            res.render("show.ejs", {campground: foundCampground});
        }
    });
});

app.listen(5000, function() {
    console.log("The YelpCamp server has started!");
});