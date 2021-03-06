var Corridor = require('./Corridor.class');
var Player = require('./Player.class');
var Utils = require('./Utils');

var CorridorGenerator = {
	generateCorridor: function(level){
		var corridorType = Corridor.HALLWAY;
		if (Utils.chance(20)){
			corridorType = Utils.randomElementOf(Corridor.SPECIAL_TYPES);
		}
		var trap = null;
		if (corridorType === Corridor.HALLWAY && Utils.chance(20)){
			switch (Utils.rand(0,4)){
				case 0:
					var effect = false;
					switch (Utils.rand(0,2)){
						case 0: effect = Player.POISONED; break;						
						case 1: effect = Player.PARALYZED; break;
					}
					trap = {
						type: Corridor.ARROWS_TRAP,
						effect: effect,
						multiTarget: Utils.chance(20),
						slow: Utils.chance(50),
						evadeMessage: 'Players must duck quickly to evade the trap'
					};
					break;
				case 1:
					var description = Utils.randomElementOf([Corridor.SPIKES_TRAP, Corridor.CLAMPING_TRAP, Corridor.CALTROPS_TRAP, Corridor.PIT_TRAP]);
					effect = false;
					if (description === Corridor.CLAMPING_TRAP){
						effect = Player.CLAMPED;
					}
					trap = {
						type: Corridor.FLOOR_TRAP,
						description: description,
						effect: effect,
						multiTarget: description !== Corridor.CLAMPING_TRAP,
						slow: Utils.chance(50),
						evadeMessage: 'Players must jump quickly to evade the trap'
					};
					break;
				case 2:
					trap = {
						type: Corridor.FALLING_TRAP,
						multiTarget: true,
						slow: Utils.chance(50),
						evadeMessage: 'Players must run quickly to the next room to evade the trap'
					};
					break;
				case 3:
					trap = {
						type: Corridor.BOMB_TRAP,
						multiTarget: true
					};
					break;
				case 4:
					var effect = Utils.randomElementOf([Player.BLIND, Player.PARALYZED, Player.ASLEEP, Player.POISONED, Player.MUTE]);
					trap = {
						type: Corridor.POWDER_TRAP,
						effect: effect,
						multiTarget: true,
						slow: Utils.chance(50),
						evadeMessage: 'Players must cover their nose, close their eyes and mouth and crawl quickly to the next room to evade the trap'
					};
					break;
			}
		}
		var obstacle = false;
		if (corridorType === Corridor.HALLWAY && Utils.chance(20)){
			obstacle = {
				type: Utils.randomElementOf([Corridor.FIRE_FIELD, Corridor.POISON_FIELD, Corridor.SLEEP_FIELD]),
				canPassThru: true
			}
		}
		return new Corridor(level, {	
			description: this.getDescription(corridorType),
			type: corridorType,
			trap: trap,
			obstacle: obstacle
		});
	},
	getDescription: function(corridorType){
		// TODO: Spice up descriptions
		switch (corridorType){
			case Corridor.HALLWAY:
				return 'A stone hallway';
			case Corridor.TUNNEL:
				return 'A tunnel';
			case Corridor.GAP:
				return 'A gap you can jump';
			case Corridor.TIGHT:
				return 'A tight opening you can squeeze into'
		}
	}
};

module.exports = CorridorGenerator;