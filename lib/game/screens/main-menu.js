ig.module(
	'game.screens.main-menu'
)
	.requires(
		'game.game',
		'game.entities.textbox',
		'impact.debug.debug'
	)
	.defines(function () {

		ig.global.MainMenuScreen = ig.global.Game.extend({

			init: function () {
				this.timer = new ig.Timer();
				this.elapsedTicks = 0;
				Data.blockInput();
				this.transitionInTime = new ig.Timer();
				this.transitionInTime.set(1);
				this.report = '';
				this.parent();
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
						}
					]
				});
			},

			update: function () {
				this.parent();
				this.elapsedTicks += 1;
				if (this.transitionInTime.delta() >= 0) {
					this.report = this.elapsedTicks;
					this.elapsedTicks = 0;
					this.transitionInTime.reset();
				}
			},

			draw: function () {
				this.parent();
				// this.font.draw(this.transitionInTime.delta(), 8, 8, ig.Font.ALIGN.LEFT);
			}
		});
	});
