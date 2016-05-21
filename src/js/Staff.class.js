var Utils = require('./Utils');

function Staff(specs, controller){
	this.controller = controller;
	this.staffPlayers = specs.staffPlayers;
}

Staff.prototype = {
	selectEnemyParty: function(){
		var level = this.controller.party.level;
		var depth = level.depth;
		var ecosystem = this.controller.scenario.getPossibleEnemies(depth);
		var numberOfEnemies = Utils.rand(1, this.staffPlayers.length);
		var ret = [];
		out: for (var i = 0; i < numberOfEnemies; i++){
			var staffPlayer = Utils.randomElementOf(this.staffPlayers);
			for (var j = 0; j < ret.length; j++){
				if (ret[j].staffPlayer == staffPlayer){
					i--;
					continue out;
				}
			}
			ret.push({
				staffPlayer: staffPlayer,
				race: Utils.randomElementOf(ecosystem),
				hitPoints: Math.ceil(depth * 1.5),
				level: depth
			});
		}
		return ret;
	}
};

module.exports = Staff;