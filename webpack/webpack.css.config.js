const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const path = require("path");

module.exports = (websomServer, deployBundle) => {
	deployBundle = deployBundle || "default";

	let gatherViews = () => {
		let files = [];

		for (let [i, mod] of websomServer().module.modules.entries()) {
			let resources = websomServer().resource.compile(mod.name, mod.root, mod.baseConfig.resources);

			for (let resource of resources) {
				if (resource.type == "view") {
					files.push({
						file: resource.file,
						type: "view",
						package: mod.name
					});
				}
			}
		}

		for (let [i, theme] of websomServer().theme.themes.entries()) {
			let resources = websomServer().resource.compile(theme.name, theme.root, theme.config.resources);

			for (let resource of resources) {
				if (resource.type == "view") {
					files.push({
						file: resource.file,
						type: "view",
						package: theme.name
					});
				}
			}
		}

		return files;
	};

	return {
		entry: "./cssEntry.js",
		mode: "production",
		optimization: {
			minimizer: [new OptimizeCSSAssetsPlugin({})],
			splitChunks: {
				cacheGroups: {
					styles: {
						name: 'styles',
						test: /\.css$/,
						chunks: 'all',
						enforce: true,
					},
				},
			},
		},
		module: {
			rules: [
				{
					test: /\.view$/,
					oneOf: [
						{
							resourceQuery: /vue/,
							use: [
								{
									loader: "vue-loader"
								},
								{
									loader: path.resolve(__dirname, "./view-loader/loader.js")
								}
							]
						},
						{
							use: [
								{
									loader: path.resolve(__dirname, "./view-loader/loader.js")
								}
							]
						}
					]
				},
				{
					test: /\.js$/,
					loader: "babel-loader",
					options: {
						plugins: [
							require.resolve("@babel/plugin-syntax-dynamic-import")
						]
					}
				},
				{
					test: /\.websom-styles$/,
					use: [
						MiniCssExtractPlugin.loader,
						"css-loader",
						"less-loader",
						{
							loader: path.resolve(__dirname, "./websom-loader/loader.js"),
							options: {
								type: "styles",
								files: gatherViews,
								bundle: deployBundle
							}
						}
					]
				},
				{
					test: /\.css$/,
					use: [
						MiniCssExtractPlugin.loader,
						"css-loader",
						"less-loader"
					]
				},
				{
					test: /\.less$/,
					use: [
						MiniCssExtractPlugin.loader,
						"css-loader",
						"less-loader"
					]
				}
			]
		},
		output: {
			path: websomServer().config.javascriptOutput,
			filename: "all.js",
			publicPath: "/"
		},
		plugins: [
			new MiniCssExtractPlugin()
		],
		context: path.resolve(__dirname),
		resolve: {
			modules: [
				path.resolve(__dirname, "../node_modules")
			],
			alias: {
				Util: path.resolve(__dirname, './')
			}
		}
	};
};