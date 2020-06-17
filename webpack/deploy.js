const Vue = require("vue");
const fs = require("fs");

const path = require("path");

const template = require("./template.js");

const compression = require('compression');

const webpack = require("webpack");
const webpackMerge = require("webpack-merge");

const { createBundleRenderer } = require("vue-server-renderer");

const deploys = require("./deploys");

module.exports = async (websomServer, deploy) => {
	const tmp = path.resolve(websomServer.config.root, "../tmp");
	if (!fs.existsSync(tmp))
		fs.mkdirSync(tmp);

	let deployBundle = deploy ? deploy.bundle : "default";

	let outputConfig = {
		output: {
			path: path.resolve(websomServer.config.root, "../dist_deploy")
		}
	};

	let config = require("./webpack.client.config")(() => websomServer, deployBundle, true);
	let serverConfig = require("./webpack.server.config.js")(() => websomServer, deployBundle, true);
	//let cssConfig = require("./webpack.css.config.js")(() => websomServer, deployBundle);

	let clientHooks = {};
	let serverHooks = {};

	for (let p of [...websomServer.module.modules, ...websomServer.theme.themes]) {
		let conf = p.baseConfig || p.config;

		if (conf.build) {
			let bScript = path.resolve(p.root, conf.build);
			
			if (fs.existsSync(bScript)) {
				let s = require(bScript);

				let outs = await s({
					server: websomServer,
					dist: outputConfig.output.path,
					api: "",
					template,
					bundles: {
						server: null,
						client: null
					},
					createBundleRenderer
				});

				if (outs.server && outs.server.webpack) {
					serverConfig = webpackMerge(serverConfig, outs.server.webpack);
		
					serverHooks = outs.server.hooks || {};
				}
		
				if (outs.client && outs.client.webpack) {
					config = webpackMerge(config, outs.client.webpack);
					clientHooks = outs.client.hooks || {};
				}
			}else{
				console.log("Unable to find build script " + conf.build + " in package " + p.name);
			}
		}
	}

	if (!deploys[deploy.type]) {
		return "Invalid deploy type: " + deploy.type;
	}

	let outs = await ((deploys[deploy.type])({
		server: websomServer,
		deploy,
		api: "",
		template,
		bundles: {
			server: null,
			client: null
		},
		createBundleRenderer,
		tmp
	}));

	if (outs.server && outs.server.webpack) {
		serverConfig = webpackMerge(serverConfig, outputConfig, outs.server.webpack);

		serverHooks = outs.server.hooks || {};
	}

	if (outs.client && outs.client.webpack) {
		config = webpackMerge(config, outputConfig, outs.client.webpack);
		clientHooks = outs.client.hooks || {};
	}

	/*if (outs.css && outs.css.webpack) {
		cssConfig = webpackMerge(cssConfig, outs.css.webpack);
		cssHooks = outs.css.hooks || {};
	}*/

	let compiler;
	
	if (outs.client) {
		compiler = webpack(config);

		for (let ch in clientHooks) {
			compiler.hooks[ch].tap("deploy", clientHooks[ch]);
		}
	}

	compiler.hooks.done.tap("renderWatcher", stats => {
		stats = stats.toJson();
		stats.errors.forEach(err => console.error(err));
		stats.warnings.forEach(err => console.warn(err));

		if (stats.errors.length)
			return;
	});

	let serverCompiler;
	
	if (outs.server) {
		serverCompiler = webpack(webpackMerge({
			output: {
				path: path.resolve(websomServer.config.root, "../dist_deploy")
			}
		}, serverConfig));
	
		for (let sh in serverHooks) {
			serverCompiler.hooks[sh].tap("deploy", serverHooks[sh]);
		}
	}
	
	console.log("Starting build");

	await Promise.all([
			
		new Promise((res, rej) => {
			if (serverCompiler)
				serverCompiler.run((err, stats) => {
					console.log(stats.errors);
					res();
				});
			else
				res();
		}),

		new Promise((res, rej) => {
			if (compiler)
				compiler.run((err, stats) => {
					console.log(stats.errors);
					res();
				});
			else
				res();
		})
	]);

	if (outs.finish) {
		await outs.finish();
	}
};