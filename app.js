var campgrounds = [
    { name: "Salmon Creek", image: "https://thumbor.forbes.com/thumbor/600x300/smart/https%3A%2F%2Fblogs-images.forbes.com%2Fdrewmarshall%2Ffiles%2F2015%2F07%2FCamping-along-a-ridge-at-Sequoia-National-Forest.jpg" },
    { name: "Cedar Rapids", image: "http://chile.travel/wp-content/uploads/bfi_thumb/Camping-INACH-ACT250-mpo4pzd1ap2psy7lkn7j26qrkfg29r2og97iro1ha0.jpg" },
    { name: "Norse Lake", image: "http://campadounia.com/wp-content/uploads/2014/05/Small-Beach-Camp-Adounia-Beach-Camping-Morocco-Essaouira-600x300.png" },
    { name: "Salmon Creek", image: "https://thumbor.forbes.com/thumbor/600x300/smart/https%3A%2F%2Fblogs-images.forbes.com%2Fdrewmarshall%2Ffiles%2F2015%2F07%2FCamping-along-a-ridge-at-Sequoia-National-Forest.jpg" },
    { name: "Cedar Rapids", image: "http://chile.travel/wp-content/uploads/bfi_thumb/Camping-INACH-ACT250-mpo4pzd1ap2psy7lkn7j26qrkfg29r2og97iro1ha0.jpg" },
    { name: "Norse Lake", image: "http://campadounia.com/wp-content/uploads/2014/05/Small-Beach-Camp-Adounia-Beach-Camping-Morocco-Essaouira-600x300.png" },
    { name: "Salmon Creek", image: "https://thumbor.forbes.com/thumbor/600x300/smart/https%3A%2F%2Fblogs-images.forbes.com%2Fdrewmarshall%2Ffiles%2F2015%2F07%2FCamping-along-a-ridge-at-Sequoia-National-Forest.jpg" },
    { name: "Cedar Rapids", image: "http://chile.travel/wp-content/uploads/bfi_thumb/Camping-INACH-ACT250-mpo4pzd1ap2psy7lkn7j26qrkfg29r2og97iro1ha0.jpg" },
    { name: "Norse Lake", image: "http://campadounia.com/wp-content/uploads/2014/05/Small-Beach-Camp-Adounia-Beach-Camping-Morocco-Essaouira-600x300.png" }
]

var express = require("express");
var app = express();
var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded( {extended: true} ));
app.set("view engine", "ejs");

app.get("/", function (req, res) {
    res.render("landing.ejs");
});

app.get("/campgrounds", function (req, res) {
    res.render("campgrounds.ejs", {campgrounds: campgrounds});
});

app.post("/campgrounds", function (req, res) {
    // Get data from form and add to campgrounds array.
    var name = req.body.name
    var image = req.body.image
    var newCampground = {name: name, image: image};
    campgrounds.push(newCampground);

    // Redirect back to campgrounds page (through the GET request).
    res.redirect("/campgrounds");
});

app.get("/campgrounds/new", function(req, res) {
    res.render("new.ejs");
});

app.listen(3000, function() {
    console.log("The YelpCamp server has started!");
});