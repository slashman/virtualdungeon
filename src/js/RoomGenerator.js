var Room = require('./Room.class');

var RoomGenerator = {
	generateRoom: function(level){
		return new Room(level, {	
			description: "This room is uninteresting.",
			items: [],
			enemies: [],
			features: []
		});
	}
};

module.exports = RoomGenerator;