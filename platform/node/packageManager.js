const progress = require("cli-progress");
const exec = require("child_process").exec;
const path = require("path");
const fs = require("fs");
const chalk = require("chalk");

module.exports = {
	async install(websiteDir, package, link) {
		if (
			fs.existsSync(path.join(websiteDir, "/modules/" + package))
			|| fs.existsSync(path.join(websiteDir, "/themes/" + package))
			|| fs.existsSync(path.join(websiteDir, "/packages/" + package))
		) {
			console.log("Package already installed");
			return;
		}

		if (link) {
			await new Promise((res) => exec(`npm config get prefix`, {}, (err, stdout, stderr) => {
				if (err) {
					console.log(err);
					res();
					return;
				}

				let prefix = stdout.trim();
				let packagePath = path.join(prefix, "node_modules", package);

				if (fs.existsSync(packagePath)) {
					let packageJson = JSON.parse(fs.readFileSync(path.join(packagePath, "package.json"), "utf8"));

					if (!packageJson.websom) {
						console.log(`${package} is not a websom package`);
						res();
						return;
					}

					if (!["module", "theme", "package"].includes(packageJson.websom.type)) {
						console.log("Invalid websom package type in package.json");
					}

					let type = packageJson.websom.type;
					console.log(`Installing ${type} ${chalk.blueBright(package)} by ${packageJson.author || "<nobody?>"}`);
					console.log("----------------------------------");
					
					let bar = new progress.SingleBar({
						format: `LINK | {bar} | {percentage}%`,
						hideCursor: true,
						barsize: 20,
						forceRedraw: true,
						
					}, progress.Presets.shades_classic);
					
					bar.start(100, 0, {});
					
					try {
						fs.symlinkSync(packagePath, path.join(websiteDir, type + "s", package), "dir");
					} catch (e) {
						console.log();
						console.log("----------------------------------");
						console.log(chalk.red(e));
						console.log("----------------------------------");
						console.log(chalk.green("TIP:") + " Try running this as an administrator.");
						res();
						return;
					}

					bar.update(100);
					bar.stop();
					console.log("----------------------------------");
					/*for (let i = 1; i <= 10; i++)
					setTimeout(() => {
						bar.increment();
						bar.update(i * 10);
						if (i == 10) {
							bar.stop();
							res();
						}
					},  i * 100);*/
					console.log(chalk.green("Success!"));
					res();
				}else{
					console.log("No such package.");
					res();
				}
			}));
		}else{

		}
	}
};