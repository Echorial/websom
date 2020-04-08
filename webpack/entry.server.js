import { createApp } from "./app.js";

export default context => {
	return new Promise(async (resolve, reject) => {
		const { app, router, store } = await createApp(context.api, context);

		router.push(context.url);

		router.onReady(() => {
			context.rendered = () => {
				context.state = store.state;
			};

			const matchedComponents = router.getMatchedComponents();

			if (!matchedComponents.length) {
				return reject({ code: 404 });
			}

			resolve(app);
		}, reject);
	});
}