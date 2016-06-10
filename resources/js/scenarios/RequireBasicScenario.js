require('./scenarios/Basic');
require('./dungeons/Basic');

module.exports = {
	getScenario: function(id){
		return require('./scenarios/'+id);
	},
	getDungeon: function(id){
		return require('./dungeons/'+id);
	}
};