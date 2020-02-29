const Carbonite = require("carbonite"); //TODO: Update with native
const path = require("path");
module.exports = {
	buildModule: (file) => {
		var scriptLoc = require("fs").readFileSync(path.resolve(__dirname, "../../../core/util/build/module.carb"), "utf8");

		var c = new Carbonite.Compiler();
		c.noExports.push("Oxygen");
		c.noCore = true;
		c.useOldTemplates = true;
		c.asyncAwait = true;
		var moduleName = "Unknown";
		var moduleClass = null;
		c.buildScript.setVar("websomRegister", (args) => {
			moduleClass = args[0];
			moduleName = moduleClass.value.route;
			if (moduleClass.value.reroute != "")
				moduleName = moduleClass.value.reroute;
		});

		c.buildScript.setVar("getWebsomRegister", (args) => {
			return moduleClass;
		});

		c.buildScript.setVar("websomEncode", (args) => {
			return Carbide.Virtual.Values.String.create(JSON.stringify(args[0].value));
		});

		c.buildScript.setVar("websomNative", (args) => {
			var argStr = [];
			for (var arg of args[0].value.raw.value.parameters)
				argStr.push(arg.name);

			var str = "function (" + argStr.join(", ") + ") {\n";
			for (var statement of args[0].value.raw.value.body.code) {
				if (statement.type == "native") {
					str += statement.content.replace(/\r/g, "");
				}
			}
			return Carbide.Virtual.Values.String.create(str + "\n}");
		});

		c.addNativeLibrary();

		var oxy = path.resolve(__dirname, "../../../Oxygen/oxygen.carb");
		var oxygen = c.addSource("Oxygen", require("fs").readFileSync(oxy, "utf8"));
		oxygen.file = oxy;
		oxygen.process();

		var buildScript = c.addSource("Script", scriptLoc);
		buildScript.file = scriptLoc;
		buildScript.process();

		c.loadHeader(JSON.parse(require("fs").readFileSync(path.resolve(__dirname, "../../../Project/header.json"), "utf8")));
		var source = c.addSource(file, require("fs").readFileSync(file, "utf8"));
		source.file = file;
		source.process();
		c.build("javascript.source.memory", {});
		if (!c.status.hadError) {
			require("fs").writeFileSync(require("path").dirname(file) + "/module.js", c.rawOutput + "\nmodule.exports = " + moduleName + ";");
		}

		var cp = new Carbonite.Compiler();
		cp.noExports.push("Oxygen");
		cp.noCore = true;
		cp.useOldTemplates = true;
		var moduleName = "Unknown";
		var moduleClass = null;
		cp.buildScript.setVar("websomRegister", (args) => {
			moduleClass = args[0];
			moduleName = moduleClass.value.route;
			if (moduleClass.value.reroute != "")
				moduleName = moduleClass.value.reroute;
		});

		cp.buildScript.setVar("getWebsomRegister", (args) => {
			return moduleClass;
		});

		cp.buildScript.setVar("websomEncode", (args) => {
			return Carbide.Virtual.Values.String.create(JSON.stringify(args[0].value));
		});

		cp.buildScript.setVar("websomNative", (args) => {
			var argStr = [];
			for (var arg of args[0].value.raw.value.parameters)
				argStr.push(arg.name);

			var str = "function (" + argStr.join(", ") + ") {\n";
			for (var statement of args[0].value.raw.value.body.code) {
				if (statement.type == "native") {
					str += statement.content.replace(/\r/g, "");
				}
			}
			return Carbide.Virtual.Values.String.create(str + "\n}");
		});

		cp.addNativeLibrary();

		var oxy = path.resolve(__dirname, "../../../Oxygen/oxygen.carb");
		var oxygen = cp.addSource("Oxygen", require("fs").readFileSync(oxy, "utf8"));
		oxygen.file = oxy;
		oxygen.process();

		var buildScript = cp.addSource("Script", scriptLoc);
		buildScript.file = scriptLoc;
		buildScript.process();

		cp.loadHeader(JSON.parse(require("fs").readFileSync(path.resolve(__dirname, "../../../Project/header.json"), "utf8")));
		var source = cp.addSource(file, require("fs").readFileSync(file, "utf8"));
		source.file = file;
		source.process();
		cp.build("php.source.memory", {});
		if (!cp.status.hadError) {
			require("fs").writeFileSync(require("path").dirname(file) + "/module.php", cp.rawOutput + "\n<?php return '" + moduleName.replace(/\./g, "_") + "'; ?>");
		}

		console.log("----- MODULE BUILD ------");
		console.log("---------- JS -----------");
		console.log(c.status.stringify());
		console.log("---------- PHP ----------");
		console.log(cp.status.stringify());
		console.log("-------------------------");

		return "JS: " + c.status.stringify() + ", PHP: " + cp.status.stringify();
	},
	buildScript: (platform, name, file) => {
		var c = new Carbonite.Compiler();
		c.pipeConfig["restrict"] = name;
		c.addNativeLibrary();
		c.loadHeader(JSON.parse(require("fs").readFileSync(path.resolve(__dirname, "../../../Project/header.json"), "utf8")));
		var source = c.addSource("Page View Script", file);
		source.file = "Page View Script";
		source.process();
		c.build(platform, {});
		if (!c.status.hadError) {
			return c.rawOutput;
		}else{
			return c.status.stringify();
		}
	}
};