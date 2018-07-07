// webpack.config.js
var webpack = require('webpack');

module.exports = {
	entry: './index.js',
	mode: 'none',
	output: {
		filename: 'bundle.js'
	},
	plugins: [
		new webpack.ProvidePlugin({
			$: "jquery",
			jQuery: "jquery",
			"window.jQuery": "jquery"
		})
	],
	node: {
		fs: 'empty'
	}
}

