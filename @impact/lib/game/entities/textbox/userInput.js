ig.module('game.entities.textbox.userInput')
	.requires(
		'game.entities.textbox.standard'
	)
	.defines(function () {
		var nameMenuSettings = {
			pos: {
				x: 72,
				y: 40
			},
			name: 'nameMenu',
			zIndex: 10,
			padding: [1,1,1,1],
			title: 'NAME'
		};
		var menuSettings = {
			name: 'userInputMenu',
			zIndex: 15,
			padding: [0,0,0,0],
			cellSpacing: [1,0,0,1],
			contents: [
				[
					{ text: 'A', type: 'menuItem', defaultSelected: true }, { text: 'B', type: 'menuItem' },
					{ text: 'C', type: 'menuItem' }, { text: 'D', type: 'menuItem' },
					{ text: 'E', type: 'menuItem' }, { text: 'F', type: 'menuItem' },
					{ text: 'G', type: 'menuItem' }, { text: 'H', type: 'menuItem' },
					{ text: 'I', type: 'menuItem' }, { text: 'J', type: 'menuItem' },
					{ text: 'K', type: 'menuItem' }
				],
				[
					{ text: 'L', type: 'menuItem' }, { text: 'M', type: 'menuItem' },
					{ text: 'N', type: 'menuItem' }, { text: 'O', type: 'menuItem' },
					{ text: 'P', type: 'menuItem' }, { text: 'Q', type: 'menuItem' },
					{ text: 'R', type: 'menuItem' }, { text: 'S', type: 'menuItem' },
					{ text: 'T', type: 'menuItem' }, { text: 'U', type: 'menuItem' },
					{ text: 'V', type: 'menuItem' }
				],
				[
					{ text: 'W', type: 'menuItem' }, { text: 'X', type: 'menuItem' },
					{ text: 'Y', type: 'menuItem' }, { text: 'Z', type: 'menuItem' },
					{ text: '-', type: 'menuItem' }, { text: "'", type: 'menuItem' },
					{ text: '!', type: 'menuItem' }, { text: '?', type: 'menuItem' },
					{ text: '(', type: 'menuItem' }, { text: ')', type: 'menuItem' },
					{ text: ' ', type: 'menuItem' }
				],
				[
					{ text: 'a', type: 'menuItem' }, { text: 'b', type: 'menuItem' },
					{ text: 'c', type: 'menuItem' }, { text: 'd', type: 'menuItem' },
					{ text: 'e', type: 'menuItem' }, { text: 'f', type: 'menuItem' },
					{ text: 'g', type: 'menuItem' }, { text: 'h', type: 'menuItem' },
					{ text: 'i', type: 'menuItem' }, { text: 'j', type: 'menuItem' },
					{ text: 'k', type: 'menuItem' }
				],
				[
					{ text: 'l', type: 'menuItem' }, { text: 'm', type: 'menuItem' },
					{ text: 'n', type: 'menuItem' }, { text: 'o', type: 'menuItem' },
					{ text: 'p', type: 'menuItem' }, { text: 'q', type: 'menuItem' },
					{ text: 'r', type: 'menuItem' }, { text: 's', type: 'menuItem', directionOverrides: [
					{direction: 'd', nextItemText: 'BACK'}
				] },
					{ text: 't', type: 'menuItem', directionOverrides: [
						{direction: 'd', nextItemText: 'END'}
					] }, { text: 'u', type: 'menuItem' },
					{ text: 'v', type: 'menuItem', directionOverrides: [
						{direction: 'd', nextItemText: 'END'}
					] }
				],
				[
					{ text: 'w', type: 'menuItem' }, { text: 'x', type: 'menuItem' },
					{ text: 'y', type: 'menuItem' }, { text: 'z', type: 'menuItem' },
					{ text: ',', type: 'menuItem' }, { text: '.', type: 'menuItem' },
					{ text: 'BACK', type: 'menuItem', directionOverrides: [
						{direction: 'u', nextItemText: 'r'},
						{direction: 'r', nextItemText: 'END'}
					] }, { text: '', type: 'menuItem' },
					{ text: '', type: 'menuItem' }, { text: 'END', type: 'menuItem', directionOverrides: [
					{direction: 'l', nextItemText: 'BACK'},
					{direction: 'r', nextItemText: 'END'}
				] },
					{ text: '', type: 'menuItem' }
				]
			]
		};

		ig.global.TextBox = ig.global.TextBox || {};
		ig.global.TextBox.UserInput = ig.global.TextBox.Standard.extend({
			tileSize: 8,
			init: function (x, y, settings) {
				this.cellSpacing = [0,0,0,0];
				this.cellSize = 1;
				this.indent = 0;

				settings = _.assign(menuSettings, settings);
				nameMenuSettings = _.assign({}, settings.nameMenuSettings, nameMenuSettings);
				this.nameMenu = ig.game.spawnEntity(
					ig.global.TextBox.Standard,
					nameMenuSettings.pos.x,
					nameMenuSettings.pos.y,
					_.assign(nameMenuSettings, {font: settings.font, contents: this.getDefaultNameMenuContents()})
				);
				_.assign(this, settings, {pos: {x: x, y: y}});
				this.sprite = new ig.Image('media/sprite.png');
				this.size = this.getSize();
				this.totalRows = this.size.y / this.tileSize;
				this.elapsedTicks = 0;
				this.currentRow = 0;

				this.drawData = this.getDrawData();
				this.setupMenuItems();
				if (this.hasMenuItems()) {
					this.selector = this.spawnSelector();
					this.selector.isHidden = true;
				}
				this.state = mobx.observable(mobx.asMap({
					isHidden: true,
					isOpen: false,
					isDisabled: false
				}));

				this.inputMarkerIdx = 0;
				this.userInput = this.getUserInputText();
				ig.game.addListener(this.nameMenu.name, this.nameMenu.state);
			},
			reset: function () {
				this.parent();
			},
			update: function () {
				this.parent();
			},
			close: function () {
				this.parent();
				if (this.state.get('isOpen')) {
					this.nameMenu.close();
				}
			},
			getDefaultNameMenuContents: function () {
				return [
					{ text: '********', type: 'userInput' }
				];
			},
			/**
			 * Collect all the draws needed to render into an array.
			 * Assign them to a particular row index number.
			 * This is used to animate the box in by rows.
			 * @returns {Array}
			 */
			getDrawData: function () {
				var textPos = {
					x: this.pos.x + this.tileSize + (this.tileSize * (this.padding[3]) + this.hasMenuItems()),
					y: this.pos.y + this.tileSize + (this.tileSize * this.padding[0])
				};
				var result = [];
				var numSpacers = 0;

				if (this.hasMenuItems()) {
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

				// render the text
				_.forEach(this.contents, _.bind(function (content, i) {
					var textPos = {
						x: this.pos.x + this.tileSize,
						y: this.pos.y + this.tileSize
					};
					var topPadding = this.padding[0];
					var topCellSpacing = this.cellSpacing[0];
					var rowNum = topPadding;

					rowNum += i;
					rowNum += (i + 1) * topCellSpacing;
					_.forEach(content, _.bind(function (obj, j) {
						var x;
						var y;
						var text = obj.text;
						var leftPadding = this.padding[3];
						var leftCellSpacing = this.cellSpacing[3];
						var colNum = leftPadding;

						colNum += j;
						colNum += (j + 1) * leftCellSpacing;
						x = textPos.x + (colNum * this.tileSize);
						y = textPos.y + (rowNum * this.tileSize);
						this.contents[i][j].row = rowNum;
						this.contents[i][j].column = colNum;
						this.contents[i][j].pos = {
							x: x,
							y: y
						};
						result.push({
							row: rowNum,
							column: colNum,
							fn: function () {
								this.font.draw(text, x, y, ig.Font.ALIGN.LEFT);
							}
						});
					}, this));
				}, this));

				return result;
			},
			getSize: function () {
				var result = {
					x: 0,
					y: 0
				};
				var totalRows = 0;
				var totalCols = 0;
				var cellSpacingX = this.cellSpacing[1] + this.cellSpacing[3];
				var cellSpacingY = this.cellSpacing[0] + this.cellSpacing[2];

				// add in borders
				result.x += 2;
				result.y += 2;
				// add in padding
				result.x += this.padding[1] + this.padding[3];
				result.y += this.padding[0] + this.padding[2];
				// add in cell size
				result.x += this.cellSize || 0;
				// add total rows
				totalRows = this.contents.length;
				result.y += totalRows;
				// add total columns
				totalCols = _.max(_.map(this.contents, function (content) {
					return content.length;
				}));
				result.x += totalCols;
				// add in cell spacing
				result.x += cellSpacingX * totalCols;
				result.y += cellSpacingY * totalRows;
				// convert to real pixel amounts based on a tile size
				result.x *= this.tileSize;
				result.y *= this.tileSize;

				return result;
			}
		});
	});
