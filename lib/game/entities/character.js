ig.module('game.entities.character')
.requires('game.entities.entity')
.defines(function () {
	ig.global.EntityCharacter = ig.global.Entity.extend({
		// collides:
		size: {x: 16, y: 16},
		direction: 'down',
		avatar: 'hero',
		animSheet: new ig.AnimationSheet('media/chars.png', 16, 16),
		init: function (x, y, settings) {
			this.parent(x, y, settings);
			this.avatar = this.avatar || this.name;
			this.standing = true;
			this.state = {
				movement: 'stopped'
			};
			this.initAnims(this.direction);
		},
		update: function () {
			if (this.state.movement === 'goingToStop') {
				this.finishMovement(this.state.direction);
			} else if (this.state.movement === 'stopped') {
				this.completeStop();
			}
			this.parent();
		},
		handleMovementTrace: function (result) {
			// if (this.state.movement === 'goingToStop') {
				this.state.hasCollidedX = result.collision.x;
				this.state.hasCollidedY = result.collision.y;

				if (result.collision.x) {
					this.vel.x = 0;
				}
				if (result.collision.y) {
					this.vel.y = 0;
				}
				this.parent(result);
			// }
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
		finishMovement: function (direction) {
			this.state.movement = 'goingToStop';
			switch (direction) {
				case 'up':
					if (this.pos.y.toFixed() % 16 === 0) {
						this.completeStop();
					} else {
						this.vel.y = .5;
						this.pos.y -= this.vel.y;
					}
					break;
				case 'right':
					if (this.pos.x.toFixed() % 16 === 0) {
						this.completeStop();
					} else {
						this.vel.x = .5;
						this.pos.x += this.vel.x;
					}
					break;
				case 'down':
					if (this.pos.y.toFixed() % 16 === 0) {
						this.completeStop();
					} else {
						this.vel.y = .5;
						this.pos.y += this.vel.y;
					}
					break;
				case 'left':
					if (this.pos.x.toFixed() % 16 === 0) {
						this.completeStop();
					} else {
						this.vel.x = .5;
						this.pos.x -= this.vel.x;
					}
					break;
				default:
					break;
			}
		},
		stop: function (direction) {
			if (this.state.movement !== 'goingToStop') {
				this.state.movement = 'goingToStop';
				this.state.direction = direction;
			}
		},
		completeStop: function () {
			this.state.movement = 'stopped';
			this.vel.x = 0;
			this.vel.y = 0;
			this.pos.x = Math.round(this.pos.x);
			this.pos.y = Math.round(this.pos.y);
			// console.log(this.pos.x, this.pos.y);
		},
		move: function (direction) {
			if (this.state.movement === 'goingToStop') {
				Data.blockInput();
			} else {
				Data.unblockInput();
			}
			switch (direction) {
				case 'up':
					this.currentAnim = this.anims.up;
					if (!this.state.hasCollidedY) {
						this.state.movement = 'moving';
						this.state.direction = 'up';
						this.accel.y = .5;
						this.pos.y -= this.accel.y;
					}
					break;
				case 'right':
					this.currentAnim = this.anims.right;
					if (!this.state.hasCollidedX) {
						this.state.movement = 'moving';
						this.state.direction = 'right';
						this.accel.x = .5;
						this.pos.x += this.accel.x;
					}
					break;
				case 'down':
					this.currentAnim = this.anims.down;
					if (!this.state.hasCollidedY) {
						this.state.movement = 'moving';
						this.state.direction = 'down';
						this.accel.y = .5;
						this.pos.y += this.accel.y;
					}
					break;
				case 'left':
					this.currentAnim = this.anims.left;
					if (!this.state.hasCollidedX) {
						this.state.movement = 'moving';
						this.state.direction = 'left';
						this.accel.x = .5;
						this.pos.x -= this.accel.x;
					}
					break;
				default:
					break;
			}

		},
	});
});