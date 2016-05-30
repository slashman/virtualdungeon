//TODO: gulp script creates this file based on config
var Abyss = require('./dungeons/Abyss');
var Ultima4 = require('./scenarios/Ultima4');

function Scenario(){
	this.jobs = Ultima4.jobs;
	this.spells = Ultima4.spells;
	this.items = Ultima4.items;
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
	getSpell: function(name){
		for (var i = 0; i < this.spells.length; i++){
			if (this.spells[i].name === name){
				return this.spells[i];
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
