var express     = require('express');
var router      = express.Router();

// Register
router.get('/register', (req, res) => {
    res.render('register');
});

// Login
router.get('/login', (req, res) => {
    res.render('login');
});


module.exports = router;