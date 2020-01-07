import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

export function createRouter (views) {
	let routes = [];
	for (let view of views) {
		if (view.info.type == "page") {
			routes.push({
				path: view.info.route,
				component: view.vue
			})
		}
	}

	return new Router({
		mode: "history",
		routes
	});
}