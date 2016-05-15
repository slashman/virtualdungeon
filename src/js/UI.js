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
		var blockSize = 20;
		var size = blockSize * 3;
		var scale = 40;
		var lineWidth = 2;
		for (var i = 0; i < level.rooms.length; i++){
			var room = level.rooms[i];
			// Base white room
			ctx.fillStyle = "#FFFFFF";
			ctx.fillRect(room.x * scale, room.y * scale, size, size);

			// Fill the 4 fixed blocks with blackness
			ctx.fillStyle = "#000000";
			ctx.fillRect(room.x * scale, room.y * scale, blockSize, blockSize);
			ctx.fillRect(room.x * scale, room.y * scale + 2 * blockSize, blockSize, blockSize);
			ctx.fillRect(room.x * scale + 2 * blockSize, room.y * scale, blockSize, blockSize);
			ctx.fillRect(room.x * scale + 2 * blockSize, room.y * scale + 2 * blockSize, blockSize, blockSize);
			// Now, fill the corridors
			if (!room.corridors.north)
				ctx.fillRect(room.x * scale + blockSize, room.y * scale, blockSize, blockSize);
			if (!room.corridors.south)
				ctx.fillRect(room.x * scale + blockSize, room.y * scale + 2 * blockSize, blockSize, blockSize);
			if (!room.corridors.west)
				ctx.fillRect(room.x * scale, room.y * scale + blockSize, blockSize, blockSize);
			if (!room.corridors.east)
				ctx.fillRect(room.x * scale + 2 * blockSize, room.y * scale + blockSize, blockSize, blockSize);
			// Show enemies
			if (room.enemies.length > 0){
				ctx.lineWidth= lineWidth;
				ctx.strokeStyle="#ff00d5";
				ctx.strokeRect(room.x * scale + blockSize + lineWidth / 2, room.y * scale + blockSize + lineWidth / 2, blockSize - lineWidth, blockSize - lineWidth );
			}

			// Show party location
			if (Party.location.x == room.x && Party.location.y == room.y){
				ctx.fillStyle = "#FF0000";
				ctx.fillRect(room.x * scale + blockSize, room.y * scale + blockSize, blockSize, blockSize);
			}
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
			document.getElementById('roomEnemies').innerHTML = '';
		} else {
			document.getElementById('roomEnemies').innerHTML = '<b>Monsters!</b><br>'+this._buildList(room.enemies, 
				function(element){
					return element.raceName;
				}
			);
		}
		if (room.items.length == 0){
			document.getElementById('roomItems').innerHTML = '';
		} else {
			document.getElementById('roomItems').innerHTML = this._buildList(room.items, 
				function(element){
					return element.description;
				}
			);
		}
		if (room.features.length == 0){
			document.getElementById('useItems').innerHTML = '';
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
		return html;
	}
};

module.exports = UI;