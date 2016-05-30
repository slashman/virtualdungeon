module.exports = {
	enemies: [
		{name: 'Skeleton', from: 1, to: 2},
		{name: 'Headless', from: 1, to: 2},
		{name: 'Orc', from: 1, to: 3},
		{name: 'Rogue', from: 1, to: 3},
		{name: 'Troll', from: 2, to: 3},
		{name: 'Lava Lizard', from: 2, to: 4},
		{name: 'Ettin', from: 2, to: 4},
		{name: 'Daemon', from: 3, to: 4},
		{name: 'Cyclops', from: 3, to: 5},
		{name: 'Mage', from: 3, to: 5},
		{name: 'Liche', from: 4, to: 5},
		{name: 'Hydra', from: 4, to: 6},
		{name: 'Dragon', from: 5, to: 6},
		{name: 'Zorn', from: 5, to: 7},
		{name: 'Gazer', from: 6, to: 7},
		{name: 'Reaper', from: 6, to: 8},
		{name: 'Balron', from: 7, to: 8}
	],
	endRooms: {
		8: {
			name: 'Altar of Virtue',
			helpText: 'The stone of virtue is here. The player can pick it up and win the game. ' 
		}


	}
}