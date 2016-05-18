var DOM = {
	byId: function(id){
		return document.getElementById(id);
	},
	create: function(type){
		return document.createElement(type);
	},
	onClick: function(id, cb, context){
		this.byId(id).addEventListener('click', cb.bind(context));
	},
	val: function(id){
		return this.byId(id).value;
	},
	selectAll: function(query){
		return document.querySelectorAll(query);
	}
}
module.exports = DOM;