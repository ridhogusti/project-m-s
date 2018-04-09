var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var pgSession = require('connect-pg-simple')(session);
var { Pool } = require('pg');
var bcrypt = require('bcryptjs');
var upload = require("express-fileupload");


// const pool = new Pool({
//   user: 'postgres',
//   host: 'localhost',
//   database: 'pms',
//   password: 'thetravis12',
//   port: 5433
// })

const pool = new Pool({
  user: 'wmagkcnpiirpil',
  host: 'ec2-23-23-222-184.compute-1.amazonaws.com',
  database: 'd9c2rdrmkpp7ip',
  password: '1cc21a684c19a6f9d62be94a38f106b260f1db5db2a7ef2dba7a471c731f04e6',
  port: 5432
})

var routes = require('./routes/index');
var users = require('./routes/users');

// Init App
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

//file upload
app.use(upload());

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// Express Session
app.use(session({
  store: new pgSession({
    pool: pool,
    tableName: 'sessions'
  }),
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}));

// Passport init
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(
	function(username, password, done) {

    const value = [
      username
    ]
    pool.query(`SELECT userid, password FROM users WHERE email = $1`, value, function(err, result) {
      if (err) {
        done(err);
      }
      if (result.length === 0) {
        done(null, false);
      }else{
        var hash = result.rows[0].password;

        // console.log(hash);

        bcrypt.compare(password, hash, function(err, response) {
          if (response === true) {
            return done(null, { user_id: result.rows[0].userid, role: result.rows[0].role });
          } else {
            return done(null, false);
          }
        })
      }
    })
	}
));

// Express Validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

// Connect Flash
app.use(flash());

// Global Vars
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});



app.use('/', routes);
app.use('/users', users);

// Set Port
app.set('port', (process.env.PORT || 3000));

app.listen(app.get('port'), function(){
	console.log('Server started on port '+app.get('port'));
});
