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
	currentCounterId: 0,
	init: function(){
		this.scenario = new Scenario();
		this.ui = new UI(this);
	},
	startGame: function(){
		var config = this.ui.getNewGameConfig();
		if (error = this.getConfigErrors(config)){
			alert(error);
			return;
		}
		this.config = config;

		this.scenario.setDungeon(config.dungeon);

		this.party = new Party({
			players: config.players
		}, this);
		this.staff = new Staff({
			staffPlayers: config.staffPlayers
		}, this);
		this.party.locate(Math.floor(config.dungeonSize.w / 2), Math.floor(config.dungeonSize.h / 2));
		do {
			var level = DungeonGenerator.generateLevel({
				w: config.dungeonSize.w,
				h: config.dungeonSize.h,
				depth: 1,
				startingLocation: this.party.location,
				roomDensity: config.roomDensity
			}, this);
		} while (!level);
		this.levels[1] = level;
		this.party.setLevel(level);
		this.ui.hideNewGamePanel();
		this.ui.updateRoomData();
		this.ui.initMap();
		this.setInputStatus(VirtualDungeon.MOVE);
	},
	getConfigErrors: function(config){
		if (config.players.length == 0){
			return "At least one hero is required.";
		}
		if (config.staffPlayers.length == 0){
			return "At least one dweller is required.";
		}
		for (var i = 0;  i < config.players.length; i++){
			if (config.players[i].name.trim() === ''){
				return "Please provide a name for all players.";
			}
		}
		for (i = 0;  i < config.staffPlayers.length; i++){
			if (config.staffPlayers[i].name.trim() === ''){
				return "Please provide a name for all players.";
			}
		}
		return false;
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
	win: function(){
		this.ui.clearMessages();
		this.ui.showMessage('You win the game!!!');
	},
	drink: function(params){
		this.ui.clearMessages();
		this.party.getPlayerByNumber(params.player).drinkFromFountain();
		this.party.getCurrentRoom().removeFeature('fountain');
		this.ui.updateRoomData();
	},
	castSpell: function(params){
		var caster = this.party.getPlayerByNumber(params.player);
		var spell = this.scenario.getSpell(params.spell);
		if (spell.targetType === 'enemy'){
			params.spellTarget = this.party.getCurrentRoom().enemies[parseInt(params.spellTargetEnemy)];
		} else if (spell.targetType === 'friend' || spell.targetType === 'friendLimb'){
			params.spellTarget = this.party.getPlayerByNumber(params.spellTarget);
		}
		console.log(params.spellTarget);
		caster.castSpell(spell, params);
		this.ui.updateRoomData();
	},
	spellFailed: function(params){
		var caster = this.party.getPlayerByNumber(params.player);
		var spell = this.scenario.getSpell(params.spell);
		caster.spendMP(spell.cost);
		this.ui.updateRoomData();
	},
	_gotoDepth: function(depth){
		var level = this.levels[depth];
		if (!level){
			var config = this.config;
			do {
				level = DungeonGenerator.generateLevel({
					w: config.dungeonSize.w,
					h: config.dungeonSize.h,
					depth: depth,
					startingLocation: this.party.location,
					roomDensity: config.roomDensity
				}, this);
			} while (!level);
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
		if (this.party.getCurrentRoom().enemies.length > 0){
			this.ui.showMessage('Cannot pass while in combat!');
			return;
		}
		this.party.passTurn();
		if (Utils.chance(20)){
			this.ui.showMessage('Ambushed!');
			var enemyParty = this.staff.selectEnemyParty();
			this.party.getCurrentRoom().enemies = enemyParty;
			this.setInputStatus(this.COMBAT);
		} else {
			this.setInputStatus(this.MOVE);
		}
		this.ui.updateRoomData(this.party.getCurrentRoom());
	},
	execute: function(command){
		console.log(command);
		this[command.action](command);
	},
	addCounter: function(counter){
		counter.id = ++this.currentCounterId;
		this.ui.addCounter(counter);
		var thus = this;
		setTimeout(function(){
			thus.updateCounter(counter);
		}, 1000);
	},
	updateCounter: function(counter){
		var thus = this;
		counter.time --;
		this.ui.updateCounter(counter);
		if (counter.time <= 0){
			setTimeout(function(){
				thus.ui.removeCounter(counter);
			}, 10000);
		} else {
			setTimeout(function(){
				thus.updateCounter(counter);
			}, 1000);
		}
	},
	takeItem: function(params){
		var item = this.party.getCurrentRoom().items[params.itemOnFloor];
		this.party.getCurrentRoom().items.splice(params.itemOnFloor, 1);
		this.party.addItem(item);
		this.ui.updateRoomData();
	},
	useItem: function(params){
		var item = this.party.items[params.item];
		var player = this.party.getPlayerByNumber(params.player);
		this.party.useItem(item, player);
		this.ui.updateRoomData();
	},
	openChest: function(params){
		var player = this.party.getPlayerByNumber(params.player);
		player.openChest();
		this.party.getCurrentRoom().removeFeature('chest');
		this.ui.updateRoomData();	
	}
};

window.VirtualDungeon = VirtualDungeon;

module.exports = VirtualDungeon;