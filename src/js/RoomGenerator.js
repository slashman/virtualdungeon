var Room = require('./Room.class');
var Utils = require('./Utils');

var RoomGenerator = {
	generateRoom: function(scenario, level, specs){
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
		if (specs.addFountain){
			features.push({type:'fountain', description: 'A fountain'});
		}
		if (Utils.chance(10)){
			features.push({type:'chest', description: 'A chest', item: Utils.randomElementOf(scenario.items)});
		}

		var enemies = []; // Room can potentially start with a set of enemies
		var room = new Room(level, {	
			description: "A plain room.",
			items: [],
			enemies: enemies,
			features: features,
			gmTips: specs.gmTips
		});	
		room.spawnEnemies = Utils.chance(55);
		if (Utils.chance(5)){
			room.items.push(Utils.randomElementOf(scenario.items));
		}

		if (specs && specs.isEntrance)
			room.isEntrance = true;
		if (specs && specs.isExit)
			room.isExit = true;
		return room;
	}
};

module.exports = RoomGenerator;