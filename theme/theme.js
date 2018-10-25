Theme = {
	themes: [],
	handle: (s, r) => {
		Theme.themes.push({selector: s, rules: r({})});
	},
	ready: (doc) => {
		for (var theme of Theme.themes) {
			for (var key in theme.rules) {
				var rule = theme.rules[key];
				if (key.length > 1 && key[0] != "/")
					for (var eventKey in rule) {
						var event = rule[eventKey];
						if (eventKey == "click") {
							$(document).on("click", theme.selector + " " + key, event);
						}
					}
				else if (key[0] == "/")
					Theme[key.substr(1)] = rule;
			}
		}
	}
};

$(() => {
	Theme.ready(document);
});