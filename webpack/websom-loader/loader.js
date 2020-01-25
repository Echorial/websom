const parse = require("../view-loader/parser");

const fs = require("fs");

module.exports = function (source) {
	let files = this.query.files();

	if (this.query.type == "components") {
		let imports = [];

		for (let [i, file] of files.entries()) {
			let blocks = parse(fs.readFileSync(file.file, "utf8"), "info");
			
			let type = JSON.parse(`{${blocks.info.block}}`).type;
			if (type == "component" || type == "page")
				imports.push(`import imports${i} from "${file.file.replace(/\\/g, "\\\\")}?package=${file.package}"; \n imports.push(imports${i});`);
		}

		return `let imports = [];\n${imports.join("\n")}\nexport default imports;`;
	}else if (this.query.type == "styles") {
		let imports = [];

		for (let [i, file] of files.entries()) {
			imports.push(`@import "${file.file.replace(/\\/g, "\\\\")}?package=${file.package}&extract-style=true";`);
		}

		return `${imports.join("\n")}`;
	}else if (this.query.type == "effects") {
		let imports = [];

		for (let [i, file] of files.entries()) {
			let blocks = parse(fs.readFileSync(file.file, "utf8"), "info");
			
			let type = JSON.parse(`{${blocks.info.block}}`).type;
			if (type != "effect")
				continue;

			imports.push(`
				import effectInfo${i} from "${file.file.replace(/\\/g, "\\\\")}?package=${file.package}&extract-info=true";
				import effectConfig${i} from "${file.file.replace(/\\/g, "\\\\")}?package=${file.package}&extract-config=true";
				import effectScript${i} from "${file.file.replace(/\\/g, "\\\\")}?package=${file.package}&extract-script=true";

				imports.push({
					info: effectInfo${i},
					config: effectConfig${i},
					script: effectScript${i}
				});
			`);
		}

		return `let imports = []; ${imports.join("\n")} export default imports`;
	}
};