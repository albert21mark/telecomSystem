var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/users')
//register route
router.get('/register', function(req,res){
	res.render('register');
})
//login
router.get('/login', function(req,res){
	res.render('login');
})


//register user
router.post('/register', function(req,res){
	var name = req.body.name;
	var email = req.body.email;
	var username = req.body.username;
	var password = req.body.password;
	var password2 = req.body.password2;
	//validation
	req.checkBody('name', 'Name is required').notEmpty();
	req.checkBody('email', 'Email is required').notEmpty();
	req.checkBody('email', 'Email is not valid').isEmail();
	req.checkBody('password', 'Password is required').notEmpty();
	req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

	var errors = req.validationErrors();
	if(errors){
		res.render('register',{
			nameValue:name,
			emailValue:email,
			passwordValue:password,
			password2Value:password2,
			errors:errors

		})
	}else{
		var newUser = new User({
			name: name,
			email: email,
			password: password
		})

		User.createUser(newUser, function(err, user){
			if(err) throw err;
			//console.log(user);


		});
		req.flash('success_msg', 'Successfull');
		res.redirect('/users/login');
	}
})

passport.use(
	new LocalStrategy({usernameField : "email"},(email, password, done) => {
  	User.getUserByEmail(email, function(err, user){
  		if(err) throw err;
  		if(!user){
  			return done(null, false, {message: 'Unknown User'});
  		}
		User.comparePassword(password, user.password, function(err, isMatch){
			if(err) throw err;	
			if(isMatch){
				return done(null, user);
			}else{
				return done(null, false, {message: 'Invalid Password'})
			}
		})
  	});

  }));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});
	

router.post('/login',
	passport.authenticate('local',{successRedirect:'/', failureRedirect:'/users/login',failureFlash: true}),
	function(req, res){
		res.redirect('/');
	});

router.get('/logout', function(req, res){
	req.logout();
	req.flash('success_msg', 'You are logged out');
	res.redirect('/users/login');
})
module.exports = router;