const Vue = require("vue");
const fs = require("fs");
const express = require("express");

const path = require("path");

const template = require("./template.js");

const wpkmd = require("webpack-dev-middleware");

const compression = require('compression');

const webpack = require("webpack");

const { createBundleRenderer } = require("vue-server-renderer");

module.exports = async (websomServer, apiServer) => {
	const app = express();
	app.use(compression());

	const config = require("./webpack.client.config")(websomServer);
	const serverConfig = require("./webpack.server.config.js")(websomServer);

	const dist = websomServer.config.javascriptOutput;

	const ssrServer = path.resolve(dist, "./vue-ssr-server-bundle.json");
	const ssrClient = path.resolve(dist, "./vue-ssr-client-manifest.json");
	
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
		console.log("WEBSOM: Updated renderer");

		renderer = createBundleRenderer(serverBundle, {
			runInNewContext: false,
			template: template({}),
			clientManifest: Object.assign(clientManifest, {publicPath: "/"})
		});
	};

	updateRenderer();

	config.plugins.push(new webpack.optimize.OccurrenceOrderPlugin());
	config.plugins.push(new webpack.HotModuleReplacementPlugin());
	config.plugins.push(new webpack.NoEmitOnErrorsPlugin());

	config.entry = ["webpack-hot-middleware/client", config.entry];

	let compiler = webpack(config);

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

	compiler.hooks.done.tap("renderWatcher", stats => {
		stats = stats.toJson();
		stats.errors.forEach(err => console.error(err));
		stats.warnings.forEach(err => console.warn(err));

		if (stats.errors.length)
			return;
		
		clientManifest = JSON.parse(fs.readFileSync(path.resolve(dist, "./vue-ssr-client-manifest.json"), "utf8"));

		updateRenderer();
	});

	const serverCompiler = webpack(serverConfig);

	serverCompiler.watch({}, (err, stats) => {
		if (err) throw err;
		stats = stats.toJson();
		if (stats.errors.length) return;

		serverBundle = JSON.parse(fs.readFileSync(path.resolve(dist, "./vue-ssr-server-bundle.json"), "utf8"));
		updateRenderer();
	});

	websomServer.devBuildWatcher = () => {
		serverCompiler.run(() => {});
		compiler.run(() => {});
	};

	app.get("*", (req, res) => {
		const context = { 
			url: req.url,
			api: apiServer,
			server: websomServer,
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
};