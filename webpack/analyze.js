const Vue = require("vue");
const fs = require("fs");

const path = require("path");

const webpack = require("webpack");

const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

module.exports = async (websomServer, deploy) => {
	const tmp = path.resolve(websomServer.config.root, "../analysis");
	if (!fs.existsSync(tmp))
		fs.mkdirSync(tmp);

	let deployBundle = deploy ? deploy.bundle : "default";

	let config = require("./webpack.client.config")(() => websomServer, deployBundle, true);
	config.output.path = tmp;
	config.mode = "production";

	config.plugins.push(
		new BundleAnalyzerPlugin({
			openAnalyzer: true,
			analyzerPort: 8971,
			defaultSizes: "stat"
		})
	);

	let compiler = webpack(config);

	await new Promise((res, rej) => {
		compiler.run((err, stats) => {
			console.log(stats.errors);
			res();
		});
	});
};