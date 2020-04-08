const open = require("open");

const createServer = require("../../webpack/server");
const doDeploy = require("../../webpack/deploy");

async function startWebsomDevelopmentServer(server, port, apiPort) {
	let expressApp = await createServer(server, "http://localhost:" + apiPort);

	if (expressApp)
		expressApp.listen(port);

	console.log(`Started server on port ${port}`);
	
	if (server().config.openInBrowser)
		open("http://localhost:" + port + "/");
}

async function executeDeploy(server, deploy) {
	return await doDeploy(server, deploy);
}

module.exports = {
	startWebsomDevelopmentServer,
	executeDeploy
};