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
			// console.clear();
			// console.log('x: ', hero.pos.x);
			// console.log('y: ', hero.pos.y);
			if (!Data.state.get('disableInput')) {
				if (ig.input.state('UP')) {
					hero.move('up');
				} else if (ig.input.state('RIGHT')) {
					hero.move('right');
				} else if (ig.input.state('DOWN')) {
					hero.move('down');
				} else if (ig.input.state('LEFT')) {
					hero.move('left');
				}
				if (ig.input.released('UP')) {
					hero.stop('up');
				} else if (ig.input.released('RIGHT')) {
					hero.stop('right');
				} else if (ig.input.released('DOWN')) {
					hero.stop('down');
				} else if (ig.input.released('LEFT')) {
					hero.stop('left');
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