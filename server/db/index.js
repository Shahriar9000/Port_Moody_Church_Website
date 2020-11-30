const mysql = require("mysql");
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({path: path.join(__dirname + '/../../.env')});

const db = mysql.createConnection({
  user: 'root',
  password: 'root',
  database: 'cmpt470',
  host: 'localhost',
  port: '8889',
})

db.connect(function(error) {
  if (!!error) {
    console.log(error);
  }else {
    console.log('Database Connected');
  }
})

module.exports = db;