var Utils = require('./Utils');

function Level(w, h, depth, controller){
	this.controller = controller;
	this.map = null;
	this.rooms = null;
	this.init(w, h, depth);
}

Level.prototype = {
	init: function(w, h, depth){
		this.depth = depth;
		this.map = [];
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
			fromRoom.corridors[Utils.getDirection(fromRoom, room)] = corridor;
			room.corridors[Utils.getDirection(room, fromRoom)] = corridor;
		}
	},
	getRoom: function(location){
		return this.map[location.x][location.y];
	},
	getRoomAt: function(x, y){
		return this.map[x][y];
	},
	isValidRoomLocation: function(x, y){
		return x >= 0 && y >= 0 && x < this.map.length && y < this.map[0].length;
	}
}

module.exports = Level;