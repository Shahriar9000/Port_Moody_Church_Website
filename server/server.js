const express = require('express');
const app = express();
const path = require('path');

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/../client/index.html'));
});


app.listen(8080, () => {
  console.log('App is running...');
});