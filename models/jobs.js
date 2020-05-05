var mongoose = require('mongoose');
var JobsSchema = mongoose.Schema({
	WOT: {
		type: String,
		index: true
	},
	ASID: {
		type: String
	},
	partner: {
		type: String
	},
	address: {
		type: String
	},
	dateAssigned: {
		type: String
	},
	jobDetails: {
		type: String
	},
	actionTaken: {
		type: String
	},
	addedBy: {
		type: String
	},
	status: {
		type: String
	}
});


var jobsColl = module.exports = mongoose.model('jobs', JobsSchema);
module.exports.createJob = function(newJob, callback){
	newJob.save(callback);
}