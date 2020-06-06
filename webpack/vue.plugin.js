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
			},
			unmount() {
				events.unbind(this);
			},
			methods: {
				title() {
					if (this.websomView) {
						return this.websomView.info.title;
					}
				},
				metaDescription() {
					if (this.websomView) {
						return this.websomView.info.metaDescription;
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