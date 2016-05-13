function bootstrap(){
	window.VirtualDungeon.init();
	bindEvents();
}

function startGame(){
	var partySize = parseInt(document.getElementById('txtPartySize').value);
	var dungeonW = parseInt(document.getElementById('txtDungeonW').value);
	var dungeonH = parseInt(document.getElementById('txtDungeonH').value);
	window.VirtualDungeon.startGame({
		partySize: partySize,
		dungeonSize: {
			w: dungeonW,
			h: dungeonH
		}
	});
	return false;
}

function bindEvents(){
	document.getElementById('btnMoveNorth').addEventListener('click', function() {
	  move(0,-1);
	});
	document.getElementById('btnMoveSouth').addEventListener('click', function() {
	  move(0,1);
	});
	document.getElementById('btnMoveWest').addEventListener('click', function() {
	  move(-1,0);
	});
	document.getElementById('btnMoveEast').addEventListener('click', function() {
	  move(1,0);
	});
	document.getElementById('btnStartGame').addEventListener('click', function() {
	  startGame();
	});
}

function move(dx, dy){
	window.VirtualDungeon.move(dx, dy);
}