var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var UserSchema = mongoose.Schema({
	username: {
		type: String
	},
	password: {
		type: String
	},
	email: {
		type: String,
		index: true
	},
	name: {
		type: String
	},
		role: {
		type: String
	},
		status: {
		type: String
	}
});

var User = module.exports = mongoose.model('user', UserSchema);

module.exports.createUser = function(newUser, callback){
	bcrypt.genSalt(10, function(err, salt) {
	    bcrypt.hash(newUser.password, salt, function(err, hash) {
	        newUser.password = hash;
	        newUser.save(callback);
	    });
	});
}

module.exports.editUser = function(userID,editedUser, callback){
	bcrypt.genSalt(10, function(err, salt) {
	    bcrypt.hash(editedUser.password, salt, function(err, hash, callback) {
	        editedUser.password = hash;
	        User.findOneAndUpdate(userID,editedUser, function(err, user){
				if(err) throw err;
			}); 

	        //editedUser.save(callback);
	        //return(password);
	    });
	});
}


module.exports.getUserById = function(id, callback){
	User.findById(id, callback);
	user_ID=id;
}
module.exports.getUserByEmail = function(email, callback){
	var query = {email: email}
	User.findOne(query, callback);
}
module.exports.getAllUsers = function(req,res,callback){


	var query = { status: { $ne: 'Delete' } }
	User.find(query, function(err, result) {
	    if (err) {
	      console.log(err);
	    } else {
	      console.log(result);
	    }
	  });
}

module.exports.comparePassword = function(candidatePassword, hash, callback){
	bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
    	if(err) throw err;
    	callback(null, isMatch);
	});
}