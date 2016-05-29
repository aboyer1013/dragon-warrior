ig.module(
	'game.main'
)
	.requires(
		'game.game',
		'game.entities.title',
		'game.screens.main-menu'
	)
	.defines(function () {

		ig.global.Main = ig.global.Game.extend({

			init: function () {
				this.parent();
				this.timer = new ig.Timer();
				this.counter = 0;
				this.title = this.spawnEntity(ig.global.Title, 0, 0);
				Data.blockInput();
			},
			onScreenUpdated: function (change) {
				this.parent();
				ig.system.setGame(ig.global.MainMenuScreen);
				console.log('onScreenUpdated called');
			},
			update: function () {
				this.parent();
				this.counter += this.timer.delta();
				if (!Data.state.get('disableInput')) {
					if (ig.input.pressed('START')) {
						console.log('START pressed');
						Data.state.set('screen', 'foo');
					}
				}
			},

			draw: function () {
				this.parent();
				this.font.draw(this.timer.delta().toFixed(1), 8, 8, ig.Font.ALIGN.LEFT);

			}
		});


		ig.System.drawMode = ig.System.DRAW.SUBPIXEL;
		ig.System.scaleMode = ig.System.SCALE.CRISP;

		ig.main('#canvas', ig.global[Data.state.get('screen')], Data.fps, Data.width, Data.height, Data.scale);

	});
