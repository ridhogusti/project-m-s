var express = require('express');
var app = express();
var moment = require('moment');

const { Pool, Client } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'pms',
  password: 'thetravis12',
  port: 5433
})

app.get('/', function (req, res, next) {
  res.render('index');
})

app.get('/project/:id/activity', authenticationMiddleware(), function (req, res, next) {

  var id = req.params.id;
  var dateSekarang = new Date();
  var jamSekarang = dateSekarang.getHours();
  var menitSekarang = dateSekarang.getMinutes();
  console.log(dateSekarang, jamSekarang, menitSekarang);
  var bulan = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
  var tanggal = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12',
    '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31'
  ]
  var tanggalSekarang = dateSekarang.getFullYear() + '-' + bulan[dateSekarang.getMonth()] + '-' + tanggal[dateSekarang.getDate()];
  var sekarang = moment().format("YYYY-MM-DD hh:mm:ss");
  var sekarang = moment().format("YYYY/MM/DD");
  var lalu = moment().subtract(7, 'days').format("YYYY-MM-DD hh:mm:ss");
  var lalu = moment().subtract(7, 'days').format("YYYY/MM/DD");
  var dateMinta = "2018-03-01";
  var dateMinta2 = "2018-03-03 14:14:06";
  var values = [
    dateMinta,
    dateMinta2
  ];


  pool.query('SELECT * FROM activity INNER JOIN users ON activity.author=users.userid WHERE time > $1 AND time <= $2  ORDER BY time desc', values, function (err, result) {
    if (err) {
      return console.error('error running query', err);
    } else {

      var data = result.rows;
      var listdata = [];
      var data2 = [];
      console.log(data);

      for (let i = 0; i < data.length; i++) {
        var ambilDate = new Date(data[i].time);
        console.log(ambilDate.getDate());
        if (listdata.includes(ambilDate.getFullYear() + '-' + ambilDate.getMonth() + '-' + ambilDate.getDate()) == false) {
          listdata[i] = ambilDate.getFullYear() + '-' + ambilDate.getMonth() + '-' + ambilDate.getDate();
          data2.push(data[i]);
        }
      }

      console.log(listdata);

      res.render('project/activity/index', { data: result.rows, data2: data2, sekarang: sekarang, lalu: lalu, id: id });
    }
  })
})

/* GET home page. */
app.get('/project', authenticationMiddleware(), function (req, res, next) {

  pool.query('SELECT * FROM projects ORDER BY projectid', function (err, result) {
    if (err) {
      return console.error('error running query', err);
    }
    pool.query('SELECT * FROM members INNER JOIN users ON members.userid = users.userid', function (err, result2) {
      var author = `${JSON.stringify(req.session.passport.user.user_id)}`;
      var values2 = [
        author
      ]
      pool.query('SELECT * FROM users WHERE userid= $1', values2, function (err, result3) {
        var datauser = result3.rows;
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
          link: link,
          datauser: datauser
        });
      })
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
        if (req.url == `/project/${id}/members/` || req.url == `/project/${id}/members`) {
          adaurl = '';
        }
        else if (req.url.slice(0, 25) == `/project/${id}/members/?page=`) {
          // else if (req.url.slice(0, 15) == '/project/?page=') {
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


    var datalama = result.rows;
  })
})

app.get('/project/issues/:id', authenticationMiddleware(), function (req, res) {
  var id = req.params.id;
  var values = [
    id
  ];

  pool.query('SELECT * FROM issues WHERE issueid = $1', values, function (err, result) {
    if (err) {
      console.log(err.message);
    } else {
      console.log(result.rows);
      res.json({
        data: result.rows
      })
    }
  })
})

app.get('/project/:id/issues', authenticationMiddleware(), function (req, res) {
  var id = req.params.id;
  var values = [
    id
  ];

  pool.query('SELECT * FROM issues WHERE projectid=$1', values, function (err, result) {
    if (err) {
      console.error(err.message);
    }

    pool.query('SELECT * FROM users', function (err, result2) {

      var data = result.rows;
      var data3 = result2.rows;
      var parentid = result.rows;

      value = [
        req.query.id,
        req.query.subject,
        req.query.tracker,
        req.query.float,
        req.query.startdate,
        req.query.enddate,
        req.query.boolean,
        req.query.cheid,
        req.query.chesubject,
        req.query.chetracker,
        req.query.chefloat,
        req.query.chedate,
        req.query.cheboolean
      ];


      var adaurl = '';
      var link = '';
      link = req.url;
      console.log(`/project/${id}/issues`);
      if (req.url == `/project/${id}/issues/` || req.url == `/project/${id}/issues`) {
        adaurl = '';
      }
      else if (req.url.slice(0, 24) == `/project/${id}/issues/?page=`) {
        adaurl = req.url.slice(req.url.length, req.url.length);
      }
      else {
        adaurl = req.url;
      }

      console.log(link);
      console.log(adaurl);


      console.log(value[7]);

      console.log('test');

      if (value[7] == null) {
        console.log('null');
      }

      var data2 = [];
      for (let i = 0; i < data.length; i++) {
        data2.push(data[i]);
      }
      if (req.query.cheid === 'true') {
        for (let i = 0; i < data2.length; i++) {
          if (data2[i].issueid != req.query.id) {
            data2.splice(i, 1);
            i--;
          }
        }
      }

      if (req.query.chesubject === 'true') {
        for (let i = 0; i < data2.length; i++) {
          if (data2[i].subject != req.query.subject) {
            data2.splice(i, 1);
            i--;
          }
        }
      }



      if (req.query.chetracker === 'true') {
        for (let i = 0; i < data2.length; i++) {
          if (data2[i].tracker != req.query.tracker) {
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

        var parentid2 = parentid;
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


      res.render('project/issues/index', {
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
        id: id,
        parentid: parentid
      });
    })

  })
})

function authenticationMiddleware() {
  return (req, res, next) => {
    // console.log(`req.session.passport.user: ${JSON.stringify(req.session.passport.user.user_id)}`);
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect('/users/login');
  }
}

module.exports = app;
