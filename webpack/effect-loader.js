import Effect from "Util/effect";

class EffectLoader {
	constructor(effects) {
		this.effects = effects;

		this.activeEffects = {};
	}

	initialize() {
		for (let effect of this.effects) {
			let instance = new Effect(effect);
			this.activeEffects[effect.info.name] = instance;
			instance.initialize();
		}
	}

	
}

export default EffectLoader