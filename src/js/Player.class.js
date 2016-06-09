var Utils = require('./Utils');
var Stat = require('./Stat.class'); 

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
	this.job = party.controller.scenario.getJob(specs.job);
	this.number = specs.number;
	this.hitPoints = new Stat(this.job.str);
	this.magicPoints = new Stat(this.job.magic);
};

Player.LEFT = 'left';
Player.RIGHT = 'right';
Player.ARM = 'arm';
Player.LEG = 'leg';

Player.TORSO = 'torso';
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
Player.BODY_PART_NAMES[Player.TORSO] = 'Torso';
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

Player.AILMENT_RECOVERY = {};
Player.AILMENT_RECOVERY[Player.UNCONSCIOUS] = 'recovers consciousness';
Player.AILMENT_RECOVERY[Player.BLIND] = 'can see again';
Player.AILMENT_RECOVERY[Player.PARALYZED] = 'can move again';
Player.AILMENT_RECOVERY[Player.ASLEEP] = 'wakes up';
Player.AILMENT_RECOVERY[Player.POISONED] = 'is no longer poisoned';
Player.AILMENT_RECOVERY[Player.MUTE] = 'can speak again';
Player.AILMENT_RECOVERY[Player.CLAMPED] = 'frees from the trap';

Player.AILMENT_NAMES = {};
Player.AILMENT_NAMES[Player.UNCONSCIOUS] = 'Unconscious';
Player.AILMENT_NAMES[Player.BLIND] = 'Blind';
Player.AILMENT_NAMES[Player.PARALYZED] = 'Paralyzed';
Player.AILMENT_NAMES[Player.ASLEEP] = 'Asleep';
Player.AILMENT_NAMES[Player.POISONED] = 'Poisoned';
Player.AILMENT_NAMES[Player.MUTE] = 'Mute';
Player.AILMENT_NAMES[Player.CLAMPED] = 'Clamped';

Player.AILMENT_CODES = {};
Player.AILMENT_CODES[Player.UNCONSCIOUS] = 'UN';
Player.AILMENT_CODES[Player.BLIND] = 'BL';
Player.AILMENT_CODES[Player.PARALYZED] = 'PA';
Player.AILMENT_CODES[Player.ASLEEP] = 'SL';
Player.AILMENT_CODES[Player.POISONED] = 'PO';
Player.AILMENT_CODES[Player.MUTE] = 'MU';
Player.AILMENT_CODES[Player.CLAMPED] = 'CL';


Player.prototype = {
	sustainInjury: function(bodyPart, turns){
		if (!turns){
			turns = Utils.rand(3, 6); 
		}
		this.injuredMap[bodyPart] = {turns: turns};
	},
	applyAilment: function(ailment, turns){
		if (!turns){
			turns = Utils.rand(3, 6); 
		}
		var currentAilment = this.getAilment(ailment);
		if  (currentAilment){
			currentAilment.turns = turns;
		} else {		
			this.statusAilments.push({
				ailment: ailment,
				turns: turns
			});
		}
		this.party.controller.ui.showMessage(this.name +' '+ Player.AILMENT_EFFECTS[ailment]);
	},
	turnHeal: function(){
		for (bodyPart in this.injuredMap){
			if (this.injuredMap[bodyPart] && --this.injuredMap[bodyPart].turns <= 0){
				this.party.controller.ui.showMessage(this.name +'\'s '+Player.BODY_PART_NAMES[bodyPart]+' is no longer injured.');
				this.injuredMap[bodyPart] = false;
			}
		}
		for (var i = 0; i < this.statusAilments.length; i++){
			if (--this.statusAilments[i].turns <= 0){
				this.party.controller.ui.showMessage(this.name +' '+ Player.AILMENT_RECOVERY[this.statusAilments[i].ailment]);
				this.statusAilments.splice(i,1);
				i--;
			}
		}
	},
	getAilment: function(ailment){
		for (var i = 0; i < this.statusAilments.length; i++){
			if (this.statusAilments[i].ailment === ailment){
				return this.statusAilments[i];
			}
		}
		return false;
	},
	passTurn: function(){
		this.turnHeal();
		if (Utils.chance(20)){
			this.magicPoints.recover(1);
		}
		if (this.getAilment(Player.POISONED)){
			if (Utils.chance(40)){
				this.takeDamage(1);
			}
		}
	},
	evadesTrap: function(){
		var evadeChance = this.job.dex * 2;
		if (this.injuredMap[Player.LEFT_LEG]){
			evadeChance = Math.round(evadeChance / 2);
		}
		if (this.injuredMap[Player.RIGHT_LEG]){
			evadeChance = Math.round(evadeChance / 2);
		}
		return Utils.chance(evadeChance);
	},
	getStatusLine: function(){
		var line = '<b>'+this.name+'</b> HP: '+this.hitPoints.current+' MP: '+this.magicPoints.current;

		for (var i = 0; i < this.statusAilments.length; i++){
			line += ' ' + Player.AILMENT_NAMES[this.statusAilments[i].ailment];
		}
		var injuries = '';
		for (bodyPart in this.injuredMap){
			if (this.injuredMap[bodyPart]){
				injuries += Player.BODY_PART_NAMES[bodyPart]+' ';
			}
		}
		if (injuries !== ''){
			line += ' Injuries: '+injuries;
		}
		if (this.statusAilments.length == 0 && injuries === ''){
			line += ' OK';
		}
		return line;
	},
	getAilmentsCode: function(){
		var line = '';
		for (var i = 0; i < this.statusAilments.length; i++){
			line += Player.AILMENT_CODES[this.statusAilments[i].ailment];
		}
		return line;
	},
	takeInjury: function(bodyPart){
		this.sustainInjury(bodyPart);
		this.takeDamage(1);
	},
	takeDamage: function(damage){
		this.hitPoints.reduce(damage);
		this.party.checkGameOver();
	},
	heal: function(bodyPart, healing){
		this.injuredMap[bodyPart] = false;
		this.hitPoints.recover(healing);
	},
	recoverHP: function(healing){
		this.hitPoints.recover(healing);
		this.party.controller.ui.showMessage(this.name +' recovers '+healing+' hit points.');
	},
	cureAilments: function(){
		this.statusAilments = [];
	},
	cureAilment: function(ailment){
		for (var i = 0; i < this.statusAilments.length; i++){
			if (this.statusAilments[i].ailment === ailment){
				this.statusAilments.splice(i,1);
				return;
			}
		}
	},
	revive: function(){
		if (this.hitPoints.current <= 0)
			this.hitPoints.current = 1;
	},
	drinkFromFountain: function(){
		switch (Utils.randSplit([0.3, 0.2, 0.1, 0.2, 0.2])){
			case 0:
				this.party.controller.ui.showMessage('"Ahh-Refreshing!" '+ this.name +' recovers 5 hit points.');
				this.hitPoints.recover(5);
				break;
			case 1:
				this.party.controller.ui.showMessage('"Hmm--Delicious!" '+ this.name +' recovers from all ailments.');
				this.cureAilments();
				break;
			case 2:
				this.party.controller.ui.showMessage('"Bleck--Nasty!" '+ this.name +' is hurt by acid for 3 hit points.');
				this.takeDamage(3);
				break;
			case 3:
				this.party.controller.ui.showMessage('"Argh-Choke-Gasp!" '+ this.name +' is poisoned.');
				this.applyAilment(Player.POISONED);
				break;
			case 4:
				this.party.controller.ui.showMessage('"Hmm--No Effect!"');
				break;
		}
	},
	castSpell: function(spell, params){
		this.party.controller.ui.showMessage(this.name+ ' casts '+spell.name+'.');
		switch (spell.effect){
			case 'removeAilmentFromAll':
				this.party.controller.ui.showMessage('All party members are healed from '+spell.param+'.');
				this.party.cureAilment(spell.param);
				break;
			case 'removeAllAilments':
				this.party.controller.ui.showMessage(params.spellTarget.name+' is cured from all ailments.');
				params.spellTarget.cureAilments();
				break;
			case 'openChest':
				var chest = this.party.getCurrentRoom().getFeature('chest');
				if (chest){
					if (Utils.chance(50)){
						this.party.controller.ui.showMessage('"Click!" a bomb trap is disarmed.');
					} else {
						this.party.controller.ui.showMessage('The chest is unlocked.');
					}
					chest.unlocked = true;
				} else {
					this.party.controller.ui.showMessage('Nothing happens.');
				}
				break;
			case 'heal':
				this.party.controller.ui.showMessage(params.spellTarget.name+' heals '+spell.param);
				params.spellTarget.heal(params.bodyPart, spell.param);
				break;
			case 'counter':
				var counter = {
					time: spell.param.time,
					message: '',
					offMessage: ''
				}
				if (spell.targeted){
					var name = params.spellTarget.name;
					if (!name && params.spellTarget.race)
						name = params.spellTarget.race.name;
					counter.message = name + ' ';
					counter.offMessage = name + ' ';
				}
				counter.message += spell.param.message;
				counter.offMessage += spell.param.offMessage;
				this.party.controller.addCounter(counter);
				break;
			case 'blink':
				this.party.blink(params.direction);
				break;
			case 'removeField':
				var corridor = this.party.getCurrentRoom().corridors[params.direction];
				if (corridor && corridor.obstacle){
					corridor.obstacle = null; // TODO: Only for fields when other type of obstacles implemented
					this.party.controller.ui.showMessage('The field disappears');
				} else {
					this.party.controller.ui.showMessage('Nothing happens');
				}
				break;
			case 'revivePlayer':
				this.party.controller.ui.showMessage(params.spellTarget.name+' is alive');
				if (params.spellTarget.hitPoints.current <= 0)
					params.spellTarget.revive();
				break;
		}
		this.spendMP(spell.cost);
	},
	spendMP: function(points){
		this.magicPoints.reduce(points);
	},
	openChest: function(){
		var chest = this.party.getCurrentRoom().getFeature('chest');
		if (!chest.unlocked && Utils.chance(50)){
			this.party.controller.ui.showMessage('The chest is trapped! BOOM!');
			this.sustainInjury((Utils.chance(50) ? Player.LEFT : Player.RIGHT)+'-'+(Utils.chance(50) ? Player.ARM : Player.LEG));
		}
		this.party.controller.ui.showMessage('The chest contains a '+chest.item.name);
		this.party.addItem(chest.item);
	}
}

module.exports = Player;