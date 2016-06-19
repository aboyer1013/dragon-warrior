ig.module('game.entities.character')
.requires(
	'game.entities.entity',
	'plugins.gridmovement-mod'
)
.defines(function () {
	var GridMovement = ig.global.GridMovementMod;

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
		isStationary: 1,
		animSheet: new ig.AnimationSheet('media/chars.png', 16, 16),
		init: function (x, y, settings) {
			this.parent(x, y, settings);
			this.movement = new GridMovement(this);
			this.movement.speed.x = this.movement.speed.y = 60;
			this.avatar = this.avatar || this.name;
			this.initAnims(this.direction);
		},
		update: function () {

			if (this.movement.direction) {
				this.currentAnim = this.anims[this.moveTypeReverseMap[this.movement.direction]];
			}
			this.movement.update();
			if (!this.movement.isMoving()) {
				this.updateCollisionMap();
			}
			this.parent();
		},
		// Syncs collision map with entity positions.
		// This was the only way I knew how to prevent player pushing npc's and vise-versa.
		// There should be deadlock no matter what.
		updateCollisionMap: function () {
			var colMap = ig.game.collisionMap;
			var x = this.pos.x / colMap.tilesize;
			var y = this.pos.y / colMap.tilesize;

			if (!_.isEmpty(this.prevColCoords)) {
				colMap.data[this.prevColCoords.y][this.prevColCoords.x] = 0;
			}
			colMap.data[y][x] = 1;
			this.prevColCoords = {
				x: x,
				y: y
			};
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
						{name: 'UP', frames: [144,156]},
						{name: 'RIGHT', frames: [168,180]},
						{name: 'DOWN', frames: [192,204]},
						{name: 'LEFT', frames: [216,228]}
					];
					break;
				case 'king':
					anims = [
						{name: 'DOWN', frames: [37,49]}
					];
					break;
				case 'guard':
					anims = [
						{name: 'UP', frames: [146,158]},
						{name: 'RIGHT', frames: [170,182]},
						{name: 'DOWN', frames: [194,206]},
						{name: 'LEFT', frames: [218,230]}
					];
					break;
				case 'door':
					anims = [
						{name: 'UP', frames: [42], stop: true}
					];
					break;
				default:
					break;
			}
			_.forEach(anims, _.bind(function (animFrame) {
				var stop = animFrame.stop || false;

				this.addAnim(animFrame.name, Data.frameSpeed * 16, animFrame.frames, stop);
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