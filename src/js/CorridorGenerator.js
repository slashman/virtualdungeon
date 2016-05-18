var Corridor = require('./Corridor.class');
var Player = require('./Player.class');
var Utils = require('./Utils');

var CorridorGenerator = {
	generateCorridor: function(level){
		var trap = null;
		if (Utils.chance(20)){
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
						multiTarget: Utils.chance(20)
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
						multiTarget: description !== Corridor.CLAMPING_TRAP
					};
					break;
				case 2:
					trap = {
						type: Corridor.FALLING_TRAP,
						multiTarget: true
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
						multiTarget: true
					};
					break;
			}
		}
		return new Corridor(level, {	
			description: "A plain corridor",
			trap: trap,
			obstacle: null
		});
	}
};

module.exports = CorridorGenerator;