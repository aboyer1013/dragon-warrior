ig.module('game.entities.textbox.typewriter')
	.requires(
		'game.entities.entity'
	)
	.defines(function () {
		ig.global.TextBox = ig.global.TextBox || {};
		ig.global.TextBox.Typewriter = ig.global.Entity.extend({
			init: function (x, y, settings) {
				this.tileSize = 8;
				this.currRowIdx = 0;
				this.drawSpeed = new ig.Timer(Data.frameSpeed);
				this.typeSpeed = new ig.Timer(Data.frameSpeed * 16);
				this.parent(x, y, settings);
				this.sprite = new ig.Image('media/sprite.png');
				this.cur = {
					section: 0,
					row: 0,
					char: 0
				};
				this.state = {
					opening: true,
					opened: false
				}
			},
			update: function () {
				if (this.state.opening) {
					if (this.drawSpeed.delta() > 0) {
						this.currRowIdx++;
						this.drawSpeed.reset();
					}
				} else {
					this.currRowIdx = Infinity;
				}
				if (!this.state.typing && !this.state.opening && this.state.opened) {
					this.type();
					this.state.typing = true;
				}
				if (this.state.typing) {
					if (this.typeSpeed.delta() > 0) {
						this.advanceCur();
						this.typeSpeed.reset();
					}
				}
				this.parent();
			},
			draw: function () {
				var totalSides = (this.size.y / this.tileSize) - 2;

				if (this.currRowIdx > 0) {
					this.drawCap(this.pos.x, this.pos.y, 't');
				}
				_.times(totalSides, _.bind(function (i) {
					var x = this.pos.x;
					var y = this.pos.y + this.tileSize;

					if (this.currRowIdx > i) {
						this.drawSide(x, y + (i * this.tileSize))
					}
				}, this));
				if (this.currRowIdx > totalSides) {
					this.drawCap(this.pos.x, this.pos.y + this.size.y - this.tileSize, 'b');
					this.state.opening = false;
					this.state.opened = true;
				}
				// RESUME HERE - look at Shadowgate to figure out how this works.
				this.font.draw(this.title, x + (titleStartPosX * TS), y);
				this.parent();
			},
			advanceCur: function () {
				if (this.isAtLastSection() && this.isAtLastRow() && this.isAtLastChar()) {
					return false;
				}
				if (this.isAtLastRow() && this.isAtLastChar()) {
					this.cur.section++;
					this.cur.row = 0;
					this.cur.char = 0;
				} else if (!this.isAtLastRow() && this.isAtLastChar()) {
					this.cur.row++;
					this.cur.char = 0;
				} else if (!this.isAtLastRow() && !this.isAtLastChar()) {
					this.cur.char++;
				}
				return true;
			},
			isAtLastRow: function () {
				var context = this.text[this.cur.section];

				return context.length === this.cur.section - 1;
			},
			isAtLastChar: function () {
				var context = this.text[this.cur.section][this.cur.row];

				return context.length === this.cur.char - 1;
			},
			isAtLastSection: function () {
				var context = this.text;

				return context.length === this.cur.section - 1;
			},
			type: function (cur) {
				cur = cur || this.cur;
			},
			drawCap: function (x, y, type) {
				var times = (this.size.x / this.tileSize) - 2;
				var TS = this.tileSize;
				var titleStartPosX;

				type = type || 'b';

				if (this.title && this.title.length <= times) {
					// Add 1 at the end since we don't count the corner
					titleStartPosX = Math.floor((times / 2) - (this.title.length / 2)) + 1;
				}
				this.drawCorner(x, y, type + 'l');
				_.times(times, _.bind(function (i) {
					if (this.title) {
						if (i + 1 === titleStartPosX - 1) {
							// draw short border to give a little padding before start of title
							this.sprite.drawTile(x + TS + (i * TS), y, 5, TS, TS);
						} else if (i + 1 >= titleStartPosX && i + 1 < titleStartPosX + this.title.length) {
							// draw blank
							this.sprite.drawTile(x + TS + (i * TS), y, 0, TS, TS);
						} else {
							this.drawBorder(x + TS + (i * TS), y, type);
						}
					} else {
						this.drawBorder(x + TS + (i * TS), y, type);
					}
				}, this));
				if (this.title) {
					this.font.draw(this.title, x + (titleStartPosX * TS), y);
				}
				this.drawCorner(x + (this.size.x - TS), y, type + 'r');
			},
			drawSides: function (x, y) {
				_.times((this.size.y / this.tileSize) - 2, _.bind(function (i) {
					this.drawSide(x, y + (i * this.tileSize))
				}, this));
			},
			drawSide: function (x, y) {
				var times = this.size.x / this.tileSize;
				_.times(times, _.bind(function (i) {
					if (i === 0) {
						this.drawBorder(x, y, 'l');
					} else if (i === times - 1) {
						this.drawBorder(x + (this.size.x - this.tileSize), y, 'r');
					} else {
						this.sprite.drawTile(x + (i * this.tileSize), y, 0, this.tileSize, this.tileSize);
					}
				}, this));
			},
			drawBorder: function (x, y, direction) {
				var flipX = false;
				var flipY = false;
				var tileIdx = 1;

				switch (direction) {
					case 'l':
						tileIdx = 3;
						break;
					case 'r':
						flipX = true;
						tileIdx = 3;
						break;
					case 'b':
						flipX = true;
						flipY = true;
						break;
					default:
						break;
				}
				return this.sprite.drawTile(x, y, tileIdx, this.tileSize, this.tileSize, flipX, flipY);
			},
			drawCorner: function (x, y, direction) {
				var flipX = false;
				var flipY = false;

				switch (direction) {
					case 'tr':
						flipX = true;
						break;
					case 'bl':
						flipY = true;
						break;
					case 'br':
						flipX = true;
						flipY = true;
						break;
					default:
						break;
				}
				return this.sprite.drawTile(x, y, 2, this.tileSize, this.tileSize, flipX, flipY);
			}
		});
	});
