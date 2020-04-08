const fs = require("fs");
const path = require("path");

module.exports = async ({ server: websomServer, deploy, tmp }) => {
	let server = {
		webpack: {
			mode: "production",
			output: {
				path: tmp + "/node-server",
				publicPath: "/"
			}
		}
	};

	let client = {
		webpack: {
			mode: "production",
			output: {
				path: tmp + "/web-client",
				publicPath: "/"
			}
		}
	};

	return {
		server,
		client,
		css: client
	};
};