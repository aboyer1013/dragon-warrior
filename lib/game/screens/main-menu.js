ig.module(
	'game.screens.main-menu'
)
	.requires(
		'game.game',
		'game.entities.textbox.standard',
		'game.entities.textbox.userInput',
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
				this.menuSettings = {
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
								items.push({text: 'BEGIN A NEW QUEST', type: 'menuItem'});
							} else {
								items.push(
									{text: 'CONTINUE A QUEST', type: 'menuItem'},
									{text: 'CHANGE MESSAGE SPEED', type: 'menuItem'},
									{text: 'BEGIN A NEW QUEST', type: 'menuItem'},
									{text: 'COPY A QUEST', type: 'menuItem'},
									{text: 'ERASE A QUEST', type: 'menuItem'}
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
							{text: 'ADVENTURE LOG 1', type: 'menuItem'},
							{text: 'ADVENTURE LOG 2', type: 'menuItem'},
							{text: 'ADVENTURE LOG 3', type: 'menuItem'}
						]
					},
					msgSpeedMenu: {
						name: 'msgSpeedMenu',
						zIndex: 20,
						padding: [0,2,0,0],
						indent: 5,
						contents: [
							{text: 'Which Message', type: 'static'},
							{text: 'Speed Do You', type: 'static'},
							{text: 'Want To Use?', type: 'static'},
							{text: '', type: 'spacer'},
							{text: 'FAST', type: 'menuItem', indented: true},
							{text: 'NORMAL', type: 'menuItem', indented: true},
							{text: 'SLOW', type: 'menuItem', indented: true}
						]
					}
				};
				this.menus = [
					ig.game.spawnEntity(ig.global.TextBox.Standard, 24, 56, _.assign({}, this.menuDefaults, this.menuSettings.mainMenu)),
					ig.game.spawnEntity(ig.global.TextBox.Standard, 72, 136, _.assign({}, this.menuDefaults, this.menuSettings.questMenu)),
					ig.game.spawnEntity(ig.global.TextBox.UserInput, 24, 72, this.menuDefaults),
					ig.game.spawnEntity(ig.global.TextBox.Standard, 56, 104, _.assign({}, this.menuDefaults, this.menuSettings.msgSpeedMenu))
				];
				this.addListeners();
				this.setActiveMenu(_.find(this.menus, {name: 'mainMenu'}));
				_.find(this.menus, {name: 'mainMenu'}).open();
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
			addListeners: function () {
				_.forEach(this.menus, _.bind(function (menu) {
					this.addListener(menu.name, menu.state);
				}, this));
			},
			setActiveMenu: function (menu) {
				var otherMenus = _.reject(this.menus, {name: menu.name});

				_.map(otherMenus, function (otherMenu) {
					otherMenu.state.set('isDisabled', true);
					return otherMenu;
				});
				menu.state.set('isDisabled', false);
				this.state.selectedMenu = menu;
			},
			setActiveAndOpen: function (menu) {
				this.setActiveMenu(menu);
				menu.open();
			},
			handleEvents: function () {
				var selectedMenuItem = this.state.selectedMenu.getSelectedMenuItem();
				var nameMenu = _.find(this.menus, {name: 'userInputMenu'}).nameMenu;
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
							case 'userInputMenu':
								if (this.state.selectedMenu.state.get('isOpen')) {
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
							case 'userInputMenu':
								if (this.state.selectedMenu.state.get('isOpen')) {
									nameMenu.decrementInputMarker();
								}
								break;
							case 'msgSpeedMenu':
								if (this.state.selectedMenu.state.get('isOpen')) {
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
				var nameMenu = _.find(this.menus, {name: 'userInputMenu'}).nameMenu;
				var input = nameMenu.getUserInputText().split('');

				input[nameMenu.inputMarkerIdx] = selectedMenuItem.text;
				nameMenu.updateContent([{text: input.join(''), type: 'userInput'}]);
				if (nameMenu.isInputMarkerAtEnd()) {
					this.setActiveAndOpen(_.find(this.menus, {name: 'msgSpeedMenu'}));
				}
				nameMenu.incrementInputMarker();
			},
			onAdventureLog1: function () {
				_.find(this.menus, {name: 'userInputMenu'}).nameMenu.open();
				this.setActiveAndOpen(_.find(this.menus, {name: 'userInputMenu'}));
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
			onNameMenuTransitionUpdated: function (change) {
				var userInputMenu = _.find(this.menus, {name: 'userInputMenu'});
				var nameMenu = userInputMenu.nameMenu;

				if (change.type === 'update') {
					if (change.oldValue === 'closing' && change.newValue === 'complete') {
						nameMenu.updateContent(userInputMenu.getDefaultNameMenuContents());
						nameMenu.resetInputMarker();
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
