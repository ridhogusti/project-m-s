var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var bcrypt = require('bcryptjs');
const saltRounds = 10;

const { Pool, Client } = require('pg');

const pool = new Pool({
	user: 'postgres',
  host: 'localhost',
  database: 'pms',
  password: 'thetravis12',
  port: 5433
})


// Register
router.get('/register', function(req, res){
	res.render('auth/register');
});

// Login
router.get('/login', authenticationMiddleware(), function(req, res){
	console.log(req.user);
	console.log(req.isAuthenticated());
	res.render('auth/login');
});

// Register User
router.post('/register', function(req, res){
	var firstname = req.body.firstname;
	var lastname = req.body.lastname;
	var email = req.body.email;
	var password = req.body.password;
	var password2 = req.body.password2;

	// Validation
	req.checkBody('firstname', 'First Name is required').notEmpty();
	req.checkBody('email', 'Email is required').notEmpty();
	req.checkBody('email', 'Email is not valid').isEmail();
	req.checkBody('password', 'Password is required').notEmpty();
	req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

	var errors = req.validationErrors();

	if(errors){
		res.render('auth/register',{
			errors:errors
		});
	} else {

		const text = `INSERT INTO users(email, password, firstname, lastname) VALUES($1, $2, $3, $4) RETURNING *`;

		var values = [
			email
		];

		console.log(values);

		pool.query(`SELECT * FROM users where email = $1 ORDER BY userid`, values, function(err, result) {

			console.log(result.rows);
			
			if(result.rows.length != 1) {

				bcrypt.hash(password, saltRounds, function(err, hash) {

					var values2 = [
						email,
						hash,
						firstname,
						lastname		
					];
					pool.query(text, values2, function(err, result) {
						if (err) {
							return console.error(err.message);
						}

						console.log(result.rows[0].userid);

						// res.redirect('/');
						// pool.query('SELECT * FROM users', function(err, results, fields) {
						// 	if (err) throw err;
						// 	console.log(results);
							const user_id = result.rows[0].userid;
							
							req.login(user_id, function(err) {
								req.flash('success_msg', 'You are registered and can now login');
								res.redirect('/users/login');
							})
						// })
					});
				})
			}else {
				res.redirect('/users/register');
			}
			
		});
	}
});

// passport.use(new LocalStrategy(
// 	function(email, password, done) {
// 		console.log(email);
// 		console.log(password);
// 		console.log('sntaoheu');
// 		return done(null, 'fdsaf');
// 	}
// ));

passport.serializeUser(function(user_id, done) {
  done(null, user_id);
});

passport.deserializeUser(function(user_id, done) {
    done(null, user_id);
});

router.post('/login', passport.authenticate('local', {successRedirect:'/', failureRedirect:'/users/login', failureFlash: true}));

router.get('/logout', function(req, res){
	req.logout();

	req.flash('success_msg', 'You are logged out');
	req.session.destroy();


	res.redirect('/users/login');
});

function authenticationMiddleware() {
	return (req, res, next) => {
		console.log(`req.session.passport.user: ${JSON.stringify(req.session.passport)}`);
			console.log(req.isAuthenticated());
		if (req.isAuthenticated() === false) {
			console.log(req.isAuthenticated());
			return next();
		}
		res.redirect('/');
	}
}

module.exports = router;