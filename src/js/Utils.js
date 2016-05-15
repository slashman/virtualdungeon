var Utils = {
	rand: function(low, hi){
		return Math.floor(Math.random() * (hi - low + 1))+low;
	},
	randomElementOf: function(array){
    	return array[Math.floor(Math.random()*array.length)];
	},
	pullRandomElementOf: function(array){
		var index = Math.floor(Math.random()*array.length);
		var value = array[index];
		array.splice(index, 1);
    	return value;
	},
	getDirection: function(from, to){
		if (from.x == to.x){
			if (from.y > to.y){
				return 'north';
			} else {
				return 'south';
			}
		} else {
			if (from.x > to.x){
				return 'west';
			} else {
				return 'east';
			}
		}
	}
};

module.exports = Utils;