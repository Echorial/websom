class App extends Websom.Module {
	start() {
		// Do some basic initialization here
	}

	permissions() {
		// Register your module permissions here
	}

	collections() {
		// Register your DB collections here
	}

	api() {
		// Register some API endpoints here
		
		this.server.api.route("/example/endpoint")
			.auth(async (req) => {
				let user = await req.user();
				return user !== null;
			})
			.executes((ctx) => {
				ctx.request.endWithData({ message: "Hello World!" });
			});
	}
}

module.exports = App;