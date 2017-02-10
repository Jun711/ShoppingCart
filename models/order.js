var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
	user: {type: Schema.Types.ObjectId, ref: 'User'}, // this links to the User model objects
	cart: {type: Object, required: true},
	address: {type: String, required: true},
	name: {type: String, required: true}, 
	paymentId: {type: String, required: true} // used to map a payment ID to an order
});

module.exports = mongoose.model('Order', schema);