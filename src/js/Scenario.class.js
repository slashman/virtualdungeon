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
	this.enemies = [
		{name: 'Skeleton', from: 1, to: 2},
		{name: 'Headless', from: 1, to: 2},
		{name: 'Orc', from: 1, to: 3},
		{name: 'Rogue', from: 1, to: 3},
		{name: 'Troll', from: 2, to: 3},
		{name: 'Lava Lizard', from: 2, to: 4},
		{name: 'Ettin', from: 2, to: 4},
		{name: 'Daemon', from: 3, to: 4},
		{name: 'Cyclops', from: 3, to: 5},
		{name: 'Mage', from: 3, to: 5},
		{name: 'Liche', from: 4, to: 5},
		{name: 'Hydra', from: 4, to: 6},
		{name: 'Dragon', from: 5, to: 6},
		{name: 'Zorn', from: 5, to: 7},
		{name: 'Gazer', from: 6, to: 7},
		{name: 'Reaper', from: 6, to: 8},
		{name: 'Balron', from: 7, to: 8}
	];
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
