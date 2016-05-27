module.exports = {
	jobs: [
		{name: 'Bard', str: 10, magic: 10, dex: 30},
		{name: 'Druid', str: 10, magic: 20, dex: 20},
		{name: 'Mage', str: 10, magic: 30, dex: 10},
		{name: 'Paladin', str: 20, magic: 20, dex: 10},
		{name: 'Fighter', str: 30, magic: 10, dex: 10},
		{name: 'Tinker', str: 20, magic: 10, dex: 20},
		{name: 'Shepherd', str: 10, magic: 10, dex: 10},
		{name: 'Ranger', str: 15, magic: 15, dex: 20}
	],
	spells: [
		{ name: 'Awaken', cost: 1, words: 'AN ZU', description: 'Causes all Asleep members in the party to recover.' },
		{ name: 'Cure', cost: 1, words: '', description: 'Removes status ailments from a single party member (not injuries).' },
		{ name: 'Magic Missile', cost: 1, words: '', description: 'Causes 2 points of physical damage.' },
		{ name: 'Open', cost: 1, words: 'AN SANCT', description: 'Opens a chest content without triggering any trap.' },
		{ name: 'Heal', cost: 3, words: '', description: 'Recovers 3 hit points and cures injury on a single body part.' },
		{ name: 'Protection', cost: 3, words: 'UUS SANCT', description: 'Renders a player invincible for 30 seconds. ' },
		{ name: 'Fireball', cost: 3, words: '', description: 'Causes 5 points of fire damage.' },
		{ name: 'Blink', cost: 3, words: '', description: 'Teleports the party to a nearby room in a given direction without triggering any traps. Cannot be used in battle.' },
		{ name: 'Sleep', cost: 3, words: 'IN ZU', description: 'Causes an enemy to sleep for 30 seconds.' },
		{ name: 'Repel Undead', cost: 3, words: 'AN XEN CORP', description: 'Causes 5 points of holy damage to all undead enemies' },
		{ name: 'Peer', cost: 3, words: 'VAS WIS', description: 'Allows the caster to see the dungeon map for 5 seconds. Cannot be used in battle.' },
		{ name: 'Quickness', cost: 4, words: 'REL TYM', description: 'Make all enemies moves slowly for 30 seconds.' },
		{ name: 'Dispel', cost: 4, words: '', description: 'Removes a fire or energy field from a corridor. Cannot be used in battle.' },
		{ name: 'Iceball', cost: 4, words: '', description: 'Causes 5 points of ice damage.' },
		{ name: 'Negate Magic', cost: 4, words: 'AN ORT', description: 'Prevents all magic spells for 1 minute.' },
		{ name: 'Kill', cost: 5, words: '', description: 'Strikes an enemy with a deadly ray of energy.' },
		{ name: 'Jinx', cost: 6, words: 'VAS AN XEN EX', description: 'Turns an enemy into an ally temporarily for 30 seconds.' },
		{ name: 'Resurrect', cost: 7, words: 'IN MANI CORP', description: 'Revives a player with 1 HP.' },
		{ name: 'Tremor', cost: 6, words: 'VAS POR YLEM', description: 'Causes 5 points of physical damage to all non-flying enemies' }
	]
};