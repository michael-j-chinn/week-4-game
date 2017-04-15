function Person() {
	this.selected = false;
	this.select = function () {
		this.selected = true;
	}
	this.deselect = function() {
		this.selected = false;
	}
	this.reset = function() {
		this.selected = false;
	}
}

function Player(name, img, touchdownGif, turnoverGif, yardsPerPlay, bigPlayModifier) {
	this.name = name;
	this.img = img;
	this.touchdownGif = touchdownGif;
	this.yardsPerPlay = yardsPerPlay;
	this.bigPlayModifier = bigPlayModifier;
	this.turnoverGif = turnoverGif;
}

function Opponent(name, img, turnoverModifier, defenseModifier) {
	this.name = name;
	this.img = img;
	this.turnoverModifier = turnoverModifier;
	this.defeated = false;
	this.defenseModifier = defenseModifier;
	this.reset = function() {
		this.selected = false;
		this.defeated = false;
	}
}

Player.prototype = new Person();
Opponent.prototype = new Person();