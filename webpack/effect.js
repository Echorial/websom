import Config from "Util/config";

const virtualComponents = {
	button(e) {
		return (e.target.closest('input[type="submit"]') || e.target.closest('input[type="button"]') || e.target.closest('button'));
	}
}

const targets = {
	component: {
		listen(config, event, cb) {
			document.addEventListener(event, (e) => {
				if (e.target && ((e.target.closest && e.target.closest("." + config.name)) || (virtualComponents[config.name] && virtualComponents[config.name](e)))) {

					cb(e, e.target.closest("." + config.name) || virtualComponents[config.name](e));
				}
			}, true);
		}
	},
	element: {
		listen(config, event, cb) {
			document.addEventListener(event, (e) => {
				if (e.target && e.target.closest(config.selector)) {
					cb(e, e.target.closest(config.selector));
				}
			}, true);
		}
	}
}

class Effect {
	constructor(effect) {
		this.effect = effect;

		this.config = new Config(this.effect.config);
	}

	initialize() {
		for (let target of this.effect.info.apply) {
			let events = [];
			if (typeof this.effect.script.event == "string")
				events.push(This.effect.script.event);
			else if (Array.isArray(this.effect.script.event))
				events = this.effect.script.event;
			else
				throw new Event("The effect event property must be an array or string.");
			
			for (let event of events)
			targets[target.type].listen(target, event, async (e, el) => {
				let key = "effect_mounted_" + this.effect.info.name.replace(/[-]/g, "_");
				
				if (!el.dataset[key]) {
					await this.effect.script.mount.call(this, el, e);
					el.dataset[key] = true;
				}

				this.effect.script.activate.call(this, el, e);
			});
		}
	}
}

export default Effect;