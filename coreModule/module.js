//Relative Module
//Relative Tab
//Relative Module
//Relative User
//Relative Confirmation
//Relative UserControl
//Relative Group
//Relative Admission
//Relative Module
//Relative Charge
//Relative Item
//Relative Payment
//Relative RichText
//Relative RichTextControl
//Relative Likes
//Relative Comments
//Relative Comment
//Relative Image
//Relative ImageControl
//Relative Forum
//Relative ForumThread
//Relative ForumReply
CoreModule = function () {var _c_this = this;


}

CoreModule.Module = function () {var _c_this = this;
	this.test = null;

	this.server = null;

	this.baseConfig = null;

	this.containers = [];

	this.bridges = [];

	this.collections = [];

	this.name = "";

	this.id = "";

	this.root = "";

	this.version = "";

	this.author = "";

	this.license = "";

	this.repo = "";

	if (arguments.length == 1 && ((arguments[0] instanceof Websom.Server) || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var server = arguments[0];
		_c_this.server = server;
	}

}

/*i async*/CoreModule.Module.prototype.start = async function () {var _c_this = this; var _c_root_method_arguments = arguments;
	if (arguments.length == 0) {
/*async*/
		var db = _c_this.server.database.central;
		console.log("Before test");
		_c_this.test = db.collection("test");
		var schema = _c_this.test.schema().field("name", "string").field("balance", "float").calc("averageBalance", new Websom.Calculators.Average("balance")).index().field("name", "==").field("balance", "dsc");
		(await _c_this.registerCollection/* async call */(schema));
		(await _c_this.test.insert().set("name", "Hello").set("balance", 2).run/* async call */());
		var res = (await _c_this.test.where("name", "==", "Hello").get/* async call */());
		for (var i = 0; i < res.documents.length; i++) {
/*async*/
			var doc = res.documents[i];
			console.log("Found document " + (await doc.calc/* async call */("averageBalance")));
			}
	}
}

CoreModule.Module.prototype.clientData = function () {var _c_this = this; var _c_root_method_arguments = arguments;
	if (arguments.length == 2 && ((arguments[0] instanceof Websom.Request) || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'function' || typeof arguments[1] == 'undefined' || arguments[1] === null)) {
		var req = arguments[0];
		var send = arguments[1];
		return false;
	}
}

CoreModule.Module.prototype.spawn = function () {var _c_this = this; var _c_root_method_arguments = arguments;
	if (arguments.length == 1 && (typeof arguments[0] == 'object' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var config = arguments[0];
		_c_this.baseConfig = config;
		_c_this.name = config["name"];
		_c_this.id = config["id"];
	}
}

CoreModule.Module.prototype.stop = function () {var _c_this = this; var _c_root_method_arguments = arguments;
	if (arguments.length == 0) {

	}
}

CoreModule.Module.prototype.configure = function () {var _c_this = this; var _c_root_method_arguments = arguments;
	if (arguments.length == 0) {

	}
}

/*i async*/CoreModule.Module.prototype.registerCollection = async function () {var _c_this = this; var _c_root_method_arguments = arguments;
	if (arguments.length == 1 && ((arguments[0] instanceof Websom.Adapters.Database.Schema) || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var schema = arguments[0];
/*async*/
		_c_this.collections.push(schema.collection);
		if (_c_this.server.config.dev) {
/*async*/
			(await schema.register/* async call */());
			}
	}
}

CoreModule.Module.prototype.setupData = function () {var _c_this = this; var _c_root_method_arguments = arguments;
	if (arguments.length == 0) {

	}
}

CoreModule.Module.prototype.setupBridge = function () {var _c_this = this; var _c_root_method_arguments = arguments;
	if (arguments.length == 0) {

	}
}

CoreModule.Module.prototype.pullFromGlobalScope = function () {var _c_this = this; var _c_root_method_arguments = arguments;
	if (arguments.length == 1 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var name = arguments[0];
		
			return global[name];
		
	}
}

CoreModule.Module.prototype.setupBridges = function () {var _c_this = this; var _c_root_method_arguments = arguments;
	if (arguments.length == 0) {
		var bridges = [];
		return bridges;
	}
}

Person = function () {var _c_this = this;
	this.firstName = "";

	this.lastName = "";

	this.age = 0;


}

Person.prototype.getSchema = function () {var _c_this = this; var _c_root_method_arguments = arguments;
	if (arguments.length == 0) {
		var s = new Websom.Adapters.Database.Schema(null);
		s.field("firstName", "string").field("lastName", "string").field("age", "int");
		return s;
	}
}

//Relative Carbon
//Relative Context
//Relative Error
//Relative FileSystem
//Relative Buffer
//Relative File
//Relative Stat
//Relative primitive
//Relative object
//Relative array
//Relative bool
//Relative byte
//Relative char
//Relative Console
//Relative everything
//Relative Exception
//Relative float
//Relative function
//Relative int
//Relative uint
//Relative uint8
//Relative int8
//Relative uint16
//Relative int16
//Relative uint32
//Relative int32
//Relative uint64
//Relative int64
//Relative map
//Relative null
//Relative empty
//Relative void
//Relative string
//Relative Math
CoreModule.LokiCollection = function () {var _c_this = this;
	this.lokiCollection = null;

	this.database = null;

	this.appliedSchema = null;

	this.name = "";

	if (arguments.length == 2 && ((arguments[0] instanceof Websom.Adapters.Database.Adapter || (arguments[0] instanceof CoreModule.LokiDB)) || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'string' || typeof arguments[1] == 'undefined' || arguments[1] === null)) {
		var database = arguments[0];
		var name = arguments[1];
		_c_this.database = database;
		_c_this.name = name;
	}

}

CoreModule.LokiCollection.prototype.lazilyGetCollection = function () {var _c_this = this; var _c_root_method_arguments = arguments;
	if (arguments.length == 0) {
		
			if (!this.lokiCollection)
				this.lokiCollection = this.database.loki.getCollection(this.name);
		
	}
}

/*i async*/CoreModule.LokiCollection.prototype.document = async function () {var _c_this = this; var _c_root_method_arguments = arguments;
	if (arguments.length == 1 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var id = arguments[0];
		_c_this.lazilyGetCollection();
		var doc = null;
		
			doc = this.lokiCollection.get(id);
		
		if (doc == null) {
			return null;
			}
		return _c_this.documentFromRaw(doc);
	}
}

/*i async*/CoreModule.LokiCollection.prototype.meta = async function () {var _c_this = this; var _c_root_method_arguments = arguments;
	if (arguments.length == 1 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var key = arguments[0];
		_c_this.lazilyGetCollection();
		var doc = null;
		
			doc = this.lokiCollection.find({metaKey: key})[0];
		
		if (doc == null) {
			
				doc = {
					metaKey: key,
					number1: 0,
					number2: 0,
					number3: 0,
					string1: "",
					string2: "",
					string3: "",
					array1: [],
					array2: [],
					array3: []
				};

				this.lokiCollection.insert(doc);
			
			}
		var meta = new CoreModule.MetaDocument(key);
		meta.raw = doc;
		meta.collection = _c_this;
		return meta;
	}
}

CoreModule.LokiCollection.prototype.documentFromRaw = function () {var _c_this = this; var _c_root_method_arguments = arguments;
	if (arguments.length == 1 && (typeof arguments[0] == 'object' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var raw = arguments[0];
		var doc = new CoreModule.LokiDocument(_c_this, raw["$loki"]);
		doc.rawData = raw;
		return doc;
	}
}

CoreModule.LokiCollection.prototype.registerSchema = function () {var _c_this = this; var _c_root_method_arguments = arguments;
	if (arguments.length == 1 && ((arguments[0] instanceof Websom.Adapters.Database.Schema) || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var schema = arguments[0];
		
			let col = this.database.loki.getCollection(this.name);
			if (!col)
				this.database.loki.addCollection(this.name);
		
	}
else 	if (arguments.length == 1 && ((arguments[0] instanceof Websom.Adapters.Database.Schema) || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var schema = arguments[0];

	}
}

/*i async*/CoreModule.LokiCollection.prototype.executeUpdate = async function () {var _c_this = this; var _c_root_method_arguments = arguments;
	if (arguments.length == 1 && ((arguments[0] instanceof Websom.Adapters.Database.UpdateQuery) || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var query = arguments[0];
/*async*/
		_c_this.lazilyGetCollection();
		var docs = (await _c_this.executeSelect/* async call */(query)).documents;
		
			for (let doc of docs) {
				let oldCopy = this.documentFromRaw(Object.assign({}, doc.raw));

				for (let k in query.sets) {
					if (query.hasOwnProperty(k)) {
						doc.raw[k] = query.sets[k];
					}
				}

				for (let k in query.increments) {
					if (query.hasOwnProperty(k)) {
						doc.raw[k] = doc.raw[k] + query.increments[k];
					}
				}

				if (this.appliedSchema != null) {
					for (let i in this.appliedSchema.calculators) {
						let calc = this.appliedSchema.calculators[i];

						await calc.update(oldCopy, doc, this);
					}
				}

				this.lokiCollection.update(doc);
			}

			this.database.loki.saveDatabase(() => {
				console.log("Saved db");
			});
		
		var res = new Websom.Adapters.Database.UpdateQueryResult(true, "");
		res.updateCount = docs.length;
		return res;
	}
}

/*i async*/CoreModule.LokiCollection.prototype.executeDelete = async function () {var _c_this = this; var _c_root_method_arguments = arguments;
	if (arguments.length == 1 && ((arguments[0] instanceof Websom.Adapters.Database.DeleteQuery) || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var query = arguments[0];
/*async*/
		_c_this.lazilyGetCollection();
		var docs = (await _c_this.executeSelect/* async call */(query)).documents;
		for (var i = 0; i < docs.length; i++) {
/*async*/
			var doc = docs[i];
			
				this.lokiCollection.remove(doc);
			
			if (_c_this.appliedSchema != null) {
/*async*/
				for (var j = 0; j < _c_this.appliedSchema.calculators.length; j++) {
/*async*/
					var calc = _c_this.appliedSchema.calculators[j];
					(await calc.delete/* async call */(doc, _c_this));
					}
				}
			}
		
			this.database.loki.saveDatabase(() => {
				console.log("Saved db");
			});
		
		return new Websom.Adapters.Database.DeleteQueryResult(true, "");
	}
}

/*i async*/CoreModule.LokiCollection.prototype.executeInsert = async function () {var _c_this = this; var _c_root_method_arguments = arguments;
	if (arguments.length == 1 && ((arguments[0] instanceof Websom.Adapters.Database.InsertQuery) || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var query = arguments[0];
/*async*/
		_c_this.lazilyGetCollection();
		var id = "";
		
			id = this.lokiCollection.insert(query.sets).$loki;
			this.database.loki.saveDatabase(() => {
				console.log("Saved db");
			});
		
		if (_c_this.appliedSchema != null) {
/*async*/
			var doc = _c_this.documentFromRaw(query.sets);
			for (var i = 0; i < _c_this.appliedSchema.calculators.length; i++) {
/*async*/
				var calc = _c_this.appliedSchema.calculators[i];
				(await calc.insert/* async call */(doc, _c_this));
				}
			}
		var res = new Websom.Adapters.Database.InsertQueryResult(true, "", id);
		return res;
	}
}

/*i async*/CoreModule.LokiCollection.prototype.executeSelect = async function () {var _c_this = this; var _c_root_method_arguments = arguments;
	if (arguments.length == 1 && ((arguments[0] instanceof Websom.Adapters.Database.SelectQuery || (arguments[0] instanceof Websom.Adapters.Database.UpdateQuery) || (arguments[0] instanceof Websom.Adapters.Database.DeleteQuery)) || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var query = arguments[0];
		_c_this.lazilyGetCollection();
		var res = new Websom.Adapters.Database.SelectQueryResult(true, "");
		
			let ops = {
				">": "$gt",
				">=": "$gte",
				"<": "$lt",
				"<=": "$lte",
				"==": "$eq",
				"in": "$in",
				"contains": "$contains",
				"contains-any": "$containsAny"
			};

			let qMap = {};
			let orderByField = "";
			let orderByOrder = "asc";

			for (let condition of query.conditions) {
				if (condition.type == "where") {
					if (!qMap[condition.field])
						qMap[condition.field] = {};
					
					qMap[condition.field][ops[condition.operator]] = condition.value;
				}else if (condition.type == "order") {
					orderByField = condition.field;
					orderByOrder = condition.operator;
				}
			}

			let lokiQuery = this.lokiCollection.chain().find(qMap);

			if (orderByField != "")
				lokiQuery.simplesort(orderByField, orderByOrder == "dsc");

			let rawResults = lokiQuery.data();

			for (let raw of rawResults)
				res.documents.push(this.documentFromRaw(raw));
		
		return res;
	}
}

CoreModule.LokiCollection.prototype.schema = function () {var _c_this = this; var _c_root_method_arguments = arguments;
	if (arguments.length == 0) {
		_c_this.appliedSchema = new Websom.Adapters.Database.Schema(_c_this);
		return _c_this.appliedSchema;
	}
}

CoreModule.LokiCollection.prototype.insert = function () {var _c_this = this; var _c_root_method_arguments = arguments;
	if (arguments.length == 0) {
		return new Websom.Adapters.Database.InsertQuery(_c_this);
	}
}

CoreModule.LokiCollection.prototype.select = function () {var _c_this = this; var _c_root_method_arguments = arguments;
	if (arguments.length == 0) {
		return new Websom.Adapters.Database.SelectQuery(_c_this);
	}
}

CoreModule.LokiCollection.prototype.where = function () {var _c_this = this; var _c_root_method_arguments = arguments;
	if (arguments.length == 3 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'string' || typeof arguments[1] == 'undefined' || arguments[1] === null) && ((arguments[2] instanceof Array || typeof arguments[2] == 'boolean' || typeof arguments[2] == 'string' || typeof arguments[2] == 'number' || typeof arguments[2] == 'number' || typeof arguments[2] == 'object' || typeof arguments[2] == 'string') || typeof arguments[2] == 'undefined' || arguments[2] === null)) {
		var field = arguments[0];
		var operator = arguments[1];
		var value = arguments[2];
		var q = _c_this.select();
		q.where(field, operator, value);
		return q;
	}
}

CoreModule.LokiCollection.prototype.update = function () {var _c_this = this; var _c_root_method_arguments = arguments;
	if (arguments.length == 0) {
		return new Websom.Adapters.Database.UpdateQuery(_c_this);
	}
}

CoreModule.LokiCollection.prototype.delete = function () {var _c_this = this; var _c_root_method_arguments = arguments;
	if (arguments.length == 0) {
		return new Websom.Adapters.Database.DeleteQuery(_c_this);
	}
}

CoreModule.LokiDB = function () {var _c_this = this;
	this.loki = null;

	this.route = "adapter.database.loki";

	this.server = null;

	if (arguments.length == 1 && ((arguments[0] instanceof Websom.Server) || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var server = arguments[0];
		_c_this.server = server;
	}

}

/*i async*/CoreModule.LokiDB.prototype.initialize = async function () {var _c_this = this; var _c_root_method_arguments = arguments;
	if (arguments.length == 0) {
/*async*/
		if (_c_this.server.config.verbose) {
			console.log("Starting LokiDB");
			}
		(await _c_this.loadDB/* async call */());
	}
}

CoreModule.LokiDB.prototype.loadDB = function () {var _c_this = this; var _c_root_method_arguments = arguments;
	if (arguments.length == 0) { 
return new Promise((_c_resolve, _c_reject) => {		
			const loki = require("lokijs");

			let file = this.server.getConfigString(this.route, "persistence");
			this.loki = new loki(this.server.config.root + "/" + file, {
				autosave: true,
				autosaveInterval: 5000,
				autoload: true,
				autoloadCallback: () => {
					console.log("Loaded loki db");
					_c_resolve(); return;
				}
			});
		
 }); }
}

/*i async*/CoreModule.LokiDB.prototype.shutdown = async function () {var _c_this = this; var _c_root_method_arguments = arguments;
	if (arguments.length == 0) {
		console.log("Saving loki DB");
		
			this.loki.saveDatabase(() => {
				_c_resolve(); return;
			});
		
	}
}

CoreModule.LokiDB.prototype.collection = function () {var _c_this = this; var _c_root_method_arguments = arguments;
	if (arguments.length == 1 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var name = arguments[0];
		return new CoreModule.LokiCollection(_c_this, name);
	}
}

CoreModule.LokiDocument = function (collection, id) {var _c_this = this;
	this.rawData = null;

	this.collection = null;

	this.id = "";

		_c_this.collection = collection;
		_c_this.id = id;
}

CoreModule.LokiDocument.prototype.get = function () {var _c_this = this; var _c_root_method_arguments = arguments;
	if (arguments.length == 1 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var field = arguments[0];
		return _c_this.rawData[field];
	}
}

CoreModule.LokiDocument.prototype.data = function () {var _c_this = this; var _c_root_method_arguments = arguments;
	if (arguments.length == 0) {
		return _c_this.rawData;
	}
}

/*i async*/CoreModule.LokiDocument.prototype.calc = async function () {var _c_this = this; var _c_root_method_arguments = arguments;
	if (arguments.length == 1 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var field = arguments[0];
/*async*/
		if (_c_this.collection.appliedSchema == null) {
			throw "No schema on collection";
			return null;
			}
		for (var i = 0; i < _c_this.collection.appliedSchema.calculators.length; i++) {
/*async*/
			var calc = _c_this.collection.appliedSchema.calculators[i];
			if (calc.getterName == field) {
/*async*/
				return (await calc.get/* async call */(_c_this.collection));
				}
			}
	}
}

CoreModule.MetaDocument = function () {var _c_this = this;
	this.raw = {};

	this.sets = {};

	this.collection = null;

	this.id = "";

	if (arguments.length == 1 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var id = arguments[0];
		_c_this.id = id;
	}

}

CoreModule.MetaDocument.prototype.incrementNumberField = function () {var _c_this = this; var _c_root_method_arguments = arguments;
	if (arguments.length == 2 && (typeof arguments[0] == 'number' || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'number' || typeof arguments[1] == 'undefined' || arguments[1] === null)) {
		var index = arguments[0];
		var value = arguments[1];
		var curValue = _c_this.raw["number" + index];
		_c_this.sets["number" + index] = curValue + value;
	}
}

CoreModule.MetaDocument.prototype.setNumberField = function () {var _c_this = this; var _c_root_method_arguments = arguments;
	if (arguments.length == 2 && (typeof arguments[0] == 'number' || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'number' || typeof arguments[1] == 'undefined' || arguments[1] === null)) {
		var index = arguments[0];
		var value = arguments[1];
		_c_this.sets["number" + index] = value;
	}
}

CoreModule.MetaDocument.prototype.numberField = function () {var _c_this = this; var _c_root_method_arguments = arguments;
	if (arguments.length == 1 && (typeof arguments[0] == 'number' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var index = arguments[0];
		return _c_this.raw["number" + index];
	}
}

CoreModule.MetaDocument.prototype.setStringField = function () {var _c_this = this; var _c_root_method_arguments = arguments;
	if (arguments.length == 2 && (typeof arguments[0] == 'number' || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'string' || typeof arguments[1] == 'undefined' || arguments[1] === null)) {
		var index = arguments[0];
		var value = arguments[1];
		_c_this.sets["string" + index] = value;
	}
}

CoreModule.MetaDocument.prototype.stringField = function () {var _c_this = this; var _c_root_method_arguments = arguments;
	if (arguments.length == 1 && (typeof arguments[0] == 'number' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var index = arguments[0];
		return _c_this.raw["string" + index];
	}
}

CoreModule.MetaDocument.prototype.setArrayField = function () {var _c_this = this; var _c_root_method_arguments = arguments;
	if (arguments.length == 2 && (typeof arguments[0] == 'number' || typeof arguments[0] == 'undefined' || arguments[0] === null) && (arguments[1] instanceof Array || typeof arguments[1] == 'undefined' || arguments[1] === null)) {
		var index = arguments[0];
		var value = arguments[1];
		_c_this.sets["array" + index] = value;
	}
}

CoreModule.MetaDocument.prototype.arrayField = function () {var _c_this = this; var _c_root_method_arguments = arguments;
	if (arguments.length == 1 && (typeof arguments[0] == 'number' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var index = arguments[0];
		return _c_this.raw["array" + index];
	}
}

/*i async*/CoreModule.MetaDocument.prototype.update = async function () {var _c_this = this; var _c_root_method_arguments = arguments;
	if (arguments.length == 0) {
		
			for (let k in this.sets) {
				this.raw[k] = this.sets[k];
			}

			this.collection.lokiCollection.update(this.raw);
		
	}
}


module.exports = CoreModule.Module;