const express = require('express');
const app = express();
const path = require('path');
const noteRouter = require('./route/notes');


app.set('view-engine', 'ejs');
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.render('index.ejs');
});

app.get('/index.css', (req, res) => {
  res.sendFile(path.join(__dirname + '/../public/css/index.css'));
});

app.get('/donation.css', (req, res) => {
  res.sendFile(path.join(__dirname + '/../public/css/donation.css'));
});

app.get('/bg_img.jpg', (req, res) => {
  res.sendFile(path.join(__dirname + '/../public/img/bg_img.jpg'));
});

app.get('/heart.png', (req, res) => {
  res.sendFile(path.join(__dirname + '/../public/img/heart.png'));
});

app.get('/donation', (req, res) => {
  res.render('donation.ejs');
});

app.get('/zoom', (req, res) => {
  res.render('zoom.ejs');
});

app.use('/notes', noteRouter);


app.listen( process.env.PORT || '8080', () => {
  console.log(`Server is running on port: ${process.env.POST || '8080'}`);
});