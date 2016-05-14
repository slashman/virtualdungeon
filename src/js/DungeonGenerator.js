var Level = require('./Level.class');
var RoomGenerator = require('./RoomGenerator');
var CorridorGenerator = require('./CorridorGenerator');

var DungeonGenerator = {
	generateLevel: function(specs){
		var w = specs.w;
		var h = specs.h;
		var depth = specs.depth;
		var level = new Level(w, h, depth);
		// Put starting room
		var startingRoom = RoomGenerator.generateRoom(level);
		level.placeRoom(null, specs.startingLocation.x, specs.startingLocation.y, startingRoom);
		startingRoom.description = 'Top of a a fiery volcano in the Isle of the Abyss';
		// Put another room to the north
		var anotherRoom = RoomGenerator.generateRoom(level);
		anotherRoom.description = 'Dark room with stone floor';
		var corridor = CorridorGenerator.generateCorridor(level);
		corridor.description = 'A cavernous passageway';
		level.placeRoom(startingRoom, specs.startingLocation.x, specs.startingLocation.y-1, anotherRoom, corridor);
		// And other one to the west of it
		var thirdRoom = RoomGenerator.generateRoom(level);
		thirdRoom.description = 'A river of lava flows under a wooden bridge';
		corridor = CorridorGenerator.generateCorridor(level);
		corridor.description = 'A stone hallway';
		level.placeRoom(anotherRoom, specs.startingLocation.x-1, specs.startingLocation.y-1, thirdRoom, corridor);
		return level;
	}
};

module.exports = DungeonGenerator;
