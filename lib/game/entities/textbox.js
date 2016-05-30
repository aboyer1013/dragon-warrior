ig.module('game.entities.textbox')
	.requires(
		'game.entities.entity'
	)
	.defines(function () {
		ig.global.TextBox = ig.global.Entity.extend({
			collides: ig.Entity.COLLIDES.NEVER,
			padding: [1,1,0,0],
			lineSpacing: 1,
			title: null,
			tileSize: 8,
			// animSheet: new ig.AnimationSheet('media/title-glint.png', 36, 60),
			init: function (x, y, settings) {
				this.parent(x, y, settings);
				this.sprite = new ig.Image('media/sprite.png');
				this.size = this.setSize();
				this.totalRows = this.size.y / this.tileSize;
				this.elapsedTicks = 0;
				this.currentRow = 0;
				this.drawData = this.getDrawData();
			},
			update: function () {
				this.parent();
				this.elapsedTicks++;
				if (this.elapsedTicks % 1 === 0) {
					this.currentRow += 2;
				}
			},
			draw: function () {
				var filteredDrawFns = _.filter(this.drawData, _.bind(function (data) {
					return data.row <= this.currentRow;
				}, this));

				this.parent();
				_.forEach(filteredDrawFns, _.bind(function (data) {
					data.fn.call(this);
				}, this));

			},
			/**
			 * Collect all the draws needed to render into an array.
			 * Assign them to a particular row index number.
			 * This is used to animate the box in by rows.
			 * @returns {Array}
			 */
			getDrawData: function () {
				var text = _.map(this.contents, 'text');
				var textPos = {
					x: this.pos.x + this.tileSize + (this.tileSize * (this.padding[3]) + this.hasSelectables()),
					y: this.pos.y + this.tileSize + (this.tileSize * this.padding[0])
				};
				var result = [];

				if (this.hasSelectables()) {
					textPos.x += this.tileSize;
				}
				result.push({
					row: 0,
					fn: function () {
						this.drawCap(this.pos.x, this.pos.y, 't');
					}
				});

				_.times((this.size.y / this.tileSize) - 2, _.bind(function (i) {
					result.push({
						row: i + 1,
						fn: function () {
							this.drawSide(this.pos.x, this.pos.y + this.tileSize + (i * this.tileSize))
						}
					})
				}, this));
				result.push({
					row: this.totalRows - 1,
					fn: function () {
						this.drawCap(this.pos.x, this.pos.y + this.size.y - this.tileSize, 'b');
					}
				});

				_.forEach(text, _.bind(function (text, i) {
					var lineSpacing = !i ? 0 : this.lineSpacing;
					var rowNum = 1 + this.padding[0]; // 2

					rowNum += i;
					rowNum += (i * lineSpacing);
					result.push({
						row: rowNum,
						fn: function () {
							this.font.draw(text, textPos.x, textPos.y + (i * this.tileSize) + ((lineSpacing * i) * this.tileSize), ig.Font.ALIGN.LEFT);
						}
					});
				}, this));
				return result;
			},
			incrementRow: function () {
				this.currentRow++;
			},
			drawCap: function (x, y, type) {
				var times = (this.size.x / this.tileSize) - 2;

				type = type || 'b';

				this.drawCorner(x, y, type + 'l');
				_.times(times, _.bind(function (i) {
					this.drawBorder((x + this.tileSize) + (i * this.tileSize), y, type);
				}, this));
				this.drawCorner(x + (this.size.x - this.tileSize), y, type + 'r');
			},
			drawSides: function (x, y) {
				_.times((this.size.y / this.tileSize) - 2, _.bind(function (i) {
					this.drawSide(x, y + (i * this.tileSize))
				}, this));
			},
			drawSide: function (x, y) {
				this.drawBorder(x, y, 'l');
				this.drawBorder(x + (this.size.x - this.tileSize), y, 'r');
			},
			drawBorder: function (x, y, direction) {
				var flipX = false;
				var flipY = false;
				var tileIdx = 0;

				switch (direction) {
					case 'l':
						tileIdx = 2;
						break;
					case 'r':
						flipX = true;
						tileIdx = 2;
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
				return this.sprite.drawTile(x, y, 1, this.tileSize, this.tileSize, flipX, flipY);
			},
			setSize: function () {
				var text = [];
				var textLengths = [];
				var result = {
					x: 0,
					y: 0
				};

				if (this.sizeOverride) {
					return this.sizeOverride;
				}
				text = _.map(this.contents, 'text');
				textLengths = _.map(text, function (chars) {
					return chars.length;
				});
				// add borders
				result.x += 2;
				result.y += 2;
				// add padding if any
				result.x += this.padding[0] + this.padding[2];
				result.y += this.padding[1] + this.padding[3];
				// add room for selection cursor
				if (this.hasSelectables()) {
					result.x++;
				}
				// add width based on longest line of text
				result.x += _.max(textLengths);
				// add height based on lines of text
				result.y += text.length;
				// add height based on lineSpacing
				result.y += (text.length - 1) * this.lineSpacing;
				// return actual pixels based on tilesize
				result.x *= this.tileSize;
				result.y *= this.tileSize;
				return result;
			},
			hasSelectables: function () {
				return _.some(this.contents, 'onSelect');
			}
		});
	});
