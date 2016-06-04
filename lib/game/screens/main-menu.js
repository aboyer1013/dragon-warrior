ig.module(
	'game.screens.main-menu'
)
	.requires(
		'game.game',
		'game.entities.textbox',
		'impact.debug.debug',
		'game.entities.selector'
	)
	.defines(function () {

		ig.global.MainMenuScreen = ig.global.Game.extend({

			init: function () {
				this.timer = new ig.Timer();
				this.elapsedTicks = 0;
				Data.blockInput();
				this.transitionInTime = new ig.Timer();
				this.transitionInTime.set(1);
				this.state = {};
				this.parent();
				this.menuDefaults = {
					font: this.font,
					lineSpacing: 1
				};
				this.menuData = {
					mainMenu: {
						zIndex: 0,
						name: 'mainMenu',
						padding: (function () {
							if (!Data.adventureLogs.length) {
								return [1,4,0,0];
							}
							return [1,1,0,0];
						}()),
						contents: (function () {
							var items = [];

							if (!Data.adventureLogs.length) {
								items.push({
									text: 'BEGIN A NEW QUEST',
									type: 'menuItem'
								});
							} else {
								items.push(
									{
										text: 'CONTINUE A QUEST',
										type: 'menuItem'
									},
									{
										text: 'CHANGE MESSAGE SPEED',
										type: 'menuItem'
									},
									{
										text: 'BEGIN A NEW QUEST',
										type: 'menuItem'
									},
									{
										text: 'COPY A QUEST',
										type: 'menuItem'
									},
									{
										text: 'ERASE A QUEST',
										type: 'menuItem'
									}
								);
							}
							return items;
						}())
					},
					questMenu: {
						name: 'questMenu',
						zIndex: 5,
						padding: [1,2,0,0],
						contents: [
							{ text: 'ADVENTURE LOG 1', type: 'menuItem' },
							{ text: 'ADVENTURE LOG 2', type: 'menuItem' },
							{ text: 'ADVENTURE LOG 3', type: 'menuItem' }
						]
					},
					nameMenu: {
						name: 'nameMenu',
						zIndex: 10,
						padding: [1,1,1,1],
						title: 'NAME',
						contents: [
							{ text: '********', type: 'userInput' }
						]
					},
					alphabetMenu: {
						name: 'alphabetMenu',
						zIndex: 15,
						padding: [0,0,0,0],
						layout: 'grid',
						cellSize: 1,
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
					},
					msgSpeedMenu: {
						name: 'msgSpeedMenu',
						zIndex: 20,
						padding: [0,2,0,0],
						indent: 5,
						contents: [
							{ text: 'Which Message', type: 'static' },
							{ text: 'Speed Do You', type: 'static' },
							{ text: 'Want To Use?', type: 'static' },
							{ text: '', type: 'spacer' },
							{ text: 'FAST', type: 'menuItem', indented: true },
							{ text: 'NORMAL', type: 'menuItem', indented: true },
							{ text: 'SLOW', type: 'menuItem', indented: true }
						]
					}
				};
				this.menus = [
					ig.game.spawnEntity(ig.global.TextBox, 24, 56, _.assign({}, this.menuDefaults, this.menuData.mainMenu)),
					ig.game.spawnEntity(ig.global.TextBox, 72, 136, _.assign({}, this.menuDefaults, this.menuData.questMenu)),
					ig.game.spawnEntity(ig.global.TextBox, 72, 40, _.assign({}, this.menuDefaults, this.menuData.nameMenu)),
					ig.game.spawnEntity(ig.global.TextBox, 24, 72, _.assign({}, this.menuDefaults, this.menuData.alphabetMenu)),
					ig.game.spawnEntity(ig.global.TextBox, 56, 104, _.assign({}, this.menuDefaults, this.menuData.msgSpeedMenu))
				];
				_.forEach(this.menus, _.bind(function (menu) {
					this.addListener(menu.name, menu.state);
				}, this));
				this.setActiveMenu(_.find(this.menus, {name: 'mainMenu'}));
				_.find(this.menus, {name: 'mainMenu'}).open();
				this.handleEvents();
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
			},
			setActiveMenu: function (menu) {
				var otherMenus = _.reject(this.menus, {name: menu.name});

				_.map(otherMenus, function (otherMenu) {
					otherMenu.disabled = true;
					return otherMenu;
				});
				menu.disabled = false;
				this.state.selectedMenu = menu;
			},
			setActiveAndOpen: function (menu) {
				this.setActiveMenu(menu);
				menu.open();
			},
			handleEvents: function () {
				var selectedMenuItem = this.state.selectedMenu.getSelectedMenuItem();
				var nameMenu = _.find(this.menus, {name: 'nameMenu'});
				var methodName;

				if (!Data.state.get('disableInput')) {
					if (ig.input.pressed('DOWN')) {
						this.state.selectedMenu.moveSelector('d');
					} else if (ig.input.pressed('UP')) {
						this.state.selectedMenu.moveSelector('u');
					} else if (ig.input.pressed('LEFT')) {
						this.state.selectedMenu.moveSelector('l');
					} else if (ig.input.pressed('RIGHT')) {
						this.state.selectedMenu.moveSelector('r');
					} else if (ig.input.pressed('A')) {
						methodName = selectedMenuItem.command || 'on' + _.upperFirst(_.camelCase(selectedMenuItem.text));
						if (_.isFunction(this[methodName])) {
							this[methodName]();
						}
						switch (this.state.selectedMenu.name) {
							case 'alphabetMenu':
								if (this.state.selectedMenu.isOpen) {
									if (selectedMenuItem.text === 'END' || selectedMenuItem.text === 'A') {
										this.setActiveAndOpen(_.find(this.menus, {name: 'msgSpeedMenu'}));
									} else if (selectedMenuItem.text === 'BACK') {
										nameMenu.decrementInputMarker();
									} else {
										this.updateName(selectedMenuItem);
									}
								}
								break;
							default:
								break;
						}
					} else if (ig.input.pressed('B')) {
						switch (this.state.selectedMenu.name) {
							case 'mainMenu':
								break;
							case 'questMenu':
								this.state.selectedMenu.close();
								this.setActiveMenu(_.find(this.menus, {name: 'mainMenu'}));
								break;
							case 'alphabetMenu':
								if (this.state.selectedMenu.isOpen) {
									nameMenu.decrementInputMarker();
								}
							case 'msgSpeedMenu':
								if (this.state.selectedMenu.isOpen) {
									_.forEach(_.filter(this.menus, function (menu) {
										return menu.name !== 'mainMenu'
									}), _.bind(function (menu) {
										menu.close();
									}, this));
									this.setActiveMenu(_.find(this.menus, {name: 'mainMenu'}));
								}
								break;
							default:
								break;
						}
					}
				}
			},
			updateName: function (selectedMenuItem) {
				var nameMenu = _.find(this.menus, {name: 'nameMenu'});
				var input = nameMenu.getUserInputText().split('');

				input[nameMenu.inputMarkerIdx] = selectedMenuItem.text;
				nameMenu.updateContent([{text: input.join(''), type: 'userInput'}]);
				if (nameMenu.isInputMarkerAtEnd()) {
					this.setActiveAndOpen(_.find(this.menus, {name: 'msgSpeedMenu'}));
				}
				nameMenu.incrementInputMarker();
			},
			onAdventureLog1: function () {
				_.find(this.menus, {name: 'nameMenu'}).open();
				this.setActiveAndOpen(_.find(this.menus, {name: 'alphabetMenu'}));
			},
			onMainMenuTransitionUpdated: function (change) {
				if (change.type === 'update') {
					if (change.oldValue === 'closing' && change.newValue === 'complete') {
						this.state.selectedMenu.open();
						this.state.selectedMenu.setSelectedMenuItem(this.state.selectedMenu.getDefaultSelectedMenuItem());
						this.state.selectedMenu.moveSelector(this.state.selectedMenu.getSelectedMenuItem());
					}
				}
			},
			onAlphabetMenuTransitionUpdated: function (change) {
				var nameMenu = _.find(this.menus, {name: 'nameMenu'});

				if (change.type === 'update') {
					if (change.oldValue === 'closing' && change.newValue === 'complete') {
						nameMenu.updateContent(this.menuData.nameMenu.contents);
					}
				}
			},
			onQuestMenuTransitionUpdated: function (change) {
				if (change.type === 'update') {
					if (change.oldValue === 'closing' && change.newValue === 'complete') {
						_.find(this.menus, {name: 'mainMenu'}).close();
					}
				}
			},
			onBeginANewQuest: function () {
				this.setActiveAndOpen(_.find(this.menus, {name: 'questMenu'}));
			}
		});
	});
