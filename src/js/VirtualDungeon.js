var UI = require('./UI.class')
var DungeonGenerator = require('./DungeonGenerator')
var Party = require('./Party.class')
var Scenario = require('./Scenario.class')

var VirtualDungeon = {
	levels: {},
	init: function(){
		console.log("Initializing VirtualDungeon");
		this.scenario = new Scenario();
		this.ui = new UI(this);
	},
	startGame: function(){
		var config = this.ui.getNewGameConfig();
		console.log("New Game, config", config);
		this.config = config;
		this.party = new Party({
			players: config.players
		}, this);
		this.party.locate(Math.floor(config.dungeonSize.w / 2), Math.floor(config.dungeonSize.h / 2));
		var level = DungeonGenerator.generateLevel({
			w: config.dungeonSize.w,
			h: config.dungeonSize.h,
			depth: 1,
			startingLocation: this.party.location,
			roomDensity: config.roomDensity
		}, this);
		this.levels[1] = level;
		this.party.setLevel(level);
		console.log("Level", level);
		console.log("Party", this.party);
		this.ui.updateRoomData(this.party.getCurrentRoom());
		this.ui.initMap();
		this.ui.hideNewGamePanel();

	},
	move: function(dx, dy){
		this.ui.clearMessages();
		this.party.move(dx, dy);
		this.ui.updateRoomData(this.party.getCurrentRoom());
	},
	upstairs: function(){
		this._gotoDepth(this.party.level.depth - 1);
	},
	downstairs: function(){
		this._gotoDepth(this.party.level.depth + 1);
	},
	_gotoDepth: function(depth){
		var level = this.levels[depth];
		if (!level){
			var config = this.config;
			level = DungeonGenerator.generateLevel({
				w: config.dungeonSize.w,
				h: config.dungeonSize.h,
				depth: depth,
				startingLocation: this.party.location,
				roomDensity: config.roomDensity
			}, this);
			this.levels[depth] = level;
			console.log("this.levels", this.levels);
		}
		this.party.setLevel(level)
		this.ui.updateRoomData(this.party.getCurrentRoom());
	}
};

window.VirtualDungeon = VirtualDungeon;

module.exports = VirtualDungeon;