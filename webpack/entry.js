import { createApp } from "./app.js";

(async () => {
	const { app, store } = await createApp();

	app.$mount("#app");
})();