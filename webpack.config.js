var webpack = require('webpack');
var UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
var path = require('path');
var env = require('yargs').argv.mode;

var libraryName = 'base-components';

var plugins = [], outputFile;

if (env === 'build') {
	plugins.push(new UglifyJsPlugin({ minimize: true }));
	outputFile = libraryName + '.min.js';
} else {
	outputFile = libraryName + '.js';
}

var config = {
	entry: __dirname + '/src/index.js',
	devtool: 'source-map',
	output: {
		path: __dirname + '/build',
		filename: outputFile,
		library: libraryName,
		libraryTarget: 'commonjs2'
	},
	module: {
		loaders: [
			{
				test: /(\.jsx|\.js)$/,
				loader: 'babel',
				exclude: /(node_modules)/
			}
		]
	},
	resolve: {
		root: path.resolve('./src'),
		extensions: ['', '.js']
	},
	plugins: plugins,
	node: {
		global: false
	}
};

module.exports = config;