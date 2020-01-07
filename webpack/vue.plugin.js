import DragPlugin from "./features/interaction/drag";

const WebsomVue = {
	install(Vue, options) {
		Vue.mixin({
			props: {
				
			},
			created() {
				this.websom = {
					linkStyle(href) {
						let link = document.createElement("link");
						link.type = "text/css";
						link.rel = "stylesheet";
						link.href = href;
						document.head.appendChild(link);
					}
				}
			}
		});

		DragPlugin(Vue, options);
	}
};

export default WebsomVue