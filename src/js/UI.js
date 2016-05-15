var Party = require('./Party');

var UI = {
	mapCanvas: null,
	init: function(){
		this.mapCanvas = document.getElementById('mapCanvas');
		this.mapCanvasCtx = this.mapCanvas.getContext("2d");
		var sUI = this;
		window.requestAnimationFrame(function(){
			sUI.update();
		});
	},
	update: function(){
		var ctx = this.mapCanvasCtx;
		var level = Party.level;
		var scale = 50;
		var size = 50;
		for (var i = 0; i < level.rooms.length; i++){
			var room = level.rooms[i];
			if (Party.location.x == room.x && Party.location.y == room.y){
				ctx.fillStyle = "#FF0000";
			} else {
				ctx.fillStyle = "#00FF00";
			}
			ctx.fillRect(room.x * scale, room.y * scale, size, size);
		}
		var sUI = this;
		window.requestAnimationFrame(function(){
			sUI.update();
		});
	},
	startGame: function(){
		document.getElementById('newGame').style.display = 'none';
		document.getElementById('movementButtons').style.display = 'block';
	},
	updateRoomData: function(room){
		document.getElementById('roomDescription').innerHTML = room.description;
		var corridorsHTML = '';
		if (room.corridors.north){
			corridorsHTML += '<strong>North:</strong>: '+room.corridors.north.description+ '<br/>';
		}
		if (room.corridors.south){
			corridorsHTML += '<strong>South:</strong>: '+room.corridors.south.description+ '<br/>';
		}
		if (room.corridors.west){
			corridorsHTML += '<strong>West:</strong>: '+room.corridors.west.description+ '<br/>';
		}
		if (room.corridors.east){
			corridorsHTML += '<strong>East:</strong>: '+room.corridors.east.description+ '<br/>';
		}
		document.getElementById('roomExits').innerHTML = corridorsHTML;
		if (room.enemies.length == 0){
			document.getElementById('roomEnemies').innerHTML = 'No enemies';
		} else {
			document.getElementById('roomEnemies').innerHTML = this._buildList(room.enemies, 
				function(element){
					return element.raceName;
				}
			);
		}
		if (room.items.length == 0){
			document.getElementById('roomItems').innerHTML = 'No items';
		} else {
			document.getElementById('roomItems').innerHTML = this._buildList(room.items, 
				function(element){
					return element.description;
				}
			);
		}
		if (room.features.length == 0){
			document.getElementById('useItems').innerHTML = 'No features to use items on';
		} else {
			document.getElementById('useItems').innerHTML = this._buildList(room.features, 
				function(element){
					return element.description;
				}
			);
		}
	},
	_buildList: function(arr, renderer){
		var html = '<ul>';
		for (var i = 0; i < arr.length; i++){
			html += '<li>'+renderer(arr[i])+'</li>';
		}

		html += '</ul>';
	}
};

module.exports = UI;