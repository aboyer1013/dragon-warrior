ig.module(
	'game.data'
)
	.requires(
		'impact.game'
	)
	.defines(function () {
		var fps = 60;
		// TODO put this into an ig Class
		Data = {
			width: 240,
			height: 224,
			scale: 3,
			frameSpeed: 1 / fps,
			fonts: [
				{
					name: 'white',
					color: 'ffffff',
					family: 'media/ffffff.font.png',
					letterSpacing: 0,
					lineSpacing: -2,
					height: 10
				}
			],
			state: mobx.observable(mobx.asMap({
				disableInput: true,
				screen: 'MainMenuScreen'
			})),
			localStorageKey: 'dwAdventureLogs',
			game: {
				hero: {
					name: '',
					lvl: 1,
					hp: [0,0],
					mp: [0,0],
					str: 0,
					agi: 0
				}
			},
			currentAdventureLogIdx: null,
			maxAdventureLogs: 3,
			adventureLogs: [null],
			config: {
				keyMap: {
					PERIOD: 'START',
					COMMA: 'SELECT',
					SHIFT: 'B',
					SPACE: 'A',
					UP_ARROW: 'UP',
					RIGHT_ARROW: 'RIGHT',
					DOWN_ARROW: 'DOWN',
					LEFT_ARROW: 'LEFT'
				}
			},
			getAdventureLogData: function () {
				return JSON.parse(localStorage.getItem(this.localStorageKey)) || _.fill(_.times(this.maxAdventureLogs, '*'), null);
			},
			hasAdventureLogs: function () {
				return !_.isEmpty(_.filter(this.adventureLogs));
			},
			getOccupiedAdventureLogs: function () {
				var result = _.times(this.maxAdventureLogs, _.constant(false));

				if (this.hasAdventureLogs()) {
					return _.map(this.adventureLogs, function (log, i) {
						return !_.isEmpty(log);
					});
				}
				return result;
			},
			areAdventureLogsFull: function () {
				return _.filter(this.getOccupiedAdventureLogs()).length === this.maxAdventureLogs;
			},
			blockInput: function () {
				if (!this.state.get('disableInput')) {
					this.state.set('disableInput', true);
				}
			},
			unblockInput: function () {
				if (this.state.get('disableInput')) {
					this.state.set('disableInput', false);
				}
			},
			saveAdventureLog: function (logIdx, data) {
				var log = this.adventureLogs[logIdx];

				if (_.isNull(data)) {
					this.adventureLogs[logIdx] = null;
				} else {
					this.adventureLogs[logIdx] = _.assign(this.adventureLogs[logIdx], data);
				}
				this.saveToLocalStorage(logIdx, data);
			},
			saveToLocalStorage: function (logIdx, data) {
				var lsData = this.getAdventureLogData();

				if (_.isNull(data)) {
					lsData[logIdx] = null;
				} else {
					lsData[logIdx] = _.assign({}, lsData[logIdx], data);
				}
				localStorage.setItem(this.localStorageKey, JSON.stringify(lsData));
			}
		};

	});
