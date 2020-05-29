const parse = require("../view-loader/parser");
const qs = require('querystring');

const fs = require("fs");
const path = require("path");

module.exports = function (source) {
	let resourceQuery = this.resourceQuery;

	const rawQuery = resourceQuery.slice(1);
	const incomingQuery = qs.parse(rawQuery);

	let viewName = incomingQuery["view"];

	let files = this.query.files();
	let deployBundle = this.query.bundle;

	if (this.query.type == "empty") {
		return "";
	}else if (this.query.type == "components") {
		let imports = [];

		for (let [i, file] of files.entries()) {
			let blocks = parse(fs.readFileSync(file.file, "utf8"), "info");

			if (!blocks.info) {
				imports.push(`import blank_imports${i} from "${file.file.replace(/\\/g, "\\\\")}?package=${file.package}&packageType=${file.packageType}";`);
				continue;
			}
			
			let info = JSON.parse(`{${blocks.info.block}}`);
			let type = info.type;
			if (type == "component" || (type == "page" && ((info.bundle || "default") == deployBundle) || info.bundle === "*"))
				imports.push(`import imports${i} from "${file.file.replace(/\\/g, "\\\\")}?package=${file.package}&packageType=${file.packageType}"; \n imports.push(imports${i});`);
		}
		
		if (this.query.server.config.dev) {
			let customizationPath = path.join(this.query.server.config.configOverrides, "customization.json").replace(/\\/g, "\\\\");
			if (fs.existsSync(customizationPath))
				imports.push(`import "${customizationPath}";`);
		}

		return `let imports = [];\n${imports.join("\n")}\nexport default imports;`;
	}else if (this.query.type == "styles") {
		let imports = [];

		for (let [i, file] of files.entries()) {
			let blocks = parse(fs.readFileSync(file.file, "utf8"), "info");
			
			if (!blocks.info)
				continue;

			let info = JSON.parse(`{${blocks.info.block}}`);
			let add = true;
			if (info.type == "page" && ((info.bundle || "default") != deployBundle) && info.bundle !== "*")
				add = false;
			
			if (add)
				imports.push(`@import "${file.file.replace(/\\/g, "\\\\")}?package=${file.package}&packageType=${file.packageType}&extract-style=true";`);
		}
		
		if (this.query.server.config.dev) {
			let customizationPath = path.join(this.query.server.config.configOverrides, "customization.json").replace(/\\/g, "\\\\");
			if (fs.existsSync(customizationPath))
				imports.push(`@import "${customizationPath}";`);
		}

		return `${imports.join("\n")}`;
	}else if (this.query.type == "effects") {
		let imports = [];

		for (let [i, file] of files.entries()) {
			let blocks = parse(fs.readFileSync(file.file, "utf8"), "info");
			
			if (!blocks.info)
				continue;

			let type = JSON.parse(`{${blocks.info.block}}`).type;
			if (type != "effect")
				continue;

			imports.push(`
				import effectInfo${i} from "${file.file.replace(/\\/g, "\\\\")}?package=${file.package}&packageType=${file.packageType}&extract-info=true";
				import effectConfig${i} from "${file.file.replace(/\\/g, "\\\\")}?package=${file.package}&packageType=${file.packageType}&extract-config=true";
				import effectScript${i} from "${file.file.replace(/\\/g, "\\\\")}?package=${file.package}&packageType=${file.packageType}&extract-script=true";

				imports.push({
					info: effectInfo${i},
					config: effectConfig${i},
					script: effectScript${i}
				});
			`);
		}

		return `let imports = []; ${imports.join("\n")} export default imports`;
	}else if (this.query.type == "state") {
		let imports = [];

		for (let [i, file] of files.entries()) {
			let blocks = parse(fs.readFileSync(file.file, "utf8"), "info");
			
			if (!blocks.info)
				continue;

			let type = JSON.parse(`{${blocks.info.block}}`).type;
			if (type != "state")
				continue;

			imports.push(`
				import stateInfo${i} from "${file.file.replace(/\\/g, "\\\\")}?package=${file.package}&extract-info=true";
				import stateConfig${i} from "${file.file.replace(/\\/g, "\\\\")}?package=${file.package}&extract-config=true";
				import stateScript${i} from "${file.file.replace(/\\/g, "\\\\")}?package=${file.package}&extract-script=true";

				imports.push({
					info: stateInfo${i},
					config: stateConfig${i},
					script: stateScript${i}
				});
			`);
		}

		return `let imports = []; ${imports.join("\n")} export default imports`;
	}else if (this.query.type == "script") {
		let imports = [];

		for (let [i, file] of files.entries()) {
			let blocks = parse(fs.readFileSync(file.file, "utf8"), "info");
			
			if (!blocks.info)
				continue;

			let info = JSON.parse(`{${blocks.info.block}}`);

			let type = info.type;

			if (type != "script")
				continue;

			if ((info.bundle || "default") != deployBundle && info.bundle !== "*")
				continue;

			if (info.name === viewName)
				return `
					import scriptInfo from "${file.file.replace(/\\/g, "\\\\")}?package=${file.package}&extract-info=true";
					import scriptScript from "${file.file.replace(/\\/g, "\\\\")}?package=${file.package}&extract-script=true";

					import WebsomUtils from "./websom-client";
					//import Store from "./store";

					let api = __websom_api;
					//let store = Store(api);
					let websomUtils = WebsomUtils({}, []);

					scriptScript({
						app: null,
						websom: websomUtils,
						store: {},
						packages: [],
						ssr: false
					});
				`;

			imports.push(`
				import scriptInfo${i} from "${file.file.replace(/\\/g, "\\\\")}?package=${file.package}&extract-info=true";
				import scriptScript${i} from "${file.file.replace(/\\/g, "\\\\")}?package=${file.package}&extract-script=true";

				imports.push({
					info: scriptInfo${i},
					script: scriptScript${i}
				});
			`);
		}

		return `let imports = []; ${imports.join("\n")} export default imports`;
	}
};