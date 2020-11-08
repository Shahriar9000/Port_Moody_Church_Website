const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
var session = require('express-session');

const db = require('../db/index');

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

router.get('/', (req, res) => {
	res.render('login.ejs');
});

router.post("/loginUser", (req, res) => {

		try{
			const email = req.body.email;
			const password = req.body.password;

			db.query('SELECT * FROM users WHERE email = ?', [email], async(error, results) => {
				 //results is true when its empty

				if(Object.keys(results).length == 0 || !(await bcrypt.compare(password, results[0].password))){
					// res.status(401).render('login.ejs', {
					// 	message: 'Email or password is incorrect.'
					// })
					console.log('Email or Password is incorrect');
					res.status(401).render('login.ejs');
				}else{
					req.session.userId = results[0].id;
					console.log(req.session);
					res.redirect('/', {userId: results[0].id});
				}
			})

		}catch(error){
			console.log(error);
		}

});

module.exports = router;