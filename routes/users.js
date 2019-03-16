var express     = require('express');
var router      = express.Router();
var User        = require('../models/user')
var passport    = require('passport');
var LocalStrategy = require('passport-local').Strategy;

// Register
router.get('/register', (req, res) => {
    // Use handlebars to render the view called 'register' (register.handlebars)
    res.render('register');
});

// Login
router.get('/login', (req, res) => {
    // Use handlebars to render the view called 'login' (login.handlebars)
    res.render('login');
});

// Register user
router.post('/register', (req, res) => {
    // Get all the values
    let name = req.body.name,
    email = req.body.email,
    username = req.body.username,
    password = req.body.password,
    password2 = req.body.password2;

    // Validation
    // use req.checkBody(parameter, error_message).checkFunction() to perform the validation
    req.checkBody('name', 'Name is required').notEmpty();
    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('email', 'Email is not valid').isEmail();
    req.checkBody('username', 'Username is required').notEmpty();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

    // Get all the errors
    let errors = req.validationErrors();

    // If errors exist, re-render the register page and flash the error messages
    if (errors) {
        console.log('ERRORS');
        res.render('register', {
            errors: errors
        });
    // If errors don't exist, create the new User object, save it to the DB, and 
    // direct them to the login page.
    } else {
        console.log('No errors');
        var newUser = new User({
            name: name,
            email: email,
            username: username,
            password: password
        });
        User.createUser(newUser, (err, user) => {
            if (err) throw err;
            console.log(user);
        });

        req.flash('success_msg', 'You are registered and can now login');
        res.redirect('/users/login');
    }
});

// This is the strategy used by Passport to authenticate users
passport.use(new LocalStrategy(
    // Get the username and password
    (username, password, done) => {
        // Call the method in user.js to find the User object from Mongo
        User.getUserByUsername(username, (err, user) => {
            // If there was an error, throw it
            if (err) throw err;
            // If the user does not exist, flash the error message
            if (!user) {
                return done(null, false, { message: 'Unknown user' });
            }
            // If everything passes, check the password using the method in user.js
            User.comparePassword(password, user.password, (err, isMatch) => {
                // If there was an error, throw it
                if (err) throw err;
                // If the passwords match, return the user object
                if (isMatch) {
                    return done(null, user);
                // If the passwords did not match, return the error message
                } else {
                    return done(null, false, { message: 'Invalid password' });
                }
            });
        });
}));

// Standard serialization method used by Passport to store the
// user object in the server session
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// Deserialization method to get the user object using the ID
// stored in the server session -> Uses the getUserById method
// in user.js
passport.deserializeUser((id, done) => {
    User.getUserById(id, (err, user) => {
        done(err, user);
    });
});

// Use Passport's authenticate() method for POST requests sent
// to /login, including success and failure redirects
router.post('/login',
    passport.authenticate('local', { 
        successRedirect: '/', 
        failureRedirect: '/users/login', 
        failureFlash: true
    }),
    (req, res) => {
        res.redirect('/');
});

// Process logout requests using the req.logout() method; that is
// all that is required
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login');
});

module.exports = router;