const express = require('express');
const app = express();
const path = require('path');
const session = require('express-session');

const noteRouter = require('./route/notes');

app.set('view-engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get('/', (req, res) => {
  res.render('index.ejs');
});

app.get('/index.css', (req, res) => {
  res.sendFile(path.join(__dirname + '/../public/css/index.css'));
});

app.get('/bg_img.jpg', (req, res) => {
  res.sendFile(path.join(__dirname + '/../public/img/bg_img.jpg'));
});

app.use('/notes', noteRouter);

app.use('/login', require('./route/login'));

app.use('/register', require('./route/register'));

app.post('/logout', (req, res) => {
  res.redirect('/');
});

app.use(
  session({
    name: 'sid',
    saveUninitialized: false,
    resave: false,
    secret: `quiet, pal! it's a secret!`,
    cookie: {
      maxAge: 1000 * 60 * 60 * 2,
      sameSite: true,
    }
  })
)

app.use(function(req, res, next) {
  res.locals.user = req.session.user;
  next();
});



app.listen( process.env.PORT || '8080', () => {
  console.log(`Server is running on port: ${process.env.POST || '8080'}`);
});