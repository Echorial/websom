import offset from "./offset.js";

import websomFetch from "./fetch.js";

export default (store) => ({
	offset,
	linkStyle(href) {
		let link = document.createElement("link");
		link.type = "text/css";
		link.rel = "stylesheet";
		link.href = href;
		document.head.appendChild(link);
	},
	fetch: websomFetch(store)
});