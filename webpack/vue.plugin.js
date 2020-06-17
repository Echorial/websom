import DragPlugin from "./features/interaction/drag";

import websom from "./websom-client";

import events from "./websom-client/events";

const WebsomVue = {
	install(Vue, options) {
		Vue.mixin({
			created() {
				this.websom = this.$root.$options.websomUtils;
				this.websomPackages = this.$root.$options.packages;
				this.onGlobal = events.bind(this);
				if (this.$ssrContext) {
					let t = this.title();
					if (t) {
						this.$ssrContext.title = t;
					}

					let m = this.metaDescription();
					if (m) {
						this.$ssrContext.metaDescription = m;
					}

					let c = this.canonical();
					if (c) {
						this.$ssrContext.canonicalURL = c;
					}
				}
			},
			mounted() {
				let t = this.title();
				if (t)
					document.title = t;

				let meta = this.metaDescription();
				if (meta) {
					let el = document.querySelector(`meta[name="description"]`);
					if (el) {
						el.setAttribute("content", meta);
					}else{
						el = document.createElement("meta");
						el.setAttribute("name", "description");
						el.setAttribute("content", meta);
						document.head.appendChild(el);
					}
				}

				let c = this.canonical();
				if (c) {
					let el = document.querySelector(`link[rel="canonical"]`);
					if (el) {
						el.setAttribute("href", c);
					}else{
						el = document.createElement("link");
						el.setAttribute("href", c);
						el.setAttribute("rel", "canonical");
						document.head.appendChild(el);
					}
				}
			},
			unmount() {
				events.unbind(this);
			},
			methods: {
				title() {
					if (this.websomView && this.websomView.info) {
						return this.websomView.info.title;
					}
				},
				metaDescription() {
					if (this.websomView && this.websomView.info) {
						return this.websomView.info.metaDescription;
					}
				},
				canonical() {
					if (this.websomView && this.websomView.info) {
						if (typeof window !== "undefined") {
							let info = this.websomView.info;

							let link = document.createElement("a");
							link.href = info.nested ? info.nested + "/" + info.route : info.route;
							//return link.href;
						}
					}
				},
				breadcrumb() {
					if (this.websomView && this.websomView.info) {
						let info = this.websomView.info;
						return {
							name: info.breadcrumb || info.title || info.route,
							route: info.nested ? info.nested + "/" + info.route : info.route
						};
					}
				},
				addHeadElement(el) {
					if (typeof window !== "undefined") {
						if (document.getElementById("head-tag-" + el.key))
							return;

						let dEl = document.createElement(el.tag);
						for (let k of Object.keys(el.attributes || {})) {
							dEl.setAttribute(k, el.attributes[k]);
						}
						
						if (el.html)
							dEl.innerHTML = el.html;

						document.head.appendChild(dEl);
					}else{
						let tag = el.tag || 'meta';
						let attr = Object.entries(el.attributes || {}).map(a => `${a[0]}="${a[1]}"`);
						this.$ssrContext.headElements += `<${tag} id="head-tag-${el.key}" ${attr} ${tag == 'meta' ? '/' : ''}>${el.html || ""}${(tag == 'meta' || tag == 'link') ? '' : '</' + tag + '>'}`;
					}
				}
			},
			computed: {
				$config() {
					if (this.websomView.defaultConfigOptions) {
						let configSets = {};
		
						for (let k in this.websomView.config.options) {
							let val = this.$store.state.websom.data.config[`${this.websomView.packageType}.${this.websomView.package.toLowerCase()}.${this.websomView.info.name}.` + k];

							if (val)
								configSets[k] = val;
						}

						return {
							...this.websomView.defaultConfigOptions,
							...configSets,
							...this.config
						};
					}
				}
			}
		});

		Vue.prototype.$send = function $send(eventName, ...args) {
			let component = this;

			do {
				component.$emit(eventName, ...args);

				component = component.$parent;
			} while (component);
		};

		Vue.prototype.$toast = function $toast(toast) {
			this.$send("toast", toast);
		};

		DragPlugin(Vue, options);

		Vue.component("vnode", {
			functional: true,
			render: (h, ctx) => ctx.props.vnode
		});
	}
};

export default WebsomVue