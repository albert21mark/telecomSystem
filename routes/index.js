var express = require('express');
var router = express.Router();
var jobsModel = require('../models/jobs')


//get homepage
router.get('/',ensureAuthenticated, function(req,res){
	res.render('index');
	router.route("/fetchData").get(function(req, res) {
	  jobsModel.find({}, function(err, result) {
	    if (err) {
	      res.send(err);
	    } else {
	      res.send(result);
	    }
	  });
	});
})
function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}else{
		res.redirect('/users/login');
	}
}

router.post('/updateJob', function(req,res){
	var jobID = {_id: req.body._id};
	var query = { status: 'Done' };
	jobsModel.findOneAndUpdate(jobID, query,  function(err, result) {
	    if (err) {
	      res.send(err);
	    } else {

	      res.send(result);

	    }
	     req.flash('success_msg', 'Job successfully updated the status to Done.');
	  });
})


module.exports = router;

