var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var userSchema = new mongoose.Schema({
    username: String,
    password: String
});

// Adds the "passport" package's logic to the user database, which includes salted & hashed passwords.
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);