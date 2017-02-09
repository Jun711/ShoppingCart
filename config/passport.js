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
	req.checkBody('email', 'Invalid email').notEmpty().isEmail();
	req.checkBody('password', 'Invalid password').notEmpty().isLength({min:4});
	
	// var errors = req.validationErrors(); // deprecated
	// if (errors) {
	// 	var messages = [];
	// 	errors.forEach(function(error) {
	// 		messages.push(error.msg);
	// 	});
	// 	return done(null, false, req.flash('error', messages)); // no technical error, but false(not successful req)
	// }

	req.getValidationResult().then(function(result) {
		var errors = result.array();
		if (typeof errors !== 'undefined' && errors.length > 0) {
			console.log("in errors");
			var messages = [];
			errors.forEach(function(error) {
				messages.push(error.msg);
			});
			return done(null, false, req.flash('error', messages)); // no technical error, but false(not successful req)
		}
	});

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

passport.use('local.signin', new LocalStrategy({
	usernameField: 'email',
	passwordField: 'password',
	passReqToCallback: true
}, function(req, email, password, done) {
	req.checkBody('email', 'Invalid email').notEmpty().isEmail();
	req.checkBody('password', 'Invalid password').notEmpty();
	
	req.getValidationResult().then(function(result) {
		var errors = result.array();
		if (typeof errors !== 'undefined' && errors.length > 0) {
			console.log("in errors");
			var messages = [];
			errors.forEach(function(error) {
				messages.push(error.msg);
			});
			return done(null, false, req.flash('error', messages)); // no technical error, but false(not successful req)
		}
	});
	// check if it already exists
	User.findOne({'email': email}, function(err, user) {
		if (err) {
			return done(err);
		}
		// successful query(no error) but it wasn't a successful request
		if (!user) { 
			return done(null, false, {message: 'No user found.'});
		} // it wasn't sucessful because the email has already been used.

		// password invalid
		if (!user.validPassword(password)) {
			return done(null, false, {message: 'Wrong password.'});
		}
		// else return the found user
		return done(null, user);
	});
}));


