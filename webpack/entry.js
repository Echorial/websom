import { createApp } from "./app.js";

(async () => {
	const { app, router } = await createApp();

	app.$mount("#app");

	console.log("Websom Router: ", router);
})();