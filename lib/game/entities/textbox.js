ig.module('game.entities.textbox')
	.requires(
		'game.entities.entity',
		'game.entities.selector'
	)
	.defines(function () {
		// TODO break this out into menu box/dialog box etc
		ig.global.TextBox = ig.global.Entity.extend({
			tileSize: 8,
			// animSheet: new ig.AnimationSheet('media/title-glint.png', 36, 60),
			init: function (x, y, settings) {
				this.padding = [2,1,0,0];
				this.cellSpacing = [0,0,0,0];
				this.lineSpacing = 1;
				this.title = null;
				this.gutterWidth = 0;
				this.layout = 'normal';
				this.indent = 0;

				this.parent(x, y, settings);

				this.state = mobx.observable(mobx.asMap({}));
				this.sprite = new ig.Image('media/sprite.png');
				this.size = this.setSize(this.layout);
				this.totalRows = this.size.y / this.tileSize;
				this.elapsedTicks = 0;
				this.currentRow = 0;
				this.hidden = true;
				this.isOpen = false;
				this.disabled = false;
				this.inputMarkerIdx = 0;

				this.drawData = this.getDrawData();
				this.setupMenuItems();
				this.userInput = this.getUserInputText();
				if (this.hasMenuItems()) {
					this.selector = this.spawnSelector();
					this.selector.hidden = true;
				}
			},
			reset: function () {
				this.size = this.setSize();
				this.totalRows = this.size.y / this.tileSize;
				this.elapsedTicks = 0;
				this.currentRow = 0;
				this.hidden = true;
				this.inputMarkerIdx = 0;
				this.drawData = this.getDrawData();
			},
			update: function () {
				this.parent();
				this.elapsedTicks++;

				if (!this.hidden) {
					this.handleTransition(this.state.get('transition'));
				}
				if (this.state.get('transition') === 'complete') {
					
				}
				if (this.hasMenuItems()) {
					if (this.disabled) {
						this.selector.currentAnim = this.selector.anims.solid;
					} else {
						this.selector.currentAnim = this.selector.anims.blinking;
					}
				}
			},
			draw: function (contentUpdated) {
				this.parent();
				if (contentUpdated) {
					_.forEach(this.drawData, _.bind(function (data) {
						data.fn.call(this);
					}, this))
				} else if (!this.hidden) {
					_.forEach(this.filteredDrawFns, _.bind(function (data) {
						data.fn.call(this);
					}, this));
				}
				ig.game.sortEntities();
			},
			getUserInputText: function () {
				var userInput = _.find(_.flatten(this.contents), {type: 'userInput'});
				
				if (userInput) {
					return userInput.text;
				}
				return '';
			},
			updateContent: function (newContent) {
				this.contents = newContent;
				this.drawData = this.filteredDrawFns = this.getDrawData();
				this.setupMenuItems();
				this.draw(true);
			},
			incrementInputMarker: function () {
				if (this.isInputMarkerAtEnd()) {
					return this.inputMarkerIdx;
				}
				return this.inputMarkerIdx++;
			},
			decrementInputMarker: function () {
				if (this.isInputMarkerAtBeginning()) {
					return this.inputMarkerIdx;
				}
				return this.inputMarkerIdx--;
			},
			resetInputMarker: function () {
				this.inputMarkerIdx = 0;
			},
			isInputMarkerAtBeginning: function () {
				return !this.inputMarkerIdx;
			},
			isInputMarkerAtEnd: function () {
				return this.getUserInputText().length - 1 === this.inputMarkerIdx;
			},
			handleTransition: function (transition) {
				var isComplete = transition === 'complete';
				var isOpening = transition === 'opening';
				var isClosing = transition === 'closing';
				var shouldRowsChange;
				var areRowsComplete;

				if (isOpening) {
					this.hidden = false;
					shouldRowsChange = this.currentRow <= this.totalRows;
					areRowsComplete = this.currentRow >= this.totalRows;
				} else if (isClosing) {
					shouldRowsChange = this.currentRow >= 0;
					areRowsComplete = this.currentRow < 0;
				}

				if (this.elapsedTicks % 1 === 0 && shouldRowsChange) {
					if (isOpening) {
						this.incrementRow();
						this.incrementRow();
					} else if (isClosing) {
						this.decrementRow();
						this.decrementRow();
					}
				}
				this.state.set('isAnimating', (isOpening || isClosing) ? this.currentRow <= this.totalRows : this.currentRow > this.totalRows);
				if (this.state.get('isAnimating')) {
					Data.blockInput();
				}
				// console.log(this.state.isAnimating);

				if (isOpening) {
					if (areRowsComplete) {
						this.filteredDrawFns = this.drawData;
					} else {
						this.filteredDrawFns = _.filter(this.drawData, _.bind(function (data) {
							return data.row <= this.currentRow;
						}, this));
						if (this.hasMenuItems()) {
							if (this.selector.row > this.currentRow) {
								this.selector.hidden = true;
							} else {
								this.selector.hidden = false;
							}
						}
					}
				} else if (isClosing) {
					if (areRowsComplete) {
						this.filteredDrawFns = [];
					} else {
						this.filteredDrawFns = _.filter(this.drawData, _.bind(function (data) {
							return data.row <= this.currentRow;
						}, this));
						if (this.hasMenuItems()) {
							if (this.selector.row > this.currentRow) {
								this.selector.hidden = true;
							} else {
								this.selector.hidden = false;
							}
						}
					}
				}

				if (areRowsComplete) {
					isComplete = true;
				}
				if (isComplete) {
					if (isOpening) {
						this.isOpen = true;
						if (this.hasMenuItems()) {
							this.selector.hidden = false;
						}
					} else if (isClosing) {
						this.isOpen = false;
						this.hidden = true;
						if (this.hasMenuItems()) {
							this.selector.hidden = true;
						}
					}
					this.state.set('transition', 'complete');
					Data.unblockInput();
					// this.hidden = false;
					// this.selector.hidden = true;
					// this.isOpen = true;
				}
			},
			open: function () {
				if (!this.isOpen) {
					this.hidden = false;
					this.state.set('transition', 'opening');
				}
			},
			close: function () {
				if (this.isOpen) {
					this.currentRow = this.totalRows;
					this.state.set('transition', 'closing');
					this.resetInputMarker();
					// this.userInput = _.fill(Array(this.getUserInputText().split('').length, '*').join('');
					// this.reset();
					// this.hidden = true;
					// this.selector.hidden = true;
					// this.isOpen = false;
				}
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

				if (this.layout === 'normal') {
					// render the text
					_.forEach(this.contents, _.bind(function (content, i) {
						var text = content.text;
						var lineSpacing = !i ? 0 : this.lineSpacing;
						var rowNum = 1 + this.padding[0];
						var x = textPos.x;
						var y = textPos.y + ((i - numSpacers) * this.tileSize);
						var indentSize = content.indented ? (this.indent * this.tileSize) : 0;

						if (content.type !== 'spacer') {
							y += ((lineSpacing * i) * this.tileSize);
						} else {
							numSpacers++;
						}
						rowNum += i;
						rowNum += (i * lineSpacing);
						content.row = rowNum;
						content.indent = content.indent || 0;
						content.column = content.column || 0;
						content.pos = {
							x: x,
							y: y
						};
						result.push({
							row: rowNum,
							// TODO Eventually, I need to handle multi-column menus. (i.e. shops)
							column: 0,
							fn: function () {
								this.font.draw(text, x + indentSize, y, ig.Font.ALIGN.LEFT);
								if (content.type === 'userInput') {
									this.drawBorder(x + (this.inputMarkerIdx * this.tileSize), y + this.tileSize, 't');
								}
							}
						});
					}, this));

				} else if (this.layout === 'grid') {
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
				}
				return result;
			},
			incrementRow: function () {
				this.currentRow++;
			},
			decrementRow: function () {
				this.currentRow--;
			},
			drawCap: function (x, y, type) {
				var times = (this.size.x / this.tileSize) - 2;
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
							this.sprite.drawTile(x + this.tileSize + (i * this.tileSize), y, 5, this.tileSize, this.tileSize);
						} else if (i + 1 >= titleStartPosX && i + 1 < titleStartPosX + this.title.length) {
							// draw blank
							this.sprite.drawTile(x + this.tileSize + (i * this.tileSize), y, 0, this.tileSize, this.tileSize);
						} else {
							this.drawBorder(x + this.tileSize + (i * this.tileSize), y, type);
						}
					} else {
						this.drawBorder(x + this.tileSize + (i * this.tileSize), y, type);
					}
				}, this));
				if (this.title) {
					this.font.draw(this.title, x + (titleStartPosX * this.tileSize), y);
				}
				this.drawCorner(x + (this.size.x - this.tileSize), y, type + 'r');
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
			},
			setGridSize: function () {
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
				result.x += this.contents.cellSize || 0;
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
			},
			setSize: function (layout) {
				var text = [];
				var textLengths = [];
				var result = {
					x: 0,
					y: 0
				};
				var spacers = _.filter(this.contents, function (content) {
					return content.type === 'spacer';
				});

				if (this.sizeOverride) {
					return this.sizeOverride;
				}
				if (layout === 'grid') {
					return this.setGridSize();
				}
				text = _.map(_.filter(this.contents, function (content) {
					return content.type !== 'spacer'
				}), 'text');
				textLengths = _.map(text, function (chars) {
					return chars.length;
				});
				// add borders
				result.x += 2;
				result.y += 2;
				// add padding if any
				result.x += this.padding[1] + this.padding[3];
				result.y += this.padding[0] + this.padding[2];
				// add room for selection cursor
				if (this.hasMenuItems()) {
					result.x++;
				}
				// add width based on longest line of text
				result.x += _.max(textLengths);
				// add height based on lines of text
				result.y += text.length;
				// add height based on lineSpacing
				result.y += (text.length - 1) * this.lineSpacing;
				// add height from all spacers
				result.y += spacers.length;
				// return actual pixels based on tilesize
				result.x *= this.tileSize;
				result.y *= this.tileSize;
				return result;
			},
			hasMenuItems: function () {
				return _.some(_.flatten(this.contents), ['type', 'menuItem']);
			},
			setupMenuItems: function () {
				this.setMenuItemIds();
				this.setDefaultSelectedMenuItem();
			},
			getMenuItems: function () {
				return _.filter(_.flatten(this.contents), _.bind(function (content) {
					return this.isMenuItem(content);
				}, this));
			},
			/**
			 * Assign arbitrary IDs to menu items.
			 */
			setMenuItemIds: function () {
				var menuItemId = 1;

				_.map(_.flatten(this.contents), _.bind(function (content) {
					if (this.isMenuItem(content)) {
						content.menuItemId = menuItemId;
						menuItemId++;
					}
					return content;
				}, this));
			},
			setDefaultSelectedMenuItem: function () {
				var menuItems = _.sortBy(this.getMenuItems(), ['pos.x', 'pos.y']);
				var defaultSelected = this.getDefaultSelectedMenuItem();
				var topLeftMenuItem;

				if (menuItems.length) {
					if (!defaultSelected) {
						topLeftMenuItem = _.head(menuItems);
						_.forEach(menuItems, _.bind(function (menuItem) {
							if (menuItem.menuItemId === topLeftMenuItem.menuItemId) {
								menuItem.defaultSelected = true;
								menuItem.isSelected = true;
								return false;
							}
						}, this));
					} else {
						defaultSelected.isSelected = true;
					}
				}
			},
			getDefaultSelectedMenuItem: function () {
				var menuItems = _.sortBy(this.getMenuItems(), ['pos.x', 'pos.y']);

				return _.find(menuItems, {defaultSelected:true});
			},
			getPositionByRowCol: function (row, col) {
				return {
					x: this.pos.x + (col * this.tileSize),
					y: this.pos.y + (row * this.tileSize)
				}
			},

			isMenuItem: function (obj) {
				return obj.type === 'menuItem';
			},
			moveSelector: function (direction) {
				var nextItem;
				var indentedSize;

				if (this.hasMenuItems()) {
					nextItem = _.isString(direction) ? this.getNextMenuItem(direction) : this.getSelectedMenuItem();
					indentedSize = nextItem.indented ? this.indent * this.tileSize : 0;
					this.selector.pos.x = nextItem.pos.x - this.tileSize + indentedSize;
					this.selector.pos.y = nextItem.pos.y;
					this.selector.row = nextItem.row;
					this.selector.currentAnim.rewind();
					this.setSelectedMenuItem(nextItem);
				}
			},
			setSelectedMenuItem: function (menuItem) {
				var menuItems = this.getMenuItems();

				if (this.hasMenuItems()) {
					_.map(menuItems, function (item) {
						// Set the default selected menuItem if no explicit menuItem was passed as arg.
						if (!menuItem) {
							item.isSelected = !!item.defaultSelected;
						} else {
							item.isSelected = false;
						}
						return item;
					});
					if (menuItem) {
						menuItem.isSelected = true;
					}
				}
			},
			getSelectedMenuItem: function () {
				return _.find(this.getMenuItems(), {isSelected: true});
			},
			getNextMenuItem: function (direction) {
				var selectedItem = this.getSelectedMenuItem();
				var x = selectedItem.pos.x;
				var y = selectedItem.pos.y;
				var menuItems = this.getMenuItems();

				var otherItems = _.reject(menuItems, {menuItemId: selectedItem.menuItemId});
				var otherDeltas = _.map(otherItems, function (item) {
					return {
						menuItemId: item.menuItemId,
						pos: {
							dx: x - item.pos.x,
							dy: y - item.pos.y,
							x: item.pos.x,
							y: item.pos.y
						},
						text: item.text
					};
				});
				var selectedItemDirectionOverrides;
				var result;

				if (this.hasMenuItems()) {
					// menu data has overrides of what the next item should be - use that first.
					if (selectedItem.directionOverrides) {
						selectedItemDirectionOverrides = _.find(selectedItem.directionOverrides, {
							direction: direction
						});
						if (selectedItemDirectionOverrides) {
							result = _.find(menuItems, {
								text: selectedItemDirectionOverrides.nextItemText
							});
						}
					}
					if (!result) {
						switch (direction) {
							case 'd':
								// weed out any menu items that are above the selected menu item
								result = _.filter(otherDeltas, function (obj) {
									return obj.pos.y > y;
								});
								// now find the closest menu item above it
								result = _.find(result, function (obj) {
									var maxByObj = _.maxBy(result, 'pos.dy');
									var dy;

									if (maxByObj.pos.dy === obj.pos.dy) {
										dy = maxByObj.pos.dy;
									}
									return dy === obj.pos.dy && x === obj.pos.x;
								});
								if (!result) {
									return selectedItem;
								}
								break;
							case 'u':
								// weed out any menu items that are below the selected menu item
								result = _.filter(otherDeltas, function (obj) {
									return obj.pos.y < y;
								});
								// now find the closest menu item below it
								result = _.find(result, function (obj) {
									var minByObj = _.minBy(result, 'pos.dy');
									var dy;

									if (minByObj.pos.dy === obj.pos.dy) {
										dy = minByObj.pos.dy;
									}
									return dy === obj.pos.dy && x === obj.pos.x;
								});
								if (!result) {
									return selectedItem;
								}
								break;
							case 'r':
								// weed out any menu items that are left of the selected menu item
								result = _.filter(otherDeltas, function (obj) {
									return obj.pos.x > x;
								});
								// now find the closest menu item to the right of it
								result = _.find(result, function (obj) {
									var maxByObj = _.maxBy(result, 'pos.dx');
									var dx;

									if (maxByObj.pos.dx === obj.pos.dx) {
										dx = maxByObj.pos.dx;
									}
									return dx === obj.pos.dx && y === obj.pos.y;
								});
								if (!result) {
									return selectedItem;
								}
								break;
							case 'l':
								// weed out any menu items that are right of the selected menu item
								result = _.filter(otherDeltas, function (obj) {
									return obj.pos.x < x;
								});
								// now find the closest menu item to the left of it
								result = _.find(result, function (obj) {
									var minByObj = _.minBy(result, 'pos.dx');
									var dx;

									if (minByObj.pos.dx === obj.pos.dx) {
										dx = minByObj.pos.dx;
									}
									return dx === obj.pos.dx && y === obj.pos.y;
								});
								if (!result) {
									return selectedItem;
								}
								break;
							default:
								break;
						}

					}
				}
				return result ? _.find(menuItems, {menuItemId: result.menuItemId}) : null;
			},
			spawnSelector: function () {
				var pos = {
					x: this.pos.x + this.tileSize + (this.padding[3] * this.tileSize),
					y: this.pos.y + (this.tileSize * 2)
				};

				if (this.hasMenuItems()) {
					pos = this.getDefaultSelectedMenuItem().pos;
				}
				return ig.game.spawnEntity(
					ig.global.Selector,
					pos.x - (this.hasMenuItems() ? this.tileSize : 0) + (this.indent * this.tileSize),
					pos.y,
					{
						row: this.getSelectedMenuItem().row,
						zIndex: this.zIndex + 1
					}
				);
			}
		});
	});
