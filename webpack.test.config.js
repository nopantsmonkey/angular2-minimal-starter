var path = require('path');

var ProvidePlugin = require('webpack/lib/ProvidePlugin');
var DefinePlugin = require('webpack/lib/DefinePlugin');
var ENV = process.env.ENV = process.env.NODE_ENV = 'test';

module.exports = {
	resolve: {
		cache: false,
		extensions: ['', '.ts', '.js', '.html']
	},
	module: {
		loaders: [
			{
				test: /\.ts$/,
				loader: 'ts-loader',
				query: {
					'compilerOptions': {
						'removeComments': true,
						'noEmitHelpers': true
					},
					'ignoreDiagnostics': [
						2403, // 2403 -> Subsequent variable declarations
						2300, // 2300 Duplicate identifier
						2374, // 2374 -> Duplicate number index signature
						2375  // 2375 -> Duplicate string index signature
					]
				},
				exclude: [/\.e2e\.ts$/, /node_modules/]
			},
			{ test: /\.html$/, loader: 'raw-loader' }
		],
		postLoaders: [
			// instrument only testing sources with Istanbul
			{
				test: /\.(js|ts)$/,
				include: root('app'),
				loader: 'istanbul-instrumenter-loader',
				exclude: [
					/\.e2e\.ts$/,
					/node_modules/,
					/vendor\.ts$/
				]
			}
		],
		noParse: [
			/zone\.js\/dist\/.+/,
			/angular2\/bundles\/.+/,
			/vendor\.ts/
		]
	},
	devtool: 'inline-source-map',
	stats: { colors: true, reasons: true },
	debug: false,
	plugins: [
		new DefinePlugin({
			'process.env': {
				'ENV': JSON.stringify(ENV),
				'NODE_ENV': JSON.stringify(ENV)
			},
			'global': 'window',
			'__metadata': 'Reflect.metadata',
			'__decorate': 'Reflect.decorate'
		}),
		new ProvidePlugin({
			// '__metadata': 'ts-helper/metadata',
			// '__decorate': 'ts-helper/decorate',
			'__awaiter': 'ts-helper/awaiter',
			'__extends': 'ts-helper/extends',
			'__param': 'ts-helper/param',
			'Reflect': 'es7-reflect-metadata/dist/browser'
		})
	],

	// we need this due to problems with es6-shim
	node: {
		window: 'window',
		Window: 'window',
		global: 'window',
		progress: false,
		crypto: 'empty',
		module: false,
		clearImmediate: false,
		setImmediate: false
	}
};

// Helper functions

function root(args) {
	args = Array.prototype.slice.call(arguments, 0);
	return path.join.apply(path, [__dirname].concat(args));
}