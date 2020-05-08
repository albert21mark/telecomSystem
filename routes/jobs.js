var express = require('express');
var router = express.Router();
var Jobs = require('../models/jobs')
var User = require('../models/users')



//edit job route
router.get('/editJob', function(req,res){

	var query1 = { status: { $ne: 'Delete' } }
	var usersList = [];

  	User.find(query1).exec(function(err, list) {
  		if(err) throw err
	    usersList = list;
		var query = {_id:req.query.id}
		Jobs.findOne(query, function(err, job){
			if(err) throw err;
			res.render('editJob',{
				WOTValue:job.WOT,
				ASIDValue:job.ASID,
				jobTypeValue:job.jobType,
				partnerValue:job.partner,
				addressValue:job.address,
				assignedToValue: job.assignedTo,
				dateAssignedValue: job.dateAssigned,
				jobDetailsValue: job.jobDetails,
				actionTakenValue: job.actionTaken,
				statusValue: job.status,
				hiddenValueID:req.query.id,
				usersList: usersList
			});
		});
  	});
	
})

router.post('/editJobSubmit', function(req,res){
	var jobID = { _id:  req.body.hiddenID };
	var WOT = req.body.WOT;
	var ASID = req.body.ASID;
	var jobType = req.body.jobType;
	var partner = req.body.partner;
	var address = req.body.address;
	var assignedTo = req.body.assignedTo;
	var dateAssigned = req.body.dateAssigned;
	var jobDetails = req.body.jobDetails;
	var actionTaken = req.body.actionTaken;
	var status = req.body.status;
	var hiddenID = req.body.hiddenID;
	//validation
	req.checkBody('WOT', 'WOT/Service Order is required').notEmpty();
	req.checkBody('address', 'Address is required').notEmpty();
	req.checkBody('dateAssigned', 'Date is required').notEmpty();

	var errors = req.validationErrors();
	if(errors){
		res.render('editJob',{
			WOTValue:req.body.WOT,
			ASIDValue:req.body.ASID,
			jobTypeValue:req.body.jobType,
			partnerValue:req.body.partner,
			addressValue:req.body.address,
			assignedToValue: req.body.assignedTo,
			dateAssignedValue: req.body.dateAssigned,
			jobDetailsValue: req.body.jobDetails,
			actionTakenValue: req.body.actionTaken,
			statusValue: req.body.status,
			errors:errors
		})
	}else{
		
		var editedJob = {
			WOT: WOT,
			ASID: ASID,
			jobType: jobType,
			partner: partner,
			address:address,
			assignedTo:assignedTo,
			dateAssigned: dateAssigned,
			jobDetails: jobDetails,
			actionTaken: actionTaken,
			status: status
		}
		Jobs.findOneAndUpdate(jobID, editedJob, function(err, user){
			if(err) throw err;
		});
		req.flash('success_msg', 'Job edited successfully.');
		res.redirect('/');
	}



});


//add job
router.post('/addJob',ensureAuthenticated, function(req,res){
	var query = { status: { $ne: 'Delete' } }
	var usersList = [];

  	User.find(query).exec(function(err, list) {
  		if(err) throw err
	    usersList = list;
		res.render('addJob',{
			usersList: usersList
		});
  	});
})


//add job page
router.post('/addJobSubmit', function(req,res){
	var WOT = req.body.WOT;
	var ASID = req.body.ASID;
	var jobType = req.body.jobType;
	var partner = req.body.partner;
	var address = req.body.address;
	var assignedTo = req.body.assignedTo;
	var dateAssigned = req.body.dateAssigned;
	var jobDetails = req.body.jobDetails;
	var actionTaken = req.body.actionTaken;
	//validation
	req.checkBody('WOT', 'WOT/Service Order is required').notEmpty();
	req.checkBody('address', 'Address is required').notEmpty();
	req.checkBody('dateAssigned', 'Date is required').notEmpty();

	var errors = req.validationErrors();
	if(errors){
		res.render('addJob',{
			errors:errors
		})
	}else{
		var newJob = new Jobs({
			WOT: WOT,
			ASID: ASID,
			jobType: jobType,
			partner: partner,
			address:address,
			dateAssigned: dateAssigned,
			assignedTo: assignedTo,
			jobDetails: jobDetails,
			actionTaken: actionTaken,
			addedBy: req.user._id,
			status: 'Pending'
		})
		Jobs.createJob(newJob, function(err, user){
			if(err) throw err;
		});
		req.flash('success_msg', 'Job added successfully.');
		res.redirect('/');
	}
})








function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}else{
		res.redirect('/users/login');
	}
}





module.exports = router;