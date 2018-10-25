//Relative Module
//Relative Tab
//Relative Module
//Relative User
//Relative Confirmation
//Relative UserControl
//Relative Group
//Relative Admission
//Relative RichText
//Relative RichTextControl
//Relative Likes
//Relative Comments
//Relative Comment
//Relative Image
//Relative ImageControl
CoreModule = function () {


}

CoreModule.Module = function () {
	this.server = null;

	this.baseConfig = null;

	this.containers = [];

	this.bridges = [];

	this.name = "";

	this.id = "";

	this.root = "";

	this.version = "";

	this.author = "";

	this.license = "";

	this.repo = "";

	if (arguments.length == 1 && ((arguments[0] instanceof Websom.Server) || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var server = arguments[0];
		this.server = server;
	}

}

CoreModule.Module.prototype.start = function () {
	if (arguments.length == 0) {

	}
}

CoreModule.Module.prototype.clientData = function () {
	if (arguments.length == 2 && ((arguments[0] instanceof Websom.Request) || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'function' || typeof arguments[1] == 'undefined' || arguments[1] === null)) {
		var req = arguments[0];
		var send = arguments[1];
		return false;
	}
}

CoreModule.Module.prototype.spawn = function () {
	if (arguments.length == 1 && (typeof arguments[0] == 'object' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var config = arguments[0];
		this.baseConfig = config;
		this.name = config["name"];
		this.id = config["id"];
	}
}

CoreModule.Module.prototype.stop = function () {
	if (arguments.length == 0) {

	}
}

CoreModule.Module.prototype.setupData = function () {
	if (arguments.length == 0) {

	}
}

CoreModule.Module.prototype.setupBridge = function () {
	if (arguments.length == 0) {

	}
}

CoreModule.Module.prototype.setupBridges = function () {
	if (arguments.length == 0) {
		var bridges = [];
		return bridges;
	}
}

//Relative Carbon
//Relative Context
//Relative Error
//Relative FileSystem
//Relative File
//Relative Stat
//Relative Buffer
//Relative primitive
//Relative object
//Relative array
//Relative bool
//Relative byte
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
Websom.Standard.RichText = function () {
	this.type = "";

	this.content = "";

	this.websomFieldInfo = null;

	this.websomParentData = null;

	this.websomContainer = null;

	this.websomServer = null;

	if (arguments.length == 1 && ((arguments[0] instanceof Websom.Server) || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var server = arguments[0];
		this.websomServer = server;
	}

}

Websom.Standard.RichText.prototype.read = function () {
	if (arguments.length == 1 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var value = arguments[0];
		this.type = value[0];
		this.content = value.substr(1,value.length - 1);
	}
}

Websom.Standard.RichText.prototype.exposeToClient = function () {
	if (arguments.length == 0) {
		return this.type + this.content;
	}
}

Websom.Standard.RichText.prototype.write = function () {
	if (arguments.length == 0) {
		return this.type + this.content;
	}
}

Websom.Standard.RichText.prototype.callLoadFromMap = function () {
	if (arguments.length == 2 && (typeof arguments[0] == 'object' || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'function' || typeof arguments[1] == 'undefined' || arguments[1] === null)) {
		var raw = arguments[0];
		var callback = arguments[1];
		
			return this.loadFromMap(raw, callback);
		
		
	}
else 	if (arguments.length == 2 && (typeof arguments[0] == 'object' || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'function' || typeof arguments[1] == 'undefined' || arguments[1] === null)) {
		var raw = arguments[0];
		var callback = arguments[1];
		
			return this.loadFromMap(raw, callback);
		
		
	}
}

Websom.Standard.RichText.prototype.setField = function (name, value) {
		
			this[name] = value;
		
		}

Websom.Standard.RichText.getDataInfo = function () {
	if (arguments.length == 0) {
		
			return this.getInfo();
		
		
	}
else 	if (arguments.length == 0) {
		
			return this.getInfo();
		
		
	}
}

Websom.Standard.RichText.spawnFromId = function () {
	if (arguments.length == 4 && ((arguments[0] instanceof Websom.Server) || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'string' || typeof arguments[1] == 'undefined' || arguments[1] === null) && ((arguments[2]instanceof Array || typeof arguments[2] == 'boolean' || typeof arguments[2] == 'number' || typeof arguments[2] == 'number' || typeof arguments[2] == 'object' || typeof arguments[2] == 'string') || typeof arguments[2] == 'undefined' || arguments[2] === null) && (typeof arguments[3] == 'function' || typeof arguments[3] == 'undefined' || arguments[3] === null)) {
		var server = arguments[0];
		var table = arguments[1];
		var id = arguments[2];
		var done = arguments[3];
		var dataInfo = null;
		
			dataInfo = this.getInfo();
		
		
		var container = new Websom.Containers.Table(server, table, dataInfo);
		var data = dataInfo.spawn(server);
		data.websomContainer = container;
		data.loadFromId(container, id, function (err) {
			done(err, data);
			});
	}
}

Websom.Standard.RichText.prototype.getContainer = function () {
	if (arguments.length == 1 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var realFieldName = arguments[0];
		var info = this.fetchFieldInfo();
		for (var i = 0; i < info.fields.length; i++) {
			var field = info.fields[i];
			if (field.realName == realFieldName) {
				var thisTable = this.websomContainer;
				if (field.structure.hasFlag("linked")) {
					var linked = field.structure.getFlag("linked");
					var typeInfo = Websom.DataInfo.getDataInfoFromRoute(linked.fieldType);
					return new Websom.Containers.Table(this.websomServer, thisTable.table + "_" + field.fieldName, typeInfo);
					}
				}
			}
		return null;
	}
}

Websom.Standard.RichText.prototype.onInputInterface = function () {
	if (arguments.length == 4 && ((arguments[0] instanceof Websom.Input) || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'string' || typeof arguments[1] == 'undefined' || arguments[1] === null) && (typeof arguments[2] == 'object' || typeof arguments[2] == 'undefined' || arguments[2] === null) && (typeof arguments[3] == 'function' || typeof arguments[3] == 'undefined' || arguments[3] === null)) {
		var input = arguments[0];
		var route = arguments[1];
		var data = arguments[2];
		var respond = arguments[3];
		
			if (this.onInputInterfaceAuto)
				this.onInputInterfaceAuto(input, route, data, respond);
			else
				respond(null);
		
		
	}
}

Websom.Standard.RichText.prototype.getField = function () {
	if (arguments.length == 1 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var name = arguments[0];
		
			return this[name];
		
		
	}
}

Websom.Standard.RichText.prototype.getPublicId = function () {
	if (arguments.length == 0) {
		return this.getField("publicId");
	}
}

Websom.Standard.RichText.prototype.fromPrimary = function () {
	if (arguments.length == 2 && ((arguments[0]instanceof Array || typeof arguments[0] == 'boolean' || typeof arguments[0] == 'number' || typeof arguments[0] == 'number' || typeof arguments[0] == 'object' || typeof arguments[0] == 'string') || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'function' || typeof arguments[1] == 'undefined' || arguments[1] === null)) {
		var key = arguments[0];
		var done = arguments[1];

	}
}

Websom.Standard.RichText.prototype.loadFromPublicKey = function () {
	if (arguments.length == 3 && ((arguments[0] instanceof Websom.Containers.Table) || typeof arguments[0] == 'undefined' || arguments[0] === null) && ((arguments[1]instanceof Array || typeof arguments[1] == 'boolean' || typeof arguments[1] == 'number' || typeof arguments[1] == 'number' || typeof arguments[1] == 'object' || typeof arguments[1] == 'string') || typeof arguments[1] == 'undefined' || arguments[1] === null) && (typeof arguments[2] == 'function' || typeof arguments[2] == 'undefined' || arguments[2] === null)) {
		var parent = arguments[0];
		var key = arguments[1];
		var done = arguments[2];
		var that = this;
		that.websomContainer = parent;
		parent.server.database.primary.from(parent.table).where("publicId").equals(key).run(function (err, res) {
			if (res.length == 0) {
				done("No data found");
				}else{
					that.callLoadFromMap(res[0], done);
				}
			});
	}
}

Websom.Standard.RichText.prototype.loadFromId = function () {
	if (arguments.length == 3 && ((arguments[0] instanceof Websom.Containers.Table) || typeof arguments[0] == 'undefined' || arguments[0] === null) && ((arguments[1]instanceof Array || typeof arguments[1] == 'boolean' || typeof arguments[1] == 'number' || typeof arguments[1] == 'number' || typeof arguments[1] == 'object' || typeof arguments[1] == 'string') || typeof arguments[1] == 'undefined' || arguments[1] === null) && (typeof arguments[2] == 'function' || typeof arguments[2] == 'undefined' || arguments[2] === null)) {
		var parent = arguments[0];
		var id = arguments[1];
		var done = arguments[2];
		var that = this;
		that.websomContainer = parent;
		parent.server.database.primary.from(parent.table).where("id").equals(id).run(function (err, res) {
			if (res.length == 0) {
				done("No data found");
				}else{
					that.callLoadFromMap(res[0], done);
				}
			});
	}
}

Websom.Standard.RichText.registerInterfaces = function () {
	if (arguments.length == 3 && ((arguments[0] instanceof Websom.Container || (arguments[0] instanceof Websom.Containers.Table)) || typeof arguments[0] == 'undefined' || arguments[0] === null) && ((arguments[1] instanceof Websom.Containers) || typeof arguments[1] == 'undefined' || arguments[1] === null) && (typeof arguments[2] == 'function' || typeof arguments[2] == 'undefined' || arguments[2] === null)) {
		var parent = arguments[0];
		var component = arguments[1];
		var getFieldContainer = arguments[2];

	}
}

Websom.Standard.RichText.prototype.onSend = function () {
	if (arguments.length == 3 && ((arguments[0] instanceof Websom.Request) || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'object' || typeof arguments[1] == 'undefined' || arguments[1] === null) && (typeof arguments[2] == 'function' || typeof arguments[2] == 'undefined' || arguments[2] === null)) {
		var req = arguments[0];
		var exposed = arguments[1];
		var send = arguments[2];
		this.onComponentSend(req, exposed, send);
	}
}

Websom.Standard.RichText.prototype.onComponentSend = function () {
	if (arguments.length == 3 && ((arguments[0] instanceof Websom.Request) || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'object' || typeof arguments[1] == 'undefined' || arguments[1] === null) && (typeof arguments[2] == 'function' || typeof arguments[2] == 'undefined' || arguments[2] === null)) {
		var req = arguments[0];
		var data = arguments[1];
		var send = arguments[2];
		var info = this.fetchFieldInfo();
		var componentFields = [];
		for (var i = 0; i < info.fields.length; i++) {
			var field = info.fields[i];
			if (field.singleLink) {
				var fieldType = Websom.DataInfo.getDataInfoFromRoute(field.typeRoute);
				if ("Component" in fieldType.attributes) {
					if (this.getField(field.realName) != null) {
						componentFields.push(field);
						}
					}
				}
			}
		var completed = componentFields.length;
		if (completed == 0) {
			send(data);
			return null;
			}
		var checkSend = function () {
			completed--;
			if (completed == 0) {
				send(data);
				}
			};
		for (var i = 0; i < componentFields.length; i++) {
			var field = componentFields[i];
			var component = this.getField(field.realName);
			component.onSend(req, data[field.realName], function (newData) {
				data[field.realName] = newData;
				checkSend();
				});
			}
	}
}

Websom.Standard.RichText.structureTable = function () {
	if (arguments.length == 0) {

	}
}

Websom.Standard.RichText.prototype.nativeLoadFromMap = function () {
	if (arguments.length == 2 && (typeof arguments[0] == 'object' || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'function' || typeof arguments[1] == 'undefined' || arguments[1] === null)) {
		var raw = arguments[0];
		var done = arguments[1];
		
			this.loadFromMap(raw, done);
		
		
	}
}

Websom.Standard.RichText.prototype.linkedExpose = function () {
	if (arguments.length == 0) {

	}
}

Websom.Standard.RichText.prototype.fetchFieldInfo = function () {
	if (arguments.length == 0) {
		var info = null;
		
			info = this.constructor.getInfo();
		
		
		return info;
	}
}

Websom.Standard.RichText.prototype.getPrimary = function () {
	if (arguments.length == 0) {
		var fi = this.fetchFieldInfo();
		for (var i = 0; i < fi.fields.length; i++) {
			var field = fi.fields[i];
			for (var f = 0; f < field.structure.flags.length; f++) {
				if (field.structure.flags[f].type == "primary") {
					return field;
					}
				}
			}
		return null;
	}
}

Websom.Standard.RichText.prototype.getFieldFromName = function () {
	if (arguments.length == 1 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var realName = arguments[0];
		 return this[realName]; 
		
	}
}

Websom.Standard.RichText.prototype.containerInsert = function () {
	if (arguments.length == 5 && ((arguments[0] instanceof Websom.Input) || typeof arguments[0] == 'undefined' || arguments[0] === null) && ((arguments[1] instanceof Websom.Container || (arguments[1] instanceof Websom.Containers.Table)) || typeof arguments[1] == 'undefined' || arguments[1] === null) && ((arguments[2] instanceof Websom.DatabaseInsert || (arguments[2] instanceof Websom.MySqlDatabaseInsert)) || typeof arguments[2] == 'undefined' || arguments[2] === null) && (typeof arguments[3] == 'object' || typeof arguments[3] == 'undefined' || arguments[3] === null) && (typeof arguments[4] == 'function' || typeof arguments[4] == 'undefined' || arguments[4] === null)) {
		var input = arguments[0];
		var container = arguments[1];
		var insert = arguments[2];
		var data = arguments[3];
		var done = arguments[4];
		done();
	}
}

Websom.Standard.RichText.prototype.containerUpdate = function () {
	if (arguments.length == 5 && ((arguments[0] instanceof Websom.Input) || typeof arguments[0] == 'undefined' || arguments[0] === null) && ((arguments[1] instanceof Websom.Container || (arguments[1] instanceof Websom.Containers.Table)) || typeof arguments[1] == 'undefined' || arguments[1] === null) && ((arguments[2] instanceof Websom.DatabaseSelect || (arguments[2] instanceof Websom.MySqlDatabaseSelect)) || typeof arguments[2] == 'undefined' || arguments[2] === null) && (typeof arguments[3] == 'object' || typeof arguments[3] == 'undefined' || arguments[3] === null) && (typeof arguments[4] == 'function' || typeof arguments[4] == 'undefined' || arguments[4] === null)) {
		var input = arguments[0];
		var container = arguments[1];
		var update = arguments[2];
		var data = arguments[3];
		var done = arguments[4];
		done();
	}
}

Websom.Standard.RichText.prototype.update = function () {
	if (arguments.length == 1 && (typeof arguments[0] == 'function' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var done = arguments[0];
		if (this.websomContainer) {
			var field = this.getPrimary();
			var cast = this.websomContainer;
			var table = "unkown";
			table = cast.table;
			if (field) {
				var update = this.websomContainer.server.database.primary.from(table).where(field.fieldName).equals(this.getFieldFromName(field.realName)).update();
				this.buildUpdate(update);
				update.run(function (err, docs) {
					done(err);
					});
				}
			}
	}
}

Websom.Standard.RichText.prototype.insert = function () {
	if (arguments.length == 1 && (typeof arguments[0] == 'function' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var done = arguments[0];
		if (this.websomContainer) {
			var cast = this.websomContainer;
			var table = "unkown";
			table = cast.table;
			var insert = this.websomContainer.server.database.primary.into(table);
			this.buildInsert(insert);
			insert.run(function (err, key) {
				done(err, key);
				});
			}
	}
}

Websom.Standard.RichText.prototype.buildInsert = function () {
	if (arguments.length == 1 && ((arguments[0] instanceof Websom.DatabaseInsert || (arguments[0] instanceof Websom.MySqlDatabaseInsert)) || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var insert = arguments[0];
		var info = this.fetchFieldInfo();
		
			if (this.parentId)
				insert.set("parentId", this.parentId);
		
		
		for (var i = 0; i < info.fields.length; i++) {
			var field = info.fields[i];
			var value = null;
			
				value = this[field.realName];
			
			
			var type = (typeof value == 'object' ? (Array.isArray(value) ? 'array' : 'map') : (typeof value == 'number' ? 'float' : typeof value));
			if (type == "integer" || type == "float" || type == "string") {
				insert.set(field.fieldName, value);
				}else if (type == "boolean") {
				var setVal = 0;
				if (value) {
					setVal = 1;
					}
				insert.set(field.fieldName, setVal);
				}
			}
	}
}

Websom.Standard.RichText.prototype.buildUpdate = function () {
	if (arguments.length == 1 && ((arguments[0] instanceof Websom.DatabaseSelect || (arguments[0] instanceof Websom.MySqlDatabaseSelect)) || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var select = arguments[0];
		var info = this.fetchFieldInfo();
		
			if (this.parentId)
				update.set("parentId", this.parentId);
		
		
		for (var i = 0; i < info.fields.length; i++) {
			var field = info.fields[i];
			var value = null;
			
				value = this[field.realName];
			
			
			var type = (typeof value == 'object' ? (Array.isArray(value) ? 'array' : 'map') : (typeof value == 'number' ? 'float' : typeof value));
			if (type == "integer" || type == "float" || type == "string") {
				select.set(field.fieldName, value);
				}else if (type == "boolean") {
				var setVal = 0;
				if (value) {
					setVal = 1;
					}
				select.set(field.fieldName, setVal);
				}
			}
	}
}

Websom.Standard.RichText.getInfo = function () {
	if (arguments.length == 0) {
		var info = new Websom.DataInfo("Websom.Standard.RichText");
		info.attributes["Structure"] = "string";
		info.attributes["Control"] = "Websom.Standard.RichTextControl";
		return info;
	}
}

Websom.Standard.RichText.prototype.loadFromMap = function () {
	if (arguments.length == 2 && (typeof arguments[0] == 'object' || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'function' || typeof arguments[1] == 'undefined' || arguments[1] === null)) {
		var raw = arguments[0];
		var done = arguments[1];
		var that = this;
		var dataInfo = Websom.Standard.RichText.getDataInfo();
		var dones = 0;
		var checkDone = function (err) {
			dones--;
			if (dones == 0) {
				done(err);
				}
			};
		dones++;
		checkDone("");
	}
}

Websom.Standard.RichText.prototype.exposeToClientBase = function () {
	if (arguments.length == 0) {
		var raw = {};
		return raw;
	}
}

Websom.Standard.RichTextControl = function () {
	this.required = false;

	this.name = "";

	this.field = "";

	this.logic = "or";

	this.fieldInfo = null;

	this.server = null;

	this.container = null;

	if (arguments.length == 1 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var field = arguments[0];
		this.name = field;
		this.field = field;
	}
else 	if (arguments.length == 2 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'string' || typeof arguments[1] == 'undefined' || arguments[1] === null)) {
		var field = arguments[0];
		var logic = arguments[1];
		this.name = field;
		this.field = field;
		this.logic = logic;
	}
else 	if (arguments.length == 3 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'string' || typeof arguments[1] == 'undefined' || arguments[1] === null) && ((arguments[2] instanceof Websom.FieldInfo) || typeof arguments[2] == 'undefined' || arguments[2] === null)) {
		var name = arguments[0];
		var field = arguments[1];
		var fieldInfo = arguments[2];
		this.name = name;
		this.field = field;
		this.fieldInfo = fieldInfo;
	}

}

Websom.Standard.RichTextControl.prototype.fillField = function () {
	if (arguments.length == 2 && ((arguments[0]instanceof Array || typeof arguments[0] == 'boolean' || typeof arguments[0] == 'number' || typeof arguments[0] == 'number' || typeof arguments[0] == 'object' || typeof arguments[0] == 'string') || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'object' || typeof arguments[1] == 'undefined' || arguments[1] === null)) {
		var value = arguments[0];
		var values = arguments[1];
		values[this.field] = value;
	}
else 	if (arguments.length == 2 && ((arguments[0]instanceof Array || typeof arguments[0] == 'boolean' || typeof arguments[0] == 'number' || typeof arguments[0] == 'number' || typeof arguments[0] == 'object' || typeof arguments[0] == 'string') || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'object' || typeof arguments[1] == 'undefined' || arguments[1] === null)) {
		var value = arguments[0];
		var values = arguments[1];

	}
}

Websom.Standard.RichTextControl.prototype.validate = function () {
	if (arguments.length == 2 && ((arguments[0] instanceof Websom.Input) || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'function' || typeof arguments[1] == 'undefined' || arguments[1] === null)) {
		var input = arguments[0];
		var done = arguments[1];
		if (this.name in input.raw) {
			this.validateField(input, input.raw[this.name], done);
			}else if (this.required) {
			done(new Websom.InputValidation(true, "Missing field " + this.name));
			}else{
				done(new Websom.InputValidation(false, ""));
			}
	}
}

Websom.Standard.RichTextControl.prototype.fill = function () {
	if (arguments.length == 3 && ((arguments[0] instanceof Websom.Input) || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'object' || typeof arguments[1] == 'undefined' || arguments[1] === null) && (typeof arguments[2] == 'function' || typeof arguments[2] == 'undefined' || arguments[2] === null)) {
		var input = arguments[0];
		var values = arguments[1];
		var done = arguments[2];
		this.fillField(input.raw[this.name], values);
		done();
	}
}

Websom.Standard.RichTextControl.prototype.filter = function () {
	if (arguments.length == 3 && ((arguments[0] instanceof Websom.Input) || typeof arguments[0] == 'undefined' || arguments[0] === null) && ((arguments[1] instanceof Websom.DatabaseSelect || (arguments[1] instanceof Websom.MySqlDatabaseSelect)) || typeof arguments[1] == 'undefined' || arguments[1] === null) && (typeof arguments[2] == 'function' || typeof arguments[2] == 'undefined' || arguments[2] === null)) {
		var input = arguments[0];
		var select = arguments[1];
		var done = arguments[2];
		if (this.name in input.raw) {
			if (this.logic == "and") {
				select.and();
				}else{
					select.or();
				}
			var val = this.filterField(input.raw[this.name], select, done);
			}else if (this.required) {
			done(new Websom.InputValidation(true, "Missing field " + this.name));
			}else{
				done(null);
			}
	}
}

Websom.Standard.RichTextControl.prototype.validateField = function () {
	if (arguments.length == 3 && ((arguments[0] instanceof Websom.Input) || typeof arguments[0] == 'undefined' || arguments[0] === null) && ((arguments[1]instanceof Array || typeof arguments[1] == 'boolean' || typeof arguments[1] == 'number' || typeof arguments[1] == 'number' || typeof arguments[1] == 'object' || typeof arguments[1] == 'string') || typeof arguments[1] == 'undefined' || arguments[1] === null) && (typeof arguments[2] == 'function' || typeof arguments[2] == 'undefined' || arguments[2] === null)) {
		var input = arguments[0];
		var value = arguments[1];
		var done = arguments[2];
		done(new Websom.InputValidation(false, ""));
	}
}

Websom.Standard.RichTextControl.prototype.filterField = function () {
	if (arguments.length == 3 && ((arguments[0]instanceof Array || typeof arguments[0] == 'boolean' || typeof arguments[0] == 'number' || typeof arguments[0] == 'number' || typeof arguments[0] == 'object' || typeof arguments[0] == 'string') || typeof arguments[0] == 'undefined' || arguments[0] === null) && ((arguments[1] instanceof Websom.DatabaseSelect || (arguments[1] instanceof Websom.MySqlDatabaseSelect)) || typeof arguments[1] == 'undefined' || arguments[1] === null) && (typeof arguments[2] == 'function' || typeof arguments[2] == 'undefined' || arguments[2] === null)) {
		var value = arguments[0];
		var select = arguments[1];
		var done = arguments[2];

	}
}

Websom.Standard.RichTextControl.prototype.message = function () {
	if (arguments.length == 4 && ((arguments[0] instanceof Websom.Input) || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'string' || typeof arguments[1] == 'undefined' || arguments[1] === null) && (typeof arguments[2] == 'object' || typeof arguments[2] == 'undefined' || arguments[2] === null) && (typeof arguments[3] == 'function' || typeof arguments[3] == 'undefined' || arguments[3] === null)) {
		var input = arguments[0];
		var name = arguments[1];
		var data = arguments[2];
		var send = arguments[3];
		send(null);
	}
}

Websom.Standard.Image = function () {
	this.caption = "";

	this.websomFieldInfo = null;

	this.websomParentData = null;

	this.websomContainer = null;

	this.websomServer = null;

	if (arguments.length == 1 && ((arguments[0] instanceof Websom.Server) || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var server = arguments[0];
		this.websomServer = server;
	}

}

Websom.Standard.Image.prototype.containerInsert = function () {
	if (arguments.length == 5 && ((arguments[0] instanceof Websom.Input) || typeof arguments[0] == 'undefined' || arguments[0] === null) && ((arguments[1] instanceof Websom.Container || (arguments[1] instanceof Websom.Containers.Table)) || typeof arguments[1] == 'undefined' || arguments[1] === null) && ((arguments[2] instanceof Websom.DatabaseInsert || (arguments[2] instanceof Websom.MySqlDatabaseInsert)) || typeof arguments[2] == 'undefined' || arguments[2] === null) && (typeof arguments[3] == 'object' || typeof arguments[3] == 'undefined' || arguments[3] === null) && (typeof arguments[4] == 'function' || typeof arguments[4] == 'undefined' || arguments[4] === null)) {
		var input = arguments[0];
		var container = arguments[1];
		var insert = arguments[2];
		var data = arguments[3];
		var done = arguments[4];
		var cast = data["arrayIndex"];
		var writeTo = cast + ".png";
		var bucketReference = this.websomFieldInfo.attributes["Bucket"];
		var bucket = this.websomServer.getBucketFromReference(bucketReference);
		if (this.websomFieldInfo.structure.hasFlag("linked")) {
			var pId = this.websomParentData.getPublicId();
			bucket.makeDir(pId, function (ok) {

				});
			writeTo = pId + "/" + writeTo;
			}
		if ("encoded" in input.raw) {
			bucket.write(writeTo, this.decodePng(input.raw["encoded"]), function (msg) {

				});
			}
		done();
	}
}

Websom.Standard.Image.prototype.containerUpdate = function () {
	if (arguments.length == 5 && ((arguments[0] instanceof Websom.Input) || typeof arguments[0] == 'undefined' || arguments[0] === null) && ((arguments[1] instanceof Websom.Container || (arguments[1] instanceof Websom.Containers.Table)) || typeof arguments[1] == 'undefined' || arguments[1] === null) && ((arguments[2] instanceof Websom.DatabaseSelect || (arguments[2] instanceof Websom.MySqlDatabaseSelect)) || typeof arguments[2] == 'undefined' || arguments[2] === null) && (typeof arguments[3] == 'object' || typeof arguments[3] == 'undefined' || arguments[3] === null) && (typeof arguments[4] == 'function' || typeof arguments[4] == 'undefined' || arguments[4] === null)) {
		var input = arguments[0];
		var container = arguments[1];
		var update = arguments[2];
		var data = arguments[3];
		var done = arguments[4];
		if ("encoded" in input.raw) {
			var bucketReference = this.websomFieldInfo.attributes["Bucket"];
			var bucket = this.websomServer.getBucketFromReference(bucketReference);
			bucket.write("image.txt", input.raw["encoded"], function (msg) {

				});
			}
		done();
	}
}

Websom.Standard.Image.prototype.decodePng = function () {
	if (arguments.length == 1 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var base64 = arguments[0];
		
			return new Buffer(base64.replace(new RegExp("data:image\\/(png|jpeg|gif);base64,"), ""), "base64");
		
		
	}
}

Websom.Standard.Image.prototype.exposeToClient = function () {
	if (arguments.length == 0) {
		var bucketReference = this.websomFieldInfo.attributes["Bucket"];
		var bucket = this.websomContainer.server.getBucketFromReference(bucketReference);
		var publicUrl = bucket.raw["publicUrl"];
		var mp = {};
		mp["caption"] = this.caption;
		mp["arrayIndex"] = this.getField("arrayIndex");
		var url = publicUrl + this.getPublicId() + ".png";
		if (this.websomFieldInfo.structure.hasFlag("linked")) {
			var cast = this.getField("arrayIndex");
			var ext = cast + ".png";
			url = publicUrl + this.websomParentData.getPublicId() + "/" + ext;
			}
		mp["url"] = url;
		return mp;
	}
}

Websom.Standard.Image.prototype.callLoadFromMap = function () {
	if (arguments.length == 2 && (typeof arguments[0] == 'object' || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'function' || typeof arguments[1] == 'undefined' || arguments[1] === null)) {
		var raw = arguments[0];
		var callback = arguments[1];
		
			return this.loadFromMap(raw, callback);
		
		
	}
else 	if (arguments.length == 2 && (typeof arguments[0] == 'object' || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'function' || typeof arguments[1] == 'undefined' || arguments[1] === null)) {
		var raw = arguments[0];
		var callback = arguments[1];
		
			return this.loadFromMap(raw, callback);
		
		
	}
}

Websom.Standard.Image.prototype.setField = function (name, value) {
		
			this[name] = value;
		
		}

Websom.Standard.Image.getDataInfo = function () {
	if (arguments.length == 0) {
		
			return this.getInfo();
		
		
	}
else 	if (arguments.length == 0) {
		
			return this.getInfo();
		
		
	}
}

Websom.Standard.Image.spawnFromId = function () {
	if (arguments.length == 4 && ((arguments[0] instanceof Websom.Server) || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'string' || typeof arguments[1] == 'undefined' || arguments[1] === null) && ((arguments[2]instanceof Array || typeof arguments[2] == 'boolean' || typeof arguments[2] == 'number' || typeof arguments[2] == 'number' || typeof arguments[2] == 'object' || typeof arguments[2] == 'string') || typeof arguments[2] == 'undefined' || arguments[2] === null) && (typeof arguments[3] == 'function' || typeof arguments[3] == 'undefined' || arguments[3] === null)) {
		var server = arguments[0];
		var table = arguments[1];
		var id = arguments[2];
		var done = arguments[3];
		var dataInfo = null;
		
			dataInfo = this.getInfo();
		
		
		var container = new Websom.Containers.Table(server, table, dataInfo);
		var data = dataInfo.spawn(server);
		data.websomContainer = container;
		data.loadFromId(container, id, function (err) {
			done(err, data);
			});
	}
}

Websom.Standard.Image.prototype.read = function () {
	if (arguments.length == 1 && ((arguments[0]instanceof Array || typeof arguments[0] == 'boolean' || typeof arguments[0] == 'number' || typeof arguments[0] == 'number' || typeof arguments[0] == 'object' || typeof arguments[0] == 'string') || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var value = arguments[0];

	}
}

Websom.Standard.Image.prototype.write = function () {
	if (arguments.length == 0) {

	}
}

Websom.Standard.Image.prototype.getContainer = function () {
	if (arguments.length == 1 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var realFieldName = arguments[0];
		var info = this.fetchFieldInfo();
		for (var i = 0; i < info.fields.length; i++) {
			var field = info.fields[i];
			if (field.realName == realFieldName) {
				var thisTable = this.websomContainer;
				if (field.structure.hasFlag("linked")) {
					var linked = field.structure.getFlag("linked");
					var typeInfo = Websom.DataInfo.getDataInfoFromRoute(linked.fieldType);
					return new Websom.Containers.Table(this.websomServer, thisTable.table + "_" + field.fieldName, typeInfo);
					}
				}
			}
		return null;
	}
}

Websom.Standard.Image.prototype.onInputInterface = function () {
	if (arguments.length == 4 && ((arguments[0] instanceof Websom.Input) || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'string' || typeof arguments[1] == 'undefined' || arguments[1] === null) && (typeof arguments[2] == 'object' || typeof arguments[2] == 'undefined' || arguments[2] === null) && (typeof arguments[3] == 'function' || typeof arguments[3] == 'undefined' || arguments[3] === null)) {
		var input = arguments[0];
		var route = arguments[1];
		var data = arguments[2];
		var respond = arguments[3];
		
			if (this.onInputInterfaceAuto)
				this.onInputInterfaceAuto(input, route, data, respond);
			else
				respond(null);
		
		
	}
}

Websom.Standard.Image.prototype.getField = function () {
	if (arguments.length == 1 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var name = arguments[0];
		
			return this[name];
		
		
	}
}

Websom.Standard.Image.prototype.getPublicId = function () {
	if (arguments.length == 0) {
		return this.getField("publicId");
	}
}

Websom.Standard.Image.prototype.fromPrimary = function () {
	if (arguments.length == 2 && ((arguments[0]instanceof Array || typeof arguments[0] == 'boolean' || typeof arguments[0] == 'number' || typeof arguments[0] == 'number' || typeof arguments[0] == 'object' || typeof arguments[0] == 'string') || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'function' || typeof arguments[1] == 'undefined' || arguments[1] === null)) {
		var key = arguments[0];
		var done = arguments[1];

	}
}

Websom.Standard.Image.prototype.loadFromPublicKey = function () {
	if (arguments.length == 3 && ((arguments[0] instanceof Websom.Containers.Table) || typeof arguments[0] == 'undefined' || arguments[0] === null) && ((arguments[1]instanceof Array || typeof arguments[1] == 'boolean' || typeof arguments[1] == 'number' || typeof arguments[1] == 'number' || typeof arguments[1] == 'object' || typeof arguments[1] == 'string') || typeof arguments[1] == 'undefined' || arguments[1] === null) && (typeof arguments[2] == 'function' || typeof arguments[2] == 'undefined' || arguments[2] === null)) {
		var parent = arguments[0];
		var key = arguments[1];
		var done = arguments[2];
		var that = this;
		that.websomContainer = parent;
		parent.server.database.primary.from(parent.table).where("publicId").equals(key).run(function (err, res) {
			if (res.length == 0) {
				done("No data found");
				}else{
					that.callLoadFromMap(res[0], done);
				}
			});
	}
}

Websom.Standard.Image.prototype.loadFromId = function () {
	if (arguments.length == 3 && ((arguments[0] instanceof Websom.Containers.Table) || typeof arguments[0] == 'undefined' || arguments[0] === null) && ((arguments[1]instanceof Array || typeof arguments[1] == 'boolean' || typeof arguments[1] == 'number' || typeof arguments[1] == 'number' || typeof arguments[1] == 'object' || typeof arguments[1] == 'string') || typeof arguments[1] == 'undefined' || arguments[1] === null) && (typeof arguments[2] == 'function' || typeof arguments[2] == 'undefined' || arguments[2] === null)) {
		var parent = arguments[0];
		var id = arguments[1];
		var done = arguments[2];
		var that = this;
		that.websomContainer = parent;
		parent.server.database.primary.from(parent.table).where("id").equals(id).run(function (err, res) {
			if (res.length == 0) {
				done("No data found");
				}else{
					that.callLoadFromMap(res[0], done);
				}
			});
	}
}

Websom.Standard.Image.registerInterfaces = function () {
	if (arguments.length == 3 && ((arguments[0] instanceof Websom.Container || (arguments[0] instanceof Websom.Containers.Table)) || typeof arguments[0] == 'undefined' || arguments[0] === null) && ((arguments[1] instanceof Websom.Containers) || typeof arguments[1] == 'undefined' || arguments[1] === null) && (typeof arguments[2] == 'function' || typeof arguments[2] == 'undefined' || arguments[2] === null)) {
		var parent = arguments[0];
		var component = arguments[1];
		var getFieldContainer = arguments[2];

	}
}

Websom.Standard.Image.prototype.onSend = function () {
	if (arguments.length == 3 && ((arguments[0] instanceof Websom.Request) || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'object' || typeof arguments[1] == 'undefined' || arguments[1] === null) && (typeof arguments[2] == 'function' || typeof arguments[2] == 'undefined' || arguments[2] === null)) {
		var req = arguments[0];
		var exposed = arguments[1];
		var send = arguments[2];
		this.onComponentSend(req, exposed, send);
	}
}

Websom.Standard.Image.prototype.onComponentSend = function () {
	if (arguments.length == 3 && ((arguments[0] instanceof Websom.Request) || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'object' || typeof arguments[1] == 'undefined' || arguments[1] === null) && (typeof arguments[2] == 'function' || typeof arguments[2] == 'undefined' || arguments[2] === null)) {
		var req = arguments[0];
		var data = arguments[1];
		var send = arguments[2];
		var info = this.fetchFieldInfo();
		var componentFields = [];
		for (var i = 0; i < info.fields.length; i++) {
			var field = info.fields[i];
			if (field.singleLink) {
				var fieldType = Websom.DataInfo.getDataInfoFromRoute(field.typeRoute);
				if ("Component" in fieldType.attributes) {
					if (this.getField(field.realName) != null) {
						componentFields.push(field);
						}
					}
				}
			}
		var completed = componentFields.length;
		if (completed == 0) {
			send(data);
			return null;
			}
		var checkSend = function () {
			completed--;
			if (completed == 0) {
				send(data);
				}
			};
		for (var i = 0; i < componentFields.length; i++) {
			var field = componentFields[i];
			var component = this.getField(field.realName);
			component.onSend(req, data[field.realName], function (newData) {
				data[field.realName] = newData;
				checkSend();
				});
			}
	}
}

Websom.Standard.Image.structureTable = function () {
	if (arguments.length == 0) {

	}
}

Websom.Standard.Image.prototype.nativeLoadFromMap = function () {
	if (arguments.length == 2 && (typeof arguments[0] == 'object' || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'function' || typeof arguments[1] == 'undefined' || arguments[1] === null)) {
		var raw = arguments[0];
		var done = arguments[1];
		
			this.loadFromMap(raw, done);
		
		
	}
}

Websom.Standard.Image.prototype.linkedExpose = function () {
	if (arguments.length == 0) {

	}
}

Websom.Standard.Image.prototype.fetchFieldInfo = function () {
	if (arguments.length == 0) {
		var info = null;
		
			info = this.constructor.getInfo();
		
		
		return info;
	}
}

Websom.Standard.Image.prototype.getPrimary = function () {
	if (arguments.length == 0) {
		var fi = this.fetchFieldInfo();
		for (var i = 0; i < fi.fields.length; i++) {
			var field = fi.fields[i];
			for (var f = 0; f < field.structure.flags.length; f++) {
				if (field.structure.flags[f].type == "primary") {
					return field;
					}
				}
			}
		return null;
	}
}

Websom.Standard.Image.prototype.getFieldFromName = function () {
	if (arguments.length == 1 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var realName = arguments[0];
		 return this[realName]; 
		
	}
}

Websom.Standard.Image.prototype.update = function () {
	if (arguments.length == 1 && (typeof arguments[0] == 'function' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var done = arguments[0];
		if (this.websomContainer) {
			var field = this.getPrimary();
			var cast = this.websomContainer;
			var table = "unkown";
			table = cast.table;
			if (field) {
				var update = this.websomContainer.server.database.primary.from(table).where(field.fieldName).equals(this.getFieldFromName(field.realName)).update();
				this.buildUpdate(update);
				update.run(function (err, docs) {
					done(err);
					});
				}
			}
	}
}

Websom.Standard.Image.prototype.insert = function () {
	if (arguments.length == 1 && (typeof arguments[0] == 'function' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var done = arguments[0];
		if (this.websomContainer) {
			var cast = this.websomContainer;
			var table = "unkown";
			table = cast.table;
			var insert = this.websomContainer.server.database.primary.into(table);
			this.buildInsert(insert);
			insert.run(function (err, key) {
				done(err, key);
				});
			}
	}
}

Websom.Standard.Image.prototype.buildInsert = function () {
	if (arguments.length == 1 && ((arguments[0] instanceof Websom.DatabaseInsert || (arguments[0] instanceof Websom.MySqlDatabaseInsert)) || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var insert = arguments[0];
		var info = this.fetchFieldInfo();
		
			if (this.parentId)
				insert.set("parentId", this.parentId);
		
		
		for (var i = 0; i < info.fields.length; i++) {
			var field = info.fields[i];
			var value = null;
			
				value = this[field.realName];
			
			
			var type = (typeof value == 'object' ? (Array.isArray(value) ? 'array' : 'map') : (typeof value == 'number' ? 'float' : typeof value));
			if (type == "integer" || type == "float" || type == "string") {
				insert.set(field.fieldName, value);
				}else if (type == "boolean") {
				var setVal = 0;
				if (value) {
					setVal = 1;
					}
				insert.set(field.fieldName, setVal);
				}
			}
	}
}

Websom.Standard.Image.prototype.buildUpdate = function () {
	if (arguments.length == 1 && ((arguments[0] instanceof Websom.DatabaseSelect || (arguments[0] instanceof Websom.MySqlDatabaseSelect)) || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var select = arguments[0];
		var info = this.fetchFieldInfo();
		
			if (this.parentId)
				update.set("parentId", this.parentId);
		
		
		for (var i = 0; i < info.fields.length; i++) {
			var field = info.fields[i];
			var value = null;
			
				value = this[field.realName];
			
			
			var type = (typeof value == 'object' ? (Array.isArray(value) ? 'array' : 'map') : (typeof value == 'number' ? 'float' : typeof value));
			if (type == "integer" || type == "float" || type == "string") {
				select.set(field.fieldName, value);
				}else if (type == "boolean") {
				var setVal = 0;
				if (value) {
					setVal = 1;
					}
				select.set(field.fieldName, setVal);
				}
			}
	}
}

Websom.Standard.Image.getInfo = function () {
	if (arguments.length == 0) {
		var info = new Websom.DataInfo("Websom.Standard.Image");
		var captionStructure = new Websom.DatabaseField("caption", null);
		captionStructure.type = new Websom.DatabaseTypes.Varchar(256);
		captionStructure.flags.push(new Websom.DatabaseFlags.Edit());
		info.fields.push(new Websom.FieldInfo("caption", "caption", "string", captionStructure));
		info.fields[info.fields.length - 1].attributes["Length"] = 256;
		return info;
	}
}

Websom.Standard.Image.prototype.loadFromMap = function () {
	if (arguments.length == 2 && (typeof arguments[0] == 'object' || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'function' || typeof arguments[1] == 'undefined' || arguments[1] === null)) {
		var raw = arguments[0];
		var done = arguments[1];
		var that = this;
		var dataInfo = Websom.Standard.Image.getDataInfo();
		var dones = 0;
		var checkDone = function (err) {
			dones--;
			if (dones == 0) {
				done(err);
				}
			};
		this.caption = raw["caption"];
		dones++;
		checkDone("");
	}
}

Websom.Standard.Image.prototype.exposeToClientBase = function () {
	if (arguments.length == 0) {
		var raw = {};
		raw["caption"] = this.caption;
		return raw;
	}
}

Websom.Standard.ImageControl = function () {
	this.required = false;

	this.name = "";

	this.field = "";

	this.logic = "or";

	this.fieldInfo = null;

	this.server = null;

	this.container = null;

	if (arguments.length == 1 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var field = arguments[0];
		this.name = field;
		this.field = field;
	}
else 	if (arguments.length == 2 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'string' || typeof arguments[1] == 'undefined' || arguments[1] === null)) {
		var field = arguments[0];
		var logic = arguments[1];
		this.name = field;
		this.field = field;
		this.logic = logic;
	}
else 	if (arguments.length == 3 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'string' || typeof arguments[1] == 'undefined' || arguments[1] === null) && ((arguments[2] instanceof Websom.FieldInfo) || typeof arguments[2] == 'undefined' || arguments[2] === null)) {
		var name = arguments[0];
		var field = arguments[1];
		var fieldInfo = arguments[2];
		this.name = name;
		this.field = field;
		this.fieldInfo = fieldInfo;
	}

}

Websom.Standard.ImageControl.prototype.fillField = function () {
	if (arguments.length == 2 && ((arguments[0]instanceof Array || typeof arguments[0] == 'boolean' || typeof arguments[0] == 'number' || typeof arguments[0] == 'number' || typeof arguments[0] == 'object' || typeof arguments[0] == 'string') || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'object' || typeof arguments[1] == 'undefined' || arguments[1] === null)) {
		var value = arguments[0];
		var values = arguments[1];
		values[this.field] = value;
	}
else 	if (arguments.length == 2 && ((arguments[0]instanceof Array || typeof arguments[0] == 'boolean' || typeof arguments[0] == 'number' || typeof arguments[0] == 'number' || typeof arguments[0] == 'object' || typeof arguments[0] == 'string') || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'object' || typeof arguments[1] == 'undefined' || arguments[1] === null)) {
		var value = arguments[0];
		var values = arguments[1];

	}
}

Websom.Standard.ImageControl.prototype.validate = function () {
	if (arguments.length == 2 && ((arguments[0] instanceof Websom.Input) || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'function' || typeof arguments[1] == 'undefined' || arguments[1] === null)) {
		var input = arguments[0];
		var done = arguments[1];
		if (this.name in input.raw) {
			this.validateField(input, input.raw[this.name], done);
			}else if (this.required) {
			done(new Websom.InputValidation(true, "Missing field " + this.name));
			}else{
				done(new Websom.InputValidation(false, ""));
			}
	}
}

Websom.Standard.ImageControl.prototype.fill = function () {
	if (arguments.length == 3 && ((arguments[0] instanceof Websom.Input) || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'object' || typeof arguments[1] == 'undefined' || arguments[1] === null) && (typeof arguments[2] == 'function' || typeof arguments[2] == 'undefined' || arguments[2] === null)) {
		var input = arguments[0];
		var values = arguments[1];
		var done = arguments[2];
		this.fillField(input.raw[this.name], values);
		done();
	}
}

Websom.Standard.ImageControl.prototype.filter = function () {
	if (arguments.length == 3 && ((arguments[0] instanceof Websom.Input) || typeof arguments[0] == 'undefined' || arguments[0] === null) && ((arguments[1] instanceof Websom.DatabaseSelect || (arguments[1] instanceof Websom.MySqlDatabaseSelect)) || typeof arguments[1] == 'undefined' || arguments[1] === null) && (typeof arguments[2] == 'function' || typeof arguments[2] == 'undefined' || arguments[2] === null)) {
		var input = arguments[0];
		var select = arguments[1];
		var done = arguments[2];
		if (this.name in input.raw) {
			if (this.logic == "and") {
				select.and();
				}else{
					select.or();
				}
			var val = this.filterField(input.raw[this.name], select, done);
			}else if (this.required) {
			done(new Websom.InputValidation(true, "Missing field " + this.name));
			}else{
				done(null);
			}
	}
}

Websom.Standard.ImageControl.prototype.validateField = function () {
	if (arguments.length == 3 && ((arguments[0] instanceof Websom.Input) || typeof arguments[0] == 'undefined' || arguments[0] === null) && ((arguments[1]instanceof Array || typeof arguments[1] == 'boolean' || typeof arguments[1] == 'number' || typeof arguments[1] == 'number' || typeof arguments[1] == 'object' || typeof arguments[1] == 'string') || typeof arguments[1] == 'undefined' || arguments[1] === null) && (typeof arguments[2] == 'function' || typeof arguments[2] == 'undefined' || arguments[2] === null)) {
		var input = arguments[0];
		var value = arguments[1];
		var done = arguments[2];
		done(new Websom.InputValidation(false, ""));
	}
}

Websom.Standard.ImageControl.prototype.filterField = function () {
	if (arguments.length == 3 && ((arguments[0]instanceof Array || typeof arguments[0] == 'boolean' || typeof arguments[0] == 'number' || typeof arguments[0] == 'number' || typeof arguments[0] == 'object' || typeof arguments[0] == 'string') || typeof arguments[0] == 'undefined' || arguments[0] === null) && ((arguments[1] instanceof Websom.DatabaseSelect || (arguments[1] instanceof Websom.MySqlDatabaseSelect)) || typeof arguments[1] == 'undefined' || arguments[1] === null) && (typeof arguments[2] == 'function' || typeof arguments[2] == 'undefined' || arguments[2] === null)) {
		var value = arguments[0];
		var select = arguments[1];
		var done = arguments[2];

	}
}

Websom.Standard.ImageControl.prototype.message = function () {
	if (arguments.length == 4 && ((arguments[0] instanceof Websom.Input) || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'string' || typeof arguments[1] == 'undefined' || arguments[1] === null) && (typeof arguments[2] == 'object' || typeof arguments[2] == 'undefined' || arguments[2] === null) && (typeof arguments[3] == 'function' || typeof arguments[3] == 'undefined' || arguments[3] === null)) {
		var input = arguments[0];
		var name = arguments[1];
		var data = arguments[2];
		var send = arguments[3];
		send(null);
	}
}


module.exports = CoreModule.Module;