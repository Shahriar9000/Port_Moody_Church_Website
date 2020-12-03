const express = require('express');
const app = express();
const path = require('path');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const db = require('./db/index');

const noteRouter = require('./route/notes');
const sermonsRouter =require('./route/sermons');
const adminRouter =require('./route/admin')

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

app.get('/sermons.css', (req, res) => {
  res.sendFile(path.join(__dirname + '/../public/css/sermons.css'));
});

app.get('/donation.css', (req, res) => {
  res.sendFile(path.join(__dirname + '/../public/css/donation.css'));
});
app.get('/contact.css', (req, res) => {
	res.sendFile(path.join(__dirname + '/../public/css/contact.css'));
  });

app.get('/bg_img.jpg', (req, res) => {
  res.sendFile(path.join(__dirname + '/../public/img/bg_img.jpg'));
});

app.get('/heart.png', (req, res) => {
  res.sendFile(path.join(__dirname + '/../public/img/heart.png'));
});


app.get('/donation', (req, res) => {
  res.render('donation.ejs', {userId, role});
});

app.get('/contact', (req, res) => {
	res.render('contact.ejs', {userId, role});
  });

app.get('/zoom', (req, res) => {
  res.render('zoom.ejs', {userId, role});
});

app.use('/notes', noteRouter);
app.use('/sermons', sermonsRouter);

app.use('/admin', adminRouter)

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
		if(results.length > 0){
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


app.listen( process.env.PORT || '8080', () => {
  console.log(`Server is running on port: ${process.env.POST || '8080'}`);
});

