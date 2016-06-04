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
							[1,1,0,0];
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
							{ text: '********', type: 'text' }
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
							// s is back, the rest are end
							[
								{ text: 'w', type: 'menuItem' }, { text: 'x', type: 'menuItem' },
								{ text: 'y', type: 'menuItem' }, { text: 'z', type: 'menuItem' },
								{ text: ',', type: 'menuItem' }, { text: '.', type: 'menuItem' },
								{ text: 'BACK', type: 'menuItem', directionOverrides: [
									{direction: 'u', nextItemText: 'r'},
									// {direction: 'l', nextItemText: '.'},
									{direction: 'r', nextItemText: 'END'}
								] }, { text: '', type: 'menuItem' },
								{ text: '', type: 'menuItem' }, { text: 'END', type: 'menuItem', directionOverrides: [
								{direction: 'l', nextItemText: 'BACK'}
							] },
								{ text: '', type: 'menuItem' }
							]
						]
					}
				};
				this.menus = [
					ig.game.spawnEntity(ig.global.TextBox, 24, 56, _.assign({}, this.menuDefaults, this.menuData.mainMenu)),
					ig.game.spawnEntity(ig.global.TextBox, 72, 136, _.assign({}, this.menuDefaults, this.menuData.questMenu)),
					ig.game.spawnEntity(ig.global.TextBox, 72, 40, _.assign({}, this.menuDefaults, this.menuData.nameMenu)),
					ig.game.spawnEntity(ig.global.TextBox, 24, 72, _.assign({}, this.menuDefaults, this.menuData.alphabetMenu))
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
					} else if (ig.input.pressed('B')) {
						switch (this.state.selectedMenu.name) {
							case 'mainMenu':
								break;
							case 'questMenu':
								this.state.selectedMenu.close();
								this.setActiveMenu(_.find(this.menus, {name: 'mainMenu'}));
								break;
							case 'alphabetMenu':
								_.find(this.menus, {name: 'nameMenu'}).close();
								this.state.selectedMenu.close();
								this.setActiveMenu(_.find(this.menus, {name: 'questMenu'}));
							default:
								break;
						}
					}
				}
			},
			onAdventureLog1: function () {
				_.find(this.menus, {name: 'nameMenu'}).open();
				this.setActiveAndOpen(_.find(this.menus, {name: 'alphabetMenu'}));
			},
			onMainMenuTransitionUpdated: function (change) {
				if (change.type === 'update') {
					if (change.oldValue === 'closing' && change.newValue === 'complete') {
						this.state.selectedMenu.open();
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
