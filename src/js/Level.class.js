function Level(w, h, depth){
	this.map = null;
	this.rooms = null;
	this.init(w, h, depth);
}

Level.prototype = {
	init: function(w, h, depth){
		this.map = []; //TODO: Remove?
		this.rooms = [];
		for (var x = 0; x < w; x++){
			this.map[x] = [];
			for (var y = 0; y < h; y++){
				this.map[x][y] = null;
			}
		}
	},
	placeRoom: function(fromRoom, x, y, room, corridor){
		room.locate(x,y);
		this.map[x][y] = room;
		this.rooms.push(room);
		if (fromRoom){
			fromRoom.corridors[this.getDirection(fromRoom, room)] = corridor;
			room.corridors[this.getDirection(room, fromRoom)] = corridor;
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
	},
	getRoom: function(location){
		return this.map[location.x][location.y];
	}
}

module.exports = Level;