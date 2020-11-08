const express = require('express');
const router = express.Router();
const path = require('path');
const db = require('../db/index');
var session = require('express-session');

var userId = -1;

router.use(
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

router.get('/', (req, res, next) => {
  console.log("xxx :", req.session);
  if (typeof req.session != undefined) {
		userId = req.session.userId ? req.session.userId : -1;
	}
  res.render('sermons.ejs', {userId});
});

router.get('/sermons.js', (req, res) => {
  res.sendFile(path.join(__dirname + '../../../public/js/notes.js'));
});


module.exports = router;