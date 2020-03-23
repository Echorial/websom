import Vuex from "vuex";

export default (api) => new Vuex.Store({
	state: () => ({
		websom: {
			colorScheme: "light",
			api,
			ssr: false,
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
		entities: {},
		assets: {
			logo: WebsomLogo,
			logoRaster: WebsomLogoRaster
		},
		title: "Websom Page",
		metaDescription: "This is a websom page."
	}),
	actions: {
		
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
					oldEntity[f] = entity[f];
				}
			}else{
				state.entities[collection][entity.id] = entity;
			}

			return state.entities[collection][entity.id];
		}
	}
});