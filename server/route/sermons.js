const express = require('express');
const router = express.Router();
const path = require('path');
const db = require('../db/index');
var session = require('express-session');
const fileUpload = require('express-fileupload');
const fs = require('fs');

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

// enable files upload
router.use(fileUpload({
	createParentPath: true,
	useTempFiles : true,
}));

router.get('/', (req, res, next) => {
  if (typeof req.session != undefined) {
		userId = req.session.userId ? req.session.userId : -1;
		role = req.session.role ? req.session.role : 'regular';
	}
  res.render('sermons.ejs', {userId, role});
});

router.get('/sermons.js', (req, res) => {
  res.sendFile(path.join(__dirname + '../../../public/js/sermons.js'));
});


router.post('/uploadSermon', (req, res) => {

	var fileName = req.files.newSermon.name;
	var oldpath = req.files.newSermon.tempFilePath;
	var newpath = path.join(__dirname + '../../../public/sermons/' + fileName);

	fs.rename(oldpath, newpath, function (err) {
		if (err) throw err;
		console.log("@/uploadSermon file uploaded successfully.");
        res.redirect('/sermons');
    });

})

module.exports = router;