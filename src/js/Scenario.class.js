//TODO: gulp script creates this file based on config

function Scenario(){
	this.jobs = [
		{name: 'Bard', str: 10, magic: 10, dex: 30},
		{name: 'Druid', str: 10, magic: 20, dex: 20},
		{name: 'Mage', str: 10, magic: 30, dex: 10},
		{name: 'Paladin', str: 20, magic: 20, dex: 10},
		{name: 'Fighter', str: 30, magic: 10, dex: 10},
		{name: 'Tinker', str: 20, magic: 10, dex: 20},
		{name: 'Shepherd', str: 10, magic: 10, dex: 10},
		{name: 'Ranger', str: 15, magic: 15, dex: 20}
	];
}

Scenario.prototype = {
	getJobs: function(){
		return this.jobs;
	},
	getJob: function(code){
		for (var i = 0; i < this.jobs.length; i++){
			if (this.jobs[i].name === code){
				return this.jobs[i];
			}
		}
		return false;
	}
}

module.exports = Scenario;
