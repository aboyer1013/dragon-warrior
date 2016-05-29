ig.module(
	'game.main-menu-screen'
)
	.requires(
		'game.game'
	)
	.defines(function () {

		ig.global.MainMenuScreen = ig.global.Game.extend({

			init: function () {
				this.parent();
				this.font = _.find(Data.fonts, {color: 'ffffff'});
				this.font = new ig.Font(this.font.family);
				console.log('main menu init');
			},

			initInputBindings: function () {
				_.forEach(Data.config.keyMap, function (val, key) {
					ig.input.bind(ig.KEY[key], val);
				});
			},
			update: function () {
				this.parent();
			},

			draw: function () {
				this.parent();
				this.font.draw('main menu', 8, 8, ig.Font.ALIGN.LEFT);
			}
		});
	});
