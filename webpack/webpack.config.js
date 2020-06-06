const path = require("path");
const fs = require("fs");
const VueLoaderPlugin = require("vue-loader/lib/plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = (websomServer, deployBundle, production, isServerBundle) => {

	deployBundle = deployBundle || "default";

	let gatherViews = () => {
		let files = [];

		for (let [i, pack] of websomServer().pack.packs.entries()) {
			let dirs = [];
			let collectFiles = (dir) => {
				dirs.push({path: dir});

				for (let f of fs.readdirSync(path.resolve(pack.root, dir))) {
					if (f == "." || f == "..")
						continue;
					
					if (fs.lstatSync(path.resolve(pack.root, dir + "/" + f)).isDirectory()) {
						collectFiles(dir + "/" + f);
					}
				}
			};
			collectFiles("./views");
			
			let resources = websomServer().resource.compile(pack.name, pack.root, dirs);

			for (let resource of resources) {
				if (resource.type == "view") {
					files.push({
						file: resource.file,
						type: "view",
						package: pack.name,
						packageType: "package"
					});
				}
			}
		}

		for (let [i, mod] of websomServer().module.modules.entries()) {
			let resources = websomServer().resource.compile(mod.name, mod.root, mod.baseConfig.resources);

			for (let resource of resources) {
				if (resource.type == "view") {
					files.push({
						file: resource.file,
						type: "view",
						package: mod.name,
						packageType: "module"
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
						package: theme.name,
						packageType: "theme"
					});
				}
			}
		}

		return files;
	};

	let styleLoaders = ["vue-style-loader"];

	if (production) {
		styleLoaders = [MiniCssExtractPlugin.loader];
	}

	if (production && isServerBundle)
		styleLoaders = [];

	let cnf = {
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
									loader: path.resolve(__dirname, "./view-loader/loader.js"),
									options: {
										server: websomServer()
									}
								}
							]
						},
						{
							use: [
								{
									loader: path.resolve(__dirname, "./view-loader/loader.js"),
									options: {
										server: websomServer()
									}
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
							loader: path.resolve(__dirname, "./view-loader/loader.js"),
							options: {
								server: websomServer()
							}
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
								files: gatherViews,
								bundle: deployBundle,
								server: websomServer()
							}
						}
					]
				},
				{
					test: /\.websom-effects$/,
					use: [
						{
							loader: path.resolve(__dirname, "./websom-loader/loader.js"),
							options: {
								type: "effects",
								files: gatherViews
							}
						}
					]
				},
				{
					test: /\.websom-state$/,
					use: [
						{
							loader: path.resolve(__dirname, "./websom-loader/loader.js"),
							options: {
								type: "state",
								files: gatherViews
							}
						}
					]
				},
				{
					test: /\.websom-scripts$/,
					use: [
						{
							loader: path.resolve(__dirname, "./websom-loader/loader.js"),
							options: {
								type: "script",
								files: gatherViews,
								bundle: deployBundle
							}
						}
					]
				},
				{
					test: /\.websom-styles$/,
					use: [
						...styleLoaders,
						"css-loader",
						"less-loader",
						{
							loader: path.resolve(__dirname, "./websom-loader/loader.js"),
							options: {
								type: "styles",
								files: gatherViews,
								bundle: deployBundle,
								server: websomServer()
							}
						}
					]
				},
				{
					test: /\.json$/,
					issuer: /\.websom-styles$/,
					use: [
						{
							loader: path.resolve(__dirname, "./websom-loader/loader.js"),
							options: {
								type: "empty",
								files: () => []
							}
						}
					]
				},
				{
					test: /\.css$/,
					use: [
						...styleLoaders,
						"css-loader",
						"less-loader"
					]
				},
				{
					test: /\.less$/,
					use: [
						...styleLoaders,
						"css-loader",
						"less-loader"
					]
				},
				{
					test: /\.js$/,
					loader: "babel-loader",
					options: {
						plugins: [
							require.resolve("@babel/plugin-syntax-dynamic-import"),
							/*require.resolve("@babel/plugin-transform-async-to-generator"),
							[
								require.resolve("@babel/plugin-transform-runtime"),
								{
									regenerator: true
								}
							]*/
						],
						presets: [
							/*[
								require.resolve("@babel/preset-env"),
								{
									targets: "> 0.25%, not dead",
									useBuiltIns: "usage"
								}
							]*/
						]
					}
				},
				{
					test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
					loader: "url-loader?limit=20000&mimetype=application/font-woff"
				},
				{
					test: /\.(ttf|eot|png|svg|jpg|gif|jpeg|webp|webm)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
					loader: "file-loader"
				}
			]
		},
		output: {
			path: websomServer().config.javascriptOutput,
			filename: websomServer().config.jsBundle,
			publicPath: "/"
		},
		plugins: [
			new VueLoaderPlugin()
		],
		context: path.resolve(__dirname),
		resolve: {
			modules: [
				path.resolve(__dirname, "../node_modules"),
				path.resolve(websomServer().config.root, "../node_modules")
			],
			alias: {
				Util: path.resolve(__dirname, './')
			}
		},
		resolveLoader: {
			alias: {
				"websom-loader": path.resolve(__dirname, "./websom-loader/loader.js")
			}
		}
	};

	if (production && !isServerBundle) {
		cnf.optimization = {
			minimizer: [
				new TerserPlugin(),
				new OptimizeCSSAssetsPlugin({})
			],
			/*splitChunks: {
				cacheGroups: {
					styles: {
						name: "styles",
						test: /\.css$/,
						chunks: "all",
						enforce: true
					}
				}
			}*/
		};

		cnf.plugins.push(new MiniCssExtractPlugin());
	}

	return cnf;
};