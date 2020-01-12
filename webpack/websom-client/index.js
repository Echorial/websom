import offset from "./offset.js";

export default {
	offset,
	linkStyle(href) {
		let link = document.createElement("link");
		link.type = "text/css";
		link.rel = "stylesheet";
		link.href = href;
		document.head.appendChild(link);
	}
}