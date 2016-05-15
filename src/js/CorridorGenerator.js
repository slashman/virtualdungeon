var Corridor = require('./Corridor.class');

var CorridorGenerator = {
	generateCorridor: function(level){
		return new Corridor(level, {	
			description: "A plain corridor",
			trap: null,
			obstacle: null
		});
	}
};

module.exports = CorridorGenerator;