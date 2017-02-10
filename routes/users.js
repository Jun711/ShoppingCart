var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var passport = require('passport');

var routeUtil = require('./routeUtil');

var csrfProtection = csrf(); // use as a middleware
router.use(csrfProtection); // apply csrf middleware to the router to protect the routes
							// all the routes including in this router shouldbe protected by csrfProtection

router.get('/profile', routeUtil.isLoggedIn, function(req, res, next) {
	res.render('user/profile');
})

router.get('/signout', routeUtil.isLoggedIn, function(req, res, next) {
	req.logout();
	res.redirect('/');
})

router.use('/', routeUtil.notLoggedIn, function(req, res, next) {
	next();
});

router.post('/signup', passport.authenticate('local.signup', {
	// successRedirect: '/user/profile',
	failureRedirect: '/user/signup',
	failureFlash: true
}), function(req, res, next) {
	if (req.session.oldUrl) {
		let oldUrl = req.session.oldUrl;
		req.session.oldUrl = null;
		res.redirect(oldUrl);
	} else {
		res.redirect('/user/profile');
	}
});

router.get('/signup', function(req, res, next) {
	let messages = req.flash('error');
	res.render('user/signup', {csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0});
});

router.get('/signin', function(req, res, next) {
	let messages = req.flash('error');
	res.render('user/signin', {csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0});
})

router.post('/signin', passport.authenticate('local.signin', {
	// successRedirect: '/user/profile',
	failureRedirect: '/user/signin',
	failureFlash: true
}), function(req, res, next) { // if signed in, redirects to the previous page
	if (req.session.oldUrl) {
		// req will be not accessible if it has been redirected.
		// res.redirect(req.session.oldUrl);
		// req.session.oldUrl = null;

		let oldUrl = req.session.oldUrl;
		req.session.oldUrl = null;
		res.redirect(oldUrl);
	} else {
		res.redirect('/user/profile');
	}
});

module.exports = router;


// function notLoggedIn(req, res, next) {
// 	if (!req.isAuthenticated()) {
// 		return next();
// 	}
// 	res.redirect('/');
// 	//res.render('user/profile');
// 	// res.redirect('/profile');
// }

// // this middleware can be used for all the routes that we want to protect
// function isLoggedIn(req, res, next) {
// 	if (req.isAuthenticated()) { // is a method added by passport
// 		return next();
// 	}
// 	res.redirect('/');
// }