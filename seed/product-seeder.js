var Product = require('../models/product');
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.Promise = require('bluebird');
mongoose.connect('mongodb://127.0.0.1:27017/shopping'); 

var products = [
	new Product({
		imagePath: 'https://upload.wikimedia.org/wikipedia/en/5/5e/Gothiccover.png',
		title: 'Gothic Video Game',
		description: 'Awesome Game !!!!',
		price: 10
	}),
	new Product({
		imagePath: 'http://img2.game-oldies.com/sites/default/files/packshots/nintendo-game-boy-advance/dragon-ball-z-supersonic-warriors-usa.png',
		title: 'Dragon Ball',
		description: 'Goku vs Vegeta',
		price: 12
	}),
	new Product({
		imagePath: 'http://vignette1.wikia.nocookie.net/residentevilfanfiction/images/7/71/RE7.jpg/revision/latest?cb=20150324221456',
		title: 'Resident Evil 7',
		description: 'Alice rules',
		price: 15
	}),
	new Product({
		imagePath: 'https://pbs.twimg.com/profile_images/571024672750178304/GpGC8aTW.jpeg',
		title: 'League of Legends',
		description: '5 v 5!',
		price: 17
	}),
	new Product({
		imagePath: 'https://pbs.twimg.com/profile_images/808475349671493632/nvi7WJf4.jpg',
		title: 'Dota 2',
		description: 'Defense',
		price: 19
	})
];

//products.remove({});

var done = 0;
for (var i = 0; i < products.length; i++) {
	products[i].save(function(err, result) {
		done++;
		if (done === products.length) {
			exit();
		}
	});
}
// mongoose.disconnect();
function exit() {
	mongoose.disconnect();
}