ig.module('game.screens.world')
.requires(
	'game.game',
	'game.levels.throne-room'
)
.defines(function () {
	ig.global.WorldScreen = ig.global.Game.extend({
		init: function () {
			this.loadLevel(LevelThroneRoom);
			this.hero = _.head(ig.game.getEntitiesByType(ig.global.EntityHero));
			ig.debug.togglePanel(ig.debug.panels.customPanel);
		},
		update: function () {
			this.parent();
			this.handleEvents();
			this.scrollScreen();
		},
		handleEvents: function () {
			if (!Data.state.get('disableInput') && !this.hero.movement.isMoving()) {
				if (!this.hero.movement.isMoving()) {
					if (ig.input.state('UP')) {
						this.hero.movement.direction = ig.global.GridMovement.moveType.UP;
					} else if (ig.input.state('RIGHT')) {
						this.hero.movement.direction = ig.global.GridMovement.moveType.RIGHT;
					} else if (ig.input.state('DOWN')) {
						this.hero.movement.direction = ig.global.GridMovement.moveType.DOWN;
					} else if (ig.input.state('LEFT')) {
						this.hero.movement.direction = ig.global.GridMovement.moveType.LEFT;
					}
				}
			}
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