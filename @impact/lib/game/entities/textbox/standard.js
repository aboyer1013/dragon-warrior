ig.module('game.entities.textbox.standard')
	.requires(
		'game.entities.entity',
		'game.entities.selector'
	)
	.defines(function () {
		ig.global.TextBox = ig.global.TextBox || {};
		ig.global.TextBox.Standard = ig.global.Entity.extend({
			tileSize: 8,
			init: function (x, y, settings) {
				this.padding = [2,1,0,0];
				this.lineSpacing = 1;
				this.title = '';
				this.gutterWidth = 0;
				this.indent = 0;
				this.inputMarkerIdx = 0;

				this.parent(x, y, settings);

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
			},
			reset: function () {
				this.size = this.getSize();
				this.totalRows = this.size.y / this.tileSize;
				this.elapsedTicks = 0;
				this.currentRow = 0;
				this.resetInputMarker();
				this.state.set('isHidden', true);
				this.drawData = this.getDrawData();
			},
			update: function () {
				this.parent();
				this.elapsedTicks++;

				if (!this.state.get('isHidden')) {
					this.handleTransition(this.state.get('transition'));
				}
				if (this.state.get('transition') === 'complete') {

				}
				if (this.hasMenuItems() && this.selector) {
					if (this.state.get('isDisabled')) {
						this.selector.currentAnim = this.selector.anims.solid;
					} else {
						this.selector.currentAnim = this.selector.anims.blinking;
					}
				}
			},
			draw: function (contentUpdated) {
				this.parent(contentUpdated);
				if (contentUpdated) {
					_.forEach(this.drawData, _.bind(function (data) {
						data.fn.call(this);
					}, this))
				} else if (!this.state.get('isHidden')) {
					_.forEach(this.filteredDrawFns, _.bind(function (data) {
						data.fn.call(this);
					}, this));
				}
				ig.game.sortEntities();
			},
			updateContent: function (newContent) {
				this.contents = newContent;
				this.setupMenuItems();
				this.size = this.getSize();
				this.totalRows = this.size.y / this.tileSize;
				this.elapsedTicks = 0;
				this.currentRow = 0;
				this.drawData = this.filteredDrawFns = this.getDrawData();
				if (this.hasMenuItems() && !this.selector) {
					this.selector = this.spawnSelector();
				} else if (!this.hasMenuItems() && this.selector) {
					this.selector.isHidden = true;
				}
				if (this.selector) {
					this.selector = _.assign(this.selector, this.getDefaultSelectorPos());
				}
				this.draw(true);
			},
			handleTransition: function (transition) {
				var isComplete = transition === 'complete';
				var isOpening = transition === 'opening';
				var isClosing = transition === 'closing';
				var shouldRowsChange;
				var areRowsComplete;

				if (isOpening) {
					this.state.set('isHidden', false);
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

				if (isOpening) {
					if (areRowsComplete) {
						this.filteredDrawFns = this.drawData;
					} else {
						this.filteredDrawFns = _.filter(this.drawData, _.bind(function (data) {
							return data.row <= this.currentRow;
						}, this));
						if (this.hasMenuItems()) {
							if (this.selector.row > this.currentRow) {
								this.selector.isHidden = true;
							} else {
								this.selector.isHidden = false;
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
								this.selector.isHidden = true;
							} else {
								this.selector.isHidden = false;
							}
						}
					}
				}

				if (areRowsComplete) {
					isComplete = true;
				}
				if (isComplete) {
					if (isOpening) {
						this.state.set('isOpen', true);
						if (this.hasMenuItems()) {
							this.selector.isHidden = false;
						}
					} else if (isClosing) {
						this.state.set('isOpen', false);
						this.state.set('isHidden', true);
						if (this.hasMenuItems()) {
							this.selector.isHidden = true;
						}
					}
					this.state.set('transition', 'complete');
					Data.unblockInput();
				}
			},
			open: function () {
				if (!this.state.get('isOpen')) {
					this.state.set('isHidden', false);
					this.state.set('transition', 'opening');
				}
			},
			close: function () {
				if (this.state.get('isOpen')) {
					this.currentRow = this.totalRows;
					this.state.set('transition', 'closing');
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
						column: content.column,
						fn: function () {
							this.font.draw(text, x + indentSize, y, ig.Font.ALIGN.LEFT);
							if (content.type === 'userInput') {
								this.drawBorder(x + (this.inputMarkerIdx * this.tileSize), y + this.tileSize, 't');
							}
						}
					});
				}, this));

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
			},
			getSize: function () {
				var text = [];
				var textLengths = [];
				var result = {
					x: 0,
					y: 0
				};
				var spacers = _.filter(this.contents, function (content) {
					return content.type === 'spacer';
				});

				text = _.map(_.filter(this.contents, function (content) {
					return content.type !== 'spacer';
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
				return _.assign(result, this.sizeOverride);
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
							case 'u':
								// weed out any menu items that are above the selected menu item
								result = _.filter(otherDeltas, function (obj) {
									return direction === 'd' ? obj.pos.y > y : obj.pos.y < y;
								});
								// now find the closest menu item above it
								result = _.find(result, function (obj) {
									var closestObj = direction === 'd' ? _.maxBy(result, 'pos.dy') : _.minBy(result, 'pos.dy');
									var dy;

									if (closestObj.pos.dy === obj.pos.dy) {
										dy = closestObj.pos.dy;
									}
									return dy === obj.pos.dy && x === obj.pos.x;
								});
								if (!result) {
									return selectedItem;
								}
								break;
							// case 'u':
							// 	// weed out any menu items that are below the selected menu item
							// 	result = _.filter(otherDeltas, function (obj) {
							// 		return obj.pos.y < y;
							// 	});
							// 	// now find the closest menu item below it
							// 	result = _.find(result, function (obj) {
							// 		var minByObj = _.minBy(result, 'pos.dy');
							// 		var dy;
							//
							// 		if (minByObj.pos.dy === obj.pos.dy) {
							// 			dy = minByObj.pos.dy;
							// 		}
							// 		return dy === obj.pos.dy && x === obj.pos.x;
							// 	});
							// 	if (!result) {
							// 		return selectedItem;
							// 	}
							// 	break;
							case 'r':
							case 'l':
								// weed out any menu items that are left of the selected menu item
								result = _.filter(otherDeltas, function (obj) {
									return direction === 'r' ? obj.pos.x > x : obj.pos.x < x;
								});
								// now find the closest menu item to the right of it
								result = _.find(result, function (obj) {
									var closestObj = direction === 'r' ? _.maxBy(result, 'pos.dx') : _.minBy(result, 'pos.dx');
									var dx;

									if (closestObj.pos.dx === obj.pos.dx) {
										dx = closestObj.pos.dx;
									}
									return dx === obj.pos.dx && y === obj.pos.y;
								});
								if (!result) {
									return selectedItem;
								}
								break;
							// case 'l':
							// 	// weed out any menu items that are right of the selected menu item
							// 	result = _.filter(otherDeltas, function (obj) {
							// 		return obj.pos.x < x;
							// 	});
							// 	// now find the closest menu item to the left of it
							// 	result = _.find(result, function (obj) {
							// 		var minByObj = _.minBy(result, 'pos.dx');
							// 		var dx;
							//
							// 		if (minByObj.pos.dx === obj.pos.dx) {
							// 			dx = minByObj.pos.dx;
							// 		}
							// 		return dx === obj.pos.dx && y === obj.pos.y;
							// 	});
							// 	if (!result) {
							// 		return selectedItem;
							// 	}
							// 	break;
							default:
								break;
						}

					}
				}
				return result ? _.find(menuItems, {menuItemId: result.menuItemId}) : null;
			},
			getDefaultSelectorPos: function () {
				var pos = {
					x: this.pos.x + this.tileSize + (this.padding[3] * this.tileSize),
					y: this.pos.y + (this.tileSize * 2)
				};
				var settings = {
					row: this.getSelectedMenuItem() ? this.getSelectedMenuItem().row : 0,
					zIndex: this.zIndex + 1
				};
				var offsetX = 0;

				if (this.hasMenuItems()) {
					pos = this.getDefaultSelectedMenuItem().pos;
					offsetX -= this.tileSize;
				}
				offsetX += this.indent * this.tileSize;
				return _.assign({}, {pos: {x: pos.x + offsetX, y: pos.y}, settings:settings});
			},
			spawnSelector: function () {
				var pos = this.getDefaultSelectorPos().pos;

				return ig.game.spawnEntity(
					ig.global.Selector,
					pos.x,
					pos.y,
					{
						row: this.getSelectedMenuItem().row,
						zIndex: this.zIndex + 1
					}
				);
			},
			getUserInputText: function () {
				var userInput = _.find(_.flatten(this.contents), {type: 'userInput'});

				if (userInput) {
					return userInput.text;
				}
				return '';
			},
			getCleanUserInputText: function () {
				return _.trim(this.getUserInputText(), '*');
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
			}
		});
	});
