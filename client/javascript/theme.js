Websom.Theme = {
	themes: [],
	waits: [],
	handle: function (s, r, e) {
		if (e) {
			for (var i in Websom.Theme.themes)
				if (Websom.Theme.themes[i].selector == r)
					r = Websom.Theme.themes[i];

			if (typeof r == "string") {
				this.waits.push({theme: r, wait: [s, r, e]});
				return;
			}

			Websom.Theme.themes.push({selector: s, rules: Object.assign(r.rules, e())});
		}else
			Websom.Theme.themes.push({selector: s, rules: r({})});
		
		for (let i = 0; i < this.waits.length; i++) {
			let wait = this.waits[i];
			if (wait.theme == s) {
				this.handle.apply(this, wait.wait);
				this.waits.splice(i, 1);
				return;
			}
		}
	},
	ready: function (doc) {
		for (var theme of Websom.Theme.themes) {
			(function (theme) {
				for (var key in theme.rules) {
					(function (key) {
						var rule = theme.rules[key];
						if (key.length > 1 && key[0] != "/")
							for (var eventKey in rule) {
								var event = rule[eventKey];
								(function (event) {
									if (eventKey == "click") {
										document.addEventListener("click", function (e) {
											if (e.target.matches(theme.selector + " " + key + ", " + theme.selector + " " + key + " *"))
												event.call(e.target, e);
										});
									}else if (eventKey == "mouseover") {
										$(document).on("mouseenter", theme.selector + " " + key, function (e) {
											event.call($(this).closest(theme.selector + " " + key)[0], e);
										});
									}else if (eventKey == "mouseout") {
										$(document).on("mouseleave", theme.selector + " " + key, function (e) {
											event.call($(this).closest(theme.selector + " " + key)[0], e);
										});
									}else if (eventKey == "keydown") {
										$(document).on("keydown", theme.selector + " " + key, function (e) {
											event.call($(this).closest(theme.selector + " " + key)[0], e);
										});
									}else{
										$(document).on(eventKey, theme.selector + " " + key, function () {
											event.apply($(this)[0], arguments);
										});
									}
								})(event);
							}
						else if (key[0] == "/")
							Websom.Theme[key.substr(1)] = rule;
					})(key);
				}
			})(theme);
		}
	}
};

document.addEventListener("DOMContentLoaded", function (e) { 
	Websom.Theme.ready(document);
});