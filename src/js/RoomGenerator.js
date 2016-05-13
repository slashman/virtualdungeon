var Room = require('./Room.class');

var RoomGenerator = {
	generateRoom: function(level){
		return new Room(level, {	
			description: "To the north is the entrance to the Abyss",
			items: [],
			enemies: [],
			features: []
		});
	}
};

module.exports = RoomGenerator;