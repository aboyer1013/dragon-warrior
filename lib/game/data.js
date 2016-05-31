ig.module(
	'game.data'
)
	.requires(
		'impact.game'
	)
	.defines(function () {
		var fps = 60;

		Data = {
			fps: fps,
			width: 240,
			height: 224,
			scale: 4,
			frameSpeed: 1 / fps,
			fonts: [
				{
					name: 'white',
					color: 'ffffff',
					family: 'media/ffffff.font.png',
					letterSpacing: 0,
					lineSpacing: -2,
					height: 10
				}
			],
			state: mobx.observable(mobx.asMap({
				disableInput: true,
				screen: 'MainMenuScreen'
			})),
			config: {
				keyMap: {
					PERIOD: 'START',
					COMMA: 'SELECT',
					SHIFT: 'B',
					SPACE: 'A',
					UP_ARROW: 'UP',
					RIGHT_ARROW: 'RIGHT',
					DOWN_ARROW: 'DOWN',
					LEFT_ARROW: 'LEFT'
				}
			},
			blockInput: function () {
				this.state.set('disableInput', true);
			},
			unblockInput: function () {
				this.state.set('disableInput', false);
			}
		};

	});
