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
	this.job = party.controller.scenario.getJob(specs.job);
	this.number = specs.number;
	this.hitPoints = this.job.str;
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
		var line = '<b>'+this.name+'</b> HP: '+this.hitPoints;

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
	takeInjury: function(bodyPart){
		this.sustainInjury(bodyPart);
		this.hitPoints --;
	}
}

module.exports = Player;