function bootstrap(){
	window.VirtualDungeon.init();
}

function startGame(){
	var dungeonW = parseInt(document.getElementById('txtDungeonW').value);
	var dungeonH = parseInt(document.getElementById('txtDungeonH').value);
	var roomDensity = document.getElementById('cmbRoomDensity').value;
	window.VirtualDungeon.startGame({
		dungeonSize: {
			w: dungeonW,
			h: dungeonH
		},
		roomDensity: roomDensity 
	});
	return false;
}

function move(dx, dy){
	window.VirtualDungeon.move(dx, dy);
}