// Import required packages.
var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    passport        = require("passport"),
    LocalStrategy   = require("passport-local"),
    methodOverride  = require("method-override");

// Import the declarations for the MongoDB databases.
var Campground      = require("./models/campground"),
    Comment         = require("./models/comment"),
    User            = require("./models/user");
    // seedDB          = require("./seeds");

// seedDB();

// Import the declarations for all of the routes.
var campgroundRoutes    = require("./routes/campgrounds"),
    commentRoutes       = require("./routes/comments"),
    indexRoutes         = require("./routes/index");

mongoose.connect("mongodb://localhost/yelp_camp");
app.use(bodyParser.urlencoded( {extended: true} ));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));

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

// Set express to use the imported routes.
// We specify the root path for each route, to avoid having to specify this in each route's declaration.
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/", indexRoutes);

// SERVER
app.listen(5000, function() {
    console.log("The YelpCamp server has started!");
});