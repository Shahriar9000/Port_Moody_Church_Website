const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
	res.render('register.ejs');
});

router.get('/register', (req, res) =>{
	res.render('register.ejs');
});


module.exports = router;