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
		_c_this.server = server;
	}

}

CoreModule.Module.prototype.start = function () {var _c_this = this; var _c_root_method_arguments = arguments;
	if (arguments.length == 0) {

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

test = function () {var _c_this = this;


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
CoreModule.LokiDB = function () {var _c_this = this;
	this.server = null;

	if (arguments.length == 1 && ((arguments[0] instanceof Websom.Server) || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var server = arguments[0];
		_c_this.server = server;
	}

}

/*i async*/CoreModule.LokiDB.prototype.initialize = function () {var _c_this = this; var _c_root_method_arguments = arguments;
	if (arguments.length == 1) {
		console.log("Started LokiDB");
_c_root_method_arguments[_c_root_method_arguments.length - 1](undefined);
		return;
	}
}

CoreModule.LokiDB.prototype.collection = function () {var _c_this = this; var _c_root_method_arguments = arguments;
	if (arguments.length == 1 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var name = arguments[0];

	}
}


module.exports = CoreModule.Module;