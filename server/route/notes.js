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
  if (userId != -1) {
    res.render('notes.ejs', {userId, role});
  }
  else {
    res.render('login.ejs', {userId: -1, role: 'regular', errmsg: 'Login is required.'});
  }
});

router.get('/notes.js', (req, res) => {
  res.sendFile(path.join(__dirname + '../../../public/js/notes.js'));
});

router.get('/notes.css', (req, res) => {
  res.sendFile(path.join(__dirname + '../../../public/css/notes.css'));
});

router.get('/get_notes', (req, res) => {
  const queryString = "SELECT * FROM notes WHERE record_status = 'Active' AND user_id = " + userId;
  db.query(queryString, (err, rows, fields) => {
    if (err) {
      console.log("Failed to query at /get_note: " + err)
    }
    res.json(rows)
  })
})

router.get('/get_notes/:id', (req, res) => {
  const note_id = req.params.id
  const queryString = "SELECT * FROM notes WHERE record_status = 'Active' AND user_id = " + userId + " AND note_id = " + note_id;
  db.query(queryString, (err, rows, fields) => {
    if (err) {
      console.log("Failed to query at /get_note: " + err)
    }
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

router.post('/update_note/:id', (req, res) => {
  const note_id = req.params.id
  const note_title = req.body.update_note_title;
  const note_content = req.body.update_note_content;

  const queryString = "UPDATE notes SET title = \'"+ note_title +"\', content = \'"+ note_content +"\' WHERE note_id = "+ note_id +" AND user_id = " + userId;
  db.query(queryString, (err, rows, fields) => {
  if (err) {
      console.log("Failed to insert at /update_note/: "  + " " + err);
  }else {
      console.log("@/update_note note " + note_id + " updated.");
  }
  res.redirect('/notes');
  })
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