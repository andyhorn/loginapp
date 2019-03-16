var express     = require('express');
var router      = express.Router();

// Get the homepage
router.get('/', ensureAuthenticated, (req, res) => {
    // Use handlebars to render the view called 'index' (index.handlebars)
    res.render('index');
});

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        console.log('user is authenticated');
        return next();
    } else {
        //req.flash('error_msg', 'You are not logged in');
        console.log('user is not authenticated, redirecting...');
        res.redirect('/users/login');
    }
}

module.exports = router;