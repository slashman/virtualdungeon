var Corridor = require('./Corridor.class');

var CorridorGenerator = {
	generateCorridor: function(level){
		return new Corridor(level, {	
			description: "",
			trap: null,
			obstacle: null
		});
	}
};

module.exports = CorridorGenerator;