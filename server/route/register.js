const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();

const db = require('../db/index');

router.get('/', (req, res) => {
	res.render('register.ejs');
});

router.post("/registerUser", (req, res) => {

	const name = req.body.name;
	const email = req.body.email;
	const password = req.body.password;
	const passwordConfirm = req.body.passwordConfirm;

	db.query('SELECT email FROM users WHERE email = ?', [email], async(error, results) => {

		if(error){
			console.log(error);
		}
		if(results.length > 0){
			// return res.render('register.ejs', {
			// 	message: 'This email is already in use.'
			// });
			console.log('This email in use');
			return res.render('register.ejs');
		}else if(password != passwordConfirm){
			// return res.render('register.ejs', {
			// 	message: 'Password do not match.
			// });
			console.log('psw dont match');
			return res.render('register.ejs');
		}
		let hashedPassword = await bcrypt.hash(password, 10);
		console.log(hashedPassword);
		
		db.query('INSERT INTO users SET ?', {name: name, email: email, password: hashedPassword}, (error, results) => {
			if(error){
				console.log(error);
			}
			else{
			// 	return res.render('register.ejs', {
			// 	message: 'User registered.'
			// });
				console.log(results);
				console.log('User registered');
				return res.render('register.ejs');
			}
		})

	});
});

module.exports = router;