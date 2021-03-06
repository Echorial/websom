import offset from "./offset.js";

import websomFetch from "./fetch.js";

import Entity from "./entity";

let scriptsStillLoading = {};

let listeners = {};

export default (store, packages, context) => ({
	on(event, cb) {
		if (!listeners[event])
			listeners[event] = [];

		listeners[event].push(cb);
	},
	trigger(event, args) {
		if (listeners[event])
			for (let cb of listeners[event])
				if (args)
					cb(...args);
				else
					cb();
	},
	off(event, cb) {
		if (listeners[event])
			listeners[event].remove(cb);
	},
	getComponentForAdapter(name) {
		return packages.find(p => p.info.adapt == name).vue;
	},
	offset,
	linkStyle(href) {
		let link = document.createElement("link");
		link.type = "text/css";
		link.rel = "stylesheet";
		link.href = href;
		document.body.appendChild(link);
	},
	loadScript(src, cb) {
		if (typeof document === "undefined")
			return;
			
		cb = cb || (() => {});

		if (Array.isArray(src)) {
			Promise.all(src.map((s) => {
				return new Promise((res) => {
					this.loadScript(s, res);
				});
			})).then(cb);
			return;
		}

		if (store.state.loadedScripts[src]) {
			if (scriptsStillLoading[src]) {
				scriptsStillLoading[src].push(cb);
			}else{
				cb();
			}
		}else{
			store.commit("addLoadedScript", src);

			scriptsStillLoading[src] = [cb];
			
			let script = document.createElement("script");
			script.onload = () => {
				for (let callback of scriptsStillLoading[src]) {
					callback();
				}

				delete scriptsStillLoading[src];
			};
			script.src = src;
			document.body.appendChild(script);
		}
	},
	fetch: websomFetch(store, context),
	getConfig(route, key) {
		return store.state.websom.data.config[route + "." + key];
	},
	async getEntity(collection, id, filter) {
		filter = filter || "default";
		
		if (store.state.entities[collection] && store.state.entities[collection][id]) {
			return store.state.entities[collection][id];
		}else{
			let res = await this.fetch(collection + "/get", {
				fields: { "*": true },
				query: { id },
				filter
			});
			
			if (res && res.documents && res.documents.length > 0)
				return this.makeEntity(collection, res.documents[0]);

			return null;
		}
	},
	deleteEntity(collection, dataOrId) {
		let id = dataOrId.id || dataOrId;
		if (store.state.entities[collection] && store.state.entities[collection][id]) {
			store.commit("deleteEntity", {collection, id});
		}
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
	},
	uploadFile(uploadURL, object, conf) {
		let adapter = store.state.websom.data.adapters.bucket;
		if (adapter) {
			let b = store.state.websom.registeredAdapters[adapter];

			return b.uploadFile(uploadURL, object, conf);
		}

		return new Promise((resolve, rej) => {
			let req = new XMLHttpRequest();

			req.onreadystatechange = function () {
				if (this.readyState == 4) {
					if (this.status == 200) {
						resolve();
					}else{
						rej(this.status);
					}
				}
			};

			req.upload.onprogress = (e) => {
				if (conf.progress)
					conf.progress(e.loaded / e.total);
			};

			req.open("POST", uploadURL);

			req.setRequestHeader("Content-Type", conf.contentType || "application/octet-stream");

			let data = new FormData();
			data.append("upload", object);

			req.send(data);
		});
	},
	resolveAsset(_package, assetName) {
		return store.state.assets[_package][assetName];
	},
	registerAsset(_package, assetName, value) {
		store.commit("registerAsset", {package: _package, name: assetName, value});
	},
	resolveString(val) {
		if (typeof val == "string")
			return val;

		if (typeof val == "object")
			return this.resolveAsset(val.$from, val.$resolve);
	},
	resolveMedia(name) {
		return this.resolveBucketObject("media", name);
	},
	resolveBucketObject(bucket, name) {
		let adapter = store.state.websom.data.adapters.bucket;
		if (adapter) {
			let b = store.state.websom.registeredAdapters[adapter];

			return b.resolveBucketObject(bucket, name);
		}else{
			return store.state.websom.api + "/buckets/" + bucket + "/" + name;
		}
	},
	plural(amount, base, append) {
		append = append || "s";

		return amount + " " + (amount > 1 ? `${base}${append}` : base);
	},
	getPreference(key, defaultValue) {
		if (typeof localStorage === "undefined")
			return defaultValue;

		let websomPrefs = localStorage.getItem("websom_prefs");
		if (!websomPrefs)
			return defaultValue;
		
		websomPrefs = JSON.parse(websomPrefs);

		return websomPrefs[key] || defaultValue;
	},
	setPreference(key, val) {
		let websomPrefs = localStorage.getItem("websom_prefs");

		if (!websomPrefs)
			websomPrefs = "{}";

		websomPrefs = JSON.parse(websomPrefs);

		websomPrefs[key] = val;

		localStorage.setItem("websom_prefs", JSON.stringify(websomPrefs));
	},
	async search(route, collection, query, options) {
		options = options || {};

		let search = store.state.websom.data.adapters.search;
		if (search) {
			let adapter = store.state.websom.registeredAdapters[search];

			return await adapter.search(collection, query, options);
		}else{
			let res = await this.fetch(route + "/search", {
				fields: "*",
				query: {
					query
				}
			});

			if (res.status == "success") {
				return {
					documents: res.documents,
					page: 0
				};
			}else{
				console.log(res.message);
				return false;
			}
		}
	},
	flattenDocument(doc) {
		let output = {};

		for (let [k, v] of Object.entries(doc)) {
			if (typeof v == "object") {
				if (Array.isArray(v)) {
					output[k] = v.map(sub => {
						if (sub.$collection && "id" in sub) {
							return sub.id;
						}else{
							return sub;
						}
					});
				}else{
					if (v && v.$collection && "id" in v) {
						output[k] = v.id;
					}
				}
			}else{
				if (k && k[0] != "$")
					output[k] = v;
			}
		}

		return output;
	}
});