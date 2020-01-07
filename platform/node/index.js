const open = require("open");

const createServer = require("../../webpack/server");

async function startWebsomDevelopmentServer(server, port) {
	let expressApp = await createServer(server);

	expressApp.listen(port);

	console.log(`Started server on port ${port}`);

	open("http://localhost:" + port + "/");
}

module.exports = {
	startWebsomDevelopmentServer
};