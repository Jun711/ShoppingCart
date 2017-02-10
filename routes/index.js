var express = require('express');
var router = express.Router();

var Product = require('../models/product');
var Cart = require('../models/cart');
var Order = require('../models/order');

/* GET home page. */
router.get('/', function(req, res, next) {
	var successMsg = req.flash('success')[0];
	Product.find(function(err, docs) {
		let productChunks = [];
		let chunkSize = 3;
		for (var i = 0; i < docs.length; i += chunkSize) {
			productChunks.push(docs.slice(i, i + chunkSize));
		}
		
		res.render('shop/index', { title: 'Shopping Cart', products: productChunks, successMsg: successMsg, noMessage: !successMsg});
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

router.get('/shopping-cart', function(req, res, next) {
	if (!req.session.cart) {
		return res.render('shop/shopping-cart', {products: null});
	}
	let cart = new Cart(req.session.cart);
	res.render('shop/shopping-cart', {products: cart.generateArray(), totalPrice: cart.totalPrice});
});

// get the checkout view
router.get('/checkout', isLoggedIn, function(req, res, next) {
	if (!req.session.cart) {
		return res.redirect('/shopping-cart');
	}
	var cart = new Cart(req.session.cart);
	// connect-flash store multiple objects in the error object array
	// since we store only one, accessing it via [0]
	var errMsg = req.flash('error')[0]; 
	// pass the errMsg and noError to the view
    res.render('shop/checkout', {total: cart.totalPrice, errMsg: errMsg, noError: !errMsg});
	//res.render('shop/checkout', {total: cart.totalPrice});
});

router.post('/checkout', isLoggedIn, function(req, res, next) {
	if (!req.session.cart) {
		return res.redirect('/shopping-cart');
	}
	var cart = new Cart(req.session.cart);

	var stripe = require("stripe")(
	  	"sk_test_XcTKpGXYKZRngphHa2XAlW0g"
	);

	stripe.charges.create({
		  amount: cart.totalPrice * 100, // in the smallest unit
		  currency: "cad",
		  // stripeToken is the name of the hidden input name in the form
		  source: req.body.stripeToken, // obtained with Stripe.js
		  description: "Test Charge"
	}, function(err, charge) {
		// asynchronously called
		if (err) {
			req.flash('error', err.message); // linked to the errMsg in router.get('/checkout')
			return res.redirect('/checkout');
		}
		var order = new Order({
			user: req.user, // passport stores the user object in the req
			cart: cart,
			address: req.body.address, // req.body is where the express store the values sent with a post req 
			name: req.body.name,
			paymentId: charge.id
		});
		order.save(function(err, result) {
			if (err) {
				// need to handle the errors here
			}
			req.flash('success', 'Successfully bought product!');
			req.session.cart = null;
			res.redirect('/');
		});
	});
})

module.exports = router;

 // this middleware can be used for all the routes that we want to protect
function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) { // is a method added by passport
		return next();
	}
	req.session.oldUrl = req.url; // to keep the original routing line
	res.redirect('/user/signin');
}
