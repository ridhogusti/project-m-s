var express = require('express');
var app = express();

const { Pool, Client } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'pms',
  password: 'thetravis12',
  port: 5433
})

/* GET home page. */
app.get('/project', authenticationMiddleware(), function (req, res, next) {

  pool.query('SELECT * FROM projects ORDER BY projectid', function (err, result) {
    if (err) {
      return console.error('error running query', err);
    }
    pool.query('SELECT * FROM members INNER JOIN users ON members.userid = users.userid', function (err, result2) {


      var datalama = result.rows;
      var datamember = result2.rows;
      console.log(datamember);
      var member = [];

      for (let i = 0; i < datalama.length; i++) {
        var memberbantuan2 = 0;
        var memberbantuan = [];
        for (let j = 0; j < datamember.length; j++) {
          if (datamember[j].projectid == datalama[i].projectid) {
            memberbantuan[j] = datamember[j].firstname + ' ' + datamember[j].lastname;
            memberbantuan2++;
          }
        }
        memberbantuan.toString();
        if (memberbantuan2 == 0) {
          memberbantuan = 'kosong';
        }
        member[i] = memberbantuan;
      }

      var data = [];
      for (let i = 0; i < datalama.length; i++) {
        data.push({
          projectid: datalama[i].projectid,
          name: datalama[i].name,
          member: member[i]
        })
      }
      console.log(data);



      console.log(member);
      console.log('object');
      value = [
        req.query.id,
        req.query.name,
        req.query.member,
        req.query.float,
        req.query.startdate,
        req.query.enddate,
        req.query.boolean,
        req.query.cheid,
        req.query.chename,
        req.query.chemember,
        req.query.chefloat,
        req.query.chedate,
        req.query.cheboolean
      ];


      var adaurl = '';
      var link = '';
      link = req.url;
      if (req.url == '/project/' || req.url == '/project') {
        adaurl = '';
      }
      else if (req.url.slice(0, 15) == '/project/?page=') {
        adaurl = req.url.slice(req.url.length, req.url.length);
      }
      else {
        adaurl = req.url;
      }

      console.log(link);


      console.log(value[7]);

      console.log('test');

      if (value[7] == null) {
        console.log('null');
      }

      var data2 = [];
      data2 = data;
      if (req.query.cheid === 'true') {
        for (let i = 0; i < data2.length; i++) {
          if (data2[i].projectid != req.query.id) {
            data2.splice(i, 1);
            i--;
          }
        }
      }


      if (req.query.chename === 'true') {
        for (let i = 0; i < data2.length; i++) {
          if (data2[i].name != req.query.name) {
            data2.splice(i, 1);
            i--;
          }
        }
      }

      if (req.query.chemember === 'true') {
        for (let i = 0; i < data2.length; i++) {
          if (data2[i].member != req.query.member) {
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
      console.log(data);

      if (data.length === 0) {
        var totalStudents = data2.length,
          pageSize = 3,
          pageCount = Math.round((totalStudents / 3 + 0.4)),
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
        if (typeof req.query.page === 'undefined') {
          page = 1;
        }
        studentsList = 'kosong';
      }
      else if (data2.length === 0) {
        var totalStudents = data.length,
          pageSize = 3,
          pageCount = Math.round((totalStudents / 3 + 0.4)),
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
        if (typeof req.query.page === 'undefined') {
          page = 1;
        }
        studentsList = studentsArrays[+currentPage - 1];
      }
      else {
        var totalStudents = data2.length,
          pageSize = 3,
          pageCount = Math.round((totalStudents / 3 + 0.4)),
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
        if (typeof req.query.page === 'undefined') {
          page = 1;
        }
        studentsList = studentsArrays[+currentPage - 1];
      }

      console.log(data);
      console.log(member);

      res.render('project/index', {
        title: "Users - Node.js",
        page: page, pageSize: pageSize,
        data: studentsList,
        member: member,
        pageCount: pageCount,
        currentPage: currentPage,
        value: value,
        adaurl: adaurl,
        todos: studentsList,
        link: link
      });
    })

  });
});

app.get('/project/:id/members', authenticationMiddleware(), function (req, res) {
  var id = req.params.id;
  var values = [
    id
  ];

  pool.query('SELECT * FROM projects WHERE projectid=$1', values, function (err, result) {
    if (err) {
      console.error(err.message);
    }

    var values2 = [
      result.rows[0].projectid
    ]

    console.log(values2);

    pool.query('SELECT * FROM users INNER JOIN members ON users.userid=members.userid WHERE projectid=$1', values2, function (err, result2) {
      if (err) {
        console.error(err.message);
      }

      pool.query('SELECT * FROM users', function (err, result3) {
        if (err) {
          console.error(err.message);
        }

        var data = result2.rows;
        var data3 = result3.rows;
        console.log(data3[0]);
        console.log(data);
        console.log('test');

        value = [
          req.query.id,
          req.query.name,
          req.query.position,
          req.query.float,
          req.query.startdate,
          req.query.enddate,
          req.query.boolean,
          req.query.cheid,
          req.query.chename,
          req.query.cheposition,
          req.query.chefloat,
          req.query.chedate,
          req.query.cheboolean
        ];


        var adaurl = '';
        var link = '';
        link = req.url;
        if (req.url == '/project/' || req.url == '/project') {
          adaurl = '';
        }
        else if (req.url.slice(0, 15) == '/project/?page=') {
          adaurl = req.url.slice(req.url.length, req.url.length);
        }
        else {
          adaurl = req.url;
        }

        console.log(link);


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

        var namalengkap = '';
        if (req.query.chename === 'true') {
          for (let i = 0; i < data2.length; i++) {
            namalengkap = data2[i].firstname + ' ' + data2[i].lastname;
            console.log(namalengkap);
            console.log(req.query.name);
            if (namalengkap != req.query.name) {
              data2.splice(i, 1);
              i--;
            }
            namalengkap = '';
          }
        }



        if (req.query.cheposition === 'true') {
          for (let i = 0; i < data2.length; i++) {
            if (data2[i].position != req.query.position) {
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
        console.log(data);

        if (data.length === 0) {
          var totalStudents = data2.length,
            pageSize = 3,
            pageCount = Math.round((totalStudents / 3 + 0.4)),
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
          if (typeof req.query.page === 'undefined') {
            page = 1;
          }
          studentsList = 'kosong';
        }
        else if (data2.length === 0) {
          var totalStudents = data.length,
            pageSize = 3,
            pageCount = Math.round((totalStudents / 3 + 0.4)),
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
          if (typeof req.query.page === 'undefined') {
            page = 1;
          }
          studentsList = studentsArrays[+currentPage - 1];
        }
        else {
          var totalStudents = data2.length,
            pageSize = 3,
            pageCount = Math.round((totalStudents / 3 + 0.4)),
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
          if (typeof req.query.page === 'undefined') {
            page = 1;
          }
          studentsList = studentsArrays[+currentPage - 1];
        }

        console.log(data3);

        res.render('project/members/index', {
          title: "Users - Node.js",
          page: page, pageSize: pageSize,
          data: studentsList,
          data3: data3,
          pageCount: pageCount,
          currentPage: currentPage,
          value: value,
          adaurl: adaurl,
          todos: studentsList,
          link: link,
          id: id
        });
      })
    })
  })
})

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
