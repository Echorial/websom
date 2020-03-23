const webpack = require("webpack");
const path = require("path");
const fs = require("fs");
const sharp = require("sharp");

module.exports = async ({ server: websomServer, deploy, bundles, template, createBundleRenderer}) => {
	let server = {
		webpack: {
			output: {
				publicPath: "./"
			}
		}
	};

	let entry = {};

	for (let exp of deploy.exports) {
		if (exp.type == "page")
			entry[exp.name] = "./entry.js";
		else if (exp.type == "script")
			entry[exp.name] = "./all.websom-scripts?view=" + exp.view;
	}

	let iconsConfig = null;

	if (deploy.icon) {
		iconsConfig = {};

		let iconPath = path.resolve(websomServer.config.configOverrides, deploy.icon);

		let iconBuffer = fs.readFileSync(iconPath);

		let iconSizes = [
			16,
			48,
			128,
			256,
			512
		];

		for (let size of iconSizes) {
			let iconName = "generated_icon_" + size + ".png";

			fs.writeFileSync(
				path.resolve(websomServer.config.javascriptOutput, iconName),
				await sharp(iconBuffer)
					.resize(size)
					.png()
					.toBuffer()
			);

			iconsConfig[size.toString()] = iconName;
		}
	}

	let client = {
		webpack: {
			entry,
			plugins: [
				new webpack.DefinePlugin({
					__websom_api: JSON.stringify(websomServer.apiHost),
					__websom_data: JSON.stringify(await websomServer.configService.computeClientData()),
					__websom_route: JSON.stringify("/")
				})
			],
			output: {
				filename: "[name].js",
				publicPath: "./"
			}
		},
		hooks: {
			done() {
				/*delete require.cache[require.resolve(bundles.client)];
				delete require.cache[require.resolve(bundles.server)];

				let manifest = Object.assign(require(bundles.client), {publicPath: "./"});
				let renderer = createBundleRenderer(require(bundles.server), {
					runInNewContext: false,
					template: template({}),
					clientManifest: manifest
				});

				for (let exp of deploy.exports) {
					if (exp.type == "page") {
						const context = { 
							url: exp.route,
							api: websomServer.apiHost,
							server: websomServer,
							title: exp.route,
							renderHeadElements() {
								return `
									<meta name="description" content="Extension Page"/>
								`;
							}
						};
				
						renderer.renderToString(context, (err, html) => {
							let filename = path.resolve(websomServer.config.javascriptOutput, exp.name + ".html");
							fs.writeFileSync(filename, html);
						});
					}
				}*/

				for (let exp of deploy.exports) {
					if (exp.type == "page") {
						let filename = path.resolve(websomServer.config.javascriptOutput, exp.name + ".html");
						fs.writeFileSync(filename, `
							<!DOCTYPE html>
							<html>
								<head>
									<style>
										html, body, #app {
											position: static !important;
											width: ${deploy.width || "375px"} !important;
											height: ${deploy.height || "550px"} !important;
										}

										html {
											overflow: hidden;
										}
									</style>
								</head>
								<body>
									<div id="app">

									</div>
									<script src="./popup.js"></script>
								</body>
							</html>
						`);
					}
				}
				
				let extensionManifest = path.resolve(websomServer.config.javascriptOutput, "manifest.json");
				let parsedManifest = JSON.parse(fs.readFileSync(path.resolve(websomServer.config.configOverrides, deploy.manifest), "utf8"));

				if (iconsConfig)
					parsedManifest.icons = iconsConfig;
				
				fs.writeFileSync(extensionManifest, JSON.stringify(parsedManifest, null, "\t"));
			}
		}
	};

	return {
		server,
		client
	};
};