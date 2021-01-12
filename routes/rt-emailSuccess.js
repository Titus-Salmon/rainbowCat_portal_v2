var express = require('express');
var router = express.Router();
var fs = require('fs');

const nodemailer = require('nodemailer');

var mysql = require('mysql')
const connection = mysql.createConnection({
  host: process.env.RB_HOST,
  user: process.env.RB_USER,
  password: process.env.RB_PW,
  database: process.env.RB_DB,
  multipleStatements: true //MUST HAVE to make more than 1 sql statement in a single query
})

// const connection = mysql.createConnection(process.env.JAWSDB_MARIA_URL);
// connection.connect();

/* GET autoEmail page. */
router.get('/', function (req, res, next) {
  res.render('vw-emailSuccess', {
    title: 'Successful Auto-Email',
    // emailResRows: successfulEmailArray
  });
});

module.exports = router;