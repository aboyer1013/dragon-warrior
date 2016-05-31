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
				this.handleEvents();
				this.parent();
				this.textbox = ig.game.spawnEntity(ig.global.TextBox, 24, 56, {
					font: this.font,
					padding: [1,1,0,0],
					lineSpacing: 1,
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
					this.elapsedTicks = 0;
					this.transitionInTime.reset();
				}
				this.handleEvents();
			},
			draw: function () {
				this.parent();
				// this.font.draw(this.transitionInTime.delta(), 8, 8, ig.Font.ALIGN.LEFT);
			},
			handleEvents: function () {
				if (!Data.state.get('disableInput')) {
					if (ig.input.pressed('DOWN')) {
						this.textbox.moveSelector('d');
					} else if (ig.input.pressed('UP')) {
						this.textbox.moveSelector('u');
					}
				}
			}
		});
	});
