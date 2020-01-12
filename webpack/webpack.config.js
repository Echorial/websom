const path = require("path");
const VueLoaderPlugin = require("vue-loader/lib/plugin");

module.exports = (websomServer) => {
	let gatherViews = () => {
		let files = [];

		for (let [i, mod] of websomServer.module.modules.entries()) {
			let resources = websomServer.resource.compile(mod.name, mod.root, mod.baseConfig.resources);

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

		for (let [i, theme] of websomServer.theme.themes.entries()) {
			let resources = websomServer.resource.compile(theme.name, theme.root, theme.config.resources);

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
		entry: "./entry.js",
		mode: "development",
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
					test: /\.vue$/,
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
					test: /\.websom-packages$/,
					use: [
						{
							loader: path.resolve(__dirname, "./websom-loader/loader.js"),
							options: {
								type: "components",
								files: gatherViews
							}
						}
					]
				},
				{
					test: /\.websom-styles$/,
					use: [
						"vue-style-loader",
						"css-loader",
						"less-loader",
						{
							loader: path.resolve(__dirname, "./websom-loader/loader.js"),
							options: {
								type: "styles",
								files: gatherViews
							}
						}
					]
				},
				{
					test: /\.css$/,
					use: [
						"vue-style-loader",
						"css-loader",
						"less-loader"
					]
				},
				{
					test: /\.less$/,
					use: [
						"vue-style-loader",
						"css-loader",
						"less-loader"
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
					test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
					loader: "url-loader?limit=20000&mimetype=application/font-woff"
				},
				{
					test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
					loader: "file-loader"
				}
			]
		},
		output: {
			path: websomServer.config.javascriptOutput,
			filename: websomServer.config.jsBundle
		},
		plugins: [
			new VueLoaderPlugin()
		],
		context: path.resolve(__dirname),
		resolve: {
			modules: [
				path.resolve(__dirname, "../node_modules")
			]
		}
	};
};