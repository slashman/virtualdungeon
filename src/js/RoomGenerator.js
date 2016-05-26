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
		if (specs && specs.addWinArtifact){
			features.push({type:'winArtifact', description: 'Winning Artifact'});
		}
		var enemies = []; // Room can potentially start with a set of enemies
		var room = new Room(level, {	
			description: "A plain room.",
			items: [],
			enemies: enemies,
			features: features,
			gmTips: specs.gmTips
		});	
		room.spawnEnemies = Utils.chance(30);
		if (specs && specs.isEntrance)
			room.isEntrance = true;
		if (specs && specs.isExit)
			room.isExit = true;
		return room;
	}
};

module.exports = RoomGenerator;