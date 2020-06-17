//Relative Module
//Relative User
//Relative Login
//Relative Connection
//Relative Module
//Relative Order
//Relative Product
//Relative Cart
//Relative ShippingClass
//Relative ShippingZone
CoreModule = function () {var _c_this = this;


}

CoreModule.Module = function (server) {var _c_this = this;
	this.groups = null;

	this.confirmations = null;

	this.objects = null;

	this.mediaFiles = null;

	this.tags = null;

	this.categories = null;

	this.dashboardView = null;

	this.commentEdit = null;

	this.commentCreate = null;

	this.commentRead = null;

	this.groupRead = null;

	this.groupCreate = null;

	this.groupEdit = null;

	this.corePublic = null;

	this.media = null;

	this.transientAccessCode = "";

	this.server = null;

	this.baseConfig = null;

	this.containers = [];

	this.bridges = [];

	this.registeredCollections = [];

	this.registeredPermissions = [];

	this.registeredBuckets = [];

	this.name = "";

	this.id = "";

	this.root = "";

	this.version = "";

	this.author = "";

	this.license = "";

	this.repo = "";

		_c_this.server = server;
		_c_this.registerWithServer();
}

CoreModule.Module.prototype.permissions = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		_c_this.dashboardView = new Websom.Permission("Dashboard.View");
		_c_this.commentEdit = new Websom.Permission("Comment.Edit");
		_c_this.commentEdit.description = "Allows users to edit any comment";
		_c_this.commentCreate = new Websom.Permission("Comment.Create");
		_c_this.commentCreate.description = "Allows users to create a comment";
		_c_this.commentRead = new Websom.Permission("Comment.Read");
		_c_this.commentRead.description = "Read permissions on any comment anywhere";
		_c_this.commentRead.public = true;
		_c_this.registerPermission(_c_this.dashboardView);
		_c_this.registerPermission(_c_this.commentEdit);
		_c_this.registerPermission(_c_this.commentCreate);
		_c_this.registerPermission(_c_this.commentRead);
		_c_this.corePublic = _c_this.registerPermission("Core.Public").isPublic().setDescription("Base public permission providing access to tags, categories and more.");
		_c_this.groupRead = _c_this.registerPermission("Group.Read").setDescription("Allows users to read permission group information.");
		_c_this.groupCreate = _c_this.registerPermission("Group.Create").setDescription("Allows users to create permission groups. WARNING This is an admin level permission.");
		_c_this.groupEdit = _c_this.registerPermission("Group.Edit").setDescription("Allows users to edit permission groups. WARNING This is an admin level permission.");}

/*i async*/CoreModule.Module.prototype.collections = async function () {var _c_this = this; var _c_root_method_arguments = arguments;
/*async*/
		var db = _c_this.server.database.central;
		_c_this.tags = db.collection("tags");
		_c_this.tags.schema().field("name", "string").field("namespace", "string").field("description", "string").field("color", "string").field("created", "time").field("objects", "int");
		var fieldsForSearching = [];
		fieldsForSearching.push("name");
		fieldsForSearching.push("namespace");
		fieldsForSearching.push("description");
		fieldsForSearching.push("color");
		fieldsForSearching.push("created");
		fieldsForSearching.push("objects");
		_c_this.tags.enableSearching(fieldsForSearching);
		(await _c_this.registerCollection/* async call */(_c_this.tags));
		_c_this.server.api.interface(_c_this.tags, "/tags").route("/insert").auth(_c_this.dashboardView).executes("insert").write("name").write("namespace").write("description").write("color").setComputed("created", function (req) {
			return Websom.Time.now();
			}).route("/delete").auth(_c_this.dashboardView).executes("delete").filter("default").field("id", "in").route("/view").auth(_c_this.dashboardView).executes("select").read("*").filter("default").field("namespace", "==").route("/search").auth(_c_this.corePublic).executes("search").read("*").filter("default").field("name", "==").field("namespace", "==").route("/get").auth(_c_this.dashboardView).executes("select").read("*").filter("default").field("id", "==");
		_c_this.categories = db.collection("categories");
		_c_this.categories.schema().field("name", "string").field("namespace", "string").field("description", "string").field("color", "string").field("created", "time").field("objects", "int").field("parent", "string");
		(await _c_this.registerCollection/* async call */(_c_this.categories));
		_c_this.server.api.interface(_c_this.categories, "/categories").route("/insert").auth(_c_this.dashboardView).executes("insert").write("name").write("namespace").write("description").write("color").write("parent").setComputed("created", function (req) {
			return Websom.Time.now();
			}).route("/delete").auth(_c_this.dashboardView).executes("delete").filter("default").field("id", "in").route("/view").auth(_c_this.dashboardView).executes("select").read("*").filter("default").field("namespace", "==").route("/get").auth(_c_this.dashboardView).executes("select").read("*").filter("default").field("id", "==");
		_c_this.objects = db.collection("websom_bucket_objects");
		_c_this.objects.schema().field("filename", "string").field("bucket", "string").field("acl", "string").field("uploaded", "boolean").field("token", "string").field("sizeLimit", "int");
		(await _c_this.registerCollection/* async call */(_c_this.objects));
		_c_this.mediaFiles = db.collection("websom_media");
		_c_this.mediaFiles.schema().field("name", "string").field("file", "string").field("size", "int").field("created", "time").field("owner", "string").field("type", "string");
		(await _c_this.registerCollection/* async call */(_c_this.mediaFiles));
		_c_this.server.api.interface(_c_this.mediaFiles, "/media").route("/insert").auth(_c_this.dashboardView).executes("insert").write("name").write("file").write("size").write("type").setComputed("user", async function (req) {
/*async*/
			return (await req.user/* async call */()).id;
			}).setComputed("created", function (req) {
			return Websom.Time.now();
			}).route("/delete").auth(_c_this.dashboardView).executes("delete").filter("default").field("id", "in").on("success", async function (req, docs) {
/*async*/
			for (var i = 0; i < docs.length; i++) {
/*async*/
				var doc = docs[i];
				(await _c_this.media.deleteObject/* async call */(doc.get("name")));
				}
			}).route("/view").auth(_c_this.dashboardView).executes("select").read("*").filter("default").order("*", "dsc").route("/get").auth(_c_this.dashboardView).executes("select").read("*").filter("default").field("file", "==");
		_c_this.confirmations = db.collection("confirmations");
		var confirmationSchema = _c_this.confirmations.schema().field("secret", "string").field("key", "string").field("ip", "string").field("created", "time").field("storage", "string").field("expires", "time").field("confirmed", "boolean").field("service", "string").field("method", "string").field("to", "string");
		(await _c_this.registerCollection/* async call */(_c_this.confirmations));
		_c_this.groups = db.collection("groups");
		Websom.Group.applySchema(_c_this.groups);
		(await _c_this.registerCollection/* async call */(_c_this.groups));
		_c_this.server.api.interface(_c_this.groups, "/groups").route("/create").auth(_c_this.groupCreate).executes("insert").write("name").write("description").write("permissions").write("rules").write("public").write("user").setComputed("created", function (req) {
			return Websom.Time.now();
			}).route("/find").auth(_c_this.groupRead).executes("select").read("*").filter("default").order("created", "dsc", true).route("/read").auth(_c_this.groupRead).executes("select").read("*").filter("default").field("id", "==");
		_c_this.server.api.route("/dashboard/view").auth(_c_this.dashboardView).executes(async function (ctx) {
/*async*/
			var data = {};
			data["website"] = _c_this.server.config.name;
			data["dev"] = _c_this.server.config.dev;
			data["config"] = _c_this.server.configService.cacheOptions();
			data["options"] = _c_this.server.configService.getConfiguredOptions();
			(await ctx.request.endWithData/* async call */(data));
			});
		_c_this.server.api.route("/dashboard/access").executes(async function (ctx) {
/*async*/
			if (_c_this.server.config.dev) {
/*async*/
				var data = {};
				var str = "";
				for (var i = 0; i < 4; i++) {
					str += ((Math.floor(Math.random() * 10)));
					}
				_c_this.transientAccessCode = str;
				console.log("Dev access code requested: " + _c_this.transientAccessCode);
				(await ctx.request.endWithSuccess/* async call */("Generated"));
				}else{
/*async*/
					(await ctx.request.endWithError/* async call */("Nice try."));
				}
			});
		_c_this.server.api.route("/dashboard/login-with-access-code").input("code").type("string").executes(async function (ctx) {
/*async*/
			if (_c_this.server.config.dev) {
/*async*/
				if (_c_this.transientAccessCode != "") {
/*async*/
					var code = ctx.get("code");
					if (code == _c_this.transientAccessCode) {
/*async*/
						_c_this.transientAccessCode = "";
						(await ctx.request.grantSessionRole/* async call */("admin"));
						(await ctx.request.endWithSuccess/* async call */("Success"));
						}else{
/*async*/
							(await ctx.request.endWithError/* async call */("Invalid"));
						}
					}else{
/*async*/
						(await ctx.request.endWithError/* async call */("Invalid"));
					}
				}else{
/*async*/
					(await ctx.request.endWithError/* async call */("This feature is only available on dev servers."));
				}
			});}

CoreModule.Module.prototype.registerWithServer = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		var adapter = new CoreModule.Confirmation(_c_this.server);
		adapter.module = _c_this;
		_c_this.server.confirmation.confirmation = adapter;
		adapter.registerCollection();}

/*i async*/CoreModule.Module.prototype.start = async function () {var _c_this = this; var _c_root_method_arguments = arguments;
		_c_this.media = _c_this.registerBucket("media");
		_c_this.server.api.route("/media/upload").auth(_c_this.dashboardView).input("filename").type("string").input("type").type("string").input("size").type("integer").executes(async function (ctx) {
/*async*/
			var filename = ctx.get("filename");
			var res = (await _c_this.mediaFiles.where("name", "==", filename).get/* async call */());
			var data = {};
			data["uploadURL"] = (await _c_this.media.uploadObject().name(filename).access("public").generateUploadURL/* async call */());
			data["conflict"] = false;
			if (res.documents.length > 0) {
				data["conflict"] = true;
				}else{
/*async*/
					(await _c_this.mediaFiles.insert().set("name", filename).set("file", (await _c_this.media.serve/* async call */(filename))).set("type", ctx.get("type")).set("size", ctx.get("size")).set("created", Websom.Time.now()).set("owner", (await ctx.request.user/* async call */()).id).run/* async call */());
				}
			(await ctx.request.endWithData/* async call */(data));
			});}

CoreModule.Module.prototype.clientData = function (req, send) {var _c_this = this; var _c_root_method_arguments = arguments;
		return false;}

CoreModule.Module.prototype.spawn = function (config) {var _c_this = this; var _c_root_method_arguments = arguments;
		_c_this.baseConfig = config;
		_c_this.name = config["name"];
		_c_this.id = config["id"];}

CoreModule.Module.prototype.stop = function () {var _c_this = this; var _c_root_method_arguments = arguments;
}

CoreModule.Module.prototype.configure = function () {var _c_this = this; var _c_root_method_arguments = arguments;
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

CoreModule.Module.prototype.registerBucket = function (name) {var _c_this = this; var _c_root_method_arguments = arguments;
		var bucket = new Websom.Bucket(_c_this.server, name, _c_this.name);
		_c_this.registeredBuckets.push(bucket);
		_c_this.server.registerBucket(bucket);
		return bucket;}

CoreModule.Module.prototype.setupData = function () {var _c_this = this; var _c_root_method_arguments = arguments;
}

CoreModule.Module.prototype.setupBridge = function () {var _c_this = this; var _c_root_method_arguments = arguments;
}

CoreModule.Module.prototype.pullFromGlobalScope = function (name) {var _c_this = this; var _c_root_method_arguments = arguments;
		
			return global[name];
		}

CoreModule.Module.prototype.setupBridges = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		var bridges = [];
		return bridges;}

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
CoreModule.LokiCollection = function (database, name) {var _c_this = this;
	this.lokiCollection = null;

	this.database = null;

	this.appliedSchema = null;

	this.searchable = false;

	this.replicatedSearchFields = null;

	this.name = "";

	this.entityTemplate = null;

		_c_this.database = database;
		_c_this.name = name;
}

CoreModule.LokiCollection.prototype.lazilyGetCollection = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		
			if (!this.lokiCollection)
				this.lokiCollection = this.database.loki.getCollection(this.name);
		}

CoreModule.LokiCollection.prototype.makeDocumentFromMap = function (id, data) {var _c_this = this; var _c_root_method_arguments = arguments;
		var doc = new CoreModule.LokiDocument(_c_this, id);
		data["id"] = id;
		doc.rawData = data;
		return doc;}

/*i async*/CoreModule.LokiCollection.prototype.document = async function (id) {var _c_this = this; var _c_root_method_arguments = arguments;
		_c_this.lazilyGetCollection();
		var doc = null;
		
			doc = this.lokiCollection.get(id);
		
		if (doc == null) {
			return null;
			}
		return _c_this.documentFromRaw(doc);}

/*i async*/CoreModule.LokiCollection.prototype.getAll = async function (ids) {var _c_this = this; var _c_root_method_arguments = arguments;
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
		return outputs;}

/*i async*/CoreModule.LokiCollection.prototype.meta = async function (key) {var _c_this = this; var _c_root_method_arguments = arguments;
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
		return meta;}

CoreModule.LokiCollection.prototype.documentFromRaw = function (raw) {var _c_this = this; var _c_root_method_arguments = arguments;
		var idVal = raw["$loki"];
		var doc = new CoreModule.LokiDocument(_c_this, idVal.toString());
		raw["id"] = idVal.toString();
		doc.rawData = raw;
		return doc;}

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

/*i async*/CoreModule.LokiCollection.prototype.commitBatch = async function (query) {var _c_this = this; var _c_root_method_arguments = arguments;
/*async*/
		for (var u = 0; u < query.updates.length; u++) {
/*async*/
			(await _c_this.executeUpdate/* async call */(query.updates[u]));
			}
		var inserts = [];
		for (var i = 0; i < query.inserts.length; i++) {
/*async*/
			inserts.push((await _c_this.executeInsert/* async call */(query.inserts[i])));
			}}

/*i async*/CoreModule.LokiCollection.prototype.executeUpdate = async function (query) {var _c_this = this; var _c_root_method_arguments = arguments;
/*async*/
		_c_this.lazilyGetCollection();
		var docs = (await _c_this.executeSelect/* async call */(query)).documents;
		var updates = [];
		var keys = [];
		for (var k in query.sets) {
			keys.push(k);
			}
		
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

				updates.push(this.documentFromRaw(doc.rawData));
				this.lokiCollection.update(doc.rawData);
			}

			this.database.loki.saveDatabase(() => {
				if (this.database.server.config.verbose)
					console.log("Saved db");
			});
		
		if (_c_this.searchable) {
/*async*/
			(await _c_this.updateSearch/* async call */(updates, keys));
			}
		var res = new Websom.Adapters.Database.UpdateQueryResult(true, "");
		res.updateCount = docs.length;
		return res;}

/*i async*/CoreModule.LokiCollection.prototype.executeDelete = async function (query) {var _c_this = this; var _c_root_method_arguments = arguments;
/*async*/
		_c_this.lazilyGetCollection();
		var docs = (await _c_this.executeSelect/* async call */(query)).documents;
		var ids = [];
		for (var i = 0; i < docs.length; i++) {
/*async*/
			var doc = docs[i];
			ids.push(doc.id);
			
				this.lokiCollection.remove(doc.rawData);
			
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
				if (this.database.server.config.verbose)
					console.log("Saved db");
			});
		
		(await _c_this.deleteSearch/* async call */(ids));
		var results = new Websom.Adapters.Database.DeleteQueryResult(true, "");
		results.documents = docs;
		return results;}

/*i async*/CoreModule.LokiCollection.prototype.executeInsert = async function (query) {var _c_this = this; var _c_root_method_arguments = arguments;
/*async*/
		_c_this.lazilyGetCollection();
		var id = "";
		
			id = this.lokiCollection.insert(query.sets).$loki.toString();
			this.database.loki.saveDatabase(() => {
				if (this.database.server.config.verbose)
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
			(await _c_this.insertSearch/* async call */(doc));
			}
		var res = new Websom.Adapters.Database.InsertQueryResult(true, "", id);
		return res;}

/*i async*/CoreModule.LokiCollection.prototype.executeSelect = async function (query) {var _c_this = this; var _c_root_method_arguments = arguments;
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
					if (condition.operator == "==" && condition.field == "id") {
						qMap["$loki"] = {};
						qMap["$loki"]["$aeq"] = condition.value;
					}else if (condition.field == "id") {
						qMap["$loki"] = {};

						let val = condition.value;
						if (Array.isArray(val))
							val = val.map(a => parseInt(a));
						else
							val = parseInt(val);

						qMap["$loki"][ops[condition.operator]] = val;
					}else{
						if (!qMap[condition.field])
							qMap[condition.field] = {};
						
						qMap[condition.field][ops[condition.operator]] = condition.value;
					}
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
		
		return res;}

/*i async*/CoreModule.LokiCollection.prototype.makeEntity = async function (document) {var _c_this = this; var _c_root_method_arguments = arguments;
/*async*/
		var entity = null;
		
			entity = new this.entityTemplate();
		
		
		entity.collection = _c_this;
		entity.id = document.id;
		(await entity.loadFromMap/* async call */(document.data()));
		return entity;}

CoreModule.LokiCollection.prototype.enableSearching = function (fields) {var _c_this = this; var _c_root_method_arguments = arguments;
		_c_this.searchable = true;
		_c_this.replicatedSearchFields = fields;}

/*i async*/CoreModule.LokiCollection.prototype.insertSearch = async function (document) {var _c_this = this; var _c_root_method_arguments = arguments;
/*async*/
		if (_c_this.searchable) {
/*async*/
			if (_c_this.database.server.database.search != null) {
/*async*/
				(await _c_this.database.server.database.search.insertDocument/* async call */(document));
				}
			}}

/*i async*/CoreModule.LokiCollection.prototype.updateSearch = async function (documents, keys) {var _c_this = this; var _c_root_method_arguments = arguments;
/*async*/
		if (_c_this.searchable) {
/*async*/
			if (_c_this.database.server.database.search != null) {
/*async*/
				(await _c_this.database.server.database.search.updateDocuments/* async call */(documents, keys));
				}
			}}

/*i async*/CoreModule.LokiCollection.prototype.deleteSearch = async function (ids) {var _c_this = this; var _c_root_method_arguments = arguments;
/*async*/
		if (_c_this.searchable) {
/*async*/
			if (_c_this.database.server.database.search != null) {
/*async*/
				(await _c_this.database.server.database.search.deleteDocuments/* async call */(ids));
				}
			}}

CoreModule.LokiCollection.prototype.schema = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		_c_this.appliedSchema = new Websom.Adapters.Database.Schema(_c_this);
		return _c_this.appliedSchema;}

CoreModule.LokiCollection.prototype.insert = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		return new Websom.Adapters.Database.InsertQuery(_c_this);}

CoreModule.LokiCollection.prototype.select = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		return new Websom.Adapters.Database.SelectQuery(_c_this);}

CoreModule.LokiCollection.prototype.where = function (field, operator, value) {var _c_this = this; var _c_root_method_arguments = arguments;
		var q = _c_this.select();
		q.where(field, operator, value);
		return q;}

CoreModule.LokiCollection.prototype.update = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		return new Websom.Adapters.Database.UpdateQuery(_c_this);}

CoreModule.LokiCollection.prototype.delete = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		return new Websom.Adapters.Database.DeleteQuery(_c_this);}

CoreModule.LokiCollection.prototype.batch = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		return new Websom.Adapters.Database.BatchQuery(_c_this);}

CoreModule.LokiCollection.prototype.entity = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		var entity = null;
		
			entity = new this.entityTemplate();
		
		
		entity.collection = _c_this;
		return entity;}

/*i async*/CoreModule.LokiCollection.prototype.getEntity = async function (id) {var _c_this = this; var _c_root_method_arguments = arguments;
/*async*/
		var doc = (await _c_this.document/* async call */(id));
		if (doc == null) {
			return null;
			}
		return (await _c_this.makeEntity/* async call */(doc));}

CoreModule.LokiDB = function (server) {var _c_this = this;
	this.loki = null;

	this.route = "adapter.database.loki";

	this.server = null;

	this.adapterKey = "";

		_c_this.server = server;
}

/*i async*/CoreModule.LokiDB.prototype.initialize = async function () {var _c_this = this; var _c_root_method_arguments = arguments;
/*async*/
		if (_c_this.server.config.verbose) {
			console.log("Starting LokiDB");
			}
		(await _c_this.loadDB/* async call */());}

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
					if (this.server.config.verbose)
						console.log("Loaded loki db");
					_c_resolve(); return;
				}
			});
		
 }); }
}

CoreModule.LokiDB.prototype.stopLoki = function () {var _c_this = this; var _c_root_method_arguments = arguments;
	if (arguments.length == 0) { 
return new Promise((_c_resolve, _c_reject) => {		if (_c_this.server.config.verbose) {
			console.log("Saving loki DB");
			}
		
			this.loki.saveDatabase(() => {
				_c_resolve(); return;
			});
		
 }); }
}

/*i async*/CoreModule.LokiDB.prototype.shutdown = async function () {var _c_this = this; var _c_root_method_arguments = arguments;
/*async*/
		(await _c_this.stopLoki/* async call */());}

CoreModule.LokiDB.prototype.collection = function (name) {var _c_this = this; var _c_root_method_arguments = arguments;
		return new CoreModule.LokiCollection(_c_this, name);}

CoreModule.LokiDocument = function (collection, id) {var _c_this = this;
	this.rawData = null;

	this.collection = null;

	this.id = "";

		_c_this.collection = collection;
		_c_this.id = id;
}

CoreModule.LokiDocument.prototype.get = function (field) {var _c_this = this; var _c_root_method_arguments = arguments;
		return _c_this.rawData[field];}

CoreModule.LokiDocument.prototype.data = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		return _c_this.rawData;}

/*i async*/CoreModule.LokiDocument.prototype.calc = async function (field) {var _c_this = this; var _c_root_method_arguments = arguments;
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
			}}

CoreModule.MetaDocument = function (id) {var _c_this = this;
	this.raw = {};

	this.sets = {};

	this.collection = null;

	this.id = "";

		_c_this.id = id;
}

CoreModule.MetaDocument.prototype.incrementNumberField = function (index, value) {var _c_this = this; var _c_root_method_arguments = arguments;
		var curValue = _c_this.raw["number" + index];
		_c_this.sets["number" + index] = curValue + value;}

CoreModule.MetaDocument.prototype.setNumberField = function (index, value) {var _c_this = this; var _c_root_method_arguments = arguments;
		_c_this.sets["number" + index] = value;}

CoreModule.MetaDocument.prototype.numberField = function (index) {var _c_this = this; var _c_root_method_arguments = arguments;
		return _c_this.raw["number" + index];}

CoreModule.MetaDocument.prototype.setStringField = function (index, value) {var _c_this = this; var _c_root_method_arguments = arguments;
		_c_this.sets["string" + index] = value;}

CoreModule.MetaDocument.prototype.stringField = function (index) {var _c_this = this; var _c_root_method_arguments = arguments;
		return _c_this.raw["string" + index];}

CoreModule.MetaDocument.prototype.setArrayField = function (index, value) {var _c_this = this; var _c_root_method_arguments = arguments;
		_c_this.sets["array" + index] = value;}

CoreModule.MetaDocument.prototype.arrayField = function (index) {var _c_this = this; var _c_root_method_arguments = arguments;
		return _c_this.raw["array" + index];}

/*i async*/CoreModule.MetaDocument.prototype.update = async function () {var _c_this = this; var _c_root_method_arguments = arguments;
		
			for (let k in this.sets) {
				this.raw[k] = this.sets[k];
			}

			this.collection.lokiCollection.update(this.raw);
		}

CoreModule.FirestoreCollection = function (database, name) {var _c_this = this;
	this.firestoreCollection = null;

	this.database = null;

	this.appliedSchema = null;

	this.searchable = false;

	this.replicatedSearchFields = null;

	this.name = "";

	this.entityTemplate = null;

		_c_this.database = database;
		_c_this.name = name;
}

CoreModule.FirestoreCollection.prototype.lazilyGetCollection = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		
			if (!this.firestoreCollection)
				this.firestoreCollection = this.database.firestore.collection(this.name);
		}

CoreModule.FirestoreCollection.prototype.makeDocumentFromMap = function (id, data) {var _c_this = this; var _c_root_method_arguments = arguments;
		return _c_this.documentFromRaw(id, data);}

/*i async*/CoreModule.FirestoreCollection.prototype.document = async function (id) {var _c_this = this; var _c_root_method_arguments = arguments;
		_c_this.lazilyGetCollection();
		var doc = null;
		
			doc = (await this.firestoreCollection.doc(id).get()).data();
		
		if (doc == null) {
			return null;
			}
		return _c_this.documentFromRaw(id, doc);}

/*i async*/CoreModule.FirestoreCollection.prototype.getAll = async function (ids) {var _c_this = this; var _c_root_method_arguments = arguments;
		_c_this.lazilyGetCollection();
		var docs = null;
		
			docs = (await this.firestoreCollection.getAll(...(ids.map(id => this.firestoreCollection.doc(id)))));
		
		var outputs = [];
		for (var i = 0; i < docs.length; i++) {
			var doc = docs[i];
			
				outputs.push(this.documentFromRaw(doc.id, doc.data()));
			
			}
		return outputs;}

/*i async*/CoreModule.FirestoreCollection.prototype.meta = async function (key) {var _c_this = this; var _c_root_method_arguments = arguments;
		_c_this.lazilyGetCollection();
		var doc = null;
		
			doc = (await this.firestoreCollection.doc(key).get()).data();
		
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

				this.firestoreCollection.doc(key).set(doc);
			
			}
		var meta = new CoreModule.FirestoreMetaDocument(key);
		meta.raw = doc;
		meta.collection = _c_this;
		return meta;}

CoreModule.FirestoreCollection.prototype.documentFromRaw = function (id, raw) {var _c_this = this; var _c_root_method_arguments = arguments;
		var doc = new CoreModule.FirestoreDocument(_c_this, id);
		doc.rawData = raw;
		return doc;}

CoreModule.FirestoreCollection.prototype.registerSchema = function () {var _c_this = this; var _c_root_method_arguments = arguments;
	if (arguments.length == 1 && ((arguments[0] instanceof Websom.Adapters.Database.Schema) || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var schema = arguments[0];

	}
else 	if (arguments.length == 1 && ((arguments[0] instanceof Websom.Adapters.Database.Schema) || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var schema = arguments[0];

	}
}

/*i async*/CoreModule.FirestoreCollection.prototype.commitBatch = async function (query) {var _c_this = this; var _c_root_method_arguments = arguments;
		
			let transaction = this.database.firestore.runTransaction(async t => {
				for (let update of query.updates) {
					this.runUpdate(update, t);
				}

				let inserts = [];

				for (let insert of query.inserts) {
					inserts.push(this.runInsert(insert, t));
				}
			}).then((res) => {
				console.log(res);
				_c_resolve(); return;
			}).catch((err) => {
				console.log(err);
			});
		}

/*i async*/CoreModule.FirestoreCollection.prototype.executeUpdate = async function (query) {var _c_this = this; var _c_root_method_arguments = arguments;
/*async*/
		_c_this.lazilyGetCollection();
		return (await _c_this.runUpdate/* async call */(query, _c_this.firestoreCollection));}

/*i async*/CoreModule.FirestoreCollection.prototype.runUpdate = async function (query, ctx) {var _c_this = this; var _c_root_method_arguments = arguments;
/*async*/
		_c_this.lazilyGetCollection();
		var docs = (await _c_this.executeSelect/* async call */(query)).documents;
		var updates = [];
		var keys = [];
		for (var k in query.sets) {
			keys.push(k);
			}
		
			const firebase = require(require.resolve("firebase-admin", {
				paths: [
					this.database.server.config.configOverrides
				]
			}));

			for (let doc of docs) {
				let oldCopy = this.documentFromRaw(doc.id, Object.assign({}, doc.rawData));

				for (let k in query.sets) {
					if (query.sets.hasOwnProperty(k)) {
						doc.rawData[k] = query.sets[k];
					}
				}

				for (let k in query.increments) {
					if (query.hasOwnProperty(k)) {
						doc.rawData[k] = firebase.firestore.FieldValue.increment(query.increments[k]);
					}
				}

				if (this.appliedSchema != null) {
					for (let i in this.appliedSchema.calculators) {
						let calc = this.appliedSchema.calculators[i];

						await calc.update(oldCopy, doc, this);
					}
				}

				if (this.searchable) {
					await ctx.doc(doc.id).set(doc.rawData);
					let newData = await ctx.doc(doc.id).get();

					updates.push(this.documentFromRaw(doc.id, newData.data()));
				}else{
					ctx.doc(doc.id).set(doc.rawData);
				}
			}
		
		if (_c_this.searchable) {
/*async*/
			(await _c_this.updateSearch/* async call */(updates, keys));
			}
		var res = new Websom.Adapters.Database.UpdateQueryResult(true, "");
		res.updateCount = docs.length;
		return res;}

/*i async*/CoreModule.FirestoreCollection.prototype.executeDelete = async function (query) {var _c_this = this; var _c_root_method_arguments = arguments;
/*async*/
		_c_this.lazilyGetCollection();
		var docs = (await _c_this.executeSelect/* async call */(query)).documents;
		var ids = [];
		for (var i = 0; i < docs.length; i++) {
/*async*/
			var doc = docs[i];
			ids.push(doc.id);
			
				await this.firestoreCollection.doc(doc.id).delete();
			
			if (_c_this.appliedSchema != null) {
/*async*/
				for (var j = 0; j < _c_this.appliedSchema.calculators.length; j++) {
/*async*/
					var calc = _c_this.appliedSchema.calculators[j];
					(await calc.delete/* async call */(doc, _c_this));
					}
				}
			}
		(await _c_this.deleteSearch/* async call */(ids));
		var results = new Websom.Adapters.Database.DeleteQueryResult(true, "");
		results.documents = docs;
		return results;}

/*i async*/CoreModule.FirestoreCollection.prototype.executeInsert = async function (query) {var _c_this = this; var _c_root_method_arguments = arguments;
/*async*/
		_c_this.lazilyGetCollection();
		return (await _c_this.runInsert/* async call */(query, _c_this.firestoreCollection));}

/*i async*/CoreModule.FirestoreCollection.prototype.runInsert = async function (query, ctx) {var _c_this = this; var _c_root_method_arguments = arguments;
/*async*/
		_c_this.lazilyGetCollection();
		var id = "";
		
			let newDoc = ctx.doc();
			id = newDoc.id;
			newDoc.set(query.sets);
		
		if (_c_this.appliedSchema != null) {
/*async*/
			var doc = _c_this.documentFromRaw(id, query.sets);
			for (var i = 0; i < _c_this.appliedSchema.calculators.length; i++) {
/*async*/
				var calc = _c_this.appliedSchema.calculators[i];
				(await calc.insert/* async call */(doc, _c_this));
				}
			(await _c_this.insertSearch/* async call */(doc));
			}
		var res = new Websom.Adapters.Database.InsertQueryResult(true, "", id);
		return res;}

/*i async*/CoreModule.FirestoreCollection.prototype.executeSelect = async function (query) {var _c_this = this; var _c_root_method_arguments = arguments;
		_c_this.lazilyGetCollection();
		var res = new Websom.Adapters.Database.SelectQueryResult(true, "");
		
			const firebase = require(require.resolve("firebase-admin", {
				paths: [
					this.database.server.config.configOverrides
				]
			}));

			let ops = {
				">": ">",
				">=": ">=",
				"<": "<",
				"<=": "<=",
				"==": "==",
				"in": "in",
				"contains": "array-contains",
				"contains-any": "array-contains-any"
			};

			let fsQuery = this.firestoreCollection;

			let orderByField = "";
			let orderByOrder = "asc";
			let didOrderBy = false;

			for (let condition of query.conditions) {
				if (condition.type == "where") {
					let f = condition.field;
					if (condition.field == "id")
						f = firebase.firestore.FieldPath.documentId();

					fsQuery = fsQuery.where(f, ops[condition.operator], condition.value);
				}else if (condition.type == "order") {
					didOrderBy = true;
					fsQuery = fsQuery.orderBy(condition.field, ({dsc: "desc", asc: "asc"})[condition.operator]);
				}
			}

			if (query.documentStart != 0)
				fsQuery = fsQuery.startAt(query.documentStart);
				
			let rawResults = await fsQuery.limit(query.documentLimit).get();

			rawResults.forEach(doc => 
				res.documents.push(this.documentFromRaw(doc.id, doc.data())));
		
		return res;}

/*i async*/CoreModule.FirestoreCollection.prototype.makeEntity = async function (document) {var _c_this = this; var _c_root_method_arguments = arguments;
/*async*/
		var entity = null;
		
			entity = new this.entityTemplate();
		
		
		entity.collection = _c_this;
		entity.id = document.id;
		(await entity.loadFromMap/* async call */(document.data()));
		return entity;}

CoreModule.FirestoreCollection.prototype.enableSearching = function (fields) {var _c_this = this; var _c_root_method_arguments = arguments;
		_c_this.searchable = true;
		_c_this.replicatedSearchFields = fields;}

/*i async*/CoreModule.FirestoreCollection.prototype.insertSearch = async function (document) {var _c_this = this; var _c_root_method_arguments = arguments;
/*async*/
		if (_c_this.searchable) {
/*async*/
			if (_c_this.database.server.database.search != null) {
/*async*/
				(await _c_this.database.server.database.search.insertDocument/* async call */(document));
				}
			}}

/*i async*/CoreModule.FirestoreCollection.prototype.updateSearch = async function (documents, keys) {var _c_this = this; var _c_root_method_arguments = arguments;
/*async*/
		if (_c_this.searchable) {
/*async*/
			if (_c_this.database.server.database.search != null) {
/*async*/
				(await _c_this.database.server.database.search.updateDocuments/* async call */(documents, keys));
				}
			}}

/*i async*/CoreModule.FirestoreCollection.prototype.deleteSearch = async function (ids) {var _c_this = this; var _c_root_method_arguments = arguments;
/*async*/
		if (_c_this.searchable) {
/*async*/
			if (_c_this.database.server.database.search != null) {
/*async*/
				(await _c_this.database.server.database.search.deleteDocuments/* async call */(ids));
				}
			}}

CoreModule.FirestoreCollection.prototype.schema = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		_c_this.appliedSchema = new Websom.Adapters.Database.Schema(_c_this);
		return _c_this.appliedSchema;}

CoreModule.FirestoreCollection.prototype.insert = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		return new Websom.Adapters.Database.InsertQuery(_c_this);}

CoreModule.FirestoreCollection.prototype.select = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		return new Websom.Adapters.Database.SelectQuery(_c_this);}

CoreModule.FirestoreCollection.prototype.where = function (field, operator, value) {var _c_this = this; var _c_root_method_arguments = arguments;
		var q = _c_this.select();
		q.where(field, operator, value);
		return q;}

CoreModule.FirestoreCollection.prototype.update = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		return new Websom.Adapters.Database.UpdateQuery(_c_this);}

CoreModule.FirestoreCollection.prototype.delete = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		return new Websom.Adapters.Database.DeleteQuery(_c_this);}

CoreModule.FirestoreCollection.prototype.batch = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		return new Websom.Adapters.Database.BatchQuery(_c_this);}

CoreModule.FirestoreCollection.prototype.entity = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		var entity = null;
		
			entity = new this.entityTemplate();
		
		
		entity.collection = _c_this;
		return entity;}

/*i async*/CoreModule.FirestoreCollection.prototype.getEntity = async function (id) {var _c_this = this; var _c_root_method_arguments = arguments;
/*async*/
		var doc = (await _c_this.document/* async call */(id));
		if (doc == null) {
			return null;
			}
		return (await _c_this.makeEntity/* async call */(doc));}

CoreModule.Firestore = function (server) {var _c_this = this;
	this.firestore = null;

	this.route = "adapter.database.firestore";

	this.server = null;

	this.adapterKey = "";

		_c_this.server = server;
}

/*i async*/CoreModule.Firestore.prototype.initialize = async function () {var _c_this = this; var _c_root_method_arguments = arguments;
/*async*/
		(await _c_this.loadDB/* async call */());}

/*i async*/CoreModule.Firestore.prototype.loadDB = async function () {var _c_this = this; var _c_root_method_arguments = arguments;
		
			const admin = require(require.resolve("firebase-admin", {
				paths: [
					this.server.config.configOverrides
				]
			}));
			
			const path = require("path");

			if (!!process.env.GCP_PROJECT) {
				const functions = require("firebase-functions");

				try {
					admin.initializeApp(functions.config().firebase);
				} catch (e) {

				}

			}else{
				let serviceAccount = require(path.resolve(this.server.config.configOverrides, this.server.getConfigString(this.route, "credentials")));

				try {
					admin.initializeApp({
						credential: admin.credential.cert(serviceAccount)
					});
				} catch (e) {

				}
			}
			
			this.firestore = admin.firestore();
			
			try {
				this.firestore.settings({
					timestampsInSnapshots: true
				});
			} catch (e) {

			}
		}

/*i async*/CoreModule.Firestore.prototype.shutdown = async function () {var _c_this = this; var _c_root_method_arguments = arguments;
}

CoreModule.Firestore.prototype.collection = function (name) {var _c_this = this; var _c_root_method_arguments = arguments;
		return new CoreModule.FirestoreCollection(_c_this, name);}

CoreModule.FirestoreDocument = function (collection, id) {var _c_this = this;
	this.rawData = null;

	this.collection = null;

	this.id = "";

		_c_this.collection = collection;
		_c_this.id = id;
}

CoreModule.FirestoreDocument.prototype.get = function (field) {var _c_this = this; var _c_root_method_arguments = arguments;
		if (field == "id") {
			return _c_this.id;
			}
		return _c_this.rawData[field];}

CoreModule.FirestoreDocument.prototype.data = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		return _c_this.rawData;}

/*i async*/CoreModule.FirestoreDocument.prototype.calc = async function (field) {var _c_this = this; var _c_root_method_arguments = arguments;
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
			}}

CoreModule.FirestoreMetaDocument = function (id) {var _c_this = this;
	this.raw = {};

	this.sets = {};

	this.collection = null;

	this.id = "";

		_c_this.id = id;
}

CoreModule.FirestoreMetaDocument.prototype.incrementNumberField = function (index, value) {var _c_this = this; var _c_root_method_arguments = arguments;
		var curValue = _c_this.raw["number" + index];
		
			const firebase = require(require.resolve("firebase-admin", {
				paths: [
					this.collection.database.server.config.configOverrides
				]
			}));

			this.sets["number" + index] = firebase.firestore.FieldValue.increment(value);
		}

CoreModule.FirestoreMetaDocument.prototype.setNumberField = function (index, value) {var _c_this = this; var _c_root_method_arguments = arguments;
		_c_this.sets["number" + index] = value;}

CoreModule.FirestoreMetaDocument.prototype.numberField = function (index) {var _c_this = this; var _c_root_method_arguments = arguments;
		return _c_this.raw["number" + index];}

CoreModule.FirestoreMetaDocument.prototype.setStringField = function (index, value) {var _c_this = this; var _c_root_method_arguments = arguments;
		_c_this.sets["string" + index] = value;}

CoreModule.FirestoreMetaDocument.prototype.stringField = function (index) {var _c_this = this; var _c_root_method_arguments = arguments;
		return _c_this.raw["string" + index];}

CoreModule.FirestoreMetaDocument.prototype.setArrayField = function (index, value) {var _c_this = this; var _c_root_method_arguments = arguments;
		_c_this.sets["array" + index] = value;}

CoreModule.FirestoreMetaDocument.prototype.arrayField = function (index) {var _c_this = this; var _c_root_method_arguments = arguments;
		return _c_this.raw["array" + index];}

/*i async*/CoreModule.FirestoreMetaDocument.prototype.update = async function () {var _c_this = this; var _c_root_method_arguments = arguments;
		
			for (let k in this.sets) {
				this.raw[k] = this.sets[k];
			}

			this.collection.firestoreCollection.doc(this.id).set(this.raw);
		}

CoreModule.SendGrid = function (server) {var _c_this = this;
	this.sendGrid = null;

	this.route = "adapter.email.sendGrid";

	this.server = null;

	this.adapterKey = "";

		_c_this.server = server;
}

/*i async*/CoreModule.SendGrid.prototype.initialize = async function () {var _c_this = this; var _c_root_method_arguments = arguments;
}

CoreModule.SendGrid.prototype.loadSendGrid = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		
			if (!this.sendGrid) {
				this.sendGrid = require("@sendgrid/mail");
				this.sendGrid.setApiKey(this.server.getConfigString(this.route, "apiKey"));
			}
		}

/*i async*/CoreModule.SendGrid.prototype.send = async function (email) {var _c_this = this; var _c_root_method_arguments = arguments;
		_c_this.loadSendGrid();
		
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
				this.server.logException(e);
				return new Websom.Adapters.Email.SendResults("error", e.toString(), 0);
			}
		}

CoreModule.SendGrid.prototype.email = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		return new Websom.Adapters.Email.Email(_c_this);}

CoreModule.SendGrid.prototype.template = function (title) {var _c_this = this; var _c_root_method_arguments = arguments;
		return new Websom.Adapters.Email.EmailTemplate(_c_this, title);}

/*i async*/CoreModule.SendGrid.prototype.shutdown = async function () {var _c_this = this; var _c_root_method_arguments = arguments;
}

CoreModule.Confirmation = function (server) {var _c_this = this;
	this.route = "adapter.confirmation";

	this.module = null;

	this.handlers = [];

	this.server = null;

	this.adapterKey = "";

		_c_this.server = server;
}

CoreModule.Confirmation.prototype.registerCollection = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		_c_this.server.api.route("/confirmations/confirm").input("secret").type("string").limit(500, 512).executes(async function (ctx) {
/*async*/
			var res = (await _c_this.module.confirmations.where("secret", "==", ctx.get("secret")).get/* async call */());
			if (res.documents.length == 0) {
/*async*/
				(await ctx.request.endWithError/* async call */("Invalid secret"));
				return null;
				}
			var doc = res.documents[0];
			var expires = doc.get("expires");
			if (Websom.Time.now() > expires) {
/*async*/
				(await ctx.request.endWithError/* async call */("Confirmation expired"));
				return null;
				}
			if (doc.get("confirmed")) {
/*async*/
				(await ctx.request.endWithError/* async call */("Confirmation already used"));
				return null;
				}
			for (var i = 0; i < _c_this.handlers.length; i++) {
/*async*/
				var handler = _c_this.handlers[i];
				if (handler.key == doc.get("key")) {
/*async*/
					var confirmationExec = new Websom.Adapters.Confirmation.Execution(ctx.request, doc.get("key"), Websom.Json.parse(doc.get("storage")));
					if (ctx.request.body["params"]) {
						confirmationExec.params = ctx.request.body["params"];
						}
					handler.handler(confirmationExec);
					if (ctx.request.sent == false) {
/*async*/
						(await _c_this.module.confirmations.update().where("id", "==", doc.get("id")).set("confirmed", true).run/* async call */());
						}
					}
				}
			(await ctx.request.endWithSuccess/* async call */("Success"));
			});}

/*i async*/CoreModule.Confirmation.prototype.dispatch = async function () {var _c_this = this; var _c_root_method_arguments = arguments;
	if (arguments.length == 1 && ((arguments[0] instanceof Websom.Adapters.Confirmation.Confirmation) || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var confirmation = arguments[0];
/*async*/
		var secret = (await _c_this.server.crypto.getRandomHex/* async call */(255));
		var url = _c_this.server.clientHost + "/confirmations/confirm/" + confirmation.key + "/" + secret;
		var results = new Websom.Adapters.Confirmation.ConfirmationResults(secret, url, "success", "Confirmation created");
		(await _c_this.module.confirmations.insert().set("secret", secret).set("key", confirmation.key).set("ip", confirmation.ip).set("created", Websom.Time.now()).set("storage", Websom.Json.encode(confirmation.storage)).set("expires", Websom.Time.now() + confirmation.ttl).set("confirmed", false).set("service", confirmation.notificationService).set("method", confirmation.method).set("to", confirmation.recipient).run/* async call */());
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

/*i async*/CoreModule.Confirmation.prototype.sendLinkEmail = async function (url, confirmation) {var _c_this = this; var _c_root_method_arguments = arguments;
/*async*/
		var from = _c_this.server.getConfigString("adapter.core.confirmation", "fromEmail");
		if (from == "") {
			from = "no-reply@example.com";
			}
		(await _c_this.server.notification.email.template("confirmation").row().column().column().paragraph(confirmation.confirmationMessage).button("Confirm", url).column().email().setTextBody("Click here to confirm your email address: " + url).addRecipient(confirmation.recipient).setFrom(from, _c_this.server.websiteName).setSubject(confirmation.emailSubject).send/* async call */());}

CoreModule.Confirmation.prototype.confirm = function (key) {var _c_this = this; var _c_root_method_arguments = arguments;
		return new Websom.Adapters.Confirmation.Confirmation(_c_this, key);}

CoreModule.Confirmation.prototype.handleConfirmation = function (key, handler) {var _c_this = this; var _c_root_method_arguments = arguments;
		_c_this.handlers.push(new Websom.Adapters.Confirmation.Handler(key, handler));}

/*i async*/CoreModule.Confirmation.prototype.initialize = async function () {var _c_this = this; var _c_root_method_arguments = arguments;
}

/*i async*/CoreModule.Confirmation.prototype.shutdown = async function () {var _c_this = this; var _c_root_method_arguments = arguments;
}

CoreModule.FileSystemBucket = function (server) {var _c_this = this;
	this.coreModule = null;

	this.server = null;

	this.adapterKey = "";

		_c_this.server = server;
}

/*i async*/CoreModule.FileSystemBucket.prototype.initialize = async function () {var _c_this = this; var _c_root_method_arguments = arguments;
		_c_this.coreModule = _c_this.server.module.getModule("coreModule");
		_c_this.server.api.route("/objects/upload/:token", async function (req) {
/*async*/
			var splits = req.path.split("/");
			if (splits.length == 4) {
/*async*/
				var token = splits[3];
				if (token.length != 256) {
/*async*/
					(await req.endWithError/* async call */("Invalid token"));
					return null;
					}
				(await _c_this.handleUpload/* async call */(req, token));
				}else{
/*async*/
					(await req.endWithError/* async call */("Invalid path"));
				}
			});
		_c_this.server.api.get("/buckets/*", async function (req) {
/*async*/
			var splits = req.path.split("/");
			if (splits.length < 4) {
/*async*/
				(await req.endWithError/* async call */("Invalid filename"));
				return null;
				}
			var bucket = splits[2];
			var filename = splits.slice(3, splits.length).join("/");
			filename = filename.replace(new RegExp("../".replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&'), 'g'), "");
			var realFile = _c_this.server.config.devBuckets + "/" + bucket + "/" + filename;
			var name = splits[splits.length - 1];
			if (Oxygen.FileSystem.exists(realFile)) {
				req.serve(realFile);
				}else{
/*async*/
					(await req.endWithError/* async call */("Unknown file " + name));
				}
			});}

/*i async*/CoreModule.FileSystemBucket.prototype.handleUpload = async function (req, token) {var _c_this = this; var _c_root_method_arguments = arguments;
/*async*/
		var objects = (await _c_this.coreModule.objects.where("token", "==", token).get/* async call */());
		if (objects.documents.length == 1) {
/*async*/
			var obj = objects.documents[0];
			if (obj.get("uploaded") == true) {
/*async*/
				(await req.endWithError/* async call */("Object already uploaded"));
				return null;
				}
			var objectPath = _c_this.server.config.devBuckets + "/" + obj.get("bucket") + "/" + obj.get("filename");
			if (req.files["upload"] != null) {
/*async*/
				Oxygen.FileSystem.writeSync(objectPath, Oxygen.FileSystem.readSync(req.files["upload"], null));
				(await _c_this.coreModule.objects.update().where("id", "==", obj.get("id")).set("uploaded", true).run/* async call */());
				(await req.endWithSuccess/* async call */("Uploaded"));
				}else{
/*async*/
					(await req.endWithError/* async call */("Invalid payload"));
				}
			}else{
/*async*/
				(await req.endWithError/* async call */("Invalid token"));
			}}

/*i async*/CoreModule.FileSystemBucket.prototype.generateUploadURL = async function (upload) {var _c_this = this; var _c_root_method_arguments = arguments;
/*async*/
		var token = (await _c_this.server.crypto.getRandomHex/* async call */(256 / 2));
		(await _c_this.coreModule.objects.insert().set("filename", upload.filename).set("bucket", upload.bucket.name).set("acl", upload.acl).set("uploaded", false).set("token", token).set("sizeLimit", upload.fileSizeLimit).run/* async call */());
		return _c_this.server.apiHost + "/objects/upload/" + token;}

/*i async*/CoreModule.FileSystemBucket.prototype.deleteObject = async function (bucket, filename) {var _c_this = this; var _c_root_method_arguments = arguments;
		var bucketPath = _c_this.server.config.devBuckets + "/" + bucket.name;
		Oxygen.FileSystem.unlink(bucketPath + "/" + filename);}

/*i async*/CoreModule.FileSystemBucket.prototype.createDirectory = async function (bucket, path) {var _c_this = this; var _c_root_method_arguments = arguments;
		var bucketPath = _c_this.server.config.devBuckets + "/" + bucket.name;
		if (Oxygen.FileSystem.exists(bucketPath + "/" + path) == false) {
			Oxygen.FileSystem.makeDir(bucketPath + "/" + path);
			}}

/*i async*/CoreModule.FileSystemBucket.prototype.setObjectACL = async function (bucket, filename, acl) {var _c_this = this; var _c_root_method_arguments = arguments;
/*async*/
		(await _c_this.coreModule.objects.update().where("filename", "==", filename).set("acl", acl).run/* async call */());}

CoreModule.FileSystemBucket.prototype.registerBucket = function (bucket) {var _c_this = this; var _c_root_method_arguments = arguments;
		if (Oxygen.FileSystem.exists(_c_this.server.config.devBuckets + "/" + bucket.name) == false) {
			Oxygen.FileSystem.makeDir(_c_this.server.config.devBuckets + "/" + bucket.name);
			}}

/*i async*/CoreModule.FileSystemBucket.prototype.serve = async function (bucket, filename) {var _c_this = this; var _c_root_method_arguments = arguments;
		return _c_this.server.apiHost + "/buckets/" + bucket.name + "/" + filename;}

/*i async*/CoreModule.FileSystemBucket.prototype.shutdown = async function () {var _c_this = this; var _c_root_method_arguments = arguments;
}

CoreModule.Algolia = function (server) {var _c_this = this;
	this.firestore = null;

	this.route = "adapter.search.algolia";

	this.server = null;

	this.adapterKey = "";

		_c_this.server = server;
}

/*i async*/CoreModule.Algolia.prototype.initialize = async function () {var _c_this = this; var _c_root_method_arguments = arguments;
}

/*i async*/CoreModule.Algolia.prototype.shutdown = async function () {var _c_this = this; var _c_root_method_arguments = arguments;
}

CoreModule.Algolia.prototype.getAlgoliaIndex = function (collection) {var _c_this = this; var _c_root_method_arguments = arguments;
		
			const algoliasearch = require("algoliasearch");
			const client = algoliasearch(
				this.server.configService.getString("adapter.search.algolia", "applicationID"),
				this.server.configService.getString("adapter.search.algolia", "adminAPIKey")
			);

			return client.initIndex(collection.name);
		}

CoreModule.Algolia.prototype.initializeCollection = function () {var _c_this = this; var _c_root_method_arguments = arguments;
	if (arguments.length == 1 && ((arguments[0] instanceof Websom.Adapters.Database.Collection || (arguments[0] instanceof CoreModule.LokiCollection) || (arguments[0] instanceof CoreModule.FirestoreCollection)) || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var collection = arguments[0];

	}
else 	if (arguments.length == 1 && ((arguments[0] instanceof Websom.Adapters.Database.Collection || (arguments[0] instanceof CoreModule.LokiCollection) || (arguments[0] instanceof CoreModule.FirestoreCollection)) || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var collection = arguments[0];

	}
}

/*i async*/CoreModule.Algolia.prototype.insertDocument = async function (document) {var _c_this = this; var _c_root_method_arguments = arguments;
		
			let index = this.getAlgoliaIndex(document.collection);

			let data = {
				objectID: document.id
			};

			for (let field of document.collection.replicatedSearchFields)
				data[field] = document.get(field);

			await index.saveObject(data);
		}

/*i async*/CoreModule.Algolia.prototype.updateDocuments = async function (documents, keys) {var _c_this = this; var _c_root_method_arguments = arguments;
		
			let index = this.getAlgoliaIndex(document.collection);

			let docs = documents.map(doc => {
				let data = {
					objectID: doc.id
				};

				for (let field of document.collection.replicatedSearchFields)
					if (keys.includes(field))
						data[field] = document.get(field);
					
				return data;
			});

			await index.partialUpdateObjects(docs);
		}

/*i async*/CoreModule.Algolia.prototype.deleteDocuments = async function (ids) {var _c_this = this; var _c_root_method_arguments = arguments;
		
			let index = this.getAlgoliaIndex(document.collection);

			await index.deleteObjects(ids);
		}

/*i async*/CoreModule.Algolia.prototype.search = async function (collection, query) {var _c_this = this; var _c_root_method_arguments = arguments;
		var qr = new Websom.Adapters.Search.QueryResult(false, "Success");
		
			let index = this.getAlgoliaIndex(document.collection);

			let res = await index.search(query.query, {
				page: query.page,
				hitsPerPage: query.perPage
			});

			let ids = res.hits.map(h => h.objectID);
			let docs = res.hits.map(h => collection.makeDocumentFromMap(h.objectID, h));

			qr.pages = res.nbPages;
			qr.documentsPerPage = res.hitsPerPage;
			qr.ids = ids;
			qr.unsafeDocuments = docs;
		
		return qr;}


module.exports = CoreModule.Module;