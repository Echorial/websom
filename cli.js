#!/usr/bin/env node

const { Server } = require("./native/javascript/websom");

const fs = require("fs");
const path = require("path");

const chalk = require("chalk");

const iq = require("inquirer");

const cp = require("ncp");

let cwd = process.cwd();

const gatherSettings = (cb) => {
	let data = {};

	iq.prompt([
		{
			type: "list",
			name: "language",
			message: "Back-end language",
			choices: [
				"Javascript",
				"PHP (coming soon)",
				"Carbon (Not recommended for new users)"
			]
		},
		{
			type: "list",
			name: "database",
			message: "Database (use loki if in doubt)",
			choices: [
				"loki.js",
				"Firebase",
				"MySQL (coming soon)",
				"Mongo DB (coming soon)",
				"DynamoDB (coming soon)"
			]
		},
		{
			type: "list",
			name: "mail",
			message: "Mail Service",
			choices: [
				"SendGrid",
				"SMTP Login",
				"None"
			]
		},
		/*{
			type: "checkbox",
			name: "modules",
			message: "Pre-install commonly used modules",
			choices: [
				"UserManager (recommended)"
			]
		},*/
		{
			type: "list",
			name: "theme",
			message: "Front-end theme",
			choices: [
				"Material",
				"Zero",
				"Air",
				"I'll build my own from scratch",
				"None"
			]
		},
		{
			type: "list",
			name: "template",
			message: "Start with a template",
			choices: [
				"App",
				"Blog",
				"Single Page Experience",
				"E-commerce",
				"Membership",
				"None"
			]
		},
		{
			type: "list",
			name: "deploy",
			message: "Environment",
			choices: [
				"Serverless GCP - Firebase - No SSR",
				"Serverless GCP - Firebase - With SSR",
				"Serverless AWS",
				"Apache",
				"Nginx",
				"Express",
				"Static",
				"None"
			]
		}
	]).then(async answers => {
		cb(answers);
	});
};

let findWebsomWebsite = (dir) => {
	let isDir = f => fs.existsSync(path.resolve(dir, "./" + f)) && fs.lstatSync(fs.realpathSync(path.resolve(dir, "./" + f))).isDirectory();
	
	if (
		isDir("website")
		/*&& isDir("website/modules")
		&& isDir("website/packs")
		&& isDir("website/themes")*/
	) {
		return dir;
	}
	let up = path.resolve(dir, "../");

	if (up == dir) {
		return;
	}

	return findWebsomWebsite(up);
};

let [,, ...args] = process.argv;

if (args[0] == "init") {
	let items = fs.readdirSync(cwd);
	items = items.filter(i => i != "." && i != "..");

	if (items.length > 0) {
		console.log(chalk.red("[ERROR] This folder must empty."));
		return;
	}

	gatherSettings((settings) => {
		fs.mkdirSync(path.resolve(cwd, "./config"));
		
		let globalConfig = {
			"adapters": {},
			"theme.theme.app": {
				"rasterIcon": "icon/icon.png",
				"vectorIcon": "icon/icon.svg"
			}
		};

		if (settings.database == "loki.js") {
			globalConfig.adapters.database = "loki";
			globalConfig["adapter.database.loki"] = {
				persistence: "database.db"
			};
		}else if (settings.database == "Firebase") {
			globalConfig.adapters.database = "firestore";
			globalConfig["adapter.database.firestore"] = {
				credentials: "./firestore.json"
			};

			fs.writeFileSync(path.resolve(cwd, "./config/firestore.json"), "{}");
		}

		if (settings.mail == "SendGrid") {
			globalConfig.adapter.email = "sendGrid";
			globalConfig["adapter.email.sendGrid"] = {
				apiKey: "<sendgrid api key>"
			};
		}else if (settings.mail == "SMTP Login") {
			globalConfig.adapter.email = "smtp";
			globalConfig["adapter.email.smtp"] = {
				host: "example.com",
				port: "445",
				ssl: true,
				username: "no-reply@example.com",
				password: "******"
			};
		}

		fs.writeFileSync(path.resolve(cwd, "./config/global.json"), JSON.stringify(globalConfig, null, "\t"));

		fs.writeFileSync(path.resolve(cwd, "./config/deploy.json"), JSON.stringify({
			deploys: []
		}, null, "\t"));

		fs.writeFileSync(path.resolve(cwd, "./package.json"), JSON.stringify({
				"name": "websom-website",
				"version": "1.0.0",
				"description": "",
				"main": "devServer.js",
				"scripts": {
					"dev": "node devServer.js"
				},
				"author": "",
				"license": "ISC",
				"dependencies": {
					"websom": "*"
				}
		}, null, "\t"));

		fs.writeFileSync(path.resolve(cwd, "./composer.json"), JSON.stringify({
			"require": {}
		}, null, "\t"));

		let devServer = `const { Server } = require("websom");

let server = new Server({
	dev: true,
	base: __dirname,
	config: "./config",
	dist: "./dist",
	assets: "./website",
	buckets: "./buckets",
	headless: false,
	openInBrowser: true,
	verbose: false
});

server.startDevelopmentServer().then(() => {
	// Server started
});`;

		fs.writeFileSync(path.resolve(cwd, "./devServer.js"), devServer, null, "\t");

		fs.mkdirSync(path.resolve(cwd, "./website"));
		fs.mkdirSync(path.resolve(cwd, "./website/packs"));
		fs.mkdirSync(path.resolve(cwd, "./website/modules"));
		fs.mkdirSync(path.resolve(cwd, "./website/themes"));
		fs.mkdirSync(path.resolve(cwd, "./website/icon"));

		fs.mkdirSync(path.resolve(cwd, "./buckets"));

		let copDir = path.resolve(__dirname, "./templates/default") + "/";

		if (settings.language == "Javascript") {
			copDir += "javascript";
		}else if (settings.language == "Carbon (Not recommended for new users)") {
			copDir += "carbon";
		}else if (settings.language == "PHP (coming soon)") {
			copDir += "php";
		}
		
		cp(path.resolve(__dirname, "./icon"), path.resolve(cwd, "./website/icon"), () => {
			cp(copDir, path.resolve(cwd, "./website/modules/app"), () => {
				console.log(chalk.green("[PROJECT] Initialized."));
				console.log(chalk.blue("------- Execute -------"));
				console.log("$" + chalk.green(" npm") + chalk.green(" install"));
				console.log("$" + chalk.green(" npm") + chalk.green(" run") + chalk.green(" dev"));
				console.log(chalk.blue("--- To get started ---"));
			});
		});
	});
}else{
	let website = findWebsomWebsite(cwd);

	if (!website) {
		console.log(chalk.red("[ERROR] No websom site found."));
		console.log(chalk.blue("[TIP] Create one using ") + chalk.cyan("$ websom init"));
		return;
	}

	if (args[0] == "locate") {
		console.log(chalk.green("[FOUND] " + website));
	}else if (args[0] == "create") {
		let type = args[1];
		let name = args[2];

		if (!(type == "module" || type == "theme") || !name) {
			console.log("Missing name or type. websom create <theme|module> <name>");
			return;
		}

		let packagePath = path.resolve(website, "./website/" + type + "s/" + name);

		if (fs.existsSync(packagePath)) {
			console.log("A " + type + " with that name already exists.");
			return;
		}

		fs.mkdirSync(packagePath);
		fs.writeFileSync(packagePath + "/" + type + ".json", JSON.stringify({
			"name": name,
			"id": name.toLowerCase(),
			"key": name.toLowerCase(),
			"resources": [
				{
					"path": "./src/client/components"
				},
				{
					"path": "./src/client/state"
				},
				{
					"path": "./src/client/script"
				},
				{
					"path": "./src/client/style"
				}
			],
			"npm": {},
			"composer": {},
			"adapters": {},
			"config": {}
		}, null, "\t"));

		fs.writeFileSync(packagePath + "/package.json", JSON.stringify({
			"name": name.toLowerCase(),
			"version": "1.0.0",
			"description": "",
			"main": type + ".js",
			"scripts": {
				"test": "echo \"Error: no test specified\" && exit 1"
			},
			"author": "",
			"license": "",
			"websom": {
				"type": type
			}
		}, null, "\t"));

		fs.mkdirSync(packagePath + "/src");
		fs.mkdirSync(packagePath + "/src/client");
		fs.mkdirSync(packagePath + "/src/client/components");
		fs.mkdirSync(packagePath + "/src/client/state");
		fs.mkdirSync(packagePath + "/src/client/script");
		fs.mkdirSync(packagePath + "/src/client/style");

		if (type == "module") {
			fs.mkdirSync(packagePath + "/src/server");
			fs.mkdirSync(packagePath + "/src/server/adapters");
			fs.mkdirSync(packagePath + "/src/server/entities");
			fs.mkdirSync(packagePath + "/src/server/logic");
		}

		let classes = {
			module: "Module",
			theme: "Theme"
		};

		if (type == "module")
		fs.writeFileSync(packagePath + "/" + name + ".carb", `class ${name} extends Websom.${classes[type]} {
	override Websom.Status start() {
		// Server start.
	}

	override void permissions() {
		// Register your module permissions here.
		// See docs here.
	}

	override void collections() {
		// Create your collections and APIs here.
		// See docs here.
	}
}`);

		console.log(chalk.green("[CREATED] " + name));
	}else{
		(async () => {
			let server = new Server({
				dev: true,
				base: website,
				config: "./config",
				dist: "./dist",
				assets: "./website",
				buckets: "./buckets",
				headless: false,
				openInBrowser: false,
				verbose: false
			});
	
			await server.startServices();
			
			await server.micro.command.exec(args.join(" "), async () => {
				await server.stop();

				process.exit();
			});
		})();
	}
}