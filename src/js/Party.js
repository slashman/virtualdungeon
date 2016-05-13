var Party = {
	location: {
		x: null,
		y: null
	},
	level: null,
	init: function(specs){
		this.specs = specs;
	},
	locate: function(x, y){
		this.location.x = x;
		this.location.y = y;
	},
	setLevel: function(level){
		this.level = level;
	},
	getCurrentRoom: function(){
		return this.level.getRoom(this.location);
	},
	move: function(dx, dy){
		this.location.x += dx;
		this.location.y += dy;
		console.log(this.location);
	}
}

module.exports = Party;