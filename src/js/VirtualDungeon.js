var UI = require('./UI')
var DungeonGenerator = require('./DungeonGenerator')
var Party = require('./Party')

var VirtualDungeon = {
	init: function(){
		console.log("Initializing VirtualDungeon");
	},
	startGame: function(config){
		console.log("New Game, config", config);
		this.config = config;
		Party.init({
			size: config.partySize
		});
		Party.locate(Math.floor(config.dungeonSize.w / 2), Math.floor(config.dungeonSize.h / 2));
		var level = DungeonGenerator.generateLevel({
			w: config.dungeonSize.w,
			h: config.dungeonSize.h,
			depth: 1,
			startingLocation: Party.location
		});
		Party.setLevel(level);
		console.log("Level", level);
		console.log("Party", Party);
		UI.init();
		UI.startGame();
		UI.updateRoomData(Party.getCurrentRoom());
	},
	move: function(dx, dy){
		Party.move(dx, dy);
	}
};

window.VirtualDungeon = VirtualDungeon;

module.exports = VirtualDungeon;