var express = require('express');
var router = express.Router();

var Product = require('../models/product');
var Cart = require('../models/cart');

/* GET home page. */
router.get('/', function(req, res, next) {

	Product.find(function(err, docs) {
		let productChunks = [];
		let chunkSize = 3;
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

// we can drop next
router.get('/add-to-cart/:id', function(req, res, next) {
	let productId = req.params.id;
	let cart = new Cart(req.session.cart ? req.session.cart : {});
	//let cart = new Cart(req.session.cart ? req.session.cart : {items: {}, totalQty: 0, totalPrice: 0});
	Product.findById(productId, function(err, product) {
		if (err) {
			return res.redirect('/');
		}
		cart.add(product, product.id);
		req.session.cart = cart; // the express will be saved when the response is sent back
		console.log(req.session.cart);
		res.redirect('/');
	})
});

module.exports = router;
