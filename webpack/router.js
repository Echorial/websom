import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

export function createRouter (views) {
	let templatePages = {};

	let routes = [];
	for (let view of views) {
		if (view.info.type == "page") {
			if (view.info["template-page"])
				templatePages[view.info["template-page"]] = view;

			routes.push({
				path: view.info.route,
				component: view.vue
			})
		}
	}

	return new Router({
		mode: "history",
		routes: [
			...routes,
			{
				path: "*",
				component: templatePages["404"].vue
			}
		]
	});
}