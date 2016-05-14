function Corridor(level, features){
	this.level = null;
	this.description = null;
	this.trap = null;
	this.obstacle = null;
	this.init(level, features);
}

Corridor.prototype = {
	init: function(level, features){
		this.level = level;
		this.description = features.description;
		this.trap = features.trap;
		this.obstacle = features.obstacle;
	}
}

module.exports = Corridor;