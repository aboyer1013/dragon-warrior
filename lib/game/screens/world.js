ig.module('game.screens.world')
.requires(
	'game.game',
	'game.levels.throne-room'
)
.defines(function () {
	var GridMovement = ig.global.GridMovementMod;

	ig.global.WorldScreen = ig.global.Game.extend({
		init: function () {
			this.loadLevel(LevelThroneRoom);
			this.hero = _.head(ig.game.getEntitiesByType(ig.global.EntityHero));
			this.delaySpeed = Data.frameSpeed * 16;
			this.delay = new ig.Timer(this.delaySpeed);
			ig.debug.togglePanel(ig.debug.panels.customPanel);
		},
		update: function () {
			this.parent();
			this.handleEvents();
			this.scrollScreen();
		},
		handleEvents: function () {
			if (!Data.state.get('disableInput')) {
				// if check to prevent changing direction while moving.
				if (!this.hero.movement.isMoving()) {
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
		isMovingTowardOccupiedTile: function () {
			
		},
		scrollScreen: function () {
			this.screen.x = this.hero.pos.x - (ig.system.width / 2) + (this.hero.size.x / 2);
			this.screen.y = this.hero.pos.y - (ig.system.height / 2) + (this.hero.size.y / 2);
		},
		draw: function () {
			this.parent();
			this.hero.draw();
		}
	});
});