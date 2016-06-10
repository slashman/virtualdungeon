var LoadScenario = require('./LoadScenario');

function Scenario(dungeon){
	var scenario = LoadScenario.getScenario(window.exodusConfig.scenario);
	this.jobs = scenario.jobs;
	this.spells = scenario.spells;
	this.items = scenario.items;
	this.enemies = scenario.enemies;
}

Scenario.prototype = {
	setDungeon: function(dungeon){
		dungeon = LoadScenario.getDungeon(dungeon);
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
