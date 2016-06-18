ig.module(
	'game.debug'
)
	.requires(
		'impact.debug.menu',
		'impact.collision-map',
		'impact.entity',
		'impact.game'
	)
	.defines(function(){
// Overwrite the Game's loadLevel() method to call a custom method
// on our panel, after the level is loaded
		ig.Game.inject({
			run: function( data ) {
				this.parent(data);

				// 'fancypanel' is the name we give this panel in the
				// call to ig.debug.addPanel()
				ig.debug.panels.customPanel.load(this);
				// ig.debug.panels.quillDebug.load(this);
			}
		});

// Overwrite the Entity's update() method, so we can disable updating
// for a particular entity at a time
		ig.Entity.inject({
			_shouldUpdate: true,
			update: function() {
				if( this._shouldUpdate ) {
					this.parent();
				}

			}
		});

		CustomPanel = ig.DebugPanel.extend({

			init: function( name, label ) {
				// This creates the DIV container for this panel
				this.parent( name, label );
				// You may want to load and use jQuery here, instead of
				// dealing with the DOM directly...


			},

			load: function( game ) {
				// This function is called through the loadLevel() method
				// we injected into ig.Game
				var ln = function () {
					var result = '';

					_.forEach(arguments, function (arg) {
						result += arg;
					})
					return result + '<br />';
				};
				// Clear this panel
				var hero = game.getEntitiesByType(ig.global.EntityHero);
				var output = '';
				var outputPrefix = '<pre style="margin: 1em; float: left; width: 25%;">';
				var outputSuffix = '</pre>';

				if (hero.length) {
					hero = _.head(hero);
					this.container.innerHTML = outputPrefix + output + outputSuffix;
					output += ln('x: ', hero.pos.x);
					output += ln('y: ', hero.pos.y);
					output += ln('x % 16: ', hero.pos.x % 16);
					output += ln('y % 16: ', hero.pos.y % 16);
					output += ln('lastMove: ', hero.movement.lastMove);
					output += ln('direction: ', hero.movement.direction);
					output += ln('delay: ', ig.game.delay.delta());
				}
				this.container.innerHTML = outputPrefix + output + outputSuffix;
			},

			ready: function() {
				// This function is automatically called when a new Game is created.
				// ig.game is valid here!
				ig.debug.togglePanel(ig.debug.panels.customPanel);
			},

			beforeRun: function() {
				// This function is automatically called BEFORE each frame
				// is processed.
			},

			afterRun: function() {
				// This function is automatically called AFTER each frame
				// is processed.
			}
		});

		ig.debug.addPanel({
			type: CustomPanel,
			name: 'customPanel',
			label: 'Custom Panel'
		});



	});