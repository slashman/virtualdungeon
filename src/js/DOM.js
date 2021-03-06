var DOM = {
	byId: function(id){
		return document.getElementById(id);
	},
	create: function(type){
		return document.createElement(type);
	},
	onClick: function(element, cb, context){
		if (typeof element === 'string'){
			element = this.byId(element);
		}
		element.addEventListener('click', cb.bind(context));
	},
	val: function(id){
		return this.byId(id).value;
	},
	selectAll: function(query, filter){
		var elements = document.querySelectorAll(query);
		if (filter){
			for (var i = 0; i < elements.length; i++){
				filter(elements[i]);
			}
		}
		return elements;
	}
}
module.exports = DOM;