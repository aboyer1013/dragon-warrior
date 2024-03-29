ig.module('game.entities.hero')
.requires('game.entities.character')
.defines(function () {
	ig.global.EntityHero = ig.global.EntityCharacter.extend({
		lvl: 1,
		hp: null,
		mp: null,
		str: null,
		agi: null,
		avatar: 'hero',
		nameCharValues: [
			{chars: ['g','w','M', "'"], val: 0},
			{chars: ['h','x','N'], val: 1},
			{chars: ['i','y','O'], val: 2},
			{chars: ['j','z','P'], val: 3},
			{chars: ['k','A','Q'], val: 4},
			{chars: ['l','B','R'], val: 5},
			{chars: ['l','B','R'], val: 5},
			{chars: ['m','C','S'], val: 6},
			{chars: ['n','D','T','.'], val: 7},
			{chars: ['o','E','U',','], val: 8},
			{chars: ['p','F','V','-'], val: 9},
			{chars: ['a','q','G','W'], val: 10},
			{chars: ['b','r','H','X','?'], val: 11},
			{chars: ['c','s','I','Y','!'], val: 12},
			{chars: ['d','t','J','Z'], val: 13},
			{chars: ['e','u','K',')'], val: 14},
			{chars: ['f','v','L','('], val: 15}
		],
		baseStats: [
			{lvl:  1, str:   4, agi:   4, hp:  15, mp:   0},
			{lvl:  2, str:   5, agi:   4, hp:  22, mp:   0},
			{lvl:  3, str:   7, agi:   6, hp:  24, mp:   5},
			{lvl:  4, str:   7, agi:   8, hp:  31, mp:  16},
			{lvl:  5, str:  12, agi:  10, hp:  35, mp:  20},
			{lvl:  6, str:  16, agi:  10, hp:  38, mp:  24},
			{lvl:  7, str:  18, agi:  17, hp:  40, mp:  26},
			{lvl:  8, str:  22, agi:  20, hp:  46, mp:  29},
			{lvl:  9, str:  30, agi:  22, hp:  50, mp:  36},
			{lvl: 10, str:  35, agi:  31, hp:  54, mp:  40},
			{lvl: 11, str:  40, agi:  35, hp:  62, mp:  50},
			{lvl: 12, str:  48, agi:  40, hp:  63, mp:  58},
			{lvl: 13, str:  52, agi:  48, hp:  70, mp:  64},
			{lvl: 14, str:  60, agi:  55, hp:  78, mp:  70},
			{lvl: 15, str:  68, agi:  64, hp:  86, mp:  72},
			{lvl: 16, str:  72, agi:  70, hp:  92, mp:  95},
			{lvl: 17, str:  72, agi:  78, hp: 100, mp: 100},
			{lvl: 18, str:  85, agi:  84, hp: 115, mp: 108},
			{lvl: 19, str:  87, agi:  86, hp: 130, mp: 115},
			{lvl: 20, str:  92, agi:  88, hp: 138, mp: 128},
			{lvl: 21, str:  95, agi:  90, hp: 149, mp: 135},
			{lvl: 22, str:  97, agi:  90, hp: 158, mp: 146},
			{lvl: 23, str:  99, agi:  94, hp: 165, mp: 153},
			{lvl: 24, str: 103, agi:  98, hp: 170, mp: 161},
			{lvl: 25, str: 113, agi: 100, hp: 174, mp: 161},
			{lvl: 26, str: 117, agi: 105, hp: 180, mp: 168},
			{lvl: 27, str: 125, agi: 107, hp: 189, mp: 175},
			{lvl: 28, str: 130, agi: 115, hp: 195, mp: 180},
			{lvl: 29, str: 135, agi: 120, hp: 200, mp: 190},
			{lvl: 30, str: 140, agi: 130, hp: 210, mp: 200}
		],
		collides: ig.Entity.COLLIDES.ACTIVE,
		prevColCoords: {},
		init: function (x, y, settings) {
			this.parent(x, y, settings);
			// this.initStats();
		},
		update: function () {
			this.parent();
		},
		initStats: function () {
			var name = this.name;
			var lvl = this.lvl;
			var baseStats = _.find(this.baseStats, {lvl: lvl});
			var nameSum = 0;
			var growthType = 0;
			var shortTermStats;
			var longTermStats;
			var statNames = ['hp', 'mp', 'str', 'agi'];

			name = name.substring(0, 4);
			nameSum = this.getNameSum(name);
			growthType = this.getGrowthType(nameSum);
			longTermStats = this.getLongTermStats(growthType, baseStats);
			shortTermStats = this.getShortTermStats(nameSum, growthType, baseStats, _.difference(statNames, _.keys(longTermStats)));

			return _.assign(longTermStats, shortTermStats);
		},
		getShortTermStats: function (nameSum, growthType, baseStats, statNames) {
			var result = {};
			var modifier = Math.floor(nameSum / 4);

			modifier %= 4;
			_.forEach(statNames, function (statName) {
				result[statName] = Math.floor(baseStats[statName] * (9/10) + modifier);
			});
			return result;
		},
		getLongTermStats: function (growthType, baseStats) {
			var result = {};

			switch (growthType) {
				case 0:
					result.hp = baseStats.hp;
					result.mp = baseStats.mp;
					break;
				case 1:
					result.hp = baseStats.hp;
					result.str = baseStats.str;
					break;
				case 2:
					result.agi = baseStats.agi;
					result.mp = baseStats.mp;
					break;
				case 3:
					result.str = baseStats.str;
					result.agi = baseStats.agi;
					break;
				default:
					break;
			}
			return result;
		},
		getGrowthType: function (nameSum) {
			return nameSum % 4;
		},
		getNameSum: function (name) {
			var sum = 0;

			_.forEach(name.split(''), _.bind(function (char) {
				var match = _.find(this.nameCharValues, function (obj) {
					return _.includes(obj.chars, char);
				});

				sum += match.val || 0;
			}, this));
			return sum;
		}
	});
});