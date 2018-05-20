var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    passport        = require("passport"),
    LocalStrategy   = require("passport-local"),
    Campground      = require("./models/campground"),
    Comment         = require("./models/comment"),
    User            = require("./models/user"),
    seedDB          = require("./seeds");

mongoose.connect("mongodb://localhost/yelp_camp");
app.use(bodyParser.urlencoded( {extended: true} ));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");

// Passport Configuration
app.use(require("express-session")({
    secret: "Buddy is the cutest dog.",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Set the login status of the user, for use by the header.ejs file.
app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    next();
});

// MAIN ROUTES
app.get("/", function (req, res) {
    res.render("landing.ejs");
});

// INDEX
app.get("/campgrounds", function (req, res) {
    Campground.find({}, function(error, allCampgrounds) {
        if (error) {
            console.log(error);
        } else {
            res.render("campgrounds/index.ejs", { campgrounds: allCampgrounds});
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
app.get("/campgrounds/:id/comments/new", isLoggedIn, function(req, res) {
    Campground.findById(req.params.id, function(error, campground) {
        if (error) {
            console.log(error);
        } else {
            res.render("comments/new.ejs", { campground: campground });
        }
    });
});

app.post("/campgrounds/:id/comments", isLoggedIn, function(req, res) {
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


// AUTHORIZATION ROUTES
app.get("/register", function(req, res) {
    res.render("register.ejs");
});

app.post("/register", function(req, res) {
    var newUser = new User({ username: req.body.username });
    User.register(newUser, req.body.password, function(err, user) {
        if(err){
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function() {
            res.redirect("/campgrounds");
        });
    });
});


// LOGIN ROUTES
app.get("/login", function (req, res) {
    res.render("login.ejs");
});

app.post("/login", passport.authenticate("local", 
    { 
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), function (req, res) {

});


// LOGOUT ROUTE
app.get("/logout", function (req, res) {
    req.logout();
    res.redirect("/campgrounds");
});


// Middleware for authentication.
function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}


// SERVER
app.listen(5000, function() {
    console.log("The YelpCamp server has started!");
});