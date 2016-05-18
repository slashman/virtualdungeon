var Utils = require('./Utils');
var Player = require('./Player.class');

function Party(specs, controller){
	this.controller = controller;
	this.players = [];
	for (var i = 0; i < specs.players.length; i++){
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
		if (!corridor.obstacle){
			this.location.x += dx;
			this.location.y += dy;
			if (corridor.trap){
				corridor.triggerTrap(corridor.trap);
			}
		}
		this.passTurn();
	},
	passTurn: function(){
		for (var i = 0; i < this.players.length; i++){
			this.players[i].passTurn();
		}
	}
}

module.exports = Party;