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

	// generate an array of items
	this.generateArray = function() {
		let arr = [];
		for (let id in this.items) {
			arr.push(this.items[id]);
		}
		return arr;
	}; 
};