var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');

var userSchema = new Schema({
	email: {type: String, required: true},
	password: {type: String, required: true}
});

userSchema.methods.encryptPassword = function(password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(5), null);
}; // helper method added using methods object

// check if the passwords match
// technically different but the same passwords are the equal
userSchema.methods.validPassword = function(password) {
	return bcrypt.compareSync(password, this.password); // this refers to this user
} // helper method added using methods object

module.exports = mongoose.model('User', userSchema);