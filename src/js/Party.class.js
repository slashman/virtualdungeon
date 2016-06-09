var Utils = require('./Utils');
var Player = require('./Player.class');
var Corridor = require('./Corridor.class');

function Party(specs, controller){
	this.controller = controller;
	this.players = [];
	this.items = [];
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
	addItem: function(item){
		this.items.push(item);
	},
	removeItem: function(item){
		for (var i = 0; i < this.items.length; i++){
			if (this.items[i] == item){
				this.items.splice(i, 1);
				return;
			}
		}
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
		if (corridor.obstacle){
			switch (corridor.obstacle.type){
				case Corridor.FIRE_FIELD:
					this.controller.ui.showMessage('You are engulfed in fire!');
					this.takeDamage(3);
					break;
				case Corridor.POISON_FIELD:
					this.controller.ui.showMessage('You are poisoned!');
					this.applyAilment(Player.POISONED);
					break;
				case Corridor.SLEEP_FIELD:
					this.controller.ui.showMessage('You fall asleep.');
					this.applyAilment(Player.ASLEEP);
					break;
			}
		}
		if (!corridor.obstacle || corridor.obstacle.canPassThru){
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
						controller.setInputStatus(controller.MOVE);
						party._doMove(dx, dy, true);
					};
					this.controller.setInputStatus(this.controller.PICK_TARGET);
					return; // Party doesn't move
				} else {
					corridor.triggerTrap(corridor.trap);
					corridor.trap = false;
				}
			}
		}
		this._doMove(dx,dy,true);
	},
	_doMove: function(dx, dy, physically){
		this.location.x += dx;
		this.location.y += dy;
		this.passTurn();
		if (this.getCurrentRoom().spawnEnemies){
			var enemyParty = this.controller.staff.selectEnemyParty();
			this.getCurrentRoom().enemies = enemyParty;
			this.controller.setInputStatus(this.controller.COMBAT);
			this.controller.ui.playMusic('combat');
		} else {
			this.controller.ui.setMovementButtons();
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
	},
	cureAilment: function(ailment){
		for (var i = 0; i < this.players.length; i++){
			this.players[i].cureAilment(ailment);
		}	
	},
	takeDamage: function(damage){
		for (var i = 0; i < this.players.length; i++){
			this.players[i].takeDamage(damage);
		}
	},
	checkGameOver: function(){
		for (var i = 0; i < this.players.length; i++){
			if (this.players[i].hitPoints.current > 0)
				return;
		}
		this.controller.ui.playMusic('death');
		this.controller.ui.showMessage('Game Over...');
	},
	applyAilment: function(ailment, turns){
		for (var i = 0; i < this.players.length; i++){
			this.players[i].applyAilment(ailment, turns);
		}
	},
	useItem: function(item, player){
		player[item.effect](item.param);
		this.removeItem(item);
	},
	blink: function(direction){
		var vector = Utils.getVector(direction);
		var room = this.level.getRoomAt(this.location.x + vector.x, this.location.y + vector.y);
		if (room){
			this.controller.ui.showMessage('The party teleports.');
			this._doMove(vector.x, vector.y, false);
		} else {
			this.controller.ui.showMessage('You can\'t go there.');
		}
	}
}

module.exports = Party;