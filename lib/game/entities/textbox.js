ig.module('game.entities.textbox')
	.requires(
		'impact.entity'
	)
	.defines(function () {
		ig.global.TextBox = ig.Entity.extend({
			collides: ig.Entity.COLLIDES.NEVER,
			padding: 1,
			lineSpacing: 1,
			title: null,
			tileSize: 8,
			// animSheet: new ig.AnimationSheet('media/title-glint.png', 36, 60),
			init: function (x, y, settings) {
				this.parent(x, y, settings);
				this.sprite = new ig.Image('media/textbox.png');
				this.size = this.setSize();
			},
			update: function () {
				this.parent();
			},
			draw: function () {
				var textPos = {
					x: this.pos.x + this.tileSize + (this.tileSize * this.padding),
					y: this.pos.y + this.tileSize + (this.tileSize * this.padding)
				};

				this.drawCap(this.pos.x, this.pos.y, 't');
				this.drawSides(this.pos.x, this.pos.y + this.tileSize);
				this.drawCap(this.pos.x, this.pos.y + this.size.y - this.tileSize, 'b');
				_.forEach(_.map(this.contents, 'text'), _.bind(function (text, i) {
					var lineSpacing = !i ? 0 : this.lineSpacing;

					this.font.draw(text, textPos.x, textPos.y + (i * this.tileSize) + ((lineSpacing * i) * this.tileSize), ig.Font.ALIGN.LEFT);
				}, this));
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
					this.drawBorder(x, y + (i * this.tileSize), 'l');
					this.drawBorder(x + (this.size.x - this.tileSize), y + (i * this.tileSize), 'r');
				}, this));
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
				result.x += this.padding * 2;
				result.y += this.padding;
				// add room for selection cursor
				if (this.hasSelectables() && !this.padding) {
					result.x += 1;
				}
				// add width based on longest line of text
				result.x += _.max(textLengths);
				// add height based on lines of text
				result.y += text.length;
				// add height based on lineSpacing
				result.y += (text.length - 1) * this.lineSpacing;
				// add in tilesize
				result.x *= this.tileSize;
				result.y *= this.tileSize;
				return result;
			},
			hasSelectables: function () {
				return _.some(this.contents, 'onSelect');
			},
		});
	});
