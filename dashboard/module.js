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
Dashboard = function () {var _c_this = this;


}

Websom.Standard.Dashboard.Module = function () {var _c_this = this;
	this.tabs = [];

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

Websom.Standard.Dashboard.Module.prototype.start = function () {var _c_this = this; var _c_root_method_arguments = arguments;
	if (arguments.length == 0) {
		var that = _c_this;
		
			                                 
		
		_c_this.register(new Websom.Standard.Dashboard.Tab("Home", "Home", function (req) {
			var rtn = {};
			rtn["view"] = "dashboard-home";
			rtn["image"] = "/resources/dashboard/Websom.svg";
			rtn["sub"] = {};
			rtn["sub"]["Account"] = {};
			rtn["sub"]["Account"]["view"] = "dashboard-account";
			rtn["sub"]["Notifications"] = {};
			rtn["sub"]["Notifications"]["view"] = "dashboard-notifications";
			rtn["sub"]["Build"] = {};
			rtn["sub"]["Build"]["view"] = "dashboard-build";
			return rtn;
			}));
		_c_this.register(new Websom.Standard.Dashboard.Tab("Stats", "Stats", function (req) {
			var rtn = {};
			rtn["view"] = "dashboard-stats";
			rtn["image"] = "/resources/dashboard/Analytics.svg";
			return rtn;
			}));
		_c_this.register(new Websom.Standard.Dashboard.Tab("Modules", "Modules", function (req) {
			var rtn = {};
			rtn["view"] = "dashboard-modules";
			rtn["image"] = "/resources/dashboard/Modules.svg";
			return rtn;
			}));
		_c_this.register(new Websom.Standard.Dashboard.Tab("Themes", "Themes", function (req) {
			var rtn = {};
			rtn["view"] = "dashboard-themes";
			rtn["image"] = "/resources/dashboard/Themes.svg";
			return rtn;
			}));
		_c_this.register(new Websom.Standard.Dashboard.Tab("Builder", "Builder", function (req) {
			var rtn = {};
			rtn["view"] = "dashboard-editor";
			rtn["image"] = "/resources/dashboard/Builder.svg";
			rtn["studio"] = false;
			rtn["builder"] = true;
			return rtn;
			}));
		_c_this.register(new Websom.Standard.Dashboard.Tab("Designer", "Designer", function (req) {
			var rtn = {};
			rtn["view"] = "dashboard-editor";
			rtn["image"] = "/resources/dashboard/Builder.svg";
			rtn["studio"] = false;
			rtn["designer"] = true;
			return rtn;
			}));
		_c_this.register(new Websom.Standard.Dashboard.Tab("Studio", "Studio", function (req) {
			var rtn = {};
			rtn["view"] = "dashboard-editor";
			rtn["image"] = "/resources/dashboard/Studio.svg";
			rtn["studio"] = true;
			return rtn;
			}));
		_c_this.register(new Websom.Standard.Dashboard.Tab("Pages", "Pages", function (req) {
			var rtn = {};
			rtn["view"] = "dashboard-pages";
			rtn["image"] = "/resources/dashboard/Pages.svg";
			return rtn;
			}));
		_c_this.register(new Websom.Standard.Dashboard.Tab("Security", "Security", function (req) {
			var rtn = {};
			rtn["view"] = "dashboard-security";
			rtn["image"] = "/resources/dashboard/Locked.svg";
			return rtn;
			}));
		_c_this.register(new Websom.Standard.Dashboard.Tab("Files", "Files", function (req) {
			var rtn = {};
			rtn["view"] = "dashboard-studio-explorer";
			rtn["image"] = "/resources/dashboard/Files.svg";
			return rtn;
			}));
		_c_this.register(new Websom.Standard.Dashboard.Tab("Database", "Database", function (req) {
			var rtn = {};
			rtn["view"] = "dashboard-database";
			rtn["image"] = "/resources/dashboard/Database.svg";
			return rtn;
			}));
		_c_this.register(new Websom.Standard.Dashboard.Tab("Containers", "Containers", function (req) {
			var rtn = {};
			rtn["view"] = "dashboard-containers";
			rtn["image"] = "/resources/dashboard/Buckets.svg";
			return rtn;
			}));
		_c_this.register(new Websom.Standard.Dashboard.Tab("Buckets", "Buckets", function (req) {
			var rtn = {};
			rtn["view"] = "dashboard-buckets";
			rtn["image"] = "/resources/dashboard/File.svg";
			return rtn;
			}));
		_c_this.register(new Websom.Standard.Dashboard.Tab("User System", "UserSystem", function (req) {
			var rtn = {};
			rtn["view"] = "dashboard-module";
			rtn["image"] = "/resources/dashboard/Modules.svg";
			rtn["module"] = "UserSystem";
			rtn["sub"] = {};
			rtn["sub"]["Users"] = {};
			rtn["sub"]["Users"]["view"] = "user-system-user-search";
			rtn["sub"]["Groups"] = {};
			rtn["sub"]["Groups"]["view"] = "user-system-group-editor";
			return rtn;
			}));
		_c_this.server.router.quickRoute("/websom.console", "websom-console");
		_c_this.server.router.post("/websom.run.command", function (inp) {
			var req = inp.request;
			if (req.session.get("dashboard") != null) {
				that.server.micro.command.exec(inp.raw["command"], inp.request);
				}else{
					req.send("{\"status\": \"error\", \"message\": \"Not logged in\"}");
				}
			});
		_c_this.server.router.quickRoute("/websom.dashboard", "dashboard");
		_c_this.server.router.quickRoute("/websom.studio", "dashboard-studio");
		var builder = _c_this.server.router.quickRoute("/websom.builder", "dashboard-builder");
		builder.greedy = true;
		var designer = _c_this.server.router.quickRoute("/websom.designer", "dashboard-designer");
		designer.greedy = true;
	}
}

Websom.Standard.Dashboard.Module.prototype.register = function () {var _c_this = this; var _c_root_method_arguments = arguments;
	if (arguments.length == 1 && ((arguments[0] instanceof Websom.Standard.Dashboard.Tab || (arguments[0] instanceof Websom.Standard.Dashboard.Tab)) || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var tab = arguments[0];
		_c_this.tabs.push(tab);
	}
}

Websom.Standard.Dashboard.Module.prototype.mapTabs = function () {var _c_this = this; var _c_root_method_arguments = arguments;
	if (arguments.length == 1 && ((arguments[0] instanceof Websom.Request) || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var req = arguments[0];
		var rtn = {};
		for (var i = 0; i < _c_this.tabs.length; i++) {
			rtn[_c_this.tabs[i].display] = _c_this.tabs[i].handler(req);
			}
		return rtn;
	}
}

Websom.Standard.Dashboard.Module.prototype.clientData = function () {var _c_this = this; var _c_root_method_arguments = arguments;
	if (arguments.length == 2 && ((arguments[0] instanceof Websom.Request) || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'function' || typeof arguments[1] == 'undefined' || arguments[1] === null)) {
		var req = arguments[0];
		var send = arguments[1];
		return false;
	}
}

Websom.Standard.Dashboard.Module.prototype.spawn = function () {var _c_this = this; var _c_root_method_arguments = arguments;
	if (arguments.length == 1 && (typeof arguments[0] == 'object' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var config = arguments[0];
		_c_this.baseConfig = config;
		_c_this.name = config["name"];
		_c_this.id = config["id"];
	}
}

Websom.Standard.Dashboard.Module.prototype.stop = function () {var _c_this = this; var _c_root_method_arguments = arguments;
	if (arguments.length == 0) {

	}
}

Websom.Standard.Dashboard.Module.prototype.setupData = function () {var _c_this = this; var _c_root_method_arguments = arguments;
	if (arguments.length == 0) {

	}
}

Websom.Standard.Dashboard.Module.prototype.setupBridge = function () {var _c_this = this; var _c_root_method_arguments = arguments;
	if (arguments.length == 0) {

	}
}

Websom.Standard.Dashboard.Module.prototype.setupBridges = function () {var _c_this = this; var _c_root_method_arguments = arguments;
	if (arguments.length == 0) {
		var bridges = [];
		bridges.push(new DashboardBridge(_c_this.server));
		return bridges;
	}
}

Websom.Standard.Dashboard.Tab = function () {var _c_this = this;
	this.name = "";

	this.display = "";

	this.handler = null;

	if (arguments.length == 3 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'string' || typeof arguments[1] == 'undefined' || arguments[1] === null) && (typeof arguments[2] == 'function' || typeof arguments[2] == 'undefined' || arguments[2] === null)) {
		var name = arguments[0];
		var display = arguments[1];
		var handler = arguments[2];
		_c_this.name = name;
		_c_this.display = display;
		_c_this.handler = handler;
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
DashboardBridge = function () {var _c_this = this;
	this.server = null;

	this.name = "DashboardBridge";

	if (arguments.length == 1 && ((arguments[0] instanceof Websom.Server) || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var server = arguments[0];
		_c_this.server = server;
	}

}

DashboardBridge.prototype.getInfo = function () {var _c_this = this; var _c_root_method_arguments = arguments;
	if (arguments.length == 1 && ((arguments[0] instanceof Websom.Request) || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var req = arguments[0];
		var rtn = {};
		rtn["status"] = false;
		if (req.session.get("dashboard") == null) {

			}else{
				rtn["status"] = true;
				rtn["websomRoot"] = _c_this.server.websomRoot;
				rtn["tabs"] = _c_this.server.dashboard.mapTabs(req);
				rtn["version"] = _c_this.server.version;
				rtn["platform"] = "node";
				
				rtn.platformVersion = process.version;
			
				
			}
		return rtn;
	}
}

DashboardBridge.prototype.getFileInfo = function () {var _c_this = this; var _c_root_method_arguments = arguments;
	if (arguments.length == 2 && ((arguments[0] instanceof Websom.Request) || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'string' || typeof arguments[1] == 'undefined' || arguments[1] === null)) {
		var req = arguments[0];
		var dir = arguments[1];
		if (req.session.get("dashboard") != null && ((new RegExp("\\.\\.")).test(dir) == false)) {
			var rtn = {};
			var files = [];
			var resolve = Oxygen.FileSystem.resolve(_c_this.server.config.root + "/" + dir);
			rtn["dir"] = dir;
			var reals = Oxygen.FileSystem.readDirSync(resolve);
			for (var i = 0; i < reals.length; i++) {
				var file = {};
				file["name"] = reals[i];
				file["isDir"] = Oxygen.FileSystem.isDir(resolve + "/" + reals[i]);
				files.push(file);
				}
			rtn["files"] = files;
			return rtn;
			}
	}
}

DashboardBridge.prototype.readFile = function () {var _c_this = this; var _c_root_method_arguments = arguments;
	if (arguments.length == 2 && ((arguments[0] instanceof Websom.Request) || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'string' || typeof arguments[1] == 'undefined' || arguments[1] === null)) {
		var req = arguments[0];
		var file = arguments[1];
		if (req.session.get("dashboard") != null && ((new RegExp("\\.\\.")).test(file) == false)) {
			var res = Oxygen.FileSystem.resolve(_c_this.server.config.root + "/" + file);
			if (Oxygen.FileSystem.exists(res)) {
				return Oxygen.FileSystem.readSync(res, "utf8");
				}
			}
	}
}

DashboardBridge.prototype.writePackFile = function () {var _c_this = this; var _c_root_method_arguments = arguments;
	if (arguments.length == 4 && ((arguments[0] instanceof Websom.Request) || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'string' || typeof arguments[1] == 'undefined' || arguments[1] === null) && (typeof arguments[2] == 'string' || typeof arguments[2] == 'undefined' || arguments[2] === null) && (typeof arguments[3] == 'string' || typeof arguments[3] == 'undefined' || arguments[3] === null)) {
		var req = arguments[0];
		var pack = arguments[1];
		var name = arguments[2];
		var content = arguments[3];
		if (req.session.get("dashboard") != null) {
			var res = Oxygen.FileSystem.resolve(_c_this.server.config.root + "/packs/" + pack + "/view/" + name);
			Oxygen.FileSystem.writeSync(res, content);
			}
	}
}

DashboardBridge.prototype.getContainers = function () {var _c_this = this; var _c_root_method_arguments = arguments;
	if (arguments.length == 1 && ((arguments[0] instanceof Websom.Request) || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var req = arguments[0];
		if (req.session.get("dashboard") != null) {
			var containers = [];
			for (var i = 0; i < _c_this.server.module.modules.length; i++) {
				var module = _c_this.server.module.modules[i];
				for (var c = 0; c < module.containers.length; c++) {
					var container = module.containers[c];
					var mp = {};
					mp["module"] = module.name;
					mp["name"] = container.name;
					containers.push(mp);
					}
				}
			return containers;
			}
	}
}

DashboardBridge.prototype.loadContainers = function () {var _c_this = this; var _c_root_method_arguments = arguments;
	if (arguments.length == 1 && ((arguments[0] instanceof Websom.Request) || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var req = arguments[0];
		if (req.session.get("dashboard") != null) {
			return _c_this.server.module.loadAllContainers();
			}
	}
}

DashboardBridge.prototype.exportResources = function () {var _c_this = this; var _c_root_method_arguments = arguments;
	if (arguments.length == 1 && ((arguments[0] instanceof Websom.Request) || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var req = arguments[0];
		if (req.session.get("dashboard") != null) {
			_c_this.server.resource.exportToFolder(_c_this.server.config.resources, function (hadError, errMsg) {
				console.log("Exported resources " + errMsg);
				});
			}
	}
}

DashboardBridge.prototype.rebuildAll = function () {var _c_this = this; var _c_root_method_arguments = arguments;
	if (arguments.length == 1 && ((arguments[0] instanceof Websom.Request) || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var req = arguments[0];
		if (req.session.get("dashboard") != null) {
			_c_this.server.module.rebuild();
			}
	}
}

DashboardBridge.prototype.getModules = function () {var _c_this = this; var _c_root_method_arguments = arguments;
	if (arguments.length == 1 && ((arguments[0] instanceof Websom.Request) || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var req = arguments[0];
		if (req.session.get("dashboard") != null) {
			var modules = [];
			for (var i = 0; i < _c_this.server.module.modules.length; i++) {
				var module = _c_this.server.module.modules[i];
				var mp = {};
				mp["name"] = module.name;
				mp["config"] = module.baseConfig;
				modules.push(mp);
				}
			return modules;
			}
	}
}

DashboardBridge.prototype.getBuilderViews = function () {var _c_this = this; var _c_root_method_arguments = arguments;
	if (arguments.length == 1 && ((arguments[0] instanceof Websom.Request) || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var req = arguments[0];
		if (req.session.get("dashboard") != null) {
			var views = [];
			var pages = [];
			var website = [];
			for (var i = 0; i < _c_this.server.view.views.length; i++) {
				var view = _c_this.server.view.views[i];
				var data = {};
				data["name"] = view.name;
				data["meta"] = view.meta;
				data["location"] = Websom.Path.relativePath(_c_this.server.config.root, view.location);
				if (view.isPage) {
					pages.push(data);
					}else if (view.websiteView) {
					website.push(data);
					}else{
						views.push(data);
					}
				}
			var moduleViews = _c_this.server.view.getModuleViews();
			for (var i = 0; i < moduleViews.length; i++) {
				var view = moduleViews[i];
				var data = {};
				data["name"] = view.name;
				data["meta"] = view.meta;
				data["module"] = view.owner.name;
				data["location"] = Websom.Path.relativePath(_c_this.server.config.root, view.location);
				if (view.isPage) {
					pages.push(data);
					}else if (view.websiteView) {
					website.push(data);
					}else{
						views.push(data);
					}
				}
			var output = {};
			output["views"] = views;
			output["pages"] = pages;
			output["website"] = website;
			return output;
			}
	}
}

DashboardBridge.prototype.getPacks = function () {var _c_this = this; var _c_root_method_arguments = arguments;
	if (arguments.length == 1 && ((arguments[0] instanceof Websom.Request) || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var req = arguments[0];
		if (req.session.get("dashboard") != null) {
			var packs = [];
			for (var i = 0; i < _c_this.server.pack.packs.length; i++) {
				var pack = _c_this.server.pack.packs[i];
				var data = {};
				data["name"] = pack.name;
				var dataViews = [];
				var views = pack.getViews();
				for (var j = 0; j < views.length; j++) {
					var view = views[j];
					var vData = {};
					vData["name"] = view.name;
					vData["meta"] = view.meta;
					vData["template"] = view.template;
					vData["client"] = view.client;
					vData["location"] = Websom.Path.relativePath(_c_this.server.config.root, view.location);
					vData["filename"] = Oxygen.FileSystem.basename(view.location);
					dataViews.push(vData);
					}
				data["views"] = dataViews;
				packs.push(data);
				}
			return packs;
			}
	}
}

DashboardBridge.prototype.getDatabaseFile = function () {var _c_this = this; var _c_root_method_arguments = arguments;
	if (arguments.length == 1 && ((arguments[0] instanceof Websom.Request) || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var req = arguments[0];
		if (req.session.get("dashboard") != null) {
			return Websom.Json.parse(Oxygen.FileSystem.readSync(_c_this.server.config.databaseFile, "utf8"));
			}
	}
}

DashboardBridge.prototype.setDatabaseFile = function () {var _c_this = this; var _c_root_method_arguments = arguments;
	if (arguments.length == 2 && ((arguments[0] instanceof Websom.Request) || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'string' || typeof arguments[1] == 'undefined' || arguments[1] === null)) {
		var req = arguments[0];
		var content = arguments[1];
		if (req.session.get("dashboard") != null) {
			Oxygen.FileSystem.writeSync(_c_this.server.config.databaseFile, content);
			}
	}
}

DashboardBridge.prototype.getBucketFile = function () {var _c_this = this; var _c_root_method_arguments = arguments;
	if (arguments.length == 1 && ((arguments[0] instanceof Websom.Request) || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var req = arguments[0];
		if (req.session.get("dashboard") != null) {
			return Websom.Json.parse(Oxygen.FileSystem.readSync(_c_this.server.config.bucketFile, "utf8"));
			}
	}
}

DashboardBridge.prototype.setBucketFile = function () {var _c_this = this; var _c_root_method_arguments = arguments;
	if (arguments.length == 2 && ((arguments[0] instanceof Websom.Request) || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'string' || typeof arguments[1] == 'undefined' || arguments[1] === null)) {
		var req = arguments[0];
		var content = arguments[1];
		if (req.session.get("dashboard") != null) {
			Oxygen.FileSystem.writeSync(_c_this.server.config.bucketFile, content);
			}
	}
}

DashboardBridge.prototype.login = function () {var _c_this = this; var _c_root_method_arguments = arguments;
	if (arguments.length == 3 && ((arguments[0] instanceof Websom.Request) || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'string' || typeof arguments[1] == 'undefined' || arguments[1] === null) && (typeof arguments[2] == 'string' || typeof arguments[2] == 'undefined' || arguments[2] === null)) {
		var req = arguments[0];
		var username = arguments[1];
		var password = arguments[2];
		var root = _c_this.server.dashboard.root;
		if (Oxygen.FileSystem.exists(root + "/auth.json") == false) {
			Oxygen.FileSystem.writeSync(root + "/auth.json", "{\n	\"username\": \"websom\",\n	\"password\": \"admin\"\n}");
			}
		var auth = Websom.Json.parse(Oxygen.FileSystem.readSync(root + "/auth.json", "utf8"));
		if (auth["username"] == username && auth["password"] == password) {
			req.session.set("dashboard", true);
			return _c_this.getInfo(req);
			}else{
				var msg = {};
				msg["hadError"] = true;
				msg["error"] = "Invalid username or password";
				return msg;
			}
	}
}

DashboardBridge.prototype.upload = function () {var _c_this = this; var _c_root_method_arguments = arguments;
	if (arguments.length == 3 && ((arguments[0] instanceof Websom.Request) || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'string' || typeof arguments[1] == 'undefined' || arguments[1] === null) && (arguments[2] instanceof Array || typeof arguments[2] == 'undefined' || arguments[2] === null)) {
		var req = arguments[0];
		var dir = arguments[1];
		var files = arguments[2];
		if (req.session.get("dashboard") != null && ((new RegExp("\\.\\.")).test(dir) == false)) {
			for (var i = 0; i < files.length; i++) {
				var name = files[i][0];
				var content = files[i][1];
				var res = Oxygen.FileSystem.resolve(_c_this.server.config.root + "/" + dir);
				var raw = "";
				
				
					raw = new Buffer(content, "base64");
				
				Oxygen.FileSystem.writeSync(res + "/" + name, raw);
				}
			return _c_this.getFileInfo(req, dir);
			}
	}
}

DashboardBridge.prototype.awaitInfo = function () {var _c_this = this; var _c_root_method_arguments = arguments;
	if (arguments.length == 0) {
		
			return this.getInfo();
		
	}
}

DashboardBridge.prototype.getName = function () {var _c_this = this; var _c_root_method_arguments = arguments;
	if (arguments.length == 0) {
		
		return this.name;
	}
}

DashboardBridge.prototype.getServerMethods = function () {var _c_this = this; var _c_root_method_arguments = arguments;
	if (arguments.length == 0) {
		
			return this.serverMethods();
		
		
	}
}

DashboardBridge.prototype.clientMethods = function () {var _c_this = this; var _c_root_method_arguments = arguments;
	if (arguments.length == 0) {
		var methods = {};
		methods["awaitInfo"] = "function () {\n\n			return this.getInfo();\n		\n}";
		return methods;
	}
}

DashboardBridge.prototype.serverMethods = function () {var _c_this = this; var _c_root_method_arguments = arguments;
	if (arguments.length == 0) {
		return ["getInfo", "getFileInfo", "readFile", "writePackFile", "getContainers", "loadContainers", "exportResources", "rebuildAll", "getModules", "getBuilderViews", "getPacks", "getDatabaseFile", "setDatabaseFile", "getBucketFile", "setBucketFile", "login", "upload"];
	}
}


module.exports = Websom.Standard.Dashboard.Module;