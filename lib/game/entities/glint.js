ig.module('game.entities.glint')
	.requires(
		'game.entities.entity'
	)
	.defines(function () {
		ig.global.Glint = ig.global.Entity.extend({
			collides: ig.Entity.COLLIDES.NEVER,
			size: {x: 36, y: 60},
			animSheet: new ig.AnimationSheet('media/title-glint.png', 36, 60),
			init: function (x, y, settings) {
				this.parent(x, y, settings);

				this.addAnim('slow', Data.frameSpeed, [0,1,1,2,2,2,2,3,3,3,4,4,4,4,4,4,3,3,3,3,2,2,1,1], true);
				this.addAnim('idle', Data.frameSpeed, _.fill(Array(104), 0), true);
				this.addAnim('fast', Data.frameSpeed, [0,1,2,2,3,3,4,4,4,3,2,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,3,3,4,4,4,3,2,1,0], true);
				this.animRotation = ['slow', 'idle', 'fast', 'idle'];
				this.currentAnim = this.getNextAnim();

			},
			update: function () {
				this.parent();
				if (this.currentAnim.loopCount) {
					this.currentAnim = this.getNextAnim();
				}
			},
		});
	});
