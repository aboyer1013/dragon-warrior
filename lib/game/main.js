ig.module(
	'game.main'
)
	.requires(
		// 'impact.game',
		'impact.font',
		'game.game',
		'game.entities.title',
		'game.main-menu-screen'
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
			onBeforeScreenUpdated: function (change) {
				console.log('onBeforeScreenUpdated called');
				return change;
			},
			onScreenUpdated: function (change) {
				this.dataStateInterceptor();
				this.dataStateObserver();
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


		ig.main('#canvas', ig.global[Data.state.get('screen')], Data.fps, Data.width, Data.height, Data.scale);

	});
