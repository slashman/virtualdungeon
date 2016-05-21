var DOM = require('./DOM');
var Player = require('./Player.class');

function UI(controller){
	this.controller = controller;
	this._bindEvents(controller);
	this.createNewPlayerRow();
	this.mapCanvas = null;
	this._disableActionButtons();
};

UI.prototype = {
	initMap: function(){
		this.mapCanvas = DOM.byId('mapCanvas');
		this.mapCanvasCtx = this.mapCanvas.getContext("2d");
		var sUI = this;
		window.requestAnimationFrame(function(){
			sUI.update();
		});
	},
	_bindEvents: function(controller){
		DOM.onClick('btnMoveNorth', function() { move(0, -1); });
		DOM.onClick('btnMoveSouth', function() { move(0, 1); });
		DOM.onClick('btnMoveWest', function() { move(-1, 0); });
		DOM.onClick('btnMoveEast', function() { move(1, 0); });
		DOM.onClick('btnStartGame', controller.startGame, controller);
		DOM.onClick('btnAddPlayer', this.createNewPlayerRow, this);
		DOM.onClick('btnAddStaffPlayer', this.createNewStaffPlayerRow, this);
		DOM.onClick('btnSelectTargets', this._targetsSelected, this);
		DOM.onClick('btnEndCombat', this._battleOver, this);
	},
	update: function(){
		var ctx = this.mapCanvasCtx;
		var party = this.controller.party;
		var level = party.level;
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
			if (room.spawnEnemies || room.enemies.length > 0){
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
			if (party.location.x == room.x && party.location.y == room.y){
				ctx.fillStyle = "#FF0000";
				ctx.fillRect(room.x * scale + blockSize, room.y * scale + blockSize, blockSize, blockSize);
			}
		}
		var sUI = this;
		window.requestAnimationFrame(function(){
			sUI.update();
		});
	},
	hideNewGamePanel: function(){
		var ui = this;
		DOM.byId('newGame').style.display = 'none';
		DOM.byId('movementButtons').style.display = 'block';
		var partyMembers = DOM.byId('partyMembersSection');
		for (var i = 0; i < this.controller.party.players.length; i++){
			var player = this.controller.party.players[i];
			var playerRow = DOM.create('div');
			
			var selectPlayerCheckbox = DOM.create('input');
			selectPlayerCheckbox.type = 'checkbox';
			selectPlayerCheckbox.className = 'selectPlayerCheckbox';
			selectPlayerCheckbox.playerId = player.number;
			playerRow.appendChild(selectPlayerCheckbox);

			var playerInfoDiv = DOM.create('span');
			playerInfoDiv.id = 'player'+player.number+'Status';
			playerRow.appendChild(playerInfoDiv);

			var bodyPartSelect = this._createBodyPartSelect();
			bodyPartSelect.id = 'bodyPartSelect'+player.number;
			bodyPartSelect.className = 'combatComponent';
			bodyPartSelect.classList.add('actionButton');
			playerRow.appendChild(bodyPartSelect);

			var takeDamageButton = DOM.create('button');
			takeDamageButton.innerHTML = 'Hit!';
			takeDamageButton.className = 'combatComponent';
			takeDamageButton.classList.add('actionButton');
			(function(player){
				DOM.onClick(takeDamageButton, function() {
					var bodyPart = DOM.val('bodyPartSelect'+player.number);
					player.takeInjury(bodyPart);
					ui.updateRoomData();
				});
			})(player);
			playerRow.appendChild(takeDamageButton);

			partyMembers.appendChild(playerRow);
		}
		DOM.selectAll('.selectPlayerCheckbox', function(e){e.style.display = 'none'});
	},
	_createBodyPartSelect: function(){
		var select = DOM.create('select');
		select.className = 'playerBodyPartSelect';
		var options = [
			{value: Player.TORSO, label: 'Torso'},
			{value: Player.LEFT_ARM, label: 'Left Arm'},
			{value: Player.RIGHT_ARM, label: 'Right Arm'},
			{value: Player.LEFT_LEG, label: 'Left Leg'},
			{value: Player.RIGHT_LEG, label: 'Right Leg'},
		];
		for (var i = 0; i < options.length; i++){
			var option = DOM.create('option');
			option.value =  options[i].value;
			option.innerHTML = options[i].label;
			select.appendChild(option);	
		}
		return select;
	},
	getNewGameConfig: function(){
		var dungeonW = parseInt(DOM.val('txtDungeonW'));
		var dungeonH = parseInt(DOM.val('txtDungeonH'));
		var roomDensity = DOM.val('cmbRoomDensity');

		var players = [];
		var names = DOM.selectAll('.playerNameText');
		var roles = DOM.selectAll('.playerRoleCombo');
		var classes = DOM.selectAll('.playerClassCombo');
		for (var i = 0; i < names.length; i++){
			players.push({
				name: names[i].value,
				role: roles[i].value,
				job: classes[i].value
			});
		}

		var staffPlayers = [];
		var staffNames = DOM.selectAll('.staffPlayerNameText');
		for (var i = 0; i < staffNames.length; i++){
			staffPlayers.push({
				name: staffNames[i].value
			});
		}


		return {
			dungeonSize: {
				w: dungeonW,
				h: dungeonH
			},
			roomDensity: roomDensity,
			players: players,
			staffPlayers: staffPlayers
		}
	},
	updateRoomData: function(){
		var room = this.controller.party.getCurrentRoom();
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
					return element.race.name + ' HP: '+element.hitPoints+' ('+element.staffPlayer.name+')';
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
		// Party status
		for (var i = 0; i < this.controller.party.players.length; i++){
			var player = this.controller.party.players[i];
			DOM.byId('player'+player.number+'Status').innerHTML = player.getStatusLine();
		}
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
		var tr = DOM.create('tr');
		var td = DOM.create('td');
		var component = DOM.create('input');
		component.type = 'text';
		component.className = 'playerNameText';
		td.appendChild(component);
		tr.appendChild(td);

		td = DOM.create('td');
		td.innerHTML = 'Heroes';
		tr.appendChild(td);

		td = DOM.create('td');
		component = DOM.create('select');
		component.className = 'playerRoleCombo';
		child = DOM.create('option');
		child.value = 'leader';
		child.innerHTML = 'Leader';
		component.appendChild(child);
		child = DOM.create('option');
		child.value = 'mapper';
		child.innerHTML = 'Mapper';
		component.appendChild(child);
		child = DOM.create('option');
		child.value = 'none';
		child.innerHTML = 'None';
		component.appendChild(child);
		td.appendChild(component);
		tr.appendChild(td);

		td = DOM.create('td');
		component = DOM.create('select');
		component.className = 'playerClassCombo';
		for (var i = 0; i < this.controller.scenario.jobs.length; i++){
			var job = this.controller.scenario.jobs[i];
			child = DOM.create('option');
			child.value = job.code ? job.code : job.name;
			child.innerHTML = job.name;
			component.appendChild(child);	
		}
		td.appendChild(component);
		tr.appendChild(td);

		table.appendChild(tr);
	},
	createNewStaffPlayerRow: function(){
		var table = DOM.byId('tblPlayersInfo');
		var tr = DOM.create('tr');
		var td = DOM.create('td');
		var component = DOM.create('input');
		component.type = 'text';
		component.className = 'staffPlayerNameText';
		td.appendChild(component);
		tr.appendChild(td);

		td = DOM.create('td');
		td.innerHTML = 'Dungeon';
		tr.appendChild(td);

		td = DOM.create('td');
		td.innerHTML = 'Any';
		tr.appendChild(td);

		td = DOM.create('td');
		td.innerHTML = 'Any';
		tr.appendChild(td);

		table.appendChild(tr);
	},
	showMessage: function(message){
		var component = DOM.create('p');
		component.innerHTML = message;
		DOM.byId('messageArea').appendChild(component);
	},
	clearMessages: function(){
		DOM.byId('messageArea').innerHTML = '';
	},
	_disableActionButtons: function(){
		DOM.selectAll('.actionButton', function(e){
			e.style.display = 'none';
		});
	},
	enableMovement: function(){
		this._disableActionButtons();
		DOM.selectAll('.movementButton', function(e){
			e.style.display = 'inline';
		});
	},
	selectTargets: function(cb){
		this._disableActionButtons();
		DOM.byId('btnSelectTargets').style.display = 'inline';

		DOM.selectAll('.selectPlayerCheckbox', function(e){
			e.checked = false;
			e.style.display = 'inline';
		});
		
		this.targetSelectedCb = cb;

	},
	_targetsSelected: function(){
		var targets = [];
		var party = this.controller.party;
		DOM.selectAll('.selectPlayerCheckbox', function(e){
			e.style.display = 'none';
			if (e.checked)
				targets.push(party.getPlayerByNumber(e.playerId));
		});
		this.targetSelectedCb(targets);
		this.controller.setInputStatus(this.controller.MOVE);
		this.updateRoomData();
	},
	activateCombat: function(){
		this._disableActionButtons();
		DOM.selectAll('.combatComponent', function(e){
			e.style.display = 'inline';
		});
	},
	_battleOver: function(){
		this.showMessage('All enemies are vanquished!');
		this.controller.party.getCurrentRoom().endBattle();
		this.controller.setInputStatus(this.controller.MOVE);
		this.updateRoomData();
	}
};

module.exports = UI;