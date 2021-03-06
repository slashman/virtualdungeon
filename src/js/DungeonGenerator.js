var Level = require('./Level.class');
var RoomGenerator = require('./RoomGenerator');
var CorridorGenerator = require('./CorridorGenerator');
var Utils = require('./Utils');

var DungeonGenerator = {
	potentialCorridors: null,
	level: null,
	generateLevel: function(specs, controller){
		this.controller = controller;
		this.potentialCorridors = [];
		var w = specs.w;
		var h = specs.h;
		var depth = specs.depth;
		this.level = new Level(w, h, depth, controller);
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
			case 'increasing':
				specs.roomDensity = 0.3 + depth * 0.05;
				break;
		}
		if (specs.roomDensity > 0.9)
			specs.roomDensity = 0.9;
		var allRooms = Math.floor(w * h * specs.roomDensity) - 1;
		specs.sections = 3;
		for (var i = 0; i < specs.sections; i++){
			var success = this._generateSection({
				starting: i == 0,
				ending: i == specs.sections - 1,
				rooms: Math.ceil(allRooms / specs.sections)
			},specs,
			depth);
			if (!success){
				return false;
			}
		}
		return this.level;
	},
	_generateSection: function (sectionSpecs, specs, depth){
		var remainingRooms = sectionSpecs.rooms;
		if (sectionSpecs.starting){
			var startingRoom = RoomGenerator.generateRoom(this.controller.scenario, this.level, {addStairsUp: depth > 1, isEntrance: true});
			this.placeRoom(null, specs.startingLocation.x, specs.startingLocation.y, startingRoom);
		}
		while (remainingRooms > 0){
			var potentialCorridor = Utils.pullRandomElementOf(this.potentialCorridors);
			if (!potentialCorridor){
				//Whoops! we hit a dead end :|
				return false;
			}
			var existingRoom = this.level.getRoomAt(potentialCorridor.toX, potentialCorridor.toY);
			if (existingRoom){
				continue;
			}
			remainingRooms--;
			var specs = {};
			if (remainingRooms == 0){
				if (sectionSpecs.ending){
					if (depth == 8){
						specs.addWinArtifact = true;
					} else {
						specs.addStairsDown = true;
					}
					specs.isExit = true;
					specs.gmTips = this.controller.scenario.endRooms[depth];
				} else {
					// End of section, clear almost all corridors
					var survivingCorridor = Utils.pullRandomElementOf(this.potentialCorridors);
					this.potentialCorridors = [];
					this.potentialCorridors.push(survivingCorridor);
				}
			} else {
				specs.addFountain = Utils.chance(10);
			}
			var newRoom = RoomGenerator.generateRoom(this.controller.scenario, this.level, specs);
			var corridor = CorridorGenerator.generateCorridor(this.level);
			this.placeRoom(potentialCorridor.room, potentialCorridor.toX, potentialCorridor.toY, newRoom, corridor);
		}
		return true;
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
