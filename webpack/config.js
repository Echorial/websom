class Config {
	constructor(configTemplate) {
		this._template = configTemplate;

		for (let key in this._template.options)
			if (this._template.options.hasOwnProperty(key))
				this[key] = this._template.options[key].default;
	}
}

export default Config