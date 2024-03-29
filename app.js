var express			= require('express');
var path			= require('path');
var cookieParser	= require('cookie-parser');
var bodyParser		= require('body-parser');
var exphbs			= require('express-handlebars');
var expressValidator= require('express-validator');
var flash			= require('connect-flash');
var session			= require('express-session');
var passport		= require('passport');
var LocalStrategy	= require('passport-local').Strategy;
var mongo			= require('mongodb');
var mongoose		= require('mongoose');
mongoose.connect('mongodb://localhost/loginapp');
var db				= mongoose.connection;

var routes			= require('./routes/index');
var users 			= require('./routes/users');

// Initialize app
var app = express();

// View engine
// Set any path with '/views' to include the root directory path
app.set('views', path.join(__dirname, 'views'));
// Set the handlebars engine to use the default layout file
app.engine('handlebars', exphbs({defaultLayout : 'layout'}));
// Set Express to use handlebars as the default view engine
app.set('view engine', 'handlebars');

// BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : false }));
app.use(cookieParser());

// Set static public folder
app.use(express.static(path.join(__dirname, 'public')));

// Express Session middleware
app.use(session({
	secret : 'secret',
	saveUninitialized : true,
	resave : true
}));

// Passport init
app.use(passport.initialize());
app.use(passport.session());

// Express Validator
// Not entirely sure what this does or how it works...
app.use(expressValidator({
	errorFormatter: (param, msg, value) => {
		let namespace = param.split('.'),
		root = namespace.shift(),
		formParam = root;

		while (namespace.length) {
			formParam += '[' + namespace.shift() + ']';
		}
		return {
			param: formParam,
			msg: msg,
			value: value
		};
	}
}));

// Connect flash middleware
app.use(flash());

// Global variables
// Any values saved to res.locals will be available as 
// a global variable, this is helpful when rendering the
// handlebars files to HTML
app.use((req, res, next) => {
	res.locals.success_msg = req.flash('success_msg');
	res.locals.error_msg = req.flash('error_msg');
	res.locals.error = req.flash('error');
	// Allow the user object itself to be available globally
	res.locals.user = req.user || null;
	next();
});



// Route files middleware
app.use('/', routes); // routes root requests to the /routes/index.js file
app.use('/users', users); // routes /users requests to the /routes/users.js file

// Set the port and start the server
app.set('port', (process.env.PORT || 3000));

app.listen(app.get('port'), () => {
	console.log("Server started on port " + app.get('port'));
});