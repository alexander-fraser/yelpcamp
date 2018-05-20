var mongoose    = require("mongoose"),
    Campground  = require("./models/campground"),
    Comment     = require("./models/comment");

var data = [
    { 
        name: "Salmon Creek", 
        image: "https://thumbor.forbes.com/thumbor/600x300/smart/https%3A%2F%2Fblogs-images.forbes.com%2Fdrewmarshall%2Ffiles%2F2015%2F07%2FCamping-along-a-ridge-at-Sequoia-National-Forest.jpg",
        description: "Repellendus suscipit rerum esse qui voluptates illo numquam. Voluptas repellat saepe aut a. Alias et dolorum recusandae. Aut totam dicta et tempore."
    },
    { 
        name: "Cedar Rapids", 
        image: "http://chile.travel/wp-content/uploads/bfi_thumb/Camping-INACH-ACT250-mpo4pzd1ap2psy7lkn7j26qrkfg29r2og97iro1ha0.jpg",
        description: "Dolore magni voluptatem sunt sed est amet dolores ullam fugit."
    },
    { 
        name: "Norse Lake", 
        image: "http://campadounia.com/wp-content/uploads/2014/05/Small-Beach-Camp-Adounia-Beach-Camping-Morocco-Essaouira-600x300.png",
        description: "Unde assumenda officia ut cumque voluptatem voluptatem et. Dolores ut ut sequi nam nostrum autem nisi. Commodi ea aut vel ut. Vero sequi quibusdam quos quo fugiat perspiciatis."
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

