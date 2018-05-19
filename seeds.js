var mongoose    = require("mongoose"),
    Campground  = require("./models/campground"),
    Comment     = require("./models/comment");

var data = [
    { 
        name: "Salmon Creek", 
        image: "https://thumbor.forbes.com/thumbor/600x300/smart/https%3A%2F%2Fblogs-images.forbes.com%2Fdrewmarshall%2Ffiles%2F2015%2F07%2FCamping-along-a-ridge-at-Sequoia-National-Forest.jpg",
        description: "blah blah blah" 
    },
    { 
        name: "Cedar Rapids", 
        image: "http://chile.travel/wp-content/uploads/bfi_thumb/Camping-INACH-ACT250-mpo4pzd1ap2psy7lkn7j26qrkfg29r2og97iro1ha0.jpg",
        description: "blah blah blah"
    },
    { 
        name: "Norse Lake", 
        image: "http://campadounia.com/wp-content/uploads/2014/05/Small-Beach-Camp-Adounia-Beach-Camping-Morocco-Essaouira-600x300.png",
        description: "blah blah blah"
    },
]

function seedDB() {
    // Remove all campgrounds.
    Campground.remove({}, function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log("removed campgrounds!");

            // Add a few campgrounds after the old database is successfully dropped.
            data.forEach(function (seed) {
                Campground.create(seed, function (err, campground) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("Added a campground.");

                        // Create a comment.
                        Comment.create(
                            {
                                text: "This place is great.",
                                author: "Homer"
                            }, function(err, comment){
                                if(err){
                                    console.log(err);
                                } else {
                                    campground.comments.push(comment)
                                    campground.save();
                                    console.log("Created new comment.");
                                }
                            }
                        );

                    }
                });
            });

        }
    });

}

module.exports = seedDB();

