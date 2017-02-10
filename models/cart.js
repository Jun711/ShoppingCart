// get the oldCart when we create and then assign the oldCart meta data
// we have a function to add an item to the cart

module.exports = function Cart(oldCart) {
	// then, we can pass an empty oldCart object
	this.items = oldCart.items || {}; // oldCart items
	this.totalQty = oldCart.totalQty || 0;
	this.totalPrice = oldCart.totalPrice || 0;

	this.add = function(item, id) {
		// this.items[id] is a JS object with key being id
		let storedItem = this.items[id]; // retrieve an item
		if (!storedItem) {
			storedItem = this.items[id] = {item: item, qty: 0, price: 0}; 
		}
		storedItem.qty++;
		storedItem.price = storedItem.item.price * storedItem.qty;
		this.totalQty++;
		this.totalPrice += storedItem.item.price;
	};

	this.addByOne = function(id) {
		this.items[id].qty++;
		this.items[id].price += this.items[id].item.price;
		this.totalQty++;
		this.totalPrice += this.items[id].item.price;
	}

	this.reduceByOne = function(id) {
		if (this.items[id].qty > 1) {
			this.items[id].qty--;
			this.items[id].price -= this.items[id].item.price;
			this.totalQty--;
			this.totalPrice -= this.items[id].item.price;
		} else if (this.items[id].qty == 1) {
			delete this.items[id];
		}
	};

	this.removeItem = function(id) {
		this.totalQty -= this.items[id].qty;
		this.totalPrice -= this.items[id].price;
		delete this.items[id];
	}

	// generate an array of items
	this.generateArray = function() {
		let arr = [];
		for (let id in this.items) {
			arr.push(this.items[id]);
		}
		return arr;
	}; 
};