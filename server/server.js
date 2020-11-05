const express = require('express');
const app = express();
const path = require('path');

/*app.use(express.static("./client/img"))*/
app.use(express.static(path.join(__dirname, '/../client')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/../client/index.html'));
});

app.get('/bg_img.jpg', (req, res) => {
  res.sendFile(path.join(__dirname + '/../img/bg_img.jpg'));
});

app.get('/donation', (req, res) => {
  res.sendFile(path.join(__dirname + '/../client/donation.html'));
});

app.listen(8080, () => {
  console.log('App is running...');
});