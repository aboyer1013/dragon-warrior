const path = require('path');

module.exports = {
	env: {
		browser: true,
		'jest/globals': true,
	},
	extends: 'eslint-config-airbnb',
	plugins: [
		'jest'
	],
	parser: 'babel-eslint',
	rules: {
		'arrow-body-style': 'off',
		'class-methods-use-this': 'off',
		'import/prefer-default-export': 'off',
		'import/no-cycle': 'off',
		'import/named': 'off',
		'import/no-named-as-default': 'off',
		'import/no-named-as-default-member': 'off',
		'import/prefer-default-export': 'off',
		'import/no-default-export': 2,
		'indent': [2, 'tab', {'SwitchCase': 1}],
		'jsx-a11y/anchor-is-valid': 'off',
		'jsx-a11y/label-has-associated-control': 'off',
		'jsx-a11y/label-has-for': 'off',
		'jsx-a11y/no-static-element-interactions': 'off',
		'jsx-a11y/click-events-have-key-events': 'off',
		'max-len': 'off',
		'no-console': 'off',
		'no-new': 'off',
		'no-param-reassign': 'off',
		'no-restricted-syntax': 'off',
		'no-tabs': 'off',
		'no-use-before-define': 'off',
		'operator-linebreak': 'off',
		'prefer-arrow-callback': 'off',
		'react/destructuring-assignment': 'off',
		'react/jsx-closing-tag-location': 'off',
		'react/jsx-indent': [2, 'tab'],
		'react/jsx-indent-props': [2, 'tab'],
		'react/jsx-one-expression-per-line': 'off',
		'react/jsx-filename-extension': 'off',
		'react/jsx-wrap-multilines': 'off',
		'react/no-access-state-in-setstate': 'off',
		'react/prop-types': 'off',
		'react/react-in-jsx-scope': 'off',
		'space-before-function-paren': ['error', 'always'],
	},
	settings: {
		'import/resolver': {
			// node: {
			// 	paths: [path.resolve(__dirname, './src')],
			// },
			alias: {
				map: [
					['~', './src'],
				],
				extensions: ['.js', '.jsx'],
			}
		}
	}
};