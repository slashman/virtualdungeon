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
		var direction = this.getDirection(this.location, {x: this.location.x+dx, y: this.location.y+dy})
		var corridor = this.getCurrentRoom().corridors[direction];
		if (corridor && !corridor.obstacle){
			this.location.x += dx;
			this.location.y += dy;	
		}
	},
	getDirection: function(from, to){
		if (from.x == to.x){
			if (from.y > to.y){
				return 'north';
			} else {
				return 'south';
			}
		} else {
			if (from.x > to.x){
				return 'west';
			} else {
				return 'east';
			}
		}
	}
}

module.exports = Party;