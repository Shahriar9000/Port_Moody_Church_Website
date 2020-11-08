const express = require('express');
const app = express();
const path = require('path');
const bcrypt = require('bcrypt');
const session = require('express-session');
const db = require('./db/index');

const noteRouter = require('./route/notes');

var userId = -1;

app.set('view-engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

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
	}
  res.render('index.ejs', {userId});
});

app.get('/index.css', (req, res) => {
  res.sendFile(path.join(__dirname + '/../public/css/index.css'));
});

app.get('/donation.css', (req, res) => {
  res.sendFile(path.join(__dirname + '/../public/css/donation.css'));
});

app.get('/bg_img.jpg', (req, res) => {
  res.sendFile(path.join(__dirname + '/../public/img/bg_img.jpg'));
});

app.get('/heart.png', (req, res) => {
  res.sendFile(path.join(__dirname + '/../public/img/heart.png'));
});

app.get('/donation', (req, res) => {
  userId = -1	
  res.render('donation.ejs', {userId});
});

app.get('/zoom', (req, res) => {
  userId = -1	
  res.render('zoom.ejs', {userId});
});

app.use('/notes', noteRouter);

app.get('/login', checkUserLogin, (req, res) => {
	res.render('login.ejs', {userId: req.session.userId});
});

app.post("/loginUser", (req, res) => {

		try{
			const email = req.body.email;
			const password = req.body.password;

			db.query('SELECT * FROM users WHERE email = ?', [email], async(error, results) => {
				 //results is true when its empty

				if(Object.keys(results).length == 0 || !(await bcrypt.compare(password, results[0].password))){
					// res.status(401).render('login.ejs', {
					// 	message: 'Email or password is incorrect.'
					// })
					alert('Email or Password is incorrect');
					res.status(401).render('login.ejs');
				}else{
					req.session.userId = results[0].id;
					// console.log(req.session);
					res.redirect('/');
				}
			})

		}catch(error){
			console.log(error);
		}

});

function checkUserLogin(req, res, next) {
  if(typeof req.session != undefined && req.session.userId){
    res.redirect('/');
  }
  return next();
}

app.get('/register', checkUserLogin, (req, res) => {
	if (typeof req.session != undefined) {
		userId = req.session.userId ? req.session.userId : -1;
	}
	res.render('register.ejs', {userId});
});

app.post("/registerUser", (req, res) => {

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
			alert('This email in use');
			return res.render('register.ejs');
		}else if(password != passwordConfirm){
			// return res.render('register.ejs', {
			// 	message: 'Password do not match.
			// });
			alert('Password does not match');
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
				alert('User registered');
				return res.render('login.ejs');
			}
		})

	});
});

app.get('/logout', (req, res) => {
  req.session.userId = null;
  res.redirect('/');
});


app.listen( process.env.PORT || '8080', () => {
  console.log(`Server is running on port: ${process.env.POST || '8080'}`);
});