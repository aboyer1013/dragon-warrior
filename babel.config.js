module.exports = (api) => {
	api.cache(true);

	return {
		plugins: ['@babel/plugin-proposal-class-properties'],
		presets: [
			['@babel/env', {
				targets: {
					browsers: [
						'>0.25%',
						'not ie 11',
						'not op_mini all',
					],
				},
				modules: false,
			}],
		],
	};
};
