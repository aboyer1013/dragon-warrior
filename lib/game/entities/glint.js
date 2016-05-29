ig.module('game.entities.glint')
	.requires(
		'impact.entity'
	)
	.defines(function () {
		Glint = ig.Entity.extend({
			collides: ig.Entity.COLLIDES.NEVER,
			size: {x: 36, y: 60},
			animSheet: new ig.AnimationSheet('media/title-glint.png', 36, 60),
			init: function (x, y, settings) {
				var frameTime = 0.016666667;

				this.parent(x, y, settings);

				this.addAnim('slow', frameTime, [0,1,1,2,2,2,2,3,3,3,4,4,4,4,4,4,3,3,3,3,2,2,1,1], true);
				this.addAnim('idle', frameTime, _.fill(Array(104), 0), true);
				this.addAnim('fast', frameTime, [0,1,2,2,3,3,4,4,4,3,2,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,3,3,4,4,4,3,2,1,0], true);
				this.animRotation = ['slow', 'idle', 'fast', 'idle'];
				this.currentAnim = this.getNextAnim();

			},
			getNextAnim: function () {
				this.animRotation.push(_.head(this.animRotation));
				return this.anims[this.animRotation.shift()].rewind();
			},
			update: function () {
				this.parent();
				if (this.currentAnim.loopCount) {
					this.currentAnim = this.getNextAnim();
				}
			},
		});
	});
