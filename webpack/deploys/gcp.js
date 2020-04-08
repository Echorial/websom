const fs = require("fs");
const path = require("path");

const archiver = require("archiver");
const request = require("request-promise");
const ncp = require("ncp");

const { google } = require("googleapis");

const { Storage } = require("@google-cloud/storage");

module.exports = async ({ server: websomServer, deploy, tmp }) => {
	if (!deploy.credentials) {
		console.error("Invalid gcp credentials");
	}

	let region = deploy.region || "us-east1";

	let getServiceName = service => deploy.services[service] || deploy.services["prefix"] + service;

	let creds = path.resolve(websomServer.config.configOverrides, deploy.credentials);

	const storage = new Storage({
		projectId: deploy.project,
		keyFilename: creds
	});
	
	let webBucket = getServiceName("web_bucket");
	let location = `projects/${deploy.project}/locations/${region}`;
	let functionName = `${location}/functions/${getServiceName("function")}`;
	let bucketURL = `https://storage.googleapis.com/${webBucket}/`;

	let triggerURL = `https://${region}-${deploy.project}.cloudfunctions.net/${getServiceName("function")}`;

	if (deploy.exportApi) {
		fs.writeFileSync(path.resolve(websomServer.config.configOverrides, deploy.exportApi), JSON.stringify({
			api: `${triggerURL}/api/v1`,
			ui: triggerURL,
			ssr: true,
			version: "1"
		}, false, "\t"));
	}

	let auth = new google.auth.GoogleAuth({
		keyFile: creds,
		scopes: [
			"https://www.googleapis.com/auth/cloud-platform",
			"https://www.googleapis.com/auth/devstorage.full_control"
		]
	});

	let aClient = await auth.getClient();

	let functions = google.cloudfunctions({
		version: "v1",
		auth: aClient
	});

	let server = {
		webpack: {
			mode: "production",
			output: {
				path: tmp + "/server",
				publicPath: bucketURL
			}
		}
	};

	let client = {
		webpack: {
			mode: "production",
			output: {
				path: tmp + "/client",
				publicPath: bucketURL
			}
		}
	};

	return {
		server,
		client,
		async finish() {
			console.log("Copying files");

			await new Promise((res) => {
				let website = path.resolve(websomServer.config.root, "../website");
				let tmpWebsite = tmp + "/server/website";
				if (!fs.existsSync(tmpWebsite))
					fs.mkdirSync(tmpWebsite);

				if (!fs.existsSync(tmp + "/server/websom"))
					fs.mkdirSync(tmp + "/server/websom");

				let tmpConfig = tmp + "/server/config";
				if (!fs.existsSync(tmpConfig))
					fs.mkdirSync(tmpConfig);
				
				fs.writeFileSync(tmpConfig + "/global.json", fs.readFileSync(path.resolve(website, "../config/global.json")));
				let package = JSON.parse(fs.readFileSync(path.resolve(website, "../package.json"), "utf8"));
				package.dependencies.websom = "file:websom";

				fs.writeFileSync(tmp + "/server/package.json", JSON.stringify(package, null, "\t"));
				fs.writeFileSync(tmp + "/server/package-lock.json", fs.readFileSync(path.resolve(website, "../package-lock.json")));
				fs.writeFileSync(tmp + "/server/index.js", fs.readFileSync(path.resolve(__dirname, "./handlers/cloudFunctions.js")));
				fs.writeFileSync(tmp + "/server/vue-ssr-client-manifest.json", fs.readFileSync(tmp + "/client/vue-ssr-client-manifest.json"));

				ncp(path.resolve(website, "../config"), tmpConfig, () => {
					ncp(website, tmpWebsite, {
						dereference: true
					}, async () => {
						let files = fs.readdirSync(websomServer.websomRoot);
						let copies = [];

						for (let file of files) {
							if (file != "node_modules" && file != "vendor" && file != "Project" && file != ".git") {
								let filepath = path.resolve(websomServer.websomRoot, file);
								let stats = fs.lstatSync(filepath);

								if (stats.isDirectory(filepath)) {
									if (!fs.existsSync(filepath))
										fs.mkdirSync(filepath);

									copies.push(new Promise((resCopy, rej) => {
										ncp(filepath, tmp + "/server/websom/" + file, {
											dereference: true
										}, () => {
											resCopy();
										});
									}));
								}else{
									fs.writeFileSync(tmp + "/server/websom/" + file, fs.readFileSync(filepath));
								}
							}
						}

						await Promise.all(copies);

						res();
					});
				});
			});

			let settings = {
				name: functionName,
				description: "Websom server handler",
				entryPoint: "websomGCPEntryPoint",
				runtime: "nodejs10",
				timeout: deploy.timeout || "120s",
				availableMemoryMb: deploy.memory || 512,
				httpsTrigger: {},
				environmentVariables: {
					WEBSOM_BUCKET: bucketURL,
					WEBSOM_TRIGGER: triggerURL
				}
			};

			let uploadToSignedUrl = async () => {
				let genRes = await functions.projects.locations.functions.generateUploadUrl({
					parent: location
				});
	
				let signedUrl = genRes.data.uploadUrl;
	
				await new Promise((resolve, rej) => {
					let wStream = fs.createWriteStream(tmp + "/server.zip");
					let archive = archiver("zip", {
						zlib: { level: 9 }
					});
					
					wStream.on("close", () => {
						fs.createReadStream(tmp + "/server.zip").pipe(request({
							url: signedUrl,
							method: "PUT",
							headers: {
								"Content-Type": "application/zip",
								"x-goog-content-length-range": "0,104857600"
							}
						})).then((res) => {
							resolve();
						});
					});
	
					archive.pipe(wStream);
					archive.directory(tmp + "/server", false);
	
					archive.finalize();
				});

				return signedUrl;
			};

			console.log("Done.");
			console.log("Deploying function.");

			try {
				let res = await functions.projects.locations.functions.get({
					name: functionName
				});

				console.log("Found existing function... Patching");

				let signedUrl = await uploadToSignedUrl();

				try {
					let patch = await functions.projects.locations.functions.patch({
						name: functionName,
						requestBody: {
							...settings,
							sourceUploadUrl: signedUrl
						}
					});
					console.log("Function upload complete.");
				}catch (e) {
					console.log("Upload error.");
					console.log(e);
				}
			} catch (e) {
				try {
					console.log("Creating new function.");

					let signedUrl = await uploadToSignedUrl();
					
					let create = await functions.projects.locations.functions.create({
						location,
						requestBody: {
							...settings,
							sourceUploadUrl: signedUrl
						}
					});
					console.log("Function creation complete.");
				} catch (e) {
					console.error(e);
				}
			}

			let storageAPI = google.storage({
				version: "v1",
				auth: aClient
			});

			try {
				let bucket = await storageAPI.buckets.get({
					bucket: webBucket
				});

				await storageAPI.buckets.patch({
					bucket: webBucket,
					requestBody: {
						cors: [
							{
								method: ["GET", "OPTIONS"],
								origin: ["*"],
								maxAgeSeconds: 3600
							}
						]
					}
				});
			} catch (e) {
				let insert = await storageAPI.buckets.insert({
					project: deploy.project,
					predefinedAcl: "publicRead",
					requestBody: {
						name: webBucket,
						cors: [
							{
								method: ["GET", "OPTIONS"],
								origin: ["*"],
								maxAgeSeconds: 3600
							}
						]
					}
				});
			}

			let bucket = storage.bucket(webBucket);
			
			let clientResources = fs.readdirSync(tmp + "/client");
			console.log("Uploading " + clientResources.length + " client files...");
			let promises = [];

			for (let i = 0; i < clientResources.length; i++) {
				let cResource = clientResources[i];
				promises.push(new Promise((pres, rej) => {
					let dest = cResource;
					let fileSplits = cResource.split(".");
					let gzip = false;

					if (fileSplits[fileSplits.length - 1] != "gz") {
						//fileSplits.pop();
						//cResource = fileSplits.join(".");
						//gzip = true;

						bucket.upload(path.resolve(tmp + "/client/", cResource), {
							predefinedAcl: "publicRead",
							gzip: true
						}, (err, file) => {
							if (err) {
								console.log("Error uploading " + cResource);
							}else{
								console.log(`Uploaded ${i}/${clientResources.length} : ${cResource}`);
							}

							pres();
						});
					}else{
						pres();
					}
				}));
			}

			await Promise.all(promises);

			console.log("Upload complete");

			console.log("--------------------");
			console.log("----- DEPLOYED -----");
			console.log("-- SSR SERVER URL --");
			console.log(triggerURL);
			console.log("--------------------");
		}
	};
};