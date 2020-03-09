const path = require("path");
const merge = require("webpack-merge");
const baseConfig = require("./webpack.config.js");
const VueSSRClientPlugin = require("vue-server-renderer/client-plugin");

const CompressionPlugin = require('compression-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = (websomServer) => {
	return merge(baseConfig(websomServer), {
		entry: "./entry.js",
		/*optimization: {
			splitChunks: {
				name: "manifest",
				minChunks: Infinity
			}
		},*/
		plugins: [
			new VueSSRClientPlugin(),
			new CompressionPlugin({
				filename: '[path].gz[query]',
				algorithm: 'gzip',
				test: /\.js$|\.css$|\.html$|\.eot?.+$|\.ttf?.+$|\.woff?.+$|\.svg?.+$/,
				threshold: 10240,
				minRatio: 0.8
			}),
			new BundleAnalyzerPlugin({
				openAnalyzer: false,
				analyzerPort: 8971
			})
		]
	});
};