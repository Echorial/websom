Websom = function () {


}

Websom.Server = function () {
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

	this.micro = null;

	this.dashboard = null;

	this.userSystem = null;

	this.paymentSystem = null;

	this.config = null;

	this.scriptPath = "";

	this.websomRoot = "";

	this.status = new Websom.Status();

	if (arguments.length == 1 && ((arguments[0] instanceof Websom.Config) || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var config = arguments[0];
		
		
			this.scriptPath = __filename;
		
		this.websomRoot = Oxygen.FileSystem.resolve(Oxygen.FileSystem.dirName(this.scriptPath) + "/../../");
		this.config = config;
		this.security = new Websom.Services.Security(this);
		this.database = new Websom.Services.Database(this);
		this.module = new Websom.Services.Module(this);
		this.resource = new Websom.Services.Resource(this);
		this.view = new Websom.Services.View(this);
		this.router = new Websom.Services.Router(this);
		this.theme = new Websom.Services.Theme(this);
		this.pack = new Websom.Services.Pack(this);
		this.input = new Websom.Services.Input(this);
		this.crypto = new Websom.Services.Crypto(this);
		this.email = new Websom.Services.Email(this);
		this.micro = new Websom.Services.Micro(this);
		this.render = new Websom.Services.Render(this);
		this.status.inherit(this.security.start());
		this.status.inherit(this.database.start());
		this.status.inherit(this.module.start());
		this.status.inherit(this.resource.start());
		this.status.inherit(this.view.start());
		this.status.inherit(this.router.start());
		this.status.inherit(this.theme.start());
		this.status.inherit(this.pack.start());
		this.status.inherit(this.input.start());
		this.status.inherit(this.crypto.start());
		this.status.inherit(this.email.start());
		this.status.inherit(this.micro.start());
		this.status.inherit(this.render.start());
		if (this.config.bucket) {
			if ("reference" in this.config.bucket) {
				this.bucketReference = this.config.bucket["reference"];
				}
			}
	}

}

Websom.Server.prototype.injectExpression = function () {
	if (arguments.length == 1 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var src = arguments[0];
		this.router.injectScript = src;
	}
}

Websom.Server.prototype.getBucketFromReference = function () {
	if (arguments.length == 1 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var referenceName = arguments[0];
		if (referenceName in this.bucketReference) {
			return this.getBucket(this.bucketReference[referenceName]["bucket"]);
			}
		return null;
	}
}

Websom.Server.prototype.log = function (value) {
		
			console.log(value);
		}

Websom.Server.prototype.request = function () {
	if (arguments.length == 1 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var url = arguments[0];
		return new Websom.RequestChain(this, url);
	}
}

Websom.Server.prototype.getBucket = function () {
	if (arguments.length == 1 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var name = arguments[0];
		for (var i = 0; i < this.buckets.length; i++) {
			if (this.buckets[i].name == name) {
				return this.buckets[i];
				}
			}
		var buckets = this.config.bucket["buckets"];
		if (name in buckets) {
			return this.loadBucket(name, buckets[name]);
			}
	}
}

Websom.Server.prototype.loadBucket = function () {
	if (arguments.length == 2 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'object' || typeof arguments[1] == 'undefined' || arguments[1] === null)) {
		var name = arguments[0];
		var raw = arguments[1];
		var type = raw["type"];
		var bucket = Websom.Bucket.make(this, name, type, raw);
		this.buckets.push(bucket);
		return bucket;
	}
}

Websom.Server.prototype.listen = function () {
	if (arguments.length == 1 && (typeof arguments[0] == 'number' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var port = arguments[0];
		
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
}

Websom.Server.prototype.run = function () {
	if (arguments.length == 1 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var route = arguments[0];
		
	}
}

//Relative Carbon
//Relative Context
//Relative Error
//Relative FileSystem
//Relative File
//Relative Stat
Memory = function () {


}

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
Websom.Service = function () {
	this.server = null;

	if (arguments.length == 1 && ((arguments[0] instanceof Websom.Server) || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var server = arguments[0];
		this.server = server;
	}

}

Websom.Service.prototype.start = function () {
	if (arguments.length == 0) {

	}
}

Websom.Service.prototype.stop = function () {
	if (arguments.length == 0) {

	}
}

Websom.Service.prototype.end = function () {
	if (arguments.length == 0) {

	}
}

Websom.Services = function () {


}

Oxygen = function () {


}

Websom.Services.Builder = function () {
	this.server = null;

	if (arguments.length == 1 && ((arguments[0] instanceof Websom.Server) || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var server = arguments[0];
		this.server = server;
	}

}

Websom.Services.Builder.prototype.buildAll = function () {
	if (arguments.length == 0) {

	}
}

Websom.Services.Builder.prototype.buildClass = function () {
	if (arguments.length == 0) {

	}
}

Websom.Services.Builder.prototype.buildView = function () {
	if (arguments.length == 0) {

	}
}

Websom.Services.Builder.prototype.buildResource = function () {
	if (arguments.length == 0) {

	}
}

Websom.Services.Builder.prototype.start = function () {
	if (arguments.length == 0) {

	}
}

Websom.Services.Builder.prototype.stop = function () {
	if (arguments.length == 0) {

	}
}

Websom.Services.Builder.prototype.end = function () {
	if (arguments.length == 0) {

	}
}

Websom.Services.Crypto = function () {
	this.server = null;

	if (arguments.length == 1 && ((arguments[0] instanceof Websom.Server) || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var server = arguments[0];
		this.server = server;
	}

}

Websom.Services.Crypto.prototype.start = function () {
	if (arguments.length == 0) {

	}
else 	if (arguments.length == 0) {

	}
}

Websom.Services.Crypto.prototype.hashPassword = function () {
	if (arguments.length == 2 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'function' || typeof arguments[1] == 'undefined' || arguments[1] === null)) {
		var password = arguments[0];
		var done = arguments[1];
		
			const argon2 = require("argon2");
			argon2.hash(password).then((hashed) => {
				done(hashed);
			});
		
		
	}
}

Websom.Services.Crypto.prototype.verifyPassword = function () {
	if (arguments.length == 3 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'string' || typeof arguments[1] == 'undefined' || arguments[1] === null) && (typeof arguments[2] == 'function' || typeof arguments[2] == 'undefined' || arguments[2] === null)) {
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

Websom.Services.Crypto.prototype.randomHex = function () {
	if (arguments.length == 2 && (typeof arguments[0] == 'number' || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'function' || typeof arguments[1] == 'undefined' || arguments[1] === null)) {
		var length = arguments[0];
		var done = arguments[1];
		
			const crypto = require("crypto");
			crypto.randomBytes(length, (err, buffer) => {
				if (err)
					throw err;
				else
					done(buffer.toString("hex"));
			});
		
		
	}
}

Websom.Services.Crypto.prototype.smallId = function () {
	if (arguments.length == 1 && (typeof arguments[0] == 'function' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var done = arguments[0];
		
			const crypto = require("crypto");
			crypto.randomBytes(12, (err, buffer) => {
				if (err)
					throw err;
				else
					done(buffer.toString("base64").substr(0, 12).replace(new RegExp("\/", "g"), "_").replace(/\+/g, "-"));
			});
		
		
	}
}

Websom.Services.Crypto.prototype.longId = function () {
	if (arguments.length == 2 && (typeof arguments[0] == 'number' || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'function' || typeof arguments[1] == 'undefined' || arguments[1] === null)) {
		var amount = arguments[0];
		var done = arguments[1];
		
			const crypto = require("crypto");
			crypto.randomBytes(amount, (err, buffer) => {
				if (err)
					throw err;
				else
					done(buffer.toString("base64").substr(0, amount).replace(new RegExp("\/", "g"), "_").replace(/\+/g, "-"));
			});
		
		
	}
}

Websom.Services.Crypto.prototype.stop = function () {
	if (arguments.length == 0) {

	}
}

Websom.Services.Crypto.prototype.end = function () {
	if (arguments.length == 0) {

	}
}

Websom.Services.Database = function () {
	this.primary = null;

	this.databases = [];

	this.server = null;

	if (arguments.length == 1 && ((arguments[0] instanceof Websom.Server) || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var server = arguments[0];
		this.server = server;
	}

}

Websom.Services.Database.prototype.loadDatabase = function () {
	if (arguments.length == 1 && (typeof arguments[0] == 'object' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var raw = arguments[0];
		if ("type" in raw == false) {
			return Websom.Status.singleError("Services.Database", "No type provided in database config " + raw["name"]);
			}
		var type = raw["type"];
		var database = Websom.Database.make(this.server, type);
		if (database == null) {
			return Websom.Status.singleError("Services.Database", "Unkown database type '" + type + "'");
			}
		database.load(raw);
		
			database.connect((err) => {                                 
				if (err)
					console.log(err.display());
			});
		
		this.databases.push(database);
	}
}

Websom.Services.Database.prototype.start = function () {
	if (arguments.length == 0) {
		if (this.server.config.databaseFile.length > 0) {
			var config = Websom.Json.parse(Oxygen.FileSystem.readSync(this.server.config.databaseFile, "utf8"));
			if ("databases" in config) {
				var databases = config["databases"];
				for (var i = 0; i < databases.length; i++) {
					var database = databases[i];
					
					var err = this.loadDatabase(database);
					if (err != null) {
						return err;
						}
					}
				}
			if ("default" in config) {
				for (var i = 0; i < this.databases.length; i++) {
					if (this.databases[i].name == config["default"]) {
						this.primary = this.databases[i];
						return null;
						}
					}
				}
			}
	}
else 	if (arguments.length == 0) {

	}
}

Websom.Services.Database.prototype.stop = function () {
	if (arguments.length == 0) {

	}
}

Websom.Services.Database.prototype.end = function () {
	if (arguments.length == 0) {

	}
}

Websom.Services.Email = function () {
	this.server = null;

	if (arguments.length == 1 && ((arguments[0] instanceof Websom.Server) || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var server = arguments[0];
		this.server = server;
	}

}

Websom.Services.Email.prototype.getSender = function () {
	if (arguments.length == 1 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var sender = arguments[0];
		var raw = Websom.Json.parse(Oxygen.FileSystem.readSync(this.server.config.root + "/email.json", "utf8"));
		return raw["senders"][sender];
	}
}

Websom.Services.Email.prototype.send = function () {
	if (arguments.length == 3 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null) && ((arguments[1] instanceof Websom.Email) || typeof arguments[1] == 'undefined' || arguments[1] === null) && (typeof arguments[2] == 'function' || typeof arguments[2] == 'undefined' || arguments[2] === null)) {
		var sender = arguments[0];
		var email = arguments[1];
		var sent = arguments[2];
		if (this.server.config.dev && this.server.config.devSendMail == false) {
			if (Oxygen.FileSystem.exists(this.server.config.root + "/dev_emails") == false) {
				Oxygen.FileSystem.makeDir(this.server.config.root + "/dev_emails");
				}
			Oxygen.FileSystem.writeSync(this.server.config.root + "/dev_emails/" + email.subject.replace(new RegExp("/".replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&'), 'g'), "_") + ".html", "Sender: " + sender + "\n" + "\nRecipients: " + email.recipients.join(", ") + "\n\nBody:\n" + email.body.replace(new RegExp("\n".replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&'), 'g'), "	\n"));
			}else{
				var rawSender = this.getSender(sender);
				
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
			
				
			}
	}
}

Websom.Services.Email.prototype.start = function () {
	if (arguments.length == 0) {

	}
}

Websom.Services.Email.prototype.stop = function () {
	if (arguments.length == 0) {

	}
}

Websom.Services.Email.prototype.end = function () {
	if (arguments.length == 0) {

	}
}

Websom.Email = function () {
	this.html = false;

	this.recipients = null;

	this.subject = "";

	this.body = "";

	if (arguments.length == 3 && (arguments[0]instanceof Array || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'string' || typeof arguments[1] == 'undefined' || arguments[1] === null) && (typeof arguments[2] == 'string' || typeof arguments[2] == 'undefined' || arguments[2] === null)) {
		var recipients = arguments[0];
		var subject = arguments[1];
		var body = arguments[2];
		this.recipients = recipients;
		this.body = body;
		this.subject = subject;
	}

}

Websom.Email.prototype.attach = function () {
	if (arguments.length == 0) {

	}
}

Websom.Services.Input = function () {
	this.inputs = [];

	this.clientValidate = "";

	this.inputTypes = [];

	this.completed = {};

	this.restrictHandlers = {};

	this.server = null;

	if (arguments.length == 1 && ((arguments[0] instanceof Websom.Server) || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var server = arguments[0];
		this.server = server;
	}

}

Websom.Services.Input.prototype.start = function () {
	if (arguments.length == 0) {
		this.clientValidate = this.buildClientValidation();
		this.restriction("permission", function (perm, req, callback) {
			req.getUser(function (user) {
				if (user != null) {
					user.hasPermission(perm, function (yes) {
						callback(yes);
						});
					}else{
						callback(false);
					}
				});
			});
		this.restriction("group", function (name, req, callback) {
			req.getUser(function (user) {
				if (user != null) {
					user.inGroup(name, function (yes) {
						callback(yes);
						});
					}else{
						callback(false);
					}
				});
			});
		this.restriction("username", function (username, req, callback) {
			req.getUser(function (user) {
				if (user != null && user.username == username) {
					callback(true);
					}else{
						callback(false);
					}
				});
			});
		this.restriction("is", function (type, req, callback) {
			if (type == "user") {
				req.getUser(function (user) {
					if (user != null) {
						callback(true);
						}else{
							callback(false);
						}
					});
				}else{
					throw new Error("Unkown is restriction with type " + type);
				}
			});
	}
else 	if (arguments.length == 0) {

	}
}

Websom.Services.Input.prototype.buildClientValidation = function () {
	if (arguments.length == 0) {
		var strs = [];
		for (var i = 0; i < this.inputs.length; i++) {
			var input = this.inputs[i];
			if (input.containerInterface != null) {
				var name = input.containerInterface.dataInfo.name;
				if (name in this.completed == false) {
					this.completed[name] = true;
					strs.push("\"" + name + "\": {" + this.buildDataValidation(input.containerInterface.dataInfo) + "}");
					}
				}
			}
		var seg = "";
		if (this.inputTypes.length > 0) {
			seg = ", ";
			}
		return "<script>Websom.inputValidation = {" + strs.join(", ") + seg + this.inputTypes.join(", ") + "};</script>";
	}
}

Websom.Services.Input.prototype.restriction = function () {
	if (arguments.length == 2 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'function' || typeof arguments[1] == 'undefined' || arguments[1] === null)) {
		var key = arguments[0];
		var callback = arguments[1];
		this.restrictHandlers[key] = callback;
	}
}

Websom.Services.Input.prototype.buildDataValidation = function () {
	if (arguments.length == 1 && ((arguments[0] instanceof Websom.DataInfo) || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var info = arguments[0];
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
				if (name in this.completed == false) {
					this.completed[name] = true;
					this.inputTypes.push("\"" + name + "\": {" + this.buildDataValidation(dataInfo) + "}");
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
		return keys.join(", ");
	}
}

Websom.Services.Input.prototype.register = function () {
	if (arguments.length == 2 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'function' || typeof arguments[1] == 'undefined' || arguments[1] === null)) {
		var key = arguments[0];
		var callback = arguments[1];
		var handler = new Websom.InputHandler(key, callback);
		this.inputs.push(handler);
		return handler;
	}
}

Websom.Services.Input.prototype.handle = function (key, raw, req) {
		var handled = false;
		for (var i = 0; i < this.inputs.length; i++) {
			var input = this.inputs[i];
			if (input.key == key) {
				handled = true;
				input.handle(raw, req);
				}
			}
		if (handled == false) {
			req.send("Invalid key " + key);
			}}

Websom.Services.Input.prototype.interface = function () {
	if (arguments.length == 1 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var key = arguments[0];
		var chain = null;
		var handler = this.register(key, function (input) {
			chain.received(input);
			});
		chain = new Websom.InputChain(handler);
		return chain;
	}
}

Websom.Services.Input.prototype.stop = function () {
	if (arguments.length == 0) {

	}
}

Websom.Services.Input.prototype.end = function () {
	if (arguments.length == 0) {

	}
}

Websom.InputHandler = function () {
	this.key = "";

	this.handler = null;

	this.containerInterface = null;

	if (arguments.length == 2 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'function' || typeof arguments[1] == 'undefined' || arguments[1] === null)) {
		var key = arguments[0];
		var handler = arguments[1];
		this.key = key;
		this.handler = handler;
	}

}

Websom.InputHandler.prototype.handle = function (raw, req) {
		var input = new Websom.Input(this.key, raw, req);
		input.server = req.server;
		this.handler(input);}

Websom.File = function () {
	this.name = "";

	this.path = "";

	this.type = "";

	this.size = 0;

	if (arguments.length == 4 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'string' || typeof arguments[1] == 'undefined' || arguments[1] === null) && (typeof arguments[2] == 'number' || typeof arguments[2] == 'undefined' || arguments[2] === null) && (typeof arguments[3] == 'string' || typeof arguments[3] == 'undefined' || arguments[3] === null)) {
		var name = arguments[0];
		var path = arguments[1];
		var size = arguments[2];
		var type = arguments[3];
		this.name = name;
		this.path = path;
		this.size = size;
		this.type = type;
	}

}

Websom.Input = function (key, raw, request) {
	this.server = null;

	this.raw = null;

	this.files = {};

	this.request = null;

	this.key = "";

	this.route = "";

	this.updateData = null;

		this.key = key;
		this.raw = raw;
		if ("_w_route" in raw) {
			this.route = raw["_w_route"];
			}
		this.request = request;
		this.server = this.request.server;
		
			if (request.jsRequest.files) {
				for (let files in request.jsRequest.files) {
					let file = request.jsRequest.files[files];
					if (!(file.fieldname in this.files))
						this.files[file.fieldname] = [];
					
					this.files[file.fieldname].push(new Websom.File(file.originalname, file.path, file.size, file.mimetype));

					                                                      
                                                         
                          
        
            
                                                 
                                                                                                       
        
				}
			}
		
		
}

Websom.Input.prototype.validate = function () {
	if (arguments.length == 2 && ((arguments[0] instanceof Websom.InputValidator || (arguments[0] instanceof Websom.DataValidator)) || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'function' || typeof arguments[1] == 'undefined' || arguments[1] === null)) {
		var val = arguments[0];
		var done = arguments[1];
		val.validate(this, done);
	}
}

Websom.Input.prototype.has = function () {
	if (arguments.length == 1 && (arguments[0]instanceof Array || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var keys = arguments[0];
		for (var i = 0; i < keys.length; i++) {
			if (keys[i] in this.raw == false) {
				return false;
				}
			}
		return true;
	}
}

Websom.Input.prototype.send = function () {
	if (arguments.length == 1 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var raw = arguments[0];
		this.request.send(raw);
	}
}

Websom.Input.prototype.sendAction = function () {
	if (arguments.length == 1 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var actionName = arguments[0];
		this.request.send("{\"status\": \"action\", \"action\": " + Websom.Json.encode(actionName) + "}");
	}
}

Websom.Input.prototype.sendError = function () {
	if (arguments.length == 1 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var message = arguments[0];
		this.request.send("{\"status\": \"error\", \"message\": " + Websom.Json.encode(message) + "}");
	}
}

Websom.Input.prototype.sendSuccess = function () {
	if (arguments.length == 1 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var message = arguments[0];
		this.request.send("{\"status\": \"success\", \"message\": " + Websom.Json.encode(message) + "}");
	}
}

Websom.Input.prototype.validateCaptcha = function () {
	if (arguments.length == 1 && (typeof arguments[0] == 'function' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var callback = arguments[0];
		var that = this;
		var url = "https://www.google.com/recaptcha/api/siteverify";
		if (("_captcha" in this.raw) && (typeof this.raw["_captcha"] == 'object' ? (Array.isArray(this.raw["_captcha"]) ? 'array' : 'map') : (typeof this.raw["_captcha"] == 'number' ? 'float' : typeof this.raw["_captcha"])) == "string") {
			this.server.security.load();
			this.server.request(url).form("response", this.raw["_captcha"]).form("secret", this.server.security.serviceKey).parseJson().post(function (res) {
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
			}
	}
}

Websom.InputValidator = function () {


}

Websom.InputValidation = function () {
	this.hadError = false;

	this.message = "";

	this.field = null;

	if (arguments.length == 2 && (typeof arguments[0] == 'boolean' || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'string' || typeof arguments[1] == 'undefined' || arguments[1] === null)) {
		var hadError = arguments[0];
		var message = arguments[1];
		this.hadError = hadError;
		this.message = message;
	}
else 	if (arguments.length == 3 && (typeof arguments[0] == 'boolean' || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'string' || typeof arguments[1] == 'undefined' || arguments[1] === null) && ((arguments[2] instanceof Websom.FieldInfo) || typeof arguments[2] == 'undefined' || arguments[2] === null)) {
		var hadError = arguments[0];
		var message = arguments[1];
		var field = arguments[2];
		this.hadError = hadError;
		this.message = message;
		this.field = field;
	}

}

Websom.InputValidation.prototype.stringify = function () {
	if (arguments.length == 0) {
		if (this.field == null) {
			return this.message;
			}else{
				return this.message + " on field " + this.field.realName;
			}
	}
}

Websom.Micro = function () {


}

Websom.Services.Micro = function () {
	this.text = null;

	this.command = null;

	this.server = null;

	if (arguments.length == 1 && ((arguments[0] instanceof Websom.Server) || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var server = arguments[0];
		this.server = server;
	}

}

Websom.Services.Micro.prototype.start = function () {
	if (arguments.length == 0) {
		var status = new Websom.Status();
		this.text = new Websom.Micro.Text(this.server);
		this.command = new Websom.Micro.Command(this.server);
		status.inherit(this.text.start());
		status.inherit(this.command.start());
		return status;
	}
else 	if (arguments.length == 0) {

	}
}

Websom.Services.Micro.prototype.stop = function () {
	if (arguments.length == 0) {

	}
}

Websom.Services.Micro.prototype.end = function () {
	if (arguments.length == 0) {

	}
}

Websom.MicroService = function () {
	this.server = null;

	if (arguments.length == 1 && ((arguments[0] instanceof Websom.Server) || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var server = arguments[0];
		this.server = server;
	}

}

Websom.Services.Module = function () {
	this.modules = [];

	this.watchers = [];

	this.server = null;

	if (arguments.length == 1 && ((arguments[0] instanceof Websom.Server) || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var server = arguments[0];
		this.server = server;
	}

}

Websom.Services.Module.requireMod = function () {
	if (arguments.length == 2 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null) && ((arguments[1] instanceof Websom.Server) || typeof arguments[1] == 'undefined' || arguments[1] === null)) {
		var dir = arguments[0];
		var server = arguments[1];
var modCon =  require(arguments[0] + 'module.js'); return new modCon(arguments[1]);
	}
}

Websom.Services.Module.prototype.rebuild = function () {
	if (arguments.length == 0) {
		console.log("Rebuilding all");
		for (var i = 0; i < this.modules.length; i++) {
			var module = this.modules[i];
			
				this.buildModule(module.root, JSON.parse(require("fs").readFileSync(require("path").resolve(module.root, module.name) + ".json")));
			
			}
		this.server.resource.build(true);
		return null;
	}
}

Websom.Services.Module.prototype.load = function () {
	if (arguments.length == 3 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'object' || typeof arguments[1] == 'undefined' || arguments[1] === null) && (typeof arguments[2] == 'boolean' || typeof arguments[2] == 'undefined' || arguments[2] === null)) {
		var modDir = arguments[0];
		var config = arguments[1];
		var single = arguments[2];
		if (require('fs').existsSync(modDir + '/module.js') == false) {
			console.log("Building module " + config["name"]);
			this.buildModule(modDir, config);
			}
		var that = this;
		
			if (this.server.config.dev) {
				if (config.npm) {
					const npm = require('npm');

					npm.load((err) => {
						let packages = [];
						for (let package in config.npm)
							packages.push(package + "@" + config.npm[package]);
						
						npm.commands.install(packages, (er, data) => {                                                                                        

						});
					});
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
				console.log("Setup watch on module " + config.name);
				this.watchers.push(fs.watch(modDir, {recursive: true}, function (type, file) {
					var ext = file.split(".");
					ext = ext[ext.length - 1];
					if (file != modDir + "/module.php" && file != modDir + "/module.js") {
						var slash = "/";
						if (ext == "carb") {
							console.log("Saw change on " + file + ". Rebuilding carbon");
							that.buildModule(modDir, JSON.parse(fs.readFileSync(modDir + slash + config["name"] + ".json")));
							that.server.resource.build(true);
						}else{
							console.log("Saw change on " + file + ". Rebuilding resources");
							that.server.resource.build(true);
						}
						if (!single) {
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
						}else{
							this.close();
							that.load(modDir, config, single);
							that.server.resource.buildViews();
						}
					}
				}));
			}
		
		              
			delete require.cache[require.resolve(modDir + "/module.js")];
		
		var mod = Websom.Services.Module.requireMod(modDir + "/", this.server);
		mod.root = modDir;
		for (var i = 0; i < this.modules.length; i++) {
			if (this.modules[i].root == modDir) {
				this.modules.splice(i, 1);
				break;
				}
			}
		this.modules.push(mod);
		if ("assets" in config) {
			var assets = config["assets"];
			for (var i = 0; i < assets.length; i++) {
				if (assets[i]["name"] == "font-awesome") {
					this.server.resource.assetFontAwesome = true;
					}
				}
			}
		
			mod.bridges = mod.setupBridges();
		
		
		return mod.spawn(config);
	}
}

Websom.Services.Module.prototype.loadAllContainers = function () {
		var log = "";
		for (var mi = 0; mi < this.modules.length; mi++) {
			var mod = this.modules[mi];
			for (var i = 0; i < mod.containers.length; i++) {
				var container = mod.containers[i];
				log += "Setup container " + mod.name + "." + container.name + "\n";
				container.realize(this.server.database.primary, function (err) {
					if (err.length > 0) {
						log += "Error in container " + container.name + ": " + err + "\n";
						}
					});
				}
			}
		return log;}

Websom.Services.Module.prototype.checkContainers = function (module) {
		for (var i = 0; i < module.containers.length; i++) {
			var container = module.containers[i];
			console.log("Setup container " + module.name + "." + container.name);
			container.realize(this.server.database.primary, function (err) {
				if (err.length > 0) {
					console.log("Error in container " + container.name + ": " + err);
					}
				});
			}}

Websom.Services.Module.prototype.reload = function () {
	if (arguments.length == 1 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var path = arguments[0];
		                        
			                                                       
                              
                         
      
		
		var mods = Oxygen.FileSystem.readDirSync(path);
		var dash = Oxygen.FileSystem.resolve(Oxygen.FileSystem.dirName(this.server.scriptPath) + "/../../dashboard");
		var core = Oxygen.FileSystem.resolve(Oxygen.FileSystem.dirName(this.server.scriptPath) + "/../../coreModule");
		this.load(dash, Websom.Json.parse(Oxygen.FileSystem.readSync(dash + "/dashboard.json", "utf8")), true);
		this.load(core, Websom.Json.parse(Oxygen.FileSystem.readSync(core + "/coreModule.json", "utf8")), true);
		for (var i = 0; i < this.modules.length; i++) {
			if (this.modules[i].name == "dashboard") {
				this.server.dashboard = this.modules[i];
				}
			}
		var doLoad = true;
		if (doLoad) {
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
						var status = this.load(modDir, config, false);
						if (status != null) {
							return status;
							}
						}
					}
				}
			}
		for (var i = 0; i < this.modules.length; i++) {
			var module = this.modules[i];
			var containers = module.setupData();
			if (containers != null) {
				module.containers = containers;
				}
			
				module.bridges = module.setupBridges();
			
			
			this.checkContainers(module);
			var status = module.start();
			if (status != null) {
				return status;
				}
			}
	}
}

Websom.Services.Module.prototype.buildModule = function () {
	if (arguments.length == 2 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'object' || typeof arguments[1] == 'undefined' || arguments[1] === null)) {
		var dir = arguments[0];
		var config = arguments[1];
		var name = config["name"];
		var error = null;
		
			error = require('../../core/util/native/carbonite.js').buildModule(dir + "/" + name + ".carb");
		
		if (error != null) {
			return error;
			}
	}
}

Websom.Services.Module.prototype.buildModules = function () {
	if (arguments.length == 1 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var path = arguments[0];
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
					var status = this.buildModule(modDir, config);
					if (status != null) {
						return status;
						}
					}
				}
			}
	}
}

Websom.Services.Module.prototype.start = function () {
	if (arguments.length == 0) {
		var dir = this.server.config.root + "/modules/";
		if (Oxygen.FileSystem.exists(dir) == false) {
			Oxygen.FileSystem.makeDir(dir);
			}
		return this.reload(dir);
	}
}

Websom.Services.Module.prototype.handleBridge = function () {
	if (arguments.length == 4 && ((arguments[0] instanceof Websom.Request) || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'string' || typeof arguments[1] == 'undefined' || arguments[1] === null) && (typeof arguments[2] == 'string' || typeof arguments[2] == 'undefined' || arguments[2] === null) && (arguments[3]instanceof Array || typeof arguments[3] == 'undefined' || arguments[3] === null)) {
		var req = arguments[0];
		var bridgeName = arguments[1];
		var method = arguments[2];
		var args = arguments[3];
		for (var i = 0; i < this.modules.length; i++) {
			var mod = this.modules[i];
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
			}
	}
}

Websom.Services.Module.prototype.stop = function () {
	if (arguments.length == 0) {

	}
}

Websom.Services.Module.prototype.end = function () {
	if (arguments.length == 0) {

	}
}

Websom.Services.Pack = function () {
	this.packs = [];

	this.server = null;

	if (arguments.length == 1 && ((arguments[0] instanceof Websom.Server) || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var server = arguments[0];
		this.server = server;
	}

}

Websom.Services.Pack.prototype.load = function () {
	if (arguments.length == 2 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'object' || typeof arguments[1] == 'undefined' || arguments[1] === null)) {
		var packDir = arguments[0];
		var config = arguments[1];
		var that = this;
		if ("name" in config == false) {
			return Websom.Status.singleError("Pack", "Must provide name in pack config " + packDir);
			}
		var pack = new Websom.Pack(this.server, config["name"], packDir, config);
		if (this.server.config.dev) {
			pack.buildAndSave(function (err) {
				if (err.length > 0) {
					that.server.status.inherit(Websom.Status.singleError("Pack." + pack.name, err));
					}
				});
			}
		this.packs.push(pack);
		
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
}

Websom.Services.Pack.prototype.reload = function () {
	if (arguments.length == 1 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var path = arguments[0];
		if (this.server.config.dev) {
			var dir = this.server.config.resources + "/pack/";
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
				var status = this.load(packDir, config);
				if (status != null) {
					return status;
					}
				}
			}
		for (var i = 0; i < this.packs.length; i++) {
			var pack = this.packs[i];
			var status = pack.start();
			if (status != null) {
				return status;
				}
			}
	}
}

Websom.Services.Pack.prototype.include = function () {
	if (arguments.length == 0) {
		var inc = "";
		for (var i = 0; i < this.packs.length; i++) {
			inc += this.packs[i].include();
			}
		return inc;
	}
}

Websom.Services.Pack.prototype.start = function () {
	if (arguments.length == 0) {
		var dir = this.server.config.root + "/packs/";
		if (Oxygen.FileSystem.exists(dir) == false) {
			Oxygen.FileSystem.makeDir(dir);
			}
		return this.reload(dir);
	}
}

Websom.Services.Pack.prototype.stop = function () {
	if (arguments.length == 0) {

	}
}

Websom.Services.Pack.prototype.end = function () {
	if (arguments.length == 0) {

	}
}

Websom.Render = function () {


}

Websom.Services.Render = function () {
	this.server = null;

	if (arguments.length == 1 && ((arguments[0] instanceof Websom.Server) || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var server = arguments[0];
		this.server = server;
	}

}

Websom.Services.Render.prototype.start = function () {
	if (arguments.length == 0) {

	}
}

Websom.Services.Render.prototype.renderView = function () {
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
		var view = this.server.view.getView(viewName);
		return this.renderView(view, ctx);
	}
}

Websom.Services.Render.prototype.findView = function () {
	if (arguments.length == 1 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var name = arguments[0];
		var view = this.server.view.getView(name);
		if (view != null) {
			if (view.renderView == null) {
				view.buildRenderView();
				}
			return view.renderView;
			}else{
				return null;
			}
	}
}

Websom.Services.Render.prototype.stop = function () {
	if (arguments.length == 0) {

	}
}

Websom.Services.Render.prototype.end = function () {
	if (arguments.length == 0) {

	}
}

Websom.Services.Resource = function () {
	this.globalScripts = [];

	this.globalStyles = [];

	this.deployConfig = null;

	this.assetFontAwesome = false;

	this.deployHandlers = [];

	this.server = null;

	if (arguments.length == 1 && ((arguments[0] instanceof Websom.Server) || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var server = arguments[0];
		this.server = server;
	}

}

Websom.Services.Resource.prototype.start = function () {
	if (arguments.length == 0) {
		this.deployHandlers.push(new Websom.FtpHandler(this.server));
		this.deployHandlers.push(new Websom.LocalHandler(this.server));
	}
}

Websom.Services.Resource.prototype.loadDeployConfig = function () {
	if (arguments.length == 0) {
		if (this.deployConfig == null) {
			var path = this.server.config.root + "/deploy.json";
			if (Oxygen.FileSystem.exists(path) == false) {
				Oxygen.FileSystem.writeSync(path, "{\n	\"deploys\": []\n}");
				}
			this.deployConfig = Websom.Json.parse(Oxygen.FileSystem.readSync(path, "utf8"));
			}
	}
}

Websom.Services.Resource.prototype.deploy = function () {
	if (arguments.length == 2 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'function' || typeof arguments[1] == 'undefined' || arguments[1] === null)) {
		var name = arguments[0];
		var callback = arguments[1];
		this.deploy(name, function (msg) {
			console.log(msg);
			}, callback);
	}
else 	if (arguments.length == 3 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'function' || typeof arguments[1] == 'undefined' || arguments[1] === null) && (typeof arguments[2] == 'function' || typeof arguments[2] == 'undefined' || arguments[2] === null)) {
		var name = arguments[0];
		var progress = arguments[1];
		var callback = arguments[2];
		this.loadDeployConfig();
		progress("Searching for deploy " + name);
		var deploy = this.findDeploy(name);
		if (deploy == null) {
			progress("Unknown deploy " + name);
			callback();
			return null;
			}
		var handler = this.findHandler(deploy["handler"]);
		if (handler == null) {
			progress("Unknown handler " + name);
			callback();
			return null;
			}
		handler.execute(deploy, progress, callback);
	}
}

Websom.Services.Resource.prototype.findHandler = function () {
	if (arguments.length == 1 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var name = arguments[0];
		for (var i = 0; i < this.deployHandlers.length; i++) {
			if (this.deployHandlers[i].name == name) {
				return this.deployHandlers[i];
				}
			}
		return null;
	}
}

Websom.Services.Resource.prototype.findDeploy = function () {
	if (arguments.length == 1 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var name = arguments[0];
		var cast = this.deployConfig["deploys"];
		for (var i = 0; i < cast.length; i++) {
			if (cast[i]["name"] == name) {
				return cast[i];
				}
			}
		return null;
	}
}

Websom.Services.Resource.prototype.buildViews = function () {
	if (arguments.length == 1 && (typeof arguments[0] == 'boolean' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var saveToFiles = arguments[0];
		var viewStr = "";
		for (var i = 0; i < this.server.module.modules.length; i++) {
			var module = this.server.module.modules[i];
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
					if ("type" in res == false) {
						var realPath = Oxygen.FileSystem.resolve(module.root + "/" + path);
						if (Oxygen.FileSystem.isDir(realPath)) {
							var files = Oxygen.FileSystem.readDirSync(realPath);
							for (var f = 0; f < files.length; f++) {
								var file = files[f];
								var splits = file.split(".");
								if (splits.length > 1) {
									if (splits[splits.length - 1] == "view") {
										var view = new Websom.View(this.server);
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
								var view = new Websom.View(this.server);
								var viewErr = view.loadFromFile(Oxygen.FileSystem.resolve(module.root + "/" + path));
								view.hasLocalExport = true;
								viewStr += view.buildDev();
								}
						}
					}
				}
			if (saveToFiles) {
				Oxygen.FileSystem.writeSync(this.server.config.resources + "/module-view-" + module.name + ".js", viewStr);
				viewStr = "";
				}
			}
		if (saveToFiles == false) {
			return viewStr;
			}
	}
}

Websom.Services.Resource.prototype.exportToFolder = function () {
	if (arguments.length == 2 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'function' || typeof arguments[1] == 'undefined' || arguments[1] === null)) {
		var path = arguments[0];
		var callback = arguments[1];
		var that = this;
		Oxygen.FileSystem.writeSync(path + "/client.js", Oxygen.FileSystem.readSync(this.server.config.resources + "/client.js", null));
		Oxygen.FileSystem.writeSync(path + "/jquery.min.js", Oxygen.FileSystem.readSync(this.server.config.resources + "/jquery.min.js", null));
		if (Oxygen.FileSystem.exists(this.server.config.resources + "/text.js")) {
			Oxygen.FileSystem.writeSync(path + "/text.js", Oxygen.FileSystem.readSync(this.server.config.resources + "/text.js", null));
			}
		var resources = this.collect();
		var unbuilt = resources.length + this.server.theme.themes.length;
		var error = false;
		var errMsg = "";
		var totalJs = this.buildViews(false);
		var totalCss = "";
		for (var i = 0; i < this.server.view.pages.length; i++) {
			var page = this.server.view.pages[i];
			totalJs += page.buildDev();
			}
		for (var i = 0; i < this.server.view.views.length; i++) {
			var view = this.server.view.views[i];
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
		for (var i = 0; i < this.server.theme.themes.length; i++) {
			var theme = this.server.theme.themes[i];
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
		var files = this.collect();
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
			}
	}
}

Websom.Services.Resource.prototype.collect = function () {
	if (arguments.length == 0) {
		var that = this;
		var output = [];
		var buildPackage = function (typeStr, name, root, raw) {
			for (var r = 0; r < raw.length; r++) {
				var res = raw[r];
				var type = "";
				var path = res["path"];
				if ("type" in res == false) {
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
		for (var i = 0; i < this.server.module.modules.length; i++) {
			var module = this.server.module.modules[i];
			if ("resources" in module.baseConfig) {
				var raw = module.baseConfig["resources"];
				buildPackage("module", module.name, module.root, raw);
				}
			}
		return output;
	}
}

Websom.Services.Resource.prototype.build = function () {
	if (arguments.length == 1 && (typeof arguments[0] == 'boolean' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var dev = arguments[0];
		if (Oxygen.FileSystem.exists(this.server.config.resources) == false) {
			Oxygen.FileSystem.makeDir(this.server.config.resources);
			}
		var files = this.collect();
		var err = this.buildViews(true);
		if (err != null) {
			return Websom.Status.singleError("View", err);
			}
		if (dev) {
			if (Oxygen.FileSystem.exists(this.server.config.resources + "/jquery.min.js") == false) {
				Oxygen.FileSystem.writeSync(this.server.config.resources + "/jquery.min.js", Oxygen.FileSystem.readSync(this.server.websomRoot + "/client/javascript/jquery.min.js", "utf8"));
				}
			var client = new Websom.Resources.Javascript(this.server, "Websom.Core", this.server.websomRoot + "/client/javascript/client.js");
			var input = new Websom.Resources.Javascript(this.server, "Websom.Core", this.server.websomRoot + "/client/javascript/input.js");
			var theme = new Websom.Resources.Javascript(this.server, "Websom.Core", this.server.websomRoot + "/client/javascript/theme.js");
			Oxygen.FileSystem.writeSync(this.server.config.resources + "/client.js", client.read() + theme.read() + input.read());
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
						if (Oxygen.FileSystem.exists(this.server.config.resources + "/" + toPath) == false) {
							Oxygen.FileSystem.makeDir(this.server.config.resources + "/" + toPath);
							}
						}
					}
				files[i].buildToFile(this.server.config.resources + "/" + path);
				}
			}
	}
}

Websom.Services.Resource.prototype.include = function () {
	if (arguments.length == 1 && (typeof arguments[0] == 'boolean' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var dev = arguments[0];
		var output = "";
		if (dev) {
			output += "<script src=\"" + this.server.config.clientResources + "/jquery.min.js\"></script>";
			var files = this.collect();
			for (var i = 0; i < files.length; i++) {
				output += files[i].toHtmlInclude() + "\n";
				}
			for (var i = 0; i < this.server.module.modules.length; i++) {
				output += "<script src='" + this.server.config.clientResources + "/module-view-" + this.server.module.modules[i].name + ".js'></script>";
				}
			}
		if (this.assetFontAwesome) {
			output += "<link rel=\"stylesheet\" href=\"https:/" + "/use.fontawesome.com/releases/v5.3.1/css/all.css\" integrity=\"sha384-mzrmE5qonljUremFsqc01SB46JvROS7bZs3IO2EmfFsd15uHvIt+Y8vEf7N7fWAU\" crossorigin=\"anonymous\">";
			}
		return output;
	}
}

Websom.Services.Resource.prototype.compile = function () {
	if (arguments.length == 3 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'string' || typeof arguments[1] == 'undefined' || arguments[1] === null) && (arguments[2]instanceof Array || typeof arguments[2] == 'undefined' || arguments[2] === null)) {
		var owner = arguments[0];
		var basePath = arguments[1];
		var resources = arguments[2];
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
							output.push(Websom.Resource.make(this.server, raw["type"], owner, realPath + "/" + file));
							output[output.length].raw = raw;
							}
						}else{
							output.push(Websom.Resource.make(this.server, raw["type"], owner, realPath));
						}
					}else{
						output.push(Websom.Resource.invalid(this.server, owner, realPath));
					}
				}else if ("path" in raw) {
				var realPath = Oxygen.FileSystem.resolve(basePath + "/" + raw["path"]);
				if (Oxygen.FileSystem.isDir(realPath)) {
					var files = Oxygen.FileSystem.readDirSync(realPath);
					for (var f = 0; f < files.length; f++) {
						var file = files[f];
						var splits = file.split(".");
						if (splits.length > 1) {
							if (splits[splits.length - 1] == "view") {
								output.push(Websom.Resource.make(this.server, "view", owner, realPath + "/" + file));
								}
							}
						}
					}
				}else{
					output.push(Websom.Resource.invalid(this.server, owner, "Unkown"));
				}
			}
		return output;
	}
}

Websom.Services.Resource.prototype.stop = function () {
	if (arguments.length == 0) {

	}
}

Websom.Services.Resource.prototype.end = function () {
	if (arguments.length == 0) {

	}
}

Websom.DeployHandler = function () {
	this.name = "";

	this.server = null;

	if (arguments.length == 1 && ((arguments[0] instanceof Websom.Server) || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var server = arguments[0];
		this.server = server;
	}

}

Websom.DeployHandler.prototype.getFiles = function () {
	if (arguments.length == 1 && (typeof arguments[0] == 'function' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var callback = arguments[0];
		
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
}

Websom.FtpHandler = function () {
	this.name = "ftp";

	this.server = null;

	if (arguments.length == 1 && ((arguments[0] instanceof Websom.Server) || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var server = arguments[0];
		this.server = server;
	}

}

Websom.FtpHandler.prototype.execute = function () {
	if (arguments.length == 3 && (typeof arguments[0] == 'object' || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'function' || typeof arguments[1] == 'undefined' || arguments[1] === null) && (typeof arguments[2] == 'function' || typeof arguments[2] == 'undefined' || arguments[2] === null)) {
		var config = arguments[0];
		var progress = arguments[1];
		var finish = arguments[2];
		
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
}

Websom.FtpHandler.prototype.getFiles = function () {
	if (arguments.length == 1 && (typeof arguments[0] == 'function' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var callback = arguments[0];
		
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
}

Websom.LocalHandler = function () {
	this.name = "local";

	this.server = null;

	if (arguments.length == 1 && ((arguments[0] instanceof Websom.Server) || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var server = arguments[0];
		this.server = server;
	}

}

Websom.LocalHandler.prototype.execute = function () {
	if (arguments.length == 3 && (typeof arguments[0] == 'object' || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'function' || typeof arguments[1] == 'undefined' || arguments[1] === null) && (typeof arguments[2] == 'function' || typeof arguments[2] == 'undefined' || arguments[2] === null)) {
		var config = arguments[0];
		var progress = arguments[1];
		var finish = arguments[2];
		
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
}

Websom.LocalHandler.prototype.getFiles = function () {
	if (arguments.length == 1 && (typeof arguments[0] == 'function' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var callback = arguments[0];
		
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
}

Websom.Resource = function () {
	this.server = null;

	this.owner = "";

	this.file = "";

	this.type = "resource";

	this.order = 0;

	this.isInvalid = false;

	this.reference = "";

	this.raw = null;

	if (arguments.length == 3 && ((arguments[0] instanceof Websom.Server) || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'string' || typeof arguments[1] == 'undefined' || arguments[1] === null) && (typeof arguments[2] == 'string' || typeof arguments[2] == 'undefined' || arguments[2] === null)) {
		var server = arguments[0];
		var owner = arguments[1];
		var file = arguments[2];
		this.owner = owner;
		this.file = file;
		this.server = server;
	}

}

Websom.Resource.make = function () {
	if (arguments.length == 4 && ((arguments[0] instanceof Websom.Server) || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'string' || typeof arguments[1] == 'undefined' || arguments[1] === null) && (typeof arguments[2] == 'string' || typeof arguments[2] == 'undefined' || arguments[2] === null) && (typeof arguments[3] == 'string' || typeof arguments[3] == 'undefined' || arguments[3] === null)) {
		var server = arguments[0];
		var type = arguments[1];
		var owner = arguments[2];
		var file = arguments[3];
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
			}
	}
}

Websom.Resource.invalid = function () {
	if (arguments.length == 3 && ((arguments[0] instanceof Websom.Server) || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'string' || typeof arguments[1] == 'undefined' || arguments[1] === null) && (typeof arguments[2] == 'string' || typeof arguments[2] == 'undefined' || arguments[2] === null)) {
		var server = arguments[0];
		var owner = arguments[1];
		var path = arguments[2];
		var invalid = new Websom.Resource(server, owner, path);
		invalid.isInvalid = true;
		return invalid;
	}
}

Websom.Resource.prototype.read = function () {
	if (arguments.length == 0) {
		return Oxygen.FileSystem.readSync(this.file, "utf8");
	}
}

Websom.Resource.prototype.rawRead = function () {
	if (arguments.length == 0) {
		return Oxygen.FileSystem.readSync(this.file, null);
	}
}

Websom.Resources = function () {


}

Websom.Resources.Javascript = function () {
	this.type = "javascript";

	this.server = null;

	this.owner = "";

	this.file = "";

	this.order = 0;

	this.isInvalid = false;

	this.reference = "";

	this.raw = null;

	if (arguments.length == 3 && ((arguments[0] instanceof Websom.Server) || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'string' || typeof arguments[1] == 'undefined' || arguments[1] === null) && (typeof arguments[2] == 'string' || typeof arguments[2] == 'undefined' || arguments[2] === null)) {
		var server = arguments[0];
		var owner = arguments[1];
		var file = arguments[2];
		this.owner = owner;
		this.file = file;
		this.server = server;
	}

}

Websom.Resources.Javascript.prototype.buildToFile = function () {
	if (arguments.length == 1 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var path = arguments[0];
		Oxygen.FileSystem.writeSync(path, this.read());
	}
}

Websom.Resources.Javascript.prototype.toHtmlInclude = function () {
	if (arguments.length == 0) {
		return "<script src=\"" + this.server.config.clientResources + "/" + this.owner + "-" + Oxygen.FileSystem.basename(this.file) + "\"></script>";
	}
}

Websom.Resources.Javascript.prototype.build = function () {
	if (arguments.length == 1 && (typeof arguments[0] == 'function' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var callback = arguments[0];
		callback(false, this.read());
	}
}

Websom.Resources.Javascript.make = function () {
	if (arguments.length == 4 && ((arguments[0] instanceof Websom.Server) || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'string' || typeof arguments[1] == 'undefined' || arguments[1] === null) && (typeof arguments[2] == 'string' || typeof arguments[2] == 'undefined' || arguments[2] === null) && (typeof arguments[3] == 'string' || typeof arguments[3] == 'undefined' || arguments[3] === null)) {
		var server = arguments[0];
		var type = arguments[1];
		var owner = arguments[2];
		var file = arguments[3];
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
			}
	}
}

Websom.Resources.Javascript.invalid = function () {
	if (arguments.length == 3 && ((arguments[0] instanceof Websom.Server) || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'string' || typeof arguments[1] == 'undefined' || arguments[1] === null) && (typeof arguments[2] == 'string' || typeof arguments[2] == 'undefined' || arguments[2] === null)) {
		var server = arguments[0];
		var owner = arguments[1];
		var path = arguments[2];
		var invalid = new Websom.Resource(server, owner, path);
		invalid.isInvalid = true;
		return invalid;
	}
}

Websom.Resources.Javascript.prototype.read = function () {
	if (arguments.length == 0) {
		return Oxygen.FileSystem.readSync(this.file, "utf8");
	}
}

Websom.Resources.Javascript.prototype.rawRead = function () {
	if (arguments.length == 0) {
		return Oxygen.FileSystem.readSync(this.file, null);
	}
}

Websom.Resources.File = function () {
	this.type = "file";

	this.server = null;

	this.owner = "";

	this.file = "";

	this.order = 0;

	this.isInvalid = false;

	this.reference = "";

	this.raw = null;

	if (arguments.length == 3 && ((arguments[0] instanceof Websom.Server) || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'string' || typeof arguments[1] == 'undefined' || arguments[1] === null) && (typeof arguments[2] == 'string' || typeof arguments[2] == 'undefined' || arguments[2] === null)) {
		var server = arguments[0];
		var owner = arguments[1];
		var file = arguments[2];
		this.owner = owner;
		this.file = file;
		this.server = server;
	}

}

Websom.Resources.File.prototype.buildToFile = function () {
	if (arguments.length == 1 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var path = arguments[0];
		Oxygen.FileSystem.writeSync(path, this.rawRead());
	}
}

Websom.Resources.File.prototype.toHtmlInclude = function () {
	if (arguments.length == 0) {
		return "";
	}
}

Websom.Resources.File.prototype.build = function () {
	if (arguments.length == 1 && (typeof arguments[0] == 'function' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var callback = arguments[0];
		callback(false, this.read());
	}
}

Websom.Resources.File.make = function () {
	if (arguments.length == 4 && ((arguments[0] instanceof Websom.Server) || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'string' || typeof arguments[1] == 'undefined' || arguments[1] === null) && (typeof arguments[2] == 'string' || typeof arguments[2] == 'undefined' || arguments[2] === null) && (typeof arguments[3] == 'string' || typeof arguments[3] == 'undefined' || arguments[3] === null)) {
		var server = arguments[0];
		var type = arguments[1];
		var owner = arguments[2];
		var file = arguments[3];
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
			}
	}
}

Websom.Resources.File.invalid = function () {
	if (arguments.length == 3 && ((arguments[0] instanceof Websom.Server) || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'string' || typeof arguments[1] == 'undefined' || arguments[1] === null) && (typeof arguments[2] == 'string' || typeof arguments[2] == 'undefined' || arguments[2] === null)) {
		var server = arguments[0];
		var owner = arguments[1];
		var path = arguments[2];
		var invalid = new Websom.Resource(server, owner, path);
		invalid.isInvalid = true;
		return invalid;
	}
}

Websom.Resources.File.prototype.read = function () {
	if (arguments.length == 0) {
		return Oxygen.FileSystem.readSync(this.file, "utf8");
	}
}

Websom.Resources.File.prototype.rawRead = function () {
	if (arguments.length == 0) {
		return Oxygen.FileSystem.readSync(this.file, null);
	}
}

Websom.Resources.View = function () {
	this.type = "view";

	this.server = null;

	this.owner = "";

	this.file = "";

	this.order = 0;

	this.isInvalid = false;

	this.reference = "";

	this.raw = null;

	if (arguments.length == 3 && ((arguments[0] instanceof Websom.Server) || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'string' || typeof arguments[1] == 'undefined' || arguments[1] === null) && (typeof arguments[2] == 'string' || typeof arguments[2] == 'undefined' || arguments[2] === null)) {
		var server = arguments[0];
		var owner = arguments[1];
		var file = arguments[2];
		this.owner = owner;
		this.file = file;
		this.server = server;
	}

}

Websom.Resources.View.prototype.buildToFile = function () {
	if (arguments.length == 1 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var path = arguments[0];

	}
}

Websom.Resources.View.prototype.toHtmlInclude = function () {
	if (arguments.length == 0) {
		return "";
	}
}

Websom.Resources.View.prototype.build = function () {
	if (arguments.length == 1 && (typeof arguments[0] == 'function' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var callback = arguments[0];
		var view = new Websom.View(this.server);
		view.loadFromFile(this.file);
		callback(false, view.buildDev());
	}
}

Websom.Resources.View.make = function () {
	if (arguments.length == 4 && ((arguments[0] instanceof Websom.Server) || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'string' || typeof arguments[1] == 'undefined' || arguments[1] === null) && (typeof arguments[2] == 'string' || typeof arguments[2] == 'undefined' || arguments[2] === null) && (typeof arguments[3] == 'string' || typeof arguments[3] == 'undefined' || arguments[3] === null)) {
		var server = arguments[0];
		var type = arguments[1];
		var owner = arguments[2];
		var file = arguments[3];
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
			}
	}
}

Websom.Resources.View.invalid = function () {
	if (arguments.length == 3 && ((arguments[0] instanceof Websom.Server) || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'string' || typeof arguments[1] == 'undefined' || arguments[1] === null) && (typeof arguments[2] == 'string' || typeof arguments[2] == 'undefined' || arguments[2] === null)) {
		var server = arguments[0];
		var owner = arguments[1];
		var path = arguments[2];
		var invalid = new Websom.Resource(server, owner, path);
		invalid.isInvalid = true;
		return invalid;
	}
}

Websom.Resources.View.prototype.read = function () {
	if (arguments.length == 0) {
		return Oxygen.FileSystem.readSync(this.file, "utf8");
	}
}

Websom.Resources.View.prototype.rawRead = function () {
	if (arguments.length == 0) {
		return Oxygen.FileSystem.readSync(this.file, null);
	}
}

Websom.Resources.Css = function () {
	this.type = "css";

	this.server = null;

	this.owner = "";

	this.file = "";

	this.order = 0;

	this.isInvalid = false;

	this.reference = "";

	this.raw = null;

	if (arguments.length == 3 && ((arguments[0] instanceof Websom.Server) || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'string' || typeof arguments[1] == 'undefined' || arguments[1] === null) && (typeof arguments[2] == 'string' || typeof arguments[2] == 'undefined' || arguments[2] === null)) {
		var server = arguments[0];
		var owner = arguments[1];
		var file = arguments[2];
		this.owner = owner;
		this.file = file;
		this.server = server;
	}

}

Websom.Resources.Css.prototype.buildToFile = function () {
	if (arguments.length == 1 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var path = arguments[0];
		Oxygen.FileSystem.writeSync(path, this.read());
	}
}

Websom.Resources.Css.prototype.toHtmlInclude = function () {
	if (arguments.length == 0) {
		return "<link rel=\"stylesheet\" href=\"" + this.server.config.clientResources + "/" + this.owner + "-" + Oxygen.FileSystem.basename(this.file) + "\"/>";
	}
}

Websom.Resources.Css.prototype.build = function () {
	if (arguments.length == 1 && (typeof arguments[0] == 'function' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var callback = arguments[0];
		callback(false, this.read());
	}
}

Websom.Resources.Css.make = function () {
	if (arguments.length == 4 && ((arguments[0] instanceof Websom.Server) || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'string' || typeof arguments[1] == 'undefined' || arguments[1] === null) && (typeof arguments[2] == 'string' || typeof arguments[2] == 'undefined' || arguments[2] === null) && (typeof arguments[3] == 'string' || typeof arguments[3] == 'undefined' || arguments[3] === null)) {
		var server = arguments[0];
		var type = arguments[1];
		var owner = arguments[2];
		var file = arguments[3];
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
			}
	}
}

Websom.Resources.Css.invalid = function () {
	if (arguments.length == 3 && ((arguments[0] instanceof Websom.Server) || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'string' || typeof arguments[1] == 'undefined' || arguments[1] === null) && (typeof arguments[2] == 'string' || typeof arguments[2] == 'undefined' || arguments[2] === null)) {
		var server = arguments[0];
		var owner = arguments[1];
		var path = arguments[2];
		var invalid = new Websom.Resource(server, owner, path);
		invalid.isInvalid = true;
		return invalid;
	}
}

Websom.Resources.Css.prototype.read = function () {
	if (arguments.length == 0) {
		return Oxygen.FileSystem.readSync(this.file, "utf8");
	}
}

Websom.Resources.Css.prototype.rawRead = function () {
	if (arguments.length == 0) {
		return Oxygen.FileSystem.readSync(this.file, null);
	}
}

Websom.Resources.Less = function () {
	this.type = "less";

	this.server = null;

	this.owner = "";

	this.file = "";

	this.order = 0;

	this.isInvalid = false;

	this.reference = "";

	this.raw = null;

	if (arguments.length == 3 && ((arguments[0] instanceof Websom.Server) || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'string' || typeof arguments[1] == 'undefined' || arguments[1] === null) && (typeof arguments[2] == 'string' || typeof arguments[2] == 'undefined' || arguments[2] === null)) {
		var server = arguments[0];
		var owner = arguments[1];
		var file = arguments[2];
		this.owner = owner;
		this.file = file;
		this.server = server;
	}

}

Websom.Resources.Less.prototype.buildToFile = function () {
	if (arguments.length == 1 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var path = arguments[0];
		this.build(function (err, content) {
			Oxygen.FileSystem.writeSync(path, content);
			});
	}
}

Websom.Resources.Less.prototype.toHtmlInclude = function () {
	if (arguments.length == 0) {
		var basename = Oxygen.FileSystem.basename(this.file);
		return "<link rel=\"stylesheet\" href=\"" + this.server.config.clientResources + "/" + this.owner + "-" + basename.replace(new RegExp("\\.[^\\.]+$", 'g'), "") + ".css\"/>";
	}
}

Websom.Resources.Less.prototype.build = function () {
	if (arguments.length == 1 && (typeof arguments[0] == 'function' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var callback = arguments[0];
		
			var lessBuilder = require("../../core/util/native/less.js");                              
			
			lessBuilder.compileLess(this.reference, this.file, callback);
		
		
	}
}

Websom.Resources.Less.make = function () {
	if (arguments.length == 4 && ((arguments[0] instanceof Websom.Server) || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'string' || typeof arguments[1] == 'undefined' || arguments[1] === null) && (typeof arguments[2] == 'string' || typeof arguments[2] == 'undefined' || arguments[2] === null) && (typeof arguments[3] == 'string' || typeof arguments[3] == 'undefined' || arguments[3] === null)) {
		var server = arguments[0];
		var type = arguments[1];
		var owner = arguments[2];
		var file = arguments[3];
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
			}
	}
}

Websom.Resources.Less.invalid = function () {
	if (arguments.length == 3 && ((arguments[0] instanceof Websom.Server) || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'string' || typeof arguments[1] == 'undefined' || arguments[1] === null) && (typeof arguments[2] == 'string' || typeof arguments[2] == 'undefined' || arguments[2] === null)) {
		var server = arguments[0];
		var owner = arguments[1];
		var path = arguments[2];
		var invalid = new Websom.Resource(server, owner, path);
		invalid.isInvalid = true;
		return invalid;
	}
}

Websom.Resources.Less.prototype.read = function () {
	if (arguments.length == 0) {
		return Oxygen.FileSystem.readSync(this.file, "utf8");
	}
}

Websom.Resources.Less.prototype.rawRead = function () {
	if (arguments.length == 0) {
		return Oxygen.FileSystem.readSync(this.file, null);
	}
}

Websom.Services.Router = function () {
	this.routes = [];

	this.injectScript = "";

	this.server = null;

	if (arguments.length == 1 && ((arguments[0] instanceof Websom.Server) || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var server = arguments[0];
		this.server = server;
	}

}

Websom.Services.Router.prototype.route = function () {
	if (arguments.length == 2 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'function' || typeof arguments[1] == 'undefined' || arguments[1] === null)) {
		var routeString = arguments[0];
		var handler = arguments[1];
		var splits = this.buildSplits(routeString);
		var route = new Websom.Route(routeString, splits, handler);
		this.routes.push(route);
		return route;
	}
}

Websom.Services.Router.prototype.post = function () {
	if (arguments.length == 2 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'function' || typeof arguments[1] == 'undefined' || arguments[1] === null)) {
		var routeString = arguments[0];
		var handler = arguments[1];
		var splits = this.buildSplits(routeString);
		var route = new Websom.Route(routeString, splits, null);
		route.postHandler = handler;
		route.post = true;
		this.routes.push(route);
		return route;
	}
}

Websom.Services.Router.prototype.start = function () {
	if (arguments.length == 0) {
		for (var i = 0; i < this.server.view.pages.length; i++) {
			var view = this.server.view.pages[i];
			this.routeView(view);
			}
		var that = this;
		if (this.server.config.dev) {
			this.route("/websom.info", function (req) {
				var info = [];
				info.push("<tr><th>Website root</th><th>" + that.server.config.root + "</th></tr>");
				req.send("<h1>Websom server info</h1><br><table><thead><th>Info</th><th>Value</th></thead><tbody>" + info.join("") + "</tbody></table>");
				});
			}
	}
}

Websom.Services.Router.prototype.injectSends = function () {
	if (arguments.length == 3 && ((arguments[0] instanceof Websom.Request) || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'object' || typeof arguments[1] == 'undefined' || arguments[1] === null) && (typeof arguments[2] == 'function' || typeof arguments[2] == 'undefined' || arguments[2] === null)) {
		var req = arguments[0];
		var clientData = arguments[1];
		var readyToSend = arguments[2];
		var clientDatas = this.server.module.modules.length;
		for (var i = 0; i < this.server.module.modules.length; i++) {
			var mod = this.server.module.modules[i];
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
			}
	}
}

Websom.Services.Router.prototype.include = function () {
	if (arguments.length == 0) {
		if (this.server.config.dev) {
			return "<script src=\"https:/" + "/cdn.jsdelivr.net/npm/vue/dist/vue.js\"></script><script src=\"" + this.server.config.clientResources + "/client.js\"></script>" + this.server.view.include() + this.server.resource.include(true) + this.server.theme.include() + this.server.input.clientValidate + "<script src=\"" + this.server.config.clientResources + "/text.js\"></script>";
			}else{
				return this.server.resource.include(false) + "<script src=\"" + this.server.config.clientResources + "/js.js\"></script>" + "<link rel=\"stylesheet\" href=\"" + this.server.config.clientResources + "/css.css\">" + "<script src=\"" + this.server.config.clientResources + "/text.js\"></script>";
			}
	}
}

Websom.Services.Router.prototype.wrapPage = function () {
	if (arguments.length == 1 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var content = arguments[0];
		var metas = "";
		if (this.server.config.hasManifest) {
			metas += "<link rel='manifest' href='" + this.server.config.manifestPath + "'>";
			}
		return "<!DOCTYPE html><html lang=\"en\"><head><meta name='viewport' content='width=device-width, initial-scale=1'><meta name='theme-color' content='" + this.server.config.brandColor + "'/>" + metas + this.include() + "</head><body>" + content + "</body></html>";
	}
}

Websom.Services.Router.prototype.sendStringView = function () {
	if (arguments.length == 2 && ((arguments[0] instanceof Websom.Request) || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'string' || typeof arguments[1] == 'undefined' || arguments[1] === null)) {
		var req = arguments[0];
		var template = arguments[1];
		var themeClass = "theme";
		if (this.server.config.defaultTheme.length > 0) {
			themeClass = "theme-" + this.server.config.defaultTheme;
			}
		req.send(this.wrapPage("<script>Websom.Client = {};</script><div id='page' class='" + themeClass + "'>" + template + "</div><script>document.body.setAttribute('class', document.getElementById('page').getAttribute('class'));page = new Vue({el: '#page', data: {data: {}}});</script>"));
	}
}

Websom.Services.Router.prototype.routeString = function () {
	if (arguments.length == 2 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'string' || typeof arguments[1] == 'undefined' || arguments[1] === null)) {
		var route = arguments[0];
		var template = arguments[1];
		var that = this;
		return this.route(route, function (req) {
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
			});
	}
}

Websom.Services.Router.prototype.navView = function () {
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
		var route = this.routeString(routeStr, "<default-body content-type='navView' container='" + container + "' auto='true' view-name='" + view + "'><nav-view validate='" + validate + "' container='" + container + "' edit-key='" + editKey + "' view='" + view + "' :show-edit='" + canEditStr + "' /></default-body>");
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
		var route = this.routeString(routeStr, "<default-body content-type='navView' container='" + container + "' auto='true' view-name='" + view + "'><nav-view :show-save='false' validate='" + validate + "' public-key='" + publicKey + "' container='" + container + "' edit-key='" + editKey + "' view='" + view + "' :show-edit='" + canEditStr + "' /></default-body>");
		route.greedy = true;
		return route;
	}
}

Websom.Services.Router.prototype.quickRoute = function () {
	if (arguments.length == 2 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'string' || typeof arguments[1] == 'undefined' || arguments[1] === null)) {
		var route = arguments[0];
		var viewName = arguments[1];
		var that = this;
		return this.route(route, function (req) {
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
			});
	}
}

Websom.Services.Router.prototype.routeView = function () {
	if (arguments.length == 1 && ((arguments[0] instanceof Websom.View) || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var view = arguments[0];
		var that = this;
		var r = this.route(view.handles, function (req) {
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
		r.greedy = view.greedy;
	}
}

Websom.Services.Router.prototype.buildSplits = function () {
	if (arguments.length == 1 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var route = arguments[0];
		return route.split("/");
	}
}

Websom.Services.Router.prototype.find = function () {
	if (arguments.length == 2 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'boolean' || typeof arguments[1] == 'undefined' || arguments[1] === null)) {
		var query = arguments[0];
		var post = arguments[1];
		var splits = this.buildSplits(query);
		for (var i = 0; i < this.routes.length; i++) {
			var route = this.routes[i];
			if (route.match(splits) && route.post == post) {
				return route;
				}
			}
		return null;
	}
}

Websom.Services.Router.prototype.handle = function () {
	if (arguments.length == 1 && ((arguments[0] instanceof Websom.Request) || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var req = arguments[0];
		var route = this.find(req.path, false);
		if (route == null) {
			req.code(404);
			req.send("Error page not found.");
			}else{
				route.handle(req);
			}
	}
}

Websom.Services.Router.prototype.handlePost = function () {
	if (arguments.length == 2 && (typeof arguments[0] == 'object' || typeof arguments[0] == 'undefined' || arguments[0] === null) && ((arguments[1] instanceof Websom.Request) || typeof arguments[1] == 'undefined' || arguments[1] === null)) {
		var raw = arguments[0];
		var req = arguments[1];
		var input = new Websom.Input("", raw, req);
		input.server = this.server;
		var route = this.find(req.path, true);
		if (route == null) {
			req.code(404);
			req.send("Error route not found.");
			}else{
				route.handlePost(input);
			}
	}
}

Websom.Services.Router.prototype.stop = function () {
	if (arguments.length == 0) {

	}
}

Websom.Services.Router.prototype.end = function () {
	if (arguments.length == 0) {

	}
}

Websom.Route = function () {
	this.greedy = false;

	this.post = false;

	this.route = "";

	this.splits = null;

	this.handler = null;

	this.postHandler = null;

	if (arguments.length == 3 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null) && (arguments[1]instanceof Array || typeof arguments[1] == 'undefined' || arguments[1] === null) && (typeof arguments[2] == 'function' || typeof arguments[2] == 'undefined' || arguments[2] === null)) {
		var route = arguments[0];
		var splits = arguments[1];
		var handler = arguments[2];
		this.route = route;
		this.splits = splits;
		this.handler = handler;
	}
else 	if (arguments.length == 3 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null) && (arguments[1]instanceof Array || typeof arguments[1] == 'undefined' || arguments[1] === null) && (typeof arguments[2] == 'function' || typeof arguments[2] == 'undefined' || arguments[2] === null)) {
		var route = arguments[0];
		var splits = arguments[1];
		var handler = arguments[2];
		this.route = route;
		this.splits = splits;
		this.postHandler = handler;
	}

}

Websom.Route.prototype.match = function () {
	if (arguments.length == 1 && (arguments[0]instanceof Array || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var otherSplits = arguments[0];
		if (this.greedy == false) {
			if (this.splits.length != otherSplits.length) {
				return false;
				}
			}
		if (this.splits.length > otherSplits.length) {
			return false;
			}
		if (this.greedy) {
			for (var i = 0; i < this.splits.length; i++) {
				var split = this.splits[i];
				if (split != otherSplits[i]) {
					return false;
					}
				}
			}else{
				for (var i = 0; i < otherSplits.length; i++) {
					if (otherSplits[i] != this.splits[i]) {
						return false;
						}
					}
			}
		return true;
	}
}

Websom.Route.prototype.handle = function () {
	if (arguments.length == 1 && ((arguments[0] instanceof Websom.Request) || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var req = arguments[0];
		this.handler(req);
	}
}

Websom.Route.prototype.handlePost = function () {
	if (arguments.length == 1 && ((arguments[0] instanceof Websom.Input) || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var input = arguments[0];
		this.postHandler(input);
	}
}

Websom.Services.Security = function () {
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

	this.server = null;

	if (arguments.length == 1 && ((arguments[0] instanceof Websom.Server) || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var server = arguments[0];
		this.server = server;
	}

}

Websom.Services.Security.prototype.start = function () {
	if (arguments.length == 0) {
		this.configPath = this.server.config.root + "/security.json";
		this.load();
		this.server.injectExpression("Websom.Captcha = {publicKey: " + Websom.Json.encode(this.publicKey) + "};");
	}
else 	if (arguments.length == 0) {

	}
}

Websom.Services.Security.prototype.load = function () {
	if (arguments.length == 0) {
		if (this.loaded == false) {
			this.loaded = true;
			if (Oxygen.FileSystem.exists(this.configPath)) {
				var config = Websom.Json.parse(Oxygen.FileSystem.readSync(this.configPath, "utf8"));
				this.captchaService = config["captchaService"];
				this.serviceKey = config["serviceKey"];
				this.publicKey = config["publicKey"];
				this.selectLimit = config["selectLimit"];
				this.insertLimit = config["insertLimit"];
				this.updateLimit = config["updateLimit"];
				this.message = config["requestLimitMessage"];
				}else{
					Oxygen.FileSystem.writeSync(this.configPath, "{\n	\"captchaService\": \"none\",\n	\"publicKey\": \"\",\n	\"serviceKey\": \"\",\n	\"updateLimit\": 6,\n	\"insertLimit\": 3,\n	\"selectLimit\": 60,\n	\"requestLimitMessage\": \"Too many requests.\"\n}");
				}
			}
	}
}

Websom.Services.Security.prototype.verify = function () {
	if (arguments.length == 1 && (typeof arguments[0] == 'function' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var callback = arguments[0];
		this.load();
	}
}

Websom.Services.Security.prototype.countRequest = function () {
	if (arguments.length == 3 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null) && ((arguments[1] instanceof Websom.InterfaceOptions) || typeof arguments[1] == 'undefined' || arguments[1] === null) && ((arguments[2] instanceof Websom.Input) || typeof arguments[2] == 'undefined' || arguments[2] === null)) {
		var type = arguments[0];
		var opts = arguments[1];
		var input = arguments[2];
		this.load();
		var history = input.request.session.get("_w_history_" + type);
		if (history == null) {
			var nHistory = {};
			nHistory["a"] = 1;
			nHistory["t"] = Websom.Time.now();
			input.request.session.set("_w_history_" + type, nHistory);
			}else{
				var amount = history["a"];
				history["a"] = amount + 1;
				input.request.session.set("_w_history_" + type, history);
			}
	}
}

Websom.Services.Security.prototype.request = function () {
	if (arguments.length == 4 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null) && ((arguments[1] instanceof Websom.InterfaceOptions) || typeof arguments[1] == 'undefined' || arguments[1] === null) && ((arguments[2] instanceof Websom.Input) || typeof arguments[2] == 'undefined' || arguments[2] === null) && (typeof arguments[3] == 'function' || typeof arguments[3] == 'undefined' || arguments[3] === null)) {
		var type = arguments[0];
		var opts = arguments[1];
		var input = arguments[2];
		var callback = arguments[3];
		this.load();
		var history = input.request.session.get("_w_history_" + type);
		if (history == null) {
			callback();
			}else{
				var limit = this.selectLimit;
				if (type == "update") {
					limit = this.updateLimit;
					}else if (type == "insert") {
					limit = this.insertLimit;
					}
				var amount = history["a"];
				var timestamp = history["t"];
				var now = Websom.Time.now();
				var diff = now - timestamp;
				if (amount > limit) {
					if (diff >= this.interval) {
						var updated = {};
						updated["a"] = 0;
						updated["t"] = now;
						input.request.session.set("_w_history_" + type, updated);
						callback();
						}else{
							input.sendError(this.message);
						}
					}else{
						callback();
					}
			}
	}
}

Websom.Services.Security.prototype.stop = function () {
	if (arguments.length == 0) {

	}
}

Websom.Services.Security.prototype.end = function () {
	if (arguments.length == 0) {

	}
}

Websom.Services.Theme = function () {
	this.themes = [];

	this.server = null;

	if (arguments.length == 1 && ((arguments[0] instanceof Websom.Server) || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var server = arguments[0];
		this.server = server;
	}

}

Websom.Services.Theme.prototype.load = function () {
	if (arguments.length == 2 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'object' || typeof arguments[1] == 'undefined' || arguments[1] === null)) {
		var themeDir = arguments[0];
		var config = arguments[1];
		var that = this;
		if ("name" in config == false) {
			return Websom.Status.singleError("Theme", "Must provide name in theme config " + themeDir);
			}
		var theme = new Websom.Theme(this.server, config["name"], themeDir, config);
		if (this.server.config.dev) {
			theme.buildAndSave(function (err) {
				if (err.length > 0) {
					that.server.status.inherit(Websom.Status.singleError("Theme." + theme.name, err));
					}
				});
			}
		this.themes.push(theme);
		
			if (this.server.config.dev) {
				var fs = require("fs");
				if (!fs.existsSync(this.server.config.resources + "/" + theme.prefix())) {                                 
					theme.buildAndSave((err) => {
						if (err.length > 0) {
							console.log("Error while building theme " + theme.name + " : " + err);
						}else{
							console.log("New theme built " + theme.name);
						}
					});
				}

				console.log("Setup watch on theme " + config.name);
				
				fs.watch(themeDir, {recursive: true}, (type, file) => {
					console.log("Saw change on " + file + ". Rebuilding theme");
					var newConfig = JSON.parse(fs.readFileSync(themeDir + "/" + config.name + ".json", "utf8"))
					theme.config = newConfig;
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
}

Websom.Services.Theme.prototype.reload = function () {
	if (arguments.length == 1 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var path = arguments[0];
		var themes = Oxygen.FileSystem.readDirSync(path);
		for (var i = 0; i < themes.length; i++) {
			var themeDir = path + themes[i];
			if (Oxygen.FileSystem.isDir(themeDir)) {
				var name = Oxygen.FileSystem.basename(themeDir);
				if (name != "." && name != "..") {
					var configFile = themeDir + "/" + name + ".json";
					if (Oxygen.FileSystem.exists(configFile) == false) {
						return Websom.Status.singleError("Servics.Theme", "Unable to find config for theme " + name);
						}
					var config = Websom.Json.parse(Oxygen.FileSystem.readSync(configFile, "utf8"));
					var status = this.load(themeDir, config);
					if (status != null) {
						return status;
						}
					}
				}
			}
		for (var i = 0; i < this.themes.length; i++) {
			var theme = this.themes[i];
			var status = theme.start();
			if (status != null) {
				return status;
				}
			}
	}
}

Websom.Services.Theme.prototype.include = function () {
	if (arguments.length == 0) {
		var inc = "";
		for (var i = 0; i < this.themes.length; i++) {
			inc += this.themes[i].include();
			}
		return inc;
	}
}

Websom.Services.Theme.prototype.start = function () {
	if (arguments.length == 0) {
		var dir = this.server.config.root + "/themes/";
		if (Oxygen.FileSystem.exists(dir) == false) {
			Oxygen.FileSystem.makeDir(dir);
			}
		var themeDir = Oxygen.FileSystem.resolve(Oxygen.FileSystem.dirName(this.server.scriptPath) + "/../../theme/");
		var config = Websom.Json.parse(Oxygen.FileSystem.readSync(themeDir + "/theme.json", "utf8"));
		var status = this.load(themeDir, config);
		if (status != null) {
			return status;
			}
		return this.reload(dir);
	}
}

Websom.Services.Theme.prototype.stop = function () {
	if (arguments.length == 0) {

	}
}

Websom.Services.Theme.prototype.end = function () {
	if (arguments.length == 0) {

	}
}

Websom.Services.View = function () {
	this.pages = [];

	this.views = [];

	this.moduleViews = null;

	this.server = null;

	if (arguments.length == 1 && ((arguments[0] instanceof Websom.Server) || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var server = arguments[0];
		this.server = server;
	}

}

Websom.Services.View.prototype.start = function () {
	if (arguments.length == 0) {
		var status = new Websom.Status();
		var refresh = false;
		if (this.server.config.dev) {
			refresh = true;
			}
		
			refresh = true;                         
		
		if (this.server.config.refreshViews) {
			refresh = true;
			}
		if (refresh == false) {
			if (Oxygen.FileSystem.exists(this.server.config.root + "/viewCache.json") == false) {
				refresh = true;
				}
			}
		if (refresh) {
			if (Oxygen.FileSystem.exists(this.server.config.root + "/pages")) {
				status.inherit(this.loadPages(this.server.config.root + "/pages/"));
				}
			if (Oxygen.FileSystem.exists(this.server.config.root + "/views")) {
				status.inherit(this.loadViews(this.server.config.root + "/views/"));
				}
			this.moduleViews = this.getModuleViews();
			this.buildCache();
			}else{
				this.loadCache();
			}
		return status;
	}
}

Websom.Services.View.prototype.serializeViews = function () {
	if (arguments.length == 1 && (arguments[0]instanceof Array || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var views = arguments[0];
		var vs = [];
		for (var i = 0; i < views.length; i++) {
			var view = views[i];
			vs.push(view.serialize());
			}
		return vs;
	}
}

Websom.Services.View.prototype.loadViewCache = function () {
	if (arguments.length == 1 && (arguments[0]instanceof Array || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var data = arguments[0];
		var views = [];
		for (var i = 0; i < data.length; i++) {
			var d = data[i];
			var v = new Websom.View(this.server);
			v.deserialize(d);
			v.shallow = true;
			views.push(v);
			}
		return views;
	}
}

Websom.Services.View.prototype.loadCache = function () {
	if (arguments.length == 0) {
		var data = Websom.Json.parse(Oxygen.FileSystem.readSync(this.server.config.root + "/viewCache.json", "utf8"));
		this.moduleViews = this.loadViewCache(data["module"]);
		this.pages = this.loadViewCache(data["page"]);
		this.views = this.loadViewCache(data["view"]);
	}
}

Websom.Services.View.prototype.buildCache = function () {
	if (arguments.length == 0) {
		var cache = {};
		cache["module"] = this.serializeViews(this.moduleViews);
		cache["page"] = this.serializeViews(this.pages);
		cache["view"] = this.serializeViews(this.views);
		Oxygen.FileSystem.writeSync(this.server.config.root + "/viewCache.json", Websom.Json.encode(cache));
	}
}

Websom.Services.View.prototype.getView = function () {
	if (arguments.length == 1 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var name = arguments[0];
		for (var i = 0; i < this.views.length; i++) {
			if (this.views[i].name == name) {
				return this.views[i];
				}
			}
		for (var i = 0; i < this.moduleViews.length; i++) {
			if (this.moduleViews[i].name == name) {
				return this.moduleViews[i];
				}
			}
		return null;
	}
}

Websom.Services.View.prototype.getModuleViews = function () {
	if (arguments.length == 0) {
		var views = [];
		for (var i = 0; i < this.server.module.modules.length; i++) {
			var module = this.server.module.modules[i];
			if ("resources" in module.baseConfig) {
				var raw = module.baseConfig["resources"];
				for (var r = 0; r < raw.length; r++) {
					var res = raw[r];
					var type = "";
					var path = res["path"];
					if ("type" in res == false) {
						var realPath = Oxygen.FileSystem.resolve(module.root + "/" + path);
						if (Oxygen.FileSystem.isDir(realPath)) {
							var files = Oxygen.FileSystem.readDirSync(realPath);
							for (var f = 0; f < files.length; f++) {
								var file = files[f];
								var splits = file.split(".");
								if (splits.length > 1) {
									if (splits[splits.length - 1] == "view") {
										var view = new Websom.View(this.server);
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
								var view = new Websom.View(this.server);
								view.owner = module;
								var viewErr = view.loadFromFile(Oxygen.FileSystem.resolve(module.root + "/" + path));
								view.hasLocalExport = true;
								views.push(view);
								}
						}
					}
				}
			}
		return views;
	}
}

Websom.Services.View.prototype.buildDev = function () {
	if (arguments.length == 1 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var to = arguments[0];
		var output = "";
		for (var i = 0; i < this.views.length; i++) {
			var view = this.views[i];
			output += view.buildDev();
			}
		Oxygen.FileSystem.writeSync(to, output);
	}
}

Websom.Services.View.prototype.include = function () {
	if (arguments.length == 0) {
		var file = this.server.config.resources + "/view.js";
		if (this.server.config.dev) {
			this.buildDev(file);
			}else{

			}
		return "<script src=\"" + this.server.config.clientResources + "/view.js\"></script>";
	}
}

Websom.Services.View.prototype.loadPage = function () {
	if (arguments.length == 1 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var path = arguments[0];
		var page = new Websom.View(this.server);
		var err = page.loadFromFile(path);
		page.websiteView = true;
		if (err != null) {
			return err;
			}
		page.isPage = true;
		this.pages.push(page);
		this.views.push(page);
		if (this.server.config.dev) {
			
				var fs = require("fs");
				console.log("Setup watch on page view");
				
				fs.watch(path, (type, file) => {
					console.log("Rebuilding " + path);
					page.loadFromFile(path);
				});
			
			}
	}
}

Websom.Services.View.prototype.loadView = function () {
	if (arguments.length == 1 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var path = arguments[0];
		var view = new Websom.View(this.server);
		var err = view.loadFromFile(path);
		view.websiteView = true;
		if (err != null) {
			return err;
			}
		this.views.push(view);
		if (this.server.config.dev) {
			
				var fs = require("fs");
				console.log("Setup watch on website view " + path);
				
				fs.watch(path, (type, file) => {
					console.log("Rebuilding " + path);
					view.loadFromFile(path);
				});
			
			}
	}
}

Websom.Services.View.prototype.loadPages = function () {
	if (arguments.length == 1 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var dir = arguments[0];
		var files = Oxygen.FileSystem.readDirSync(dir);
		for (var i = 0; i < files.length; i++) {
			var file = files[i];
			if (Oxygen.FileSystem.isDir(dir + file)) {
				continue;
				}
			var splits = file.split(".");
			if (splits.length > 1) {
				if (splits[splits.length - 1] == "view") {
					var err = this.loadPage(dir + file);
					if (err != null) {
						return err;
						}
					}
				}
			}
	}
}

Websom.Services.View.prototype.loadViews = function () {
	if (arguments.length == 1 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var dir = arguments[0];
		var files = Oxygen.FileSystem.readDirSync(dir);
		for (var i = 0; i < files.length; i++) {
			var file = files[i];
			if (Oxygen.FileSystem.isDir(dir + file)) {
				continue;
				}
			var splits = file.split(".");
			if (splits.length > 1) {
				if (splits[splits.length - 1] == "view") {
					var err = this.loadView(dir + file);
					if (err != null) {
						return err;
						}
					}
				}
			}
	}
}

Websom.Services.View.prototype.stop = function () {
	if (arguments.length == 0) {

	}
}

Websom.Services.View.prototype.end = function () {
	if (arguments.length == 0) {

	}
}

Websom.Bridge = function () {
	this.server = null;

	if (arguments.length == 1 && ((arguments[0] instanceof Websom.Server) || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var server = arguments[0];
		this.server = server;
	}

}

Websom.Bridge.prototype.getName = function () {
	if (arguments.length == 0) {
		
		return this.name;
	}
}

Websom.Bridge.prototype.getServerMethods = function () {
	if (arguments.length == 0) {
		
			return this.serverMethods();
		
		
	}
}

Websom.Bucket = function () {
	this.server = null;

	this.raw = null;

	this.name = "";

	if (arguments.length == 3 && ((arguments[0] instanceof Websom.Server) || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'string' || typeof arguments[1] == 'undefined' || arguments[1] === null) && (typeof arguments[2] == 'object' || typeof arguments[2] == 'undefined' || arguments[2] === null)) {
		var server = arguments[0];
		var name = arguments[1];
		var raw = arguments[2];
		this.server = server;
		this.raw = raw;
		this.name = name;
		this.created();
	}

}

Websom.Bucket.prototype.created = function () {
	if (arguments.length == 0) {

	}
}

Websom.Bucket.make = function () {
	if (arguments.length == 4 && ((arguments[0] instanceof Websom.Server) || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'string' || typeof arguments[1] == 'undefined' || arguments[1] === null) && (typeof arguments[2] == 'string' || typeof arguments[2] == 'undefined' || arguments[2] === null) && (typeof arguments[3] == 'object' || typeof arguments[3] == 'undefined' || arguments[3] === null)) {
		var server = arguments[0];
		var name = arguments[1];
		var type = arguments[2];
		var raw = arguments[3];
		if (type == "local") {
			return new Websom.Buckets.Local(server, name, raw);
			}
	}
}

Websom.Buckets = function () {


}

Websom.Buckets.Local = function () {
	this.realPath = "";

	this.server = null;

	this.raw = null;

	this.name = "";

	if (arguments.length == 3 && ((arguments[0] instanceof Websom.Server) || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'string' || typeof arguments[1] == 'undefined' || arguments[1] === null) && (typeof arguments[2] == 'object' || typeof arguments[2] == 'undefined' || arguments[2] === null)) {
		var server = arguments[0];
		var name = arguments[1];
		var raw = arguments[2];
		this.server = server;
		this.raw = raw;
		this.name = name;
		this.created();
	}

}

Websom.Buckets.Local.prototype.created = function () {
	if (arguments.length == 0) {
		var path = this.raw["path"];
		this.realPath = Oxygen.FileSystem.resolve(this.server.config.root + "/" + path) + "/";
	}
}

Websom.Buckets.Local.prototype.write = function (file, content, done) {
		Oxygen.FileSystem.writeSync(this.realPath + file, content);
		done("");}

Websom.Buckets.Local.prototype.read = function () {
	if (arguments.length == 2 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'function' || typeof arguments[1] == 'undefined' || arguments[1] === null)) {
		var file = arguments[0];
		var done = arguments[1];
		done(true, Oxygen.FileSystem.readSync(this.realPath + file, "utf8"));
	}
}

Websom.Buckets.Local.prototype.makeDir = function () {
	if (arguments.length == 2 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'function' || typeof arguments[1] == 'undefined' || arguments[1] === null)) {
		var dir = arguments[0];
		var done = arguments[1];
		if (Oxygen.FileSystem.exists(this.realPath + dir) == false) {
			Oxygen.FileSystem.makeDir(this.realPath + dir);
			}
		done(true);
	}
}

Websom.Buckets.Local.make = function () {
	if (arguments.length == 4 && ((arguments[0] instanceof Websom.Server) || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'string' || typeof arguments[1] == 'undefined' || arguments[1] === null) && (typeof arguments[2] == 'string' || typeof arguments[2] == 'undefined' || arguments[2] === null) && (typeof arguments[3] == 'object' || typeof arguments[3] == 'undefined' || arguments[3] === null)) {
		var server = arguments[0];
		var name = arguments[1];
		var type = arguments[2];
		var raw = arguments[3];
		if (type == "local") {
			return new Websom.Buckets.Local(server, name, raw);
			}
	}
}

Websom.Client = function () {
	this.address = "";

	this.port = "";

	this.family = "";

	this.localAddress = "";

	this.localPort = "";

	if (arguments.length == 2 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'string' || typeof arguments[1] == 'undefined' || arguments[1] === null)) {
		var address = arguments[0];
		var port = arguments[1];
		this.address = address;
		this.port = port;
	}

}

Websom.Config = function () {
	this.data = null;

	this.https = false;

	this.name = "";

	this.brandColor = "white";

	this.url = "localhost";

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

	this.devSendMail = false;

	this.forceSsr = false;

	this.clientResources = "";

	this.databaseFile = "";

	this.gzip = false;

	this.refreshViews = false;

	if (arguments.length == 0) {

	}

}

Websom.Config.load = function () {
	if (arguments.length == 1 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var path = arguments[0];
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
				config.resources = Oxygen.FileSystem.resolve(config.absolute + "./private");
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
		return config;
	}
}

Websom.Containers = function () {


}

Websom.Container = function () {
	this.server = null;

	this.name = "";

	this.dataInfo = null;

	this.parentContainer = null;

	this.interfaces = [];


}

Websom.Container.prototype.checkRestrictions = function () {
	if (arguments.length == 5 && ((arguments[0] instanceof Websom.InterfaceOptions) || typeof arguments[0] == 'undefined' || arguments[0] === null) && ((arguments[1] instanceof Websom.Input) || typeof arguments[1] == 'undefined' || arguments[1] === null) && (typeof arguments[2] == 'string' || typeof arguments[2] == 'undefined' || arguments[2] === null) && ((arguments[3] instanceof Websom.FieldInfo) || typeof arguments[3] == 'undefined' || arguments[3] === null) && (typeof arguments[4] == 'function' || typeof arguments[4] == 'undefined' || arguments[4] === null)) {
		var opts = arguments[0];
		var inp = arguments[1];
		var mode = arguments[2];
		var field = arguments[3];
		var callback = arguments[4];
		for (var i = 0; i < opts.restricts.length; i++) {
			var r = opts.restricts[i];
			if (r.field == field.realName && r.mode == "global" || r.mode == mode) {
				if (r.simple) {
					var ct = this.server.input.restrictHandlers;
					if (r.key in ct) {
						var handler = this.server.input.restrictHandlers[r.key];
						handler(r.value, inp.request, function (passed) {
callback(passed);
});
						return null;
						}else{
							throw new Error("Custom restriction " + r.key + " not found in request to container " + this.name);
						}
					}else{
						if (r.callback != null) {
							r.callback(function (passed) {
callback(passed);
});
							}else{
								throw new Error("Restrict callback on field " + field.realName + " in container interface " + this.name + " is null. Did you forget interface.to(void () => {})?");
							}
						return null;
					}
				}
			}
		callback(true);
	}
}

Websom.Container.prototype.interfaceInsert = function () {
	if (arguments.length == 2 && ((arguments[0] instanceof Websom.InterfaceOptions) || typeof arguments[0] == 'undefined' || arguments[0] === null) && ((arguments[1] instanceof Websom.Input) || typeof arguments[1] == 'undefined' || arguments[1] === null)) {
		var opts = arguments[0];
		var input = arguments[1];
		var that = this;
		if (opts.canInsert) {
			if (opts.overrideInsert != null) {
				opts.overrideInsert(input);
				}else{
					if (opts.mustLogin || opts.mustOwnInsert) {
						if (this.server.userSystem.isLoggedIn(input.request) == false) {
							var msg = Websom.ClientMessage.quickError("Please login.");
							input.send(msg.stringify());
							return null;
							}
						}
					this.server.security.request("insert", opts, input, function () {
						var v = new Websom.DataValidator(that.dataInfo);
						v.validate(input, function (msg) {
							if (msg.hadError) {
								input.sendError(msg.stringify());
								}else{
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
										if (dones == 0) {
											that.server.security.countRequest("insert", opts, input);
											that.insertFromInterface(opts, input, values, clientMessage, null, null, new Websom.CallContext());
											}
										}
								}
							});
						});
				}
			}else{
				if (this.server.config.dev) {
					input.send("Invalid(Dev: This container has no insert interface)");
					}else{
						input.send("Invalid");
					}
			}
	}
}

Websom.Container.prototype.interfaceSelect = function () {
	if (arguments.length == 3 && ((arguments[0] instanceof Websom.InterfaceOptions) || typeof arguments[0] == 'undefined' || arguments[0] === null) && ((arguments[1] instanceof Websom.Input) || typeof arguments[1] == 'undefined' || arguments[1] === null) && ((arguments[2] instanceof Websom.CallContext) || typeof arguments[2] == 'undefined' || arguments[2] === null)) {
		var opts = arguments[0];
		var input = arguments[1];
		var ctx = arguments[2];

	}
}

Websom.Container.prototype.interfaceSend = function (opts, input) {
		var that = this;
		if (opts.canInterface) {
			if ("publicId" in input.raw && "route" in input.raw && "data" in input.raw) {
				var obj = that.dataInfo.spawn(that.server);
				obj.websomServer = this.server;
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
					if (this.server.config.dev) {
						input.send("Invalid(Dev: No 'publicId', 'route', or 'data' key found in query)");
						}else{
							input.send("Invalid");
						}
				}
			}}

Websom.Container.prototype.interfaceUpdate = function (opts, input) {
		var that = this;
		if (opts.canUpdate) {
			if (opts.overrideUpdate != null) {
				opts.overrideUpdate(input);
				}else{
					if (opts.mustLogin || opts.mustOwnUpdate) {
						if (this.server.userSystem.isLoggedIn(input.request) == false) {
							var cMsg = Websom.ClientMessage.quickError("Please login.");
							input.send(cMsg.stringify());
							return null;
							}
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
					this.server.security.request("update", opts, input, function () {
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
										var doContinue = function () {
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
												if (dones == 0) {
													that.server.security.countRequest("update", opts, input);
													that.updateFromInterface(opts, update, obj, input, values, clientMessage);
													}
												}
											};
										if (opts.mustOwnUpdate) {
											that.server.userSystem.getLoggedIn(input.request, function (user) {
												
											if (user.id != obj.owner.id) {
												shouldContinue = false;
											}
										
												
												if (shouldContinue == false) {
													var cMsg = Websom.ClientMessage.quickError("You do not own this.");
													input.send(cMsg.stringify());
													}else{
														doContinue();
													}
												});
											}else{
												doContinue();
											}
										});
								}
							});
						});
				}
			}else{
				if (this.server.config.dev) {
					input.send("Invalid(Dev: This container has no update interface)");
					}else{
						input.send("Invalid");
					}
			}}

Websom.Container.prototype.interface = function () {
	if (arguments.length == 1 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var route = arguments[0];
		return new Websom.InterfaceChain(this, route);
	}
else 	if (arguments.length == 1 && ((arguments[0] instanceof Websom.InterfaceOptions) || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var opts = arguments[0];
		this.interfaces.push(opts);
	}
}

Websom.Container.prototype.getInterface = function () {
	if (arguments.length == 1 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var route = arguments[0];
		for (var i = 0; i < this.interfaces.length; i++) {
			if (this.interfaces[i].route == route) {
				return this.interfaces[i];
				}
			}
		return null;
	}
}

Websom.Container.prototype.getDataFromRoute = function () {
	if (arguments.length == 1 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var route = arguments[0];
		
			var splits = route.split(".");
			var cur = global;
			for (var split of splits)
				cur = cur[split];

			return cur;
		
		
	}
}

Websom.Container.prototype.registerSubContainer = function () {
	if (arguments.length == 2 && ((arguments[0] instanceof Websom.FieldInfo) || typeof arguments[0] == 'undefined' || arguments[0] === null) && ((arguments[1] instanceof Websom.DataInfo) || typeof arguments[1] == 'undefined' || arguments[1] === null)) {
		var field = arguments[0];
		var routeInfo = arguments[1];
		var that = this;
		var name = this.name + "_" + field.fieldName;
		var subContainer = new Websom.Containers.Table(this.server, name, routeInfo);
		subContainer.parentContainer = this;
		for (var i = 0; i < this.interfaces.length; i++) {
			var interface = this.interfaces[i];
			if (interface.subs[field.fieldName] != null) {
				subContainer.interface(interface.subs[field.fieldName]);
				}
			}
		if (subContainer.interfaces.length > 0) {
			var handler = subContainer.register();
			handler.containerInterface = subContainer;
			return handler;
			}
	}
}

Websom.Container.prototype.register = function () {
	if (arguments.length == 0) {
		var that = this;
		for (var i = 0; i < this.dataInfo.fields.length; i++) {
			var f = this.dataInfo.fields[i];
			if (f.singleLink && f.isPrimitive == false) {
				var t = Websom.DataInfo.getDataInfoFromRoute(f.typeRoute);
				var fi = this.getDataFromRoute(f.typeRoute);
				if ("Component" in t.attributes) {
					var name = this.name + "_" + f.fieldName;
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
				this.registerSubContainer(f, t);
				}
			}
		for (var i = 0; i < this.interfaces.length; i++) {
			var opts = this.interfaces[i];
			for (var c = 0; c < opts.controls.length; c++) {
				opts.controls[c].container = this;
				}
			for (var c = 0; c < opts.selectControls.length; c++) {
				opts.selectControls[c].container = this;
				}
			for (var c = 0; c < opts.updateControls.length; c++) {
				opts.updateControls[c].container = this;
				}
			for (var c = 0; c < opts.insertControls.length; c++) {
				opts.insertControls[c].container = this;
				}
			}
		var handler = this.server.input.register(this.name, function (input) {
			if ("_w_type" in input.raw && "_w_route" in input.raw) {
				var type = input.raw["_w_type"];
				var route = input.raw["_w_route"];
				var opts = that.getInterface(route);
				if (opts != null) {
					that.checkAuth(opts, input, type, function (success) {
						if (success) {
							if (type == "insert") {
								that.interfaceInsert(opts, input);
								}else if (type == "update") {
								that.interfaceUpdate(opts, input);
								}else if (type == "select") {
								that.server.security.request("select", opts, input, function () {
									that.interfaceSelect(opts, input, new Websom.CallContext());
									});
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
		handler.containerInterface = this;
		return handler;
	}
}

Websom.Container.prototype.checkAuth = function () {
	if (arguments.length == 4 && ((arguments[0] instanceof Websom.InterfaceOptions) || typeof arguments[0] == 'undefined' || arguments[0] === null) && ((arguments[1] instanceof Websom.Input) || typeof arguments[1] == 'undefined' || arguments[1] === null) && (typeof arguments[2] == 'string' || typeof arguments[2] == 'undefined' || arguments[2] === null) && (typeof arguments[3] == 'function' || typeof arguments[3] == 'undefined' || arguments[3] === null)) {
		var opts = arguments[0];
		var input = arguments[1];
		var type = arguments[2];
		var callback = arguments[3];
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
				if (input.request.session.get("dashboard") != null) {
					callback(true);
					}else if (input.server.userSystem.isLoggedIn(input.request)) {
					input.server.userSystem.getLoggedIn(input.request, function (user) {
						user.hasPermission(perms, function (yes) {
							callback(yes);
							});
						});
					}else{
						callback(false);
					}
				}else{
					callback(true);
				}
			}else{
				callback(true);
			}
	}
}

Websom.Container.prototype.loadFromSelect = function () {
	if (arguments.length == 2 && ((arguments[0] instanceof Websom.DatabaseSelect || (arguments[0] instanceof Websom.MySqlDatabaseSelect)) || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'function' || typeof arguments[1] == 'undefined' || arguments[1] === null)) {
		var select = arguments[0];
		var callback = arguments[1];

	}
}

Websom.Container.prototype.expose = function () {
	if (arguments.length == 3 && ((arguments[0] instanceof Websom.Request) || typeof arguments[0] == 'undefined' || arguments[0] === null) && (arguments[1]instanceof Array || typeof arguments[1] == 'undefined' || arguments[1] === null) && (typeof arguments[2] == 'function' || typeof arguments[2] == 'undefined' || arguments[2] === null)) {
		var req = arguments[0];
		var datas = arguments[1];
		var callback = arguments[2];

	}
}

Websom.Container.prototype.loadFromId = function () {
	if (arguments.length == 2 && (typeof arguments[0] == 'number' || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'function' || typeof arguments[1] == 'undefined' || arguments[1] === null)) {
		var id = arguments[0];
		var callback = arguments[1];

	}
}

Websom.InterfaceOptions = function () {
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

	if (arguments.length == 1 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var route = arguments[0];
		this.route = route;
	}

}

Websom.InterfaceOptions.prototype.expose = function () {
	if (arguments.length == 1 && (typeof arguments[0] == 'function' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var func = arguments[0];
		this.selectExpose = func;
	}
}

Websom.InterfaceOptions.prototype.spawnControl = function () {
	if (arguments.length == 2 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null) && ((arguments[1] instanceof Websom.FieldInfo) || typeof arguments[1] == 'undefined' || arguments[1] === null)) {
		var cls = arguments[0];
		var field = arguments[1];
		
			var root = global;
			for (var split of cls.split("."))
				root = root[split];

			return new root(field.realName, field.fieldName, field);
		
		
	}
}

Websom.InterfaceOptions.prototype.authPermission = function () {
	if (arguments.length == 1 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var perm = arguments[0];
		this.hasAuth = true;
		this.permission = perm;
	}
}

Websom.InterfaceOptions.prototype.autoControl = function () {
	if (arguments.length == 1 && ((arguments[0] instanceof Websom.DataInfo) || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var info = arguments[0];
		for (var i = 0; i < info.fields.length; i++) {
			var field = info.fields[i];
			if (field.structure.hasFlag("edit")) {
				if (field.isPrimitive) {
					this.controls.push(field.structure.type.autoControl(field));
					}else if (field.isComplex) {
					this.controls.push(this.spawnControl(field.controlClass, field));
					}
				}
			}
	}
}

Websom.InputRestriction = function () {
	this.mode = "global";

	this.simple = false;

	this.field = "";

	this.key = "";

	this.value = "";

	this.callback = null;

	if (arguments.length == 2 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'string' || typeof arguments[1] == 'undefined' || arguments[1] === null)) {
		var mode = arguments[0];
		var field = arguments[1];
		this.mode = mode;
		this.field = field;
	}

}

Websom.Control = function () {
	this.server = null;

	this.container = null;


}

Websom.Control.prototype.insert = function () {
	if (arguments.length == 3 && ((arguments[0] instanceof Websom.Input) || typeof arguments[0] == 'undefined' || arguments[0] === null) && ((arguments[1] instanceof Websom.Data) || typeof arguments[1] == 'undefined' || arguments[1] === null) && ((arguments[2]instanceof Array || typeof arguments[2] == 'boolean' || typeof arguments[2] == 'number' || typeof arguments[2] == 'number' || typeof arguments[2] == 'object' || typeof arguments[2] == 'string') || typeof arguments[2] == 'undefined' || arguments[2] === null)) {
		var input = arguments[0];
		var data = arguments[1];
		var key = arguments[2];

	}
}

Websom.Control.prototype.update = function () {
	if (arguments.length == 2 && ((arguments[0] instanceof Websom.Input) || typeof arguments[0] == 'undefined' || arguments[0] === null) && ((arguments[1] instanceof Websom.Data) || typeof arguments[1] == 'undefined' || arguments[1] === null)) {
		var input = arguments[0];
		var data = arguments[1];

	}
}

Websom.Control.prototype.message = function () {
	if (arguments.length == 4 && ((arguments[0] instanceof Websom.Input) || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'string' || typeof arguments[1] == 'undefined' || arguments[1] === null) && (typeof arguments[2] == 'object' || typeof arguments[2] == 'undefined' || arguments[2] === null) && (typeof arguments[3] == 'function' || typeof arguments[3] == 'undefined' || arguments[3] === null)) {
		var input = arguments[0];
		var name = arguments[1];
		var data = arguments[2];
		var send = arguments[3];
		send(null);
	}
}

Websom.Control.prototype.use = function () {
	if (arguments.length == 1 && ((arguments[0] instanceof Websom.InputChain) || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var inputChain = arguments[0];

	}
}

Websom.MessageControl = function () {
	this.server = null;

	this.container = null;


}

Websom.MessageControl.prototype.validate = function () {
	if (arguments.length == 2 && ((arguments[0] instanceof Websom.Input) || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'function' || typeof arguments[1] == 'undefined' || arguments[1] === null)) {
		var input = arguments[0];
		var done = arguments[1];
		done(null);
	}
}

Websom.MessageControl.prototype.fill = function () {
	if (arguments.length == 3 && ((arguments[0] instanceof Websom.Input) || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'object' || typeof arguments[1] == 'undefined' || arguments[1] === null) && (typeof arguments[2] == 'function' || typeof arguments[2] == 'undefined' || arguments[2] === null)) {
		var input = arguments[0];
		var values = arguments[1];
		var done = arguments[2];
		done();
	}
}

Websom.MessageControl.prototype.filter = function () {
	if (arguments.length == 3 && ((arguments[0] instanceof Websom.Input) || typeof arguments[0] == 'undefined' || arguments[0] === null) && ((arguments[1] instanceof Websom.DatabaseSelect || (arguments[1] instanceof Websom.MySqlDatabaseSelect)) || typeof arguments[1] == 'undefined' || arguments[1] === null) && (typeof arguments[2] == 'function' || typeof arguments[2] == 'undefined' || arguments[2] === null)) {
		var input = arguments[0];
		var select = arguments[1];
		var done = arguments[2];
		done(null);
	}
}

Websom.MessageControl.prototype.insert = function () {
	if (arguments.length == 3 && ((arguments[0] instanceof Websom.Input) || typeof arguments[0] == 'undefined' || arguments[0] === null) && ((arguments[1] instanceof Websom.Data) || typeof arguments[1] == 'undefined' || arguments[1] === null) && ((arguments[2]instanceof Array || typeof arguments[2] == 'boolean' || typeof arguments[2] == 'number' || typeof arguments[2] == 'number' || typeof arguments[2] == 'object' || typeof arguments[2] == 'string') || typeof arguments[2] == 'undefined' || arguments[2] === null)) {
		var input = arguments[0];
		var data = arguments[1];
		var key = arguments[2];

	}
}

Websom.MessageControl.prototype.update = function () {
	if (arguments.length == 2 && ((arguments[0] instanceof Websom.Input) || typeof arguments[0] == 'undefined' || arguments[0] === null) && ((arguments[1] instanceof Websom.Data) || typeof arguments[1] == 'undefined' || arguments[1] === null)) {
		var input = arguments[0];
		var data = arguments[1];

	}
}

Websom.MessageControl.prototype.message = function () {
	if (arguments.length == 4 && ((arguments[0] instanceof Websom.Input) || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'string' || typeof arguments[1] == 'undefined' || arguments[1] === null) && (typeof arguments[2] == 'object' || typeof arguments[2] == 'undefined' || arguments[2] === null) && (typeof arguments[3] == 'function' || typeof arguments[3] == 'undefined' || arguments[3] === null)) {
		var input = arguments[0];
		var name = arguments[1];
		var data = arguments[2];
		var send = arguments[3];
		send(null);
	}
}

Websom.MessageControl.prototype.use = function () {
	if (arguments.length == 1 && ((arguments[0] instanceof Websom.InputChain) || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var inputChain = arguments[0];

	}
}

Websom.FieldControl = function () {
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

Websom.FieldControl.prototype.validate = function () {
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

Websom.FieldControl.prototype.fill = function () {
	if (arguments.length == 3 && ((arguments[0] instanceof Websom.Input) || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'object' || typeof arguments[1] == 'undefined' || arguments[1] === null) && (typeof arguments[2] == 'function' || typeof arguments[2] == 'undefined' || arguments[2] === null)) {
		var input = arguments[0];
		var values = arguments[1];
		var done = arguments[2];
		this.fillField(input.raw[this.name], values);
		done();
	}
}

Websom.FieldControl.prototype.filter = function () {
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

Websom.FieldControl.prototype.validateField = function () {
	if (arguments.length == 3 && ((arguments[0] instanceof Websom.Input) || typeof arguments[0] == 'undefined' || arguments[0] === null) && ((arguments[1]instanceof Array || typeof arguments[1] == 'boolean' || typeof arguments[1] == 'number' || typeof arguments[1] == 'number' || typeof arguments[1] == 'object' || typeof arguments[1] == 'string') || typeof arguments[1] == 'undefined' || arguments[1] === null) && (typeof arguments[2] == 'function' || typeof arguments[2] == 'undefined' || arguments[2] === null)) {
		var input = arguments[0];
		var value = arguments[1];
		var done = arguments[2];
		done(new Websom.InputValidation(false, ""));
	}
}

Websom.FieldControl.prototype.fillField = function () {
	if (arguments.length == 2 && ((arguments[0]instanceof Array || typeof arguments[0] == 'boolean' || typeof arguments[0] == 'number' || typeof arguments[0] == 'number' || typeof arguments[0] == 'object' || typeof arguments[0] == 'string') || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'object' || typeof arguments[1] == 'undefined' || arguments[1] === null)) {
		var value = arguments[0];
		var values = arguments[1];

	}
}

Websom.FieldControl.prototype.filterField = function () {
	if (arguments.length == 3 && ((arguments[0]instanceof Array || typeof arguments[0] == 'boolean' || typeof arguments[0] == 'number' || typeof arguments[0] == 'number' || typeof arguments[0] == 'object' || typeof arguments[0] == 'string') || typeof arguments[0] == 'undefined' || arguments[0] === null) && ((arguments[1] instanceof Websom.DatabaseSelect || (arguments[1] instanceof Websom.MySqlDatabaseSelect)) || typeof arguments[1] == 'undefined' || arguments[1] === null) && (typeof arguments[2] == 'function' || typeof arguments[2] == 'undefined' || arguments[2] === null)) {
		var value = arguments[0];
		var select = arguments[1];
		var done = arguments[2];

	}
}

Websom.FieldControl.prototype.insert = function () {
	if (arguments.length == 3 && ((arguments[0] instanceof Websom.Input) || typeof arguments[0] == 'undefined' || arguments[0] === null) && ((arguments[1] instanceof Websom.Data) || typeof arguments[1] == 'undefined' || arguments[1] === null) && ((arguments[2]instanceof Array || typeof arguments[2] == 'boolean' || typeof arguments[2] == 'number' || typeof arguments[2] == 'number' || typeof arguments[2] == 'object' || typeof arguments[2] == 'string') || typeof arguments[2] == 'undefined' || arguments[2] === null)) {
		var input = arguments[0];
		var data = arguments[1];
		var key = arguments[2];

	}
}

Websom.FieldControl.prototype.update = function () {
	if (arguments.length == 2 && ((arguments[0] instanceof Websom.Input) || typeof arguments[0] == 'undefined' || arguments[0] === null) && ((arguments[1] instanceof Websom.Data) || typeof arguments[1] == 'undefined' || arguments[1] === null)) {
		var input = arguments[0];
		var data = arguments[1];

	}
}

Websom.FieldControl.prototype.message = function () {
	if (arguments.length == 4 && ((arguments[0] instanceof Websom.Input) || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'string' || typeof arguments[1] == 'undefined' || arguments[1] === null) && (typeof arguments[2] == 'object' || typeof arguments[2] == 'undefined' || arguments[2] === null) && (typeof arguments[3] == 'function' || typeof arguments[3] == 'undefined' || arguments[3] === null)) {
		var input = arguments[0];
		var name = arguments[1];
		var data = arguments[2];
		var send = arguments[3];
		send(null);
	}
}

Websom.FieldControl.prototype.use = function () {
	if (arguments.length == 1 && ((arguments[0] instanceof Websom.InputChain) || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var inputChain = arguments[0];

	}
}

Websom.Controls = function () {


}

Websom.Controls.Search = function () {
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

Websom.Controls.Search.prototype.filterField = function () {
	if (arguments.length == 3 && ((arguments[0]instanceof Array || typeof arguments[0] == 'boolean' || typeof arguments[0] == 'number' || typeof arguments[0] == 'number' || typeof arguments[0] == 'object' || typeof arguments[0] == 'string') || typeof arguments[0] == 'undefined' || arguments[0] === null) && ((arguments[1] instanceof Websom.DatabaseSelect || (arguments[1] instanceof Websom.MySqlDatabaseSelect)) || typeof arguments[1] == 'undefined' || arguments[1] === null) && (typeof arguments[2] == 'function' || typeof arguments[2] == 'undefined' || arguments[2] === null)) {
		var value = arguments[0];
		var select = arguments[1];
		var done = arguments[2];
		select.where(this.field).wildLike(value);
		done(null);
	}
}

Websom.Controls.Search.prototype.validate = function () {
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

Websom.Controls.Search.prototype.fill = function () {
	if (arguments.length == 3 && ((arguments[0] instanceof Websom.Input) || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'object' || typeof arguments[1] == 'undefined' || arguments[1] === null) && (typeof arguments[2] == 'function' || typeof arguments[2] == 'undefined' || arguments[2] === null)) {
		var input = arguments[0];
		var values = arguments[1];
		var done = arguments[2];
		this.fillField(input.raw[this.name], values);
		done();
	}
}

Websom.Controls.Search.prototype.filter = function () {
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

Websom.Controls.Search.prototype.validateField = function () {
	if (arguments.length == 3 && ((arguments[0] instanceof Websom.Input) || typeof arguments[0] == 'undefined' || arguments[0] === null) && ((arguments[1]instanceof Array || typeof arguments[1] == 'boolean' || typeof arguments[1] == 'number' || typeof arguments[1] == 'number' || typeof arguments[1] == 'object' || typeof arguments[1] == 'string') || typeof arguments[1] == 'undefined' || arguments[1] === null) && (typeof arguments[2] == 'function' || typeof arguments[2] == 'undefined' || arguments[2] === null)) {
		var input = arguments[0];
		var value = arguments[1];
		var done = arguments[2];
		done(new Websom.InputValidation(false, ""));
	}
}

Websom.Controls.Search.prototype.fillField = function () {
	if (arguments.length == 2 && ((arguments[0]instanceof Array || typeof arguments[0] == 'boolean' || typeof arguments[0] == 'number' || typeof arguments[0] == 'number' || typeof arguments[0] == 'object' || typeof arguments[0] == 'string') || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'object' || typeof arguments[1] == 'undefined' || arguments[1] === null)) {
		var value = arguments[0];
		var values = arguments[1];

	}
}

Websom.Controls.Search.prototype.insert = function () {
	if (arguments.length == 3 && ((arguments[0] instanceof Websom.Input) || typeof arguments[0] == 'undefined' || arguments[0] === null) && ((arguments[1] instanceof Websom.Data) || typeof arguments[1] == 'undefined' || arguments[1] === null) && ((arguments[2]instanceof Array || typeof arguments[2] == 'boolean' || typeof arguments[2] == 'number' || typeof arguments[2] == 'number' || typeof arguments[2] == 'object' || typeof arguments[2] == 'string') || typeof arguments[2] == 'undefined' || arguments[2] === null)) {
		var input = arguments[0];
		var data = arguments[1];
		var key = arguments[2];

	}
}

Websom.Controls.Search.prototype.update = function () {
	if (arguments.length == 2 && ((arguments[0] instanceof Websom.Input) || typeof arguments[0] == 'undefined' || arguments[0] === null) && ((arguments[1] instanceof Websom.Data) || typeof arguments[1] == 'undefined' || arguments[1] === null)) {
		var input = arguments[0];
		var data = arguments[1];

	}
}

Websom.Controls.Search.prototype.message = function () {
	if (arguments.length == 4 && ((arguments[0] instanceof Websom.Input) || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'string' || typeof arguments[1] == 'undefined' || arguments[1] === null) && (typeof arguments[2] == 'object' || typeof arguments[2] == 'undefined' || arguments[2] === null) && (typeof arguments[3] == 'function' || typeof arguments[3] == 'undefined' || arguments[3] === null)) {
		var input = arguments[0];
		var name = arguments[1];
		var data = arguments[2];
		var send = arguments[3];
		send(null);
	}
}

Websom.Controls.Search.prototype.use = function () {
	if (arguments.length == 1 && ((arguments[0] instanceof Websom.InputChain) || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var inputChain = arguments[0];

	}
}

Websom.Controls.Component = function () {
	this.parentContainer = null;

	this.componentContainer = null;

	this.server = null;

	this.container = null;

	if (arguments.length == 2 && ((arguments[0] instanceof Websom.Containers.Table) || typeof arguments[0] == 'undefined' || arguments[0] === null) && ((arguments[1] instanceof Websom.Containers.Table) || typeof arguments[1] == 'undefined' || arguments[1] === null)) {
		var parentContainer = arguments[0];
		var componentContainer = arguments[1];
		this.parentContainer = parentContainer;
		this.componentContainer = componentContainer;
	}

}

Websom.Controls.Component.prototype.validate = function () {
	if (arguments.length == 2 && ((arguments[0] instanceof Websom.Input) || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'function' || typeof arguments[1] == 'undefined' || arguments[1] === null)) {
		var input = arguments[0];
		var done = arguments[1];
		var that = this;
		if ("parent" in input.raw && (typeof input.raw["parent"] == 'object' ? (Array.isArray(input.raw["parent"]) ? 'array' : 'map') : (typeof input.raw["parent"] == 'number' ? 'float' : typeof input.raw["parent"])) == "string") {
			this.parentContainer.from().where("publicId").equals(input.raw["parent"]).run(function (err, docs) {
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
			}
	}
}

Websom.Controls.Component.prototype.fill = function () {
	if (arguments.length == 3 && ((arguments[0] instanceof Websom.Input) || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'object' || typeof arguments[1] == 'undefined' || arguments[1] === null) && (typeof arguments[2] == 'function' || typeof arguments[2] == 'undefined' || arguments[2] === null)) {
		var input = arguments[0];
		var values = arguments[1];
		var done = arguments[2];
		values["parentId"] = input.raw[this.parentContainer.table + "parentId"];
		done();
	}
}

Websom.Controls.Component.prototype.filter = function () {
	if (arguments.length == 3 && ((arguments[0] instanceof Websom.Input) || typeof arguments[0] == 'undefined' || arguments[0] === null) && ((arguments[1] instanceof Websom.DatabaseSelect || (arguments[1] instanceof Websom.MySqlDatabaseSelect)) || typeof arguments[1] == 'undefined' || arguments[1] === null) && (typeof arguments[2] == 'function' || typeof arguments[2] == 'undefined' || arguments[2] === null)) {
		var input = arguments[0];
		var select = arguments[1];
		var done = arguments[2];
		var that = this;
		if ("parent" in input.raw && (typeof input.raw["parent"] == 'object' ? (Array.isArray(input.raw["parent"]) ? 'array' : 'map') : (typeof input.raw["parent"] == 'number' ? 'float' : typeof input.raw["parent"])) == "string") {
			this.parentContainer.from().where("publicId").equals(input.raw["parent"]).run(function (err, docs) {
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
			}
	}
}

Websom.Controls.Component.prototype.insert = function () {
	if (arguments.length == 3 && ((arguments[0] instanceof Websom.Input) || typeof arguments[0] == 'undefined' || arguments[0] === null) && ((arguments[1] instanceof Websom.Data) || typeof arguments[1] == 'undefined' || arguments[1] === null) && ((arguments[2]instanceof Array || typeof arguments[2] == 'boolean' || typeof arguments[2] == 'number' || typeof arguments[2] == 'number' || typeof arguments[2] == 'object' || typeof arguments[2] == 'string') || typeof arguments[2] == 'undefined' || arguments[2] === null)) {
		var input = arguments[0];
		var data = arguments[1];
		var key = arguments[2];

	}
}

Websom.Controls.Component.prototype.update = function () {
	if (arguments.length == 2 && ((arguments[0] instanceof Websom.Input) || typeof arguments[0] == 'undefined' || arguments[0] === null) && ((arguments[1] instanceof Websom.Data) || typeof arguments[1] == 'undefined' || arguments[1] === null)) {
		var input = arguments[0];
		var data = arguments[1];

	}
}

Websom.Controls.Component.prototype.message = function () {
	if (arguments.length == 4 && ((arguments[0] instanceof Websom.Input) || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'string' || typeof arguments[1] == 'undefined' || arguments[1] === null) && (typeof arguments[2] == 'object' || typeof arguments[2] == 'undefined' || arguments[2] === null) && (typeof arguments[3] == 'function' || typeof arguments[3] == 'undefined' || arguments[3] === null)) {
		var input = arguments[0];
		var name = arguments[1];
		var data = arguments[2];
		var send = arguments[3];
		send(null);
	}
}

Websom.Controls.Component.prototype.use = function () {
	if (arguments.length == 1 && ((arguments[0] instanceof Websom.InputChain) || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var inputChain = arguments[0];

	}
}

Websom.CallContext = function () {
	this.subContainerCall = false;

	this.data = null;

	if (arguments.length == 0) {

	}

}

Websom.Data = function () {
	this.websomServer = null;

	this.websomFieldInfo = null;

	this.websomParentData = null;

	this.websomContainer = null;

	if (arguments.length == 1 && ((arguments[0] instanceof Websom.Server) || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var server = arguments[0];
		this.websomServer = server;
	}

}

Websom.Data.prototype.read = function () {
	if (arguments.length == 1 && ((arguments[0]instanceof Array || typeof arguments[0] == 'boolean' || typeof arguments[0] == 'number' || typeof arguments[0] == 'number' || typeof arguments[0] == 'object' || typeof arguments[0] == 'string') || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var value = arguments[0];

	}
}

Websom.Data.prototype.write = function () {
	if (arguments.length == 0) {

	}
}

Websom.Data.prototype.setField = function (name, value) {
		
			this[name] = value;
		
		}

Websom.Data.prototype.getContainer = function () {
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

Websom.Data.prototype.onInputInterface = function () {
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

Websom.Data.prototype.getField = function () {
	if (arguments.length == 1 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var name = arguments[0];
		
			return this[name];
		
		
	}
}

Websom.Data.prototype.getPublicId = function () {
	if (arguments.length == 0) {
		return this.getField("publicId");
	}
}

Websom.Data.prototype.callLoadFromMap = function () {
	if (arguments.length == 2 && (typeof arguments[0] == 'object' || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'function' || typeof arguments[1] == 'undefined' || arguments[1] === null)) {
		var raw = arguments[0];
		var callback = arguments[1];
		
			return this.loadFromMap(raw, callback);
		
		
	}
}

Websom.Data.getDataInfo = function () {
	if (arguments.length == 0) {
		
			return this.getInfo();
		
		
	}
}

Websom.Data.prototype.fromPrimary = function () {
	if (arguments.length == 2 && ((arguments[0]instanceof Array || typeof arguments[0] == 'boolean' || typeof arguments[0] == 'number' || typeof arguments[0] == 'number' || typeof arguments[0] == 'object' || typeof arguments[0] == 'string') || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'function' || typeof arguments[1] == 'undefined' || arguments[1] === null)) {
		var key = arguments[0];
		var done = arguments[1];

	}
}

Websom.Data.prototype.loadFromPublicKey = function () {
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

Websom.Data.prototype.loadFromId = function () {
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

Websom.Data.registerInterfaces = function () {
	if (arguments.length == 3 && ((arguments[0] instanceof Websom.Container || (arguments[0] instanceof Websom.Containers.Table)) || typeof arguments[0] == 'undefined' || arguments[0] === null) && ((arguments[1] instanceof Websom.Containers) || typeof arguments[1] == 'undefined' || arguments[1] === null) && (typeof arguments[2] == 'function' || typeof arguments[2] == 'undefined' || arguments[2] === null)) {
		var parent = arguments[0];
		var component = arguments[1];
		var getFieldContainer = arguments[2];

	}
}

Websom.Data.spawnFromId = function () {
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

Websom.Data.prototype.onSend = function () {
	if (arguments.length == 3 && ((arguments[0] instanceof Websom.Request) || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'object' || typeof arguments[1] == 'undefined' || arguments[1] === null) && (typeof arguments[2] == 'function' || typeof arguments[2] == 'undefined' || arguments[2] === null)) {
		var req = arguments[0];
		var exposed = arguments[1];
		var send = arguments[2];
		this.onComponentSend(req, exposed, send);
	}
}

Websom.Data.prototype.onComponentSend = function () {
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

Websom.Data.structureTable = function () {
	if (arguments.length == 0) {

	}
}

Websom.Data.prototype.getFieldContainer = function () {
	if (arguments.length == 1 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var fieldName = arguments[0];
		var dataInfo = this.fetchFieldInfo();
		var fieldInfo = dataInfo.getField(fieldName);
		var link = fieldInfo.structure.getFlag("linked");
		if (link == null) {
			return null;
			}
		var cast = this.websomContainer;
		return new Websom.Containers.Table(this.websomServer, cast.table + "_" + fieldName, Websom.DataInfo.getDataInfoFromRoute(link.fieldType));
	}
}

Websom.Data.prototype.nativeLoadFromMap = function () {
	if (arguments.length == 2 && (typeof arguments[0] == 'object' || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'function' || typeof arguments[1] == 'undefined' || arguments[1] === null)) {
		var raw = arguments[0];
		var done = arguments[1];
		
			this.loadFromMap(raw, done);
		
		
	}
}

Websom.Data.prototype.exposeToClient = function () {
	if (arguments.length == 0) {
		
			return this.exposeToClientBase();
		
		
	}
}

Websom.Data.prototype.linkedExpose = function () {
	if (arguments.length == 0) {

	}
}

Websom.Data.prototype.fetchFieldInfo = function () {
	if (arguments.length == 0) {
		var info = null;
		
			info = this.constructor.getInfo();
		
		
		return info;
	}
}

Websom.Data.prototype.getPrimary = function () {
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

Websom.Data.prototype.getFieldFromName = function () {
	if (arguments.length == 1 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var realName = arguments[0];
		 return this[realName]; 
		
	}
}

Websom.Data.prototype.containerInsert = function () {
	if (arguments.length == 5 && ((arguments[0] instanceof Websom.Input) || typeof arguments[0] == 'undefined' || arguments[0] === null) && ((arguments[1] instanceof Websom.Container || (arguments[1] instanceof Websom.Containers.Table)) || typeof arguments[1] == 'undefined' || arguments[1] === null) && ((arguments[2] instanceof Websom.DatabaseInsert || (arguments[2] instanceof Websom.MySqlDatabaseInsert)) || typeof arguments[2] == 'undefined' || arguments[2] === null) && (typeof arguments[3] == 'object' || typeof arguments[3] == 'undefined' || arguments[3] === null) && (typeof arguments[4] == 'function' || typeof arguments[4] == 'undefined' || arguments[4] === null)) {
		var input = arguments[0];
		var container = arguments[1];
		var insert = arguments[2];
		var data = arguments[3];
		var done = arguments[4];
		done();
	}
}

Websom.Data.prototype.containerUpdate = function () {
	if (arguments.length == 5 && ((arguments[0] instanceof Websom.Input) || typeof arguments[0] == 'undefined' || arguments[0] === null) && ((arguments[1] instanceof Websom.Container || (arguments[1] instanceof Websom.Containers.Table)) || typeof arguments[1] == 'undefined' || arguments[1] === null) && ((arguments[2] instanceof Websom.DatabaseSelect || (arguments[2] instanceof Websom.MySqlDatabaseSelect)) || typeof arguments[2] == 'undefined' || arguments[2] === null) && (typeof arguments[3] == 'object' || typeof arguments[3] == 'undefined' || arguments[3] === null) && (typeof arguments[4] == 'function' || typeof arguments[4] == 'undefined' || arguments[4] === null)) {
		var input = arguments[0];
		var container = arguments[1];
		var update = arguments[2];
		var data = arguments[3];
		var done = arguments[4];
		done();
	}
}

Websom.Data.prototype.update = function () {
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

Websom.Data.prototype.insert = function () {
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

Websom.Data.prototype.buildInsert = function () {
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

Websom.Data.prototype.buildUpdate = function () {
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

Websom.DataInfo = function () {
	this.info = null;

	this.name = "";

	this.linked = false;

	this.linkedTable = "";

	this.attributes = {};

	this.fields = [];

	if (arguments.length == 1 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var name = arguments[0];
		this.name = name;
	}

}

Websom.DataInfo.prototype.loadFromMap = function () {
	if (arguments.length == 1 && (typeof arguments[0] == 'object' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var info = arguments[0];
		this.info = info;
	}
}

Websom.DataInfo.prototype.getField = function () {
	if (arguments.length == 1 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var name = arguments[0];
		for (var i = 0; i < this.fields.length; i++) {
			if (this.fields[i].realName == name) {
				return this.fields[i];
				}
			}
		return null;
	}
}

Websom.DataInfo.prototype.hasField = function () {
	if (arguments.length == 1 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var name = arguments[0];
		for (var i = 0; i < this.fields.length; i++) {
			if (this.fields[i].realName == name) {
				return true;
				}
			}
		return false;
	}
}

Websom.DataInfo.prototype.buildStructure = function () {
	if (arguments.length == 0) {
		var str = new Websom.DatabaseStructure(null, "");
		for (var i = 0; i < this.fields.length; i++) {
			var hasField = true;
			if (this.fields[i].singleLink) {
				var subInfo = Websom.DataInfo.getDataInfoFromRoute(this.fields[i].typeRoute);
				if ("Component" in subInfo.attributes) {
					hasField = false;
					for (var j = 0;j < subInfo.fields.length;j++) {
						var sField = subInfo.fields[j];
						if ("Parent" in sField.attributes) {
							str.fields.push(sField.structure);
							}
						}
					}
				}
			if ("Parent" in this.fields[i].attributes) {
				hasField = false;
				}
			if (hasField) {
				str.fields.push(this.fields[i].structure);
				}
			}
		return str;
	}
}

Websom.DataInfo.prototype.spawn = function () {
	if (arguments.length == 1 && ((arguments[0] instanceof Websom.Server) || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var server = arguments[0];
		
			var splits = this.name.split(".");
			var cur = global;
			for (var split of splits)
				cur = cur[split];

			return new cur(server);
		
		
	}
}

Websom.DataInfo.getDataInfoFromRoute = function () {
	if (arguments.length == 1 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var route = arguments[0];
		
			var splits = route.split(".");
			var cur = global;
			for (var split of splits)
				cur = cur[split];

			return cur.getInfo();
		
		
	}
}

Websom.DataInfo.prototype.buildLinkedStructures = function () {
	if (arguments.length == 1 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var parentName = arguments[0];
		var strs = [];
		for (var i = 0; i < this.fields.length; i++) {
			var field = this.fields[i];
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
						if ("Linked" in dataInfo.attributes == false) {
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
		return strs;
	}
}

Websom.DataInfo.prototype.expose = function (raw) {
		var out = [];
		for (var i = 0; i < this.fields.length; i++) {
			var field = this.fields[i];
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

Websom.FieldInfo = function () {
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

	if (arguments.length == 4 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'string' || typeof arguments[1] == 'undefined' || arguments[1] === null) && (typeof arguments[2] == 'string' || typeof arguments[2] == 'undefined' || arguments[2] === null) && ((arguments[3] instanceof Websom.DatabaseField) || typeof arguments[3] == 'undefined' || arguments[3] === null)) {
		var realName = arguments[0];
		var fieldName = arguments[1];
		var typeRoute = arguments[2];
		var structure = arguments[3];
		this.realName = realName;
		this.fieldName = fieldName;
		this.typeRoute = typeRoute;
		this.structure = structure;
	}

}

Websom.FieldInfo.prototype.isComponent = function () {
	if (arguments.length == 0) {
		if (this.singleLink) {
			var linked = this.structure.getFlag("linked");
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
			}
	}
}

Websom.DataValidator = function () {
	this.info = null;

	if (arguments.length == 1 && ((arguments[0] instanceof Websom.DataInfo) || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var info = arguments[0];
		this.info = info;
	}

}

Websom.DataValidator.prototype.validate = function () {
	if (arguments.length == 2 && ((arguments[0] instanceof Websom.Input) || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'function' || typeof arguments[1] == 'undefined' || arguments[1] === null)) {
		var input = arguments[0];
		var pass = arguments[1];
		var that = this;
		var first = null;
		var waits = this.info.fields.length;
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
		for (var ii = 0; ii < this.info.fields.length; ii++) {
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
			}
	}
}

Websom.Databases = function () {


}

Websom.Database = function () {
	this.server = null;

	this.config = null;

	this.name = "";

	this.open = false;

	this.connecting = false;

	this.waits = [];

	if (arguments.length == 1 && ((arguments[0] instanceof Websom.Server) || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var server = arguments[0];
		this.server = server;
	}

}

Websom.Database.make = function () {
	if (arguments.length == 2 && ((arguments[0] instanceof Websom.Server) || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'string' || typeof arguments[1] == 'undefined' || arguments[1] === null)) {
		var server = arguments[0];
		var type = arguments[1];
		if (type == "mysql") {
			return new Websom.Databases.MySql(server);
			}
	}
}

Websom.Database.prototype.wait = function () {
	if (arguments.length == 1 && (typeof arguments[0] == 'function' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var func = arguments[0];
		this.waits.push(func);
	}
}

Websom.Database.prototype.load = function () {
	if (arguments.length == 1 && (typeof arguments[0] == 'object' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var config = arguments[0];
		this.config = config;
		this.name = this.config["name"];
	}
}

Websom.Database.prototype.connected = function () {
	if (arguments.length == 0) {
		for (var i = 0; i < this.waits.length; i++) {
			this.waits[i]();
			}
	}
}

Websom.Database.prototype.structure = function () {
	if (arguments.length == 1 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var table = arguments[0];
		return new Websom.DatabaseStructure(this, table);
	}
}

Websom.InputChain = function () {
	this.handler = null;

	this.hasCaptcha = false;

	this.successCallback = null;

	this.errorCallback = null;

	this.restricts = [];

	this.keys = [];

	if (arguments.length == 1 && ((arguments[0] instanceof Websom.InputHandler) || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var ih = arguments[0];
		this.handler = ih;
	}

}

Websom.InputChain.prototype.use = function () {
	if (arguments.length == 1 && ((arguments[0] instanceof Websom.Control || (arguments[0] instanceof Websom.MessageControl || (arguments[0] instanceof Websom.Controls.AddTo)) || (arguments[0] instanceof Websom.FieldControl || (arguments[0] instanceof Websom.Controls.Search) || (arguments[0] instanceof Websom.Controls.Unique) || (arguments[0] instanceof Websom.Controls.String) || (arguments[0] instanceof Websom.Controls.Number) || (arguments[0] instanceof Websom.Controls.Bool) || (arguments[0] instanceof Websom.Standard.UserSystem.UserControl)) || (arguments[0] instanceof Websom.Controls.Component) || (arguments[0] instanceof Websom.Controls.File)) || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var control = arguments[0];
		control.use(this);
		return this;
	}
}

Websom.InputChain.prototype.captcha = function () {
	if (arguments.length == 0) {
		this.hasCaptcha = true;
		return this;
	}
}

Websom.InputChain.prototype.restrict = function () {
	if (arguments.length == 0) {
		var restrict = new Websom.InputRestriction("global", "");
		this.restricts.push(restrict);
		return this;
	}
}

Websom.InputChain.prototype.to = function () {
	if (arguments.length == 2 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'string' || typeof arguments[1] == 'undefined' || arguments[1] === null)) {
		var key = arguments[0];
		var value = arguments[1];
		if (this.restricts.length > 0) {
			var r = this.restricts[this.restricts.length - 1];
			r.simple = true;
			r.key = key;
			r.value = value;
			}
		return this;
	}
else 	if (arguments.length == 1 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var permission = arguments[0];
		return this.to("permission", permission);
	}
else 	if (arguments.length == 1 && (typeof arguments[0] == 'function' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var callback = arguments[0];
		if (this.restricts.length > 0) {
			var r = this.restricts[this.restricts.length - 1];
			r.simple = false;
			r.callback = callback;
			}
		return this;
	}
}

Websom.InputChain.prototype.multipart = function () {
	if (arguments.length == 0) {
		return this;
	}
}

Websom.InputChain.prototype.key = function () {
	if (arguments.length == 1 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var key = arguments[0];
		this.keys.push(new Websom.InputKey(key));
		return this;
	}
}

Websom.InputChain.prototype.is = function () {
	if (arguments.length == 1 && ((arguments[0] instanceof Websom.Container || (arguments[0] instanceof Websom.Containers.Table)) || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var dataTypeContainer = arguments[0];
		return this.is(new Websom.InputFilters.Data(dataTypeContainer));
	}
else 	if (arguments.length == 1 && ((arguments[0] instanceof Websom.InputKeyFilter || (arguments[0] instanceof Websom.InputFilters.Data) || (arguments[0] instanceof Websom.InputFilters.String)) || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var filter = arguments[0];
		if (this.keys.length > 0) {
			this.keys[this.keys.length - 1].setFilter(filter);
			}
		return this;
	}
else 	if (arguments.length == 1 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var typeName = arguments[0];
		if (this.keys.length > 0) {
			if (typeName == "string") {
				this.keys[this.keys.length - 1].setFilter(new Websom.InputFilters.String());
				}else{
					throw new Error("Unknown is typeName " + typeName);
				}
			}
		return this;
	}
}

Websom.InputChain.prototype.length = function () {
	if (arguments.length == 2 && (typeof arguments[0] == 'number' || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'number' || typeof arguments[1] == 'undefined' || arguments[1] === null)) {
		var min = arguments[0];
		var max = arguments[1];
		if (this.keys.length > 0) {
			var filter = this.keys[this.keys.length - 1].filter;
			filter.minLength = min;
			filter.maxLength = max;
			}
		return this;
	}
}

Websom.InputChain.prototype.only = function () {
	if (arguments.length == 1 && (arguments[0]instanceof Array || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var values = arguments[0];
		if (this.keys.length > 0) {
			var filter = this.keys[this.keys.length - 1].filter;
			filter.only = values;
			}
		return this;
	}
}

Websom.InputChain.prototype.not = function () {
	if (arguments.length == 1 && (arguments[0]instanceof Array || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var values = arguments[0];
		if (this.keys.length > 0) {
			var filter = this.keys[this.keys.length - 1].filter;
			filter.not = values;
			}
		return this;
	}
}

Websom.InputChain.prototype.matches = function () {
	if (arguments.length == 1 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var regex = arguments[0];
		if (this.keys.length > 0) {
			var filter = this.keys[this.keys.length - 1].filter;
			filter.matches = regex;
			}
		return this;
	}
}

Websom.InputChain.prototype.success = function () {
	if (arguments.length == 1 && (typeof arguments[0] == 'function' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var callback = arguments[0];
		this.successCallback = callback;
		return this;
	}
}

Websom.InputChain.prototype.error = function () {
	if (arguments.length == 1 && (typeof arguments[0] == 'function' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var callback = arguments[0];
		this.errorCallback = callback;
		return this;
	}
}

Websom.InputChain.prototype.received = function () {
	if (arguments.length == 1 && ((arguments[0] instanceof Websom.Input) || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var input = arguments[0];
		var that = this;
		var hasKeys = true;
		for (var i = 0; i < this.keys.length; i++) {
			var key = this.keys[i];
			if (key.key in input.raw == false) {
				hasKeys = false;
				}
			}
		if (hasKeys == false) {
			input.sendError("Invalid keys");
			return null;
			}
		var dones = this.keys.length + this.restricts.length;
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
		for (var i = 0; i < this.keys.length; i++) {
			var key = this.keys[i];
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
		for (var i = 0; i < this.restricts.length; i++) {
			var r = this.restricts[i];
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
			}
	}
}

Websom.InputKey = function () {
	this.key = null;

	this.type = "raw";

	this.filter = null;

	if (arguments.length == 1 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var key = arguments[0];
		this.key = key;
	}

}

Websom.InputKey.prototype.setFilter = function () {
	if (arguments.length == 1 && ((arguments[0] instanceof Websom.InputKeyFilter || (arguments[0] instanceof Websom.InputFilters.Data) || (arguments[0] instanceof Websom.InputFilters.String)) || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var filter = arguments[0];
		this.filter = filter;
	}
}

Websom.InputKeyFilter = function () {
	this.minLength = -1;

	this.maxLength = -1;

	this.max = -1;

	this.min = -1;

	this.only = [];

	this.not = [];

	this.matches = "";


}

Websom.InputKeyFilter.prototype.filter = function () {
	if (arguments.length == 5 && ((arguments[0] instanceof Websom.Input) || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'object' || typeof arguments[1] == 'undefined' || arguments[1] === null) && (typeof arguments[2] == 'string' || typeof arguments[2] == 'undefined' || arguments[2] === null) && (typeof arguments[3] == 'object' || typeof arguments[3] == 'undefined' || arguments[3] === null) && (typeof arguments[4] == 'function' || typeof arguments[4] == 'undefined' || arguments[4] === null)) {
		var input = arguments[0];
		var data = arguments[1];
		var key = arguments[2];
		var putData = arguments[3];
		var done = arguments[4];
		putData[key] = data[key];
		done(new Websom.InputValidation(false, ""));
	}
}

Websom.InputFilters = function () {


}

Websom.InputFilters.Data = function () {
	this.container = null;

	this.minLength = -1;

	this.maxLength = -1;

	this.max = -1;

	this.min = -1;

	this.only = [];

	this.not = [];

	this.matches = "";

	if (arguments.length == 1 && ((arguments[0] instanceof Websom.Containers.Table) || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var container = arguments[0];
		this.container = container;
	}

}

Websom.InputFilters.Data.prototype.filter = function () {
	if (arguments.length == 5 && ((arguments[0] instanceof Websom.Input) || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'object' || typeof arguments[1] == 'undefined' || arguments[1] === null) && (typeof arguments[2] == 'string' || typeof arguments[2] == 'undefined' || arguments[2] === null) && (typeof arguments[3] == 'object' || typeof arguments[3] == 'undefined' || arguments[3] === null) && (typeof arguments[4] == 'function' || typeof arguments[4] == 'undefined' || arguments[4] === null)) {
		var input = arguments[0];
		var data = arguments[1];
		var key = arguments[2];
		var putData = arguments[3];
		var done = arguments[4];
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
				this.container.loadFromSelect(this.container.from().where("publicId").equals(data[key]), function (results) {
					if (results.length != 1) {
						done(new Websom.InputValidation(true, "Invalid publicId for key " + key));
						}else{
							putData[key] = results[0];
							done(new Websom.InputValidation(false, ""));
						}
					});
			}
	}
}

Websom.InputFilters.String = function () {
	this.minLength = -1;

	this.maxLength = -1;

	this.max = -1;

	this.min = -1;

	this.only = [];

	this.not = [];

	this.matches = "";

	if (arguments.length == 0) {

	}

}

Websom.InputFilters.String.prototype.filter = function () {
	if (arguments.length == 5 && ((arguments[0] instanceof Websom.Input) || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'object' || typeof arguments[1] == 'undefined' || arguments[1] === null) && (typeof arguments[2] == 'string' || typeof arguments[2] == 'undefined' || arguments[2] === null) && (typeof arguments[3] == 'object' || typeof arguments[3] == 'undefined' || arguments[3] === null) && (typeof arguments[4] == 'function' || typeof arguments[4] == 'undefined' || arguments[4] === null)) {
		var input = arguments[0];
		var data = arguments[1];
		var key = arguments[2];
		var putData = arguments[3];
		var done = arguments[4];
		var invalid = false;
		if ((typeof data[key] == 'object' ? (Array.isArray(data[key]) ? 'array' : 'map') : (typeof data[key] == 'number' ? 'float' : typeof data[key])) == "string") {
			var value = data[key];
			if (this.maxLength != -1) {
				if (value.length > this.maxLength) {
					invalid = true;
					}
				}
			if (invalid == false && this.minLength != -1) {
				if (value.length < this.minLength) {
					invalid = true;
					}
				}
			if (invalid == false && this.only.length > 0) {
				invalid = true;
				for (var i = 0; i < this.only.length; i++) {
					var check = this.only[i];
					if (value == check) {
						invalid = false;
						break;
						}
					}
				}else if (invalid == false && this.not.length > 0) {
				for (var i = 0; i < this.not.length; i++) {
					var check = this.not[i];
					if (value == check) {
						invalid = true;
						break;
						}
					}
				}
			if (invalid == false && this.matches.length > 0) {
				if ((new RegExp(this.matches)).test(value) == false) {
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
			}
	}
}

Websom.InterfaceChain = function () {
	this.parent = null;

	this.upChain = null;

	this.subs = {};

	this.io = null;

	this.currentMode = "interface";

	if (arguments.length == 2 && ((arguments[0] instanceof Websom.Container || (arguments[0] instanceof Websom.Containers.Table)) || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'string' || typeof arguments[1] == 'undefined' || arguments[1] === null)) {
		var parent = arguments[0];
		var route = arguments[1];
		this.parent = parent;
		this.io = new Websom.InterfaceOptions(route);
		this.parent.interface(this.io);
	}
else 	if (arguments.length == 2 && ((arguments[0] instanceof Websom.Container || (arguments[0] instanceof Websom.Containers.Table)) || typeof arguments[0] == 'undefined' || arguments[0] === null) && ((arguments[1] instanceof Websom.InterfaceChain) || typeof arguments[1] == 'undefined' || arguments[1] === null)) {
		var parent = arguments[0];
		var upChain = arguments[1];
		this.parent = parent;
		this.io = new Websom.InterfaceOptions(upChain.io.route);
		this.upChain = upChain;
	}

}

Websom.InterfaceChain.prototype.captcha = function () {
	if (arguments.length == 0) {
		if (this.currentMode == "select") {
			this.io.captchaSelect = true;
			}else if (this.currentMode == "insert") {
			this.io.captchaInsert = true;
			}else{
				this.io.captchaUpdate = true;
			}
		return this;
	}
}

Websom.InterfaceChain.prototype.select = function () {
	if (arguments.length == 0) {
		this.currentMode = "select";
		this.io.canSelect = true;
		return this;
	}
}

Websom.InterfaceChain.prototype.insert = function () {
	if (arguments.length == 0) {
		this.currentMode = "insert";
		this.io.canInsert = true;
		return this;
	}
}

Websom.InterfaceChain.prototype.update = function () {
	if (arguments.length == 0) {
		this.currentMode = "update";
		this.io.canUpdate = true;
		return this;
	}
}

Websom.InterfaceChain.prototype.interface = function () {
	if (arguments.length == 0) {
		this.currentMode = "interface";
		this.io.canInterface = true;
		return this;
	}
}

Websom.InterfaceChain.prototype.up = function () {
	if (arguments.length == 0) {
		return this.upChain;
	}
}

Websom.InterfaceChain.prototype.restrict = function () {
	if (arguments.length == 1 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var field = arguments[0];
		var mode = this.currentMode;
		if (mode == "interface") {
			mode = "global";
			}
		var restrict = new Websom.InputRestriction(mode, field);
		this.io.restricts.push(restrict);
		return this;
	}
}

Websom.InterfaceChain.prototype.to = function () {
	if (arguments.length == 2 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'string' || typeof arguments[1] == 'undefined' || arguments[1] === null)) {
		var key = arguments[0];
		var value = arguments[1];
		if (this.io.restricts.length > 0) {
			var r = this.io.restricts[this.io.restricts.length - 1];
			r.simple = true;
			r.key = key;
			r.value = value;
			}
		return this;
	}
else 	if (arguments.length == 1 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var permission = arguments[0];
		return this.to("permission", permission);
	}
else 	if (arguments.length == 1 && (typeof arguments[0] == 'function' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var callback = arguments[0];
		if (this.io.restricts.length > 0) {
			var r = this.io.restricts[this.io.restricts.length - 1];
			r.simple = false;
			r.callback = callback;
			}
		return this;
	}
}

Websom.InterfaceChain.prototype.multipart = function () {
	if (arguments.length == 0) {
		this.io.multipart = true;
		return this;
	}
}

Websom.InterfaceChain.prototype.sub = function () {
	if (arguments.length == 1 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var fieldName = arguments[0];
		if (this.subs[fieldName] == null) {
			var childChain = new Websom.InterfaceChain(this.parent, this);
			childChain.io.route = this.io.route;
			this.subs[fieldName] = childChain;
			this.io.subs[fieldName] = childChain.io;
			return childChain;
			}else{
				var cast = this.subs[fieldName];
				return cast;
			}
	}
}

Websom.InterfaceChain.prototype.mustOwn = function () {
	if (arguments.length == 0) {
		if (this.currentMode == "insert") {
			this.io.mustOwnInsert = true;
			}else if (this.currentMode == "update") {
			this.io.mustOwnUpdate = true;
			}else if (this.currentMode == "select") {
			this.io.mustOwnSelect = true;
			}
		return this;
	}
}

Websom.InterfaceChain.prototype.mustLogin = function () {
	if (arguments.length == 0) {
		this.io.mustLogin = true;
		return this;
	}
}

Websom.InterfaceChain.prototype.unique = function () {
	if (arguments.length == 1 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var key = arguments[0];
		this.io.uniqueKeys.push(key);
		this.control(new Websom.Controls.Unique(key));
		return this;
	}
}

Websom.InterfaceChain.prototype.autoPublicId = function () {
	if (arguments.length == 0) {
		this.io.autoPublicId = true;
		return this;
	}
}

Websom.InterfaceChain.prototype.timestamp = function () {
	if (arguments.length == 0) {
		this.io.autoTimestamp = true;
		return this;
	}
}

Websom.InterfaceChain.prototype.control = function (control) {
		if (this.currentMode == "select") {
			this.io.selectControls.push(control);
			}else if (this.currentMode == "update") {
			this.io.updateControls.push(control);
			}else if (this.currentMode == "insert") {
			this.io.insertControls.push(control);
			}else if (this.currentMode == "interface") {
			this.io.controls.push(control);
			}
		return this;}

Websom.InterfaceChain.prototype.success = function () {
	if (arguments.length == 1 && (typeof arguments[0] == 'function' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var func = arguments[0];
		if (this.currentMode == "update") {
			this.io.successUpdate = func;
			}else if (this.currentMode == "insert") {
			this.io.successInsert = func;
			}
		return this;
	}
}

Websom.InterfaceChain.prototype.on = function () {
	if (arguments.length == 1 && (typeof arguments[0] == 'function' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var func = arguments[0];
		if (this.currentMode == "select") {
			this.io.onSelect = func;
			}else if (this.currentMode == "update") {
			this.io.onUpdate = func;
			}else if (this.currentMode == "insert") {
			this.io.onInsert = func;
			}
		return this;
	}
}

Websom.InterfaceChain.prototype.expose = function () {
	if (arguments.length == 1 && (typeof arguments[0] == 'function' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var func = arguments[0];
		this.io.expose(func);
		return this;
	}
}

Websom.InterfaceChain.prototype.authPermission = function () {
	if (arguments.length == 1 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var perm = arguments[0];
		if (this.currentMode == "select") {
			this.io.selectPermission = perm;
			}else if (this.currentMode == "update") {
			this.io.updatePermission = perm;
			}else if (this.currentMode == "insert") {
			this.io.insertPermission = perm;
			}
		this.io.hasAuth = true;
		return this;
	}
}

Websom.InterfaceChain.prototype.autoControl = function () {
	if (arguments.length == 1 && ((arguments[0] instanceof Websom.DataInfo) || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var info = arguments[0];
		this.io.autoControl(info);
		return this;
	}
}

Websom.ClientMessage = function () {
	this.message = "";

	this.href = "";

	this.doReload = false;

	this.hadError = false;

	this.validations = [];

	if (arguments.length == 0) {

	}

}

Websom.ClientMessage.quickError = function () {
	if (arguments.length == 1 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var msg = arguments[0];
		var err = new Websom.ClientMessage();
		err.message = msg;
		err.hadError = true;
		return err;
	}
}

Websom.ClientMessage.prototype.navigate = function () {
	if (arguments.length == 1 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var href = arguments[0];
		this.href = href;
	}
}

Websom.ClientMessage.prototype.reload = function () {
	if (arguments.length == 0) {
		this.doReload = true;
	}
}

Websom.ClientMessage.prototype.add = function () {
	if (arguments.length == 1 && ((arguments[0] instanceof Websom.InputValidation) || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var validation = arguments[0];
		if (validation.hadError) {
			this.hadError = true;
			}
		this.validations.push(validation);
	}
}

Websom.ClientMessage.prototype.stringify = function () {
	if (arguments.length == 0) {
		var anon = [];
		var status = "success";
		if (this.hadError) {
			status = "error";
			}
		for (var i = 0; i < this.validations.length; i++) {
			if (this.validations[i].hadError) {
				status = "error";
				}
			anon.push("\"" + this.validations[i].stringify() + "\"");
			}
		var add = "";
		if (this.href.length > 0) {
			add += ", \"action\": \"navigate\", \"href\": \"" + this.href + "\"";
			status = "action";
			}
		if (this.doReload) {
			add += ", \"action\": \"reload\"";
			status = "action";
			}
		return "{\"status\": \"" + status + "\", \"messages\": [" + anon.join(", ") + "], \"message\": " + Websom.Json.encode(this.message) + add + "}";
	}
}

Websom.Module = function () {
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

Websom.Module.prototype.clientData = function () {
	if (arguments.length == 2 && ((arguments[0] instanceof Websom.Request) || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'function' || typeof arguments[1] == 'undefined' || arguments[1] === null)) {
		var req = arguments[0];
		var send = arguments[1];
		return false;
	}
}

Websom.Module.prototype.spawn = function () {
	if (arguments.length == 1 && (typeof arguments[0] == 'object' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var config = arguments[0];
		this.baseConfig = config;
		this.name = config["name"];
		this.id = config["id"];
	}
}

Websom.Module.prototype.start = function () {
	if (arguments.length == 0) {

	}
}

Websom.Module.prototype.stop = function () {
	if (arguments.length == 0) {

	}
}

Websom.Module.prototype.setupData = function () {
	if (arguments.length == 0) {

	}
}

Websom.Module.prototype.setupBridge = function () {
	if (arguments.length == 0) {

	}
}

Websom.Pack = function () {
	this.server = null;

	this.name = "";

	this.root = "";

	this.config = null;

	if (arguments.length == 4 && ((arguments[0] instanceof Websom.Server) || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'string' || typeof arguments[1] == 'undefined' || arguments[1] === null) && (typeof arguments[2] == 'string' || typeof arguments[2] == 'undefined' || arguments[2] === null) && (typeof arguments[3] == 'object' || typeof arguments[3] == 'undefined' || arguments[3] === null)) {
		var server = arguments[0];
		var name = arguments[1];
		var root = arguments[2];
		var config = arguments[3];
		this.server = server;
		this.name = name;
		this.root = root;
		this.config = config;
	}

}

Websom.Pack.prototype.start = function () {
	if (arguments.length == 0) {

	}
}

Websom.Pack.prototype.include = function () {
	if (arguments.length == 0) {
		var dir = this.server.config.clientResources + "/pack/" + this.name;
		var css = "<link rel=\"stylesheet\" type=\"text/css\" href=\"" + dir + "/pack.css\"/>";
		return "<script src=\"" + dir + "/pack.js\"></script>" + css;
	}
}

Websom.Pack.prototype.write = function () {
	if (arguments.length == 2 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'string' || typeof arguments[1] == 'undefined' || arguments[1] === null)) {
		var js = arguments[0];
		var css = arguments[1];
		var dir = this.server.config.resources + "/pack/" + this.name;
		if (Oxygen.FileSystem.exists(dir) == false) {
			Oxygen.FileSystem.makeDir(dir);
			}
		Oxygen.FileSystem.writeSync(dir + "/pack.js", js);
		Oxygen.FileSystem.writeSync(dir + "/pack.css", css);
	}
}

Websom.Pack.prototype.buildAndSave = function () {
	if (arguments.length == 1 && (typeof arguments[0] == 'function' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var callback = arguments[0];
		var that = this;
		this.build(function (err, js, css) {
			that.write(js, css);
			callback(err);
			});
	}
}

Websom.Pack.prototype.getViews = function () {
	if (arguments.length == 0) {
		var views = [];
		var resources = this.config["resources"];
		var outputs = this.server.resource.compile("Pack." + this.name, this.root, resources);
		for (var i = 0; i < outputs.length; i++) {
			var resource = outputs[i];
			if (resource.type == "view") {
				var view = new Websom.View(this.server);
				view.loadFromFile(resource.file);
				views.push(view);
				}
			}
		return views;
	}
}

Websom.Pack.prototype.build = function () {
	if (arguments.length == 1 && (typeof arguments[0] == 'function' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var callback = arguments[0];
		var that = this;
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
		var resources = this.config["resources"];
		var outputs = this.server.resource.compile("Pack." + this.name, this.root, resources);
		dones = outputs.length;
		for (var i = 0; i < outputs.length; i++) {
			var resource = outputs[i];
			if (resource.type == "javascript") {
				resource.build(doneJs);
				}else if (resource.type == "less") {
				resource.reference = Oxygen.FileSystem.resolve(Oxygen.FileSystem.dirName(this.server.scriptPath) + "/../../theme/style/main.less");
				resource.build(doneCss);
				}else if (resource.type == "css") {
				resource.build(doneCss);
				}else if (resource.type == "view") {
				var view = new Websom.View(this.server);
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
			}
	}
}

Websom.Request = function () {
	this.server = null;

	this.client = null;

	this.sent = false;

	this.path = "";

	this.userCache = null;

	this.response = null;

	this.jsRequest = null;

	this.session = null;

	if (arguments.length == 2 && ((arguments[0] instanceof Websom.Server) || typeof arguments[0] == 'undefined' || arguments[0] === null) && ((arguments[1] instanceof Websom.Client) || typeof arguments[1] == 'undefined' || arguments[1] === null)) {
		var server = arguments[0];
		var client = arguments[1];
		this.server = server;
		this.client = client;
		this.response = new Websom.Response();
		this.session = new Websom.Session(this);
	}

}

Websom.Request.prototype.header = function () {
	if (arguments.length == 2 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null) && ((arguments[1]instanceof Array || typeof arguments[1] == 'boolean' || typeof arguments[1] == 'number' || typeof arguments[1] == 'number' || typeof arguments[1] == 'object' || typeof arguments[1] == 'string') || typeof arguments[1] == 'undefined' || arguments[1] === null)) {
		var name = arguments[0];
		var value = arguments[1];
		
			this.response.jsResponse.setHeader(name, value);
		
		
	}
}

Websom.Request.prototype.code = function () {
	if (arguments.length == 1 && (typeof arguments[0] == 'number' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var code = arguments[0];
		this.response.code = code;
		
			this.response.jsResponse.status(code);
		
		
	}
}

Websom.Request.prototype.end = function () {
	if (arguments.length == 0) {
		
			this.response.jsResponse.end();
		
	}
}

Websom.Request.prototype.flush = function () {
	if (arguments.length == 0) {
		
			this.response.jsResponse.flush();
		
	}
}

Websom.Request.prototype.write = function () {
	if (arguments.length == 1 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var content = arguments[0];
		
			this.response.jsResponse.write(content);
		
		
	}
}

Websom.Request.prototype.send = function () {
	if (arguments.length == 1 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var content = arguments[0];
		if (this.sent) {
			return null;
			}
		
			this.response.jsResponse.send(content);
		
		
		this.sent = true;
	}
}

Websom.Request.prototype.redirect = function () {
	if (arguments.length == 1 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var route = arguments[0];
		
			this.response.jsResponse.redirect(route);
		
		
	}
}

Websom.Request.prototype.download = function () {
	if (arguments.length == 3 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'string' || typeof arguments[1] == 'undefined' || arguments[1] === null) && (typeof arguments[2] == 'string' || typeof arguments[2] == 'undefined' || arguments[2] === null)) {
		var name = arguments[0];
		var path = arguments[1];
		var type = arguments[2];
		
			const fs = require("fs");
			this.response.jsResponse.type(type);
			this.response.jsResponse.setHeader("Content-disposition", "attachment; filename=" + name);
			fs.createReadStream(path).pipe(this.response.jsResponse);
		
		
	}
}

Websom.Request.prototype.getUser = function () {
	if (arguments.length == 1 && (typeof arguments[0] == 'function' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var callback = arguments[0];
		if (this.server.userSystem != null) {
			this.server.userSystem.getLoggedIn(this, callback);
			}else{
				callback(null);
			}
	}
}

Websom.Session = function () {
	this.request = null;

	if (arguments.length == 1 && ((arguments[0] instanceof Websom.Request) || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var req = arguments[0];
		this.request = req;
	}

}

Websom.Session.prototype.set = function () {
	if (arguments.length == 2 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null) && ((arguments[1]instanceof Array || typeof arguments[1] == 'boolean' || typeof arguments[1] == 'number' || typeof arguments[1] == 'number' || typeof arguments[1] == 'object' || typeof arguments[1] == 'string') || typeof arguments[1] == 'undefined' || arguments[1] === null)) {
		var key = arguments[0];
		var value = arguments[1];
		
			this.request.jsRequest.session[key] = value;
			if (this.request.jsRequest.method == "POST") {
				this.request.jsRequest.session.save();
			}
		
		
	}
}

Websom.Session.prototype.delete = function () {
	if (arguments.length == 1 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var key = arguments[0];
		
			delete this.request.jsRequest.session[key];
		
		
	}
}

Websom.Session.prototype.get = function () {
	if (arguments.length == 1 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var key = arguments[0];
		
			return this.request.jsRequest.session[key] || null;
		
		
	}
}

Websom.Response = function () {
	this.code = 0;

	this.body = "";

	this.message = "";

	this.jsResponse = null;

	if (arguments.length == 0) {

	}

}

Websom.Status = function () {
	this.notices = [];

	this.hadError = false;

	if (arguments.length == 0) {

	}

}

Websom.Status.prototype.inherit = function () {
	if (arguments.length == 1 && ((arguments[0] instanceof Websom.Status) || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var status = arguments[0];
		if (status == null) {
			return null;
			}
		for (var i = 0; i < status.notices.length; i++) {
			this.notices.push(status.notices[i]);
			}
		this.hadError = status.hadError;
	}
}

Websom.Status.prototype.give = function () {
	if (arguments.length == 2 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'string' || typeof arguments[1] == 'undefined' || arguments[1] === null)) {
		var module = arguments[0];
		var message = arguments[1];
		var notice = new Websom.Notice(module, message);
		this.notices.push(notice);
		return notice;
	}
else 	if (arguments.length == 3 && (typeof arguments[0] == 'number' || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'string' || typeof arguments[1] == 'undefined' || arguments[1] === null) && (typeof arguments[2] == 'string' || typeof arguments[2] == 'undefined' || arguments[2] === null)) {
		var level = arguments[0];
		var module = arguments[1];
		var message = arguments[2];
		var notice = new Websom.Notice(module, message);
		notice.level = level;
		this.notices.push(notice);
		if (level == 4) {
			this.hadError = true;
			}
		return notice;
	}
}

Websom.Status.prototype.display = function () {
	if (arguments.length == 0) {
		if (this.notices.length == 0) {
			return "Ok";
			}
		var out = "";
		if (this.hadError) {
			out += ":Websom: :Error:\n";
			}
		for (var i = 0; i < this.notices.length; i++) {
			out += this.notices[i].display();
			}
		return out;
	}
}

Websom.Status.prototype.clear = function () {
	if (arguments.length == 0) {
		for (var i = this.notices.length - 1;i >= 0;i--) {
			this.notices.pop();
			}
	}
}

Websom.Status.singleError = function () {
	if (arguments.length == 2 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'string' || typeof arguments[1] == 'undefined' || arguments[1] === null)) {
		var module = arguments[0];
		var error = arguments[1];
		var status = new Websom.Status();
		status.give(4, module, error);
		return status;
	}
}

Websom.Notice = function () {
	this.code = 0;

	this.module = "";

	this.message = "";

	this.line = 0;

	this.column = 0;

	this.offset = 0;

	this.level = 2;

	if (arguments.length == 2 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'string' || typeof arguments[1] == 'undefined' || arguments[1] === null)) {
		var module = arguments[0];
		var message = arguments[1];
		this.module = module;
		this.message = message;
	}

}

Websom.Notice.prototype.display = function () {
	if (arguments.length == 0) {
		return this.module + ": " + this.message;
	}
}

Websom.Theme = function () {
	this.server = null;

	this.name = "";

	this.key = "";

	this.root = "";

	this.config = null;

	if (arguments.length == 4 && ((arguments[0] instanceof Websom.Server) || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'string' || typeof arguments[1] == 'undefined' || arguments[1] === null) && (typeof arguments[2] == 'string' || typeof arguments[2] == 'undefined' || arguments[2] === null) && (typeof arguments[3] == 'object' || typeof arguments[3] == 'undefined' || arguments[3] === null)) {
		var server = arguments[0];
		var name = arguments[1];
		var root = arguments[2];
		var config = arguments[3];
		this.server = server;
		this.name = name;
		this.root = root;
		this.config = config;
		if ("key" in this.config) {
			this.key = this.config["key"];
			}
	}

}

Websom.Theme.prototype.start = function () {
	if (arguments.length == 0) {

	}
}

Websom.Theme.prototype.prefix = function () {
	if (arguments.length == 0) {
		if (this.key.length > 0) {
			return "theme-" + this.key;
			}
		return "theme";
	}
}

Websom.Theme.prototype.include = function () {
	if (arguments.length == 0) {
		var dir = this.server.config.clientResources + "/" + this.prefix();
		return "<script src=\"" + dir + "/theme.js\"></script><link rel=\"stylesheet\" type=\"text/css\" href=\"" + dir + "/theme.css\"/>";
	}
}

Websom.Theme.prototype.write = function () {
	if (arguments.length == 2 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'string' || typeof arguments[1] == 'undefined' || arguments[1] === null)) {
		var js = arguments[0];
		var css = arguments[1];
		var dir = this.server.config.resources + "/" + this.prefix();
		if (Oxygen.FileSystem.exists(dir) == false) {
			Oxygen.FileSystem.makeDir(dir);
			}
		Oxygen.FileSystem.writeSync(dir + "/theme.js", js);
		Oxygen.FileSystem.writeSync(dir + "/theme.css", css);
	}
}

Websom.Theme.prototype.buildAndSave = function () {
	if (arguments.length == 1 && (typeof arguments[0] == 'function' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var callback = arguments[0];
		var that = this;
		this.build(function (err, js, css) {
			that.write(js, css);
			callback(err);
			});
	}
}

Websom.Theme.prototype.build = function () {
	if (arguments.length == 1 && (typeof arguments[0] == 'function' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var callback = arguments[0];
		var that = this;
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
		var resources = this.config["resources"];
		var outputs = this.server.resource.compile("Theme." + this.name, this.root, resources);
		dones = outputs.length;
		for (var i = 0; i < outputs.length; i++) {
			var resource = outputs[i];
			if (resource.type == "javascript") {
				resource.build(doneJs);
				}else if (resource.type == "less") {
				resource.reference = Oxygen.FileSystem.resolve(Oxygen.FileSystem.dirName(this.server.scriptPath) + "/../../theme/style/main.less");
				resource.build(doneCss);
				}else if (resource.type == "css") {
				resource.build(doneCss);
				}else if (resource.type == "view") {
				var view = new Websom.View(this.server);
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
			}
	}
}

Websom.View = function () {
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

	if (arguments.length == 1 && ((arguments[0] instanceof Websom.Server) || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var server = arguments[0];
		this.server = server;
	}

}

Websom.View.prototype.render = function () {
	if (arguments.length == 1 && ((arguments[0] instanceof Websom.Render.Context) || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var ctx = arguments[0];
		return this.server.render.renderView(this, ctx);
	}
}

Websom.View.prototype.quickParse = function () {
	if (arguments.length == 1 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var raw = arguments[0];

	}
}

Websom.View.prototype.parse = function () {
	if (arguments.length == 1 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var raw = arguments[0];
		this.shallow = false;
		var open = false;
		var opens = 0;
		var name = "";
		var block = "";
		var openChar = "{";
		var closeChar = "}";
		var escape = false;
		var blocks = {};
		for (var i = 0;i < raw.length;i++) {
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
		return blocks;
	}
}

Websom.View.prototype.loadFromFile = function () {
	if (arguments.length == 1 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var location = arguments[0];
		this.location = location;
		var raw = Oxygen.FileSystem.readSync(location, "utf8");
		var output = this.parse(raw);
		this.raw = output;
		if ("info" in output) {
			this.meta = Websom.Json.parse("{" + output["info"] + "}");
			if ("name" in this.meta) {
				this.name = this.meta["name"];
				}else{
					return Websom.Status.singleError("View", "No name provided in view: '" + location + "'");
				}
			if ("handles" in this.meta) {
				this.handles = this.meta["handles"];
				}
			if ("greedy" in this.meta) {
				this.greedy = this.meta["greedy"];
				}
			}else{
				return Websom.Status.singleError("View", "No info provided in view: '" + location + "'");
			}
		if ("template" in output) {
			this.template = output["template"];
			}
		if ("client" in output) {
			this.client = output["client"];
			}
		if ("server php" in output) {
			this.hasServerScript = true;
			this.phpScript = output["server php"];
			}
		
			if ("server js" in output) {
				this.hasServerScript = true;
				this.jsScript = eval("function (view, server, request) {" + output["server js"] + "}");
			}
		
		if ("server carbon" in output) {
			this.hasServerScript = true;
			if (this.server.config.dev) {
				
					var script = this.buildScript("javascript.source.memory", "WebsomPageScript" + this.name, "class WebsomPageScript" + this.name + " {fixed map run(Websom.View view, Websom.Server server, Websom.Request request) {" + output["server carbon"] + "}}");
					require("fs").writeFileSync(this.server.config.root + "/pages/scripts_" + this.name + ".js", script + "module.exports = WebsomPageScript" + this.name + ".run;");
					
					var phpScript = this.buildScript("php.source.memory", "WebsomPageScript" + this.name, "class WebsomPageScript" + this.name + " {fixed map run(Websom.View view, Websom.Server server, Websom.Request request) {" + output["server carbon"] + "}}");
					require("fs").writeFileSync(this.server.config.root + "/pages/scripts_" + this.name + ".php", phpScript + "<?php return function ($view, $server, $request) {return WebsomPageScript" + this.name + "::run($view, $server, $request);} ?>");
				
				}
			}
	}
}

Websom.View.prototype.runServerScript = function () {
	if (arguments.length == 1 && ((arguments[0] instanceof Websom.Request) || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var req = arguments[0];
		if (this.jsScript.length > 0) {
			
				return this.jsScript(this, this.server, req);
			
			}else if (this.hasServerScript) {
			
				return require(this.server.config.root + "/pages/scripts_" + this.name + ".js")(this, this.server, req);
			
			
			}
		
	}
}

Websom.View.prototype.buildDev = function () {
	if (arguments.length == 0) {
		var opts = "props: ['data'], ";
		if (this.client.length > 0) {
			opts = this.client + ", ";
			}
		return "if (!('" + this.name + "' in Websom.views.loaded)) {Websom.views.loaded['" + this.name + "'] = Vue.component('" + this.name + "', {" + opts + "template: `" + this.template.replace(new RegExp("`".replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&'), 'g'), "\\`") + "`});}";
	}
}

Websom.View.prototype.buildScript = function () {
	if (arguments.length == 3 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'string' || typeof arguments[1] == 'undefined' || arguments[1] === null) && (typeof arguments[2] == 'string' || typeof arguments[2] == 'undefined' || arguments[2] === null)) {
		var platform = arguments[0];
		var name = arguments[1];
		var raw = arguments[2];
return require('../../core/util/native/carbonite.js').buildScript(arguments[0], arguments[1], arguments[2])
	}
}

Websom.View.prototype.buildRenderView = function () {
	if (arguments.length == 0) {
		if (this.shallow) {
			this.renderView = new Websom.Render.View(this);
			this.renderView.deserialize(this.renderViewData);
			}else{
				this.renderView = new Websom.Render.View(this);
				this.renderView.parse();
			}
	}
}

Websom.View.prototype.serialize = function () {
	if (arguments.length == 0) {
		var mp = {};
		if (this.renderView == null) {
			this.buildRenderView();
			}
		mp["render"] = this.renderView.serialize();
		mp["meta"] = this.meta;
		return mp;
	}
}

Websom.View.prototype.deserialize = function () {
	if (arguments.length == 1 && (typeof arguments[0] == 'object' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var data = arguments[0];
		this.meta = data["meta"];
		this.name = this.meta["name"];
		if ("handles" in this.meta) {
			this.handles = this.meta["handles"];
			}
		if ("greedy" in this.meta) {
			this.greedy = this.meta["greedy"];
			}
		this.renderViewData = data["render"];
	}
}

Websom.Render.Context = function () {
	this.data = null;

	this.props = null;

	this.slotContext = null;

	this.slot = null;

	if (arguments.length == 0) {
		this.data = {};
		this.props = {};
	}

}

Websom.Render.Context.prototype.find = function () {
	if (arguments.length == 1 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var key = arguments[0];
		var splits = key.split(".");
		var root = null;
		if (splits[0] in this.data) {
			root = this.data[splits[0]];
			}else if (splits[0] in this.props) {
			root = this.props[splits[0]];
			}
		if (root == null) {
			return "Unkown variable " + key;
			}
		if (splits.length == 1) {
			return root;
			}else{
				splits.shift();
				return this.findRooted(root, splits);
			}
	}
}

Websom.Render.Context.prototype.findRooted = function () {
	if (arguments.length == 2 && (typeof arguments[0] == 'object' || typeof arguments[0] == 'undefined' || arguments[0] === null) && (arguments[1]instanceof Array || typeof arguments[1] == 'undefined' || arguments[1] === null)) {
		var base = arguments[0];
		var splits = arguments[1];
		if (splits.length == 1) {
			return base[splits[0]];
			}else{
				splits.shift();
				return this.findRooted(base, splits);
			}
	}
}

Websom.Render.Element = function () {
	this.name = "";

	this.attributes = null;

	this.children = null;

	this.isText = false;

	if (arguments.length == 2 && ((arguments[0] instanceof Websom.Server) || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'string' || typeof arguments[1] == 'undefined' || arguments[1] === null)) {
		var server = arguments[0];
		var name = arguments[1];
		this.name = name;
		this.children = [];
		this.attributes = {};
	}

}

Websom.Render.Element.prototype.render = function () {
	if (arguments.length == 1 && ((arguments[0] instanceof Websom.Render.Context) || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var ctx = arguments[0];
		if (this.name == "slot") {
			var children = "";
			if (ctx.slot != null) {
				for (var i = 0; i < ctx.slot.length; i++) {
					children += ctx.slot[i].render(ctx.slotContext);
					}
				}
			return children;
			}
		var children = "";
		for (var i = 0; i < this.children.length; i++) {
			children += this.children[i].render(ctx);
			}
		var attrs = "";
		for (var key in this.attributes) {
			if (key[0] == ":") {
				attrs += " " + key + "=\"" + ctx.find(this.attributes[key]) + "\"";
				}else{
					attrs += " " + key + "=\"" + this.attributes[key] + "\"";
				}
			}
		return "<" + this.name + attrs + ">" + children + "</" + this.name + ">";
	}
}

Websom.Render.Element.parse = function () {
	if (arguments.length == 2 && ((arguments[0] instanceof Websom.Server) || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'string' || typeof arguments[1] == 'undefined' || arguments[1] === null)) {
		var server = arguments[0];
		var html = arguments[1];
		
			let content = require("cheerio").load(html);
			return this.makeFromObj(server, content.root()[0].children[0].children[1].children[0]);
		
		
	}
}

Websom.Render.Element.makeFromObj = function (server, arg) {
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

Websom.Render.Element.prototype.serialize = function () {
	if (arguments.length == 0) {
		return this.basicSerialize();
	}
}

Websom.Render.Element.prototype.deserializeChildren = function () {
	if (arguments.length == 2 && ((arguments[0] instanceof Websom.Server) || typeof arguments[0] == 'undefined' || arguments[0] === null) && (arguments[1]instanceof Array || typeof arguments[1] == 'undefined' || arguments[1] === null)) {
		var server = arguments[0];
		var children = arguments[1];
		this.children = [];
		for (var i = 0; i < children.length; i++) {
			var child = children[i];
			this.children.push(Websom.Render.Node.deserialize(server, child));
			}
	}
}

Websom.Render.Element.prototype.basicSerialize = function () {
	if (arguments.length == 0) {
		var mp = {};
		mp["t"] = "e";
		mp["n"] = this.name;
		var children = [];
		for (var i = 0; i < this.children.length; i++) {
			var child = this.children[i];
			children.push(child.serialize());
			}
		mp["c"] = children;
		mp["a"] = this.attributes;
		return mp;
	}
}

Websom.Render.Element.deserialize = function () {
	if (arguments.length == 2 && ((arguments[0] instanceof Websom.Server) || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'object' || typeof arguments[1] == 'undefined' || arguments[1] === null)) {
		var server = arguments[0];
		var data = arguments[1];
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
		return null;
	}
}

Websom.Render.Node = function () {
	this.isText = false;


}

Websom.Render.Node.prototype.render = function () {
	if (arguments.length == 1 && ((arguments[0] instanceof Websom.Render.Context) || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var ctx = arguments[0];

	}
}

Websom.Render.Node.deserialize = function () {
	if (arguments.length == 2 && ((arguments[0] instanceof Websom.Server) || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'object' || typeof arguments[1] == 'undefined' || arguments[1] === null)) {
		var server = arguments[0];
		var data = arguments[1];
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
		return null;
	}
}

Websom.Render.ViewRef = function () {
	this.view = null;

	this.name = "";

	this.attributes = null;

	this.children = null;

	this.isText = false;

	if (arguments.length == 2 && ((arguments[0] instanceof Websom.Server) || typeof arguments[0] == 'undefined' || arguments[0] === null) && ((arguments[1] instanceof Websom.Render.View) || typeof arguments[1] == 'undefined' || arguments[1] === null)) {
		var server = arguments[0];
		var view = arguments[1];
		this.view = view;
		this.children = [];
		this.attributes = {};
	}

}

Websom.Render.ViewRef.prototype.render = function () {
	if (arguments.length == 1 && ((arguments[0] instanceof Websom.Render.Context) || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var ctx = arguments[0];
		var newCtx = new Websom.Render.Context();
		newCtx.slot = this.children;
		newCtx.slotContext = ctx;
		for (var key in this.attributes) {
			if (key[0] == ":") {
				newCtx.props[key.substr(1,key.length - 1)] = ctx.find(this.attributes[key]);
				}else{
					newCtx.props[key] = ctx.find(this.attributes[key]);
				}
			}
		return this.view.render(newCtx);
	}
}

Websom.Render.ViewRef.prototype.serialize = function () {
	if (arguments.length == 0) {
		var mp = this.basicSerialize();
		mp["t"] = "r";
		return mp;
	}
else 	if (arguments.length == 0) {
		return this.basicSerialize();
	}
}

Websom.Render.ViewRef.parse = function () {
	if (arguments.length == 2 && ((arguments[0] instanceof Websom.Server) || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'string' || typeof arguments[1] == 'undefined' || arguments[1] === null)) {
		var server = arguments[0];
		var html = arguments[1];
		
			let content = require("cheerio").load(html);
			return this.makeFromObj(server, content.root()[0].children[0].children[1].children[0]);
		
		
	}
}

Websom.Render.ViewRef.makeFromObj = function (server, arg) {
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

Websom.Render.ViewRef.prototype.deserializeChildren = function () {
	if (arguments.length == 2 && ((arguments[0] instanceof Websom.Server) || typeof arguments[0] == 'undefined' || arguments[0] === null) && (arguments[1]instanceof Array || typeof arguments[1] == 'undefined' || arguments[1] === null)) {
		var server = arguments[0];
		var children = arguments[1];
		this.children = [];
		for (var i = 0; i < children.length; i++) {
			var child = children[i];
			this.children.push(Websom.Render.Node.deserialize(server, child));
			}
	}
}

Websom.Render.ViewRef.prototype.basicSerialize = function () {
	if (arguments.length == 0) {
		var mp = {};
		mp["t"] = "e";
		mp["n"] = this.name;
		var children = [];
		for (var i = 0; i < this.children.length; i++) {
			var child = this.children[i];
			children.push(child.serialize());
			}
		mp["c"] = children;
		mp["a"] = this.attributes;
		return mp;
	}
}

Websom.Render.ViewRef.deserialize = function () {
	if (arguments.length == 2 && ((arguments[0] instanceof Websom.Server) || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'object' || typeof arguments[1] == 'undefined' || arguments[1] === null)) {
		var server = arguments[0];
		var data = arguments[1];
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
		return null;
	}
}

Websom.Render.Text = function () {
	this.text = "";

	this.isText = false;

	if (arguments.length == 1 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var text = arguments[0];
		this.isText = true;
		this.text = text;
	}

}

Websom.Render.Text.prototype.render = function () {
	if (arguments.length == 1 && ((arguments[0] instanceof Websom.Render.Context) || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var ctx = arguments[0];
		var str = this.text;
		
		
			str = str.replace(new RegExp("{{([^}]*)}}", "gm"), function (match, name) {
				return ctx.find(name);
			});
		
		return str;
	}
}

Websom.Render.Text.prototype.serialize = function () {
	if (arguments.length == 0) {
		var mp = {};
		mp["t"] = "t";
		mp["c"] = this.text;
		return mp;
	}
}

Websom.Render.Text.deserialize = function () {
	if (arguments.length == 2 && ((arguments[0] instanceof Websom.Server) || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'object' || typeof arguments[1] == 'undefined' || arguments[1] === null)) {
		var server = arguments[0];
		var data = arguments[1];
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
		return null;
	}
}

Websom.Render.View = function () {
	this.view = null;

	this.root = null;

	if (arguments.length == 1 && ((arguments[0] instanceof Websom.View) || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var view = arguments[0];
		this.view = view;
	}

}

Websom.Render.View.prototype.parse = function () {
	if (arguments.length == 0) {
		this.root = Websom.Render.Element.parse(this.view.server, this.view.template);
	}
}

Websom.Render.View.prototype.render = function () {
	if (arguments.length == 1 && ((arguments[0] instanceof Websom.Render.Context) || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var ctx = arguments[0];
		return this.root.render(ctx);
	}
}

Websom.Render.View.prototype.serialize = function () {
	if (arguments.length == 0) {
		return this.root.serialize();
	}
}

Websom.Render.View.prototype.deserialize = function () {
	if (arguments.length == 1 && (typeof arguments[0] == 'object' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var data = arguments[0];
		this.root = new Websom.Render.Element(this.view.server, data["n"]);
		this.root.deserialize(this.view.server, data);
	}
}

Websom.Controls.AddTo = function () {
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
		this.collection = collection;
		this.item = item;
		this.listFieldName = listFieldName;
		this.check = check;
		this.fieldName = fieldName;
	}
else 	if (arguments.length == 4 && ((arguments[0] instanceof Websom.Containers.Table) || typeof arguments[0] == 'undefined' || arguments[0] === null) && ((arguments[1] instanceof Websom.Containers.Table) || typeof arguments[1] == 'undefined' || arguments[1] === null) && (typeof arguments[2] == 'string' || typeof arguments[2] == 'undefined' || arguments[2] === null) && (typeof arguments[3] == 'string' || typeof arguments[3] == 'undefined' || arguments[3] === null)) {
		var collection = arguments[0];
		var item = arguments[1];
		var listFieldName = arguments[2];
		var fieldName = arguments[3];
		this.collection = collection;
		this.item = item;
		this.listFieldName = listFieldName;
		this.fieldName = fieldName;
	}

}

Websom.Controls.AddTo.prototype.message = function () {
	if (arguments.length == 4 && ((arguments[0] instanceof Websom.Input) || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'string' || typeof arguments[1] == 'undefined' || arguments[1] === null) && (typeof arguments[2] == 'object' || typeof arguments[2] == 'undefined' || arguments[2] === null) && (typeof arguments[3] == 'function' || typeof arguments[3] == 'undefined' || arguments[3] === null)) {
		var inp = arguments[0];
		var name = arguments[1];
		var data = arguments[2];
		var send = arguments[3];
		send(null);
	}
}

Websom.Controls.AddTo.prototype.addTo = function (collection, item) {
		var that = this;
		var list = collection.getFieldContainer(this.listFieldName);
		var itemId = item.getField("id");
		var select = list.from().where("parentId").equals(collection.getField("id")).and().where(this.fieldName).equals(itemId);
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

Websom.Controls.AddTo.prototype.use = function () {
	if (arguments.length == 1 && ((arguments[0] instanceof Websom.InputChain) || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var ic = arguments[0];
		var that = this;
		ic.key("collection").is(this.collection).key("item").is(this.item).success(function (input, data) {
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
			});
	}
}

Websom.Controls.AddTo.prototype.validate = function () {
	if (arguments.length == 2 && ((arguments[0] instanceof Websom.Input) || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'function' || typeof arguments[1] == 'undefined' || arguments[1] === null)) {
		var input = arguments[0];
		var done = arguments[1];
		done(null);
	}
}

Websom.Controls.AddTo.prototype.fill = function () {
	if (arguments.length == 3 && ((arguments[0] instanceof Websom.Input) || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'object' || typeof arguments[1] == 'undefined' || arguments[1] === null) && (typeof arguments[2] == 'function' || typeof arguments[2] == 'undefined' || arguments[2] === null)) {
		var input = arguments[0];
		var values = arguments[1];
		var done = arguments[2];
		done();
	}
}

Websom.Controls.AddTo.prototype.filter = function () {
	if (arguments.length == 3 && ((arguments[0] instanceof Websom.Input) || typeof arguments[0] == 'undefined' || arguments[0] === null) && ((arguments[1] instanceof Websom.DatabaseSelect || (arguments[1] instanceof Websom.MySqlDatabaseSelect)) || typeof arguments[1] == 'undefined' || arguments[1] === null) && (typeof arguments[2] == 'function' || typeof arguments[2] == 'undefined' || arguments[2] === null)) {
		var input = arguments[0];
		var select = arguments[1];
		var done = arguments[2];
		done(null);
	}
}

Websom.Controls.AddTo.prototype.insert = function () {
	if (arguments.length == 3 && ((arguments[0] instanceof Websom.Input) || typeof arguments[0] == 'undefined' || arguments[0] === null) && ((arguments[1] instanceof Websom.Data) || typeof arguments[1] == 'undefined' || arguments[1] === null) && ((arguments[2]instanceof Array || typeof arguments[2] == 'boolean' || typeof arguments[2] == 'number' || typeof arguments[2] == 'number' || typeof arguments[2] == 'object' || typeof arguments[2] == 'string') || typeof arguments[2] == 'undefined' || arguments[2] === null)) {
		var input = arguments[0];
		var data = arguments[1];
		var key = arguments[2];

	}
}

Websom.Controls.AddTo.prototype.update = function () {
	if (arguments.length == 2 && ((arguments[0] instanceof Websom.Input) || typeof arguments[0] == 'undefined' || arguments[0] === null) && ((arguments[1] instanceof Websom.Data) || typeof arguments[1] == 'undefined' || arguments[1] === null)) {
		var input = arguments[0];
		var data = arguments[1];

	}
}

Websom.Controls.File = function () {
	this.keyName = "";

	this.maxSize = 0;

	this.validateHook = null;

	this.successHook = null;

	this.server = null;

	this.container = null;

	if (arguments.length == 4 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'number' || typeof arguments[1] == 'undefined' || arguments[1] === null) && (typeof arguments[2] == 'function' || typeof arguments[2] == 'undefined' || arguments[2] === null) && (typeof arguments[3] == 'function' || typeof arguments[3] == 'undefined' || arguments[3] === null)) {
		var keyName = arguments[0];
		var maxSize = arguments[1];
		var validate = arguments[2];
		var success = arguments[3];
		this.keyName = keyName;
		this.maxSize = maxSize;
		this.validateHook = validate;
		this.successHook = success;
	}

}

Websom.Controls.File.prototype.validate = function () {
	if (arguments.length == 2 && ((arguments[0] instanceof Websom.Input) || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'function' || typeof arguments[1] == 'undefined' || arguments[1] === null)) {
		var input = arguments[0];
		var done = arguments[1];
		if ((this.keyName in input.files)) {
			for (var i = 0; i < input.files[this.keyName].length; i++) {
				var file = input.files[this.keyName];
				if (file.size > this.maxSize) {
					done(new Websom.InputValidation(true, "File exceeds limit of " + this.maxSize / 1024 + "kb"));
					return null;
					}
				}
			this.validateHook(input, input.files[this.keyName], function (validation) {
if (validation != null && validation.hadError) {
	done(validation);
	}else{
		done(new Websom.InputValidation(false, ""));
	}
});
			}else{
				done(new Websom.InputValidation(true, "No file for field " + this.keyName));
			}
	}
}

Websom.Controls.File.prototype.fill = function () {
	if (arguments.length == 3 && ((arguments[0] instanceof Websom.Input) || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'object' || typeof arguments[1] == 'undefined' || arguments[1] === null) && (typeof arguments[2] == 'function' || typeof arguments[2] == 'undefined' || arguments[2] === null)) {
		var input = arguments[0];
		var raw = arguments[1];
		var done = arguments[2];
		done();
	}
}

Websom.Controls.File.prototype.insert = function (input, data, key) {
		this.successHook(true, input, data, input.files[this.keyName]);}

Websom.Controls.File.prototype.update = function (input, data) {
		this.successHook(false, input, data, input.files[this.keyName]);}

Websom.Controls.File.prototype.filter = function () {
	if (arguments.length == 3 && ((arguments[0] instanceof Websom.Input) || typeof arguments[0] == 'undefined' || arguments[0] === null) && ((arguments[1] instanceof Websom.DatabaseSelect || (arguments[1] instanceof Websom.MySqlDatabaseSelect)) || typeof arguments[1] == 'undefined' || arguments[1] === null) && (typeof arguments[2] == 'function' || typeof arguments[2] == 'undefined' || arguments[2] === null)) {
		var input = arguments[0];
		var select = arguments[1];
		var done = arguments[2];
		done(new Websom.InputValidation(false, ""));
	}
}

Websom.Controls.File.prototype.message = function () {
	if (arguments.length == 4 && ((arguments[0] instanceof Websom.Input) || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'string' || typeof arguments[1] == 'undefined' || arguments[1] === null) && (typeof arguments[2] == 'object' || typeof arguments[2] == 'undefined' || arguments[2] === null) && (typeof arguments[3] == 'function' || typeof arguments[3] == 'undefined' || arguments[3] === null)) {
		var input = arguments[0];
		var name = arguments[1];
		var data = arguments[2];
		var send = arguments[3];
		send(null);
	}
}

Websom.Controls.File.prototype.use = function () {
	if (arguments.length == 1 && ((arguments[0] instanceof Websom.InputChain) || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var inputChain = arguments[0];

	}
}

Websom.Controls.Unique = function () {
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

Websom.Controls.Unique.prototype.validateField = function () {
	if (arguments.length == 3 && ((arguments[0] instanceof Websom.Input) || typeof arguments[0] == 'undefined' || arguments[0] === null) && ((arguments[1]instanceof Array || typeof arguments[1] == 'boolean' || typeof arguments[1] == 'number' || typeof arguments[1] == 'number' || typeof arguments[1] == 'object' || typeof arguments[1] == 'string') || typeof arguments[1] == 'undefined' || arguments[1] === null) && (typeof arguments[2] == 'function' || typeof arguments[2] == 'undefined' || arguments[2] === null)) {
		var input = arguments[0];
		var value = arguments[1];
		var done = arguments[2];
		var that = this;
		var container = this.container;
		container.from().where(this.field).equals(value).run(function (err, docs) {
			if (err != null) {
				done(new Websom.InputValidation(true, "Unable to complete request"));
				}else{
					if (docs.length > 0) {
						done(new Websom.InputValidation(true, "The " + that.field + " must be unique"));
						}else{
							done(null);
						}
				}
			});
	}
}

Websom.Controls.Unique.prototype.validate = function () {
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

Websom.Controls.Unique.prototype.fill = function () {
	if (arguments.length == 3 && ((arguments[0] instanceof Websom.Input) || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'object' || typeof arguments[1] == 'undefined' || arguments[1] === null) && (typeof arguments[2] == 'function' || typeof arguments[2] == 'undefined' || arguments[2] === null)) {
		var input = arguments[0];
		var values = arguments[1];
		var done = arguments[2];
		this.fillField(input.raw[this.name], values);
		done();
	}
}

Websom.Controls.Unique.prototype.filter = function () {
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

Websom.Controls.Unique.prototype.fillField = function () {
	if (arguments.length == 2 && ((arguments[0]instanceof Array || typeof arguments[0] == 'boolean' || typeof arguments[0] == 'number' || typeof arguments[0] == 'number' || typeof arguments[0] == 'object' || typeof arguments[0] == 'string') || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'object' || typeof arguments[1] == 'undefined' || arguments[1] === null)) {
		var value = arguments[0];
		var values = arguments[1];

	}
}

Websom.Controls.Unique.prototype.filterField = function () {
	if (arguments.length == 3 && ((arguments[0]instanceof Array || typeof arguments[0] == 'boolean' || typeof arguments[0] == 'number' || typeof arguments[0] == 'number' || typeof arguments[0] == 'object' || typeof arguments[0] == 'string') || typeof arguments[0] == 'undefined' || arguments[0] === null) && ((arguments[1] instanceof Websom.DatabaseSelect || (arguments[1] instanceof Websom.MySqlDatabaseSelect)) || typeof arguments[1] == 'undefined' || arguments[1] === null) && (typeof arguments[2] == 'function' || typeof arguments[2] == 'undefined' || arguments[2] === null)) {
		var value = arguments[0];
		var select = arguments[1];
		var done = arguments[2];

	}
}

Websom.Controls.Unique.prototype.insert = function () {
	if (arguments.length == 3 && ((arguments[0] instanceof Websom.Input) || typeof arguments[0] == 'undefined' || arguments[0] === null) && ((arguments[1] instanceof Websom.Data) || typeof arguments[1] == 'undefined' || arguments[1] === null) && ((arguments[2]instanceof Array || typeof arguments[2] == 'boolean' || typeof arguments[2] == 'number' || typeof arguments[2] == 'number' || typeof arguments[2] == 'object' || typeof arguments[2] == 'string') || typeof arguments[2] == 'undefined' || arguments[2] === null)) {
		var input = arguments[0];
		var data = arguments[1];
		var key = arguments[2];

	}
}

Websom.Controls.Unique.prototype.update = function () {
	if (arguments.length == 2 && ((arguments[0] instanceof Websom.Input) || typeof arguments[0] == 'undefined' || arguments[0] === null) && ((arguments[1] instanceof Websom.Data) || typeof arguments[1] == 'undefined' || arguments[1] === null)) {
		var input = arguments[0];
		var data = arguments[1];

	}
}

Websom.Controls.Unique.prototype.message = function () {
	if (arguments.length == 4 && ((arguments[0] instanceof Websom.Input) || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'string' || typeof arguments[1] == 'undefined' || arguments[1] === null) && (typeof arguments[2] == 'object' || typeof arguments[2] == 'undefined' || arguments[2] === null) && (typeof arguments[3] == 'function' || typeof arguments[3] == 'undefined' || arguments[3] === null)) {
		var input = arguments[0];
		var name = arguments[1];
		var data = arguments[2];
		var send = arguments[3];
		send(null);
	}
}

Websom.Controls.Unique.prototype.use = function () {
	if (arguments.length == 1 && ((arguments[0] instanceof Websom.InputChain) || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var inputChain = arguments[0];

	}
}

Websom.Ini = function () {


}

Websom.Json = function () {


}

Websom.Json.parse = function () {
	if (arguments.length == 1 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var input = arguments[0];
		
		
			return JSON.parse(input);
		
	}
}

Websom.Json.encode = function () {
	if (arguments.length == 1 && ((arguments[0]instanceof Array || typeof arguments[0] == 'boolean' || typeof arguments[0] == 'number' || typeof arguments[0] == 'number' || typeof arguments[0] == 'object' || typeof arguments[0] == 'string') || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var input = arguments[0];
		
		
			return JSON.stringify(input);
		
	}
}

Websom.OAuth = function () {


}

Websom.OAuth.Response = function (errorMessage, data) {
	this.failed = false;

	this.errorMessage = "";

	this.data = null;

		this.data = data;
		if (this.errorMessage != null || errorMessage.length != 0) {
			this.failed = true;
			}
		this.errorMessage = errorMessage;
}

Websom.OAuth.Client = function () {
	this.clientId = "";

	this.pass = "";

	this.token = "";

	this.tokenUrl = "";

	this.expiration = -1;

	this.grantType = "client_credentials";

	this.stored = false;

	this.storeExpired = true;

	if (arguments.length == 3 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'string' || typeof arguments[1] == 'undefined' || arguments[1] === null) && (typeof arguments[2] == 'string' || typeof arguments[2] == 'undefined' || arguments[2] === null)) {
		var tokenUrl = arguments[0];
		var clientId = arguments[1];
		var pass = arguments[2];
		this.clientId = clientId;
		this.tokenUrl = tokenUrl;
		this.pass = pass;
	}

}

Websom.OAuth.Client.prototype.store = function () {
	if (arguments.length == 1 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var filename = arguments[0];
		this.stored = true;
		if (Oxygen.FileSystem.exists(filename)) {
			var raw = Websom.Json.parse(Oxygen.FileSystem.readSync(filename, "utf8"));
			var cast = raw["expires"];
			if (Websom.Time.now() > cast) {
				this.storeExpired = true;
				}else{
					this.storeExpired = false;
					this.token = raw["token"];
				}
			}
	}
}

Websom.OAuth.Client.prototype.post = function () {
	if (arguments.length == 3 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'object' || typeof arguments[1] == 'undefined' || arguments[1] === null) && (typeof arguments[2] == 'function' || typeof arguments[2] == 'undefined' || arguments[2] === null)) {
		var url = arguments[0];
		var data = arguments[1];
		var callback = arguments[2];
		
	}
}

Websom.Path = function () {


}

Websom.Path.relativePath = function () {
	if (arguments.length == 2 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'string' || typeof arguments[1] == 'undefined' || arguments[1] === null)) {
		var from = arguments[0];
		var to = arguments[1];
		
		
			return require("path").relative(from, to);
		
	}
}

Websom.PHP = function () {


}

Websom.PHP.load = function () {
	if (arguments.length == 0) {
		
	}
}

Websom.Http = function () {


}

Websom.Http.postJson = function () {
	if (arguments.length == 4 && ((arguments[0] instanceof Websom.Server) || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'string' || typeof arguments[1] == 'undefined' || arguments[1] === null) && (typeof arguments[2] == 'object' || typeof arguments[2] == 'undefined' || arguments[2] === null) && (typeof arguments[3] == 'function' || typeof arguments[3] == 'undefined' || arguments[3] === null)) {
		var server = arguments[0];
		var url = arguments[1];
		var data = arguments[2];
		var callback = arguments[3];
		
			const request = require('request');                         

			request.post(url, data, (err, res) => {
				if (err)
					console.log(err);
				else
					callback(res.body);
			});
		
		
	}
}

Websom.Http.get = function () {
	if (arguments.length == 3 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'object' || typeof arguments[1] == 'undefined' || arguments[1] === null) && (typeof arguments[2] == 'function' || typeof arguments[2] == 'undefined' || arguments[2] === null)) {
		var url = arguments[0];
		var data = arguments[1];
		var callback = arguments[2];

	}
}

Websom.Result = function () {
	this.error = "";

	this.hadError = false;

	this.status = 200;

	this.data = null;

	if (arguments.length == 2 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null) && ((arguments[1]instanceof Array || typeof arguments[1] == 'boolean' || typeof arguments[1] == 'number' || typeof arguments[1] == 'number' || typeof arguments[1] == 'object' || typeof arguments[1] == 'string') || typeof arguments[1] == 'undefined' || arguments[1] === null)) {
		var error = arguments[0];
		var data = arguments[1];
		this.error = error;
		if (error != null && error.length > 0) {
			this.hadError = true;
			}
		this.data = data;
	}

}

Websom.RequestChain = function () {
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

	if (arguments.length == 2 && ((arguments[0] instanceof Websom.Server) || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'string' || typeof arguments[1] == 'undefined' || arguments[1] === null)) {
		var server = arguments[0];
		var url = arguments[1];
		this.server = server;
		this.url = url;
	}

}

Websom.RequestChain.prototype.auth = function () {
	if (arguments.length == 2 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'string' || typeof arguments[1] == 'undefined' || arguments[1] === null)) {
		var user = arguments[0];
		var pass = arguments[1];
		this.doAuth = true;
		this.user = user;
		this.pass = pass;
		return this;
	}
else 	if (arguments.length == 1 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var bearer = arguments[0];
		this.doAuth = true;
		this.bearer = bearer;
		return this;
	}
}

Websom.RequestChain.prototype.parseJson = function () {
	if (arguments.length == 0) {
		this.doParse = true;
		return this;
	}
}

Websom.RequestChain.prototype.json = function () {
	if (arguments.length == 1 && (typeof arguments[0] == 'object' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var data = arguments[0];
		this.jsonencode = true;
		this.data = data;
	}
}

Websom.RequestChain.prototype.form = function () {
	if (arguments.length == 1 && (typeof arguments[0] == 'object' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var data = arguments[0];
		this.urlencode = true;
		this.data = data;
		return this;
	}
else 	if (arguments.length == 2 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null) && ((arguments[1]instanceof Array || typeof arguments[1] == 'boolean' || typeof arguments[1] == 'number' || typeof arguments[1] == 'number' || typeof arguments[1] == 'object' || typeof arguments[1] == 'string') || typeof arguments[1] == 'undefined' || arguments[1] === null)) {
		var key = arguments[0];
		var value = arguments[1];
		this.urlencode = true;
		this.data[key] = value;
		return this;
	}
}

Websom.RequestChain.prototype.header = function () {
	if (arguments.length == 2 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null) && ((arguments[1]instanceof Array || typeof arguments[1] == 'boolean' || typeof arguments[1] == 'number' || typeof arguments[1] == 'number' || typeof arguments[1] == 'object' || typeof arguments[1] == 'string') || typeof arguments[1] == 'undefined' || arguments[1] === null)) {
		var key = arguments[0];
		var value = arguments[1];
		this._headers[key] = value;
		return this;
	}
}

Websom.RequestChain.prototype.headers = function () {
	if (arguments.length == 1 && (typeof arguments[0] == 'object' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var headers = arguments[0];
		this._headers = headers;
		return this;
	}
}

Websom.RequestChain.prototype.makeRequest = function () {
	if (arguments.length == 2 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'function' || typeof arguments[1] == 'undefined' || arguments[1] === null)) {
		var method = arguments[0];
		var callback = arguments[1];
		
		
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
}

Websom.RequestChain.prototype.delete = function () {
	if (arguments.length == 1 && (typeof arguments[0] == 'function' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var callback = arguments[0];
		this.makeRequest("DELETE", callback);
		return this;
	}
}

Websom.RequestChain.prototype.put = function () {
	if (arguments.length == 1 && (typeof arguments[0] == 'function' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var callback = arguments[0];
		this.makeRequest("PUT", callback);
		return this;
	}
}

Websom.RequestChain.prototype.get = function () {
	if (arguments.length == 1 && (typeof arguments[0] == 'function' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var callback = arguments[0];
		this.makeRequest("GET", callback);
		return this;
	}
}

Websom.RequestChain.prototype.post = function () {
	if (arguments.length == 1 && (typeof arguments[0] == 'function' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var callback = arguments[0];
		this.makeRequest("POST", callback);
		return this;
	}
}

Websom.Time = function () {


}

Websom.Time.now = function () {
	if (arguments.length == 0) {
		
		
			return Date.now();
		
	}
}

Websom.Time.year = function () {
	if (arguments.length == 0) {
		
		
			return (new Date()).getFullYear();
		
	}
}

Websom.Standard = function () {


}

Websom.StandardModule = function () {
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

Websom.StandardModule.prototype.clientData = function () {
	if (arguments.length == 2 && ((arguments[0] instanceof Websom.Request) || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'function' || typeof arguments[1] == 'undefined' || arguments[1] === null)) {
		var req = arguments[0];
		var send = arguments[1];
		return false;
	}
}

Websom.StandardModule.prototype.spawn = function () {
	if (arguments.length == 1 && (typeof arguments[0] == 'object' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var config = arguments[0];
		this.baseConfig = config;
		this.name = config["name"];
		this.id = config["id"];
	}
}

Websom.StandardModule.prototype.start = function () {
	if (arguments.length == 0) {

	}
}

Websom.StandardModule.prototype.stop = function () {
	if (arguments.length == 0) {

	}
}

Websom.StandardModule.prototype.setupData = function () {
	if (arguments.length == 0) {

	}
}

Websom.StandardModule.prototype.setupBridge = function () {
	if (arguments.length == 0) {

	}
}

Websom.StandardData = function () {
	this.websomFieldInfo = null;

	this.websomParentData = null;

	this.websomContainer = null;

	this.websomServer = null;

	if (arguments.length == 1 && ((arguments[0] instanceof Websom.Server) || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var server = arguments[0];
		this.websomServer = server;
	}

}

Websom.StandardData.prototype.callLoadFromMap = function () {
	if (arguments.length == 2 && (typeof arguments[0] == 'object' || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'function' || typeof arguments[1] == 'undefined' || arguments[1] === null)) {
		var raw = arguments[0];
		var callback = arguments[1];
		
			return this.loadFromMap(raw, callback);
		
		
	}
}

Websom.StandardData.prototype.setField = function (name, value) {
		
			this[name] = value;
		
		}

Websom.StandardData.getDataInfo = function () {
	if (arguments.length == 0) {
		
			return this.getInfo();
		
		
	}
}

Websom.StandardData.spawnFromId = function () {
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

Websom.StandardData.prototype.exposeToClient = function () {
	if (arguments.length == 0) {
		
			return this.exposeToClientBase();
		
		
	}
}

Websom.Databases.MySql = function () {
	this.connection = null;

	this.server = null;

	this.config = null;

	this.name = "";

	this.open = false;

	this.connecting = false;

	this.waits = [];

	if (arguments.length == 1 && ((arguments[0] instanceof Websom.Server) || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var server = arguments[0];
		this.server = server;
	}

}

Websom.Databases.MySql.prototype.connect = function () {
	if (arguments.length == 1 && (typeof arguments[0] == 'function' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var done = arguments[0];
		var host = this.config["host"];
		var database = this.config["database"];
		var username = this.config["auth"]["admin"]["username"];
		var password = this.config["auth"]["admin"]["password"];
		this.connecting = true;
		
		
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
}

Websom.Databases.MySql.prototype.close = function () {
	if (arguments.length == 0) {
		this.open = false;
		
		
			this.connection.end();
		
	}
}

Websom.Databases.MySql.prototype.from = function () {
	if (arguments.length == 1 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var table = arguments[0];
		return new Websom.MySqlDatabaseSelect(this, table);
	}
}

Websom.Databases.MySql.prototype.into = function () {
	if (arguments.length == 1 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var table = arguments[0];
		return new Websom.MySqlDatabaseInsert(this, table);
	}
}

Websom.Databases.MySql.prototype.flagField = function () {
	if (arguments.length == 2 && ((arguments[0] instanceof Websom.DatabaseField) || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'boolean' || typeof arguments[1] == 'undefined' || arguments[1] === null)) {
		var field = arguments[0];
		var isAlter = arguments[1];
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
		return sql + last;
	}
}

Websom.Databases.MySql.prototype.wFieldToMySql = function () {
	if (arguments.length == 2 && ((arguments[0] instanceof Websom.DatabaseField) || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'boolean' || typeof arguments[1] == 'undefined' || arguments[1] === null)) {
		var field = arguments[0];
		var isAlter = arguments[1];
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
		return type + this.flagField(field, isAlter);
	}
}

Websom.Databases.MySql.prototype.runStructure = function () {
	if (arguments.length == 2 && ((arguments[0] instanceof Websom.DatabaseStructure) || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'function' || typeof arguments[1] == 'undefined' || arguments[1] === null)) {
		var str = arguments[0];
		var callback = arguments[1];
		if (this.open == false) {
			var that = this;
			if (this.connecting) {
				this.wait(function () {
					that.runStructure(str, callback);
					});
				}else{
					this.connect(function (status) {
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
}

Websom.Databases.MySql.make = function () {
	if (arguments.length == 2 && ((arguments[0] instanceof Websom.Server) || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'string' || typeof arguments[1] == 'undefined' || arguments[1] === null)) {
		var server = arguments[0];
		var type = arguments[1];
		if (type == "mysql") {
			return new Websom.Databases.MySql(server);
			}
	}
}

Websom.Databases.MySql.prototype.wait = function () {
	if (arguments.length == 1 && (typeof arguments[0] == 'function' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var func = arguments[0];
		this.waits.push(func);
	}
}

Websom.Databases.MySql.prototype.load = function () {
	if (arguments.length == 1 && (typeof arguments[0] == 'object' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var config = arguments[0];
		this.config = config;
		this.name = this.config["name"];
	}
}

Websom.Databases.MySql.prototype.connected = function () {
	if (arguments.length == 0) {
		for (var i = 0; i < this.waits.length; i++) {
			this.waits[i]();
			}
	}
}

Websom.Databases.MySql.prototype.structure = function () {
	if (arguments.length == 1 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var table = arguments[0];
		return new Websom.DatabaseStructure(this, table);
	}
}

Websom.MySqlDatabaseSelect = function () {
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

	if (arguments.length == 2 && ((arguments[0] instanceof Websom.Database || (arguments[0] instanceof Websom.Databases.MySql)) || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'string' || typeof arguments[1] == 'undefined' || arguments[1] === null)) {
		var database = arguments[0];
		var table = arguments[1];
		this.database = database;
		this.table = table;
	}

}

Websom.MySqlDatabaseSelect.prototype.field = function () {
	if (arguments.length == 1 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var fields = arguments[0];
		this.fields = fields;
		return this;
	}
}

Websom.MySqlDatabaseSelect.prototype.new = function () {
	if (arguments.length == 0) {
		var str = this.build();
		this.limitAmount = 0;
		this.limitOffset = 0;
		this.orderField = "";
		if (str.length > 0) {
			this.multiQuery.push(str);
			}
		this.query = [];
		return this;
	}
}

Websom.MySqlDatabaseSelect.prototype.where = function () {
	if (arguments.length == 1 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var field = arguments[0];
		if (this.currentWhere.length > 0) {
			this.query.push(this.currentWhere);
			}
		this.currentWhere = "";
		this.workingField = field;
		return this;
	}
}

Websom.MySqlDatabaseSelect.prototype.not = function () {
	if (arguments.length == 0) {
		this.notMode = true;
		return this;
	}
}

Websom.MySqlDatabaseSelect.prototype.getNot = function () {
	if (arguments.length == 0) {
		if (this.notMode) {
			return "NOT";
			this.notMode = false;
			}else{
				return "";
			}
	}
}

Websom.MySqlDatabaseSelect.prototype.in = function () {
	if (arguments.length == 1 && (arguments[0]instanceof Array || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var values = arguments[0];
		this.freshGroup = false;
		this.currentWhere += "`" + this.workingField + "` " + this.getNot() + " IN (";
		for (var i = 0; i < values.length; i++) {
			var value = values[i];
			this.currentWhere += "?";
			if (i != values.length - 1) {
				this.currentWhere += ", ";
				}
			this.values.push(value);
			}
		this.currentWhere += ")";
		return this;
	}
}

Websom.MySqlDatabaseSelect.prototype.order = function () {
	if (arguments.length == 2 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'string' || typeof arguments[1] == 'undefined' || arguments[1] === null)) {
		var field = arguments[0];
		var order = arguments[1];
		this.orderField = field;
		this.orderWay = order;
		return this;
	}
}

Websom.MySqlDatabaseSelect.prototype.build = function () {
	if (arguments.length == 0) {
		if (this.currentWhere.length > 0) {
			this.query.push(this.currentWhere);
			}
		this.currentWhere = "";
		var whereState = "";
		var limit = "";
		if (this.limitAmount != 0) {
			if (this.limitOffset != 0) {
				limit = " LIMIT " + this.limitOffset + ", " + this.limitAmount;
				}else{
					limit = " LIMIT " + this.limitAmount;
				}
			}
		var orderBy = "";
		if (this.orderField.length > 0) {
			orderBy = " ORDER BY " + this.orderField + " " + this.orderWay;
			}
		var search = this.trim(this.query.join(""));
		if (this.groupLevel > 0) {
			search += ")";
			}
		if (search.length > 0) {
			whereState = "WHERE " + search;
			}
		if (this.doUpdate) {
			var sets = [];
			var shiftValues = [];
			for (var i = 0; i < this.updates.length; i++) {
				var update = this.updates[i];
				shiftValues.push(update.value);
				sets.push("`" + update.field + "` = ?");
				}
			this.values = shiftValues.concat(this.values);
			return "UPDATE " + this.table + " SET " + sets.join(", ") + " " + whereState + orderBy + limit;
			}else if (this.doDelete) {
			return "DELETE FROM " + this.table + " " + whereState + orderBy + limit;
			}else{
				return "SELECT " + this.fields + " FROM " + this.table + " " + whereState + orderBy + limit;
			}
	}
}

Websom.MySqlDatabaseSelect.prototype.trim = function () {
	if (arguments.length == 1 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var query = arguments[0];
		
		
			return query.replace(/^(AND|OR|\s)*|(AND|OR|\s)*$/g, "");
		
	}
}

Websom.MySqlDatabaseSelect.prototype.run = function () {
	if (arguments.length == 1 && (typeof arguments[0] == 'function' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var callback = arguments[0];
		var query = "";
		if (this.database.open == false) {
			var that = this;
			if (this.database.connecting) {
				this.database.wait(function () {
					that.run(callback);
					});
				}else{
					this.database.connect(function (status) {
						that.run(callback);
						});
				}
			return this;
			}
		query = this.build();
		if (this.multiQuery.length > 0) {
			query = this.multiQuery.join(";") + ";" + query;
			}
		
		
			this.database.connection.query(query, this.values, (err, res, meta) => {
				if (err)
					console.log("Error in database " + this.database.name + " with query '" + query + "'\n" + err);

				callback(err, res);
			});
		
		return this;
	}
}

Websom.MySqlDatabaseSelect.prototype.or = function () {
	if (arguments.length == 0) {
		if (this.freshGroup == false) {
			if (this.currentWhere.length > 0) {
				this.currentWhere += " OR ";
				}
			}
		return this;
	}
}

Websom.MySqlDatabaseSelect.prototype.and = function () {
	if (arguments.length == 0) {
		if (this.freshGroup == false) {
			if (this.currentWhere.length > 0) {
				this.currentWhere += " AND ";
				}
			}
		return this;
	}
}

Websom.MySqlDatabaseSelect.prototype.group = function () {
	if (arguments.length == 0) {
		this.groupLevel++;
		this.freshGroup = true;
		this.currentWhere += "(";
		return this;
	}
}

Websom.MySqlDatabaseSelect.prototype.endGroup = function () {
	if (arguments.length == 0) {
		this.groupLevel--;
		if (this.freshGroup) {
			this.currentWhere += "TRUE";
			this.freshGroup = false;
			}
		if (this.currentWhere.length > 0) {
			this.currentWhere += ")";
			}
		return this;
	}
}

Websom.MySqlDatabaseSelect.prototype.equals = function () {
	if (arguments.length == 1 && ((arguments[0]instanceof Array || typeof arguments[0] == 'boolean' || typeof arguments[0] == 'number' || typeof arguments[0] == 'number' || typeof arguments[0] == 'object' || typeof arguments[0] == 'string') || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var value = arguments[0];
		var nt = "";
		this.freshGroup = false;
		if (this.notMode) {
			nt = "!";
			this.notMode = false;
			}
		this.currentWhere += "`" + this.workingField + "` " + nt + "= ?";
		this.values.push(value);
		return this;
	}
}

Websom.MySqlDatabaseSelect.prototype.like = function () {
	if (arguments.length == 1 && ((arguments[0]instanceof Array || typeof arguments[0] == 'boolean' || typeof arguments[0] == 'number' || typeof arguments[0] == 'number' || typeof arguments[0] == 'object' || typeof arguments[0] == 'string') || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var value = arguments[0];
		this.freshGroup = false;
		this.currentWhere += "`" + this.workingField + "` " + this.getNot() + " LIKE ?";
		this.values.push(value);
		return this;
	}
}

Websom.MySqlDatabaseSelect.prototype.wildLike = function () {
	if (arguments.length == 1 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var value = arguments[0];
		this.freshGroup = false;
		this.currentWhere += "`" + this.workingField + "` " + this.getNot() + " LIKE ?";
		this.values.push("%" + value.replace(new RegExp("%".replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&'), 'g'), "!%").replace(new RegExp("_".replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&'), 'g'), "!_").replace(new RegExp("\\[".replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&'), 'g'), "![") + "%");
		return this;
	}
}

Websom.MySqlDatabaseSelect.prototype.greater = function () {
	if (arguments.length == 1 && ((arguments[0]instanceof Array || typeof arguments[0] == 'boolean' || typeof arguments[0] == 'number' || typeof arguments[0] == 'number' || typeof arguments[0] == 'object' || typeof arguments[0] == 'string') || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var value = arguments[0];
		this.freshGroup = false;
		this.currentWhere += this.workingField + " > ?";
		this.values.push(value);
		return this;
	}
}

Websom.MySqlDatabaseSelect.prototype.lesser = function () {
	if (arguments.length == 1 && ((arguments[0]instanceof Array || typeof arguments[0] == 'boolean' || typeof arguments[0] == 'number' || typeof arguments[0] == 'number' || typeof arguments[0] == 'object' || typeof arguments[0] == 'string') || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var value = arguments[0];
		this.freshGroup = false;
		this.currentWhere += "`" + this.workingField + "` < ?";
		this.values.push(value);
		return this;
	}
}

Websom.MySqlDatabaseSelect.prototype.set = function () {
	if (arguments.length == 2 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null) && ((arguments[1]instanceof Array || typeof arguments[1] == 'boolean' || typeof arguments[1] == 'number' || typeof arguments[1] == 'number' || typeof arguments[1] == 'object' || typeof arguments[1] == 'string') || typeof arguments[1] == 'undefined' || arguments[1] === null)) {
		var field = arguments[0];
		var value = arguments[1];
		if ((typeof value == 'object' ? (Array.isArray(value) ? 'array' : 'map') : (typeof value == 'number' ? 'float' : typeof value)) == "boolean") {
			if (value == true) {
				value = 1;
				}else{
					value = 0;
				}
			}
		this.updates.push(new Websom.DatabaseUpdate(field, value));
		return this;
	}
}

Websom.MySqlDatabaseSelect.prototype.doesSet = function () {
	if (arguments.length == 1 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var field = arguments[0];
		for (var i = 0; i < this.updates.length; i++) {
			if (this.updates[i].field == field) {
				return true;
				}
			}
		return false;
	}
}

Websom.MySqlDatabaseSelect.prototype.limit = function () {
	if (arguments.length == 1 && (typeof arguments[0] == 'number' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var documents = arguments[0];
		this.limitAmount = documents;
		return this;
	}
else 	if (arguments.length == 2 && (typeof arguments[0] == 'number' || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'number' || typeof arguments[1] == 'undefined' || arguments[1] === null)) {
		var offset = arguments[0];
		var documents = arguments[1];
		this.limitAmount = documents;
		this.limitOffset = offset;
		return this;
	}
}

Websom.MySqlDatabaseSelect.prototype.update = function () {
	if (arguments.length == 0) {
		this.doUpdate = true;
		return this;
	}
}

Websom.MySqlDatabaseSelect.prototype.delete = function () {
	if (arguments.length == 0) {
		this.doDelete = true;
		return this;
	}
}

Websom.MySqlDatabaseInsert = function () {
	this.table = "";

	this.number = 1;

	this.isMulti = false;

	this.values = [];

	this.multiKeys = {};

	this.inserts = [];

	this.multiInserts = [];

	this.database = null;

	if (arguments.length == 2 && ((arguments[0] instanceof Websom.Database || (arguments[0] instanceof Websom.Databases.MySql)) || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'string' || typeof arguments[1] == 'undefined' || arguments[1] === null)) {
		var database = arguments[0];
		var table = arguments[1];
		this.database = database;
		this.table = table;
	}

}

Websom.MySqlDatabaseInsert.prototype.build = function () {
	if (arguments.length == 0) {
		var sets = [];
		var shiftValues = [];
		var value = "";
		var values = [];
		if (this.isMulti == false) {
			for (var i = 0; i < this.inserts.length; i++) {
				var insert = this.inserts[i];
				this.values.push(insert.value);
				sets.push("`" + insert.field + "`");
				value += "?";
				if (i != this.inserts.length - 1) {
					value += ", ";
					}
				}
			for (var i = 0;i < this.number;i++) {
				values.push("(" + value + ")");
				}
			}else{
				for (var field in this.multiKeys) {
					sets.push("`" + field + "`");
					}
				for (var mi = 0; mi < this.multiInserts.length; mi++) {
					var curValue = "";
					for (var i = 0; i < this.multiInserts[mi].length; i++) {
						var insert = this.multiInserts[mi][i];
						this.values.push(insert.value);
						curValue += "?";
						if (i != this.multiInserts[mi].length - 1) {
							curValue += ", ";
							}
						}
					values.push("(" + curValue + ")");
					}
			}
		return "INSERT INTO " + this.table + " (" + sets.join(", ") + ") VALUES " + values.join(", ");
	}
}

Websom.MySqlDatabaseInsert.prototype.run = function () {
	if (arguments.length == 1 && (typeof arguments[0] == 'function' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var callback = arguments[0];
		var query = "";
		if (this.database.open == false) {
			var that = this;
			if (this.database.connecting) {
				this.database.wait(function () {
					that.run(callback);
					});
				}else{
					this.database.connect(function (status) {
						that.run(callback);
						});
				}
			return this;
			}
		query = this.build();
		
		
			this.database.connection.query(query, this.values, (err, res, meta) => {
				if (err)
					console.log("Error in database " + this.database.name + " with query '" + query + "'\n" + err);
				
				callback(err, res.insertId || 0);
			});
		
		return this;
	}
}

Websom.MySqlDatabaseInsert.prototype.new = function () {
	if (arguments.length == 0) {
		this.multiInserts.push([]);
		return this;
	}
}

Websom.MySqlDatabaseInsert.prototype.get = function () {
	if (arguments.length == 1 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var field = arguments[0];
		for (var i = 0; i < this.inserts.length; i++) {
			if (this.inserts[i].field == field) {
				return this.inserts[i].value;
				}
			}
		return null;
	}
}

Websom.MySqlDatabaseInsert.prototype.set = function () {
	if (arguments.length == 2 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null) && ((arguments[1]instanceof Array || typeof arguments[1] == 'boolean' || typeof arguments[1] == 'number' || typeof arguments[1] == 'number' || typeof arguments[1] == 'object' || typeof arguments[1] == 'string') || typeof arguments[1] == 'undefined' || arguments[1] === null)) {
		var field = arguments[0];
		var value = arguments[1];
		if ((typeof value == 'object' ? (Array.isArray(value) ? 'array' : 'map') : (typeof value == 'number' ? 'float' : typeof value)) == "boolean") {
			if (value == true) {
				value = 1;
				}else{
					value = 0;
				}
			}
		if (this.isMulti) {
			this.multiKeys[field] = true;
			this.multiInserts[this.multiInserts.length - 1].push(new Websom.DatabaseUpdate(field, value));
			}else{
				this.inserts.push(new Websom.DatabaseUpdate(field, value));
			}
		return this;
	}
}

Websom.MySqlDatabaseInsert.prototype.doesSet = function () {
	if (arguments.length == 1 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var field = arguments[0];
		for (var i = 0; i < this.inserts.length; i++) {
			if (this.inserts[i].field == field) {
				return true;
				}
			}
		return false;
	}
}

Websom.MySqlDatabaseInsert.prototype.amount = function () {
	if (arguments.length == 1 && (typeof arguments[0] == 'number' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var number = arguments[0];
		this.number = number;
		return this;
	}
}

Websom.MySqlDatabaseInsert.prototype.multi = function () {
	if (arguments.length == 0) {
		this.isMulti = true;
		return this;
	}
}

Oxygen.FileSystem = function () {


}

Oxygen.FileSystem.readSync = function () {
	if (arguments.length == 2 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'string' || typeof arguments[1] == 'undefined' || arguments[1] === null)) {
		var location = arguments[0];
		var format = arguments[1];
return require('fs').readFileSync(arguments[0], arguments[1])
	}
}

Oxygen.FileSystem.read = function () {
	if (arguments.length == 3 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'string' || typeof arguments[1] == 'undefined' || arguments[1] === null) && (typeof arguments[2] == 'function' || typeof arguments[2] == 'undefined' || arguments[2] === null)) {
		var location = arguments[0];
		var format = arguments[1];
		var callback = arguments[2];
require('fs').readFile(arguments[0], arguments[1], arguments[2])
	}
}

Oxygen.FileSystem.write = function (location, content, callback) {
require('fs').writeFile(arguments[0], arguments[1], arguments[2])}

Oxygen.FileSystem.writeSync = function (location, content) {
return require('fs').writeFileSync(arguments[0], arguments[1])}

Oxygen.FileSystem.statSync = function () {
	if (arguments.length == 1 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var location = arguments[0];
return Oxygen.FileSystem.Stat.fromMap(require('fs').statSync(arguments[0]))
	}
}

Oxygen.FileSystem.prototype.stat = function () {
	if (arguments.length == 2 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'function' || typeof arguments[1] == 'undefined' || arguments[1] === null)) {
		var location = arguments[0];
		var callback = arguments[1];

	}
}

Oxygen.FileSystem.prototype.openSync = function () {
	if (arguments.length == 2 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'string' || typeof arguments[1] == 'undefined' || arguments[1] === null)) {
		var location = arguments[0];
		var flags = arguments[1];

	}
}

Oxygen.FileSystem.prototype.open = function () {
	if (arguments.length == 3 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'string' || typeof arguments[1] == 'undefined' || arguments[1] === null) && (typeof arguments[2] == 'function' || typeof arguments[2] == 'undefined' || arguments[2] === null)) {
		var location = arguments[0];
		var flags = arguments[1];
		var callback = arguments[2];

	}
}

Oxygen.FileSystem.readDirSync = function () {
	if (arguments.length == 1 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var location = arguments[0];
return require('fs').readdirSync(arguments[0]);
	}
}

Oxygen.FileSystem.dirName = function () {
	if (arguments.length == 1 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var location = arguments[0];
return require('path').dirname(arguments[0]);
	}
}

Oxygen.FileSystem.normalize = function () {
	if (arguments.length == 1 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var path = arguments[0];
return require('path').normalize(arguments[0]);
	}
}

Oxygen.FileSystem.resolve = function () {
	if (arguments.length == 1 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var path = arguments[0];
return require('path').resolve(arguments[0]);
	}
}

Oxygen.FileSystem.isDir = function () {
	if (arguments.length == 1 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var location = arguments[0];
const _fs = require('fs'); return _fs.lstatSync(_fs.realpathSync(arguments[0])).isDirectory();
	}
}

Oxygen.FileSystem.exists = function () {
	if (arguments.length == 1 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var location = arguments[0];
return require('fs').existsSync(arguments[0])
	}
}

Oxygen.FileSystem.basename = function () {
	if (arguments.length == 1 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var location = arguments[0];
return require('path').basename(arguments[0])
	}
}

Oxygen.FileSystem.makeDir = function () {
	if (arguments.length == 1 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var location = arguments[0];
require('fs').mkdirSync(arguments[0])
	}
}

Oxygen.FileSystem.Stat = function () {
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

	if (arguments.length == 0) {

	}

}

Oxygen.FileSystem.Stat.fromMap = function () {
	if (arguments.length == 1 && (typeof arguments[0] == 'object' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var data = arguments[0];
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
		return stat;
	}
}

Websom.Micro.Command = function () {
	this.commands = [];

	this.server = null;

	if (arguments.length == 1 && ((arguments[0] instanceof Websom.Server) || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var server = arguments[0];
		this.server = server;
	}

}

Websom.Micro.Command.prototype.start = function () {
	if (arguments.length == 0) {
		var that = this;
		this.register("help").command("[command]").on(function (invo) {
			var name = invo.get("command");
			invo.output("----------- HELP -----------");
			invo.output("	- Commands:");
			if (name != null) {

				}else{
					for (var i = 0; i < that.commands.length; i++) {
						var cmd = that.commands[i];
						invo.output("		- <b>" + cmd.name + "</b>");
						for (var j = 0; j < cmd.patterns.length; j++) {
							var ptrn = cmd.patterns[j];
							invo.output("			- " + ptrn.pattern.replace(new RegExp("<([^>]*)>", 'g'), "<span style='color: lime'>&lt;$1&gt;</span>").replace(new RegExp("[".replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&'), 'g'), "<span style='color: #9fd0ff'>[").replace(new RegExp("]".replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&'), 'g'), "]</span>"));
							}
						}
				}
			invo.finish();
			});
		this.register("deploy").command("<name>").on(function (invo) {
			that.server.resource.deploy(invo.get("name"), function (msg) {
				invo.output(msg);
				}, function () {
				invo.output("<span style='color: lime;'>Complete</span>");
				invo.finish();
				});
			});
		this.register("theme").command("init <name> <author> [version=\"1.0\"]").flag("option").default("Value").cook().on(function (invo) {

			});
		this.register("test").command("<name>").on(function (invo) {
			invo.output("Starting command with name " + invo.get("name"));
			invo.output("Waiting 2 seconds");
			
					setTimeout(() => {
						invo.output("After");
						invo.finish();
					}, 2000);
				
			
			});
	}
}

Websom.Micro.Command.prototype.register = function () {
	if (arguments.length == 1 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var topName = arguments[0];
		var cmd = new Websom.Command(this.server, topName);
		this.commands.push(cmd);
		return cmd;
	}
}

Websom.Micro.Command.prototype.exec = function () {
	if (arguments.length == 2 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null) && ((arguments[1] instanceof Websom.Request) || typeof arguments[1] == 'undefined' || arguments[1] === null)) {
		var command = arguments[0];
		var req = arguments[1];
		var inv = new Websom.CommandInvocation(this.server, command);
		inv.request = req;
		inv.sender = "Console";
		inv.local = false;
		inv.parse();
		var found = inv.search(this.commands);
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
else 	if (arguments.length == 1 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var command = arguments[0];
		var inv = new Websom.CommandInvocation(this.server, command);
		inv.parse();
		var found = inv.search(this.commands);
		if (found != null) {
			found.cook();
			var output = found.run(inv);
			found.handler(inv);
			console.log(output);
			}
	}
}

Websom.Command = function () {
	this.server = null;

	this.name = "";

	this.patterns = [];

	if (arguments.length == 2 && ((arguments[0] instanceof Websom.Server) || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'string' || typeof arguments[1] == 'undefined' || arguments[1] === null)) {
		var server = arguments[0];
		var name = arguments[1];
		this.server = server;
		this.name = name;
	}

}

Websom.Command.prototype.command = function () {
	if (arguments.length == 1 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var pattern = arguments[0];
		var pat = new Websom.CommandPattern(this, pattern);
		this.patterns.push(pat);
		return pat;
	}
}

Websom.CommandFlag = function () {
	this.parent = null;

	this.name = "";

	this._type = "";

	this._default = null;

	if (arguments.length == 4 && ((arguments[0] instanceof Websom.CommandPattern) || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'string' || typeof arguments[1] == 'undefined' || arguments[1] === null) && (typeof arguments[2] == 'string' || typeof arguments[2] == 'undefined' || arguments[2] === null) && ((arguments[3]instanceof Array || typeof arguments[3] == 'boolean' || typeof arguments[3] == 'number' || typeof arguments[3] == 'number' || typeof arguments[3] == 'object' || typeof arguments[3] == 'string') || typeof arguments[3] == 'undefined' || arguments[3] === null)) {
		var parent = arguments[0];
		var name = arguments[1];
		var type = arguments[2];
		var defVal = arguments[3];
		this.parent = parent;
		this.name = name;
		this._type = type;
		this._default = defVal;
	}

}

Websom.CommandFlag.prototype.type = function () {
	if (arguments.length == 1 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var type = arguments[0];
		this._type = type;
		return this;
	}
}

Websom.CommandFlag.prototype.default = function () {
	if (arguments.length == 1 && ((arguments[0]instanceof Array || typeof arguments[0] == 'boolean' || typeof arguments[0] == 'number' || typeof arguments[0] == 'number' || typeof arguments[0] == 'object' || typeof arguments[0] == 'string') || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var val = arguments[0];
		this._default = val;
		return this;
	}
}

Websom.CommandFlag.prototype.flag = function () {
	if (arguments.length == 1 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var name = arguments[0];
		return this.parent.flag(name);
	}
}

Websom.CommandFlag.prototype.command = function () {
	if (arguments.length == 1 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var pattern = arguments[0];
		return this.parent.parent.command(pattern);
	}
}

Websom.CommandFlag.prototype.cook = function () {
	if (arguments.length == 0) {
		this.parent.cook();
		return this;
	}
}

Websom.CommandFlag.prototype.on = function () {
	if (arguments.length == 1 && (typeof arguments[0] == 'function' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var run = arguments[0];
		return this.parent.on(run);
	}
}

Websom.CommandPart = function () {
	this.type = 2;

	this.optional = false;

	this.default = null;

	this.name = "";

	if (arguments.length == 2 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'number' || typeof arguments[1] == 'undefined' || arguments[1] === null)) {
		var name = arguments[0];
		var type = arguments[1];
		this.name = name;
		this.type = type;
	}

}

Websom.CommandPattern = function () {
	this.cooked = false;

	this.parent = null;

	this.pattern = null;

	this.flags = [];

	this.handler = null;

	this.parts = [];

	if (arguments.length == 2 && ((arguments[0] instanceof Websom.Command) || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'string' || typeof arguments[1] == 'undefined' || arguments[1] === null)) {
		var parent = arguments[0];
		var pattern = arguments[1];
		this.parent = parent;
		this.pattern = pattern;
	}

}

Websom.CommandPattern.prototype.flag = function () {
	if (arguments.length == 1 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var name = arguments[0];
		var flag = new Websom.CommandFlag(this, name, "string", null);
		this.flags.push(flag);
		return flag;
	}
}

Websom.CommandPattern.prototype.command = function () {
	if (arguments.length == 1 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var pattern = arguments[0];
		return this.parent.command(pattern);
	}
}

Websom.CommandPattern.prototype.on = function () {
	if (arguments.length == 1 && (typeof arguments[0] == 'function' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var run = arguments[0];
		this.handler = run;
		return this;
	}
}

Websom.CommandPattern.prototype.run = function () {
	if (arguments.length == 1 && ((arguments[0] instanceof Websom.CommandInvocation) || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var invocation = arguments[0];
		for (var i = 0; i < this.parts.length; i++) {
			var part = this.parts[i];
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
		return null;
	}
}

Websom.CommandPattern.prototype.match = function () {
	if (arguments.length == 1 && ((arguments[0] instanceof Websom.CommandInvocation) || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var invocation = arguments[0];
		for (var i = 0; i < this.parts.length; i++) {
			var part = this.parts[i];
			if (invocation.arguments.length - 1 >= i) {
				var arg = invocation.arguments[i + 1];
				if (part.type == 1) {
					if (arg != part.name) {
						return false;
						}
					}
				}
			}
		return true;
	}
}

Websom.CommandPattern.prototype.buildParts = function () {
	if (arguments.length == 0) {
		var isOpen = false;
		var isEquals = false;
		var openPart = "";
		var closePart = "";
		var build = "";
		var equals = "";
		for (var i = 0;i < this.pattern.length;i++) {
			var char = this.pattern[i];
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
				}else if (isOpen == true && char == " " || closePart == char) {
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
				this.parts.push(part);
				openPart = "";
				closePart = "";
				isOpen = false;
				isEquals = false;
				build = "";
				equals = "";
				}
			}
	}
}

Websom.CommandPattern.prototype.cook = function () {
	if (arguments.length == 0) {
		if (this.cooked) {
			return this;
			}
		this.cooked = true;
		this.buildParts();
		return this;
	}
}

Websom.CommandInvocation = function () {
	this.local = true;

	this.request = null;

	this.sender = "Unknown";

	this.handler = null;

	this.pattern = null;

	this.server = null;

	this.flags = {};

	this.values = {};

	this.rawOutput = [];

	this.arguments = [];

	this.raw = "";

	if (arguments.length == 2 && ((arguments[0] instanceof Websom.Server) || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'string' || typeof arguments[1] == 'undefined' || arguments[1] === null)) {
		var server = arguments[0];
		var raw = arguments[1];
		this.server = server;
		this.raw = raw;
	}

}

Websom.CommandInvocation.prototype.get = function () {
	if (arguments.length == 1 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var name = arguments[0];
		if (name in this.values) {
			return this.values[name];
			}else{
				return null;
			}
	}
}

Websom.CommandInvocation.prototype.error = function () {
	if (arguments.length == 1 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var message = arguments[0];
		if (this.local) {
			this.handler(true, message);
			}else{
				this.request.send("{\"status\": \"error\", \"message\": " + Websom.Json.encode(message) + "}");
			}
	}
}

Websom.CommandInvocation.prototype.output = function () {
	if (arguments.length == 1 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var message = arguments[0];
		if (this.local) {
			this.handler(false, message);
			}else{
				this.rawOutput.push("{\"status\": \"chunk\", \"message\": " + Websom.Json.encode(message) + "}");
			}
	}
}

Websom.CommandInvocation.prototype.finish = function () {
	if (arguments.length == 0) {
		if (this.local == false) {
			this.request.send("[" + this.rawOutput.join(", ") + "]");
			}
	}
}

Websom.CommandInvocation.prototype.searchPatterns = function () {
	if (arguments.length == 1 && (arguments[0]instanceof Array || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var patterns = arguments[0];
		for (var i = 0; i < patterns.length; i++) {
			var pattern = patterns[i];
			if (pattern.match(this)) {
				return pattern;
				}
			}
		return null;
	}
}

Websom.CommandInvocation.prototype.search = function () {
	if (arguments.length == 1 && (arguments[0]instanceof Array || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var commands = arguments[0];
		for (var i = 0; i < commands.length; i++) {
			var command = commands[i];
			if (command.name == this.arguments[0]) {
				return this.searchPatterns(command.patterns);
				}
			}
		return null;
	}
}

Websom.CommandInvocation.prototype.parse = function () {
	if (arguments.length == 0) {
		var build = "";
		var builds = [];
		var isOpen = false;
		var openString = "";
		var escape = false;
		var flagName = "";
		for (var i = 0;i < this.raw.length;i++) {
			var char = this.raw[i];
			if (isOpen == false && char == " ") {
				if (build.length > 0) {
					if (openString == "" && build.length > 2 && build[0] == "-" && build[1] == "-") {
						flagName = build.substr(2,build.length - 1);
						}else if (flagName == "") {
						builds.push(build);
						}else{
							this.flags[flagName] = build;
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
				this.flags[flagName] = build;
				}else{
					builds.push(build);
				}
			}
		this.arguments = builds;
	}
}

Websom.Micro.Text = function () {
	this.loaded = false;

	this.data = null;

	this.textFile = "";

	this.server = null;

	if (arguments.length == 1 && ((arguments[0] instanceof Websom.Server) || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var server = arguments[0];
		this.server = server;
	}

}

Websom.Micro.Text.prototype.start = function () {
	if (arguments.length == 0) {
		var that = this;
		var textFile = this.server.config.root + "/text.json";
		this.textFile = textFile;
		if (this.server.config.dev) {
			if (Oxygen.FileSystem.exists(textFile) == false) {
				Oxygen.FileSystem.writeSync(textFile, "{}");
				}
			if (Oxygen.FileSystem.exists(this.server.config.resources + "/text.js") == false) {
				Oxygen.FileSystem.writeSync(this.server.config.resources + "/text.js", "Websom.text = {\"*\": {}};");
				}
			}
		this.server.input.interface("text.edit").restrict().to("permission", "text.edit").key("rule").is("string").length(1, 256).key("name").is("string").length(1, 512).key("text").is("string").length(0, 10000).success(function (input, cooked) {
			var data = input.raw;
			that.load();
			if ((data["rule"] in that.data) == false) {
				that.data[data["rule"]] = {};
				}
			that.data[data["rule"]][data["name"]] = data["text"];
			that.save();
			input.sendSuccess("Saved");
			});
	}
}

Websom.Micro.Text.prototype.save = function () {
	if (arguments.length == 0) {
		var encoded = Websom.Json.encode(this.data);
		Oxygen.FileSystem.writeSync(this.textFile, encoded);
		Oxygen.FileSystem.writeSync(this.server.config.resources + "/text.js", "Websom.text = " + encoded + ";");
	}
}

Websom.Micro.Text.prototype.load = function () {
	if (arguments.length == 0) {
		if (this.loaded == false) {
			this.data = Websom.Json.parse(Oxygen.FileSystem.readSync(this.textFile, "utf8"));
			}
	}
}

Websom.Containers.Table = function () {
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
		this.server = server;
		this.table = tableName;
		this.name = tableName;
		this.dataInfo = info;
		this.tableEntityName = tableName;
	}

}

Websom.Containers.Table.prototype.realize = function () {
	if (arguments.length == 2 && ((arguments[0] instanceof Websom.Database || (arguments[0] instanceof Websom.Databases.MySql)) || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'function' || typeof arguments[1] == 'undefined' || arguments[1] === null)) {
		var db = arguments[0];
		var done = arguments[1];
		var str = this.dataInfo.buildStructure();
		var subs = this.dataInfo.buildLinkedStructures(this.tableEntityName);
		str.database = db;
		str.table = this.table;
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
			subStr.table = this.table + "_" + subStr.table;
			subStr.run(built);
			}
	}
}

Websom.Containers.Table.loadArray = function (query, type, callback) {
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

Websom.Containers.Table.prototype.insert = function (data, done) {
		var insert = this.server.database.primary.into(this.table);
		for (var i = 0; i < this.dataInfo.fields.length; i++) {
			var field = this.dataInfo.fields[i];
			var value = null;
			if (field.isPrimitive) {
				
					value = data[field.realName];
				
				
				}
			insert.set(field.fieldName, value);
			}
		insert.run(done);}

Websom.Containers.Table.prototype.setupSubSorts = function () {
	if (arguments.length == 1 && (typeof arguments[0] == 'object' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var data = arguments[0];
		for (var i = 0; i < this.dataInfo.fields.length; i++) {
			var field = this.dataInfo.fields[i];
			if ("NoLoad" in field.attributes) {
				var mp = {};
				mp["container"] = this.table;
				mp["sub"] = field.fieldName;
				mp["target"] = "";
				data[field.fieldName] = mp;
				}
			}
	}
}

Websom.Containers.Table.prototype.handleInlineSubSelects = function (opts, input, parent, docData, subFields, loaded) {
		var that = this;
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

Websom.Containers.Table.prototype.handleSubSelect = function () {
	if (arguments.length == 3 && ((arguments[0] instanceof Websom.InterfaceOptions) || typeof arguments[0] == 'undefined' || arguments[0] === null) && ((arguments[1] instanceof Websom.Input) || typeof arguments[1] == 'undefined' || arguments[1] === null) && ((arguments[2] instanceof Websom.CallContext) || typeof arguments[2] == 'undefined' || arguments[2] === null)) {
		var opts = arguments[0];
		var input = arguments[1];
		var ctx = arguments[2];
		var that = this;
		if ((typeof input.raw["parentDocument"] == 'object' ? (Array.isArray(input.raw["parentDocument"]) ? 'array' : 'map') : (typeof input.raw["parentDocument"] == 'number' ? 'float' : typeof input.raw["parentDocument"])) != "string") {
			input.sendError("Invalid parentDocument input");
			return null;
			}
		var docPublicId = input.raw["parentDocument"];
		var parentTable = this.parentContainer;
		parentTable.loadFromSelect(parentTable.from().where("publicId").equals(docPublicId), function (docs) {
			if (docs.length == 0) {
				input.sendError("Invalid document");
				return null;
				}
			ctx.subContainerCall = true;
			ctx.data = docs[0];
			that.interfaceSelect(opts, input, ctx);
			});
	}
}

Websom.Containers.Table.prototype.handleSubInsert = function () {
	if (arguments.length == 8 && ((arguments[0] instanceof Websom.InterfaceOptions) || typeof arguments[0] == 'undefined' || arguments[0] === null) && ((arguments[1] instanceof Websom.Input) || typeof arguments[1] == 'undefined' || arguments[1] === null) && (typeof arguments[2] == 'object' || typeof arguments[2] == 'undefined' || arguments[2] === null) && ((arguments[3] instanceof Websom.ClientMessage) || typeof arguments[3] == 'undefined' || arguments[3] === null) && ((arguments[4] instanceof Websom.FieldInfo) || typeof arguments[4] == 'undefined' || arguments[4] === null) && ((arguments[5] instanceof Websom.Data) || typeof arguments[5] == 'undefined' || arguments[5] === null) && (typeof arguments[6] == 'function' || typeof arguments[6] == 'undefined' || arguments[6] === null) && ((arguments[7] instanceof Websom.CallContext) || typeof arguments[7] == 'undefined' || arguments[7] === null)) {
		var opts = arguments[0];
		var input = arguments[1];
		var values = arguments[2];
		var message = arguments[3];
		var fieldInfo = arguments[4];
		var parentData = arguments[5];
		var callback = arguments[6];
		var ctx = arguments[7];
		var that = this;
		if ((typeof input.raw["parentDocument"] == 'object' ? (Array.isArray(input.raw["parentDocument"]) ? 'array' : 'map') : (typeof input.raw["parentDocument"] == 'number' ? 'float' : typeof input.raw["parentDocument"])) != "string") {
			input.sendError("Invalid parentDocument input");
			return null;
			}
		var docPublicId = input.raw["parentDocument"];
		var parentTable = this.parentContainer;
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
				that.server.userSystem.getLoggedIn(input.request, function (user) {
					if (user != null) {
						if (user.id == docs[0].getField("id")) {
							doCall();
							}else{
								input.sendError("You do not own this.");
							}
						}else{
							input.sendError("Please login.");
						}
					});
				}else{
					doCall();
				}
			});
	}
}

Websom.Containers.Table.prototype.interfaceSelect = function () {
	if (arguments.length == 3 && ((arguments[0] instanceof Websom.InterfaceOptions) || typeof arguments[0] == 'undefined' || arguments[0] === null) && ((arguments[1] instanceof Websom.Input) || typeof arguments[1] == 'undefined' || arguments[1] === null) && ((arguments[2] instanceof Websom.CallContext) || typeof arguments[2] == 'undefined' || arguments[2] === null)) {
		var opts = arguments[0];
		var input = arguments[1];
		var ctx = arguments[2];
		var that = this;
		if (opts.canSelect) {
			if (opts.overrideSelect != null) {
				opts.overrideSelect(input);
				}else{
					var subParent = null;
					if ("parentDocument" in input.raw && input.raw["parentDocument"] != null && ctx.subContainerCall == false) {
						this.handleSubSelect(opts, input, ctx);
						return null;
						}
					if (ctx.subContainerCall) {
						subParent = ctx.data;
						}
					var subFields = [];
					var publicFields = [];
					for (var i = 0; i < this.dataInfo.fields.length; i++) {
						var field = this.dataInfo.fields[i];
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
					var select = this.server.database.primary.from(this.table);
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
										var checkDone = function (err3) {
											loads--;
											if (loads == 0) {
												if (that.selectHook == null) {
													var castSends = sends;
													if (loadMore) {
														castSends.push("{\"_w_loadMore\": true}");
														}
													that.server.security.countRequest("select", opts, input);
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
			}
	}
}

Websom.Containers.Table.prototype.insertFromInterface = function (opts, input, values, message, fieldInfo, parentData, ctx) {
		this.insertFromInterfaceCallback(opts, input, values, message, fieldInfo, parentData, null, ctx);}

Websom.Containers.Table.prototype.insertFromInterfaceCallback = function (opts, input, values, message, fieldInfo, parentData, callback, ctx) {
		var that = this;
		var obj = this.dataInfo.spawn(this.server);
		obj.websomServer = this.server;
		obj.websomParentData = parentData;
		var subParent = null;
		if ("parentDocument" in input.raw && input.raw["parentDocument"] != null && ctx.subContainerCall == false) {
			this.handleSubInsert(opts, input, values, message, fieldInfo, parentData, callback, ctx);
			return null;
			}
		if (ctx.subContainerCall) {
			subParent = ctx.data;
			}
		if (fieldInfo != null) {
			obj.websomFieldInfo = fieldInfo;
			}
		var insert = this.server.database.primary.into(this.table);
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
		obj.websomContainer = this;
		obj.containerInsert(input, this, insert, values, function () {
			var call = function () {
				var fieldWaits = 0;
				for (var f = 0; f < that.dataInfo.fields.length; f++) {
					var field = that.dataInfo.fields[f];
					if ("Parent" in field.attributes == false) {
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
						if ("Parent" in field.attributes == false) {
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

Websom.Containers.Table.prototype.getPublicId = function () {
	if (arguments.length == 1 && (typeof arguments[0] == 'function' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var found = arguments[0];
		var that = this;
		this.server.crypto.smallId(function (key) {
			that.from().where("publicId").equals(key).run(function (err, docs) {
				if (docs.length == 0) {
					found(key);
					}else{
						that.getPublicId(found);
					}
				});
			});
	}
}

Websom.Containers.Table.prototype.insertAutoFields = function (key, input, data, done) {
		var that = this;
		var autos = [];
		for (var i = 0; i < this.dataInfo.fields.length; i++) {
			var field = this.dataInfo.fields[i];
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

Websom.Containers.Table.prototype.updateFromInterface = function (opts, update, obj, input, values, message) {
		var that = this;
		obj.containerUpdate(input, that, update, values, function () {
			var fieldWaits = 0;
			for (var f = 0; f < that.dataInfo.fields.length; f++) {
				var field = that.dataInfo.fields[f];
				if ("Parent" in field.attributes == false) {
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
					if ("Parent" in field.attributes == false) {
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

Websom.Containers.Table.prototype.from = function () {
	if (arguments.length == 0) {
		return this.server.database.primary.from(this.table);
	}
}

Websom.Containers.Table.prototype.into = function () {
	if (arguments.length == 0) {
		return this.server.database.primary.into(this.table);
	}
}

Websom.Containers.Table.prototype.loadFromId = function () {
	if (arguments.length == 2 && (typeof arguments[0] == 'number' || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'function' || typeof arguments[1] == 'undefined' || arguments[1] === null)) {
		var id = arguments[0];
		var callback = arguments[1];
		var select = this.from().where("id").equals(id);
		this.loadFromSelect(select, function (datas) {
			if (datas.length > 0) {
				callback(datas[0]);
				}else{
					callback(null);
				}
			});
	}
}

Websom.Containers.Table.prototype.loadFromPublicId = function () {
	if (arguments.length == 2 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'function' || typeof arguments[1] == 'undefined' || arguments[1] === null)) {
		var id = arguments[0];
		var callback = arguments[1];
		var select = this.from().where("publicId").equals(id);
		this.loadFromSelect(select, function (datas) {
			if (datas.length > 0) {
				callback(datas[0]);
				}else{
					callback(null);
				}
			});
	}
}

Websom.Containers.Table.prototype.loadFromSelect = function () {
	if (arguments.length == 2 && ((arguments[0] instanceof Websom.DatabaseSelect || (arguments[0] instanceof Websom.MySqlDatabaseSelect)) || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'function' || typeof arguments[1] == 'undefined' || arguments[1] === null)) {
		var select = arguments[0];
		var callback = arguments[1];
		var that = this;
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
			});
	}
}

Websom.Containers.Table.prototype.expose = function () {
	if (arguments.length == 3 && ((arguments[0] instanceof Websom.Request) || typeof arguments[0] == 'undefined' || arguments[0] === null) && (arguments[1]instanceof Array || typeof arguments[1] == 'undefined' || arguments[1] === null) && (typeof arguments[2] == 'function' || typeof arguments[2] == 'undefined' || arguments[2] === null)) {
		var req = arguments[0];
		var datas = arguments[1];
		var callback = arguments[2];
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
			}
	}
}

Websom.Containers.Table.prototype.checkRestrictions = function () {
	if (arguments.length == 5 && ((arguments[0] instanceof Websom.InterfaceOptions) || typeof arguments[0] == 'undefined' || arguments[0] === null) && ((arguments[1] instanceof Websom.Input) || typeof arguments[1] == 'undefined' || arguments[1] === null) && (typeof arguments[2] == 'string' || typeof arguments[2] == 'undefined' || arguments[2] === null) && ((arguments[3] instanceof Websom.FieldInfo) || typeof arguments[3] == 'undefined' || arguments[3] === null) && (typeof arguments[4] == 'function' || typeof arguments[4] == 'undefined' || arguments[4] === null)) {
		var opts = arguments[0];
		var inp = arguments[1];
		var mode = arguments[2];
		var field = arguments[3];
		var callback = arguments[4];
		for (var i = 0; i < opts.restricts.length; i++) {
			var r = opts.restricts[i];
			if (r.field == field.realName && r.mode == "global" || r.mode == mode) {
				if (r.simple) {
					var ct = this.server.input.restrictHandlers;
					if (r.key in ct) {
						var handler = this.server.input.restrictHandlers[r.key];
						handler(r.value, inp.request, function (passed) {
callback(passed);
});
						return null;
						}else{
							throw new Error("Custom restriction " + r.key + " not found in request to container " + this.name);
						}
					}else{
						if (r.callback != null) {
							r.callback(function (passed) {
callback(passed);
});
							}else{
								throw new Error("Restrict callback on field " + field.realName + " in container interface " + this.name + " is null. Did you forget interface.to(void () => {})?");
							}
						return null;
					}
				}
			}
		callback(true);
	}
}

Websom.Containers.Table.prototype.interfaceInsert = function () {
	if (arguments.length == 2 && ((arguments[0] instanceof Websom.InterfaceOptions) || typeof arguments[0] == 'undefined' || arguments[0] === null) && ((arguments[1] instanceof Websom.Input) || typeof arguments[1] == 'undefined' || arguments[1] === null)) {
		var opts = arguments[0];
		var input = arguments[1];
		var that = this;
		if (opts.canInsert) {
			if (opts.overrideInsert != null) {
				opts.overrideInsert(input);
				}else{
					if (opts.mustLogin || opts.mustOwnInsert) {
						if (this.server.userSystem.isLoggedIn(input.request) == false) {
							var msg = Websom.ClientMessage.quickError("Please login.");
							input.send(msg.stringify());
							return null;
							}
						}
					this.server.security.request("insert", opts, input, function () {
						var v = new Websom.DataValidator(that.dataInfo);
						v.validate(input, function (msg) {
							if (msg.hadError) {
								input.sendError(msg.stringify());
								}else{
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
										if (dones == 0) {
											that.server.security.countRequest("insert", opts, input);
											that.insertFromInterface(opts, input, values, clientMessage, null, null, new Websom.CallContext());
											}
										}
								}
							});
						});
				}
			}else{
				if (this.server.config.dev) {
					input.send("Invalid(Dev: This container has no insert interface)");
					}else{
						input.send("Invalid");
					}
			}
	}
}

Websom.Containers.Table.prototype.interfaceSend = function (opts, input) {
		var that = this;
		if (opts.canInterface) {
			if ("publicId" in input.raw && "route" in input.raw && "data" in input.raw) {
				var obj = that.dataInfo.spawn(that.server);
				obj.websomServer = this.server;
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
					if (this.server.config.dev) {
						input.send("Invalid(Dev: No 'publicId', 'route', or 'data' key found in query)");
						}else{
							input.send("Invalid");
						}
				}
			}}

Websom.Containers.Table.prototype.interfaceUpdate = function (opts, input) {
		var that = this;
		if (opts.canUpdate) {
			if (opts.overrideUpdate != null) {
				opts.overrideUpdate(input);
				}else{
					if (opts.mustLogin || opts.mustOwnUpdate) {
						if (this.server.userSystem.isLoggedIn(input.request) == false) {
							var cMsg = Websom.ClientMessage.quickError("Please login.");
							input.send(cMsg.stringify());
							return null;
							}
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
					this.server.security.request("update", opts, input, function () {
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
										var doContinue = function () {
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
												if (dones == 0) {
													that.server.security.countRequest("update", opts, input);
													that.updateFromInterface(opts, update, obj, input, values, clientMessage);
													}
												}
											};
										if (opts.mustOwnUpdate) {
											that.server.userSystem.getLoggedIn(input.request, function (user) {
												
											if (user.id != obj.owner.id) {
												shouldContinue = false;
											}
										
												
												if (shouldContinue == false) {
													var cMsg = Websom.ClientMessage.quickError("You do not own this.");
													input.send(cMsg.stringify());
													}else{
														doContinue();
													}
												});
											}else{
												doContinue();
											}
										});
								}
							});
						});
				}
			}else{
				if (this.server.config.dev) {
					input.send("Invalid(Dev: This container has no update interface)");
					}else{
						input.send("Invalid");
					}
			}}

Websom.Containers.Table.prototype.interface = function () {
	if (arguments.length == 1 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var route = arguments[0];
		return new Websom.InterfaceChain(this, route);
	}
else 	if (arguments.length == 1 && ((arguments[0] instanceof Websom.InterfaceOptions) || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var opts = arguments[0];
		this.interfaces.push(opts);
	}
}

Websom.Containers.Table.prototype.getInterface = function () {
	if (arguments.length == 1 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var route = arguments[0];
		for (var i = 0; i < this.interfaces.length; i++) {
			if (this.interfaces[i].route == route) {
				return this.interfaces[i];
				}
			}
		return null;
	}
}

Websom.Containers.Table.prototype.getDataFromRoute = function () {
	if (arguments.length == 1 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var route = arguments[0];
		
			var splits = route.split(".");
			var cur = global;
			for (var split of splits)
				cur = cur[split];

			return cur;
		
		
	}
}

Websom.Containers.Table.prototype.registerSubContainer = function () {
	if (arguments.length == 2 && ((arguments[0] instanceof Websom.FieldInfo) || typeof arguments[0] == 'undefined' || arguments[0] === null) && ((arguments[1] instanceof Websom.DataInfo) || typeof arguments[1] == 'undefined' || arguments[1] === null)) {
		var field = arguments[0];
		var routeInfo = arguments[1];
		var that = this;
		var name = this.name + "_" + field.fieldName;
		var subContainer = new Websom.Containers.Table(this.server, name, routeInfo);
		subContainer.parentContainer = this;
		for (var i = 0; i < this.interfaces.length; i++) {
			var interface = this.interfaces[i];
			if (interface.subs[field.fieldName] != null) {
				subContainer.interface(interface.subs[field.fieldName]);
				}
			}
		if (subContainer.interfaces.length > 0) {
			var handler = subContainer.register();
			handler.containerInterface = subContainer;
			return handler;
			}
	}
}

Websom.Containers.Table.prototype.register = function () {
	if (arguments.length == 0) {
		var that = this;
		for (var i = 0; i < this.dataInfo.fields.length; i++) {
			var f = this.dataInfo.fields[i];
			if (f.singleLink && f.isPrimitive == false) {
				var t = Websom.DataInfo.getDataInfoFromRoute(f.typeRoute);
				var fi = this.getDataFromRoute(f.typeRoute);
				if ("Component" in t.attributes) {
					var name = this.name + "_" + f.fieldName;
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
				this.registerSubContainer(f, t);
				}
			}
		for (var i = 0; i < this.interfaces.length; i++) {
			var opts = this.interfaces[i];
			for (var c = 0; c < opts.controls.length; c++) {
				opts.controls[c].container = this;
				}
			for (var c = 0; c < opts.selectControls.length; c++) {
				opts.selectControls[c].container = this;
				}
			for (var c = 0; c < opts.updateControls.length; c++) {
				opts.updateControls[c].container = this;
				}
			for (var c = 0; c < opts.insertControls.length; c++) {
				opts.insertControls[c].container = this;
				}
			}
		var handler = this.server.input.register(this.name, function (input) {
			if ("_w_type" in input.raw && "_w_route" in input.raw) {
				var type = input.raw["_w_type"];
				var route = input.raw["_w_route"];
				var opts = that.getInterface(route);
				if (opts != null) {
					that.checkAuth(opts, input, type, function (success) {
						if (success) {
							if (type == "insert") {
								that.interfaceInsert(opts, input);
								}else if (type == "update") {
								that.interfaceUpdate(opts, input);
								}else if (type == "select") {
								that.server.security.request("select", opts, input, function () {
									that.interfaceSelect(opts, input, new Websom.CallContext());
									});
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
		handler.containerInterface = this;
		return handler;
	}
}

Websom.Containers.Table.prototype.checkAuth = function () {
	if (arguments.length == 4 && ((arguments[0] instanceof Websom.InterfaceOptions) || typeof arguments[0] == 'undefined' || arguments[0] === null) && ((arguments[1] instanceof Websom.Input) || typeof arguments[1] == 'undefined' || arguments[1] === null) && (typeof arguments[2] == 'string' || typeof arguments[2] == 'undefined' || arguments[2] === null) && (typeof arguments[3] == 'function' || typeof arguments[3] == 'undefined' || arguments[3] === null)) {
		var opts = arguments[0];
		var input = arguments[1];
		var type = arguments[2];
		var callback = arguments[3];
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
				if (input.request.session.get("dashboard") != null) {
					callback(true);
					}else if (input.server.userSystem.isLoggedIn(input.request)) {
					input.server.userSystem.getLoggedIn(input.request, function (user) {
						user.hasPermission(perms, function (yes) {
							callback(yes);
							});
						});
					}else{
						callback(false);
					}
				}else{
					callback(true);
				}
			}else{
				callback(true);
			}
	}
}

Websom.DatabaseDocument = function () {


}

Websom.DatabaseInsert = function () {
	this.table = "";

	this.number = 1;

	this.isMulti = false;

	this.values = [];

	this.multiKeys = {};

	this.inserts = [];

	this.multiInserts = [];

	this.database = null;

	if (arguments.length == 2 && ((arguments[0] instanceof Websom.Database || (arguments[0] instanceof Websom.Databases.MySql)) || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'string' || typeof arguments[1] == 'undefined' || arguments[1] === null)) {
		var database = arguments[0];
		var table = arguments[1];

	}

}

Websom.DatabaseInsert.prototype.doesSet = function () {
	if (arguments.length == 1 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var field = arguments[0];
		for (var i = 0; i < this.inserts.length; i++) {
			if (this.inserts[i].field == field) {
				return true;
				}
			}
		return false;
	}
}

Websom.DatabaseInsert.prototype.amount = function () {
	if (arguments.length == 1 && (typeof arguments[0] == 'number' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var number = arguments[0];
		this.number = number;
		return this;
	}
}

Websom.DatabaseInsert.prototype.multi = function () {
	if (arguments.length == 0) {
		this.isMulti = true;
		return this;
	}
}

Websom.DatabaseInterface = function () {
	this.database = null;


}

Websom.DatabaseSelect = function () {
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

	if (arguments.length == 2 && ((arguments[0] instanceof Websom.Database || (arguments[0] instanceof Websom.Databases.MySql)) || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'string' || typeof arguments[1] == 'undefined' || arguments[1] === null)) {
		var database = arguments[0];
		var table = arguments[1];

	}

}

Websom.DatabaseSelect.prototype.doesSet = function () {
	if (arguments.length == 1 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var field = arguments[0];
		for (var i = 0; i < this.updates.length; i++) {
			if (this.updates[i].field == field) {
				return true;
				}
			}
		return false;
	}
}

Websom.DatabaseSelect.prototype.limit = function () {
	if (arguments.length == 1 && (typeof arguments[0] == 'number' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var documents = arguments[0];
		this.limitAmount = documents;
		return this;
	}
else 	if (arguments.length == 2 && (typeof arguments[0] == 'number' || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'number' || typeof arguments[1] == 'undefined' || arguments[1] === null)) {
		var offset = arguments[0];
		var documents = arguments[1];
		this.limitAmount = documents;
		this.limitOffset = offset;
		return this;
	}
}

Websom.DatabaseSelect.prototype.update = function () {
	if (arguments.length == 0) {
		this.doUpdate = true;
		return this;
	}
}

Websom.DatabaseSelect.prototype.delete = function () {
	if (arguments.length == 0) {
		this.doDelete = true;
		return this;
	}
}

Websom.DatabaseStructure = function () {
	this.database = null;

	this.table = "";

	this.fields = [];

	if (arguments.length == 2 && ((arguments[0] instanceof Websom.Database || (arguments[0] instanceof Websom.Databases.MySql)) || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'string' || typeof arguments[1] == 'undefined' || arguments[1] === null)) {
		var database = arguments[0];
		var table = arguments[1];
		this.database = database;
		this.table = table;
	}

}

Websom.DatabaseStructure.prototype.field = function () {
	if (arguments.length == 2 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null) && ((arguments[1] instanceof Websom.DatabaseType || (arguments[1] instanceof Websom.DatabaseTypes.Varchar) || (arguments[1] instanceof Websom.DatabaseTypes.Text) || (arguments[1] instanceof Websom.DatabaseTypes.BigInt) || (arguments[1] instanceof Websom.DatabaseTypes.Int) || (arguments[1] instanceof Websom.DatabaseTypes.Float) || (arguments[1] instanceof Websom.DatabaseTypes.Bool)) || typeof arguments[1] == 'undefined' || arguments[1] === null)) {
		var name = arguments[0];
		var type = arguments[1];
		var field = new Websom.DatabaseField(name, type);
		this.fields.push(field);
		return this;
	}
}

Websom.DatabaseStructure.prototype.flag = function () {
	if (arguments.length == 1 && ((arguments[0] instanceof Websom.DatabaseFlag || (arguments[0] instanceof Websom.DatabaseFlags.AutoIncrement) || (arguments[0] instanceof Websom.DatabaseFlags.Primary) || (arguments[0] instanceof Websom.DatabaseFlags.Edit) || (arguments[0] instanceof Websom.DatabaseFlags.Linked) || (arguments[0] instanceof Websom.DatabaseFlags.Unsigned)) || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var flag = arguments[0];
		if (this.fields.length > 0) {
			this.fields[this.fields.length - 1].flags.push(flag);
			}
		return this;
	}
}

Websom.DatabaseStructure.prototype.run = function () {
	if (arguments.length == 1 && (typeof arguments[0] == 'function' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var callback = arguments[0];
		this.database.runStructure(this, callback);
	}
}

Websom.DatabaseFlags = function () {


}

Websom.DatabaseFlag = function () {
	this.type = "flag";

	if (arguments.length == 0) {

	}

}

Websom.DatabaseFlags.AutoIncrement = function () {
	this.type = "autoIncrement";

	if (arguments.length == 0) {

	}

}

Websom.DatabaseFlags.Primary = function () {
	this.type = "primary";

	if (arguments.length == 0) {

	}

}

Websom.DatabaseFlags.Edit = function () {
	this.type = "edit";

	if (arguments.length == 0) {

	}

}

Websom.DatabaseFlags.Linked = function () {
	this.type = "linked";

	this.name = "";

	this.linkType = "";

	this.fieldType = "";

	if (arguments.length == 3 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'string' || typeof arguments[1] == 'undefined' || arguments[1] === null) && (typeof arguments[2] == 'string' || typeof arguments[2] == 'undefined' || arguments[2] === null)) {
		var name = arguments[0];
		var linkType = arguments[1];
		var fieldType = arguments[2];
		this.name = name;
		this.linkType = linkType;
		this.fieldType = fieldType;
	}

}

Websom.DatabaseFlags.Unsigned = function () {
	this.type = "unsigned";

	if (arguments.length == 0) {

	}

}

Websom.DatabaseField = function () {
	this.name = "";

	this.type = null;

	this.flags = [];

	if (arguments.length == 2 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null) && ((arguments[1] instanceof Websom.DatabaseType || (arguments[1] instanceof Websom.DatabaseTypes.Varchar) || (arguments[1] instanceof Websom.DatabaseTypes.Text) || (arguments[1] instanceof Websom.DatabaseTypes.BigInt) || (arguments[1] instanceof Websom.DatabaseTypes.Int) || (arguments[1] instanceof Websom.DatabaseTypes.Float) || (arguments[1] instanceof Websom.DatabaseTypes.Bool)) || typeof arguments[1] == 'undefined' || arguments[1] === null)) {
		var name = arguments[0];
		var type = arguments[1];
		this.name = name;
		this.type = type;
	}

}

Websom.DatabaseField.prototype.hasFlag = function () {
	if (arguments.length == 1 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var name = arguments[0];
		for (var i = 0; i < this.flags.length; i++) {
			if (this.flags[i].type == name) {
				return true;
				}
			}
		return false;
	}
}

Websom.DatabaseField.prototype.getFlag = function () {
	if (arguments.length == 1 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var name = arguments[0];
		for (var i = 0; i < this.flags.length; i++) {
			if (this.flags[i].type == name) {
				return this.flags[i];
				}
			}
		return null;
	}
}

Websom.DatabaseTypes = function () {


}

Websom.DatabaseType = function () {
	this.type = "";

	if (arguments.length == 0) {

	}

}

Websom.DatabaseType.prototype.autoControl = function () {
	if (arguments.length == 1 && ((arguments[0] instanceof Websom.FieldInfo) || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var info = arguments[0];

	}
}

Websom.DatabaseTypes.Varchar = function () {
	this.type = "varchar";

	this.length = 0;

	if (arguments.length == 1 && (typeof arguments[0] == 'number' || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var length = arguments[0];
		this.length = length;
	}

}

Websom.DatabaseTypes.Varchar.prototype.autoControl = function () {
	if (arguments.length == 1 && ((arguments[0] instanceof Websom.FieldInfo) || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var field = arguments[0];
		return new Websom.Controls.String(field.realName, field.fieldName, field);
	}
}

Websom.DatabaseTypes.Text = function () {
	this.type = "text";

	if (arguments.length == 0) {

	}

}

Websom.DatabaseTypes.Text.prototype.autoControl = function () {
	if (arguments.length == 1 && ((arguments[0] instanceof Websom.FieldInfo) || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var field = arguments[0];
		return new Websom.Controls.String(field.realName, field.fieldName, field);
	}
}

Websom.Controls.String = function () {
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

Websom.Controls.String.prototype.validateField = function () {
	if (arguments.length == 3 && ((arguments[0] instanceof Websom.Input) || typeof arguments[0] == 'undefined' || arguments[0] === null) && ((arguments[1]instanceof Array || typeof arguments[1] == 'boolean' || typeof arguments[1] == 'number' || typeof arguments[1] == 'number' || typeof arguments[1] == 'object' || typeof arguments[1] == 'string') || typeof arguments[1] == 'undefined' || arguments[1] === null) && (typeof arguments[2] == 'function' || typeof arguments[2] == 'undefined' || arguments[2] === null)) {
		var input = arguments[0];
		var value = arguments[1];
		var done = arguments[2];
		if ((typeof value == 'object' ? (Array.isArray(value) ? 'array' : 'map') : (typeof value == 'number' ? 'float' : typeof value)) == "string") {
			var val = value;
			var ok = true;
			if ("Min" in this.fieldInfo.attributes) {
				var min = this.fieldInfo.attributes["Min"];
				if (val.length < min) {
					done(new Websom.InputValidation(true, "Length must be greater than " + min));
					ok = false;
					}
				}
			if ("Length" in this.fieldInfo.attributes) {
				var max = this.fieldInfo.attributes["Length"];
				if (val.length > max) {
					done(new Websom.InputValidation(true, "Length must be less than " + max));
					ok = false;
					}
				}
			if ("Match" in this.fieldInfo.attributes) {
				var match = this.fieldInfo.attributes["Match"];
				if ((new RegExp(match)).test(val) == false) {
					var err = "Value must match " + match;
					if ("MatchError" in this.fieldInfo.attributes) {
						err = this.fieldInfo.attributes["MatchError"];
						}
					done(new Websom.InputValidation(true, err, this.fieldInfo));
					ok = false;
					}
				}
			if (ok) {
				done(new Websom.InputValidation(false, ""));
				}
			}else{
				done(new Websom.InputValidation(true, "Not a string type"));
			}
	}
}

Websom.Controls.String.prototype.fillField = function () {
	if (arguments.length == 2 && ((arguments[0]instanceof Array || typeof arguments[0] == 'boolean' || typeof arguments[0] == 'number' || typeof arguments[0] == 'number' || typeof arguments[0] == 'object' || typeof arguments[0] == 'string') || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'object' || typeof arguments[1] == 'undefined' || arguments[1] === null)) {
		var value = arguments[0];
		var values = arguments[1];
		values[this.field] = value;
	}
}

Websom.Controls.String.prototype.filterField = function () {
	if (arguments.length == 3 && (typeof arguments[0] == 'number' || typeof arguments[0] == 'undefined' || arguments[0] === null) && ((arguments[1] instanceof Websom.DatabaseSelect || (arguments[1] instanceof Websom.MySqlDatabaseSelect)) || typeof arguments[1] == 'undefined' || arguments[1] === null) && (typeof arguments[2] == 'function' || typeof arguments[2] == 'undefined' || arguments[2] === null)) {
		var value = arguments[0];
		var select = arguments[1];
		var done = arguments[2];
		select.where(this.field).equals(value);
		done(null);
	}
}

Websom.Controls.String.prototype.validate = function () {
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

Websom.Controls.String.prototype.fill = function () {
	if (arguments.length == 3 && ((arguments[0] instanceof Websom.Input) || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'object' || typeof arguments[1] == 'undefined' || arguments[1] === null) && (typeof arguments[2] == 'function' || typeof arguments[2] == 'undefined' || arguments[2] === null)) {
		var input = arguments[0];
		var values = arguments[1];
		var done = arguments[2];
		this.fillField(input.raw[this.name], values);
		done();
	}
}

Websom.Controls.String.prototype.filter = function () {
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

Websom.Controls.String.prototype.insert = function () {
	if (arguments.length == 3 && ((arguments[0] instanceof Websom.Input) || typeof arguments[0] == 'undefined' || arguments[0] === null) && ((arguments[1] instanceof Websom.Data) || typeof arguments[1] == 'undefined' || arguments[1] === null) && ((arguments[2]instanceof Array || typeof arguments[2] == 'boolean' || typeof arguments[2] == 'number' || typeof arguments[2] == 'number' || typeof arguments[2] == 'object' || typeof arguments[2] == 'string') || typeof arguments[2] == 'undefined' || arguments[2] === null)) {
		var input = arguments[0];
		var data = arguments[1];
		var key = arguments[2];

	}
}

Websom.Controls.String.prototype.update = function () {
	if (arguments.length == 2 && ((arguments[0] instanceof Websom.Input) || typeof arguments[0] == 'undefined' || arguments[0] === null) && ((arguments[1] instanceof Websom.Data) || typeof arguments[1] == 'undefined' || arguments[1] === null)) {
		var input = arguments[0];
		var data = arguments[1];

	}
}

Websom.Controls.String.prototype.message = function () {
	if (arguments.length == 4 && ((arguments[0] instanceof Websom.Input) || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'string' || typeof arguments[1] == 'undefined' || arguments[1] === null) && (typeof arguments[2] == 'object' || typeof arguments[2] == 'undefined' || arguments[2] === null) && (typeof arguments[3] == 'function' || typeof arguments[3] == 'undefined' || arguments[3] === null)) {
		var input = arguments[0];
		var name = arguments[1];
		var data = arguments[2];
		var send = arguments[3];
		send(null);
	}
}

Websom.Controls.String.prototype.use = function () {
	if (arguments.length == 1 && ((arguments[0] instanceof Websom.InputChain) || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var inputChain = arguments[0];

	}
}

Websom.DatabaseTypes.BigInt = function () {
	this.type = "bigInt";

	if (arguments.length == 0) {

	}

}

Websom.DatabaseTypes.BigInt.prototype.autoControl = function () {
	if (arguments.length == 1 && ((arguments[0] instanceof Websom.FieldInfo) || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var field = arguments[0];
		return new Websom.Controls.Number(field.realName, field.fieldName, field);
	}
}

Websom.DatabaseTypes.Int = function () {
	this.type = "int";

	if (arguments.length == 0) {

	}

}

Websom.DatabaseTypes.Int.prototype.autoControl = function () {
	if (arguments.length == 1 && ((arguments[0] instanceof Websom.FieldInfo) || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var field = arguments[0];
		return new Websom.Controls.Number(field.realName, field.fieldName, field);
	}
}

Websom.DatabaseTypes.Float = function () {
	this.type = "float";

	if (arguments.length == 0) {

	}

}

Websom.DatabaseTypes.Float.prototype.autoControl = function () {
	if (arguments.length == 1 && ((arguments[0] instanceof Websom.FieldInfo) || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var field = arguments[0];
		return new Websom.Controls.Number(field.realName, field.fieldName, field);
	}
}

Websom.Controls.Number = function () {
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

Websom.Controls.Number.prototype.validateField = function () {
	if (arguments.length == 3 && ((arguments[0] instanceof Websom.Input) || typeof arguments[0] == 'undefined' || arguments[0] === null) && ((arguments[1]instanceof Array || typeof arguments[1] == 'boolean' || typeof arguments[1] == 'number' || typeof arguments[1] == 'number' || typeof arguments[1] == 'object' || typeof arguments[1] == 'string') || typeof arguments[1] == 'undefined' || arguments[1] === null) && (typeof arguments[2] == 'function' || typeof arguments[2] == 'undefined' || arguments[2] === null)) {
		var input = arguments[0];
		var value = arguments[1];
		var done = arguments[2];
		if ((typeof value == 'object' ? (Array.isArray(value) ? 'array' : 'map') : (typeof value == 'number' ? 'float' : typeof value)) == "float" || (typeof value == 'object' ? (Array.isArray(value) ? 'array' : 'map') : (typeof value == 'number' ? 'float' : typeof value)) == "integer") {
			var val = value;
			var ok = true;
			if ("Min" in this.fieldInfo.attributes) {
				var min = this.fieldInfo.attributes["Min"];
				if (val < min) {
					done(new Websom.InputValidation(true, "Number must be greater than " + min));
					ok = false;
					}
				}
			if ("Max" in this.fieldInfo.attributes) {
				var max = this.fieldInfo.attributes["Max"];
				if (val > max) {
					done(new Websom.InputValidation(true, "Number must be less than " + max));
					ok = false;
					}
				}
			if (ok) {
				done(new Websom.InputValidation(false, ""));
				}
			}else{
				if (this.fieldInfo.structure.hasFlag("linked")) {
					var val = value;
					var link = this.fieldInfo.structure.getFlag("linked");
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
			}
	}
}

Websom.Controls.Number.prototype.fillField = function () {
	if (arguments.length == 2 && ((arguments[0]instanceof Array || typeof arguments[0] == 'boolean' || typeof arguments[0] == 'number' || typeof arguments[0] == 'number' || typeof arguments[0] == 'object' || typeof arguments[0] == 'string') || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'object' || typeof arguments[1] == 'undefined' || arguments[1] === null)) {
		var value = arguments[0];
		var values = arguments[1];
		values[this.field] = value;
	}
}

Websom.Controls.Number.prototype.filterField = function () {
	if (arguments.length == 3 && (typeof arguments[0] == 'number' || typeof arguments[0] == 'undefined' || arguments[0] === null) && ((arguments[1] instanceof Websom.DatabaseSelect || (arguments[1] instanceof Websom.MySqlDatabaseSelect)) || typeof arguments[1] == 'undefined' || arguments[1] === null) && (typeof arguments[2] == 'function' || typeof arguments[2] == 'undefined' || arguments[2] === null)) {
		var value = arguments[0];
		var select = arguments[1];
		var done = arguments[2];
		select.where(this.field).equals(value);
		done(null);
	}
}

Websom.Controls.Number.prototype.validate = function () {
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

Websom.Controls.Number.prototype.fill = function () {
	if (arguments.length == 3 && ((arguments[0] instanceof Websom.Input) || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'object' || typeof arguments[1] == 'undefined' || arguments[1] === null) && (typeof arguments[2] == 'function' || typeof arguments[2] == 'undefined' || arguments[2] === null)) {
		var input = arguments[0];
		var values = arguments[1];
		var done = arguments[2];
		this.fillField(input.raw[this.name], values);
		done();
	}
}

Websom.Controls.Number.prototype.filter = function () {
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

Websom.Controls.Number.prototype.insert = function () {
	if (arguments.length == 3 && ((arguments[0] instanceof Websom.Input) || typeof arguments[0] == 'undefined' || arguments[0] === null) && ((arguments[1] instanceof Websom.Data) || typeof arguments[1] == 'undefined' || arguments[1] === null) && ((arguments[2]instanceof Array || typeof arguments[2] == 'boolean' || typeof arguments[2] == 'number' || typeof arguments[2] == 'number' || typeof arguments[2] == 'object' || typeof arguments[2] == 'string') || typeof arguments[2] == 'undefined' || arguments[2] === null)) {
		var input = arguments[0];
		var data = arguments[1];
		var key = arguments[2];

	}
}

Websom.Controls.Number.prototype.update = function () {
	if (arguments.length == 2 && ((arguments[0] instanceof Websom.Input) || typeof arguments[0] == 'undefined' || arguments[0] === null) && ((arguments[1] instanceof Websom.Data) || typeof arguments[1] == 'undefined' || arguments[1] === null)) {
		var input = arguments[0];
		var data = arguments[1];

	}
}

Websom.Controls.Number.prototype.message = function () {
	if (arguments.length == 4 && ((arguments[0] instanceof Websom.Input) || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'string' || typeof arguments[1] == 'undefined' || arguments[1] === null) && (typeof arguments[2] == 'object' || typeof arguments[2] == 'undefined' || arguments[2] === null) && (typeof arguments[3] == 'function' || typeof arguments[3] == 'undefined' || arguments[3] === null)) {
		var input = arguments[0];
		var name = arguments[1];
		var data = arguments[2];
		var send = arguments[3];
		send(null);
	}
}

Websom.Controls.Number.prototype.use = function () {
	if (arguments.length == 1 && ((arguments[0] instanceof Websom.InputChain) || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var inputChain = arguments[0];

	}
}

Websom.DatabaseTypes.Bool = function () {
	this.type = "bool";

	if (arguments.length == 0) {

	}

}

Websom.DatabaseTypes.Bool.prototype.autoControl = function () {
	if (arguments.length == 1 && ((arguments[0] instanceof Websom.FieldInfo) || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var field = arguments[0];
		return new Websom.Controls.Bool(field.realName, field.fieldName, field);
	}
}

Websom.Controls.Bool = function () {
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

Websom.Controls.Bool.prototype.validateField = function () {
	if (arguments.length == 3 && ((arguments[0] instanceof Websom.Input) || typeof arguments[0] == 'undefined' || arguments[0] === null) && ((arguments[1]instanceof Array || typeof arguments[1] == 'boolean' || typeof arguments[1] == 'number' || typeof arguments[1] == 'number' || typeof arguments[1] == 'object' || typeof arguments[1] == 'string') || typeof arguments[1] == 'undefined' || arguments[1] === null) && (typeof arguments[2] == 'function' || typeof arguments[2] == 'undefined' || arguments[2] === null)) {
		var input = arguments[0];
		var value = arguments[1];
		var done = arguments[2];
		if ((typeof value == 'object' ? (Array.isArray(value) ? 'array' : 'map') : (typeof value == 'number' ? 'float' : typeof value)) == "boolean") {
			done(new Websom.InputValidation(false, ""));
			}else{
				done(new Websom.InputValidation(true, "Not a boolean type"));
			}
	}
}

Websom.Controls.Bool.prototype.fillField = function () {
	if (arguments.length == 2 && ((arguments[0]instanceof Array || typeof arguments[0] == 'boolean' || typeof arguments[0] == 'number' || typeof arguments[0] == 'number' || typeof arguments[0] == 'object' || typeof arguments[0] == 'string') || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'object' || typeof arguments[1] == 'undefined' || arguments[1] === null)) {
		var value = arguments[0];
		var values = arguments[1];
		values[this.field] = value;
	}
}

Websom.Controls.Bool.prototype.filterField = function () {
	if (arguments.length == 3 && ((arguments[0]instanceof Array || typeof arguments[0] == 'boolean' || typeof arguments[0] == 'number' || typeof arguments[0] == 'number' || typeof arguments[0] == 'object' || typeof arguments[0] == 'string') || typeof arguments[0] == 'undefined' || arguments[0] === null) && ((arguments[1] instanceof Websom.DatabaseSelect || (arguments[1] instanceof Websom.MySqlDatabaseSelect)) || typeof arguments[1] == 'undefined' || arguments[1] === null) && (typeof arguments[2] == 'function' || typeof arguments[2] == 'undefined' || arguments[2] === null)) {
		var value = arguments[0];
		var select = arguments[1];
		var done = arguments[2];
		var val = 0;
		if (value == true) {
			val = 1;
			}
		select.where(this.field).equals(val);
		done(null);
	}
}

Websom.Controls.Bool.prototype.validate = function () {
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

Websom.Controls.Bool.prototype.fill = function () {
	if (arguments.length == 3 && ((arguments[0] instanceof Websom.Input) || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'object' || typeof arguments[1] == 'undefined' || arguments[1] === null) && (typeof arguments[2] == 'function' || typeof arguments[2] == 'undefined' || arguments[2] === null)) {
		var input = arguments[0];
		var values = arguments[1];
		var done = arguments[2];
		this.fillField(input.raw[this.name], values);
		done();
	}
}

Websom.Controls.Bool.prototype.filter = function () {
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

Websom.Controls.Bool.prototype.insert = function () {
	if (arguments.length == 3 && ((arguments[0] instanceof Websom.Input) || typeof arguments[0] == 'undefined' || arguments[0] === null) && ((arguments[1] instanceof Websom.Data) || typeof arguments[1] == 'undefined' || arguments[1] === null) && ((arguments[2]instanceof Array || typeof arguments[2] == 'boolean' || typeof arguments[2] == 'number' || typeof arguments[2] == 'number' || typeof arguments[2] == 'object' || typeof arguments[2] == 'string') || typeof arguments[2] == 'undefined' || arguments[2] === null)) {
		var input = arguments[0];
		var data = arguments[1];
		var key = arguments[2];

	}
}

Websom.Controls.Bool.prototype.update = function () {
	if (arguments.length == 2 && ((arguments[0] instanceof Websom.Input) || typeof arguments[0] == 'undefined' || arguments[0] === null) && ((arguments[1] instanceof Websom.Data) || typeof arguments[1] == 'undefined' || arguments[1] === null)) {
		var input = arguments[0];
		var data = arguments[1];

	}
}

Websom.Controls.Bool.prototype.message = function () {
	if (arguments.length == 4 && ((arguments[0] instanceof Websom.Input) || typeof arguments[0] == 'undefined' || arguments[0] === null) && (typeof arguments[1] == 'string' || typeof arguments[1] == 'undefined' || arguments[1] === null) && (typeof arguments[2] == 'object' || typeof arguments[2] == 'undefined' || arguments[2] === null) && (typeof arguments[3] == 'function' || typeof arguments[3] == 'undefined' || arguments[3] === null)) {
		var input = arguments[0];
		var name = arguments[1];
		var data = arguments[2];
		var send = arguments[3];
		send(null);
	}
}

Websom.Controls.Bool.prototype.use = function () {
	if (arguments.length == 1 && ((arguments[0] instanceof Websom.InputChain) || typeof arguments[0] == 'undefined' || arguments[0] === null)) {
		var inputChain = arguments[0];

	}
}

Websom.DatabaseUpdate = function () {
	this.field = "";

	this.value = null;

	if (arguments.length == 2 && (typeof arguments[0] == 'string' || typeof arguments[0] == 'undefined' || arguments[0] === null) && ((arguments[1]instanceof Array || typeof arguments[1] == 'boolean' || typeof arguments[1] == 'number' || typeof arguments[1] == 'number' || typeof arguments[1] == 'object' || typeof arguments[1] == 'string') || typeof arguments[1] == 'undefined' || arguments[1] === null)) {
		var field = arguments[0];
		var value = arguments[1];
		this.field = field;
		this.value = value;
	}

}

Websom.Standard.Dashboard = function () {


}

//Relative Module
//Relative Tab
Websom.Standard.UserSystem = function () {


}

//Relative Module
//Relative User
//Relative Confirmation
//Relative UserControl
//Relative Group
//Relative Admission
Websom.Standard.PaymentSystem = function () {


}

//Relative Module
//Relative Charge
//Relative Item
//Relative Payment
//Relative RichText
//Relative RichTextControl
Websom.Standard.Rating = function () {


}

//Relative Likes
//Relative Comments
//Relative Comment
//Relative Image
//Relative ImageControl
//Relative Forum
//Relative ForumThread
//Relative ForumReply
module.exports = Websom;