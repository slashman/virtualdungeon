var Room = require('./Room.class');
var Utils = require('./Utils');

var RoomGenerator = {
	generateRoom: function(level){
		if (Utils.chance(30)){
			return new Room(level, {	
				description: "A plain room.",
				items: [],
				enemies: this._getEnemyParty(level),
				features: []
			});	
		} else {
			return new Room(level, {	
				description: "A plain room.",
				items: [],
				enemies: [],
				features: []
			});	
		}
	},
	_getEnemyParty: function(level){
		return [{
			raceName: 'Orc'
		}];
	}
};

module.exports = RoomGenerator;