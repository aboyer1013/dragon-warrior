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
				Data.unblockInput();
			},
			onDataStateScreenUpdated: function (change) {
				this.parent();
				ig.system.setGame(ig.global.MainMenuScreen);
				console.log('onDataStateScreenUpdated called');
			},
			update: function () {
				this.parent();
				this.counter += this.timer.delta();
				this.handleEvents();
			},
			draw: function () {
				this.parent();
				// this.font.draw(this.timer.delta().toFixed(1), 8, 8, ig.Font.ALIGN.LEFT);

			},
			handleEvents: function () {
				if (!Data.state.get('disableInput')) {
					if (ig.input.pressed('START')) {
						if (this.title.state.get('isCopyrightHidden')) {
							this.title.state.set('isCopyrightHidden', false);
						} else {
							Data.state.set('screen', 'MainMenuScreen');
						}
					}
				}
			}
		});

		ig.System.drawMode = ig.System.DRAW.SUBPIXEL;
		ig.System.scaleMode = ig.System.SCALE.CRISP;
		// ig.Timer.maxStep = Data.frameSpeed;
		// ig.Timer.timeScale = .5;

		ig.main('#canvas', ig.global[Data.state.get('screen')], null, Data.width, Data.height, Data.scale);

	});
