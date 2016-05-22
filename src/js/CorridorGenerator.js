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
						evadeMessage: 'Duck quickly to evade the trap'
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
						evadeMessage: 'Jump quickly to evade the trap'
					};
					break;
				case 2:
					trap = {
						type: Corridor.FALLING_TRAP,
						multiTarget: true,
						slow: Utils.chance(50),
						evadeMessage: 'Run quickly to the next room to evade the trap'
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
						evadeMessage: 'Cover your nose, close your eyes and mouth and crawl quickly to the next room to evade the trap'
					};
					break;
			}
		}
		return new Corridor(level, {	
			description: this.getDescription(corridorType),
			type: corridorType,
			trap: trap,
			obstacle: null
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