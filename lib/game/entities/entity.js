// Base class
ig.module('game.entities.entity')
	.requires(
		'impact.entity'
	)
	.defines(function () {
		ig.global.Entity = ig.Entity.extend({
			collides: ig.Entity.COLLIDES.NEVER,
			size: {x: 8, y: 8},
			init: function (x, y, settings) {
				this.parent(x, y, settings);

			},
			getNextAnim: function () {
				if (this.animRotation) {
					if (this.animRotation.length === 1) {
						return this.anims[_.head(this.animRotation)];
					} else if (this.animRotation.length > 1) {
						this.animRotation.push(_.head(this.animRotation));
						return this.anims[this.animRotation.shift()].rewind();
					}
				}
				return null;
			},
			update: function () {
				this.parent();
			}
		});
	});
