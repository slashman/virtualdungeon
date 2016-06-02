//TODO: gulp script creates this file based on config
var Ultima4 = require('./scenarios/Ultima4');
require('./dungeons/Abyss');
require('./dungeons/AntiVirtue');

function Scenario(dungeon){
	this.jobs = Ultima4.jobs;
	this.spells = Ultima4.spells;
	this.items = Ultima4.items;
	this.enemies = Ultima4.enemies;
}

Scenario.prototype = {
	setDungeon: function(dungeon){
		dungeon = require('./dungeons/'+dungeon);
		this.endRooms = dungeon.endRooms;
		this.compileEcosystems();
	},
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
