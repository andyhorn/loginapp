const mongoose      = require('mongoose');
const bcrypt        = require('bcryptjs');

// Set up the schema for User objects in MongoDb
const UserSchema = mongoose.Schema({
    username: { type: String, index: true },
    password: { type: String },
    email: { type: String },
    name: { type: String }
});

// Make the User database object available externally
const User = module.exports = mongoose.model('User', UserSchema);

// Create a new User object in the Mongo database and 
// automatically hash the password before storing.
// Also make this method available externally.
module.exports.createUser = (newUser, callback) => {
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
            newUser.password = hash;
            newUser.save(callback);
        })
    })
}

// Create a wrapper for MongoDb to find a User object by the username
module.exports.getUserByUsername = (username, callback) => {
    var query = { username: username };
    User.findOne(query, callback);
}

// Create a wrapper for MongoDb to find a User object by its ID
module.exports.getUserById = (id, callback) => {
    User.findById(id, callback);
}

// Create a wrapper for BCrypt's password comparing function, 
// making it available externally
module.exports.comparePassword = (candidate, hash, callback) => {
    bcrypt.compare(candidate, hash, (err, isMatch) => {
        if (err) throw err;
        callback(null, isMatch);
    })
}