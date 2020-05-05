import Vue from "vue";
import Vuex from "vuex";
import App from "./app.view?package=theme&packageType=theme";
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

export async function createApp (api, context) {
	let websomServer = context ? context.server : null;

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
				websom: {
					logo: WebsomLogo,
					logoRaster: WebsomLogoRaster
				}
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
			registerAsset(store, data) {
				if (!store.assets[data.package])
					store.assets[data.package] = {};
				
				store.assets[data.package][data.name] = data.value;
			},
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

	var websomUtils = WebsomUtils(store, Packages, context);
	let stateClientCalls = [];
	
	State.forEach(s => {
		let scrpt = s.script(websomUtils);
		store.registerModule(s.info.name, scrpt)

		if (scrpt.client)
			stateClientCalls.push(scrpt.client);
	});

	if (!ssr && window.__INITIAL_STATE__) {
		console.log("Loaded with initial state");

		store.replaceState(window.__INITIAL_STATE__);

		for (let call of stateClientCalls)
			call(store);
	}

	if (!ssr) {
		let darkModeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

		store.commit("setColorScheme", darkModeMediaQuery.matches ? "dark" : "light");
		console.log(`Color scheme ${store.state.websom.colorScheme == "dark" ? "🌒 dark" : "☀️ light"}.`);

		darkModeMediaQuery.addListener((e) => {
			store.commit("setColorScheme", e.matches ? "dark" : "light")
		});
		
		if (!store.state.websom.data.loaded)
			store.dispatch("fetchWebsomData").then(() => {}).catch((e) => {});
		else
			console.log("Websom data is already loaded");
	}else{
		if (!store.state.websom.data.loaded) {
			store.commit("setWebsomData", await websomServer.configService.computeClientData());
		}
	}

	if (!store.state.websom.data.navigation.navbar.find((v) => v.props.name == "login-bar"))
		store.commit("addNavItem",
			{
				type: "component",
				component: "user-nav",
				align: "right",
				props: {
					name: "login-bar"
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
	
	let injects = {};
	let overrides = {};
	
	for (let v of Packages) {
		if (v.info.overrides) {
			overrides[v.info.overrides] = v;
		}
	}

	for (let v of Packages) {
		if (overrides[v.info.name])
			Vue.component(v.info.name, overrides[v.info.name].vue);
		else
			Vue.component(v.info.name, v.vue);

		if (v.info.injects) {
			let component = v.info.injects;

			if (!injects[component])
				injects[component] = [];
			
			injects[component].push(v);
		}
	}
	
	const app = new Vue({
		router,
		render: h => h(App.vue),
		store,
		websomUtils,
		injects,
		overrides
	});

	if (!ssr) {
		let effectLoader = new EffectLoader(Effects);
		effectLoader.initialize();
	}
	
	for (let s of Scripts)
		await s.script({
			app,
			websom: websomUtils,
			store,
			packages: Packages,
			ssr,
			fillState: typeof __INITIAL_STATE__ === "undefined"
		});
	
	if (typeof __websom_route === "string")
		router.push(__websom_route);
	
	return { app, router, store };
}