//TODO: gulp script creates this file based on config
var Abyss = require('./dungeons/Abyss');

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
	this.enemies = Abyss.enemies;
	this.endRooms = Abyss.endRooms;
	this.compileEcosystems();
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
	},
	getPossibleEnemies: function(depth){
		return this.ecosystems[depth];
	},
	compileEcosystems: function(){
		this.ecosystems = {};
		for (var i = 1; i <= 8; i++){
			this.ecosystems[i] = [];
		};
		for (var i = 0; i < this.enemies.length; i++){
			var enemy = this.enemies[i];
			for (var j = enemy.from; j <= enemy.to; j++){
				this.ecosystems[j].push(enemy);
			}
		}
	}
}

module.exports = Scenario;
