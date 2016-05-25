var UI = require('./UI.class');
var DungeonGenerator = require('./DungeonGenerator');
var Party = require('./Party.class');
var Staff = require('./Staff.class');
var Scenario = require('./Scenario.class');
var Utils = require('./Utils');

var VirtualDungeon = {
	MOVE: 'move',
	PICK_TARGET: 'pickTarget',
	COMBAT: 'combat',
	inputStatus: null,
	levels: {},
	init: function(){
		this.scenario = new Scenario();
		this.ui = new UI(this);
	},
	startGame: function(){
		var config = this.ui.getNewGameConfig();
		this.config = config;
		this.party = new Party({
			players: config.players
		}, this);
		this.staff = new Staff({
			staffPlayers: config.staffPlayers
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
		this.ui.hideNewGamePanel();
		this.ui.updateRoomData();
		this.ui.initMap();
		this.setInputStatus(VirtualDungeon.MOVE);
	},
	move: function(dx, dy){
		this.ui.clearMessages();
		this.party.move(dx, dy);
		this.ui.updateRoomData();
	},
	upstairs: function(){
		this._gotoDepth(this.party.level.depth - 1);
	},
	downstairs: function(){
		this._gotoDepth(this.party.level.depth + 1);
	},
	winArtifact: function(){
		this.ui.showMessage('You win the game!!!');
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
		}
		this.party.setLevel(level)
		this.ui.updateRoomData(this.party.getCurrentRoom());
	},
	setInputStatus: function(inputStatus){
		this.inputStatus = inputStatus;
		switch (this.inputStatus){
			case this.MOVE:
				this.ui.enableMovement();
				break;
			case this.PICK_TARGET:
				this.ui.selectTargets(this.pickTargetCallback);
				break;
			case this.COMBAT:
				this.ui.activateCombat();
				break;
		}
	},
	passTurn: function(){
		this.party.passTurn();
		if (Utils.chance(20)){
			this.ui.showMessage('Ambushed!');
			var enemyParty = this.staff.selectEnemyParty();
			this.party.getCurrentRoom().enemies = enemyParty;
			this.setInputStatus(this.COMBAT);
		} else {
			this.setInputStatus(this.MOVE);
		}
	}
};

window.VirtualDungeon = VirtualDungeon;

module.exports = VirtualDungeon;