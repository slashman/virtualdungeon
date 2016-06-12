var DOM = require('./DOM');
var Player = require('./Player.class');
var Corridor = require('./Corridor.class');
var Utils = require('./Utils');

function UI(controller){
	this.controller = controller;
	this._bindEvents(controller);
	this._initCordova();
	this._initTitleScreen();
	this.initComponents();
	this.createNewPlayerRow();
	this.mapCanvas = null;
	this.showMap = false;
	this.counters = [];
	this._disableActionButtons();
};

UI.prototype = {
	_initTitleScreen: function(){
		if (window.exodusConfig.musicCredits)
			DOM.byId('lblMusicCredits').innerHTML = window.exodusConfig.musicCredits;
		DOM.byId('lblBuildInfo').innerHTML = window.exodusConfig.buildTitle + ' v' + window.exodusConfig.version;
		this.exodusConfig = window.exodusConfig;
	},
	initMap: function(){
		this.mapCanvas = DOM.byId('mapCanvas');
		this.mapCanvasCtx = this.mapCanvas.getContext("2d");
		this.mapCanvasCtx.font = '14px sans-serif';
		var sUI = this;
		window.requestAnimationFrame(function(){
			sUI.update();
		});
	},
	updateTargetComboBoxes: function(){
		var selectedAction = DOM.val('cmbAction');
		DOM.selectAll('.commandTargetRow', function(e){e.style.display = 'none'});
		if (selectedAction === 'castSpell'){
			DOM.byId('cmbSpellsRow').style.display = 'table-row';
			DOM.byId('cmbPlayerRow').style.display = 'table-row';
			spell = this.controller.scenario.getSpell(DOM.val('cmbSpell'));
			switch (spell.targetType){
				case 'friend':
					DOM.byId('cmbSpellTargetRow').style.display = 'table-row';
					break;
				case 'enemy':
					DOM.byId('cmbTargetEnemyRow').style.display = 'table-row';
					break;
				case 'direction':
					DOM.byId('cmbDirectionsRow').style.display = 'table-row';
					break;
				case 'friendLimb':
					DOM.byId('cmbSpellTargetRow').style.display = 'table-row';
					DOM.byId('cmbBodyPartRow').style.display = 'table-row';
					break;
			}
		} else if (selectedAction === 'useEnemySkill'){
			DOM.byId('cmbTargetEnemyRow').style.display = 'table-row';
		} else if (selectedAction === 'takeItem'){
			DOM.byId('cmbItemOnFloorRow').style.display = 'table-row';
		} else if (selectedAction === 'useItem') {
			DOM.byId('cmbPlayerRow').style.display = 'table-row';
			DOM.byId('cmbItemRow').style.display = 'table-row';
		} else if (selectedAction === 'openChest' || selectedAction === 'drink') {
			DOM.byId('cmbPlayerRow').style.display = 'table-row';
		}
	},
	initComponents: function(){
		var thus = this;
		var actionTable = DOM.byId('actionsTable')
		// Action
		var tr = DOM.create('tr');
		tr.id = 'commandActionRow';
		actionTable.appendChild(tr);
		var td = DOM.create('td');
		tr.appendChild(td);
		td.innerHTML = 'Action';
		var td = DOM.create('td');
		tr.appendChild(td);
		var element = DOM.create('select');
		element.id = 'cmbAction';
		td.appendChild(element);
		element.onchange = function(){
			thus.updateTargetComboBoxes();
		}

		// Spells
		var tr = DOM.create('tr');
		actionTable.appendChild(tr);
		var td = DOM.create('td');
		tr.appendChild(td);
		tr.className = 'commandTargetRow';
		tr.id = 'cmbSpellsRow';
		td.innerHTML = 'Spell';
		var td = DOM.create('td');
		tr.appendChild(td);
		var element = DOM.create('select');
		element.id = 'cmbSpell';
		td.appendChild(element);
		var spells = this.controller.scenario.spells;
		for (var i = 0; i < spells.length; i++){
			var option = DOM.create('option');
			option.value = spells[i].name;
			if (spells[i].effect === 'physical')
				option.innerHTML = '* '+spells[i].name + '['+spells[i].cost+']';
			else
				option.innerHTML = spells[i].name + '['+spells[i].cost+']';
			element.appendChild(option);
		}
		element.onchange = function(){
			thus.updateTargetComboBoxes();
		}

		// Player
		var tr = DOM.create('tr');
		tr.className = 'commandTargetRow';
		tr.id = 'cmbPlayerRow';
		actionTable.appendChild(tr);
		var td = DOM.create('td');
		tr.appendChild(td);
		td.innerHTML = 'Player';
		var td = DOM.create('td');
		tr.appendChild(td);
		var element = DOM.create('select');
		element.id = 'cmbPlayer';
		td.appendChild(element);

		// Spell Target
		var tr = DOM.create('tr');
		tr.className = 'commandTargetRow';
		tr.id = 'cmbSpellTargetRow';
		actionTable.appendChild(tr);
		var td = DOM.create('td');
		tr.appendChild(td);
		td.innerHTML = 'Spell Target';
		var td = DOM.create('td');
		tr.appendChild(td);
		var element = DOM.create('select');
		element.id = 'cmbSpellTarget';
		td.appendChild(element);

		// Enemy Spell Target
		var tr = DOM.create('tr');
		tr.className = 'commandTargetRow';
		tr.id = 'cmbTargetEnemyRow';
		actionTable.appendChild(tr);
		var td = DOM.create('td');
		tr.appendChild(td);
		td.innerHTML = 'Spell Target (Enemy)';
		var td = DOM.create('td');
		tr.appendChild(td);
		var element = DOM.create('select');
		element.id = 'cmbSpellTargetEnemy';
		td.appendChild(element);

		// Item on Floor Target
		var tr = DOM.create('tr');
		tr.className = 'commandTargetRow';
		tr.id = 'cmbItemOnFloorRow';
		actionTable.appendChild(tr);
		var td = DOM.create('td');
		tr.appendChild(td);
		td.innerHTML = 'Item';
		var td = DOM.create('td');
		tr.appendChild(td);
		var element = DOM.create('select');
		element.id = 'cmbItemOnFloor';
		td.appendChild(element);

		// Item Target
		var tr = DOM.create('tr');
		tr.className = 'commandTargetRow';
		tr.id = 'cmbItemRow';
		actionTable.appendChild(tr);
		var td = DOM.create('td');
		tr.appendChild(td);
		td.innerHTML = 'Item';
		var td = DOM.create('td');
		tr.appendChild(td);
		var element = DOM.create('select');
		element.id = 'cmbItem';
		td.appendChild(element);		

		// Body part
		var tr = DOM.create('tr');
		tr.className = 'commandTargetRow';
		tr.id = 'cmbBodyPartRow';
		actionTable.appendChild(tr);
		var td = DOM.create('td');
		tr.appendChild(td);
		td.innerHTML = 'Body Part';
		var td = DOM.create('td');
		tr.appendChild(td);
		var bodyPartSelect = this._createBodyPartSelect();
		bodyPartSelect.id = 'cmbBodyPart';
		td.appendChild(bodyPartSelect);


		// Directions
		var tr = DOM.create('tr');
		tr.className = 'commandTargetRow';
		tr.id = 'cmbDirectionsRow';
		actionTable.appendChild(tr);
		var td = DOM.create('td');
		tr.appendChild(td);
		td.innerHTML = 'Direction';
		var td = DOM.create('td');
		tr.appendChild(td);
		var element = DOM.create('select');
		element.id = 'cmbDirection';
		td.appendChild(element);
		var option = DOM.create('option');
		option.value = 'north';
		option.innerHTML = 'North';
		element.appendChild(option);
		var option = DOM.create('option');
		option.value = 'south';
		option.innerHTML = 'South';
		element.appendChild(option);
		var option = DOM.create('option');
		option.value = 'west';
		option.innerHTML = 'West';
		element.appendChild(option);
		var option = DOM.create('option');
		option.value = 'east';
		option.innerHTML = 'East';
		element.appendChild(option);

		// Action Button
		var tr = DOM.create('tr');
		actionTable.appendChild(tr);
		var td = DOM.create('td');
		td.colSpan = 2;
		tr.appendChild(td);
		var button = DOM.create('button');
		button.innerHTML = 'Execute';
		button.className = 'actionButton';
		button.id = 'btnExecute';
		var thus = this;
		button.onclick = function(){
			thus.executeAction();
		}
		td.appendChild(button);
		this.updateTargetComboBoxes();

		// Dungeons
		var cmbDungeon = DOM.byId('cmbDungeon');
		var dungeons = this.exodusConfig.dungeons;
		for (var i = 0; i < dungeons.length; i++){
			option = DOM.create('option');
			option.value = dungeons[i].module;
			option.innerHTML = dungeons[i].name;
			cmbDungeon.appendChild(option);
		}
	},
	toogleTimeFreeze: function(){
		this.timeFrozen = !this.timeFrozen;
		DOM.byId('btnFreezeTime').innerHTML = this.timeFrozen ? 'Resume Game': 'Spell! (Freeze Time)';
		this.updateRoomData();
	},
	executeAction: function(){
		var command = {
			action: DOM.val('cmbAction'),
			spell: DOM.val('cmbSpell'),
			player: DOM.val('cmbPlayer'),
			spellTarget: DOM.val('cmbSpellTarget'),
			spellTargetEnemy: DOM.val('cmbSpellTargetEnemy'),
			itemOnFloor: DOM.val('cmbItemOnFloor'),
			item: DOM.val('cmbItem'),
			bodyPart: DOM.val('cmbBodyPart'),
			direction: DOM.val('cmbDirection')
		};
		var action = this.currentAvailableActions[command.action];
		if (this.controller.inputStatus === this.controller.COMBAT && !action.onBattle){
			this.showMessage('Cannot do this while on combat!!');
			return;
		}
		if (command.action === 'toogleMap'){
			this.showMap = !this.showMap;
			return;
		}
		if (command.action === 'stopMusic'){
			this.stopMusic();
			return;
		}
		if (command.action === 'castSpell'){
			var spell = this.controller.scenario.getSpell(command.spell);
			var player = this.controller.party.getPlayerByNumber(command.player);
			if (player.magicPoints.current < spell.cost){
				alert('Not enough MP');
				return;
			}
			if (spell.physicalHitCheck){
				//The spell may fail, requires checking physical hit
				if (!confirm('Did the spell hit the target?')){
					this.controller.spellFailed(command);
					return;
				}
			}
		}
		this.controller.execute(command);
		
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
		DOM.onClick('btnFreezeTime', this.toogleTimeFreeze, this);
		DOM.onClick('btnNewGame', this._hideTitle, this);
	},
	update: function(){
		// Fill background
		this.mapCanvasCtx.fillStyle = "#FFFFFF";
		this.mapCanvasCtx.fillRect(0, 0, 340, 440);
		if (this.showMap){
			this._drawMap();
		} else {
			this._drawRoom();
		}
		this._drawPartyStatus();
		var sUI = this;
		window.requestAnimationFrame(function(){
			sUI.update();
		});
	},
	_drawPartyStatus: function(){
		var party = this.controller.party;
		for (var i = 0; i < party.players.length; i++){
			var player = party.players[i];
			this._drawPlayerIcon(i * 80 + 20, 270, player);
		}
	},
	_drawPlayerIcon: function(x, y, player){
		var ctx = this.mapCanvasCtx;
		var size = 20;
		ctx.fillStyle = '#000000';
		ctx.fillText(player.name, x, y + 100);
		ctx.fillText('HP ' + player.hitPoints.current, x, y + 120);
		ctx.fillText('MP ' + player.magicPoints.current, x, y + 140);
		ctx.fillText(player.getAilmentsCode(), x, y + 160);
		ctx.fillRect(x+size, y, size, size*3);
		ctx.fillStyle = this._getBodyPartColor(player, Player.LEFT_LEG);
		ctx.fillRect(x, y+size*3, size, size);
		ctx.fillStyle = this._getBodyPartColor(player, Player.RIGHT_LEG);
		ctx.fillRect(x+size*2, y+size*3, size, size);
		ctx.fillStyle = this._getBodyPartColor(player, Player.LEFT_ARM);
		ctx.fillRect(x, y+size, size, size);
		ctx.fillStyle = this._getBodyPartColor(player, Player.RIGHT_ARM);
		ctx.fillRect(x+size*2, y+size, size, size);
	},
	_getBodyPartColor: function (player, bodyPart){
		if (player.injuredMap[bodyPart]){
			return '#FF0000';
		} else {
			return '#000000';
		}
	},
	_drawMap: function(){
		var ctx = this.mapCanvasCtx;
		var party = this.controller.party;
		var level = party.level;
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
			ctx.fillStyle = this._getCorridorColor(room.corridors.north);
			ctx.fillRect(room.x * scale + blockSize, room.y * scale, blockSize, blockSize);
			ctx.fillStyle = this._getCorridorColor(room.corridors.south);
			ctx.fillRect(room.x * scale + blockSize, room.y * scale + 2 * blockSize, blockSize, blockSize);
			ctx.fillStyle = this._getCorridorColor(room.corridors.west);
			ctx.fillRect(room.x * scale, room.y * scale + blockSize, blockSize, blockSize);
			ctx.fillStyle = this._getCorridorColor(room.corridors.east);
			ctx.fillRect(room.x * scale + 2 * blockSize, room.y * scale + blockSize, blockSize, blockSize);
			// Show enemies
			if (room.spawnEnemies || room.enemies.length > 0){
				ctx.lineWidth= lineWidth;
				ctx.strokeStyle="#ff00d5";
				ctx.strokeRect(room.x * scale + blockSize + lineWidth / 2, room.y * scale + blockSize + lineWidth / 2, blockSize - lineWidth, blockSize - lineWidth );
			}
			// Add stairs down and up
			if (room.isExit){
				ctx.fillStyle = "#0000FF";
				ctx.fillRect(room.x * scale + blockSize, room.y * scale + blockSize, blockSize, blockSize);
			}
			/*if (room.isEntrance){
				ctx.fillStyle = "#0000FF";
				ctx.fillRect(room.x * scale + blockSize, room.y * scale + blockSize, blockSize, blockSize);
			}*/
			// Show party location
			if (party.location.x == room.x && party.location.y == room.y){
				ctx.fillStyle = "#888888";
				ctx.fillRect(room.x * scale + blockSize, room.y * scale + blockSize, blockSize, blockSize);
			}
		}
	},
	_drawRoom: function(){
		var ctx = this.mapCanvasCtx;
		var party = this.controller.party;
		var room = party.getCurrentRoom();
		var level = party.level;
		var blockSize = 20;
		var x = 100;
		var y = 20;
		// Fill the room border with blackness
		ctx.fillStyle = "#000000";
		ctx.fillRect(x, y, blockSize * 7, blockSize * 7);
		ctx.fillStyle = "#FFFFFF";
		ctx.fillRect(x+blockSize, y+blockSize, blockSize * 5, blockSize * 5);

		// Now, fill the corridors
		if (room.corridors.north){
			ctx.fillStyle = this._getCorridorColor(room.corridors.north);
			ctx.fillRect(x+3 * blockSize, y, blockSize, blockSize);
		}
		if (room.corridors.south){
			ctx.fillStyle = this._getCorridorColor(room.corridors.south);
			ctx.fillRect(x+3 * blockSize, y+6 * blockSize, blockSize, blockSize);
		}
		if (room.corridors.west){
			ctx.fillStyle = this._getCorridorColor(room.corridors.west);
			ctx.fillRect(x, y + 3 * blockSize, blockSize, blockSize);
		}
		if (room.corridors.east){
			ctx.fillStyle = this._getCorridorColor(room.corridors.east);
			ctx.fillRect(x + 6 * blockSize, y + 3 * blockSize, blockSize, blockSize);
		}
	},
	_getCorridorColor: function(corridor){
		if (!corridor)
			return '#000000';
		if (corridor.obstacle){
			switch (corridor.obstacle.type){
				case Corridor.FIRE_FIELD:
					return '#FF0000';
				case Corridor.POISON_FIELD:
					return '#00FF00';
				case Corridor.SLEEP_FIELD:
					return '#FF00FF';
			}
		}
		return "#FFFFFF";
	},
	_hideTitle: function(){
		DOM.byId('titleSection').style.display = 'none';
		DOM.byId('newGame').style.display = 'block';
	},
	hideNewGamePanel: function(){
		var ui = this;
		DOM.byId('newGame').style.display = 'none';
		DOM.byId('movementButtons').style.display = 'block';
		this.setMovementButtons();
		var partyMembers = DOM.byId('partyMembersSection');
		var bodypartHitSelection = DOM.byId('bodypartHitSelection');
		var bodypartTitle = DOM.create('p');
		bodypartTitle.className = 'gmTip';
		bodypartTitle.innerHTML = 'When all enemies are down, register all the hits sustained by the party';
		bodypartHitSelection.appendChild(bodypartTitle);
		for (var i = 0; i < this.controller.party.players.length; i++){
			var player = this.controller.party.players[i];
			// Add a row for the target selection section with a checkbox
			var playerRow = DOM.create('div');
			var selectPlayerCheckbox = DOM.create('input');
			selectPlayerCheckbox.type = 'checkbox';
			selectPlayerCheckbox.className = 'selectPlayerCheckbox';
			selectPlayerCheckbox.playerId = player.number;
			playerRow.appendChild(selectPlayerCheckbox);
			var playerInfoDiv = DOM.create('span');
			playerInfoDiv.innerHTML = player.name;
			playerRow.appendChild(playerInfoDiv);
			partyMembers.appendChild(playerRow);

			// Add a row to the bodypart hit section
			playerRow = DOM.create('div');
			var playerNameSpan = DOM.create('span');
			playerNameSpan.innerHTML = player.name;
			playerRow.appendChild(playerNameSpan);
			playerRow.appendChild(DOM.create('br'));

			var bodyPartSelect = this._createBodyPartSelect();
			bodyPartSelect.id = 'bodyPartSelect'+player.number;
			bodyPartSelect.className = 'combatComponent';
			bodyPartSelect.classList.add('actionButton');
			playerRow.appendChild(bodyPartSelect);

			var takeDamageButton = DOM.create('button');
			takeDamageButton.innerHTML = 'Hit '+player.name+'!';
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
			bodypartHitSelection.appendChild(playerRow);

			// Fill player comboboxes
			cmbPlayer = DOM.byId('cmbPlayer');
			playerOption = DOM.create('option');
			playerOption.value = player.number;
			playerOption.innerHTML = player.name;
			cmbPlayer.appendChild(playerOption)

			var cmbSpellPlayer = DOM.byId('cmbSpellTarget');
			playerOption = DOM.create('option');
			playerOption.value = player.number;
			playerOption.innerHTML = player.name;
			cmbSpellPlayer.appendChild(playerOption)
		}
		DOM.selectAll('.selectPlayerCheckbox', function(e){e.style.display = 'none'});
		DOM.byId('inGame').style.display = 'block';
		this.playMusic('explore');
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
		var startingLevel = parseInt(DOM.val('txtStartingLevel'));
		var roomDensity = DOM.val('cmbRoomDensity');
		var dungeon = DOM.val('cmbDungeon');

		var players = [];
		var names = DOM.selectAll('.playerNameText');
		var classes = DOM.selectAll('.playerClassCombo');
		for (var i = 0; i < names.length; i++){
			players.push({
				name: names[i].value,
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
			dungeon: dungeon,
			dungeonSize: {
				w: dungeonW,
				h: dungeonH
			},
			startingLevel: startingLevel,
			roomDensity: roomDensity,
			players: players,
			staffPlayers: staffPlayers
		}
	},
	updateRoomData: function(){
		var party = this.controller.party;
		var room = this.controller.party.getCurrentRoom();
		var html = '<p>You are in level '+party.level.depth+' of the dungeon</p>';
		var inBattle = room.enemies.length > 0;
		if (inBattle){
			html += '<h3>Monsters!</h3><p>'+this._buildList(room.enemies, 
				function(element){
					var html = element.race.name +' ('+element.staffPlayer.name+')' + ' HP: '+element.hitPoints;
					if (element.race.sp)
						html += ' SP: '+element.race.sp;
					if (element.race.intrinsics){
						html += '<br>Intrinsics: '+element.race.intrinsics;
					}
					if (element.race.skills){
						html += '<br>Skills:<br>';
						for (var i = 0; i < element.race.skills.length; i++){
							var skill = element.race.skills[i];
							html += skill.name+': '+skill.description+'<br>';
						}
					}

					return html;
				}
			)+'</p>';
			// Monster target for spells
			var cmbSpellPlayer = DOM.byId('cmbSpellTargetEnemy');
			cmbSpellPlayer.innerHTML = '';
			for (var i = 0; i < room.enemies.length; i++){
				var enemy = room.enemies[i];
				playerOption = DOM.create('option');
				playerOption.value = i;
				playerOption.innerHTML = enemy.race.name + ' ('+enemy.staffPlayer.name+')';
				cmbSpellPlayer.appendChild(playerOption)
			}
		}
		if (room.items.length > 0){
			html += '<h3>Items</h3><p>'+this._buildList(room.items, 
				function(element){
					return element.name;
				}
			)+'</p>';
		}
		var cmbItem = DOM.byId('cmbItemOnFloor');
		cmbItem.innerHTML = '';
		for (var i = 0; i < room.items.length; i++){
			var item = room.items[i];
			playerOption = DOM.create('option');
			playerOption.value = i;
			playerOption.innerHTML = item.name;
			cmbItem.appendChild(playerOption)
		}
			
		if (party.items.length > 0){
			html += '<h3>Inventory</h3><p>'+this._buildList(party.items, 
				function(element){
					return element.name;
				}
			)+'</p>';
		}	
		var cmbItem = DOM.byId('cmbItem');
		cmbItem.innerHTML = '';
		for (var i = 0; i < party.items.length; i++){
			var item = party.items[i];
			playerOption = DOM.create('option');
			playerOption.value = i;
			playerOption.innerHTML = item.name;
			cmbItem.appendChild(playerOption)
		}
		
		if (room.features.length > 0) {
			html += '<h3>Features</h3><p>'+this._buildList(room.features, 
 				function(element){
 					return element.description;
 				}
 			)+'</p>';
		}

		if (room.gmTips){
			html += '<p><b>'+room.gmTips.name+'</b></p>';
			html += '<p class = "gmTip">'+room.gmTips.helpText+'</p>';
		}

		DOM.byId('roomDescription').innerHTML = html;

		var actions = [];
		if (!inBattle)
			actions.push({code: 'passTurn', name: 'Stand', onBattle: false});
		if (!inBattle || this.timeFrozen)
			actions.push({code: 'castSpell', name: 'Cast Spell', onBattle: true});
		if (inBattle && this.timeFrozen)
			actions.push({code: 'useEnemySkill', name: 'Use Enemy Skill', onBattle: true});
		actions.push({code: 'toogleMap', name: 'Toogle Map', onBattle: true});
		if (party.items.length > 0 && (!inBattle || this.timeFrozen)){
			actions.push({code: 'useItem', name: 'Use Item', onBattle: true});
		}
		if (!inBattle) for (var i = 0; i < room.features.length; i++){
			var feature = room.features[i];
			switch (feature.type){
				case 'upstairs':
					actions.push({code: 'upstairs', name: 'Go Up', onBattle: false});
					break;
				case 'downstairs':
					actions.push({code: 'downstairs', name: 'Go Down', onBattle: false});
					break;
				case 'winArtifact':
					actions.push({code: 'win', name: 'Win Game', onBattle: false});
					break;
				case 'fountain':
					actions.push({code: 'drink', name: 'Drink', onBattle: false});
					break;
				case 'chest':
					actions.push({code: 'openChest', name: 'Open Chest', onBattle: false});
					break;
			}
		}
		if (!inBattle) if (room.items.length > 0){
			actions.push({code: 'takeItem', name: 'Pick up item', onBattle: false});
		}
		if (inBattle){
			var canSleep = false;
			var canNegate = false;
			for (var i = 0; i < room.enemies.length; i++){
				var enemy = room.enemies[i];
				if (enemy.race.skills) for (var j = 0; j < enemy.race.skills.length; j++){
					var skill = enemy.race.skills[j];
					if (skill.special && skill.special === 'negate'){
						canNegate = true;
					}
					if (skill.special && skill.special === 'sleep'){
						canSleep = true;	
					}
				}
			}
			if (canSleep){
				actions.push({code: 'enemySleepAll', name: '* Enemy Sleep All', onBattle: true});
			}
			if (canNegate){
				actions.push({code: 'enemyNegateTime', name: '* Enemy Negate Time', onBattle: true});
			}
		}
		actions.push({code: 'stopMusic', name: '* Stop Music', onBattle: true});
		var roomActionsCmb = DOM.byId('cmbAction');
		roomActionsCmb.innerHTML = ''; // Can be done better but me lazy
		this.currentAvailableActions = {};
		for (var i = 0; i < actions.length; i++){
			var actionChild = DOM.create('option');
			actionChild.value = actions[i].code;
			actionChild.innerHTML = actions[i].name;
			this.currentAvailableActions[actions[i].code] = actions[i];
			roomActionsCmb.appendChild(actionChild);
		}
		
		this.updateTargetComboBoxes();
		this.setMovementButtons();
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
		td.innerHTML = 'Adventurers';
		tr.appendChild(td);

		td = DOM.create('td');
		component = DOM.create('select');
		component.className = 'playerClassCombo';
		for (var i = 0; i < this.controller.scenario.jobs.length; i++){
			var job = this.controller.scenario.jobs[i];
			child = DOM.create('option');
			child.value = job.code ? job.code : job.name;
			child.innerHTML = job.name + ' HP: '+job.str+' MP: '+job.magic;
			component.appendChild(child);	
		}
		td.appendChild(component);
		tr.appendChild(td);

		td = DOM.create('td');
		component = DOM.create('button');
		component.innerHTML = 'X';
		component.onclick = function(){
			var players = DOM.selectAll('.playerNameText').length + DOM.selectAll('.staffPlayerNameText').length;
			if (players > 1){
				table.removeChild(tr);
			}
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
		td.innerHTML = 'Dwellers';
		tr.appendChild(td);

		td = DOM.create('td');
		td.innerHTML = 'Monster';
		tr.appendChild(td);

		td = DOM.create('td');
		component = DOM.create('button');
		component.innerHTML = 'X';
		component.onclick = function(){
			var players = DOM.selectAll('.playerNameText').length + DOM.selectAll('.staffPlayerNameText').length;
			if (players > 1){
				table.removeChild(tr);
			}
		}
		td.appendChild(component);
		tr.appendChild(td);

		table.appendChild(tr);
	},
	showMessage: function(message){
		var component = DOM.create('p');
		component.innerHTML = message;
		DOM.byId('messageArea').appendChild(component);
		alert(message);
	},
	clearMessages: function(){
		DOM.byId('messageArea').innerHTML = '';
	},
	_disableActionButtons: function(){

		DOM.selectAll('.actionButton', function(e){
			e.style.display = 'none';
		});
		DOM.selectAll('.commandTargetRow', function(e){
			e.style.display = 'none';
		});
		DOM.byId('commandActionRow').style.display = 'none';

	},
	enableMovement: function(){
		this._disableActionButtons();
		this.setMovementButtons();
		this.updateTargetComboBoxes();
		DOM.byId('commandActionRow').style.display = 'table-row';
		DOM.byId('btnExecute').style.display = 'inline';
	},
	selectTargets: function(cb){
		this._disableActionButtons();
		DOM.byId('playersActionSelection').style.display = 'block';
		this._disableMovemenButtons();

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
		DOM.byId('playersActionSelection').style.display = 'none';
		this.updateRoomData();
	},
	activateCombat: function(){
		DOM.selectAll('.movementButton', function(e){
			e.style.display = 'none';
		});
		this.updateTargetComboBoxes();
		DOM.selectAll('.combatComponent', function(e){
			e.style.display = 'inline';
		});
		DOM.byId('bodypartHitSelection').style.display = 'block';
		this.updateRoomData();
	},
	_battleOver: function(){
		this.controller.endBattle();
		this.controller.setInputStatus(this.controller.MOVE);
		this.updateRoomData();
		DOM.byId('bodypartHitSelection').style.display = 'none';
		if (this.timeFrozen){
			this.toogleTimeFreeze();
		}
		this.playMusic('victory', 'explore');
	},
	_passTurn: function(){
		this.clearMessages();
		this.showMessage('** Waiting **');
		this.controller.passTurn();
		this.updateRoomData();
	},
	addCounter: function(counter){
		var div = DOM.create('div');
		div.id = 'counterDiv'+counter.id;
		div.innerHTML = this._formatSeconds(counter.time)+', '+counter.message;
		this.counters.push(counter);
		DOM.byId('countersSection').appendChild(div);
	},
	updateCounter: function(counter){
		if (counter.killed)
			return;
		var message = counter.message;
		if (counter.time <= 0){
			message = counter.offMessage;
			this.showMessage(message);
		}
		DOM.byId('counterDiv'+counter.id).innerHTML = this._formatSeconds(counter.time)+', '+message;
	},
	removeCounter: function(counter){
		if (counter.killed)
			return;
		DOM.byId('countersSection').removeChild(DOM.byId('counterDiv'+counter.id));
		counter.killed = true;
		for (var i = 0; i < this.counters.length; i++){
			var xcounter = this.counters[i];
			if (xcounter == counter){
				this.counters.splice(i,1);
				break;
			}
		}
	},
	removeAllBattleCounters: function(){
		for (var i = 0; i < this.counters.length; i++){
			var counter = this.counters[i];
			if (counter.isBattleCounter){
				this.removeCounter(counter);
				i--;
			}
		}
	},
	_formatSeconds: function(seconds){
		var minutes = Math.floor(seconds/60);
		var seconds = seconds % 60;
		seconds = seconds < 10 ? '0'+seconds : seconds;
		return minutes +':'+seconds;
	},
	playMusic: function(theme, then, keep){
		var looped = false;
		var track = '';
		if (keep){
			track = this.selectedTrack;
		} else {
			if (typeof this.exodusConfig.music[theme] === 'string'){
				track = this.exodusConfig.music[theme];
			} else {
				track = Utils.randomElementOf(this.exodusConfig.music[theme]);
			}
			this.selectedTrack = track;
		}
		if (theme === 'combat' || theme === 'explore'){
			looped = true;
		}
		track = 'mp3/'+track;
		if (this.currentAudio == null){
			this.currentAudio = new Audio(track);
		} else {
			this.currentAudio.pause();
			this.currentAudio.src = track;
		}
		this.currentAudio.play();
		var thus = this;
		if (looped){
			this.currentAudio.onended=function(){thus.playMusic(theme, false, true);}
		} else {
			this.currentAudio.onended=function(){
				delete thus.currentAudio;
				if (thus.thenPlay){
					thus.playMusic(thus.thenPlay);
				}
			}
		}
		if (then){
			this.thenPlay = then;
		} else {
			this.thenPlay = false;
		}
	},
	stopMusic: function(){
		if (this.currentAudio){
			this.currentAudio.pause();
		}
	},
	setMovementButtons: function(){
		var room = this.controller.party.getCurrentRoom();
		DOM.selectAll('.movementButton', function(e){
			e.style.display = 'none';
		});
		if (room.enemies.length > 0){
			return;
		}
		if (room.corridors.north){
			DOM.byId('btnMoveNorth').style.display = 'inline';
			DOM.byId('btnMoveNorth').innerHTML = 'North: '+room.corridors.north.getDescription();
		}
		if (room.corridors.south){
			DOM.byId('btnMoveSouth').style.display = 'inline';
			DOM.byId('btnMoveSouth').innerHTML = 'South: '+room.corridors.south.getDescription();
		}
		if (room.corridors.west){
			DOM.byId('btnMoveWest').style.display = 'inline';
			DOM.byId('btnMoveWest').innerHTML = 'West: '+room.corridors.west.getDescription();
		}
		if (room.corridors.east){
			DOM.byId('btnMoveEast').style.display = 'inline';
			DOM.byId('btnMoveEast').innerHTML = 'East: '+room.corridors.east.getDescription();
		}
	},
	_disableMovemenButtons: function(){
		DOM.selectAll('.movementButton', function(e){
			e.style.display = 'none';
		});
	},
	setSelectTargetsMessage: function(message){
		DOM.byId('lblSelectTargetsMessage').innerHTML = message;
	},
	_initCordova: function(){
		function onDeviceReady(){
			function onBackKeyDown() {
				if (confirm("Exit EXODUS? Your game will be lost")){
					navigator.app.exitApp()
				} else {
					return false;
				}
			}
			document.addEventListener("backbutton", onBackKeyDown, false);
		}
		document.addEventListener("deviceready", onDeviceReady, false);
	}
};

module.exports = UI;