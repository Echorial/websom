const open = require("open");

const createServer = require("../../webpack/server");

async function startWebsomDevelopmentServer(server, port, apiPort) {
	let expressApp = await createServer(server, "http://localhost:" + apiPort);

	expressApp.listen(port);

	console.log(`Started server on port ${port}`);

	open("http://localhost:" + port + "/");
}

module.exports = {
	startWebsomDevelopmentServer
};