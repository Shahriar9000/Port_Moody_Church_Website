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

router.get('/admin.js', (req, res) => {
    res.sendFile(path.join(__dirname + '../../../public/js/admin.js'));
});

router.get('/getTable', (req, res) => {
	const user_id = req.params.id;
	const query = "SELECT * FROM users WHERE role = 'regular' AND id =" + user_id;
	db.query(query, (err, rows, fields) => {
		if(err) {
			console.Consolelog("Failed to query: " + err);
		}
		console.log("Getting user data from database");
		res.json(rows);
	})
});

router.post('/delete_user/:id', (req, res) => {
	const user_id = req.params.id;
	const query = "DELETE FROM users WHERE id = ?";
	db.query(query, [user_id], (err, rows, fields) => {
		if(err) {
			console.log("Failed to delete users " + user_id + " " + err);
		} else{
			console.log("Deleted user: " + user_id);
		}
		res.redirect('/admin');
	})
});


module.exports = router;