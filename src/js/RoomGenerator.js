var Room = require('./Room.class');
var Utils = require('./Utils');

var RoomGenerator = {
	generateRoom: function(level, specs){
		var features = [];
		if (specs && specs.addStairsUp){
			features.push({type:'upstairs', description: 'Stairway going up'});
		}
		if (specs && specs.addStairsDown){
			features.push({type:'downstairs', description: 'Stairway going down'});
		}
		var enemies = [];
		if (Utils.chance(30)){
			enemies = this._getEnemyParty(level);
		}
		var room = new Room(level, {	
			description: "A plain room.",
			items: [],
			enemies: enemies,
			features: features
		});	
		if (specs && specs.isEntrance)
			room.isEntrance = true;
		if (specs && specs.isExit)
			room.isExit = true;
		return room;
	},
	_getEnemyParty: function(level){
		return [{
			raceName: 'Orc'
		}];
	}
};

module.exports = RoomGenerator;