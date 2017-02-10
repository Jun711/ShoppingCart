exports.notLoggedIn = function(req, res, next) {
	if (!req.isAuthenticated()) {
		return next();
	}
	res.redirect('/');
	//res.render('user/profile');
	// res.redirect('/profile');
}

exports.isLoggedIn = function(req, res, next) {
	if (req.isAuthenticated()) { // is a method added by passport
		return next();
	}
	res.redirect('/');
}