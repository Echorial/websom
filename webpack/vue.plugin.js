import DragPlugin from "./features/interaction/drag";

import websom from "./websom-client";

import events from "./websom-client/events";

const WebsomVue = {
	install(Vue, options) {
		Vue.mixin({
			created() {
				this.websom = websom;
				this.onGlobal = events.bind(this);
			},
			unmount() {
				events.unbind(this);
			},
			computed: {
				$config() {
					if (this.websomView.defaultConfigOptions) {
						return {
							...this.websomView.defaultConfigOptions,
							...this.config
						};
					}
				}
			}
		});

		Vue.prototype.$send = function $send(eventName, ...args) {
			let component = this;

			do {
				let stopPropogation = component.$emit(eventName, ...args);
				
				if (stopPropogation)
					return;

				component = component.$parent;
			} while (component);
		};

		DragPlugin(Vue, options);

		Vue.component("vnode", {
			functional: true,
			render: (h, ctx) => ctx.props.vnode
		});
	}
};

export default WebsomVue