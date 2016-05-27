function Room(level, features){
	this.level = null;
	this.enemies = null;
	this.items = null;
	this.features = null;
	this.description = null;
	this.x = null;
	this.y = null;
	this.corridors = {
		north: null,
		south: null,
		west: null,
		east: null
	}
	this.gmTips = null;
	this.init(level, features);
}

Room.prototype = {
	init: function(level, features){
		this.level = level;
		this.description = features.description;
		this.enemies = features.enemies;
		this.items = features.items;
		this.features = features.features;
		this.gmTips = features.gmTips;
	},
	locate: function(x, y){
		this.x = x;
		this.y = y;
	},
	endBattle: function(){
		this.spawnEnemies = false;
		this.enemies = [];
	},
	removeFountain: function(){
		for (var i = 0; i < this.features.length; i++){
			if  (this.features[i].type === 'fountain'){
				this.features.splice(i,1);
				i--;
			}
		}
	}
}

module.exports = Room;