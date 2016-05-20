var Utils = require('./Utils');
var Player = require('./Player.class');

function Party(specs, controller){
	this.controller = controller;
	this.players = [];
	for (var i = 0; i < specs.players.length; i++){
		specs.players[i].number = i + 1;
		this.players.push(new Player(specs.players[i], this));
	}
	this.location = {
		x: null,
		y: null
	};
	this.level = null;
}

Party.prototype = {
	locate: function(x, y){
		this.location.x = x;
		this.location.y = y;
	},
	setLevel: function(level){
		this.level = level;
	},
	getCurrentRoom: function(){
		return this.level.getRoom(this.location);
	},
	move: function(dx, dy){
		var direction = Utils.getDirection(this.location, {x: this.location.x+dx, y: this.location.y+dy})
		var corridor = this.getCurrentRoom().corridors[direction];
		if (!corridor){
			this.controller.ui.showMessage('You can\'t go there.');
			return;
		}
		var party = this;
		var controller = this.controller;
		if (!corridor.obstacle){
			if (corridor.trap){
				if (corridor.trap.slow){
					corridor.showTrapTriggered(corridor.trap);
					controller.ui.showMessage(corridor.trap.evadeMessage);
					controller.ui.showMessage('Select the party members who couldn\'t evade the trap.');
					this.controller.pickTargetCallback = function(targets){
						if (targets.length == 0){
							controller.ui.showMessage('All party members evade the trap.');
						} else {
							corridor.triggerTrapOn(corridor.trap, targets);
						}
						corridor.trap = false;
						party._doMove(dx, dy);
					};
					this.controller.setInputStatus(this.controller.PICK_TARGET);
					return; // Party doesn't move
				} else {
					corridor.triggerTrap(corridor.trap);
					corridor.trap = false;
				}
			}
		}
		this._doMove(dx,dy);
	},
	_doMove: function(dx, dy){
		this.location.x += dx;
		this.location.y += dy;
		this.passTurn();
		if (this.getCurrentRoom().spawnEnemies){
			// Select an enemy party
			var enemyParty = this.controller.staff.selectEnemyParty();
			this.getCurrentRoom().enemies = enemyParty;
			// Enter combat mode!
			this.controller.setInputStatus(this.controller.COMBAT);
		}
	},
	passTurn: function(){
		for (var i = 0; i < this.players.length; i++){
			this.players[i].passTurn();
		}
	},
	getPlayerByNumber: function(number){
		for (var i = 0; i < this.players.length; i++){
			if (this.players[i].number == number)
				return this.players[i];
		}
	}
}

module.exports = Party;