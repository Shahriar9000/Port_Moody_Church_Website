const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();

const db = require('../db/index');

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
					res.redirect('/');
				}
			})

		}catch(error){
			console.log(error);
		}

});

module.exports = router;