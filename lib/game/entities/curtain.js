ig.module('game.entities.curtain')
	.requires(
		'impact.entity'
	)
	.defines(function () {
		ig.global.TextBox = ig.Entity.extend({
			collides: ig.Entity.COLLIDES.NEVER,
			// animSheet: new ig.AnimationSheet('media/title-glint.png', 36, 60),
			init: function (x, y, settings) {
				this.parent(x, y, settings);
			},
			update: function () {
				this.parent();
			},
			draw: function () {

			}
		});
	});
