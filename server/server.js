const express = require('express');
const app = express();
const path = require('path');
const mysql = require("mysql");
const dotenv = require('dotenv');
// const apiRouter = require('./route');

dotenv.config({path: '../.env'});

app.set('view-engine', 'ejs');
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.render('index.ejs');
});

app.get('/index.css', (req, res) => {
  res.sendFile(path.join(__dirname + '/../public/css/index.css'));
});

app.get('/bg_img.jpg', (req, res) => {
  res.sendFile(path.join(__dirname + '/../public/img/bg_img.jpg'));
});

app.get('/notes', (req, res, next) => {
  res.render('notes.ejs');
});

const db = mysql.createConnection({
  user: 'root',
  password: '',
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

app.listen( process.env.PORT || '8080', () => {
  console.log(`Server is running on port: ${process.env.POST || '8080'}`);
});