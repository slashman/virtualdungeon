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
		{ name: 'Awaken', cost: 1, words: 'AN ZU', description: 'Causes all Asleep members in the party to recover.', effect: 'removeAilmentFromAll', param: 'asleep' },
		{ name: 'Cure', cost: 1, words: '', description: 'Removes status ailments from a single party member (not injuries).', effect: 'removeAllAilments', targetType: 'friend'},
		{ name: 'Magic Missile', cost: 1, words: '', description: 'Causes 2 points of physical damage.', effect: 'physical'},
		{ name: 'Open', cost: 1, words: 'AN SANCT', description: 'Opens a chest content without triggering any trap.', effect: 'openChest'},
		{ name: 'Heal', cost: 3, words: '', description: 'Recovers 3 hit points and cures injury on a single body part.', targeted: true, targetType: 'friendLimb', effect: 'heal', param: 3 },
		{ name: 'Protection', cost: 3, words: 'UUS SANCT', description: 'Renders a player invincible for 10 seconds. ', targeted: true, targetType: 'friend', effect: 'counter', param: {message: 'is invincible', offMessage: 'is no longer invincible', time: 10}},
		{ name: 'Fireball', cost: 3, words: '', description: 'Causes 3 points of fire damage.', effect: 'physical'},
		{ name: 'Blink', cost: 3, words: '', description: 'Teleports the party to a nearby room in a given direction without triggering any traps. Cannot be used in battle.', effect: 'blink', targetType: 'direction'},
		{ name: 'Sleep', cost: 3, words: 'IN ZU', description: 'Causes an enemy to sleep for 30 seconds.', targeted: true, targetType: 'enemy', physicalHitCheck: true, effect: 'counter', param: {message: 'is asleep', offMessage: 'wakes up', time: 30}},
		{ name: 'Repel Undead', cost: 3, words: 'AN XEN CORP', description: 'Causes 3 points of holy damage to all undead enemies', effect: 'physical'},
		{ name: 'Peer', cost: 3, words: 'VAS WIS', description: 'Allows the caster to see the dungeon map for 5 seconds. Cannot be used in battle.', effect: 'physical'},
		{ name: 'Quickness', cost: 4, words: 'REL TYM', description: 'Make all enemies moves slowly for 10 seconds.', effect: 'counter', param: {message: 'Party moves quickly!', offMessage: 'Quickness wears off!', time: 10}},
		{ name: 'Dispel', cost: 4, words: '', description: 'Removes a fire or energy field from a corridor. Cannot be used in battle.', effect: 'removeField', targetType: 'direction'},
		{ name: 'Iceball', cost: 4, words: '', description: 'Causes 3 points of ice damage.', effect: 'physical'},
		{ name: 'Negate Magic', cost: 4, words: 'AN ORT', description: 'Prevents all magic spells for 1 minute.', effect: 'counter', param: {message: 'Magic cannot be used!', offMessage: 'Magic can be used now!', time: 60}},
		{ name: 'Kill', cost: 5, words: '', description: 'Strikes an enemy with a deadly ray of energy.', effect: 'physical'},
		{ name: 'Jinx', cost: 6, words: 'VAS AN XEN EX', description: 'Turns an enemy into an ally temporarily for 30 seconds.',targeted: true, targetType: 'enemy', physicalHitCheck: true, effect: 'counter', param: {message: 'turns into an ally', offMessage: 'is an enemy again', time: 30}},
		{ name: 'Resurrect', cost: 7, words: 'IN MANI CORP', description: 'Revives a player with 1 HP.', effect: 'revivePlayer', targetType: 'friend'},
		{ name: 'Tremor', cost: 6, words: 'VAS POR YLEM', description: 'Causes 5 points of physical damage to all non-flying enemies', effect: 'physical'}
	],
	items: [
		{ name: 'Yellow Potion', effect: 'recoverHP', param: 5}
	]
};