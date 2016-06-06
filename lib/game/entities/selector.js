ig.module('game.entities.selector')
	.requires(
		'game.entities.entity'
	)
	.defines(function () {
		ig.global.Selector = ig.global.Entity.extend({
			size: {x: 8, y: 8},
			init: function (x, y, settings) {
				this.isHidden = true;
				this.name = 'selector';
				this.animSheet = new ig.AnimationSheet('media/sprite.png', 8, 8);
				this.addAnim('hidden', Data.frameSpeed, [0], true);
				this.addAnim('blinking', Data.frameSpeed * 16, [4,0]);
				this.addAnim('solid', Data.frameSpeed, [4], true);
				this.parent(x, y, settings);
				this.currentAnim = this.anims.blinking;
			},
			update: function () {
				this.parent();
			},
			draw: function () {
				if (!this.isHidden) {
					this.parent();
				}

			}
		});
	});
