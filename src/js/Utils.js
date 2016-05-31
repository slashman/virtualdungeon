var Utils = {
	rand: function(low, hi){
		return Math.floor(Math.random() * (hi - low + 1))+low;
	},
	randomElementOf: function(array){
    	return array[Math.floor(Math.random()*array.length)];
	},
	randSplit: function(distrib){
		var pivot = Math.random();
		var sum = 0;
		for (var i = 0; i < distrib.length; i++){
			sum += distrib[i];
			if (pivot <= sum){
				return i;
			}
		}
		return 0;
	},
	chance: function(probability){
		return this.rand(0, 100) <= probability;
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
	},
	DIRECTION_VECTORS: {
		north: {
			x: 0,
			y: -1
		},
		south: {
			x: 0,
			y: 1
		},
		west: {
			x: -1,
			y: 0
		},
		east: {
			x: 1,
			y: 0
		}
	},
	getVector: function(direction){
		return this.DIRECTION_VECTORS[direction];
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