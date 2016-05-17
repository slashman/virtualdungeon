var Level = require('./Level.class');
var RoomGenerator = require('./RoomGenerator');
var CorridorGenerator = require('./CorridorGenerator');
var Utils = require('./Utils');

var DungeonGenerator = {
	potentialCorridors: null,
	level: null,
	generateLevel: function(specs){
		console.log('generateLevel', specs);
		this.potentialCorridors = [];
		var w = specs.w;
		var h = specs.h;
		var depth = specs.depth;
		this.level = new Level(w, h, depth);
		switch (specs.roomDensity){
			case 'hi':
				specs.roomDensity = 0.8;
				break;
			case 'mid':
				specs.roomDensity = 0.6;
				break;
			case 'low':
				specs.roomDensity = 0.4;
				break;
		}
		var remainingRooms = Math.floor(w * h * specs.roomDensity) - 1;
		// Put starting room
		var startingRoom = RoomGenerator.generateRoom(this.level, {addStairsUp: depth > 1, isEntrance: true});
		
		this.placeRoom(null, specs.startingLocation.x, specs.startingLocation.y, startingRoom);
		while (remainingRooms > 0){
			var potentialCorridor = Utils.pullRandomElementOf(this.potentialCorridors);
			var existingRoom = this.level.getRoomAt(potentialCorridor.toX, potentialCorridor.toY);
			if (existingRoom){
				continue;
			}
			remainingRooms--;
			var newRoom = RoomGenerator.generateRoom(this.level, {addStairsDown: remainingRooms == 0, isExit: remainingRooms == 0});
			var corridor = CorridorGenerator.generateCorridor(this.level);
			this.placeRoom(potentialCorridor.room, potentialCorridor.toX, potentialCorridor.toY, newRoom, corridor);
		}
		return this.level;
	},
	placeRoom: function(fromRoom, x, y, toRoom, corridor){
		var vector = false;
		this.level.placeRoom(fromRoom, x, y, toRoom, corridor);
		if (fromRoom){
			vector = {
				x: fromRoom.x - x,
				y: fromRoom.y - y
			}
		}

		this._checkAndPlacePotentialCorridors(vector, x, y, 0, -1, toRoom);
		this._checkAndPlacePotentialCorridors(vector, x, y, 0, 1, toRoom);
		this._checkAndPlacePotentialCorridors(vector, x, y, 1, 0, toRoom);
		this._checkAndPlacePotentialCorridors(vector, x, y, -1, 0, toRoom);

	}, 
	_checkAndPlacePotentialCorridors: function(vector, x, y, dx, dy, room){
		if (!vector || vector.x != dx || vector.y != dy){
			if (this.level.isValidRoomLocation(x + dx, y + dy) && !this.level.getRoomAt(x + dx, y + dy)){
				this.potentialCorridors.push(
					{
						toX: x + dx,
						toY: y + dy,
						room: room
					}
				);
			}
		}
	}
};

module.exports = DungeonGenerator;
