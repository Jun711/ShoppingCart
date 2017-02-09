var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var passport = require('passport');

var Product = require('../models/product');

var csrfProtection = csrf(); // use as a middleware
router.use(csrfProtection); // apply csrf middleware to the router to protect the routes
							// all the routes including in this router shouldbe protected by csrfProtection

/* GET home page. */
router.get('/', function(req, res, next) {

	Product.find(function(err, docs) {
		var productChunks = [];
		var chunkSize = 3;
		for (var i = 0; i < docs.length; i += chunkSize) {
			productChunks.push(docs.slice(i, i + chunkSize));
		}
		
		res.render('shop/index', { title: 'Shopping Cart', products: productChunks});
	});
	// because of async find, we will get the wrong number of products which are mongoose objects
	// var products = Product.find();
	// res.render('shop/index', { title: 'Shopping Cart', products: products});
});

// router.post('/user/signup', function(req, res, next) {
// 	res.redirect('/');
// })

router.post('/user/signup', passport.authenticate('local.signup', {
	successRedirect: '/user/profile',
	failureRedirect: '/user/signup',
	failureFlash: true
}));

router.get('/user/profile', function(req, res, next) {
	res.render('user/profile');
})

router.get('/user/signup', function(req, res, next) {
	let messages = req.flash('error');
	res.render('user/signup', {csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0});
});

module.exports = router;
