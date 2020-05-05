export default class Entity {
	constructor(collection, d) {
		let data = d || collection;

		this.$fields = [];

		if (typeof data.id !== "undefined")
			data.id = data.id.toString();

		for (let k in data) if (data.hasOwnProperty(k)) { this[k] = data[k]; this.$fields.push(k); }


		this.$collection = data ? collection : "/";
	}
}