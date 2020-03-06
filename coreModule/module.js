//Relative Module
//Relative User
//Relative Login
//Relative Connection
CoreModule = function () {var _c_this = this;


}

CoreModule.Module = function () {var _c_this = this;
	this.test = null;

	this.groups = null;

	this.confirmations = null;

	this.commentEdit = null;

	this.commentCreate = null;

	this.commentRead = null;

	this.groupRead = null;

	this.groupCreate = null;

	this.groupEdit = null;

	this.server = null;

	this.baseConfig = null;

	this.containers = [];

	this.bridges = [];

	this.registeredCollections = [];

	this.registeredPermissions = [];

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
		_c_this.registerWithServer();
	}

}

CoreModule.Module.prototype.permissions = function () {var _c_this = this; var _c_root_method_arguments = arguments;
	if (arguments.length == 0) {
		_c_this.commentEdit = new Websom.Permission("Comment.Edit");
		_c_this.commentEdit.description = "Allows users to edit any comment";
		_c_this.commentCreate = new Websom.Permission("Comment.Create");
		_c_this.commentCreate.description = "Allows users to create a comment";
		_c_this.commentRead = new Websom.Permission("Comment.Read");
		_c_this.commentRead.description = "Read permissions on any comment anywhere";
		_c_this.commentRead.public = true;
		_c_this.registerPermission(_c_this.commentEdit);
		_c_this.registerPermission(_c_this.commentCreate);
		_c_this.registerPermission(_c_this.commentRead);
		_c_this.groupRead = _c_this.registerPermission("Group.Read").setDescription("Allows users to read permission group information.");
		_c_this.groupCreate = _c_this.registerPermission("Group.Create").setDescription("Allows users to create permission groups. WARNING This is an admin level permission.");
		_c_this.groupEdit = _c_this.registerPermission("Group.Edit").setDescription("Allows users to edit permission groups. WARNING This is an admin level permission.");
	}
}

/*i async*/CoreModule.Module.prototype.collections = async function () {var _c_this = this; var _c_root_method_arguments = arguments;
	if (arguments.length == 0) {
/*async*/
		var db = _c_this.server.database.central;
		_c_this.confirmations = db.collection("confirmations");
		var confirmationSchema = _c_this.confirmations.schema().field("secret", "string").field("key", "string").field("ip", "string").field("created", "time").field("storage", "string").field("expires", "time").field("confirmed", "boolean").field("service", "string").field("method", "string").field("to", "string");
		(await _c_this.registerCollection/* async call */(_c_this.confirmations));
		_c_this.groups = db.collection("groups");
		Websom.Group.applySchema(_c_this.groups);
		(await _c_this.registerCollection/* async call */(_c_this.groups));
		_c_this.server.api.interface(_c_this.groups, "/groups").route("/create").auth(_c_this.groupCreate).executes("insert").write("name").write("description").write("permissions").write("rules").write("public").write("user").setComputed("created", function (req) {
			return Websom.Time.now();
			}).route("/find").auth(_c_this.groupRead).executes("select").read("*").filter("default").order("created", "dsc").route("/read").auth(_c_this.groupRead).executes("select").read("*").filter("default").field("id", "==");
		_c_this.test = db.collection("test");
		var schema = _c_this.test.schema().field("name", "string").field("balance", "float").calc("averageBalance", new Websom.Calculators.Average("balance")).index().field("name", "==").field("balance", "dsc");
		(await _c_this.registerCollection/* async call */(_c_this.test));
		var x = Websom.Time.now();
		(await _c_this.test.insert().set("name", "Hello").set("balance", Math.sin(x)).run/* async call */());
		var res = (await _c_this.test.where("name", "==", "Hello").get/* async call */());
		_c_this.server.api.interface(_c_this.test, "/testing").route("/create").auth(_c_this.commentCreate).executes("insert").write("name").limit(3, 256).set("balance", 0).route("/edit").auth(_c_this.commentEdit).executes("update").write("name").filter("default").field("id", "==").route("/find").auth(_c_this.commentRead).executes("select").read("name").read("balance").filter("default").field("name", "==").force("balance", "<", 100).order("balance", "dsc");
	}
}

CoreModule.Module.prototype.registerWithServer = function () {var _c_this = this; var _c_root_method_arguments = arguments;
	if (arguments.length == 0) {
		var adapter = new CoreModule.Confirmation(_c_this.server);
		adapter.module = _c_this;
		_c_this.server.confirmation.confirmation = adapter;
	}
}

/*i async*/CoreModule.Module.prototype.start = async function () {var _c_this = this; var _c_root_method_arguments = arguments;
	if (arguments.length == 0) {
		_c_this.server.api.route("/custom/endpoint", function (req) {
			req.end("Hello");
			});
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

/*i async*/CoreModule.Module.prototype.registerCollection = async function (collection) {var _c_this = this; var _c_root_method_arguments = arguments;
/*async*/
		_c_this.registeredCollections.push(collection);
		if (_c_this.server.config.dev) {
/*async*/
			if (collection.appliedSchema != null) {
/*async*/
				(await collection.appliedSchema.register/* async call */());
				}
			}}

CoreModule.Module.prototype.registerPermission = function () {var _c_this = this; var _c_root_method_arguments = arguments;
	if (arguments.length == 1 && ((arguments[0] instanceof Websom.Permission) || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var permission = arguments[0];
		_c_this.registeredPermissions.push(permission);
	}
else 	if (arguments.length == 1 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var permission = arguments[0];
		var perm = new Websom.Permission(permission);
		_c_this.registeredPermissions.push(perm);
		return perm;
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

	this.entityTemplate = null;

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

/*i async*/CoreModule.LokiCollection.prototype.getAll = async function () {var _c_this = this; var _c_root_method_arguments = arguments;
	if (arguments.length == 1 && (arguments[0] instanceof Array || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var ids = arguments[0];
		_c_this.lazilyGetCollection();
		var docs = null;
		
			docs = this.lokiCollection.find({
				$loki: {"$in": ids}
			});
		
		var outputs = [];
		for (var i = 0; i < docs.length; i++) {
			var doc = docs[i];
			outputs.push(_c_this.documentFromRaw(doc));
			}
		return outputs;
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

/*i async*/CoreModule.LokiCollection.prototype.commitBatch = async function () {var _c_this = this; var _c_root_method_arguments = arguments;
	if (arguments.length == 1 && ((arguments[0] instanceof Websom.Adapters.Database.BatchQuery) || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var query = arguments[0];
/*async*/
		for (var u = 0; u < query.updates.length; u++) {
/*async*/
			(await _c_this.executeUpdate/* async call */(query.updates[u]));
			}
		var inserts = [];
		for (var i = 0; i < query.inserts.length; i++) {
/*async*/
			inserts.push((await _c_this.executeInsert/* async call */(query.inserts[i])));
			}
	}
}

/*i async*/CoreModule.LokiCollection.prototype.executeUpdate = async function () {var _c_this = this; var _c_root_method_arguments = arguments;
	if (arguments.length == 1 && ((arguments[0] instanceof Websom.Adapters.Database.UpdateQuery) || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var query = arguments[0];
/*async*/
		_c_this.lazilyGetCollection();
		var docs = (await _c_this.executeSelect/* async call */(query)).documents;
		
			for (let doc of docs) {
				let oldCopy = this.documentFromRaw(Object.assign({}, doc.rawData));

				for (let k in query.sets) {
					if (query.sets.hasOwnProperty(k)) {
						doc.rawData[k] = query.sets[k];
					}
				}

				for (let k in query.increments) {
					if (query.hasOwnProperty(k)) {
						doc.rawData[k] = doc.rawData[k] + query.increments[k];
					}
				}

				if (this.appliedSchema != null) {
					for (let i in this.appliedSchema.calculators) {
						let calc = this.appliedSchema.calculators[i];

						await calc.update(oldCopy, doc, this);
					}
				}

				this.lokiCollection.update(doc.rawData);
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

			let rawResults = lokiQuery.offset(query.documentStart).limit(query.documentLimit).data();

			for (let raw of rawResults)
				res.documents.push(this.documentFromRaw(raw));
		
		return res;
	}
}

/*i async*/CoreModule.LokiCollection.prototype.makeEntity = async function () {var _c_this = this; var _c_root_method_arguments = arguments;
	if (arguments.length == 1 && ((arguments[0] instanceof Websom.Adapters.Database.Document || (arguments[0] instanceof CoreModule.LokiDocument)) || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var document = arguments[0];
/*async*/
		var entity = null;
		
			entity = new this.entityTemplate();
		
		
		entity.collection = _c_this;
		entity.id = document.id;
		(await entity.loadFromMap/* async call */(document.data()));
		return entity;
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

CoreModule.LokiCollection.prototype.batch = function () {var _c_this = this; var _c_root_method_arguments = arguments;
	if (arguments.length == 0) {
		return new Websom.Adapters.Database.BatchQuery(_c_this);
	}
}

CoreModule.LokiCollection.prototype.entity = function () {var _c_this = this; var _c_root_method_arguments = arguments;
	if (arguments.length == 0) {
		var entity = null;
		
			entity = this.entityTemplate();
		
		
		entity.collection = _c_this;
	}
}

/*i async*/CoreModule.LokiCollection.prototype.getEntity = async function () {var _c_this = this; var _c_root_method_arguments = arguments;
	if (arguments.length == 1 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var id = arguments[0];
/*async*/
		var doc = (await _c_this.document/* async call */(id));
		if (doc == null) {
			return null;
			}
		return (await _c_this.makeEntity/* async call */(doc));
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

CoreModule.SendGrid = function () {var _c_this = this;
	this.sendGrid = null;

	this.route = "adapter.database.sendGrid";

	this.server = null;

	if (arguments.length == 1 && ((arguments[0] instanceof Websom.Server) || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var server = arguments[0];
		_c_this.server = server;
	}

}

/*i async*/CoreModule.SendGrid.prototype.initialize = async function () {var _c_this = this; var _c_root_method_arguments = arguments;
	if (arguments.length == 0) {

	}
}

CoreModule.SendGrid.prototype.loadSendGrid = function () {var _c_this = this; var _c_root_method_arguments = arguments;
	if (arguments.length == 0) {
		
			if (!this.sendGrid) {
				this.sendGrid = require("@sendgrid/mail");
				this.sendGrid.setApiKey(this.server.getConfigString(this.route, "apiKey"));
			}
		
	}
}

/*i async*/CoreModule.SendGrid.prototype.send = async function () {var _c_this = this; var _c_root_method_arguments = arguments;
	if (arguments.length == 1 && ((arguments[0] instanceof Websom.Adapters.Email.Email) || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var email = arguments[0];
		
			try {
				await this.sendGrid.send({
					to: email.recipients,
					from: email.fromAddress,
					fromname: email.fromName,
					text: email.textBody,
					html: email.htmlBody,
					subject: email.subject,
					cc: email.cc,
					bcc: email.bcc,
					replyto: email.replyTo
				});

				return new Websom.Adapters.Email.SendResults("success", "Email sent", email.recipients.length);
			} catch (e) {
				return new Websom.Adapters.Email.SendResults("error", e.toString(), 0);
			}
		
	}
}

CoreModule.SendGrid.prototype.email = function () {var _c_this = this; var _c_root_method_arguments = arguments;
	if (arguments.length == 0) {
		return new Websom.Adapters.Email.Email(_c_this);
	}
}

CoreModule.SendGrid.prototype.template = function () {var _c_this = this; var _c_root_method_arguments = arguments;
	if (arguments.length == 1 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var title = arguments[0];
		return new Websom.Adapters.Email.EmailTemplate(_c_this, title);
	}
}

/*i async*/CoreModule.SendGrid.prototype.shutdown = async function () {var _c_this = this; var _c_root_method_arguments = arguments;
	if (arguments.length == 0) {

	}
}

CoreModule.Confirmation = function () {var _c_this = this;
	this.route = "adapter.confirmation";

	this.module = null;

	this.handlers = [];

	this.server = null;

	if (arguments.length == 1 && ((arguments[0] instanceof Websom.Server) || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var server = arguments[0];
		_c_this.server = server;
	}

}

/*i async*/CoreModule.Confirmation.prototype.initialize = async function () {var _c_this = this; var _c_root_method_arguments = arguments;
	if (arguments.length == 0) {

	}
}

/*i async*/CoreModule.Confirmation.prototype.dispatch = async function () {var _c_this = this; var _c_root_method_arguments = arguments;
	if (arguments.length == 1 && ((arguments[0] instanceof Websom.Adapters.Confirmation.Confirmation) || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var confirmation = arguments[0];
/*async*/
		var secret = _c_this.server.crypto.getRandomHex(255);
		var url = _c_this.server.apiHost + "/confirmations/confirm/" + secret;
		var results = new Websom.Adapters.Confirmation.ConfirmationResults(secret, url, "success", "Confirmation created");
		_c_this.module.confirmations.insert().set("secret", secret).set("key", confirmation.key).set("ip", confirmation.ip).set("created", Websom.Time.now()).set("storage", Websom.Json.encode(confirmation.storage)).set("expires", Websom.Time.now() + confirmation.ttl).set("confirmed", false).set("service", confirmation.notificationService).set("method", confirmation.method).set("to", confirmation.recipient);
		if (confirmation.notificationService == "direct") {
			return results;
			}else if (confirmation.notificationService == "email") {
/*async*/
			if (confirmation.method == "link") {
/*async*/
				(await _c_this.sendLinkEmail/* async call */(url, confirmation));
				}else if (confirmation.method == "code") {

				}
			return results;
			}else if (confirmation.notificationService == "sms") {

			}
		return new Websom.Adapters.Confirmation.ConfirmationResults("", "", "error", "Invalid notificationService");
	}
else 	if (arguments.length == 1 && ((arguments[0] instanceof Websom.Adapters.Confirmation.Confirmation) || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var confirmation = arguments[0];

	}
}

/*i async*/CoreModule.Confirmation.prototype.sendLinkEmail = async function () {var _c_this = this; var _c_root_method_arguments = arguments;
	if (arguments.length == 2 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null) && ((arguments[1] instanceof Websom.Adapters.Confirmation.Confirmation) || typeof arguments[1] == 'undefined' || arguments[1] === null)) {
		var url = arguments[0];
		var confirmation = arguments[1];
/*async*/
		var from = _c_this.server.getConfigString("adapters.confirmation", "fromEmail");
		if (from == "") {
			from = "no-reply@example.com";
			}
		(await _c_this.server.notification.email.template("confirmation").row().column().column().paragraph(confirmation.confirmationMessage).button("Confirm", url).column().email().addRecipient(confirmation.recipient).setFrom(from, _c_this.server.websiteName).setSubject(confirmation.emailSubject).send/* async call */());
	}
}

CoreModule.Confirmation.prototype.confirm = function () {var _c_this = this; var _c_root_method_arguments = arguments;
	if (arguments.length == 1 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var key = arguments[0];
		return new Websom.Adapters.Confirmation.Confirmation(_c_this, key);
	}
}

CoreModule.Confirmation.prototype.handleConfirmation = function () {var _c_this = this; var _c_root_method_arguments = arguments;
	if (arguments.length == 2 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'function' || typeof arguments[1] == 'undefined' || arguments[1] === null)) {
		var key = arguments[0];
		var handler = arguments[1];
		_c_this.handlers.push(new Websom.Adapters.Confirmation.Handler(key, handler));
	}
}

/*i async*/CoreModule.Confirmation.prototype.shutdown = async function () {var _c_this = this; var _c_root_method_arguments = arguments;
	if (arguments.length == 0) {

	}
}


module.exports = CoreModule.Module;