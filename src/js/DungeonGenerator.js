var Level = require('./Level.class');
var RoomGenerator = require('./RoomGenerator');

var DungeonGenerator = {
	generateLevel: function(specs){
		var w = specs.w;
		var h = specs.h;
		var depth = specs.depth;
		var level = new Level(w, h, depth);
		// Put starting room
		var startingRoom = RoomGenerator.generateRoom(level);
		level.setRoom(specs.startingLocation.x, specs.startingLocation.y, startingRoom);
		// Put another room to the north
		var anotherRoom = RoomGenerator.generateRoom(level);
		level.setRoom(specs.startingLocation.x, specs.startingLocation.y-1, anotherRoom);
		return level;
	}
};

module.exports = DungeonGenerator;