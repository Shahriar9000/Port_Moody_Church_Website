const express = require('express');
const app = express();
const path = require('path');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const db = require('./db/index');


const noteRouter = require('./route/notes');
const sermonsRouter =require('./route/sermons');
const adminRouter =require('./route/admin')
const zoomRouter = require('./route/zoom')
const adminRouter =require('./route/admin');
const eventRouter =require('./route/events');

var userId = -1;
var role = 'regular';

app.set('view-engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static('public'));

app.use(
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


app.get('/', (req, res) => {
	if (typeof req.session != undefined) {
		userId = req.session.userId ? req.session.userId : -1;
		role = req.session.role? req.session.role : 'regular';
	}
  res.render('index.ejs', {userId, role});
});

app.get('/index.css', (req, res) => {
  res.sendFile(path.join(__dirname + '/../public/css/index.css'));
});
app.get('/footer.css', (req, res) => {
	res.sendFile(path.join(__dirname + '/../public/css/footer.css'));
  });

  app.get('/footer_new.css', (req, res) => {
	res.sendFile(path.join(__dirname + '/../public/css/footer_new.css'));
  });

app.get('/sermons.css', (req, res) => {
  res.sendFile(path.join(__dirname + '/../public/css/sermons.css'));
});

app.get('/staff_info.css', (req, res) => {
	res.sendFile(path.join(__dirname + '/../public/css/staff_info.css'));
  });

app.get('/donation.css', (req, res) => {
  res.sendFile(path.join(__dirname + '/../public/css/donation.css'));
});

app.get('/contact.css', (req, res) => {
	res.sendFile(path.join(__dirname + '/../public/css/contact.css'));
  });


 app.get('/calendar.css', (req, res) => {
	res.sendFile(path.join(__dirname + '/../public/css/calendar.css'));
  });

app.get('/bg_img.jpg', (req, res) => {
  res.sendFile(path.join(__dirname + '/../public/img/bg_img.jpg'));
});
app.get('/churchIndoor2.jpg', (req, res) => {
	res.sendFile(path.join(__dirname + '/../public/img/churchIndoor2.jpg'));
  });
app.get('/heart.png', (req, res) => {
  res.sendFile(path.join(__dirname + '/../public/img/heart.png'));
});
app.get('/church2.jpg', (req, res) => {
	res.sendFile(path.join(__dirname + '/../public/img/church2.jpg'));
  });

app.get('/donation', (req, res) => {
  res.render('donation.ejs', {userId, role});
});

app.get('/contact', (req, res) => {
	res.render('contact.ejs', {userId, role});
  });

app.get('/staff_info', (req, res) => {
	res.render('staff_info.ejs', {userId, role});
  });


app.use('/zoom', zoomRouter);

// app.use('/create_event', eventRouter);

app.use('/notes', noteRouter);
app.use('/sermons', sermonsRouter);

app.use('/admin', adminRouter);


app.get('/login', checkUserLogin, (req, res) => {
	res.render('login.ejs', {userId: -1, role: 'regular', errmsg: ''});
});

app.post("/loginUser", (req, res) => {

		try{
			const email = req.body.email;
			const password = req.body.password;

			db.query('SELECT * FROM users WHERE email = ?', [email], async(error, results) => {
				 //results is true when its empty

				if(Object.keys(results).length == 0 || !(await bcrypt.compare(password, results[0].password))){
            		res.status(401).render('login.ejs', {userId: -1, errmsg: 'Email or password is incorrect.'})
				}else{
					req.session.userId = results[0].id;
					req.session.role = results[0].role;
					req.session.zoomId = results[0].zoom_id;
					userId = results[0].id;
					role = results[0].role;
					res.render('index.ejs', {userId, role});
				}
			})

		}catch(error){
			console.log(error);
		}

});

function checkUserLogin(req, res, next) {
  if(typeof req.session != undefined && req.session.userId){
	res.redirect('/');
  }else{
	  return next();
  }
}

app.get('/register', checkUserLogin, (req, res) => {
	if (typeof req.session != undefined) {
		userId = req.session.userId ? req.session.userId : -1;
		role = req.session.role ? req.session.role : 'regular';
	}
	res.render('register.ejs', {userId, role, errmsg: ''});
});

app.post("/registerUser", (req, res) => {

	const name = req.body.name;
	const email = req.body.email;
	const password = req.body.password;
	const passwordConfirm = req.body.passwordConfirm;
	const role = 'regular';

	db.query('SELECT email FROM users WHERE email = ?', [email], async(error, results) => {

		if(error){
			console.log(error);
		}
		else if(results.length > 0){
			return res.render('register.ejs', {userId, role, errmsg: 'This email is already in use.'});
		}else if(password != passwordConfirm){
			return res.render('register.ejs', {userId, role, errmsg: 'Password do not match'});
		}
		let hashedPassword = await bcrypt.hash(password, 10);
		console.log(hashedPassword);
		
		db.query('INSERT INTO users SET ?', {name: name, email: email, password: hashedPassword, role: role}, (error, results) => {
			if(error){
				console.log(error);
			}
			else{
				return res.render('login.ejs', {userId, role, errmsg: ''});
			}
		})

	});
});

app.get('/logout', (req, res) => {
  req.session.userId = null;
  req.session.role = 'regular';
  userId = -1;
  role = 'regular';
  res.redirect('/');;
});

// EVENT-----------------------------------------------------------------
app.get('/create_event', (req, res) => {
    res.render('create_event.ejs', {userId, role});
});


app.post('/create_event/add_event', (req, res) => {
	const event_date = req.body.date;
	const event_time = req.body.time;
	const event_type = req.body.event_type;
	// console.log(event_time);
  	
	const queryString = "INSERT INTO Events (Event_date , Event_time, Event_Type) VALUES (?, ?, ?)";
	db.query(queryString, [event_date, event_time, event_type], (err, rows, fields) => {
	if (err) {
		console.log("Failed to insert at /add_event/: "  + " " + err);
	}else {
		console.log("@/add_event event: " + event_type + " added on " + event_date);
	}
	
	res.redirect('/create_event');
	})
})

app.get('/display_event/event_handler.js', (req, res) => {
	res.sendFile(path.join(__dirname + '/../public/js/event_handler.js'));
  });

app.get('/display_event', (req, res) => {
	res.render('display_event.ejs', {userId, role});
  });


app.get('/display_event/show_all_events', (req, res) => {
	const queryString = "SELECT * FROM Events";
	db.query(queryString, (err, rows, fields) => {
	  if (err) {
		console.log("Failed to query at /show_all_events: " + err);
	  }
	// console.log(rows)
	res.json(rows);
	})
  })

app.post('/display_event/delete_event', (req, res) => {
	const event_id = req.body.id;
	console.log('Deleting Event..');
	const queryString = "DELETE FROM Events WHERE Id = ?";
	db.query(queryString, [event_id], (err, rows, fields) => {
	  if (err) {
		console.log("Failed to query at /delete_event/: " + event_id + " " + err);
	  } else {
		  console.log("@/delete_event/ Deleting event with id " + event_id);
	  }
	  res.redirect('/display_event');
	})
  })



app.listen( process.env.PORT || '8080', () => {
  console.log(`Server is running on port: ${process.env.POST || '8080'}`);
});


