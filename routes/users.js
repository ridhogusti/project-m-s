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
router.get('/register', function (req, res) {
  res.render('auth/register');
});

// Login
router.get('/login', authenticationMiddleware(), function (req, res) {
  console.log(req.user);
  console.log(req.isAuthenticated());
  res.render('auth/login');
});

// Register User
router.post('/register', function (req, res) {
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

  if (errors) {
    res.render('auth/register', {
      errors: errors
    });
  } else {

    const text = `INSERT INTO users(email, password, firstname, lastname) VALUES($1, $2, $3, $4) RETURNING *`;

    var values = [
      email
    ];

    console.log(values);

    pool.query(`SELECT * FROM users where email = $1 ORDER BY userid`, values, function (err, result) {

      console.log(result.rows);

      if (result.rows.length != 1) {

        bcrypt.hash(password, saltRounds, function (err, hash) {

          var values2 = [
            email,
            hash,
            firstname,
            lastname
          ];
          pool.query(text, values2, function (err, result) {
            if (err) {
              return console.error(err.message);
            }

            console.log(result.rows[0].userid);

            // res.redirect('/');
            // pool.query('SELECT * FROM users', function(err, results, fields) {
            // 	if (err) throw err;
            // 	console.log(results);
            const user_id = result.rows[0].userid;

            req.login(user_id, function (err) {
              req.flash('success_msg', 'You are registered and can now login');
              res.redirect('/users/login');
            })
            // })
          });
        })
      } else {
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

passport.serializeUser(function (user_id, done) {
  done(null, user_id);
});

passport.deserializeUser(function (user_id, done) {
  done(null, user_id);
});

router.post('/login', passport.authenticate('local', { successRedirect: '/project', failureRedirect: '/users/login', failureFlash: true }));

router.get('/logout', function (req, res) {
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


router.get('/todos', function(req, res) {
  pool.query('SELECT * FROM todos', function(err, result) {
    if (err) {
      console.error(message.err);
    }

    console.log(result.rows);
    var data = result.rows;
      value = [
        req.query.id,
        req.query.string,
        req.query.integer,
        req.query.float,
        req.query.startdate,
        req.query.enddate,
        req.query.boolean,
        req.query.cheid,
        req.query.chestring,
        req.query.cheinteger,
        req.query.chefloat,
        req.query.chedate,
        req.query.cheboolean
      ];


      console.log(req.url.slice(0, 7));

      adaurl = '';
      if (req.url == '/project/') {
        adaurl = '';
      }
      else if (req.url.slice(0, 15) == '/project/?page=') {
        adaurl = req.url.slice(req.url.length, req.url.length);
      }
      else{
        adaurl = req.url;
      }

      // adaurl = '';
      // if (req.url == '/') {
      //   adaurl = '';
      // }
      // else if (req.url.slice(0, 7) == '/?page=') {
      //   adaurl = req.url.slice(8, req.url.length);
      // }
      // else{
      //   adaurl = req.url;
      // }

      console.log(value[7]);

      console.log('test');

      if (value[7] == null) {
        console.log('null');
      }

      var data2 = [];
      data2 = data;
      if (req.query.cheid === 'true') {
        for (let i = 0; i < data2.length; i++) {
          if (data2[i].id != req.query.id) {
            data2.splice(i, 1);
            i--;
          }
        }
      }


      if (req.query.chestring === 'true') {
        for (let i = 0; i < data2.length; i++) {
          if (data2[i].string != req.query.string) {
            data2.splice(i, 1); 
            i--;
          }
        }
      }

      if (req.query.cheinteger === 'true') {
        for (let i = 0; i < data2.length; i++) {
          if (data2[i].integer != req.query.integer) {
            data2.splice(i, 1);
            i--;
          }
        }
      }
      
      if (req.query.chefloat === 'true') {
        for (let i = 0; i < data2.length; i++) {
          if (data2[i].float != req.query.float) {
            data2.splice(i, 1);
            i--;
          }
        }
      }

      if (req.query.chedate === 'true') {
        for (let i = 0; i < data2.length; i++) {
          if (data2[i].date < req.query.startdate || data2[i].date > req.query.enddate) {
            data2.splice(i, 1);
            i--;
          }
        }
      }

      
      if (req.query.cheboolean === 'true') {
        for (let i = 0; i < data2.length; i++) {
          if (data2[i].boolean.toString() != req.query.boolean) {
            data2.splice(i, 1);
            i--;
          }
        }
      }
      console.log(data2);

      if (data.length === 0) {
        var totalStudents = data2.length,
            pageSize = 3,
            pageCount = Math.round((totalStudents/3+0.4)),
            currentPage = 1,
            students = [],
            studentsArrays = [],
            studentsList = [];
        while (data2.length > 0) {
          studentsArrays.push(data2.splice(0, pageSize));
        }
        page = req.query.page;
        if (typeof req.query.page !== 'undefined') {
          currentPage = +req.query.page;
        }
        if(typeof req.query.page === 'undefined') {
          page = 1;
        }
        studentsList = 'kosong'; 
      }
      else if (data2.length === 0) {
        var totalStudents = data.length,
            pageSize = 3,
            pageCount = Math.round((totalStudents/3+0.4)),
            currentPage = 1,
            students = [],
            studentsArrays = [],
            studentsList = [];
        while (data.length > 0) {
          studentsArrays.push(data.splice(0, pageSize));
        }
        page = req.query.page;
        if (typeof req.query.page !== 'undefined') {
          currentPage = +req.query.page;
        }
        if(typeof req.query.page === 'undefined') {
          page = 1;
        }
        studentsList = studentsArrays[+currentPage - 1];
      }
      else{
        var totalStudents = data2.length,
            pageSize = 3,
            pageCount = Math.round((totalStudents/3+0.4)),
            currentPage = 1,
            students = [],
            studentsArrays = [],
            studentsList = [];
        while (data2.length > 0) {
          studentsArrays.push(data2.splice(0, pageSize));
        }
        page = req.query.page;
        if (typeof req.query.page !== 'undefined') {
          currentPage = +req.query.page;
        }
        if(typeof req.query.page === 'undefined') {
          page = 1;
        }
        studentsList = studentsArrays[+currentPage - 1];
      }

      res.send({ 
        title: "Users - Node.js", 
        page: page, pageSize: pageSize, 
        data: studentsList, 
        pageCount: pageCount, 
        currentPage: currentPage,
        value: value,
        adaurl: adaurl,
        todos: studentsList
      });
    // res.send({ data: result.rows });
  })
})

router.post('/project', function (req, res) {
  // req.body.todo.text = req.sanitize(req.body.todo.text);
  var todos = req.body.text;
  console.log(todos);
  console.log('saoetuh');
  const text = `INSERT INTO projects(name) VALUES($1) RETURNING *`;
  var values = [
    todos
  ]
  pool.query(text, values, function (err, result) {
    if (err) {
      console.error(err.message);
    } else {
      // res.json(result.rows);
      res.redirect('/project');
    }
  })
});

router.post('/project/edit/', function(req, res) {
  var id = req.body.id;
  var name = req.body.name;
  console.log(id);
  console.log(name);
  var values = [
    name,
    id
  ];
  console.log(values);
  const query = `UPDATE projects SET name = $1 WHERE projectid = $2`;
  pool.query(query, values, function(err, result) {
    if (err) {
      console.error(err.message);
    }else {
      // res.redirect('/project');
      // res.send("Successfully Updated");
      res.json({
        status: 'ok',
        data: values
      });
    }
  })
})

router.post('/project/delete/', function(req, res) {
  var id = req.body.id;
  var values = [
    id
  ];
  const query = `DELETE FROM projects WHERE projectid = $1`;
  pool.query(query, values, function(err, result) {
    if (err) {
      console.error(err.message);
    }else {
      res.json({
        status: 'ok',
        data: values
      })
      // res.redirect('/project');
    }

  })
})

module.exports = router;