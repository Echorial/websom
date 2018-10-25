Websom = {
	views: {
		loaded: {}
	},
	setupClientData: (container, data) => {
		return new Websom.ClientData(container, data);
	},
	formatNumber: function (num) {
		if (num > 1000)
			return (num / 1000).toFixed(1) + "K";
		else if (num > 1000000)
			return (num / 1000000).toFixed(1) + "M";
		else if (num > 1000000000)
			return (num / 1000000000).toFixed(1) + "B";
		else
			return num;
	},
	sendBridge: function (bridge, method, args, callback) {
		$.post("/postBridge", {bridge: bridge, method: method, arguments: args}, function (d) {
			var value = d;
			try {
				value = JSON.parse(d);
			}catch(e) {
				console.log(e);
			}

			callback(value);
		});
	},
	timestampToValue: function (time) {
		if (!time)
			time = Date.now();
		else
			time = parseInt(time);
		let dt = new Date(time);
		const offset = dt.getTimezoneOffset();
		dt = new Date(dt.getTime() + (offset*60*1000));
		return dt.toISOString().split('T')[0];
	}
};

Websom.ClientData = class WebsomClientData {
	constructor(container, data) {
		this._w_container = container;

		Object.assign(this, data);
	}

	interface(route, key, data) {

	}
}

Vue.mixin({
	computed: {
		Websom: function () { return window.Websom; }
	}
});

Vue.directive('on-native', {
	bind: function (el, b) {
		el.addEventListener(b.arg, (e) => {
			b.value(e);
		});
	}
})

Websom.currentStyle = "data-desktop-style";

function refreshResponsiveStyles() {
	let style = "data-desktop-style";
	if (window.innerWidth/window.innerHeight <= 1) {
		style = "data-mobile-style";
	}else if (window.innerWidth <= 1080) {
		style = "data-tablet-style";
	}

	if (style == Websom.currentStyle)
		return;
	
	Websom.currentStyle = style;

	$("[" + style + "]").each(function () {
		let that = $(this);
		if (style != "data-desktop-style" && !that.attr("data-desktop-style")) {
			that.attr("data-desktop-style", "top: " + that[0].style.top + "; left: " + that[0].style.left + "; width: " + that[0].style.width + "; height: " + that[0].style.height + "; ");
		}

		that.css("transition", ".3s top, .3s left, .3s width, .3s height");
		let styles = $("<a/>").attr("style", that.attr(style))[0].style;
		that.css("left", styles.left);
		that.css("top", styles.top);
		that.css("width", styles.width);
		that.css("height", styles.height);
	});
}

if (document.readyState == "complete")
	refreshResponsiveStyles();

document.addEventListener("DOMContentLoaded", function () {
	refreshResponsiveStyles();
});

window.onresize = () => {
	refreshResponsiveStyles();
};