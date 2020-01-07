const path = require("path");
const merge = require("webpack-merge");
const baseConfig = require("./webpack.config.js");
const VueSSRClientPlugin = require("vue-server-renderer/client-plugin");

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
			new VueSSRClientPlugin()
		],
		output: {
			
		}
	});
};