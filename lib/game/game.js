// Class helper for ig.Game
ig.module(
	'game.game'
)
	.requires(
		'impact.game',
		'impact.font'
	)
	.defines(function () {

		ig.global.Game = ig.Game.extend({

			init: function () {
				this.initFont();
				this.initListeners();
				this.initInputBindings();
			},
			initFont: function () {
				var font = _.find(Data.fonts, {color: 'ffffff'});

				this.font = new ig.Font(font.family);
				this.font = _.assign(this.font, _.pick(font, ['letterSpacing', 'lineSpacing', 'height']));
			},
			initListeners: function () {
				this.listeners = [
					{
						name: 'dataStateInterceptor',
						type: 'interceptor',
						handler: mobx.intercept(Data.state, _.bind(function (change) {
							var methodName;
	
							console.log('interceptor called');
							switch (change.type) {
								case 'update':
									methodName = 'onBefore' + _.upperFirst(change.name) + 'Updated';
									if (_.isFunction(this[methodName])) {
										return this[methodName](change);
									}
									break;
								default:
									break;
							}
							return change;
						}, this))
					},
					{
						name: 'dataStateObserver',
						type: 'observer',
						handler: mobx.observe(Data.state, _.bind(function (change) {
							var methodName;

							console.log('observer called!', change);
							switch (change.type) {
								case 'update':
									methodName = 'on' + _.upperFirst(change.name) + 'Updated';
									if (_.isFunction(this[methodName])) {
										return this[methodName](change);
									}
									break;
								default:
									break;
							}
							return change;
						}, this))
					}
				]
				
			},
			initInputBindings: function () {
				_.forEach(Data.config.keyMap, function (val, key) {
					ig.input.bind(ig.KEY[key], val);
				});
			},
			onScreenUpdated: function () {
				this.detachBindings();
				this.killAllEntities();
			},
			// Detach bindings to prepare loading of the next Game object (screen).
			detachBindings: function () {
				ig.input.unbindAll();
				_.forEach(this.listeners, function (listener) {
					listener.handler();
				});
			},
			killAllEntities: function () {
				_.forEach(this.entities, function (entity) {
					entity.kill();
				})
			}
		});
	});
