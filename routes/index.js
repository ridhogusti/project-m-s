var express = require('express');
var app = express();

/* GET home page. */
app.get('/', authenticationMiddleware(), function(req, res, next) {
  res.render('index', { title: 'Express' });
});

function authenticationMiddleware() {
	return (req, res, next) => {
		console.log(`req.session.passport.user: ${JSON.stringify(req.session.passport)}`);
		if (req.isAuthenticated()) {
			return next();
		}
		res.redirect('/users/login');
	}
}

module.exports = app;
