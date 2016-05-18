var UI = require('./UI')
var DungeonGenerator = require('./DungeonGenerator')
var Party = require('./Party')

var VirtualDungeon = {
	levels: {},
	init: function(){
		console.log("Initializing VirtualDungeon");
		UI.init(this);
	},
	startGame: function(){
		var config = UI.getNewGameConfig();
		console.log("New Game, config", config);
		this.config = config;
		Party.init({
			players: config.players
		});
		Party.locate(Math.floor(config.dungeonSize.w / 2), Math.floor(config.dungeonSize.h / 2));
		var level = DungeonGenerator.generateLevel({
			w: config.dungeonSize.w,
			h: config.dungeonSize.h,
			depth: 1,
			startingLocation: Party.location,
			roomDensity: config.roomDensity
		});
		Party.setLevel(level);
		console.log("Level", level);
		console.log("Party", Party);
		UI.updateRoomData(Party.getCurrentRoom());
		UI.initMap();
		UI.hideNewGamePanel();

	},
	move: function(dx, dy){
		Party.move(dx, dy);
		UI.updateRoomData(Party.getCurrentRoom());
	},
	upstairs: function(){
		this._gotoDepth(Party.level.depth - 1);
	},
	downstairs: function(){
		this._gotoDepth(Party.level.depth + 1);
	},
	_gotoDepth: function(depth){
		var level = this.levels[depth];
		if (!level){
			var config = this.config;
			level = DungeonGenerator.generateLevel({
				w: config.dungeonSize.w,
				h: config.dungeonSize.h,
				depth: depth,
				startingLocation: Party.location,
				roomDensity: config.roomDensity
			});
			this.levels[depth] = level;
			console.log("this.levels", this.levels);
		}
		Party.setLevel(level)
		UI.updateRoomData(Party.getCurrentRoom());
	}
};

window.VirtualDungeon = VirtualDungeon;

module.exports = VirtualDungeon;