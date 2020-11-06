 const express = require('express');
const router = express.Router();
const path = require('path');
const db = require('../db/index');


router.get('/', (req, res, next) => {
    res.render('notes.ejs');
});

router.get('/notes.js', (req, res) => {
    res.sendFile(path.join(__dirname + '../../../public/js/notes.js'));
  });

router.get('/get_notes', (req, res) => {
    const queryString = "SELECT * FROM notes WHERE record_status = 'Active'"
    db.query(queryString, (err, rows, fields) => {
      if (err) {
        console.log("Failed to query at /get_note: " + err)
      }
      console.log("Getting data from database at /get_notes")
      res.json(rows)
    })
  })

router.post('/add_note', (req, res) => {
    const user_id = 1;
    const note_title = req.body.add_node_title;
    const note_content = req.body.add_node_content;

    if(note_title || note_content) {
        const queryString = "INSERT INTO notes (user_id, title, content) VALUES (?, ?, ?)";
        db.query(queryString, [user_id, note_title, note_content], (err, rows, fields) => {
        if (err) {
            alert("Failed to insert at /add_note/: "  + " " + err);
        }else {
            console.log("@/add_note note " + note_title + " added.");
        }
        res.redirect('/notes');
        })
    }
})

router.post('/detele_note/:id', (req, res) => {
    const note_id = req.params.id
    const queryString = "UPDATE notes SET record_status = 'Deleted' WHERE note_id = ?";
    db.query(queryString, [note_id], (err, rows, fields) => {
      if (err) {
        alert("Failed to query at /detele_note/: " + note_id + " " + err);
      } else {
          console.log("@/detele_note/ Deleting note with id " + note_id);
      }
      res.redirect('/notes');
    })
})

module.exports = router;