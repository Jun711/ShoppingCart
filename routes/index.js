var express = require('express');
var router = express.Router();
var Product = require('../models/product');

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

module.exports = router;
