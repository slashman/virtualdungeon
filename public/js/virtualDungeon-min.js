(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Level = require('./Level.class');
var RoomGenerator = require('./RoomGenerator');

var DungeonGenerator = {
	generateLevel: function(specs){
		var w = specs.w;
		var h = specs.h;
		var depth = specs.depth;
		var level = new Level(w, h, depth);
		// Put starting room
		var startingRoom = RoomGenerator.generateRoom(level);
		level.setRoom(specs.startingLocation.x, specs.startingLocation.y, startingRoom);
		// Put another room to the north
		var anotherRoom = RoomGenerator.generateRoom(level);
		level.setRoom(specs.startingLocation.x, specs.startingLocation.y-1, anotherRoom);
		return level;
	}
};

module.exports = DungeonGenerator;
},{"./Level.class":2,"./RoomGenerator":5}],2:[function(require,module,exports){
function Level(w, h, depth){
	this.map = null;
	this.rooms = null;
	this.init(w, h, depth);
}

Level.prototype = {
	init: function(w, h, depth){
		this.map = [];
		this.rooms = [];
		for (var x = 0; x < w; x++){
			this.map[x] = [];
			for (var y = 0; y < h; y++){
				this.map[x][y] = null;
			}
		}
	},
	setRoom: function(x, y, room){
		room.locate(x,y);
		this.map[x][y] = room;
		this.rooms.push(room);
	},
	getRoom: function(location){
		return this.map[location.x][location.y];
	}
}

module.exports = Level;
},{}],3:[function(require,module,exports){
var Party = {
	location: {
		x: null,
		y: null
	},
	level: null,
	init: function(specs){
		this.specs = specs;
	},
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
		this.location.x += dx;
		this.location.y += dy;
		console.log(this.location);
	}
}

module.exports = Party;
},{}],4:[function(require,module,exports){
function Room(level, features){
	this.level = null;
	this.enemies = null;
	this.items = null;
	this.features = null;
	this.description = null;
	this.x = null;
	this.y = null;
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
},{}],5:[function(require,module,exports){
var Room = require('./Room.class');

var RoomGenerator = {
	generateRoom: function(level){
		return new Room(level, {	
			description: "To the north is the entrance to the Abyss",
			items: [],
			enemies: [],
			features: []
		});
	}
};

module.exports = RoomGenerator;
},{"./Room.class":4}],6:[function(require,module,exports){
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
},{"./Party":3}],7:[function(require,module,exports){
var UI = require('./UI')
var DungeonGenerator = require('./DungeonGenerator')
var Party = require('./Party')

var VirtualDungeon = {
	init: function(){
		console.log("Initializing VirtualDungeon");
	},
	startGame: function(config){
		console.log("New Game, config", config);
		this.config = config;
		Party.init({
			size: config.partySize
		});
		Party.locate(Math.floor(config.dungeonSize.w / 2), Math.floor(config.dungeonSize.h / 2));
		var level = DungeonGenerator.generateLevel({
			w: config.dungeonSize.w,
			h: config.dungeonSize.h,
			depth: 1,
			startingLocation: Party.location
		});
		Party.setLevel(level);
		console.log("Level", level);
		console.log("Party", Party);
		UI.init();
		UI.startGame();
		UI.updateRoomData(Party.getCurrentRoom());
	},
	move: function(dx, dy){
		Party.move(dx, dy);
	}
};

window.VirtualDungeon = VirtualDungeon;

module.exports = VirtualDungeon;
},{"./DungeonGenerator":1,"./Party":3,"./UI":6}]},{},[7])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Vzci9sb2NhbC9saWIvbm9kZV9tb2R1bGVzL3dhdGNoaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJEdW5nZW9uR2VuZXJhdG9yLmpzIiwiTGV2ZWwuY2xhc3MuanMiLCJQYXJ0eS5qcyIsIlJvb20uY2xhc3MuanMiLCJSb29tR2VuZXJhdG9yLmpzIiwiVUkuanMiLCJWaXJ0dWFsRHVuZ2Vvbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0VBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgTGV2ZWwgPSByZXF1aXJlKCcuL0xldmVsLmNsYXNzJyk7XG52YXIgUm9vbUdlbmVyYXRvciA9IHJlcXVpcmUoJy4vUm9vbUdlbmVyYXRvcicpO1xuXG52YXIgRHVuZ2VvbkdlbmVyYXRvciA9IHtcblx0Z2VuZXJhdGVMZXZlbDogZnVuY3Rpb24oc3BlY3Mpe1xuXHRcdHZhciB3ID0gc3BlY3Mudztcblx0XHR2YXIgaCA9IHNwZWNzLmg7XG5cdFx0dmFyIGRlcHRoID0gc3BlY3MuZGVwdGg7XG5cdFx0dmFyIGxldmVsID0gbmV3IExldmVsKHcsIGgsIGRlcHRoKTtcblx0XHQvLyBQdXQgc3RhcnRpbmcgcm9vbVxuXHRcdHZhciBzdGFydGluZ1Jvb20gPSBSb29tR2VuZXJhdG9yLmdlbmVyYXRlUm9vbShsZXZlbCk7XG5cdFx0bGV2ZWwuc2V0Um9vbShzcGVjcy5zdGFydGluZ0xvY2F0aW9uLngsIHNwZWNzLnN0YXJ0aW5nTG9jYXRpb24ueSwgc3RhcnRpbmdSb29tKTtcblx0XHQvLyBQdXQgYW5vdGhlciByb29tIHRvIHRoZSBub3J0aFxuXHRcdHZhciBhbm90aGVyUm9vbSA9IFJvb21HZW5lcmF0b3IuZ2VuZXJhdGVSb29tKGxldmVsKTtcblx0XHRsZXZlbC5zZXRSb29tKHNwZWNzLnN0YXJ0aW5nTG9jYXRpb24ueCwgc3BlY3Muc3RhcnRpbmdMb2NhdGlvbi55LTEsIGFub3RoZXJSb29tKTtcblx0XHRyZXR1cm4gbGV2ZWw7XG5cdH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gRHVuZ2VvbkdlbmVyYXRvcjsiLCJmdW5jdGlvbiBMZXZlbCh3LCBoLCBkZXB0aCl7XG5cdHRoaXMubWFwID0gbnVsbDtcblx0dGhpcy5yb29tcyA9IG51bGw7XG5cdHRoaXMuaW5pdCh3LCBoLCBkZXB0aCk7XG59XG5cbkxldmVsLnByb3RvdHlwZSA9IHtcblx0aW5pdDogZnVuY3Rpb24odywgaCwgZGVwdGgpe1xuXHRcdHRoaXMubWFwID0gW107XG5cdFx0dGhpcy5yb29tcyA9IFtdO1xuXHRcdGZvciAodmFyIHggPSAwOyB4IDwgdzsgeCsrKXtcblx0XHRcdHRoaXMubWFwW3hdID0gW107XG5cdFx0XHRmb3IgKHZhciB5ID0gMDsgeSA8IGg7IHkrKyl7XG5cdFx0XHRcdHRoaXMubWFwW3hdW3ldID0gbnVsbDtcblx0XHRcdH1cblx0XHR9XG5cdH0sXG5cdHNldFJvb206IGZ1bmN0aW9uKHgsIHksIHJvb20pe1xuXHRcdHJvb20ubG9jYXRlKHgseSk7XG5cdFx0dGhpcy5tYXBbeF1beV0gPSByb29tO1xuXHRcdHRoaXMucm9vbXMucHVzaChyb29tKTtcblx0fSxcblx0Z2V0Um9vbTogZnVuY3Rpb24obG9jYXRpb24pe1xuXHRcdHJldHVybiB0aGlzLm1hcFtsb2NhdGlvbi54XVtsb2NhdGlvbi55XTtcblx0fVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IExldmVsOyIsInZhciBQYXJ0eSA9IHtcblx0bG9jYXRpb246IHtcblx0XHR4OiBudWxsLFxuXHRcdHk6IG51bGxcblx0fSxcblx0bGV2ZWw6IG51bGwsXG5cdGluaXQ6IGZ1bmN0aW9uKHNwZWNzKXtcblx0XHR0aGlzLnNwZWNzID0gc3BlY3M7XG5cdH0sXG5cdGxvY2F0ZTogZnVuY3Rpb24oeCwgeSl7XG5cdFx0dGhpcy5sb2NhdGlvbi54ID0geDtcblx0XHR0aGlzLmxvY2F0aW9uLnkgPSB5O1xuXHR9LFxuXHRzZXRMZXZlbDogZnVuY3Rpb24obGV2ZWwpe1xuXHRcdHRoaXMubGV2ZWwgPSBsZXZlbDtcblx0fSxcblx0Z2V0Q3VycmVudFJvb206IGZ1bmN0aW9uKCl7XG5cdFx0cmV0dXJuIHRoaXMubGV2ZWwuZ2V0Um9vbSh0aGlzLmxvY2F0aW9uKTtcblx0fSxcblx0bW92ZTogZnVuY3Rpb24oZHgsIGR5KXtcblx0XHR0aGlzLmxvY2F0aW9uLnggKz0gZHg7XG5cdFx0dGhpcy5sb2NhdGlvbi55ICs9IGR5O1xuXHRcdGNvbnNvbGUubG9nKHRoaXMubG9jYXRpb24pO1xuXHR9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gUGFydHk7IiwiZnVuY3Rpb24gUm9vbShsZXZlbCwgZmVhdHVyZXMpe1xuXHR0aGlzLmxldmVsID0gbnVsbDtcblx0dGhpcy5lbmVtaWVzID0gbnVsbDtcblx0dGhpcy5pdGVtcyA9IG51bGw7XG5cdHRoaXMuZmVhdHVyZXMgPSBudWxsO1xuXHR0aGlzLmRlc2NyaXB0aW9uID0gbnVsbDtcblx0dGhpcy54ID0gbnVsbDtcblx0dGhpcy55ID0gbnVsbDtcblx0dGhpcy5pbml0KGxldmVsLCBmZWF0dXJlcyk7XG59XG5cblJvb20ucHJvdG90eXBlID0ge1xuXHRpbml0OiBmdW5jdGlvbihsZXZlbCwgZmVhdHVyZXMpe1xuXHRcdHRoaXMubGV2ZWwgPSBsZXZlbDtcblx0XHR0aGlzLmRlc2NyaXB0aW9uID0gZmVhdHVyZXMuZGVzY3JpcHRpb247XG5cdFx0dGhpcy5lbmVtaWVzID0gZmVhdHVyZXMuZW5lbWllcztcblx0XHR0aGlzLml0ZW1zID0gZmVhdHVyZXMuaXRlbXM7XG5cdFx0dGhpcy5mZWF0dXJlcyA9IGZlYXR1cmVzLmZlYXR1cmVzO1xuXHR9LFxuXHRsb2NhdGU6IGZ1bmN0aW9uKHgsIHkpe1xuXHRcdHRoaXMueCA9IHg7XG5cdFx0dGhpcy55ID0geTtcblx0fVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFJvb207IiwidmFyIFJvb20gPSByZXF1aXJlKCcuL1Jvb20uY2xhc3MnKTtcblxudmFyIFJvb21HZW5lcmF0b3IgPSB7XG5cdGdlbmVyYXRlUm9vbTogZnVuY3Rpb24obGV2ZWwpe1xuXHRcdHJldHVybiBuZXcgUm9vbShsZXZlbCwge1x0XG5cdFx0XHRkZXNjcmlwdGlvbjogXCJUbyB0aGUgbm9ydGggaXMgdGhlIGVudHJhbmNlIHRvIHRoZSBBYnlzc1wiLFxuXHRcdFx0aXRlbXM6IFtdLFxuXHRcdFx0ZW5lbWllczogW10sXG5cdFx0XHRmZWF0dXJlczogW11cblx0XHR9KTtcblx0fVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBSb29tR2VuZXJhdG9yOyIsInZhciBQYXJ0eSA9IHJlcXVpcmUoJy4vUGFydHknKTtcblxudmFyIFVJID0ge1xuXHRtYXBDYW52YXM6IG51bGwsXG5cdGluaXQ6IGZ1bmN0aW9uKCl7XG5cdFx0dGhpcy5tYXBDYW52YXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWFwQ2FudmFzJyk7XG5cdFx0dGhpcy5tYXBDYW52YXNDdHggPSB0aGlzLm1hcENhbnZhcy5nZXRDb250ZXh0KFwiMmRcIik7XG5cdFx0dmFyIHNVSSA9IHRoaXM7XG5cdFx0d2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShmdW5jdGlvbigpe1xuXHRcdFx0c1VJLnVwZGF0ZSgpO1xuXHRcdH0pO1xuXHR9LFxuXHR1cGRhdGU6IGZ1bmN0aW9uKCl7XG5cdFx0dmFyIGN0eCA9IHRoaXMubWFwQ2FudmFzQ3R4O1xuXHRcdHZhciBsZXZlbCA9IFBhcnR5LmxldmVsO1xuXHRcdHZhciBzY2FsZSA9IDUwO1xuXHRcdHZhciBzaXplID0gNTA7XG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBsZXZlbC5yb29tcy5sZW5ndGg7IGkrKyl7XG5cdFx0XHR2YXIgcm9vbSA9IGxldmVsLnJvb21zW2ldO1xuXHRcdFx0aWYgKFBhcnR5LmxvY2F0aW9uLnggPT0gcm9vbS54ICYmIFBhcnR5LmxvY2F0aW9uLnkgPT0gcm9vbS55KXtcblx0XHRcdFx0Y3R4LmZpbGxTdHlsZSA9IFwiI0ZGMDAwMFwiO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Y3R4LmZpbGxTdHlsZSA9IFwiIzAwRkYwMFwiO1xuXHRcdFx0fVxuXHRcdFx0Y3R4LmZpbGxSZWN0KHJvb20ueCAqIHNjYWxlLCByb29tLnkgKiBzY2FsZSwgc2l6ZSwgc2l6ZSk7XG5cdFx0fVxuXHRcdHZhciBzVUkgPSB0aGlzO1xuXHRcdHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZnVuY3Rpb24oKXtcblx0XHRcdHNVSS51cGRhdGUoKTtcblx0XHR9KTtcblx0fSxcblx0c3RhcnRHYW1lOiBmdW5jdGlvbigpe1xuXHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCduZXdHYW1lJykuc3R5bGUuZGlzcGxheSA9ICdub25lJztcblx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbW92ZW1lbnRCdXR0b25zJykuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG5cdH0sXG5cdHVwZGF0ZVJvb21EYXRhOiBmdW5jdGlvbihyb29tKXtcblx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncm9vbURlc2NyaXB0aW9uJykuaW5uZXJIVE1MID0gcm9vbS5kZXNjcmlwdGlvbjtcblx0XHRpZiAocm9vbS5lbmVtaWVzLmxlbmd0aCA9PSAwKXtcblx0XHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyb29tRW5lbWllcycpLmlubmVySFRNTCA9ICdObyBlbmVtaWVzJztcblx0XHR9IGVsc2Uge1xuXHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Jvb21FbmVtaWVzJykuaW5uZXJIVE1MID0gdGhpcy5fYnVpbGRMaXN0KHJvb20uZW5lbWllcywgXG5cdFx0XHRcdGZ1bmN0aW9uKGVsZW1lbnQpe1xuXHRcdFx0XHRcdHJldHVybiBlbGVtZW50LnJhY2VOYW1lO1xuXHRcdFx0XHR9XG5cdFx0XHQpO1xuXHRcdH1cblx0XHRpZiAocm9vbS5pdGVtcy5sZW5ndGggPT0gMCl7XG5cdFx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncm9vbUl0ZW1zJykuaW5uZXJIVE1MID0gJ05vIGl0ZW1zJztcblx0XHR9IGVsc2Uge1xuXHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Jvb21JdGVtcycpLmlubmVySFRNTCA9IHRoaXMuX2J1aWxkTGlzdChyb29tLml0ZW1zLCBcblx0XHRcdFx0ZnVuY3Rpb24oZWxlbWVudCl7XG5cdFx0XHRcdFx0cmV0dXJuIGVsZW1lbnQuZGVzY3JpcHRpb247XG5cdFx0XHRcdH1cblx0XHRcdCk7XG5cdFx0fVxuXHRcdGlmIChyb29tLmZlYXR1cmVzLmxlbmd0aCA9PSAwKXtcblx0XHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd1c2VJdGVtcycpLmlubmVySFRNTCA9ICdObyBmZWF0dXJlcyB0byB1c2UgaXRlbXMgb24nO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndXNlSXRlbXMnKS5pbm5lckhUTUwgPSB0aGlzLl9idWlsZExpc3Qocm9vbS5mZWF0dXJlcywgXG5cdFx0XHRcdGZ1bmN0aW9uKGVsZW1lbnQpe1xuXHRcdFx0XHRcdHJldHVybiBlbGVtZW50LmRlc2NyaXB0aW9uO1xuXHRcdFx0XHR9XG5cdFx0XHQpO1xuXHRcdH1cblx0fSxcblx0X2J1aWxkTGlzdDogZnVuY3Rpb24oYXJyLCByZW5kZXJlcil7XG5cdFx0dmFyIGh0bWwgPSAnPHVsPic7XG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBhcnIubGVuZ3RoOyBpKyspe1xuXHRcdFx0aHRtbCArPSAnPGxpPicrcmVuZGVyZXIoYXJyW2ldKSsnPC9saT4nO1xuXHRcdH1cblxuXHRcdGh0bWwgKz0gJzwvdWw+Jztcblx0fVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBVSTsiLCJ2YXIgVUkgPSByZXF1aXJlKCcuL1VJJylcbnZhciBEdW5nZW9uR2VuZXJhdG9yID0gcmVxdWlyZSgnLi9EdW5nZW9uR2VuZXJhdG9yJylcbnZhciBQYXJ0eSA9IHJlcXVpcmUoJy4vUGFydHknKVxuXG52YXIgVmlydHVhbER1bmdlb24gPSB7XG5cdGluaXQ6IGZ1bmN0aW9uKCl7XG5cdFx0Y29uc29sZS5sb2coXCJJbml0aWFsaXppbmcgVmlydHVhbER1bmdlb25cIik7XG5cdH0sXG5cdHN0YXJ0R2FtZTogZnVuY3Rpb24oY29uZmlnKXtcblx0XHRjb25zb2xlLmxvZyhcIk5ldyBHYW1lLCBjb25maWdcIiwgY29uZmlnKTtcblx0XHR0aGlzLmNvbmZpZyA9IGNvbmZpZztcblx0XHRQYXJ0eS5pbml0KHtcblx0XHRcdHNpemU6IGNvbmZpZy5wYXJ0eVNpemVcblx0XHR9KTtcblx0XHRQYXJ0eS5sb2NhdGUoTWF0aC5mbG9vcihjb25maWcuZHVuZ2VvblNpemUudyAvIDIpLCBNYXRoLmZsb29yKGNvbmZpZy5kdW5nZW9uU2l6ZS5oIC8gMikpO1xuXHRcdHZhciBsZXZlbCA9IER1bmdlb25HZW5lcmF0b3IuZ2VuZXJhdGVMZXZlbCh7XG5cdFx0XHR3OiBjb25maWcuZHVuZ2VvblNpemUudyxcblx0XHRcdGg6IGNvbmZpZy5kdW5nZW9uU2l6ZS5oLFxuXHRcdFx0ZGVwdGg6IDEsXG5cdFx0XHRzdGFydGluZ0xvY2F0aW9uOiBQYXJ0eS5sb2NhdGlvblxuXHRcdH0pO1xuXHRcdFBhcnR5LnNldExldmVsKGxldmVsKTtcblx0XHRjb25zb2xlLmxvZyhcIkxldmVsXCIsIGxldmVsKTtcblx0XHRjb25zb2xlLmxvZyhcIlBhcnR5XCIsIFBhcnR5KTtcblx0XHRVSS5pbml0KCk7XG5cdFx0VUkuc3RhcnRHYW1lKCk7XG5cdFx0VUkudXBkYXRlUm9vbURhdGEoUGFydHkuZ2V0Q3VycmVudFJvb20oKSk7XG5cdH0sXG5cdG1vdmU6IGZ1bmN0aW9uKGR4LCBkeSl7XG5cdFx0UGFydHkubW92ZShkeCwgZHkpO1xuXHR9XG59O1xuXG53aW5kb3cuVmlydHVhbER1bmdlb24gPSBWaXJ0dWFsRHVuZ2VvbjtcblxubW9kdWxlLmV4cG9ydHMgPSBWaXJ0dWFsRHVuZ2VvbjsiXX0=
