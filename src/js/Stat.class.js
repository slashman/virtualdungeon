function Stat(max){
	this.max = max;
	this.current = max;
}

Stat.prototype = {
	reduce: function(points){
		this.current -= points;
		if (this.current < 0){
			this.current = 0;
		}
	},
	recover: function(points){
		this.current += points;
		if (this.current > this.max){
			this.current = this.max;
		}
	},

}

module.exports = Stat;