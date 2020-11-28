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
  if (typeof req.session != undefined) {
    userId = req.session.userId ? req.session.userId : -1;
  } 
  if (userId != -1) {
    res.render('notes.ejs', {userId});
  }
  else {
    res.render('login.ejs', {userId: -1, errmsg: 'Login is required.'});
  }
});

router.get('/notes.js', (req, res) => {
  res.sendFile(path.join(__dirname + '../../../public/js/notes.js'));
});

router.get('/get_notes', (req, res) => {
  const queryString = "SELECT * FROM notes WHERE record_status = 'Active' AND user_id = " + userId;
  db.query(queryString, (err, rows, fields) => {
    if (err) {
      console.log("Failed to query at /get_note: " + err)
    }
    console.log("Getting data from database at /get_notes")
    res.json(rows)
  })
})

router.post('/add_note', (req, res) => {
  const note_title = req.body.add_node_title;
  const note_content = req.body.add_node_content;

  if(note_title || note_content) {
      const queryString = "INSERT INTO notes (user_id, title, content) VALUES (?, ?, ?)";
      db.query(queryString, [userId, note_title, note_content], (err, rows, fields) => {
      if (err) {
          console.log("Failed to insert at /add_note/: "  + " " + err);
      }else {
          console.log("@/add_note note " + note_title + " added.");
      }
      res.redirect('/notes');
      })
  }
})

router.post('/detele_note/:id', (req, res) => {
  const note_id = req.params.id
  const queryString = "DELETE FROM notes WHERE note_id = ?";
  db.query(queryString, [note_id], (err, rows, fields) => {
    if (err) {
      console.log("Failed to query at /detele_note/: " + note_id + " " + err);
    } else {
        console.log("@/detele_note/ Deleting note with id " + note_id);
    }
    res.redirect('/notes');
  })
})

module.exports = router;