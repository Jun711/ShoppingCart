var passport = require('passport');
var User = require('../models/user');
var LocalStrategy = require('passport-local').Strategy; 

passport.serializeUser(function(user, done) {
	done(null, user.id); // serialize by user.id
});

passport.deserializeUser(function(id, done) {
	User.findById(id, function(err, user) {
		done(err, user); // store in user
	}); // User model, find by id in mongodb via mongoose
});

// this allows the passport to store the user or the id in the session and 
// retrieve it using the id whenever needed

// signup strategy
passport.use('local.signup', new LocalStrategy({
	usernameField: 'email',
	passwordField: 'password',
	passReqToCallback: true
}, function(req, email, password, done) {
	// check if it already exists
	User.findOne({'email': email}, function(err, user) {
		if (err) {
			return done(err);
		}
		// successful query(no error) but it wasn't a successful request
		if (user) { 
			return done(null, false, {message: 'Email is already in use.'});
		} // it wasn't sucessful because the email has already been used.

		var newUser = new User();
		newUser.email = email;
		newUser.password = newUser.encryptPassword(password);
		newUser.save(function(err, result) {
			if (err) {
				return done(err);
			}
			return done(null, newUser);
		});
	});
}));