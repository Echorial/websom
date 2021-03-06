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

	let clientURL = context ? context.client : null;

	if (typeof window !== "undefined") {
		ssr = false;
		clientURL = location.origin;
		api = window.websom_api || api || (typeof __websom_api !== "undefined" ? __websom_api : null);
	}

	const store = new Vuex.Store({
		state: () => ({
			websom: {
				colorScheme: "light",
				api,
				client: clientURL,
				ssr,
				registeredAdapters: {},
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
				user: null,
				loadingUser: false,
				loginHooks: []
			},
			entities: {},
			assets: {
				websom: {
					logo: WebsomLogo,
					logoRaster: WebsomLogoRaster
				}
			},
			loadedScripts: {},
			title: "Websom Page",
			metaDescription: "",
			breadcrumbs: []
		}),
		actions: {
			async fetchWebsomData({ commit }) {
				if (ssr) {
					commit("setWebsomData", await websomServer.configService.computeClientData(context.server.makeRequestFromExpress(context.ssrRequest)));
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
			addLoadedScript(store, url) {
				store.loadedScripts[url] = true;
			},
			clearBreadcrumbs(store) {
				store.breadcrumbs.splice(0, store.breadcrumbs.length);
			},
			addBreadcrumb(store, b) {
				if (Array.isArray(b)) {
					for (let a of b)
						store.breadcrumbs.push(a);
				}else{
					store.breadcrumbs.push(b);
				}
			},
			registerAsset(store, data) {
				if (!store.assets[data.package])
					store.assets[data.package] = {};
				
				store.assets[data.package][data.name] = data.value;
			},
			registerAdapter(store, data) {
				store.websom.registeredAdapters[data.name] = data.handler;
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
			hookLogin(state, cb) {
				state.userSystem.loginHooks.push(cb);
			},
			triggerLoginHooks(state, res) {
				for (let hook of state.userSystem.loginHooks)
					hook(res);

				state.userSystem.loginHooks.splice(0, state.userSystem.loginHooks.length);
			},
			deleteEntity(state, {collection, id}) {
				if (state.entities[collection] && state.entities[collection][id]) {
					Vue.delete(state.entities[collection], id);
				}
			},
			clearEntities(state, collection) {
				if (state.entities[collection]) {
					for (let k of Object.keys(state.entities[collection]))
						Vue.delete(state.entities[collection], k);
				}
			},
			setEntity(state, entity) {
				let collection = entity.$collection;

				if (!state.entities[collection])
					Vue.set(state.entities, collection, {});
				
				if (state.entities[collection][entity.id]) {
					let oldEntity = state.entities[collection][entity.id];

					for (let f of entity.$fields) {
						Vue.set(oldEntity, f, entity[f]);
					}
				}else{
					Vue.set(state.entities[collection], entity.id, entity);
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

		store.commit("clearBreadcrumbs");

		for (let call of stateClientCalls)
			call(store);
	}

	if (!ssr) {
		let darkModeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

		store.commit("setColorScheme", darkModeMediaQuery.matches ? "dark" : "light");
		console.log(`Color scheme ${store.state.websom.colorScheme == "dark" ? "🌒 dark" : "☀️ light"}`);

		darkModeMediaQuery.addListener((e) => {
			store.commit("setColorScheme", e.matches ? "dark" : "light")
		});
		
		if (!store.state.websom.data.loaded)
			store.dispatch("fetchWebsomData").then(() => {}).catch((e) => {});
		else
			console.log("Websom data is already loaded");
	}else{
		if (!store.state.websom.data.loaded) {
			store.commit("setWebsomData", await websomServer.configService.computeClientData(context.server.makeRequestFromExpress(context.ssrRequest)));
		}
	}

	if (ssr || store.state.websom.data.navigation.navbar.length == 0)
		if (store.state.websom.data.navigation.config.items) {
			for (let item of store.state.websom.data.navigation.config.items) {
				store.commit("addNavItem", item);
			}
		}

	if (!store.state.websom.data.navigation.navbar.find((v) => v.props ? v.props.name == "login-bar" : false)) {
		if (Packages.find(p => p.info.name == "user-nav")) {
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
		}
	}
	
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
		overrides,
		packages: Packages
	});

	if (!ssr) {
		let effectLoader = new EffectLoader(Effects);
		effectLoader.initialize();
	}

	let registerAdapter = (name, handler) => {
		store.commit("registerAdapter", {name, handler});
	};
	
	for (let s of Scripts)
		await s.script({
			app,
			websom: websomUtils,
			store,
			registerAdapter,
			packages: Packages,
			ssr,
			fillState: typeof __INITIAL_STATE__ === "undefined"
		});
	
	if (typeof window !== "undefined")
		if (typeof window.__websom_route === "string")
			router.push(window.__websom_route);
	
	return { app, router, store };
}