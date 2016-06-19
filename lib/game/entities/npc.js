ig.module('game.entities.npc')
.requires('game.entities.character')
.defines(function () {
	ig.global.EntityNpc = ig.global.EntityCharacter.extend({
		collides: ig.Entity.COLLIDES.FIXED,
		init: function (x, y, settings) {
			this.parent(x, y, settings);
			this.delayTime = Data.frameSpeed * 70;
			this.delay = new ig.Timer(this.delayTime);
		},
		update: function () {
			var directions = ['UP', 'RIGHT', 'DOWN', 'LEFT'];

			this.parent();
			if (!this.isStationary) {
				if (this.delay.delta() > 0) {
					this.movement.direction = ig.global.GridMovement.moveType[directions[_.random(0, 3)]];
					this.delay.set(this.delayTime);
				}
			}
		}
	});
});