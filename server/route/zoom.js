const express = require('express');
const router = express.Router();
const path = require('path');
const db = require('../db/index');
const jwt = require('jsonwebtoken');
const rp = require("request-promise");
var session = require('express-session');

var userId = -1;
var role = 'regular';
var epoch =  parseInt(new Date(2021, 1, 1).getTime() / 1000)
const token = jwt.sign({ 
    "iss": process.env.ZOOM_API_KEY,
    "exp": epoch
  }, process.env.ZOOM_SECRET);

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
      const queryString = "SELECT * from meetings;"
      db.query(queryString, (err, rows) => {
          if (err) {
            console.log("Failed to query at /get_note: " + err)
          }
          res.render('zoom.ejs', {userId, role, rows});
          })
    }
    else {
      res.render('login.ejs', {userId: -1, role: 'regular', errmsg: 'Login is required.'});
    }
  });


router.get('/zoom.css', (req, res) => {
    res.sendFile(path.join(__dirname + '../../../public/css/zoom.css'));
});

router.get('/zoom.js', (req, res) => {
  res.sendFile(path.join(__dirname + '../../../public/js/zoom.js'));
});


router.post('/', function (req, res) {



});



router.post('/add', function (req, res) {
    // email = "host1.cmpt@gmail.com";
    // zoom_id is a userID needed to create a meeting for the zoom API
    // a user is defined as a "user" within a organization with admin abilities
    const title = req.body.meeting_title;
    const date = req.body.meeting_date;
    const duration = req.body.meeting_duration;
    const description = req.body.meeting_description
    const zoom_id = "fdYHTt0OTbujpDESOmOa9g";

    var options = {
        method: 'POST',
        uri: "https://api.zoom.us/v2/users/" + zoom_id + "/" + "meetings", 
        qs: {
            status: 'active' 
        },
        auth: {
            'bearer': token
        },
        headers: {
            'User-Agent': 'Zoom-api-Jwt-Request',
            'content-type': 'application/json'
        },
        body: {
            topic: title,
            type: 2,
            start_time: '2020-12-25 12:00:00',
            agenda: description,
            duration: duration,
            start_time: date
          },
        json: true //Parse the JSON string in the response
    };
    //console.log(options);
    //Use request-promise module's .then() method to make request calls.
    rp(options)
        .then(function (response) {
          //printing the response on the console
            console.log(response);
            //console.log(typeof response);
            resp = response
     
        })
        .catch(function (err) {
            // API call failed...
            console.log('API call failed, reason ', err);
        });

    res.redirect('/zoom');
  })
  









  module.exports = router;












