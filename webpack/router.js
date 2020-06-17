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

			let sub = {
				path: view.info.route,
				component: view.vue
			};

			nested[view.info.nested].push(sub);

			view.$nested = sub;
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

			let absoluteRoute = view.info.route;

			if (nested[absoluteRoute])
				route.children = nested[absoluteRoute];

			routes.push(route);
		}else if (view.info.type == "page" && view.info.nested) {
			let absoluteRoute = view.info.nested + "/" + view.info.route;

			if (nested[absoluteRoute]) {
				let myNested = view.$nested;

				myNested.children = nested[absoluteRoute];
			}
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
		],
		scrollBehavior(to, from, savedPosition) {
			if (document.querySelector(".websom-main-wrap"))
				document.querySelector(".websom-main-wrap").scrollTo(0, 0);
				
			return {
				x: 0,
				y: 0
			};
		}
	});
}