const express = require('express');
const app = express();
const path = require('path');

app.use(express.static("./client/img"))

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/../client/index.html'));
});

app.get('/bg_img.jpg', (req, res) => {
  res.sendFile(path.join(__dirname + '/../img/bg_img.jpg'));
});

app.listen(8080, () => {
  console.log('App is running...');
});