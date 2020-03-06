import Vue from "vue";
import Vuex from "vuex";
import App from "./app.view";
import { createRouter } from "./router";

import EffectLoader from "./effect-loader.js";

import Packages from "./all.websom-packages";
import Effects from "./all.websom-effects";
import "./all.websom-styles";

import WebsomVue from "./vue.plugin";

import PortalVue from "portal-vue";

import WebsomUtils from "./websom-client";

import "normalize.css";

import WebsomLogo from "../base-theme/assets/logo.svg";
import WebsomLogoRaster from "../base-theme/assets/logo.png";

export async function createApp (api, websomServer) {
	const router = createRouter(Packages);

	Vue.use(WebsomVue);

	Vue.use(PortalVue);

	Vue.use(Vuex);
	
	let ssr = true;

	if (typeof window !== "undefined") {
		ssr = false;
		api = window.websom_api || api;
	}

	const store = new Vuex.Store({
		state: () => ({
			websom: {
				api,
				ssr,
				data: {
					config: {},
					routes: {},
					endpoints: {},
					navigation: {
						
					},
					loaded: false
				},
				validators: {}
			},
			userSystem: {
				user: null
			},
			assets: {
				logo: WebsomLogo,
				logoRaster: WebsomLogoRaster
			},
			title: "Websom Page",
			metaDescription: "This is a websom page."
		}),
		actions: {
			async fetchWebsomData({ commit }) {
				if (ssr) {
					commit("setWebsomData", await websomServer.configService.computeClientData());
				}else{
					commit("setWebsomData", await websomUtils.fetch("/data", {}));
				}
			},
			registerValidator({ commit }, d) {
				commit("setValidator", d);
			}
		},
		mutations: {
			setWebsomData(state, data) {
				state.websom.data = data;
				state.websom.data.loaded = true;
			},
			setValidator(state, d) {
				Vue.set(state.websom.validators, d.type, d.handler);
			}
		}
	});

	var websomUtils = WebsomUtils(store);

	if (!ssr && window.__INITIAL_STATE__) {
		store.replaceState(window.__INITIAL_STATE__);
	}

	if (!store.state.websom.data.loaded)
		await store.dispatch("fetchWebsomData");
	else
		console.log("Websom data is already loaded");

	store.state.websom.data.navigation.navbar = [
		{
			type: "component",
			component: "user-nav",
			align: "right",
			props: {
				name: "Test"
			}
		}
	];
	
	let formats = {
		"single-line": new RegExp("^([^\\n]*)$"),
		"email": new RegExp("^(([^<>()\\[\\]\\.,;:\\s@\"]+(\\.[^<>()\\[\\]\\.,;:\\s@\"]+)*)|(\".+\"))@(([^<>()[\\]\\.,;:\\s@\"]+\\.)+[^<>()[\\]\\.,;:\\s@\"]{2,})"),
		"number": new RegExp("^(-)?([\d.,]*)$")
	};
	
	store.dispatch("registerValidator", {type: "format", handler: (config, value) => {
		return formats[config.format].test(value);
	}});

	store.dispatch("registerValidator", {type: "regex", handler: (config, value) => {
		return new RegExp(config.regex).test(value);
	}});

	store.dispatch("registerValidator", {type: "limit", handler: (config, value) => {
		return value.length >= config.min && value.length <= config.max;
	}});

	store.dispatch("registerValidator", {type: "unique", handler: async (config, value) => {
		if (config.route) {

		}

		return true;
	}});

	for (let v of Packages) {
		Vue.component(v.info.name, v.vue);
	}

	const app = new Vue({
		router,
		render: h => h(App.vue),
		store,
		websomUtils
	});

	if (!ssr) {
		let effectLoader = new EffectLoader(Effects);
		effectLoader.initialize();
	}
	
	return { app, router, store };
}