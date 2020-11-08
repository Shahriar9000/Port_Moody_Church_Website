const express = require('express');
const app = express();
const path = require('path');
const noteRouter = require('./route/notes');



app.set('view-engine', 'ejs');
app.use(express.urlencoded({ extended: false }));

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.render('index.ejs');
});

app.get('/', (req, res) => {
  res.render('navbar.ejs');
});

app.get('/index.css', (req, res) => {
  res.sendFile(path.join(__dirname + '/../public/css/index.css'));
});

app.get('/index.js', (req, res) => {
  res.sendFile(path.join(__dirname + '/../public/db/index.js'));
});

app.get('/bg_img.jpg', (req, res) => {
  res.sendFile(path.join(__dirname + '/../public/img/bg_img.jpg'));
});

app.use('/notes', noteRouter);



app.listen( process.env.PORT || '8080', () => {
  console.log(`Server is running on port: ${process.env.POST || '8080'}`);
});