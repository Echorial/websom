const fs = require("fs");
const path = require("path");
let pngToIco = null;
let CopyPlugin;

try {
	pngToIco = require("png-to-ico");
	CopyPlugin = require("copy-webpack-plugin");
}catch (e) {

}


module.exports = async (context) => {
	await Promise.all([new Promise((res) => {
		let rIcon = context.server.configService.getString("theme.theme.app", "rasterIcon");

		if (rIcon && pngToIco) {
			pngToIco(path.resolve(context.server.config.root, rIcon)).then(buf => {
				fs.writeFileSync(path.resolve(path.dirname(path.resolve(context.server.config.root, rIcon)), "favicon.ico"), buf);
				res();
			}).catch((err) => {
				console.log("Error while generating ICO", err);
				res();
			});
		}else{
			res();
		}
	}), new Promise((res) => {
		let vIcon = context.server.configService.getString("theme.theme.app", "vectorIcon");

		if (vIcon) {
			//fs.writeFileSync(path.resolve(context.dist, "favicon.svg"), fs.readFileSync(path.resolve(context.server.config.root, vIcon)));
		}

		res();
	})]);

	//const CopyPlugin = require('copy-webpack-plugin');
	let pats = [];
	let rIcon = context.server.configService.getString("theme.theme.app", "rasterIcon");

	if (rIcon) {
		console.log(path.resolve(path.dirname(path.resolve(context.server.config.root, rIcon)), "favicon.ico"));
		pats.push({
			from: path.resolve(path.dirname(path.resolve(context.server.config.root, rIcon)), "favicon.ico")
		});
	}

	let vIcon = context.server.configService.getString("theme.theme.app", "vectorIcon");

	if (vIcon)
		pats.push({
			from: path.resolve(context.server.config.root, vIcon),
			to: "favicon.svg"
		});

	if (pats.length > 0) {
		let conf = {};
		if (CopyPlugin)
		conf = {
			webpack: {
				plugins: [
					new CopyPlugin({
						patterns: pats
					})
				]
			}
		};
		
		return {
			server: conf,
			client: conf
		};
	}else
		return {};
};