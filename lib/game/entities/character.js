ig.module('game.entities.character')
.requires('game.entities.entity')
.defines(function () {
	ig.global.EntityCharacter = ig.global.Entity.extend({
		size: {x: 16, y: 16},
		direction: 'down',
		avatar: 'hero',
		animSheet: new ig.AnimationSheet('media/chars.png', 16, 16),
		init: function (x, y, settings) {
			this.parent(x, y, settings);
			this.avatar = this.avatar || this.name;
			this.initAnims(this.direction);
		},
		initAnims: function (defaultAnim) {
			var anims = [];
			var animName;

			switch (this.avatar) {
				case 'hero':
					anims = [
						{name: 'up', frames: [36,48]},
						{name: 'right', frames: [60,72]},
						{name: 'down', frames: [84,96]},
						{name: 'left', frames: [108,120]}
					];
					break;
				case 'king':
					anims = [
						{name: 'down', frames: [37,49]}
					];
				default:
					break;
			}
			_.forEach(anims, _.bind(function (animFrame) {
				this.addAnim(animFrame.name, Data.frameSpeed * 16, animFrame.frames);
			}, this));
			if (this.anims[defaultAnim]) {
				animName = defaultAnim;
			} else {
				animName = _.head(anims).name;
			}
			this.currentAnim = this.anims[animName];
		},
		move: function (direction) {
			switch (direction) {
				case 'up':
					this.currentAnim = this.anims.up;
					this.pos.y -= 16;
					break;
				case 'right':
					this.currentAnim = this.anims.right;
					this.pos.x += 16;
					break;
				case 'down':
					this.currentAnim = this.anims.down;
					this.pos.y += 16;
					break;
				case 'left':
					this.currentAnim = this.anims.left;
					this.pos.x -= 16;
					break;
				default:
					break;
			}

		},
	});
});