ig.module(
	'game.screens.main-menu'
)
	.requires(
		'game.game',
		'game.entities.npc',
		'game.entities.textbox.standard',
		'game.entities.textbox.userInput',
		'impact.debug.debug',
		'game.entities.selector',
		'game.screens.world'
	)
	.defines(function () {

		ig.global.MainMenuScreen = ig.global.Game.extend({

			init: function () {
				Data.adventureLogs = Data.getAdventureLogData();
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
						sizeOverride: {x: 192},
						padding: (function () {
							if (!Data.hasAdventureLogs()) {
								return [1,4,0,0];
							}
							return [1,1,0,0];
						}()),
						contents: (_.bind(function () {
							return this.getMainMenuItems();
						}, this)())
					},
					questsMenu: {
						name: 'questsMenu',
						zIndex: 5,
						padding: [1,2,0,0],
						contents: (_.bind(function () {
							return this.getQuestMenuItems(true);
						}, this)())
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
							{text: 'NORMAL', type: 'menuItem', indented: true, defaultSelected: true},
							{text: 'SLOW', type: 'menuItem', indented: true}
						]
					},
					existingQuestsMenu: {
						name: 'existingQuestsMenu',
						zIndex: 5,
						padding: [1,1,0,0],
						contents: (_.bind(function () {
							return this.getQuestMenuItems();
						}, this)())
					},
					eraseQuestMenu: {
						name: 'eraseQuestMenu',
						zIndex: 25,
						padding: [1,3,0,1]
					},
					confirmMenu: {
						name: 'confirmMenu',
						zIndex: 5,
						padding: [1,2,0,0],
						contents: [
							{text: 'YES', type: 'menuItem'},
							{text: 'NO', type: 'menuItem'}
						]
					}
				};
				this.menus = [
					ig.game.spawnEntity(ig.global.TextBox.Standard, 24, 56, _.assign({}, this.menuDefaults, this.menuSettings.mainMenu)),
					ig.game.spawnEntity(ig.global.TextBox.Standard, 72, 136, _.assign({}, this.menuDefaults, this.menuSettings.questsMenu)),
					ig.game.spawnEntity(ig.global.TextBox.UserInput, 24, 72, this.menuDefaults),
					ig.game.spawnEntity(ig.global.TextBox.Standard, 56, 104, _.assign({}, this.menuDefaults, this.menuSettings.msgSpeedMenu)),
					ig.game.spawnEntity(ig.global.TextBox.Standard, 40, 88, _.assign({}, this.menuDefaults, this.menuSettings.existingQuestsMenu)),
					ig.game.spawnEntity(ig.global.TextBox.Standard, 40, 104, _.assign({}, this.menuDefaults, this.menuSettings.eraseQuestMenu)),
					ig.game.spawnEntity(ig.global.TextBox.Standard, 152, 40, _.assign({}, this.menuDefaults, this.menuSettings.confirmMenu))
				];
				this.addListeners();
				this.setActiveAndOpen(this.getMenuByName('mainMenu'));
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
			isMenuOpenAndEnabled: function (menu) {
				return menu.state.get('isOpen') && !menu.state.get('isDisabled');
			},
			getMenuByName: function (name) {
				return _.find(this.menus, {name: name});
			},
			getMainMenuItems: function () {
				var items = [];

				if (!Data.areAdventureLogsFull()) {
					items.push({text: 'BEGIN A NEW QUEST', type: 'menuItem'});
				}
				if (Data.hasAdventureLogs()) {
					items.push(
						{text: 'CONTINUE A QUEST', type: 'menuItem'},
						{text: 'CHANGE MESSAGE SPEED', type: 'menuItem'}
					);
					if (!Data.areAdventureLogsFull()) {
						items.push({text: 'COPY A QUEST', type: 'menuItem'});
					}
				}
				if (Data.hasAdventureLogs()) {
					items.push({text: 'ERASE A QUEST', type: 'menuItem'});
				}
				return items;
			},
			getEraseQuestContent: function (data) {
				var lvl = data.lvl || '1';

				return [
					{text: data.name, type: 'static'},
					{text: 'LEVEL   ' + lvl, type: 'static'},
					{text: 'Do You Want To', type: 'static'},
					{text: 'Erase This', type: 'static'},
					{text: 'Character?', type: 'static'}
				];
			},
			getQuestMenuItems: function (showEmptyInstead) {
				var result = [];
				var heroName = '';
				var advLogTxt = 'ADVENTURE LOG ';
				var logTxt = '';

				_.forEach(Data.adventureLogs, function (log, i) {
					logTxt = advLogTxt + (i + 1).toString();
					if (!_.isEmpty(log) && !showEmptyInstead) {
						heroName = log.hero.name && _.padEnd(log.hero.name.substring(0, 4), 4);
						result.push({text: logTxt + ':' + heroName, type: 'menuItem'})
					} else if (_.isEmpty(log) && showEmptyInstead) {
						result.push({text: logTxt, type: 'menuItem'})
					}
				});
				return result;
			},
			handleEvents: function () {
				var selectedMenu = this.state.selectedMenu;
				var selectedMenuItem = selectedMenu.getSelectedMenuItem();
				var activeQuestMenu = _.find([this.getMenuByName('questsMenu'), this.getMenuByName('existingQuestsMenu')], function (menu) {
					return !menu.state.get('isHidden');
				});
				var mainMenuText;
				var advLogIdx;

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
						if (this.isMenuOpenAndEnabled(selectedMenu)) {
							mainMenuText = this.getMenuByName('mainMenu').getSelectedMenuItem().text;
							this.autoBindMenuItems(selectedMenu);
							switch (selectedMenu.name) {
								case 'mainMenu':
									if (selectedMenuItem.text === 'BEGIN A NEW QUEST') {
										this.setActiveAndOpen(this.getMenuByName('questsMenu'));
									} else {
										this.setActiveAndOpen(this.getMenuByName('existingQuestsMenu'));
									}
									break;
								case 'userInputMenu':
									if (selectedMenuItem.text === 'END') {
										this.setActiveAndOpen(this.getMenuByName('msgSpeedMenu'));
									} else if (selectedMenuItem.text === 'BACK') {
										selectedMenu.nameMenu.decrementInputMarker();
									} else {
										this.updateName(selectedMenuItem);
									}
									break;
								case 'msgSpeedMenu':
									advLogIdx = this.getAdventureLogIdx(activeQuestMenu.getSelectedMenuItem().text);
									this.saveAdventureLog(advLogIdx, {
										msgSpeed: selectedMenuItem.text,
										hero: {
											name: this.getHeroData(activeQuestMenu, advLogIdx).name,
											lvl: this.getHeroData(activeQuestMenu, advLogIdx).lvl
										}
									});
									if (mainMenuText === 'CHANGE MESSAGE SPEED') {
										this.closeAllBut(this.getMenuByName('mainMenu'));
									} else {
										ig.system.setGame(ig.global.WorldScreen);
									}
									break;
								case 'questsMenu':
									if (mainMenuText === 'COPY A QUEST') {
										this.setActiveAndOpen(this.getMenuByName('confirmMenu'));
									} else {
										this.getMenuByName('userInputMenu').nameMenu.open();
										this.getMenuByName('userInputMenu').setSelectedMenuItem(this.getMenuByName('userInputMenu').getDefaultSelectedMenuItem());
										this.getMenuByName('userInputMenu').moveSelector();
										this.setActiveAndOpen(this.getMenuByName('userInputMenu'));
									}
									break;
								case 'existingQuestsMenu':
									if (mainMenuText === 'CHANGE MESSAGE SPEED') {
										advLogIdx = this.getAdventureLogIdx(activeQuestMenu.getSelectedMenuItem().text);
										this.getMenuByName('msgSpeedMenu').updateContent(_.map(this.getMenuByName('msgSpeedMenu').contents, function (content) {
											if (content.defaultSelected) {
												content.defaultSelected = false;
											}
											if (content.text === Data.adventureLogs[advLogIdx].msgSpeed) {
												content.defaultSelected = true;
											}
											return content;
										}));
										this.setActiveAndOpen(this.getMenuByName('msgSpeedMenu'));
									} else if (mainMenuText === 'COPY A QUEST') {
										this.setActiveAndOpen(this.getMenuByName('questsMenu'));
									} else if (mainMenuText === 'ERASE A QUEST') {
										advLogIdx = this.getAdventureLogIdx(activeQuestMenu.getSelectedMenuItem().text);
										this.getMenuByName('eraseQuestMenu').updateContent(this.getEraseQuestContent(this.getHeroData(activeQuestMenu, advLogIdx)));
										this.getMenuByName('eraseQuestMenu').open();
									} else if (mainMenuText === 'CONTINUE A QUEST') {
										ig.system.setGame(ig.global.WorldScreen);
									}
									break;
								case 'confirmMenu':
									advLogIdx = this.getAdventureLogIdx(activeQuestMenu.getSelectedMenuItem().text);
									if (mainMenuText === 'COPY A QUEST') {
										this.copyAdventureLogTo(
											this.getAdventureLogIdx(this.getMenuByName('existingQuestsMenu').getSelectedMenuItem().text),
											this.getAdventureLogIdx(this.getMenuByName('questsMenu').getSelectedMenuItem().text)
										);
									} else if (mainMenuText === 'ERASE A QUEST') {
										this.saveAdventureLog(advLogIdx, null);
									}
									this.closeAllBut(this.getMenuByName('mainMenu'));
									break;
								default:
									break;
							}
						}
					} else if (ig.input.pressed('B')) {
						switch (this.state.selectedMenu.name) {
							case 'questsMenu':
							case 'existingQuestsMenu':
							case 'msgSpeedMenu':
							case 'confirmMenu':
								this.closeAllBut(this.getMenuByName('mainMenu'));
								this.getMenuByName('confirmMenu').selector.pos = this.getMenuByName('confirmMenu').getDefaultSelectorPos().pos;
								break;
							case 'userInputMenu':
								if (this.state.selectedMenu.state.get('isOpen')) {
									this.getMenuByName('userInputMenu').nameMenu.decrementInputMarker();
								}
								break;
							default:
								break;
						}
					}
				}
			},
			getAdventureLogIdx: function (text) {
				return text.match((/adventure log (\d)/i))[1] - 1;
			},
			getHeroData: function (activeQuestMenu, advLogIdx) {
				if (activeQuestMenu.name === 'existingQuestsMenu') {
					return {
						name: Data.adventureLogs[advLogIdx].hero.name,
						lvl: Data.adventureLogs[advLogIdx].hero.lvl
					};
				}
				return {
					name: this.getMenuByName('userInputMenu').userInput,
					lvl: 1
				};
			},
			saveAdventureLog: function (idx, data) {
				Data.saveAdventureLog(idx, data);
				this.getMenuByName('mainMenu').updateContent(this.getMainMenuItems());
				this.getMenuByName('questsMenu').updateContent(this.getQuestMenuItems(true));
				this.getMenuByName('existingQuestsMenu').updateContent(this.getQuestMenuItems());
			},
			onConfirmMenuNo: function () {
				this.closeAllBut(this.getMenuByName('mainMenu'));
			},
			copyAdventureLogTo: function (fromIdx, toIdx) {
				this.saveAdventureLog(toIdx, Data.adventureLogs[fromIdx]);
			},
			closeAllBut: function (arg) {
				_.forEach(_.filter(this.menus, function (menu) {
					return menu.name !== arg.name
				}), _.bind(function (menu) {
					menu.close();
				}, this));
				this.setActiveMenu(arg);
			},
			autoBindMenuItems: function (selectedMenu) {
				var selectedMenuItem = selectedMenu.getSelectedMenuItem();
				var menuCommandMethodName = 'on' + _.upperFirst(selectedMenu.name) + _.upperFirst(_.camelCase(selectedMenuItem.text));

				if (_.isFunction(this[menuCommandMethodName])) {
					this[menuCommandMethodName]();
				}
			},
			// TODO should this be somewhere else? within userInput class?
			updateName: function (selectedMenuItem) {
				var userInputMenu = _.find(this.menus, {name: 'userInputMenu'});
				var nameMenu = userInputMenu.nameMenu;
				var input = nameMenu.getUserInputText().split('');

				input[nameMenu.inputMarkerIdx] = selectedMenuItem.text;
				nameMenu.updateContent([{text: input.join(''), type: 'userInput'}]);
				userInputMenu.userInput = nameMenu.getCleanUserInputText();
				if (nameMenu.isInputMarkerAtEnd()) {
					this.setActiveAndOpen(_.find(this.menus, {name: 'msgSpeedMenu'}));
				}
				nameMenu.incrementInputMarker();
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
			onEraseQuestMenuTransitionUpdated: function (change) {
				if (change.type === 'update') {
					if (change.oldValue === 'opening' && change.newValue === 'complete') {
							this.setActiveAndOpen(this.getMenuByName('confirmMenu'));
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
			onExistingQuestsMenuTransitionUpdated: function (change) {
				this.onQuestsMenuTransitionUpdated(change);
			},
			onQuestsMenuTransitionUpdated: function (change) {
				if (change.type === 'update') {
					if (change.oldValue === 'closing' && change.newValue === 'complete') {
						this.getMenuByName('mainMenu').close();
					}
				}
			}
		});
	});
