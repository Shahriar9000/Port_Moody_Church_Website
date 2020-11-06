const mysql = require("mysql");
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({path: path.join(__dirname + '/../../.env')});

const db = mysql.createConnection({
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: 'cmpt470',
  host: 'localhost',
})

db.connect(function(error) {
  if (!!error) {
    console.log(error);
  }else {
    console.log('Database Connected');
  }
})

module.exports = db;