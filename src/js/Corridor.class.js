var Player = require('./Player.class');
var Utils = require('./Utils');

function Corridor(level, features){
	this.level = null;
	this.description = null;
	this.trap = null;
	this.obstacle = null;
	this.init(level, features);
}

Corridor.ARROWS_TRAP = 'arrows-trap';
Corridor.FLOOR_TRAP = 'floor-trap';
Corridor.FALLING_TRAP = 'falling-trap';
Corridor.BOMB_TRAP = 'bomb-trap';
Corridor.POWDER_TRAP = 'powder-trap';

Corridor.SPIKES_TRAP = 'spikes-trap';
Corridor.CLAMPING_TRAP = 'clamping-trap';
Corridor.CALTROPS_TRAP = 'caltrops-trap';
Corridor.PIT_TRAP = 'pit-trap';

Corridor.FIRE_FIELD = 'fire-field';
Corridor.POISON_FIELD = 'poison-field';
Corridor.SLEEP_FIELD = 'sleep-field';

Corridor.TRAP_DESCRIPTIONS = {};
Corridor.TRAP_DESCRIPTIONS[Corridor.ARROWS_TRAP] = 'Arrows fly from everywhere!';
Corridor.TRAP_DESCRIPTIONS[Corridor.FALLING_TRAP] = 'A bunch of rocks fall from the ceiling!';
Corridor.TRAP_DESCRIPTIONS[Corridor.BOMB_TRAP] = 'BOOM! A bomb is set off!';
Corridor.TRAP_DESCRIPTIONS[Corridor.POWDER_TRAP] = 'A cloud of smoke covers the party!';
Corridor.TRAP_DESCRIPTIONS[Corridor.SPIKES_TRAP] = 'You fall into a pit of sharp spikes';
Corridor.TRAP_DESCRIPTIONS[Corridor.CLAMPING_TRAP] = 'You step on a clamping trap';
Corridor.TRAP_DESCRIPTIONS[Corridor.CALTROPS_TRAP] = 'Sharp caltrops are hidden in the floor!';
Corridor.TRAP_DESCRIPTIONS[Corridor.PIT_TRAP] = 'You fall into a pit!';

Corridor.OBSTACLE_DESCRIPTIONS = {};
Corridor.OBSTACLE_DESCRIPTIONS[Corridor.FIRE_FIELD] = 'a fiery red field';
Corridor.OBSTACLE_DESCRIPTIONS[Corridor.POISON_FIELD] = 'a nocive green field';
Corridor.OBSTACLE_DESCRIPTIONS[Corridor.SLEEP_FIELD] = 'a numbing purple field';

Corridor.HALLWAY = 'hallway';
Corridor.TUNNEL = 'tunnel';
Corridor.GAP = 'gap';
Corridor.TIGHT = 'tight';

Corridor.SPECIAL_TYPES = [Corridor.TUNNEL, Corridor.GAP, Corridor.TIGHT];

Corridor.prototype = {
	init: function(level, features){
		this.level = level;
		this.description = features.description;
		this.trap = features.trap;
		this.obstacle = features.obstacle;
	},
	getDescription: function(){
		var description = this.description;
		if (this.obstacle){
			description += ' WARNING!: There is '+Corridor.OBSTACLE_DESCRIPTIONS[this.obstacle.type]+' here.';
		}
		return description;	
	},
	showTrapTriggered: function(trap){
		this.level.controller.ui.showMessage(Corridor.TRAP_DESCRIPTIONS[trap.description ? trap.description : trap.type]);
	},
	triggerTrap: function(trap){
		this.showTrapTriggered(trap);
		var party = this.level.controller.party;
		if (trap.multiTarget){
			// Try to hit all players in the Party
			for (var i = 0; i < party.players.length; i++){
				if (party.players[i].evadesTrap()){
					this.level.controller.ui.showMessage(party.players[i].name + ' evades the trap');
				} else {
					this.applyTrapEffect(trap, party.players[i]);
				}
			}
		} else {
			// Pick a single target
			var target = Utils.randomElementOf(party.players);
			if (target.evadesTrap()){
				this.level.controller.ui.showMessage(target.name + ' evades the trap');
			} else {
				this.applyTrapEffect(trap, target);
			}
		}
	},
	triggerTrapOn: function(trap, targets){
		for (var i = 0; i < targets.length; i++){
			this.applyTrapEffect(trap, targets[i]);
		}
	}, 
	applyTrapEffect: function(trap, player){
		// Injuries or direct effects based on type
		switch (trap.type){
			case Corridor.ARROWS_TRAP:
				player.sustainInjury((Utils.chance(50) ? Player.LEFT : Player.RIGHT)+'-'+(Utils.chance(50) ? Player.ARM : Player.LEG));
				break;
			case Corridor.FLOOR_TRAP:
				if (Utils.chance(50)){
					player.sustainInjury((Utils.chance(50) ? Player.LEFT : Player.RIGHT)+'-'+Player.LEG);
				} else {
					player.sustainInjury(Player.RIGHT_LEG);
					player.sustainInjury(Player.LEFT_LEG);
				}
				break;
			break;
			case Corridor.FALLING_TRAP:
				switch (Utils.rand(0,2)){
					case 0:
						player.sustainInjury(Player.RIGHT_ARM);
						break;
					case 1:
						player.sustainInjury(Player.LEFT_ARM);
						break;
					case 2:
						player.applyAilment(Player.UNCONSCIOUS);
						break;
				}
			break;
			case Corridor.BOMB_TRAP:
				var hits = Utils.rand(1,3);
				for (var i = 0; i < hits; i++){
					if (Utils.chance(20)){
						player.applyAilment(Player.UNCONSCIOUS);
					} else {
						player.sustainInjury((Utils.chance(50) ? Player.LEFT : Player.RIGHT)+'-'+(Utils.chance(50) ? Player.ARM : Player.LEG));
					}
				}
			break;
		}
		if (trap.effect){
			player.applyAilment(trap.effect);
		}
	}
}

module.exports = Corridor;