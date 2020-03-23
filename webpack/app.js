import Vue from "vue";
import Vuex from "vuex";
import App from "./app.view";
import { createRouter } from "./router";

import EffectLoader from "./effect-loader.js";

import Packages from "./all.websom-packages";
import State from "./all.websom-state";
import Scripts from "./all.websom-scripts";
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
		api = window.websom_api || api || (typeof __websom_api !== "undefined" ? __websom_api : null);
	}

	const store = new Vuex.Store({
		state: () => ({
			websom: {
				colorScheme: "light",
				api,
				ssr,
				data: {
					config: {},
					routes: {},
					endpoints: {},
					navigation: {
						navbar: []
					},
					loaded: false
				},
				validators: {}
			},
			userSystem: {
				user: null
			},
			entities: {},
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
					if (typeof __websom_data !== "undefined") {
						commit("setWebsomData", __websom_data);
						return;
					}
					
					try {
						commit("setWebsomData", await websomUtils.fetch("/data", {}));
					} catch (e) {
						console.error(e);
					}
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
			},
			setColorScheme(state, d) {
				state.websom.colorScheme = d;
			},
			setUser(state, user) {
				state.userSystem.user = user;
			},
			setEntity(state, entity) {
				let collection = entity.$collection;

				if (!state.entities[collection])
					state.entities[collection] = {};
				
				if (state.entities[collection][entity.id]) {
					let oldEntity = state.entities[collection][entity.id];

					for (let f of entity.$fields) {
						Vue.set(oldEntity, f, entity[f]);
					}
				}else{
					state.entities[collection][entity.id] = entity;
				}

				return state.entities[collection][entity.id];
			},
			addNavItem(state, data) {
				state.websom.data.navigation.navbar.push(data);
			}
		}
	});

	var websomUtils = WebsomUtils(store, Packages);

	State.forEach(s =>
		store.registerModule(s.info.name, s.script(websomUtils))
	);

	if (!ssr && window.__INITIAL_STATE__) {
		console.log("Loaded with initial state");

		store.replaceState(window.__INITIAL_STATE__);

		console.log(store.state);
	}

	if (!ssr) {
		let darkModeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

		store.commit("setColorScheme", darkModeMediaQuery.matches ? "dark" : "light");
		console.log(`Color scheme ${store.state.websom.colorScheme == "dark" ? "🌒 dark" : "☀️ light"}.`);

		darkModeMediaQuery.addListener((e) => {
			store.commit("setColorScheme", e.matches ? "dark" : "light")
		});
	}

	if (!store.state.websom.data.loaded)
		store.dispatch("fetchWebsomData").then(() => {}).catch((e) => {});
	else
		console.log("Websom data is already loaded");

	store.commit("addNavItem",
		{
			type: "component",
			component: "user-nav",
			align: "right",
			props: {
				name: "Test"
			}
		}
	);
	
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

	for (let s of Scripts)
		s.script({
			app,
			websom: websomUtils,
			store,
			packages: Packages,
			ssr
		});
	
	if (typeof __websom_route === "string")
		router.push(__websom_route);

	return { app, router, store };
}