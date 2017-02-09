var express = require('express');
var router = express.Router();
var Product = require('../models/product');
var csrf = require('csurf');

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

router.post('/user/signup', function(req, res, next) {
	res.redirect('/');
})

router.get('/user/signup', function(req, res, next) {
	res.render('user/signup', {csrfToken: req.csrfToken()});
});

module.exports = router;
