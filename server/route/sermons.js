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
		const queryString = "INSERT INTO sermons (file_name, path, record_status) VALUES (?, ?, ?)";
		db.query(queryString, [fileName, newpath, 'Active'], (err, rows, fields) => {
			if (err) {
				console.log("Failed to insert at /sermons/: "  + " " + err);
			}else {
				console.log("@/uploadSermon sermon " + fileName + " added successfully.");
			}
        	res.redirect('/sermons');
		})
    });

});


router.get('/get_sermons', (req, res) => {
	const queryString = "SELECT * FROM sermons WHERE record_status = 'Active'";
	db.query(queryString, (err, rows, fields) => {
	  if (err) {
		console.log("Failed to query at /get_sermons: " + err)
	  }
	  res.json(rows)
	})
})

router.post('/add_note/:sermon_id', (req, res) => {
	const sermon_id = req.params.sermon_id
	const note_title = req.body.add_sermon_note_title;
	const note_content = req.body.add_sermon_note_content;
  
	if(note_title || note_content) {
		const queryString = "INSERT INTO notes (user_id, title, content) VALUES (?, ?, ?)";
		db.query(queryString, [userId, note_title, note_content], (err, rows, fields) => {
			if (err) {
				console.log("Failed to insert at /add_note/: "  + " " + err);
			}else {
				const note_id = rows.insertId;
				const queryString = "INSERT INTO sermon_has_notes (sermon_id, note_id) VALUES (?, ?)";
				db.query(queryString, [sermon_id, note_id], (err, rows, fields) => {
					if (err) {
						console.log("Failed to insert at /sermon_has_notes/: "  + " " + err);
					}else {
						console.log("@/add_note sermon " + sermon_id + " has note " + note_id + " added." );
					}
					res.redirect('/sermons');
				})
			}
		})
	}
})

router.get('/get_notes/:sermon_id', (req, res) => {
	const sermon_id = req.params.sermon_id
	const queryString = "SELECT notes.title, notes.content FROM sermons LEFT JOIN sermon_has_notes AS shn ON shn.sermon_id = sermons.sermon_id" + 
						" LEFT JOIN notes ON notes.note_id = shn.note_id WHERE sermons.record_status = 'Active' AND notes.record_status = 'Active'" +
						" AND sermons.sermon_id = " + sermon_id;
	db.query(queryString, (err, rows, fields) => {
	  if (err) {
		console.log("Failed to query at /get_note: " + err)
	  }
	  res.json(rows)
	})
})

module.exports = router;