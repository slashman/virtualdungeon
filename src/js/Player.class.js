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

Player.AILMENT_RECOVERY = {};
Player.AILMENT_RECOVERY[Player.UNCONSCIOUS] = 'recovers consciousness';
Player.AILMENT_RECOVERY[Player.BLIND] = 'can see again';
Player.AILMENT_RECOVERY[Player.PARALYZED] = 'can move again';
Player.AILMENT_RECOVERY[Player.ASLEEP] = 'wakes up';
Player.AILMENT_RECOVERY[Player.POISONED] = 'is no longer poisoned';
Player.AILMENT_RECOVERY[Player.MUTE] = 'can speak again';
Player.AILMENT_RECOVERY[Player.CLAMPED] = 'frees from the trap';

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
		this.statusAilments.push({
			ailment: ailment,
			turns: turns
		});
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
	passTurn: function(){
		this.turnHeal();
	}
}

module.exports = Player;