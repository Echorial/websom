import offset from "./offset.js";

import websomFetch from "./fetch.js";

import Entity from "./entity";

export default (store, packages, context) => ({
	getComponentForAdapter(name) {
		return packages.find(p => p.info.adapt == name).vue;
	},
	offset,
	linkStyle(href) {
		let link = document.createElement("link");
		link.type = "text/css";
		link.rel = "stylesheet";
		link.href = href;
		document.head.appendChild(link);
	},
	loadScript(src, cb) {
		let script = document.createElement("script");
		script.onload = cb;
		script.src = src;
		document.head.appendChild(script);
	},
	fetch: websomFetch(store, context),
	getConfig(route, key) {
		return store.state.websom.data.config[route + "." + key];
	},
	makeEntity(collection, data) {
		let e = new Entity(collection, data);

		if (store.state.entities[collection] && store.state.entities[collection][data.id]) {
			store.commit("setEntity", e);

			return store.state.entities[collection][data.id];
		} else {
			store.commit("setEntity", e);
		}

		return e;
	}
});