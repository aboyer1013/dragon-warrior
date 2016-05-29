ig.module(
	'game.screens.main-menu'
)
	.requires(
		'game.game',
		'game.entities.textbox'
	)
	.defines(function () {

		ig.global.MainMenuScreen = ig.global.Game.extend({

			init: function () {
				Data.blockInput();
				this.transitionInTime = new ig.Timer();
				this.transitionInTime.set(Data.frameSpeed * 25);
				this.parent();
			},

			update: function () {
				this.parent();
				if (this.transitionInTime.delta() >= 0) {
					this.textbox = ig.game.spawnEntity(ig.global.TextBox, 24, 56, {
						font: this.font,
						contents: [
							{
								text: 'CONTINUE A QUEST',
								onSelect: function () {

								}
							},
							{
								text: 'CHANGE MESSAGE SPEED',
								onSelect: function () {

								}
							},
							{
								text: 'BEGIN A NEW QUEST',
								onSelect: function () {

								}
							},
							{
								text: 'COPY A QUEST',
								onSelect: function () {

								}
							},
							{
								text: 'ERASE A QUEST',
								onSelect: function () {

								}
							},
						]
					});
				}
			},

			draw: function () {
				this.parent();
				this.font.draw('main menu', 8, 8, ig.Font.ALIGN.LEFT);
			},
		});
	});
