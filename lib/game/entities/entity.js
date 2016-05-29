// Base class
ig.module('game.entities.entity')
	.requires(
		'impact.entity'
	)
	.defines(function () {
		ig.global.Entity = ig.Entity.extend({
			collides: ig.Entity.COLLIDES.NEVER,
			init: function (x, y, settings) {
				this.parent(x, y, settings);
			},
			getNextAnim: function () {
				if (this.animRotation && this.animRotation.length) {
					this.animRotation.push(_.head(this.animRotation));
					return this.anims[this.animRotation.shift()].rewind();
				}
				return null;
			},
			update: function () {
				this.parent();
			},
		});
	});
