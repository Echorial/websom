import DragPlugin from "./features/interaction/drag";

import websom from "./websom-client";

import events from "./websom-client/events";

const WebsomVue = {
	install(Vue, options) {
		Vue.mixin({
			props: {
				
			},
			created() {
				this.websom = websom;
				this.onGlobal = events.bind(this);
			},
			unmount() {
				events.unbind(this);
			}
		});

		DragPlugin(Vue, options);
	}
};

export default WebsomVue