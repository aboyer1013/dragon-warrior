ig.module('game.entities.enemy')
.requires('game.entities.character')
.defines(function () {
	ig.global.EntityEnemy = ig.global.EntityCharacter.extend({
		init: function (x, y, settings) {
			this.parent(x, y, settings);
		}
	});
});