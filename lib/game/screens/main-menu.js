ig.module(
	'game.screens.main-menu'
)
	.requires(
		'game.game',
		'game.entities.textbox',
		'impact.debug.debug'
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
						name: 'mainMenu',
						padding: [1,1,0,0],
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
						padding: [1,2,0,0],
						contents: [
							{ text: 'ADVENTURE LOG 1', type: 'menuItem' },
							{ text: 'ADVENTURE LOG 2', type: 'menuItem' },
							{ text: 'ADVENTURE LOG 3', type: 'menuItem' }
						]
					}
				};
				this.menus = [
					ig.game.spawnEntity(ig.global.TextBox, 24, 56, _.assign({}, this.menuDefaults, this.menuData.mainMenu)),
					ig.game.spawnEntity(ig.global.TextBox, 72, 136, _.assign({}, this.menuDefaults, this.menuData.questMenu))
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
					} else if (ig.input.pressed('A')) {
						console.info(selectedMenuItem);
						methodName = selectedMenuItem.command || 'on' + _.upperFirst(_.camelCase(selectedMenuItem.text));
						if (_.isFunction(this[methodName])) {
							this[methodName]();
						}
					} else if (ig.input.pressed('B')) {
						switch (this.state.selectedMenu.name) {
							case 'questMenu':
								this.state.selectedMenu.close();
								this.setActiveMenu(_.find(this.menus, {name: 'mainMenu'}));
								break;
							case 'mainMenu':
								this.state.selectedMenu.close();
								this.state.selectedMenu.open();
								break;
							default:
								break;
						}
					}
				}
			},
			onMainMenuTransitionUpdated: function () {
				console.log('FFFFFUUUU');
			},
			onBeginANewQuest: function () {
				this.setActiveAndOpen(_.find(this.menus, {name: 'questMenu'}));
			}
		});
	});
