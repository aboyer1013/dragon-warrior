ig.module('game.entities.title')
.requires(
	'impact.entity',
	'game.data',
	'game.entities.glint'
)
.defines(function () {
	ig.global.Title = ig.Entity.extend({
		collides: ig.Entity.COLLIDES.NEVER,
		size: {x: 18, y: 25},
		init: function (x, y, settings) {
			this.state = mobx.observable(mobx.asMap({
			}));
			this.fullTitleTime = new ig.Timer();
			this.fullTitleTime.set(Data.frameSpeed * 620);
			this.glintTime = new ig.Timer();
			this.glintTime.set(Data.frameSpeed * 650);
			this.border = new ig.Image('media/title-border.png');
			this.rock = new ig.Image('media/title-rock.png');
			this.title = new ig.Image('media/title-dragon-warrior.png');
			this.dragonHead = new ig.Image('media/title-dragon-head.png');
			this.copyright = new ig.Image('media/title-copyright.png');
			// this.glint = this.createGlint();
			this.glint = ig.game.spawnEntity(Glint, 173, 52);
			this.parent(x, y, settings);

		},
		createGlint: function () {
			var glintAnimSheet = new ig.AnimationSheet('media/title-glint.png', 36, 60);
			var glintAnimSeq = [0,1,1,2,2,2,2,3,3,3,4,4,4,4,4,4,3,3,3,3,2,2,1,1];

			glintAnimSeq.push(_.fill(Array(104), 0));
			glintAnimSeq = _.flatten(glintAnimSeq);
			glintAnimSeq = glintAnimSeq.concat([0,1,2,2,3,3,4,4,4,3,2,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,3,3,4,4,4,3,2,1,0]);
			glintAnimSeq.push(_.fill(Array(104), 0));
			glintAnimSeq = _.flatten(glintAnimSeq);

			return new ig.Animation(glintAnimSheet, 0.016666667, glintAnimSeq);
		},
		// update: function () {
		//	
		// },
		draw: function () {
			this.parent();
			// top border
			_.times(30, _.bind(function (x) {
				this.border.draw(8 * x, 34);
			}, this));
			// rock texture
			_.times(5, _.bind(function (y) {
				_.times(15, _.bind(function (x) {
					this.rock.draw(16 * x, 40 + (16 * y));
				}, this));
			}, this));
			// bottom border
			_.times(30, _.bind(function (x) {
				this.border.draw(8 * x, 121);
			}, this));
			// title and dragon
			this.title.draw(16, 72);
			if (true || this.fullTitleTime.delta() >= 0) {
				this.copyright.draw(24, 144);
				if (true || this.fullTitleTime.delta() + Data.frameSpeed >= 0) {
					this.dragonHead.draw(33, 53);
					Data.unblockInput();
				}
			}
			// glint
			if (true || this.glintTime.delta() >= 0) {
				this.glint.draw(173, 52);
			}
		}
	});
});
