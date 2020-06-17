const cookie = require("cookie");
const websom = require("websom");
const { createBundleRenderer } = require("vue-server-renderer");
const template = require("./websom/webpack/template.js");

let renderer = createBundleRenderer(require("./vue-ssr-server-bundle.json"), {
	runInNewContext: false,
	template: template({
		//style: process.env.WEBSOM_BUCKET + "/main.css"
	}),
	clientManifest: Object.assign(require("./vue-ssr-client-manifest.json"), {
		publicPath: process.env.WEBSOM_BUCKET
	})
});

let server = new websom.Server({
	dev: false,
	base: __dirname,
	config: "./config",
	dist: "./dist",
	assets: "./website",
	buckets: "./buckets",
	headless: true,
	openInBrowser: false,
	verbose: false
});

exports.websomGCPEntryPoint = async (req, res) => {
	if (!server.configService)
		await server.startServices();

	if (req.rawBody) {
		try {
			req.body = JSON.parse(req.rawBody);
		} catch (e) {
			req.body = null;
		}
	}

	if (req.headers.cookie) {
		req.cookies = cookie.parse(req.headers.cookie);
	}else{
		req.cookies = {};
	}

	let splits = req.path.split("/");

	if (splits[1] == "api" && splits[2] == "v1") {
		splits.splice(0, 3);
		let path = "/" + splits.join("/");

		if (req.method == "OPTIONS") {
			server.expressAPIOptionsRequest(req, res, path);
		}else if (req.method == "POST") {
			server.expressAPIPostRequest(req, res, path);
		}else{
			res.status(405).send("invalid method");
		}
	}else{
		const context = {
			ssrRequest: req,
			url: req.url,
			api: (process.env.WEBSOM_TRIGGER + "/api/v1") || `https://${process.env.FUNCTION_REGION}-${process.env.GCP_PROJECT}.cloudfunctions.net/${process.env.FUNCTION_NAME}`,
			client: server.clientHost,
			server,
			title: req.route.path,
			breadcrumbs: [],
			headElements: "",
			canonicalURL: req.protocol + '://' + req.get("host") + req.baseUrl + req.path,
			renderHeadElements() {
				return `
				
				`;
			}
		};

		renderer.renderToString(context, (err, html) => {
			if (err) {
				if (err.code == "500") {
					res.status(500);
					res.end(err.toString() + err.stack);
					return;
				}else if (err.code == "404") {
					res.status(404);
					res.end("Unknown route " + context.url);
					return;
				}else{
					res.status(500);
					res.end(err);
					return;
				}
			}

			res.status(200).send(html);
		});
	}
};