var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose");

mongoose.connect("mongodb://localhost/yelp_camp");
app.use(bodyParser.urlencoded( {extended: true} ));
app.set("view engine", "ejs");

// Mongo DB Schema setup
var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String
});

var Campground = mongoose.model("Campground", campgroundSchema);

/* Campground.create(
    { 
        name: "Cedar Rapids", 
        image: "http://chile.travel/wp-content/uploads/bfi_thumb/Camping-INACH-ACT250-mpo4pzd1ap2psy7lkn7j26qrkfg29r2og97iro1ha0.jpg",
        description: "These are incredibly fast-flowing rapids. Dangerous. Stay Clear."
    }, function(error, campground) {
        if(error) {
            console.log(error);
        } else {
            console.log("New campground");
            console.log(campground);
        }
    }
); */

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

app.listen(3000, function() {
    console.log("The YelpCamp server has started!");
});