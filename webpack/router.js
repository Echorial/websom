import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

export function createRouter (views) {
	let templatePages = {};
	
	let routes = [];
	let nested = {};

	for (let view of views) {
		if (view.info.nested) {
			if (!nested[view.info.nested]) nested[view.info.nested] = [];

			nested[view.info.nested].push({
				path: view.info.route,
				component: view.vue
			});
		}
	}

	for (let view of views) {
		if (view.info.type == "page" && !view.info.nested) {
			if (view.info["template-page"])
				templatePages[view.info["template-page"]] = view;
			
			let route = {
				path: view.info.route,
				component: view.vue
			};

			if (nested[view.info.route])
				route.children = nested[view.info.route];

			routes.push(route);
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