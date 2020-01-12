import Vue from "vue";
import App from "./app.view";
import { createRouter } from "./router";

import Packages from "./all.websom-packages";
import "./all.websom-styles";

import WebsomVue from "./vue.plugin";

import PortalVue from "portal-vue";

import "normalize.css";

export function createApp () {
	const router = createRouter(Packages);

	Vue.use(WebsomVue);

	Vue.use(PortalVue);

	for (let v of Packages) {
		Vue.component(v.info.name, v.vue);
	}

	const app = new Vue({
		router,
		render: h => h(App.vue)
	});

	return { app, router };
}