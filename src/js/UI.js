var Party = require('./Party');
var DOM = require('./DOM');

var UI = {
	mapCanvas: null,
	init: function(){
		this._bindEvents();
		this.createNewPlayerRow();
	},
	initMap: function(){
		this.mapCanvas = DOM.byId('mapCanvas');
		this.mapCanvasCtx = this.mapCanvas.getContext("2d");
		var sUI = this;
		window.requestAnimationFrame(function(){
			sUI.update();
		});
	},
	_bindEvents: function(){
		DOM.onClick('btnMoveNorth', function() { move(0, -1); });
		DOM.onClick('btnMoveSouth', function() { move(0, 1); });
		DOM.onClick('btnMoveWest', function() { move(-1, 0); });
		DOM.onClick('btnMoveEast', function() { move(1, 0); });
		DOM.onClick('btnStartGame', startGame);
		DOM.onClick('btnAddPlayer', this.createNewPlayerRow);
	},
	update: function(){
		var ctx = this.mapCanvasCtx;
		var level = Party.level;
		var blockSize = 20;
		var size = blockSize * 3;
		var scale = 40;
		var lineWidth = 2;
		// Fill background
		ctx.fillStyle = "#FFFFFF";
		ctx.fillRect(0, 0, 250, 250);
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
			// Add stairs down and up
			if (room.isExit){
				ctx.fillStyle = "#00FF00";
				ctx.fillRect(room.x * scale + blockSize, room.y * scale + blockSize, blockSize, blockSize);
			}
			if (room.isEntrance){
				ctx.fillStyle = "#0000FF";
				ctx.fillRect(room.x * scale + blockSize, room.y * scale + blockSize, blockSize, blockSize);
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
		DOM.byId('newGame').style.display = 'none';
		DOM.byId('movementButtons').style.display = 'block';
	},
	updateRoomData: function(room){
		var html = '<p>'+room.description+'</p>';
		var corridorsHTML = '';
		if (room.corridors.north){
			corridorsHTML += '<strong>North:</strong> '+room.corridors.north.description+ '<br/>';
		}
		if (room.corridors.south){
			corridorsHTML += '<strong>South:</strong> '+room.corridors.south.description+ '<br/>';
		}
		if (room.corridors.west){
			corridorsHTML += '<strong>West:</strong> '+room.corridors.west.description+ '<br/>';
		}
		if (room.corridors.east){
			corridorsHTML += '<strong>East:</strong> '+room.corridors.east.description+ '<br/>';
		}
		if (corridorsHTML.length > 0){
			html += '<p>'+corridorsHTML+'</p>';
		}
		if (room.enemies.length > 0){
			html += '<h3>Monsters!</h3><p>'+this._buildList(room.enemies, 
				function(element){
					return element.raceName;
				}
			)+'</p>';
		}
		if (room.items.length > 0){
			html += '<h3>Items</h3><p>'+this._buildList(room.items, 
				function(element){
					return element.description;
				}
			)+'</p>';
		}
		if (room.features.length > 0){
			html += '<p>'+this._buildList(room.features, 
				function(element){
					var description = element.description;
					var action = "";
					switch (element.type){
						case 'upstairs':
							action = '<button onclick="VirtualDungeon.upstairs();">Go Up</button>';
						break;
						case 'downstairs':
						action = '<button onclick="VirtualDungeon.downstairs();">Go Down</button>';
						break;
					}
					return description + action;
				}
			)+'</p>';
		}
		DOM.byId('roomDescription').innerHTML = html;
	},
	_buildList: function(arr, renderer){
		var html = '<ul>';
		for (var i = 0; i < arr.length; i++){
			html += '<li>'+renderer(arr[i])+'</li>';
		}

		html += '</ul>';
		return html;
	},
	createNewPlayerRow: function(){
		var table = DOM.byId('tblPlayersInfo');
		var currentIndex = 0;
		currentIndex++;
		var tr = DOM.create('tr');
		var td = DOM.create('td');
		var component = DOM.create('input');
		component.type = 'text';
		component.id = 'txtName_'+currentIndex;
		td.appendChild(component);
		tr.appendChild(td);

		td = DOM.create('td');
		component = DOM.create('select');
		component.id = 'cmbTeam_'+currentIndex;
		var child = DOM.create('option');
		child.value = 'heroes';
		child.innerHTML = 'Heroes';
		component.appendChild(child);
		child = DOM.create('option');
		child.value = 'dungeon';
		child.innerHTML = 'Dungeon';
		component.appendChild(child);
		td.appendChild(component);
		tr.appendChild(td);

		td = DOM.create('td');
		component = DOM.create('select');
		component.id = 'cmbRole_'+currentIndex;
		child = DOM.create('option');
		child.value = 'n/a';
		child.innerHTML = 'N/A';
		component.appendChild(child);
		child = DOM.create('option');
		child.value = 'leader';
		child.innerHTML = 'Leader';
		component.appendChild(child);
		child = DOM.create('option');
		child.value = 'mapper';
		child.innerHTML = 'Mapper';
		component.appendChild(child);
		td.appendChild(component);
		tr.appendChild(td);

		td = DOM.create('td');
		component = DOM.create('select');
		component.id = 'cmbClass_'+currentIndex;
		child = DOM.create('option');
		child.value = 'n/a';
		child.innerHTML = 'N/A';
		component.appendChild(child);
		child = DOM.create('option');
		child.value = 'fighter';
		child.innerHTML = 'Fighter';
		component.appendChild(child);
		child = DOM.create('option');
		child.value = 'mage';
		child.innerHTML = 'Mage';
		component.appendChild(child);
		child = DOM.create('option');
		child.value = 'bard';
		child.innerHTML = 'Bard';
		component.appendChild(child);
		td.appendChild(component);
		tr.appendChild(td);

		table.appendChild(tr);
	}
};

module.exports = UI;