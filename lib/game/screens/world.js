ig.module('game.screens.world')
.requires(
	'game.game',
	'game.entities.textbox.typewriter',
	'game.levels.throne-room'
)
.defines(function () {
	var GridMovement = ig.global.GridMovementMod;

	ig.global.WorldScreen = ig.global.Game.extend({
		init: function () {
			this.state = {
				transition: {
					name: 'fadein',
					complete: false,
					start: true
				},
				justStartedGame: true
			};
			this.as = new ig.AnimationSheet('media/chars.png', 16, 16);
			this.asSpeed = Data.frameSpeed * 4;
			this.backgroundAnims = {
				'media/chars.png': {
					41: new ig.Animation(this.as, this.asSpeed, [5,17,29,41], true),
					// 42: new ig.Animation(this.as, this.asSpeed, [30], true),
					43: new ig.Animation(this.as, this.asSpeed, [7,19,31,43], true),
					44: new ig.Animation(this.as, this.asSpeed, [8,20,32,44], true),
					45: new ig.Animation(this.as, this.asSpeed, [9,21,33,45], true),
					46: new ig.Animation(this.as, this.asSpeed, [10,22,34,46], true),
					47: new ig.Animation(this.as, this.asSpeed, [11,23,35,47], true)
				}
			};
			this.fadeInTimer = new ig.Timer(Data.frameSpeed * 39);
			this.loadLevel(LevelThroneRoom);
			this.initFont();
			this.hero = _.head(ig.game.getEntitiesByType(ig.global.EntityHero));
			this.delaySpeed = Data.frameSpeed * 16;
			this.delay = new ig.Timer(this.delaySpeed);
			ig.debug.togglePanel(ig.debug.panels.customPanel);
		},
		initFont: function () {
			var font = _.find(Data.fonts, {color: 'ffffff'});

			this.font = new ig.Font(font.family);
			this.font = _.assign(this.font, _.pick(font, ['letterSpacing', 'lineSpacing', 'height']));
		},
		update: function () {
			this.parent();
			this.handleEvents();
			this.scrollScreen();
			if (this.fadeInTimer.delta() > 0) {
				if (this.state.transition.name === 'fadein' && this.state.transition.start && !this.state.transition.complete) {
					_.forEach(this.backgroundAnims['media/chars.png'], _.bind(function (ba) {
						ba.rewind();
					}, this));
					_.forEach(this.entities, _.bind(function (entity) {
						var direction = entity.direction ? '_' + entity.direction : '';

						entity.currentAnim = entity.anims['FADEIN' + direction].rewind();
					}, this));
					this.state.transition.start = false;
				}
			}
		},
		handleEvents: function () {
			if (!Data.state.get('disableInput')) {
				if (this.state.justStartedGame) {
					if (
						ig.input.pressed('UP') ||
						ig.input.pressed('RIGHT') ||
						ig.input.pressed('DOWN') ||
						ig.input.pressed('LEFT')
					) {
						this.introKingDialog();
						this.state.justStartedGame = false;
					}
				} else if (!this.hero.movement.isMoving()) {
				// if check to prevent changing direction while moving.
					if (ig.input.state('UP')) {
						if (this.delay.delta() > 0) {
							this.hero.movement.direction = ig.global.GridMovement.moveType.UP;
						} else {
							this.hero.currentAnim = this.hero.anims.UP;
						}
					} else if (ig.input.state('RIGHT')) {
						if (this.delay.delta() > 0) {
							this.hero.movement.direction = ig.global.GridMovement.moveType.RIGHT;
						} else {
							this.hero.currentAnim = this.hero.anims.RIGHT;
						}
					} else if (ig.input.state('DOWN')) {
						if (this.delay.delta() > 0) {
							this.hero.movement.direction = ig.global.GridMovement.moveType.DOWN;
						} else {
							this.hero.currentAnim = this.hero.anims.DOWN;
						}
					} else if (ig.input.state('LEFT')) {
						if (this.delay.delta() > 0) {
							this.hero.movement.direction = ig.global.GridMovement.moveType.LEFT;
						} else {
							this.hero.currentAnim = this.hero.anims.LEFT;
						}
					} else {
						this.delay.set(this.delaySpeed);
					}
				}
			}
		},
		introKingDialog: function () {
			Data.blockInput();
			this.msgBox = ig.game.spawnEntity(ig.global.TextBox.Typewriter, 24, 136, {
				size: {
					x: 24 * 8,
					y: 10 * 8
				},
				font: this.font,
				text: [
					[
						"'Descendant of",
						"Erdrick, listen now",
						"to my words."
					],
					[
						"'It is told that in",
						"ages past Erdrick",
						"fought demons with a",
						"Ball of Light.'"
					]
				]
			});
			// ig.game.spawnEntity(ig.global.EntityHero, 16, 16);
			console.log('start talking');
		},
		scrollScreen: function () {
			this.screen.x = this.hero.pos.x - ig.system.width / 2;
			this.screen.y = this.hero.pos.y - (ig.system.height / 2) + (this.hero.size.y / 2);
		},
		draw: function () {
			if (this.fadeInTimer.delta() > 0) {
				this.parent();
			} else {
				ig.system.clear('#000');
			}
		}
	});
});