const express = require('express');
const router = express.Router();
const path = require('path');
const db = require('../db/index');
var session = require('express-session');

var userId = -1;
var role = 'regular';

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
  if (typeof req.session != undefined) {
    userId = req.session.userId ? req.session.userId : -1;
    role = req.session.role ? req.session.role : 'regular';
  }
  res.render('admin.ejs', {userId, role});
}); 

module.exports = router;