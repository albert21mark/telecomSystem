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
router.get('/users', function(req,res){
	res.render('users');
	var query = { status: { $ne: 'Delete' } }
	router.route("/fetchDataUsers").get(function(req, res) {
	  User.find(query, function(err, result) {
	    if (err) {
	      res.send(err);
	    } else {
	      res.send(result);
	    }
	  });
	});
	
})

router.post('/addUser', function(req,res){
	res.render('addUser');
})

router.post('/addUserSubmit', function(req,res){
	var name = req.body.name;
	var email = req.body.email;
	var username = req.body.username;
	var password = req.body.password;
	var password2 = req.body.password2;
	var role = req.body.role;
	var status = req.body.status;
	//validation
	req.checkBody('name', 'Name is required').notEmpty();
	req.checkBody('email', 'Email is required').notEmpty();
	req.checkBody('email', 'Email is not valid').isEmail();
	req.checkBody('password', 'Password is required').notEmpty();
	req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

	var errors = req.validationErrors();
	if(errors){
		res.render('addUser',{
			nameValue:name,
			emailValue:email,
			passwordValue:password,
			password2Value:password2,
			rolseValue:role,
			errors:errors

		})
	}else{
		var newUser = new User({
			name: name,
			email: email,
			password: password,
			role: role,
			status: status
		})

		User.createUser(newUser, function(err, user){
			if(err) throw err;
			//console.log(user);


		});
		req.flash('success_msg', 'User successfully added.');
		res.redirect('/users/users');
	}
})
router.get('/editUser', function(req,res){
	var query = {_id:req.query.id}
	User.findOne(query, function(err, user){
		if(err) throw err;
		res.render('editUser',{
			nameValue: user.name,
			emailValue: user.email,
			passwordValue: user.password,
			password2Value: user.password,
			roleValue: user.role,
			statusValue: user.status,
			hiddenValueID: req.query.id
		});
	});
})
router.post('/editUserSubmit', function(req,res){
	var userID = { _id:  req.body.hiddenID };
	var name = req.body.name;
	var email = req.body.email;
	var username = req.body.username;
	var password = req.body.password;
	var password2 = req.body.password2;
	var role = req.body.role;
	var status = req.body.status;
	//validation
	req.checkBody('name', 'Name is required').notEmpty();
	req.checkBody('email', 'Email is required').notEmpty();
	req.checkBody('email', 'Email is not valid').isEmail();
	req.checkBody('password', 'Password is required').notEmpty();
	req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

	var errors = req.validationErrors();
	if(errors){
		res.render('editUser',{
			nameValue:name,
			emailValue:email,
			passwordValue:password,
			password2Value:password2,
			roleValue:role,
			statusValue: status,
			errors:errors

		})
	}else{
		var editedUser = {
			name: name,
			email: email,
			password: password,
			role: role,
			status: status
		}

		
		User.editUser(userID, editedUser, function(err, user){
			if(err) throw err;
		});
		req.flash('success_msg', 'User successfully added.');
		res.redirect('/users/users');
	}
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
			password: password,
			role: 'User',
			status: 'Inactive'
		})
		//console.log(newUser);
		User.createUser(newUser, function(err, user){
			if(err) throw err;
			//console.log(user);


		});
		req.flash('success_msg', 'User successfully added.');
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
  		if(user.status=='Inactive'){
  			return done(null, false, {message: 'Account currently disabled. Please advise admin.'});	
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