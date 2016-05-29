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
				var font = _.find(Data.fonts, {color: 'ffffff'});

				this.font = new ig.Font(font.family);
				this.font = _.assign(this.font, _.pick(font, ['letterSpacing', 'lineSpacing', 'height']));
				this.initActions();
				this.initInputBindings();
			},
			initActions: function () {
				this.dataStateInterceptor = mobx.intercept(Data.state, _.bind(function (change) {
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
				}, this));
				this.dataStateObserver = mobx.observe(Data.state, _.bind(function (change) {
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
				}, this));
			},
			initInputBindings: function () {
				_.forEach(Data.config.keyMap, function (val, key) {
					ig.input.bind(ig.KEY[key], val);
				});
			},
			// update: function () {
			// 	this.parent();
			//	
			// },

			// draw: function () {
			// 	this.parent();
			// 	this.font.draw(this.timer.delta().toFixed(1), 8, 8, ig.Font.ALIGN.LEFT);
			//
			// }
		});


		// ig.main('#canvas', ig.global.Main, Data.fps, Data.width, Data.height, Data.scale);

	});
