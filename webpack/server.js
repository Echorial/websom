const Vue = require("vue");
const fs = require("fs");
const express = require("express");
const cookieParser = require("cookie-parser");

const path = require("path");

const template = require("./template.js");

const wpkmd = require("webpack-dev-middleware");

const compression = require('compression');

const webpack = require("webpack");
const webpackMerge = require("webpack-merge");

const { createBundleRenderer } = require("vue-server-renderer");

const deploys = require("./deploys");

module.exports = async (websomServer, apiServer) => {
	const app = express();
	app.use(compression());
	app.use(cookieParser());

	const dist = websomServer().config.javascriptOutput;

	const ssrServer = path.resolve(dist, "./vue-ssr-server-bundle.json");
	const ssrClient = path.resolve(dist, "./vue-ssr-client-manifest.json");

	let deploy = websomServer().getDeploy(websomServer().devDeploy);

	let deployBundle = deploy ? deploy.bundle : "default";

	let config = require("./webpack.client.config")(websomServer, deployBundle);
	let serverConfig = require("./webpack.server.config.js")(websomServer, deployBundle);

	let clientHooks = {};
	let serverHooks = {};

	if (deploy) {
		if (!deploys[deploy.type]) {
			console.error("Invalid deploy type: " + deploy.type);
		}

		let outs = await ((deploys[deploy.type])({
			server: websomServer(),
			deploy,
			api: apiServer,
			template,
			bundles: {
				server: ssrServer,
				client: ssrClient
			},
			createBundleRenderer
		}));

		if (outs.server && outs.server.webpack) {
			serverConfig = webpackMerge(serverConfig, outs.server.webpack);

			serverHooks = outs.server.hooks || {};
		}

		if (outs.client && outs.client.webpack) {
			config = webpackMerge(config, outs.client.webpack);
			clientHooks = outs.client.hooks || {};
		}
	}

	if (!fs.existsSync(ssrServer)) {
		await new Promise((resolve) => {
			webpack(serverConfig, (err, stats) => {
				if (err || stats.hasErrors()) {
					console.log(stats.toString());
				}
				
				resolve();
			});
		});
	}

	let serverBundle = require(ssrServer);

	if (!fs.existsSync(ssrClient)) {
		await new Promise((resolve) => {
			webpack(config, (err, stats) => {
				if (err || stats.hasErrors()) {
					console.log(stats.toString());
				}
				
				resolve();
			});
		});
	}
	
	let clientManifest = require(ssrClient);

	let renderer = null;

	let updateRenderer = () => {
		renderer = createBundleRenderer(serverBundle, {
			runInNewContext: false,
			template: template({}),
			clientManifest: Object.assign(clientManifest, {publicPath: "/"})
		});
	};

	updateRenderer();

	if (!deploy) {
		config.plugins.push(new webpack.optimize.OccurrenceOrderPlugin());
		config.plugins.push(new webpack.HotModuleReplacementPlugin());
		config.plugins.push(new webpack.NoEmitOnErrorsPlugin());

		if (typeof config.entry == "object") {
			if (Array.isArray(config.entry)) {
				config.entry.unshift("webpack-hot-middleware/client");
			}else{
				for (let k in config.entry)
					if (Array.isArray(config.entry[k])) {
						config.entry[k].unshift("webpack-hot-middleware/client");
					}else{
						config.entry[k] = ["webpack-hot-middleware/client", config.entry[k]];
					}
			}
		}else{
			config.entry = ["webpack-hot-middleware/client", config.entry];
		}
	}

	let compiler = webpack(config);

	for (let ch in clientHooks) {
		compiler.hooks[ch].tap("deploy", clientHooks[ch]);
	}

	if (!deploy) {
		app.use(wpkmd(compiler, {
			contentBase: dist,
			hot: true,
			open: true,
			overlay: true,
			stats: {
				colors: true
			}
		}));

		let devMiddleware = require("webpack-hot-middleware")(compiler, {
			noInfo: true
		});

		app.use(devMiddleware);
	}

	compiler.hooks.done.tap("renderWatcher", stats => {
		stats = stats.toJson();
		stats.errors.forEach(err => console.error(err));
		stats.warnings.forEach(err => console.warn(err));

		if (stats.errors.length)
			return;
		
		clientManifest = JSON.parse(fs.readFileSync(path.resolve(dist, "./vue-ssr-client-manifest.json"), "utf8"));

		updateRenderer();
	});

	if (!deploy) {
		const serverCompiler = webpack(serverConfig);

		for (let sh in serverHooks) {
			serverCompiler.hooks[sh].tap("deploy", serverHooks[sh]);
		}

		serverCompiler.watch({}, (err, stats) => {
			if (err) throw err;
			stats = stats.toJson();
			if (stats.errors.length) return;

			serverBundle = JSON.parse(fs.readFileSync(path.resolve(dist, "./vue-ssr-server-bundle.json"), "utf8"));
			updateRenderer();
		});

		websomServer().devBuildWatcher = () => {
			serverCompiler.run(() => {});
			compiler.run(() => {});
		};

		app.get("*", (req, res) => {
			const context = {
				ssrRequest: req,
				url: req.url,
				api: apiServer,
				server: websomServer(),
				title: req.route.path,
				renderHeadElements() {
					return `
						<meta name="description" content="Websom page."/>
					`;
				}
			};

			renderer.renderToString(context, (err, html) => {
				if (err)
				if (err.code == "500") {
					res.status(500);
					res.end(err.toString() + err.stack);
					return;
				}else if (err.code == "404") {
					res.status(404);
					res.end("Unknown route " + context.url);
					return;
				}

				res.end(html);
			});
		});

		return app;
	}else{
		compiler.watch({}, (err, stats) => {
			console.log("Deploy watch");

			if (err) throw err;
			stats = stats.toJson();
			if (stats.errors.length) return;
		});

		websomServer().devBuildWatcher = () => {
			compiler.run(() => {
				console.log("Deploy built");
			});
		};
	}
};