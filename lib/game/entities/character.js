ig.module('game.entities.character')
.requires(
	'game.entities.entity',
	'plugins.gridmovement'
)
.defines(function () {
	ig.global.EntityCharacter = ig.global.Entity.extend({
		type: ig.Entity.TYPE.BOTH,
		checkAgainst: ig.Entity.TYPE.BOTH,
		collides: ig.Entity.COLLIDES.FIXED,
		bounciness: 0,
		size: {x: 16, y: 16},
		avatar: 'hero',
		moveTypeReverseMap: {
			1: 'UP',
			8: 'RIGHT',
			2: 'DOWN',
			4: 'LEFT'
		},
		animSheet: new ig.AnimationSheet('media/chars.png', 16, 16),
		init: function (x, y, settings) {
			this.parent(x, y, settings);
			this.movement = new ig.global.GridMovement(this);
			this.movement.speed.x = this.movement.speed.y = 60;
			this.avatar = this.avatar || this.name;
			this.initAnims(this.direction);
		},
		update: function () {

			if (this.movement.direction) {
				this.currentAnim = this.anims[this.moveTypeReverseMap[this.movement.direction]];
			}
			this.movement.update();
			this.parent();
		},
		check: function () {
			this.movement.collision();
		},
		initAnims: function (defaultAnim) {
			var anims = [];
			var animName;

			switch (this.avatar) {
				case 'hero':
					anims = [
						{name: 'UP', frames: [36,48]},
						{name: 'RIGHT', frames: [60,72]},
						{name: 'DOWN', frames: [84,96]},
						{name: 'LEFT', frames: [108,120]}
					];
					break;
				case 'king':
					anims = [
						{name: 'DOWN', frames: [37,49]}
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
		}
	});
});