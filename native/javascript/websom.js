Websom = function () {var _c_this = this;


}

Websom.Server = function () {var _c_this = this;
	this.buckets = [];

	this.bucketReference = null;

	this.version = "1.0";

	this.security = null;

	this.module = null;

	this.resource = null;

	this.router = null;

	this.view = null;

	this.theme = null;

	this.database = null;

	this.input = null;

	this.crypto = null;

	this.email = null;

	this.render = null;

	this.pack = null;

	this.notification = null;

	this.confirmation = null;

	this.micro = null;

	this.adaptation = null;

	this.api = null;

	this.session = null;

	this.userSystem = null;

	this.config = null;

	this.configService = null;

	this.rawInputConfig = null;

	this.devDeploy = "development";

	this.scriptPath = "";

	this.websomRoot = "";

	this.apiHost = "http://localhost:8970";

	this.apiDomain = "localhost:8970";

	this.clientHost = "http://localhost:8080";

	this.clientDomain = "localhost:8080";

	this.websiteName = "Websom site";

	this.status = new Websom.Status();

	this.developmentServer = null;

	this.restartHandler = null;

	this.expressServer = null;

	this.bucketAdapter = null;

	this.bucket = null;

	this.buckets = [];

	if (arguments.length == 1 && ((arguments[0] instanceof Websom.Config) || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var config = arguments[0];
		
		
			this.scriptPath = __filename;
		
		_c_this.websomRoot = Oxygen.FileSystem.resolve(Oxygen.FileSystem.dirName(_c_this.scriptPath) + "/../../");
		_c_this.config = config;
		_c_this.config.legacy = true;
		
			this.startServices();
		
		
		if (_c_this.config.bucket) {
			if ("reference" in _c_this.config.bucket) {
				_c_this.bucketReference = _c_this.config.bucket["reference"];
				}
			}
	}
else 	if (arguments.length == 1 && (typeof arguments[0] == 'object' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var config = arguments[0];
		_c_this.rawInputConfig = config;
		
		
			this.scriptPath = __filename;
		
		var basePath = "./";
		if (config["base"]) {
			basePath = config["base"];
			}
		_c_this.websomRoot = Oxygen.FileSystem.resolve(Oxygen.FileSystem.dirName(_c_this.scriptPath) + "/../../");
		_c_this.config = new Websom.Config();
		
			const $path = require("path");

			this.config.absolute = $path.resolve(basePath);
			this.config.root = $path.resolve(basePath + "/" + config.assets);
		
		
		if ("dist" in config) {
			_c_this.config.javascriptOutput = Oxygen.FileSystem.resolve(basePath + "/" + config["dist"]);
			_c_this.config.cssOutput = Oxygen.FileSystem.resolve(basePath + "/" + config["dist"]);
			}
		if ("buckets" in config) {
			_c_this.config.devBuckets = Oxygen.FileSystem.resolve(basePath + "/" + config["buckets"]);
			}
		if ("dev" in config) {
			_c_this.config.dev = config["dev"] == true;
			}
		if ("headless" in config) {
			_c_this.config.headless = config["headless"] == true;
			}
		if ("openInBrowser" in config) {
			_c_this.config.openInBrowser = config["openInBrowser"] == true;
			}
		if ("verbose" in config) {
			_c_this.config.verbose = config["verbose"] == true;
			}
		if ("deploy" in config) {
			_c_this.devDeploy = config["deploy"];
			}
		if ("config" in config) {
			_c_this.config.configOverrides = Oxygen.FileSystem.resolve(basePath + "/" + config["config"]);
			var deploys = Oxygen.FileSystem.resolve(basePath + "/" + config["config"] + "/deploy.json");
			if (Oxygen.FileSystem.exists(deploys)) {
				_c_this.config.deploys = Websom.Json.parse(Oxygen.FileSystem.readSync(deploys, "utf8"));
				}
			if (_c_this.devDeploy != "development") {
				var deploy = _c_this.getDeploy(_c_this.devDeploy);
				if (deploy != null && deploy["useApi"]) {
					var data = Websom.Json.parse(Oxygen.FileSystem.readSync(Oxygen.FileSystem.resolve(_c_this.config.configOverrides + "/" + deploy["useApi"]), "utf8"));
					_c_this.apiHost = data["api"];
					_c_this.apiDomain = _c_this.apiHost.replace(new RegExp("https://".replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&'), 'g'), "").replace(new RegExp("http://".replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&'), 'g'), "");
					var splits = _c_this.apiDomain.split("/");
					_c_this.apiDomain = splits[0];
					}
				}
			}
		if ("name" in config) {
			_c_this.config.name = config["name"];
			}else{
				_c_this.config.name = "Unnamed dev server";
			}
		if (_c_this.config.dev) {
			if (Oxygen.FileSystem.exists(_c_this.config.devBuckets) == false) {
				Oxygen.FileSystem.makeDir(_c_this.config.devBuckets);
				}
			if (Oxygen.FileSystem.exists(_c_this.config.root) == false) {
				Oxygen.FileSystem.makeDir(_c_this.config.root);
				}
			if (_c_this.config.configOverrides.length > 0 && Oxygen.FileSystem.exists(_c_this.config.configOverrides) == false) {
				Oxygen.FileSystem.makeDir(_c_this.config.configOverrides);
				}
			if (Oxygen.FileSystem.exists(_c_this.config.javascriptOutput) == false) {
				Oxygen.FileSystem.makeDir(_c_this.config.javascriptOutput);
				}
			}
	}

}

Websom.Server.prototype.registerBucket = function (bucket) {var _c_this = this; var _c_root_method_arguments = arguments;
		if (_c_this.config.dev) {
			_c_this.bucket.registerBucket(bucket);
			}}

/*i async*/Websom.Server.prototype.registerServiceCollection = async function (collection) {var _c_this = this; var _c_root_method_arguments = arguments;
/*async*/
		if (_c_this.config.dev) {
/*async*/
			if (collection.appliedSchema != null) {
/*async*/
				(await collection.appliedSchema.register/* async call */());
				}
			}}

Websom.Server.prototype.getDeploy = function (name) {var _c_this = this; var _c_root_method_arguments = arguments;
		if (_c_this.config.deploys == null || _c_this.config.deploys["deploys"] == null) {
			return null;
			}
		var deploys = _c_this.config.deploys["deploys"];
		return deploys.find(function (d) {
			return d["name"] == name;
			});}

Websom.Server.prototype.adapt = function (name) {var _c_this = this; var _c_root_method_arguments = arguments;
		return _c_this.adaptation.adapt(name);}

Websom.Server.prototype.getConfigString = function (route, option) {var _c_this = this; var _c_root_method_arguments = arguments;
		return _c_this.configService.getString(route, option);}

Websom.Server.prototype.getConfigPrimitive = function (route, option) {var _c_this = this; var _c_root_method_arguments = arguments;
		return _c_this.configService.getPrimitive(route, option);}

Websom.Server.prototype.logException = function (e) {var _c_this = this; var _c_root_method_arguments = arguments;
		if (_c_this.config.dev) {
			
				const chalk = require("chalk");
				console.log("");
				console.log(chalk.white.bgRed.bold("--- ⚠️  Package Exception ⚠️  ---"));
				console.log("");
				console.log(chalk.red(e.stack));
				console.log("");
			
			
			}}

/*i async*/Websom.Server.prototype.startServices = async function () {var _c_this = this; var _c_root_method_arguments = arguments;
/*async*/
		_c_this.configService = new Websom.Services.Config(_c_this);
		_c_this.status.inherit(_c_this.configService.start());
		_c_this.api = new Websom.Services.API(_c_this);
		_c_this.adaptation = new Websom.Services.Adaptation(_c_this);
		_c_this.status.inherit(_c_this.adaptation.start());
		_c_this.database = new Websom.Services.Database(_c_this);
		_c_this.session = new Websom.Services.Session(_c_this);
		_c_this.security = new Websom.Services.Security(_c_this);
		_c_this.module = new Websom.Services.Module(_c_this);
		_c_this.theme = new Websom.Services.Theme(_c_this);
		_c_this.resource = new Websom.Services.Resource(_c_this);
		_c_this.view = new Websom.Services.View(_c_this);
		_c_this.router = new Websom.Services.Router(_c_this);
		_c_this.pack = new Websom.Services.Pack(_c_this);
		_c_this.input = new Websom.Services.Input(_c_this);
		_c_this.crypto = new Websom.Services.Crypto(_c_this);
		_c_this.email = new Websom.Services.Email(_c_this);
		_c_this.micro = new Websom.Services.Micro(_c_this);
		_c_this.render = new Websom.Services.Render(_c_this);
		_c_this.notification = new Websom.Services.Notification(_c_this);
		_c_this.confirmation = new Websom.Services.Confirmation(_c_this);
		_c_this.bucketAdapter = _c_this.adapt("bucket");
		_c_this.status.inherit(_c_this.confirmation.start());
		_c_this.status.inherit(_c_this.session.start());
		_c_this.status.inherit((await _c_this.module.start/* async call */()));
		if ((await _c_this.bucketAdapter.loadFromConfig/* async call */()) == false) {
/*async*/
			(await _c_this.bucketAdapter.load/* async call */(_c_this.module.getModule("coreModule"), "CoreModule.FileSystemBucket"));
			}
		_c_this.bucket = _c_this.bucketAdapter.adapter;
		(await _c_this.database.loadAdapter/* async call */());
		_c_this.status.inherit(_c_this.database.start());
		_c_this.configService.loadFromDatabase();
		_c_this.status.inherit(_c_this.security.start());
		_c_this.status.inherit(_c_this.resource.start());
		_c_this.status.inherit(_c_this.view.start());
		_c_this.status.inherit(_c_this.theme.start());
		if (_c_this.config.legacy == false) {
/*async*/
			_c_this.configService.gatherOptions();
			(await _c_this.module.startModules/* async call */());
			}
		(await _c_this.session.collection/* async call */());
		_c_this.status.inherit(_c_this.router.start());
		_c_this.status.inherit(_c_this.pack.start());
		_c_this.status.inherit(_c_this.input.start());
		_c_this.status.inherit(_c_this.crypto.start());
		_c_this.status.inherit(_c_this.email.start());
		_c_this.status.inherit(_c_this.micro.start());
		_c_this.status.inherit(_c_this.render.start());
		_c_this.status.inherit((await _c_this.notification.start/* async call */()));
		_c_this.status.inherit(_c_this.api.start());}

Websom.Server.prototype.command = function (name) {var _c_this = this; var _c_root_method_arguments = arguments;
		return _c_this.micro.command.register(name);}

Websom.Server.prototype.injectExpression = function (src) {var _c_this = this; var _c_root_method_arguments = arguments;
		_c_this.router.injectScript = src;}

Websom.Server.prototype.getBucketFromReference = function (referenceName) {var _c_this = this; var _c_root_method_arguments = arguments;
		if (referenceName in _c_this.bucketReference) {
			return _c_this.getBucket(_c_this.bucketReference[referenceName]["bucket"]);
			}
		return null;}

Websom.Server.prototype.log = function (value) {var _c_this = this; var _c_root_method_arguments = arguments;
		
			console.log(value);
		}

Websom.Server.prototype.request = function (url) {var _c_this = this; var _c_root_method_arguments = arguments;
		return new Websom.RequestChain(_c_this, url);}

Websom.Server.prototype.getBucket = function (name) {var _c_this = this; var _c_root_method_arguments = arguments;
		for (var i = 0; i < _c_this.buckets.length; i++) {
			if (_c_this.buckets[i].name == name) {
				return _c_this.buckets[i];
				}
			}
		var buckets = _c_this.config.bucket["buckets"];
		if (name in buckets) {
			return _c_this.loadBucket(name, buckets[name]);
			}}

Websom.Server.prototype.loadBucket = function (name, raw) {var _c_this = this; var _c_root_method_arguments = arguments;
		var type = raw["type"];
		var bucket = Websom.Bucket.make(_c_this, name, type, raw);
		_c_this.buckets.push(bucket);
		return bucket;}

/*i async*/Websom.Server.prototype.spawnRealServer = async function () {var _c_this = this; var _c_root_method_arguments = arguments;
/*async*/
		_c_this.developmentServer = new Websom.Server(_c_this.rawInputConfig);
		(await _c_this.developmentServer.start/* async call */());
		_c_this.developmentServer.restartHandler = async function () {
/*async*/
			console.log("Restarting websom server");
			(await _c_this.developmentServer.stop/* async call */());
			(await _c_this.spawnRealServer/* async call */());
			};}

/*i async*/Websom.Server.prototype.startDevelopmentServer = async function () {var _c_this = this; var _c_root_method_arguments = arguments;
/*async*/
		(await _c_this.spawnRealServer/* async call */());
		_c_this.startWebpackServer(8080, 8970);}

/*i async*/Websom.Server.prototype.start = async function () {var _c_this = this; var _c_root_method_arguments = arguments;
	if (arguments.length == 0) {
/*async*/
		(await _c_this.start/* async call */(8080, 8970));
	}
else 	if (arguments.length == 2 && (typeof arguments[0] == 'number' || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'number' || typeof arguments[1] == 'undefined' || arguments[1] === null)) {
		var uiPort = arguments[0];
		var apiPort = arguments[1];
/*async*/
		(await _c_this.startServices/* async call */());
		if (_c_this.config.dev) {
			
				this.startAPI(apiPort);
			
			
			}else{

			}
	}
}

/*i async*/Websom.Server.prototype.stop = async function () {var _c_this = this; var _c_root_method_arguments = arguments;
/*async*/
		
			if (this.expressServer !== null)
				this.expressServer.close();
		
		_c_this.api.stop();
		(await _c_this.adaptation.stop/* async call */());
		_c_this.database.stop();
		_c_this.session.stop();
		_c_this.security.stop();
		_c_this.module.stop();
		_c_this.theme.stop();
		_c_this.resource.stop();
		_c_this.view.stop();
		_c_this.router.stop();
		_c_this.pack.stop();
		_c_this.input.stop();
		_c_this.crypto.stop();
		_c_this.email.stop();
		_c_this.micro.stop();
		_c_this.render.stop();
		_c_this.notification.stop();
		_c_this.confirmation.stop();}

Websom.Server.prototype.sendResponse = function (response) {var _c_this = this; var _c_root_method_arguments = arguments;
}

Websom.Server.prototype.makeRequestFromExpress = function (req) {var _c_this = this; var _c_root_method_arguments = arguments;
		
			var client = new Websom.Client(req.socket.remoteAddress, req.socket.remotePort);
			
			client.family = req.socket.remoteFamily;
			client.localAddress = req.socket.localAddress;
			client.localPort = req.socket.localPort;

			var websomRequest = new Websom.Request(this, client);
			websomRequest.path = req.path;
			websomRequest.cookies = req.cookies;
			websomRequest.headers = req.headers;
			websomRequest.body = req.body;
			websomRequest.jsRequest = req;

			return websomRequest;
		}

Websom.Server.prototype.expressAPIOptionsRequest = function (req, res, path) {var _c_this = this; var _c_root_method_arguments = arguments;
		
			res.header("Access-Control-Allow-Origin", "*");
			res.setHeader("Access-Control-Allow-Headers", "*");
			res.setHeader("X-Powered-By", "Websom");
			res.send("POST");
		}

Websom.Server.prototype.expressAPIRequest = function (req, res, path, method) {var _c_this = this; var _c_root_method_arguments = arguments;
		
			var client = new Websom.Client(req.socket.remoteAddress, req.socket.remotePort);
			
			client.family = req.socket.remoteFamily;
			client.localAddress = req.socket.localAddress;
			client.localPort = req.socket.localPort;

			var websomRequest = new Websom.Request(this, client);
			websomRequest.path = decodeURIComponent(path);
			websomRequest.cookies = req.cookies;
			websomRequest.headers = req.headers;
			websomRequest.body = req.body;
			websomRequest.files = {};
			for (let file in req.files) websomRequest.files[file] = req.files[file].file;
			websomRequest.response.jsResponse = res;
			websomRequest.jsRequest = req;
			
			res.setHeader("X-Powered-By", "Websom");
			res.setHeader("Access-Control-Allow-Origin", "*");
			res.setHeader("Access-Control-Allow-Headers", "*");
			res.setHeader("Access-Control-Expose-Headers", "X-Set-Session");

			this.processAPIRequest(websomRequest, method);
		}

Websom.Server.prototype.startAPI = function (port) {var _c_this = this; var _c_root_method_arguments = arguments;
		
			const express = require("express");
			const busboy = require("express-busboy");
			const cookieParser = require("cookie-parser");
			const crypto = require("crypto");

			let server = express();
			
			                                
			busboy.extend(server, {
				upload: true
			});

			server.use(cookieParser());

			server.options(/.*/, (req, res) => {
				this.expressAPIOptionsRequest(req, res, req.path);
			});

			server.post(/.*/, (req, res) => {
				this.expressAPIRequest(req, res, req.path, "post");
			});

			server.get(/.*/, (req, res) => {
				this.expressAPIRequest(req, res, req.path, "get");
			});

			this.expressServer = server.listen(port);

			console.log("API server listening on port " + port);
		}

/*i async*/Websom.Server.prototype.processAPIRequest = async function (req, method) {var _c_this = this; var _c_root_method_arguments = arguments;
/*async*/
		var apiPass = false;
		if (method == "post") {
/*async*/
			apiPass = (await _c_this.api.request/* async call */(req));
			}else if (method == "get") {
/*async*/
			apiPass = (await _c_this.api.getRequest/* async call */(req));
			}
		if (apiPass == false) {
/*async*/
			(await req.end/* async call */("No endpoint here..."));
			}}

Websom.Server.prototype.startWebpackServer = function (uiPort, apiPort) {var _c_this = this; var _c_root_method_arguments = arguments;
		
			const nodeDevPlatform = require(_c_this.websomRoot + "/platform/node/index.js");
			
			if (!_c_this.config.headless)
				nodeDevPlatform.startWebsomDevelopmentServer(() => {
					return this.developmentServer || this;
				}, uiPort, apiPort);
		}

Websom.Server.prototype.listen = function (port) {var _c_this = this; var _c_root_method_arguments = arguments;
		
			var that = this;
			
			const express = require("express");
			const session = require("express-session");
			const fileStore = require("session-file-store")(session);
			const bodyParser = require("body-parser");
			const multer = require("multer");
			const crypto = require("crypto");
			const fs = require("fs");

			var server = express();
			if (!this.config.gzip) {
				server.use("/resources", express.static(this.config.resources));
			}else{
				server.use("/resources", require("express-static-gzip")(this.config.resources));
			}
			
			var sessionSecret = crypto.randomBytes(64).toString('hex');
			
			if (!fs.existsSync(this.config.root + "/secret.txt"))
				fs.writeFileSync(this.config.root + "/secret.txt", sessionSecret);
			else
				sessionSecret = fs.readFileSync(this.config.root + "/secret.txt", "utf8");

			var secure = false;

			if (this.config.https)
				secure = true;

			server.use(session({
				secret: sessionSecret,
				store: new fileStore(),
				resave: false,
				cookie: {
					secure: secure
				}
			}));

			server.get(/.*/, (req, res) => {
				if (that.config.dev)
					if (that.status.hadError) {
						console.log(that.status.display());
						that.status.clear();
					}
				
				var client = new Websom.Client(req.socket.remoteAddress, req.socket.remotePort);
				
				client.family = req.socket.remoteFamily;
				client.localAddress = req.socket.localAddress;
				client.localPort = req.socket.localPort;

				var websomRequest = new Websom.Request(that, client);
				websomRequest.path = req.path;
				websomRequest.response.jsResponse = res;
				websomRequest.jsRequest = req;
				that.router.handle(websomRequest);
			});

			server.post(/^((?!\/postInput|\/postBridge|\/postInputM).)*$/, bodyParser.urlencoded({limit: '160mb', extended: true}), (req, res) => {
				if (!req.body) {
					res.sendStatus(400);
					res.send("Invalid post");
				}else{
					var client = new Websom.Client(req.socket.remoteAddress, req.socket.remotePort);
			
					client.family = req.socket.remoteFamily;
					client.localAddress = req.socket.localAddress;
					client.localPort = req.socket.localPort;
					
					var websomRequest = new Websom.Request(that, client);
					websomRequest.path = req.path;
					websomRequest.response.jsResponse = res;
					websomRequest.jsRequest = req;
					that.router.handlePost(req.body, websomRequest);
				}
			});

			server.post("/postInput", bodyParser.urlencoded({limit: '160mb', extended: true}), (req, res) => {
				if (!req.body) {
					res.sendStatus(400);
					res.send("Invalid post");                                          
				}else{
					if (("inputKey" in req.body) && typeof req.body.inputKey == "string" && req.body.inputKey.length > 0 && req.body.inputKey.length < 2048 && ("data" in req.body)) {
						var client = new Websom.Client(req.socket.remoteAddress, req.socket.remotePort);
				
						client.family = req.socket.remoteFamily;
						client.localAddress = req.socket.localAddress;
						client.localPort = req.socket.localPort;
						
						var websomRequest = new Websom.Request(that, client);
						websomRequest.path = req.path;
						websomRequest.response.jsResponse = res;
						websomRequest.jsRequest = req;
						this.input.handle(req.body.inputKey, req.body.data, websomRequest);
					}else{
						res.sendStatus(400);
						res.send("Invalid post");
					}
				}
			});

			server.post("/postInputM", multer({dest: "/tmp", limits: {files: 50, fileSize: 1024 * 1024 * 160}}).any(), (req, res) => {                  
				if (!req.body) {
					res.sendStatus(400);
					res.send("Invalid post");                                          
				}else{
					if (("inputKey" in req.body) && typeof req.body.inputKey == "string" && req.body.inputKey.length > 0 && req.body.inputKey.length < 2048 && ("data" in req.body) && typeof req.body.data == "string") {
						var client = new Websom.Client(req.socket.remoteAddress, req.socket.remotePort);
				
						client.family = req.socket.remoteFamily;
						client.localAddress = req.socket.localAddress;
						client.localPort = req.socket.localPort;
						
						var websomRequest = new Websom.Request(that, client);
						websomRequest.path = req.path;
						websomRequest.response.jsResponse = res;
						websomRequest.jsRequest = req;
						let data = req.body.data;

						try {
							data = JSON.parse(data);
						}catch (e) {
							res.sendStatus(400);
							res.send("Invalid post");

							return;
						}

						this.input.handle(req.body.inputKey, data, websomRequest);
					}else{
						                                
                                 
                             
         
         
						res.sendStatus(400);
						res.send("Invalid post");
					}
				}
			});

			server.post("/postBridge", bodyParser.urlencoded({limit: '160mb', extended: true}), (req, res) => {
				if (!req.body) {
					res.sendStatus(400);
					res.send("Invalid post");                                          
				}else{
					if (("bridge" in req.body) && typeof req.body.bridge == "string" && req.body.bridge.length > 0 && req.body.bridge.length < 2048 &&
						("method" in req.body) && typeof req.body.method == "string" && req.body.method.length > 0 && req.body.method.length < 2048) {
						var client = new Websom.Client(req.socket.remoteAddress, req.socket.remotePort);
				
						client.family = req.socket.remoteFamily;
						client.localAddress = req.socket.localAddress;
						client.localPort = req.socket.localPort;
						
						var websomRequest = new Websom.Request(that, client);
						websomRequest.path = req.path;
						websomRequest.response.jsResponse = res;
						websomRequest.jsRequest = req;
						this.module.handleBridge(websomRequest, req.body.bridge, req.body.method, req.body.arguments || []);
					}
				}
			});

			server.listen(port);
		
		}

Websom.Server.prototype.run = function (route) {var _c_this = this; var _c_root_method_arguments = arguments;
		}

//Relative Carbon
//Relative Context
//Relative Error
//Relative FileSystem
Memory = function () {var _c_this = this;


}

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
Websom.Adapters = function () {var _c_this = this;


}

Websom.Service = function (server) {var _c_this = this;
	this.server = null;

		_c_this.server = server;
		_c_this.preStart();
}

Websom.Service.prototype.preStart = function () {var _c_this = this; var _c_root_method_arguments = arguments;
}

Websom.Service.prototype.start = function () {var _c_this = this; var _c_root_method_arguments = arguments;
}

Websom.Service.prototype.stop = function () {var _c_this = this; var _c_root_method_arguments = arguments;
}

Websom.Service.prototype.end = function () {var _c_this = this; var _c_root_method_arguments = arguments;
}

Websom.Services = function () {var _c_this = this;


}

Oxygen = function () {var _c_this = this;


}

Websom.Services.Adaptation = function (server) {var _c_this = this;
	this.interfaces = [];

	this.server = null;

		_c_this.server = server;
		_c_this.preStart();
}

Websom.Services.Adaptation.prototype.start = function () {var _c_this = this; var _c_root_method_arguments = arguments;
}

/*i async*/Websom.Services.Adaptation.prototype.stop = async function () {var _c_this = this; var _c_root_method_arguments = arguments;
/*async*/
		(await _c_this.shutdown/* async call */());}

/*i async*/Websom.Services.Adaptation.prototype.end = async function () {var _c_this = this; var _c_root_method_arguments = arguments;
/*async*/
		(await _c_this.shutdown/* async call */());}

/*i async*/Websom.Services.Adaptation.prototype.shutdown = async function () {var _c_this = this; var _c_root_method_arguments = arguments;
/*async*/
		for (var i = 0; i < _c_this.interfaces.length; i++) {
/*async*/
			var interface = _c_this.interfaces[i];
			if (interface.adapter != null) {
/*async*/
				(await interface.adapter.shutdown/* async call */());
				}
			}}

Websom.Services.Adaptation.prototype.adapt = function (name) {var _c_this = this; var _c_root_method_arguments = arguments;
		var interface = new Websom.AdapterInterface(_c_this.server, name);
		_c_this.interfaces.push(interface);
		return interface;}

Websom.Services.Adaptation.prototype.preStart = function () {var _c_this = this; var _c_root_method_arguments = arguments;
}

Websom.AdapterInterface = function (server, name) {var _c_this = this;
	this.server = null;

	this.adapter = null;

	this.name = "";

		_c_this.server = server;
		_c_this.name = name;
		if (_c_this.server.config.verbose) {
			console.log("Setup adapter " + name);
			}
}

/*i async*/Websom.AdapterInterface.prototype.load = async function (mod, className) {var _c_this = this; var _c_root_method_arguments = arguments;
/*async*/
		
			let splits = className.split(".");
			let cls = mod.pullFromGlobalScope(splits[0]);
			for (let i = 1; i < splits.length; i++)
				cls = cls[splits[i]];

			this.adapter = new cls(this.server);
		
		
		(await _c_this.adapter.initialize/* async call */());}

/*i async*/Websom.AdapterInterface.prototype.loadAsBranchAdapter = async function (branchName) {var _c_this = this; var _c_root_method_arguments = arguments;
/*async*/
		if (_c_this.server.config.verbose) {
			console.log("Searching for adapter: " + _c_this.name + ", found: " + branchName);
			}
		var selectedModule = null;
		var selectedClass = "";
		for (var i = 0; i < _c_this.server.module.modules.length; i++) {
			var mod = _c_this.server.module.modules[i];
			var adapters = mod.baseConfig["adapters"];
			if (adapters != null) {
				var opts = adapters[branchName];
				if (opts != null) {
					var cls = opts["class"];
					selectedModule = mod;
					selectedClass = cls;
					}
				}
			}
		if (selectedClass == "") {
			return false;
			}
		(await _c_this.load/* async call */(selectedModule, selectedClass));
		return true;}

/*i async*/Websom.AdapterInterface.prototype.loadFromConfig = async function () {var _c_this = this; var _c_root_method_arguments = arguments;
/*async*/
		var adapterName = _c_this.server.configService.getString("adapters", _c_this.name);
		if (_c_this.server.config.verbose) {
			console.log("Searching for adapter: " + _c_this.name + ", found: " + adapterName);
			}
		var selectedModule = null;
		var selectedClass = "";
		for (var i = 0; i < _c_this.server.module.modules.length; i++) {
			var mod = _c_this.server.module.modules[i];
			var adapters = mod.baseConfig["adapters"];
			if (adapters != null) {
				var opts = adapters[adapterName];
				if (opts != null) {
					var cls = opts["class"];
					selectedModule = mod;
					selectedClass = cls;
					}
				}
			}
		if (selectedClass == "") {
			if (_c_this.server.config.verbose) {
				console.log("No adapter found for '" + _c_this.name + "'");
				}
			return false;
			}
		(await _c_this.load/* async call */(selectedModule, selectedClass));
		return true;}

Websom.Services.API = function (server) {var _c_this = this;
	this.baseRoute = "/api/v1";

	this.collections = [];

	this.interfaces = [];

	this.getInterfaces = [];

	this.chains = [];

	this.getChains = [];

	this.handlers = {};

	this.server = null;

		_c_this.server = server;
		_c_this.preStart();
}

Websom.Services.API.prototype.start = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		_c_this.registerEndpointHandler("select", new Websom.SelectHandler(_c_this.server));
		_c_this.registerEndpointHandler("insert", new Websom.InsertHandler(_c_this.server));
		_c_this.registerEndpointHandler("delete", new Websom.DeleteHandler(_c_this.server));}

Websom.Services.API.prototype.registerEndpointHandler = function (key, handler) {var _c_this = this; var _c_root_method_arguments = arguments;
		_c_this.handlers[key] = handler;}

Websom.Services.API.prototype.resolveEndpoint = function (path) {var _c_this = this; var _c_root_method_arguments = arguments;
		var splits = path.split("/");
		for (var i = 0; i < _c_this.collections.length; i++) {
			var collection = _c_this.collections[i];
			var basePathSplit = collection.baseRoute.split("/");
			if (splits.length < basePathSplit.length) {
				continue;
				}
			var pass = true;
			for (var j = 0; j < basePathSplit.length; j++) {
				if (basePathSplit[j] != splits[j]) {
					pass = false;
					}
				}
			if (pass) {
				for (var k = 0; k < collection.routes.length; k++) {
					var route = collection.routes[k];
					var endpointSplits = route.route.split("/");
					var eBase = 1;
					var bpBase = splits.length - 1;
					var finalPass = true;
					for (var bp = 0; bp < endpointSplits.length; bp++) {
						if (bp + eBase >= endpointSplits.length) {
							break;
							}
						if (endpointSplits[bp + eBase] != splits[bp + bpBase]) {
							finalPass = false;
							}
						}
					if (finalPass) {
						return route;
						}
					}
				}
			}
		return null;}

Websom.Services.API.prototype.hit = function () {var _c_this = this; var _c_root_method_arguments = arguments;
	if (arguments.length == 3 && ((arguments[0] instanceof Websom.Request || (arguments[0] instanceof Websom.SinkRequest)) || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'string' || typeof arguments[1] == 'undefined' || arguments[1] === null) && (typeof arguments[2] == 'object' || typeof arguments[2] == 'undefined' || arguments[2] === null)) { 		var identity = arguments[0];
		var route = arguments[1];
		var body = arguments[2];

return new Promise((_c_resolve, _c_reject) => {		
			let sink = new Websom.SinkRequest(this.server, identity.client, (raw) => {
				let body = JSON.parse(raw);
				_c_resolve(body); return;
			});

			sink.copyIdentity(identity);

			sink.path = route;
			sink.body = body;

			this.request(sink);
		
 }); }
else 	if (arguments.length == 2 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'object' || typeof arguments[1] == 'undefined' || arguments[1] === null)) { 		var route = arguments[0];
		var body = arguments[1];

return new Promise((_c_resolve, _c_reject) => {		
			let sink = new Websom.SinkRequest(this.server, new Websom.Client("::1", ""), (raw) => {
				let body = JSON.parse(raw);
				_c_resolve(body); return;
			});

			sink.path = route;
			sink.body = body;

			this.request(sink);
		
 }); }
}

Websom.Services.API.prototype.compareRoute = function (base, request) {var _c_this = this; var _c_root_method_arguments = arguments;
		var splits = base.split("/");
		var reqSplits = request.split("/");
		for (var i = 0; i < splits.length; i++) {
			if (splits[i].length == 0) {
				continue;
				}
			if (reqSplits.length < i) {
				return false;
				}
			if (splits[i] == "*") {
				return true;
				}
			if (splits[i][0] != ":") {
				if (splits[i] != reqSplits[i]) {
					return false;
					}
				}
			}
		return true;}

/*i async*/Websom.Services.API.prototype.getRequest = async function (req) {var _c_this = this; var _c_root_method_arguments = arguments;
/*async*/
		for (var i = 0; i < _c_this.getInterfaces.length; i++) {
			var interface = _c_this.getInterfaces[i];
			if (_c_this.compareRoute(interface.route, req.path)) {
				interface.handler(req);
				return true;
				}
			}
		for (var i = 0; i < _c_this.getChains.length; i++) {
/*async*/
			var chain = _c_this.getChains[i];
			if (_c_this.compareRoute(chain.route, req.path)) {
/*async*/
				(await chain.handle/* async call */(req));
				return true;
				}
			}
		return false;}

/*i async*/Websom.Services.API.prototype.request = async function (req) {var _c_this = this; var _c_root_method_arguments = arguments;
/*async*/
		for (var i = 0; i < _c_this.interfaces.length; i++) {
			var interface = _c_this.interfaces[i];
			if (_c_this.compareRoute(interface.route, req.path)) {
				interface.handler(req);
				return true;
				}
			}
		for (var i = 0; i < _c_this.chains.length; i++) {
/*async*/
			var chain = _c_this.chains[i];
			if (_c_this.compareRoute(chain.route, req.path)) {
/*async*/
				(await chain.handle/* async call */(req));
				return true;
				}
			}
		var route = _c_this.resolveEndpoint(req.path);
		if (route == null) {
			return false;
			}
		var collection = route.collection;
		(await _c_this.handleRequest/* async call */(collection, route, req));
		return true;}

/*i async*/Websom.Services.API.prototype.handleRequest = async function (ci, cir, req) {var _c_this = this; var _c_root_method_arguments = arguments;
/*async*/
		if ((cir.executes in _c_this.handlers)) {
			var handler = _c_this.handlers[cir.executes];
			handler.fulfill(cir, req);
			}else{
/*async*/
				(await req.endWithError/* async call */("Non existent endpoint handler " + cir.executes));
			}}

Websom.Services.API.prototype.interface = function (collection, baseRoute) {var _c_this = this; var _c_root_method_arguments = arguments;
		var ci = new Websom.CollectionInterface(collection, baseRoute);
		_c_this.collections.push(ci);
		return ci;}

Websom.Services.API.prototype.route = function () {var _c_this = this; var _c_root_method_arguments = arguments;
	if (arguments.length == 2 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'function' || typeof arguments[1] == 'undefined' || arguments[1] === null)) {
		var route = arguments[0];
		var handler = arguments[1];
		_c_this.interfaces.push(new Websom.PlainInterface(route, handler));
	}
else 	if (arguments.length == 1 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var route = arguments[0];
		var chain = new Websom.APIChain(_c_this.server, route);
		_c_this.chains.push(chain);
		return chain;
	}
}

Websom.Services.API.prototype.get = function () {var _c_this = this; var _c_root_method_arguments = arguments;
	if (arguments.length == 2 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'function' || typeof arguments[1] == 'undefined' || arguments[1] === null)) {
		var route = arguments[0];
		var handler = arguments[1];
		_c_this.getInterfaces.push(new Websom.PlainInterface(route, handler));
	}
else 	if (arguments.length == 1 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var route = arguments[0];
		var chain = new Websom.APIChain(_c_this.server, route);
		_c_this.getChains.push(chain);
		return chain;
	}
}

Websom.Services.API.prototype.gatherEndpoints = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		var mp = {};
		for (var i = 0; i < _c_this.collections.length; i++) {
			var collection = _c_this.collections[i];
			for (var r = 0; r < collection.routes.length; r++) {
				var route = collection.routes[r];
				var key = collection.baseRoute + route.route;
				var writes = {};
				for (var w = 0; w < route.writes.length; w++) {
					var write = route.writes[w];
					writes[write.field] = write.exposeToClient();
					}
				mp[key] = {};
				mp[key]["writes"] = writes;
				}
			}
		return mp;}

Websom.Services.API.prototype.preStart = function () {var _c_this = this; var _c_root_method_arguments = arguments;
}

Websom.Services.API.prototype.stop = function () {var _c_this = this; var _c_root_method_arguments = arguments;
}

Websom.Services.API.prototype.end = function () {var _c_this = this; var _c_root_method_arguments = arguments;
}

Websom.APIContext = function (req) {var _c_this = this;
	this.request = null;

	this.inputs = {};

		_c_this.request = req;
}

Websom.APIContext.prototype.get = function (key) {var _c_this = this; var _c_root_method_arguments = arguments;
		return _c_this.inputs[key];}

Websom.APIContext.prototype.set = function (key, value) {var _c_this = this; var _c_root_method_arguments = arguments;
		_c_this.inputs[key] = value;}

Websom.APIChain = function (server, route) {var _c_this = this;
	this.authenticators = [];

	this.inputs = [];

	this.route = "";

	this.handler = null;

	this.server = null;

		_c_this.server = server;
		_c_this.route = route;
}

Websom.APIChain.prototype.auth = function () {var _c_this = this; var _c_root_method_arguments = arguments;
	if (arguments.length == 1 && ((arguments[0] instanceof Websom.Permission) || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var permission = arguments[0];
		var perm = new Websom.PermissionAuthenticator(permission);
		perm.server = _c_this.server;
		_c_this.authenticators.push(perm);
		return _c_this;
	}
else 	if (arguments.length == 1 && (typeof arguments[0] == 'function' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var func = arguments[0];
		var auth = new Websom.FunctionAuthenticator(func);
		auth.server = _c_this.server;
		_c_this.authenticators.push(auth);
		return _c_this;
	}
}

Websom.APIChain.prototype.input = function () {var _c_this = this; var _c_root_method_arguments = arguments;
	if (arguments.length == 1 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var field = arguments[0];
		_c_this.inputs.push(new Websom.CollectionInterfaceWrite(field, null));
		return _c_this;
	}
else 	if (arguments.length == 2 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null) && ((arguments[1] instanceof Array || typeof arguments[1] == 'boolean' || typeof arguments[1] == 'string' || typeof arguments[1] == 'number' || typeof arguments[1] == 'number' || typeof arguments[1] == 'object' || typeof arguments[1] == 'string') || typeof arguments[1] == 'undefined' || arguments[1] === null)) {
		var field = arguments[0];
		var defaultValue = arguments[1];
		_c_this.inputs.push(new Websom.CollectionInterfaceWrite(field, defaultValue));
		return _c_this;
	}
}

Websom.APIChain.prototype.type = function (type) {var _c_this = this; var _c_root_method_arguments = arguments;
		_c_this.inputs[_c_this.inputs.length - 1].type = type;
		return _c_this;}

Websom.APIChain.prototype.limit = function (min, max) {var _c_this = this; var _c_root_method_arguments = arguments;
		return _c_this.restrict(new Websom.Restrictions.Limit(min, max));}

Websom.APIChain.prototype.format = function (format) {var _c_this = this; var _c_root_method_arguments = arguments;
		return _c_this.restrict(new Websom.Restrictions.Format(format));}

Websom.APIChain.prototype.regexTest = function (reg) {var _c_this = this; var _c_root_method_arguments = arguments;
		return _c_this.restrict(new Websom.Restrictions.Regex(reg));}

Websom.APIChain.prototype.restrict = function () {var _c_this = this; var _c_root_method_arguments = arguments;
	if (arguments.length == 1 && ((arguments[0] instanceof Websom.Restriction || (arguments[0] instanceof Websom.Restrictions.Limit) || (arguments[0] instanceof Websom.Restrictions.Unique) || (arguments[0] instanceof Websom.Restrictions.Format) || (arguments[0] instanceof Websom.Restrictions.Regex) || (arguments[0] instanceof Websom.Restrictions.Function)) || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var restriction = arguments[0];
		_c_this.inputs[_c_this.inputs.length - 1].restrictions.push(restriction);
		return _c_this;
	}
else 	if (arguments.length == 1 && (typeof arguments[0] == 'function' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var func = arguments[0];
		return _c_this.restrict(new Websom.Restrictions.Function(func));
	}
}

Websom.APIChain.prototype.executes = function (func) {var _c_this = this; var _c_root_method_arguments = arguments;
		_c_this.handler = func;}

/*i async*/Websom.APIChain.prototype.handle = async function (req) {var _c_this = this; var _c_root_method_arguments = arguments;
/*async*/
		for (var i = 0; i < _c_this.authenticators.length; i++) {
/*async*/
			var auth = _c_this.authenticators[i];
			if ((await auth.authenticate/* async call */(req)) == false) {
/*async*/
				(await req.endWithError/* async call */(auth.errorMessage(req)));
				return null;
				}
			}
		var ctx = new Websom.APIContext(req);
		for (var i = 0; i < _c_this.inputs.length; i++) {
/*async*/
			var input = _c_this.inputs[i];
			if ((input.field in req.body) == false) {
/*async*/
				if (input.defaultValue == null) {
/*async*/
					(await req.endWithError/* async call */(input.field + " is required"));
					return null;
					}else{
						ctx.set(input.field, input.defaultValue);
						continue;
					}
				}
			var value = req.body[input.field];
			if (_c_this.server.security.typeCheck(value, input.type) == false) {
/*async*/
				if ((typeof value == 'object' ? (Array.isArray(value) ? 'array' : 'map') : (typeof value == 'number' ? 'float' : typeof value)) == "float" && input.type == "string") {
					var val = value;
					value = val.toString();
					}else{
/*async*/
						(await req.endWithError/* async call */("Invalid type on field " + input.field));
						return null;
					}
				}
			for (var r = 0; r < input.restrictions.length; r++) {
/*async*/
				var restriction = input.restrictions[r];
				try {
/*async*/
					var field = new Websom.Adapters.Database.Field(input.field, input.type);
					if ((await restriction.testServer/* async call */(null, field, value)) == false) {
/*async*/
						(await req.endWithError/* async call */(restriction.message(input.field, value)));
						return null;
						}
				} catch (_carb_catch_var) {
					if (_carb_catch_var instanceof Error || typeof _carb_catch_var == 'undefined' || _carb_catch_var === null) {
						var e = _carb_catch_var;
/*async*/
					_c_this.server.logException(e);
					(await req.endWithError/* async call */("Exception in restriction"));
					return null;
					}
				}
				}
			ctx.set(input.field, value);
			}
		try {
			_c_this.handler(ctx);
		} catch (_carb_catch_var) {
			if (_carb_catch_var instanceof Error || typeof _carb_catch_var == 'undefined' || _carb_catch_var === null) {
				var e = _carb_catch_var;
/*async*/
			_c_this.server.logException(e);
			(await req.endWithError/* async call */("Server exception"));
			}
		}}

Websom.Services.Builder = function (server) {var _c_this = this;
	this.server = null;

		_c_this.server = server;
		_c_this.preStart();
}

Websom.Services.Builder.prototype.buildAll = function () {var _c_this = this; var _c_root_method_arguments = arguments;
}

Websom.Services.Builder.prototype.buildClass = function () {var _c_this = this; var _c_root_method_arguments = arguments;
}

Websom.Services.Builder.prototype.buildView = function () {var _c_this = this; var _c_root_method_arguments = arguments;
}

Websom.Services.Builder.prototype.buildResource = function () {var _c_this = this; var _c_root_method_arguments = arguments;
}

Websom.Services.Builder.prototype.preStart = function () {var _c_this = this; var _c_root_method_arguments = arguments;
}

Websom.Services.Builder.prototype.start = function () {var _c_this = this; var _c_root_method_arguments = arguments;
}

Websom.Services.Builder.prototype.stop = function () {var _c_this = this; var _c_root_method_arguments = arguments;
}

Websom.Services.Builder.prototype.end = function () {var _c_this = this; var _c_root_method_arguments = arguments;
}

Websom.Services.Config = function (server) {var _c_this = this;
	this.optionValues = {};

	this.optionValuesFromDatabase = {};

	this.optionDefaults = {};

	this.colorProfiles = {};

	this.navigation = {};

	this.publicDefaults = [];

	this.publicValueCache = false;

	this.publicValues = {};

	this.global = "";

	this.loaded = false;

	this.server = null;

		_c_this.server = server;
		_c_this.preStart();
}

Websom.Services.Config.prototype.getString = function (route, option) {var _c_this = this; var _c_root_method_arguments = arguments;
		return _c_this.getPrimitive(route, option);}

Websom.Services.Config.prototype.getPrimitive = function (route, option) {var _c_this = this; var _c_root_method_arguments = arguments;
		if (_c_this.loaded == false) {
			_c_this.load();
			}
		var optionValuesFromDatabase = _c_this.optionValuesFromDatabase[route];
		var optionValues = _c_this.optionValues[route];
		if (optionValues != null && (option in optionValues)) {
			return _c_this.optionValues[route][option];
			}else if (optionValuesFromDatabase != null && (option in optionValuesFromDatabase)) {
			return _c_this.optionValuesFromDatabase[route][option];
			}else{
				return _c_this.optionDefaults[route + "." + option];
			}}

Websom.Services.Config.prototype.getPrimitiveNonDefault = function (route, option) {var _c_this = this; var _c_root_method_arguments = arguments;
		if (_c_this.loaded == false) {
			_c_this.load();
			}
		var optionValuesFromDatabase = _c_this.optionValuesFromDatabase[route];
		var optionValues = _c_this.optionValues[route];
		if (optionValues != null && (option in optionValues)) {
			return _c_this.optionValues[route][option];
			}else if (optionValuesFromDatabase != null && (option in optionValuesFromDatabase)) {
			return _c_this.optionValuesFromDatabase[route][option];
			}
		return null;}

Websom.Services.Config.prototype.loadFromDatabase = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		_c_this.server.api.route("/data", async function (req) {
/*async*/
			req.header("Content-Type", "application/json");
			(await req.end/* async call */(Websom.Json.encode(_c_this.computeClientData())));
			});}

Websom.Services.Config.prototype.load = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		if (_c_this.server.database.primary != null) {

			}
		var rawOverrides = Websom.Json.parse(Oxygen.FileSystem.readSync(_c_this.global, "utf8"));
		_c_this.mergeOptions(rawOverrides);}

Websom.Services.Config.prototype.mergeOptions = function (rawOverrides) {var _c_this = this; var _c_root_method_arguments = arguments;
		for (var key in rawOverrides) {
			if ((key in _c_this.optionValues) == false) {
				_c_this.optionValues[key] = {};
				}
			var rawVal = rawOverrides[key];
			for (var valKey in rawVal) {
				_c_this.optionValues[key][valKey] = rawVal[valKey];
				}
			}}

Websom.Services.Config.prototype.start = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		_c_this.global = _c_this.server.config.configOverrides + "/global.json";}

Websom.Services.Config.prototype.logOptions = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		_c_this.load();
		console.log(_c_this.optionValues);}

Websom.Services.Config.prototype.gatherOptions = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		var cache = _c_this.server.config.configOverrides + "/optionsCache.json";
		if (_c_this.server.config.dev == false && Oxygen.FileSystem.exists(cache)) {
			var rawConfigs = Oxygen.FileSystem.readSync(cache, "utf8");
			var configs = Websom.Json.parse(rawConfigs);
			_c_this.fillDefaults(configs);
			}else{
				if (_c_this.server.config.dev) {
					if (_c_this.server.config.verbose) {
						console.log("No options cache found. Websom will (re)build it.");
						console.log("Note: This is always rebuilt while in dev mode.");
						}
					_c_this.fillDefaults(_c_this.cacheOptions());
					}else{

					}
			}}

Websom.Services.Config.prototype.parseViewOptionsIntoMap = function (base, route, path) {var _c_this = this; var _c_root_method_arguments = arguments;
		var parse = function (file) {

			};
		
			parse = require(this.server.websomRoot + "/webpack/view-loader/parser.js");
		
		var parsed = parse(Oxygen.FileSystem.readSync(path, "utf8"));
		if ("config" in parsed) {
			var info = Websom.Json.parse("{" + parsed["info"]["block"] + "}");
			var name = info["name"];
			var parsedConfig = Websom.Json.parse("{" + parsed["config"]["block"] + "}");
			base[route + "." + name] = parsedConfig["options"];
			var opts = base[route + "." + name];
			for (var k in opts) {
				opts[k]["publicView"] = true;
				}
			}}

Websom.Services.Config.prototype.cacheOptionsFromPackage = function (ptype, pid, baseConfig, root) {var _c_this = this; var _c_root_method_arguments = arguments;
		var baseOptions = {};
		var parse = function (file) {

			};
		
			parse = require(this.server.websomRoot + "/webpack/view-loader/parser.js");
		
		var parseViews = function (route, views) {
			for (var i = 0; i < views.length; i++) {
				var parsed = parse(Oxygen.FileSystem.readSync(views[i], "utf8"));
				if ("config" in parsed) {
					var info = Websom.Json.parse("{" + parsed["info"]["block"] + "}");
					var name = info["name"];
					var parsedConfig = Websom.Json.parse("{" + parsed["config"]["block"] + "}");
					baseOptions[route + "." + name] = parsedConfig["options"];
					var opts = baseOptions[route + "." + name];
					for (var k in opts) {
						opts[k]["publicView"] = true;
						}
					}
				}
			};
		if ("config" in baseConfig) {
			var merge = baseConfig["config"];
			for (var namespace in merge) {
				if (namespace == "root") {
					baseOptions[ptype + "." + pid] = merge[namespace];
					}else{
						baseOptions[namespace] = merge[namespace];
					}
				}
			}
		var views = [];
		if ("resources" in baseConfig) {
			var resources = baseConfig["resources"];
			for (var i = 0; i < resources.length; i++) {
				var res = resources[i];
				if (res["type"] == "view") {
					views.push(root + "/" + res["path"]);
					}else if (("type" in res) == false) {
					var dir = Oxygen.FileSystem.readDirSync(root + "/" + res["path"]);
					for (var di = 0; di < dir.length; di++) {
						var file = dir[di];
						var splits = file.split(".");
						var ext = splits[splits.length - 1];
						if (ext == "view") {
							views.push(root + "/" + res["path"] + "/" + file);
							}
						}
					}
				}
			}
		parseViews(ptype + "." + pid, views);
		return baseOptions;}

Websom.Services.Config.prototype.cacheOptions = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		var cache = {};
		for (var i = 0; i < _c_this.server.module.modules.length; i++) {
			var mod = _c_this.server.module.modules[i];
			cache[mod.id] = _c_this.cacheOptionsFromPackage("module", mod.id.toLowerCase(), mod.baseConfig, mod.root);
			}
		for (var i = 0; i < _c_this.server.theme.themes.length; i++) {
			var theme = _c_this.server.theme.themes[i];
			var key = theme.key;
			if (key.length == 0) {
				key = "theme";
				}
			cache[key] = _c_this.cacheOptionsFromPackage("theme", key.toLowerCase(), theme.config, theme.root);
			}
		_c_this.parseViewOptionsIntoMap(cache["theme"], "theme.theme", _c_this.server.websomRoot + "/webpack/app.view");
		var cacheFile = _c_this.server.config.configOverrides + "/optionsCache.json";
		Oxygen.FileSystem.writeSync(cacheFile, Websom.Json.encode(cache));
		return cache;}

Websom.Services.Config.prototype.fillDefaults = function (configs) {var _c_this = this; var _c_root_method_arguments = arguments;
		for (var owner in configs) {
			var routes = configs[owner];
			for (var route in routes) {
				var options = routes[route];
				for (var option in options) {
					var opt = options[option];
					_c_this.optionDefaults[route + "." + option] = opt["default"];
					var public = false;
					if ("public" in opt) {
						public = opt["public"];
						}
					if ("publicView" in opt) {
						public = true;
						}
					var arr = [];
					arr.push(route);
					arr.push(option);
					if (opt["publicView"]) {
						arr.push("view");
						}else{
							arr.push("package");
						}
					if (public) {
						_c_this.publicDefaults.push(arr);
						}
					}
				}
			}}

Websom.Services.Config.prototype.getCustomization = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		var path = _c_this.server.config.configOverrides + "/customization.json";
		if (Oxygen.FileSystem.exists(path)) {
			return Websom.Json.parse(Oxygen.FileSystem.readSync(path, "utf8"));
			}else{
				return {};
			}}

Websom.Services.Config.prototype.getColorProfiles = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		var custom = _c_this.getCustomization();
		if ("color" in custom) {
			return custom["color"];
			}else{
				return {};
			}}

Websom.Services.Config.prototype.getNavigationConfig = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		var custom = _c_this.getCustomization();
		if ("navigation" in custom) {
			return custom["navigation"];
			}else{
				return {};
			}}

Websom.Services.Config.prototype.getConfiguredOptions = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		var data = JSON.parse(JSON.stringify(_c_this.optionValuesFromDatabase));
		for (var k in _c_this.optionValues) {
			data[k] = _c_this.optionValues[k];
			}
		return data;}

Websom.Services.Config.prototype.computeClientData = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		var mp = {};
		if (_c_this.publicValueCache == false) {
			for (var i = 0; i < _c_this.publicDefaults.length; i++) {
				var p = _c_this.publicDefaults[i];
				if (p[2] == "package") {
					_c_this.publicValues[p[0] + "." + p[1]] = _c_this.getPrimitive(p[0], p[1]);
					}else{
						var val = _c_this.getPrimitiveNonDefault(p[0], p[1]);
						if (val != null) {
							_c_this.publicValues[p[0] + "." + p[1]] = val;
							}
					}
				}
			_c_this.publicValueCache = true;
			}
		mp["config"] = _c_this.publicValues;
		mp["routes"] = {};
		mp["endpoints"] = _c_this.server.api.gatherEndpoints();
		mp["navigation"] = {};
		var data = _c_this.getNavigationConfig();
		if ("navbar" in data) {
			mp["navigation"]["config"] = data["navbar"];
			}else{
				mp["navigation"]["config"] = {};
			}
		mp["navigation"]["navbar"] = [];
		return mp;}

Websom.Services.Config.prototype.preStart = function () {var _c_this = this; var _c_root_method_arguments = arguments;
}

Websom.Services.Config.prototype.stop = function () {var _c_this = this; var _c_root_method_arguments = arguments;
}

Websom.Services.Config.prototype.end = function () {var _c_this = this; var _c_root_method_arguments = arguments;
}

Websom.Services.Confirmation = function (server) {var _c_this = this;
	this.confirmation = null;

	this.server = null;

		_c_this.server = server;
		_c_this.preStart();
}

Websom.Services.Confirmation.prototype.start = function () {var _c_this = this; var _c_root_method_arguments = arguments;
	if (arguments.length == 0) {

	}
else 	if (arguments.length == 0) {

	}
}

Websom.Services.Confirmation.prototype.confirm = function (key) {var _c_this = this; var _c_root_method_arguments = arguments;
		return _c_this.confirmation.confirm(key);}

Websom.Services.Confirmation.prototype.handleConfirmation = function (key, handler) {var _c_this = this; var _c_root_method_arguments = arguments;
		_c_this.confirmation.handleConfirmation(key, handler);}

Websom.Services.Confirmation.prototype.preStart = function () {var _c_this = this; var _c_root_method_arguments = arguments;
}

Websom.Services.Confirmation.prototype.stop = function () {var _c_this = this; var _c_root_method_arguments = arguments;
}

Websom.Services.Confirmation.prototype.end = function () {var _c_this = this; var _c_root_method_arguments = arguments;
}

Websom.Services.Crypto = function (server) {var _c_this = this;
	this.server = null;

		_c_this.server = server;
		_c_this.preStart();
}

Websom.Services.Crypto.prototype.start = function () {var _c_this = this; var _c_root_method_arguments = arguments;
	if (arguments.length == 0) {

	}
else 	if (arguments.length == 0) {

	}
}

Websom.Services.Crypto.prototype.hashPassword = function () {var _c_this = this; var _c_root_method_arguments = arguments;
	if (arguments.length == 1 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null)) { 		var password = arguments[0];

return new Promise((_c_resolve, _c_reject) => {		
			const argon2 = require("argon2-browser");
			const crypto = require("crypto");
			crypto.randomBytes(32, async (err, salt) => {
				let hash = await argon2.hash({pass: password, salt: salt.toString("hex"), time: 5, mem: 1024 * 10, hashLen: 32, type: argon2.ArgonType.Argon2i});

				_c_resolve(hash.encoded); return;
			});
		
		
 }); }
else 	if (arguments.length == 2 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'function' || typeof arguments[1] == 'undefined' || arguments[1] === null)) {
		var password = arguments[0];
		var done = arguments[1];
		
			const argon2 = require("argon2");
			argon2.hash(password).then((hashed) => {
				done(hashed);
			});
		
		
	}
}

Websom.Services.Crypto.prototype.verifyPassword = function () {var _c_this = this; var _c_root_method_arguments = arguments;
	if (arguments.length == 2 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'string' || typeof arguments[1] == 'undefined' || arguments[1] === null)) { 		var hash = arguments[0];
		var password = arguments[1];

return new Promise((_c_resolve, _c_reject) => {		
			try {
				const argon2 = require("argon2-browser");
				argon2.verify({encoded: hash, pass: password}).then(() => {
					_c_resolve(true); return;
				}).catch(() => {
					_c_resolve(false); return;
				});
			} catch(e) {
				_c_resolve(false); return;
			}
		
		
 }); }
else 	if (arguments.length == 3 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'string' || typeof arguments[1] == 'undefined' || arguments[1] === null) && (typeof arguments[2] == 'function' || typeof arguments[2] == 'undefined' || arguments[2] === null)) {
		var hash = arguments[0];
		var password = arguments[1];
		var done = arguments[2];
		
			try {
				const argon2 = require("argon2");
				argon2.verify(hash, password).then((match) => {done(match);}).catch(() => {done(false);});
			} catch(e) {
				console.log("Make sure your password hash is valid.");
				console.log(e);
			}
		
		
	}
}

Websom.Services.Crypto.prototype.randomHex = function (length, done) {var _c_this = this; var _c_root_method_arguments = arguments;
		
			const crypto = require("crypto");
			crypto.randomBytes(length, (err, buffer) => {
				if (err)
					throw err;
				else
					done(buffer.toString("hex"));
			});
		
		}

Websom.Services.Crypto.prototype.getRandomHex = function () {var _c_this = this; var _c_root_method_arguments = arguments;
	if (arguments.length == 1 && (typeof arguments[0] == 'number' || typeof arguments[0] == 'undefined' || arguments[0] === null)) { 		var length = arguments[0];

return new Promise((_c_resolve, _c_reject) => {		
			const crypto = require("crypto");
			crypto.randomBytes(length, (err, buffer) => {
				if (err)
					throw err;
				else {
					let hex = buffer.toString("hex");
					_c_resolve(hex); return;
				}
			});
		
		
 }); }
}

Websom.Services.Crypto.prototype.smallId = function (done) {var _c_this = this; var _c_root_method_arguments = arguments;
		
			const crypto = require("crypto");
			crypto.randomBytes(12, (err, buffer) => {
				if (err)
					throw err;
				else
					done(buffer.toString("base64").substr(0, 12).replace(new RegExp("\/", "g"), "_").replace(/\+/g, "-"));
			});
		
		}

Websom.Services.Crypto.prototype.longId = function (amount, done) {var _c_this = this; var _c_root_method_arguments = arguments;
		
			const crypto = require("crypto");
			crypto.randomBytes(amount, (err, buffer) => {
				if (err)
					throw err;
				else
					done(buffer.toString("base64").substr(0, amount).replace(new RegExp("\/", "g"), "_").replace(/\+/g, "-"));
			});
		
		}

Websom.Services.Crypto.prototype.preStart = function () {var _c_this = this; var _c_root_method_arguments = arguments;
}

Websom.Services.Crypto.prototype.stop = function () {var _c_this = this; var _c_root_method_arguments = arguments;
}

Websom.Services.Crypto.prototype.end = function () {var _c_this = this; var _c_root_method_arguments = arguments;
}

Websom.Services.Database = function (server) {var _c_this = this;
	this.primary = null;

	this.databases = [];

	this.primaryAdapter = null;

	this.central = null;

	this.search = null;

	this.server = null;

		_c_this.server = server;
		_c_this.preStart();
}

Websom.Services.Database.prototype.preStart = function () {var _c_this = this; var _c_root_method_arguments = arguments;
	if (arguments.length == 0) {
		_c_this.primaryAdapter = _c_this.server.adapt("database");
	}
else 	if (arguments.length == 0) {

	}
}

/*i async*/Websom.Services.Database.prototype.loadAdapter = async function () {var _c_this = this; var _c_root_method_arguments = arguments;
/*async*/
		(await _c_this.primaryAdapter.loadFromConfig/* async call */());
		_c_this.central = _c_this.primaryAdapter.adapter;}

Websom.Services.Database.prototype.loadDatabase = function (raw) {var _c_this = this; var _c_root_method_arguments = arguments;
		if (("type" in raw) == false) {
			return Websom.Status.singleError("Services.Database", "No type provided in database config " + raw["name"]);
			}
		var type = raw["type"];
		var database = Websom.Database.make(_c_this.server, type);
		if (database == null) {
			return Websom.Status.singleError("Services.Database", "Unknown database type '" + type + "'");
			}
		database.load(raw);
		
			database.connect((err) => {                                 
				if (err)
					console.log(err.display());
			});
		
		_c_this.databases.push(database);}

Websom.Services.Database.prototype.start = function () {var _c_this = this; var _c_root_method_arguments = arguments;
	if (arguments.length == 0) {
		if (_c_this.server.config.databaseFile.length > 0) {
			var config = Websom.Json.parse(Oxygen.FileSystem.readSync(_c_this.server.config.databaseFile, "utf8"));
			if ("databases" in config) {
				var databases = config["databases"];
				for (var i = 0; i < databases.length; i++) {
					var database = databases[i];
					
					var err = _c_this.loadDatabase(database);
					if (err != null) {
						return err;
						}
					}
				}
			if ("default" in config) {
				for (var i = 0; i < _c_this.databases.length; i++) {
					if (_c_this.databases[i].name == config["default"]) {
						_c_this.primary = _c_this.databases[i];
						return null;
						}
					}
				}
			}
	}
else 	if (arguments.length == 0) {

	}
}

Websom.Services.Database.prototype.stop = function () {var _c_this = this; var _c_root_method_arguments = arguments;
}

Websom.Services.Database.prototype.end = function () {var _c_this = this; var _c_root_method_arguments = arguments;
}

Websom.Services.Email = function (server) {var _c_this = this;
	this.server = null;

		_c_this.server = server;
		_c_this.preStart();
}

Websom.Services.Email.prototype.getSender = function (sender) {var _c_this = this; var _c_root_method_arguments = arguments;
		var raw = Websom.Json.parse(Oxygen.FileSystem.readSync(_c_this.server.config.root + "/email.json", "utf8"));
		return raw["senders"][sender];}

Websom.Services.Email.prototype.send = function (sender, email, sent) {var _c_this = this; var _c_root_method_arguments = arguments;
		if (_c_this.server.config.dev && _c_this.server.config.devSendMail == false) {
			if (Oxygen.FileSystem.exists(_c_this.server.config.root + "/dev_emails") == false) {
				Oxygen.FileSystem.makeDir(_c_this.server.config.root + "/dev_emails");
				}
			Oxygen.FileSystem.writeSync(_c_this.server.config.root + "/dev_emails/" + email.subject.replace(new RegExp("/".replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&'), 'g'), "_") + ".html", "Sender: " + sender + "\n" + "\nRecipients: " + email.recipients.join(", ") + "\n\nBody:\n" + email.body.replace(new RegExp("\n".replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&'), 'g'), "	\n"));
			}else{
				var rawSender = _c_this.getSender(sender);
				
				const nodemailer = require("nodemailer");
				let transporter = nodemailer.createTransport({
					host: rawSender["host"],
					port: rawSender["port"],
					secure: true,
					auth: {
						user: rawSender["username"],
						pass: rawSender["password"]
					}
				});

				let mailOptions = {
					from: '"' + rawSender["fromName"] + '" <' + rawSender["from"] + '>',
					to: email.recipients.join(", "),
					subject: email.subject,
					text: email.body
				};

				if (email.html)
					mailOptions.html = email.body;

				transporter.sendMail(mailOptions, (err) => {
					if (err)
						sent(err.toString());
					else
						sent("");
				});
			
				
			}}

Websom.Services.Email.prototype.preStart = function () {var _c_this = this; var _c_root_method_arguments = arguments;
}

Websom.Services.Email.prototype.start = function () {var _c_this = this; var _c_root_method_arguments = arguments;
}

Websom.Services.Email.prototype.stop = function () {var _c_this = this; var _c_root_method_arguments = arguments;
}

Websom.Services.Email.prototype.end = function () {var _c_this = this; var _c_root_method_arguments = arguments;
}

Websom.Email = function (recipients, subject, body) {var _c_this = this;
	this.html = false;

	this.recipients = null;

	this.subject = "";

	this.body = "";

		_c_this.recipients = recipients;
		_c_this.body = body;
		_c_this.subject = subject;
}

Websom.Email.prototype.attach = function () {var _c_this = this; var _c_root_method_arguments = arguments;
}

Websom.Services.Input = function (server) {var _c_this = this;
	this.inputs = [];

	this.clientValidate = "";

	this.inputTypes = [];

	this.completed = {};

	this.restrictHandlers = {};

	this.server = null;

		_c_this.server = server;
		_c_this.preStart();
}

Websom.Services.Input.prototype.start = function () {var _c_this = this; var _c_root_method_arguments = arguments;
	if (arguments.length == 0) {
		_c_this.clientValidate = _c_this.buildClientValidation();
	}
else 	if (arguments.length == 0) {

	}
}

Websom.Services.Input.prototype.buildClientValidation = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		var strs = [];
		for (var i = 0; i < _c_this.inputs.length; i++) {
			var input = _c_this.inputs[i];
			if (input.containerInterface != null) {
				var name = input.containerInterface.dataInfo.name;
				if ((name in _c_this.completed) == false) {
					_c_this.completed[name] = true;
					strs.push("\"" + name + "\": {" + _c_this.buildDataValidation(input.containerInterface.dataInfo) + "}");
					}
				}
			}
		var seg = "";
		if (_c_this.inputTypes.length > 0) {
			seg = ", ";
			}
		return "<script>Websom.inputValidation = {" + strs.join(", ") + seg + _c_this.inputTypes.join(", ") + "};</script>";}

Websom.Services.Input.prototype.restriction = function (key, callback) {var _c_this = this; var _c_root_method_arguments = arguments;
		_c_this.restrictHandlers[key] = callback;}

Websom.Services.Input.prototype.buildDataValidation = function (info) {var _c_this = this; var _c_root_method_arguments = arguments;
		var keys = [];
		for (var i = 0; i < info.fields.length; i++) {
			var field = info.fields[i];
			if (field.expose == false) {
				continue;
				}
			var type = "primitive";
			if (field.singleLink) {
				type = field.typeRoute;
				}else if (field.typeRoute == "array") {
				var linked = field.structure.getFlag("linked");
				type = linked.fieldType;
				}
			if (type != "primitive") {
				var dataInfo = Websom.DataInfo.getDataInfoFromRoute(type);
				var name = dataInfo.name;
				if ((name in _c_this.completed) == false) {
					_c_this.completed[name] = true;
					_c_this.inputTypes.push("\"" + name + "\": {" + _c_this.buildDataValidation(dataInfo) + "}");
					}
				}
			var fieldValidation = [];
			fieldValidation.push("type: \"" + type + "\"");
			for (var key in field.attributes) {
				if (key == "Min" || key == "Max" || key == "Match" || key == "MatchMessage" || key == "Not" || key == "Length") {
					fieldValidation.push(key + ": " + Websom.Json.encode(field.attributes[key]));
					}
				}
			keys.push(field.realName + ": {" + fieldValidation.join(", ") + "}");
			}
		return keys.join(", ");}

Websom.Services.Input.prototype.register = function (key, callback) {var _c_this = this; var _c_root_method_arguments = arguments;
		var handler = new Websom.InputHandler(key, callback);
		_c_this.inputs.push(handler);
		return handler;}

Websom.Services.Input.prototype.handle = function (key, raw, req) {var _c_this = this; var _c_root_method_arguments = arguments;
		var handled = false;
		for (var i = 0; i < _c_this.inputs.length; i++) {
			var input = _c_this.inputs[i];
			if (input.key == key) {
				handled = true;
				input.handle(raw, req);
				}
			}
		if (handled == false) {
			req.send("Invalid key " + key);
			}}

Websom.Services.Input.prototype.interface = function (key) {var _c_this = this; var _c_root_method_arguments = arguments;
		var chain = null;
		var handler = _c_this.register(key, function (input) {
			chain.received(input);
			});
		chain = new Websom.InputChain(handler);
		return chain;}

Websom.Services.Input.prototype.preStart = function () {var _c_this = this; var _c_root_method_arguments = arguments;
}

Websom.Services.Input.prototype.stop = function () {var _c_this = this; var _c_root_method_arguments = arguments;
}

Websom.Services.Input.prototype.end = function () {var _c_this = this; var _c_root_method_arguments = arguments;
}

Websom.InputHandler = function (key, handler) {var _c_this = this;
	this.key = "";

	this.handler = null;

	this.containerInterface = null;

		_c_this.key = key;
		_c_this.handler = handler;
}

Websom.InputHandler.prototype.handle = function (raw, req) {var _c_this = this; var _c_root_method_arguments = arguments;
		var input = new Websom.Input(_c_this.key, raw, req);
		input.server = req.server;
		_c_this.handler(input);}

Websom.File = function (name, path, size, type) {var _c_this = this;
	this.name = "";

	this.path = "";

	this.type = "";

	this.size = 0;

		_c_this.name = name;
		_c_this.path = path;
		_c_this.size = size;
		_c_this.type = type;
}

Websom.Input = function (key, raw, request) {var _c_this = this;
	this.server = null;

	this.raw = null;

	this.files = {};

	this.request = null;

	this.key = "";

	this.route = "";

	this.updateData = null;

		_c_this.key = key;
		_c_this.raw = raw;
		if ("_w_route" in raw) {
			_c_this.route = raw["_w_route"];
			}
		_c_this.request = request;
		_c_this.server = _c_this.request.server;
		
			if (request.jsRequest.files) {
				for (let files in request.jsRequest.files) {
					let file = request.jsRequest.files[files];
					if (!(file.fieldname in this.files))
						this.files[file.fieldname] = [];
					
					this.files[file.fieldname].push(new Websom.File(file.originalname, file.path, file.size, file.mimetype));

					                                                      
                                                         
                          
        
            
                                                 
                                                                                                       
        
				}
			}
		
		
}

Websom.Input.prototype.validate = function (val, done) {var _c_this = this; var _c_root_method_arguments = arguments;
		val.validate(_c_this, done);}

Websom.Input.prototype.has = function (keys) {var _c_this = this; var _c_root_method_arguments = arguments;
		for (var i = 0; i < keys.length; i++) {
			if ((keys[i] in _c_this.raw) == false) {
				return false;
				}
			}
		return true;}

Websom.Input.prototype.send = function (raw) {var _c_this = this; var _c_root_method_arguments = arguments;
		_c_this.request.send(raw);}

Websom.Input.prototype.sendAction = function (actionName) {var _c_this = this; var _c_root_method_arguments = arguments;
		_c_this.request.send("{\"status\": \"action\", \"action\": " + Websom.Json.encode(actionName) + "}");}

Websom.Input.prototype.sendError = function (message) {var _c_this = this; var _c_root_method_arguments = arguments;
		_c_this.request.send("{\"status\": \"error\", \"message\": " + Websom.Json.encode(message) + "}");}

Websom.Input.prototype.sendSuccess = function (message) {var _c_this = this; var _c_root_method_arguments = arguments;
		_c_this.request.send("{\"status\": \"success\", \"message\": " + Websom.Json.encode(message) + "}");}

Websom.Input.prototype.validateCaptcha = function (callback) {var _c_this = this; var _c_root_method_arguments = arguments;
		var that = _c_this;
		var url = "https://www.google.com/recaptcha/api/siteverify";
		if (("_captcha" in _c_this.raw) && (typeof _c_this.raw["_captcha"] == 'object' ? (Array.isArray(_c_this.raw["_captcha"]) ? 'array' : 'map') : (typeof _c_this.raw["_captcha"] == 'number' ? 'float' : typeof _c_this.raw["_captcha"])) == "string") {
			_c_this.server.security.load();
			_c_this.server.request(url).form("response", _c_this.raw["_captcha"]).form("secret", _c_this.server.security.serviceKey).parseJson().post(function (res) {
				if (res.hadError) {
					that.server.log(res.error);
					}else{
						if ("error-codes" in res.data) {
							that.server.log(res.data["error-codes"]);
							}
						callback(res.data["success"]);
					}
				});
			}else{
				callback(false);
			}}

Websom.InputValidator = function () {var _c_this = this;


}

Websom.InputValidation = function () {var _c_this = this;
	this.hadError = false;

	this.message = "";

	this.field = null;

	if (arguments.length == 2 && (typeof arguments[0] == 'boolean' || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'string' || typeof arguments[1] == 'undefined' || arguments[1] === null)) {
		var hadError = arguments[0];
		var message = arguments[1];
		_c_this.hadError = hadError;
		_c_this.message = message;
	}
else 	if (arguments.length == 3 && (typeof arguments[0] == 'boolean' || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'string' || typeof arguments[1] == 'undefined' || arguments[1] === null) && ((arguments[2] instanceof Websom.FieldInfo) || typeof arguments[2] == 'undefined' || arguments[2] === null)) {
		var hadError = arguments[0];
		var message = arguments[1];
		var field = arguments[2];
		_c_this.hadError = hadError;
		_c_this.message = message;
		_c_this.field = field;
	}

}

Websom.InputValidation.prototype.stringify = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		if (_c_this.field == null) {
			return _c_this.message;
			}else{
				return _c_this.message + " on field " + _c_this.field.realName;
			}}

Websom.Micro = function () {var _c_this = this;


}

Websom.Services.Micro = function (server) {var _c_this = this;
	this.text = null;

	this.command = null;

	this.sitemap = null;

	this.server = null;

		_c_this.server = server;
		_c_this.preStart();
}

Websom.Services.Micro.prototype.start = function () {var _c_this = this; var _c_root_method_arguments = arguments;
	if (arguments.length == 0) {
		var status = new Websom.Status();
		_c_this.text = new Websom.Micro.Text(_c_this.server);
		_c_this.command = new Websom.Micro.Command(_c_this.server);
		_c_this.sitemap = new Websom.Micro.Sitemap(_c_this.server);
		status.inherit(_c_this.text.start());
		status.inherit(_c_this.command.start());
		status.inherit(_c_this.sitemap.start());
		return status;
	}
else 	if (arguments.length == 0) {

	}
}

Websom.Services.Micro.prototype.preStart = function () {var _c_this = this; var _c_root_method_arguments = arguments;
}

Websom.Services.Micro.prototype.stop = function () {var _c_this = this; var _c_root_method_arguments = arguments;
}

Websom.Services.Micro.prototype.end = function () {var _c_this = this; var _c_root_method_arguments = arguments;
}

Websom.MicroService = function (server) {var _c_this = this;
	this.server = null;

		_c_this.server = server;
}

Websom.Services.Module = function (server) {var _c_this = this;
	this.modules = [];

	this.watchers = [];

	this.server = null;

		_c_this.server = server;
		_c_this.preStart();
}

Websom.Services.Module.requireMod = function (dir, server) {var _c_this = this; var _c_root_method_arguments = arguments;
var modCon =  require(arguments[0] + 'module.js'); return new modCon(arguments[1]);}

Websom.Services.Module.prototype.rebuild = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		console.log("Rebuilding all");
		for (var i = 0; i < _c_this.modules.length; i++) {
			var module = _c_this.modules[i];
			
				this.buildModule(module.root, JSON.parse(require("fs").readFileSync(require("path").resolve(module.root, module.name) + ".json")));
			
			}
		if (_c_this.server.config.legacy) {
			_c_this.server.resource.build(true);
			}
		return null;}

Websom.Services.Module.prototype.load = function (modDir, config, single) {var _c_this = this; var _c_root_method_arguments = arguments;
		if (require('fs').existsSync(modDir + '/module.js') == false) {
			console.log("Building module " + config["name"]);
			_c_this.buildModule(modDir, config);
			}
		var that = _c_this;
		
			if (this.server.config.dev && false) {
				if (config.npm) {
					const path = require("path");
					const npm = require('npm-programmatic');
					
					(async () => {
						let packages = [];

						for (let package in config.npm)
							packages.push(package + "@" + config.npm[package]);
						
						await npm.install(packages, {
							cwd: path.resolve(this.server.config.configOverrides, "../"),
        					save: true
						});

						console.log("Installed dependencies " + JSON.stringify(packages));
					})();
				}

				if (config.composer) {
					for (let package in config.composer) {
						const cp = require('child_process');
						cp.exec("composer require \"" + package + ":" + config.composer[package] + "\"", {cwd: this.server.websomRoot}, (err, stdout, stderr) => {
							console.log(err || stderr || stdout);
						});
					}
				}
			}

			if (this.server.config.dev) {
				var fs = require("fs");
				this.watchers.push(fs.watch(modDir, {recursive: true}, function (type, file) {
					var ext = file.split(".");
					ext = ext[ext.length - 1];
					if (file != modDir + "/module.php" && file != modDir + "/module.js") {
						var slash = "/";
						if (ext == "carb") {
							console.log("Saw change on " + file + ". Rebuilding carbon");
							that.buildModule(modDir, JSON.parse(fs.readFileSync(modDir + slash + "module.json")));
							if (that.server.config.legacy) {
								that.server.resource.build(true);
							}

							if (that.server.restartHandler)
								that.server.restartHandler();
						}else{
							if (that.server.config.legacy) {
								console.log("Saw change on " + file + ". Rebuilding resources");
								that.server.resource.build(true);
							}

							if (type == "rename") {
								if (that.server.restartHandler)
									that.server.restartHandler();

								if (false && _c_this.server.devBuildWatcher)
									_c_this.server.devBuildWatcher(file);
							}
						}
						if (!single) {
							if (that.server.config.legacy) {
								for (var i = that.watchers.length - 1; i >= 0; i--) {
									that.watchers[i].close();
									that.watchers.pop();
								}
							
								for (var i = that.modules.length - 1; i >= 0; i--) {
									that.modules[i].stop();                       
									that.modules.pop();
								}
							
								that.reload(require("path").resolve(modDir + slash + ".." + slash) + slash);
								that.server.resource.buildViews();
							}
						}else{
							console.log("Reloading single module");
							this.close();
							that.load(modDir, config, single);
							that.server.resource.buildViews();
						}
					}
				}));
			}
		
		              
			delete require.cache[require.resolve(modDir + "/module.js")];
		
		var mod = Websom.Services.Module.requireMod(modDir + "/", _c_this.server);
		mod.root = modDir;
		for (var i = 0; i < _c_this.modules.length; i++) {
			if (_c_this.modules[i].root == modDir) {
				_c_this.modules.splice(i, 1);
				break;
				}
			}
		_c_this.modules.push(mod);
		if ("assets" in config) {
			var assets = config["assets"];
			for (var i = 0; i < assets.length; i++) {
				if (assets[i]["name"] == "font-awesome") {
					_c_this.server.resource.assetFontAwesome = true;
					}
				}
			}
		
			mod.bridges = mod.setupBridges();
		
		
		return mod.spawn(config);}

Websom.Services.Module.prototype.loadAllContainers = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		var log = "";
		for (var mi = 0; mi < _c_this.modules.length; mi++) {
			var mod = _c_this.modules[mi];
			for (var i = 0; i < mod.containers.length; i++) {
				var container = mod.containers[i];
				log += "Setup container " + mod.name + "." + container.name + "\n";
				container.realize(_c_this.server.database.primary, function (err) {
					if (err.length > 0) {
						log += "Error in container " + container.name + ": " + err + "\n";
						}
					});
				}
			}
		return log;}

Websom.Services.Module.prototype.checkContainers = function (module) {var _c_this = this; var _c_root_method_arguments = arguments;
		for (var i = 0; i < module.containers.length; i++) {
			var container = module.containers[i];
			console.log("Setup container " + module.name + "." + container.name);
			container.realize(_c_this.server.database.primary, function (err) {
				if (err.length > 0) {
					console.log("Error in container " + container.name + ": " + err);
					}
				});
			}}

/*i async*/Websom.Services.Module.prototype.reload = async function (path) {var _c_this = this; var _c_root_method_arguments = arguments;
/*async*/
		                        
			                                                       
                              
                         
      
		
		var mods = Oxygen.FileSystem.readDirSync(path);
		var dash = Oxygen.FileSystem.resolve(Oxygen.FileSystem.dirName(_c_this.server.scriptPath) + "/../../dashboard");
		var core = Oxygen.FileSystem.resolve(Oxygen.FileSystem.dirName(_c_this.server.scriptPath) + "/../../coreModuleLegacy");
		if (_c_this.server.config.legacy) {
			_c_this.load(dash, Websom.Json.parse(Oxygen.FileSystem.readSync(dash + "/dashboard.json", "utf8")), true);
			_c_this.load(core, Websom.Json.parse(Oxygen.FileSystem.readSync(core + "/coreModule.json", "utf8")), true);
			}else{
				var newCore = Oxygen.FileSystem.resolve(Oxygen.FileSystem.dirName(_c_this.server.scriptPath) + "/../../coreModule");
				_c_this.load(newCore, Websom.Json.parse(Oxygen.FileSystem.readSync(newCore + "/module.json", "utf8")), true);
			}
		var doLoad = true;
		if (doLoad) {
			for (var i = 0; i < mods.length; i++) {
				var modDir = path + mods[i];
				if (Oxygen.FileSystem.isDir(modDir)) {
					var name = Oxygen.FileSystem.basename(modDir);
					if (name != "." && name != "..") {
						var configFile = "";
						if (_c_this.server.config.legacy) {
							configFile = modDir + "/" + name + ".json";
							}else{
								configFile = modDir + "/module.json";
							}
						if (Oxygen.FileSystem.exists(configFile) == false) {
							return Websom.Status.singleError("Services.Module", "Unable to find config for module " + name);
							}
						var config = Websom.Json.parse(Oxygen.FileSystem.readSync(configFile, "utf8"));
						var status = _c_this.load(modDir, config, false);
						if (status != null) {
							return status;
							}
						}
					}
				}
			}
		if (_c_this.server.config.legacy) {
/*async*/
			return (await _c_this.startModules/* async call */());
			}}

/*i async*/Websom.Services.Module.prototype.startModules = async function () {var _c_this = this; var _c_root_method_arguments = arguments;
/*async*/
		for (var i = 0; i < _c_this.modules.length; i++) {
/*async*/
			var module = _c_this.modules[i];
			var containers = module.setupData();
			if (containers != null) {
				module.containers = containers;
				}
			
				module.bridges = module.setupBridges();
			
			
			_c_this.checkContainers(module);
			module.permissions();
			module.collections();
			var status = (await module.start/* async call */());
			if (status != null) {
				return status;
				}
			}}

Websom.Services.Module.prototype.getModule = function (name) {var _c_this = this; var _c_root_method_arguments = arguments;
		return _c_this.modules.find(function (mod) {
			return mod.name == name;
			});}

Websom.Services.Module.prototype.buildModule = function (dir, config) {var _c_this = this; var _c_root_method_arguments = arguments;
		var name = config["name"];
		var error = null;
		
			error = require('../../core/util/native/carbonite.js').buildModule(dir + "/" + name + ".carb");
		
		if (error != null) {
			return error;
			}}

Websom.Services.Module.prototype.buildModules = function (path) {var _c_this = this; var _c_root_method_arguments = arguments;
		var mods = Oxygen.FileSystem.readDirSync(path);
		for (var i = 0; i < mods.length; i++) {
			var modDir = path + mods[i];
			if (Oxygen.FileSystem.isDir(modDir)) {
				var name = Oxygen.FileSystem.basename(modDir);
				if (name != "." && name != "..") {
					var configFile = modDir + "/" + name + ".json";
					if (Oxygen.FileSystem.exists(configFile) == false) {
						return Websom.Status.singleError("Servics.Module", "Unable to find config for module " + name);
						}
					var config = Websom.Json.parse(Oxygen.FileSystem.readSync(configFile, "utf8"));
					var status = _c_this.buildModule(modDir, config);
					if (status != null) {
						return status;
						}
					}
				}
			}}

/*i async*/Websom.Services.Module.prototype.start = async function () {var _c_this = this; var _c_root_method_arguments = arguments;
/*async*/
		var dir = _c_this.server.config.root + "/modules/";
		if (Oxygen.FileSystem.exists(dir) == false) {
			Oxygen.FileSystem.makeDir(dir);
			}
		return (await _c_this.reload/* async call */(dir));}

Websom.Services.Module.prototype.stop = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		
			for (let watcher of this.watchers)
				watcher.close();
		
		for (var i = 0; i < _c_this.modules.length; i++) {
			var mod = _c_this.modules[i];
			mod.stop();
			}}

Websom.Services.Module.prototype.handleBridge = function (req, bridgeName, method, args) {var _c_this = this; var _c_root_method_arguments = arguments;
		for (var i = 0; i < _c_this.modules.length; i++) {
			var mod = _c_this.modules[i];
			for (var b = 0; b < mod.bridges.length; b++) {
				var bridge = mod.bridges[b];
				if (bridge.getName() != bridgeName) {
					continue;
					}
				var server = bridge.getServerMethods();
				for (var m = 0; m < server.length; m++) {
					if (method == server[m]) {
						var rtn = null;
						
							rtn = bridge[method].apply(bridge, [req].concat(args));
						
						
						if (rtn != null) {
							req.send(Websom.Json.encode(rtn));
							}
						return null;
						}
					}
				}
			}}

Websom.Services.Module.prototype.preStart = function () {var _c_this = this; var _c_root_method_arguments = arguments;
}

Websom.Services.Module.prototype.end = function () {var _c_this = this; var _c_root_method_arguments = arguments;
}

Websom.Services.Notification = function (server) {var _c_this = this;
	this.emailAdapter = null;

	this.email = null;

	this.server = null;

		_c_this.server = server;
		_c_this.preStart();
}

Websom.Services.Notification.prototype.preStart = function () {var _c_this = this; var _c_root_method_arguments = arguments;
	if (arguments.length == 0) {
		_c_this.emailAdapter = _c_this.server.adapt("email");
	}
else 	if (arguments.length == 0) {

	}
}

/*i async*/Websom.Services.Notification.prototype.loadAdapters = async function () {var _c_this = this; var _c_root_method_arguments = arguments;
/*async*/
		(await _c_this.emailAdapter.loadFromConfig/* async call */());
		_c_this.email = _c_this.emailAdapter.adapter;}

/*i async*/Websom.Services.Notification.prototype.start = async function () {var _c_this = this; var _c_root_method_arguments = arguments;
	if (arguments.length == 0) {
/*async*/
		(await _c_this.loadAdapters/* async call */());
	}
else 	if (arguments.length == 0) {

	}
}

Websom.Services.Notification.prototype.stop = function () {var _c_this = this; var _c_root_method_arguments = arguments;
}

Websom.Services.Notification.prototype.end = function () {var _c_this = this; var _c_root_method_arguments = arguments;
}

Websom.Services.Pack = function (server) {var _c_this = this;
	this.packs = [];

	this.server = null;

		_c_this.server = server;
		_c_this.preStart();
}

Websom.Services.Pack.prototype.load = function (packDir, config) {var _c_this = this; var _c_root_method_arguments = arguments;
		var that = _c_this;
		if (("name" in config) == false) {
			return Websom.Status.singleError("Pack", "Must provide name in pack config " + packDir);
			}
		var pack = new Websom.Pack(_c_this.server, config["name"], packDir, config);
		if (_c_this.server.config.dev) {
			pack.buildAndSave(function (err) {
				if (err.length > 0) {
					that.server.status.inherit(Websom.Status.singleError("Pack." + pack.name, err));
					}
				});
			}
		_c_this.packs.push(pack);
		
			if (this.server.config.dev) {
				var fs = require("fs");
				console.log("Setup watch on pack " + pack.name);
				
				fs.watch(packDir, {recursive: true}, (type, file) => {
					console.log("Saw change on " + file + ". Rebuilding pack");
					var newConfig = JSON.parse(fs.readFileSync(packDir + "/pack.json", "utf8"))
					pack.config = newConfig;
					pack.buildAndSave((err) => {
						if (err.length > 0) {
							this.server.status.inherit(Websom.Status.singleError("Pack." + pack.name, err));
							console.log(err);
						}else
							console.log("No errors");
					});
				});
			}
		}

Websom.Services.Pack.prototype.reload = function (path) {var _c_this = this; var _c_root_method_arguments = arguments;
		if (_c_this.server.config.dev) {
			var dir = _c_this.server.config.resources + "/pack/";
			if (Oxygen.FileSystem.exists(dir) == false) {
				Oxygen.FileSystem.makeDir(dir);
				}
			}
		var packs = Oxygen.FileSystem.readDirSync(path);
		for (var i = 0; i < packs.length; i++) {
			if (packs[i] == "." || packs[i] == "..") {
				continue;
				}
			var packDir = path + packs[i];
			if (Oxygen.FileSystem.isDir(packDir)) {
				var configFile = packDir + "/pack.json";
				if (Oxygen.FileSystem.exists(configFile) == false) {
					return Websom.Status.singleError("Servics.Pack", "Unable to find config for pack " + packDir);
					}
				var config = Websom.Json.parse(Oxygen.FileSystem.readSync(configFile, "utf8"));
				var status = _c_this.load(packDir, config);
				if (status != null) {
					return status;
					}
				}
			}
		for (var i = 0; i < _c_this.packs.length; i++) {
			var pack = _c_this.packs[i];
			var status = pack.start();
			if (status != null) {
				return status;
				}
			}}

Websom.Services.Pack.prototype.include = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		var inc = "";
		for (var i = 0; i < _c_this.packs.length; i++) {
			inc += _c_this.packs[i].include();
			}
		return inc;}

Websom.Services.Pack.prototype.start = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		var dir = _c_this.server.config.root + "/packs/";
		if (Oxygen.FileSystem.exists(dir) == false) {
			Oxygen.FileSystem.makeDir(dir);
			}
		return _c_this.reload(dir);}

Websom.Services.Pack.prototype.preStart = function () {var _c_this = this; var _c_root_method_arguments = arguments;
}

Websom.Services.Pack.prototype.stop = function () {var _c_this = this; var _c_root_method_arguments = arguments;
}

Websom.Services.Pack.prototype.end = function () {var _c_this = this; var _c_root_method_arguments = arguments;
}

Websom.Render = function () {var _c_this = this;


}

Websom.Services.Render = function (server) {var _c_this = this;
	this.server = null;

		_c_this.server = server;
		_c_this.preStart();
}

Websom.Services.Render.prototype.start = function () {var _c_this = this; var _c_root_method_arguments = arguments;
}

Websom.Services.Render.prototype.renderView = function () {var _c_this = this; var _c_root_method_arguments = arguments;
	if (arguments.length == 2 && ((arguments[0] instanceof Websom.View) || typeof arguments[0] == 'undefined' || arguments[0] === null) && ((arguments[1] instanceof Websom.Render.Context) || typeof arguments[1] == 'undefined' || arguments[1] === null)) {
		var view = arguments[0];
		var ctx = arguments[1];
		if (view.renderView == null) {
			view.buildRenderView();
			}
		return view.renderView.render(ctx);
	}
else 	if (arguments.length == 2 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null) && ((arguments[1] instanceof Websom.Render.Context) || typeof arguments[1] == 'undefined' || arguments[1] === null)) {
		var viewName = arguments[0];
		var ctx = arguments[1];
		var view = _c_this.server.view.getView(viewName);
		return _c_this.renderView(view, ctx);
	}
}

Websom.Services.Render.prototype.findView = function (name) {var _c_this = this; var _c_root_method_arguments = arguments;
		var view = _c_this.server.view.getView(name);
		if (view != null) {
			if (view.renderView == null) {
				view.buildRenderView();
				}
			return view.renderView;
			}else{
				return null;
			}}

Websom.Services.Render.prototype.preStart = function () {var _c_this = this; var _c_root_method_arguments = arguments;
}

Websom.Services.Render.prototype.stop = function () {var _c_this = this; var _c_root_method_arguments = arguments;
}

Websom.Services.Render.prototype.end = function () {var _c_this = this; var _c_root_method_arguments = arguments;
}

Websom.Services.Resource = function (server) {var _c_this = this;
	this.globalScripts = [];

	this.globalStyles = [];

	this.deployConfig = null;

	this.assetFontAwesome = false;

	this.deployHandlers = [];

	this.server = null;

		_c_this.server = server;
		_c_this.preStart();
}

Websom.Services.Resource.prototype.start = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		_c_this.deployHandlers.push(new Websom.FtpHandler(_c_this.server));
		_c_this.deployHandlers.push(new Websom.LocalHandler(_c_this.server));}

Websom.Services.Resource.prototype.loadDeployConfig = function () {var _c_this = this; var _c_root_method_arguments = arguments;
}

Websom.Services.Resource.prototype.deploy = function () {var _c_this = this; var _c_root_method_arguments = arguments;
	if (arguments.length == 2 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'function' || typeof arguments[1] == 'undefined' || arguments[1] === null)) {
		var name = arguments[0];
		var callback = arguments[1];
		_c_this.deploy(name, function (msg) {
			console.log(msg);
			}, callback);
	}
else 	if (arguments.length == 3 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'function' || typeof arguments[1] == 'undefined' || arguments[1] === null) && (typeof arguments[2] == 'function' || typeof arguments[2] == 'undefined' || arguments[2] === null)) {
		var name = arguments[0];
		var progress = arguments[1];
		var callback = arguments[2];
		if (_c_this.server.config.legacy) {
			_c_this.loadDeployConfig();
			progress("Searching for deploy " + name);
			var deploy = _c_this.findDeploy(name);
			if (deploy == null) {
				progress("Unknown deploy " + name);
				callback();
				return null;
				}
			var handler = _c_this.findHandler(deploy["handler"]);
			if (handler == null) {
				progress("Unknown handler " + name);
				callback();
				return null;
				}
			handler.execute(deploy, progress, callback);
			}else{
				var deploy = _c_this.server.getDeploy(name);
				if (deploy == null) {
					progress("Unknown deploy " + name);
					return null;
					}
				
				const nodeDevPlatform = require(this.server.websomRoot + "/platform/node/index.js");

				(async () => {
					let res = await nodeDevPlatform.executeDeploy(this.server, deploy);
					callback(res);
				})();
			
			}
	}
}

Websom.Services.Resource.prototype.findHandler = function (name) {var _c_this = this; var _c_root_method_arguments = arguments;
		for (var i = 0; i < _c_this.deployHandlers.length; i++) {
			if (_c_this.deployHandlers[i].name == name) {
				return _c_this.deployHandlers[i];
				}
			}
		return null;}

Websom.Services.Resource.prototype.findDeploy = function (name) {var _c_this = this; var _c_root_method_arguments = arguments;
		var cast = _c_this.deployConfig["deploys"];
		for (var i = 0; i < cast.length; i++) {
			if (cast[i]["name"] == name) {
				return cast[i];
				}
			}
		return null;}

Websom.Services.Resource.prototype.analyze = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		
			const a = require(this.server.websomRoot + "/webpack/analyze.js");

			
			a(this.server);
		}

Websom.Services.Resource.prototype.buildViews = function (saveToFiles) {var _c_this = this; var _c_root_method_arguments = arguments;
		var viewStr = "";
		for (var i = 0; i < _c_this.server.module.modules.length; i++) {
			var module = _c_this.server.module.modules[i];
			var bridges = module.bridges;
			for (var b = 0; b < bridges.length; b++) {
				var bridge = bridges[b];
				var methods = [];
				
					var client = bridge.clientMethods();
					var server = bridge.serverMethods();
					for (var c in client) {
						methods.push(c + ": " + client[c]);
					}
					for (var s in server) {
						methods.push(server[s] + ": function () {return new Promise((done) => {Websom.sendBridge('" + bridge.getName() + "', '" + server[s] + "', arguments, done);})}");
					}
				
				
				viewStr += bridge.getName() + " = {" + methods.join(", ") + "};";
				}
			if ("resources" in module.baseConfig) {
				var raw = module.baseConfig["resources"];
				for (var r = 0; r < raw.length; r++) {
					var res = raw[r];
					var type = "";
					var path = res["path"];
					if (("type" in res) == false) {
						var realPath = Oxygen.FileSystem.resolve(module.root + "/" + path);
						if (Oxygen.FileSystem.isDir(realPath)) {
							var files = Oxygen.FileSystem.readDirSync(realPath);
							for (var f = 0; f < files.length; f++) {
								var file = files[f];
								var splits = file.split(".");
								if (splits.length > 1) {
									if (splits[splits.length - 1] == "view") {
										var view = new Websom.View(_c_this.server);
										var viewErr = view.loadFromFile(realPath + "/" + file);
										view.hasLocalExport = true;
										viewStr += view.buildDev();
										}
									}
								}
							}
						}else{
							type = res["type"];
							if (type == "view") {
								var view = new Websom.View(_c_this.server);
								var viewErr = view.loadFromFile(Oxygen.FileSystem.resolve(module.root + "/" + path));
								view.hasLocalExport = true;
								viewStr += view.buildDev();
								}
						}
					}
				}
			if (saveToFiles) {
				Oxygen.FileSystem.writeSync(_c_this.server.config.resources + "/module-view-" + module.name + ".js", viewStr);
				viewStr = "";
				}
			}
		if (saveToFiles == false) {
			return viewStr;
			}}

Websom.Services.Resource.prototype.exportToFolder = function (path, callback) {var _c_this = this; var _c_root_method_arguments = arguments;
		var that = _c_this;
		Oxygen.FileSystem.writeSync(path + "/client.js", Oxygen.FileSystem.readSync(_c_this.server.config.resources + "/client.js", null));
		Oxygen.FileSystem.writeSync(path + "/jquery.min.js", Oxygen.FileSystem.readSync(_c_this.server.config.resources + "/jquery.min.js", null));
		if (Oxygen.FileSystem.exists(_c_this.server.config.resources + "/text.js")) {
			Oxygen.FileSystem.writeSync(path + "/text.js", Oxygen.FileSystem.readSync(_c_this.server.config.resources + "/text.js", null));
			}
		var resources = _c_this.collect();
		var unbuilt = resources.length + _c_this.server.theme.themes.length;
		var error = false;
		var errMsg = "";
		var totalJs = _c_this.buildViews(false);
		var totalCss = "";
		for (var i = 0; i < _c_this.server.view.pages.length; i++) {
			var page = _c_this.server.view.pages[i];
			totalJs += page.buildDev();
			}
		for (var i = 0; i < _c_this.server.view.views.length; i++) {
			var view = _c_this.server.view.views[i];
			totalJs += view.buildDev();
			}
		var finish = function () {
			var closureCompiler = function (content, compiledBack) {
				
					require("request").post({url: "https://closure-compiler.appspot.com/compile", form: {js_code: content, compilation_level: "SIMPLE_OPTIMIZATIONS", output_info: "compiled_code", language_out: "ECMASCRIPT5", output_format: "text"}}, (err, res, body) => {
						compiledBack(body);
					});
				
				};
			var writeOut = function (vue) {
				closureCompiler(Oxygen.FileSystem.readSync(that.server.config.resources + "/jquery.min.js", "utf8") + "\n" + vue + "\n" + Oxygen.FileSystem.readSync(that.server.config.resources + "/client.js", "utf8") + "\n" + totalJs, function (compiled) {
Oxygen.FileSystem.writeSync(path + "/js.js", compiled);
Oxygen.FileSystem.writeSync(path + "/css.css", totalCss);
callback(error, errMsg);
});
				};
			
				require("request")("https://vuejs.org/js/vue.min.js", (err, res, body) => {writeOut(body);});
			
			};
		for (var i = 0; i < _c_this.server.theme.themes.length; i++) {
			var theme = _c_this.server.theme.themes[i];
			theme.build(function (err, js, css) {
				totalJs += js;
				totalCss += css;
				unbuilt--;
				if (unbuilt <= 0) {
					finish();
					}
				});
			}
		var builtJs = function (hadError, content) {
			if (hadError) {
				error = true;
				errMsg = content;
				}
			unbuilt--;
			totalJs += content + "\n\n";
			if (unbuilt <= 0) {
				finish();
				}
			};
		var builtCss = function (hadError, content) {
			if (hadError) {
				error = true;
				errMsg = content;
				}
			unbuilt--;
			totalCss += content;
			if (unbuilt <= 0) {
				finish();
				}
			};
		var files = _c_this.collect();
		for (var i = 0; i < files.length; i++) {
			var file = files[i];
			if (file.type == "file") {
				var base = Oxygen.FileSystem.basename(files[i].file);
				var bpath = base;
				if (files[i].raw != null) {
					if ("toPath" in files[i].raw) {
						var toPath = files[i].raw["toPath"];
						bpath = toPath + "/" + base;
						if (Oxygen.FileSystem.exists(path + "/" + toPath) == false) {
							Oxygen.FileSystem.makeDir(path + "/" + toPath);
							}
						}
					}
				files[i].buildToFile(path + "/" + bpath);
				}
			}
		for (var i = 0; i < resources.length; i++) {
			var resource = resources[i];
			if (resource.type == "less" || resource.type == "css") {
				resource.build(builtCss);
				}else if (resource.type == "javascript") {
				resource.build(builtJs);
				}else{
					unbuilt--;
					if (unbuilt <= 0) {
						finish();
						}
				}
			}}

Websom.Services.Resource.prototype.fetchViewConfigs = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		var views = _c_this.fetchViews();
		for (var i = 0; i < views.length; i++) {

			}}

Websom.Services.Resource.prototype.fetchViews = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		var files = [];
		var modules = _c_this.server.module.modules;
		var themes = _c_this.server.theme.themes;
		for (var i = 0; i < modules.length; i++) {
			var mod = modules[i];
			var resources = _c_this.compile(mod.name, mod.root, mod.baseConfig["resources"]);
			for (var j = 0; j < resources.length; j++) {
				var res = resources[j];
				if (res.type == "view") {
					files.push(res.file);
					}
				}
			}
		for (var i = 0; i < themes.length; i++) {
			var mod = themes[i];
			var resources = _c_this.compile(mod.name, mod.root, mod.config["resources"]);
			for (var j = 0; j < resources.length; j++) {
				var res = resources[j];
				if (res.type == "view") {
					files.push(res.file);
					}
				}
			}
		return files;}

Websom.Services.Resource.prototype.collect = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		var that = _c_this;
		var output = [];
		var buildPackage = function (typeStr, name, root, raw) {
			for (var r = 0; r < raw.length; r++) {
				var res = raw[r];
				var type = "";
				var path = res["path"];
				if (("type" in res) == false) {
					var realPath = Oxygen.FileSystem.resolve(root + "/" + path);
					if (Oxygen.FileSystem.isDir(realPath)) {
						var files = Oxygen.FileSystem.readDirSync(realPath);
						for (var f = 0; f < files.length; f++) {
							var file = files[f];
							var splits = file.split(".");
							if (splits.length > 1) {
								if (splits[splits.length - 1] == "view") {
									output.push(Websom.Resource.make(that.server, "view", typeStr + "-" + name, realPath + "/" + file));
									}
								}
							}
						}
					}else{
						type = res["type"];
						var realPath = Oxygen.FileSystem.resolve(root + "/" + path);
						if (Oxygen.FileSystem.isDir(realPath)) {
							var files = Oxygen.FileSystem.readDirSync(realPath);
							for (var f = 0; f < files.length; f++) {
								var file = files[f];
								output.push(Websom.Resource.make(that.server, type, typeStr + "-" + name, realPath + "/" + file));
								output[output.length - 1].raw = res;
								}
							}else{
								var resource = Websom.Resource.make(that.server, type, typeStr + "-" + name, realPath);
								if ("loadOrder" in res) {
									var cast = res["loadOrder"];
									resource.order = cast;
									}
								output.push(resource);
							}
					}
				}
			};
		for (var i = 0; i < _c_this.server.module.modules.length; i++) {
			var module = _c_this.server.module.modules[i];
			if ("resources" in module.baseConfig) {
				var raw = module.baseConfig["resources"];
				buildPackage("module", module.name, module.root, raw);
				}
			}
		return output;}

Websom.Services.Resource.prototype.build = function (dev) {var _c_this = this; var _c_root_method_arguments = arguments;
		if (Oxygen.FileSystem.exists(_c_this.server.config.resources) == false) {
			Oxygen.FileSystem.makeDir(_c_this.server.config.resources);
			}
		var files = _c_this.collect();
		var err = _c_this.buildViews(true);
		if (err != null) {
			return Websom.Status.singleError("View", err);
			}
		if (dev) {
			if (Oxygen.FileSystem.exists(_c_this.server.config.resources + "/jquery.min.js") == false) {
				Oxygen.FileSystem.writeSync(_c_this.server.config.resources + "/jquery.min.js", Oxygen.FileSystem.readSync(_c_this.server.websomRoot + "/client/javascript/jquery.min.js", "utf8"));
				}
			var client = new Websom.Resources.Javascript(_c_this.server, "Websom.Core", _c_this.server.websomRoot + "/client/javascript/client.js");
			var input = new Websom.Resources.Javascript(_c_this.server, "Websom.Core", _c_this.server.websomRoot + "/client/javascript/input.js");
			var theme = new Websom.Resources.Javascript(_c_this.server, "Websom.Core", _c_this.server.websomRoot + "/client/javascript/theme.js");
			Oxygen.FileSystem.writeSync(_c_this.server.config.resources + "/client.js", client.read() + theme.read() + input.read());
			for (var i = 0; i < files.length; i++) {
				var base = Oxygen.FileSystem.basename(files[i].file);
				if (files[i].type == "less") {
					base = base.replace(new RegExp("\\.[^\\.]+$", 'g'), "") + ".css";
					}
				var path = files[i].owner + "-" + base;
				if (files[i].raw != null) {
					if ("toPath" in files[i].raw) {
						var toPath = files[i].raw["toPath"];
						path = toPath + "/" + base;
						if (Oxygen.FileSystem.exists(_c_this.server.config.resources + "/" + toPath) == false) {
							Oxygen.FileSystem.makeDir(_c_this.server.config.resources + "/" + toPath);
							}
						}
					}
				files[i].buildToFile(_c_this.server.config.resources + "/" + path);
				}
			}}

Websom.Services.Resource.prototype.include = function (dev) {var _c_this = this; var _c_root_method_arguments = arguments;
		var output = "";
		if (dev) {
			output += "<script src=\"" + _c_this.server.config.clientResources + "/jquery.min.js\"></script>";
			var files = _c_this.collect();
			for (var i = 0; i < files.length; i++) {
				output += files[i].toHtmlInclude() + "\n";
				}
			for (var i = 0; i < _c_this.server.module.modules.length; i++) {
				output += "<script src='" + _c_this.server.config.clientResources + "/module-view-" + _c_this.server.module.modules[i].name + ".js'></script>";
				}
			}
		if (_c_this.assetFontAwesome) {
			output += "<link rel=\"stylesheet\" href=\"https:/" + "/use.fontawesome.com/releases/v5.3.1/css/all.css\" integrity=\"sha384-mzrmE5qonljUremFsqc01SB46JvROS7bZs3IO2EmfFsd15uHvIt+Y8vEf7N7fWAU\" crossorigin=\"anonymous\">";
			}
		return output;}

Websom.Services.Resource.prototype.compile = function (owner, basePath, resources) {var _c_this = this; var _c_root_method_arguments = arguments;
		var output = [];
		for (var i = 0; i < resources.length; i++) {
			var raw = resources[i];
			if ("type" in raw && "path" in raw) {
				var realPath = Oxygen.FileSystem.resolve(basePath + "/" + raw["path"]);
				if (Oxygen.FileSystem.exists(realPath)) {
					if (Oxygen.FileSystem.isDir(realPath)) {
						var files = Oxygen.FileSystem.readDirSync(realPath);
						for (var f = 0; f < files.length; f++) {
							var file = files[f];
							output.push(Websom.Resource.make(_c_this.server, raw["type"], owner, realPath + "/" + file));
							output[output.length - 1].raw = raw;
							}
						}else{
							output.push(Websom.Resource.make(_c_this.server, raw["type"], owner, realPath));
						}
					}else{
						output.push(Websom.Resource.invalid(_c_this.server, owner, realPath));
					}
				}else if ("path" in raw) {
				var realPath = Oxygen.FileSystem.resolve(basePath + "/" + raw["path"]);
				if (Oxygen.FileSystem.exists(realPath) && Oxygen.FileSystem.isDir(realPath)) {
					var files = Oxygen.FileSystem.readDirSync(realPath);
					for (var f = 0; f < files.length; f++) {
						var file = files[f];
						var splits = file.split(".");
						if (splits.length > 1) {
							if (splits[splits.length - 1] == "view") {
								output.push(Websom.Resource.make(_c_this.server, "view", owner, realPath + "/" + file));
								}
							}
						}
					}
				}else{
					output.push(Websom.Resource.invalid(_c_this.server, owner, "Unknown"));
				}
			}
		return output;}

Websom.Services.Resource.prototype.preStart = function () {var _c_this = this; var _c_root_method_arguments = arguments;
}

Websom.Services.Resource.prototype.stop = function () {var _c_this = this; var _c_root_method_arguments = arguments;
}

Websom.Services.Resource.prototype.end = function () {var _c_this = this; var _c_root_method_arguments = arguments;
}

Websom.DeployHandler = function (server) {var _c_this = this;
	this.name = "";

	this.server = null;

		_c_this.server = server;
}

Websom.DeployHandler.prototype.getFiles = function (callback) {var _c_this = this; var _c_root_method_arguments = arguments;
		
			const path = require("fs");
			const fs = require("fs");
			let outFiles = [];

			function scanDir(base, abs, files) {
				for (let file of files) {
					if (file.name != ".git")
					if (file.isDirectory() || (file.isSymbolicLink() && fs.statSync(abs + file.name).isDirectory())) {
						let rp = fs.realpathSync(abs + file.name);
						scanDir(base + file.name + "/", rp + "/", fs.readdirSync(rp, {withFileTypes: true}));
					}else{
						outFiles.push(base + file.name);
					}
				}
			}

			scanDir("", this.server.config.root + "/", fs.readdirSync(this.server.config.root, {withFileTypes: true}));

			callback(outFiles);
		}

Websom.FtpHandler = function (server) {var _c_this = this;
	this.name = "ftp";

	this.server = null;

		_c_this.server = server;
}

Websom.FtpHandler.prototype.execute = function (config, progress, finish) {var _c_this = this; var _c_root_method_arguments = arguments;
		
			const ftp = require("ftp");

			let client = new ftp();

			progress("Connecting to " + config.host);

			client.connect({
				host: config.host,
				user: config.user,
				password: config.password,
				port: config.port || 21
			});

			client.on("error", (err) => {
				progress(err.toString());
			});

			client.on("ready", () => {
				progress("Connected");
			});

		}

Websom.FtpHandler.prototype.getFiles = function (callback) {var _c_this = this; var _c_root_method_arguments = arguments;
		
			const path = require("fs");
			const fs = require("fs");
			let outFiles = [];

			function scanDir(base, abs, files) {
				for (let file of files) {
					if (file.name != ".git")
					if (file.isDirectory() || (file.isSymbolicLink() && fs.statSync(abs + file.name).isDirectory())) {
						let rp = fs.realpathSync(abs + file.name);
						scanDir(base + file.name + "/", rp + "/", fs.readdirSync(rp, {withFileTypes: true}));
					}else{
						outFiles.push(base + file.name);
					}
				}
			}

			scanDir("", this.server.config.root + "/", fs.readdirSync(this.server.config.root, {withFileTypes: true}));

			callback(outFiles);
		}

Websom.LocalHandler = function (server) {var _c_this = this;
	this.name = "local";

	this.server = null;

		_c_this.server = server;
}

Websom.LocalHandler.prototype.execute = function (config, progress, finish) {var _c_this = this; var _c_root_method_arguments = arguments;
		
			let that = this;

			const fs = require("fs");
			const path = require("path");

			progress("Checking local location");

			if (!fs.existsSync(config.location)) {
				progress(config.location + " does not exist");
				finish();
				return;
			}

			let root = this.server.config.root;
			let to = config.location;

			function mkdir(dir) {
				let upDir = path.resolve(dir + "/../");
				if (!fs.existsSync(upDir))
					mkdir(upDir);
				
				fs.mkdirSync(dir);
			}

			
			if (!fs.existsSync(to + "/resources")) {
				mkdir(to + "/resources");
			}

			if (!fs.existsSync(to + "/website")) {
				mkdir(to + "/website");
			}

			if (!fs.existsSync(to + "/websom")) {
				mkdir(to + "/websom");
				mkdir(to + "/websom/native/php");
				mkdir(to + "/websom/native/javascript");
				mkdir(to + "/websom/dashboard");
				mkdir(to + "/websom/coreModule");
			}

			fs.copyFileSync(this.server.websomRoot + "/coreModule/module.js", to + "/websom/coreModule/module.js");
			fs.copyFileSync(this.server.websomRoot + "/coreModule/module.php", to + "/websom/coreModule/module.php");
			fs.copyFileSync(this.server.websomRoot + "/coreModule/coreModule.json", to + "/websom/coreModule/coreModule.json");

			fs.copyFileSync(this.server.websomRoot + "/dashboard/module.js", to + "/websom/dashboard/module.js");
			fs.copyFileSync(this.server.websomRoot + "/dashboard/module.php", to + "/websom/dashboard/module.php");
			fs.copyFileSync(this.server.websomRoot + "/dashboard/dashboard.json", to + "/websom/dashboard/dashboard.json");

			fs.copyFileSync(this.server.websomRoot + "/native/php/websom.php", to + "/websom/native/php/websom.php");
			fs.copyFileSync(this.server.websomRoot + "/native/javascript/websom.js", to + "/websom/native/javascript/websom.js");

			this.server.resource.exportToFolder(to + "/resources", (err) => {
				if (config.gzip) {
					const zlib = require("zlib");

					function gzip(file) {
						let fileContents = fs.createReadStream(file);
						let writeStream = fs.createWriteStream(file + ".gz");
						let zip = zlib.createGzip();

						fileContents.pipe(zip).pipe(writeStream).on('finish', (err) => {
							if (err) console.log(err);
						});
					}

					gzip(to + "/resources/js.js");
					gzip(to + "/resources/css.css");
				}


				that.getFiles((files) => {
					files = files.sort((a, b) => {return a.length - b.length});
					let remaining = files.length;

					for (let file of files) {
						if (!fs.existsSync(path.dirname(to + "/website/" + file)))
							mkdir(path.dirname(to + "/website/" + file));
						
						fs.copyFile(root + "/" + file, to + "/website/" + file, () => { if (--remaining == 0) finish(); });
						                                                                                     
					}
				});
			});

			if (config.index) {
				fs.writeFileSync(to + "/index.php", "<?php \n\ninclude('websom/native/php/websom.php'); \nWebsom_PHP::load(); \n$server = new Websom_Server(Websom_Config::load('website/config.ini')); \n$route = ''; \nif (isset($_GET['route'])) \n\t$route = $_GET['route']; \n\n$server->run('/' . $route); \n\n?>");
			}

			if (config[".htaccess"]) {
				fs.writeFileSync(to + "/websom/.htaccess", "Deny from all");
				fs.writeFileSync(to + "/website/.htaccess", "Deny from all");

				fs.writeFileSync(to + "/.htaccess", `RewriteEngine On
RewriteBase /
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond $1 !^(index\.php|public|css|js|robots\.txt)
RewriteRule ^(.*)$ index.php?route=$1 [L,QSA]

ErrorDocument 404 /index.php`);
			}

			if (config.platform == "php" && config.gzip) {
				fs.writeFileSync(to + "/resources/.htaccess", `AddEncoding gzip .gz

RewriteCond %{HTTP:Accept-encoding} gzip
RewriteCond %{REQUEST_FILENAME}\.gz -s
RewriteRule ^(.*)\.css $1\.css\.gz [QSA]

RewriteCond %{HTTP:Accept-encoding} gzip
RewriteCond %{REQUEST_FILENAME}\.gz -s
RewriteRule ^(.*)\.js $1\.js\.gz [QSA]

RewriteRule \.css\.gz$ - [T=text/css,E=no-gzip:1]
RewriteRule \.js\.gz$ - [T=text/javascript,E=no-gzip:1]`);
			}
		}

Websom.LocalHandler.prototype.getFiles = function (callback) {var _c_this = this; var _c_root_method_arguments = arguments;
		
			const path = require("fs");
			const fs = require("fs");
			let outFiles = [];

			function scanDir(base, abs, files) {
				for (let file of files) {
					if (file.name != ".git")
					if (file.isDirectory() || (file.isSymbolicLink() && fs.statSync(abs + file.name).isDirectory())) {
						let rp = fs.realpathSync(abs + file.name);
						scanDir(base + file.name + "/", rp + "/", fs.readdirSync(rp, {withFileTypes: true}));
					}else{
						outFiles.push(base + file.name);
					}
				}
			}

			scanDir("", this.server.config.root + "/", fs.readdirSync(this.server.config.root, {withFileTypes: true}));

			callback(outFiles);
		}

Websom.Resource = function (server, owner, file) {var _c_this = this;
	this.server = null;

	this.owner = "";

	this.file = "";

	this.type = "resource";

	this.order = 0;

	this.isInvalid = false;

	this.reference = "";

	this.bundle = "";

	this.raw = null;

		_c_this.owner = owner;
		_c_this.file = file;
		_c_this.server = server;
}

Websom.Resource.make = function (server, type, owner, file) {var _c_this = this; var _c_root_method_arguments = arguments;
		if (type == "javascript") {
			return new Websom.Resources.Javascript(server, owner, file);
			}else if (type == "css") {
			return new Websom.Resources.Css(server, owner, file);
			}else if (type == "less") {
			return new Websom.Resources.Less(server, owner, file);
			}else if (type == "view") {
			return new Websom.Resources.View(server, owner, file);
			}else if (type == "file") {
			return new Websom.Resources.File(server, owner, file);
			}else{
				var invalid = new Websom.Resource(server, owner, file);
				invalid.isInvalid = true;
				return invalid;
			}}

Websom.Resource.invalid = function (server, owner, path) {var _c_this = this; var _c_root_method_arguments = arguments;
		var invalid = new Websom.Resource(server, owner, path);
		invalid.isInvalid = true;
		return invalid;}

Websom.Resource.prototype.read = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		return Oxygen.FileSystem.readSync(_c_this.file, "utf8");}

Websom.Resource.prototype.rawRead = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		return Oxygen.FileSystem.readSync(_c_this.file, null);}

Websom.Resources = function () {var _c_this = this;


}

Websom.Resources.Javascript = function (server, owner, file) {var _c_this = this;
	this.type = "javascript";

	this.server = null;

	this.owner = "";

	this.file = "";

	this.order = 0;

	this.isInvalid = false;

	this.reference = "";

	this.bundle = "";

	this.raw = null;

		_c_this.owner = owner;
		_c_this.file = file;
		_c_this.server = server;
}

Websom.Resources.Javascript.prototype.buildToFile = function (path) {var _c_this = this; var _c_root_method_arguments = arguments;
		Oxygen.FileSystem.writeSync(path, _c_this.read());}

Websom.Resources.Javascript.prototype.toHtmlInclude = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		return "<script src=\"" + _c_this.server.config.clientResources + "/" + _c_this.owner + "-" + Oxygen.FileSystem.basename(_c_this.file) + "\"></script>";}

Websom.Resources.Javascript.prototype.build = function (callback) {var _c_this = this; var _c_root_method_arguments = arguments;
		callback(false, _c_this.read());}

Websom.Resources.Javascript.make = function (server, type, owner, file) {var _c_this = this; var _c_root_method_arguments = arguments;
		if (type == "javascript") {
			return new Websom.Resources.Javascript(server, owner, file);
			}else if (type == "css") {
			return new Websom.Resources.Css(server, owner, file);
			}else if (type == "less") {
			return new Websom.Resources.Less(server, owner, file);
			}else if (type == "view") {
			return new Websom.Resources.View(server, owner, file);
			}else if (type == "file") {
			return new Websom.Resources.File(server, owner, file);
			}else{
				var invalid = new Websom.Resource(server, owner, file);
				invalid.isInvalid = true;
				return invalid;
			}}

Websom.Resources.Javascript.invalid = function (server, owner, path) {var _c_this = this; var _c_root_method_arguments = arguments;
		var invalid = new Websom.Resource(server, owner, path);
		invalid.isInvalid = true;
		return invalid;}

Websom.Resources.Javascript.prototype.read = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		return Oxygen.FileSystem.readSync(_c_this.file, "utf8");}

Websom.Resources.Javascript.prototype.rawRead = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		return Oxygen.FileSystem.readSync(_c_this.file, null);}

Websom.Resources.File = function (server, owner, file) {var _c_this = this;
	this.type = "file";

	this.server = null;

	this.owner = "";

	this.file = "";

	this.order = 0;

	this.isInvalid = false;

	this.reference = "";

	this.bundle = "";

	this.raw = null;

		_c_this.owner = owner;
		_c_this.file = file;
		_c_this.server = server;
}

Websom.Resources.File.prototype.buildToFile = function (path) {var _c_this = this; var _c_root_method_arguments = arguments;
		Oxygen.FileSystem.writeSync(path, _c_this.rawRead());}

Websom.Resources.File.prototype.toHtmlInclude = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		return "";}

Websom.Resources.File.prototype.build = function (callback) {var _c_this = this; var _c_root_method_arguments = arguments;
		callback(false, _c_this.read());}

Websom.Resources.File.make = function (server, type, owner, file) {var _c_this = this; var _c_root_method_arguments = arguments;
		if (type == "javascript") {
			return new Websom.Resources.Javascript(server, owner, file);
			}else if (type == "css") {
			return new Websom.Resources.Css(server, owner, file);
			}else if (type == "less") {
			return new Websom.Resources.Less(server, owner, file);
			}else if (type == "view") {
			return new Websom.Resources.View(server, owner, file);
			}else if (type == "file") {
			return new Websom.Resources.File(server, owner, file);
			}else{
				var invalid = new Websom.Resource(server, owner, file);
				invalid.isInvalid = true;
				return invalid;
			}}

Websom.Resources.File.invalid = function (server, owner, path) {var _c_this = this; var _c_root_method_arguments = arguments;
		var invalid = new Websom.Resource(server, owner, path);
		invalid.isInvalid = true;
		return invalid;}

Websom.Resources.File.prototype.read = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		return Oxygen.FileSystem.readSync(_c_this.file, "utf8");}

Websom.Resources.File.prototype.rawRead = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		return Oxygen.FileSystem.readSync(_c_this.file, null);}

Websom.Resources.View = function (server, owner, file) {var _c_this = this;
	this.type = "view";

	this.server = null;

	this.owner = "";

	this.file = "";

	this.order = 0;

	this.isInvalid = false;

	this.reference = "";

	this.bundle = "";

	this.raw = null;

		_c_this.owner = owner;
		_c_this.file = file;
		_c_this.server = server;
}

Websom.Resources.View.prototype.buildToFile = function (path) {var _c_this = this; var _c_root_method_arguments = arguments;
}

Websom.Resources.View.prototype.toHtmlInclude = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		return "";}

Websom.Resources.View.prototype.build = function (callback) {var _c_this = this; var _c_root_method_arguments = arguments;
		var view = new Websom.View(_c_this.server);
		view.loadFromFile(_c_this.file);
		callback(false, view.buildDev());}

Websom.Resources.View.make = function (server, type, owner, file) {var _c_this = this; var _c_root_method_arguments = arguments;
		if (type == "javascript") {
			return new Websom.Resources.Javascript(server, owner, file);
			}else if (type == "css") {
			return new Websom.Resources.Css(server, owner, file);
			}else if (type == "less") {
			return new Websom.Resources.Less(server, owner, file);
			}else if (type == "view") {
			return new Websom.Resources.View(server, owner, file);
			}else if (type == "file") {
			return new Websom.Resources.File(server, owner, file);
			}else{
				var invalid = new Websom.Resource(server, owner, file);
				invalid.isInvalid = true;
				return invalid;
			}}

Websom.Resources.View.invalid = function (server, owner, path) {var _c_this = this; var _c_root_method_arguments = arguments;
		var invalid = new Websom.Resource(server, owner, path);
		invalid.isInvalid = true;
		return invalid;}

Websom.Resources.View.prototype.read = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		return Oxygen.FileSystem.readSync(_c_this.file, "utf8");}

Websom.Resources.View.prototype.rawRead = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		return Oxygen.FileSystem.readSync(_c_this.file, null);}

Websom.Resources.Css = function (server, owner, file) {var _c_this = this;
	this.type = "css";

	this.server = null;

	this.owner = "";

	this.file = "";

	this.order = 0;

	this.isInvalid = false;

	this.reference = "";

	this.bundle = "";

	this.raw = null;

		_c_this.owner = owner;
		_c_this.file = file;
		_c_this.server = server;
}

Websom.Resources.Css.prototype.buildToFile = function (path) {var _c_this = this; var _c_root_method_arguments = arguments;
		Oxygen.FileSystem.writeSync(path, _c_this.read());}

Websom.Resources.Css.prototype.toHtmlInclude = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		return "<link rel=\"stylesheet\" href=\"" + _c_this.server.config.clientResources + "/" + _c_this.owner + "-" + Oxygen.FileSystem.basename(_c_this.file) + "\"/>";}

Websom.Resources.Css.prototype.build = function (callback) {var _c_this = this; var _c_root_method_arguments = arguments;
		callback(false, _c_this.read());}

Websom.Resources.Css.make = function (server, type, owner, file) {var _c_this = this; var _c_root_method_arguments = arguments;
		if (type == "javascript") {
			return new Websom.Resources.Javascript(server, owner, file);
			}else if (type == "css") {
			return new Websom.Resources.Css(server, owner, file);
			}else if (type == "less") {
			return new Websom.Resources.Less(server, owner, file);
			}else if (type == "view") {
			return new Websom.Resources.View(server, owner, file);
			}else if (type == "file") {
			return new Websom.Resources.File(server, owner, file);
			}else{
				var invalid = new Websom.Resource(server, owner, file);
				invalid.isInvalid = true;
				return invalid;
			}}

Websom.Resources.Css.invalid = function (server, owner, path) {var _c_this = this; var _c_root_method_arguments = arguments;
		var invalid = new Websom.Resource(server, owner, path);
		invalid.isInvalid = true;
		return invalid;}

Websom.Resources.Css.prototype.read = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		return Oxygen.FileSystem.readSync(_c_this.file, "utf8");}

Websom.Resources.Css.prototype.rawRead = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		return Oxygen.FileSystem.readSync(_c_this.file, null);}

Websom.Resources.Less = function (server, owner, file) {var _c_this = this;
	this.type = "less";

	this.server = null;

	this.owner = "";

	this.file = "";

	this.order = 0;

	this.isInvalid = false;

	this.reference = "";

	this.bundle = "";

	this.raw = null;

		_c_this.owner = owner;
		_c_this.file = file;
		_c_this.server = server;
}

Websom.Resources.Less.prototype.buildToFile = function (path) {var _c_this = this; var _c_root_method_arguments = arguments;
		_c_this.build(function (err, content) {
			Oxygen.FileSystem.writeSync(path, content);
			});}

Websom.Resources.Less.prototype.toHtmlInclude = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		var basename = Oxygen.FileSystem.basename(_c_this.file);
		return "<link rel=\"stylesheet\" href=\"" + _c_this.server.config.clientResources + "/" + _c_this.owner + "-" + basename.replace(new RegExp("\\.[^\\.]+$", 'g'), "") + ".css\"/>";}

Websom.Resources.Less.prototype.build = function (callback) {var _c_this = this; var _c_root_method_arguments = arguments;
		
			var lessBuilder = require("../../core/util/native/less.js");                              
			
			lessBuilder.compileLess(this.reference, this.file, callback);
		
		}

Websom.Resources.Less.make = function (server, type, owner, file) {var _c_this = this; var _c_root_method_arguments = arguments;
		if (type == "javascript") {
			return new Websom.Resources.Javascript(server, owner, file);
			}else if (type == "css") {
			return new Websom.Resources.Css(server, owner, file);
			}else if (type == "less") {
			return new Websom.Resources.Less(server, owner, file);
			}else if (type == "view") {
			return new Websom.Resources.View(server, owner, file);
			}else if (type == "file") {
			return new Websom.Resources.File(server, owner, file);
			}else{
				var invalid = new Websom.Resource(server, owner, file);
				invalid.isInvalid = true;
				return invalid;
			}}

Websom.Resources.Less.invalid = function (server, owner, path) {var _c_this = this; var _c_root_method_arguments = arguments;
		var invalid = new Websom.Resource(server, owner, path);
		invalid.isInvalid = true;
		return invalid;}

Websom.Resources.Less.prototype.read = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		return Oxygen.FileSystem.readSync(_c_this.file, "utf8");}

Websom.Resources.Less.prototype.rawRead = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		return Oxygen.FileSystem.readSync(_c_this.file, null);}

Websom.Services.Router = function (server) {var _c_this = this;
	this.routes = [];

	this.injectScript = "";

	this.server = null;

		_c_this.server = server;
		_c_this.preStart();
}

Websom.Services.Router.prototype.route = function (routeString, handler) {var _c_this = this; var _c_root_method_arguments = arguments;
		var splits = _c_this.buildSplits(routeString);
		var route = new Websom.Route(routeString, splits, handler);
		_c_this.routes.push(route);
		return route;}

Websom.Services.Router.prototype.post = function (routeString, handler) {var _c_this = this; var _c_root_method_arguments = arguments;
		var splits = _c_this.buildSplits(routeString);
		var route = new Websom.Route(routeString, splits, null);
		route.postHandler = handler;
		route.post = true;
		_c_this.routes.push(route);
		return route;}

Websom.Services.Router.prototype.start = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		for (var i = 0; i < _c_this.server.view.pages.length; i++) {
			var view = _c_this.server.view.pages[i];
			_c_this.routeView(view);
			}
		var that = _c_this;
		if (_c_this.server.config.dev) {
			_c_this.route("/websom.info", function (req) {
				var info = [];
				info.push("<tr><th>Website root</th><th>" + that.server.config.root + "</th></tr>");
				req.send("<h1>Websom server info</h1><br><table><thead><th>Info</th><th>Value</th></thead><tbody>" + info.join("") + "</tbody></table>");
				});
			}}

Websom.Services.Router.prototype.injectSends = function (req, clientData, readyToSend) {var _c_this = this; var _c_root_method_arguments = arguments;
		var clientDatas = _c_this.server.module.modules.length;
		for (var i = 0; i < _c_this.server.module.modules.length; i++) {
			var mod = _c_this.server.module.modules[i];
			var shouldWait = mod.clientData(req, function (key, value) {
				clientDatas--;
				clientData[key] = value;
				if (clientDatas == 0) {
					readyToSend();
					}
				});
			if (shouldWait == false) {
				clientDatas--;
				}
			if (clientDatas == 0) {
				readyToSend();
				}
			}}

Websom.Services.Router.prototype.include = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		if (_c_this.server.config.dev) {
			return "<script src=\"https:/" + "/cdn.jsdelivr.net/npm/vue/dist/vue.js\"></script><script src=\"" + _c_this.server.config.clientResources + "/client.js\"></script>" + _c_this.server.view.include() + _c_this.server.resource.include(true) + _c_this.server.theme.include() + _c_this.server.input.clientValidate + "<script src=\"" + _c_this.server.config.clientResources + "/text.js\"></script>";
			}else{
				return "<script src=\"" + _c_this.server.config.clientResources + "/js.js\"></script>" + "<link rel=\"stylesheet\" href=\"" + _c_this.server.config.clientResources + "/css.css\">" + "<script src=\"" + _c_this.server.config.clientResources + "/text.js\"></script>";
			}}

Websom.Services.Router.prototype.includeAfter = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		if (_c_this.server.config.dev == false) {
			return _c_this.server.resource.include(false);
			}
		return "";}

Websom.Services.Router.prototype.wrapPage = function (content) {var _c_this = this; var _c_root_method_arguments = arguments;
		var metas = "";
		if (_c_this.server.config.hasManifest) {
			metas += "<link rel='manifest' href='" + _c_this.server.config.manifestPath + "'>";
			}
		return "<!DOCTYPE html><html lang=\"en\"><head><meta name='viewport' content='width=device-width, initial-scale=1'><meta name='theme-color' content='" + _c_this.server.config.brandColor + "'/>" + metas + _c_this.include() + "</head><body>" + content + _c_this.includeAfter() + "</body></html>";}

Websom.Services.Router.prototype.sendStringView = function (req, template) {var _c_this = this; var _c_root_method_arguments = arguments;
		var themeClass = "theme";
		if (_c_this.server.config.defaultTheme.length > 0) {
			themeClass = "theme-" + _c_this.server.config.defaultTheme;
			}
		req.send(_c_this.wrapPage("<script>Websom.Client = {};</script><div id='page' class='" + themeClass + "'>" + template + "</div><script>document.body.setAttribute('class', document.getElementById('page').getAttribute('class'));page = new Vue({el: '#page', data: {data: {}}});</script>"));}

Websom.Services.Router.prototype.routeString = function (route, template) {var _c_this = this; var _c_root_method_arguments = arguments;
		var that = _c_this;
		return _c_this.route(route, function (req) {
			var data = {};
			var themeClass = "theme";
			if (that.server.config.defaultTheme.length > 0) {
				themeClass = "theme-" + that.server.config.defaultTheme;
				}
			var clientData = {};
			var clientDatas = 0;
			var readyToSend = function () {
				var rawClientData = Websom.Json.encode(clientData);
				if (rawClientData == "null") {
					rawClientData = "{}";
					}
				req.send(that.wrapPage("<script>Websom.Client = " + rawClientData + "; " + that.injectScript + "</script><div id='page' class='" + themeClass + "'>" + template + "</div><script>document.body.setAttribute('class', document.getElementById('page').getAttribute('class'));page = new Vue({el: '#page', data: {data: {}}});</script>"));
				};
			that.injectSends(req, clientData, readyToSend);
			});}

Websom.Services.Router.prototype.navView = function () {var _c_this = this; var _c_root_method_arguments = arguments;
	if (arguments.length == 6 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'string' || typeof arguments[1] == 'undefined' || arguments[1] === null) && (typeof arguments[2] == 'string' || typeof arguments[2] == 'undefined' || arguments[2] === null) && (typeof arguments[3] == 'string' || typeof arguments[3] == 'undefined' || arguments[3] === null) && (typeof arguments[4] == 'boolean' || typeof arguments[4] == 'undefined' || arguments[4] === null) && (typeof arguments[5] == 'string' || typeof arguments[5] == 'undefined' || arguments[5] === null)) {
		var routeStr = arguments[0];
		var container = arguments[1];
		var view = arguments[2];
		var validate = arguments[3];
		var canEdit = arguments[4];
		var editKey = arguments[5];
		var canEditStr = "false";
		if (canEdit) {
			canEditStr = "true";
			}
		var route = _c_this.routeString(routeStr, "<default-body content-type='navView' container='" + container + "' auto='true' view-name='" + view + "'><nav-view validate='" + validate + "' container='" + container + "' edit-key='" + editKey + "' view='" + view + "' :show-edit='" + canEditStr + "' /></default-body>");
		route.greedy = true;
		return route;
	}
else 	if (arguments.length == 7 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'string' || typeof arguments[1] == 'undefined' || arguments[1] === null) && (typeof arguments[2] == 'string' || typeof arguments[2] == 'undefined' || arguments[2] === null) && (typeof arguments[3] == 'string' || typeof arguments[3] == 'undefined' || arguments[3] === null) && (typeof arguments[4] == 'string' || typeof arguments[4] == 'undefined' || arguments[4] === null) && (typeof arguments[5] == 'boolean' || typeof arguments[5] == 'undefined' || arguments[5] === null) && (typeof arguments[6] == 'string' || typeof arguments[6] == 'undefined' || arguments[6] === null)) {
		var routeStr = arguments[0];
		var container = arguments[1];
		var view = arguments[2];
		var validate = arguments[3];
		var publicKey = arguments[4];
		var canEdit = arguments[5];
		var editKey = arguments[6];
		var canEditStr = "false";
		if (canEdit) {
			canEditStr = "true";
			}
		var route = _c_this.routeString(routeStr, "<default-body content-type='navView' container='" + container + "' auto='true' view-name='" + view + "'><nav-view :show-save='false' validate='" + validate + "' public-key='" + publicKey + "' container='" + container + "' edit-key='" + editKey + "' view='" + view + "' :show-edit='" + canEditStr + "' /></default-body>");
		route.greedy = true;
		return route;
	}
}

Websom.Services.Router.prototype.quickRoute = function (route, viewName) {var _c_this = this; var _c_root_method_arguments = arguments;
		var that = _c_this;
		return _c_this.route(route, function (req) {
			var data = {};
			var themeClass = "theme";
			if (that.server.config.defaultTheme.length > 0) {
				themeClass = "theme-" + that.server.config.defaultTheme;
				}
			var clientData = {};
			var clientDatas = 0;
			var readyToSend = function () {
				var rawClientData = Websom.Json.encode(clientData);
				if (rawClientData == "null") {
					rawClientData = "{}";
					}
				req.send(that.wrapPage("<script>Websom.Client = " + rawClientData + "; " + that.injectScript + "</script><div id='page' class='" + themeClass + "'><" + viewName + " v-bind:data='data'></" + viewName + "></div><script>document.body.setAttribute('class', document.getElementById('page').getAttribute('class'));page = new Vue({el: '#page', data: {data: {}}});</script>"));
				};
			that.injectSends(req, clientData, readyToSend);
			});}

Websom.Services.Router.prototype.routeView = function (view) {var _c_this = this; var _c_root_method_arguments = arguments;
		var that = _c_this;
		var r = _c_this.route(view.handles, function (req) {
			var data = {};
			if (view.hasServerScript) {
				data = view.runServerScript(req);
				}
			var themeClass = "theme";
			if (that.server.config.defaultTheme.length > 0) {
				themeClass = "theme-" + that.server.config.defaultTheme;
				}
			var clientData = {};
			var clientDatas = 0;
			var readyToSend = function () {
				var rawClientData = Websom.Json.encode(clientData);
				var content = "<script>document.body.setAttribute('class', document.getElementById('page').getAttribute('class'));page = new Vue({el: '#page', data: {data: " + JSON.stringify(data) + "}}); $('#server-static').remove();</script>";
				var serverStatic = "";
				var ctx = new Websom.Render.Context();
				if (that.server.config.forceSsr) {
					content = that.server.render.renderView(view, ctx);
					}else{

					}
				if (rawClientData == "null") {
					rawClientData = "{}";
					}
				req.send(that.wrapPage(serverStatic + "<script>Websom.Client = " + rawClientData + "; " + that.injectScript + "</script><div id='page' class='" + themeClass + "'><" + view.name + " v-bind:data='data'></" + view.name + "></div>" + content));
				};
			that.injectSends(req, clientData, readyToSend);
			});
		r.greedy = view.greedy;}

Websom.Services.Router.prototype.buildSplits = function (route) {var _c_this = this; var _c_root_method_arguments = arguments;
		return route.split("/");}

Websom.Services.Router.prototype.find = function (query, post) {var _c_this = this; var _c_root_method_arguments = arguments;
		var splits = _c_this.buildSplits(query);
		for (var i = 0; i < _c_this.routes.length; i++) {
			var route = _c_this.routes[i];
			if (route.match(splits) && route.post == post) {
				return route;
				}
			}
		return null;}

Websom.Services.Router.prototype.handle = function (req) {var _c_this = this; var _c_root_method_arguments = arguments;
		var route = _c_this.find(req.path, false);
		if (route == null) {
			req.code(404);
			req.send("Error page not found.");
			}else{
				route.handle(req);
			}}

Websom.Services.Router.prototype.handlePost = function (raw, req) {var _c_this = this; var _c_root_method_arguments = arguments;
		var input = new Websom.Input("", raw, req);
		input.server = _c_this.server;
		var route = _c_this.find(req.path, true);
		if (route == null) {
			req.code(404);
			req.send("Error route not found.");
			}else{
				route.handlePost(input);
			}}

Websom.Services.Router.prototype.preStart = function () {var _c_this = this; var _c_root_method_arguments = arguments;
}

Websom.Services.Router.prototype.stop = function () {var _c_this = this; var _c_root_method_arguments = arguments;
}

Websom.Services.Router.prototype.end = function () {var _c_this = this; var _c_root_method_arguments = arguments;
}

Websom.Route = function () {var _c_this = this;
	this.greedy = false;

	this.post = false;

	this.route = "";

	this.splits = null;

	this.handler = null;

	this.postHandler = null;

	if (arguments.length == 3 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null) && (arguments[1] instanceof Array || typeof arguments[1] == 'undefined' || arguments[1] === null) && (typeof arguments[2] == 'function' || typeof arguments[2] == 'undefined' || arguments[2] === null)) {
		var route = arguments[0];
		var splits = arguments[1];
		var handler = arguments[2];
		_c_this.route = route;
		_c_this.splits = splits;
		_c_this.handler = handler;
	}
else 	if (arguments.length == 3 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null) && (arguments[1] instanceof Array || typeof arguments[1] == 'undefined' || arguments[1] === null) && (typeof arguments[2] == 'function' || typeof arguments[2] == 'undefined' || arguments[2] === null)) {
		var route = arguments[0];
		var splits = arguments[1];
		var handler = arguments[2];
		_c_this.route = route;
		_c_this.splits = splits;
		_c_this.postHandler = handler;
	}

}

Websom.Route.prototype.match = function (otherSplits) {var _c_this = this; var _c_root_method_arguments = arguments;
		if (_c_this.greedy == false) {
			if (_c_this.splits.length != otherSplits.length) {
				return false;
				}
			}
		if (_c_this.splits.length > otherSplits.length) {
			return false;
			}
		if (_c_this.greedy) {
			for (var i = 0; i < _c_this.splits.length; i++) {
				var split = _c_this.splits[i];
				if (split != otherSplits[i]) {
					return false;
					}
				}
			}else{
				for (var i = 0; i < otherSplits.length; i++) {
					if (otherSplits[i] != _c_this.splits[i]) {
						return false;
						}
					}
			}
		return true;}

Websom.Route.prototype.handle = function (req) {var _c_this = this; var _c_root_method_arguments = arguments;
		_c_this.handler(req);}

Websom.Route.prototype.handlePost = function (input) {var _c_this = this; var _c_root_method_arguments = arguments;
		_c_this.postHandler(input);}

Websom.Services.Security = function (server) {var _c_this = this;
	this.loaded = false;

	this.captchaService = "";

	this.serviceKey = "";

	this.publicKey = "";

	this.configPath = "";

	this.updateLimit = 6;

	this.insertLimit = 3;

	this.selectLimit = 60;

	this.message = "Too many requests.";

	this.interval = 60000;

	this.captchaAdapter = null;

	this.captcha = null;

	this.server = null;

		_c_this.server = server;
		_c_this.preStart();
}

Websom.Services.Security.prototype.preStart = function () {var _c_this = this; var _c_root_method_arguments = arguments;
	if (arguments.length == 0) {
		_c_this.captchaAdapter = _c_this.server.adapt("captcha");
	}
else 	if (arguments.length == 0) {

	}
}

/*i async*/Websom.Services.Security.prototype.loadAdapter = async function () {var _c_this = this; var _c_root_method_arguments = arguments;
/*async*/
		(await _c_this.captchaAdapter.loadFromConfig/* async call */());
		_c_this.captcha = _c_this.captchaAdapter.adapter;}

Websom.Services.Security.prototype.start = function () {var _c_this = this; var _c_root_method_arguments = arguments;
	if (arguments.length == 0) {
		_c_this.configPath = _c_this.server.config.root + "/security.json";
		if (_c_this.server.config.legacy) {
			_c_this.load();
			_c_this.server.injectExpression("Websom.Captcha = {publicKey: " + Websom.Json.encode(_c_this.publicKey) + "};");
			}
	}
else 	if (arguments.length == 0) {

	}
}

Websom.Services.Security.prototype.load = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		if (_c_this.loaded == false) {
			_c_this.loaded = true;
			if (Oxygen.FileSystem.exists(_c_this.configPath)) {
				var config = Websom.Json.parse(Oxygen.FileSystem.readSync(_c_this.configPath, "utf8"));
				_c_this.captchaService = config["captchaService"];
				_c_this.serviceKey = config["serviceKey"];
				_c_this.publicKey = config["publicKey"];
				_c_this.selectLimit = config["selectLimit"];
				_c_this.insertLimit = config["insertLimit"];
				_c_this.updateLimit = config["updateLimit"];
				_c_this.message = config["requestLimitMessage"];
				}else{
					Oxygen.FileSystem.writeSync(_c_this.configPath, "{\n	\"captchaService\": \"none\",\n	\"publicKey\": \"\",\n	\"serviceKey\": \"\",\n	\"updateLimit\": 6,\n	\"insertLimit\": 3,\n	\"selectLimit\": 60,\n	\"requestLimitMessage\": \"Too many requests.\"\n}");
				}
			}}

Websom.Services.Security.prototype.verify = function (callback) {var _c_this = this; var _c_root_method_arguments = arguments;
		_c_this.load();}

/*i async*/Websom.Services.Security.prototype.countRequest = async function (type, opts, input) {var _c_this = this; var _c_root_method_arguments = arguments;
/*async*/
		_c_this.load();
		var history = input.request.session.getLegacy("_w_history_" + type);
		if (history == null) {
/*async*/
			var nHistory = {};
			nHistory["a"] = 1;
			nHistory["t"] = Websom.Time.now();
			(await input.request.session.set/* async call */("_w_history_" + type, nHistory));
			}else{
/*async*/
				var amount = history["a"];
				history["a"] = amount + 1;
				(await input.request.session.set/* async call */("_w_history_" + type, history));
			}}

/*i async*/Websom.Services.Security.prototype.request = async function (type, opts, input, callback) {var _c_this = this; var _c_root_method_arguments = arguments;
/*async*/
		_c_this.load();
		var history = input.request.session.getLegacy("_w_history_" + type);
		if (history == null) {
			callback();
			}else{
/*async*/
				var limit = _c_this.selectLimit;
				if (type == "update") {
					limit = _c_this.updateLimit;
					}else if (type == "insert") {
					limit = _c_this.insertLimit;
					}
				var amount = history["a"];
				var timestamp = history["t"];
				var now = Websom.Time.now();
				var diff = now - timestamp;
				if (amount > limit) {
/*async*/
					if (diff >= _c_this.interval) {
/*async*/
						var updated = {};
						updated["a"] = 0;
						updated["t"] = now;
						(await input.request.session.set/* async call */("_w_history_" + type, updated));
						callback();
						}else{
							input.sendError(_c_this.message);
						}
					}else{
						callback();
					}
			}}

/*i async*/Websom.Services.Security.prototype.authenticateRequest = async function (req, permission) {var _c_this = this; var _c_root_method_arguments = arguments;
/*async*/
		if (permission.public) {
			return true;
			}
		if (_c_this.server.userSystem != null) {
/*async*/
			var user = (await _c_this.server.userSystem.getUserFromRequest/* async call */(req));
			var permRoute = permission.name.split(".");
			if (user != null) {
/*async*/
				if (permission.user) {
					return true;
					}
				if (user.role == "admin") {
					return true;
					}
				if (permission.author && user.role == "author") {
					return true;
					}
				if (permission.moderator && user.role == "moderator") {
					return true;
					}
				(await user.loadEntityArray/* async call */(user.groups));
				for (var i = 0; i < user.groups.length; i++) {
					var group = user.groups[i];
					for (var p = 0; p < group.permissions.length; p++) {
						var splits = group.permissions[p].split(".");
						for (var s = 0; s < permRoute.length; s++) {
							var split = permRoute[s];
							if (splits[s] == "*" || ((s == permRoute.length - 1) && (s == splits.length - 1))) {
								return true;
								}else if (s >= splits.length || splits[s] != split) {
								s = permRoute.length;
								continue;
								}
							}
						}
					}
				}
			}
		return false;}

Websom.Services.Security.prototype.typeCheck = function (value, type) {var _c_this = this; var _c_root_method_arguments = arguments;
		if (type == "integer") {
			if ((typeof value == 'object' ? (Array.isArray(value) ? 'array' : 'map') : (typeof value == 'number' ? 'float' : typeof value)) == "float") {
				var castToFloat = value;
				return castToFloat % 1 === 0;
				}
			}else if (type == "float") {
			return (typeof value == 'object' ? (Array.isArray(value) ? 'array' : 'map') : (typeof value == 'number' ? 'float' : typeof value)) == "float";
			}else if (type == "string") {
			return (typeof value == 'object' ? (Array.isArray(value) ? 'array' : 'map') : (typeof value == 'number' ? 'float' : typeof value)) == "string";
			}else if (type == "map") {
			return (typeof value == 'object' ? (Array.isArray(value) ? 'array' : 'map') : (typeof value == 'number' ? 'float' : typeof value)) == "map";
			}else if (type == "time") {
			return (typeof value == 'object' ? (Array.isArray(value) ? 'array' : 'map') : (typeof value == 'number' ? 'float' : typeof value)) == "float";
			}else if (type == "boolean") {
			return (typeof value == 'object' ? (Array.isArray(value) ? 'array' : 'map') : (typeof value == 'number' ? 'float' : typeof value)) == "boolean";
			}else if (type == "reference") {
			return (typeof value == 'object' ? (Array.isArray(value) ? 'array' : 'map') : (typeof value == 'number' ? 'float' : typeof value)) == "string";
			}else if (type == "geopoint") {
			return (typeof value == 'object' ? (Array.isArray(value) ? 'array' : 'map') : (typeof value == 'number' ? 'float' : typeof value)) == "string";
			}else if (type == "array") {
			if ((typeof value == 'object' ? (Array.isArray(value) ? 'array' : 'map') : (typeof value == 'number' ? 'float' : typeof value)) == "array") {
				var castToArray = value;
				for (var i = 0; i < castToArray.length; i++) {
					var v = castToArray[i];
					var typeAsString = (typeof v == 'object' ? (Array.isArray(v) ? 'array' : 'map') : (typeof v == 'number' ? 'float' : typeof v));
					if (typeAsString == "map" || typeAsString == "array") {
						return false;
						}
					}
				return true;
				}
			}
		return false;}

Websom.Services.Security.prototype.stop = function () {var _c_this = this; var _c_root_method_arguments = arguments;
}

Websom.Services.Security.prototype.end = function () {var _c_this = this; var _c_root_method_arguments = arguments;
}

Websom.Services.Session = function (server) {var _c_this = this;
	this.sessions = null;

	this.server = null;

		_c_this.server = server;
		_c_this.preStart();
}

Websom.Services.Session.prototype.start = function () {var _c_this = this; var _c_root_method_arguments = arguments;
}

/*i async*/Websom.Services.Session.prototype.beforeSend = async function (req) {var _c_this = this; var _c_root_method_arguments = arguments;
/*async*/
		if (req.session.changed) {
/*async*/
			if (req.session.id.length == 0) {
/*async*/
				req.session.id = (await _c_this.generateSessionKey/* async call */());
				(await _c_this.sessions.insert().set("key", req.session.id).set("created", Websom.Time.now()).set("ip", req.client.address).set("data", Websom.Json.encode(req.session.data)).run/* async call */());
				var c = req.cookie("wbsm_session", req.session.id);
				c.domain = _c_this.server.clientDomain;
				c.path = "/";
				req.header("X-Set-Session", req.session.id);
				}else{
/*async*/
					(await _c_this.sessions.update().where("key", "==", req.session.id).set("data", Websom.Json.encode(req.session.data)).run/* async call */());
				}
			}}

/*i async*/Websom.Services.Session.prototype.generateSessionKey = async function () {var _c_this = this; var _c_root_method_arguments = arguments;
/*async*/
		return (await _c_this.server.crypto.getRandomHex/* async call */(128));}

/*i async*/Websom.Services.Session.prototype.loadRequest = async function (req) {var _c_this = this; var _c_root_method_arguments = arguments;
/*async*/
		if ("wbsm_session" in req.cookies || "x-session" in req.headers) {
/*async*/
			var session = req.cookies["wbsm_session"];
			if (session == null) {
				session = req.headers["x-session"];
				}
			var results = (await _c_this.sessions.where("key", "==", session).get/* async call */());
			if (results.documents.length > 0) {
				var doc = results.documents[0];
				req.session.data = Websom.Json.parse(doc.get("data"));
				req.session.id = doc.get("key");
				}
			}}

/*i async*/Websom.Services.Session.prototype.collection = async function () {var _c_this = this; var _c_root_method_arguments = arguments;
/*async*/
		var db = _c_this.server.database.central;
		_c_this.sessions = db.collection("websom_sessions");
		_c_this.sessions.schema().field("key", "string").field("created", "time").field("ip", "string").field("data", "string");
		(await _c_this.server.registerServiceCollection/* async call */(_c_this.sessions));}

Websom.Services.Session.prototype.preStart = function () {var _c_this = this; var _c_root_method_arguments = arguments;
}

Websom.Services.Session.prototype.stop = function () {var _c_this = this; var _c_root_method_arguments = arguments;
}

Websom.Services.Session.prototype.end = function () {var _c_this = this; var _c_root_method_arguments = arguments;
}

Websom.Services.Theme = function (server) {var _c_this = this;
	this.themes = [];

	this.server = null;

		_c_this.server = server;
		_c_this.preStart();
}

Websom.Services.Theme.prototype.load = function (themeDir, config) {var _c_this = this; var _c_root_method_arguments = arguments;
		var that = _c_this;
		if (("name" in config) == false) {
			return Websom.Status.singleError("Theme", "Must provide name in theme config " + themeDir);
			}
		var theme = new Websom.Theme(_c_this.server, config["name"], themeDir, config);
		if (_c_this.server.config.dev) {
			theme.buildAndSave(function (err) {
				if (err.length > 0) {
					that.server.status.inherit(Websom.Status.singleError("Theme." + theme.name, err));
					}
				});
			}
		_c_this.themes.push(theme);
		
			if (this.server.config.dev) {
				var fs = require("fs");
				if (!fs.existsSync(this.server.config.resources + "/" + theme.prefix())) {                                 
					if (this.server.config.legacy)
						theme.buildAndSave((err) => {
							if (err.length > 0) {
								console.log("Error while building theme " + theme.name + " : " + err);
							}else{
								console.log("New theme built " + theme.name);
							}
						});
				}
				
				if (this.server.config.verbose)
					console.log("Setup watch on theme " + config.name);
				
				fs.watch(themeDir, {recursive: true}, (type, file) => {
					if (this.server.config.verbose)
						console.log("Saw change on " + file + ". Rebuilding theme");

					var configFile = "";

					if (this.server.config.legacy) {
						configFile = themeDir + "/" + config.name + ".json";
					}else{
						configFile = themeDir + "/theme.json";
					}

					var newConfig = JSON.parse(fs.readFileSync(configFile, "utf8"))
					theme.config = newConfig;

					if (type == "rename")
						if (this.server.devBuildWatcher)
							this.server.devBuildWatcher(file);
					
					if (this.server.config.legacy)
						theme.buildAndSave((err) => {
							if (err.length > 0) {
								this.server.status.inherit(Websom.Status.singleError("Theme." + theme.name, err));
								console.log(err);
							}else
								console.log("No errors");
						});
				});
			}
		}

Websom.Services.Theme.prototype.reload = function (path) {var _c_this = this; var _c_root_method_arguments = arguments;
		var themes = Oxygen.FileSystem.readDirSync(path);
		for (var i = 0; i < themes.length; i++) {
			var themeDir = path + themes[i];
			if (Oxygen.FileSystem.isDir(themeDir)) {
				var name = Oxygen.FileSystem.basename(themeDir);
				if (name != "." && name != "..") {
					var configFile = "";
					if (_c_this.server.config.legacy) {
						configFile = themeDir + "/" + name + ".json";
						}else{
							configFile = themeDir + "/theme.json";
						}
					if (Oxygen.FileSystem.exists(configFile) == false) {
						return Websom.Status.singleError("Services.Theme", "Unable to find config for theme " + name);
						}
					var config = Websom.Json.parse(Oxygen.FileSystem.readSync(configFile, "utf8"));
					var status = _c_this.load(themeDir, config);
					if (status != null) {
						return status;
						}
					}
				}
			}
		for (var i = 0; i < _c_this.themes.length; i++) {
			var theme = _c_this.themes[i];
			var status = theme.start();
			if (status != null) {
				return status;
				}
			}}

Websom.Services.Theme.prototype.include = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		var inc = "";
		for (var i = 0; i < _c_this.themes.length; i++) {
			inc += _c_this.themes[i].include();
			}
		return inc;}

Websom.Services.Theme.prototype.start = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		var dir = _c_this.server.config.root + "/themes/";
		if (Oxygen.FileSystem.exists(dir) == false) {
			Oxygen.FileSystem.makeDir(dir);
			}
		var usedTheme = "theme";
		if (_c_this.server.config.legacy == false) {
			usedTheme = "base-theme";
			}
		var themeDir = Oxygen.FileSystem.resolve(Oxygen.FileSystem.dirName(_c_this.server.scriptPath) + "/../../" + usedTheme);
		var config = Websom.Json.parse(Oxygen.FileSystem.readSync(themeDir + "/theme.json", "utf8"));
		var status = _c_this.load(themeDir, config);
		if (status != null) {
			return status;
			}
		return _c_this.reload(dir);}

Websom.Services.Theme.prototype.preStart = function () {var _c_this = this; var _c_root_method_arguments = arguments;
}

Websom.Services.Theme.prototype.stop = function () {var _c_this = this; var _c_root_method_arguments = arguments;
}

Websom.Services.Theme.prototype.end = function () {var _c_this = this; var _c_root_method_arguments = arguments;
}

Websom.Services.View = function (server) {var _c_this = this;
	this.pages = [];

	this.views = [];

	this.moduleViews = null;

	this.server = null;

		_c_this.server = server;
		_c_this.preStart();
}

Websom.Services.View.prototype.start = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		var status = new Websom.Status();
		var refresh = false;
		if (_c_this.server.config.dev) {
			refresh = true;
			}
		
			refresh = true;                         
		
		if (_c_this.server.config.refreshViews) {
			refresh = true;
			}
		if (refresh == false) {
			if (Oxygen.FileSystem.exists(_c_this.server.config.root + "/viewCache.json") == false) {
				refresh = true;
				}
			}
		if (refresh) {
			if (Oxygen.FileSystem.exists(_c_this.server.config.root + "/pages")) {
				status.inherit(_c_this.loadPages(_c_this.server.config.root + "/pages/"));
				}
			if (Oxygen.FileSystem.exists(_c_this.server.config.root + "/views")) {
				status.inherit(_c_this.loadViews(_c_this.server.config.root + "/views/"));
				}
			_c_this.moduleViews = _c_this.getModuleViews();
			if (_c_this.server.config.legacy) {
				_c_this.buildCache();
				}
			}else{
				_c_this.loadCache();
			}
		return status;}

Websom.Services.View.prototype.serializeViews = function (views) {var _c_this = this; var _c_root_method_arguments = arguments;
		var vs = [];
		for (var i = 0; i < views.length; i++) {
			var view = views[i];
			vs.push(view.serialize());
			}
		return vs;}

Websom.Services.View.prototype.loadViewCache = function (data) {var _c_this = this; var _c_root_method_arguments = arguments;
		var views = [];
		for (var i = 0; i < data.length; i++) {
			var d = data[i];
			var v = new Websom.View(_c_this.server);
			v.deserialize(d);
			v.shallow = true;
			views.push(v);
			}
		return views;}

Websom.Services.View.prototype.loadCache = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		var data = Websom.Json.parse(Oxygen.FileSystem.readSync(_c_this.server.config.root + "/viewCache.json", "utf8"));
		_c_this.moduleViews = _c_this.loadViewCache(data["module"]);
		_c_this.pages = _c_this.loadViewCache(data["page"]);
		_c_this.views = _c_this.loadViewCache(data["view"]);}

Websom.Services.View.prototype.buildCache = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		var cache = {};
		cache["module"] = _c_this.serializeViews(_c_this.moduleViews);
		cache["page"] = _c_this.serializeViews(_c_this.pages);
		cache["view"] = _c_this.serializeViews(_c_this.views);
		Oxygen.FileSystem.writeSync(_c_this.server.config.root + "/viewCache.json", Websom.Json.encode(cache));}

Websom.Services.View.prototype.getView = function (name) {var _c_this = this; var _c_root_method_arguments = arguments;
		for (var i = 0; i < _c_this.views.length; i++) {
			if (_c_this.views[i].name == name) {
				return _c_this.views[i];
				}
			}
		for (var i = 0; i < _c_this.moduleViews.length; i++) {
			if (_c_this.moduleViews[i].name == name) {
				return _c_this.moduleViews[i];
				}
			}
		return null;}

Websom.Services.View.prototype.getModuleViews = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		var views = [];
		for (var i = 0; i < _c_this.server.module.modules.length; i++) {
			var module = _c_this.server.module.modules[i];
			if ("resources" in module.baseConfig) {
				var raw = module.baseConfig["resources"];
				for (var r = 0; r < raw.length; r++) {
					var res = raw[r];
					var type = "";
					var path = res["path"];
					if (("type" in res) == false) {
						var realPath = Oxygen.FileSystem.resolve(module.root + "/" + path);
						if (Oxygen.FileSystem.isDir(realPath)) {
							var files = Oxygen.FileSystem.readDirSync(realPath);
							for (var f = 0; f < files.length; f++) {
								var file = files[f];
								var splits = file.split(".");
								if (splits.length > 1) {
									if (splits[splits.length - 1] == "view") {
										var view = new Websom.View(_c_this.server);
										view.owner = module;
										var viewErr = view.loadFromFile(realPath + "/" + file);
										view.hasLocalExport = true;
										views.push(view);
										}
									}
								}
							}
						}else{
							type = res["type"];
							if (type == "view") {
								var view = new Websom.View(_c_this.server);
								view.owner = module;
								var viewErr = view.loadFromFile(Oxygen.FileSystem.resolve(module.root + "/" + path));
								view.hasLocalExport = true;
								views.push(view);
								}
						}
					}
				}
			}
		return views;}

Websom.Services.View.prototype.buildDev = function (to) {var _c_this = this; var _c_root_method_arguments = arguments;
		var output = "";
		for (var i = 0; i < _c_this.views.length; i++) {
			var view = _c_this.views[i];
			output += view.buildDev();
			}
		Oxygen.FileSystem.writeSync(to, output);}

Websom.Services.View.prototype.include = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		var file = _c_this.server.config.resources + "/view.js";
		if (_c_this.server.config.dev) {
			_c_this.buildDev(file);
			}else{

			}
		return "<script src=\"" + _c_this.server.config.clientResources + "/view.js\"></script>";}

Websom.Services.View.prototype.loadPage = function (path) {var _c_this = this; var _c_root_method_arguments = arguments;
		var page = new Websom.View(_c_this.server);
		var err = page.loadFromFile(path);
		page.websiteView = true;
		if (err != null) {
			return err;
			}
		page.isPage = true;
		_c_this.pages.push(page);
		_c_this.views.push(page);
		if (_c_this.server.config.dev) {
			
				var fs = require("fs");
				console.log("Setup watch on page view");
				
				fs.watch(path, (type, file) => {
					console.log("Rebuilding " + path);
					page.loadFromFile(path);
				});
			
			}}

Websom.Services.View.prototype.loadView = function (path) {var _c_this = this; var _c_root_method_arguments = arguments;
		var view = new Websom.View(_c_this.server);
		var err = view.loadFromFile(path);
		view.websiteView = true;
		if (err != null) {
			return err;
			}
		_c_this.views.push(view);
		if (_c_this.server.config.dev) {
			
				var fs = require("fs");
				console.log("Setup watch on website view " + path);
				
				fs.watch(path, (type, file) => {
					console.log("Rebuilding " + path);
					view.loadFromFile(path);
				});
			
			}}

Websom.Services.View.prototype.loadPages = function (dir) {var _c_this = this; var _c_root_method_arguments = arguments;
		var files = Oxygen.FileSystem.readDirSync(dir);
		for (var i = 0; i < files.length; i++) {
			var file = files[i];
			if (Oxygen.FileSystem.isDir(dir + file)) {
				continue;
				}
			var splits = file.split(".");
			if (splits.length > 1) {
				if (splits[splits.length - 1] == "view") {
					var err = _c_this.loadPage(dir + file);
					if (err != null) {
						return err;
						}
					}
				}
			}}

Websom.Services.View.prototype.loadViews = function (dir) {var _c_this = this; var _c_root_method_arguments = arguments;
		var files = Oxygen.FileSystem.readDirSync(dir);
		for (var i = 0; i < files.length; i++) {
			var file = files[i];
			if (Oxygen.FileSystem.isDir(dir + file)) {
				continue;
				}
			var splits = file.split(".");
			if (splits.length > 1) {
				if (splits[splits.length - 1] == "view") {
					var err = _c_this.loadView(dir + file);
					if (err != null) {
						return err;
						}
					}
				}
			}}

Websom.Services.View.prototype.preStart = function () {var _c_this = this; var _c_root_method_arguments = arguments;
}

Websom.Services.View.prototype.stop = function () {var _c_this = this; var _c_root_method_arguments = arguments;
}

Websom.Services.View.prototype.end = function () {var _c_this = this; var _c_root_method_arguments = arguments;
}

Websom.Adapter = function (server) {var _c_this = this;
	this.server = null;

		_c_this.server = server;
}

/*i async*/Websom.Adapter.prototype.initialize = async function () {var _c_this = this; var _c_root_method_arguments = arguments;
}

/*i async*/Websom.Adapter.prototype.shutdown = async function () {var _c_this = this; var _c_root_method_arguments = arguments;
}

Websom.Bridge = function (server) {var _c_this = this;
	this.server = null;

		_c_this.server = server;
}

Websom.Bridge.prototype.getName = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		
		return this.name;}

Websom.Bridge.prototype.getServerMethods = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		
			return this.serverMethods();
		
		}

Websom.Bucket = function () {var _c_this = this;
	this.server = null;

	this.raw = null;

	this.name = "";

	this.owner = "";

	if (arguments.length == 3 && ((arguments[0] instanceof Websom.Server) || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'string' || typeof arguments[1] == 'undefined' || arguments[1] === null) && (typeof arguments[2] == 'object' || typeof arguments[2] == 'undefined' || arguments[2] === null)) {
		var server = arguments[0];
		var name = arguments[1];
		var raw = arguments[2];
		_c_this.server = server;
		_c_this.raw = raw;
		_c_this.name = name;
		_c_this.created();
	}
else 	if (arguments.length == 3 && ((arguments[0] instanceof Websom.Server) || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'string' || typeof arguments[1] == 'undefined' || arguments[1] === null) && (typeof arguments[2] == 'string' || typeof arguments[2] == 'undefined' || arguments[2] === null)) {
		var server = arguments[0];
		var name = arguments[1];
		var ownerModule = arguments[2];
		_c_this.server = server;
		_c_this.owner = ownerModule;
		_c_this.name = name;
		_c_this.created();
	}

}

Websom.Bucket.prototype.created = function () {var _c_this = this; var _c_root_method_arguments = arguments;
}

Websom.Bucket.make = function (server, name, type, raw) {var _c_this = this; var _c_root_method_arguments = arguments;
		if (type == "local") {
			return new Websom.Buckets.Local(server, name, raw);
			}}

Websom.Bucket.prototype.uploadObject = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		return new Websom.BucketUpload(_c_this);}

/*i async*/Websom.Bucket.prototype.deleteObject = async function (filename) {var _c_this = this; var _c_root_method_arguments = arguments;
/*async*/
		(await _c_this.server.bucket.deleteObject/* async call */(_c_this, filename));}

/*i async*/Websom.Bucket.prototype.createDirectory = async function (path) {var _c_this = this; var _c_root_method_arguments = arguments;
/*async*/
		(await _c_this.server.bucket.createDirectory/* async call */(_c_this, path));}

/*i async*/Websom.Bucket.prototype.setObjectACL = async function (filename, acl) {var _c_this = this; var _c_root_method_arguments = arguments;
/*async*/
		(await _c_this.server.bucket.setObjectACL/* async call */(_c_this, filename, acl));}

/*i async*/Websom.Bucket.prototype.serve = async function (filename) {var _c_this = this; var _c_root_method_arguments = arguments;
/*async*/
		return (await _c_this.server.bucket.serve/* async call */(_c_this, filename));}

Websom.Buckets = function () {var _c_this = this;


}

Websom.Buckets.Local = function () {var _c_this = this;
	this.realPath = "";

	this.server = null;

	this.raw = null;

	this.name = "";

	this.owner = "";

	if (arguments.length == 3 && ((arguments[0] instanceof Websom.Server) || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'string' || typeof arguments[1] == 'undefined' || arguments[1] === null) && (typeof arguments[2] == 'object' || typeof arguments[2] == 'undefined' || arguments[2] === null)) {
		var server = arguments[0];
		var name = arguments[1];
		var raw = arguments[2];
		_c_this.server = server;
		_c_this.raw = raw;
		_c_this.name = name;
		_c_this.created();
	}
else 	if (arguments.length == 3 && ((arguments[0] instanceof Websom.Server) || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'string' || typeof arguments[1] == 'undefined' || arguments[1] === null) && (typeof arguments[2] == 'string' || typeof arguments[2] == 'undefined' || arguments[2] === null)) {
		var server = arguments[0];
		var name = arguments[1];
		var ownerModule = arguments[2];
		_c_this.server = server;
		_c_this.owner = ownerModule;
		_c_this.name = name;
		_c_this.created();
	}

}

Websom.Buckets.Local.prototype.created = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		var path = _c_this.raw["path"];
		_c_this.realPath = Oxygen.FileSystem.resolve(_c_this.server.config.root + "/" + path) + "/";}

Websom.Buckets.Local.prototype.write = function (file, content, done) {var _c_this = this; var _c_root_method_arguments = arguments;
		Oxygen.FileSystem.writeSync(_c_this.realPath + file, content);
		done("");}

Websom.Buckets.Local.prototype.read = function (file, done) {var _c_this = this; var _c_root_method_arguments = arguments;
		done(true, Oxygen.FileSystem.readSync(_c_this.realPath + file, "utf8"));}

Websom.Buckets.Local.prototype.makeDir = function (dir, done) {var _c_this = this; var _c_root_method_arguments = arguments;
		if (Oxygen.FileSystem.exists(_c_this.realPath + dir) == false) {
			Oxygen.FileSystem.makeDir(_c_this.realPath + dir);
			}
		done(true);}

Websom.Buckets.Local.make = function (server, name, type, raw) {var _c_this = this; var _c_root_method_arguments = arguments;
		if (type == "local") {
			return new Websom.Buckets.Local(server, name, raw);
			}}

Websom.Buckets.Local.prototype.uploadObject = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		return new Websom.BucketUpload(_c_this);}

/*i async*/Websom.Buckets.Local.prototype.deleteObject = async function (filename) {var _c_this = this; var _c_root_method_arguments = arguments;
/*async*/
		(await _c_this.server.bucket.deleteObject/* async call */(_c_this, filename));}

/*i async*/Websom.Buckets.Local.prototype.createDirectory = async function (path) {var _c_this = this; var _c_root_method_arguments = arguments;
/*async*/
		(await _c_this.server.bucket.createDirectory/* async call */(_c_this, path));}

/*i async*/Websom.Buckets.Local.prototype.setObjectACL = async function (filename, acl) {var _c_this = this; var _c_root_method_arguments = arguments;
/*async*/
		(await _c_this.server.bucket.setObjectACL/* async call */(_c_this, filename, acl));}

/*i async*/Websom.Buckets.Local.prototype.serve = async function (filename) {var _c_this = this; var _c_root_method_arguments = arguments;
/*async*/
		return (await _c_this.server.bucket.serve/* async call */(_c_this, filename));}

Websom.BucketUpload = function (bucket) {var _c_this = this;
	this.bucket = null;

	this.acl = "";

	this.fileSizeLimit = 0;

	this.filename = "";

		_c_this.bucket = bucket;
}

Websom.BucketUpload.prototype.access = function (acl) {var _c_this = this; var _c_root_method_arguments = arguments;
		_c_this.acl = acl;
		return _c_this;}

Websom.BucketUpload.prototype.limit = function (fileSize) {var _c_this = this; var _c_root_method_arguments = arguments;
		_c_this.fileSizeLimit = fileSize;
		return _c_this;}

Websom.BucketUpload.prototype.name = function (filename) {var _c_this = this; var _c_root_method_arguments = arguments;
		_c_this.filename = filename;
		return _c_this;}

/*i async*/Websom.BucketUpload.prototype.generateUploadURL = async function () {var _c_this = this; var _c_root_method_arguments = arguments;
/*async*/
		return (await _c_this.bucket.server.bucket.generateUploadURL/* async call */(_c_this));}

Websom.Client = function (address, port) {var _c_this = this;
	this.address = "";

	this.port = "";

	this.family = "";

	this.localAddress = "";

	this.localPort = "";

		_c_this.address = address;
		_c_this.port = port;
}

Websom.CollectionInterface = function (collection, route) {var _c_this = this;
	this.routes = [];

	this.baseRoute = "";

	this.collection = null;

		_c_this.baseRoute = route;
		_c_this.collection = collection;
}

Websom.CollectionInterface.prototype.route = function (route) {var _c_this = this; var _c_root_method_arguments = arguments;
		_c_this.routes.push(new Websom.CollectionInterfaceRoute(_c_this, route));
		return _c_this;}

Websom.CollectionInterface.prototype.auth = function () {var _c_this = this; var _c_root_method_arguments = arguments;
	if (arguments.length == 1 && ((arguments[0] instanceof Websom.Permission) || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var permission = arguments[0];
		var perm = new Websom.PermissionAuthenticator(permission);
		perm.server = _c_this.collection.database.server;
		_c_this.routes[_c_this.routes.length - 1].authenticators.push(perm);
		return _c_this;
	}
else 	if (arguments.length == 1 && (typeof arguments[0] == 'function' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var func = arguments[0];
		var auth = new Websom.FunctionAuthenticator(func);
		auth.server = _c_this.collection.database.server;
		_c_this.routes[_c_this.routes.length - 1].authenticators.push(auth);
		return _c_this;
	}
}

Websom.CollectionInterface.prototype.executes = function (executes) {var _c_this = this; var _c_root_method_arguments = arguments;
		_c_this.routes[_c_this.routes.length - 1].executes = executes;
		return _c_this;}

Websom.CollectionInterface.prototype.write = function () {var _c_this = this; var _c_root_method_arguments = arguments;
	if (arguments.length == 1 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var field = arguments[0];
		_c_this.routes[_c_this.routes.length - 1].writes.push(new Websom.CollectionInterfaceWrite(field, null));
		return _c_this;
	}
else 	if (arguments.length == 2 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null) && ((arguments[1] instanceof Array || typeof arguments[1] == 'boolean' || typeof arguments[1] == 'string' || typeof arguments[1] == 'number' || typeof arguments[1] == 'number' || typeof arguments[1] == 'object' || typeof arguments[1] == 'string') || typeof arguments[1] == 'undefined' || arguments[1] === null)) {
		var field = arguments[0];
		var defaultValue = arguments[1];
		_c_this.routes[_c_this.routes.length - 1].writes.push(new Websom.CollectionInterfaceWrite(field, defaultValue));
		return _c_this;
	}
}

Websom.CollectionInterface.prototype.limit = function (min, max) {var _c_this = this; var _c_root_method_arguments = arguments;
		return _c_this.restrict(new Websom.Restrictions.Limit(min, max));}

Websom.CollectionInterface.prototype.format = function (format) {var _c_this = this; var _c_root_method_arguments = arguments;
		return _c_this.restrict(new Websom.Restrictions.Format(format));}

Websom.CollectionInterface.prototype.regexTest = function (reg) {var _c_this = this; var _c_root_method_arguments = arguments;
		return _c_this.restrict(new Websom.Restrictions.Regex(reg));}

Websom.CollectionInterface.prototype.unique = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		return _c_this.restrict(new Websom.Restrictions.Unique());}

Websom.CollectionInterface.prototype.restrict = function () {var _c_this = this; var _c_root_method_arguments = arguments;
	if (arguments.length == 1 && ((arguments[0] instanceof Websom.Restriction || (arguments[0] instanceof Websom.Restrictions.Limit) || (arguments[0] instanceof Websom.Restrictions.Unique) || (arguments[0] instanceof Websom.Restrictions.Format) || (arguments[0] instanceof Websom.Restrictions.Regex) || (arguments[0] instanceof Websom.Restrictions.Function)) || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var restriction = arguments[0];
		var writes = _c_this.routes[_c_this.routes.length - 1].writes;
		writes[writes.length - 1].restrictions.push(restriction);
		return _c_this;
	}
else 	if (arguments.length == 1 && (typeof arguments[0] == 'function' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var func = arguments[0];
		return _c_this.restrict(new Websom.Restrictions.Function(func));
	}
}

Websom.CollectionInterface.prototype.set = function (field, defaultValue) {var _c_this = this; var _c_root_method_arguments = arguments;
		_c_this.routes[_c_this.routes.length - 1].sets.push(new Websom.CollectionInterfaceWriteSet(field, defaultValue));
		return _c_this;}

Websom.CollectionInterface.prototype.setComputed = function (field, func) {var _c_this = this; var _c_root_method_arguments = arguments;
		_c_this.routes[_c_this.routes.length - 1].computedSets.push(new Websom.CollectionInterfaceWriteSetComputed(field, func));
		return _c_this;}

Websom.CollectionInterface.prototype.read = function (field) {var _c_this = this; var _c_root_method_arguments = arguments;
		_c_this.routes[_c_this.routes.length - 1].reads.push(new Websom.CollectionInterfaceRead(field));
		return _c_this;}

Websom.CollectionInterface.prototype.transform = function (transformer) {var _c_this = this; var _c_root_method_arguments = arguments;
		var reads = _c_this.routes[_c_this.routes.length - 1].reads;
		reads[reads.length - 1].transformers.push(transformer);
		return _c_this;}

Websom.CollectionInterface.prototype.mutate = function (func) {var _c_this = this; var _c_root_method_arguments = arguments;
		var writes = _c_this.routes[_c_this.routes.length - 1].writes;
		writes[writes.length - 1].mutators.push(new Websom.Mutators.Function(func));
		return _c_this;}

Websom.CollectionInterface.prototype.filter = function () {var _c_this = this; var _c_root_method_arguments = arguments;
	if (arguments.length == 1 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var name = arguments[0];
		_c_this.routes[_c_this.routes.length - 1].filters.push(new Websom.CollectionInterfaceFilter(name));
		return _c_this;
	}
else 	if (arguments.length == 2 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'function' || typeof arguments[1] == 'undefined' || arguments[1] === null)) {
		var name = arguments[0];
		var handler = arguments[1];
		var filter = new Websom.CollectionInterfaceFilter(name);
		filter.handler = handler;
		_c_this.routes[_c_this.routes.length - 1].filters.push(filter);
		return _c_this;
	}
}

Websom.CollectionInterface.prototype.field = function () {var _c_this = this; var _c_root_method_arguments = arguments;
	if (arguments.length == 2 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'string' || typeof arguments[1] == 'undefined' || arguments[1] === null)) {
		var name = arguments[0];
		var operator = arguments[1];
		return _c_this.field(name, operator, null);
	}
else 	if (arguments.length == 3 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'string' || typeof arguments[1] == 'undefined' || arguments[1] === null) && ((arguments[2] instanceof Array || typeof arguments[2] == 'boolean' || typeof arguments[2] == 'string' || typeof arguments[2] == 'number' || typeof arguments[2] == 'number' || typeof arguments[2] == 'object' || typeof arguments[2] == 'string') || typeof arguments[2] == 'undefined' || arguments[2] === null)) {
		var name = arguments[0];
		var operator = arguments[1];
		var value = arguments[2];
		var filters = _c_this.routes[_c_this.routes.length - 1].filters;
		filters[filters.length - 1].fields.push(new Websom.CollectionInterfaceFieldSet(name, operator, value));
		return _c_this;
	}
}

Websom.CollectionInterface.prototype.fieldComputed = function (name, operator, func) {var _c_this = this; var _c_root_method_arguments = arguments;
		var filters = _c_this.routes[_c_this.routes.length - 1].filters;
		filters[filters.length - 1].computed.push(new Websom.CollectionInterfaceFieldSetComputed(name, operator, func));
		return _c_this;}

Websom.CollectionInterface.prototype.force = function (name, operator, value) {var _c_this = this; var _c_root_method_arguments = arguments;
		var filters = _c_this.routes[_c_this.routes.length - 1].filters;
		filters[filters.length - 1].forces.push(new Websom.CollectionInterfaceFieldSet(name, operator, value));
		return _c_this;}

Websom.CollectionInterface.prototype.order = function () {var _c_this = this; var _c_root_method_arguments = arguments;
	if (arguments.length == 2 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'string' || typeof arguments[1] == 'undefined' || arguments[1] === null)) {
		var name = arguments[0];
		var order = arguments[1];
		return _c_this.order(name, order, false);
	}
else 	if (arguments.length == 3 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'string' || typeof arguments[1] == 'undefined' || arguments[1] === null) && (typeof arguments[2] == 'boolean' || typeof arguments[2] == 'undefined' || arguments[2] === null)) {
		var name = arguments[0];
		var order = arguments[1];
		var clientControlled = arguments[2];
		var filters = _c_this.routes[_c_this.routes.length - 1].filters;
		filters[filters.length - 1].orders.push(new Websom.CollectionInterfaceFieldSet(name, order, clientControlled));
		return _c_this;
	}
}

Websom.CollectionInterface.prototype.on = function (hook, func) {var _c_this = this; var _c_root_method_arguments = arguments;
		_c_this.routes[_c_this.routes.length - 1].hooks[hook] = func;
		return _c_this;}

Websom.CollectionInterfaceRoute = function (collection, route) {var _c_this = this;
	this.collection = null;

	this.authenticators = [];

	this.reads = [];

	this.writes = [];

	this.sets = [];

	this.computedSets = [];

	this.filters = [];

	this.hooks = {};

	this.route = "";

	this.executes = "";

		_c_this.collection = collection;
		_c_this.route = route;
}

Websom.CollectionInterfaceRoute.prototype.findFilter = function (name) {var _c_this = this; var _c_root_method_arguments = arguments;
		return _c_this.filters.find(function (filter) {
			return filter.name == name;
			});}

Websom.CollectionInterfaceRoute.prototype.trigger = function (hook, req, docs) {var _c_this = this; var _c_root_method_arguments = arguments;
		if ((hook in _c_this.hooks)) {
			_c_this.hooks[hook](req, docs);
			}}

Websom.Restriction = function () {var _c_this = this;


}

/*i async*/Websom.Restriction.prototype.testServer = async function (collection, field, value) {var _c_this = this; var _c_root_method_arguments = arguments;
}

Websom.Restriction.prototype.testClient = function () {var _c_this = this; var _c_root_method_arguments = arguments;
}

Websom.Restriction.prototype.message = function (fieldName, value) {var _c_this = this; var _c_root_method_arguments = arguments;
		return _c_this.name() + " failed on field " + fieldName + ".";}

Websom.Restriction.prototype.name = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		return "Restriction";}

Websom.Restriction.prototype.exposeToClient = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		return {};}

Websom.Restrictions = function () {var _c_this = this;


}

Websom.Restrictions.Limit = function () {var _c_this = this;
	this.min = 0;

	this.max = 0;

	if (arguments.length == 2 && (typeof arguments[0] == 'number' || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'number' || typeof arguments[1] == 'undefined' || arguments[1] === null)) {
		var min = arguments[0];
		var max = arguments[1];
		_c_this.min = min;
		_c_this.max = max;
	}
else 	if (arguments.length == 0) {

	}

}

/*i async*/Websom.Restrictions.Limit.prototype.testServer = async function (collection, field, value) {var _c_this = this; var _c_root_method_arguments = arguments;
		if (field.type == "string") {
			var castToString = value;
			return castToString.length >= _c_this.min && castToString.length <= _c_this.max;
			}else if (field.type == "integer" || field.type == "float") {
			var castToFloat = value;
			return castToFloat >= _c_this.min && castToFloat <= _c_this.max;
			}else if (field.type == "array") {
			var castToArray = value;
			return castToArray.length >= _c_this.min && castToArray.length <= _c_this.max;
			}else{
				throw "Limit restriction only works on fields of type: string, integer, float, and array";
			}}

Websom.Restrictions.Limit.prototype.name = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		return "Limit";}

Websom.Restrictions.Limit.prototype.exposeToClient = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		var mp = {};
		mp["min"] = _c_this.min;
		mp["max"] = _c_this.max;
		mp["type"] = "limit";
		return mp;}

Websom.Restrictions.Limit.prototype.testClient = function () {var _c_this = this; var _c_root_method_arguments = arguments;
}

Websom.Restrictions.Limit.prototype.message = function (fieldName, value) {var _c_this = this; var _c_root_method_arguments = arguments;
		return _c_this.name() + " failed on field " + fieldName + ".";}

Websom.Restrictions.Unique = function () {var _c_this = this;
	this.uniqueRoute = "";


}

/*i async*/Websom.Restrictions.Unique.prototype.testServer = async function (collection, field, value) {var _c_this = this; var _c_root_method_arguments = arguments;
/*async*/
		return (await collection.where(field.name, "==", value).limit(1).get/* async call */()).documents.length == 0;}

Websom.Restrictions.Unique.prototype.name = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		return "Unique";}

Websom.Restrictions.Unique.prototype.exposeToClient = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		var mp = {};
		mp["route"] = _c_this.uniqueRoute;
		mp["type"] = "unique";
		return mp;}

Websom.Restrictions.Unique.prototype.testClient = function () {var _c_this = this; var _c_root_method_arguments = arguments;
}

Websom.Restrictions.Unique.prototype.message = function (fieldName, value) {var _c_this = this; var _c_root_method_arguments = arguments;
		return _c_this.name() + " failed on field " + fieldName + ".";}

Websom.Restrictions.Format = function () {var _c_this = this;
	this.format = "";

	if (arguments.length == 1 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var format = arguments[0];
		_c_this.format = format;
	}
else 	if (arguments.length == 0) {

	}

}

/*i async*/Websom.Restrictions.Format.prototype.testServer = async function (collection, field, value) {var _c_this = this; var _c_root_method_arguments = arguments;
		var valueAsString = value;
		if (_c_this.format == "email") {
			return (new RegExp("^(([^<>()\\[\\]\\.,;:\\s@\"]+(\\.[^<>()\\[\\]\\.,;:\\s@\"]+)*)|(\".+\"))@(([^<>()[\\]\\.,;:\\s@\"]+\\.)+[^<>()[\\]\\.,;:\\s@\"]{2,})")).test(valueAsString);
			}else if (_c_this.format == "single-line") {
			return (new RegExp("^([^\\n]*)$")).test(valueAsString);
			}else if (_c_this.format == "number") {
			return (new RegExp("^(-)?([undefined.,]*)$")).test(valueAsString);
			}}

Websom.Restrictions.Format.prototype.name = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		return "Format";}

Websom.Restrictions.Format.prototype.exposeToClient = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		var mp = {};
		mp["format"] = _c_this.format;
		mp["type"] = "format";
		return mp;}

Websom.Restrictions.Format.prototype.testClient = function () {var _c_this = this; var _c_root_method_arguments = arguments;
}

Websom.Restrictions.Format.prototype.message = function (fieldName, value) {var _c_this = this; var _c_root_method_arguments = arguments;
		return _c_this.name() + " failed on field " + fieldName + ".";}

Websom.Restrictions.Regex = function () {var _c_this = this;
	this.regex = "";

	if (arguments.length == 1 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var regex = arguments[0];
		_c_this.regex = regex;
	}
else 	if (arguments.length == 0) {

	}

}

/*i async*/Websom.Restrictions.Regex.prototype.testServer = async function (collection, field, value) {var _c_this = this; var _c_root_method_arguments = arguments;
		var valueAsString = value;
		return (new RegExp(_c_this.regex)).test(valueAsString);}

Websom.Restrictions.Regex.prototype.name = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		return "Regex";}

Websom.Restrictions.Regex.prototype.exposeToClient = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		var mp = {};
		mp["regex"] = _c_this.regex;
		mp["type"] = "regex";
		return mp;}

Websom.Restrictions.Regex.prototype.testClient = function () {var _c_this = this; var _c_root_method_arguments = arguments;
}

Websom.Restrictions.Regex.prototype.message = function (fieldName, value) {var _c_this = this; var _c_root_method_arguments = arguments;
		return _c_this.name() + " failed on field " + fieldName + ".";}

Websom.Restrictions.Function = function () {var _c_this = this;
	this.tester = null;

	if (arguments.length == 1 && (typeof arguments[0] == 'function' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var func = arguments[0];
		_c_this.tester = func;
	}
else 	if (arguments.length == 0) {

	}

}

/*i async*/Websom.Restrictions.Function.prototype.testServer = async function (collection, field, value) {var _c_this = this; var _c_root_method_arguments = arguments;
		
			return await this.tester(collection, field, value);
		
		}

Websom.Restrictions.Function.prototype.name = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		return "Function";}

Websom.Restrictions.Function.prototype.testClient = function () {var _c_this = this; var _c_root_method_arguments = arguments;
}

Websom.Restrictions.Function.prototype.message = function (fieldName, value) {var _c_this = this; var _c_root_method_arguments = arguments;
		return _c_this.name() + " failed on field " + fieldName + ".";}

Websom.Restrictions.Function.prototype.exposeToClient = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		return {};}

Websom.Transformer = function () {var _c_this = this;


}

/*i async*/Websom.Transformer.prototype.transform = async function (req, doc, field, value) {var _c_this = this; var _c_root_method_arguments = arguments;
}

Websom.Mutators = function () {var _c_this = this;


}

Websom.Mutator = function () {var _c_this = this;


}

/*i async*/Websom.Mutator.prototype.mutate = async function (collection, req, value) {var _c_this = this; var _c_root_method_arguments = arguments;
}

Websom.Mutators.Function = function () {var _c_this = this;
	this.mutator = null;

	if (arguments.length == 1 && (typeof arguments[0] == 'function' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var func = arguments[0];
		_c_this.mutator = func;
	}
else 	if (arguments.length == 0) {

	}

}

/*i async*/Websom.Mutators.Function.prototype.mutate = async function (collection, req, value) {var _c_this = this; var _c_root_method_arguments = arguments;
		
			return await this.mutator(collection, req, value);
		
		}

Websom.Authenticator = function () {var _c_this = this;
	this.server = null;


}

/*i async*/Websom.Authenticator.prototype.authenticate = async function (req) {var _c_this = this; var _c_root_method_arguments = arguments;
}

Websom.Authenticator.prototype.errorMessage = function (req) {var _c_this = this; var _c_root_method_arguments = arguments;
		return "Authentication failed";}

Websom.PermissionAuthenticator = function () {var _c_this = this;
	this.permission = null;

	this.server = null;

	if (arguments.length == 1 && ((arguments[0] instanceof Websom.Permission) || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var permission = arguments[0];
		_c_this.permission = permission;
	}
else 	if (arguments.length == 0) {

	}

}

/*i async*/Websom.PermissionAuthenticator.prototype.authenticate = async function () {var _c_this = this; var _c_root_method_arguments = arguments;
	if (arguments.length == 1 && ((arguments[0] instanceof Websom.Request || (arguments[0] instanceof Websom.SinkRequest)) || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var req = arguments[0];
/*async*/
		return (await _c_this.server.security.authenticateRequest/* async call */(req, _c_this.permission));
	}
else 	if (arguments.length == 1 && ((arguments[0] instanceof Websom.Request || (arguments[0] instanceof Websom.SinkRequest)) || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var req = arguments[0];

	}
}

Websom.PermissionAuthenticator.prototype.errorMessage = function (req) {var _c_this = this; var _c_root_method_arguments = arguments;
		return "Authentication failed";}

Websom.FunctionAuthenticator = function () {var _c_this = this;
	this.func = null;

	this.server = null;

	if (arguments.length == 1 && (typeof arguments[0] == 'function' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var func = arguments[0];
		_c_this.func = func;
	}
else 	if (arguments.length == 0) {

	}

}

/*i async*/Websom.FunctionAuthenticator.prototype.authenticate = async function () {var _c_this = this; var _c_root_method_arguments = arguments;
	if (arguments.length == 1 && ((arguments[0] instanceof Websom.Request || (arguments[0] instanceof Websom.SinkRequest)) || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var req = arguments[0];
		return _c_this.func(req);
	}
else 	if (arguments.length == 1 && ((arguments[0] instanceof Websom.Request || (arguments[0] instanceof Websom.SinkRequest)) || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var req = arguments[0];

	}
}

Websom.FunctionAuthenticator.prototype.errorMessage = function (req) {var _c_this = this; var _c_root_method_arguments = arguments;
		return "Authentication failed";}

Websom.CollectionInterfaceRead = function (field) {var _c_this = this;
	this.transformers = [];

	this.field = "";

		_c_this.field = field;
}

Websom.CollectionInterfaceWrite = function (field, defaultValue) {var _c_this = this;
	this.restrictions = [];

	this.mutators = [];

	this.field = "";

	this.defaultValue = null;

	this.type = "";

		_c_this.field = field;
		_c_this.defaultValue = defaultValue;
}

Websom.CollectionInterfaceWrite.prototype.exposeToClient = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		var mp = {};
		mp["type"] = _c_this.type;
		mp["field"] = _c_this.field;
		mp["default"] = _c_this.defaultValue;
		var restrictions = [];
		for (var i = 0; i < _c_this.restrictions.length; i++) {
			var restriction = _c_this.restrictions[i];
			restrictions.push(restriction.exposeToClient());
			}
		mp["restrictions"] = restrictions;
		return mp;}

Websom.CollectionInterfaceWriteSet = function (field, value) {var _c_this = this;
	this.field = "";

	this.value = null;

		_c_this.field = field;
		_c_this.value = value;
}

Websom.CollectionInterfaceWriteSetComputed = function (field, func) {var _c_this = this;
	this.field = "";

	this.computer = null;

		_c_this.field = field;
		_c_this.computer = func;
}

/*i async*/Websom.CollectionInterfaceWriteSetComputed.prototype.compute = async function (req) {var _c_this = this; var _c_root_method_arguments = arguments;
		
			return await this.computer(req);
		
		}

Websom.CollectionInterfaceFieldSet = function (name, operator, value) {var _c_this = this;
	this.name = "";

	this.operator = "";

	this.value = null;

		_c_this.name = name;
		_c_this.operator = operator;
		_c_this.value = value;
}

Websom.CollectionInterfaceFieldSetComputed = function (name, operator, func) {var _c_this = this;
	this.name = "";

	this.operator = "";

	this.handler = null;

		_c_this.name = name;
		_c_this.operator = operator;
		_c_this.handler = func;
}

Websom.CollectionInterfaceFilter = function (name) {var _c_this = this;
	this.fields = [];

	this.computed = [];

	this.forces = [];

	this.orders = [];

	this.name = "";

	this.limits = [];

	this.paginate = true;

	this.handler = null;

		_c_this.limits.push(25);
		_c_this.name = name;
}

Websom.Config = function () {var _c_this = this;
	this.data = null;

	this.https = false;

	this.name = "";

	this.brandColor = "white";

	this.url = "localhost";

	this.openInBrowser = true;

	this.hasManifest = true;

	this.manifestPath = "/resources/manifest.json";

	this.root = "";

	this.sslVerifyPeer = true;

	this.bucket = null;

	this.bucketFile = "";

	this.javascriptOutput = "";

	this.cssOutput = "";

	this.resources = "";

	this.restrictedResources = "";

	this.absolute = "";

	this.defaultTheme = "";

	this.cache = "";

	this.dev = false;

	this.verbose = false;

	this.headless = false;

	this.devSendMail = false;

	this.forceSsr = false;

	this.clientResources = "";

	this.databaseFile = "";

	this.devBuckets = "";

	this.configOverrides = "";

	this.jsBundle = "websom-bundle.js";

	this.gzip = false;

	this.refreshViews = false;

	this.deploys = null;

	this.legacy = false;


}

Websom.Config.load = function (path) {var _c_this = this; var _c_root_method_arguments = arguments;
		var out = require('./ini.js').parse(Oxygen.FileSystem.readSync(path, 'utf8'));
		var config = new Websom.Config();
		config.name = out["name"];
		config.absolute = Oxygen.FileSystem.dirName(path) + "/";
		config.root = Oxygen.FileSystem.resolve(config.absolute + out["website"]);
		config.javascriptOutput = out["javascript"];
		config.cssOutput = out["css"];
		if ("https" in out) {
			if (out["https"] === "1") {
				config.https = true;
				}
			}
		if ("theme" in out) {
			config.defaultTheme = out["theme"];
			}
		if ("brandColor" in out) {
			config.brandColor = out["brandColor"];
			}
		if ("manifest" in out) {
			if (out["manifest"] !== "1") {
				config.hasManifest = false;
				}
			}
		if ("forceSsr" in out) {
			if (out["forceSsr"] === "1") {
				config.forceSsr = true;
				}
			}
		if ("sslVerifyPeer" in out) {
			if (out["sslVerifyPeer"] !== "1") {
				config.sslVerifyPeer = false;
				}
			}
		if ("gzip" in out) {
			if (out["gzip"] === "1") {
				config.gzip = true;
				}
			}
		if ("refreshViews" in out) {
			if (out["refreshViews"] === "1") {
				config.refreshViews = true;
				}
			}
		if ("manifestPath" in out) {
			config.manifestPath = out["manifestPath"];
			}
		if ("bucket" in out) {
			var file = out["bucket"];
			config.bucketFile = Oxygen.FileSystem.resolve(Oxygen.FileSystem.dirName(path) + "/" + file);
			config.bucket = Websom.Json.parse(Oxygen.FileSystem.readSync(config.bucketFile, "utf8"));
			}
		if ("resources" in out) {
			config.resources = out["resources"];
			if (Oxygen.FileSystem.exists(config.resources) == false) {
				config.resources = Oxygen.FileSystem.resolve(config.absolute + out["resources"]);
				}
			}else{
				config.resources = Oxygen.FileSystem.resolve(config.absolute + "./resources");
			}
		if ("restrictedResources" in out) {
			config.restrictedResources = out["restrictedResources"];
			if (Oxygen.FileSystem.exists(config.restrictedResources) == false) {
				config.restrictedResources = Oxygen.FileSystem.resolve(config.absolute + out["restrictedResources"]);
				}
			}else{
				config.restrictedResources = Oxygen.FileSystem.resolve(config.absolute + "./private");
			}
		if ("clientResources" in out) {
			config.clientResources = out["clientResources"];
			}
		if ("database" in out) {
			var file = out["database"];
			config.databaseFile = Oxygen.FileSystem.resolve(Oxygen.FileSystem.dirName(path) + "/" + file);
			}
		if ("dev" in out) {
			if (out["dev"] === "1") {
				config.dev = true;
				}
			}
		if ("url" in out) {
			config.url = out["url"];
			}
		if ("devSendMail" in out) {
			if (out["devSendMail"] === "1") {
				config.devSendMail = true;
				}
			}
		config.cache = config.root + "/tmp/cache/";
		return config;}

Websom.Containers = function () {var _c_this = this;


}

Websom.Container = function () {var _c_this = this;
	this.server = null;

	this.name = "";

	this.dataInfo = null;

	this.parentContainer = null;

	this.interfaces = [];


}

Websom.Container.prototype.checkRestrictions = function (opts, inp, mode, field, callback) {var _c_this = this; var _c_root_method_arguments = arguments;
		for (var i = 0; i < opts.restricts.length; i++) {
			var r = opts.restricts[i];
			if (r.field == field.realName && ((r.mode == "global") || (r.mode == mode))) {
				if (r.simple) {
					var ct = _c_this.server.input.restrictHandlers;
					if (r.key in ct) {
						var handler = _c_this.server.input.restrictHandlers[r.key];
						handler(r.value, inp.request, function (passed) {
callback(passed);
});
						return null;
						}else{
							throw new Error("Custom restriction " + r.key + " not found in request to container " + _c_this.name);
						}
					}else{
						if (r.callback != null) {
							r.callback(function (passed) {
callback(passed);
});
							}else{
								throw new Error("Restrict callback on field " + field.realName + " in container interface " + _c_this.name + " is null. Did you forget interface.to(void () => {})?");
							}
						return null;
					}
				}
			}
		callback(true);}

/*i async*/Websom.Container.prototype.interfaceInsert = async function (opts, input) {var _c_this = this; var _c_root_method_arguments = arguments;
/*async*/
		var that = _c_this;
		if (opts.canInsert) {
/*async*/
			if (opts.overrideInsert != null) {
				opts.overrideInsert(input);
				}else{
/*async*/
					if (opts.mustLogin || opts.mustOwnInsert) {

						}
					(await _c_this.server.security.request/* async call */("insert", opts, input, function () {
						var v = new Websom.DataValidator(that.dataInfo);
						v.validate(input, async function (msg) {
/*async*/
							if (msg.hadError) {
								input.sendError(msg.stringify());
								}else{
/*async*/
									var dones = 0;
									var values = input.raw;
									var clientMessage = new Websom.ClientMessage();
									clientMessage.message = opts.baseSuccess;
									dones+=opts.controls.length + opts.insertControls.length;
									var checkDone = function () {
										if (dones == 0) {
											if (clientMessage.hadError) {
												input.send(clientMessage.stringify());
												}else{
													that.insertFromInterface(opts, input, values, clientMessage, null, null, new Websom.CallContext());
												}
											}
										};
									var runControl = function (control) {
										control.validate(input, function (cMsg) {
											dones--;
											if (cMsg != null && cMsg.hadError) {
												clientMessage.add(cMsg);
												checkDone();
												}else{
													control.fill(input, values, function () {
														checkDone();
														});
												}
											});
										};
									for (var i = 0; i < opts.controls.length; i++) {
										var control = opts.controls[i];
										runControl(control);
										}
									for (var i = 0; i < opts.insertControls.length; i++) {
										var control = opts.insertControls[i];
										runControl(control);
										}
									if (opts.controls.length + opts.insertControls.length == 0) {
/*async*/
										if (dones == 0) {
/*async*/
											(await that.server.security.countRequest/* async call */("insert", opts, input));
											that.insertFromInterface(opts, input, values, clientMessage, null, null, new Websom.CallContext());
											}
										}
								}
							});
						}));
				}
			}else{
				if (_c_this.server.config.dev) {
					input.send("Invalid(Dev: This container has no insert interface)");
					}else{
						input.send("Invalid");
					}
			}}

Websom.Container.prototype.interfaceSelect = function (opts, input, ctx) {var _c_this = this; var _c_root_method_arguments = arguments;
}

Websom.Container.prototype.interfaceSend = function (opts, input) {var _c_this = this; var _c_root_method_arguments = arguments;
		var that = _c_this;
		if (opts.canInterface) {
			if (("publicId" in input.raw) && ("route" in input.raw) && ("data" in input.raw)) {
				var obj = that.dataInfo.spawn(that.server);
				obj.websomServer = _c_this.server;
				obj.loadFromPublicKey(that, input.raw["publicId"], function (err) {
					var talkingTo = obj;
					if ("sub" in input.raw) {
						
							if (typeof input.raw["sub"] == "string") {
								var splits = input.raw["sub"].split(".");
								for (var i = 0; i < splits.length; i++)
									if (talkingTo[splits[i]].getField) {
										talkingTo = talkingTo[splits[i]];
									}else{
										break;
									}
							}
						
						
						}
					talkingTo.onInputInterface(input, input.raw["route"], input.raw["data"], function (response) {
						input.send(Websom.Json.encode(response));
						});
					});
				}else{
					if (_c_this.server.config.dev) {
						input.send("Invalid(Dev: No 'publicId', 'route', or 'data' key found in query)");
						}else{
							input.send("Invalid");
						}
				}
			}}

/*i async*/Websom.Container.prototype.interfaceUpdate = async function (opts, input) {var _c_this = this; var _c_root_method_arguments = arguments;
/*async*/
		var that = _c_this;
		if (opts.canUpdate) {
/*async*/
			if (opts.overrideUpdate != null) {
				opts.overrideUpdate(input);
				}else{
/*async*/
					if (opts.mustLogin || opts.mustOwnUpdate) {

						}
					if (("publicId" in input.raw) == false || (typeof input.raw["publicId"] == 'object' ? (Array.isArray(input.raw["publicId"]) ? 'array' : 'map') : (typeof input.raw["publicId"] == 'number' ? 'float' : typeof input.raw["publicId"])) != "string") {
						var qMsg = Websom.ClientMessage.quickError("Invalid publicId");
						input.send(qMsg.stringify());
						return null;
						}
					var publicId = input.raw["publicId"];
					if (publicId.length < 10 || publicId.length > 256) {
						var qMsg = Websom.ClientMessage.quickError("Invalid publicId");
						input.send(qMsg.stringify());
						return null;
						}
					(await _c_this.server.security.request/* async call */("update", opts, input, function () {
						var v = new Websom.DataValidator(that.dataInfo);
						v.validate(input, function (msg) {
							if (msg.hadError) {
								input.sendError(msg.stringify());
								}else{
									var dones = 0;
									var values = input.raw;
									var clientMessage = new Websom.ClientMessage();
									clientMessage.message = opts.baseSuccess;
									dones+=opts.controls.length + opts.updateControls.length;
									var cast = that;
									var update = that.server.database.primary.from(cast.table).where("publicId").equals(publicId).update();
									var obj = that.dataInfo.spawn(that.server);
									var checkDone = function () {
										if (dones == 0) {
											if (clientMessage.hadError) {
												input.send(clientMessage.stringify());
												}else{
													that.updateFromInterface(opts, update, obj, input, values, clientMessage);
												}
											}
										};
									obj.loadFromPublicKey(that, publicId, function (err) {
										var shouldContinue = true;
										var doContinue = async function () {
/*async*/
											var runControl = function (control) {
												control.validate(input, function (cMsg) {
													dones--;
													if (cMsg != null && cMsg.hadError) {
														clientMessage.add(cMsg);
														checkDone();
														}else{
															control.fill(input, values, function () {
																checkDone();
																});
														}
													});
												};
											for (var i = 0; i < opts.controls.length; i++) {
												var control = opts.controls[i];
												runControl(control);
												}
											for (var i = 0; i < opts.updateControls.length; i++) {
												runControl(opts.updateControls[i]);
												}
											if (opts.controls.length + opts.updateControls.length == 0) {
/*async*/
												if (dones == 0) {
/*async*/
													(await that.server.security.countRequest/* async call */("update", opts, input));
													that.updateFromInterface(opts, update, obj, input, values, clientMessage);
													}
												}
											};
										if (opts.mustOwnUpdate) {

											}else{
												doContinue();
											}
										});
								}
							});
						}));
				}
			}else{
				if (_c_this.server.config.dev) {
					input.send("Invalid(Dev: This container has no update interface)");
					}else{
						input.send("Invalid");
					}
			}}

Websom.Container.prototype.interface = function () {var _c_this = this; var _c_root_method_arguments = arguments;
	if (arguments.length == 1 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var route = arguments[0];
		return new Websom.InterfaceChain(_c_this, route);
	}
else 	if (arguments.length == 1 && ((arguments[0] instanceof Websom.InterfaceOptions) || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var opts = arguments[0];
		_c_this.interfaces.push(opts);
	}
}

Websom.Container.prototype.getInterface = function (route) {var _c_this = this; var _c_root_method_arguments = arguments;
		for (var i = 0; i < _c_this.interfaces.length; i++) {
			if (_c_this.interfaces[i].route == route) {
				return _c_this.interfaces[i];
				}
			}
		return null;}

Websom.Container.prototype.getDataFromRoute = function (route) {var _c_this = this; var _c_root_method_arguments = arguments;
		
			var splits = route.split(".");
			var cur = global;
			for (var split of splits)
				cur = cur[split];

			return cur;
		
		}

Websom.Container.prototype.registerSubContainer = function (field, routeInfo) {var _c_this = this; var _c_root_method_arguments = arguments;
		var that = _c_this;
		var name = _c_this.name + "_" + field.fieldName;
		var subContainer = new Websom.Containers.Table(_c_this.server, name, routeInfo);
		subContainer.parentContainer = _c_this;
		for (var i = 0; i < _c_this.interfaces.length; i++) {
			var interface = _c_this.interfaces[i];
			if (interface.subs[field.fieldName] != null) {
				subContainer.interface(interface.subs[field.fieldName]);
				}
			}
		if (subContainer.interfaces.length > 0) {
			var handler = subContainer.register();
			handler.containerInterface = subContainer;
			return handler;
			}}

Websom.Container.prototype.register = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		var that = _c_this;
		for (var i = 0; i < _c_this.dataInfo.fields.length; i++) {
			var f = _c_this.dataInfo.fields[i];
			if (f.singleLink && f.isPrimitive == false) {
				var t = Websom.DataInfo.getDataInfoFromRoute(f.typeRoute);
				var fi = _c_this.getDataFromRoute(f.typeRoute);
				if ("Component" in t.attributes) {
					var name = _c_this.name + "_" + f.fieldName;
					var componentContainer = new Websom.Containers.Table(that.server, name, t);
					var close = function (fix, type, field) {
						var getContainer = function (fieldName) {
							var fieldInfo = null;
							for (var fii = 0; fii < type.fields.length; fii++) {
								if (type.fields[fii].realName == fieldName) {
									fieldInfo = type.fields[fii];
									}
								}
							var linked = fieldInfo.structure.getFlag("linked");
							var fieldType = Websom.DataInfo.getDataInfoFromRoute(linked.fieldType);
							var subContainer = new Websom.Containers.Table(that.server, name + "_" + fieldInfo.fieldName, fieldType);
							return subContainer;
							};
						
							fi.registerInterfaces(that, componentContainer, getContainer);
						
						
						};
					close(f, t, fi);
					}
				}else if (f.typeRoute == "array" && "NoLoad" in f.attributes) {
				var linked = f.structure.getFlag("linked");
				var t = Websom.DataInfo.getDataInfoFromRoute(linked.fieldType);
				_c_this.registerSubContainer(f, t);
				}
			}
		for (var i = 0; i < _c_this.interfaces.length; i++) {
			var opts = _c_this.interfaces[i];
			for (var c = 0; c < opts.controls.length; c++) {
				opts.controls[c].container = _c_this;
				}
			for (var c = 0; c < opts.selectControls.length; c++) {
				opts.selectControls[c].container = _c_this;
				}
			for (var c = 0; c < opts.updateControls.length; c++) {
				opts.updateControls[c].container = _c_this;
				}
			for (var c = 0; c < opts.insertControls.length; c++) {
				opts.insertControls[c].container = _c_this;
				}
			}
		var handler = _c_this.server.input.register(_c_this.name, function (input) {
			if (("_w_type" in input.raw) && ("_w_route" in input.raw)) {
				var type = input.raw["_w_type"];
				var route = input.raw["_w_route"];
				var opts = that.getInterface(route);
				if (opts != null) {
					that.checkAuth(opts, input, type, async function (success) {
/*async*/
						if (success) {
/*async*/
							if (type == "insert") {
/*async*/
								(await that.interfaceInsert/* async call */(opts, input));
								}else if (type == "update") {
/*async*/
								(await that.interfaceUpdate/* async call */(opts, input));
								}else if (type == "select") {
/*async*/
								(await that.server.security.request/* async call */("select", opts, input, function () {
									that.interfaceSelect(opts, input, new Websom.CallContext());
									}));
								}else if (type == "interface") {
								that.interfaceSend(opts, input);
								}else{
									input.request.code(400);
									if (that.server.config.dev) {
										input.send("Invalid(Dev: Interface of type '" + type + "' not found)");
										}else{
											input.send("Invalid");
										}
								}
							}else{
								input.request.code(403);
								input.send("Unauthorized");
							}
						});
					}else{
						input.request.code(400);
						if (that.server.config.dev) {
							input.send("Invalid(Dev: No interface found with the route '" + route + "')");
							}else{
								input.send("Invalid");
							}
					}
				}else{
					input.request.code(400);
					if (that.server.config.dev) {
						input.send("Invalid(Dev: No '_w_type' or '_w_route' found in query)");
						}else{
							input.send("Invalid");
						}
				}
			});
		handler.containerInterface = _c_this;
		return handler;}

Websom.Container.prototype.checkAuth = function (opts, input, type, callback) {var _c_this = this; var _c_root_method_arguments = arguments;
		if (opts.hasAuth) {
			var perms = "";
			if (type == "insert") {
				perms = opts.insertPermission;
				}else if (type == "update") {
				perms = opts.updatePermission;
				}else if (type == "select") {
				perms = opts.selectPermission;
				}
			if (perms.length > 0) {

				}else{
					callback(true);
				}
			}else{
				callback(true);
			}}

Websom.Container.prototype.loadFromSelect = function (select, callback) {var _c_this = this; var _c_root_method_arguments = arguments;
}

Websom.Container.prototype.expose = function (req, datas, callback) {var _c_this = this; var _c_root_method_arguments = arguments;
}

Websom.Container.prototype.loadFromId = function (id, callback) {var _c_this = this; var _c_root_method_arguments = arguments;
}

Websom.InterfaceOptions = function (route) {var _c_this = this;
	this.route = "";

	this.canInsert = false;

	this.restricts = [];

	this.subs = {};

	this.canInterface = true;

	this.canSelect = false;

	this.hasPublicIdSelect = true;

	this.canLoadMore = true;

	this.multipart = false;

	this.canUpdate = false;

	this.mustLogin = false;

	this.mustOwnUpdate = false;

	this.mustOwnSelect = false;

	this.mustOwnInsert = false;

	this.autoPublicId = false;

	this.autoTimestamp = false;

	this.autoOwn = false;

	this.hasAuth = false;

	this.captchaSelect = false;

	this.captchaInsert = false;

	this.captchaUpdate = false;

	this.countSelect = true;

	this.countInsert = true;

	this.countUpdate = true;

	this.permission = "";

	this.selectPermission = "";

	this.updatePermission = "";

	this.insertPermission = "";

	this.uniqueKeys = [];

	this.group = "";

	this.baseSuccess = "Success";

	this.baseError = "Error";

	this.maxSelect = 25;

	this.selectExpose = null;

	this.overrideInsert = null;

	this.overrideSelect = null;

	this.overrideUpdate = null;

	this.onInsert = null;

	this.successInsert = null;

	this.onSelect = null;

	this.onUpdate = null;

	this.successUpdate = null;

	this.onlyUpdateIfOwner = false;

	this.controls = [];

	this.insertControls = [];

	this.selectControls = [];

	this.updateControls = [];

		_c_this.route = route;
}

Websom.InterfaceOptions.prototype.expose = function (func) {var _c_this = this; var _c_root_method_arguments = arguments;
		_c_this.selectExpose = func;}

Websom.InterfaceOptions.prototype.spawnControl = function (cls, field) {var _c_this = this; var _c_root_method_arguments = arguments;
		
			var root = global;
			for (var split of cls.split("."))
				root = root[split];

			return new root(field.realName, field.fieldName, field);
		
		}

Websom.InterfaceOptions.prototype.authPermission = function (perm) {var _c_this = this; var _c_root_method_arguments = arguments;
		_c_this.hasAuth = true;
		_c_this.permission = perm;}

Websom.InterfaceOptions.prototype.autoControl = function (info) {var _c_this = this; var _c_root_method_arguments = arguments;
		for (var i = 0; i < info.fields.length; i++) {
			var field = info.fields[i];
			if (field.structure.hasFlag("edit")) {
				if (field.isPrimitive) {
					_c_this.controls.push(field.structure.type.autoControl(field));
					}else if (field.isComplex) {
					_c_this.controls.push(_c_this.spawnControl(field.controlClass, field));
					}
				}
			}}

Websom.InputRestriction = function (mode, field) {var _c_this = this;
	this.mode = "global";

	this.simple = false;

	this.field = "";

	this.key = "";

	this.value = "";

	this.callback = null;

		_c_this.mode = mode;
		_c_this.field = field;
}

Websom.Control = function () {var _c_this = this;
	this.server = null;

	this.container = null;


}

Websom.Control.prototype.insert = function (input, data, key) {var _c_this = this; var _c_root_method_arguments = arguments;
}

Websom.Control.prototype.update = function (input, data) {var _c_this = this; var _c_root_method_arguments = arguments;
}

Websom.Control.prototype.message = function (input, name, data, send) {var _c_this = this; var _c_root_method_arguments = arguments;
		send(null);}

Websom.Control.prototype.use = function (inputChain) {var _c_this = this; var _c_root_method_arguments = arguments;
}

Websom.MessageControl = function () {var _c_this = this;
	this.server = null;

	this.container = null;


}

Websom.MessageControl.prototype.validate = function (input, done) {var _c_this = this; var _c_root_method_arguments = arguments;
		done(null);}

Websom.MessageControl.prototype.fill = function (input, values, done) {var _c_this = this; var _c_root_method_arguments = arguments;
		done();}

Websom.MessageControl.prototype.filter = function (input, select, done) {var _c_this = this; var _c_root_method_arguments = arguments;
		done(null);}

Websom.MessageControl.prototype.insert = function (input, data, key) {var _c_this = this; var _c_root_method_arguments = arguments;
}

Websom.MessageControl.prototype.update = function (input, data) {var _c_this = this; var _c_root_method_arguments = arguments;
}

Websom.MessageControl.prototype.message = function (input, name, data, send) {var _c_this = this; var _c_root_method_arguments = arguments;
		send(null);}

Websom.MessageControl.prototype.use = function (inputChain) {var _c_this = this; var _c_root_method_arguments = arguments;
}

Websom.FieldControl = function () {var _c_this = this;
	this.required = false;

	this.name = "";

	this.field = "";

	this.logic = "or";

	this.fieldInfo = null;

	this.server = null;

	this.container = null;

	if (arguments.length == 1 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var field = arguments[0];
		_c_this.name = field;
		_c_this.field = field;
	}
else 	if (arguments.length == 2 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'string' || typeof arguments[1] == 'undefined' || arguments[1] === null)) {
		var field = arguments[0];
		var logic = arguments[1];
		_c_this.name = field;
		_c_this.field = field;
		_c_this.logic = logic;
	}
else 	if (arguments.length == 3 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'string' || typeof arguments[1] == 'undefined' || arguments[1] === null) && ((arguments[2] instanceof Websom.FieldInfo) || typeof arguments[2] == 'undefined' || arguments[2] === null)) {
		var name = arguments[0];
		var field = arguments[1];
		var fieldInfo = arguments[2];
		_c_this.name = name;
		_c_this.field = field;
		_c_this.fieldInfo = fieldInfo;
	}

}

Websom.FieldControl.prototype.validate = function (input, done) {var _c_this = this; var _c_root_method_arguments = arguments;
		if (_c_this.name in input.raw) {
			_c_this.validateField(input, input.raw[_c_this.name], done);
			}else if (_c_this.required) {
			done(new Websom.InputValidation(true, "Missing field " + _c_this.name));
			}else{
				done(new Websom.InputValidation(false, ""));
			}}

Websom.FieldControl.prototype.fill = function (input, values, done) {var _c_this = this; var _c_root_method_arguments = arguments;
		_c_this.fillField(input.raw[_c_this.name], values);
		done();}

Websom.FieldControl.prototype.filter = function (input, select, done) {var _c_this = this; var _c_root_method_arguments = arguments;
		if (_c_this.name in input.raw) {
			if (_c_this.logic == "and") {
				select.and();
				}else{
					select.or();
				}
			var val = _c_this.filterField(input.raw[_c_this.name], select, done);
			}else if (_c_this.required) {
			done(new Websom.InputValidation(true, "Missing field " + _c_this.name));
			}else{
				done(null);
			}}

Websom.FieldControl.prototype.validateField = function (input, value, done) {var _c_this = this; var _c_root_method_arguments = arguments;
		done(new Websom.InputValidation(false, ""));}

Websom.FieldControl.prototype.fillField = function (value, values) {var _c_this = this; var _c_root_method_arguments = arguments;
}

Websom.FieldControl.prototype.filterField = function (value, select, done) {var _c_this = this; var _c_root_method_arguments = arguments;
}

Websom.FieldControl.prototype.insert = function (input, data, key) {var _c_this = this; var _c_root_method_arguments = arguments;
}

Websom.FieldControl.prototype.update = function (input, data) {var _c_this = this; var _c_root_method_arguments = arguments;
}

Websom.FieldControl.prototype.message = function (input, name, data, send) {var _c_this = this; var _c_root_method_arguments = arguments;
		send(null);}

Websom.FieldControl.prototype.use = function (inputChain) {var _c_this = this; var _c_root_method_arguments = arguments;
}

Websom.Controls = function () {var _c_this = this;


}

Websom.Controls.Search = function () {var _c_this = this;
	this.required = false;

	this.name = "";

	this.field = "";

	this.logic = "or";

	this.fieldInfo = null;

	this.server = null;

	this.container = null;

	if (arguments.length == 1 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var field = arguments[0];
		_c_this.name = field;
		_c_this.field = field;
	}
else 	if (arguments.length == 2 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'string' || typeof arguments[1] == 'undefined' || arguments[1] === null)) {
		var field = arguments[0];
		var logic = arguments[1];
		_c_this.name = field;
		_c_this.field = field;
		_c_this.logic = logic;
	}
else 	if (arguments.length == 3 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'string' || typeof arguments[1] == 'undefined' || arguments[1] === null) && ((arguments[2] instanceof Websom.FieldInfo) || typeof arguments[2] == 'undefined' || arguments[2] === null)) {
		var name = arguments[0];
		var field = arguments[1];
		var fieldInfo = arguments[2];
		_c_this.name = name;
		_c_this.field = field;
		_c_this.fieldInfo = fieldInfo;
	}

}

Websom.Controls.Search.prototype.filterField = function (value, select, done) {var _c_this = this; var _c_root_method_arguments = arguments;
		select.where(_c_this.field).wildLike(value);
		done(null);}

Websom.Controls.Search.prototype.validate = function (input, done) {var _c_this = this; var _c_root_method_arguments = arguments;
		if (_c_this.name in input.raw) {
			_c_this.validateField(input, input.raw[_c_this.name], done);
			}else if (_c_this.required) {
			done(new Websom.InputValidation(true, "Missing field " + _c_this.name));
			}else{
				done(new Websom.InputValidation(false, ""));
			}}

Websom.Controls.Search.prototype.fill = function (input, values, done) {var _c_this = this; var _c_root_method_arguments = arguments;
		_c_this.fillField(input.raw[_c_this.name], values);
		done();}

Websom.Controls.Search.prototype.filter = function (input, select, done) {var _c_this = this; var _c_root_method_arguments = arguments;
		if (_c_this.name in input.raw) {
			if (_c_this.logic == "and") {
				select.and();
				}else{
					select.or();
				}
			var val = _c_this.filterField(input.raw[_c_this.name], select, done);
			}else if (_c_this.required) {
			done(new Websom.InputValidation(true, "Missing field " + _c_this.name));
			}else{
				done(null);
			}}

Websom.Controls.Search.prototype.validateField = function (input, value, done) {var _c_this = this; var _c_root_method_arguments = arguments;
		done(new Websom.InputValidation(false, ""));}

Websom.Controls.Search.prototype.fillField = function (value, values) {var _c_this = this; var _c_root_method_arguments = arguments;
}

Websom.Controls.Search.prototype.insert = function (input, data, key) {var _c_this = this; var _c_root_method_arguments = arguments;
}

Websom.Controls.Search.prototype.update = function (input, data) {var _c_this = this; var _c_root_method_arguments = arguments;
}

Websom.Controls.Search.prototype.message = function (input, name, data, send) {var _c_this = this; var _c_root_method_arguments = arguments;
		send(null);}

Websom.Controls.Search.prototype.use = function (inputChain) {var _c_this = this; var _c_root_method_arguments = arguments;
}

Websom.Controls.Component = function (parentContainer, componentContainer) {var _c_this = this;
	this.parentContainer = null;

	this.componentContainer = null;

	this.server = null;

	this.container = null;

		_c_this.parentContainer = parentContainer;
		_c_this.componentContainer = componentContainer;
}

Websom.Controls.Component.prototype.validate = function (input, done) {var _c_this = this; var _c_root_method_arguments = arguments;
		var that = _c_this;
		if (("parent" in input.raw) && ((typeof input.raw["parent"] == 'object' ? (Array.isArray(input.raw["parent"]) ? 'array' : 'map') : (typeof input.raw["parent"] == 'number' ? 'float' : typeof input.raw["parent"])) == "string")) {
			_c_this.parentContainer.from().where("publicId").equals(input.raw["parent"]).run(function (err, docs) {
				if (err != null) {
					done(new Websom.InputValidation(true, "Server error"));
					}else{
						if (docs.length > 0) {
							that.componentContainer.from().where("parentId").equals(docs[0]["id"]).run(function (err2, docs2) {
								if (err2 != null || docs2.length == 0) {
									done(new Websom.InputValidation(true, "Parent value not found"));
									}else{
										input.raw[that.parentContainer.table + "parentId"] = docs2[0]["id"];
										done(null);
									}
								});
							}else{
								done(new Websom.InputValidation(true, "Parent value not found"));
							}
					}
				});
			}else{
				done(new Websom.InputValidation(true, "Invalid parent value"));
			}}

Websom.Controls.Component.prototype.fill = function (input, values, done) {var _c_this = this; var _c_root_method_arguments = arguments;
		values["parentId"] = input.raw[_c_this.parentContainer.table + "parentId"];
		done();}

Websom.Controls.Component.prototype.filter = function (input, select, done) {var _c_this = this; var _c_root_method_arguments = arguments;
		var that = _c_this;
		if (("parent" in input.raw) && ((typeof input.raw["parent"] == 'object' ? (Array.isArray(input.raw["parent"]) ? 'array' : 'map') : (typeof input.raw["parent"] == 'number' ? 'float' : typeof input.raw["parent"])) == "string")) {
			_c_this.parentContainer.from().where("publicId").equals(input.raw["parent"]).run(function (err, docs) {
				if (err != null) {
					done(new Websom.InputValidation(true, "Server error"));
					}else{
						if (docs.length > 0) {
							that.componentContainer.from().where("parentId").equals(docs[0]["id"]).run(function (err2, docs2) {
								if (err2 != null || docs2.length == 0) {
									done(new Websom.InputValidation(true, "Parent value not found"));
									}else{
										select.where("parentId").equals(docs2[0]["id"]);
										done(null);
									}
								});
							}else{
								done(new Websom.InputValidation(true, "Parent value not found"));
							}
					}
				});
			}else{
				done(new Websom.InputValidation(true, "Invalid parent value"));
			}}

Websom.Controls.Component.prototype.insert = function (input, data, key) {var _c_this = this; var _c_root_method_arguments = arguments;
}

Websom.Controls.Component.prototype.update = function (input, data) {var _c_this = this; var _c_root_method_arguments = arguments;
}

Websom.Controls.Component.prototype.message = function (input, name, data, send) {var _c_this = this; var _c_root_method_arguments = arguments;
		send(null);}

Websom.Controls.Component.prototype.use = function (inputChain) {var _c_this = this; var _c_root_method_arguments = arguments;
}

Websom.CallContext = function () {var _c_this = this;
	this.subContainerCall = false;

	this.data = null;


}

Websom.Data = function (server) {var _c_this = this;
	this.websomServer = null;

	this.websomFieldInfo = null;

	this.websomParentData = null;

	this.websomContainer = null;

		_c_this.websomServer = server;
}

Websom.Data.prototype.read = function (value) {var _c_this = this; var _c_root_method_arguments = arguments;
}

Websom.Data.prototype.write = function () {var _c_this = this; var _c_root_method_arguments = arguments;
}

Websom.Data.prototype.setField = function (name, value) {var _c_this = this; var _c_root_method_arguments = arguments;
		
			this[name] = value;
		
		}

Websom.Data.prototype.getContainer = function (realFieldName) {var _c_this = this; var _c_root_method_arguments = arguments;
		var info = _c_this.fetchFieldInfo();
		for (var i = 0; i < info.fields.length; i++) {
			var field = info.fields[i];
			if (field.realName == realFieldName) {
				var thisTable = _c_this.websomContainer;
				if (field.structure.hasFlag("linked")) {
					var linked = field.structure.getFlag("linked");
					var typeInfo = Websom.DataInfo.getDataInfoFromRoute(linked.fieldType);
					return new Websom.Containers.Table(_c_this.websomServer, thisTable.table + "_" + field.fieldName, typeInfo);
					}
				}
			}
		return null;}

Websom.Data.prototype.onInputInterface = function (input, route, data, respond) {var _c_this = this; var _c_root_method_arguments = arguments;
		
			if (this.onInputInterfaceAuto)
				this.onInputInterfaceAuto(input, route, data, respond);
			else
				respond(null);
		
		}

Websom.Data.prototype.getField = function (name) {var _c_this = this; var _c_root_method_arguments = arguments;
		
			return this[name];
		
		}

Websom.Data.prototype.getPublicId = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		return _c_this.getField("publicId");}

Websom.Data.prototype.callLoadFromMap = function (raw, callback) {var _c_this = this; var _c_root_method_arguments = arguments;
		
			return this.loadFromMap(raw, callback);
		
		}

Websom.Data.getDataInfo = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		
			return this.getInfo();
		
		}

Websom.Data.prototype.fromPrimary = function (key, done) {var _c_this = this; var _c_root_method_arguments = arguments;
}

Websom.Data.prototype.loadFromPublicKey = function (parent, key, done) {var _c_this = this; var _c_root_method_arguments = arguments;
		var that = _c_this;
		that.websomContainer = parent;
		parent.server.database.primary.from(parent.table).where("publicId").equals(key).run(function (err, res) {
			if (res.length == 0) {
				done("No data found");
				}else{
					that.callLoadFromMap(res[0], done);
				}
			});}

Websom.Data.prototype.loadFromId = function (parent, id, done) {var _c_this = this; var _c_root_method_arguments = arguments;
		var that = _c_this;
		that.websomContainer = parent;
		parent.server.database.primary.from(parent.table).where("id").equals(id).run(function (err, res) {
			if (res.length == 0) {
				done("No data found");
				}else{
					that.callLoadFromMap(res[0], done);
				}
			});}

Websom.Data.registerInterfaces = function (parent, component, getFieldContainer) {var _c_this = this; var _c_root_method_arguments = arguments;
}

Websom.Data.spawnFromId = function (server, table, id, done) {var _c_this = this; var _c_root_method_arguments = arguments;
		var dataInfo = null;
		
			dataInfo = this.getInfo();
		
		
		var container = new Websom.Containers.Table(server, table, dataInfo);
		var data = dataInfo.spawn(server);
		data.websomContainer = container;
		data.loadFromId(container, id, function (err) {
			done(err, data);
			});}

Websom.Data.prototype.onSend = function (req, exposed, send) {var _c_this = this; var _c_root_method_arguments = arguments;
		_c_this.onComponentSend(req, exposed, send);}

Websom.Data.prototype.onComponentSend = function (req, data, send) {var _c_this = this; var _c_root_method_arguments = arguments;
		var info = _c_this.fetchFieldInfo();
		var componentFields = [];
		for (var i = 0; i < info.fields.length; i++) {
			var field = info.fields[i];
			if (field.singleLink) {
				var fieldType = Websom.DataInfo.getDataInfoFromRoute(field.typeRoute);
				if ("Component" in fieldType.attributes) {
					if (_c_this.getField(field.realName) != null) {
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
			var component = _c_this.getField(field.realName);
			component.onSend(req, data[field.realName], function (newData) {
				data[field.realName] = newData;
				checkSend();
				});
			}}

Websom.Data.structureTable = function () {var _c_this = this; var _c_root_method_arguments = arguments;
}

Websom.Data.prototype.getFieldContainer = function (fieldName) {var _c_this = this; var _c_root_method_arguments = arguments;
		var dataInfo = _c_this.fetchFieldInfo();
		var fieldInfo = dataInfo.getField(fieldName);
		var link = fieldInfo.structure.getFlag("linked");
		if (link == null) {
			return null;
			}
		var cast = _c_this.websomContainer;
		return new Websom.Containers.Table(_c_this.websomServer, cast.table + "_" + fieldName, Websom.DataInfo.getDataInfoFromRoute(link.fieldType));}

Websom.Data.prototype.nativeLoadFromMap = function (raw, done) {var _c_this = this; var _c_root_method_arguments = arguments;
		
			this.loadFromMap(raw, done);
		
		}

Websom.Data.prototype.exposeToClient = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		
			return this.exposeToClientBase();
		
		}

Websom.Data.prototype.linkedExpose = function () {var _c_this = this; var _c_root_method_arguments = arguments;
}

Websom.Data.prototype.fetchFieldInfo = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		var info = null;
		
			info = this.constructor.getInfo();
		
		
		return info;}

Websom.Data.prototype.getPrimary = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		var fi = _c_this.fetchFieldInfo();
		for (var i = 0; i < fi.fields.length; i++) {
			var field = fi.fields[i];
			for (var f = 0; f < field.structure.flags.length; f++) {
				if (field.structure.flags[f].type == "primary") {
					return field;
					}
				}
			}
		return null;}

Websom.Data.prototype.getFieldFromName = function (realName) {var _c_this = this; var _c_root_method_arguments = arguments;
		 return this[realName]; 
		}

Websom.Data.prototype.containerInsert = function (input, container, insert, data, done) {var _c_this = this; var _c_root_method_arguments = arguments;
		done();}

Websom.Data.prototype.containerUpdate = function (input, container, update, data, done) {var _c_this = this; var _c_root_method_arguments = arguments;
		done();}

Websom.Data.prototype.update = function (done) {var _c_this = this; var _c_root_method_arguments = arguments;
		if (_c_this.websomContainer) {
			var field = _c_this.getPrimary();
			var cast = _c_this.websomContainer;
			var table = "unkown";
			table = cast.table;
			if (field) {
				var update = _c_this.websomContainer.server.database.primary.from(table).where(field.fieldName).equals(_c_this.getFieldFromName(field.realName)).update();
				_c_this.buildUpdate(update);
				update.run(function (err, docs) {
					done(err);
					});
				}
			}}

Websom.Data.prototype.insert = function (done) {var _c_this = this; var _c_root_method_arguments = arguments;
		if (_c_this.websomContainer) {
			var cast = _c_this.websomContainer;
			var table = "unkown";
			table = cast.table;
			var insert = _c_this.websomContainer.server.database.primary.into(table);
			_c_this.buildInsert(insert);
			insert.run(function (err, key) {
				done(err, key);
				});
			}}

Websom.Data.prototype.buildInsert = function (insert) {var _c_this = this; var _c_root_method_arguments = arguments;
		var info = _c_this.fetchFieldInfo();
		
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
			}}

Websom.Data.prototype.buildUpdate = function (select) {var _c_this = this; var _c_root_method_arguments = arguments;
		var info = _c_this.fetchFieldInfo();
		
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
			}}

Websom.DataInfo = function (name) {var _c_this = this;
	this.info = null;

	this.name = "";

	this.linked = false;

	this.linkedTable = "";

	this.attributes = {};

	this.fields = [];

		_c_this.name = name;
}

Websom.DataInfo.prototype.loadFromMap = function (info) {var _c_this = this; var _c_root_method_arguments = arguments;
		_c_this.info = info;}

Websom.DataInfo.prototype.getField = function (name) {var _c_this = this; var _c_root_method_arguments = arguments;
		for (var i = 0; i < _c_this.fields.length; i++) {
			if (_c_this.fields[i].realName == name) {
				return _c_this.fields[i];
				}
			}
		return null;}

Websom.DataInfo.prototype.hasField = function (name) {var _c_this = this; var _c_root_method_arguments = arguments;
		for (var i = 0; i < _c_this.fields.length; i++) {
			if (_c_this.fields[i].realName == name) {
				return true;
				}
			}
		return false;}

Websom.DataInfo.prototype.buildStructure = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		var str = new Websom.DatabaseStructure(null, "");
		for (var i = 0; i < _c_this.fields.length; i++) {
			var hasField = true;
			if (_c_this.fields[i].singleLink) {
				var subInfo = Websom.DataInfo.getDataInfoFromRoute(_c_this.fields[i].typeRoute);
				if ("Component" in subInfo.attributes) {
					hasField = false;
					for (var j = 0; j < subInfo.fields.length; j++) {
						var sField = subInfo.fields[j];
						if ("Parent" in sField.attributes) {
							str.fields.push(sField.structure);
							}
						}
					}
				}
			if (("Parent" in _c_this.fields[i].attributes)) {
				hasField = false;
				}
			if (hasField) {
				str.fields.push(_c_this.fields[i].structure);
				}
			}
		return str;}

Websom.DataInfo.prototype.spawn = function (server) {var _c_this = this; var _c_root_method_arguments = arguments;
		
			var splits = this.name.split(".");
			var cur = global;
			for (var split of splits)
				cur = cur[split];

			return new cur(server);
		
		}

Websom.DataInfo.getDataInfoFromRoute = function (route) {var _c_this = this; var _c_root_method_arguments = arguments;
		
			var splits = route.split(".");
			var cur = global;
			for (var split of splits)
				cur = cur[split];

			return cur.getInfo();
		
		}

Websom.DataInfo.prototype.buildLinkedStructures = function (parentName) {var _c_this = this; var _c_root_method_arguments = arguments;
		var strs = [];
		for (var i = 0; i < _c_this.fields.length; i++) {
			var field = _c_this.fields[i];
			for (var f = 0; f < field.structure.flags.length; f++) {
				var flag = field.structure.flags[f];
				if (flag.type == "linked") {
					var linked = flag;
					if (linked.name == null) {
						var dataInfo = Websom.DataInfo.getDataInfoFromRoute(linked.fieldType);
						var str = dataInfo.buildStructure();
						if (linked.linkType == "array") {
							if ("Linked" in dataInfo.attributes) {
								str = new Websom.DatabaseStructure(null, "");
								var id = new Websom.DatabaseField("id", new Websom.DatabaseTypes.Int());
								id.flags.push(new Websom.DatabaseFlags.Primary());
								id.flags.push(new Websom.DatabaseFlags.AutoIncrement());
								str.fields.push(id);
								str.fields.push(new Websom.DatabaseField("linkedId", new Websom.DatabaseTypes.Int()));
								}
							str.fields.push(new Websom.DatabaseField("parentId", new Websom.DatabaseTypes.Int()));
							str.fields.push(new Websom.DatabaseField("arrayIndex", new Websom.DatabaseTypes.Int()));
							}else if (linked.linkType == "map") {
							str.fields.push(new Websom.DatabaseField("parentId", new Websom.DatabaseTypes.Int()));
							str.fields.push(new Websom.DatabaseField("mapKey", new Websom.DatabaseTypes.Varchar(256)));
							}else if ("Component" in dataInfo.attributes) {
							str.fields.push(new Websom.DatabaseField("parentId", new Websom.DatabaseTypes.Int()));
							}
						if (("Linked" in dataInfo.attributes) == false) {
							var subs = dataInfo.buildLinkedStructures(field.realName);
							for (var s = 0; s < subs.length; s++) {
								var sub = subs[s];
								sub.table = field.realName + "_" + sub.table;
								strs.push(sub);
								}
							}
						str.table = field.realName;
						strs.push(str);
						}
					}
				}
			}
		return strs;}

Websom.DataInfo.prototype.expose = function (raw) {var _c_this = this; var _c_root_method_arguments = arguments;
		var out = [];
		for (var i = 0; i < _c_this.fields.length; i++) {
			var field = _c_this.fields[i];
			if (field.expose) {
				var type = (typeof raw[field.fieldName] == 'object' ? (Array.isArray(raw[field.fieldName]) ? 'array' : 'map') : (typeof raw[field.fieldName] == 'number' ? 'float' : typeof raw[field.fieldName]));
				if (type == "string") {
					var cast = raw[field.fieldName];
					out.push("\"" + field.realName + "\": " + Websom.Json.encode(cast));
					}else if (type == "bool") {
					var val = "false";
					if (raw[field.fieldName] == 1) {
						val = "true";
						}
					out.push("\"" + field.realName + "\": " + val);
					}else if (type == "float" || type == "integer") {
					out.push("\"" + field.realName + "\": " + raw[field.fieldName]);
					}
				}
			}
		return "{" + out.join(", ") + "}";}

Websom.FieldInfo = function (realName, fieldName, typeRoute, structure) {var _c_this = this;
	this.realName = "";

	this.fieldName = "";

	this.typeRoute = "";

	this.controlClass = "";

	this.isPrimitive = true;

	this.isComplex = false;

	this.onlyServer = false;

	this.singleLink = false;

	this.canBeNull = false;

	this.expose = true;

	this.attributes = {};

	this.structure = null;

	this.default = null;

		_c_this.realName = realName;
		_c_this.fieldName = fieldName;
		_c_this.typeRoute = typeRoute;
		_c_this.structure = structure;
}

Websom.FieldInfo.prototype.isComponent = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		if (_c_this.singleLink) {
			var linked = _c_this.structure.getFlag("linked");
			if (linked != null && linked.fieldType != null) {
				var dataInfo = Websom.DataInfo.getDataInfoFromRoute(linked.fieldType);
				if ("Component" in dataInfo.attributes) {
					return true;
					}else{
						return false;
					}
				}else{
					return false;
				}
			}else{
				return false;
			}}

Websom.DataValidator = function (info) {var _c_this = this;
	this.info = null;

		_c_this.info = info;
}

Websom.DataValidator.prototype.validate = function (input, pass) {var _c_this = this; var _c_root_method_arguments = arguments;
		var that = _c_this;
		var first = null;
		var waits = _c_this.info.fields.length;
		var done = function (iv) {
			if (first == null) {
				first = iv;
				}
			waits--;
			if (waits == 0) {
				if (first == null) {
					first = new Websom.InputValidation(false, "");
					}
				pass(first);
				}
			};
		for (var ii = 0; ii < _c_this.info.fields.length; ii++) {
			var close = function (i) {
				var field = that.info.fields[i];
				if (field.realName in input.raw) {
					if (field.structure.hasFlag("edit") == false) {

						}else{
							if (field.isPrimitive && field.isComplex == false && field.singleLink == false) {
								var typeCompare = field.typeRoute;
								if (typeCompare == "bool") {
									typeCompare = "boolean";
									input.raw[field.realName] = input.raw[field.realName] == "true";
									}
								if (typeCompare == "int") {
									input.raw[field.realName] = parseInt(input.raw[field.realName]);
									
									if (input.raw[field.realName] == NaN) {
										done(new Websom.InputValidation(true, "Invalid type", field));
										return null;
									}
								
									}else if (typeCompare == "float") {
									input.raw[field.realName] = parseFloat(input.raw[field.realName]);
									
									if (input.raw[field.realName] == NaN) {
										done(new Websom.InputValidation(true, "Invalid type", field));
										return null;
									}
								
									}else if ((typeof input.raw[field.realName] == 'object' ? (Array.isArray(input.raw[field.realName]) ? 'array' : 'map') : (typeof input.raw[field.realName] == 'number' ? 'float' : typeof input.raw[field.realName])) != typeCompare) {
									done(new Websom.InputValidation(true, "Invalid type", field));
									return null;
									}
								if ("Length" in field.attributes) {
									var max = field.attributes["Length"];
									var cast = input.raw[field.realName];
									if (cast.length > max) {
										done(new Websom.InputValidation(true, "Value length must be less than " + max, field));
										return null;
										}
									}
								if ("Min" in field.attributes) {
									var min = field.attributes["Min"];
									if (field.typeRoute == "string") {
										var cast = input.raw[field.realName];
										if (cast.length < min) {
											done(new Websom.InputValidation(true, "Value length must be more than " + min, field));
											return null;
											}
										}else{
											var cast = input.raw[field.realName];
											if (cast < min) {
												done(new Websom.InputValidation(true, "Value must be more than " + min, field));
												return null;
												}
										}
									}
								if ("Max" in field.attributes) {
									var cast = input.raw[field.realName];
									var max = field.attributes["Max"];
									if (cast > max) {
										done(new Websom.InputValidation(true, "Value must be less than " + max, field));
										return null;
										}
									}
								if ("Match" in field.attributes) {
									var cast = input.raw[field.realName];
									var reg = field.attributes["Match"];
									if ((new RegExp(reg)).test(cast) == false) {
										var err = "Value must match " + reg;
										if ("MatchError" in field.attributes) {
											err = field.attributes["MatchError"];
											}
										done(new Websom.InputValidation(true, err, field));
										return null;
										}
									}
								}else if (field.singleLink) {
								if ((typeof input.raw[field.realName] == 'object' ? (Array.isArray(input.raw[field.realName]) ? 'array' : 'map') : (typeof input.raw[field.realName] == 'number' ? 'float' : typeof input.raw[field.realName])) != "string" && (typeof input.raw[field.realName] == 'object' ? (Array.isArray(input.raw[field.realName]) ? 'array' : 'map') : (typeof input.raw[field.realName] == 'number' ? 'float' : typeof input.raw[field.realName])) != "integer") {
									done(new Websom.InputValidation(true, "Invalid type", field));
									return null;
									}
								var linkInfo = Websom.DataInfo.getDataInfoFromRoute(field.typeRoute);
								var linked = field.structure.getFlag("linked");
								var linkedTable = linked.name;
								var tbl = new Websom.Containers.Table(input.server, linkedTable, linkInfo);
								var obj = linkInfo.spawn(input.server);
								obj.websomContainer = tbl;
								obj.websomServer = tbl.server;
								var close2 = function (ffield) {
									obj.loadFromPublicKey(tbl, input.raw[ffield.realName], function (err) {
										if (err.length > 0) {
											done(new Websom.InputValidation(true, "No " + ffield.realName + " found", ffield));
											return null;
											}
										input.raw[ffield.realName] = obj.getField("id");
										});
									};
								close2(field);
								}
						}
					}else if (field.canBeNull == false) {
					if (field.structure.hasFlag("edit")) {
						if (field.typeRoute == "array") {
							input.raw[field.fieldName] = [];
							done(null);
							}else{
								done(new Websom.InputValidation(true, "No value", field));
								return null;
							}
						}
					}
				done(null);
				};
			close(ii);
			}}

Websom.Databases = function () {var _c_this = this;


}

Websom.Database = function (server) {var _c_this = this;
	this.server = null;

	this.config = null;

	this.name = "";

	this.open = false;

	this.connecting = false;

	this.waits = [];

		_c_this.server = server;
}

Websom.Database.make = function (server, type) {var _c_this = this; var _c_root_method_arguments = arguments;
		if (type == "mysql") {
			return new Websom.Databases.MySql(server);
			}}

Websom.Database.prototype.wait = function (func) {var _c_this = this; var _c_root_method_arguments = arguments;
		_c_this.waits.push(func);}

Websom.Database.prototype.load = function (config) {var _c_this = this; var _c_root_method_arguments = arguments;
		_c_this.config = config;
		_c_this.name = _c_this.config["name"];}

Websom.Database.prototype.connected = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		for (var i = 0; i < _c_this.waits.length; i++) {
			_c_this.waits[i]();
			}}

Websom.Database.prototype.structure = function (table) {var _c_this = this; var _c_root_method_arguments = arguments;
		return new Websom.DatabaseStructure(_c_this, table);}

Websom.Entity = function () {var _c_this = this;
	this.rawFields = null;

	this.collection = null;

	this.id = "";


}

/*i async*/Websom.Entity.prototype.load = async function () {var _c_this = this; var _c_root_method_arguments = arguments;
/*async*/
		var doc = (await _c_this.collection.document/* async call */(_c_this.id));
		(await _c_this.loadFromMap/* async call */(doc.data()));}

/*i async*/Websom.Entity.prototype.loadEntityArray = async function (arr) {var _c_this = this; var _c_root_method_arguments = arguments;
/*async*/
		if (arr.length > 0) {
/*async*/
			var collection = arr[0].collection;
			var ids = [];
			for (var i = 0; i < arr.length; i++) {
				ids.push(arr[i].id);
				}
			var docs = (await collection.getAll/* async call */(ids));
			for (var i = 0; i < docs.length; i++) {
/*async*/
				var doc = docs[i];
				var entity = arr.find(function (ent) {
					return ent.id == doc.id;
					});
				(await entity.loadFromMap/* async call */(doc.data()));
				}
			}}

Websom.Entity.applySchema = function (collection) {var _c_this = this; var _c_root_method_arguments = arguments;
		_c_this.linkToCollection(collection);
		
			return this.getSchema(collection);
		
		}

Websom.Entity.linkToCollection = function (collection) {var _c_this = this; var _c_root_method_arguments = arguments;
		
			collection.entityTemplate = this;
		
		}

Websom.Entity.prototype.getFieldValue = function (field) {var _c_this = this; var _c_root_method_arguments = arguments;
		
			return this[field];
		
		}

Websom.Entity.prototype.getFieldsChanged = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		var fieldsChanged = [];
		for (var i = 0; i < _c_this.collection.appliedSchema.fields.length; i++) {
			var field = _c_this.collection.appliedSchema.fields[i];
			var realValue = null;
			var myValue = _c_this.getFieldValue(field.name);
			var rawValue = _c_this.rawFields[field.name];
			var isDifferent = false;
			if (field.type == "time") {
				var cast = myValue;
				if (cast == null) {
					realValue = null;
					}else{
						realValue = cast.timestamp;
					}
				isDifferent = realValue != rawValue;
				}else if (field.type == "reference") {
				var cast = myValue;
				if (cast != null) {
					realValue = cast.id;
					}
				isDifferent = realValue != rawValue;
				}else if (field.type == "array") {
				
					isDifferent = JSON.stringify(myValue) != JSON.stringify(rawValue);
				
				
				}else{
					realValue = myValue;
					isDifferent = realValue != rawValue;
				}
			if (isDifferent) {
				fieldsChanged.push(field);
				}
			}
		return fieldsChanged;}

/*i async*/Websom.Entity.prototype.saveToCollection = async function () {var _c_this = this; var _c_root_method_arguments = arguments;
/*async*/
		var fields = _c_this.getFieldsChanged();
		var update = _c_this.collection.update().where("id", "==", _c_this.id);
		for (var i = 0; i < fields.length; i++) {
			var field = fields[i];
			update.set(field.name, _c_this.getFieldValue(field.name));
			}
		return (await update.run/* async call */());}

/*i async*/Websom.Entity.prototype.loadFromMap = async function (data) {var _c_this = this; var _c_root_method_arguments = arguments;
		_c_this.rawFields = data;
		
			for (let k in data) {
				if (data.hasOwnProperty(k) && this.hasOwnProperty(k)) {
					let camel = k[0].toUpperCase() + k.substr(1, k.length);

					if (this["load" + camel]) {
						await this["load" + camel](data[k]);
					}else{
						this[k] = data[k];
					}
				}
			}
		
		}

Websom.Group = function () {var _c_this = this;
	this.name = "";

	this.description = "";

	this.rules = "";

	this.public = false;

	this.user = false;

	this.created = null;

	this.permissions = [];

	this.rawFields = null;

	this.collection = null;

	this.id = "";


}

/*i async*/Websom.Group.prototype.load = async function () {var _c_this = this; var _c_root_method_arguments = arguments;
/*async*/
		var doc = (await _c_this.collection.document/* async call */(_c_this.id));
		(await _c_this.loadFromMap/* async call */(doc.data()));}

/*i async*/Websom.Group.prototype.loadEntityArray = async function (arr) {var _c_this = this; var _c_root_method_arguments = arguments;
/*async*/
		if (arr.length > 0) {
/*async*/
			var collection = arr[0].collection;
			var ids = [];
			for (var i = 0; i < arr.length; i++) {
				ids.push(arr[i].id);
				}
			var docs = (await collection.getAll/* async call */(ids));
			for (var i = 0; i < docs.length; i++) {
/*async*/
				var doc = docs[i];
				var entity = arr.find(function (ent) {
					return ent.id == doc.id;
					});
				(await entity.loadFromMap/* async call */(doc.data()));
				}
			}}

Websom.Group.applySchema = function (collection) {var _c_this = this; var _c_root_method_arguments = arguments;
		_c_this.linkToCollection(collection);
		
			return this.getSchema(collection);
		
		}

Websom.Group.linkToCollection = function (collection) {var _c_this = this; var _c_root_method_arguments = arguments;
		
			collection.entityTemplate = this;
		
		}

Websom.Group.prototype.getFieldValue = function (field) {var _c_this = this; var _c_root_method_arguments = arguments;
		
			return this[field];
		
		}

Websom.Group.prototype.getFieldsChanged = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		var fieldsChanged = [];
		for (var i = 0; i < _c_this.collection.appliedSchema.fields.length; i++) {
			var field = _c_this.collection.appliedSchema.fields[i];
			var realValue = null;
			var myValue = _c_this.getFieldValue(field.name);
			var rawValue = _c_this.rawFields[field.name];
			var isDifferent = false;
			if (field.type == "time") {
				var cast = myValue;
				if (cast == null) {
					realValue = null;
					}else{
						realValue = cast.timestamp;
					}
				isDifferent = realValue != rawValue;
				}else if (field.type == "reference") {
				var cast = myValue;
				if (cast != null) {
					realValue = cast.id;
					}
				isDifferent = realValue != rawValue;
				}else if (field.type == "array") {
				
					isDifferent = JSON.stringify(myValue) != JSON.stringify(rawValue);
				
				
				}else{
					realValue = myValue;
					isDifferent = realValue != rawValue;
				}
			if (isDifferent) {
				fieldsChanged.push(field);
				}
			}
		return fieldsChanged;}

/*i async*/Websom.Group.prototype.saveToCollection = async function () {var _c_this = this; var _c_root_method_arguments = arguments;
/*async*/
		var fields = _c_this.getFieldsChanged();
		var update = _c_this.collection.update().where("id", "==", _c_this.id);
		for (var i = 0; i < fields.length; i++) {
			var field = fields[i];
			update.set(field.name, _c_this.getFieldValue(field.name));
			}
		return (await update.run/* async call */());}

/*i async*/Websom.Group.prototype.loadFromMap = async function (data) {var _c_this = this; var _c_root_method_arguments = arguments;
		_c_this.rawFields = data;
		
			for (let k in data) {
				if (data.hasOwnProperty(k) && this.hasOwnProperty(k)) {
					let camel = k[0].toUpperCase() + k.substr(1, k.length);

					if (this["load" + camel]) {
						await this["load" + camel](data[k]);
					}else{
						this[k] = data[k];
					}
				}
			}
		
		}

Websom.Group.prototype.loadCreated = function (value) {var _c_this = this; var _c_root_method_arguments = arguments;
		_c_this.created = new Websom.Time();
		_c_this.created.timestamp = value;}

Websom.Group.getSchema = function (collection) {var _c_this = this; var _c_root_method_arguments = arguments;
		return collection.schema().field("name", "string").field("description", "string").field("rules", "string").field("public", "boolean").field("user", "boolean").field("created", "time").field("permissions", "array");}

Websom.InputChain = function (ih) {var _c_this = this;
	this.handler = null;

	this.hasCaptcha = false;

	this.successCallback = null;

	this.errorCallback = null;

	this.restricts = [];

	this.keys = [];

		_c_this.handler = ih;
}

Websom.InputChain.prototype.use = function (control) {var _c_this = this; var _c_root_method_arguments = arguments;
		control.use(_c_this);
		return _c_this;}

Websom.InputChain.prototype.captcha = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		_c_this.hasCaptcha = true;
		return _c_this;}

Websom.InputChain.prototype.restrict = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		var restrict = new Websom.InputRestriction("global", "");
		_c_this.restricts.push(restrict);
		return _c_this;}

Websom.InputChain.prototype.to = function () {var _c_this = this; var _c_root_method_arguments = arguments;
	if (arguments.length == 2 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'string' || typeof arguments[1] == 'undefined' || arguments[1] === null)) {
		var key = arguments[0];
		var value = arguments[1];
		if (_c_this.restricts.length > 0) {
			var r = _c_this.restricts[_c_this.restricts.length - 1];
			r.simple = true;
			r.key = key;
			r.value = value;
			}
		return _c_this;
	}
else 	if (arguments.length == 1 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var permission = arguments[0];
		return _c_this.to("permission", permission);
	}
else 	if (arguments.length == 1 && (typeof arguments[0] == 'function' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var callback = arguments[0];
		if (_c_this.restricts.length > 0) {
			var r = _c_this.restricts[_c_this.restricts.length - 1];
			r.simple = false;
			r.callback = callback;
			}
		return _c_this;
	}
}

Websom.InputChain.prototype.multipart = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		return _c_this;}

Websom.InputChain.prototype.key = function (key) {var _c_this = this; var _c_root_method_arguments = arguments;
		_c_this.keys.push(new Websom.InputKey(key));
		return _c_this;}

Websom.InputChain.prototype.is = function () {var _c_this = this; var _c_root_method_arguments = arguments;
	if (arguments.length == 1 && ((arguments[0] instanceof Websom.Container || (arguments[0] instanceof Websom.Containers.Table)) || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var dataTypeContainer = arguments[0];
		return _c_this.is(new Websom.InputFilters.Data(dataTypeContainer));
	}
else 	if (arguments.length == 1 && ((arguments[0] instanceof Websom.InputKeyFilter || (arguments[0] instanceof Websom.InputFilters.Data) || (arguments[0] instanceof Websom.InputFilters.String)) || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var filter = arguments[0];
		if (_c_this.keys.length > 0) {
			_c_this.keys[_c_this.keys.length - 1].setFilter(filter);
			}
		return _c_this;
	}
else 	if (arguments.length == 1 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var typeName = arguments[0];
		if (_c_this.keys.length > 0) {
			if (typeName == "string") {
				_c_this.keys[_c_this.keys.length - 1].setFilter(new Websom.InputFilters.String());
				}else{
					throw new Error("Unknown is typeName " + typeName);
				}
			}
		return _c_this;
	}
}

Websom.InputChain.prototype.length = function (min, max) {var _c_this = this; var _c_root_method_arguments = arguments;
		if (_c_this.keys.length > 0) {
			var filter = _c_this.keys[_c_this.keys.length - 1].filter;
			filter.minLength = min;
			filter.maxLength = max;
			}
		return _c_this;}

Websom.InputChain.prototype.only = function (values) {var _c_this = this; var _c_root_method_arguments = arguments;
		if (_c_this.keys.length > 0) {
			var filter = _c_this.keys[_c_this.keys.length - 1].filter;
			filter.only = values;
			}
		return _c_this;}

Websom.InputChain.prototype.not = function (values) {var _c_this = this; var _c_root_method_arguments = arguments;
		if (_c_this.keys.length > 0) {
			var filter = _c_this.keys[_c_this.keys.length - 1].filter;
			filter.not = values;
			}
		return _c_this;}

Websom.InputChain.prototype.matches = function (regex) {var _c_this = this; var _c_root_method_arguments = arguments;
		if (_c_this.keys.length > 0) {
			var filter = _c_this.keys[_c_this.keys.length - 1].filter;
			filter.matches = regex;
			}
		return _c_this;}

Websom.InputChain.prototype.success = function (callback) {var _c_this = this; var _c_root_method_arguments = arguments;
		_c_this.successCallback = callback;
		return _c_this;}

Websom.InputChain.prototype.error = function (callback) {var _c_this = this; var _c_root_method_arguments = arguments;
		_c_this.errorCallback = callback;
		return _c_this;}

Websom.InputChain.prototype.received = function (input) {var _c_this = this; var _c_root_method_arguments = arguments;
		var that = _c_this;
		var hasKeys = true;
		for (var i = 0; i < _c_this.keys.length; i++) {
			var key = _c_this.keys[i];
			if ((key.key in input.raw) == false) {
				hasKeys = false;
				}
			}
		if (hasKeys == false) {
			input.sendError("Invalid keys");
			return null;
			}
		var dones = _c_this.keys.length + _c_this.restricts.length;
		var validation = null;
		var putData = {};
		var checkDone = function () {
			if (dones <= 0) {
				var sent = false;
				if (validation != null && validation.hadError) {
					if (that.errorCallback != null) {
						that.errorCallback(input, validation);
						}else{
							input.sendError(validation.stringify());
						}
					}else{
						if (that.successCallback != null) {
							that.successCallback(input, putData);
							}else{
								input.sendSuccess("No success handler registered");
							}
					}
				}
			};
		for (var i = 0; i < _c_this.keys.length; i++) {
			var key = _c_this.keys[i];
			if (key.filter != null) {
				key.filter.filter(input, input.raw, key.key, putData, function (iv) {
					if (iv != null && iv.hadError) {
						dones = 0;
						validation = iv;
						checkDone();
						}else{
							dones--;
							checkDone();
						}
					});
				}else{
					putData[key.key] = input.raw[key.key];
					dones--;
					checkDone();
				}
			}
		for (var i = 0; i < _c_this.restricts.length; i++) {
			var r = _c_this.restricts[i];
			if (r.simple) {
				var ct = input.server.input.restrictHandlers;
				if (r.key in ct) {
					var handler = input.server.input.restrictHandlers[r.key];
					handler(r.value, input.request, function (passed) {
if (passed) {
	dones--;
	checkDone();
	}else{
		input.sendError("No permission");
	}
});
					return null;
					}else{
						throw new Error("Custom restriction " + r.key + " not found in request to global interface");
					}
				}else{
					if (r.callback != null) {
						r.callback(function (passed) {
if (passed) {
	dones--;
	checkDone();
	}else{
		input.sendError("No permission");
	}
});
						}else{
							throw new Error("Restrict callback on global interface is null. Did you forget interface.to(void () => {})?");
						}
					return null;
				}
			}}

Websom.InputKey = function (key) {var _c_this = this;
	this.key = null;

	this.type = "raw";

	this.filter = null;

		_c_this.key = key;
}

Websom.InputKey.prototype.setFilter = function (filter) {var _c_this = this; var _c_root_method_arguments = arguments;
		_c_this.filter = filter;}

Websom.InputKeyFilter = function () {var _c_this = this;
	this.minLength = -1;

	this.maxLength = -1;

	this.max = -1;

	this.min = -1;

	this.only = [];

	this.not = [];

	this.matches = "";


}

Websom.InputKeyFilter.prototype.filter = function (input, data, key, putData, done) {var _c_this = this; var _c_root_method_arguments = arguments;
		putData[key] = data[key];
		done(new Websom.InputValidation(false, ""));}

Websom.InputFilters = function () {var _c_this = this;


}

Websom.InputFilters.Data = function (container) {var _c_this = this;
	this.container = null;

	this.minLength = -1;

	this.maxLength = -1;

	this.max = -1;

	this.min = -1;

	this.only = [];

	this.not = [];

	this.matches = "";

		_c_this.container = container;
}

Websom.InputFilters.Data.prototype.filter = function (input, data, key, putData, done) {var _c_this = this; var _c_root_method_arguments = arguments;
		var invalid = true;
		if ((typeof data[key] == 'object' ? (Array.isArray(data[key]) ? 'array' : 'map') : (typeof data[key] == 'number' ? 'float' : typeof data[key])) == "string") {
			var publicId = data[key];
			if (publicId.length == 12) {
				invalid = false;
				}
			}
		if (invalid) {
			done(new Websom.InputValidation(true, "Invalid publicId for key " + key));
			}else{
				_c_this.container.loadFromSelect(_c_this.container.from().where("publicId").equals(data[key]), function (results) {
					if (results.length != 1) {
						done(new Websom.InputValidation(true, "Invalid publicId for key " + key));
						}else{
							putData[key] = results[0];
							done(new Websom.InputValidation(false, ""));
						}
					});
			}}

Websom.InputFilters.String = function () {var _c_this = this;
	this.minLength = -1;

	this.maxLength = -1;

	this.max = -1;

	this.min = -1;

	this.only = [];

	this.not = [];

	this.matches = "";


}

Websom.InputFilters.String.prototype.filter = function (input, data, key, putData, done) {var _c_this = this; var _c_root_method_arguments = arguments;
		var invalid = false;
		if ((typeof data[key] == 'object' ? (Array.isArray(data[key]) ? 'array' : 'map') : (typeof data[key] == 'number' ? 'float' : typeof data[key])) == "string") {
			var value = data[key];
			if (_c_this.maxLength != -1) {
				if (value.length > _c_this.maxLength) {
					invalid = true;
					}
				}
			if ((invalid == false) && _c_this.minLength != -1) {
				if (value.length < _c_this.minLength) {
					invalid = true;
					}
				}
			if ((invalid == false) && _c_this.only.length > 0) {
				invalid = true;
				for (var i = 0; i < _c_this.only.length; i++) {
					var check = _c_this.only[i];
					if (value == check) {
						invalid = false;
						break;
						}
					}
				}else if ((invalid == false) && _c_this.not.length > 0) {
				for (var i = 0; i < _c_this.not.length; i++) {
					var check = _c_this.not[i];
					if (value == check) {
						invalid = true;
						break;
						}
					}
				}
			if ((invalid == false) && _c_this.matches.length > 0) {
				if ((new RegExp(_c_this.matches)).test(value) == false) {
					invalid = true;
					}
				}
			}else{
				invalid = true;
			}
		if (invalid) {
			done(new Websom.InputValidation(true, "Invalid value for key " + key));
			}else{
				done(new Websom.InputValidation(false, ""));
			}}

Websom.InterfaceChain = function () {var _c_this = this;
	this.parent = null;

	this.upChain = null;

	this.subs = {};

	this.io = null;

	this.currentMode = "interface";

	if (arguments.length == 2 && ((arguments[0] instanceof Websom.Container || (arguments[0] instanceof Websom.Containers.Table)) || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'string' || typeof arguments[1] == 'undefined' || arguments[1] === null)) {
		var parent = arguments[0];
		var route = arguments[1];
		_c_this.parent = parent;
		_c_this.io = new Websom.InterfaceOptions(route);
		_c_this.parent.interface(_c_this.io);
	}
else 	if (arguments.length == 2 && ((arguments[0] instanceof Websom.Container || (arguments[0] instanceof Websom.Containers.Table)) || typeof arguments[0] == 'undefined' || arguments[0] === null) && ((arguments[1] instanceof Websom.InterfaceChain) || typeof arguments[1] == 'undefined' || arguments[1] === null)) {
		var parent = arguments[0];
		var upChain = arguments[1];
		_c_this.parent = parent;
		_c_this.io = new Websom.InterfaceOptions(upChain.io.route);
		_c_this.upChain = upChain;
	}

}

Websom.InterfaceChain.prototype.captcha = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		if (_c_this.currentMode == "select") {
			_c_this.io.captchaSelect = true;
			}else if (_c_this.currentMode == "insert") {
			_c_this.io.captchaInsert = true;
			}else{
				_c_this.io.captchaUpdate = true;
			}
		return _c_this;}

Websom.InterfaceChain.prototype.select = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		_c_this.currentMode = "select";
		_c_this.io.canSelect = true;
		return _c_this;}

Websom.InterfaceChain.prototype.insert = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		_c_this.currentMode = "insert";
		_c_this.io.canInsert = true;
		return _c_this;}

Websom.InterfaceChain.prototype.update = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		_c_this.currentMode = "update";
		_c_this.io.canUpdate = true;
		return _c_this;}

Websom.InterfaceChain.prototype.interface = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		_c_this.currentMode = "interface";
		_c_this.io.canInterface = true;
		return _c_this;}

Websom.InterfaceChain.prototype.up = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		return _c_this.upChain;}

Websom.InterfaceChain.prototype.restrict = function (field) {var _c_this = this; var _c_root_method_arguments = arguments;
		var mode = _c_this.currentMode;
		if (mode == "interface") {
			mode = "global";
			}
		var restrict = new Websom.InputRestriction(mode, field);
		_c_this.io.restricts.push(restrict);
		return _c_this;}

Websom.InterfaceChain.prototype.to = function () {var _c_this = this; var _c_root_method_arguments = arguments;
	if (arguments.length == 2 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'string' || typeof arguments[1] == 'undefined' || arguments[1] === null)) {
		var key = arguments[0];
		var value = arguments[1];
		if (_c_this.io.restricts.length > 0) {
			var r = _c_this.io.restricts[_c_this.io.restricts.length - 1];
			r.simple = true;
			r.key = key;
			r.value = value;
			}
		return _c_this;
	}
else 	if (arguments.length == 1 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var permission = arguments[0];
		return _c_this.to("permission", permission);
	}
else 	if (arguments.length == 1 && (typeof arguments[0] == 'function' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var callback = arguments[0];
		if (_c_this.io.restricts.length > 0) {
			var r = _c_this.io.restricts[_c_this.io.restricts.length - 1];
			r.simple = false;
			r.callback = callback;
			}
		return _c_this;
	}
}

Websom.InterfaceChain.prototype.multipart = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		_c_this.io.multipart = true;
		return _c_this;}

Websom.InterfaceChain.prototype.sub = function (fieldName) {var _c_this = this; var _c_root_method_arguments = arguments;
		if (_c_this.subs[fieldName] == null) {
			var childChain = new Websom.InterfaceChain(_c_this.parent, _c_this);
			childChain.io.route = _c_this.io.route;
			_c_this.subs[fieldName] = childChain;
			_c_this.io.subs[fieldName] = childChain.io;
			return childChain;
			}else{
				var cast = _c_this.subs[fieldName];
				return cast;
			}}

Websom.InterfaceChain.prototype.mustOwn = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		if (_c_this.currentMode == "insert") {
			_c_this.io.mustOwnInsert = true;
			}else if (_c_this.currentMode == "update") {
			_c_this.io.mustOwnUpdate = true;
			}else if (_c_this.currentMode == "select") {
			_c_this.io.mustOwnSelect = true;
			}
		return _c_this;}

Websom.InterfaceChain.prototype.mustLogin = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		_c_this.io.mustLogin = true;
		return _c_this;}

Websom.InterfaceChain.prototype.unique = function (key) {var _c_this = this; var _c_root_method_arguments = arguments;
		_c_this.io.uniqueKeys.push(key);
		_c_this.control(new Websom.Controls.Unique(key));
		return _c_this;}

Websom.InterfaceChain.prototype.autoPublicId = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		_c_this.io.autoPublicId = true;
		return _c_this;}

Websom.InterfaceChain.prototype.timestamp = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		_c_this.io.autoTimestamp = true;
		return _c_this;}

Websom.InterfaceChain.prototype.control = function (control) {var _c_this = this; var _c_root_method_arguments = arguments;
		if (_c_this.currentMode == "select") {
			_c_this.io.selectControls.push(control);
			}else if (_c_this.currentMode == "update") {
			_c_this.io.updateControls.push(control);
			}else if (_c_this.currentMode == "insert") {
			_c_this.io.insertControls.push(control);
			}else if (_c_this.currentMode == "interface") {
			_c_this.io.controls.push(control);
			}
		return _c_this;}

Websom.InterfaceChain.prototype.success = function (func) {var _c_this = this; var _c_root_method_arguments = arguments;
		if (_c_this.currentMode == "update") {
			_c_this.io.successUpdate = func;
			}else if (_c_this.currentMode == "insert") {
			_c_this.io.successInsert = func;
			}
		return _c_this;}

Websom.InterfaceChain.prototype.on = function (func) {var _c_this = this; var _c_root_method_arguments = arguments;
		if (_c_this.currentMode == "select") {
			_c_this.io.onSelect = func;
			}else if (_c_this.currentMode == "update") {
			_c_this.io.onUpdate = func;
			}else if (_c_this.currentMode == "insert") {
			_c_this.io.onInsert = func;
			}
		return _c_this;}

Websom.InterfaceChain.prototype.expose = function (func) {var _c_this = this; var _c_root_method_arguments = arguments;
		_c_this.io.expose(func);
		return _c_this;}

Websom.InterfaceChain.prototype.authPermission = function (perm) {var _c_this = this; var _c_root_method_arguments = arguments;
		if (_c_this.currentMode == "select") {
			_c_this.io.selectPermission = perm;
			}else if (_c_this.currentMode == "update") {
			_c_this.io.updatePermission = perm;
			}else if (_c_this.currentMode == "insert") {
			_c_this.io.insertPermission = perm;
			}
		_c_this.io.hasAuth = true;
		return _c_this;}

Websom.InterfaceChain.prototype.autoControl = function (info) {var _c_this = this; var _c_root_method_arguments = arguments;
		_c_this.io.autoControl(info);
		return _c_this;}

Websom.ClientMessage = function () {var _c_this = this;
	this.message = "";

	this.href = "";

	this.doReload = false;

	this.hadError = false;

	this.validations = [];


}

Websom.ClientMessage.quickError = function (msg) {var _c_this = this; var _c_root_method_arguments = arguments;
		var err = new Websom.ClientMessage();
		err.message = msg;
		err.hadError = true;
		return err;}

Websom.ClientMessage.prototype.navigate = function (href) {var _c_this = this; var _c_root_method_arguments = arguments;
		_c_this.href = href;}

Websom.ClientMessage.prototype.reload = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		_c_this.doReload = true;}

Websom.ClientMessage.prototype.add = function (validation) {var _c_this = this; var _c_root_method_arguments = arguments;
		if (validation.hadError) {
			_c_this.hadError = true;
			}
		_c_this.validations.push(validation);}

Websom.ClientMessage.prototype.stringify = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		var anon = [];
		var status = "success";
		if (_c_this.hadError) {
			status = "error";
			}
		for (var i = 0; i < _c_this.validations.length; i++) {
			if (_c_this.validations[i].hadError) {
				status = "error";
				}
			anon.push("\"" + _c_this.validations[i].stringify() + "\"");
			}
		var add = "";
		if (_c_this.href.length > 0) {
			add += ", \"action\": \"navigate\", \"href\": \"" + _c_this.href + "\"";
			status = "action";
			}
		if (_c_this.doReload) {
			add += ", \"action\": \"reload\"";
			status = "action";
			}
		return "{\"status\": \"" + status + "\", \"messages\": [" + anon.join(", ") + "], \"message\": " + Websom.Json.encode(_c_this.message) + add + "}";}

Websom.Module = function (server) {var _c_this = this;
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

Websom.Module.prototype.registerWithServer = function () {var _c_this = this; var _c_root_method_arguments = arguments;
}

Websom.Module.prototype.clientData = function (req, send) {var _c_this = this; var _c_root_method_arguments = arguments;
		return false;}

Websom.Module.prototype.spawn = function (config) {var _c_this = this; var _c_root_method_arguments = arguments;
		_c_this.baseConfig = config;
		_c_this.name = config["name"];
		_c_this.id = config["id"];}

/*i async*/Websom.Module.prototype.start = async function () {var _c_this = this; var _c_root_method_arguments = arguments;
}

Websom.Module.prototype.stop = function () {var _c_this = this; var _c_root_method_arguments = arguments;
}

Websom.Module.prototype.configure = function () {var _c_this = this; var _c_root_method_arguments = arguments;
}

Websom.Module.prototype.collections = function () {var _c_this = this; var _c_root_method_arguments = arguments;
}

Websom.Module.prototype.permissions = function () {var _c_this = this; var _c_root_method_arguments = arguments;
}

/*i async*/Websom.Module.prototype.registerCollection = async function (collection) {var _c_this = this; var _c_root_method_arguments = arguments;
/*async*/
		_c_this.registeredCollections.push(collection);
		if (_c_this.server.config.dev) {
/*async*/
			if (collection.appliedSchema != null) {
/*async*/
				(await collection.appliedSchema.register/* async call */());
				}
			}}

Websom.Module.prototype.registerPermission = function () {var _c_this = this; var _c_root_method_arguments = arguments;
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

Websom.Module.prototype.registerBucket = function (name) {var _c_this = this; var _c_root_method_arguments = arguments;
		var bucket = new Websom.Bucket(_c_this.server, name, _c_this.name);
		_c_this.registeredBuckets.push(bucket);
		_c_this.server.registerBucket(bucket);
		return bucket;}

Websom.Module.prototype.setupData = function () {var _c_this = this; var _c_root_method_arguments = arguments;
}

Websom.Module.prototype.setupBridge = function () {var _c_this = this; var _c_root_method_arguments = arguments;
}

Websom.Module.prototype.pullFromGlobalScope = function (name) {var _c_this = this; var _c_root_method_arguments = arguments;
		
			return global[name];
		}

Websom.Pack = function (server, name, root, config) {var _c_this = this;
	this.server = null;

	this.name = "";

	this.root = "";

	this.config = null;

		_c_this.server = server;
		_c_this.name = name;
		_c_this.root = root;
		_c_this.config = config;
}

Websom.Pack.prototype.start = function () {var _c_this = this; var _c_root_method_arguments = arguments;
}

Websom.Pack.prototype.include = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		var dir = _c_this.server.config.clientResources + "/pack/" + _c_this.name;
		var css = "<link rel=\"stylesheet\" type=\"text/css\" href=\"" + dir + "/pack.css\"/>";
		return "<script src=\"" + dir + "/pack.js\"></script>" + css;}

Websom.Pack.prototype.write = function (js, css) {var _c_this = this; var _c_root_method_arguments = arguments;
		var dir = _c_this.server.config.resources + "/pack/" + _c_this.name;
		if (Oxygen.FileSystem.exists(dir) == false) {
			Oxygen.FileSystem.makeDir(dir);
			}
		Oxygen.FileSystem.writeSync(dir + "/pack.js", js);
		Oxygen.FileSystem.writeSync(dir + "/pack.css", css);}

Websom.Pack.prototype.buildAndSave = function (callback) {var _c_this = this; var _c_root_method_arguments = arguments;
		var that = _c_this;
		_c_this.build(function (err, js, css) {
			that.write(js, css);
			callback(err);
			});}

Websom.Pack.prototype.getViews = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		var views = [];
		var resources = _c_this.config["resources"];
		var outputs = _c_this.server.resource.compile("Pack." + _c_this.name, _c_this.root, resources);
		for (var i = 0; i < outputs.length; i++) {
			var resource = outputs[i];
			if (resource.type == "view") {
				var view = new Websom.View(_c_this.server);
				view.loadFromFile(resource.file);
				views.push(view);
				}
			}
		return views;}

Websom.Pack.prototype.build = function (callback) {var _c_this = this; var _c_root_method_arguments = arguments;
		var that = _c_this;
		var dones = 0;
		var css = "";
		var js = "";
		var err = "";
		var doneJs = function (hadError, results) {
			dones--;
			js += results;
			if (hadError) {
				err += results + "\n";
				}
			if (dones == 0) {
				callback(err, js, css);
				}
			};
		var doneCss = function (hadError, results) {
			dones--;
			css += results;
			if (hadError) {
				err += results + "\n\n";
				}
			if (dones == 0) {
				callback(err, js, css);
				}
			};
		var resources = _c_this.config["resources"];
		var outputs = _c_this.server.resource.compile("Pack." + _c_this.name, _c_this.root, resources);
		dones = outputs.length;
		for (var i = 0; i < outputs.length; i++) {
			var resource = outputs[i];
			if (resource.type == "javascript") {
				resource.build(doneJs);
				}else if (resource.type == "less") {
				resource.reference = Oxygen.FileSystem.resolve(Oxygen.FileSystem.dirName(_c_this.server.scriptPath) + "/../../theme/style/main.less");
				resource.build(doneCss);
				}else if (resource.type == "css") {
				resource.build(doneCss);
				}else if (resource.type == "view") {
				var view = new Websom.View(_c_this.server);
				var viewErr = view.loadFromFile(resource.file);
				if (viewErr != null) {
					err += viewErr.display() + "\n";
					}
				view.hasLocalExport = true;
				doneJs(false, view.buildDev());
				}else if (resource.isInvalid) {
				err += "Invalid resource: '" + resource.file + "'\n";
				dones--;
				if (i == outputs.length - 1) {
					if (dones == 0) {
						callback(err, js, css);
						}
					}
				}
			}}

Websom.Permission = function (name) {var _c_this = this;
	this.name = "";

	this.description = "";

	this.public = false;

	this.user = false;

	this.author = false;

	this.moderator = false;

		_c_this.name = name;
}

Websom.Permission.prototype.setDescription = function (desc) {var _c_this = this; var _c_root_method_arguments = arguments;
		_c_this.description = desc;
		return _c_this;}

Websom.Permission.prototype.isPublic = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		_c_this.public = true;
		return _c_this;}

Websom.Permission.prototype.isUser = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		_c_this.user = true;
		return _c_this;}

Websom.Permission.prototype.isAuthor = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		_c_this.author = true;
		return _c_this;}

Websom.Permission.prototype.isModerator = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		_c_this.moderator = true;
		return _c_this;}

Websom.PlainInterface = function (route, func) {var _c_this = this;
	this.route = "";

	this.handler = null;

		_c_this.route = route;
		_c_this.handler = func;
}

Websom.Request = function (server, client) {var _c_this = this;
	this.server = null;

	this.client = null;

	this.sent = false;

	this.path = "";

	this.query = {};

	this.headers = {};

	this.cookies = {};

	this.body = {};

	this.files = {};

	this.userCache = null;

	this.cachedUser = false;

	this.external = false;

	this.response = null;

	this.jsRequest = null;

	this.session = null;

		_c_this.server = server;
		_c_this.client = client;
		_c_this.response = new Websom.Response();
		_c_this.session = new Websom.Session(_c_this);
}

Websom.Request.prototype.header = function (name, value) {var _c_this = this; var _c_root_method_arguments = arguments;
		if (_c_this.external) {
			_c_this.response.headers[name] = value;
			}else{
				
				this.response.jsResponse.setHeader(name, value);
			
				
			}}

Websom.Request.prototype.cookie = function (name, value) {var _c_this = this; var _c_root_method_arguments = arguments;
		var cookie = new Websom.Cookie(name, value);
		_c_this.response.cookies.push(cookie);
		return cookie;}

Websom.Request.prototype.code = function (code) {var _c_this = this; var _c_root_method_arguments = arguments;
		_c_this.response.code = code;
		if (_c_this.external == false) {
			
				this.response.jsResponse.status(code);
			
			
			}}

/*i async*/Websom.Request.prototype.endWithSuccess = async function (successMessage) {var _c_this = this; var _c_root_method_arguments = arguments;
/*async*/
		var res = {};
		res["status"] = "success";
		res["message"] = successMessage;
		_c_this.header("Content-Type", "application/json");
		(await _c_this.end/* async call */(Websom.Json.encode(res)));}

/*i async*/Websom.Request.prototype.endWithData = async function (data) {var _c_this = this; var _c_root_method_arguments = arguments;
/*async*/
		var res = {};
		res["status"] = "success";
		res["data"] = data;
		_c_this.header("Content-Type", "application/json");
		(await _c_this.end/* async call */(Websom.Json.encode(res)));}

/*i async*/Websom.Request.prototype.endWithError = async function (errorMessage) {var _c_this = this; var _c_root_method_arguments = arguments;
/*async*/
		var res = {};
		res["status"] = "error";
		res["message"] = errorMessage;
		_c_this.header("Content-Type", "application/json");
		(await _c_this.end/* async call */(Websom.Json.encode(res)));}

/*i async*/Websom.Request.prototype.endWithComponent = async function (component, context) {var _c_this = this; var _c_root_method_arguments = arguments;
/*async*/
		var res = {};
		res["status"] = "component";
		res["component"] = component;
		res["context"] = context;
		_c_this.header("Content-Type", "application/json");
		(await _c_this.end/* async call */(Websom.Json.encode(res)));}

/*i async*/Websom.Request.prototype.end = async function (content) {var _c_this = this; var _c_root_method_arguments = arguments;
/*async*/
		if (_c_this.sent) {
			return null;
			}
		_c_this.sent = true;
		(await _c_this.server.session.beforeSend/* async call */(_c_this));
		_c_this.response.bakeCookies();
		if (_c_this.external) {
			_c_this.response.body = content;
			_c_this.server.sendResponse(_c_this.response);
			}else{
				
				for (let header in this.response.headers) {
					this.response.jsResponse.header(header, this.response.headers[header]);
				}

				this.response.jsResponse.send(content);
			
				
			}}

Websom.Request.prototype.flush = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		
			this.response.jsResponse.flush();
		}

Websom.Request.prototype.write = function (content) {var _c_this = this; var _c_root_method_arguments = arguments;
		
			this.response.jsResponse.write(content);
		
		}

Websom.Request.prototype.send = function (content) {var _c_this = this; var _c_root_method_arguments = arguments;
		if (_c_this.sent) {
			return null;
			}
		_c_this.sent = true;
		
			this.response.jsResponse.send(content);
		
		}

Websom.Request.prototype.redirect = function (route) {var _c_this = this; var _c_root_method_arguments = arguments;
		
			this.response.jsResponse.redirect(route);
		
		}

Websom.Request.prototype.serve = function (path) {var _c_this = this; var _c_root_method_arguments = arguments;
		
			const fs = require("fs");
			const mime = require("mime");
			this.response.jsResponse.type(mime.getType(path));
			fs.createReadStream(path).pipe(this.response.jsResponse);
		
		}

Websom.Request.prototype.download = function (name, path) {var _c_this = this; var _c_root_method_arguments = arguments;
		
			const fs = require("fs");
			const mime = require("mime");
			this.response.jsResponse.type(mime.getType(path));
			this.response.jsResponse.setHeader("Content-disposition", "attachment; filename=" + name);
			fs.createReadStream(path).pipe(this.response.jsResponse);
		
		}

Websom.Request.prototype.getUser = function (callback) {var _c_this = this; var _c_root_method_arguments = arguments;
}

/*i async*/Websom.Request.prototype.user = async function () {var _c_this = this; var _c_root_method_arguments = arguments;
/*async*/
		if (_c_this.cachedUser) {
			return _c_this.userCache;
			}
		_c_this.cachedUser = true;
		_c_this.userCache = (await _c_this.server.userSystem.getUserFromRequest/* async call */(_c_this));
		return _c_this.userCache;}

Websom.Session = function (req) {var _c_this = this;
	this.data = {};

	this.changed = false;

	this.loaded = false;

	this.id = "";

	this.request = null;

		_c_this.request = req;
}

/*i async*/Websom.Session.prototype.set = async function (key, value) {var _c_this = this; var _c_root_method_arguments = arguments;
/*async*/
		if (_c_this.request.server.config.legacy) {
			
				this.request.jsRequest.session[key] = value;
				if (this.request.jsRequest.method == "POST") {
					this.request.jsRequest.session.save();
				}
			
			
			}else{
/*async*/
				if (_c_this.loaded == false) {
/*async*/
					_c_this.loaded = true;
					(await _c_this.request.server.session.loadRequest/* async call */(_c_this.request));
					}
				_c_this.changed = true;
				_c_this.data[key] = value;
			}}

/*i async*/Websom.Session.prototype.delete = async function (key) {var _c_this = this; var _c_root_method_arguments = arguments;
/*async*/
		if (_c_this.request.server.config.legacy) {
			
				delete this.request.jsRequest.session[key];
			
			
			}else{
/*async*/
				if (_c_this.loaded == false) {
/*async*/
					_c_this.loaded = true;
					(await _c_this.request.server.session.loadRequest/* async call */(_c_this.request));
					}
				_c_this.changed = true;
				_c_this.data[key] = null;
			}}

Websom.Session.prototype.getLegacy = function (key) {var _c_this = this; var _c_root_method_arguments = arguments;
		
			return this.request.jsRequest.session[key] || null;
		
		}

/*i async*/Websom.Session.prototype.get = async function (key) {var _c_this = this; var _c_root_method_arguments = arguments;
/*async*/
		if (_c_this.loaded == false) {
/*async*/
			_c_this.loaded = true;
			(await _c_this.request.server.session.loadRequest/* async call */(_c_this.request));
			}
		return _c_this.data[key];}

Websom.SinkRequest = function () {var _c_this = this;
	this.handler = null;

	this.server = null;

	this.client = null;

	this.sent = false;

	this.path = "";

	this.query = {};

	this.headers = {};

	this.cookies = {};

	this.body = {};

	this.files = {};

	this.userCache = null;

	this.cachedUser = false;

	this.external = false;

	this.response = null;

	this.jsRequest = null;

	this.session = null;

	if (arguments.length == 3 && ((arguments[0] instanceof Websom.Server) || typeof arguments[0] == 'undefined' || arguments[0] === null) && ((arguments[1] instanceof Websom.Client) || typeof arguments[1] == 'undefined' || arguments[1] === null) && (typeof arguments[2] == 'function' || typeof arguments[2] == 'undefined' || arguments[2] === null)) {
		var server = arguments[0];
		var client = arguments[1];
		var handler = arguments[2];
		_c_this.server = server;
		_c_this.client = client;
		_c_this.response = new Websom.Response();
		_c_this.session = new Websom.Session(_c_this);
		_c_this.handler = handler;
	}
else 	if (arguments.length == 2 && ((arguments[0] instanceof Websom.Server) || typeof arguments[0] == 'undefined' || arguments[0] === null) && ((arguments[1] instanceof Websom.Client) || typeof arguments[1] == 'undefined' || arguments[1] === null)) {
		var server = arguments[0];
		var client = arguments[1];
		_c_this.server = server;
		_c_this.client = client;
		_c_this.response = new Websom.Response();
		_c_this.session = new Websom.Session(_c_this);
	}

}

Websom.SinkRequest.prototype.copyIdentity = function (req) {var _c_this = this; var _c_root_method_arguments = arguments;
		_c_this.session = req.session;
		_c_this.client = req.client;
		_c_this.userCache = req.userCache;
		_c_this.cachedUser = req.cachedUser;
		_c_this.external = req.external;}

Websom.SinkRequest.prototype.header = function (name, value) {var _c_this = this; var _c_root_method_arguments = arguments;
}

Websom.SinkRequest.prototype.code = function (code) {var _c_this = this; var _c_root_method_arguments = arguments;
}

/*i async*/Websom.SinkRequest.prototype.end = async function () {var _c_this = this; var _c_root_method_arguments = arguments;
	if (arguments.length == 1 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var content = arguments[0];
/*async*/
		if (_c_this.sent) {
			return null;
			}
		_c_this.sent = true;
		(await _c_this.server.session.beforeSend/* async call */(_c_this));
		_c_this.handler(content);
	}
else 	if (arguments.length == 1 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var content = arguments[0];
/*async*/
		if (_c_this.sent) {
			return null;
			}
		_c_this.sent = true;
		(await _c_this.server.session.beforeSend/* async call */(_c_this));
		_c_this.response.bakeCookies();
		if (_c_this.external) {
			_c_this.response.body = content;
			_c_this.server.sendResponse(_c_this.response);
			}else{
				
				for (let header in this.response.headers) {
					this.response.jsResponse.header(header, this.response.headers[header]);
				}

				this.response.jsResponse.send(content);
			
				
			}
	}
}

Websom.SinkRequest.prototype.cookie = function (name, value) {var _c_this = this; var _c_root_method_arguments = arguments;
		var cookie = new Websom.Cookie(name, value);
		_c_this.response.cookies.push(cookie);
		return cookie;}

/*i async*/Websom.SinkRequest.prototype.endWithSuccess = async function (successMessage) {var _c_this = this; var _c_root_method_arguments = arguments;
/*async*/
		var res = {};
		res["status"] = "success";
		res["message"] = successMessage;
		_c_this.header("Content-Type", "application/json");
		(await _c_this.end/* async call */(Websom.Json.encode(res)));}

/*i async*/Websom.SinkRequest.prototype.endWithData = async function (data) {var _c_this = this; var _c_root_method_arguments = arguments;
/*async*/
		var res = {};
		res["status"] = "success";
		res["data"] = data;
		_c_this.header("Content-Type", "application/json");
		(await _c_this.end/* async call */(Websom.Json.encode(res)));}

/*i async*/Websom.SinkRequest.prototype.endWithError = async function (errorMessage) {var _c_this = this; var _c_root_method_arguments = arguments;
/*async*/
		var res = {};
		res["status"] = "error";
		res["message"] = errorMessage;
		_c_this.header("Content-Type", "application/json");
		(await _c_this.end/* async call */(Websom.Json.encode(res)));}

/*i async*/Websom.SinkRequest.prototype.endWithComponent = async function (component, context) {var _c_this = this; var _c_root_method_arguments = arguments;
/*async*/
		var res = {};
		res["status"] = "component";
		res["component"] = component;
		res["context"] = context;
		_c_this.header("Content-Type", "application/json");
		(await _c_this.end/* async call */(Websom.Json.encode(res)));}

Websom.SinkRequest.prototype.flush = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		
			this.response.jsResponse.flush();
		}

Websom.SinkRequest.prototype.write = function (content) {var _c_this = this; var _c_root_method_arguments = arguments;
		
			this.response.jsResponse.write(content);
		
		}

Websom.SinkRequest.prototype.send = function (content) {var _c_this = this; var _c_root_method_arguments = arguments;
		if (_c_this.sent) {
			return null;
			}
		_c_this.sent = true;
		
			this.response.jsResponse.send(content);
		
		}

Websom.SinkRequest.prototype.redirect = function (route) {var _c_this = this; var _c_root_method_arguments = arguments;
		
			this.response.jsResponse.redirect(route);
		
		}

Websom.SinkRequest.prototype.serve = function (path) {var _c_this = this; var _c_root_method_arguments = arguments;
		
			const fs = require("fs");
			const mime = require("mime");
			this.response.jsResponse.type(mime.getType(path));
			fs.createReadStream(path).pipe(this.response.jsResponse);
		
		}

Websom.SinkRequest.prototype.download = function (name, path) {var _c_this = this; var _c_root_method_arguments = arguments;
		
			const fs = require("fs");
			const mime = require("mime");
			this.response.jsResponse.type(mime.getType(path));
			this.response.jsResponse.setHeader("Content-disposition", "attachment; filename=" + name);
			fs.createReadStream(path).pipe(this.response.jsResponse);
		
		}

Websom.SinkRequest.prototype.getUser = function (callback) {var _c_this = this; var _c_root_method_arguments = arguments;
}

/*i async*/Websom.SinkRequest.prototype.user = async function () {var _c_this = this; var _c_root_method_arguments = arguments;
/*async*/
		if (_c_this.cachedUser) {
			return _c_this.userCache;
			}
		_c_this.cachedUser = true;
		_c_this.userCache = (await _c_this.server.userSystem.getUserFromRequest/* async call */(_c_this));
		return _c_this.userCache;}

Websom.Response = function () {var _c_this = this;
	this.code = 200;

	this.body = "";

	this.message = "";

	this.headers = {};

	this.cookies = [];

	this.jsResponse = null;


}

Websom.Response.prototype.bakeCookies = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		for (var i = 0; i < _c_this.cookies.length; i++) {
			var cookie = _c_this.cookies[i];
			if ("Set-Cookie" in _c_this.headers) {
				var val = _c_this.headers["Set-Cookie"];
				if ((typeof val == 'object' ? (Array.isArray(val) ? 'array' : 'map') : (typeof val == 'number' ? 'float' : typeof val)) == "array") {
					var valCast = val;
					valCast.push(cookie.bake());
					}else{
						var newVal = [];
						newVal.push(val);
						newVal.push(cookie.bake());
						_c_this.headers["Set-Cookie"] = newVal;
					}
				}else{
					_c_this.headers["Set-Cookie"] = cookie.bake();
				}
			}}

Websom.Cookie = function (name, value) {var _c_this = this;
	this.name = "";

	this.value = "";

	this.expires = "Session";

	this.sameSite = "";

	this.maxAge = 0;

	this.domain = "";

	this.path = "";

	this.secure = false;

	this.httpOnly = false;

		_c_this.name = name;
		_c_this.value = value;
}

Websom.Cookie.prototype.bake = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		var opts = "";
		if (_c_this.expires != "Session") {
			opts += "; Expires=" + _c_this.expires;
			}
		if (_c_this.maxAge != 0) {
			opts += "; Max-Age=" + _c_this.maxAge;
			}
		if (_c_this.domain != "") {
			opts += "; Domain=" + _c_this.domain;
			}
		if (_c_this.path != "") {
			opts += "; Path=" + _c_this.path;
			}
		if (_c_this.secure != false) {
			opts += "; Secure";
			}
		if (_c_this.httpOnly != false) {
			opts += "; HttpOnly";
			}
		if (_c_this.sameSite != "") {
			opts += "; SameSite=" + _c_this.sameSite;
			}
		return _c_this.name + "=" + _c_this.value + opts;}

Websom.Status = function () {var _c_this = this;
	this.notices = [];

	this.hadError = false;


}

Websom.Status.prototype.inherit = function (status) {var _c_this = this; var _c_root_method_arguments = arguments;
		if (status == null) {
			return null;
			}
		for (var i = 0; i < status.notices.length; i++) {
			_c_this.notices.push(status.notices[i]);
			}
		_c_this.hadError = status.hadError;}

Websom.Status.prototype.give = function () {var _c_this = this; var _c_root_method_arguments = arguments;
	if (arguments.length == 2 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'string' || typeof arguments[1] == 'undefined' || arguments[1] === null)) {
		var module = arguments[0];
		var message = arguments[1];
		var notice = new Websom.Notice(module, message);
		_c_this.notices.push(notice);
		return notice;
	}
else 	if (arguments.length == 3 && (typeof arguments[0] == 'number' || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'string' || typeof arguments[1] == 'undefined' || arguments[1] === null) && (typeof arguments[2] == 'string' || typeof arguments[2] == 'undefined' || arguments[2] === null)) {
		var level = arguments[0];
		var module = arguments[1];
		var message = arguments[2];
		var notice = new Websom.Notice(module, message);
		notice.level = level;
		_c_this.notices.push(notice);
		if (level == 4) {
			_c_this.hadError = true;
			}
		return notice;
	}
}

Websom.Status.prototype.display = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		if (_c_this.notices.length == 0) {
			return "Ok";
			}
		var out = "";
		if (_c_this.hadError) {
			out += ":Websom: :Error:\n";
			}
		for (var i = 0; i < _c_this.notices.length; i++) {
			out += _c_this.notices[i].display();
			}
		return out;}

Websom.Status.prototype.clear = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		for (var i = _c_this.notices.length - 1; i >= 0; i--) {
			_c_this.notices.pop();
			}}

Websom.Status.singleError = function (module, error) {var _c_this = this; var _c_root_method_arguments = arguments;
		var status = new Websom.Status();
		status.give(4, module, error);
		return status;}

Websom.Notice = function (module, message) {var _c_this = this;
	this.code = 0;

	this.module = "";

	this.message = "";

	this.line = 0;

	this.column = 0;

	this.offset = 0;

	this.level = 2;

		_c_this.module = module;
		_c_this.message = message;
}

Websom.Notice.prototype.display = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		return _c_this.module + ": " + _c_this.message;}

Websom.Theme = function (server, name, root, config) {var _c_this = this;
	this.server = null;

	this.name = "";

	this.key = "";

	this.root = "";

	this.config = null;

		_c_this.server = server;
		_c_this.name = name;
		_c_this.root = root;
		_c_this.config = config;
		if ("key" in _c_this.config) {
			_c_this.key = _c_this.config["key"];
			}
}

Websom.Theme.prototype.start = function () {var _c_this = this; var _c_root_method_arguments = arguments;
}

Websom.Theme.prototype.configure = function () {var _c_this = this; var _c_root_method_arguments = arguments;
}

Websom.Theme.prototype.prefix = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		if (_c_this.key.length > 0) {
			return "theme-" + _c_this.key;
			}
		return "theme";}

Websom.Theme.prototype.include = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		var dir = _c_this.server.config.clientResources + "/" + _c_this.prefix();
		return "<script src=\"" + dir + "/theme.js\"></script><link rel=\"stylesheet\" type=\"text/css\" href=\"" + dir + "/theme.css\"/>";}

Websom.Theme.prototype.write = function (js, css) {var _c_this = this; var _c_root_method_arguments = arguments;
		var dir = _c_this.server.config.resources + "/" + _c_this.prefix();
		if (Oxygen.FileSystem.exists(dir) == false) {
			Oxygen.FileSystem.makeDir(dir);
			}
		Oxygen.FileSystem.writeSync(dir + "/theme.js", js);
		Oxygen.FileSystem.writeSync(dir + "/theme.css", css);}

Websom.Theme.prototype.buildAndSave = function (callback) {var _c_this = this; var _c_root_method_arguments = arguments;
		var that = _c_this;
		_c_this.build(function (err, js, css) {
			that.write(js, css);
			callback(err);
			});}

Websom.Theme.prototype.build = function (callback) {var _c_this = this; var _c_root_method_arguments = arguments;
		var that = _c_this;
		var dones = 0;
		var css = "";
		var js = "";
		var err = "";
		var doneJs = function (hadError, results) {
			dones--;
			js += results;
			if (hadError) {
				err += results + "\n";
				}
			if (dones == 0) {
				callback(err, js, css);
				}
			};
		var doneCss = function (hadError, results) {
			dones--;
			css += results;
			if (hadError) {
				err += results + "\n\n";
				}
			if (dones == 0) {
				callback(err, js, css);
				}
			};
		var resources = _c_this.config["resources"];
		var outputs = _c_this.server.resource.compile("Theme." + _c_this.name, _c_this.root, resources);
		dones = outputs.length;
		for (var i = 0; i < outputs.length; i++) {
			var resource = outputs[i];
			if (resource.type == "javascript") {
				resource.build(doneJs);
				}else if (resource.type == "less") {
				resource.reference = Oxygen.FileSystem.resolve(Oxygen.FileSystem.dirName(_c_this.server.scriptPath) + "/../../theme/style/main.less");
				resource.build(doneCss);
				}else if (resource.type == "css") {
				resource.build(doneCss);
				}else if (resource.type == "view") {
				var view = new Websom.View(_c_this.server);
				var viewErr = view.loadFromFile(resource.file);
				if (viewErr != null) {
					err += viewErr.display() + "\n";
					}
				view.hasLocalExport = true;
				doneJs(false, view.buildDev());
				}else if (resource.isInvalid) {
				err += "Invalid resource: '" + resource.file + "'\n";
				dones--;
				if (i == outputs.length - 1) {
					if (dones == 0) {
						callback(err, js, css);
						}
					}
				}
			}}

Websom.View = function (server) {var _c_this = this;
	this.server = null;

	this.engine = "vue";

	this.type = 0;

	this.renderView = null;

	this.raw = null;

	this.shallow = false;

	this.renderViewData = null;

	this.handles = "";

	this.greedy = false;

	this.meta = null;

	this.template = "";

	this.serverHandles = null;

	this.client = "";

	this.location = "";

	this.owner = null;

	this.websiteView = false;

	this.hasServerScript = false;

	this.phpScript = "";

	this.jsScript = "";

	this.carbonScript = "";

	this.hasLocalExport = false;

	this.isPage = false;

	this.name = "";

		_c_this.server = server;
}

Websom.View.prototype.render = function (ctx) {var _c_this = this; var _c_root_method_arguments = arguments;
		return _c_this.server.render.renderView(_c_this, ctx);}

Websom.View.prototype.quickParse = function (raw) {var _c_this = this; var _c_root_method_arguments = arguments;
}

Websom.View.prototype.parse = function (raw) {var _c_this = this; var _c_root_method_arguments = arguments;
		_c_this.shallow = false;
		var open = false;
		var opens = 0;
		var name = "";
		var block = "";
		var openChar = "{";
		var closeChar = "}";
		var escape = false;
		var blocks = {};
		for (var i = 0; i < raw.length; i++) {
			var char = raw[i];
			if (open == false) {
				if (char != "	" && char != openChar && char != "\n" && char != "\r") {
					name += char;
					}else if (char == openChar) {
					open = true;
					}
				}else{
					if (char == closeChar) {
						if (opens == 0) {
							name = name.trim();
							blocks[name] = block;
							open = false;
							name = "";
							block = "";
							}else{
								opens--;
								block += char;
							}
						}else if (char == openChar) {
						opens++;
						block += char;
						}else{
							block += char;
						}
				}
			}
		return blocks;}

Websom.View.prototype.loadFromFile = function (location) {var _c_this = this; var _c_root_method_arguments = arguments;
		_c_this.location = location;
		var raw = Oxygen.FileSystem.readSync(location, "utf8");
		var output = _c_this.parse(raw);
		_c_this.raw = output;
		if ("info" in output) {
			_c_this.meta = Websom.Json.parse("{" + output["info"] + "}");
			if ("name" in _c_this.meta) {
				_c_this.name = _c_this.meta["name"];
				}else{
					return Websom.Status.singleError("View", "No name provided in view: '" + location + "'");
				}
			if ("handles" in _c_this.meta) {
				_c_this.handles = _c_this.meta["handles"];
				}
			if ("greedy" in _c_this.meta) {
				_c_this.greedy = _c_this.meta["greedy"];
				}
			}else{
				return Websom.Status.singleError("View", "No info provided in view: '" + location + "'");
			}
		if ("template" in output) {
			_c_this.template = output["template"];
			}
		if ("client" in output) {
			_c_this.client = output["client"];
			}
		if ("server php" in output) {
			_c_this.hasServerScript = true;
			_c_this.phpScript = output["server php"];
			}
		
			if ("server js" in output) {
				this.hasServerScript = true;
				this.jsScript = eval("function (view, server, request) {" + output["server js"] + "}");
			}
		
		if ("server carbon" in output) {
			_c_this.hasServerScript = true;
			if (_c_this.server.config.dev) {
				
					var script = this.buildScript("javascript.source.memory", "WebsomPageScript" + this.name, "class WebsomPageScript" + this.name + " {fixed map run(Websom.View view, Websom.Server server, Websom.Request request) {" + output["server carbon"] + "}}");
					require("fs").writeFileSync(this.server.config.root + "/pages/scripts_" + this.name + ".js", script + "module.exports = WebsomPageScript" + this.name + ".run;");
					
					var phpScript = this.buildScript("php.source.memory", "WebsomPageScript" + this.name, "class WebsomPageScript" + this.name + " {fixed map run(Websom.View view, Websom.Server server, Websom.Request request) {" + output["server carbon"] + "}}");
					require("fs").writeFileSync(this.server.config.root + "/pages/scripts_" + this.name + ".php", phpScript + "<?php return function ($view, $server, $request) {return WebsomPageScript" + this.name + "::run($view, $server, $request);} ?>");
				
				}
			}}

Websom.View.prototype.runServerScript = function (req) {var _c_this = this; var _c_root_method_arguments = arguments;
		if (_c_this.jsScript.length > 0) {
			
				return this.jsScript(this, this.server, req);
			
			}else if (_c_this.hasServerScript) {
			
				return require(this.server.config.root + "/pages/scripts_" + this.name + ".js")(this, this.server, req);
			
			
			}
		}

Websom.View.prototype.buildDev = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		var opts = "props: ['data'], ";
		if (_c_this.client.length > 0) {
			opts = _c_this.client + ", ";
			}
		return "if (!('" + _c_this.name + "' in Websom.views.loaded)) {Websom.views.loaded['" + _c_this.name + "'] = Vue.component('" + _c_this.name + "', {" + opts + "template: `" + _c_this.template.replace(new RegExp("`".replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&'), 'g'), "\\`") + "`});}";}

Websom.View.prototype.buildScript = function (platform, name, raw) {var _c_this = this; var _c_root_method_arguments = arguments;
return require('../../core/util/native/carbonite.js').buildScript(arguments[0], arguments[1], arguments[2])}

Websom.View.prototype.buildRenderView = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		if (_c_this.shallow) {
			_c_this.renderView = new Websom.Render.View(_c_this);
			_c_this.renderView.deserialize(_c_this.renderViewData);
			}else{
				_c_this.renderView = new Websom.Render.View(_c_this);
				_c_this.renderView.parse();
			}}

Websom.View.prototype.serialize = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		var mp = {};
		if (_c_this.renderView == null) {
			_c_this.buildRenderView();
			}
		mp["render"] = _c_this.renderView.serialize();
		mp["meta"] = _c_this.meta;
		return mp;}

Websom.View.prototype.deserialize = function (data) {var _c_this = this; var _c_root_method_arguments = arguments;
		_c_this.meta = data["meta"];
		_c_this.name = _c_this.meta["name"];
		if ("handles" in _c_this.meta) {
			_c_this.handles = _c_this.meta["handles"];
			}
		if ("greedy" in _c_this.meta) {
			_c_this.greedy = _c_this.meta["greedy"];
			}
		_c_this.renderViewData = data["render"];}

Websom.Render.Context = function () {var _c_this = this;
	this.data = null;

	this.props = null;

	this.slotContext = null;

	this.slot = null;

		_c_this.data = {};
		_c_this.props = {};
}

Websom.Render.Context.prototype.find = function (key) {var _c_this = this; var _c_root_method_arguments = arguments;
		var splits = key.split(".");
		var root = null;
		if (splits[0] in _c_this.data) {
			root = _c_this.data[splits[0]];
			}else if (splits[0] in _c_this.props) {
			root = _c_this.props[splits[0]];
			}
		if (root == null) {
			return "Unknown variable " + key;
			}
		if (splits.length == 1) {
			return root;
			}else{
				splits.shift();
				return _c_this.findRooted(root, splits);
			}}

Websom.Render.Context.prototype.findRooted = function (base, splits) {var _c_this = this; var _c_root_method_arguments = arguments;
		if (splits.length == 1) {
			return base[splits[0]];
			}else{
				splits.shift();
				return _c_this.findRooted(base, splits);
			}}

Websom.Render.Element = function (server, name) {var _c_this = this;
	this.name = "";

	this.attributes = null;

	this.children = null;

	this.isText = false;

		_c_this.name = name;
		_c_this.children = [];
		_c_this.attributes = {};
}

Websom.Render.Element.prototype.render = function (ctx) {var _c_this = this; var _c_root_method_arguments = arguments;
		if (_c_this.name == "slot") {
			var children = "";
			if (ctx.slot != null) {
				for (var i = 0; i < ctx.slot.length; i++) {
					children += ctx.slot[i].render(ctx.slotContext);
					}
				}
			return children;
			}
		var children = "";
		for (var i = 0; i < _c_this.children.length; i++) {
			children += _c_this.children[i].render(ctx);
			}
		var attrs = "";
		for (var key in _c_this.attributes) {
			if (key[0] == ":") {
				attrs += " " + key + "=\"" + ctx.find(_c_this.attributes[key]) + "\"";
				}else{
					attrs += " " + key + "=\"" + _c_this.attributes[key] + "\"";
				}
			}
		return "<" + _c_this.name + attrs + ">" + children + "</" + _c_this.name + ">";}

Websom.Render.Element.parse = function (server, html) {var _c_this = this; var _c_root_method_arguments = arguments;
		
			let content = require("cheerio").load(html);
			return this.makeFromObj(server, content.root()[0].children[0].children[1].children[0]);
		
		}

Websom.Render.Element.makeFromObj = function (server, arg) {var _c_this = this; var _c_root_method_arguments = arguments;
		var isText = false;
		var textContent = "";
		
			if (arg.type == "text") {
				isText = true;
				textContent = arg.data;
			}
		
		
		if (isText) {
			return new Websom.Render.Text(textContent);
			}else{
				var nodeName = "";
				
				
				nodeName = arg.tagName;
			
				var elem = null;
				var renderView = server.render.findView(nodeName);
				if (renderView != null) {
					elem = new Websom.Render.ViewRef(server, renderView);
					}else{
						elem = new Websom.Render.Element(server, nodeName);
					}
				var children = [];
				
				
				elem.attributes = arg.attribs;
				children = arg.childNodes;
			
				for (var i = 0; i < children.length; i++) {
					
					
					if (children[i].type == "comment")
						continue;
				
					elem.children.push(Websom.Render.Element.makeFromObj(server, children[i]));
					}
				return elem;
			}}

Websom.Render.Element.prototype.serialize = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		return _c_this.basicSerialize();}

Websom.Render.Element.prototype.deserializeChildren = function (server, children) {var _c_this = this; var _c_root_method_arguments = arguments;
		_c_this.children = [];
		for (var i = 0; i < children.length; i++) {
			var child = children[i];
			_c_this.children.push(Websom.Render.Node.deserialize(server, child));
			}}

Websom.Render.Element.prototype.basicSerialize = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		var mp = {};
		mp["t"] = "e";
		mp["n"] = _c_this.name;
		var children = [];
		for (var i = 0; i < _c_this.children.length; i++) {
			var child = _c_this.children[i];
			children.push(child.serialize());
			}
		mp["c"] = children;
		mp["a"] = _c_this.attributes;
		return mp;}

Websom.Render.Element.deserialize = function (server, data) {var _c_this = this; var _c_root_method_arguments = arguments;
		var type = data["t"];
		if (type == "e") {
			var e = new Websom.Render.Element(server, data["n"]);
			e.deserializeChildren(server, data["c"]);
			e.attributes = data["a"];
			return e;
			}else if (type == "t") {
			var t = new Websom.Render.Text(data["c"]);
			return t;
			}else if (type == "r") {
			var e = new Websom.Render.ViewRef(server, server.render.findView(data["n"]));
			e.deserializeChildren(server, data["c"]);
			e.attributes = data["a"];
			return e;
			}
		return null;}

Websom.Render.Node = function () {var _c_this = this;
	this.isText = false;


}

Websom.Render.Node.prototype.render = function (ctx) {var _c_this = this; var _c_root_method_arguments = arguments;
}

Websom.Render.Node.deserialize = function (server, data) {var _c_this = this; var _c_root_method_arguments = arguments;
		var type = data["t"];
		if (type == "e") {
			var e = new Websom.Render.Element(server, data["n"]);
			e.deserializeChildren(server, data["c"]);
			e.attributes = data["a"];
			return e;
			}else if (type == "t") {
			var t = new Websom.Render.Text(data["c"]);
			return t;
			}else if (type == "r") {
			var e = new Websom.Render.ViewRef(server, server.render.findView(data["n"]));
			e.deserializeChildren(server, data["c"]);
			e.attributes = data["a"];
			return e;
			}
		return null;}

Websom.Render.ViewRef = function (server, view) {var _c_this = this;
	this.view = null;

	this.name = "";

	this.attributes = null;

	this.children = null;

	this.isText = false;

		_c_this.view = view;
		_c_this.children = [];
		_c_this.attributes = {};
}

Websom.Render.ViewRef.prototype.render = function (ctx) {var _c_this = this; var _c_root_method_arguments = arguments;
		var newCtx = new Websom.Render.Context();
		newCtx.slot = _c_this.children;
		newCtx.slotContext = ctx;
		for (var key in _c_this.attributes) {
			if (key[0] == ":") {
				newCtx.props[key.substr(1,key.length - 1)] = ctx.find(_c_this.attributes[key]);
				}else{
					newCtx.props[key] = ctx.find(_c_this.attributes[key]);
				}
			}
		return _c_this.view.render(newCtx);}

Websom.Render.ViewRef.prototype.serialize = function () {var _c_this = this; var _c_root_method_arguments = arguments;
	if (arguments.length == 0) {
		var mp = _c_this.basicSerialize();
		mp["t"] = "r";
		return mp;
	}
else 	if (arguments.length == 0) {
		return _c_this.basicSerialize();
	}
}

Websom.Render.ViewRef.parse = function (server, html) {var _c_this = this; var _c_root_method_arguments = arguments;
		
			let content = require("cheerio").load(html);
			return this.makeFromObj(server, content.root()[0].children[0].children[1].children[0]);
		
		}

Websom.Render.ViewRef.makeFromObj = function (server, arg) {var _c_this = this; var _c_root_method_arguments = arguments;
		var isText = false;
		var textContent = "";
		
			if (arg.type == "text") {
				isText = true;
				textContent = arg.data;
			}
		
		
		if (isText) {
			return new Websom.Render.Text(textContent);
			}else{
				var nodeName = "";
				
				
				nodeName = arg.tagName;
			
				var elem = null;
				var renderView = server.render.findView(nodeName);
				if (renderView != null) {
					elem = new Websom.Render.ViewRef(server, renderView);
					}else{
						elem = new Websom.Render.Element(server, nodeName);
					}
				var children = [];
				
				
				elem.attributes = arg.attribs;
				children = arg.childNodes;
			
				for (var i = 0; i < children.length; i++) {
					
					
					if (children[i].type == "comment")
						continue;
				
					elem.children.push(Websom.Render.Element.makeFromObj(server, children[i]));
					}
				return elem;
			}}

Websom.Render.ViewRef.prototype.deserializeChildren = function (server, children) {var _c_this = this; var _c_root_method_arguments = arguments;
		_c_this.children = [];
		for (var i = 0; i < children.length; i++) {
			var child = children[i];
			_c_this.children.push(Websom.Render.Node.deserialize(server, child));
			}}

Websom.Render.ViewRef.prototype.basicSerialize = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		var mp = {};
		mp["t"] = "e";
		mp["n"] = _c_this.name;
		var children = [];
		for (var i = 0; i < _c_this.children.length; i++) {
			var child = _c_this.children[i];
			children.push(child.serialize());
			}
		mp["c"] = children;
		mp["a"] = _c_this.attributes;
		return mp;}

Websom.Render.ViewRef.deserialize = function (server, data) {var _c_this = this; var _c_root_method_arguments = arguments;
		var type = data["t"];
		if (type == "e") {
			var e = new Websom.Render.Element(server, data["n"]);
			e.deserializeChildren(server, data["c"]);
			e.attributes = data["a"];
			return e;
			}else if (type == "t") {
			var t = new Websom.Render.Text(data["c"]);
			return t;
			}else if (type == "r") {
			var e = new Websom.Render.ViewRef(server, server.render.findView(data["n"]));
			e.deserializeChildren(server, data["c"]);
			e.attributes = data["a"];
			return e;
			}
		return null;}

Websom.Render.Text = function (text) {var _c_this = this;
	this.text = "";

	this.isText = false;

		_c_this.isText = true;
		_c_this.text = text;
}

Websom.Render.Text.prototype.render = function (ctx) {var _c_this = this; var _c_root_method_arguments = arguments;
		var str = _c_this.text;
		
		
			str = str.replace(new RegExp("{{([^}]*)}}", "gm"), function (match, name) {
				return ctx.find(name);
			});
		
		return str;}

Websom.Render.Text.prototype.serialize = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		var mp = {};
		mp["t"] = "t";
		mp["c"] = _c_this.text;
		return mp;}

Websom.Render.Text.deserialize = function (server, data) {var _c_this = this; var _c_root_method_arguments = arguments;
		var type = data["t"];
		if (type == "e") {
			var e = new Websom.Render.Element(server, data["n"]);
			e.deserializeChildren(server, data["c"]);
			e.attributes = data["a"];
			return e;
			}else if (type == "t") {
			var t = new Websom.Render.Text(data["c"]);
			return t;
			}else if (type == "r") {
			var e = new Websom.Render.ViewRef(server, server.render.findView(data["n"]));
			e.deserializeChildren(server, data["c"]);
			e.attributes = data["a"];
			return e;
			}
		return null;}

Websom.Render.View = function (view) {var _c_this = this;
	this.view = null;

	this.root = null;

		_c_this.view = view;
}

Websom.Render.View.prototype.parse = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		_c_this.root = Websom.Render.Element.parse(_c_this.view.server, _c_this.view.template);}

Websom.Render.View.prototype.render = function (ctx) {var _c_this = this; var _c_root_method_arguments = arguments;
		return _c_this.root.render(ctx);}

Websom.Render.View.prototype.serialize = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		return _c_this.root.serialize();}

Websom.Render.View.prototype.deserialize = function (data) {var _c_this = this; var _c_root_method_arguments = arguments;
		_c_this.root = new Websom.Render.Element(_c_this.view.server, data["n"]);
		_c_this.root.deserialize(_c_this.view.server, data);}

Websom.Controls.AddTo = function () {var _c_this = this;
	this.fieldName = "";

	this.listFieldName = "";

	this.collection = null;

	this.item = null;

	this.check = null;

	this.server = null;

	this.container = null;

	if (arguments.length == 5 && ((arguments[0] instanceof Websom.Containers.Table) || typeof arguments[0] == 'undefined' || arguments[0] === null) && ((arguments[1] instanceof Websom.Containers.Table) || typeof arguments[1] == 'undefined' || arguments[1] === null) && (typeof arguments[2] == 'string' || typeof arguments[2] == 'undefined' || arguments[2] === null) && (typeof arguments[3] == 'string' || typeof arguments[3] == 'undefined' || arguments[3] === null) && (typeof arguments[4] == 'function' || typeof arguments[4] == 'undefined' || arguments[4] === null)) {
		var collection = arguments[0];
		var item = arguments[1];
		var listFieldName = arguments[2];
		var fieldName = arguments[3];
		var check = arguments[4];
		_c_this.collection = collection;
		_c_this.item = item;
		_c_this.listFieldName = listFieldName;
		_c_this.check = check;
		_c_this.fieldName = fieldName;
	}
else 	if (arguments.length == 4 && ((arguments[0] instanceof Websom.Containers.Table) || typeof arguments[0] == 'undefined' || arguments[0] === null) && ((arguments[1] instanceof Websom.Containers.Table) || typeof arguments[1] == 'undefined' || arguments[1] === null) && (typeof arguments[2] == 'string' || typeof arguments[2] == 'undefined' || arguments[2] === null) && (typeof arguments[3] == 'string' || typeof arguments[3] == 'undefined' || arguments[3] === null)) {
		var collection = arguments[0];
		var item = arguments[1];
		var listFieldName = arguments[2];
		var fieldName = arguments[3];
		_c_this.collection = collection;
		_c_this.item = item;
		_c_this.listFieldName = listFieldName;
		_c_this.fieldName = fieldName;
	}

}

Websom.Controls.AddTo.prototype.message = function (inp, name, data, send) {var _c_this = this; var _c_root_method_arguments = arguments;
		send(null);}

Websom.Controls.AddTo.prototype.addTo = function (collection, item) {var _c_this = this; var _c_root_method_arguments = arguments;
		var that = _c_this;
		var list = collection.getFieldContainer(_c_this.listFieldName);
		var itemId = item.getField("id");
		var select = list.from().where("parentId").equals(collection.getField("id")).and().where(_c_this.fieldName).equals(itemId);
		select.run(function (err, datas) {
			if (err == null) {
				if (datas.length > 0) {
					select.delete().run(function (delErr, delData) {

						});
					}else{
						var curId = collection.getField(that.listFieldName);
						list.into().set("arrayIndex", curId + 1).set(that.fieldName, itemId).set("parentId", collection.getField("id")).run(function (addErr, newId) {

							});
						var containerCast = collection.websomContainer;
						containerCast.from().where("id").equals(collection.getField("id")).set(that.listFieldName, curId + 1).update().run(function (upErr, upData) {

							});
					}
				}
			});}

Websom.Controls.AddTo.prototype.use = function (ic) {var _c_this = this; var _c_root_method_arguments = arguments;
		var that = _c_this;
		ic.key("collection").is(_c_this.collection).key("item").is(_c_this.item).success(function (input, data) {
			if (that.check != null) {
				that.check(input.request, data["collection"], data["item"], function (shouldContinue) {
if (shouldContinue) {
	var collection = data["collection"];
	var item = data["item"];
	that.addTo(collection, item);
	}else{
		input.sendError("Invalid input");
	}
});
				}else{
					var collection = data["collection"];
					var item = data["item"];
					that.addTo(collection, item);
				}
			});}

Websom.Controls.AddTo.prototype.validate = function (input, done) {var _c_this = this; var _c_root_method_arguments = arguments;
		done(null);}

Websom.Controls.AddTo.prototype.fill = function (input, values, done) {var _c_this = this; var _c_root_method_arguments = arguments;
		done();}

Websom.Controls.AddTo.prototype.filter = function (input, select, done) {var _c_this = this; var _c_root_method_arguments = arguments;
		done(null);}

Websom.Controls.AddTo.prototype.insert = function (input, data, key) {var _c_this = this; var _c_root_method_arguments = arguments;
}

Websom.Controls.AddTo.prototype.update = function (input, data) {var _c_this = this; var _c_root_method_arguments = arguments;
}

Websom.Controls.File = function (keyName, maxSize, validate, success) {var _c_this = this;
	this.keyName = "";

	this.maxSize = 0;

	this.validateHook = null;

	this.successHook = null;

	this.server = null;

	this.container = null;

		_c_this.keyName = keyName;
		_c_this.maxSize = maxSize;
		_c_this.validateHook = validate;
		_c_this.successHook = success;
}

Websom.Controls.File.prototype.validate = function (input, done) {var _c_this = this; var _c_root_method_arguments = arguments;
		if ((_c_this.keyName in input.files)) {
			for (var i = 0; i < input.files[_c_this.keyName].length; i++) {
				var file = input.files[_c_this.keyName];
				if (file.size > _c_this.maxSize) {
					done(new Websom.InputValidation(true, "File exceeds limit of " + (_c_this.maxSize / 1024) + "kb"));
					return null;
					}
				}
			_c_this.validateHook(input, input.files[_c_this.keyName], function (validation) {
if (validation != null && validation.hadError) {
	done(validation);
	}else{
		done(new Websom.InputValidation(false, ""));
	}
});
			}else{
				done(new Websom.InputValidation(true, "No file for field " + _c_this.keyName));
			}}

Websom.Controls.File.prototype.fill = function (input, raw, done) {var _c_this = this; var _c_root_method_arguments = arguments;
		done();}

Websom.Controls.File.prototype.insert = function (input, data, key) {var _c_this = this; var _c_root_method_arguments = arguments;
		_c_this.successHook(true, input, data, input.files[_c_this.keyName]);}

Websom.Controls.File.prototype.update = function (input, data) {var _c_this = this; var _c_root_method_arguments = arguments;
		_c_this.successHook(false, input, data, input.files[_c_this.keyName]);}

Websom.Controls.File.prototype.filter = function (input, select, done) {var _c_this = this; var _c_root_method_arguments = arguments;
		done(new Websom.InputValidation(false, ""));}

Websom.Controls.File.prototype.message = function (input, name, data, send) {var _c_this = this; var _c_root_method_arguments = arguments;
		send(null);}

Websom.Controls.File.prototype.use = function (inputChain) {var _c_this = this; var _c_root_method_arguments = arguments;
}

Websom.Controls.Unique = function () {var _c_this = this;
	this.required = false;

	this.name = "";

	this.field = "";

	this.logic = "or";

	this.fieldInfo = null;

	this.server = null;

	this.container = null;

	if (arguments.length == 1 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var field = arguments[0];
		_c_this.name = field;
		_c_this.field = field;
	}
else 	if (arguments.length == 2 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'string' || typeof arguments[1] == 'undefined' || arguments[1] === null)) {
		var field = arguments[0];
		var logic = arguments[1];
		_c_this.name = field;
		_c_this.field = field;
		_c_this.logic = logic;
	}
else 	if (arguments.length == 3 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'string' || typeof arguments[1] == 'undefined' || arguments[1] === null) && ((arguments[2] instanceof Websom.FieldInfo) || typeof arguments[2] == 'undefined' || arguments[2] === null)) {
		var name = arguments[0];
		var field = arguments[1];
		var fieldInfo = arguments[2];
		_c_this.name = name;
		_c_this.field = field;
		_c_this.fieldInfo = fieldInfo;
	}

}

Websom.Controls.Unique.prototype.validateField = function (input, value, done) {var _c_this = this; var _c_root_method_arguments = arguments;
		var that = _c_this;
		var container = _c_this.container;
		container.from().where(_c_this.field).equals(value).run(function (err, docs) {
			if (err != null) {
				done(new Websom.InputValidation(true, "Unable to complete request"));
				}else{
					if (docs.length > 0) {
						done(new Websom.InputValidation(true, "The " + that.field + " must be unique"));
						}else{
							done(null);
						}
				}
			});}

Websom.Controls.Unique.prototype.validate = function (input, done) {var _c_this = this; var _c_root_method_arguments = arguments;
		if (_c_this.name in input.raw) {
			_c_this.validateField(input, input.raw[_c_this.name], done);
			}else if (_c_this.required) {
			done(new Websom.InputValidation(true, "Missing field " + _c_this.name));
			}else{
				done(new Websom.InputValidation(false, ""));
			}}

Websom.Controls.Unique.prototype.fill = function (input, values, done) {var _c_this = this; var _c_root_method_arguments = arguments;
		_c_this.fillField(input.raw[_c_this.name], values);
		done();}

Websom.Controls.Unique.prototype.filter = function (input, select, done) {var _c_this = this; var _c_root_method_arguments = arguments;
		if (_c_this.name in input.raw) {
			if (_c_this.logic == "and") {
				select.and();
				}else{
					select.or();
				}
			var val = _c_this.filterField(input.raw[_c_this.name], select, done);
			}else if (_c_this.required) {
			done(new Websom.InputValidation(true, "Missing field " + _c_this.name));
			}else{
				done(null);
			}}

Websom.Controls.Unique.prototype.fillField = function (value, values) {var _c_this = this; var _c_root_method_arguments = arguments;
}

Websom.Controls.Unique.prototype.filterField = function (value, select, done) {var _c_this = this; var _c_root_method_arguments = arguments;
}

Websom.Controls.Unique.prototype.insert = function (input, data, key) {var _c_this = this; var _c_root_method_arguments = arguments;
}

Websom.Controls.Unique.prototype.update = function (input, data) {var _c_this = this; var _c_root_method_arguments = arguments;
}

Websom.Controls.Unique.prototype.message = function (input, name, data, send) {var _c_this = this; var _c_root_method_arguments = arguments;
		send(null);}

Websom.Controls.Unique.prototype.use = function (inputChain) {var _c_this = this; var _c_root_method_arguments = arguments;
}

Websom.Ini = function () {var _c_this = this;


}

Websom.Json = function () {var _c_this = this;


}

Websom.Json.parse = function (input) {var _c_this = this; var _c_root_method_arguments = arguments;
		
		
			return JSON.parse(input);
		}

Websom.Json.encode = function (input) {var _c_this = this; var _c_root_method_arguments = arguments;
		
		
			return JSON.stringify(input);
		}

Websom.OAuth = function () {var _c_this = this;


}

Websom.OAuth.Response = function (errorMessage, data) {var _c_this = this;
	this.failed = false;

	this.errorMessage = "";

	this.data = null;

		_c_this.data = data;
		if (_c_this.errorMessage != null || errorMessage.length != 0) {
			_c_this.failed = true;
			}
		_c_this.errorMessage = errorMessage;
}

Websom.OAuth.Client = function (tokenUrl, clientId, pass) {var _c_this = this;
	this.clientId = "";

	this.pass = "";

	this.token = "";

	this.tokenUrl = "";

	this.expiration = -1;

	this.grantType = "client_credentials";

	this.stored = false;

	this.storeExpired = true;

		_c_this.clientId = clientId;
		_c_this.tokenUrl = tokenUrl;
		_c_this.pass = pass;
}

Websom.OAuth.Client.prototype.store = function (filename) {var _c_this = this; var _c_root_method_arguments = arguments;
		_c_this.stored = true;
		if (Oxygen.FileSystem.exists(filename)) {
			var raw = Websom.Json.parse(Oxygen.FileSystem.readSync(filename, "utf8"));
			var cast = raw["expires"];
			if (Websom.Time.now() > cast) {
				_c_this.storeExpired = true;
				}else{
					_c_this.storeExpired = false;
					_c_this.token = raw["token"];
				}
			}}

Websom.OAuth.Client.prototype.post = function (url, data, callback) {var _c_this = this; var _c_root_method_arguments = arguments;
		}

Websom.Path = function () {var _c_this = this;


}

Websom.Path.relativePath = function (from, to) {var _c_this = this; var _c_root_method_arguments = arguments;
		
		
			return require("path").relative(from, to);
		}

Websom.PHP = function () {var _c_this = this;


}

Websom.PHP.load = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		}

Websom.Http = function () {var _c_this = this;


}

Websom.Http.postJson = function (server, url, data, callback) {var _c_this = this; var _c_root_method_arguments = arguments;
		
			const request = require('request');                         

			request.post(url, data, (err, res) => {
				if (err)
					console.log(err);
				else
					callback(res.body);
			});
		
		}

Websom.Http.get = function (url, data, callback) {var _c_this = this; var _c_root_method_arguments = arguments;
}

Websom.Result = function (error, data) {var _c_this = this;
	this.error = "";

	this.hadError = false;

	this.status = 200;

	this.data = null;

		_c_this.error = error;
		if (error != null && error.length > 0) {
			_c_this.hadError = true;
			}
		_c_this.data = data;
}

Websom.RequestChain = function (server, url) {var _c_this = this;
	this.server = null;

	this.url = "";

	this.urlencode = false;

	this.jsonencode = false;

	this.data = {};

	this.doAuth = false;

	this.user = null;

	this.pass = null;

	this.bearer = null;

	this.doParse = false;

	this._headers = {};

		_c_this.server = server;
		_c_this.url = url;
}

Websom.RequestChain.prototype.auth = function () {var _c_this = this; var _c_root_method_arguments = arguments;
	if (arguments.length == 2 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'string' || typeof arguments[1] == 'undefined' || arguments[1] === null)) {
		var user = arguments[0];
		var pass = arguments[1];
		_c_this.doAuth = true;
		_c_this.user = user;
		_c_this.pass = pass;
		return _c_this;
	}
else 	if (arguments.length == 1 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var bearer = arguments[0];
		_c_this.doAuth = true;
		_c_this.bearer = bearer;
		return _c_this;
	}
}

Websom.RequestChain.prototype.parseJson = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		_c_this.doParse = true;
		return _c_this;}

Websom.RequestChain.prototype.json = function (data) {var _c_this = this; var _c_root_method_arguments = arguments;
		_c_this.jsonencode = true;
		_c_this.data = data;}

Websom.RequestChain.prototype.form = function () {var _c_this = this; var _c_root_method_arguments = arguments;
	if (arguments.length == 1 && (typeof arguments[0] == 'object' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var data = arguments[0];
		_c_this.urlencode = true;
		_c_this.data = data;
		return _c_this;
	}
else 	if (arguments.length == 2 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null) && ((arguments[1] instanceof Array || typeof arguments[1] == 'boolean' || typeof arguments[1] == 'string' || typeof arguments[1] == 'number' || typeof arguments[1] == 'number' || typeof arguments[1] == 'object' || typeof arguments[1] == 'string') || typeof arguments[1] == 'undefined' || arguments[1] === null)) {
		var key = arguments[0];
		var value = arguments[1];
		_c_this.urlencode = true;
		_c_this.data[key] = value;
		return _c_this;
	}
}

Websom.RequestChain.prototype.header = function (key, value) {var _c_this = this; var _c_root_method_arguments = arguments;
		_c_this._headers[key] = value;
		return _c_this;}

Websom.RequestChain.prototype.headers = function (headers) {var _c_this = this; var _c_root_method_arguments = arguments;
		_c_this._headers = headers;
		return _c_this;}

Websom.RequestChain.prototype.execute = function () {var _c_this = this; var _c_root_method_arguments = arguments;
	if (arguments.length == 1 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null)) { 		var method = arguments[0];

return new Promise((_c_resolve, _c_reject) => {		
			this.makeRequest(method, (res) => {
				_c_resolve(res); return;
			});
		
		
 }); }
}

Websom.RequestChain.prototype.phpRequest = function (method) {var _c_this = this; var _c_root_method_arguments = arguments;
		}

Websom.RequestChain.prototype.makeRequest = function (method, callback) {var _c_this = this; var _c_root_method_arguments = arguments;
		
		
			const request = require("request");
			let data = {};

			data.method = method;

			if (this.urlencode) {
				data.form = this.data;
			}else{
				data.body = this.data;
				data.json = true;
			}

			data.headers = this._headers;
			data.url = this.url;

			if (this.doAuth) {
				if (this.bearer == null) {
					data.auth = {user: this.user, pass: this.pass};
				}else{
					data.headers["Authorization"] = "Bearer " + this.bearer;
				}
			}

			request(data, (err, res) => {
				let body = res.body;

				if (this.doParse) {
					body = JSON.parse(body);
				}
				
				let wres = new Websom.Result(err, body);
				wres.status = res.statusCode;

				callback(wres);
			});
		}

Websom.RequestChain.prototype.delete = function (callback) {var _c_this = this; var _c_root_method_arguments = arguments;
		_c_this.makeRequest("DELETE", callback);
		return _c_this;}

Websom.RequestChain.prototype.put = function (callback) {var _c_this = this; var _c_root_method_arguments = arguments;
		_c_this.makeRequest("PUT", callback);
		return _c_this;}

Websom.RequestChain.prototype.get = function (callback) {var _c_this = this; var _c_root_method_arguments = arguments;
		_c_this.makeRequest("GET", callback);
		return _c_this;}

Websom.RequestChain.prototype.post = function (callback) {var _c_this = this; var _c_root_method_arguments = arguments;
		_c_this.makeRequest("POST", callback);
		return _c_this;}

Websom.Time = function () {var _c_this = this;
	this.timestamp = 0;

		_c_this.timestamp = Websom.Time.now();
}

Websom.Time.now = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		
		
			return Date.now();
		}

Websom.Time.year = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		
		
			return (new Date()).getFullYear();
		}

Websom.Databases.MySql = function (server) {var _c_this = this;
	this.connection = null;

	this.server = null;

	this.config = null;

	this.name = "";

	this.open = false;

	this.connecting = false;

	this.waits = [];

		_c_this.server = server;
}

Websom.Databases.MySql.prototype.connect = function (done) {var _c_this = this; var _c_root_method_arguments = arguments;
		var host = _c_this.config["host"];
		var database = _c_this.config["database"];
		var username = _c_this.config["auth"]["admin"]["username"];
		var password = _c_this.config["auth"]["admin"]["password"];
		_c_this.connecting = true;
		
		
			var mysql = require("mysql");

			this.connection = mysql.createConnection({
				host: host,
				database: database,
				user: username,
				password: password
			});

			this.connection.connect((err) => {
				if (err) {
					done(Websom.Status.singleError("Database.MySql", err));
					console.log("Error connecting to MySql database " + database);
				}else {
					this.open = true;
					this.connecting = false;
					done(null);
					this.connected();
					console.log("Connected to MySql database " + database);
				}
			});
		}

Websom.Databases.MySql.prototype.close = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		_c_this.open = false;
		
		
			this.connection.end();
		}

Websom.Databases.MySql.prototype.from = function (table) {var _c_this = this; var _c_root_method_arguments = arguments;
		return new Websom.MySqlDatabaseSelect(_c_this, table);}

Websom.Databases.MySql.prototype.into = function (table) {var _c_this = this; var _c_root_method_arguments = arguments;
		return new Websom.MySqlDatabaseInsert(_c_this, table);}

Websom.Databases.MySql.prototype.flagField = function (field, isAlter) {var _c_this = this; var _c_root_method_arguments = arguments;
		var sql = "";
		var last = " NOT NULL";
		var add = "ADD";
		if (isAlter == false) {
			add = "";
			}
		for (var i = 0; i < field.flags.length; i++) {
			var flag = field.flags[i];
			if (flag.type == "primary") {
				last += ", " + add + " PRIMARY KEY(`" + field.name + "`)";
				}else if (flag.type == "autoIncrement") {
				sql += " AUTO_INCREMENT";
				}else if (flag.type == "unsigned") {
				sql += " UNSIGNED";
				}
			}
		return sql + last;}

Websom.Databases.MySql.prototype.wFieldToMySql = function (field, isAlter) {var _c_this = this; var _c_root_method_arguments = arguments;
		var type = "";
		if (field.type.type == "varchar") {
			var cast = field.type;
			type = "VARCHAR(" + cast.length + ")";
			}else if (field.type.type == "text") {
			type = "TEXT";
			}else if (field.type.type == "int") {
			type = "INT";
			}else if (field.type.type == "bigInt") {
			type = "BIGINT";
			}else if (field.type.type == "float") {
			type = "DOUBLE";
			}else if (field.type.type == "bool") {
			type = "TINYINT(1)";
			}
		return type + _c_this.flagField(field, isAlter);}

Websom.Databases.MySql.prototype.runStructure = function (str, callback) {var _c_this = this; var _c_root_method_arguments = arguments;
		if (_c_this.open == false) {
			var that = _c_this;
			if (_c_this.connecting) {
				_c_this.wait(function () {
					that.runStructure(str, callback);
					});
				}else{
					_c_this.connect(function (status) {
						that.runStructure(str, callback);
						});
				}
			return null;
			}
		
			this.connection.query("DESCRIBE " + str.table, (err, cols, m) => {
				var cback = (cerr) => {
					if (cerr)
						callback(cerr.toString());
					else
						callback("");
				};
				if (err) {         
					var creates = [];
					for (var field of str.fields) {
						creates.push("`" + field.name + "` " + this.wFieldToMySql(field, false));
					}
					this.connection.query("CREATE TABLE " + str.table + " (" + creates.join(",") + ")", cback);
				}else{          
					var adds = [];
					function hasCol(name) {
						for (var col of cols) {
							if (col.Field == name)
								return true;
						}
						return false;
					}

					for (var i = 0; i < str.fields.length; i++)
						if (!hasCol(str.fields[i].name))
							adds.push("ADD `" + str.fields[i].name + "` " + this.wFieldToMySql(str.fields[i], true));

					this.connection.query("ALTER TABLE " + str.table + " " + adds.join(",") + ";", cback);
				}
			});
		
		}

Websom.Databases.MySql.make = function (server, type) {var _c_this = this; var _c_root_method_arguments = arguments;
		if (type == "mysql") {
			return new Websom.Databases.MySql(server);
			}}

Websom.Databases.MySql.prototype.wait = function (func) {var _c_this = this; var _c_root_method_arguments = arguments;
		_c_this.waits.push(func);}

Websom.Databases.MySql.prototype.load = function (config) {var _c_this = this; var _c_root_method_arguments = arguments;
		_c_this.config = config;
		_c_this.name = _c_this.config["name"];}

Websom.Databases.MySql.prototype.connected = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		for (var i = 0; i < _c_this.waits.length; i++) {
			_c_this.waits[i]();
			}}

Websom.Databases.MySql.prototype.structure = function (table) {var _c_this = this; var _c_root_method_arguments = arguments;
		return new Websom.DatabaseStructure(_c_this, table);}

Websom.MySqlDatabaseSelect = function (database, table) {var _c_this = this;
	this.currentWhere = "";

	this.notMode = false;

	this.query = [];

	this.multiQuery = [];

	this.values = [];

	this.table = "";

	this.workingField = "";

	this.fields = "*";

	this.limitAmount = 0;

	this.limitOffset = 0;

	this.orderField = "";

	this.orderWay = "";

	this.doUpdate = false;

	this.doDelete = false;

	this.groupLevel = 0;

	this.freshGroup = false;

	this.updates = [];

	this.database = null;

		_c_this.database = database;
		_c_this.table = table;
}

Websom.MySqlDatabaseSelect.prototype.field = function (fields) {var _c_this = this; var _c_root_method_arguments = arguments;
		_c_this.fields = fields;
		return _c_this;}

Websom.MySqlDatabaseSelect.prototype.new = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		var str = _c_this.build();
		_c_this.limitAmount = 0;
		_c_this.limitOffset = 0;
		_c_this.orderField = "";
		if (str.length > 0) {
			_c_this.multiQuery.push(str);
			}
		_c_this.query = [];
		return _c_this;}

Websom.MySqlDatabaseSelect.prototype.where = function (field) {var _c_this = this; var _c_root_method_arguments = arguments;
		if (_c_this.currentWhere.length > 0) {
			_c_this.query.push(_c_this.currentWhere);
			}
		_c_this.currentWhere = "";
		_c_this.workingField = field;
		return _c_this;}

Websom.MySqlDatabaseSelect.prototype.not = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		_c_this.notMode = true;
		return _c_this;}

Websom.MySqlDatabaseSelect.prototype.getNot = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		if (_c_this.notMode) {
			return "NOT";
			_c_this.notMode = false;
			}else{
				return "";
			}}

Websom.MySqlDatabaseSelect.prototype.in = function (values) {var _c_this = this; var _c_root_method_arguments = arguments;
		_c_this.freshGroup = false;
		_c_this.currentWhere += "`" + _c_this.workingField + "` " + _c_this.getNot() + " IN (";
		for (var i = 0; i < values.length; i++) {
			var value = values[i];
			_c_this.currentWhere += "?";
			if (i != values.length - 1) {
				_c_this.currentWhere += ", ";
				}
			_c_this.values.push(value);
			}
		_c_this.currentWhere += ")";
		return _c_this;}

Websom.MySqlDatabaseSelect.prototype.order = function (field, order) {var _c_this = this; var _c_root_method_arguments = arguments;
		_c_this.orderField = field;
		_c_this.orderWay = order;
		return _c_this;}

Websom.MySqlDatabaseSelect.prototype.build = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		if (_c_this.currentWhere.length > 0) {
			_c_this.query.push(_c_this.currentWhere);
			}
		_c_this.currentWhere = "";
		var whereState = "";
		var limit = "";
		if (_c_this.limitAmount != 0) {
			if (_c_this.limitOffset != 0) {
				limit = " LIMIT " + _c_this.limitOffset + ", " + _c_this.limitAmount;
				}else{
					limit = " LIMIT " + _c_this.limitAmount;
				}
			}
		var orderBy = "";
		if (_c_this.orderField.length > 0) {
			orderBy = " ORDER BY " + _c_this.orderField + " " + _c_this.orderWay;
			}
		var search = _c_this.trim(_c_this.query.join(""));
		if (_c_this.groupLevel > 0) {
			search += ")";
			}
		if (search.length > 0) {
			whereState = "WHERE " + search;
			}
		if (_c_this.doUpdate) {
			var sets = [];
			var shiftValues = [];
			for (var i = 0; i < _c_this.updates.length; i++) {
				var update = _c_this.updates[i];
				shiftValues.push(update.value);
				sets.push("`" + update.field + "` = ?");
				}
			_c_this.values = shiftValues.concat(_c_this.values);
			return "UPDATE " + _c_this.table + " SET " + sets.join(", ") + " " + whereState + orderBy + limit;
			}else if (_c_this.doDelete) {
			return "DELETE FROM " + _c_this.table + " " + whereState + orderBy + limit;
			}else{
				return "SELECT " + _c_this.fields + " FROM " + _c_this.table + " " + whereState + orderBy + limit;
			}}

Websom.MySqlDatabaseSelect.prototype.trim = function (query) {var _c_this = this; var _c_root_method_arguments = arguments;
		
		
			return query.replace(/^(AND|OR|\s)*|(AND|OR|\s)*$/g, "");
		}

Websom.MySqlDatabaseSelect.prototype.run = function (callback) {var _c_this = this; var _c_root_method_arguments = arguments;
		var query = "";
		if (_c_this.database.open == false) {
			var that = _c_this;
			if (_c_this.database.connecting) {
				_c_this.database.wait(function () {
					that.run(callback);
					});
				}else{
					_c_this.database.connect(function (status) {
						that.run(callback);
						});
				}
			return _c_this;
			}
		query = _c_this.build();
		if (_c_this.multiQuery.length > 0) {
			query = _c_this.multiQuery.join(";") + ";" + query;
			}
		
		
			this.database.connection.query(query, this.values, (err, res, meta) => {
				if (err)
					console.log("Error in database " + this.database.name + " with query '" + query + "'\n" + err);

				callback(err, res);
			});
		
		return _c_this;}

Websom.MySqlDatabaseSelect.prototype.or = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		if (_c_this.freshGroup == false) {
			if (_c_this.currentWhere.length > 0) {
				_c_this.currentWhere += " OR ";
				}
			}
		return _c_this;}

Websom.MySqlDatabaseSelect.prototype.and = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		if (_c_this.freshGroup == false) {
			if (_c_this.currentWhere.length > 0) {
				_c_this.currentWhere += " AND ";
				}
			}
		return _c_this;}

Websom.MySqlDatabaseSelect.prototype.group = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		_c_this.groupLevel++;
		_c_this.freshGroup = true;
		_c_this.currentWhere += "(";
		return _c_this;}

Websom.MySqlDatabaseSelect.prototype.endGroup = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		_c_this.groupLevel--;
		if (_c_this.freshGroup) {
			_c_this.currentWhere += "TRUE";
			_c_this.freshGroup = false;
			}
		if (_c_this.currentWhere.length > 0) {
			_c_this.currentWhere += ")";
			}
		return _c_this;}

Websom.MySqlDatabaseSelect.prototype.equals = function (value) {var _c_this = this; var _c_root_method_arguments = arguments;
		var nt = "";
		_c_this.freshGroup = false;
		if (_c_this.notMode) {
			nt = "!";
			_c_this.notMode = false;
			}
		_c_this.currentWhere += "`" + _c_this.workingField + "` " + nt + "= ?";
		_c_this.values.push(value);
		return _c_this;}

Websom.MySqlDatabaseSelect.prototype.like = function (value) {var _c_this = this; var _c_root_method_arguments = arguments;
		_c_this.freshGroup = false;
		_c_this.currentWhere += "`" + _c_this.workingField + "` " + _c_this.getNot() + " LIKE ?";
		_c_this.values.push(value);
		return _c_this;}

Websom.MySqlDatabaseSelect.prototype.wildLike = function (value) {var _c_this = this; var _c_root_method_arguments = arguments;
		_c_this.freshGroup = false;
		_c_this.currentWhere += "`" + _c_this.workingField + "` " + _c_this.getNot() + " LIKE ?";
		_c_this.values.push("%" + value.replace(new RegExp("%".replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&'), 'g'), "!%").replace(new RegExp("_".replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&'), 'g'), "!_").replace(new RegExp("\\[".replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&'), 'g'), "![") + "%");
		return _c_this;}

Websom.MySqlDatabaseSelect.prototype.greater = function (value) {var _c_this = this; var _c_root_method_arguments = arguments;
		_c_this.freshGroup = false;
		_c_this.currentWhere += _c_this.workingField + " > ?";
		_c_this.values.push(value);
		return _c_this;}

Websom.MySqlDatabaseSelect.prototype.lesser = function (value) {var _c_this = this; var _c_root_method_arguments = arguments;
		_c_this.freshGroup = false;
		_c_this.currentWhere += "`" + _c_this.workingField + "` < ?";
		_c_this.values.push(value);
		return _c_this;}

Websom.MySqlDatabaseSelect.prototype.set = function (field, value) {var _c_this = this; var _c_root_method_arguments = arguments;
		if ((typeof value == 'object' ? (Array.isArray(value) ? 'array' : 'map') : (typeof value == 'number' ? 'float' : typeof value)) == "boolean") {
			if (value == true) {
				value = 1;
				}else{
					value = 0;
				}
			}
		_c_this.updates.push(new Websom.DatabaseUpdate(field, value));
		return _c_this;}

Websom.MySqlDatabaseSelect.prototype.doesSet = function (field) {var _c_this = this; var _c_root_method_arguments = arguments;
		for (var i = 0; i < _c_this.updates.length; i++) {
			if (_c_this.updates[i].field == field) {
				return true;
				}
			}
		return false;}

Websom.MySqlDatabaseSelect.prototype.limit = function () {var _c_this = this; var _c_root_method_arguments = arguments;
	if (arguments.length == 1 && (typeof arguments[0] == 'number' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var documents = arguments[0];
		_c_this.limitAmount = documents;
		return _c_this;
	}
else 	if (arguments.length == 2 && (typeof arguments[0] == 'number' || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'number' || typeof arguments[1] == 'undefined' || arguments[1] === null)) {
		var offset = arguments[0];
		var documents = arguments[1];
		_c_this.limitAmount = documents;
		_c_this.limitOffset = offset;
		return _c_this;
	}
}

Websom.MySqlDatabaseSelect.prototype.update = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		_c_this.doUpdate = true;
		return _c_this;}

Websom.MySqlDatabaseSelect.prototype.delete = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		_c_this.doDelete = true;
		return _c_this;}

Websom.MySqlDatabaseInsert = function (database, table) {var _c_this = this;
	this.table = "";

	this.number = 1;

	this.isMulti = false;

	this.values = [];

	this.multiKeys = {};

	this.inserts = [];

	this.multiInserts = [];

	this.database = null;

		_c_this.database = database;
		_c_this.table = table;
}

Websom.MySqlDatabaseInsert.prototype.build = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		var sets = [];
		var shiftValues = [];
		var value = "";
		var values = [];
		if (_c_this.isMulti == false) {
			for (var i = 0; i < _c_this.inserts.length; i++) {
				var insert = _c_this.inserts[i];
				_c_this.values.push(insert.value);
				sets.push("`" + insert.field + "`");
				value += "?";
				if (i != _c_this.inserts.length - 1) {
					value += ", ";
					}
				}
			for (var i = 0; i < _c_this.number; i++) {
				values.push("(" + value + ")");
				}
			}else{
				for (var field in _c_this.multiKeys) {
					sets.push("`" + field + "`");
					}
				for (var mi = 0; mi < _c_this.multiInserts.length; mi++) {
					var curValue = "";
					for (var i = 0; i < _c_this.multiInserts[mi].length; i++) {
						var insert = _c_this.multiInserts[mi][i];
						_c_this.values.push(insert.value);
						curValue += "?";
						if (i != _c_this.multiInserts[mi].length - 1) {
							curValue += ", ";
							}
						}
					values.push("(" + curValue + ")");
					}
			}
		return "INSERT INTO " + _c_this.table + " (" + sets.join(", ") + ") VALUES " + values.join(", ");}

Websom.MySqlDatabaseInsert.prototype.run = function (callback) {var _c_this = this; var _c_root_method_arguments = arguments;
		var query = "";
		if (_c_this.database.open == false) {
			var that = _c_this;
			if (_c_this.database.connecting) {
				_c_this.database.wait(function () {
					that.run(callback);
					});
				}else{
					_c_this.database.connect(function (status) {
						that.run(callback);
						});
				}
			return _c_this;
			}
		query = _c_this.build();
		
		
			this.database.connection.query(query, this.values, (err, res, meta) => {
				if (err)
					console.log("Error in database " + this.database.name + " with query '" + query + "'\n" + err);
				
				callback(err, res.insertId || 0);
			});
		
		return _c_this;}

Websom.MySqlDatabaseInsert.prototype.new = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		_c_this.multiInserts.push([]);
		return _c_this;}

Websom.MySqlDatabaseInsert.prototype.get = function (field) {var _c_this = this; var _c_root_method_arguments = arguments;
		for (var i = 0; i < _c_this.inserts.length; i++) {
			if (_c_this.inserts[i].field == field) {
				return _c_this.inserts[i].value;
				}
			}
		return null;}

Websom.MySqlDatabaseInsert.prototype.set = function (field, value) {var _c_this = this; var _c_root_method_arguments = arguments;
		if ((typeof value == 'object' ? (Array.isArray(value) ? 'array' : 'map') : (typeof value == 'number' ? 'float' : typeof value)) == "boolean") {
			if (value == true) {
				value = 1;
				}else{
					value = 0;
				}
			}
		if (_c_this.isMulti) {
			_c_this.multiKeys[field] = true;
			_c_this.multiInserts[_c_this.multiInserts.length - 1].push(new Websom.DatabaseUpdate(field, value));
			}else{
				_c_this.inserts.push(new Websom.DatabaseUpdate(field, value));
			}
		return _c_this;}

Websom.MySqlDatabaseInsert.prototype.doesSet = function (field) {var _c_this = this; var _c_root_method_arguments = arguments;
		for (var i = 0; i < _c_this.inserts.length; i++) {
			if (_c_this.inserts[i].field == field) {
				return true;
				}
			}
		return false;}

Websom.MySqlDatabaseInsert.prototype.amount = function (number) {var _c_this = this; var _c_root_method_arguments = arguments;
		_c_this.number = number;
		return _c_this;}

Websom.MySqlDatabaseInsert.prototype.multi = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		_c_this.isMulti = true;
		return _c_this;}

Websom.Adapters.Database = function () {var _c_this = this;


}

Websom.Adapters.Database.Adapter = function (server) {var _c_this = this;
	this.server = null;

		_c_this.server = server;
}

Websom.Adapters.Database.Adapter.prototype.collection = function (name) {var _c_this = this; var _c_root_method_arguments = arguments;
		return new Websom.Adapters.Database.Collection(_c_this, name);}

/*i async*/Websom.Adapters.Database.Adapter.prototype.initialize = async function () {var _c_this = this; var _c_root_method_arguments = arguments;
}

/*i async*/Websom.Adapters.Database.Adapter.prototype.shutdown = async function () {var _c_this = this; var _c_root_method_arguments = arguments;
}

Websom.Adapters.Database.Collection = function (database, name) {var _c_this = this;
	this.database = null;

	this.appliedSchema = null;

	this.name = "";

	this.entityTemplate = null;

		_c_this.database = database;
		_c_this.name = name;
}

/*i async*/Websom.Adapters.Database.Collection.prototype.makeEntity = async function (document) {var _c_this = this; var _c_root_method_arguments = arguments;
/*async*/
		var entity = null;
		
			entity = new this.entityTemplate();
		
		
		entity.collection = _c_this;
		entity.id = document.id;
		(await entity.loadFromMap/* async call */(document.data()));
		return entity;}

Websom.Adapters.Database.Collection.prototype.schema = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		_c_this.appliedSchema = new Websom.Adapters.Database.Schema(_c_this);
		return _c_this.appliedSchema;}

Websom.Adapters.Database.Collection.prototype.insert = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		return new Websom.Adapters.Database.InsertQuery(_c_this);}

/*i async*/Websom.Adapters.Database.Collection.prototype.commitBatch = async function (query) {var _c_this = this; var _c_root_method_arguments = arguments;
}

/*i async*/Websom.Adapters.Database.Collection.prototype.executeInsert = async function (query) {var _c_this = this; var _c_root_method_arguments = arguments;
}

Websom.Adapters.Database.Collection.prototype.select = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		return new Websom.Adapters.Database.SelectQuery(_c_this);}

/*i async*/Websom.Adapters.Database.Collection.prototype.executeSelect = async function (query) {var _c_this = this; var _c_root_method_arguments = arguments;
}

Websom.Adapters.Database.Collection.prototype.where = function (field, operator, value) {var _c_this = this; var _c_root_method_arguments = arguments;
		var q = _c_this.select();
		q.where(field, operator, value);
		return q;}

Websom.Adapters.Database.Collection.prototype.update = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		return new Websom.Adapters.Database.UpdateQuery(_c_this);}

/*i async*/Websom.Adapters.Database.Collection.prototype.executeUpdate = async function (query) {var _c_this = this; var _c_root_method_arguments = arguments;
}

Websom.Adapters.Database.Collection.prototype.delete = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		return new Websom.Adapters.Database.DeleteQuery(_c_this);}

/*i async*/Websom.Adapters.Database.Collection.prototype.executeDelete = async function (query) {var _c_this = this; var _c_root_method_arguments = arguments;
}

Websom.Adapters.Database.Collection.prototype.batch = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		return new Websom.Adapters.Database.BatchQuery(_c_this);}

/*i async*/Websom.Adapters.Database.Collection.prototype.registerSchema = async function (schema) {var _c_this = this; var _c_root_method_arguments = arguments;
}

/*i async*/Websom.Adapters.Database.Collection.prototype.document = async function (id) {var _c_this = this; var _c_root_method_arguments = arguments;
}

/*i async*/Websom.Adapters.Database.Collection.prototype.getAll = async function (id) {var _c_this = this; var _c_root_method_arguments = arguments;
}

/*i async*/Websom.Adapters.Database.Collection.prototype.meta = async function (key) {var _c_this = this; var _c_root_method_arguments = arguments;
}

Websom.Adapters.Database.Collection.prototype.entity = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		var entity = null;
		
			entity = this.entityTemplate();
		
		
		entity.collection = _c_this;}

/*i async*/Websom.Adapters.Database.Collection.prototype.getEntity = async function (id) {var _c_this = this; var _c_root_method_arguments = arguments;
/*async*/
		var doc = (await _c_this.document/* async call */(id));
		if (doc == null) {
			return null;
			}
		return (await _c_this.makeEntity/* async call */(doc));}

Websom.Adapters.Database.MetaDocument = function (id) {var _c_this = this;
	this.id = "";

		_c_this.id = id;
}

Websom.Adapters.Database.MetaDocument.prototype.incrementNumberField = function (index, value) {var _c_this = this; var _c_root_method_arguments = arguments;
}

Websom.Adapters.Database.MetaDocument.prototype.setNumberField = function (index, value) {var _c_this = this; var _c_root_method_arguments = arguments;
}

Websom.Adapters.Database.MetaDocument.prototype.numberField = function (index) {var _c_this = this; var _c_root_method_arguments = arguments;
}

Websom.Adapters.Database.MetaDocument.prototype.setStringField = function (index, value) {var _c_this = this; var _c_root_method_arguments = arguments;
}

Websom.Adapters.Database.MetaDocument.prototype.stringField = function (index) {var _c_this = this; var _c_root_method_arguments = arguments;
}

Websom.Adapters.Database.MetaDocument.prototype.setArrayField = function (index, value) {var _c_this = this; var _c_root_method_arguments = arguments;
}

Websom.Adapters.Database.MetaDocument.prototype.arrayField = function (index) {var _c_this = this; var _c_root_method_arguments = arguments;
}

/*i async*/Websom.Adapters.Database.MetaDocument.prototype.update = async function () {var _c_this = this; var _c_root_method_arguments = arguments;
}

Websom.Adapters.Database.FieldType = function () {var _c_this = this;


}
Websom.Adapters.Database.FieldType.prototype.string = "string";

Websom.Adapters.Database.FieldType.prototype.integer = "integer";

Websom.Adapters.Database.FieldType.prototype.float = "float";

Websom.Adapters.Database.FieldType.prototype.time = "time";

Websom.Adapters.Database.FieldType.prototype.boolean = "boolean";

Websom.Adapters.Database.FieldType.prototype.reference = "reference";

Websom.Adapters.Database.FieldType.prototype.geopoint = "geopoint";

Websom.Adapters.Database.FieldType.prototype.array = "array";

Websom.Adapters.Database.Field = function (name, type) {var _c_this = this;
	this.name = "";

	this.type = "";

		_c_this.name = name;
		_c_this.type = type;
}

Websom.Calculators = function () {var _c_this = this;


}

Websom.Calculator = function () {var _c_this = this;
	this.collection = null;

	this.getterName = "";


}

/*i async*/Websom.Calculator.prototype.insert = async function (doc, collection) {var _c_this = this; var _c_root_method_arguments = arguments;
}

/*i async*/Websom.Calculator.prototype.delete = async function (doc, collection) {var _c_this = this; var _c_root_method_arguments = arguments;
}

/*i async*/Websom.Calculator.prototype.update = async function (oldDoc, newDoc, collection) {var _c_this = this; var _c_root_method_arguments = arguments;
}

/*i async*/Websom.Calculator.prototype.get = async function (collection) {var _c_this = this; var _c_root_method_arguments = arguments;
}

Websom.Calculators.Average = function (fieldName) {var _c_this = this;
	this.fieldName = "";

	this.collection = null;

	this.getterName = "";

		_c_this.fieldName = fieldName;
}

/*i async*/Websom.Calculators.Average.prototype.insert = async function (doc, collection) {var _c_this = this; var _c_root_method_arguments = arguments;
/*async*/
		var metaDoc = (await collection.meta/* async call */("avg_calc"));
		metaDoc.incrementNumberField(1, 1);
		metaDoc.incrementNumberField(2, doc.get(_c_this.fieldName));
		(await metaDoc.update/* async call */());}

/*i async*/Websom.Calculators.Average.prototype.update = async function (oldDoc, newDoc, collection) {var _c_this = this; var _c_root_method_arguments = arguments;
/*async*/
		if (newDoc.get(_c_this.fieldName) != oldDoc.get(_c_this.fieldName)) {
/*async*/
			var metaDoc = (await collection.meta/* async call */("avg_calc"));
			var oldVal = oldDoc.get(_c_this.fieldName);
			var newVal = newDoc.get(_c_this.fieldName);
			metaDoc.incrementNumberField(2, newVal - oldVal);
			(await metaDoc.update/* async call */());
			}}

/*i async*/Websom.Calculators.Average.prototype.delete = async function (doc, collection) {var _c_this = this; var _c_root_method_arguments = arguments;
/*async*/
		var metaDoc = (await collection.meta/* async call */("avg_calc"));
		metaDoc.incrementNumberField(1, -1);
		var value = doc.get(_c_this.fieldName);
		metaDoc.incrementNumberField(2, value);
		(await metaDoc.update/* async call */());}

/*i async*/Websom.Calculators.Average.prototype.get = async function (collection) {var _c_this = this; var _c_root_method_arguments = arguments;
/*async*/
		var metaDoc = (await collection.meta/* async call */("avg_calc"));
		var total = metaDoc.numberField(2);
		var count = metaDoc.numberField(1);
		return total / count;}

Websom.Calculators.KeyCount = function () {var _c_this = this;
	this.fieldName = "";

	this.clusterType = "value";

	this.toCollection = null;

	this.toCollectionFieldName = "";

	this.collection = null;

	this.getterName = "";

	if (arguments.length == 2 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'string' || typeof arguments[1] == 'undefined' || arguments[1] === null)) {
		var fieldName = arguments[0];
		var clusterType = arguments[1];
		_c_this.fieldName = fieldName;
		_c_this.clusterType = clusterType;
	}
else 	if (arguments.length == 4 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'string' || typeof arguments[1] == 'undefined' || arguments[1] === null) && ((arguments[2] instanceof Websom.Adapters.Database.Collection) || typeof arguments[2] == 'undefined' || arguments[2] === null) && (typeof arguments[3] == 'string' || typeof arguments[3] == 'undefined' || arguments[3] === null)) {
		var fieldName = arguments[0];
		var clusterType = arguments[1];
		var toCollection = arguments[2];
		var toCollectionFieldName = arguments[3];
		_c_this.fieldName = fieldName;
		_c_this.clusterType = clusterType;
		_c_this.toCollection = toCollection;
		_c_this.toCollectionFieldName = _c_this.toCollectionFieldName;
	}

}

/*i async*/Websom.Calculators.KeyCount.prototype.trackGroup = async function (key, change) {var _c_this = this; var _c_root_method_arguments = arguments;
/*async*/
		if (_c_this.toCollection != null) {
/*async*/
			(await _c_this.toCollection.update().where("id", "==", key).increment(_c_this.toCollectionFieldName, change).run/* async call */());
			}else{
/*async*/
				var metaDoc = (await _c_this.collection.meta/* async call */("key_count_" + key));
				metaDoc.incrementNumberField(1, change);
				(await metaDoc.update/* async call */());
			}}

/*i async*/Websom.Calculators.KeyCount.prototype.insert = async function (doc, collection) {var _c_this = this; var _c_root_method_arguments = arguments;
/*async*/
		if (_c_this.clusterType == "array") {
/*async*/
			var arr = doc.get(_c_this.fieldName);
			if (arr != null) {
/*async*/
				for (var i = 0; i < arr.length; i++) {
/*async*/
					(await _c_this.trackGroup/* async call */(arr[i], 1));
					}
				}
			}else{
/*async*/
				(await _c_this.trackGroup/* async call */(doc.get(_c_this.fieldName), 1));
			}}

/*i async*/Websom.Calculators.KeyCount.prototype.update = async function (oldDoc, newDoc, collection) {var _c_this = this; var _c_root_method_arguments = arguments;
/*async*/
		if (_c_this.clusterType == "array") {
/*async*/
			var oldArr = oldDoc.get(_c_this.fieldName);
			var arr = newDoc.get(_c_this.fieldName);
			for (var i = 0; i < oldArr.length; i++) {
/*async*/
				var curKey = oldArr[i];
				if (arr.find(function (v) {
					return curKey == v;
					}) == null) {
/*async*/
					(await _c_this.trackGroup/* async call */(curKey, -1));
					}
				}
			for (var i = 0; i < arr.length; i++) {
/*async*/
				var curKey = arr[i];
				if (oldArr.find(function (v) {
					return curKey == v;
					}) == null) {
/*async*/
					(await _c_this.trackGroup/* async call */(curKey, 1));
					}
				}
			}else{
/*async*/
				if (oldDoc.get(_c_this.fieldName) != newDoc.get(_c_this.fieldName)) {
/*async*/
					(await _c_this.trackGroup/* async call */(oldDoc.get(_c_this.fieldName), -1));
					(await _c_this.trackGroup/* async call */(newDoc.get(_c_this.fieldName), 1));
					}
			}}

/*i async*/Websom.Calculators.KeyCount.prototype.delete = async function (doc, collection) {var _c_this = this; var _c_root_method_arguments = arguments;
/*async*/
		if (_c_this.clusterType == "array") {
/*async*/
			var arr = doc.get(_c_this.fieldName);
			for (var i = 0; i < arr.length; i++) {
/*async*/
				(await _c_this.trackGroup/* async call */(arr[i], -1));
				}
			}else{
/*async*/
				(await _c_this.trackGroup/* async call */(doc.get(_c_this.fieldName), -1));
			}}

/*i async*/Websom.Calculators.KeyCount.prototype.get = async function (collection) {var _c_this = this; var _c_root_method_arguments = arguments;
		return null;}

/*i async*/Websom.Calculators.KeyCount.prototype.getCountOfKey = async function (key) {var _c_this = this; var _c_root_method_arguments = arguments;
/*async*/
		var meta = (await _c_this.collection.meta/* async call */("key_count_" + key));
		return meta.numberField(1);}

Websom.Adapters.Database.Index = function () {var _c_this = this;
	this.fields = [];


}

Websom.Adapters.Database.Schema = function (collection) {var _c_this = this;
	this.collection = null;

	this.fields = [];

	this.indexes = [];

	this.calculators = [];

		_c_this.collection = collection;
}

Websom.Adapters.Database.Schema.prototype.getField = function (name) {var _c_this = this; var _c_root_method_arguments = arguments;
		return _c_this.fields.find(function (f) {
			return f.name == name;
			});}

Websom.Adapters.Database.Schema.prototype.field = function (name, type) {var _c_this = this; var _c_root_method_arguments = arguments;
		var fields = _c_this.fields;
		if (_c_this.indexes.length > 0) {
			fields = _c_this.indexes[_c_this.indexes.length - 1].fields;
			}
		fields.push(new Websom.Adapters.Database.Field(name, type));
		return _c_this;}

Websom.Adapters.Database.Schema.prototype.calc = function (getterName, calculator) {var _c_this = this; var _c_root_method_arguments = arguments;
		calculator.getterName = getterName;
		calculator.collection = _c_this.collection;
		_c_this.calculators.push(calculator);
		return _c_this;}

Websom.Adapters.Database.Schema.prototype.index = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		_c_this.indexes.push(new Websom.Adapters.Database.Index());
		return _c_this;}

/*i async*/Websom.Adapters.Database.Schema.prototype.register = async function () {var _c_this = this; var _c_root_method_arguments = arguments;
/*async*/
		(await _c_this.collection.registerSchema/* async call */(_c_this));}

Websom.Adapters.Database.InsertQuery = function (collection) {var _c_this = this;
	this.collection = null;

	this.sets = {};

		_c_this.collection = collection;
}

Websom.Adapters.Database.InsertQuery.prototype.set = function (field, value) {var _c_this = this; var _c_root_method_arguments = arguments;
		_c_this.sets[field] = value;
		return _c_this;}

/*i async*/Websom.Adapters.Database.InsertQuery.prototype.run = async function () {var _c_this = this; var _c_root_method_arguments = arguments;
/*async*/
		return (await _c_this.collection.executeInsert/* async call */(_c_this));}

Websom.Adapters.Database.InsertQueryResult = function (success, message, id) {var _c_this = this;
	this.success = false;

	this.message = "";

	this.id = "";

		_c_this.success = success;
		_c_this.message = message;
		_c_this.id = id;
}

Websom.Adapters.Database.SelectCondition = function (field, operator, value, type) {var _c_this = this;
	this.field = "";

	this.operator = "";

	this.value = null;

	this.type = "";

		_c_this.field = field;
		_c_this.operator = operator;
		_c_this.value = value;
		_c_this.type = type;
}

Websom.Adapters.Database.SelectQuery = function (collection) {var _c_this = this;
	this.conditions = [];

	this.collection = null;

	this.documentLimit = 10;

	this.documentStart = 0;

		_c_this.collection = collection;
}

Websom.Adapters.Database.SelectQuery.prototype.where = function (field, operator, value) {var _c_this = this; var _c_root_method_arguments = arguments;
		_c_this.conditions.push(new Websom.Adapters.Database.SelectCondition(field, operator, value, "where"));
		return _c_this;}

Websom.Adapters.Database.SelectQuery.prototype.orderBy = function (field, order) {var _c_this = this; var _c_root_method_arguments = arguments;
		_c_this.conditions.push(new Websom.Adapters.Database.SelectCondition(field, order, "", "order"));
		return _c_this;}

Websom.Adapters.Database.SelectQuery.prototype.limit = function (limit) {var _c_this = this; var _c_root_method_arguments = arguments;
		_c_this.documentLimit = limit;
		return _c_this;}

Websom.Adapters.Database.SelectQuery.prototype.startOffset = function (amount) {var _c_this = this; var _c_root_method_arguments = arguments;
		_c_this.documentStart = amount;
		return _c_this;}

/*i async*/Websom.Adapters.Database.SelectQuery.prototype.get = async function () {var _c_this = this; var _c_root_method_arguments = arguments;
/*async*/
		return (await _c_this.collection.executeSelect/* async call */(_c_this));}

Websom.Adapters.Database.SelectQueryResult = function (success, message) {var _c_this = this;
	this.success = false;

	this.message = "";

	this.documents = [];

		_c_this.success = success;
		_c_this.message = message;
}

Websom.Adapters.Database.UpdateQuery = function (collection) {var _c_this = this;
	this.sets = {};

	this.increments = {};

	this.collection = null;

	this.conditions = [];

	this.collection = null;

	this.documentLimit = 10;

	this.documentStart = 0;

		_c_this.collection = collection;
}

Websom.Adapters.Database.UpdateQuery.prototype.set = function (field, value) {var _c_this = this; var _c_root_method_arguments = arguments;
		_c_this.sets[field] = value;
		return _c_this;}

Websom.Adapters.Database.UpdateQuery.prototype.increment = function (field, value) {var _c_this = this; var _c_root_method_arguments = arguments;
		_c_this.increments[field] = value;
		return _c_this;}

Websom.Adapters.Database.UpdateQuery.prototype.where = function (field, operator, value) {var _c_this = this; var _c_root_method_arguments = arguments;
		_c_this.conditions.push(new Websom.Adapters.Database.SelectCondition(field, operator, value, "where"));
		return _c_this;}

Websom.Adapters.Database.UpdateQuery.prototype.orderBy = function (field, order) {var _c_this = this; var _c_root_method_arguments = arguments;
		_c_this.conditions.push(new Websom.Adapters.Database.SelectCondition(field, order, "", "order"));
		return _c_this;}

/*i async*/Websom.Adapters.Database.UpdateQuery.prototype.run = async function () {var _c_this = this; var _c_root_method_arguments = arguments;
/*async*/
		return (await _c_this.collection.executeUpdate/* async call */(_c_this));}

Websom.Adapters.Database.UpdateQuery.prototype.limit = function (limit) {var _c_this = this; var _c_root_method_arguments = arguments;
		_c_this.documentLimit = limit;
		return _c_this;}

Websom.Adapters.Database.UpdateQuery.prototype.startOffset = function (amount) {var _c_this = this; var _c_root_method_arguments = arguments;
		_c_this.documentStart = amount;
		return _c_this;}

/*i async*/Websom.Adapters.Database.UpdateQuery.prototype.get = async function () {var _c_this = this; var _c_root_method_arguments = arguments;
/*async*/
		return (await _c_this.collection.executeSelect/* async call */(_c_this));}

Websom.Adapters.Database.UpdateQueryResult = function (success, message) {var _c_this = this;
	this.success = false;

	this.message = "";

	this.updateCount = 0;

	this.documents = null;

		_c_this.success = success;
		_c_this.message = message;
}

Websom.Adapters.Database.DeleteQuery = function (collection) {var _c_this = this;
	this.collection = null;

	this.conditions = [];

	this.collection = null;

	this.documentLimit = 10;

	this.documentStart = 0;

		_c_this.collection = collection;
}

/*i async*/Websom.Adapters.Database.DeleteQuery.prototype.run = async function () {var _c_this = this; var _c_root_method_arguments = arguments;
/*async*/
		return (await _c_this.collection.executeDelete/* async call */(_c_this));}

Websom.Adapters.Database.DeleteQuery.prototype.where = function (field, operator, value) {var _c_this = this; var _c_root_method_arguments = arguments;
		_c_this.conditions.push(new Websom.Adapters.Database.SelectCondition(field, operator, value, "where"));
		return _c_this;}

Websom.Adapters.Database.DeleteQuery.prototype.orderBy = function (field, order) {var _c_this = this; var _c_root_method_arguments = arguments;
		_c_this.conditions.push(new Websom.Adapters.Database.SelectCondition(field, order, "", "order"));
		return _c_this;}

Websom.Adapters.Database.DeleteQuery.prototype.limit = function (limit) {var _c_this = this; var _c_root_method_arguments = arguments;
		_c_this.documentLimit = limit;
		return _c_this;}

Websom.Adapters.Database.DeleteQuery.prototype.startOffset = function (amount) {var _c_this = this; var _c_root_method_arguments = arguments;
		_c_this.documentStart = amount;
		return _c_this;}

/*i async*/Websom.Adapters.Database.DeleteQuery.prototype.get = async function () {var _c_this = this; var _c_root_method_arguments = arguments;
/*async*/
		return (await _c_this.collection.executeSelect/* async call */(_c_this));}

Websom.Adapters.Database.DeleteQueryResult = function (success, message) {var _c_this = this;
	this.success = false;

	this.message = "";

	this.documents = null;

		_c_this.success = success;
		_c_this.message = message;
}

Websom.Adapters.Database.Document = function (collection, id) {var _c_this = this;
	this.collection = null;

	this.id = "";

		_c_this.collection = collection;
		_c_this.id = id;
}

/*i async*/Websom.Adapters.Database.Document.prototype.calc = async function (field) {var _c_this = this; var _c_root_method_arguments = arguments;
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

Websom.Adapters.Database.Document.prototype.get = function (field) {var _c_this = this; var _c_root_method_arguments = arguments;
}

Websom.Adapters.Database.Document.prototype.data = function () {var _c_this = this; var _c_root_method_arguments = arguments;
}

Websom.Adapters.Database.BatchQuery = function (collection) {var _c_this = this;
	this.collection = null;

	this.inserts = [];

	this.updates = [];

		_c_this.collection = collection;
}

Websom.Adapters.Database.BatchQuery.prototype.insert = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		return new Websom.Adapters.Database.InsertQuery(_c_this.collection);}

Websom.Adapters.Database.BatchQuery.prototype.update = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		return new Websom.Adapters.Database.UpdateQuery(_c_this.collection);}

/*i async*/Websom.Adapters.Database.BatchQuery.prototype.commit = async function () {var _c_this = this; var _c_root_method_arguments = arguments;
/*async*/
		return (await _c_this.collection.commitBatch/* async call */(_c_this));}

Websom.Adapters.Email = function () {var _c_this = this;


}

Websom.Adapters.Email.Adapter = function (server) {var _c_this = this;
	this.server = null;

		_c_this.server = server;
}

Websom.Adapters.Email.Adapter.prototype.email = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		return new Websom.Adapters.Email.Email(_c_this);}

/*i async*/Websom.Adapters.Email.Adapter.prototype.send = async function (email) {var _c_this = this; var _c_root_method_arguments = arguments;
}

Websom.Adapters.Email.Adapter.prototype.template = function (title) {var _c_this = this; var _c_root_method_arguments = arguments;
		return new Websom.Adapters.Email.EmailTemplate(_c_this, title);}

/*i async*/Websom.Adapters.Email.Adapter.prototype.initialize = async function () {var _c_this = this; var _c_root_method_arguments = arguments;
}

/*i async*/Websom.Adapters.Email.Adapter.prototype.shutdown = async function () {var _c_this = this; var _c_root_method_arguments = arguments;
}

Websom.Adapters.Email.SendResults = function (status, message, sent) {var _c_this = this;
	this.status = "";

	this.message = "";

	this.sent = 0;

		_c_this.status = status;
		_c_this.message = message;
		_c_this.sent = sent;
}

Websom.Adapters.Email.Email = function (adapter) {var _c_this = this;
	this.subject = "";

	this.textBody = "";

	this.htmlBody = "";

	this.fromAddress = "";

	this.fromName = "";

	this.replyTo = "";

	this.recipients = [];

	this.cc = [];

	this.bcc = [];

	this.adapter = null;

		_c_this.adapter = adapter;
}

Websom.Adapters.Email.Email.prototype.setSubject = function (val) {var _c_this = this; var _c_root_method_arguments = arguments;
		_c_this.subject = val;
		return _c_this;}

Websom.Adapters.Email.Email.prototype.setReplyTo = function (val) {var _c_this = this; var _c_root_method_arguments = arguments;
		_c_this.replyTo = val;
		return _c_this;}

Websom.Adapters.Email.Email.prototype.setTextBody = function (val) {var _c_this = this; var _c_root_method_arguments = arguments;
		_c_this.textBody = val;
		return _c_this;}

Websom.Adapters.Email.Email.prototype.setHtmlBody = function (val) {var _c_this = this; var _c_root_method_arguments = arguments;
		_c_this.htmlBody = val;
		return _c_this;}

Websom.Adapters.Email.Email.prototype.setFrom = function (address, name) {var _c_this = this; var _c_root_method_arguments = arguments;
		_c_this.fromAddress = address;
		_c_this.fromName = name;
		return _c_this;}

Websom.Adapters.Email.Email.prototype.addRecipient = function (address) {var _c_this = this; var _c_root_method_arguments = arguments;
		_c_this.recipients.push(address);
		return _c_this;}

Websom.Adapters.Email.Email.prototype.addCCRecipient = function (address) {var _c_this = this; var _c_root_method_arguments = arguments;
		_c_this.cc.push(address);
		return _c_this;}

Websom.Adapters.Email.Email.prototype.addBCCRecipient = function (address) {var _c_this = this; var _c_root_method_arguments = arguments;
		_c_this.bcc.push(address);
		return _c_this;}

/*i async*/Websom.Adapters.Email.Email.prototype.send = async function () {var _c_this = this; var _c_root_method_arguments = arguments;
/*async*/
		return (await _c_this.adapter.send/* async call */(_c_this));}

Websom.Adapters.Email.Column = function () {var _c_this = this;
	this.content = [];


}

Websom.Adapters.Email.Row = function () {var _c_this = this;
	this.columns = [];


}

Websom.Adapters.Email.EmailTemplate = function (adapter, title) {var _c_this = this;
	this.adapter = null;

	this.title = "";

	this.plainText = "";

	this.rows = [];

		_c_this.adapter = adapter;
		_c_this.title = title;
}

Websom.Adapters.Email.EmailTemplate.prototype.email = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		return _c_this.adapter.email().setHtmlBody(_c_this.getHtml()).setTextBody(_c_this.getPlain());}

Websom.Adapters.Email.EmailTemplate.prototype.getHtml = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		var rows = [];
		for (var i = 0; i < _c_this.rows.length; i++) {
			var row = _c_this.rows[i];
			var cols = [];
			for (var j = 0; j < row.columns.length; j++) {
				cols.push("<td>" + row.columns[j].content.join("") + "</td>");
				}
			rows.push("<tr>" + cols.join("") + "</tr>");
			}
		return _c_this.htmlTemplate(_c_this.title, rows.join(""));}

Websom.Adapters.Email.EmailTemplate.prototype.getPlain = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		return _c_this.plainText;}

Websom.Adapters.Email.EmailTemplate.prototype.plain = function (content) {var _c_this = this; var _c_root_method_arguments = arguments;
		_c_this.plainText = content;
		return _c_this;}

Websom.Adapters.Email.EmailTemplate.prototype.row = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		_c_this.rows.push(new Websom.Adapters.Email.Row());
		return _c_this;}

Websom.Adapters.Email.EmailTemplate.prototype.column = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		_c_this.rows[_c_this.rows.length - 1].columns.push(new Websom.Adapters.Email.Column());
		return _c_this;}

Websom.Adapters.Email.EmailTemplate.prototype.button = function (label, href) {var _c_this = this; var _c_root_method_arguments = arguments;
		var columns = _c_this.rows[_c_this.rows.length - 1].columns;
		columns[columns.length - 1].content.push("<p><a href=\"" + href + "\">" + label + "</a></p>");
		return _c_this;}

Websom.Adapters.Email.EmailTemplate.prototype.paragraph = function (content) {var _c_this = this; var _c_root_method_arguments = arguments;
		var columns = _c_this.rows[_c_this.rows.length - 1].columns;
		columns[columns.length - 1].content.push("<p>" + content + "</p>");
		return _c_this;}

Websom.Adapters.Email.EmailTemplate.prototype.raw = function (html) {var _c_this = this; var _c_root_method_arguments = arguments;
		var columns = _c_this.rows[_c_this.rows.length - 1].columns;
		columns[columns.length - 1].content.push(html);
		return _c_this;}

Websom.Adapters.Email.EmailTemplate.prototype.htmlTemplate = function (title, rows) {var _c_this = this; var _c_root_method_arguments = arguments;
		return "<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Transitional//EN\" \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\">\r\n		<html xmlns=\"http://www.w3.org/1999/xhtml\">\r\n			<head>\r\n				<meta http-equiv=\"Content-Type\" content=\"text/html; charset=UTF-8\"/>\r\n				<meta name=\"format-detection\" content=\"telephone=no\"> \r\n				<meta name=\"viewport\" content=\"width=device-width; initial-scale=1.0; maximum-scale=1.0; user-scalable=no;\">\r\n				<meta http-equiv=\"X-UA-Compatible\" content=\"IE=9; IE=8; IE=7; IE=EDGE\" />\r\n\r\n				<title>" + title + "</title>\r\n\r\n				<style type=\"text/css\"> \r\n					@media screen and (max-width: 630px) {\r\n\r\n					}\r\n				</style>\r\n			</head>\r\n\r\n			<body style=\"padding:0; margin:0\">\r\n\r\n			<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" style=\"margin: 0; padding: 0\" width=\"100%\">\r\n				<tr>\r\n					<td align=\"center\" valign=\"top\">\r\n						" + rows + "\r\n					</td>\r\n				</tr>\r\n			</table>\r\n\r\n			</body>\r\n		</html>";}

Websom.Adapters.Confirmation = function () {var _c_this = this;


}

Websom.Adapters.Confirmation.Adapter = function (server) {var _c_this = this;
	this.handlers = [];

	this.server = null;

		_c_this.server = server;
}

Websom.Adapters.Confirmation.Adapter.prototype.confirm = function (key) {var _c_this = this; var _c_root_method_arguments = arguments;
		return new Websom.Adapters.Confirmation.Confirmation(_c_this, key);}

Websom.Adapters.Confirmation.Adapter.prototype.handleConfirmation = function (key, handler) {var _c_this = this; var _c_root_method_arguments = arguments;
		_c_this.handlers.push(new Websom.Adapters.Confirmation.Handler(key, handler));}

/*i async*/Websom.Adapters.Confirmation.Adapter.prototype.dispatch = async function (confirmation) {var _c_this = this; var _c_root_method_arguments = arguments;
}

/*i async*/Websom.Adapters.Confirmation.Adapter.prototype.initialize = async function () {var _c_this = this; var _c_root_method_arguments = arguments;
}

/*i async*/Websom.Adapters.Confirmation.Adapter.prototype.shutdown = async function () {var _c_this = this; var _c_root_method_arguments = arguments;
}

Websom.Adapters.Confirmation.Handler = function (key, handler) {var _c_this = this;
	this.key = "";

	this.handler = null;

		_c_this.key = key;
		_c_this.handler = handler;
}

Websom.Adapters.Confirmation.Execution = function (req, key, storage) {var _c_this = this;
	this.key = "";

	this.storage = null;

	this.params = null;

	this.request = null;

		_c_this.request = req;
		_c_this.key = key;
		_c_this.storage = storage;
}

Websom.Adapters.Confirmation.Confirmation = function (adapter, key) {var _c_this = this;
	this.adapter = null;

	this.key = "";

	this.emailSubject = "";

	this.confirmationMessage = "";

	this.notificationService = "direct";

	this.method = "link";

	this.storage = null;

	this.recipient = "";

	this.ip = "";

	this.ttl = 1000 * 60 * 60;

		_c_this.adapter = adapter;
		_c_this.key = key;
}

Websom.Adapters.Confirmation.Confirmation.prototype.subject = function (val) {var _c_this = this; var _c_root_method_arguments = arguments;
		_c_this.emailSubject = val;
		return _c_this;}

Websom.Adapters.Confirmation.Confirmation.prototype.message = function (val) {var _c_this = this; var _c_root_method_arguments = arguments;
		_c_this.confirmationMessage = val;
		return _c_this;}

Websom.Adapters.Confirmation.Confirmation.prototype.store = function (val) {var _c_this = this; var _c_root_method_arguments = arguments;
		_c_this.storage = val;
		return _c_this;}

Websom.Adapters.Confirmation.Confirmation.prototype.via = function (val) {var _c_this = this; var _c_root_method_arguments = arguments;
		_c_this.notificationService = val;
		return _c_this;}

/*i async*/Websom.Adapters.Confirmation.Confirmation.prototype.dispatch = async function () {var _c_this = this; var _c_root_method_arguments = arguments;
/*async*/
		return (await _c_this.adapter.dispatch/* async call */(_c_this));}

Websom.Adapters.Confirmation.Confirmation.prototype.using = function (val) {var _c_this = this; var _c_root_method_arguments = arguments;
		_c_this.method = val;
		return _c_this;}

Websom.Adapters.Confirmation.Confirmation.prototype.to = function (val) {var _c_this = this; var _c_root_method_arguments = arguments;
		_c_this.recipient = val;
		return _c_this;}

Websom.Adapters.Confirmation.Confirmation.prototype.createdBy = function (ip) {var _c_this = this; var _c_root_method_arguments = arguments;
		_c_this.ip = ip;
		return _c_this;}

Websom.Adapters.Confirmation.Confirmation.prototype.expiresAfter = function (ms) {var _c_this = this; var _c_root_method_arguments = arguments;
		_c_this.ttl = ms;
		return _c_this;}

Websom.Adapters.Confirmation.ConfirmationResults = function (secret, url, status, message) {var _c_this = this;
	this.secret = "";

	this.url = "";

	this.status = "";

	this.message = "";

		_c_this.secret = secret;
		_c_this.url = url;
		_c_this.status = status;
		_c_this.message = message;
}

Websom.Adapters.Captcha = function () {var _c_this = this;


}

Websom.Adapters.Captcha.Adapter = function (server) {var _c_this = this;
	this.server = null;

		_c_this.server = server;
}

/*i async*/Websom.Adapters.Captcha.Adapter.prototype.clientInitialization = async function (req, action) {var _c_this = this; var _c_root_method_arguments = arguments;
}

/*i async*/Websom.Adapters.Captcha.Adapter.prototype.verify = async function (req, payload) {var _c_this = this; var _c_root_method_arguments = arguments;
}

/*i async*/Websom.Adapters.Captcha.Adapter.prototype.initialize = async function () {var _c_this = this; var _c_root_method_arguments = arguments;
}

/*i async*/Websom.Adapters.Captcha.Adapter.prototype.shutdown = async function () {var _c_this = this; var _c_root_method_arguments = arguments;
}

Websom.Adapters.Captcha.Report = function () {var _c_this = this;
	this.token = "";

	this.id = "";

	this.score = 0;

	this.action = "";

	this.initialized = 0;

	this.hostname = "";

	this.status = "";

	this.message = "";


}

Websom.Adapters.Bucket = function () {var _c_this = this;


}

Websom.Adapters.Bucket.Adapter = function (server) {var _c_this = this;
	this.server = null;

		_c_this.server = server;
}

/*i async*/Websom.Adapters.Bucket.Adapter.prototype.generateUploadURL = async function (upload) {var _c_this = this; var _c_root_method_arguments = arguments;
}

/*i async*/Websom.Adapters.Bucket.Adapter.prototype.deleteObject = async function (bucket, filename) {var _c_this = this; var _c_root_method_arguments = arguments;
}

/*i async*/Websom.Adapters.Bucket.Adapter.prototype.createDirectory = async function (bucket, path) {var _c_this = this; var _c_root_method_arguments = arguments;
}

/*i async*/Websom.Adapters.Bucket.Adapter.prototype.setObjectACL = async function (bucket, filename, acl) {var _c_this = this; var _c_root_method_arguments = arguments;
}

Websom.Adapters.Bucket.Adapter.prototype.registerBucket = function (bucket) {var _c_this = this; var _c_root_method_arguments = arguments;
}

/*i async*/Websom.Adapters.Bucket.Adapter.prototype.serve = async function (bucket, filename) {var _c_this = this; var _c_root_method_arguments = arguments;
}

/*i async*/Websom.Adapters.Bucket.Adapter.prototype.initialize = async function () {var _c_this = this; var _c_root_method_arguments = arguments;
}

/*i async*/Websom.Adapters.Bucket.Adapter.prototype.shutdown = async function () {var _c_this = this; var _c_root_method_arguments = arguments;
}

Websom.DeleteHandler = function (server) {var _c_this = this;
	this.server = null;

		_c_this.server = server;
}

/*i async*/Websom.DeleteHandler.prototype.fulfill = async function (cir, req) {var _c_this = this; var _c_root_method_arguments = arguments;
/*async*/
		var filterName = req.body["filter"];
		if ((typeof filterName == 'object' ? (Array.isArray(filterName) ? 'array' : 'map') : (typeof filterName == 'number' ? 'float' : typeof filterName)) != "string") {
			filterName = "default";
			}
		var filter = cir.findFilter(filterName);
		if (filter == null) {
/*async*/
			(await req.endWithError/* async call */("Unknown filter provided"));
			return null;
			}
		var collection = cir.collection.collection;
		var query = collection.delete();
		var out = (await _c_this.buildQuery/* async call */(cir, filter, req, query));
		if (out == null) {
			return null;
			}
		var deleteResults = (await query.run/* async call */());
		cir.trigger("success", req, deleteResults.documents);
		(await req.endWithSuccess/* async call */("Deleted"));}

/*i async*/Websom.DeleteHandler.prototype.buildQuery = async function (cir, filter, req, query) {var _c_this = this; var _c_root_method_arguments = arguments;
/*async*/
		var collection = cir.collection.collection;
		var limit = filter.limits[0];
		if ("limit" in req.body) {
			var reqLimit = req.body["limit"];
			for (var i = 0; i < filter.limits.length; i++) {
				var l = filter.limits[i];
				if (reqLimit == l) {
					limit = l;
					}
				}
			}
		var offset = 0;
		if ("page" in req.body) {
			var page = req.body["page"];
			if ((typeof page == 'object' ? (Array.isArray(page) ? 'array' : 'map') : (typeof page == 'number' ? 'float' : typeof page)) == "float") {
				var pageAsFloat = page;
				if (pageAsFloat % 1 === 0) {
					offset = pageAsFloat * limit;
					}
				}
			}
		query.startOffset(offset);
		query.limit(limit);
		for (var i = 0; i < filter.forces.length; i++) {
			var force = filter.forces[i];
			query.where(force.name, force.operator, force.value);
			}
		for (var i = 0; i < filter.orders.length; i++) {
			var order = filter.orders[i];
			var ordered = false;
			if ("order" in req.body) {
				var clientOrder = req.body["order"];
				if ((typeof clientOrder == 'object' ? (Array.isArray(clientOrder) ? 'array' : 'map') : (typeof clientOrder == 'number' ? 'float' : typeof clientOrder)) == "map") {
					var orderField = clientOrder["field"];
					var orderDirection = clientOrder["direction"];
					if ((typeof orderField == 'object' ? (Array.isArray(orderField) ? 'array' : 'map') : (typeof orderField == 'number' ? 'float' : typeof orderField)) == "string") {
						var allowed = false;
						var schema = collection.appliedSchema;
						if (order.name == "*") {
							for (var f = 0; f < schema.fields.length; f++) {
								var schemaField = schema.fields[f];
								if (schemaField.name == orderField) {
									allowed = true;
									}
								}
							}else if (order.name == orderField) {
							allowed = true;
							}
						if (orderDirection != "dsc" && orderDirection != "asc") {
							allowed = false;
							}
						if (allowed) {
							query.orderBy(orderField, orderDirection);
							ordered = true;
							}
						}
					}
				}
			if (ordered == false) {
				if (order.name == "*") {
					query.orderBy("id", order.operator);
					}else{
						query.orderBy(order.name, order.operator);
					}
				}
			}
		var clientQuery = req.body["query"];
		if ((typeof clientQuery == 'object' ? (Array.isArray(clientQuery) ? 'array' : 'map') : (typeof clientQuery == 'number' ? 'float' : typeof clientQuery)) != "map") {
/*async*/
			(await req.endWithError/* async call */("Query must be an object. ( e.g. { name: Hello } )"));
			return null;
			}
		for (var i = 0; i < filter.fields.length; i++) {
/*async*/
			var field = filter.fields[i];
			if (field.name in clientQuery) {
				query.where(field.name, field.operator, clientQuery[field.name]);
				}else{
/*async*/
					(await req.endWithError/* async call */("No query for field '" + field.name + "' was provided."));
					return null;
				}
			}
		for (var i = 0; i < filter.computed.length; i++) {
			var field = filter.computed[i];
			var value = null;
			
				value = await field.handler(req);
			
			
			if (req.sent) {
				return null;
				}
			query.where(field.name, field.operator, value);
			}
		if (filter.handler != null) {
			
				await filter.handler(req, query);
			
			
			}
		if (req.sent) {
			return null;
			}
		return query;}

/*i async*/Websom.DeleteHandler.prototype.executeQuery = async function (cir, filter, req, query) {var _c_this = this; var _c_root_method_arguments = arguments;
/*async*/
		var collection = cir.collection.collection;
		var res = {};
		res["status"] = "success";
		res["message"] = "Query successful!";
		var output = [];
		var results = (await query.get/* async call */());
		var returnFields = req.body["fields"];
		if ((typeof returnFields == 'object' ? (Array.isArray(returnFields) ? 'array' : 'map') : (typeof returnFields == 'number' ? 'float' : typeof returnFields)) != "map") {
/*async*/
			(await req.endWithError/* async call */("No fields object provided. See the api request docs."));
			return null;
			}
		for (var i = 0; i < results.documents.length; i++) {
/*async*/
			var doc = results.documents[i];
			var mp = {};
			if (cir.reads.length > 0) {
/*async*/
				if (cir.reads[0].field == "*") {
/*async*/
					if (collection.appliedSchema == null) {
/*async*/
						(await req.endWithError/* async call */("This collection has no schema applied"));
						return null;
						}
					var schema = collection.appliedSchema;
					for (var f = 0; f < schema.fields.length; f++) {
						var field = schema.fields[f];
						mp[field.name] = doc.get(field.name);
						}
					}
				}
			for (var j = 0; j < cir.reads.length; j++) {
/*async*/
				var read = cir.reads[j];
				if (read.field in returnFields || "*" in returnFields) {
/*async*/
					var val = doc.get(read.field);
					for (var t = 0; t < read.transformers.length; t++) {
/*async*/
						var transformer = read.transformers[t];
						val = (await transformer.transform/* async call */(req, doc, read.field, val));
						}
					mp[read.field] = val;
					}
				}
			if ("*" in returnFields) {
				mp["id"] = doc.get("id");
				}
			output.push(mp);
			}
		res["documents"] = output;
		cir.trigger("success", req, results.documents);
		req.header("Content-Type", "application/json");
		(await req.end/* async call */(Websom.Json.encode(res)));}

Websom.EndpointHandler = function (server) {var _c_this = this;
	this.server = null;

		_c_this.server = server;
}

Websom.EndpointHandler.prototype.fulfill = function (cir, req) {var _c_this = this; var _c_root_method_arguments = arguments;
}

Websom.InsertHandler = function (server) {var _c_this = this;
	this.server = null;

		_c_this.server = server;
}

/*i async*/Websom.InsertHandler.prototype.fulfill = async function (cir, req) {var _c_this = this; var _c_root_method_arguments = arguments;
/*async*/
		var collection = cir.collection.collection;
		if (collection.appliedSchema == null) {
/*async*/
			(await req.endWithError/* async call */("This collection has no schema applied"));
			return null;
			}
		if (("document" in req.body) == false) {
/*async*/
			(await req.endWithError/* async call */("No document provided"));
			return null;
			}
		var clientValues = req.body["document"];
		if ((typeof clientValues == 'object' ? (Array.isArray(clientValues) ? 'array' : 'map') : (typeof clientValues == 'number' ? 'float' : typeof clientValues)) != "map") {
/*async*/
			(await req.endWithError/* async call */("Document must be an object"));
			return null;
			}
		var query = collection.insert();
		for (var i = 0; i < cir.sets.length; i++) {
			var set = cir.sets[i];
			query.set(set.field, set.value);
			}
		for (var i = 0; i < cir.computedSets.length; i++) {
/*async*/
			var set = cir.computedSets[i];
			query.set(set.field, (await set.compute/* async call */(req)));
			}
		for (var i = 0; i < cir.writes.length; i++) {
/*async*/
			var write = cir.writes[i];
			if ((write.field in clientValues) == false) {
/*async*/
				(await req.endWithError/* async call */("Field '" + write.field + "' must be not null"));
				return null;
				}
			if (clientValues[write.field] == null) {
/*async*/
				(await req.endWithError/* async call */("Field '" + write.field + "' must be not null"));
				return null;
				}
			var clientValue = clientValues[write.field];
			var schemaField = collection.appliedSchema.getField(write.field);
			if (schemaField == null) {
/*async*/
				(await req.endWithError/* async call */("Field '" + write.field + "' has no schema type"));
				return null;
				}
			if (_c_this.typeCheck(clientValue, schemaField)) {
/*async*/
				for (var r = 0; r < write.restrictions.length; r++) {
/*async*/
					var restriction = write.restrictions[r];
					try {
/*async*/
						if ((await restriction.testServer/* async call */(collection, schemaField, clientValue)) == false) {
/*async*/
							(await req.endWithError/* async call */(restriction.message(schemaField.name, clientValue)));
							return null;
							}
					} catch (_carb_catch_var) {
						if (_carb_catch_var instanceof Error || typeof _carb_catch_var == 'undefined' || _carb_catch_var === null) {
							var e = _carb_catch_var;
/*async*/
						(await req.endWithError/* async call */("Exception in restriction"));
						return null;
						}
					}
					}
				for (var m = 0; m < write.mutators.length; m++) {
/*async*/
					var mutator = write.mutators[m];
					try {
/*async*/
						clientValue = (await mutator.mutate/* async call */(collection, req, clientValue));
					} catch (_carb_catch_var) {
						if (_carb_catch_var instanceof Error || typeof _carb_catch_var == 'undefined' || _carb_catch_var === null) {
							var e = _carb_catch_var;
/*async*/
						(await req.endWithError/* async call */("Exception in mutation"));
						return null;
						}
					}
					}
				query.set(write.field, clientValue);
				}else{
/*async*/
					(await req.endWithError/* async call */("'" + write.field + "' is of an invalid type"));
					return null;
				}
			}
		(await query.run/* async call */());
		var res = {};
		cir.trigger("success", req, []);
		res["status"] = "success";
		res["message"] = "Document inserted";
		req.header("Content-Type", "application/json");
		req.header("Access-Control-Allow-Origin", "*");
		(await req.end/* async call */(Websom.Json.encode(res)));}

Websom.InsertHandler.prototype.typeCheck = function (value, schemaField) {var _c_this = this; var _c_root_method_arguments = arguments;
		return _c_this.server.security.typeCheck(value, schemaField.type);}

Websom.SelectHandler = function (server) {var _c_this = this;
	this.server = null;

		_c_this.server = server;
}

/*i async*/Websom.SelectHandler.prototype.fulfill = async function (cir, req) {var _c_this = this; var _c_root_method_arguments = arguments;
/*async*/
		var filterName = req.body["filter"];
		if ((typeof filterName == 'object' ? (Array.isArray(filterName) ? 'array' : 'map') : (typeof filterName == 'number' ? 'float' : typeof filterName)) != "string") {
			filterName = "default";
			}
		var filter = cir.findFilter(filterName);
		if (filter == null) {
/*async*/
			(await req.endWithError/* async call */("Unknown filter provided"));
			return null;
			}
		var collection = cir.collection.collection;
		var query = collection.select();
		var out = (await _c_this.buildQuery/* async call */(cir, filter, req, query));
		if (out == null) {
			return null;
			}
		(await _c_this.executeQuery/* async call */(cir, filter, req, query));}

/*i async*/Websom.SelectHandler.prototype.buildQuery = async function (cir, filter, req, query) {var _c_this = this; var _c_root_method_arguments = arguments;
/*async*/
		var collection = cir.collection.collection;
		var limit = filter.limits[0];
		if ("limit" in req.body) {
			var reqLimit = req.body["limit"];
			for (var i = 0; i < filter.limits.length; i++) {
				var l = filter.limits[i];
				if (reqLimit == l) {
					limit = l;
					}
				}
			}
		var offset = 0;
		if ("page" in req.body) {
			var page = req.body["page"];
			if ((typeof page == 'object' ? (Array.isArray(page) ? 'array' : 'map') : (typeof page == 'number' ? 'float' : typeof page)) == "float") {
				var pageAsFloat = page;
				if (pageAsFloat % 1 === 0) {
					offset = pageAsFloat * limit;
					}
				}
			}
		query.startOffset(offset);
		query.limit(limit);
		for (var i = 0; i < filter.forces.length; i++) {
			var force = filter.forces[i];
			query.where(force.name, force.operator, force.value);
			}
		for (var i = 0; i < filter.orders.length; i++) {
			var order = filter.orders[i];
			var ordered = false;
			if ("order" in req.body) {
				var clientOrder = req.body["order"];
				if ((typeof clientOrder == 'object' ? (Array.isArray(clientOrder) ? 'array' : 'map') : (typeof clientOrder == 'number' ? 'float' : typeof clientOrder)) == "map") {
					var orderField = clientOrder["field"];
					var orderDirection = clientOrder["direction"];
					if ((typeof orderField == 'object' ? (Array.isArray(orderField) ? 'array' : 'map') : (typeof orderField == 'number' ? 'float' : typeof orderField)) == "string") {
						var allowed = false;
						var schema = collection.appliedSchema;
						if (order.name == "*") {
							for (var f = 0; f < schema.fields.length; f++) {
								var schemaField = schema.fields[f];
								if (schemaField.name == orderField) {
									allowed = true;
									}
								}
							}else if (order.name == orderField) {
							allowed = true;
							}
						if (orderDirection != "dsc" && orderDirection != "asc") {
							allowed = false;
							}
						if (allowed) {
							query.orderBy(orderField, orderDirection);
							ordered = true;
							}
						}
					}
				}
			if (ordered == false) {
				if (order.name == "*") {
					query.orderBy("id", order.operator);
					}else{
						query.orderBy(order.name, order.operator);
					}
				}
			}
		var clientQuery = req.body["query"];
		if ((typeof clientQuery == 'object' ? (Array.isArray(clientQuery) ? 'array' : 'map') : (typeof clientQuery == 'number' ? 'float' : typeof clientQuery)) != "map") {
/*async*/
			(await req.endWithError/* async call */("Query must be an object. ( e.g. { name: Hello } )"));
			return null;
			}
		for (var i = 0; i < filter.fields.length; i++) {
/*async*/
			var field = filter.fields[i];
			if (field.name in clientQuery) {
				query.where(field.name, field.operator, clientQuery[field.name]);
				}else{
/*async*/
					(await req.endWithError/* async call */("No query for field '" + field.name + "' was provided."));
					return null;
				}
			}
		for (var i = 0; i < filter.computed.length; i++) {
			var field = filter.computed[i];
			var value = null;
			
				value = await field.handler(req);
			
			
			if (req.sent) {
				return null;
				}
			query.where(field.name, field.operator, value);
			}
		if (filter.handler != null) {
			
				await filter.handler(req, query);
			
			
			}
		if (req.sent) {
			return null;
			}
		return query;}

/*i async*/Websom.SelectHandler.prototype.executeQuery = async function (cir, filter, req, query) {var _c_this = this; var _c_root_method_arguments = arguments;
/*async*/
		var collection = cir.collection.collection;
		var res = {};
		res["status"] = "success";
		res["message"] = "Query successful!";
		var output = [];
		var results = (await query.get/* async call */());
		var returnFields = req.body["fields"];
		if ((typeof returnFields == 'object' ? (Array.isArray(returnFields) ? 'array' : 'map') : (typeof returnFields == 'number' ? 'float' : typeof returnFields)) != "map") {
/*async*/
			(await req.endWithError/* async call */("No fields object provided. See the api request docs."));
			return null;
			}
		for (var i = 0; i < results.documents.length; i++) {
/*async*/
			var doc = results.documents[i];
			var mp = {};
			if (cir.reads.length > 0) {
/*async*/
				if (cir.reads[0].field == "*") {
/*async*/
					if (collection.appliedSchema == null) {
/*async*/
						(await req.endWithError/* async call */("This collection has no schema applied"));
						return null;
						}
					var schema = collection.appliedSchema;
					for (var f = 0; f < schema.fields.length; f++) {
						var field = schema.fields[f];
						mp[field.name] = doc.get(field.name);
						}
					}
				}
			for (var j = 0; j < cir.reads.length; j++) {
/*async*/
				var read = cir.reads[j];
				if (read.field in returnFields || "*" in returnFields) {
/*async*/
					var val = doc.get(read.field);
					for (var t = 0; t < read.transformers.length; t++) {
/*async*/
						var transformer = read.transformers[t];
						val = (await transformer.transform/* async call */(req, doc, read.field, val));
						}
					mp[read.field] = val;
					}
				}
			if ("*" in returnFields) {
				mp["id"] = doc.get("id");
				}
			output.push(mp);
			}
		res["documents"] = output;
		cir.trigger("success", req, results.documents);
		req.header("Content-Type", "application/json");
		(await req.end/* async call */(Websom.Json.encode(res)));}

Websom.Standard = function () {var _c_this = this;


}

Oxygen.FileSystem = function () {var _c_this = this;


}

Oxygen.FileSystem.readSync = function (location, format) {var _c_this = this; var _c_root_method_arguments = arguments;
return require('fs').readFileSync(arguments[0], arguments[1])}

Oxygen.FileSystem.read = function (location, format, callback) {var _c_this = this; var _c_root_method_arguments = arguments;
require('fs').readFile(arguments[0], arguments[1], arguments[2])}

Oxygen.FileSystem.write = function (location, content, callback) {var _c_this = this; var _c_root_method_arguments = arguments;
require('fs').writeFile(arguments[0], arguments[1], arguments[2])}

Oxygen.FileSystem.writeSync = function (location, content) {var _c_this = this; var _c_root_method_arguments = arguments;
return require('fs').writeFileSync(arguments[0], arguments[1])}

Oxygen.FileSystem.statSync = function (location) {var _c_this = this; var _c_root_method_arguments = arguments;
return Oxygen.FileSystem.Stat.fromMap(require('fs').statSync(arguments[0]))}

Oxygen.FileSystem.prototype.stat = function (location, callback) {var _c_this = this; var _c_root_method_arguments = arguments;
}

Oxygen.FileSystem.prototype.openSync = function (location, flags) {var _c_this = this; var _c_root_method_arguments = arguments;
}

Oxygen.FileSystem.prototype.open = function (location, flags, callback) {var _c_this = this; var _c_root_method_arguments = arguments;
}

Oxygen.FileSystem.readDirSync = function (location) {var _c_this = this; var _c_root_method_arguments = arguments;
return require('fs').readdirSync(arguments[0]);}

Oxygen.FileSystem.dirName = function (location) {var _c_this = this; var _c_root_method_arguments = arguments;
return require('path').dirname(arguments[0]);}

Oxygen.FileSystem.normalize = function (path) {var _c_this = this; var _c_root_method_arguments = arguments;
return require('path').normalize(arguments[0]);}

Oxygen.FileSystem.resolve = function (path) {var _c_this = this; var _c_root_method_arguments = arguments;
return require('path').resolve(arguments[0]);}

Oxygen.FileSystem.isDir = function (location) {var _c_this = this; var _c_root_method_arguments = arguments;
const _fs = require('fs'); return _fs.lstatSync(_fs.realpathSync(arguments[0])).isDirectory();}

Oxygen.FileSystem.exists = function (location) {var _c_this = this; var _c_root_method_arguments = arguments;
return require('fs').existsSync(arguments[0])}

Oxygen.FileSystem.basename = function (location) {var _c_this = this; var _c_root_method_arguments = arguments;
return require('path').basename(arguments[0])}

Oxygen.FileSystem.makeDir = function (location) {var _c_this = this; var _c_root_method_arguments = arguments;
require('fs').mkdirSync(arguments[0])}

Oxygen.FileSystem.unlink = function (path) {var _c_this = this; var _c_root_method_arguments = arguments;
require('fs').unlinkSync(arguments[0])}

Oxygen.FileSystem.Stat = function () {var _c_this = this;
	this.dev = 0;

	this.ino = 0;

	this.mode = 0;

	this.nlink = 0;

	this.uid = 0;

	this.gid = 0;

	this.rdev = 0;

	this.size = 0;

	this.blksize = 0;

	this.blocks = 0;

	this.atime = 0;

	this.mtime = 0;

	this.ctime = 0;

	this.birthtime = 0;

	this.dev = 0;

	this.ino = 0;

	this.mode = 0;

	this.nlink = 0;

	this.uid = 0;

	this.gid = 0;

	this.rdev = 0;

	this.size = 0;

	this.blksize = 0;

	this.blocks = 0;

	this.atime = 0;

	this.mtime = 0;

	this.ctime = 0;

	this.birthtime = 0;


}

Oxygen.FileSystem.Stat.fromMap = function (data) {var _c_this = this; var _c_root_method_arguments = arguments;
		var stat = new Oxygen.FileSystem.Stat();
		stat.dev = data["dev"];
		stat.ino = data["ino"];
		stat.mode = data["mode"];
		stat.nlink = data["nlink"];
		stat.uid = data["uid"];
		stat.gid = data["gid"];
		stat.rdev = data["rdev"];
		stat.size = data["size"];
		stat.blksize = data["blksize"];
		stat.blocks = data["blocks"];
		stat.atime = data["atimeMs"];
		stat.mtime = data["mtimeMs"];
		stat.ctime = data["ctimeMs"];
		stat.birthtime = data["birthtimeMs"];
		return stat;}

Websom.Micro.Command = function (server) {var _c_this = this;
	this.commands = [];

	this.server = null;

		_c_this.server = server;
}

Websom.Micro.Command.prototype.start = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		var that = _c_this;
		_c_this.register("help").command("[command]").on(function (invo) {
			var name = invo.get("command");
			invo.output("----------- HELP -----------");
			invo.output("	- Commands:");
			if (name != null) {

				}else{
					for (var i = 0; i < that.commands.length; i++) {
						var cmd = that.commands[i];
						invo.output("		- " + invo.bold(cmd.name));
						for (var j = 0; j < cmd.patterns.length; j++) {
							var ptrn = cmd.patterns[j];
							invo.output("			- " + ptrn.pattern.replace(new RegExp("[".replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&'), 'g'), invo.color("#9fd0ff", "[")).replace(new RegExp("]".replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&'), 'g'), invo.color("#9fd0ff", "]")));
							}
						}
				}
			invo.finish();
			});
		_c_this.register("promote").command("<username> <role>").on(async function (invo) {
/*async*/
			var role = invo.get("role");
			var username = invo.get("username");
			if (_c_this.server.userSystem != null) {
/*async*/
				(await _c_this.server.userSystem.users.update().where("username", "==", username).set("role", role).run/* async call */());
				console.log("Promoted to " + role);
				invo.finish();
				}
			});
		_c_this.register("install").command("<name>").on(function (invo) {
			var package = invo.get("name");
			if (_c_this.server.config.dev) {
				
						const packageManager = require("../../platform/node/packageManager.js");

						packageManager.install(_c_this.server.config.root, package).then(() => {
							invo.finish();
						});
					
				}
			});
		_c_this.register("link").command("<name>").on(function (invo) {
			var package = invo.get("name");
			if (_c_this.server.config.dev) {
				
						const packageManager = require("../../platform/node/packageManager.js");

						packageManager.install(_c_this.server.config.root, package, true).then(() => {
							invo.finish();
						});
					
				}
			});
		_c_this.register("deploy").command("<name>").on(function (invo) {
			that.server.resource.deploy(invo.get("name"), function (msg) {
				invo.output(msg);
				}, function () {
				invo.finish();
				});
			});
		_c_this.register("analyze").command("").on(function (invo) {
			that.server.resource.analyze();
			});
		_c_this.register("theme").command("init <name> <author> [version=\"1.0\"]").flag("option").default("Value").cook().on(function (invo) {

			});
		_c_this.register("test").command("<name>").on(function (invo) {
			invo.output("Starting command with name " + invo.get("name"));
			invo.output("Waiting 2 seconds");
			
					setTimeout(() => {
						invo.output("After");
						invo.finish();
					}, 2000);
				
			
			});}

Websom.Micro.Command.prototype.register = function (topName) {var _c_this = this; var _c_root_method_arguments = arguments;
		var cmd = new Websom.Command(_c_this.server, topName);
		_c_this.commands.push(cmd);
		return cmd;}

/*i async*/Websom.Micro.Command.prototype.exec = async function () {var _c_this = this; var _c_root_method_arguments = arguments;
	if (arguments.length == 2 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null) && ((arguments[1] instanceof Websom.Request || (arguments[1] instanceof Websom.SinkRequest)) || typeof arguments[1] == 'undefined' || arguments[1] === null)) {
		var command = arguments[0];
		var req = arguments[1];
		var inv = new Websom.CommandInvocation(_c_this.server, command);
		inv.request = req;
		inv.sender = "Console";
		inv.local = false;
		inv.parse();
		var found = inv.search(_c_this.commands);
		if (found != null) {
			found.cook();
			var out = found.run(inv);
			if (out == null) {
				found.handler(inv);
				}else{
					req.send("{\"status\": \"error\", \"message\": " + Websom.Json.encode(out) + "}");
				}
			}else{
				req.send("{\"status\": \"error\", \"message\": \"Unknown command\"}");
			}
	}
else 	if (arguments.length == 2 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'function' || typeof arguments[1] == 'undefined' || arguments[1] === null)) {
		var command = arguments[0];
		var completedHook = arguments[1];
		var inv = new Websom.CommandInvocation(_c_this.server, command);
		inv.completedHook = completedHook;
		inv.parse();
		var outputChain = "";
		var found = inv.search(_c_this.commands);
		inv.color = function (color, content) {
			
				const chalk = require("chalk");
				return chalk.hex(color)(content);
			
			return content;
			};
		inv.bold = function (content) {
			
				const chalk = require("chalk");
				return chalk.bold(content);
			
			return content;
			};
		inv.handler = function (status, msg) {
			
				const chalk = require("chalk");

				if (status)
					outputChain += chalk.red(msg) + "\n";
				else
					outputChain += msg + "\n";
				
				return;
			
			outputChain += msg + "\n";
			};
		if (found != null) {
			found.cook();
			var output = found.run(inv);
			
			
				await found.handler(inv);
			
			console.log(outputChain);
			}else{
				console.log("[ERROR] Unknown command");
				completedHook();
			}
	}
}

Websom.Command = function (server, name) {var _c_this = this;
	this.server = null;

	this.name = "";

	this.patterns = [];

		_c_this.server = server;
		_c_this.name = name;
}

Websom.Command.prototype.command = function (pattern) {var _c_this = this; var _c_root_method_arguments = arguments;
		var pat = new Websom.CommandPattern(_c_this, pattern);
		_c_this.patterns.push(pat);
		return pat;}

Websom.CommandFlag = function (parent, name, type, defVal) {var _c_this = this;
	this.parent = null;

	this.name = "";

	this._type = "";

	this._default = null;

		_c_this.parent = parent;
		_c_this.name = name;
		_c_this._type = type;
		_c_this._default = defVal;
}

Websom.CommandFlag.prototype.type = function (type) {var _c_this = this; var _c_root_method_arguments = arguments;
		_c_this._type = type;
		return _c_this;}

Websom.CommandFlag.prototype.default = function (val) {var _c_this = this; var _c_root_method_arguments = arguments;
		_c_this._default = val;
		return _c_this;}

Websom.CommandFlag.prototype.flag = function (name) {var _c_this = this; var _c_root_method_arguments = arguments;
		return _c_this.parent.flag(name);}

Websom.CommandFlag.prototype.command = function (pattern) {var _c_this = this; var _c_root_method_arguments = arguments;
		return _c_this.parent.parent.command(pattern);}

Websom.CommandFlag.prototype.cook = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		_c_this.parent.cook();
		return _c_this;}

Websom.CommandFlag.prototype.on = function (run) {var _c_this = this; var _c_root_method_arguments = arguments;
		return _c_this.parent.on(run);}

Websom.CommandPart = function (name, type) {var _c_this = this;
	this.type = 2;

	this.optional = false;

	this.default = null;

	this.name = "";

		_c_this.name = name;
		_c_this.type = type;
}

Websom.CommandPattern = function (parent, pattern) {var _c_this = this;
	this.cooked = false;

	this.parent = null;

	this.pattern = null;

	this.flags = [];

	this.handler = null;

	this.parts = [];

		_c_this.parent = parent;
		_c_this.pattern = pattern;
}

Websom.CommandPattern.prototype.flag = function (name) {var _c_this = this; var _c_root_method_arguments = arguments;
		var flag = new Websom.CommandFlag(_c_this, name, "string", null);
		_c_this.flags.push(flag);
		return flag;}

Websom.CommandPattern.prototype.command = function (pattern) {var _c_this = this; var _c_root_method_arguments = arguments;
		return _c_this.parent.command(pattern);}

Websom.CommandPattern.prototype.on = function (run) {var _c_this = this; var _c_root_method_arguments = arguments;
		_c_this.handler = run;
		return _c_this;}

Websom.CommandPattern.prototype.run = function (invocation) {var _c_this = this; var _c_root_method_arguments = arguments;
		for (var i = 0; i < _c_this.parts.length; i++) {
			var part = _c_this.parts[i];
			if (invocation.arguments.length - 1 > i) {
				var arg = invocation.arguments[i + 1];
				if (part.type == 1) {

					}else{
						invocation.values[part.name] = arg;
					}
				}else{
					if (part.type != 2 || part.optional == false) {
						return part.name + " argument required on command";
						}else{
							invocation.values[part.name] = part.default;
						}
				}
			}
		return null;}

Websom.CommandPattern.prototype.match = function (invocation) {var _c_this = this; var _c_root_method_arguments = arguments;
		for (var i = 0; i < _c_this.parts.length; i++) {
			var part = _c_this.parts[i];
			if (invocation.arguments.length - 1 >= i) {
				var arg = invocation.arguments[i + 1];
				if (part.type == 1) {
					if (arg != part.name) {
						return false;
						}
					}
				}
			}
		return true;}

Websom.CommandPattern.prototype.buildParts = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		var isOpen = false;
		var isEquals = false;
		var openPart = "";
		var closePart = "";
		var build = "";
		var equals = "";
		for (var i = 0; i < _c_this.pattern.length; i++) {
			var char = _c_this.pattern[i];
			if (openPart.length > 0 && closePart != char) {
				if (isEquals) {
					equals += char;
					}else{
						build += char;
					}
				if (char == "=") {
					isEquals = true;
					}
				}else if (openPart.length == 0 && char != " ") {
				if (char == "<") {
					openPart = "<";
					closePart = ">";
					isOpen = true;
					}else if (char == "[") {
					openPart = "[";
					closePart = "]";
					isOpen = true;
					}else{
						isOpen = true;
						build += char;
					}
				}else if (isOpen == true && ((char == " ") || closePart == char)) {
				isOpen = false;
				var type = 2;
				if (openPart == "") {
					type = 1;
					}
				var part = new Websom.CommandPart(build, type);
				part.optional = openPart == "[";
				if (equals.length > 0) {
					part.default = Websom.Json.parse(equals);
					}
				_c_this.parts.push(part);
				openPart = "";
				closePart = "";
				isOpen = false;
				isEquals = false;
				build = "";
				equals = "";
				}
			}}

Websom.CommandPattern.prototype.cook = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		if (_c_this.cooked) {
			return _c_this;
			}
		_c_this.cooked = true;
		_c_this.buildParts();
		return _c_this;}

Websom.CommandInvocation = function (server, raw) {var _c_this = this;
	this.local = true;

	this.request = null;

	this.sender = "Unknown";

	this.handler = null;

	this.completedHook = null;

	this.color = null;

	this.bold = null;

	this.pattern = null;

	this.server = null;

	this.flags = {};

	this.values = {};

	this.rawOutput = [];

	this.arguments = [];

	this.raw = "";

		_c_this.server = server;
		_c_this.raw = raw;
}

Websom.CommandInvocation.prototype.get = function (name) {var _c_this = this; var _c_root_method_arguments = arguments;
		if (name in _c_this.values) {
			return _c_this.values[name];
			}else{
				return null;
			}}

Websom.CommandInvocation.prototype.error = function (message) {var _c_this = this; var _c_root_method_arguments = arguments;
		if (_c_this.local) {
			_c_this.handler(true, message);
			}else{
				_c_this.request.send("{\"status\": \"error\", \"message\": " + Websom.Json.encode(message) + "}");
			}}

Websom.CommandInvocation.prototype.output = function (message) {var _c_this = this; var _c_root_method_arguments = arguments;
		if (_c_this.local) {
			_c_this.handler(false, message);
			}else{
				_c_this.rawOutput.push("{\"status\": \"chunk\", \"message\": " + Websom.Json.encode(message) + "}");
			}}

Websom.CommandInvocation.prototype.finish = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		if (_c_this.local == false) {
			_c_this.request.send("[" + _c_this.rawOutput.join(", ") + "]");
			}
		if (_c_this.completedHook != null) {
			_c_this.completedHook();
			}}

Websom.CommandInvocation.prototype.searchPatterns = function (patterns) {var _c_this = this; var _c_root_method_arguments = arguments;
		for (var i = 0; i < patterns.length; i++) {
			var pattern = patterns[i];
			if (pattern.match(_c_this)) {
				return pattern;
				}
			}
		return null;}

Websom.CommandInvocation.prototype.search = function (commands) {var _c_this = this; var _c_root_method_arguments = arguments;
		for (var i = 0; i < commands.length; i++) {
			var command = commands[i];
			if (command.name == _c_this.arguments[0]) {
				return _c_this.searchPatterns(command.patterns);
				}
			}
		return null;}

Websom.CommandInvocation.prototype.parse = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		var build = "";
		var builds = [];
		var isOpen = false;
		var openString = "";
		var escape = false;
		var flagName = "";
		for (var i = 0; i < _c_this.raw.length; i++) {
			var char = _c_this.raw[i];
			if (isOpen == false && char == " ") {
				if (build.length > 0) {
					if (openString == "" && build.length > 2 && build[0] == "-" && build[1] == "-") {
						flagName = build.substr(2,build.length - 1);
						}else if (flagName == "") {
						builds.push(build);
						}else{
							_c_this.flags[flagName] = build;
							flagName = "";
						}
					build = "";
					openString = "";
					escape = false;
					}
				}else{
					if (char == "\"" || char == "'") {
						if (escape) {
							build += char;
							escape = false;
							}else if (isOpen && char == openString) {
							isOpen = false;
							}else if (char == "\\") {
							escape = true;
							}else{
								isOpen = true;
								openString = char;
							}
						}else{
							build += char;
						}
				}
			}
		if (build.length > 0) {
			if (flagName.length > 0) {
				_c_this.flags[flagName] = build;
				}else{
					builds.push(build);
				}
			}
		_c_this.arguments = builds;}

Websom.Micro.Sitemap = function (server) {var _c_this = this;
	this.loaded = false;

	this.data = null;

	this.sitemapOptions = "";

	this.sitemapFile = "";

	this.sitemapOutput = "/sitemap.xml";

	this.server = null;

		_c_this.server = server;
}

Websom.Micro.Sitemap.prototype.start = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		var that = _c_this;
		var sitemapOptions = _c_this.server.config.root + "/sitemap.json";
		_c_this.sitemapOptions = sitemapOptions;
		var sitemapFile = _c_this.server.config.root + "/sitemap.txt";
		_c_this.sitemapFile = sitemapFile;
		if (_c_this.server.config.dev) {
			if (Oxygen.FileSystem.exists(sitemapOptions) == false) {
				Oxygen.FileSystem.writeSync(sitemapOptions, "{\n	\"items\": []\n}");
				}
			}
		_c_this.server.command("sitemap").command("build [map=*]").on(function (invo) {
			var name = invo.get("command");
			invo.output("- Building sitemap");
			that.load();
			that.build(that.data["items"], that.server.config.resources + that.sitemapOutput);
			invo.output("- <span style='color: lime;'>Finished</span>");
			invo.finish();
			});}

Websom.Micro.Sitemap.prototype.build = function (baseUrls, outputPath) {var _c_this = this; var _c_root_method_arguments = arguments;
		var outs = "<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">";
		for (var i = 0; i < baseUrls.length; i++) {
			outs += "\n	<url>\n		<loc>" + _c_this.server.config.url + baseUrls[i] + "</loc>\n	</url>";
			}
		Oxygen.FileSystem.writeSync(outputPath, outs + "\n</urlset>");}

Websom.Micro.Sitemap.prototype.load = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		_c_this.data = Websom.Json.parse(Oxygen.FileSystem.readSync(_c_this.sitemapOptions, "utf8"));}

Websom.Micro.Text = function (server) {var _c_this = this;
	this.loaded = false;

	this.data = null;

	this.textFile = "";

	this.server = null;

		_c_this.server = server;
}

Websom.Micro.Text.prototype.start = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		var that = _c_this;
		if (_c_this.server.config.legacy) {
			var textFile = _c_this.server.config.root + "/text.json";
			_c_this.textFile = textFile;
			if (_c_this.server.config.dev) {
				if (Oxygen.FileSystem.exists(textFile) == false) {
					Oxygen.FileSystem.writeSync(textFile, "{}");
					}
				if (Oxygen.FileSystem.exists(_c_this.server.config.resources + "/text.js") == false) {
					Oxygen.FileSystem.writeSync(_c_this.server.config.resources + "/text.js", "Websom.text = {\"*\": {}};");
					}
				}
			}
		_c_this.server.input.interface("text.edit").restrict().to("permission", "text.edit").key("rule").is("string").length(1, 256).key("name").is("string").length(1, 512).key("text").is("string").length(0, 10000).success(function (input, cooked) {
			var data = input.raw;
			that.load();
			if ((data["rule"] in that.data) == false) {
				that.data[data["rule"]] = {};
				}
			that.data[data["rule"]][data["name"]] = data["text"];
			that.save();
			input.sendSuccess("Saved");
			});}

Websom.Micro.Text.prototype.save = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		var encoded = Websom.Json.encode(_c_this.data);
		Oxygen.FileSystem.writeSync(_c_this.textFile, encoded);
		Oxygen.FileSystem.writeSync(_c_this.server.config.resources + "/text.js", "Websom.text = " + encoded + ";");}

Websom.Micro.Text.prototype.load = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		if (_c_this.loaded == false) {
			_c_this.data = Websom.Json.parse(Oxygen.FileSystem.readSync(_c_this.textFile, "utf8"));
			}}

Websom.Containers.Table = function () {var _c_this = this;
	this.load = null;

	this.create = null;

	this.info = null;

	this.selectHook = null;

	this.subParent = null;

	this.table = "";

	this.tableEntityName = "";

	this.server = null;

	this.name = "";

	this.dataInfo = null;

	this.parentContainer = null;

	this.interfaces = [];

	if (arguments.length == 4 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'function' || typeof arguments[1] == 'undefined' || arguments[1] === null) && (typeof arguments[2] == 'function' || typeof arguments[2] == 'undefined' || arguments[2] === null) && (typeof arguments[3] == 'function' || typeof arguments[3] == 'undefined' || arguments[3] === null)) {
		var tableName = arguments[0];
		var create = arguments[1];
		var load = arguments[2];
		var info = arguments[3];

	}
else 	if (arguments.length == 3 && ((arguments[0] instanceof Websom.Server) || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'string' || typeof arguments[1] == 'undefined' || arguments[1] === null) && ((arguments[2] instanceof Websom.DataInfo) || typeof arguments[2] == 'undefined' || arguments[2] === null)) {
		var server = arguments[0];
		var tableName = arguments[1];
		var info = arguments[2];
		_c_this.server = server;
		_c_this.table = tableName;
		_c_this.name = tableName;
		_c_this.dataInfo = info;
		_c_this.tableEntityName = tableName;
	}

}

Websom.Containers.Table.prototype.realize = function (db, done) {var _c_this = this; var _c_root_method_arguments = arguments;
		var str = _c_this.dataInfo.buildStructure();
		var subs = _c_this.dataInfo.buildLinkedStructures(_c_this.tableEntityName);
		str.database = db;
		str.table = _c_this.table;
		var builts = 0;
		var errors = "";
		var built = function (err) {
			builts--;
			if (err.length > 0) {
				errors += err + "\n";
				}
			if (builts == 0) {
				done(errors);
				}
			};
		builts++;
		builts+=subs.length;
		str.run(built);
		for (var i = 0; i < subs.length; i++) {
			var subStr = subs[i];
			subStr.database = db;
			subStr.table = _c_this.table + "_" + subStr.table;
			subStr.run(built);
			}}

Websom.Containers.Table.loadArray = function (query, type, callback) {var _c_this = this; var _c_root_method_arguments = arguments;
		var db = query.database;
		var table = query.table;
		var dataInfo = Websom.DataInfo.getDataInfoFromRoute(type);
		var container = new Websom.Containers.Table(db.server, table, dataInfo);
		var arr = [];
		query.run(function (err, docs) {
			var dones = docs.length;
			if (docs.length == 0) {
				callback(arr);
				}
			for (var i = 0; i < docs.length; i++) {
				var doc = docs[i];
				var obj = dataInfo.spawn(db.server);
				obj.websomContainer = container;
				arr.push(obj);
				obj.nativeLoadFromMap(doc, function (err2) {
					dones--;
					if (dones == 0) {
						callback(arr);
						}
					});
				}
			});}

Websom.Containers.Table.prototype.insert = function (data, done) {var _c_this = this; var _c_root_method_arguments = arguments;
		var insert = _c_this.server.database.primary.into(_c_this.table);
		for (var i = 0; i < _c_this.dataInfo.fields.length; i++) {
			var field = _c_this.dataInfo.fields[i];
			var value = null;
			if (field.isPrimitive) {
				
					value = data[field.realName];
				
				
				}
			insert.set(field.fieldName, value);
			}
		insert.run(done);}

Websom.Containers.Table.prototype.setupSubSorts = function (data) {var _c_this = this; var _c_root_method_arguments = arguments;
		for (var i = 0; i < _c_this.dataInfo.fields.length; i++) {
			var field = _c_this.dataInfo.fields[i];
			if ("NoLoad" in field.attributes) {
				var mp = {};
				mp["container"] = _c_this.table;
				mp["sub"] = field.fieldName;
				mp["target"] = "";
				data[field.fieldName] = mp;
				}
			}}

Websom.Containers.Table.prototype.handleInlineSubSelects = function (opts, input, parent, docData, subFields, loaded) {var _c_this = this; var _c_root_method_arguments = arguments;
		var that = _c_this;
		var fields = subFields.length;
		var checkDone = function () {
			fields--;
			if (fields <= 0) {
				loaded(docData);
				}
			};
		for (var si = 0; si < subFields.length; si++) {
			var close = function (i) {
				var field = subFields[i];
				var subOpts = opts.subs[field.fieldName];
				var link = field.structure.getFlag("linked");
				var subInfo = Websom.DataInfo.getDataInfoFromRoute(link.fieldType);
				var tbl = new Websom.Containers.Table(that.server, that.table + "_" + field.fieldName, subInfo);
				tbl.subParent = parent;
				tbl.selectHook = function (subDocs) {
					docData[field.fieldName] = subDocs;
					checkDone();
					};
				tbl.interfaceSelect(subOpts, new Websom.Input("", input.raw[field.fieldName], input.request), new Websom.CallContext());
				};
			close(si);
			}
		if (subFields.length == 0) {
			loaded(docData);
			}}

Websom.Containers.Table.prototype.handleSubSelect = function (opts, input, ctx) {var _c_this = this; var _c_root_method_arguments = arguments;
		var that = _c_this;
		if ((typeof input.raw["parentDocument"] == 'object' ? (Array.isArray(input.raw["parentDocument"]) ? 'array' : 'map') : (typeof input.raw["parentDocument"] == 'number' ? 'float' : typeof input.raw["parentDocument"])) != "string") {
			input.sendError("Invalid parentDocument input");
			return null;
			}
		var docPublicId = input.raw["parentDocument"];
		var parentTable = _c_this.parentContainer;
		parentTable.loadFromSelect(parentTable.from().where("publicId").equals(docPublicId), function (docs) {
			if (docs.length == 0) {
				input.sendError("Invalid document");
				return null;
				}
			ctx.subContainerCall = true;
			ctx.data = docs[0];
			that.interfaceSelect(opts, input, ctx);
			});}

Websom.Containers.Table.prototype.handleSubInsert = function (opts, input, values, message, fieldInfo, parentData, callback, ctx) {var _c_this = this; var _c_root_method_arguments = arguments;
		var that = _c_this;
		if ((typeof input.raw["parentDocument"] == 'object' ? (Array.isArray(input.raw["parentDocument"]) ? 'array' : 'map') : (typeof input.raw["parentDocument"] == 'number' ? 'float' : typeof input.raw["parentDocument"])) != "string") {
			input.sendError("Invalid parentDocument input");
			return null;
			}
		var docPublicId = input.raw["parentDocument"];
		var parentTable = _c_this.parentContainer;
		parentTable.loadFromSelect(parentTable.from().where("publicId").equals(docPublicId), function (docs) {
			if (docs.length == 0) {
				input.sendError("Invalid document");
				return null;
				}
			var doCall = function () {
				ctx.subContainerCall = true;
				ctx.data = docs[0];
				that.insertFromInterfaceCallback(opts, input, values, message, fieldInfo, parentData, callback, ctx);
				};
			if (opts.mustOwnInsert) {

				}else{
					doCall();
				}
			});}

Websom.Containers.Table.prototype.interfaceSelect = function (opts, input, ctx) {var _c_this = this; var _c_root_method_arguments = arguments;
		var that = _c_this;
		if (opts.canSelect) {
			if (opts.overrideSelect != null) {
				opts.overrideSelect(input);
				}else{
					var subParent = null;
					if ("parentDocument" in input.raw && input.raw["parentDocument"] != null && ctx.subContainerCall == false) {
						_c_this.handleSubSelect(opts, input, ctx);
						return null;
						}
					if (ctx.subContainerCall) {
						subParent = ctx.data;
						}
					var subFields = [];
					var publicFields = [];
					for (var i = 0; i < _c_this.dataInfo.fields.length; i++) {
						var field = _c_this.dataInfo.fields[i];
						if (field.fieldName in input.raw && (typeof input.raw[field.fieldName] == 'object' ? (Array.isArray(input.raw[field.fieldName]) ? 'array' : 'map') : (typeof input.raw[field.fieldName] == 'number' ? 'float' : typeof input.raw[field.fieldName])) == "map") {
							if ((field.fieldName in opts.subs)) {
								subFields.push(field);
								}else{
									if (that.server.config.dev) {
										throw new Error("Illegal sub query sent on field '" + field.fieldName + "' with query " + Websom.Json.encode(input.raw[field.fieldName]));
										}
								}
							}else if (field.fieldName in input.raw && (typeof input.raw[field.fieldName] == 'object' ? (Array.isArray(input.raw[field.fieldName]) ? 'array' : 'map') : (typeof input.raw[field.fieldName] == 'number' ? 'float' : typeof input.raw[field.fieldName])) == "string") {
							if (field.singleLink) {
								publicFields.push(field);
								}
							}
						}
					var select = _c_this.server.database.primary.from(_c_this.table);
					var callingSelect = function () {
						if (subParent != null) {
							select.where("parentId").equals(subParent.getField("id")).and().group();
							}
						var offset = 0;
						if ("_w_loadMore" in input.raw) {
							if ((typeof input.raw["_w_loadMore"] == 'object' ? (Array.isArray(input.raw["_w_loadMore"]) ? 'array' : 'map') : (typeof input.raw["_w_loadMore"] == 'number' ? 'float' : typeof input.raw["_w_loadMore"])) == "string") {
								offset = opts.maxSelect * parseInt(input.raw["_w_loadMore"]);
								}
							}
						select.limit(offset, offset + opts.maxSelect + 1);
						var message = new Websom.ClientMessage();
						var hadError = false;
						var valids = opts.controls.length + opts.selectControls.length;
						var ready = function () {
							if (opts.hasPublicIdSelect) {
								if ("publicId" in input.raw && that.dataInfo.hasField("publicId") && (typeof input.raw["publicId"] == 'object' ? (Array.isArray(input.raw["publicId"]) ? 'array' : 'map') : (typeof input.raw["publicId"] == 'number' ? 'float' : typeof input.raw["publicId"])) == "string") {
									var publicId = input.raw["publicId"];
									if (publicId.length > 3 && publicId.length < 255) {
										select.and().where("publicId").equals(input.raw["publicId"]);
										}
									}
								}
							if (hadError) {
								input.send(message.stringify());
								}else{
									if (subParent != null) {
										select.endGroup();
										}
									select.run(function (err, docs) {
										var loadMore = false;
										if (docs.length > opts.maxSelect) {
											loadMore = true;
											}
										var sends = [];
										var datas = [];
										var loads = 0;
										var checkDone = async function (err3) {
/*async*/
											loads--;
											if (loads == 0) {
/*async*/
												if (that.selectHook == null) {
/*async*/
													var castSends = sends;
													if (loadMore) {
														castSends.push("{\"_w_loadMore\": true}");
														}
													(await that.server.security.countRequest/* async call */("select", opts, input));
													input.send("{\"documents\": [" + castSends.join(", ") + "]}");
													}else{
														that.selectHook(sends);
													}
												}
											};
										loads+=docs.length;
										if (loadMore) {
											loads--;
											}
										for (var doc = 0; doc < docs.length; doc++) {
											var close = function (doci) {
												var data = that.dataInfo.spawn(that.server);
												data.websomContainer = that;
												data.websomServer = that.server;
												datas.push(data);
												data.nativeLoadFromMap(docs[doci], function (err2) {
													data.onSend(input.request, data.exposeToClient(), function (sendData) {
														if (opts.selectExpose == null) {
															that.handleInlineSubSelects(opts, input, data, sendData, subFields, function (outData) {
																if (that.selectHook == null) {
																	sends.push(Websom.Json.encode(outData));
																	}else{
																		sends.push(outData);
																	}
																checkDone(err2);
																});
															}else{
																opts.selectExpose(sendData, data, function (exposeData) {
that.handleInlineSubSelects(opts, input, data, exposeData, subFields, function (outData) {
	if (that.selectHook == null) {
		sends.push(Websom.Json.encode(outData));
		}else{
			sends.push(outData);
		}
	checkDone(err2);
	});
});
															}
														});
													});
												};
											var should = true;
											if (loadMore && doc == docs.length - 1) {
												should = false;
												}
											if (should) {
												close(doc);
												}
											}
										if (docs.length == 0) {
											loads++;
											checkDone("");
											}
										});
								}
							};
						var grouped = false;
						var runControl = function (control) {
							control.filter(input, select, function (val) {
								valids--;
								if (val != null) {
									if (val.hadError) {
										hadError = true;
										}
									message.add(val);
									}
								if (valids == 0) {
									if (grouped) {
										select.endGroup();
										}
									ready();
									}
								});
							};
						if (opts.hasPublicIdSelect) {
							if (publicFields.length > 0) {
								valids+=publicFields.length;
								for (var fi = 0; fi < publicFields.length; fi++) {
									var close = function (i) {
										var field = publicFields[i];
										var subInfo = Websom.DataInfo.getDataInfoFromRoute(field.typeRoute);
										if ("Linked" in subInfo.attributes) {
											var tbl = new Websom.Containers.Table(that.server, subInfo.attributes["Linked"], subInfo);
											tbl.loadFromSelect(tbl.from().where("publicId").equals(input.raw[field.fieldName]), function (docs) {
												if (docs.length > 0) {
													select.and().where(field.fieldName).equals(docs[0].getField("id")).and();
													}
												valids--;
												if (valids == 0) {
													ready();
													}
												});
											}else{
												valids--;
												if (valids == 0) {
													ready();
													}
											}
										};
									close(fi);
									}
								}
							}
						for (var i = 0; i < opts.controls.length; i++) {
							if (grouped == false) {
								select.group();
								grouped = true;
								}
							var control = opts.controls[i];
							runControl(control);
							}
						for (var i = 0; i < opts.selectControls.length; i++) {
							if (grouped == false) {
								select.group();
								grouped = true;
								}
							var control = opts.selectControls[i];
							runControl(control);
							}
						if (opts.controls.length + opts.selectControls.length == 0) {
							ready();
							}
						};
					if (opts.onSelect != null) {
						select.group();
						opts.onSelect(input, select, function (err) {
select.endGroup().and();
if (err != null) {
	input.send("{\"error\": " + Websom.Json.encode(err) + "}");
	}else{
		callingSelect();
	}
});
						}else{
							callingSelect();
						}
				}
			}}

Websom.Containers.Table.prototype.insertFromInterface = function (opts, input, values, message, fieldInfo, parentData, ctx) {var _c_this = this; var _c_root_method_arguments = arguments;
		_c_this.insertFromInterfaceCallback(opts, input, values, message, fieldInfo, parentData, null, ctx);}

Websom.Containers.Table.prototype.insertFromInterfaceCallback = function (opts, input, values, message, fieldInfo, parentData, callback, ctx) {var _c_this = this; var _c_root_method_arguments = arguments;
		var that = _c_this;
		var obj = _c_this.dataInfo.spawn(_c_this.server);
		obj.websomServer = _c_this.server;
		obj.websomParentData = parentData;
		var subParent = null;
		if ("parentDocument" in input.raw && input.raw["parentDocument"] != null && ctx.subContainerCall == false) {
			_c_this.handleSubInsert(opts, input, values, message, fieldInfo, parentData, callback, ctx);
			return null;
			}
		if (ctx.subContainerCall) {
			subParent = ctx.data;
			}
		if (fieldInfo != null) {
			obj.websomFieldInfo = fieldInfo;
			}
		var insert = _c_this.server.database.primary.into(_c_this.table);
		if (opts != null) {
			if (opts.autoTimestamp) {
				var now = Websom.Time.now();
				insert.set("timestamp", now);
				obj.setField("timestamp", now);
				}
			}
		if (subParent != null) {
			insert.set("parentId", subParent.getField("id"));
			}
		obj.websomContainer = _c_this;
		obj.containerInsert(input, _c_this, insert, values, function () {
			var call = function () {
				var fieldWaits = 0;
				for (var f = 0; f < that.dataInfo.fields.length; f++) {
					var field = that.dataInfo.fields[f];
					if (("Parent" in field.attributes) == false) {
						if (field.onlyServer == false && field.structure.hasFlag("edit")) {
							fieldWaits++;
							}else{
								if (insert.doesSet(field.fieldName) == false) {
									fieldWaits++;
									}
							}
						}
					}
				var insertReady = function () {
					fieldWaits--;
					if (fieldWaits != 0) {
						return null;
						}
					if (values["parentId"] != null) {
						insert.set("parentId", values["parentId"]);
						}
					if (values["arrayIndex"] != null) {
						insert.set("arrayIndex", values["arrayIndex"]);
						}
					insert.run(function (err, key) {
						obj.setField("id", key);
						if (opts != null) {
							for (var iControl = 0; iControl < opts.controls.length; iControl++) {
								opts.controls[iControl].insert(input, obj, key);
								}
							for (var iControl = 0; iControl < opts.insertControls.length; iControl++) {
								opts.insertControls[iControl].insert(input, obj, key);
								}
							}
						that.insertAutoFields(key, input, obj, function () {
							for (var f = 0; f < that.dataInfo.fields.length; f++) {
								var field = that.dataInfo.fields[f];
								if (field.onlyServer == false && field.structure.hasFlag("edit")) {
									if (field.structure.hasFlag("linked")) {
										var link = field.structure.getFlag("linked");
										if (link.linkType == "array") {
											var value = input.raw[field.realName];
											if ((typeof value == 'object' ? (Array.isArray(value) ? 'array' : 'map') : (typeof value == 'number' ? 'float' : typeof value)) == "array") {
												var itemDataInfo = Websom.DataInfo.getDataInfoFromRoute(link.fieldType);
												var tempContainer = new Websom.Containers.Table(that.server, that.table + "_" + field.fieldName, itemDataInfo);
												if ("Linked" in itemDataInfo.attributes) {
													for (var i = 0; i < value.length; i++) {
														if ((typeof value[i] == 'object' ? (Array.isArray(value[i]) ? 'array' : 'map') : (typeof value[i] == 'number' ? 'float' : typeof value[i])) == "string") {
															var linkedTable = link.name;
															var tbl = new Websom.Containers.Table(that.server, linkedTable, itemDataInfo);
															var sobj = itemDataInfo.spawn(that.server);
															sobj.websomContainer = tbl;
															sobj.websomServer = that.server;
															sobj.loadFromPublicKey(tbl, value[i], function (err2) {
																if (err2 != null && err2.length > 0) {
																	input.send("Invalid field " + field.realName);
																	}else{
																		var tempMap = {};
																		tempMap["parentId"] = key;
																		tempMap["arrayIndex"] = i;
																		tempMap["linkedId"] = value[i];
																		tempContainer.insertFromInterface(null, new Websom.Input("", tempMap, input.request), tempMap, null, field, sobj, new Websom.CallContext());
																	}
																});
															}
														}
													}else{
														for (var i = 0; i < value.length; i++) {
															value[i]["parentId"] = key;
															value[i]["arrayIndex"] = i;
															tempContainer.insertFromInterface(null, new Websom.Input("", value[i], input.request), value[i], null, field, obj, new Websom.CallContext());
															}
													}
												}
											}
										}
									}
								}
							});
						if (callback != null) {
							callback(key);
							}
						if (message != null) {
							if (opts.successInsert) {
								opts.successInsert(input, obj, message, function (msg) {
input.send(msg.stringify());
});
								}else{
									input.send(message.stringify());
								}
							}
						});
					};
				for (var ff = 0; ff < that.dataInfo.fields.length; ff++) {
					var close = function (f) {
						var field = that.dataInfo.fields[f];
						if (("Parent" in field.attributes) == false) {
							if (field.onlyServer == false && field.structure.hasFlag("edit")) {
								if (field.structure.hasFlag("linked")) {
									var link = field.structure.getFlag("linked");
									if (link.linkType == "array") {
										var value = input.raw[field.realName];
										if ((typeof value == 'object' ? (Array.isArray(value) ? 'array' : 'map') : (typeof value == 'number' ? 'float' : typeof value)) == "array") {
											insert.set(field.fieldName, value.length);
											}else{
												insert.set(field.fieldName, 0);
											}
										insertReady();
										}else{
											if ((typeof values[field.realName] == 'object' ? (Array.isArray(values[field.realName]) ? 'array' : 'map') : (typeof values[field.realName] == 'number' ? 'float' : typeof values[field.realName])) == "string") {
												var linkInfo = Websom.DataInfo.getDataInfoFromRoute(field.typeRoute);
												var linkedTable = link.name;
												var tbl = new Websom.Containers.Table(that.server, linkedTable, linkInfo);
												var sobj = linkInfo.spawn(that.server);
												sobj.websomContainer = tbl;
												sobj.websomServer = that.server;
												sobj.loadFromPublicKey(tbl, values[field.realName], function (err) {
													if (err != null && err.length > 0) {
														input.send("Invalid field " + field.realName);
														}else{
															insert.set(field.fieldName, sobj.getField("id"));
															insertReady();
														}
													});
												}else{
													insert.set(field.fieldName, values[field.realName]);
													insertReady();
												}
										}
									}else{
										if (field.realName in values) {
											obj.setField(field.realName, values[field.realName]);
											}
										insert.set(field.fieldName, obj.getField(field.realName));
										insertReady();
									}
								}else{
									if (insert.doesSet(field.fieldName) == false) {
										if (field.structure.hasFlag("linked")) {
											var link = field.structure.getFlag("linked");
											if (link.linkType == "array") {
												insert.set(field.fieldName, 0);
												}
											}else{
												insert.set(field.fieldName, obj.getField(field.realName));
											}
										insertReady();
										}
								}
							}
						};
					close(ff);
					}
				};
			if (opts != null) {
				var nextCall = function () {
					if (opts.onInsert != null) {
						opts.onInsert(input, insert, function (err) {
if (err != null && err.length > 0) {
	input.send(err);
	}else{
		call();
	}
});
						}else{
							call();
						}
					};
				if (opts.autoPublicId) {
					that.getPublicId(function (key) {
						insert.set("publicId", key);
						obj.setField("publicId", key);
						nextCall();
						});
					}else{
						nextCall();
					}
				}else{
					call();
				}
			});}

Websom.Containers.Table.prototype.getPublicId = function (found) {var _c_this = this; var _c_root_method_arguments = arguments;
		var that = _c_this;
		_c_this.server.crypto.smallId(function (key) {
			that.from().where("publicId").equals(key).run(function (err, docs) {
				if (docs.length == 0) {
					found(key);
					}else{
						that.getPublicId(found);
					}
				});
			});}

Websom.Containers.Table.prototype.insertAutoFields = function (key, input, data, done) {var _c_this = this; var _c_root_method_arguments = arguments;
		var that = _c_this;
		var autos = [];
		for (var i = 0; i < _c_this.dataInfo.fields.length; i++) {
			var field = _c_this.dataInfo.fields[i];
			if (field.singleLink) {
				if ("AutoCreate" in field.attributes) {
					autos.push(field);
					}
				}
			}
		if (autos.length == 0) {
			done();
			}else{
				var completed = autos.length;
				var checkDone = function () {
					completed--;
					if (completed == 0) {
						done();
						}
					};
				for (var ii = 0; ii < autos.length; ii++) {
					var close = function (i) {
						var auto = autos[i];
						var autoInfo = Websom.DataInfo.getDataInfoFromRoute(auto.typeRoute);
						var tempContainer = new Websom.Containers.Table(that.server, that.table + "_" + auto.fieldName, autoInfo);
						var mapData = {};
						mapData["parentId"] = key;
						tempContainer.insertFromInterfaceCallback(null, new Websom.Input("", input.raw, input.request), mapData, null, auto, data, function (primaryKey) {
							checkDone();
							}, new Websom.CallContext());
						};
					close(ii);
					}
			}}

Websom.Containers.Table.prototype.updateFromInterface = function (opts, update, obj, input, values, message) {var _c_this = this; var _c_root_method_arguments = arguments;
		var that = _c_this;
		obj.containerUpdate(input, that, update, values, function () {
			var fieldWaits = 0;
			for (var f = 0; f < that.dataInfo.fields.length; f++) {
				var field = that.dataInfo.fields[f];
				if (("Parent" in field.attributes) == false) {
					fieldWaits++;
					}
				}
			var updateReady = function (readyField, readyValue) {
				var callUpdate = function () {
					that.checkRestrictions(opts, input, "update", readyField, function (doChange) {
						if (doChange == true && readyValue != null) {
							update.set(readyField.fieldName, readyValue);
							}
						fieldWaits--;
						if (fieldWaits <= 0) {
							if (values["parentId"] != null) {
								update.set("parentId", values["parentId"]);
								}
							if (values["arrayIndex"] != null) {
								update.set("arrayIndex", values["arrayIndex"]);
								}
							update.run(function (err, res) {
								if (opts != null) {
									for (var iControl = 0; iControl < opts.controls.length; iControl++) {
										opts.controls[iControl].update(input, obj);
										}
									for (var iControl = 0; iControl < opts.updateControls.length; iControl++) {
										opts.updateControls[iControl].update(input, obj);
										}
									}
								for (var ff = 0; ff < that.dataInfo.fields.length; ff++) {
									var fieldClose = function (f) {
										var field = that.dataInfo.fields[f];
										if (field.onlyServer == false && field.structure.hasFlag("edit")) {
											if (field.structure.hasFlag("linked")) {
												var link = field.structure.getFlag("linked");
												if (link.linkType == "array") {
													var value = input.raw[field.realName];
													if ((typeof value == 'object' ? (Array.isArray(value) ? 'array' : 'map') : (typeof value == 'number' ? 'float' : typeof value)) == "array") {
														var tempContainer = new Websom.Containers.Table(that.server, that.table + "_" + field.fieldName, Websom.DataInfo.getDataInfoFromRoute(link.fieldType));
														for (var ii = 0; ii < value.length; ii++) {
															var close = function (i) {
																value[i]["parentId"] = obj.getField("id");
																value[i]["arrayIndex"] = i;
																var subSelect = that.server.database.primary.from(that.table + "_" + field.fieldName).where("parentId").equals(value[i]["parentId"]).and().where("arrayIndex").equals(value[i]["arrayIndex"]);
																var subObj = tempContainer.dataInfo.spawn(that.server);
																subObj.websomFieldInfo = field;
																subObj.websomServer = that.server;
																subObj.websomParentData = obj;
																subObj.websomContainer = tempContainer;
																subSelect.run(function (err2, sres) {
																	if (err2 != null) {
																		 console.log(err2); 
																		input.send("Internal Error");
																		}else if (sres.length == 0) {
																		tempContainer.insertFromInterface(null, new Websom.Input("", value[i], input.request), value[i], null, field, obj, new Websom.CallContext());
																		}else{
																			subObj.nativeLoadFromMap(sres[0], function (err3) {
																				if (err3.length > 0) {
																					 console.log(err3); 
																					input.send("Internal Error");
																					}else{
																						var subUpdate = subSelect.update();
																						tempContainer.updateFromInterface(null, subUpdate, subObj, new Websom.Input("", value[i], input.request), value[i], null);
																					}
																				});
																		}
																	});
																};
															close(ii);
															}
														that.server.database.primary.from(tempContainer.table).where("parentId").equals(obj.getField("id")).and().where("arrayIndex").greater(value.length - 1).delete().run(function (err2, res2) {

															});
														}
													}
												}
											}
										};
									fieldClose(ff);
									}
								if (message != null) {
									if (opts.successUpdate) {
										opts.successUpdate(input, obj, message, function (msg) {
input.send(msg.stringify());
});
										}else{
											input.send(message.stringify());
										}
									}
								});
							}
						});
					};
				if (opts != null) {
					if (opts.onUpdate != null) {
						input.updateData = obj;
						opts.onUpdate(input, update, function (err) {
if (err != null && err.length > 0) {
	input.send(err);
	}else{
		callUpdate();
	}
});
						}else{
							callUpdate();
						}
					}else{
						callUpdate();
					}
				};
			for (var ff = 0; ff < that.dataInfo.fields.length; ff++) {
				var close = function (f) {
					var field = that.dataInfo.fields[f];
					if (("Parent" in field.attributes) == false) {
						if (field.onlyServer == false && field.structure.hasFlag("edit") && (field.realName in input.raw)) {
							if (field.structure.hasFlag("linked")) {
								var link = field.structure.getFlag("linked");
								if (link.linkType == "array") {
									var value = input.raw[field.realName];
									var setValue = value.length;
									if ((typeof value == 'object' ? (Array.isArray(value) ? 'array' : 'map') : (typeof value == 'number' ? 'float' : typeof value)) != "array") {
										setValue = 0;
										}
									updateReady(field, setValue);
									}else{
										if ((typeof values[field.realName] == 'object' ? (Array.isArray(values[field.realName]) ? 'array' : 'map') : (typeof values[field.realName] == 'number' ? 'float' : typeof values[field.realName])) == "string") {
											var linkInfo = Websom.DataInfo.getDataInfoFromRoute(field.typeRoute);
											var linkedTable = link.name;
											var tbl = new Websom.Containers.Table(that.server, linkedTable, linkInfo);
											var sobj = linkInfo.spawn(that.server);
											sobj.websomContainer = tbl;
											sobj.websomServer = that.server;
											sobj.loadFromPublicKey(tbl, values[field.realName], function (err) {
												if (err != null && err.length > 0) {
													input.sendError("Invalid field " + field.realName);
													}else{
														updateReady(field, sobj.getField("id"));
													}
												});
											}else{
												updateReady(field, values[field.realName]);
											}
									}
								}else{
									if (field.realName in values) {
										obj.setField(field.realName, values[field.realName]);
										}
									updateReady(field, obj.getField(field.realName));
								}
							}else{
								if (field.singleLink) {
									if (field.isComponent() == false) {
										var objId = -1;
										 objId = obj.getField(field.realName).id; 
										
										updateReady(field, objId);
										}else{
											updateReady(field, null);
										}
									}else{
										updateReady(field, null);
									}
							}
						}
					};
				close(ff);
				}
			});}

Websom.Containers.Table.prototype.from = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		return _c_this.server.database.primary.from(_c_this.table);}

Websom.Containers.Table.prototype.into = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		return _c_this.server.database.primary.into(_c_this.table);}

Websom.Containers.Table.prototype.loadFromId = function (id, callback) {var _c_this = this; var _c_root_method_arguments = arguments;
		var select = _c_this.from().where("id").equals(id);
		_c_this.loadFromSelect(select, function (datas) {
			if (datas.length > 0) {
				callback(datas[0]);
				}else{
					callback(null);
				}
			});}

Websom.Containers.Table.prototype.loadFromPublicId = function (id, callback) {var _c_this = this; var _c_root_method_arguments = arguments;
		var select = _c_this.from().where("publicId").equals(id);
		_c_this.loadFromSelect(select, function (datas) {
			if (datas.length > 0) {
				callback(datas[0]);
				}else{
					callback(null);
				}
			});}

Websom.Containers.Table.prototype.loadFromSelect = function (select, callback) {var _c_this = this; var _c_root_method_arguments = arguments;
		var that = _c_this;
		select.run(function (err, docs) {
			var datas = [];
			var loads = 0;
			var checkDone = function (err3) {
				loads--;
				if (loads == 0) {
					callback(datas);
					}
				};
			loads+=docs.length;
			for (var doc = 0; doc < docs.length; doc++) {
				var close = function (doci) {
					var data = that.dataInfo.spawn(that.server);
					data.websomContainer = that;
					data.websomServer = that.server;
					datas.push(data);
					data.nativeLoadFromMap(docs[doci], function (err2) {
						checkDone(err2);
						});
					};
				close(doc);
				}
			if (docs.length == 0) {
				loads++;
				checkDone("");
				}
			});}

Websom.Containers.Table.prototype.expose = function (req, datas, callback) {var _c_this = this; var _c_root_method_arguments = arguments;
		var loads = datas.length;
		var sends = [];
		var checkDone = function (err3) {
			loads--;
			if (loads == 0) {
				callback(sends);
				}
			};
		for (var i = 0; i < datas.length; i++) {
			var data = datas[i];
			data.onSend(req, data.exposeToClient(), function (sendData) {
				sends.push(sendData);
				checkDone("");
				});
			}}

Websom.Containers.Table.prototype.checkRestrictions = function (opts, inp, mode, field, callback) {var _c_this = this; var _c_root_method_arguments = arguments;
		for (var i = 0; i < opts.restricts.length; i++) {
			var r = opts.restricts[i];
			if (r.field == field.realName && ((r.mode == "global") || (r.mode == mode))) {
				if (r.simple) {
					var ct = _c_this.server.input.restrictHandlers;
					if (r.key in ct) {
						var handler = _c_this.server.input.restrictHandlers[r.key];
						handler(r.value, inp.request, function (passed) {
callback(passed);
});
						return null;
						}else{
							throw new Error("Custom restriction " + r.key + " not found in request to container " + _c_this.name);
						}
					}else{
						if (r.callback != null) {
							r.callback(function (passed) {
callback(passed);
});
							}else{
								throw new Error("Restrict callback on field " + field.realName + " in container interface " + _c_this.name + " is null. Did you forget interface.to(void () => {})?");
							}
						return null;
					}
				}
			}
		callback(true);}

/*i async*/Websom.Containers.Table.prototype.interfaceInsert = async function (opts, input) {var _c_this = this; var _c_root_method_arguments = arguments;
/*async*/
		var that = _c_this;
		if (opts.canInsert) {
/*async*/
			if (opts.overrideInsert != null) {
				opts.overrideInsert(input);
				}else{
/*async*/
					if (opts.mustLogin || opts.mustOwnInsert) {

						}
					(await _c_this.server.security.request/* async call */("insert", opts, input, function () {
						var v = new Websom.DataValidator(that.dataInfo);
						v.validate(input, async function (msg) {
/*async*/
							if (msg.hadError) {
								input.sendError(msg.stringify());
								}else{
/*async*/
									var dones = 0;
									var values = input.raw;
									var clientMessage = new Websom.ClientMessage();
									clientMessage.message = opts.baseSuccess;
									dones+=opts.controls.length + opts.insertControls.length;
									var checkDone = function () {
										if (dones == 0) {
											if (clientMessage.hadError) {
												input.send(clientMessage.stringify());
												}else{
													that.insertFromInterface(opts, input, values, clientMessage, null, null, new Websom.CallContext());
												}
											}
										};
									var runControl = function (control) {
										control.validate(input, function (cMsg) {
											dones--;
											if (cMsg != null && cMsg.hadError) {
												clientMessage.add(cMsg);
												checkDone();
												}else{
													control.fill(input, values, function () {
														checkDone();
														});
												}
											});
										};
									for (var i = 0; i < opts.controls.length; i++) {
										var control = opts.controls[i];
										runControl(control);
										}
									for (var i = 0; i < opts.insertControls.length; i++) {
										var control = opts.insertControls[i];
										runControl(control);
										}
									if (opts.controls.length + opts.insertControls.length == 0) {
/*async*/
										if (dones == 0) {
/*async*/
											(await that.server.security.countRequest/* async call */("insert", opts, input));
											that.insertFromInterface(opts, input, values, clientMessage, null, null, new Websom.CallContext());
											}
										}
								}
							});
						}));
				}
			}else{
				if (_c_this.server.config.dev) {
					input.send("Invalid(Dev: This container has no insert interface)");
					}else{
						input.send("Invalid");
					}
			}}

Websom.Containers.Table.prototype.interfaceSend = function (opts, input) {var _c_this = this; var _c_root_method_arguments = arguments;
		var that = _c_this;
		if (opts.canInterface) {
			if (("publicId" in input.raw) && ("route" in input.raw) && ("data" in input.raw)) {
				var obj = that.dataInfo.spawn(that.server);
				obj.websomServer = _c_this.server;
				obj.loadFromPublicKey(that, input.raw["publicId"], function (err) {
					var talkingTo = obj;
					if ("sub" in input.raw) {
						
							if (typeof input.raw["sub"] == "string") {
								var splits = input.raw["sub"].split(".");
								for (var i = 0; i < splits.length; i++)
									if (talkingTo[splits[i]].getField) {
										talkingTo = talkingTo[splits[i]];
									}else{
										break;
									}
							}
						
						
						}
					talkingTo.onInputInterface(input, input.raw["route"], input.raw["data"], function (response) {
						input.send(Websom.Json.encode(response));
						});
					});
				}else{
					if (_c_this.server.config.dev) {
						input.send("Invalid(Dev: No 'publicId', 'route', or 'data' key found in query)");
						}else{
							input.send("Invalid");
						}
				}
			}}

/*i async*/Websom.Containers.Table.prototype.interfaceUpdate = async function (opts, input) {var _c_this = this; var _c_root_method_arguments = arguments;
/*async*/
		var that = _c_this;
		if (opts.canUpdate) {
/*async*/
			if (opts.overrideUpdate != null) {
				opts.overrideUpdate(input);
				}else{
/*async*/
					if (opts.mustLogin || opts.mustOwnUpdate) {

						}
					if (("publicId" in input.raw) == false || (typeof input.raw["publicId"] == 'object' ? (Array.isArray(input.raw["publicId"]) ? 'array' : 'map') : (typeof input.raw["publicId"] == 'number' ? 'float' : typeof input.raw["publicId"])) != "string") {
						var qMsg = Websom.ClientMessage.quickError("Invalid publicId");
						input.send(qMsg.stringify());
						return null;
						}
					var publicId = input.raw["publicId"];
					if (publicId.length < 10 || publicId.length > 256) {
						var qMsg = Websom.ClientMessage.quickError("Invalid publicId");
						input.send(qMsg.stringify());
						return null;
						}
					(await _c_this.server.security.request/* async call */("update", opts, input, function () {
						var v = new Websom.DataValidator(that.dataInfo);
						v.validate(input, function (msg) {
							if (msg.hadError) {
								input.sendError(msg.stringify());
								}else{
									var dones = 0;
									var values = input.raw;
									var clientMessage = new Websom.ClientMessage();
									clientMessage.message = opts.baseSuccess;
									dones+=opts.controls.length + opts.updateControls.length;
									var cast = that;
									var update = that.server.database.primary.from(cast.table).where("publicId").equals(publicId).update();
									var obj = that.dataInfo.spawn(that.server);
									var checkDone = function () {
										if (dones == 0) {
											if (clientMessage.hadError) {
												input.send(clientMessage.stringify());
												}else{
													that.updateFromInterface(opts, update, obj, input, values, clientMessage);
												}
											}
										};
									obj.loadFromPublicKey(that, publicId, function (err) {
										var shouldContinue = true;
										var doContinue = async function () {
/*async*/
											var runControl = function (control) {
												control.validate(input, function (cMsg) {
													dones--;
													if (cMsg != null && cMsg.hadError) {
														clientMessage.add(cMsg);
														checkDone();
														}else{
															control.fill(input, values, function () {
																checkDone();
																});
														}
													});
												};
											for (var i = 0; i < opts.controls.length; i++) {
												var control = opts.controls[i];
												runControl(control);
												}
											for (var i = 0; i < opts.updateControls.length; i++) {
												runControl(opts.updateControls[i]);
												}
											if (opts.controls.length + opts.updateControls.length == 0) {
/*async*/
												if (dones == 0) {
/*async*/
													(await that.server.security.countRequest/* async call */("update", opts, input));
													that.updateFromInterface(opts, update, obj, input, values, clientMessage);
													}
												}
											};
										if (opts.mustOwnUpdate) {

											}else{
												doContinue();
											}
										});
								}
							});
						}));
				}
			}else{
				if (_c_this.server.config.dev) {
					input.send("Invalid(Dev: This container has no update interface)");
					}else{
						input.send("Invalid");
					}
			}}

Websom.Containers.Table.prototype.interface = function () {var _c_this = this; var _c_root_method_arguments = arguments;
	if (arguments.length == 1 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var route = arguments[0];
		return new Websom.InterfaceChain(_c_this, route);
	}
else 	if (arguments.length == 1 && ((arguments[0] instanceof Websom.InterfaceOptions) || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var opts = arguments[0];
		_c_this.interfaces.push(opts);
	}
}

Websom.Containers.Table.prototype.getInterface = function (route) {var _c_this = this; var _c_root_method_arguments = arguments;
		for (var i = 0; i < _c_this.interfaces.length; i++) {
			if (_c_this.interfaces[i].route == route) {
				return _c_this.interfaces[i];
				}
			}
		return null;}

Websom.Containers.Table.prototype.getDataFromRoute = function (route) {var _c_this = this; var _c_root_method_arguments = arguments;
		
			var splits = route.split(".");
			var cur = global;
			for (var split of splits)
				cur = cur[split];

			return cur;
		
		}

Websom.Containers.Table.prototype.registerSubContainer = function (field, routeInfo) {var _c_this = this; var _c_root_method_arguments = arguments;
		var that = _c_this;
		var name = _c_this.name + "_" + field.fieldName;
		var subContainer = new Websom.Containers.Table(_c_this.server, name, routeInfo);
		subContainer.parentContainer = _c_this;
		for (var i = 0; i < _c_this.interfaces.length; i++) {
			var interface = _c_this.interfaces[i];
			if (interface.subs[field.fieldName] != null) {
				subContainer.interface(interface.subs[field.fieldName]);
				}
			}
		if (subContainer.interfaces.length > 0) {
			var handler = subContainer.register();
			handler.containerInterface = subContainer;
			return handler;
			}}

Websom.Containers.Table.prototype.register = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		var that = _c_this;
		for (var i = 0; i < _c_this.dataInfo.fields.length; i++) {
			var f = _c_this.dataInfo.fields[i];
			if (f.singleLink && f.isPrimitive == false) {
				var t = Websom.DataInfo.getDataInfoFromRoute(f.typeRoute);
				var fi = _c_this.getDataFromRoute(f.typeRoute);
				if ("Component" in t.attributes) {
					var name = _c_this.name + "_" + f.fieldName;
					var componentContainer = new Websom.Containers.Table(that.server, name, t);
					var close = function (fix, type, field) {
						var getContainer = function (fieldName) {
							var fieldInfo = null;
							for (var fii = 0; fii < type.fields.length; fii++) {
								if (type.fields[fii].realName == fieldName) {
									fieldInfo = type.fields[fii];
									}
								}
							var linked = fieldInfo.structure.getFlag("linked");
							var fieldType = Websom.DataInfo.getDataInfoFromRoute(linked.fieldType);
							var subContainer = new Websom.Containers.Table(that.server, name + "_" + fieldInfo.fieldName, fieldType);
							return subContainer;
							};
						
							fi.registerInterfaces(that, componentContainer, getContainer);
						
						
						};
					close(f, t, fi);
					}
				}else if (f.typeRoute == "array" && "NoLoad" in f.attributes) {
				var linked = f.structure.getFlag("linked");
				var t = Websom.DataInfo.getDataInfoFromRoute(linked.fieldType);
				_c_this.registerSubContainer(f, t);
				}
			}
		for (var i = 0; i < _c_this.interfaces.length; i++) {
			var opts = _c_this.interfaces[i];
			for (var c = 0; c < opts.controls.length; c++) {
				opts.controls[c].container = _c_this;
				}
			for (var c = 0; c < opts.selectControls.length; c++) {
				opts.selectControls[c].container = _c_this;
				}
			for (var c = 0; c < opts.updateControls.length; c++) {
				opts.updateControls[c].container = _c_this;
				}
			for (var c = 0; c < opts.insertControls.length; c++) {
				opts.insertControls[c].container = _c_this;
				}
			}
		var handler = _c_this.server.input.register(_c_this.name, function (input) {
			if (("_w_type" in input.raw) && ("_w_route" in input.raw)) {
				var type = input.raw["_w_type"];
				var route = input.raw["_w_route"];
				var opts = that.getInterface(route);
				if (opts != null) {
					that.checkAuth(opts, input, type, async function (success) {
/*async*/
						if (success) {
/*async*/
							if (type == "insert") {
/*async*/
								(await that.interfaceInsert/* async call */(opts, input));
								}else if (type == "update") {
/*async*/
								(await that.interfaceUpdate/* async call */(opts, input));
								}else if (type == "select") {
/*async*/
								(await that.server.security.request/* async call */("select", opts, input, function () {
									that.interfaceSelect(opts, input, new Websom.CallContext());
									}));
								}else if (type == "interface") {
								that.interfaceSend(opts, input);
								}else{
									input.request.code(400);
									if (that.server.config.dev) {
										input.send("Invalid(Dev: Interface of type '" + type + "' not found)");
										}else{
											input.send("Invalid");
										}
								}
							}else{
								input.request.code(403);
								input.send("Unauthorized");
							}
						});
					}else{
						input.request.code(400);
						if (that.server.config.dev) {
							input.send("Invalid(Dev: No interface found with the route '" + route + "')");
							}else{
								input.send("Invalid");
							}
					}
				}else{
					input.request.code(400);
					if (that.server.config.dev) {
						input.send("Invalid(Dev: No '_w_type' or '_w_route' found in query)");
						}else{
							input.send("Invalid");
						}
				}
			});
		handler.containerInterface = _c_this;
		return handler;}

Websom.Containers.Table.prototype.checkAuth = function (opts, input, type, callback) {var _c_this = this; var _c_root_method_arguments = arguments;
		if (opts.hasAuth) {
			var perms = "";
			if (type == "insert") {
				perms = opts.insertPermission;
				}else if (type == "update") {
				perms = opts.updatePermission;
				}else if (type == "select") {
				perms = opts.selectPermission;
				}
			if (perms.length > 0) {

				}else{
					callback(true);
				}
			}else{
				callback(true);
			}}

Websom.DatabaseDocument = function () {var _c_this = this;


}

Websom.DatabaseInsert = function (database, table) {var _c_this = this;
	this.table = "";

	this.number = 1;

	this.isMulti = false;

	this.values = [];

	this.multiKeys = {};

	this.inserts = [];

	this.multiInserts = [];

	this.database = null;


}

Websom.DatabaseInsert.prototype.doesSet = function (field) {var _c_this = this; var _c_root_method_arguments = arguments;
		for (var i = 0; i < _c_this.inserts.length; i++) {
			if (_c_this.inserts[i].field == field) {
				return true;
				}
			}
		return false;}

Websom.DatabaseInsert.prototype.amount = function (number) {var _c_this = this; var _c_root_method_arguments = arguments;
		_c_this.number = number;
		return _c_this;}

Websom.DatabaseInsert.prototype.multi = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		_c_this.isMulti = true;
		return _c_this;}

Websom.DatabaseInterface = function () {var _c_this = this;
	this.database = null;


}

Websom.DatabaseSelect = function (database, table) {var _c_this = this;
	this.table = "";

	this.workingField = "";

	this.fields = "*";

	this.limitAmount = 0;

	this.limitOffset = 0;

	this.orderField = "";

	this.orderWay = "";

	this.doUpdate = false;

	this.doDelete = false;

	this.groupLevel = 0;

	this.freshGroup = false;

	this.updates = [];

	this.database = null;


}

Websom.DatabaseSelect.prototype.doesSet = function (field) {var _c_this = this; var _c_root_method_arguments = arguments;
		for (var i = 0; i < _c_this.updates.length; i++) {
			if (_c_this.updates[i].field == field) {
				return true;
				}
			}
		return false;}

Websom.DatabaseSelect.prototype.limit = function () {var _c_this = this; var _c_root_method_arguments = arguments;
	if (arguments.length == 1 && (typeof arguments[0] == 'number' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var documents = arguments[0];
		_c_this.limitAmount = documents;
		return _c_this;
	}
else 	if (arguments.length == 2 && (typeof arguments[0] == 'number' || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'number' || typeof arguments[1] == 'undefined' || arguments[1] === null)) {
		var offset = arguments[0];
		var documents = arguments[1];
		_c_this.limitAmount = documents;
		_c_this.limitOffset = offset;
		return _c_this;
	}
}

Websom.DatabaseSelect.prototype.update = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		_c_this.doUpdate = true;
		return _c_this;}

Websom.DatabaseSelect.prototype.delete = function () {var _c_this = this; var _c_root_method_arguments = arguments;
		_c_this.doDelete = true;
		return _c_this;}

Websom.DatabaseStructure = function (database, table) {var _c_this = this;
	this.database = null;

	this.table = "";

	this.fields = [];

		_c_this.database = database;
		_c_this.table = table;
}

Websom.DatabaseStructure.prototype.field = function (name, type) {var _c_this = this; var _c_root_method_arguments = arguments;
		var field = new Websom.DatabaseField(name, type);
		_c_this.fields.push(field);
		return _c_this;}

Websom.DatabaseStructure.prototype.flag = function (flag) {var _c_this = this; var _c_root_method_arguments = arguments;
		if (_c_this.fields.length > 0) {
			_c_this.fields[_c_this.fields.length - 1].flags.push(flag);
			}
		return _c_this;}

Websom.DatabaseStructure.prototype.run = function (callback) {var _c_this = this; var _c_root_method_arguments = arguments;
		_c_this.database.runStructure(_c_this, callback);}

Websom.DatabaseFlags = function () {var _c_this = this;


}

Websom.DatabaseFlag = function () {var _c_this = this;
	this.type = "flag";


}

Websom.DatabaseFlags.AutoIncrement = function () {var _c_this = this;
	this.type = "autoIncrement";


}

Websom.DatabaseFlags.Primary = function () {var _c_this = this;
	this.type = "primary";


}

Websom.DatabaseFlags.Edit = function () {var _c_this = this;
	this.type = "edit";


}

Websom.DatabaseFlags.Linked = function (name, linkType, fieldType) {var _c_this = this;
	this.type = "linked";

	this.name = "";

	this.linkType = "";

	this.fieldType = "";

		_c_this.name = name;
		_c_this.linkType = linkType;
		_c_this.fieldType = fieldType;
}

Websom.DatabaseFlags.Unsigned = function () {var _c_this = this;
	this.type = "unsigned";


}

Websom.DatabaseField = function (name, type) {var _c_this = this;
	this.name = "";

	this.type = null;

	this.flags = [];

		_c_this.name = name;
		_c_this.type = type;
}

Websom.DatabaseField.prototype.hasFlag = function (name) {var _c_this = this; var _c_root_method_arguments = arguments;
		for (var i = 0; i < _c_this.flags.length; i++) {
			if (_c_this.flags[i].type == name) {
				return true;
				}
			}
		return false;}

Websom.DatabaseField.prototype.getFlag = function (name) {var _c_this = this; var _c_root_method_arguments = arguments;
		for (var i = 0; i < _c_this.flags.length; i++) {
			if (_c_this.flags[i].type == name) {
				return _c_this.flags[i];
				}
			}
		return null;}

Websom.DatabaseTypes = function () {var _c_this = this;


}

Websom.DatabaseType = function () {var _c_this = this;
	this.type = "";


}

Websom.DatabaseType.prototype.autoControl = function (info) {var _c_this = this; var _c_root_method_arguments = arguments;
}

Websom.DatabaseTypes.Varchar = function (length) {var _c_this = this;
	this.type = "varchar";

	this.length = 0;

		_c_this.length = length;
}

Websom.DatabaseTypes.Varchar.prototype.autoControl = function (field) {var _c_this = this; var _c_root_method_arguments = arguments;
		return new Websom.Controls.String(field.realName, field.fieldName, field);}

Websom.DatabaseTypes.Text = function () {var _c_this = this;
	this.type = "text";


}

Websom.DatabaseTypes.Text.prototype.autoControl = function (field) {var _c_this = this; var _c_root_method_arguments = arguments;
		return new Websom.Controls.String(field.realName, field.fieldName, field);}

Websom.Controls.String = function () {var _c_this = this;
	this.required = false;

	this.name = "";

	this.field = "";

	this.logic = "or";

	this.fieldInfo = null;

	this.server = null;

	this.container = null;

	if (arguments.length == 1 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var field = arguments[0];
		_c_this.name = field;
		_c_this.field = field;
	}
else 	if (arguments.length == 2 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'string' || typeof arguments[1] == 'undefined' || arguments[1] === null)) {
		var field = arguments[0];
		var logic = arguments[1];
		_c_this.name = field;
		_c_this.field = field;
		_c_this.logic = logic;
	}
else 	if (arguments.length == 3 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'string' || typeof arguments[1] == 'undefined' || arguments[1] === null) && ((arguments[2] instanceof Websom.FieldInfo) || typeof arguments[2] == 'undefined' || arguments[2] === null)) {
		var name = arguments[0];
		var field = arguments[1];
		var fieldInfo = arguments[2];
		_c_this.name = name;
		_c_this.field = field;
		_c_this.fieldInfo = fieldInfo;
	}

}

Websom.Controls.String.prototype.validateField = function (input, value, done) {var _c_this = this; var _c_root_method_arguments = arguments;
		if ((typeof value == 'object' ? (Array.isArray(value) ? 'array' : 'map') : (typeof value == 'number' ? 'float' : typeof value)) == "string") {
			var val = value;
			var ok = true;
			if ("Min" in _c_this.fieldInfo.attributes) {
				var min = _c_this.fieldInfo.attributes["Min"];
				if (val.length < min) {
					done(new Websom.InputValidation(true, "Length must be greater than " + min));
					ok = false;
					}
				}
			if ("Length" in _c_this.fieldInfo.attributes) {
				var max = _c_this.fieldInfo.attributes["Length"];
				if (val.length > max) {
					done(new Websom.InputValidation(true, "Length must be less than " + max));
					ok = false;
					}
				}
			if ("Match" in _c_this.fieldInfo.attributes) {
				var match = _c_this.fieldInfo.attributes["Match"];
				if ((new RegExp(match)).test(val) == false) {
					var err = "Value must match " + match;
					if ("MatchError" in _c_this.fieldInfo.attributes) {
						err = _c_this.fieldInfo.attributes["MatchError"];
						}
					done(new Websom.InputValidation(true, err, _c_this.fieldInfo));
					ok = false;
					}
				}
			if (ok) {
				done(new Websom.InputValidation(false, ""));
				}
			}else{
				done(new Websom.InputValidation(true, "Not a string type"));
			}}

Websom.Controls.String.prototype.fillField = function (value, values) {var _c_this = this; var _c_root_method_arguments = arguments;
		values[_c_this.field] = value;}

Websom.Controls.String.prototype.filterField = function (value, select, done) {var _c_this = this; var _c_root_method_arguments = arguments;
		select.where(_c_this.field).equals(value);
		done(null);}

Websom.Controls.String.prototype.validate = function (input, done) {var _c_this = this; var _c_root_method_arguments = arguments;
		if (_c_this.name in input.raw) {
			_c_this.validateField(input, input.raw[_c_this.name], done);
			}else if (_c_this.required) {
			done(new Websom.InputValidation(true, "Missing field " + _c_this.name));
			}else{
				done(new Websom.InputValidation(false, ""));
			}}

Websom.Controls.String.prototype.fill = function (input, values, done) {var _c_this = this; var _c_root_method_arguments = arguments;
		_c_this.fillField(input.raw[_c_this.name], values);
		done();}

Websom.Controls.String.prototype.filter = function (input, select, done) {var _c_this = this; var _c_root_method_arguments = arguments;
		if (_c_this.name in input.raw) {
			if (_c_this.logic == "and") {
				select.and();
				}else{
					select.or();
				}
			var val = _c_this.filterField(input.raw[_c_this.name], select, done);
			}else if (_c_this.required) {
			done(new Websom.InputValidation(true, "Missing field " + _c_this.name));
			}else{
				done(null);
			}}

Websom.Controls.String.prototype.insert = function (input, data, key) {var _c_this = this; var _c_root_method_arguments = arguments;
}

Websom.Controls.String.prototype.update = function (input, data) {var _c_this = this; var _c_root_method_arguments = arguments;
}

Websom.Controls.String.prototype.message = function (input, name, data, send) {var _c_this = this; var _c_root_method_arguments = arguments;
		send(null);}

Websom.Controls.String.prototype.use = function (inputChain) {var _c_this = this; var _c_root_method_arguments = arguments;
}

Websom.DatabaseTypes.BigInt = function () {var _c_this = this;
	this.type = "bigInt";


}

Websom.DatabaseTypes.BigInt.prototype.autoControl = function (field) {var _c_this = this; var _c_root_method_arguments = arguments;
		return new Websom.Controls.Number(field.realName, field.fieldName, field);}

Websom.DatabaseTypes.Int = function () {var _c_this = this;
	this.type = "int";


}

Websom.DatabaseTypes.Int.prototype.autoControl = function (field) {var _c_this = this; var _c_root_method_arguments = arguments;
		return new Websom.Controls.Number(field.realName, field.fieldName, field);}

Websom.DatabaseTypes.Float = function () {var _c_this = this;
	this.type = "float";


}

Websom.DatabaseTypes.Float.prototype.autoControl = function (field) {var _c_this = this; var _c_root_method_arguments = arguments;
		return new Websom.Controls.Number(field.realName, field.fieldName, field);}

Websom.Controls.Number = function () {var _c_this = this;
	this.required = false;

	this.name = "";

	this.field = "";

	this.logic = "or";

	this.fieldInfo = null;

	this.server = null;

	this.container = null;

	if (arguments.length == 1 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var field = arguments[0];
		_c_this.name = field;
		_c_this.field = field;
	}
else 	if (arguments.length == 2 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'string' || typeof arguments[1] == 'undefined' || arguments[1] === null)) {
		var field = arguments[0];
		var logic = arguments[1];
		_c_this.name = field;
		_c_this.field = field;
		_c_this.logic = logic;
	}
else 	if (arguments.length == 3 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'string' || typeof arguments[1] == 'undefined' || arguments[1] === null) && ((arguments[2] instanceof Websom.FieldInfo) || typeof arguments[2] == 'undefined' || arguments[2] === null)) {
		var name = arguments[0];
		var field = arguments[1];
		var fieldInfo = arguments[2];
		_c_this.name = name;
		_c_this.field = field;
		_c_this.fieldInfo = fieldInfo;
	}

}

Websom.Controls.Number.prototype.validateField = function (input, value, done) {var _c_this = this; var _c_root_method_arguments = arguments;
		if ((typeof value == 'object' ? (Array.isArray(value) ? 'array' : 'map') : (typeof value == 'number' ? 'float' : typeof value)) == "float" || (typeof value == 'object' ? (Array.isArray(value) ? 'array' : 'map') : (typeof value == 'number' ? 'float' : typeof value)) == "integer") {
			var val = value;
			var ok = true;
			if ("Min" in _c_this.fieldInfo.attributes) {
				var min = _c_this.fieldInfo.attributes["Min"];
				if (val < min) {
					done(new Websom.InputValidation(true, "Number must be greater than " + min));
					ok = false;
					}
				}
			if ("Max" in _c_this.fieldInfo.attributes) {
				var max = _c_this.fieldInfo.attributes["Max"];
				if (val > max) {
					done(new Websom.InputValidation(true, "Number must be less than " + max));
					ok = false;
					}
				}
			if (ok) {
				done(new Websom.InputValidation(false, ""));
				}
			}else{
				if (_c_this.fieldInfo.structure.hasFlag("linked")) {
					var val = value;
					var link = _c_this.fieldInfo.structure.getFlag("linked");
					var subInfo = Websom.DataInfo.getDataInfoFromRoute(link.fieldType);
					var dv = new Websom.DataValidator(subInfo);
					var valids = val.length;
					var firstError = null;
					for (var i = 0; i < val.length; i++) {
						var inp = new Websom.Input("", val[i], input.request);
						dv.validate(inp, function (validation) {
							valids--;
							if (validation.hadError) {
								if (firstError == null) {
									firstError = validation;
									}
								}
							if (valids == 0) {
								if (firstError != null) {
									done(firstError);
									}else{
										done(new Websom.InputValidation(false, ""));
									}
								}
							});
						}
					}else{
						done(new Websom.InputValidation(true, "Not a number type"));
					}
			}}

Websom.Controls.Number.prototype.fillField = function (value, values) {var _c_this = this; var _c_root_method_arguments = arguments;
		values[_c_this.field] = value;}

Websom.Controls.Number.prototype.filterField = function (value, select, done) {var _c_this = this; var _c_root_method_arguments = arguments;
		select.where(_c_this.field).equals(value);
		done(null);}

Websom.Controls.Number.prototype.validate = function (input, done) {var _c_this = this; var _c_root_method_arguments = arguments;
		if (_c_this.name in input.raw) {
			_c_this.validateField(input, input.raw[_c_this.name], done);
			}else if (_c_this.required) {
			done(new Websom.InputValidation(true, "Missing field " + _c_this.name));
			}else{
				done(new Websom.InputValidation(false, ""));
			}}

Websom.Controls.Number.prototype.fill = function (input, values, done) {var _c_this = this; var _c_root_method_arguments = arguments;
		_c_this.fillField(input.raw[_c_this.name], values);
		done();}

Websom.Controls.Number.prototype.filter = function (input, select, done) {var _c_this = this; var _c_root_method_arguments = arguments;
		if (_c_this.name in input.raw) {
			if (_c_this.logic == "and") {
				select.and();
				}else{
					select.or();
				}
			var val = _c_this.filterField(input.raw[_c_this.name], select, done);
			}else if (_c_this.required) {
			done(new Websom.InputValidation(true, "Missing field " + _c_this.name));
			}else{
				done(null);
			}}

Websom.Controls.Number.prototype.insert = function (input, data, key) {var _c_this = this; var _c_root_method_arguments = arguments;
}

Websom.Controls.Number.prototype.update = function (input, data) {var _c_this = this; var _c_root_method_arguments = arguments;
}

Websom.Controls.Number.prototype.message = function (input, name, data, send) {var _c_this = this; var _c_root_method_arguments = arguments;
		send(null);}

Websom.Controls.Number.prototype.use = function (inputChain) {var _c_this = this; var _c_root_method_arguments = arguments;
}

Websom.DatabaseTypes.Bool = function () {var _c_this = this;
	this.type = "bool";


}

Websom.DatabaseTypes.Bool.prototype.autoControl = function (field) {var _c_this = this; var _c_root_method_arguments = arguments;
		return new Websom.Controls.Bool(field.realName, field.fieldName, field);}

Websom.Controls.Bool = function () {var _c_this = this;
	this.required = false;

	this.name = "";

	this.field = "";

	this.logic = "or";

	this.fieldInfo = null;

	this.server = null;

	this.container = null;

	if (arguments.length == 1 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var field = arguments[0];
		_c_this.name = field;
		_c_this.field = field;
	}
else 	if (arguments.length == 2 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'string' || typeof arguments[1] == 'undefined' || arguments[1] === null)) {
		var field = arguments[0];
		var logic = arguments[1];
		_c_this.name = field;
		_c_this.field = field;
		_c_this.logic = logic;
	}
else 	if (arguments.length == 3 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'string' || typeof arguments[1] == 'undefined' || arguments[1] === null) && ((arguments[2] instanceof Websom.FieldInfo) || typeof arguments[2] == 'undefined' || arguments[2] === null)) {
		var name = arguments[0];
		var field = arguments[1];
		var fieldInfo = arguments[2];
		_c_this.name = name;
		_c_this.field = field;
		_c_this.fieldInfo = fieldInfo;
	}

}

Websom.Controls.Bool.prototype.validateField = function (input, value, done) {var _c_this = this; var _c_root_method_arguments = arguments;
		if ((typeof value == 'object' ? (Array.isArray(value) ? 'array' : 'map') : (typeof value == 'number' ? 'float' : typeof value)) == "boolean") {
			done(new Websom.InputValidation(false, ""));
			}else{
				done(new Websom.InputValidation(true, "Not a boolean type"));
			}}

Websom.Controls.Bool.prototype.fillField = function (value, values) {var _c_this = this; var _c_root_method_arguments = arguments;
		values[_c_this.field] = value;}

Websom.Controls.Bool.prototype.filterField = function (value, select, done) {var _c_this = this; var _c_root_method_arguments = arguments;
		var val = 0;
		if (value == true) {
			val = 1;
			}
		select.where(_c_this.field).equals(val);
		done(null);}

Websom.Controls.Bool.prototype.validate = function (input, done) {var _c_this = this; var _c_root_method_arguments = arguments;
		if (_c_this.name in input.raw) {
			_c_this.validateField(input, input.raw[_c_this.name], done);
			}else if (_c_this.required) {
			done(new Websom.InputValidation(true, "Missing field " + _c_this.name));
			}else{
				done(new Websom.InputValidation(false, ""));
			}}

Websom.Controls.Bool.prototype.fill = function (input, values, done) {var _c_this = this; var _c_root_method_arguments = arguments;
		_c_this.fillField(input.raw[_c_this.name], values);
		done();}

Websom.Controls.Bool.prototype.filter = function (input, select, done) {var _c_this = this; var _c_root_method_arguments = arguments;
		if (_c_this.name in input.raw) {
			if (_c_this.logic == "and") {
				select.and();
				}else{
					select.or();
				}
			var val = _c_this.filterField(input.raw[_c_this.name], select, done);
			}else if (_c_this.required) {
			done(new Websom.InputValidation(true, "Missing field " + _c_this.name));
			}else{
				done(null);
			}}

Websom.Controls.Bool.prototype.insert = function (input, data, key) {var _c_this = this; var _c_root_method_arguments = arguments;
}

Websom.Controls.Bool.prototype.update = function (input, data) {var _c_this = this; var _c_root_method_arguments = arguments;
}

Websom.Controls.Bool.prototype.message = function (input, name, data, send) {var _c_this = this; var _c_root_method_arguments = arguments;
		send(null);}

Websom.Controls.Bool.prototype.use = function (inputChain) {var _c_this = this; var _c_root_method_arguments = arguments;
}

Websom.DatabaseUpdate = function (field, value) {var _c_this = this;
	this.field = "";

	this.value = null;

		_c_this.field = field;
		_c_this.value = value;
}

Websom.Standard.UserSystem = function () {var _c_this = this;


}

//Relative Module
//Relative User
//Relative Login
//Relative Connection
Websom.Adapters.UserSystem = function () {var _c_this = this;


}

Websom.Adapters.UserSystem.Connection = function (server) {var _c_this = this;
	this.server = null;

		_c_this.server = server;
}

/*i async*/Websom.Adapters.UserSystem.Connection.prototype.getUser = async function (data) {var _c_this = this; var _c_root_method_arguments = arguments;
}

/*i async*/Websom.Adapters.UserSystem.Connection.prototype.initialize = async function () {var _c_this = this; var _c_root_method_arguments = arguments;
}

/*i async*/Websom.Adapters.UserSystem.Connection.prototype.shutdown = async function () {var _c_this = this; var _c_root_method_arguments = arguments;
}

Websom.Adapters.UserSystem.ConnectionUser = function (firstName, lastName, username, email) {var _c_this = this;
	this.firstName = "";

	this.lastName = "";

	this.username = "";

	this.email = "";

		_c_this.firstName = firstName;
		_c_this.lastName = lastName;
		_c_this.username = username;
		_c_this.email = email;
}

module.exports = Websom;