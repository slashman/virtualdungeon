(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Player = require('./Player.class');
var Utils = require('./Utils');

function Corridor(level, features){
	this.level = null;
	this.description = null;
	this.trap = null;
	this.obstacle = null;
	this.init(level, features);
}

Corridor.ARROWS_TRAP = 'arrows-trap';
Corridor.FLOOR_TRAP = 'floor-trap';
Corridor.FALLING_TRAP = 'falling-trap';
Corridor.BOMB_TRAP = 'bomb-trap';
Corridor.POWDER_TRAP = 'powder-trap';

Corridor.SPIKES_TRAP = 'spikes-trap';
Corridor.CLAMPING_TRAP = 'clamping-trap';
Corridor.CALTROPS_TRAP = 'caltrops-trap';
Corridor.PIT_TRAP = 'pit-trap';

Corridor.TRAP_DESCRIPTIONS = {};

Corridor.TRAP_DESCRIPTIONS[Corridor.ARROWS_TRAP] = 'Arrows fly from everywhere!';
Corridor.TRAP_DESCRIPTIONS[Corridor.FALLING_TRAP] = 'A bunch of rocks fail from the ceiling!';
Corridor.TRAP_DESCRIPTIONS[Corridor.BOMB_TRAP] = 'BOOM! A bomb is set off!';
Corridor.TRAP_DESCRIPTIONS[Corridor.POWDER_TRAP] = 'A cloud of smoke covers the party!';
Corridor.TRAP_DESCRIPTIONS[Corridor.SPIKES_TRAP] = 'You fall into a pit of sharp spikes';
Corridor.TRAP_DESCRIPTIONS[Corridor.CLAMPING_TRAP] = 'You step on a clamping trap';
Corridor.TRAP_DESCRIPTIONS[Corridor.CALTROPS_TRAP] = 'Sharp caltrops are hidden in the floor!';
Corridor.TRAP_DESCRIPTIONS[Corridor.PIT_TRAP] = 'You fall into a pit!';

Corridor.prototype = {
	init: function(level, features){
		this.level = level;
		this.description = features.description;
		this.trap = features.trap;
		this.obstacle = features.obstacle;
	},
	triggerTrap: function(trap){
		this.level.controller.ui.showMessage(Corridor.TRAP_DESCRIPTIONS[trap.description ? trap.description : trap.type]);
		var party = this.level.controller.party;
		if (trap.multiTarget){
			// Hit all players in the Party
			for (var i = 0; i < party.players.length; i++){
				this.applyTrapEffect(trap, party.players[i]);
			}
		} else {
			// Pick a single target
			this.applyTrapEffect(trap, Utils.randomElementOf(party.players));
		}
	}, 
	applyTrapEffect: function(trap, player){
		// Injuries or direct effects based on type
		switch (trap.type){
			case Corridor.ARROWS_TRAP:
				player.sustainInjury((Utils.chance(50) ? Player.LEFT : Player.RIGHT)+'-'+(Utils.chance(50) ? Player.ARM : Player.LEG));
				break;
			case Corridor.FLOOR_TRAP:
				if (Utils.chance(50)){
					player.sustainInjury((Utils.chance(50) ? Player.LEFT : Player.RIGHT)+'-'+Player.LEG);
				} else {
					player.sustainInjury(Player.RIGHT_LEG);
					player.sustainInjury(Player.LEFT_LEG);
				}
				break;
			break;
			case Corridor.FALLING_TRAP:
				switch (Utils.rand(0,2)){
					case 0:
						player.sustainInjury(PLAYER.RIGHT_ARM);
						break;
					case 1:
						player.sustainInjury(Player.LEFT_ARM);
						break;
					case 2:
						player.applyAilment(Player.UNCONSCIOUS);
						break;
				}
			break;
			case Corridor.BOMB_TRAP:
				var hits = Utils.rand(1,3);
				for (var i = 0; i < hits; i++){
					if (Utils.chance(20)){
						player.applyAilment(Player.UNCONSCIOUS);
					} else {
						player.sustainInjury((Utils.chance(50) ? Player.LEFT : Player.RIGHT)+'-'+(Utils.chance(50) ? Player.ARM : Player.LEG));
					}
				}
			break;
		}
		if (trap.effect){
			player.applyAilment(trap.effect);
		}
	}
}

module.exports = Corridor;
},{"./Player.class":7,"./Utils":11}],2:[function(require,module,exports){
var Corridor = require('./Corridor.class');
var Player = require('./Player.class');
var Utils = require('./Utils');

var CorridorGenerator = {
	generateCorridor: function(level){
		var trap = null;
		if (Utils.chance(20)){
			switch (Utils.rand(0,4)){
				case 0:
					var effect = false;
					switch (Utils.rand(0,2)){
						case 0: effect = Player.POISONED; break;						
						case 1: effect = Player.PARALYZED; break;
					}
					trap = {
						type: Corridor.ARROWS_TRAP,
						effect: effect,
						multiTarget: Utils.chance(20)
					};
					break;
				case 1:
					var description = Utils.randomElementOf([Corridor.SPIKES_TRAP, Corridor.CLAMPING_TRAP, Corridor.CALTROPS_TRAP, Corridor.PIT_TRAP]);
					effect = false;
					if (description === Corridor.CLAMPING_TRAP){
						effect = Player.CLAMPED;
					}
					trap = {
						type: Corridor.FLOOR_TRAP,
						description: description,
						effect: effect,
						multiTarget: description !== Corridor.CLAMPING_TRAP
					};
					break;
				case 2:
					trap = {
						type: Corridor.FALLING_TRAP,
						multiTarget: true
					};
					break;
				case 3:
					trap = {
						type: Corridor.BOMB_TRAP,
						multiTarget: true
					};
					break;
				case 4:
					var effect = Utils.randomElementOf([Player.BLIND, Player.PARALYZED, Player.ASLEEP, Player.POISONED, Player.MUTE]);
					trap = {
						type: Corridor.POWDER_TRAP,
						effect: effect,
						multiTarget: true
					};
					break;
			}
		}
		return new Corridor(level, {	
			description: "A plain corridor",
			trap: trap,
			obstacle: null
		});
	}
};

module.exports = CorridorGenerator;
},{"./Corridor.class":1,"./Player.class":7,"./Utils":11}],3:[function(require,module,exports){
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
},{}],4:[function(require,module,exports){
var Level = require('./Level.class');
var RoomGenerator = require('./RoomGenerator');
var CorridorGenerator = require('./CorridorGenerator');
var Utils = require('./Utils');

var DungeonGenerator = {
	potentialCorridors: null,
	level: null,
	generateLevel: function(specs, controller){
		console.log('generateLevel', specs);
		this.potentialCorridors = [];
		var w = specs.w;
		var h = specs.h;
		var depth = specs.depth;
		this.level = new Level(w, h, depth, controller);
		switch (specs.roomDensity){
			case 'hi':
				specs.roomDensity = 0.8;
				break;
			case 'mid':
				specs.roomDensity = 0.6;
				break;
			case 'low':
				specs.roomDensity = 0.4;
				break;
		}
		var remainingRooms = Math.floor(w * h * specs.roomDensity) - 1;
		// Put starting room
		var startingRoom = RoomGenerator.generateRoom(this.level, {addStairsUp: depth > 1, isEntrance: true});
		
		this.placeRoom(null, specs.startingLocation.x, specs.startingLocation.y, startingRoom);
		while (remainingRooms > 0){
			var potentialCorridor = Utils.pullRandomElementOf(this.potentialCorridors);
			var existingRoom = this.level.getRoomAt(potentialCorridor.toX, potentialCorridor.toY);
			if (existingRoom){
				continue;
			}
			remainingRooms--;
			var newRoom = RoomGenerator.generateRoom(this.level, {addStairsDown: remainingRooms == 0, isExit: remainingRooms == 0});
			var corridor = CorridorGenerator.generateCorridor(this.level);
			this.placeRoom(potentialCorridor.room, potentialCorridor.toX, potentialCorridor.toY, newRoom, corridor);
		}
		return this.level;
	},
	placeRoom: function(fromRoom, x, y, toRoom, corridor){
		var vector = false;
		this.level.placeRoom(fromRoom, x, y, toRoom, corridor);
		if (fromRoom){
			vector = {
				x: fromRoom.x - x,
				y: fromRoom.y - y
			}
		}

		this._checkAndPlacePotentialCorridors(vector, x, y, 0, -1, toRoom);
		this._checkAndPlacePotentialCorridors(vector, x, y, 0, 1, toRoom);
		this._checkAndPlacePotentialCorridors(vector, x, y, 1, 0, toRoom);
		this._checkAndPlacePotentialCorridors(vector, x, y, -1, 0, toRoom);

	}, 
	_checkAndPlacePotentialCorridors: function(vector, x, y, dx, dy, room){
		if (!vector || vector.x != dx || vector.y != dy){
			if (this.level.isValidRoomLocation(x + dx, y + dy) && !this.level.getRoomAt(x + dx, y + dy)){
				this.potentialCorridors.push(
					{
						toX: x + dx,
						toY: y + dy,
						room: room
					}
				);
			}
		}
	}
};

module.exports = DungeonGenerator;

},{"./CorridorGenerator":2,"./Level.class":5,"./RoomGenerator":9,"./Utils":11}],5:[function(require,module,exports){
var Utils = require('./Utils');

function Level(w, h, depth, controller){
	this.controller = controller;
	this.map = null;
	this.rooms = null;
	this.init(w, h, depth);
}

Level.prototype = {
	init: function(w, h, depth){
		this.depth = depth;
		this.map = [];
		this.rooms = [];
		for (var x = 0; x < w; x++){
			this.map[x] = [];
			for (var y = 0; y < h; y++){
				this.map[x][y] = null;
			}
		}
	},
	placeRoom: function(fromRoom, x, y, room, corridor){
		room.locate(x,y);
		this.map[x][y] = room;
		this.rooms.push(room);
		if (fromRoom){
			fromRoom.corridors[Utils.getDirection(fromRoom, room)] = corridor;
			room.corridors[Utils.getDirection(room, fromRoom)] = corridor;
		}
	},
	getRoom: function(location){
		return this.map[location.x][location.y];
	},
	getRoomAt: function(x, y){
		return this.map[x][y];
	},
	isValidRoomLocation: function(x, y){
		return x >= 0 && y >= 0 && x < this.map.length && y < this.map[0].length;
	}
}

module.exports = Level;
},{"./Utils":11}],6:[function(require,module,exports){
var Utils = require('./Utils');
var Player = require('./Player.class');

function Party(specs, controller){
	this.controller = controller;
	this.players = [];
	for (var i = 0; i < specs.players.length; i++){
		this.players.push(new Player(specs.players[i], this));
	}
	this.location = {
		x: null,
		y: null
	};
	this.level = null;
}

Party.prototype = {
	locate: function(x, y){
		this.location.x = x;
		this.location.y = y;
	},
	setLevel: function(level){
		this.level = level;
	},
	getCurrentRoom: function(){
		return this.level.getRoom(this.location);
	},
	move: function(dx, dy){
		var direction = Utils.getDirection(this.location, {x: this.location.x+dx, y: this.location.y+dy})
		var corridor = this.getCurrentRoom().corridors[direction];
		if (corridor && !corridor.obstacle){
			this.location.x += dx;
			this.location.y += dy;
			if (corridor.trap){
				corridor.triggerTrap(corridor.trap);
			}
		}
	}
}

module.exports = Party;
},{"./Player.class":7,"./Utils":11}],7:[function(require,module,exports){
var Utils = require('./Utils');

function Player(specs, party){
	this.party = party;
	this.injuredMap = {}
	this.injuredMap[Player.LEFT_ARM] = false;
	this.injuredMap[Player.RIGHT_ARM] = false;
	this.injuredMap[Player.LEFT_LEG] = false;
	this.injuredMap[Player.RIGHT_LEG] = false;
	this.statusAilments = [];
	this.name = specs.name;
	this.role = specs.role;
	this.job = specs.job;
};

Player.LEFT = 'left';
Player.RIGHT = 'right';
Player.ARM = 'arm';
Player.LEG = 'leg';
Player.LEFT_LEG = 'left-leg';
Player.RIGHT_LEG = 'right-leg';
Player.LEFT_ARM = 'left-arm';
Player.RIGHT_ARM = 'right-arm';
Player.UNCONSCIOUS= 'unconscious';
Player.BLIND = 'blind';
Player.PARALYZED = 'paralyzed';
Player.ASLEEP = 'asleep';
Player.POISONED = 'poisoned';
Player.MUTE = 'mute';
Player.CLAMPED = 'clamped';

Player.BODY_PART_NAMES = {};
Player.BODY_PART_NAMES[Player.LEFT_ARM] = 'Left Arm';
Player.BODY_PART_NAMES[Player.RIGHT_ARM] = 'Right Arm';
Player.BODY_PART_NAMES[Player.LEFT_LEG] = 'Left Leg';
Player.BODY_PART_NAMES[Player.RIGHT_LEG] = 'Right Leg';

Player.AILMENT_EFFECTS = {};
Player.AILMENT_EFFECTS[Player.UNCONSCIOUS] = 'falls unconscious';
Player.AILMENT_EFFECTS[Player.BLIND] = 'cannot see';
Player.AILMENT_EFFECTS[Player.PARALYZED] = 'is paralyzed';
Player.AILMENT_EFFECTS[Player.ASLEEP] = 'falls asleep';
Player.AILMENT_EFFECTS[Player.POISONED] = 'is poisoned';
Player.AILMENT_EFFECTS[Player.MUTE] = 'cannot speak';
Player.AILMENT_EFFECTS[Player.CLAMPED] = 'is immobilized in the spot';

Player.prototype = {
	sustainInjury: function(bodyPart, turns){
		if (!turns){
			turns = Utils.rand(3, 6); 
		}
		this.injuredMap[bodyPart] = {turns: turns};
		this.party.controller.ui.showMessage(this.name +'\'s '+Player.BODY_PART_NAMES[bodyPart]+' is injured!');
	},
	applyAilment: function(ailment, turns){
		if (!turns){
			turns = Utils.rand(3, 6); 
		}
		this.statusAilments.push([{
			ailment: ailment,
			turns: turns
		}]);
		this.party.controller.ui.showMessage(this.name +' '+ Player.AILMENT_EFFECTS[ailment]);
	},
	turnHeal: function(){
		for (bodyPart in this.injuredMap){
			if (this.injuredMap[bodyPart] && --this.injuredMap[bodyPart].turns <= 0){
				this.injuredMap[bodyPart] = false;
			}
		}
		for (var i = 0; i < statusAilments.length; i++){
			if (--this.statusAilments[i].turns <= 0){
				this.statusAilments.splice(i,1);
				i--;
			}
		}
	}
}

module.exports = Player;
},{"./Utils":11}],8:[function(require,module,exports){
function Room(level, features){
	this.level = null;
	this.enemies = null;
	this.items = null;
	this.features = null;
	this.description = null;
	this.x = null;
	this.y = null;
	this.corridors = {
		north: null,
		south: null,
		west: null,
		east: null
	}
	this.init(level, features);
}

Room.prototype = {
	init: function(level, features){
		this.level = level;
		this.description = features.description;
		this.enemies = features.enemies;
		this.items = features.items;
		this.features = features.features;
	},
	locate: function(x, y){
		this.x = x;
		this.y = y;
	}
}

module.exports = Room;
},{}],9:[function(require,module,exports){
var Room = require('./Room.class');
var Utils = require('./Utils');

var RoomGenerator = {
	generateRoom: function(level, specs){
		var features = [];
		if (specs && specs.addStairsUp){
			features.push({type:'upstairs', description: 'Stairway going up'});
		}
		if (specs && specs.addStairsDown){
			features.push({type:'downstairs', description: 'Stairway going down'});
		}
		var enemies = [];
		if (Utils.chance(30)){
			enemies = this._getEnemyParty(level);
		}
		var room = new Room(level, {	
			description: "A plain room.",
			items: [],
			enemies: enemies,
			features: features
		});	
		if (specs && specs.isEntrance)
			room.isEntrance = true;
		if (specs && specs.isExit)
			room.isExit = true;
		return room;
	},
	_getEnemyParty: function(level){
		return [{
			raceName: 'Orc'
		}];
	}
};

module.exports = RoomGenerator;
},{"./Room.class":8,"./Utils":11}],10:[function(require,module,exports){
var DOM = require('./DOM');

function UI(controller){
	this.controller = controller;
	this._bindEvents(controller);
	this.createNewPlayerRow();
	this.mapCanvas = null;
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
		DOM.byId('newGame').style.display = 'none';
		DOM.byId('movementButtons').style.display = 'block';
	},
	getNewGameConfig: function(){
		var dungeonW = parseInt(DOM.val('txtDungeonW'));
		var dungeonH = parseInt(DOM.val('txtDungeonH'));
		var roomDensity = DOM.val('cmbRoomDensity');

		var players = [];
		var names = DOM.selectAll('.playerNameText');
		var teams = DOM.selectAll('.playerTeamCombo');
		var roles = DOM.selectAll('.playerRoleCombo');
		var classes = DOM.selectAll('.playerClassCombo');
		for (var i = 0; i < names.length; i++){
			players.push({
				name: names[i].value,
				team: teams[i].value,
				role: roles[i].value,
				job: classes[i].value
			});
		}

		return {
			dungeonSize: {
				w: dungeonW,
				h: dungeonH
			},
			roomDensity: roomDensity,
			players: players
		}
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
		var tr = DOM.create('tr');
		var td = DOM.create('td');
		var component = DOM.create('input');
		component.type = 'text';
		component.className = 'playerNameText';
		td.appendChild(component);
		tr.appendChild(td);

		td = DOM.create('td');
		component = DOM.create('select');
		component.className = 'playerTeamCombo';
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
		component.className = 'playerRoleCombo';
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
		component.className = 'playerClassCombo';
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
	},
	showMessage: function(message){
		var component = DOM.create('p');
		component.innerHTML = message;
		DOM.byId('messageArea').appendChild(component);
	},
	clearMessages: function(){
		DOM.byId('messageArea').innerHTML = '';
	}
};

module.exports = UI;
},{"./DOM":3}],11:[function(require,module,exports){
var Utils = {
	rand: function(low, hi){
		return Math.floor(Math.random() * (hi - low + 1))+low;
	},
	randomElementOf: function(array){
    	return array[Math.floor(Math.random()*array.length)];
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
	}
};

module.exports = Utils;
},{}],12:[function(require,module,exports){
var UI = require('./UI.class')
var DungeonGenerator = require('./DungeonGenerator')
var Party = require('./Party.class')

var VirtualDungeon = {
	levels: {},
	init: function(){
		console.log("Initializing VirtualDungeon");
		this.ui = new UI(this);
	},
	startGame: function(){
		var config = this.ui.getNewGameConfig();
		console.log("New Game, config", config);
		this.config = config;
		this.party = new Party({
			players: config.players
		}, this);
		this.party.locate(Math.floor(config.dungeonSize.w / 2), Math.floor(config.dungeonSize.h / 2));
		var level = DungeonGenerator.generateLevel({
			w: config.dungeonSize.w,
			h: config.dungeonSize.h,
			depth: 1,
			startingLocation: this.party.location,
			roomDensity: config.roomDensity
		}, this);
		this.levels[1] = level;
		this.party.setLevel(level);
		console.log("Level", level);
		console.log("Party", this.party);
		this.ui.updateRoomData(this.party.getCurrentRoom());
		this.ui.initMap();
		this.ui.hideNewGamePanel();

	},
	move: function(dx, dy){
		this.ui.clearMessages();
		this.party.move(dx, dy);
		this.ui.updateRoomData(this.party.getCurrentRoom());
	},
	upstairs: function(){
		this._gotoDepth(this.party.level.depth - 1);
	},
	downstairs: function(){
		this._gotoDepth(this.party.level.depth + 1);
	},
	_gotoDepth: function(depth){
		var level = this.levels[depth];
		if (!level){
			var config = this.config;
			level = DungeonGenerator.generateLevel({
				w: config.dungeonSize.w,
				h: config.dungeonSize.h,
				depth: depth,
				startingLocation: this.party.location,
				roomDensity: config.roomDensity
			}, this);
			this.levels[depth] = level;
			console.log("this.levels", this.levels);
		}
		this.party.setLevel(level)
		this.ui.updateRoomData(this.party.getCurrentRoom());
	}
};

window.VirtualDungeon = VirtualDungeon;

module.exports = VirtualDungeon;
},{"./DungeonGenerator":4,"./Party.class":6,"./UI.class":10}]},{},[12])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Vzci9sb2NhbC9saWIvbm9kZV9tb2R1bGVzL3dhdGNoaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJDb3JyaWRvci5jbGFzcy5qcyIsIkNvcnJpZG9yR2VuZXJhdG9yLmpzIiwiRE9NLmpzIiwiRHVuZ2VvbkdlbmVyYXRvci5qcyIsIkxldmVsLmNsYXNzLmpzIiwiUGFydHkuY2xhc3MuanMiLCJQbGF5ZXIuY2xhc3MuanMiLCJSb29tLmNsYXNzLmpzIiwiUm9vbUdlbmVyYXRvci5qcyIsIlVJLmNsYXNzLmpzIiwiVXRpbHMuanMiLCJWaXJ0dWFsRHVuZ2Vvbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0VBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIFBsYXllciA9IHJlcXVpcmUoJy4vUGxheWVyLmNsYXNzJyk7XG52YXIgVXRpbHMgPSByZXF1aXJlKCcuL1V0aWxzJyk7XG5cbmZ1bmN0aW9uIENvcnJpZG9yKGxldmVsLCBmZWF0dXJlcyl7XG5cdHRoaXMubGV2ZWwgPSBudWxsO1xuXHR0aGlzLmRlc2NyaXB0aW9uID0gbnVsbDtcblx0dGhpcy50cmFwID0gbnVsbDtcblx0dGhpcy5vYnN0YWNsZSA9IG51bGw7XG5cdHRoaXMuaW5pdChsZXZlbCwgZmVhdHVyZXMpO1xufVxuXG5Db3JyaWRvci5BUlJPV1NfVFJBUCA9ICdhcnJvd3MtdHJhcCc7XG5Db3JyaWRvci5GTE9PUl9UUkFQID0gJ2Zsb29yLXRyYXAnO1xuQ29ycmlkb3IuRkFMTElOR19UUkFQID0gJ2ZhbGxpbmctdHJhcCc7XG5Db3JyaWRvci5CT01CX1RSQVAgPSAnYm9tYi10cmFwJztcbkNvcnJpZG9yLlBPV0RFUl9UUkFQID0gJ3Bvd2Rlci10cmFwJztcblxuQ29ycmlkb3IuU1BJS0VTX1RSQVAgPSAnc3Bpa2VzLXRyYXAnO1xuQ29ycmlkb3IuQ0xBTVBJTkdfVFJBUCA9ICdjbGFtcGluZy10cmFwJztcbkNvcnJpZG9yLkNBTFRST1BTX1RSQVAgPSAnY2FsdHJvcHMtdHJhcCc7XG5Db3JyaWRvci5QSVRfVFJBUCA9ICdwaXQtdHJhcCc7XG5cbkNvcnJpZG9yLlRSQVBfREVTQ1JJUFRJT05TID0ge307XG5cbkNvcnJpZG9yLlRSQVBfREVTQ1JJUFRJT05TW0NvcnJpZG9yLkFSUk9XU19UUkFQXSA9ICdBcnJvd3MgZmx5IGZyb20gZXZlcnl3aGVyZSEnO1xuQ29ycmlkb3IuVFJBUF9ERVNDUklQVElPTlNbQ29ycmlkb3IuRkFMTElOR19UUkFQXSA9ICdBIGJ1bmNoIG9mIHJvY2tzIGZhaWwgZnJvbSB0aGUgY2VpbGluZyEnO1xuQ29ycmlkb3IuVFJBUF9ERVNDUklQVElPTlNbQ29ycmlkb3IuQk9NQl9UUkFQXSA9ICdCT09NISBBIGJvbWIgaXMgc2V0IG9mZiEnO1xuQ29ycmlkb3IuVFJBUF9ERVNDUklQVElPTlNbQ29ycmlkb3IuUE9XREVSX1RSQVBdID0gJ0EgY2xvdWQgb2Ygc21va2UgY292ZXJzIHRoZSBwYXJ0eSEnO1xuQ29ycmlkb3IuVFJBUF9ERVNDUklQVElPTlNbQ29ycmlkb3IuU1BJS0VTX1RSQVBdID0gJ1lvdSBmYWxsIGludG8gYSBwaXQgb2Ygc2hhcnAgc3Bpa2VzJztcbkNvcnJpZG9yLlRSQVBfREVTQ1JJUFRJT05TW0NvcnJpZG9yLkNMQU1QSU5HX1RSQVBdID0gJ1lvdSBzdGVwIG9uIGEgY2xhbXBpbmcgdHJhcCc7XG5Db3JyaWRvci5UUkFQX0RFU0NSSVBUSU9OU1tDb3JyaWRvci5DQUxUUk9QU19UUkFQXSA9ICdTaGFycCBjYWx0cm9wcyBhcmUgaGlkZGVuIGluIHRoZSBmbG9vciEnO1xuQ29ycmlkb3IuVFJBUF9ERVNDUklQVElPTlNbQ29ycmlkb3IuUElUX1RSQVBdID0gJ1lvdSBmYWxsIGludG8gYSBwaXQhJztcblxuQ29ycmlkb3IucHJvdG90eXBlID0ge1xuXHRpbml0OiBmdW5jdGlvbihsZXZlbCwgZmVhdHVyZXMpe1xuXHRcdHRoaXMubGV2ZWwgPSBsZXZlbDtcblx0XHR0aGlzLmRlc2NyaXB0aW9uID0gZmVhdHVyZXMuZGVzY3JpcHRpb247XG5cdFx0dGhpcy50cmFwID0gZmVhdHVyZXMudHJhcDtcblx0XHR0aGlzLm9ic3RhY2xlID0gZmVhdHVyZXMub2JzdGFjbGU7XG5cdH0sXG5cdHRyaWdnZXJUcmFwOiBmdW5jdGlvbih0cmFwKXtcblx0XHR0aGlzLmxldmVsLmNvbnRyb2xsZXIudWkuc2hvd01lc3NhZ2UoQ29ycmlkb3IuVFJBUF9ERVNDUklQVElPTlNbdHJhcC5kZXNjcmlwdGlvbiA/IHRyYXAuZGVzY3JpcHRpb24gOiB0cmFwLnR5cGVdKTtcblx0XHR2YXIgcGFydHkgPSB0aGlzLmxldmVsLmNvbnRyb2xsZXIucGFydHk7XG5cdFx0aWYgKHRyYXAubXVsdGlUYXJnZXQpe1xuXHRcdFx0Ly8gSGl0IGFsbCBwbGF5ZXJzIGluIHRoZSBQYXJ0eVxuXHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBwYXJ0eS5wbGF5ZXJzLmxlbmd0aDsgaSsrKXtcblx0XHRcdFx0dGhpcy5hcHBseVRyYXBFZmZlY3QodHJhcCwgcGFydHkucGxheWVyc1tpXSk7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIHtcblx0XHRcdC8vIFBpY2sgYSBzaW5nbGUgdGFyZ2V0XG5cdFx0XHR0aGlzLmFwcGx5VHJhcEVmZmVjdCh0cmFwLCBVdGlscy5yYW5kb21FbGVtZW50T2YocGFydHkucGxheWVycykpO1xuXHRcdH1cblx0fSwgXG5cdGFwcGx5VHJhcEVmZmVjdDogZnVuY3Rpb24odHJhcCwgcGxheWVyKXtcblx0XHQvLyBJbmp1cmllcyBvciBkaXJlY3QgZWZmZWN0cyBiYXNlZCBvbiB0eXBlXG5cdFx0c3dpdGNoICh0cmFwLnR5cGUpe1xuXHRcdFx0Y2FzZSBDb3JyaWRvci5BUlJPV1NfVFJBUDpcblx0XHRcdFx0cGxheWVyLnN1c3RhaW5Jbmp1cnkoKFV0aWxzLmNoYW5jZSg1MCkgPyBQbGF5ZXIuTEVGVCA6IFBsYXllci5SSUdIVCkrJy0nKyhVdGlscy5jaGFuY2UoNTApID8gUGxheWVyLkFSTSA6IFBsYXllci5MRUcpKTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIENvcnJpZG9yLkZMT09SX1RSQVA6XG5cdFx0XHRcdGlmIChVdGlscy5jaGFuY2UoNTApKXtcblx0XHRcdFx0XHRwbGF5ZXIuc3VzdGFpbkluanVyeSgoVXRpbHMuY2hhbmNlKDUwKSA/IFBsYXllci5MRUZUIDogUGxheWVyLlJJR0hUKSsnLScrUGxheWVyLkxFRyk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0cGxheWVyLnN1c3RhaW5Jbmp1cnkoUGxheWVyLlJJR0hUX0xFRyk7XG5cdFx0XHRcdFx0cGxheWVyLnN1c3RhaW5Jbmp1cnkoUGxheWVyLkxFRlRfTEVHKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRicmVhaztcblx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSBDb3JyaWRvci5GQUxMSU5HX1RSQVA6XG5cdFx0XHRcdHN3aXRjaCAoVXRpbHMucmFuZCgwLDIpKXtcblx0XHRcdFx0XHRjYXNlIDA6XG5cdFx0XHRcdFx0XHRwbGF5ZXIuc3VzdGFpbkluanVyeShQTEFZRVIuUklHSFRfQVJNKTtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdGNhc2UgMTpcblx0XHRcdFx0XHRcdHBsYXllci5zdXN0YWluSW5qdXJ5KFBsYXllci5MRUZUX0FSTSk7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRjYXNlIDI6XG5cdFx0XHRcdFx0XHRwbGF5ZXIuYXBwbHlBaWxtZW50KFBsYXllci5VTkNPTlNDSU9VUyk7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0fVxuXHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIENvcnJpZG9yLkJPTUJfVFJBUDpcblx0XHRcdFx0dmFyIGhpdHMgPSBVdGlscy5yYW5kKDEsMyk7XG5cdFx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgaGl0czsgaSsrKXtcblx0XHRcdFx0XHRpZiAoVXRpbHMuY2hhbmNlKDIwKSl7XG5cdFx0XHRcdFx0XHRwbGF5ZXIuYXBwbHlBaWxtZW50KFBsYXllci5VTkNPTlNDSU9VUyk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdHBsYXllci5zdXN0YWluSW5qdXJ5KChVdGlscy5jaGFuY2UoNTApID8gUGxheWVyLkxFRlQgOiBQbGF5ZXIuUklHSFQpKyctJysoVXRpbHMuY2hhbmNlKDUwKSA/IFBsYXllci5BUk0gOiBQbGF5ZXIuTEVHKSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRicmVhaztcblx0XHR9XG5cdFx0aWYgKHRyYXAuZWZmZWN0KXtcblx0XHRcdHBsYXllci5hcHBseUFpbG1lbnQodHJhcC5lZmZlY3QpO1xuXHRcdH1cblx0fVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IENvcnJpZG9yOyIsInZhciBDb3JyaWRvciA9IHJlcXVpcmUoJy4vQ29ycmlkb3IuY2xhc3MnKTtcbnZhciBQbGF5ZXIgPSByZXF1aXJlKCcuL1BsYXllci5jbGFzcycpO1xudmFyIFV0aWxzID0gcmVxdWlyZSgnLi9VdGlscycpO1xuXG52YXIgQ29ycmlkb3JHZW5lcmF0b3IgPSB7XG5cdGdlbmVyYXRlQ29ycmlkb3I6IGZ1bmN0aW9uKGxldmVsKXtcblx0XHR2YXIgdHJhcCA9IG51bGw7XG5cdFx0aWYgKFV0aWxzLmNoYW5jZSgyMCkpe1xuXHRcdFx0c3dpdGNoIChVdGlscy5yYW5kKDAsNCkpe1xuXHRcdFx0XHRjYXNlIDA6XG5cdFx0XHRcdFx0dmFyIGVmZmVjdCA9IGZhbHNlO1xuXHRcdFx0XHRcdHN3aXRjaCAoVXRpbHMucmFuZCgwLDIpKXtcblx0XHRcdFx0XHRcdGNhc2UgMDogZWZmZWN0ID0gUGxheWVyLlBPSVNPTkVEOyBicmVhaztcdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRcdGNhc2UgMTogZWZmZWN0ID0gUGxheWVyLlBBUkFMWVpFRDsgYnJlYWs7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHRyYXAgPSB7XG5cdFx0XHRcdFx0XHR0eXBlOiBDb3JyaWRvci5BUlJPV1NfVFJBUCxcblx0XHRcdFx0XHRcdGVmZmVjdDogZWZmZWN0LFxuXHRcdFx0XHRcdFx0bXVsdGlUYXJnZXQ6IFV0aWxzLmNoYW5jZSgyMClcblx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIDE6XG5cdFx0XHRcdFx0dmFyIGRlc2NyaXB0aW9uID0gVXRpbHMucmFuZG9tRWxlbWVudE9mKFtDb3JyaWRvci5TUElLRVNfVFJBUCwgQ29ycmlkb3IuQ0xBTVBJTkdfVFJBUCwgQ29ycmlkb3IuQ0FMVFJPUFNfVFJBUCwgQ29ycmlkb3IuUElUX1RSQVBdKTtcblx0XHRcdFx0XHRlZmZlY3QgPSBmYWxzZTtcblx0XHRcdFx0XHRpZiAoZGVzY3JpcHRpb24gPT09IENvcnJpZG9yLkNMQU1QSU5HX1RSQVApe1xuXHRcdFx0XHRcdFx0ZWZmZWN0ID0gUGxheWVyLkNMQU1QRUQ7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHRyYXAgPSB7XG5cdFx0XHRcdFx0XHR0eXBlOiBDb3JyaWRvci5GTE9PUl9UUkFQLFxuXHRcdFx0XHRcdFx0ZGVzY3JpcHRpb246IGRlc2NyaXB0aW9uLFxuXHRcdFx0XHRcdFx0ZWZmZWN0OiBlZmZlY3QsXG5cdFx0XHRcdFx0XHRtdWx0aVRhcmdldDogZGVzY3JpcHRpb24gIT09IENvcnJpZG9yLkNMQU1QSU5HX1RSQVBcblx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIDI6XG5cdFx0XHRcdFx0dHJhcCA9IHtcblx0XHRcdFx0XHRcdHR5cGU6IENvcnJpZG9yLkZBTExJTkdfVFJBUCxcblx0XHRcdFx0XHRcdG11bHRpVGFyZ2V0OiB0cnVlXG5cdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSAzOlxuXHRcdFx0XHRcdHRyYXAgPSB7XG5cdFx0XHRcdFx0XHR0eXBlOiBDb3JyaWRvci5CT01CX1RSQVAsXG5cdFx0XHRcdFx0XHRtdWx0aVRhcmdldDogdHJ1ZVxuXHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgNDpcblx0XHRcdFx0XHR2YXIgZWZmZWN0ID0gVXRpbHMucmFuZG9tRWxlbWVudE9mKFtQbGF5ZXIuQkxJTkQsIFBsYXllci5QQVJBTFlaRUQsIFBsYXllci5BU0xFRVAsIFBsYXllci5QT0lTT05FRCwgUGxheWVyLk1VVEVdKTtcblx0XHRcdFx0XHR0cmFwID0ge1xuXHRcdFx0XHRcdFx0dHlwZTogQ29ycmlkb3IuUE9XREVSX1RSQVAsXG5cdFx0XHRcdFx0XHRlZmZlY3Q6IGVmZmVjdCxcblx0XHRcdFx0XHRcdG11bHRpVGFyZ2V0OiB0cnVlXG5cdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIG5ldyBDb3JyaWRvcihsZXZlbCwge1x0XG5cdFx0XHRkZXNjcmlwdGlvbjogXCJBIHBsYWluIGNvcnJpZG9yXCIsXG5cdFx0XHR0cmFwOiB0cmFwLFxuXHRcdFx0b2JzdGFjbGU6IG51bGxcblx0XHR9KTtcblx0fVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBDb3JyaWRvckdlbmVyYXRvcjsiLCJ2YXIgRE9NID0ge1xuXHRieUlkOiBmdW5jdGlvbihpZCl7XG5cdFx0cmV0dXJuIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKTtcblx0fSxcblx0Y3JlYXRlOiBmdW5jdGlvbih0eXBlKXtcblx0XHRyZXR1cm4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCh0eXBlKTtcblx0fSxcblx0b25DbGljazogZnVuY3Rpb24oaWQsIGNiLCBjb250ZXh0KXtcblx0XHR0aGlzLmJ5SWQoaWQpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgY2IuYmluZChjb250ZXh0KSk7XG5cdH0sXG5cdHZhbDogZnVuY3Rpb24oaWQpe1xuXHRcdHJldHVybiB0aGlzLmJ5SWQoaWQpLnZhbHVlO1xuXHR9LFxuXHRzZWxlY3RBbGw6IGZ1bmN0aW9uKHF1ZXJ5KXtcblx0XHRyZXR1cm4gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChxdWVyeSk7XG5cdH1cbn1cbm1vZHVsZS5leHBvcnRzID0gRE9NOyIsInZhciBMZXZlbCA9IHJlcXVpcmUoJy4vTGV2ZWwuY2xhc3MnKTtcbnZhciBSb29tR2VuZXJhdG9yID0gcmVxdWlyZSgnLi9Sb29tR2VuZXJhdG9yJyk7XG52YXIgQ29ycmlkb3JHZW5lcmF0b3IgPSByZXF1aXJlKCcuL0NvcnJpZG9yR2VuZXJhdG9yJyk7XG52YXIgVXRpbHMgPSByZXF1aXJlKCcuL1V0aWxzJyk7XG5cbnZhciBEdW5nZW9uR2VuZXJhdG9yID0ge1xuXHRwb3RlbnRpYWxDb3JyaWRvcnM6IG51bGwsXG5cdGxldmVsOiBudWxsLFxuXHRnZW5lcmF0ZUxldmVsOiBmdW5jdGlvbihzcGVjcywgY29udHJvbGxlcil7XG5cdFx0Y29uc29sZS5sb2coJ2dlbmVyYXRlTGV2ZWwnLCBzcGVjcyk7XG5cdFx0dGhpcy5wb3RlbnRpYWxDb3JyaWRvcnMgPSBbXTtcblx0XHR2YXIgdyA9IHNwZWNzLnc7XG5cdFx0dmFyIGggPSBzcGVjcy5oO1xuXHRcdHZhciBkZXB0aCA9IHNwZWNzLmRlcHRoO1xuXHRcdHRoaXMubGV2ZWwgPSBuZXcgTGV2ZWwodywgaCwgZGVwdGgsIGNvbnRyb2xsZXIpO1xuXHRcdHN3aXRjaCAoc3BlY3Mucm9vbURlbnNpdHkpe1xuXHRcdFx0Y2FzZSAnaGknOlxuXHRcdFx0XHRzcGVjcy5yb29tRGVuc2l0eSA9IDAuODtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlICdtaWQnOlxuXHRcdFx0XHRzcGVjcy5yb29tRGVuc2l0eSA9IDAuNjtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlICdsb3cnOlxuXHRcdFx0XHRzcGVjcy5yb29tRGVuc2l0eSA9IDAuNDtcblx0XHRcdFx0YnJlYWs7XG5cdFx0fVxuXHRcdHZhciByZW1haW5pbmdSb29tcyA9IE1hdGguZmxvb3IodyAqIGggKiBzcGVjcy5yb29tRGVuc2l0eSkgLSAxO1xuXHRcdC8vIFB1dCBzdGFydGluZyByb29tXG5cdFx0dmFyIHN0YXJ0aW5nUm9vbSA9IFJvb21HZW5lcmF0b3IuZ2VuZXJhdGVSb29tKHRoaXMubGV2ZWwsIHthZGRTdGFpcnNVcDogZGVwdGggPiAxLCBpc0VudHJhbmNlOiB0cnVlfSk7XG5cdFx0XG5cdFx0dGhpcy5wbGFjZVJvb20obnVsbCwgc3BlY3Muc3RhcnRpbmdMb2NhdGlvbi54LCBzcGVjcy5zdGFydGluZ0xvY2F0aW9uLnksIHN0YXJ0aW5nUm9vbSk7XG5cdFx0d2hpbGUgKHJlbWFpbmluZ1Jvb21zID4gMCl7XG5cdFx0XHR2YXIgcG90ZW50aWFsQ29ycmlkb3IgPSBVdGlscy5wdWxsUmFuZG9tRWxlbWVudE9mKHRoaXMucG90ZW50aWFsQ29ycmlkb3JzKTtcblx0XHRcdHZhciBleGlzdGluZ1Jvb20gPSB0aGlzLmxldmVsLmdldFJvb21BdChwb3RlbnRpYWxDb3JyaWRvci50b1gsIHBvdGVudGlhbENvcnJpZG9yLnRvWSk7XG5cdFx0XHRpZiAoZXhpc3RpbmdSb29tKXtcblx0XHRcdFx0Y29udGludWU7XG5cdFx0XHR9XG5cdFx0XHRyZW1haW5pbmdSb29tcy0tO1xuXHRcdFx0dmFyIG5ld1Jvb20gPSBSb29tR2VuZXJhdG9yLmdlbmVyYXRlUm9vbSh0aGlzLmxldmVsLCB7YWRkU3RhaXJzRG93bjogcmVtYWluaW5nUm9vbXMgPT0gMCwgaXNFeGl0OiByZW1haW5pbmdSb29tcyA9PSAwfSk7XG5cdFx0XHR2YXIgY29ycmlkb3IgPSBDb3JyaWRvckdlbmVyYXRvci5nZW5lcmF0ZUNvcnJpZG9yKHRoaXMubGV2ZWwpO1xuXHRcdFx0dGhpcy5wbGFjZVJvb20ocG90ZW50aWFsQ29ycmlkb3Iucm9vbSwgcG90ZW50aWFsQ29ycmlkb3IudG9YLCBwb3RlbnRpYWxDb3JyaWRvci50b1ksIG5ld1Jvb20sIGNvcnJpZG9yKTtcblx0XHR9XG5cdFx0cmV0dXJuIHRoaXMubGV2ZWw7XG5cdH0sXG5cdHBsYWNlUm9vbTogZnVuY3Rpb24oZnJvbVJvb20sIHgsIHksIHRvUm9vbSwgY29ycmlkb3Ipe1xuXHRcdHZhciB2ZWN0b3IgPSBmYWxzZTtcblx0XHR0aGlzLmxldmVsLnBsYWNlUm9vbShmcm9tUm9vbSwgeCwgeSwgdG9Sb29tLCBjb3JyaWRvcik7XG5cdFx0aWYgKGZyb21Sb29tKXtcblx0XHRcdHZlY3RvciA9IHtcblx0XHRcdFx0eDogZnJvbVJvb20ueCAtIHgsXG5cdFx0XHRcdHk6IGZyb21Sb29tLnkgLSB5XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0dGhpcy5fY2hlY2tBbmRQbGFjZVBvdGVudGlhbENvcnJpZG9ycyh2ZWN0b3IsIHgsIHksIDAsIC0xLCB0b1Jvb20pO1xuXHRcdHRoaXMuX2NoZWNrQW5kUGxhY2VQb3RlbnRpYWxDb3JyaWRvcnModmVjdG9yLCB4LCB5LCAwLCAxLCB0b1Jvb20pO1xuXHRcdHRoaXMuX2NoZWNrQW5kUGxhY2VQb3RlbnRpYWxDb3JyaWRvcnModmVjdG9yLCB4LCB5LCAxLCAwLCB0b1Jvb20pO1xuXHRcdHRoaXMuX2NoZWNrQW5kUGxhY2VQb3RlbnRpYWxDb3JyaWRvcnModmVjdG9yLCB4LCB5LCAtMSwgMCwgdG9Sb29tKTtcblxuXHR9LCBcblx0X2NoZWNrQW5kUGxhY2VQb3RlbnRpYWxDb3JyaWRvcnM6IGZ1bmN0aW9uKHZlY3RvciwgeCwgeSwgZHgsIGR5LCByb29tKXtcblx0XHRpZiAoIXZlY3RvciB8fCB2ZWN0b3IueCAhPSBkeCB8fCB2ZWN0b3IueSAhPSBkeSl7XG5cdFx0XHRpZiAodGhpcy5sZXZlbC5pc1ZhbGlkUm9vbUxvY2F0aW9uKHggKyBkeCwgeSArIGR5KSAmJiAhdGhpcy5sZXZlbC5nZXRSb29tQXQoeCArIGR4LCB5ICsgZHkpKXtcblx0XHRcdFx0dGhpcy5wb3RlbnRpYWxDb3JyaWRvcnMucHVzaChcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHR0b1g6IHggKyBkeCxcblx0XHRcdFx0XHRcdHRvWTogeSArIGR5LFxuXHRcdFx0XHRcdFx0cm9vbTogcm9vbVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0KTtcblx0XHRcdH1cblx0XHR9XG5cdH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gRHVuZ2VvbkdlbmVyYXRvcjtcbiIsInZhciBVdGlscyA9IHJlcXVpcmUoJy4vVXRpbHMnKTtcblxuZnVuY3Rpb24gTGV2ZWwodywgaCwgZGVwdGgsIGNvbnRyb2xsZXIpe1xuXHR0aGlzLmNvbnRyb2xsZXIgPSBjb250cm9sbGVyO1xuXHR0aGlzLm1hcCA9IG51bGw7XG5cdHRoaXMucm9vbXMgPSBudWxsO1xuXHR0aGlzLmluaXQodywgaCwgZGVwdGgpO1xufVxuXG5MZXZlbC5wcm90b3R5cGUgPSB7XG5cdGluaXQ6IGZ1bmN0aW9uKHcsIGgsIGRlcHRoKXtcblx0XHR0aGlzLmRlcHRoID0gZGVwdGg7XG5cdFx0dGhpcy5tYXAgPSBbXTtcblx0XHR0aGlzLnJvb21zID0gW107XG5cdFx0Zm9yICh2YXIgeCA9IDA7IHggPCB3OyB4Kyspe1xuXHRcdFx0dGhpcy5tYXBbeF0gPSBbXTtcblx0XHRcdGZvciAodmFyIHkgPSAwOyB5IDwgaDsgeSsrKXtcblx0XHRcdFx0dGhpcy5tYXBbeF1beV0gPSBudWxsO1xuXHRcdFx0fVxuXHRcdH1cblx0fSxcblx0cGxhY2VSb29tOiBmdW5jdGlvbihmcm9tUm9vbSwgeCwgeSwgcm9vbSwgY29ycmlkb3Ipe1xuXHRcdHJvb20ubG9jYXRlKHgseSk7XG5cdFx0dGhpcy5tYXBbeF1beV0gPSByb29tO1xuXHRcdHRoaXMucm9vbXMucHVzaChyb29tKTtcblx0XHRpZiAoZnJvbVJvb20pe1xuXHRcdFx0ZnJvbVJvb20uY29ycmlkb3JzW1V0aWxzLmdldERpcmVjdGlvbihmcm9tUm9vbSwgcm9vbSldID0gY29ycmlkb3I7XG5cdFx0XHRyb29tLmNvcnJpZG9yc1tVdGlscy5nZXREaXJlY3Rpb24ocm9vbSwgZnJvbVJvb20pXSA9IGNvcnJpZG9yO1xuXHRcdH1cblx0fSxcblx0Z2V0Um9vbTogZnVuY3Rpb24obG9jYXRpb24pe1xuXHRcdHJldHVybiB0aGlzLm1hcFtsb2NhdGlvbi54XVtsb2NhdGlvbi55XTtcblx0fSxcblx0Z2V0Um9vbUF0OiBmdW5jdGlvbih4LCB5KXtcblx0XHRyZXR1cm4gdGhpcy5tYXBbeF1beV07XG5cdH0sXG5cdGlzVmFsaWRSb29tTG9jYXRpb246IGZ1bmN0aW9uKHgsIHkpe1xuXHRcdHJldHVybiB4ID49IDAgJiYgeSA+PSAwICYmIHggPCB0aGlzLm1hcC5sZW5ndGggJiYgeSA8IHRoaXMubWFwWzBdLmxlbmd0aDtcblx0fVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IExldmVsOyIsInZhciBVdGlscyA9IHJlcXVpcmUoJy4vVXRpbHMnKTtcbnZhciBQbGF5ZXIgPSByZXF1aXJlKCcuL1BsYXllci5jbGFzcycpO1xuXG5mdW5jdGlvbiBQYXJ0eShzcGVjcywgY29udHJvbGxlcil7XG5cdHRoaXMuY29udHJvbGxlciA9IGNvbnRyb2xsZXI7XG5cdHRoaXMucGxheWVycyA9IFtdO1xuXHRmb3IgKHZhciBpID0gMDsgaSA8IHNwZWNzLnBsYXllcnMubGVuZ3RoOyBpKyspe1xuXHRcdHRoaXMucGxheWVycy5wdXNoKG5ldyBQbGF5ZXIoc3BlY3MucGxheWVyc1tpXSwgdGhpcykpO1xuXHR9XG5cdHRoaXMubG9jYXRpb24gPSB7XG5cdFx0eDogbnVsbCxcblx0XHR5OiBudWxsXG5cdH07XG5cdHRoaXMubGV2ZWwgPSBudWxsO1xufVxuXG5QYXJ0eS5wcm90b3R5cGUgPSB7XG5cdGxvY2F0ZTogZnVuY3Rpb24oeCwgeSl7XG5cdFx0dGhpcy5sb2NhdGlvbi54ID0geDtcblx0XHR0aGlzLmxvY2F0aW9uLnkgPSB5O1xuXHR9LFxuXHRzZXRMZXZlbDogZnVuY3Rpb24obGV2ZWwpe1xuXHRcdHRoaXMubGV2ZWwgPSBsZXZlbDtcblx0fSxcblx0Z2V0Q3VycmVudFJvb206IGZ1bmN0aW9uKCl7XG5cdFx0cmV0dXJuIHRoaXMubGV2ZWwuZ2V0Um9vbSh0aGlzLmxvY2F0aW9uKTtcblx0fSxcblx0bW92ZTogZnVuY3Rpb24oZHgsIGR5KXtcblx0XHR2YXIgZGlyZWN0aW9uID0gVXRpbHMuZ2V0RGlyZWN0aW9uKHRoaXMubG9jYXRpb24sIHt4OiB0aGlzLmxvY2F0aW9uLngrZHgsIHk6IHRoaXMubG9jYXRpb24ueStkeX0pXG5cdFx0dmFyIGNvcnJpZG9yID0gdGhpcy5nZXRDdXJyZW50Um9vbSgpLmNvcnJpZG9yc1tkaXJlY3Rpb25dO1xuXHRcdGlmIChjb3JyaWRvciAmJiAhY29ycmlkb3Iub2JzdGFjbGUpe1xuXHRcdFx0dGhpcy5sb2NhdGlvbi54ICs9IGR4O1xuXHRcdFx0dGhpcy5sb2NhdGlvbi55ICs9IGR5O1xuXHRcdFx0aWYgKGNvcnJpZG9yLnRyYXApe1xuXHRcdFx0XHRjb3JyaWRvci50cmlnZ2VyVHJhcChjb3JyaWRvci50cmFwKTtcblx0XHRcdH1cblx0XHR9XG5cdH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBQYXJ0eTsiLCJ2YXIgVXRpbHMgPSByZXF1aXJlKCcuL1V0aWxzJyk7XG5cbmZ1bmN0aW9uIFBsYXllcihzcGVjcywgcGFydHkpe1xuXHR0aGlzLnBhcnR5ID0gcGFydHk7XG5cdHRoaXMuaW5qdXJlZE1hcCA9IHt9XG5cdHRoaXMuaW5qdXJlZE1hcFtQbGF5ZXIuTEVGVF9BUk1dID0gZmFsc2U7XG5cdHRoaXMuaW5qdXJlZE1hcFtQbGF5ZXIuUklHSFRfQVJNXSA9IGZhbHNlO1xuXHR0aGlzLmluanVyZWRNYXBbUGxheWVyLkxFRlRfTEVHXSA9IGZhbHNlO1xuXHR0aGlzLmluanVyZWRNYXBbUGxheWVyLlJJR0hUX0xFR10gPSBmYWxzZTtcblx0dGhpcy5zdGF0dXNBaWxtZW50cyA9IFtdO1xuXHR0aGlzLm5hbWUgPSBzcGVjcy5uYW1lO1xuXHR0aGlzLnJvbGUgPSBzcGVjcy5yb2xlO1xuXHR0aGlzLmpvYiA9IHNwZWNzLmpvYjtcbn07XG5cblBsYXllci5MRUZUID0gJ2xlZnQnO1xuUGxheWVyLlJJR0hUID0gJ3JpZ2h0JztcblBsYXllci5BUk0gPSAnYXJtJztcblBsYXllci5MRUcgPSAnbGVnJztcblBsYXllci5MRUZUX0xFRyA9ICdsZWZ0LWxlZyc7XG5QbGF5ZXIuUklHSFRfTEVHID0gJ3JpZ2h0LWxlZyc7XG5QbGF5ZXIuTEVGVF9BUk0gPSAnbGVmdC1hcm0nO1xuUGxheWVyLlJJR0hUX0FSTSA9ICdyaWdodC1hcm0nO1xuUGxheWVyLlVOQ09OU0NJT1VTPSAndW5jb25zY2lvdXMnO1xuUGxheWVyLkJMSU5EID0gJ2JsaW5kJztcblBsYXllci5QQVJBTFlaRUQgPSAncGFyYWx5emVkJztcblBsYXllci5BU0xFRVAgPSAnYXNsZWVwJztcblBsYXllci5QT0lTT05FRCA9ICdwb2lzb25lZCc7XG5QbGF5ZXIuTVVURSA9ICdtdXRlJztcblBsYXllci5DTEFNUEVEID0gJ2NsYW1wZWQnO1xuXG5QbGF5ZXIuQk9EWV9QQVJUX05BTUVTID0ge307XG5QbGF5ZXIuQk9EWV9QQVJUX05BTUVTW1BsYXllci5MRUZUX0FSTV0gPSAnTGVmdCBBcm0nO1xuUGxheWVyLkJPRFlfUEFSVF9OQU1FU1tQbGF5ZXIuUklHSFRfQVJNXSA9ICdSaWdodCBBcm0nO1xuUGxheWVyLkJPRFlfUEFSVF9OQU1FU1tQbGF5ZXIuTEVGVF9MRUddID0gJ0xlZnQgTGVnJztcblBsYXllci5CT0RZX1BBUlRfTkFNRVNbUGxheWVyLlJJR0hUX0xFR10gPSAnUmlnaHQgTGVnJztcblxuUGxheWVyLkFJTE1FTlRfRUZGRUNUUyA9IHt9O1xuUGxheWVyLkFJTE1FTlRfRUZGRUNUU1tQbGF5ZXIuVU5DT05TQ0lPVVNdID0gJ2ZhbGxzIHVuY29uc2Npb3VzJztcblBsYXllci5BSUxNRU5UX0VGRkVDVFNbUGxheWVyLkJMSU5EXSA9ICdjYW5ub3Qgc2VlJztcblBsYXllci5BSUxNRU5UX0VGRkVDVFNbUGxheWVyLlBBUkFMWVpFRF0gPSAnaXMgcGFyYWx5emVkJztcblBsYXllci5BSUxNRU5UX0VGRkVDVFNbUGxheWVyLkFTTEVFUF0gPSAnZmFsbHMgYXNsZWVwJztcblBsYXllci5BSUxNRU5UX0VGRkVDVFNbUGxheWVyLlBPSVNPTkVEXSA9ICdpcyBwb2lzb25lZCc7XG5QbGF5ZXIuQUlMTUVOVF9FRkZFQ1RTW1BsYXllci5NVVRFXSA9ICdjYW5ub3Qgc3BlYWsnO1xuUGxheWVyLkFJTE1FTlRfRUZGRUNUU1tQbGF5ZXIuQ0xBTVBFRF0gPSAnaXMgaW1tb2JpbGl6ZWQgaW4gdGhlIHNwb3QnO1xuXG5QbGF5ZXIucHJvdG90eXBlID0ge1xuXHRzdXN0YWluSW5qdXJ5OiBmdW5jdGlvbihib2R5UGFydCwgdHVybnMpe1xuXHRcdGlmICghdHVybnMpe1xuXHRcdFx0dHVybnMgPSBVdGlscy5yYW5kKDMsIDYpOyBcblx0XHR9XG5cdFx0dGhpcy5pbmp1cmVkTWFwW2JvZHlQYXJ0XSA9IHt0dXJuczogdHVybnN9O1xuXHRcdHRoaXMucGFydHkuY29udHJvbGxlci51aS5zaG93TWVzc2FnZSh0aGlzLm5hbWUgKydcXCdzICcrUGxheWVyLkJPRFlfUEFSVF9OQU1FU1tib2R5UGFydF0rJyBpcyBpbmp1cmVkIScpO1xuXHR9LFxuXHRhcHBseUFpbG1lbnQ6IGZ1bmN0aW9uKGFpbG1lbnQsIHR1cm5zKXtcblx0XHRpZiAoIXR1cm5zKXtcblx0XHRcdHR1cm5zID0gVXRpbHMucmFuZCgzLCA2KTsgXG5cdFx0fVxuXHRcdHRoaXMuc3RhdHVzQWlsbWVudHMucHVzaChbe1xuXHRcdFx0YWlsbWVudDogYWlsbWVudCxcblx0XHRcdHR1cm5zOiB0dXJuc1xuXHRcdH1dKTtcblx0XHR0aGlzLnBhcnR5LmNvbnRyb2xsZXIudWkuc2hvd01lc3NhZ2UodGhpcy5uYW1lICsnICcrIFBsYXllci5BSUxNRU5UX0VGRkVDVFNbYWlsbWVudF0pO1xuXHR9LFxuXHR0dXJuSGVhbDogZnVuY3Rpb24oKXtcblx0XHRmb3IgKGJvZHlQYXJ0IGluIHRoaXMuaW5qdXJlZE1hcCl7XG5cdFx0XHRpZiAodGhpcy5pbmp1cmVkTWFwW2JvZHlQYXJ0XSAmJiAtLXRoaXMuaW5qdXJlZE1hcFtib2R5UGFydF0udHVybnMgPD0gMCl7XG5cdFx0XHRcdHRoaXMuaW5qdXJlZE1hcFtib2R5UGFydF0gPSBmYWxzZTtcblx0XHRcdH1cblx0XHR9XG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBzdGF0dXNBaWxtZW50cy5sZW5ndGg7IGkrKyl7XG5cdFx0XHRpZiAoLS10aGlzLnN0YXR1c0FpbG1lbnRzW2ldLnR1cm5zIDw9IDApe1xuXHRcdFx0XHR0aGlzLnN0YXR1c0FpbG1lbnRzLnNwbGljZShpLDEpO1xuXHRcdFx0XHRpLS07XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gUGxheWVyOyIsImZ1bmN0aW9uIFJvb20obGV2ZWwsIGZlYXR1cmVzKXtcblx0dGhpcy5sZXZlbCA9IG51bGw7XG5cdHRoaXMuZW5lbWllcyA9IG51bGw7XG5cdHRoaXMuaXRlbXMgPSBudWxsO1xuXHR0aGlzLmZlYXR1cmVzID0gbnVsbDtcblx0dGhpcy5kZXNjcmlwdGlvbiA9IG51bGw7XG5cdHRoaXMueCA9IG51bGw7XG5cdHRoaXMueSA9IG51bGw7XG5cdHRoaXMuY29ycmlkb3JzID0ge1xuXHRcdG5vcnRoOiBudWxsLFxuXHRcdHNvdXRoOiBudWxsLFxuXHRcdHdlc3Q6IG51bGwsXG5cdFx0ZWFzdDogbnVsbFxuXHR9XG5cdHRoaXMuaW5pdChsZXZlbCwgZmVhdHVyZXMpO1xufVxuXG5Sb29tLnByb3RvdHlwZSA9IHtcblx0aW5pdDogZnVuY3Rpb24obGV2ZWwsIGZlYXR1cmVzKXtcblx0XHR0aGlzLmxldmVsID0gbGV2ZWw7XG5cdFx0dGhpcy5kZXNjcmlwdGlvbiA9IGZlYXR1cmVzLmRlc2NyaXB0aW9uO1xuXHRcdHRoaXMuZW5lbWllcyA9IGZlYXR1cmVzLmVuZW1pZXM7XG5cdFx0dGhpcy5pdGVtcyA9IGZlYXR1cmVzLml0ZW1zO1xuXHRcdHRoaXMuZmVhdHVyZXMgPSBmZWF0dXJlcy5mZWF0dXJlcztcblx0fSxcblx0bG9jYXRlOiBmdW5jdGlvbih4LCB5KXtcblx0XHR0aGlzLnggPSB4O1xuXHRcdHRoaXMueSA9IHk7XG5cdH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBSb29tOyIsInZhciBSb29tID0gcmVxdWlyZSgnLi9Sb29tLmNsYXNzJyk7XG52YXIgVXRpbHMgPSByZXF1aXJlKCcuL1V0aWxzJyk7XG5cbnZhciBSb29tR2VuZXJhdG9yID0ge1xuXHRnZW5lcmF0ZVJvb206IGZ1bmN0aW9uKGxldmVsLCBzcGVjcyl7XG5cdFx0dmFyIGZlYXR1cmVzID0gW107XG5cdFx0aWYgKHNwZWNzICYmIHNwZWNzLmFkZFN0YWlyc1VwKXtcblx0XHRcdGZlYXR1cmVzLnB1c2goe3R5cGU6J3Vwc3RhaXJzJywgZGVzY3JpcHRpb246ICdTdGFpcndheSBnb2luZyB1cCd9KTtcblx0XHR9XG5cdFx0aWYgKHNwZWNzICYmIHNwZWNzLmFkZFN0YWlyc0Rvd24pe1xuXHRcdFx0ZmVhdHVyZXMucHVzaCh7dHlwZTonZG93bnN0YWlycycsIGRlc2NyaXB0aW9uOiAnU3RhaXJ3YXkgZ29pbmcgZG93bid9KTtcblx0XHR9XG5cdFx0dmFyIGVuZW1pZXMgPSBbXTtcblx0XHRpZiAoVXRpbHMuY2hhbmNlKDMwKSl7XG5cdFx0XHRlbmVtaWVzID0gdGhpcy5fZ2V0RW5lbXlQYXJ0eShsZXZlbCk7XG5cdFx0fVxuXHRcdHZhciByb29tID0gbmV3IFJvb20obGV2ZWwsIHtcdFxuXHRcdFx0ZGVzY3JpcHRpb246IFwiQSBwbGFpbiByb29tLlwiLFxuXHRcdFx0aXRlbXM6IFtdLFxuXHRcdFx0ZW5lbWllczogZW5lbWllcyxcblx0XHRcdGZlYXR1cmVzOiBmZWF0dXJlc1xuXHRcdH0pO1x0XG5cdFx0aWYgKHNwZWNzICYmIHNwZWNzLmlzRW50cmFuY2UpXG5cdFx0XHRyb29tLmlzRW50cmFuY2UgPSB0cnVlO1xuXHRcdGlmIChzcGVjcyAmJiBzcGVjcy5pc0V4aXQpXG5cdFx0XHRyb29tLmlzRXhpdCA9IHRydWU7XG5cdFx0cmV0dXJuIHJvb207XG5cdH0sXG5cdF9nZXRFbmVteVBhcnR5OiBmdW5jdGlvbihsZXZlbCl7XG5cdFx0cmV0dXJuIFt7XG5cdFx0XHRyYWNlTmFtZTogJ09yYydcblx0XHR9XTtcblx0fVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBSb29tR2VuZXJhdG9yOyIsInZhciBET00gPSByZXF1aXJlKCcuL0RPTScpO1xuXG5mdW5jdGlvbiBVSShjb250cm9sbGVyKXtcblx0dGhpcy5jb250cm9sbGVyID0gY29udHJvbGxlcjtcblx0dGhpcy5fYmluZEV2ZW50cyhjb250cm9sbGVyKTtcblx0dGhpcy5jcmVhdGVOZXdQbGF5ZXJSb3coKTtcblx0dGhpcy5tYXBDYW52YXMgPSBudWxsO1xufTtcblxuVUkucHJvdG90eXBlID0ge1xuXHRpbml0TWFwOiBmdW5jdGlvbigpe1xuXHRcdHRoaXMubWFwQ2FudmFzID0gRE9NLmJ5SWQoJ21hcENhbnZhcycpO1xuXHRcdHRoaXMubWFwQ2FudmFzQ3R4ID0gdGhpcy5tYXBDYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpO1xuXHRcdHZhciBzVUkgPSB0aGlzO1xuXHRcdHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZnVuY3Rpb24oKXtcblx0XHRcdHNVSS51cGRhdGUoKTtcblx0XHR9KTtcblx0fSxcblx0X2JpbmRFdmVudHM6IGZ1bmN0aW9uKGNvbnRyb2xsZXIpe1xuXHRcdERPTS5vbkNsaWNrKCdidG5Nb3ZlTm9ydGgnLCBmdW5jdGlvbigpIHsgbW92ZSgwLCAtMSk7IH0pO1xuXHRcdERPTS5vbkNsaWNrKCdidG5Nb3ZlU291dGgnLCBmdW5jdGlvbigpIHsgbW92ZSgwLCAxKTsgfSk7XG5cdFx0RE9NLm9uQ2xpY2soJ2J0bk1vdmVXZXN0JywgZnVuY3Rpb24oKSB7IG1vdmUoLTEsIDApOyB9KTtcblx0XHRET00ub25DbGljaygnYnRuTW92ZUVhc3QnLCBmdW5jdGlvbigpIHsgbW92ZSgxLCAwKTsgfSk7XG5cdFx0RE9NLm9uQ2xpY2soJ2J0blN0YXJ0R2FtZScsIGNvbnRyb2xsZXIuc3RhcnRHYW1lLCBjb250cm9sbGVyKTtcblx0XHRET00ub25DbGljaygnYnRuQWRkUGxheWVyJywgdGhpcy5jcmVhdGVOZXdQbGF5ZXJSb3csIHRoaXMpO1xuXHR9LFxuXHR1cGRhdGU6IGZ1bmN0aW9uKCl7XG5cdFx0dmFyIGN0eCA9IHRoaXMubWFwQ2FudmFzQ3R4O1xuXHRcdHZhciBwYXJ0eSA9IHRoaXMuY29udHJvbGxlci5wYXJ0eTtcblx0XHR2YXIgbGV2ZWwgPSBwYXJ0eS5sZXZlbDtcblx0XHR2YXIgYmxvY2tTaXplID0gMjA7XG5cdFx0dmFyIHNpemUgPSBibG9ja1NpemUgKiAzO1xuXHRcdHZhciBzY2FsZSA9IDQwO1xuXHRcdHZhciBsaW5lV2lkdGggPSAyO1xuXHRcdC8vIEZpbGwgYmFja2dyb3VuZFxuXHRcdGN0eC5maWxsU3R5bGUgPSBcIiNGRkZGRkZcIjtcblx0XHRjdHguZmlsbFJlY3QoMCwgMCwgMjUwLCAyNTApO1xuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgbGV2ZWwucm9vbXMubGVuZ3RoOyBpKyspe1xuXHRcdFx0dmFyIHJvb20gPSBsZXZlbC5yb29tc1tpXTtcblx0XHRcdC8vIEJhc2Ugd2hpdGUgcm9vbVxuXHRcdFx0Y3R4LmZpbGxTdHlsZSA9IFwiI0ZGRkZGRlwiO1xuXHRcdFx0Y3R4LmZpbGxSZWN0KHJvb20ueCAqIHNjYWxlLCByb29tLnkgKiBzY2FsZSwgc2l6ZSwgc2l6ZSk7XG5cdFx0XHQvLyBGaWxsIHRoZSA0IGZpeGVkIGJsb2NrcyB3aXRoIGJsYWNrbmVzc1xuXHRcdFx0Y3R4LmZpbGxTdHlsZSA9IFwiIzAwMDAwMFwiO1xuXHRcdFx0Y3R4LmZpbGxSZWN0KHJvb20ueCAqIHNjYWxlLCByb29tLnkgKiBzY2FsZSwgYmxvY2tTaXplLCBibG9ja1NpemUpO1xuXHRcdFx0Y3R4LmZpbGxSZWN0KHJvb20ueCAqIHNjYWxlLCByb29tLnkgKiBzY2FsZSArIDIgKiBibG9ja1NpemUsIGJsb2NrU2l6ZSwgYmxvY2tTaXplKTtcblx0XHRcdGN0eC5maWxsUmVjdChyb29tLnggKiBzY2FsZSArIDIgKiBibG9ja1NpemUsIHJvb20ueSAqIHNjYWxlLCBibG9ja1NpemUsIGJsb2NrU2l6ZSk7XG5cdFx0XHRjdHguZmlsbFJlY3Qocm9vbS54ICogc2NhbGUgKyAyICogYmxvY2tTaXplLCByb29tLnkgKiBzY2FsZSArIDIgKiBibG9ja1NpemUsIGJsb2NrU2l6ZSwgYmxvY2tTaXplKTtcblx0XHRcdC8vIE5vdywgZmlsbCB0aGUgY29ycmlkb3JzXG5cdFx0XHRpZiAoIXJvb20uY29ycmlkb3JzLm5vcnRoKVxuXHRcdFx0XHRjdHguZmlsbFJlY3Qocm9vbS54ICogc2NhbGUgKyBibG9ja1NpemUsIHJvb20ueSAqIHNjYWxlLCBibG9ja1NpemUsIGJsb2NrU2l6ZSk7XG5cdFx0XHRpZiAoIXJvb20uY29ycmlkb3JzLnNvdXRoKVxuXHRcdFx0XHRjdHguZmlsbFJlY3Qocm9vbS54ICogc2NhbGUgKyBibG9ja1NpemUsIHJvb20ueSAqIHNjYWxlICsgMiAqIGJsb2NrU2l6ZSwgYmxvY2tTaXplLCBibG9ja1NpemUpO1xuXHRcdFx0aWYgKCFyb29tLmNvcnJpZG9ycy53ZXN0KVxuXHRcdFx0XHRjdHguZmlsbFJlY3Qocm9vbS54ICogc2NhbGUsIHJvb20ueSAqIHNjYWxlICsgYmxvY2tTaXplLCBibG9ja1NpemUsIGJsb2NrU2l6ZSk7XG5cdFx0XHRpZiAoIXJvb20uY29ycmlkb3JzLmVhc3QpXG5cdFx0XHRcdGN0eC5maWxsUmVjdChyb29tLnggKiBzY2FsZSArIDIgKiBibG9ja1NpemUsIHJvb20ueSAqIHNjYWxlICsgYmxvY2tTaXplLCBibG9ja1NpemUsIGJsb2NrU2l6ZSk7XG5cdFx0XHQvLyBTaG93IGVuZW1pZXNcblx0XHRcdGlmIChyb29tLmVuZW1pZXMubGVuZ3RoID4gMCl7XG5cdFx0XHRcdGN0eC5saW5lV2lkdGg9IGxpbmVXaWR0aDtcblx0XHRcdFx0Y3R4LnN0cm9rZVN0eWxlPVwiI2ZmMDBkNVwiO1xuXHRcdFx0XHRjdHguc3Ryb2tlUmVjdChyb29tLnggKiBzY2FsZSArIGJsb2NrU2l6ZSArIGxpbmVXaWR0aCAvIDIsIHJvb20ueSAqIHNjYWxlICsgYmxvY2tTaXplICsgbGluZVdpZHRoIC8gMiwgYmxvY2tTaXplIC0gbGluZVdpZHRoLCBibG9ja1NpemUgLSBsaW5lV2lkdGggKTtcblx0XHRcdH1cblx0XHRcdC8vIEFkZCBzdGFpcnMgZG93biBhbmQgdXBcblx0XHRcdGlmIChyb29tLmlzRXhpdCl7XG5cdFx0XHRcdGN0eC5maWxsU3R5bGUgPSBcIiMwMEZGMDBcIjtcblx0XHRcdFx0Y3R4LmZpbGxSZWN0KHJvb20ueCAqIHNjYWxlICsgYmxvY2tTaXplLCByb29tLnkgKiBzY2FsZSArIGJsb2NrU2l6ZSwgYmxvY2tTaXplLCBibG9ja1NpemUpO1xuXHRcdFx0fVxuXHRcdFx0aWYgKHJvb20uaXNFbnRyYW5jZSl7XG5cdFx0XHRcdGN0eC5maWxsU3R5bGUgPSBcIiMwMDAwRkZcIjtcblx0XHRcdFx0Y3R4LmZpbGxSZWN0KHJvb20ueCAqIHNjYWxlICsgYmxvY2tTaXplLCByb29tLnkgKiBzY2FsZSArIGJsb2NrU2l6ZSwgYmxvY2tTaXplLCBibG9ja1NpemUpO1xuXHRcdFx0fVxuXHRcdFx0Ly8gU2hvdyBwYXJ0eSBsb2NhdGlvblxuXHRcdFx0aWYgKHBhcnR5LmxvY2F0aW9uLnggPT0gcm9vbS54ICYmIHBhcnR5LmxvY2F0aW9uLnkgPT0gcm9vbS55KXtcblx0XHRcdFx0Y3R4LmZpbGxTdHlsZSA9IFwiI0ZGMDAwMFwiO1xuXHRcdFx0XHRjdHguZmlsbFJlY3Qocm9vbS54ICogc2NhbGUgKyBibG9ja1NpemUsIHJvb20ueSAqIHNjYWxlICsgYmxvY2tTaXplLCBibG9ja1NpemUsIGJsb2NrU2l6ZSk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHZhciBzVUkgPSB0aGlzO1xuXHRcdHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZnVuY3Rpb24oKXtcblx0XHRcdHNVSS51cGRhdGUoKTtcblx0XHR9KTtcblx0fSxcblx0aGlkZU5ld0dhbWVQYW5lbDogZnVuY3Rpb24oKXtcblx0XHRET00uYnlJZCgnbmV3R2FtZScpLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG5cdFx0RE9NLmJ5SWQoJ21vdmVtZW50QnV0dG9ucycpLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuXHR9LFxuXHRnZXROZXdHYW1lQ29uZmlnOiBmdW5jdGlvbigpe1xuXHRcdHZhciBkdW5nZW9uVyA9IHBhcnNlSW50KERPTS52YWwoJ3R4dER1bmdlb25XJykpO1xuXHRcdHZhciBkdW5nZW9uSCA9IHBhcnNlSW50KERPTS52YWwoJ3R4dER1bmdlb25IJykpO1xuXHRcdHZhciByb29tRGVuc2l0eSA9IERPTS52YWwoJ2NtYlJvb21EZW5zaXR5Jyk7XG5cblx0XHR2YXIgcGxheWVycyA9IFtdO1xuXHRcdHZhciBuYW1lcyA9IERPTS5zZWxlY3RBbGwoJy5wbGF5ZXJOYW1lVGV4dCcpO1xuXHRcdHZhciB0ZWFtcyA9IERPTS5zZWxlY3RBbGwoJy5wbGF5ZXJUZWFtQ29tYm8nKTtcblx0XHR2YXIgcm9sZXMgPSBET00uc2VsZWN0QWxsKCcucGxheWVyUm9sZUNvbWJvJyk7XG5cdFx0dmFyIGNsYXNzZXMgPSBET00uc2VsZWN0QWxsKCcucGxheWVyQ2xhc3NDb21ibycpO1xuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgbmFtZXMubGVuZ3RoOyBpKyspe1xuXHRcdFx0cGxheWVycy5wdXNoKHtcblx0XHRcdFx0bmFtZTogbmFtZXNbaV0udmFsdWUsXG5cdFx0XHRcdHRlYW06IHRlYW1zW2ldLnZhbHVlLFxuXHRcdFx0XHRyb2xlOiByb2xlc1tpXS52YWx1ZSxcblx0XHRcdFx0am9iOiBjbGFzc2VzW2ldLnZhbHVlXG5cdFx0XHR9KTtcblx0XHR9XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0ZHVuZ2VvblNpemU6IHtcblx0XHRcdFx0dzogZHVuZ2VvblcsXG5cdFx0XHRcdGg6IGR1bmdlb25IXG5cdFx0XHR9LFxuXHRcdFx0cm9vbURlbnNpdHk6IHJvb21EZW5zaXR5LFxuXHRcdFx0cGxheWVyczogcGxheWVyc1xuXHRcdH1cblx0fSxcblx0dXBkYXRlUm9vbURhdGE6IGZ1bmN0aW9uKHJvb20pe1xuXHRcdHZhciBodG1sID0gJzxwPicrcm9vbS5kZXNjcmlwdGlvbisnPC9wPic7XG5cdFx0dmFyIGNvcnJpZG9yc0hUTUwgPSAnJztcblx0XHRpZiAocm9vbS5jb3JyaWRvcnMubm9ydGgpe1xuXHRcdFx0Y29ycmlkb3JzSFRNTCArPSAnPHN0cm9uZz5Ob3J0aDo8L3N0cm9uZz4gJytyb29tLmNvcnJpZG9ycy5ub3J0aC5kZXNjcmlwdGlvbisgJzxici8+Jztcblx0XHR9XG5cdFx0aWYgKHJvb20uY29ycmlkb3JzLnNvdXRoKXtcblx0XHRcdGNvcnJpZG9yc0hUTUwgKz0gJzxzdHJvbmc+U291dGg6PC9zdHJvbmc+ICcrcm9vbS5jb3JyaWRvcnMuc291dGguZGVzY3JpcHRpb24rICc8YnIvPic7XG5cdFx0fVxuXHRcdGlmIChyb29tLmNvcnJpZG9ycy53ZXN0KXtcblx0XHRcdGNvcnJpZG9yc0hUTUwgKz0gJzxzdHJvbmc+V2VzdDo8L3N0cm9uZz4gJytyb29tLmNvcnJpZG9ycy53ZXN0LmRlc2NyaXB0aW9uKyAnPGJyLz4nO1xuXHRcdH1cblx0XHRpZiAocm9vbS5jb3JyaWRvcnMuZWFzdCl7XG5cdFx0XHRjb3JyaWRvcnNIVE1MICs9ICc8c3Ryb25nPkVhc3Q6PC9zdHJvbmc+ICcrcm9vbS5jb3JyaWRvcnMuZWFzdC5kZXNjcmlwdGlvbisgJzxici8+Jztcblx0XHR9XG5cdFx0aWYgKGNvcnJpZG9yc0hUTUwubGVuZ3RoID4gMCl7XG5cdFx0XHRodG1sICs9ICc8cD4nK2NvcnJpZG9yc0hUTUwrJzwvcD4nO1xuXHRcdH1cblx0XHRpZiAocm9vbS5lbmVtaWVzLmxlbmd0aCA+IDApe1xuXHRcdFx0aHRtbCArPSAnPGgzPk1vbnN0ZXJzITwvaDM+PHA+Jyt0aGlzLl9idWlsZExpc3Qocm9vbS5lbmVtaWVzLCBcblx0XHRcdFx0ZnVuY3Rpb24oZWxlbWVudCl7XG5cdFx0XHRcdFx0cmV0dXJuIGVsZW1lbnQucmFjZU5hbWU7XG5cdFx0XHRcdH1cblx0XHRcdCkrJzwvcD4nO1xuXHRcdH1cblx0XHRpZiAocm9vbS5pdGVtcy5sZW5ndGggPiAwKXtcblx0XHRcdGh0bWwgKz0gJzxoMz5JdGVtczwvaDM+PHA+Jyt0aGlzLl9idWlsZExpc3Qocm9vbS5pdGVtcywgXG5cdFx0XHRcdGZ1bmN0aW9uKGVsZW1lbnQpe1xuXHRcdFx0XHRcdHJldHVybiBlbGVtZW50LmRlc2NyaXB0aW9uO1xuXHRcdFx0XHR9XG5cdFx0XHQpKyc8L3A+Jztcblx0XHR9XG5cdFx0aWYgKHJvb20uZmVhdHVyZXMubGVuZ3RoID4gMCl7XG5cdFx0XHRodG1sICs9ICc8cD4nK3RoaXMuX2J1aWxkTGlzdChyb29tLmZlYXR1cmVzLCBcblx0XHRcdFx0ZnVuY3Rpb24oZWxlbWVudCl7XG5cdFx0XHRcdFx0dmFyIGRlc2NyaXB0aW9uID0gZWxlbWVudC5kZXNjcmlwdGlvbjtcblx0XHRcdFx0XHR2YXIgYWN0aW9uID0gXCJcIjtcblx0XHRcdFx0XHRzd2l0Y2ggKGVsZW1lbnQudHlwZSl7XG5cdFx0XHRcdFx0XHRjYXNlICd1cHN0YWlycyc6XG5cdFx0XHRcdFx0XHRcdGFjdGlvbiA9ICc8YnV0dG9uIG9uY2xpY2s9XCJWaXJ0dWFsRHVuZ2Vvbi51cHN0YWlycygpO1wiPkdvIFVwPC9idXR0b24+Jztcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0Y2FzZSAnZG93bnN0YWlycyc6XG5cdFx0XHRcdFx0XHRhY3Rpb24gPSAnPGJ1dHRvbiBvbmNsaWNrPVwiVmlydHVhbER1bmdlb24uZG93bnN0YWlycygpO1wiPkdvIERvd248L2J1dHRvbj4nO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHJldHVybiBkZXNjcmlwdGlvbiArIGFjdGlvbjtcblx0XHRcdFx0fVxuXHRcdFx0KSsnPC9wPic7XG5cdFx0fVxuXHRcdERPTS5ieUlkKCdyb29tRGVzY3JpcHRpb24nKS5pbm5lckhUTUwgPSBodG1sO1xuXHR9LFxuXHRfYnVpbGRMaXN0OiBmdW5jdGlvbihhcnIsIHJlbmRlcmVyKXtcblx0XHR2YXIgaHRtbCA9ICc8dWw+Jztcblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGFyci5sZW5ndGg7IGkrKyl7XG5cdFx0XHRodG1sICs9ICc8bGk+JytyZW5kZXJlcihhcnJbaV0pKyc8L2xpPic7XG5cdFx0fVxuXG5cdFx0aHRtbCArPSAnPC91bD4nO1xuXHRcdHJldHVybiBodG1sO1xuXHR9LFxuXHRjcmVhdGVOZXdQbGF5ZXJSb3c6IGZ1bmN0aW9uKCl7XG5cdFx0dmFyIHRhYmxlID0gRE9NLmJ5SWQoJ3RibFBsYXllcnNJbmZvJyk7XG5cdFx0dmFyIHRyID0gRE9NLmNyZWF0ZSgndHInKTtcblx0XHR2YXIgdGQgPSBET00uY3JlYXRlKCd0ZCcpO1xuXHRcdHZhciBjb21wb25lbnQgPSBET00uY3JlYXRlKCdpbnB1dCcpO1xuXHRcdGNvbXBvbmVudC50eXBlID0gJ3RleHQnO1xuXHRcdGNvbXBvbmVudC5jbGFzc05hbWUgPSAncGxheWVyTmFtZVRleHQnO1xuXHRcdHRkLmFwcGVuZENoaWxkKGNvbXBvbmVudCk7XG5cdFx0dHIuYXBwZW5kQ2hpbGQodGQpO1xuXG5cdFx0dGQgPSBET00uY3JlYXRlKCd0ZCcpO1xuXHRcdGNvbXBvbmVudCA9IERPTS5jcmVhdGUoJ3NlbGVjdCcpO1xuXHRcdGNvbXBvbmVudC5jbGFzc05hbWUgPSAncGxheWVyVGVhbUNvbWJvJztcblx0XHR2YXIgY2hpbGQgPSBET00uY3JlYXRlKCdvcHRpb24nKTtcblx0XHRjaGlsZC52YWx1ZSA9ICdoZXJvZXMnO1xuXHRcdGNoaWxkLmlubmVySFRNTCA9ICdIZXJvZXMnO1xuXHRcdGNvbXBvbmVudC5hcHBlbmRDaGlsZChjaGlsZCk7XG5cdFx0Y2hpbGQgPSBET00uY3JlYXRlKCdvcHRpb24nKTtcblx0XHRjaGlsZC52YWx1ZSA9ICdkdW5nZW9uJztcblx0XHRjaGlsZC5pbm5lckhUTUwgPSAnRHVuZ2Vvbic7XG5cdFx0Y29tcG9uZW50LmFwcGVuZENoaWxkKGNoaWxkKTtcblx0XHR0ZC5hcHBlbmRDaGlsZChjb21wb25lbnQpO1xuXHRcdHRyLmFwcGVuZENoaWxkKHRkKTtcblxuXHRcdHRkID0gRE9NLmNyZWF0ZSgndGQnKTtcblx0XHRjb21wb25lbnQgPSBET00uY3JlYXRlKCdzZWxlY3QnKTtcblx0XHRjb21wb25lbnQuY2xhc3NOYW1lID0gJ3BsYXllclJvbGVDb21ibyc7XG5cdFx0Y2hpbGQgPSBET00uY3JlYXRlKCdvcHRpb24nKTtcblx0XHRjaGlsZC52YWx1ZSA9ICduL2EnO1xuXHRcdGNoaWxkLmlubmVySFRNTCA9ICdOL0EnO1xuXHRcdGNvbXBvbmVudC5hcHBlbmRDaGlsZChjaGlsZCk7XG5cdFx0Y2hpbGQgPSBET00uY3JlYXRlKCdvcHRpb24nKTtcblx0XHRjaGlsZC52YWx1ZSA9ICdsZWFkZXInO1xuXHRcdGNoaWxkLmlubmVySFRNTCA9ICdMZWFkZXInO1xuXHRcdGNvbXBvbmVudC5hcHBlbmRDaGlsZChjaGlsZCk7XG5cdFx0Y2hpbGQgPSBET00uY3JlYXRlKCdvcHRpb24nKTtcblx0XHRjaGlsZC52YWx1ZSA9ICdtYXBwZXInO1xuXHRcdGNoaWxkLmlubmVySFRNTCA9ICdNYXBwZXInO1xuXHRcdGNvbXBvbmVudC5hcHBlbmRDaGlsZChjaGlsZCk7XG5cdFx0dGQuYXBwZW5kQ2hpbGQoY29tcG9uZW50KTtcblx0XHR0ci5hcHBlbmRDaGlsZCh0ZCk7XG5cblx0XHR0ZCA9IERPTS5jcmVhdGUoJ3RkJyk7XG5cdFx0Y29tcG9uZW50ID0gRE9NLmNyZWF0ZSgnc2VsZWN0Jyk7XG5cdFx0Y29tcG9uZW50LmNsYXNzTmFtZSA9ICdwbGF5ZXJDbGFzc0NvbWJvJztcblx0XHRjaGlsZCA9IERPTS5jcmVhdGUoJ29wdGlvbicpO1xuXHRcdGNoaWxkLnZhbHVlID0gJ24vYSc7XG5cdFx0Y2hpbGQuaW5uZXJIVE1MID0gJ04vQSc7XG5cdFx0Y29tcG9uZW50LmFwcGVuZENoaWxkKGNoaWxkKTtcblx0XHRjaGlsZCA9IERPTS5jcmVhdGUoJ29wdGlvbicpO1xuXHRcdGNoaWxkLnZhbHVlID0gJ2ZpZ2h0ZXInO1xuXHRcdGNoaWxkLmlubmVySFRNTCA9ICdGaWdodGVyJztcblx0XHRjb21wb25lbnQuYXBwZW5kQ2hpbGQoY2hpbGQpO1xuXHRcdGNoaWxkID0gRE9NLmNyZWF0ZSgnb3B0aW9uJyk7XG5cdFx0Y2hpbGQudmFsdWUgPSAnbWFnZSc7XG5cdFx0Y2hpbGQuaW5uZXJIVE1MID0gJ01hZ2UnO1xuXHRcdGNvbXBvbmVudC5hcHBlbmRDaGlsZChjaGlsZCk7XG5cdFx0Y2hpbGQgPSBET00uY3JlYXRlKCdvcHRpb24nKTtcblx0XHRjaGlsZC52YWx1ZSA9ICdiYXJkJztcblx0XHRjaGlsZC5pbm5lckhUTUwgPSAnQmFyZCc7XG5cdFx0Y29tcG9uZW50LmFwcGVuZENoaWxkKGNoaWxkKTtcblx0XHR0ZC5hcHBlbmRDaGlsZChjb21wb25lbnQpO1xuXHRcdHRyLmFwcGVuZENoaWxkKHRkKTtcblxuXHRcdHRhYmxlLmFwcGVuZENoaWxkKHRyKTtcblx0fSxcblx0c2hvd01lc3NhZ2U6IGZ1bmN0aW9uKG1lc3NhZ2Upe1xuXHRcdHZhciBjb21wb25lbnQgPSBET00uY3JlYXRlKCdwJyk7XG5cdFx0Y29tcG9uZW50LmlubmVySFRNTCA9IG1lc3NhZ2U7XG5cdFx0RE9NLmJ5SWQoJ21lc3NhZ2VBcmVhJykuYXBwZW5kQ2hpbGQoY29tcG9uZW50KTtcblx0fSxcblx0Y2xlYXJNZXNzYWdlczogZnVuY3Rpb24oKXtcblx0XHRET00uYnlJZCgnbWVzc2FnZUFyZWEnKS5pbm5lckhUTUwgPSAnJztcblx0fVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBVSTsiLCJ2YXIgVXRpbHMgPSB7XG5cdHJhbmQ6IGZ1bmN0aW9uKGxvdywgaGkpe1xuXHRcdHJldHVybiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAoaGkgLSBsb3cgKyAxKSkrbG93O1xuXHR9LFxuXHRyYW5kb21FbGVtZW50T2Y6IGZ1bmN0aW9uKGFycmF5KXtcbiAgICBcdHJldHVybiBhcnJheVtNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkqYXJyYXkubGVuZ3RoKV07XG5cdH0sXG5cdGNoYW5jZTogZnVuY3Rpb24ocHJvYmFiaWxpdHkpe1xuXHRcdHJldHVybiB0aGlzLnJhbmQoMCwgMTAwKSA8PSBwcm9iYWJpbGl0eTtcblx0fSxcblx0cHVsbFJhbmRvbUVsZW1lbnRPZjogZnVuY3Rpb24oYXJyYXkpe1xuXHRcdHZhciBpbmRleCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSphcnJheS5sZW5ndGgpO1xuXHRcdHZhciB2YWx1ZSA9IGFycmF5W2luZGV4XTtcblx0XHRhcnJheS5zcGxpY2UoaW5kZXgsIDEpO1xuICAgIFx0cmV0dXJuIHZhbHVlO1xuXHR9LFxuXHRnZXREaXJlY3Rpb246IGZ1bmN0aW9uKGZyb20sIHRvKXtcblx0XHRpZiAoZnJvbS54ID09IHRvLngpe1xuXHRcdFx0aWYgKGZyb20ueSA+IHRvLnkpe1xuXHRcdFx0XHRyZXR1cm4gJ25vcnRoJztcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHJldHVybiAnc291dGgnO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSB7XG5cdFx0XHRpZiAoZnJvbS54ID4gdG8ueCl7XG5cdFx0XHRcdHJldHVybiAnd2VzdCc7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRyZXR1cm4gJ2Vhc3QnO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBVdGlsczsiLCJ2YXIgVUkgPSByZXF1aXJlKCcuL1VJLmNsYXNzJylcbnZhciBEdW5nZW9uR2VuZXJhdG9yID0gcmVxdWlyZSgnLi9EdW5nZW9uR2VuZXJhdG9yJylcbnZhciBQYXJ0eSA9IHJlcXVpcmUoJy4vUGFydHkuY2xhc3MnKVxuXG52YXIgVmlydHVhbER1bmdlb24gPSB7XG5cdGxldmVsczoge30sXG5cdGluaXQ6IGZ1bmN0aW9uKCl7XG5cdFx0Y29uc29sZS5sb2coXCJJbml0aWFsaXppbmcgVmlydHVhbER1bmdlb25cIik7XG5cdFx0dGhpcy51aSA9IG5ldyBVSSh0aGlzKTtcblx0fSxcblx0c3RhcnRHYW1lOiBmdW5jdGlvbigpe1xuXHRcdHZhciBjb25maWcgPSB0aGlzLnVpLmdldE5ld0dhbWVDb25maWcoKTtcblx0XHRjb25zb2xlLmxvZyhcIk5ldyBHYW1lLCBjb25maWdcIiwgY29uZmlnKTtcblx0XHR0aGlzLmNvbmZpZyA9IGNvbmZpZztcblx0XHR0aGlzLnBhcnR5ID0gbmV3IFBhcnR5KHtcblx0XHRcdHBsYXllcnM6IGNvbmZpZy5wbGF5ZXJzXG5cdFx0fSwgdGhpcyk7XG5cdFx0dGhpcy5wYXJ0eS5sb2NhdGUoTWF0aC5mbG9vcihjb25maWcuZHVuZ2VvblNpemUudyAvIDIpLCBNYXRoLmZsb29yKGNvbmZpZy5kdW5nZW9uU2l6ZS5oIC8gMikpO1xuXHRcdHZhciBsZXZlbCA9IER1bmdlb25HZW5lcmF0b3IuZ2VuZXJhdGVMZXZlbCh7XG5cdFx0XHR3OiBjb25maWcuZHVuZ2VvblNpemUudyxcblx0XHRcdGg6IGNvbmZpZy5kdW5nZW9uU2l6ZS5oLFxuXHRcdFx0ZGVwdGg6IDEsXG5cdFx0XHRzdGFydGluZ0xvY2F0aW9uOiB0aGlzLnBhcnR5LmxvY2F0aW9uLFxuXHRcdFx0cm9vbURlbnNpdHk6IGNvbmZpZy5yb29tRGVuc2l0eVxuXHRcdH0sIHRoaXMpO1xuXHRcdHRoaXMubGV2ZWxzWzFdID0gbGV2ZWw7XG5cdFx0dGhpcy5wYXJ0eS5zZXRMZXZlbChsZXZlbCk7XG5cdFx0Y29uc29sZS5sb2coXCJMZXZlbFwiLCBsZXZlbCk7XG5cdFx0Y29uc29sZS5sb2coXCJQYXJ0eVwiLCB0aGlzLnBhcnR5KTtcblx0XHR0aGlzLnVpLnVwZGF0ZVJvb21EYXRhKHRoaXMucGFydHkuZ2V0Q3VycmVudFJvb20oKSk7XG5cdFx0dGhpcy51aS5pbml0TWFwKCk7XG5cdFx0dGhpcy51aS5oaWRlTmV3R2FtZVBhbmVsKCk7XG5cblx0fSxcblx0bW92ZTogZnVuY3Rpb24oZHgsIGR5KXtcblx0XHR0aGlzLnVpLmNsZWFyTWVzc2FnZXMoKTtcblx0XHR0aGlzLnBhcnR5Lm1vdmUoZHgsIGR5KTtcblx0XHR0aGlzLnVpLnVwZGF0ZVJvb21EYXRhKHRoaXMucGFydHkuZ2V0Q3VycmVudFJvb20oKSk7XG5cdH0sXG5cdHVwc3RhaXJzOiBmdW5jdGlvbigpe1xuXHRcdHRoaXMuX2dvdG9EZXB0aCh0aGlzLnBhcnR5LmxldmVsLmRlcHRoIC0gMSk7XG5cdH0sXG5cdGRvd25zdGFpcnM6IGZ1bmN0aW9uKCl7XG5cdFx0dGhpcy5fZ290b0RlcHRoKHRoaXMucGFydHkubGV2ZWwuZGVwdGggKyAxKTtcblx0fSxcblx0X2dvdG9EZXB0aDogZnVuY3Rpb24oZGVwdGgpe1xuXHRcdHZhciBsZXZlbCA9IHRoaXMubGV2ZWxzW2RlcHRoXTtcblx0XHRpZiAoIWxldmVsKXtcblx0XHRcdHZhciBjb25maWcgPSB0aGlzLmNvbmZpZztcblx0XHRcdGxldmVsID0gRHVuZ2VvbkdlbmVyYXRvci5nZW5lcmF0ZUxldmVsKHtcblx0XHRcdFx0dzogY29uZmlnLmR1bmdlb25TaXplLncsXG5cdFx0XHRcdGg6IGNvbmZpZy5kdW5nZW9uU2l6ZS5oLFxuXHRcdFx0XHRkZXB0aDogZGVwdGgsXG5cdFx0XHRcdHN0YXJ0aW5nTG9jYXRpb246IHRoaXMucGFydHkubG9jYXRpb24sXG5cdFx0XHRcdHJvb21EZW5zaXR5OiBjb25maWcucm9vbURlbnNpdHlcblx0XHRcdH0sIHRoaXMpO1xuXHRcdFx0dGhpcy5sZXZlbHNbZGVwdGhdID0gbGV2ZWw7XG5cdFx0XHRjb25zb2xlLmxvZyhcInRoaXMubGV2ZWxzXCIsIHRoaXMubGV2ZWxzKTtcblx0XHR9XG5cdFx0dGhpcy5wYXJ0eS5zZXRMZXZlbChsZXZlbClcblx0XHR0aGlzLnVpLnVwZGF0ZVJvb21EYXRhKHRoaXMucGFydHkuZ2V0Q3VycmVudFJvb20oKSk7XG5cdH1cbn07XG5cbndpbmRvdy5WaXJ0dWFsRHVuZ2VvbiA9IFZpcnR1YWxEdW5nZW9uO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFZpcnR1YWxEdW5nZW9uOyJdfQ==
