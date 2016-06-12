ig.module('game.screens.world')
.requires(
	'game.game',
	'game.levels.throne-room'
)
.defines(function () {
	ig.global.WorldScreen = ig.global.Game.extend({
		init: function () {
			this.loadLevel(LevelThroneRoom);
		},
		update: function () {
			this.parent();
			this.handleEvents();
			this.scrollScreen();
		},
		handleEvents: function () {
			var hero = _.head(ig.game.getEntitiesByType(ig.global.EntityHero));

			if (!Data.state.get('disableInput')) {
				if (ig.input.pressed('UP')) {
					hero.move('up');
				} else if (ig.input.pressed('RIGHT')) {
					hero.move('right');
				} else if (ig.input.pressed('DOWN')) {
					hero.move('down');
				} else if (ig.input.pressed('LEFT')) {
					hero.move('left');
				}
			}
		},
		scrollScreen: function () {
			var heroes = ig.game.getEntitiesByType(ig.global.EntityHero);
			var hero;

			if (heroes.length) {
				hero = _.head(heroes);
				this.screen.x = hero.pos.x - (ig.system.width / 2) + (hero.size.x / 2);
				this.screen.y = hero.pos.y - (ig.system.height / 2) + (hero.size.y / 2);
			}
		}
	});
});