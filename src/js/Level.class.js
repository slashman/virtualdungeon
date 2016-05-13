function Level(w, h, depth){
	this.map = null;
	this.rooms = null;
	this.init(w, h, depth);
}

Level.prototype = {
	init: function(w, h, depth){
		this.map = [];
		this.rooms = [];
		for (var x = 0; x < w; x++){
			this.map[x] = [];
			for (var y = 0; y < h; y++){
				this.map[x][y] = null;
			}
		}
	},
	setRoom: function(x, y, room){
		room.locate(x,y);
		this.map[x][y] = room;
		this.rooms.push(room);
	},
	getRoom: function(location){
		return this.map[location.x][location.y];
	}
}

module.exports = Level;