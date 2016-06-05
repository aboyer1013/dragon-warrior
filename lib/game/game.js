// Class helper for ig.Game
ig.module(
	'game.game'
)
	.requires(
		'impact.game',
		'game.data',
		'impact.font'
	)
	.defines(function () {

		ig.global.Game = ig.Game.extend({
			// elapsedFrames: 0,
			// frameSpeed: new ig.Timer(Data.frameSpeed),
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
			addListener: function (name, dataSource, types) {
				name = name || '';
				types = types || ['observer'];

				this.listeners = this.listeners || [];

				if (!dataSource) {
					return;
				}
				// TODO Not sure whether or not to do this. I feel like if you want it mobx'able, then have your data source in that format.
				// if (!(config.dataSource instanceof mobx.ObservableMap)) {
				// 	config.dataSource = mobx.observable(mobx.asMap(config.dataSource));
				// }
				if (_.includes(types, 'interceptor')) {
					this.listeners.push({
						name: name + 'Interceptor',
						type: 'interceptor',
						// TODO: Possibly add group types (for group observables for a group of entities)
						handler: mobx.intercept(dataSource, _.bind(function (change) {
							var methodName;

							switch (change.type) {
								case 'update':
									methodName = 'onBefore' + _.upperFirst(name) + _.upperFirst(change.name) + 'Updated';
									if (_.isFunction(this[methodName])) {
										return this[methodName](change);
									}
									break;
								default:
									break;
							}
							return change;
						}, this))
					});
				}
				if (_.includes(types, 'observer')) {
					this.listeners.push({
						name: name + 'Observer',
						type: 'observer',
						handler: mobx.observe(dataSource, _.bind(function (change) {
							var methodName;

							switch (change.type) {
								case 'update':
									methodName = 'on' + _.upperFirst(name) + _.upperFirst(change.name) + 'Updated';
									if (_.isFunction(this[methodName])) {
										return this[methodName](change);
									}
									break;
								default:
									break;
							}
							return change;
						}, this))
					});
				}
			},
			initListeners: function () {
				this.addListener('dataState', Data.state, ['observer', 'interceptor']);
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
			},
			draw: function () {
				this.parent();
				// this.font.draw( (1 / ig.system.tick).round() + ' fps', 2, 2 );
			}
		});
	});
