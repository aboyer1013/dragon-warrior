ig.module('game.entities.selector')
	.requires(
		'game.entities.entity'
	)
	.defines(function () {
		ig.global.Selector = ig.global.Entity.extend({
			collides: ig.Entity.COLLIDES.NEVER,
			init: function (x, y, settings) {
				this.parent(x, y, settings);
				this.sprite = new ig.Image('media/sprite.png');
			},
			update: function () {
				this.parent();
			},
			draw: function () {
			
			}
		});
	});
