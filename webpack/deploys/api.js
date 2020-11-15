const fs = require("fs");
const path = require("path");

const archiver = require("archiver");
const request = require("request-promise");
const ncp = require("ncp");

module.exports = async ({ server: websomServer, deploy, outDir }) => {
	
	await new Promise((res) => {
		let website = path.resolve(websomServer.config.root, "../website");
		let outDir = path.resolve(websomServer.config.root, "../" + (deploy.path || "api_deploy"));
		console.log("Building to " + outDir);

		let outDirWebsite = outDir + "/website";
		if (!fs.existsSync(outDirWebsite))
			fs.mkdirSync(outDirWebsite);

		if (!fs.existsSync(outDir + "/websom"))
			fs.mkdirSync(outDir + "/websom");

		let outDirConfig = outDir + "/config";
		if (!fs.existsSync(outDirConfig))
			fs.mkdirSync(outDirConfig);
		
		fs.writeFileSync(outDirConfig + "/global.json", fs.readFileSync(path.resolve(website, "../config/global.json")));
		let package = JSON.parse(fs.readFileSync(path.resolve(website, "../package.json"), "utf8"));
		package.dependencies.websom = "file:websom";
		package.main = "index.js";

		fs.writeFileSync(outDir + "/package.json", JSON.stringify(package, null, "\t"));
		fs.writeFileSync(outDir + "/package-lock.json", fs.readFileSync(path.resolve(website, "../package-lock.json")));
		if (deploy.handler)
			fs.writeFileSync(outDir + "/index.js", fs.readFileSync(path.resolve(__dirname, "./handlers/" + deploy.handler + ".js")));
		//fs.writeFileSync(outDir + "/vue-ssr-client-manifest.json", fs.readFileSync(outDir + "/client/vue-ssr-client-manifest.json"));
		console.log("Starting config copy");
		ncp(path.resolve(website, "../config"), outDirConfig, () => {
			console.log("Config copy done");
			console.log("Starting website copy");
			ncp(website, outDirWebsite, {
				dereference: true
			}, async () => {
				let files = fs.readdirSync(websomServer.websomRoot);
				let copies = [];
				console.log("Finished website copy");
				console.log("Found " + files.length + " files");

				for (let file of files) {
					if (file != "node_modules" && file != "vendor" && file != "Project" && file != ".git") {
						let filepath = path.resolve(websomServer.websomRoot, file);
						let stats = fs.lstatSync(filepath);

						if (stats.isDirectory(filepath)) {
							if (!fs.existsSync(filepath))
								fs.mkdirSync(filepath);

							copies.push(new Promise((resCopy, rej) => {
								ncp(filepath, outDir + "/websom/" + file, {
									dereference: true
								}, () => {
									resCopy();
								});
							}));
						}else{
							fs.writeFileSync(outDir + "/websom/" + file, fs.readFileSync(filepath));
						}
					}
				}
				console.log("Starting copies");

				await Promise.all(copies);
				console.log("Copies done");
				res();
			});
		});
	});

	return {
		
	};
};