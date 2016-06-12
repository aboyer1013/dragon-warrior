ig.module('game.entities.npc')
.requires('game.entities.character')
.defines(function () {
	ig.global.EntityNpc = ig.global.EntityCharacter.extend({
		init: function (x, y, settings) {
			this.parent(x, y, settings);
		}
	});
});