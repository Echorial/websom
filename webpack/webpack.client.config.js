const path = require("path");
const merge = require("webpack-merge");
const baseConfig = require("./webpack.config.js");
const VueSSRClientPlugin = require("vue-server-renderer/client-plugin");

const CompressionPlugin = require('compression-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = (websomServer, bundle, production) => {
	let conf = {
		entry: "./entry.js",
		optimization: {
			
		},
		plugins: [
			new VueSSRClientPlugin()
		]
	};

	if (!production)
		conf.devtool = "source-map";
	
	if (production) {
		conf.plugins.push(
			new CompressionPlugin({
				filename: '[path].gz[query]',
				algorithm: 'gzip',
				test: /\.js$|\.css$|\.html$|\.eot?.+$|\.ttf?.+$|\.woff?.+$|\.svg?.+$/,
				threshold: 10240,
				minRatio: 0.8
			})
		);
	}

	return merge(baseConfig(websomServer, bundle, production, false), conf);
};