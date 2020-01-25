const parse = require("./parser.js");
const loaderUtils = require('loader-utils');

const postcss = require("postcss");
const lessSyntax = require('postcss-less');

const path = require('path');
const hash = require('hash-sum');
const qs = require('querystring');
const fs = require("fs");

const componentNormalizerPath = require.resolve('./lib/componentNormalizer.js');

const { attrsToQuery } = require('./utils.js')

const { genHotReloadCode } = require('./hotReload.js');

module.exports = async function (source) {
	const loaderContext = this;

	const stringifyRequest = r => loaderUtils.stringifyRequest(loaderContext, r);

	const {
		target,
		request,
		minimize,
		sourceMap,
		rootContext,
		resourcePath,
		resourceQuery
	} = loaderContext;

	const rawQuery = resourceQuery.slice(1);
	const inheritQuery = `&${rawQuery}`;
	const incomingQuery = qs.parse(rawQuery);
	const options = loaderUtils.getOptions(loaderContext) || {};

	const isServer = target === 'node';
	const isShadow = !!options.shadowMode;
	const isProduction = options.productionMode || minimize || process.env.NODE_ENV === 'production';
	const filename = path.basename(resourcePath);
	const context = rootContext || process.cwd();
	const sourceRoot = path.dirname(path.relative(context, resourcePath));

	const rawShortFilePath = path
		.relative(context, resourcePath)
		.replace(/^(\.\.[\/\\])+/, '');

	const shortFilePath = rawShortFilePath.replace(/\\/g, '/') + resourceQuery;

	const id = hash(isProduction ? (shortFilePath + '\n' + source) : shortFilePath);

	let blocks = parse(source);
	let info = {};
	let type = "";

	const needsHotReload = (
		!isServer &&
		!isProduction
	);

	let types = [
		"component",
		"effect",
		"script",
		"style",
		"page"
	];

	try {
		info = JSON.parse(`{${blocks.info.block}}`);

		if (!info) {
			throw new Error("No info block provided");
		}

		if (!info.name || info.name == "") {
			throw new Error("View name must be set in info");
		}

		if (!info.type || info.type == "") {
			throw new Error("View type must be set in info");
		}

		type = info.type;

		if (types.indexOf(info.type) == -1) {
			throw new Error("Unknown type " + info.type + ". Allowed values are: " + JSON.stringify(types));
		}
	}catch(e) {
		throw new Error("JSON syntax error while parsing info block: " + e + "\n" + blocks.info.block);
	}

	let thisFile = path.join(__dirname, "loader.js");

	if (incomingQuery["extract-style"]) {
		if (blocks.style) {
			let usePostCSS = false;
			if (usePostCSS) {
				let lessOutput = postcss.parse(blocks.style.block, { syntax: lessSyntax });

				for (let nde of lessOutput.nodes) {
					if (nde.type != "rule")
						continue;
					
					let isComponent = false;

					if (nde.selectors[0].substr(0, 1) == "[") {
						if (nde.selectors[0].length > 11 && nde.selectors[0].substr(0, 11) == "[component]") {
							isComponent = true;
						}
					}

					if (isComponent) {
						let newSelectors = [];

						for (let [i, selector] of nde.selectors.entries()) {
							if (i == 0) {
								if (selector.substr(0, 1) == "[" && selector.length > 11 && selector.substr(0, 11) == "[component]")
									selector = nde.selectors[0].substr(11, nde.selectors[0].length);
							}
							newSelectors.push(`body:not(.${incomingQuery.package}-${info.name}-disabled):not(.${incomingQuery.package}-disabled).package-${incomingQuery.package}-${info.name}-on ${selector}`);
							newSelectors.push(`body:not(.${incomingQuery.package}-${info.name}-disabled):not(.${incomingQuery.package}-disabled) ${selector}`);
						}

						nde.selectors = newSelectors;
					}
				}
				
				return lessOutput.toResult().css;
			}else{
				return `
					${fs.readFileSync(path.resolve(__dirname, "../tools.less"))}

					@component: ~"body:not(.${incomingQuery.package}-${info.name}-disabled):not(.${incomingQuery.package}-disabled).package-${incomingQuery.package}-${info.name}-on, body:not(.${incomingQuery.package}-${info.name}-disabled):not(.${incomingQuery.package}-disabled)";

					${blocks.style.block};
				`;
			}

		}else{
			return "";
		}
	}

	if (incomingQuery["extract-info"]) {
		return `export default {${blocks.info.block}};`;
	}

	if (incomingQuery["extract-script"]) {
		if (blocks.script)
			return blocks.script.block;
		else
			return `
				throw new Error("No script block included in effect ${info.name}");
				export default {}
			`;
	}

	if (incomingQuery["extract-config"]) {
		if (blocks.config)
			return `export default {${blocks.config.block}};`;
		else
			return `
				export default {options: []}
			`;
	}

	// template
	let templateImport = `var render, staticRenderFns`;
	let templateRequest;
	if (blocks.template) {
		const src = blocks.template.block;
		const idQuery = `&id=${id}`;
		const scopedQuery = ``;
		const attrsQuery = attrsToQuery({});
		const query = `?vue&type=template${idQuery}${scopedQuery}${attrsQuery}${inheritQuery}`;
		const request = templateRequest = stringifyRequest(src + query);
		templateImport = (
			`import render from "!vue-loader?vue&type=template!${thisFile.replace(/\\/g, "/")}?type=script!${this.resourcePath.replace(/\\/g, "/")}"\n`
		);
	}

	// script
	let scriptImport = `var script = {}`;
	if (blocks.script) {
		const src = blocks.script.block || resourcePath;
		const attrsQuery = attrsToQuery(blocks.script.options || {}, 'js');
		const query = `?vue&type=script${attrsQuery}${inheritQuery}`;
		const request = stringifyRequest(src + query);
		scriptImport = (
			`import script from "!babel-loader!${thisFile.replace(/\\/g, "/")}?type=script!${this.resourcePath.replace(/\\/g, "/")}"\n`
		);
	}

	if (!blocks.template) {
		throw new Error("Component or page views must have a template block.");
	}
	
	if (rawQuery.includes("vue")) {
	return `

<template>
${blocks.template.block}
</template>

<script>
${blocks.script ? blocks.script.block : "export default {}"}
</script>

`;
	}

	return `
	const configOptions = {${blocks.config ? blocks.config.block : ""}};

	import vvv from "${this.resourcePath.replace(/\\/g, "/")}?vue"\n
	
	let oldRender = vvv.render;
	
	vvv.render = function (createElement) {
		let res = oldRender.call(this, createElement);
		if (!res.data)
			res.data = {};

		if (!res.data.normalizedStyle)
			res.data.normalizedStyle = {};

		if (!res.data.style)
			res.data.style = "";

		let styles = "";
		for (const [key, value] of Object.entries(configOptions.options || {})) {
			let setValue = value.default || "";
			if (this.config) {
				setValue = this.config[key] || setValue;
			}

			res.data.normalizedStyle["--" + key] = setValue;
			styles += "--" + key + ":" + setValue + ";";
		}

		res.data.style = styles + res.data.style;
		
		return res;
	};

	if (!vvv.props) {
		vvv.props = {};
	}

	if (Array.isArray(vvv.props))
		console.error("Do not use arrays for view prop definitions. Use {} instead.");

	let defaults = {};

	for (let key in (configOptions.options || {})) {
		if (configOptions.options.hasOwnProperty(key))
			defaults[key] = configOptions.options[key].default || "";
	}

	const view = {
		info: {${blocks.info.block}},
		package: ${JSON.stringify(incomingQuery.package) || "\"unknown\""},
		vue: vvv,
		config: configOptions,
		defaultConfigOptions: defaults
	};

	vvv.props.config = {
		type: Object,
		required: false,
		default: () => { return {}; }
	};

	vvv.props.websomView = {
		type: Object,
		required: false,
		default() {
			return view;
		}
	};

	vvv.$view = view;

	export default view;`;

	let stylesCode = "";

	let outputCode = `
	${templateImport}
	${scriptImport}
	
	import normalizer from ${stringifyRequest(`!${componentNormalizerPath}`)}
	var component = normalizer(
		script,
		render,
		staticRenderFns,
		false,
		${/injectStyles/.test(stylesCode) ? `injectStyles` : `null`},
		null,
		${isServer ? JSON.stringify(hash(request)) : `null`}
		${isShadow ? `,true` : ``}
	)
	`.trim() + `\n`;

	if (needsHotReload) {
		outputCode += `\n` + genHotReloadCode(id, false, templateRequest);
	}

	if (!isProduction) {
		outputCode += `\ncomponent.options.__file = ${JSON.stringify(rawShortFilePath.replace(/\\/g, '/'))}`;
	} else if (options.exposeFilename) {
		// Libraries can opt-in to expose their components' filenames in production builds.
		// For security reasons, only expose the file's basename in production.
		outputCode += `\ncomponent.options.__file = ${JSON.stringify(filename)}`;
	}

	outputCode += `\nexport default component.exports`;
	
	return outputCode;
};