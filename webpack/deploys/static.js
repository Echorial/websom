const webpack = require("webpack");
const path = require("path");
const fs = require("fs");
const sharp = require("sharp");

module.exports = async ({ server: websomServer, deploy, bundles, template, createBundleRenderer}) => {
	let outDir = path.resolve(websomServer.config.root, "../" + (deploy.path || "dist_deploy"));
	console.log("Building to " + outDir);

	let server = {
		webpack: {
			output: {
				publicPath: "./",
				path: outDir
			}
		}
	};

	console.log("API: " + JSON.stringify(deploy.api || websomServer.apiHost));

	let client = {
		webpack: {
			mode: "production",
			plugins: [
				new webpack.DefinePlugin({
					__websom_api: JSON.stringify(deploy.api || websomServer.apiHost),
					__websom_data: JSON.stringify(await websomServer.configService.computeClientData(null)),
					__websom_static: "true"
				})
			],
			output: {
				filename: "[name].js",
				publicPath: "/",
				path: outDir
			}
		},
		hooks: {
			done() {

				let filename = path.resolve(outDir, "index.html");
				fs.writeFileSync(filename, `
					<!DOCTYPE html>
					<html lang="${deploy.lang || 'en'}">
						<head>
							<meta name="viewport" content="width=device-width, initial-scale=1">
							<link rel="stylesheet" type="text/css" href="/main.css" />
						</head>
						<body>
							<div id="app">

							</div>
							<script src="/main.js"></script>
						</body>
					</html>
				`);
			}
		}
	};

	return {
		client
	};
};