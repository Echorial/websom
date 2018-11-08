<?php
class Websom {

function __construct(...$arguments) {


}

}class Websom_Server {
public $buckets;

public $bucketReference;

public $version;

public $security;

public $module;

public $resource;

public $router;

public $view;

public $theme;

public $database;

public $input;

public $crypto;

public $email;

public $render;

public $pack;

public $micro;

public $dashboard;

public $userSystem;

public $paymentSystem;

public $config;

public $scriptPath;

public $websomRoot;

public $status;

function __construct($config) {
$this->buckets = [];
$this->bucketReference = null;
$this->version = "1.0";
$this->security = null;
$this->module = null;
$this->resource = null;
$this->router = null;
$this->view = null;
$this->theme = null;
$this->database = null;
$this->input = null;
$this->crypto = null;
$this->email = null;
$this->render = null;
$this->pack = null;
$this->micro = null;
$this->dashboard = null;
$this->userSystem = null;
$this->paymentSystem = null;
$this->config = null;
$this->scriptPath = "";
$this->websomRoot = "";
$this->status = new Websom_Status();


			$this->scriptPath = __FILE__;
		

$this->websomRoot = Oxygen_FileSystem::resolve(Oxygen_FileSystem::dirName($this->scriptPath) . "/../../");
$this->config = $config;
$this->security = new Websom_Services_Security($this);
$this->database = new Websom_Services_Database($this);
$this->module = new Websom_Services_Module($this);
$this->resource = new Websom_Services_Resource($this);
$this->view = new Websom_Services_View($this);
$this->router = new Websom_Services_Router($this);
$this->theme = new Websom_Services_Theme($this);
$this->pack = new Websom_Services_Pack($this);
$this->input = new Websom_Services_Input($this);
$this->crypto = new Websom_Services_Crypto($this);
$this->email = new Websom_Services_Email($this);
$this->micro = new Websom_Services_Micro($this);
$this->render = new Websom_Services_Render($this);
$this->status->inherit($this->security->start());
$this->status->inherit($this->database->start());
$this->status->inherit($this->module->start());
$this->status->inherit($this->resource->start());
$this->status->inherit($this->view->start());
$this->status->inherit($this->router->start());
$this->status->inherit($this->theme->start());
$this->status->inherit($this->pack->start());
$this->status->inherit($this->input->start());
$this->status->inherit($this->crypto->start());
$this->status->inherit($this->email->start());
$this->status->inherit($this->micro->start());
$this->status->inherit($this->render->start());
if ($this->config->bucket) {
if (isset($this->config->bucket["reference"])) {
$this->bucketReference = $this->config->bucket["reference"];}}
}
function command($name) {
return $this->micro->command->register($name);}

function injectExpression($src) {
$this->router->injectScript = $src;}

function getBucketFromReference($referenceName) {
if (isset($this->bucketReference[$referenceName])) {
return $this->getBucket($this->bucketReference[$referenceName]["bucket"]);}
return null;}

function log($value) {
}

function request($url) {
return new Websom_RequestChain($this, $url);}

function getBucket($name) {
for ($i = 0; $i < count($this->buckets); $i++) {
if (_c_lib__arrUtils::readIndex($this->buckets, $i)->name == $name) {
return _c_lib__arrUtils::readIndex($this->buckets, $i);}}
$buckets = &$this->config->bucket["buckets"];
if (isset($buckets[$name])) {
return $this->loadBucket($name, $buckets[$name]);}}

function loadBucket($name, $raw) {
$type = $raw["type"];
$bucket = Websom_Bucket::make($this, $name, $type, $raw);
array_push($this->buckets, $bucket);
return $bucket;}

function listen($port) {


			throw new Exception("Use Websom.Server.run(string route) for php servers");
		}

function run($route) {

			$client = new Websom_Client($_SERVER["REMOTE_ADDR"], $_SERVER["REMOTE_PORT"]);
			$request = new Websom_Request($this, $client);
			$request->path = $route;
			if ($this->status->hadError) {
				echo $this->status->display();
			}
			if (isset($_POST["inputKey"])) {                                            
				if (gettype($_POST["inputKey"]) == "string" AND strlen($_POST["inputKey"]) > 0 AND strlen($_POST["inputKey"]) < 2048 AND ($_POST["data"])) {
					$data = $_POST["data"];
					if (gettype($data) == "string") {
						$data = json_decode($data, true);
					}

					$this->input->handle($_POST["inputKey"], $data, $request);
				}
			}else if (isset($_POST["bridge"])) {
				if (gettype($_POST["bridge"]) == "string" AND strlen($_POST["bridge"]) > 0 AND strlen($_POST["bridge"]) < 2048 AND 
					gettype($_POST["method"]) == "string" AND strlen($_POST["method"]) > 0 AND strlen($_POST["method"]) < 2048) {
					
					$this->module->handleBridge($request, $_POST["bridge"], $_POST["method"], isset($_POST["arguments"]) ? $_POST["arguments"] : []);
				}
			}else{
				$this->router->handle($request);
			}
		}


}//Relative Carbon
//Relative Context
//Relative Error
//Relative FileSystem
//Relative File
//Relative Stat
class Memory {

function __construct(...$arguments) {


}

}//Relative Buffer
//Relative primitive
//Relative object
class _c_lib_run {

function __construct(...$arguments) {


}
static function getClass($obj) {

			if (gettype($obj) == "object")
				return get_class($obj);
			else
				return gettype($obj);
		}


}//Relative array
class _c_lib__arrUtils {

function __construct(...$arguments) {


}
static function &readIndex(&$args, $key) {$nll = null; if (isset($args[$key])) return $args[$key]; else return $nll;}
}//Relative bool
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
class _c_lib__mapUtils {

function __construct(...$arguments) {


}
static function &readIndex(&$args, $key) {$nll = null; if (isset($args[$key])) return $args[$key]; else return $nll;}static function isMap($test) {

			if (count($test) == 0)
				return true;                       
			
			return array_keys($test) !== range(0, count($test) - 1);
		}


}class _carb_map implements Iterator, ArrayAccess, JsonSerializable {
public $index;

public $data;

function __construct() {
$this->index = 0;
$this->data = null;


			$this->data = [];
		
}
function current() {

			return $this->data[$this->key()];
		}

function jsonSerialize() {
return $this->data;}

function valid() {

			return count(array_keys($this->data)) < $this->index;
		}

function next() {

			$this->index++;
		}

function key() {

			return array_keys($this->data)[$this->index];
		}

function rewind() {
$this->index = 0;}

function offsetExists($offset) {

			return isset($this->data[$offset]);
		}

function offsetGet($offset) {

			return isset($this->data[$offset]) ? $this->data[$offset] : null;
		}

function offsetUnset($offset) {

			unset($this->data[$offset]);
		}

function offsetSet($offset, $value) {

			if (is_null($offset))
				$this->data[] = $value;
			else
				$this->data[$offset] = $value;
		}


}//Relative null
//Relative empty
//Relative void
class cbonStringShiv {

function __construct(...$arguments) {


}
static function &match($data, $reg) {
$matches = [];
preg_match($reg, $data, $matches);
return $matches;}


}//Relative string
class Websom_Service {
public $server;

function __construct($server) {
$this->server = null;

$this->server = $server;
}
function start() {
}

function stop() {
}

function end() {
}


}class Websom_Services {

function __construct(...$arguments) {


}

}class Oxygen {

function __construct(...$arguments) {


}

}class Websom_Services_Builder {
public $server;

function __construct($server) {
$this->server = null;

$this->server = $server;
}
function buildAll() {
}

function buildClass() {
}

function buildView() {
}

function buildResource() {
}

function start() {
}

function stop() {
}

function end() {
}


}class Websom_Services_Crypto {
public $server;

function __construct($server) {
$this->server = null;

$this->server = $server;
}
function start(...$arguments) {
if (count($arguments) == 0) {

}
else if (count($arguments) == 0) {

}
}

function hashPassword($password, $done) {


			$algo = PASSWORD_DEFAULT;                                                                        
			
			if (version_compare(phpversion(), "7.2", ">="))
				$algo = PASSWORD_ARGON2I;
			
			$done(password_hash($password, $algo));
		}

function verifyPassword($hash, $password, $done) {


			$done(password_verify($password, $hash));
		}

function randomHex($length, $done) {


			$done(bin2hex(random_bytes($length)));
		}

function smallId($done) {


			$done(str_replace("+", "-", str_replace("/", "_", substr(base64_encode(random_bytes(12)), 0, 12))));
		}

function longId($amount, $done) {


			$done(str_replace("+", "-", str_replace("/", "_", substr(base64_encode(random_bytes($amount)), 0, $amount))));
		}

function stop() {
}

function end() {
}


}class Websom_Services_Database {
public $primary;

public $databases;

public $server;

function __construct($server) {
$this->primary = null;
$this->databases = [];
$this->server = null;

$this->server = $server;
}
function loadDatabase($raw) {
if (isset($raw["type"]) == false) {
return Websom_Status::singleError("Services.Database", "No type provided in database config " . $raw["name"]);}
$type = $raw["type"];
$database = Websom_Database::make($this->server, $type);
if ($database == null) {
return Websom_Status::singleError("Services.Database", "Unkown database type '" . $type . "'");}
$database->load($raw);

array_push($this->databases, $database);}

function start(...$arguments) {
if (count($arguments) == 0) {
if (strlen($this->server->config->databaseFile) > 0) {
$config = Websom_Json::parse(Oxygen_FileSystem::readSync($this->server->config->databaseFile, "utf8"));
if (isset($config["databases"])) {
$databases = &$config["databases"];
for ($i = 0; $i < count($databases); $i++) {
$database = &_c_lib__arrUtils::readIndex($databases, $i);
                                                   
						$database["_c__mapC"] = true;
					
$err = $this->loadDatabase($database);
if ($err != null) {
return $err;}}}
if (isset($config["default"])) {
for ($i = 0; $i < count($this->databases); $i++) {
if (_c_lib__arrUtils::readIndex($this->databases, $i)->name == $config["default"]) {
$this->primary = _c_lib__arrUtils::readIndex($this->databases, $i);
return null;}}}}
}
else if (count($arguments) == 0) {

}
}

function stop() {
}

function end() {
}


}class Websom_Services_Email {
public $server;

function __construct($server) {
$this->server = null;

$this->server = $server;
}
function &getSender($sender) {
$raw = Websom_Json::parse(Oxygen_FileSystem::readSync($this->server->config->root . "/email.json", "utf8"));
return $raw["senders"][$sender];}

function send($sender, $email, $sent) {
if ($this->server->config->dev and $this->server->config->devSendMail == false) {
if (Oxygen_FileSystem::exists($this->server->config->root . "/dev_emails") == false) {
Oxygen_FileSystem::makeDir($this->server->config->root . "/dev_emails");}
Oxygen_FileSystem::writeSync($this->server->config->root . "/dev_emails/" . preg_replace('/'."/".'/', "_", $email->subject) . ".html", "Sender: " . $sender . "\n" . "\nRecipients: " . implode(", ", $email->recipients) . "\n\nBody:\n" . preg_replace('/'."\n".'/', "\t\n", $email->body));}else{
$rawSender = &$this->getSender($sender);


				$mail = new PHPMailer\PHPMailer\PHPMailer(true);

				$mail->isSMTP();
				$mail->Host = $rawSender["host"];
				$mail->SMTPAuth = true;
				$mail->Username = $rawSender["username"];
				$mail->Password = $rawSender["password"];
				$mail->SMTPSecure = 'ssl';
				$mail->Port = $rawSender["port"];

				$mail->SetFrom($rawSender["from"], $rawSender["fromName"]);
				foreach ($email->recipients as $res) {
					$mail->addAddress($res);
				}

				$mail->isHTML($email->html);
				$mail->Subject = $email->subject;
				$mail->Body = $email->body;

				$mail->send();

				$sent("");
			}}

function start() {
}

function stop() {
}

function end() {
}


}class Websom_Email {
public $html;

public $recipients;

public $subject;

public $body;

function __construct($recipients, $subject, $body) {
$this->html = false;
$this->recipients = null;
$this->subject = "";
$this->body = "";

$this->recipients = $recipients;
$this->body = $body;
$this->subject = $subject;
}
function attach() {
}


}class Websom_Services_Input {
public $inputs;

public $clientValidate;

public $inputTypes;

public $completed;

public $restrictHandlers;

public $server;

function __construct($server) {
$this->inputs = [];
$this->clientValidate = "";
$this->inputTypes = [];
$this->completed = new _carb_map();
$this->restrictHandlers = new _carb_map();
$this->server = null;

$this->server = $server;
}
function start(...$arguments) {
if (count($arguments) == 0) {
$this->clientValidate = $this->buildClientValidation();
$this->restriction("permission", function ($perm, $req, $callback)  {$req->getUser(function ($user) use (&$perm, &$req, &$callback) {if ($user != null) {
$user->hasPermission($perm, function ($yes) use (&$user, &$perm, &$req, &$callback) {$callback->__invoke($yes);});}else{
$callback->__invoke(false);}});});
$this->restriction("group", function ($name, $req, $callback)  {$req->getUser(function ($user) use (&$name, &$req, &$callback) {if ($user != null) {
$user->inGroup($name, function ($yes) use (&$user, &$name, &$req, &$callback) {$callback->__invoke($yes);});}else{
$callback->__invoke(false);}});});
$this->restriction("username", function ($username, $req, $callback)  {$req->getUser(function ($user) use (&$username, &$req, &$callback) {if ($user != null and $user->username == $username) {
$callback->__invoke(true);}else{
$callback->__invoke(false);}});});
$this->restriction("is", function ($type, $req, $callback)  {if ($type == "user") {
$req->getUser(function ($user) use (&$type, &$req, &$callback) {if ($user != null) {
$callback->__invoke(true);}else{
$callback->__invoke(false);}});}else{
throw new Exception("Unkown is restriction with type " . $type);}});
}
else if (count($arguments) == 0) {

}
}

function buildClientValidation() {
$strs = [];
for ($i = 0; $i < count($this->inputs); $i++) {
$input = _c_lib__arrUtils::readIndex($this->inputs, $i);
if ($input->containerInterface != null) {
$name = $input->containerInterface->dataInfo->name;
if (isset($this->completed[$name]) == false) {
$this->completed[$name] = true;
array_push($strs, "\"" . $name . "\": {" . $this->buildDataValidation($input->containerInterface->dataInfo) . "}");}}}
$seg = "";
if (count($this->inputTypes) > 0) {
$seg = ", ";}
return "<script>Websom.inputValidation = {" . implode(", ", $strs) . $seg . implode(", ", $this->inputTypes) . "};</script>";}

function restriction($key, $callback) {
$this->restrictHandlers[$key] = $callback;}

function buildDataValidation($info) {
$keys = [];
for ($i = 0; $i < count($info->fields); $i++) {
$field = _c_lib__arrUtils::readIndex($info->fields, $i);
if ($field->expose == false) {
continue;}
$type = "primitive";
if ($field->singleLink) {
$type = $field->typeRoute;}else if ($field->typeRoute == "array") {
$linked = $field->structure->getFlag("linked");
$type = $linked->fieldType;}
if ($type != "primitive") {
$dataInfo = Websom_DataInfo::getDataInfoFromRoute($type);
$name = $dataInfo->name;
if (isset($this->completed[$name]) == false) {
$this->completed[$name] = true;
array_push($this->inputTypes, "\"" . $name . "\": {" . $this->buildDataValidation($dataInfo) . "}");}}
$fieldValidation = [];
array_push($fieldValidation, "type: \"" . $type . "\"");
foreach ($field->attributes as $key => $_c_v__k0) {
if ($key == "Min" or $key == "Max" or $key == "Match" or $key == "MatchMessage" or $key == "Not" or $key == "Length") {
array_push($fieldValidation, $key . ": " . Websom_Json::encode($field->attributes[$key]));}}
array_push($keys, $field->realName . ": {" . implode(", ", $fieldValidation) . "}");}
return implode(", ", $keys);}

function register($key, $callback) {
$handler = new Websom_InputHandler($key, $callback);
array_push($this->inputs, $handler);
return $handler;}

function handle($key, $raw, $req) {
$handled = false;
for ($i = 0; $i < count($this->inputs); $i++) {
$input = _c_lib__arrUtils::readIndex($this->inputs, $i);
if ($input->key == $key) {
$handled = true;
$input->handle($raw, $req);}}
if ($handled == false) {
$req->send("Invalid key " . $key);}}

function _c__interface($key) {
$chain = null;
$handler = $this->register($key, function ($input) use (&$key, &$chain, &$handler) {$chain->received($input);});
$chain = new Websom_InputChain($handler);
return $chain;}

function stop() {
}

function end() {
}


}class Websom_InputHandler {
public $key;

public $handler;

public $containerInterface;

function __construct($key, $handler) {
$this->key = "";
$this->handler = null;
$this->containerInterface = null;

$this->key = $key;
$this->handler = $handler;
}
function handle($raw, $req) {
$input = new Websom_Input($this->key, $raw, $req);
$input->server = $req->server;
$this->handler->__invoke($input);}


}class Websom_File {
public $name;

public $path;

public $type;

public $size;

function __construct($name, $path, $size, $type) {
$this->name = "";
$this->path = "";
$this->type = "";
$this->size = 0;

$this->name = $name;
$this->path = $path;
$this->size = $size;
$this->type = $type;
}

}class Websom_Input {
public $server;

public $raw;

public $files;

public $request;

public $key;

public $route;

public $updateData;

function __construct($key, $raw, $request) {
$this->server = null;
$this->raw = null;
$this->files = new _carb_map();
$this->request = null;
$this->key = "";
$this->route = "";
$this->updateData = null;

$this->key = $key;
$this->raw = $raw;
if (isset($raw["_w_route"])) {
$this->route = $raw["_w_route"];}
$this->request = $request;
$this->server = $this->request->server;


			foreach ($_FILES as $name => $file) {
				if (is_array($file["error"])) {
					$this->files[$name] = [];
					foreach ($file["error"] as $index => $mFile) {
						array_push($this->files[$name], new Websom_File($file["name"][$index], $file["tmp_name"][$index], $file["size"][$index], $file["type"][$index]));
					}
				}else{
					$this->files[$name] = [new Websom_File($file["name"], $file["tmp_name"], $file["size"], $file["type"])];
				}
			}
		
}
function validate($val, $done) {
$val->validate($this, $done);}

function has($keys) {
for ($i = 0; $i < count($keys); $i++) {
if (isset($this->raw[_c_lib__arrUtils::readIndex($keys, $i)]) == false) {
return false;}}
return true;}

function send($raw) {
$this->request->send($raw);}

function sendAction($actionName) {
$this->request->send("{\"status\": \"action\", \"action\": " . Websom_Json::encode($actionName) . "}");}

function sendError($message) {
$this->request->send("{\"status\": \"error\", \"message\": " . Websom_Json::encode($message) . "}");}

function sendSuccess($message) {
$this->request->send("{\"status\": \"success\", \"message\": " . Websom_Json::encode($message) . "}");}

function validateCaptcha($callback) {
$that = $this;
$url = "https://www.google.com/recaptcha/api/siteverify";
if (isset($this->raw["_captcha"]) and (gettype($this->raw["_captcha"]) == 'double' ? 'float' : (gettype($this->raw["_captcha"]) == 'array' ? (isset($this->raw["_captcha"]['_c__mapC']) ? 'map' : 'array') : gettype($this->raw["_captcha"]))) == "string") {
$this->server->security->load();
$this->server->request($url)->form("response", $this->raw["_captcha"])->form("secret", $this->server->security->serviceKey)->parseJson()->post(function ($res) use (&$callback, &$that, &$url) {if ($res->hadError) {
$that->server->log($res->error);}else{
if (isset($res->data["error-codes"])) {
$that->server->log($res->data["error-codes"]);}
$callback->__invoke($res->data["success"]);}});}else{
$callback->__invoke(false);}}


}class Websom_InputValidator {

function __construct(...$arguments) {


}

}class Websom_InputValidation {
public $hadError;

public $message;

public $field;

function __construct(...$arguments) {
$this->hadError = false;
$this->message = "";
$this->field = null;

if (count($arguments) == 2 and (gettype($arguments[0]) == 'boolean' or gettype($arguments[0]) == 'NULL') and (gettype($arguments[1]) == 'string' or gettype($arguments[1]) == 'NULL')) {
$hadError = $arguments[0];
$message = $arguments[1];
$this->hadError = $hadError;
$this->message = $message;
}
else if (count($arguments) == 3 and (gettype($arguments[0]) == 'boolean' or gettype($arguments[0]) == 'NULL') and (gettype($arguments[1]) == 'string' or gettype($arguments[1]) == 'NULL') and ((_c_lib_run::getClass($arguments[2]) == 'Websom_FieldInfo') or gettype($arguments[2]) == 'NULL')) {
$hadError = $arguments[0];
$message = $arguments[1];
$field = $arguments[2];
$this->hadError = $hadError;
$this->message = $message;
$this->field = $field;
}

}
function stringify() {
if ($this->field == null) {
return $this->message;}else{
return $this->message . " on field " . $this->field->realName;}}


}class Websom_Micro {

function __construct(...$arguments) {


}

}class Websom_Services_Micro {
public $text;

public $command;

public $sitemap;

public $server;

function __construct($server) {
$this->text = null;
$this->command = null;
$this->sitemap = null;
$this->server = null;

$this->server = $server;
}
function start(...$arguments) {
if (count($arguments) == 0) {
$status = new Websom_Status();
$this->text = new Websom_Micro_Text($this->server);
$this->command = new Websom_Micro_Command($this->server);
$this->sitemap = new Websom_Micro_Sitemap($this->server);
$status->inherit($this->text->start());
$status->inherit($this->command->start());
$status->inherit($this->sitemap->start());
return $status;
}
else if (count($arguments) == 0) {

}
}

function stop() {
}

function end() {
}


}class Websom_MicroService {
public $server;

function __construct($server) {
$this->server = null;

$this->server = $server;
}

}class Websom_Services_Module {
public $modules;

public $server;

function __construct($server) {
$this->modules = [];
$this->server = null;

$this->server = $server;
}
static function requireMod($dir, $server) {
$cls = include($dir . 'module.php'); return new $cls($server);}

function rebuild() {
;
for ($i = 0; $i < count($this->modules); $i++) {
$module = _c_lib__arrUtils::readIndex($this->modules, $i);
}
$this->server->resource->build(true);
return null;}

function load($modDir, $config, $single) {
$that = $this;


$mod = Websom_Services_Module::requireMod($modDir . "/", $this->server);
$mod->root = $modDir;
for ($i = 0; $i < count($this->modules); $i++) {
if (_c_lib__arrUtils::readIndex($this->modules, $i)->root == $modDir) {
array_splice($this->modules, $i, 1);
break;}}
array_push($this->modules, $mod);
if (isset($config["assets"])) {
$assets = &$config["assets"];
for ($i = 0; $i < count($assets); $i++) {
if (_c_lib__arrUtils::readIndex($assets, $i)["name"] == "font-awesome") {
$this->server->resource->assetFontAwesome = true;}}}


			$mod->bridges = $mod->setupBridges();
		
return $mod->spawn($config);}

function loadAllContainers() {
$log = "";
for ($mi = 0; $mi < count($this->modules); $mi++) {
$mod = _c_lib__arrUtils::readIndex($this->modules, $mi);
for ($i = 0; $i < count($mod->containers); $i++) {
$container = _c_lib__arrUtils::readIndex($mod->containers, $i);
$log .= "Setup container " . $mod->name . "." . $container->name . "\n";
$container->realize($this->server->database->primary, function ($err) use (&$i, &$container, &$mi, &$mod, &$log) {if (strlen($err) > 0) {
$log .= "Error in container " . $container->name . ": " . $err . "\n";}});}}
return $log;}

function checkContainers($module) {
}

function reload($path) {

$mods = Oxygen_FileSystem::readDirSync($path);
$dash = Oxygen_FileSystem::resolve(Oxygen_FileSystem::dirName($this->server->scriptPath) . "/../../dashboard");
$core = Oxygen_FileSystem::resolve(Oxygen_FileSystem::dirName($this->server->scriptPath) . "/../../coreModule");
$this->load($dash, Websom_Json::parse(Oxygen_FileSystem::readSync($dash . "/dashboard.json", "utf8")), true);
$this->load($core, Websom_Json::parse(Oxygen_FileSystem::readSync($core . "/coreModule.json", "utf8")), true);
for ($i = 0; $i < count($this->modules); $i++) {
if (_c_lib__arrUtils::readIndex($this->modules, $i)->name == "dashboard") {
$this->server->dashboard = _c_lib__arrUtils::readIndex($this->modules, $i);}}
$doLoad = true;
if ($doLoad) {
for ($i = 0; $i < count($mods); $i++) {
$modDir = $path . _c_lib__arrUtils::readIndex($mods, $i);
if (Oxygen_FileSystem::isDir($modDir)) {
$name = Oxygen_FileSystem::basename($modDir);
if ($name != "." and $name != "..") {
$configFile = $modDir . "/" . $name . ".json";
if (Oxygen_FileSystem::exists($configFile) == false) {
return Websom_Status::singleError("Servics.Module", "Unable to find config for module " . $name);}
$config = Websom_Json::parse(Oxygen_FileSystem::readSync($configFile, "utf8"));
$status = $this->load($modDir, $config, false);
if ($status != null) {
return $status;}}}}}
for ($i = 0; $i < count($this->modules); $i++) {
$module = _c_lib__arrUtils::readIndex($this->modules, $i);
$containers = $module->setupData();
if ($containers != null) {
$module->containers = $containers;}


				$module->bridges = $module->setupBridges();
			
$this->checkContainers($module);
$status = $module->start();
if ($status != null) {
return $status;}}}

function buildModule($dir, $config) {
$name = $config["name"];
$error = null;

$error = Websom_Status::singleError("Service.Module", "Unable to build module in php.");
if ($error != null) {
return $error;}}

function buildModules($path) {
$mods = Oxygen_FileSystem::readDirSync($path);
for ($i = 0; $i < count($mods); $i++) {
$modDir = $path . _c_lib__arrUtils::readIndex($mods, $i);
if (Oxygen_FileSystem::isDir($modDir)) {
$name = Oxygen_FileSystem::basename($modDir);
if ($name != "." and $name != "..") {
$configFile = $modDir . "/" . $name . ".json";
if (Oxygen_FileSystem::exists($configFile) == false) {
return Websom_Status::singleError("Servics.Module", "Unable to find config for module " . $name);}
$config = Websom_Json::parse(Oxygen_FileSystem::readSync($configFile, "utf8"));
$status = $this->buildModule($modDir, $config);
if ($status != null) {
return $status;}}}}}

function start() {
$dir = $this->server->config->root . "/modules/";
if (Oxygen_FileSystem::exists($dir) == false) {
Oxygen_FileSystem::makeDir($dir);}
return $this->reload($dir);}

function handleBridge($req, $bridgeName, $method, $args) {
for ($i = 0; $i < count($this->modules); $i++) {
$mod = _c_lib__arrUtils::readIndex($this->modules, $i);
for ($b = 0; $b < count($mod->bridges); $b++) {
$bridge = _c_lib__arrUtils::readIndex($mod->bridges, $b);
if ($bridge->getName() != $bridgeName) {
continue;}
$server = $bridge->getServerMethods();
for ($m = 0; $m < count($server); $m++) {
if ($method == _c_lib__arrUtils::readIndex($server, $m)) {
$rtn = null;


							$pass = array_merge([$req], $args);
							$rtn = $bridge->$method(...$pass);
						
if ($rtn != null) {
$req->send(Websom_Json::encode($rtn));}
return null;}}}}}

function stop() {
}

function end() {
}


}class Websom_Services_Pack {
public $packs;

public $server;

function __construct($server) {
$this->packs = [];
$this->server = null;

$this->server = $server;
}
function load($packDir, $config) {
$that = $this;
if (isset($config["name"]) == false) {
return Websom_Status::singleError("Pack", "Must provide name in pack config " . $packDir);}
$pack = new Websom_Pack($this->server, $config["name"], $packDir, $config);
array_push($this->packs, $pack);
}

function reload($path) {
if ($this->server->config->dev) {
$dir = $this->server->config->resources . "/pack/";
if (Oxygen_FileSystem::exists($dir) == false) {
Oxygen_FileSystem::makeDir($dir);}}
$packs = Oxygen_FileSystem::readDirSync($path);
for ($i = 0; $i < count($packs); $i++) {
if (_c_lib__arrUtils::readIndex($packs, $i) == "." or _c_lib__arrUtils::readIndex($packs, $i) == "..") {
continue;}
$packDir = $path . _c_lib__arrUtils::readIndex($packs, $i);
if (Oxygen_FileSystem::isDir($packDir)) {
$configFile = $packDir . "/pack.json";
if (Oxygen_FileSystem::exists($configFile) == false) {
return Websom_Status::singleError("Servics.Pack", "Unable to find config for pack " . $packDir);}
$config = Websom_Json::parse(Oxygen_FileSystem::readSync($configFile, "utf8"));
$status = $this->load($packDir, $config);
if ($status != null) {
return $status;}}}
for ($i = 0; $i < count($this->packs); $i++) {
$pack = _c_lib__arrUtils::readIndex($this->packs, $i);
$status = $pack->start();
if ($status != null) {
return $status;}}}

function _c__include() {
$inc = "";
for ($i = 0; $i < count($this->packs); $i++) {
$inc .= _c_lib__arrUtils::readIndex($this->packs, $i)->_c__include();}
return $inc;}

function start() {
$dir = $this->server->config->root . "/packs/";
if (Oxygen_FileSystem::exists($dir) == false) {
Oxygen_FileSystem::makeDir($dir);}
return $this->reload($dir);}

function stop() {
}

function end() {
}


}class Websom_Render {

function __construct(...$arguments) {


}

}class Websom_Services_Render {
public $server;

function __construct($server) {
$this->server = null;

$this->server = $server;
}
function start() {
}

function renderView(...$arguments) {
if (count($arguments) == 2 and ((_c_lib_run::getClass($arguments[0]) == 'Websom_View') or gettype($arguments[0]) == 'NULL') and ((_c_lib_run::getClass($arguments[1]) == 'Websom_Render_Context') or gettype($arguments[1]) == 'NULL')) {
$view = $arguments[0];
$ctx = $arguments[1];
if ($view->renderView == null) {
$view->buildRenderView();}
return $view->renderView->render($ctx);
}
else if (count($arguments) == 2 and (gettype($arguments[0]) == 'string' or gettype($arguments[0]) == 'NULL') and ((_c_lib_run::getClass($arguments[1]) == 'Websom_Render_Context') or gettype($arguments[1]) == 'NULL')) {
$viewName = $arguments[0];
$ctx = $arguments[1];
$view = $this->server->view->getView($viewName);
return $this->renderView($view, $ctx);
}
}

function findView($name) {
$view = $this->server->view->getView($name);
if ($view != null) {
if ($view->renderView == null) {
$view->buildRenderView();}
return $view->renderView;}else{
return null;}}

function stop() {
}

function end() {
}


}class Websom_Services_Resource {
public $globalScripts;

public $globalStyles;

public $deployConfig;

public $assetFontAwesome;

public $deployHandlers;

public $server;

function __construct($server) {
$this->globalScripts = [];
$this->globalStyles = [];
$this->deployConfig = null;
$this->assetFontAwesome = false;
$this->deployHandlers = [];
$this->server = null;

$this->server = $server;
}
function start() {
array_push($this->deployHandlers, new Websom_FtpHandler($this->server));
array_push($this->deployHandlers, new Websom_LocalHandler($this->server));}

function loadDeployConfig() {
if ($this->deployConfig == null) {
$path = $this->server->config->root . "/deploy.json";
if (Oxygen_FileSystem::exists($path) == false) {
Oxygen_FileSystem::writeSync($path, "{\n\t\"deploys\": []\n}");}
$this->deployConfig = Websom_Json::parse(Oxygen_FileSystem::readSync($path, "utf8"));}}

function deploy(...$arguments) {
if (count($arguments) == 2 and (gettype($arguments[0]) == 'string' or gettype($arguments[0]) == 'NULL') and (is_callable($arguments[1]) or gettype($arguments[1]) == 'NULL')) {
$name = $arguments[0];
$callback = $arguments[1];
$this->deploy($name, function ($msg) use (&$name, &$callback) {;}, $callback);
}
else if (count($arguments) == 3 and (gettype($arguments[0]) == 'string' or gettype($arguments[0]) == 'NULL') and (is_callable($arguments[1]) or gettype($arguments[1]) == 'NULL') and (is_callable($arguments[2]) or gettype($arguments[2]) == 'NULL')) {
$name = $arguments[0];
$progress = $arguments[1];
$callback = $arguments[2];
$this->loadDeployConfig();
$progress->__invoke("Searching for deploy " . $name);
$deploy = &$this->findDeploy($name);
if ($deploy == null) {
$progress->__invoke("Unknown deploy " . $name);
$callback->__invoke();
return null;}
$handler = $this->findHandler($deploy["handler"]);
if ($handler == null) {
$progress->__invoke("Unknown handler " . $name);
$callback->__invoke();
return null;}
$handler->execute($deploy, $progress, $callback);
}
}

function findHandler($name) {
for ($i = 0; $i < count($this->deployHandlers); $i++) {
if (_c_lib__arrUtils::readIndex($this->deployHandlers, $i)->name == $name) {
return _c_lib__arrUtils::readIndex($this->deployHandlers, $i);}}
return null;}

function &findDeploy($name) {
$cast = &$this->deployConfig["deploys"];
for ($i = 0; $i < count($cast); $i++) {
if (_c_lib__arrUtils::readIndex($cast, $i)["name"] == $name) {
return _c_lib__arrUtils::readIndex($cast, $i);}}
return null;}

function buildViews($saveToFiles) {
$viewStr = "";
for ($i = 0; $i < count($this->server->module->modules); $i++) {
$module = _c_lib__arrUtils::readIndex($this->server->module->modules, $i);
$bridges = &$module->bridges;
for ($b = 0; $b < count($bridges); $b++) {
$bridge = _c_lib__arrUtils::readIndex($bridges, $b);
$methods = [];


					$client = $bridge->clientMethods();
					$server = $bridge->serverMethods();
					foreach ($client as $c => $val) {
						$methods[] = ($c . ": " . $client[$c]);
					}

					foreach ($server as $s => $val) {
						$methods[] = ($server[$s] . ": function () {return new Promise((done) ="."> {Websom.sendBridge('" . $bridge->name . "', '" . $server[$s] . "', arguments, done);})}");
					}
				
$viewStr .= $bridge->getName() . " = {" . implode(", ", $methods) . "};";}
if (isset($module->baseConfig["resources"])) {
$raw = &$module->baseConfig["resources"];
for ($r = 0; $r < count($raw); $r++) {
$res = &_c_lib__arrUtils::readIndex($raw, $r);
$type = "";
$path = $res["path"];
if (isset($res["type"]) == false) {
$realPath = Oxygen_FileSystem::resolve($module->root . "/" . $path);
if (Oxygen_FileSystem::isDir($realPath)) {
$files = Oxygen_FileSystem::readDirSync($realPath);
for ($f = 0; $f < count($files); $f++) {
$file = _c_lib__arrUtils::readIndex($files, $f);
$splits = explode(".", $file);
if (count($splits) > 1) {
if (_c_lib__arrUtils::readIndex($splits, count($splits) - 1) == "view") {
$view = new Websom_View($this->server);
$viewErr = $view->loadFromFile($realPath . "/" . $file);
$view->hasLocalExport = true;
$viewStr .= $view->buildDev();}}}}}else{
$type = $res["type"];
if ($type == "view") {
$view = new Websom_View($this->server);
$viewErr = $view->loadFromFile(Oxygen_FileSystem::resolve($module->root . "/" . $path));
$view->hasLocalExport = true;
$viewStr .= $view->buildDev();}}}}
if ($saveToFiles) {
Oxygen_FileSystem::writeSync($this->server->config->resources . "/module-view-" . $module->name . ".js", $viewStr);
$viewStr = "";}}
if ($saveToFiles == false) {
return $viewStr;}}

function exportToFolder($path, $callback) {
$that = $this;
Oxygen_FileSystem::writeSync($path . "/client.js", Oxygen_FileSystem::readSync($this->server->config->resources . "/client.js", null));
Oxygen_FileSystem::writeSync($path . "/jquery.min.js", Oxygen_FileSystem::readSync($this->server->config->resources . "/jquery.min.js", null));
if (Oxygen_FileSystem::exists($this->server->config->resources . "/text.js")) {
Oxygen_FileSystem::writeSync($path . "/text.js", Oxygen_FileSystem::readSync($this->server->config->resources . "/text.js", null));}
$resources = &$this->collect();
$unbuilt = count($resources) + count($this->server->theme->themes);
$error = false;
$errMsg = "";
$totalJs = $this->buildViews(false);
$totalCss = "";
for ($i = 0; $i < count($this->server->view->pages); $i++) {
$page = _c_lib__arrUtils::readIndex($this->server->view->pages, $i);
$totalJs .= $page->buildDev();}
for ($i = 0; $i < count($this->server->view->views); $i++) {
$view = _c_lib__arrUtils::readIndex($this->server->view->views, $i);
$totalJs .= $view->buildDev();}
$finish = function () use (&$path, &$callback, &$that, &$resources, &$unbuilt, &$error, &$errMsg, &$totalJs, &$totalCss, &$finish, &$builtJs, &$builtCss, &$files) {$closureCompiler = function ($content, $compiledBack) use (&$closureCompiler, &$writeOut, &$path, &$callback, &$that, &$resources, &$unbuilt, &$error, &$errMsg, &$totalJs, &$totalCss, &$finish, &$builtJs, &$builtCss, &$files) {};
$writeOut = function ($vue) use (&$closureCompiler, &$writeOut, &$path, &$callback, &$that, &$resources, &$unbuilt, &$error, &$errMsg, &$totalJs, &$totalCss, &$finish, &$builtJs, &$builtCss, &$files) {$closureCompiler->__invoke(Oxygen_FileSystem::readSync($that->server->config->resources . "/jquery.min.js", "utf8") . "\n" . $vue . "\n" . Oxygen_FileSystem::readSync($that->server->config->resources . "/client.js", "utf8") . "\n" . $totalJs, function ($compiled) use (&$vue, &$closureCompiler, &$writeOut, &$path, &$callback, &$that, &$resources, &$unbuilt, &$error, &$errMsg, &$totalJs, &$totalCss, &$finish, &$builtJs, &$builtCss, &$files) {Oxygen_FileSystem::writeSync($path . "/js.js", $compiled);
Oxygen_FileSystem::writeSync($path . "/css.css", $totalCss);
$callback->__invoke($error, $errMsg);});};
};
for ($i = 0; $i < count($this->server->theme->themes); $i++) {
$theme = _c_lib__arrUtils::readIndex($this->server->theme->themes, $i);
$theme->build(function ($err, $js, $css) use (&$i, &$theme, &$path, &$callback, &$that, &$resources, &$unbuilt, &$error, &$errMsg, &$totalJs, &$totalCss, &$finish, &$builtJs, &$builtCss, &$files) {$totalJs .= $js;
$totalCss .= $css;
$unbuilt--;
if ($unbuilt <= 0) {
$finish->__invoke();}});}
$builtJs = function ($hadError, $content) use (&$path, &$callback, &$that, &$resources, &$unbuilt, &$error, &$errMsg, &$totalJs, &$totalCss, &$finish, &$builtJs, &$builtCss, &$files) {if ($hadError) {
$error = true;
$errMsg = $content;}
$unbuilt--;
$totalJs .= $content . "\n\n";
if ($unbuilt <= 0) {
$finish->__invoke();}};
$builtCss = function ($hadError, $content) use (&$path, &$callback, &$that, &$resources, &$unbuilt, &$error, &$errMsg, &$totalJs, &$totalCss, &$finish, &$builtJs, &$builtCss, &$files) {if ($hadError) {
$error = true;
$errMsg = $content;}
$unbuilt--;
$totalCss .= $content;
if ($unbuilt <= 0) {
$finish->__invoke();}};
$files = &$this->collect();
for ($i = 0; $i < count($files); $i++) {
$file = _c_lib__arrUtils::readIndex($files, $i);
if ($file->type == "file") {
$base = Oxygen_FileSystem::basename(_c_lib__arrUtils::readIndex($files, $i)->file);
$bpath = $base;
if (_c_lib__arrUtils::readIndex($files, $i)->raw != null) {
if (isset(_c_lib__arrUtils::readIndex($files, $i)->raw["toPath"])) {
$toPath = _c_lib__arrUtils::readIndex($files, $i)->raw["toPath"];
$bpath = $toPath . "/" . $base;
if (Oxygen_FileSystem::exists($path . "/" . $toPath) == false) {
Oxygen_FileSystem::makeDir($path . "/" . $toPath);}}}
_c_lib__arrUtils::readIndex($files, $i)->buildToFile($path . "/" . $bpath);}}
for ($i = 0; $i < count($resources); $i++) {
$resource = _c_lib__arrUtils::readIndex($resources, $i);
if ($resource->type == "less" or $resource->type == "css") {
$resource->build($builtCss);}else if ($resource->type == "javascript") {
$resource->build($builtJs);}else{
$unbuilt--;
if ($unbuilt <= 0) {
$finish->__invoke();}}}}

function &collect() {
$that = $this;
$output = [];
$buildPackage = function ($typeStr, $name, $root, $raw) use (&$that, &$output, &$buildPackage) {for ($r = 0; $r < count($raw); $r++) {
$res = &_c_lib__arrUtils::readIndex($raw, $r);
$type = "";
$path = $res["path"];
if (isset($res["type"]) == false) {
$realPath = Oxygen_FileSystem::resolve($root . "/" . $path);
if (Oxygen_FileSystem::isDir($realPath)) {
$files = Oxygen_FileSystem::readDirSync($realPath);
for ($f = 0; $f < count($files); $f++) {
$file = _c_lib__arrUtils::readIndex($files, $f);
$splits = explode(".", $file);
if (count($splits) > 1) {
if (_c_lib__arrUtils::readIndex($splits, count($splits) - 1) == "view") {
array_push($output, Websom_Resource::make($that->server, "view", $typeStr . "-" . $name, $realPath . "/" . $file));}}}}}else{
$type = $res["type"];
$realPath = Oxygen_FileSystem::resolve($root . "/" . $path);
if (Oxygen_FileSystem::isDir($realPath)) {
$files = Oxygen_FileSystem::readDirSync($realPath);
for ($f = 0; $f < count($files); $f++) {
$file = _c_lib__arrUtils::readIndex($files, $f);
array_push($output, Websom_Resource::make($that->server, $type, $typeStr . "-" . $name, $realPath . "/" . $file));
_c_lib__arrUtils::readIndex($output, count($output) - 1)->raw = $res;}}else{
$resource = Websom_Resource::make($that->server, $type, $typeStr . "-" . $name, $realPath);
if (isset($res["loadOrder"])) {
$cast = $res["loadOrder"];
$resource->order = $cast;}
array_push($output, $resource);}}}};
for ($i = 0; $i < count($this->server->module->modules); $i++) {
$module = _c_lib__arrUtils::readIndex($this->server->module->modules, $i);
if (isset($module->baseConfig["resources"])) {
$raw = &$module->baseConfig["resources"];
$buildPackage->__invoke("module", $module->name, $module->root, $raw);}}
return $output;}

function build($dev) {
if (Oxygen_FileSystem::exists($this->server->config->resources) == false) {
Oxygen_FileSystem::makeDir($this->server->config->resources);}
$files = &$this->collect();
$err = $this->buildViews(true);
if ($err != null) {
return Websom_Status::singleError("View", $err);}
if ($dev) {
if (Oxygen_FileSystem::exists($this->server->config->resources . "/jquery.min.js") == false) {
Oxygen_FileSystem::writeSync($this->server->config->resources . "/jquery.min.js", Oxygen_FileSystem::readSync($this->server->websomRoot . "/client/javascript/jquery.min.js", "utf8"));}
$client = new Websom_Resources_Javascript($this->server, "Websom.Core", $this->server->websomRoot . "/client/javascript/client.js");
$input = new Websom_Resources_Javascript($this->server, "Websom.Core", $this->server->websomRoot . "/client/javascript/input.js");
$theme = new Websom_Resources_Javascript($this->server, "Websom.Core", $this->server->websomRoot . "/client/javascript/theme.js");
Oxygen_FileSystem::writeSync($this->server->config->resources . "/client.js", $client->read() . $theme->read() . $input->read());
for ($i = 0; $i < count($files); $i++) {
$base = Oxygen_FileSystem::basename(_c_lib__arrUtils::readIndex($files, $i)->file);
if (_c_lib__arrUtils::readIndex($files, $i)->type == "less") {
$base = preg_replace('/'."\\.[^\\.]+\$".'/', "", $base) . ".css";}
$path = _c_lib__arrUtils::readIndex($files, $i)->owner . "-" . $base;
if (_c_lib__arrUtils::readIndex($files, $i)->raw != null) {
if (isset(_c_lib__arrUtils::readIndex($files, $i)->raw["toPath"])) {
$toPath = _c_lib__arrUtils::readIndex($files, $i)->raw["toPath"];
$path = $toPath . "/" . $base;
if (Oxygen_FileSystem::exists($this->server->config->resources . "/" . $toPath) == false) {
Oxygen_FileSystem::makeDir($this->server->config->resources . "/" . $toPath);}}}
_c_lib__arrUtils::readIndex($files, $i)->buildToFile($this->server->config->resources . "/" . $path);}}}

function _c__include($dev) {
$output = "";
if ($dev) {
$output .= "<script src=\"" . $this->server->config->clientResources . "/jquery.min.js\"></script>";
$files = &$this->collect();
for ($i = 0; $i < count($files); $i++) {
$output .= _c_lib__arrUtils::readIndex($files, $i)->toHtmlInclude() . "\n";}
for ($i = 0; $i < count($this->server->module->modules); $i++) {
$output .= "<script src='" . $this->server->config->clientResources . "/module-view-" . _c_lib__arrUtils::readIndex($this->server->module->modules, $i)->name . ".js'></script>";}}
if ($this->assetFontAwesome) {
$output .= "<link rel=\"stylesheet\" href=\"https:/" . "/use.fontawesome.com/releases/v5.3.1/css/all.css\" integrity=\"sha384-mzrmE5qonljUremFsqc01SB46JvROS7bZs3IO2EmfFsd15uHvIt+Y8vEf7N7fWAU\" crossorigin=\"anonymous\">";}
return $output;}

function &compile($owner, $basePath, $resources) {
$output = [];
for ($i = 0; $i < count($resources); $i++) {
$raw = &_c_lib__arrUtils::readIndex($resources, $i);
if (isset($raw["type"]) and isset($raw["path"])) {
$realPath = Oxygen_FileSystem::resolve($basePath . "/" . $raw["path"]);
if (Oxygen_FileSystem::exists($realPath)) {
if (Oxygen_FileSystem::isDir($realPath)) {
$files = Oxygen_FileSystem::readDirSync($realPath);
for ($f = 0; $f < count($files); $f++) {
$file = _c_lib__arrUtils::readIndex($files, $f);
array_push($output, Websom_Resource::make($this->server, $raw["type"], $owner, $realPath . "/" . $file));
_c_lib__arrUtils::readIndex($output, count($output))->raw = $raw;}}else{
array_push($output, Websom_Resource::make($this->server, $raw["type"], $owner, $realPath));}}else{
array_push($output, Websom_Resource::invalid($this->server, $owner, $realPath));}}else if (isset($raw["path"])) {
$realPath = Oxygen_FileSystem::resolve($basePath . "/" . $raw["path"]);
if (Oxygen_FileSystem::isDir($realPath)) {
$files = Oxygen_FileSystem::readDirSync($realPath);
for ($f = 0; $f < count($files); $f++) {
$file = _c_lib__arrUtils::readIndex($files, $f);
$splits = explode(".", $file);
if (count($splits) > 1) {
if (_c_lib__arrUtils::readIndex($splits, count($splits) - 1) == "view") {
array_push($output, Websom_Resource::make($this->server, "view", $owner, $realPath . "/" . $file));}}}}}else{
array_push($output, Websom_Resource::invalid($this->server, $owner, "Unkown"));}}
return $output;}

function stop() {
}

function end() {
}


}class Websom_DeployHandler {
public $name;

public $server;

function __construct($server) {
$this->name = "";
$this->server = null;

$this->server = $server;
}
function getFiles($callback) {
}


}class Websom_FtpHandler {
public $name;

public $server;

function __construct($server) {
$this->name = "ftp";
$this->server = null;

$this->server = $server;
}
function execute($config, $progress, $finish) {
}

function getFiles($callback) {
}


}class Websom_LocalHandler {
public $name;

public $server;

function __construct($server) {
$this->name = "local";
$this->server = null;

$this->server = $server;
}
function execute($config, $progress, $finish) {
}

function getFiles($callback) {
}


}class Websom_Resource {
public $server;

public $owner;

public $file;

public $type;

public $order;

public $isInvalid;

public $reference;

public $raw;

function __construct($server, $owner, $file) {
$this->server = null;
$this->owner = "";
$this->file = "";
$this->type = "resource";
$this->order = 0;
$this->isInvalid = false;
$this->reference = "";
$this->raw = null;

$this->owner = $owner;
$this->file = $file;
$this->server = $server;
}
static function make($server, $type, $owner, $file) {
if ($type == "javascript") {
return new Websom_Resources_Javascript($server, $owner, $file);}else if ($type == "css") {
return new Websom_Resources_Css($server, $owner, $file);}else if ($type == "less") {
return new Websom_Resources_Less($server, $owner, $file);}else if ($type == "view") {
return new Websom_Resources_View($server, $owner, $file);}else if ($type == "file") {
return new Websom_Resources_File($server, $owner, $file);}else{
$invalid = new Websom_Resource($server, $owner, $file);
$invalid->isInvalid = true;
return $invalid;}}

static function invalid($server, $owner, $path) {
$invalid = new Websom_Resource($server, $owner, $path);
$invalid->isInvalid = true;
return $invalid;}

function read() {
return Oxygen_FileSystem::readSync($this->file, "utf8");}

function rawRead() {
return Oxygen_FileSystem::readSync($this->file, null);}


}class Websom_Resources {

function __construct(...$arguments) {


}

}class Websom_Resources_Javascript {
public $type;

public $server;

public $owner;

public $file;

public $order;

public $isInvalid;

public $reference;

public $raw;

function __construct($server, $owner, $file) {
$this->type = "javascript";
$this->server = null;
$this->owner = "";
$this->file = "";
$this->order = 0;
$this->isInvalid = false;
$this->reference = "";
$this->raw = null;

$this->owner = $owner;
$this->file = $file;
$this->server = $server;
}
function buildToFile($path) {
Oxygen_FileSystem::writeSync($path, $this->read());}

function toHtmlInclude() {
return "<script src=\"" . $this->server->config->clientResources . "/" . $this->owner . "-" . Oxygen_FileSystem::basename($this->file) . "\"></script>";}

function build($callback) {
$callback->__invoke(false, $this->read());}

static function make($server, $type, $owner, $file) {
if ($type == "javascript") {
return new Websom_Resources_Javascript($server, $owner, $file);}else if ($type == "css") {
return new Websom_Resources_Css($server, $owner, $file);}else if ($type == "less") {
return new Websom_Resources_Less($server, $owner, $file);}else if ($type == "view") {
return new Websom_Resources_View($server, $owner, $file);}else if ($type == "file") {
return new Websom_Resources_File($server, $owner, $file);}else{
$invalid = new Websom_Resource($server, $owner, $file);
$invalid->isInvalid = true;
return $invalid;}}

static function invalid($server, $owner, $path) {
$invalid = new Websom_Resource($server, $owner, $path);
$invalid->isInvalid = true;
return $invalid;}

function read() {
return Oxygen_FileSystem::readSync($this->file, "utf8");}

function rawRead() {
return Oxygen_FileSystem::readSync($this->file, null);}


}class Websom_Resources_File {
public $type;

public $server;

public $owner;

public $file;

public $order;

public $isInvalid;

public $reference;

public $raw;

function __construct($server, $owner, $file) {
$this->type = "file";
$this->server = null;
$this->owner = "";
$this->file = "";
$this->order = 0;
$this->isInvalid = false;
$this->reference = "";
$this->raw = null;

$this->owner = $owner;
$this->file = $file;
$this->server = $server;
}
function buildToFile($path) {
Oxygen_FileSystem::writeSync($path, $this->rawRead());}

function toHtmlInclude() {
return "";}

function build($callback) {
$callback->__invoke(false, $this->read());}

static function make($server, $type, $owner, $file) {
if ($type == "javascript") {
return new Websom_Resources_Javascript($server, $owner, $file);}else if ($type == "css") {
return new Websom_Resources_Css($server, $owner, $file);}else if ($type == "less") {
return new Websom_Resources_Less($server, $owner, $file);}else if ($type == "view") {
return new Websom_Resources_View($server, $owner, $file);}else if ($type == "file") {
return new Websom_Resources_File($server, $owner, $file);}else{
$invalid = new Websom_Resource($server, $owner, $file);
$invalid->isInvalid = true;
return $invalid;}}

static function invalid($server, $owner, $path) {
$invalid = new Websom_Resource($server, $owner, $path);
$invalid->isInvalid = true;
return $invalid;}

function read() {
return Oxygen_FileSystem::readSync($this->file, "utf8");}

function rawRead() {
return Oxygen_FileSystem::readSync($this->file, null);}


}class Websom_Resources_View {
public $type;

public $server;

public $owner;

public $file;

public $order;

public $isInvalid;

public $reference;

public $raw;

function __construct($server, $owner, $file) {
$this->type = "view";
$this->server = null;
$this->owner = "";
$this->file = "";
$this->order = 0;
$this->isInvalid = false;
$this->reference = "";
$this->raw = null;

$this->owner = $owner;
$this->file = $file;
$this->server = $server;
}
function buildToFile($path) {
}

function toHtmlInclude() {
return "";}

function build($callback) {
$view = new Websom_View($this->server);
$view->loadFromFile($this->file);
$callback->__invoke(false, $view->buildDev());}

static function make($server, $type, $owner, $file) {
if ($type == "javascript") {
return new Websom_Resources_Javascript($server, $owner, $file);}else if ($type == "css") {
return new Websom_Resources_Css($server, $owner, $file);}else if ($type == "less") {
return new Websom_Resources_Less($server, $owner, $file);}else if ($type == "view") {
return new Websom_Resources_View($server, $owner, $file);}else if ($type == "file") {
return new Websom_Resources_File($server, $owner, $file);}else{
$invalid = new Websom_Resource($server, $owner, $file);
$invalid->isInvalid = true;
return $invalid;}}

static function invalid($server, $owner, $path) {
$invalid = new Websom_Resource($server, $owner, $path);
$invalid->isInvalid = true;
return $invalid;}

function read() {
return Oxygen_FileSystem::readSync($this->file, "utf8");}

function rawRead() {
return Oxygen_FileSystem::readSync($this->file, null);}


}class Websom_Resources_Css {
public $type;

public $server;

public $owner;

public $file;

public $order;

public $isInvalid;

public $reference;

public $raw;

function __construct($server, $owner, $file) {
$this->type = "css";
$this->server = null;
$this->owner = "";
$this->file = "";
$this->order = 0;
$this->isInvalid = false;
$this->reference = "";
$this->raw = null;

$this->owner = $owner;
$this->file = $file;
$this->server = $server;
}
function buildToFile($path) {
Oxygen_FileSystem::writeSync($path, $this->read());}

function toHtmlInclude() {
return "<link rel=\"stylesheet\" href=\"" . $this->server->config->clientResources . "/" . $this->owner . "-" . Oxygen_FileSystem::basename($this->file) . "\"/>";}

function build($callback) {
$callback->__invoke(false, $this->read());}

static function make($server, $type, $owner, $file) {
if ($type == "javascript") {
return new Websom_Resources_Javascript($server, $owner, $file);}else if ($type == "css") {
return new Websom_Resources_Css($server, $owner, $file);}else if ($type == "less") {
return new Websom_Resources_Less($server, $owner, $file);}else if ($type == "view") {
return new Websom_Resources_View($server, $owner, $file);}else if ($type == "file") {
return new Websom_Resources_File($server, $owner, $file);}else{
$invalid = new Websom_Resource($server, $owner, $file);
$invalid->isInvalid = true;
return $invalid;}}

static function invalid($server, $owner, $path) {
$invalid = new Websom_Resource($server, $owner, $path);
$invalid->isInvalid = true;
return $invalid;}

function read() {
return Oxygen_FileSystem::readSync($this->file, "utf8");}

function rawRead() {
return Oxygen_FileSystem::readSync($this->file, null);}


}class Websom_Resources_Less {
public $type;

public $server;

public $owner;

public $file;

public $order;

public $isInvalid;

public $reference;

public $raw;

function __construct($server, $owner, $file) {
$this->type = "less";
$this->server = null;
$this->owner = "";
$this->file = "";
$this->order = 0;
$this->isInvalid = false;
$this->reference = "";
$this->raw = null;

$this->owner = $owner;
$this->file = $file;
$this->server = $server;
}
function buildToFile($path) {
$this->build(function ($err, $content) use (&$path) {Oxygen_FileSystem::writeSync($path, $content);});}

function toHtmlInclude() {
$basename = Oxygen_FileSystem::basename($this->file);
return "<link rel=\"stylesheet\" href=\"" . $this->server->config->clientResources . "/" . $this->owner . "-" . preg_replace('/'."\\.[^\\.]+\$".'/', "", $basename) . ".css\"/>";}

function build($callback) {


			$path = realpath(dirname(__FILE__) . "/../../core/util/native/less.php");
			$lessBuilder = require($path);

			$func = $lessBuilder["compileLess"];
			$func($this->file, $callback);
		}

static function make($server, $type, $owner, $file) {
if ($type == "javascript") {
return new Websom_Resources_Javascript($server, $owner, $file);}else if ($type == "css") {
return new Websom_Resources_Css($server, $owner, $file);}else if ($type == "less") {
return new Websom_Resources_Less($server, $owner, $file);}else if ($type == "view") {
return new Websom_Resources_View($server, $owner, $file);}else if ($type == "file") {
return new Websom_Resources_File($server, $owner, $file);}else{
$invalid = new Websom_Resource($server, $owner, $file);
$invalid->isInvalid = true;
return $invalid;}}

static function invalid($server, $owner, $path) {
$invalid = new Websom_Resource($server, $owner, $path);
$invalid->isInvalid = true;
return $invalid;}

function read() {
return Oxygen_FileSystem::readSync($this->file, "utf8");}

function rawRead() {
return Oxygen_FileSystem::readSync($this->file, null);}


}class Websom_Services_Router {
public $routes;

public $injectScript;

public $server;

function __construct($server) {
$this->routes = [];
$this->injectScript = "";
$this->server = null;

$this->server = $server;
}
function route($routeString, $handler) {
$splits = $this->buildSplits($routeString);
$route = new Websom_Route($routeString, $splits, $handler);
array_push($this->routes, $route);
return $route;}

function post($routeString, $handler) {
$splits = $this->buildSplits($routeString);
$route = new Websom_Route($routeString, $splits, null);
$route->postHandler = $handler;
$route->post = true;
array_push($this->routes, $route);
return $route;}

function start() {
for ($i = 0; $i < count($this->server->view->pages); $i++) {
$view = _c_lib__arrUtils::readIndex($this->server->view->pages, $i);
$this->routeView($view);}
$that = $this;
if ($this->server->config->dev) {
$this->route("/websom.info", function ($req) use (&$that) {$info = [];
array_push($info, "<tr><th>Website root</th><th>" . $that->server->config->root . "</th></tr>");
$req->send("<h1>Websom server info</h1><br><table><thead><th>Info</th><th>Value</th></thead><tbody>" . implode("", $info) . "</tbody></table>");});}}

function injectSends($req, $clientData, $readyToSend) {
$clientDatas = count($this->server->module->modules);
for ($i = 0; $i < count($this->server->module->modules); $i++) {
$mod = _c_lib__arrUtils::readIndex($this->server->module->modules, $i);
$shouldWait = $mod->clientData($req, function ($key, $value) use (&$i, &$mod, &$shouldWait, &$req, &$clientData, &$readyToSend, &$clientDatas) {$clientDatas--;
$clientData[$key] = $value;
if ($clientDatas == 0) {
$readyToSend->__invoke();}});
if ($shouldWait == false) {
$clientDatas--;}
if ($clientDatas == 0) {
$readyToSend->__invoke();}}}

function _c__include() {
if ($this->server->config->dev) {
return "<script src=\"https:/" . "/cdn.jsdelivr.net/npm/vue/dist/vue.js\"></script><script src=\"" . $this->server->config->clientResources . "/client.js\"></script>" . $this->server->view->_c__include() . $this->server->resource->_c__include(true) . $this->server->theme->_c__include() . $this->server->input->clientValidate . "<script src=\"" . $this->server->config->clientResources . "/text.js\"></script>";}else{
return "<script src=\"" . $this->server->config->clientResources . "/js.js\"></script>" . "<link rel=\"stylesheet\" href=\"" . $this->server->config->clientResources . "/css.css\">" . "<script src=\"" . $this->server->config->clientResources . "/text.js\"></script>";}}

function includeAfter() {
if ($this->server->config->dev == false) {
return $this->server->resource->_c__include(false);}}

function wrapPage($content) {
$metas = "";
if ($this->server->config->hasManifest) {
$metas .= "<link rel='manifest' href='" . $this->server->config->manifestPath . "'>";}
return "<!DOCTYPE html><html lang=\"en\"><head><meta name='viewport' content='width=device-width, initial-scale=1'><meta name='theme-color' content='" . $this->server->config->brandColor . "'/>" . $metas . $this->_c__include() . "</head><body>" . $content . $this->includeAfter() . "</body></html>";}

function sendStringView($req, $template) {
$themeClass = "theme";
if (strlen($this->server->config->defaultTheme) > 0) {
$themeClass = "theme-" . $this->server->config->defaultTheme;}
$req->send($this->wrapPage("<script>Websom.Client = {};</script><div id='page' class='" . $themeClass . "'>" . $template . "</div><script>document.body.setAttribute('class', document.getElementById('page').getAttribute('class'));page = new Vue({el: '#page', data: {data: {}}});</script>"));}

function routeString($route, $template) {
$that = $this;
return $this->route($route, function ($req) use (&$route, &$template, &$that) {$data = new _carb_map();
$themeClass = "theme";
if (strlen($that->server->config->defaultTheme) > 0) {
$themeClass = "theme-" . $that->server->config->defaultTheme;}
$clientData = new _carb_map();
$clientDatas = 0;
$readyToSend = function () use (&$req, &$data, &$themeClass, &$clientData, &$clientDatas, &$readyToSend, &$route, &$template, &$that) {$rawClientData = Websom_Json::encode($clientData);
if ($rawClientData == "null") {
$rawClientData = "{}";}
$req->send($that->wrapPage("<script>Websom.Client = " . $rawClientData . "; " . $that->injectScript . "</script><div id='page' class='" . $themeClass . "'>" . $template . "</div><script>document.body.setAttribute('class', document.getElementById('page').getAttribute('class'));page = new Vue({el: '#page', data: {data: {}}});</script>"));};
$that->injectSends($req, $clientData, $readyToSend);});}

function navView(...$arguments) {
if (count($arguments) == 6 and (gettype($arguments[0]) == 'string' or gettype($arguments[0]) == 'NULL') and (gettype($arguments[1]) == 'string' or gettype($arguments[1]) == 'NULL') and (gettype($arguments[2]) == 'string' or gettype($arguments[2]) == 'NULL') and (gettype($arguments[3]) == 'string' or gettype($arguments[3]) == 'NULL') and (gettype($arguments[4]) == 'boolean' or gettype($arguments[4]) == 'NULL') and (gettype($arguments[5]) == 'string' or gettype($arguments[5]) == 'NULL')) {
$routeStr = $arguments[0];
$container = $arguments[1];
$view = $arguments[2];
$validate = $arguments[3];
$canEdit = $arguments[4];
$editKey = $arguments[5];
$canEditStr = "false";
if ($canEdit) {
$canEditStr = "true";}
$route = $this->routeString($routeStr, "<default-body content-type='navView' container='" . $container . "' auto='true' view-name='" . $view . "'><nav-view validate='" . $validate . "' container='" . $container . "' edit-key='" . $editKey . "' view='" . $view . "' :show-edit='" . $canEditStr . "' /></default-body>");
$route->greedy = true;
return $route;
}
else if (count($arguments) == 7 and (gettype($arguments[0]) == 'string' or gettype($arguments[0]) == 'NULL') and (gettype($arguments[1]) == 'string' or gettype($arguments[1]) == 'NULL') and (gettype($arguments[2]) == 'string' or gettype($arguments[2]) == 'NULL') and (gettype($arguments[3]) == 'string' or gettype($arguments[3]) == 'NULL') and (gettype($arguments[4]) == 'string' or gettype($arguments[4]) == 'NULL') and (gettype($arguments[5]) == 'boolean' or gettype($arguments[5]) == 'NULL') and (gettype($arguments[6]) == 'string' or gettype($arguments[6]) == 'NULL')) {
$routeStr = $arguments[0];
$container = $arguments[1];
$view = $arguments[2];
$validate = $arguments[3];
$publicKey = $arguments[4];
$canEdit = $arguments[5];
$editKey = $arguments[6];
$canEditStr = "false";
if ($canEdit) {
$canEditStr = "true";}
$route = $this->routeString($routeStr, "<default-body content-type='navView' container='" . $container . "' auto='true' view-name='" . $view . "'><nav-view :show-save='false' validate='" . $validate . "' public-key='" . $publicKey . "' container='" . $container . "' edit-key='" . $editKey . "' view='" . $view . "' :show-edit='" . $canEditStr . "' /></default-body>");
$route->greedy = true;
return $route;
}
}

function quickRoute($route, $viewName) {
$that = $this;
return $this->route($route, function ($req) use (&$route, &$viewName, &$that) {$data = new _carb_map();
$themeClass = "theme";
if (strlen($that->server->config->defaultTheme) > 0) {
$themeClass = "theme-" . $that->server->config->defaultTheme;}
$clientData = new _carb_map();
$clientDatas = 0;
$readyToSend = function () use (&$req, &$data, &$themeClass, &$clientData, &$clientDatas, &$readyToSend, &$route, &$viewName, &$that) {$rawClientData = Websom_Json::encode($clientData);
if ($rawClientData == "null") {
$rawClientData = "{}";}
$req->send($that->wrapPage("<script>Websom.Client = " . $rawClientData . "; " . $that->injectScript . "</script><div id='page' class='" . $themeClass . "'><" . $viewName . " v-bind:data='data'></" . $viewName . "></div><script>document.body.setAttribute('class', document.getElementById('page').getAttribute('class'));page = new Vue({el: '#page', data: {data: {}}});</script>"));};
$that->injectSends($req, $clientData, $readyToSend);});}

function routeView($view) {
$that = $this;
$r = $this->route($view->handles, function ($req) use (&$view, &$that, &$r) {$data = new _carb_map();
if ($view->hasServerScript) {
$data = $view->runServerScript($req);}
$themeClass = "theme";
if (strlen($that->server->config->defaultTheme) > 0) {
$themeClass = "theme-" . $that->server->config->defaultTheme;}
$clientData = new _carb_map();
$clientDatas = 0;
$readyToSend = function () use (&$req, &$data, &$themeClass, &$clientData, &$clientDatas, &$readyToSend, &$view, &$that, &$r) {$rawClientData = Websom_Json::encode($clientData);
$content = "<script>document.body.setAttribute('class', document.getElementById('page').getAttribute('class'));page = new Vue({el: '#page', data: {data: " . json_encode($data->data) . "}}); \$('#server-static').remove();</script>";
$serverStatic = "";
$ctx = new Websom_Render_Context();
if ($that->server->config->forceSsr) {
$content = $that->server->render->renderView($view, $ctx);}else{
}
if ($rawClientData == "null") {
$rawClientData = "{}";}
$req->send($that->wrapPage($serverStatic . "<script>Websom.Client = " . $rawClientData . "; " . $that->injectScript . "</script><div id='page' class='" . $themeClass . "'><" . $view->name . " v-bind:data='data'></" . $view->name . "></div>" . $content));};
$that->injectSends($req, $clientData, $readyToSend);});
$r->greedy = $view->greedy;}

function buildSplits($route) {
return explode("/", $route);}

function find($query, $post) {
$splits = $this->buildSplits($query);
for ($i = 0; $i < count($this->routes); $i++) {
$route = _c_lib__arrUtils::readIndex($this->routes, $i);
if ($route->match($splits) and $route->post == $post) {
return $route;}}
return null;}

function handle($req) {
$route = $this->find($req->path, false);
if ($route == null) {
$req->code(404);
$req->send("Error page not found.");}else{
$route->handle($req);}}

function handlePost($raw, $req) {
$input = new Websom_Input("", $raw, $req);
$input->server = $this->server;
$route = $this->find($req->path, true);
if ($route == null) {
$req->code(404);
$req->send("Error route not found.");}else{
$route->handlePost($input);}}

function stop() {
}

function end() {
}


}class Websom_Route {
public $greedy;

public $post;

public $route;

public $splits;

public $handler;

public $postHandler;

function __construct(...$arguments) {
$this->greedy = false;
$this->post = false;
$this->route = "";
$this->splits = null;
$this->handler = null;
$this->postHandler = null;

if (count($arguments) == 3 and (gettype($arguments[0]) == 'string' or gettype($arguments[0]) == 'NULL') and ((gettype($arguments[1]) == 'array') or gettype($arguments[1]) == 'NULL') and (is_callable($arguments[2]) or gettype($arguments[2]) == 'NULL')) {
$route = $arguments[0];
$splits = $arguments[1];
$handler = $arguments[2];
$this->route = $route;
$this->splits = $splits;
$this->handler = $handler;
}
else if (count($arguments) == 3 and (gettype($arguments[0]) == 'string' or gettype($arguments[0]) == 'NULL') and ((gettype($arguments[1]) == 'array') or gettype($arguments[1]) == 'NULL') and (is_callable($arguments[2]) or gettype($arguments[2]) == 'NULL')) {
$route = $arguments[0];
$splits = $arguments[1];
$handler = $arguments[2];
$this->route = $route;
$this->splits = $splits;
$this->postHandler = $handler;
}

}
function match($otherSplits) {
if ($this->greedy == false) {
if (count($this->splits) != count($otherSplits)) {
return false;}}
if (count($this->splits) > count($otherSplits)) {
return false;}
if ($this->greedy) {
for ($i = 0; $i < count($this->splits); $i++) {
$split = _c_lib__arrUtils::readIndex($this->splits, $i);
if ($split != _c_lib__arrUtils::readIndex($otherSplits, $i)) {
return false;}}}else{
for ($i = 0; $i < count($otherSplits); $i++) {
if (_c_lib__arrUtils::readIndex($otherSplits, $i) != _c_lib__arrUtils::readIndex($this->splits, $i)) {
return false;}}}
return true;}

function handle($req) {
$this->handler->__invoke($req);}

function handlePost($input) {
$this->postHandler->__invoke($input);}


}class Websom_Services_Security {
public $loaded;

public $captchaService;

public $serviceKey;

public $publicKey;

public $configPath;

public $updateLimit;

public $insertLimit;

public $selectLimit;

public $message;

public $interval;

public $server;

function __construct($server) {
$this->loaded = false;
$this->captchaService = "";
$this->serviceKey = "";
$this->publicKey = "";
$this->configPath = "";
$this->updateLimit = 6;
$this->insertLimit = 3;
$this->selectLimit = 60;
$this->message = "Too many requests.";
$this->interval = 60000;
$this->server = null;

$this->server = $server;
}
function start(...$arguments) {
if (count($arguments) == 0) {
$this->configPath = $this->server->config->root . "/security.json";
$this->load();
$this->server->injectExpression("Websom.Captcha = {publicKey: " . Websom_Json::encode($this->publicKey) . "};");
}
else if (count($arguments) == 0) {

}
}

function load() {
if ($this->loaded == false) {
$this->loaded = true;
if (Oxygen_FileSystem::exists($this->configPath)) {
$config = Websom_Json::parse(Oxygen_FileSystem::readSync($this->configPath, "utf8"));
$this->captchaService = $config["captchaService"];
$this->serviceKey = $config["serviceKey"];
$this->publicKey = $config["publicKey"];
$this->selectLimit = $config["selectLimit"];
$this->insertLimit = $config["insertLimit"];
$this->updateLimit = $config["updateLimit"];
$this->message = $config["requestLimitMessage"];}else{
Oxygen_FileSystem::writeSync($this->configPath, "{\n\t\"captchaService\": \"none\",\n\t\"publicKey\": \"\",\n\t\"serviceKey\": \"\",\n\t\"updateLimit\": 6,\n\t\"insertLimit\": 3,\n\t\"selectLimit\": 60,\n\t\"requestLimitMessage\": \"Too many requests.\"\n}");}}}

function verify($callback) {
$this->load();}

function countRequest($type, $opts, $input) {
$this->load();
$history = $input->request->session->get("_w_history_" . $type);
if ($history == null) {
$nHistory = new _carb_map();
$nHistory["a"] = 1;
$nHistory["t"] = Websom_Time::now();
$input->request->session->set("_w_history_" . $type, $nHistory);}else{
$amount = $history["a"];
$history["a"] = $amount + 1;
$input->request->session->set("_w_history_" . $type, $history);}}

function request($type, $opts, $input, $callback) {
$this->load();
$history = $input->request->session->get("_w_history_" . $type);
if ($history == null) {
$callback->__invoke();}else{
$limit = $this->selectLimit;
if ($type == "update") {
$limit = $this->updateLimit;}else if ($type == "insert") {
$limit = $this->insertLimit;}
$amount = $history["a"];
$timestamp = $history["t"];
$now = Websom_Time::now();
$diff = $now - $timestamp;
if ($amount > $limit) {
if ($diff >= $this->interval) {
$updated = new _carb_map();
$updated["a"] = 0;
$updated["t"] = $now;
$input->request->session->set("_w_history_" . $type, $updated);
$callback->__invoke();}else{
$input->sendError($this->message);}}else{
$callback->__invoke();}}}

function stop() {
}

function end() {
}


}class Websom_Services_Theme {
public $themes;

public $server;

function __construct($server) {
$this->themes = [];
$this->server = null;

$this->server = $server;
}
function load($themeDir, $config) {
$that = $this;
if (isset($config["name"]) == false) {
return Websom_Status::singleError("Theme", "Must provide name in theme config " . $themeDir);}
$theme = new Websom_Theme($this->server, $config["name"], $themeDir, $config);
array_push($this->themes, $theme);
}

function reload($path) {
$themes = Oxygen_FileSystem::readDirSync($path);
for ($i = 0; $i < count($themes); $i++) {
$themeDir = $path . _c_lib__arrUtils::readIndex($themes, $i);
if (Oxygen_FileSystem::isDir($themeDir)) {
$name = Oxygen_FileSystem::basename($themeDir);
if ($name != "." and $name != "..") {
$configFile = $themeDir . "/" . $name . ".json";
if (Oxygen_FileSystem::exists($configFile) == false) {
return Websom_Status::singleError("Servics.Theme", "Unable to find config for theme " . $name);}
$config = Websom_Json::parse(Oxygen_FileSystem::readSync($configFile, "utf8"));
$status = $this->load($themeDir, $config);
if ($status != null) {
return $status;}}}}
for ($i = 0; $i < count($this->themes); $i++) {
$theme = _c_lib__arrUtils::readIndex($this->themes, $i);
$status = $theme->start();
if ($status != null) {
return $status;}}}

function _c__include() {
$inc = "";
for ($i = 0; $i < count($this->themes); $i++) {
$inc .= _c_lib__arrUtils::readIndex($this->themes, $i)->_c__include();}
return $inc;}

function start() {
$dir = $this->server->config->root . "/themes/";
if (Oxygen_FileSystem::exists($dir) == false) {
Oxygen_FileSystem::makeDir($dir);}
$themeDir = Oxygen_FileSystem::resolve(Oxygen_FileSystem::dirName($this->server->scriptPath) . "/../../theme/");
$config = Websom_Json::parse(Oxygen_FileSystem::readSync($themeDir . "/theme.json", "utf8"));
$status = $this->load($themeDir, $config);
if ($status != null) {
return $status;}
return $this->reload($dir);}

function stop() {
}

function end() {
}


}class Websom_Services_View {
public $pages;

public $views;

public $moduleViews;

public $server;

function __construct($server) {
$this->pages = [];
$this->views = [];
$this->moduleViews = null;
$this->server = null;

$this->server = $server;
}
function start() {
$status = new Websom_Status();
$refresh = false;
if ($this->server->config->dev) {
$refresh = true;}

if ($this->server->config->refreshViews) {
$refresh = true;}
if ($refresh == false) {
if (Oxygen_FileSystem::exists($this->server->config->root . "/viewCache.json") == false) {
$refresh = true;}}
if ($refresh) {
if (Oxygen_FileSystem::exists($this->server->config->root . "/pages")) {
$status->inherit($this->loadPages($this->server->config->root . "/pages/"));}
if (Oxygen_FileSystem::exists($this->server->config->root . "/views")) {
$status->inherit($this->loadViews($this->server->config->root . "/views/"));}
$this->moduleViews = $this->getModuleViews();
$this->buildCache();}else{
$this->loadCache();}
return $status;}

function &serializeViews($views) {
$vs = [];
for ($i = 0; $i < count($views); $i++) {
$view = _c_lib__arrUtils::readIndex($views, $i);
array_push($vs, $view->serialize());}
return $vs;}

function &loadViewCache($data) {
$views = [];
for ($i = 0; $i < count($data); $i++) {
$d = &_c_lib__arrUtils::readIndex($data, $i);
$v = new Websom_View($this->server);
$v->deserialize($d);
$v->shallow = true;
array_push($views, $v);}
return $views;}

function loadCache() {
$data = Websom_Json::parse(Oxygen_FileSystem::readSync($this->server->config->root . "/viewCache.json", "utf8"));
$this->moduleViews = $this->loadViewCache($data["module"]);
$this->pages = $this->loadViewCache($data["page"]);
$this->views = $this->loadViewCache($data["view"]);}

function buildCache() {
$cache = new _carb_map();
$cache["module"] = $this->serializeViews($this->moduleViews);
$cache["page"] = $this->serializeViews($this->pages);
$cache["view"] = $this->serializeViews($this->views);
Oxygen_FileSystem::writeSync($this->server->config->root . "/viewCache.json", Websom_Json::encode($cache));}

function getView($name) {
for ($i = 0; $i < count($this->views); $i++) {
if (_c_lib__arrUtils::readIndex($this->views, $i)->name == $name) {
return _c_lib__arrUtils::readIndex($this->views, $i);}}
for ($i = 0; $i < count($this->moduleViews); $i++) {
if (_c_lib__arrUtils::readIndex($this->moduleViews, $i)->name == $name) {
return _c_lib__arrUtils::readIndex($this->moduleViews, $i);}}
return null;}

function &getModuleViews() {
$views = [];
for ($i = 0; $i < count($this->server->module->modules); $i++) {
$module = _c_lib__arrUtils::readIndex($this->server->module->modules, $i);
if (isset($module->baseConfig["resources"])) {
$raw = &$module->baseConfig["resources"];
for ($r = 0; $r < count($raw); $r++) {
$res = &_c_lib__arrUtils::readIndex($raw, $r);
$type = "";
$path = $res["path"];
if (isset($res["type"]) == false) {
$realPath = Oxygen_FileSystem::resolve($module->root . "/" . $path);
if (Oxygen_FileSystem::isDir($realPath)) {
$files = Oxygen_FileSystem::readDirSync($realPath);
for ($f = 0; $f < count($files); $f++) {
$file = _c_lib__arrUtils::readIndex($files, $f);
$splits = explode(".", $file);
if (count($splits) > 1) {
if (_c_lib__arrUtils::readIndex($splits, count($splits) - 1) == "view") {
$view = new Websom_View($this->server);
$view->owner = $module;
$viewErr = $view->loadFromFile($realPath . "/" . $file);
$view->hasLocalExport = true;
array_push($views, $view);}}}}}else{
$type = $res["type"];
if ($type == "view") {
$view = new Websom_View($this->server);
$view->owner = $module;
$viewErr = $view->loadFromFile(Oxygen_FileSystem::resolve($module->root . "/" . $path));
$view->hasLocalExport = true;
array_push($views, $view);}}}}}
return $views;}

function buildDev($to) {
$output = "";
for ($i = 0; $i < count($this->views); $i++) {
$view = _c_lib__arrUtils::readIndex($this->views, $i);
$output .= $view->buildDev();}
Oxygen_FileSystem::writeSync($to, $output);}

function _c__include() {
$file = $this->server->config->resources . "/view.js";
if ($this->server->config->dev) {
$this->buildDev($file);}else{
}
return "<script src=\"" . $this->server->config->clientResources . "/view.js\"></script>";}

function loadPage($path) {
$page = new Websom_View($this->server);
$err = $page->loadFromFile($path);
$page->websiteView = true;
if ($err != null) {
return $err;}
$page->isPage = true;
array_push($this->pages, $page);
array_push($this->views, $page);
if ($this->server->config->dev) {
}}

function loadView($path) {
$view = new Websom_View($this->server);
$err = $view->loadFromFile($path);
$view->websiteView = true;
if ($err != null) {
return $err;}
array_push($this->views, $view);
if ($this->server->config->dev) {
}}

function loadPages($dir) {
$files = Oxygen_FileSystem::readDirSync($dir);
for ($i = 0; $i < count($files); $i++) {
$file = _c_lib__arrUtils::readIndex($files, $i);
if (Oxygen_FileSystem::isDir($dir . $file)) {
continue;}
$splits = explode(".", $file);
if (count($splits) > 1) {
if (_c_lib__arrUtils::readIndex($splits, count($splits) - 1) == "view") {
$err = $this->loadPage($dir . $file);
if ($err != null) {
return $err;}}}}}

function loadViews($dir) {
$files = Oxygen_FileSystem::readDirSync($dir);
for ($i = 0; $i < count($files); $i++) {
$file = _c_lib__arrUtils::readIndex($files, $i);
if (Oxygen_FileSystem::isDir($dir . $file)) {
continue;}
$splits = explode(".", $file);
if (count($splits) > 1) {
if (_c_lib__arrUtils::readIndex($splits, count($splits) - 1) == "view") {
$err = $this->loadView($dir . $file);
if ($err != null) {
return $err;}}}}}

function stop() {
}

function end() {
}


}class Websom_Bridge {
public $server;

function __construct($server) {
$this->server = null;

$this->server = $server;
}
function getName() {
return $this->name;
}

function getServerMethods() {


			return $this->serverMethods();
		}


}class Websom_Bucket {
public $server;

public $raw;

public $name;

function __construct($server, $name, $raw) {
$this->server = null;
$this->raw = null;
$this->name = "";

$this->server = $server;
$this->raw = $raw;
$this->name = $name;
$this->created();
}
function created() {
}

static function make($server, $name, $type, $raw) {
if ($type == "local") {
return new Websom_Buckets_Local($server, $name, $raw);}}


}class Websom_Buckets {

function __construct(...$arguments) {


}

}class Websom_Buckets_Local {
public $realPath;

public $server;

public $raw;

public $name;

function __construct($server, $name, $raw) {
$this->realPath = "";
$this->server = null;
$this->raw = null;
$this->name = "";

$this->server = $server;
$this->raw = $raw;
$this->name = $name;
$this->created();
}
function created() {
$path = $this->raw["path"];
$this->realPath = Oxygen_FileSystem::resolve($this->server->config->root . "/" . $path) . "/";}

function write($file, $content, $done) {
Oxygen_FileSystem::writeSync($this->realPath . $file, $content);
$done->__invoke("");}

function read($file, $done) {
$done->__invoke(true, Oxygen_FileSystem::readSync($this->realPath . $file, "utf8"));}

function makeDir($dir, $done) {
if (Oxygen_FileSystem::exists($this->realPath . $dir) == false) {
Oxygen_FileSystem::makeDir($this->realPath . $dir);}
$done->__invoke(true);}

static function make($server, $name, $type, $raw) {
if ($type == "local") {
return new Websom_Buckets_Local($server, $name, $raw);}}


}class Websom_Client {
public $address;

public $port;

public $family;

public $localAddress;

public $localPort;

function __construct($address, $port) {
$this->address = "";
$this->port = "";
$this->family = "";
$this->localAddress = "";
$this->localPort = "";

$this->address = $address;
$this->port = $port;
}

}class Websom_Config {
public $data;

public $https;

public $name;

public $brandColor;

public $url;

public $hasManifest;

public $manifestPath;

public $root;

public $sslVerifyPeer;

public $bucket;

public $bucketFile;

public $javascriptOutput;

public $cssOutput;

public $resources;

public $restrictedResources;

public $absolute;

public $defaultTheme;

public $cache;

public $dev;

public $devSendMail;

public $forceSsr;

public $clientResources;

public $databaseFile;

public $gzip;

public $refreshViews;

function __construct() {
$this->data = null;
$this->https = false;
$this->name = "";
$this->brandColor = "white";
$this->url = "localhost";
$this->hasManifest = true;
$this->manifestPath = "/resources/manifest.json";
$this->root = "";
$this->sslVerifyPeer = true;
$this->bucket = null;
$this->bucketFile = "";
$this->javascriptOutput = "";
$this->cssOutput = "";
$this->resources = "";
$this->restrictedResources = "";
$this->absolute = "";
$this->defaultTheme = "";
$this->cache = "";
$this->dev = false;
$this->devSendMail = false;
$this->forceSsr = false;
$this->clientResources = "";
$this->databaseFile = "";
$this->gzip = false;
$this->refreshViews = false;


}
static function load($path) {
$out = parse_ini_file($path);
$config = new Websom_Config();
$config->name = $out["name"];
$config->absolute = Oxygen_FileSystem::dirName($path) . "/";
$config->root = Oxygen_FileSystem::resolve($config->absolute . $out["website"]);
$config->javascriptOutput = $out["javascript"];
$config->cssOutput = $out["css"];
if (isset($out["https"])) {
if ($out["https"] === "1") {
$config->https = true;}}
if (isset($out["theme"])) {
$config->defaultTheme = $out["theme"];}
if (isset($out["brandColor"])) {
$config->brandColor = $out["brandColor"];}
if (isset($out["manifest"])) {
if ($out["manifest"] !== "1") {
$config->hasManifest = false;}}
if (isset($out["forceSsr"])) {
if ($out["forceSsr"] === "1") {
$config->forceSsr = true;}}
if (isset($out["sslVerifyPeer"])) {
if ($out["sslVerifyPeer"] !== "1") {
$config->sslVerifyPeer = false;}}
if (isset($out["gzip"])) {
if ($out["gzip"] === "1") {
$config->gzip = true;}}
if (isset($out["refreshViews"])) {
if ($out["refreshViews"] === "1") {
$config->refreshViews = true;}}
if (isset($out["manifestPath"])) {
$config->manifestPath = $out["manifestPath"];}
if (isset($out["bucket"])) {
$file = $out["bucket"];
$config->bucketFile = Oxygen_FileSystem::resolve(Oxygen_FileSystem::dirName($path) . "/" . $file);
$config->bucket = Websom_Json::parse(Oxygen_FileSystem::readSync($config->bucketFile, "utf8"));}
if (isset($out["resources"])) {
$config->resources = $out["resources"];
if (Oxygen_FileSystem::exists($config->resources) == false) {
$config->resources = Oxygen_FileSystem::resolve($config->absolute . $out["resources"]);}}else{
$config->resources = Oxygen_FileSystem::resolve($config->absolute . "./resources");}
if (isset($out["restrictedResources"])) {
$config->restrictedResources = $out["restrictedResources"];
if (Oxygen_FileSystem::exists($config->restrictedResources) == false) {
$config->restrictedResources = Oxygen_FileSystem::resolve($config->absolute . $out["restrictedResources"]);}}else{
$config->resources = Oxygen_FileSystem::resolve($config->absolute . "./private");}
if (isset($out["clientResources"])) {
$config->clientResources = $out["clientResources"];}
if (isset($out["database"])) {
$file = $out["database"];
$config->databaseFile = Oxygen_FileSystem::resolve(Oxygen_FileSystem::dirName($path) . "/" . $file);}
if (isset($out["dev"])) {
if ($out["dev"] === "1") {
$config->dev = true;}}
if (isset($out["url"])) {
$config->url = $out["url"];}
if (isset($out["devSendMail"])) {
if ($out["devSendMail"] === "1") {
$config->devSendMail = true;}}
$config->cache = $config->root . "/tmp/cache/";
return $config;}


}class Websom_Containers {

function __construct(...$arguments) {


}

}class Websom_Container {
public $server;

public $name;

public $dataInfo;

public $parentContainer;

public $interfaces;

function __construct(...$arguments) {
$this->server = null;
$this->name = "";
$this->dataInfo = null;
$this->parentContainer = null;
$this->interfaces = [];


}
function checkRestrictions($opts, $inp, $mode, $field, $callback) {
for ($i = 0; $i < count($opts->restricts); $i++) {
$r = _c_lib__arrUtils::readIndex($opts->restricts, $i);
if ($r->field == $field->realName and $r->mode == "global" or $r->mode == $mode) {
if ($r->simple) {
$ct = &$this->server->input->restrictHandlers;
if (isset($ct[$r->key])) {
$handler = $this->server->input->restrictHandlers[$r->key];
$handler->__invoke($r->value, $inp->request, function ($passed) use (&$handler, &$ct, &$i, &$r, &$opts, &$inp, &$mode, &$field, &$callback) {$callback->__invoke($passed);});
return null;}else{
throw new Exception("Custom restriction " . $r->key . " not found in request to container " . $this->name);}}else{
if ($r->callback != null) {
$r->callback->__invoke(function ($passed) use (&$i, &$r, &$opts, &$inp, &$mode, &$field, &$callback) {$callback->__invoke($passed);});}else{
throw new Exception("Restrict callback on field " . $field->realName . " in container interface " . $this->name . " is null. Did you forget interface.to(void () => {})?");}
return null;}}}
$callback->__invoke(true);}

function interfaceInsert($opts, $input) {
$that = $this;
if ($opts->canInsert) {
if ($opts->overrideInsert != null) {
$opts->overrideInsert->__invoke($input);}else{
if ($opts->mustLogin or $opts->mustOwnInsert) {
if ($this->server->userSystem->isLoggedIn($input->request) == false) {
$msg = Websom_ClientMessage::quickError("Please login.");
$input->send($msg->stringify());
return null;}}
$this->server->security->request("insert", $opts, $input, function () use (&$opts, &$input, &$that) {$v = new Websom_DataValidator($that->dataInfo);
$v->validate($input, function ($msg) use (&$v, &$opts, &$input, &$that) {if ($msg->hadError) {
$input->sendError($msg->stringify());}else{
$dones = 0;
$values = &$input->raw;
$clientMessage = new Websom_ClientMessage();
$clientMessage->message = $opts->baseSuccess;
$dones+=count($opts->controls) + count($opts->insertControls);
$checkDone = function () use (&$dones, &$values, &$clientMessage, &$checkDone, &$runControl, &$msg, &$v, &$opts, &$input, &$that) {if ($dones == 0) {
if ($clientMessage->hadError) {
$input->send($clientMessage->stringify());}else{
$that->insertFromInterface($opts, $input, $values, $clientMessage, null, null, new Websom_CallContext());}}};
$runControl = function ($control) use (&$dones, &$values, &$clientMessage, &$checkDone, &$runControl, &$msg, &$v, &$opts, &$input, &$that) {$control->validate($input, function ($cMsg) use (&$control, &$dones, &$values, &$clientMessage, &$checkDone, &$runControl, &$msg, &$v, &$opts, &$input, &$that) {$dones--;
if ($cMsg != null and $cMsg->hadError) {
$clientMessage->add($cMsg);
$checkDone->__invoke();}else{
$control->fill($input, $values, function () use (&$cMsg, &$control, &$dones, &$values, &$clientMessage, &$checkDone, &$runControl, &$msg, &$v, &$opts, &$input, &$that) {$checkDone->__invoke();});}});};
for ($i = 0; $i < count($opts->controls); $i++) {
$control = _c_lib__arrUtils::readIndex($opts->controls, $i);
$runControl->__invoke($control);}
for ($i = 0; $i < count($opts->insertControls); $i++) {
$control = _c_lib__arrUtils::readIndex($opts->insertControls, $i);
$runControl->__invoke($control);}
if (count($opts->controls) + count($opts->insertControls) == 0) {
if ($dones == 0) {
$that->server->security->countRequest("insert", $opts, $input);
$that->insertFromInterface($opts, $input, $values, $clientMessage, null, null, new Websom_CallContext());}}}});});}}else{
if ($this->server->config->dev) {
$input->send("Invalid(Dev: This container has no insert interface)");}else{
$input->send("Invalid");}}}

function interfaceSelect($opts, $input, $ctx) {
}

function interfaceSend($opts, $input) {
$that = $this;
if ($opts->canInterface) {
if (isset($input->raw["publicId"]) and isset($input->raw["route"]) and isset($input->raw["data"])) {
$obj = $that->dataInfo->spawn($that->server);
$obj->websomServer = $this->server;
$obj->loadFromPublicKey($that, $input->raw["publicId"], function ($err) use (&$obj, &$opts, &$input, &$that) {$talkingTo = $obj;
if (isset($input->raw["sub"])) {


							if (gettype($input->raw["sub"])) {
								$splits = explode(".", $input->raw["sub"]);
								for ($i = 0; $i < count($splits); $i++) {
									$split = $splits[$i];
									if (method_exists($talkingTo->$split, "getField")) {
										$talkingTo = $talkingTo->$split;
									}else{
										break;
									}
								}
							}
						}
$talkingTo->onInputInterface($input, $input->raw["route"], $input->raw["data"], function ($response) use (&$err, &$talkingTo, &$obj, &$opts, &$input, &$that) {$input->send(Websom_Json::encode($response));});});}else{
if ($this->server->config->dev) {
$input->send("Invalid(Dev: No 'publicId', 'route', or 'data' key found in query)");}else{
$input->send("Invalid");}}}}

function interfaceUpdate($opts, $input) {
$that = $this;
if ($opts->canUpdate) {
if ($opts->overrideUpdate != null) {
$opts->overrideUpdate->__invoke($input);}else{
if ($opts->mustLogin or $opts->mustOwnUpdate) {
if ($this->server->userSystem->isLoggedIn($input->request) == false) {
$cMsg = Websom_ClientMessage::quickError("Please login.");
$input->send($cMsg->stringify());
return null;}}
if (isset($input->raw["publicId"]) == false or (gettype($input->raw["publicId"]) == 'double' ? 'float' : (gettype($input->raw["publicId"]) == 'array' ? (isset($input->raw["publicId"]['_c__mapC']) ? 'map' : 'array') : gettype($input->raw["publicId"]))) != "string") {
$qMsg = Websom_ClientMessage::quickError("Invalid publicId");
$input->send($qMsg->stringify());
return null;}
$publicId = $input->raw["publicId"];
if (strlen($publicId) < 10 or strlen($publicId) > 256) {
$qMsg = Websom_ClientMessage::quickError("Invalid publicId");
$input->send($qMsg->stringify());
return null;}
$this->server->security->request("update", $opts, $input, function () use (&$publicId, &$opts, &$input, &$that) {$v = new Websom_DataValidator($that->dataInfo);
$v->validate($input, function ($msg) use (&$v, &$publicId, &$opts, &$input, &$that) {if ($msg->hadError) {
$input->sendError($msg->stringify());}else{
$dones = 0;
$values = &$input->raw;
$clientMessage = new Websom_ClientMessage();
$clientMessage->message = $opts->baseSuccess;
$dones+=count($opts->controls) + count($opts->updateControls);
$cast = $that;
$update = $that->server->database->primary->from($cast->table)->where("publicId")->equals($publicId)->update();
$obj = $that->dataInfo->spawn($that->server);
$checkDone = function () use (&$dones, &$values, &$clientMessage, &$cast, &$update, &$obj, &$checkDone, &$msg, &$v, &$publicId, &$opts, &$input, &$that) {if ($dones == 0) {
if ($clientMessage->hadError) {
$input->send($clientMessage->stringify());}else{
$that->updateFromInterface($opts, $update, $obj, $input, $values, $clientMessage);}}};
$obj->loadFromPublicKey($that, $publicId, function ($err) use (&$dones, &$values, &$clientMessage, &$cast, &$update, &$obj, &$checkDone, &$msg, &$v, &$publicId, &$opts, &$input, &$that) {$shouldContinue = true;
$doContinue = function () use (&$err, &$shouldContinue, &$doContinue, &$dones, &$values, &$clientMessage, &$cast, &$update, &$obj, &$checkDone, &$msg, &$v, &$publicId, &$opts, &$input, &$that) {$runControl = function ($control) use (&$runControl, &$err, &$shouldContinue, &$doContinue, &$dones, &$values, &$clientMessage, &$cast, &$update, &$obj, &$checkDone, &$msg, &$v, &$publicId, &$opts, &$input, &$that) {$control->validate($input, function ($cMsg) use (&$control, &$runControl, &$err, &$shouldContinue, &$doContinue, &$dones, &$values, &$clientMessage, &$cast, &$update, &$obj, &$checkDone, &$msg, &$v, &$publicId, &$opts, &$input, &$that) {$dones--;
if ($cMsg != null and $cMsg->hadError) {
$clientMessage->add($cMsg);
$checkDone->__invoke();}else{
$control->fill($input, $values, function () use (&$cMsg, &$control, &$runControl, &$err, &$shouldContinue, &$doContinue, &$dones, &$values, &$clientMessage, &$cast, &$update, &$obj, &$checkDone, &$msg, &$v, &$publicId, &$opts, &$input, &$that) {$checkDone->__invoke();});}});};
for ($i = 0; $i < count($opts->controls); $i++) {
$control = _c_lib__arrUtils::readIndex($opts->controls, $i);
$runControl->__invoke($control);}
for ($i = 0; $i < count($opts->updateControls); $i++) {
$runControl->__invoke(_c_lib__arrUtils::readIndex($opts->updateControls, $i));}
if (count($opts->controls) + count($opts->updateControls) == 0) {
if ($dones == 0) {
$that->server->security->countRequest("update", $opts, $input);
$that->updateFromInterface($opts, $update, $obj, $input, $values, $clientMessage);}}};
if ($opts->mustOwnUpdate) {
$that->server->userSystem->getLoggedIn($input->request, function ($user) use (&$err, &$shouldContinue, &$doContinue, &$dones, &$values, &$clientMessage, &$cast, &$update, &$obj, &$checkDone, &$msg, &$v, &$publicId, &$opts, &$input, &$that) {

											if ($user->id != $obj->owner->id) {
												$shouldContinue = false;
											}
										
if ($shouldContinue == false) {
$cMsg = Websom_ClientMessage::quickError("You do not own this.");
$input->send($cMsg->stringify());}else{
$doContinue->__invoke();}});}else{
$doContinue->__invoke();}});}});});}}else{
if ($this->server->config->dev) {
$input->send("Invalid(Dev: This container has no update interface)");}else{
$input->send("Invalid");}}}

function interface(...$arguments) {
if (count($arguments) == 1 and (gettype($arguments[0]) == 'string' or gettype($arguments[0]) == 'NULL')) {
$route = $arguments[0];
return new Websom_InterfaceChain($this, $route);
}
else if (count($arguments) == 1 and ((_c_lib_run::getClass($arguments[0]) == 'Websom_InterfaceOptions') or gettype($arguments[0]) == 'NULL')) {
$opts = $arguments[0];
array_push($this->interfaces, $opts);
}
}

function getInterface($route) {
for ($i = 0; $i < count($this->interfaces); $i++) {
if (_c_lib__arrUtils::readIndex($this->interfaces, $i)->route == $route) {
return _c_lib__arrUtils::readIndex($this->interfaces, $i);}}
return null;}

function getDataFromRoute($route) {


			$clsName = str_replace(".", "_", $route);
			return $clsName;
		}

function registerSubContainer($field, $routeInfo) {
$that = $this;
$name = $this->name . "_" . $field->fieldName;
$subContainer = new Websom_Containers_Table($this->server, $name, $routeInfo);
$subContainer->parentContainer = $this;
for ($i = 0; $i < count($this->interfaces); $i++) {
$_c__interface = _c_lib__arrUtils::readIndex($this->interfaces, $i);
if ($_c__interface->subs[$field->fieldName] != null) {
$subContainer->interface($_c__interface->subs[$field->fieldName]);}}
if (count($subContainer->interfaces) > 0) {
$handler = $subContainer->register();
$handler->containerInterface = $subContainer;
return $handler;}}

function register() {
$that = $this;
for ($i = 0; $i < count($this->dataInfo->fields); $i++) {
$f = _c_lib__arrUtils::readIndex($this->dataInfo->fields, $i);
if ($f->singleLink and $f->isPrimitive == false) {
$t = Websom_DataInfo::getDataInfoFromRoute($f->typeRoute);
$fi = $this->getDataFromRoute($f->typeRoute);
if (isset($t->attributes["Component"])) {
$name = $this->name . "_" . $f->fieldName;
$componentContainer = new Websom_Containers_Table($that->server, $name, $t);
$close = function ($fix, $type, $field) use (&$name, &$componentContainer, &$close, &$t, &$fi, &$i, &$f, &$that, &$handler) {$getContainer = function ($fieldName) use (&$fix, &$type, &$field, &$getContainer, &$name, &$componentContainer, &$close, &$t, &$fi, &$i, &$f, &$that, &$handler) {$fieldInfo = null;
for ($fii = 0; $fii < count($type->fields); $fii++) {
if (_c_lib__arrUtils::readIndex($type->fields, $fii)->realName == $fieldName) {
$fieldInfo = _c_lib__arrUtils::readIndex($type->fields, $fii);}}
$linked = $fieldInfo->structure->getFlag("linked");
$fieldType = Websom_DataInfo::getDataInfoFromRoute($linked->fieldType);
$subContainer = new Websom_Containers_Table($that->server, $name . "_" . $fieldInfo->fieldName, $fieldType);
return $subContainer;};


							$fi::registerInterfaces($that, $componentContainer, $getContainer);
						};
$close->__invoke($f, $t, $fi);}}else if ($f->typeRoute == "array" and isset($f->attributes["NoLoad"])) {
$linked = $f->structure->getFlag("linked");
$t = Websom_DataInfo::getDataInfoFromRoute($linked->fieldType);
$this->registerSubContainer($f, $t);}}
for ($i = 0; $i < count($this->interfaces); $i++) {
$opts = _c_lib__arrUtils::readIndex($this->interfaces, $i);
for ($c = 0; $c < count($opts->controls); $c++) {
_c_lib__arrUtils::readIndex($opts->controls, $c)->container = $this;}
for ($c = 0; $c < count($opts->selectControls); $c++) {
_c_lib__arrUtils::readIndex($opts->selectControls, $c)->container = $this;}
for ($c = 0; $c < count($opts->updateControls); $c++) {
_c_lib__arrUtils::readIndex($opts->updateControls, $c)->container = $this;}
for ($c = 0; $c < count($opts->insertControls); $c++) {
_c_lib__arrUtils::readIndex($opts->insertControls, $c)->container = $this;}}
$handler = $this->server->input->register($this->name, function ($input) use (&$that, &$handler) {if (isset($input->raw["_w_type"]) and isset($input->raw["_w_route"])) {
$type = $input->raw["_w_type"];
$route = $input->raw["_w_route"];
$opts = $that->getInterface($route);
if ($opts != null) {
$that->checkAuth($opts, $input, $type, function ($success) use (&$type, &$route, &$opts, &$input, &$that, &$handler) {if ($success) {
if ($type == "insert") {
$that->interfaceInsert($opts, $input);}else if ($type == "update") {
$that->interfaceUpdate($opts, $input);}else if ($type == "select") {
$that->server->security->request("select", $opts, $input, function () use (&$success, &$type, &$route, &$opts, &$input, &$that, &$handler) {$that->interfaceSelect($opts, $input, new Websom_CallContext());});}else if ($type == "interface") {
$that->interfaceSend($opts, $input);}else{
$input->request->code(400);
if ($that->server->config->dev) {
$input->send("Invalid(Dev: Interface of type '" . $type . "' not found)");}else{
$input->send("Invalid");}}}else{
$input->request->code(403);
$input->send("Unauthorized");}});}else{
$input->request->code(400);
if ($that->server->config->dev) {
$input->send("Invalid(Dev: No interface found with the route '" . $route . "')");}else{
$input->send("Invalid");}}}else{
$input->request->code(400);
if ($that->server->config->dev) {
$input->send("Invalid(Dev: No '_w_type' or '_w_route' found in query)");}else{
$input->send("Invalid");}}});
$handler->containerInterface = $this;
return $handler;}

function checkAuth($opts, $input, $type, $callback) {
if ($opts->hasAuth) {
$perms = "";
if ($type == "insert") {
$perms = $opts->insertPermission;}else if ($type == "update") {
$perms = $opts->updatePermission;}else if ($type == "select") {
$perms = $opts->selectPermission;}
if (strlen($perms) > 0) {
if ($input->request->session->get("dashboard") != null) {
$callback->__invoke(true);}else if ($input->server->userSystem->isLoggedIn($input->request)) {
$input->server->userSystem->getLoggedIn($input->request, function ($user) use (&$perms, &$opts, &$input, &$type, &$callback) {$user->hasPermission($perms, function ($yes) use (&$user, &$perms, &$opts, &$input, &$type, &$callback) {$callback->__invoke($yes);});});}else{
$callback->__invoke(false);}}else{
$callback->__invoke(true);}}else{
$callback->__invoke(true);}}

function loadFromSelect($select, $callback) {
}

function expose($req, $datas, $callback) {
}

function loadFromId($id, $callback) {
}


}class Websom_InterfaceOptions {
public $route;

public $canInsert;

public $restricts;

public $subs;

public $canInterface;

public $canSelect;

public $hasPublicIdSelect;

public $canLoadMore;

public $multipart;

public $canUpdate;

public $mustLogin;

public $mustOwnUpdate;

public $mustOwnSelect;

public $mustOwnInsert;

public $autoPublicId;

public $autoTimestamp;

public $autoOwn;

public $hasAuth;

public $captchaSelect;

public $captchaInsert;

public $captchaUpdate;

public $countSelect;

public $countInsert;

public $countUpdate;

public $permission;

public $selectPermission;

public $updatePermission;

public $insertPermission;

public $uniqueKeys;

public $group;

public $baseSuccess;

public $baseError;

public $maxSelect;

public $selectExpose;

public $overrideInsert;

public $overrideSelect;

public $overrideUpdate;

public $onInsert;

public $successInsert;

public $onSelect;

public $onUpdate;

public $successUpdate;

public $onlyUpdateIfOwner;

public $controls;

public $insertControls;

public $selectControls;

public $updateControls;

function __construct($route) {
$this->route = "";
$this->canInsert = false;
$this->restricts = [];
$this->subs = new _carb_map();
$this->canInterface = true;
$this->canSelect = false;
$this->hasPublicIdSelect = true;
$this->canLoadMore = true;
$this->multipart = false;
$this->canUpdate = false;
$this->mustLogin = false;
$this->mustOwnUpdate = false;
$this->mustOwnSelect = false;
$this->mustOwnInsert = false;
$this->autoPublicId = false;
$this->autoTimestamp = false;
$this->autoOwn = false;
$this->hasAuth = false;
$this->captchaSelect = false;
$this->captchaInsert = false;
$this->captchaUpdate = false;
$this->countSelect = true;
$this->countInsert = true;
$this->countUpdate = true;
$this->permission = "";
$this->selectPermission = "";
$this->updatePermission = "";
$this->insertPermission = "";
$this->uniqueKeys = [];
$this->group = "";
$this->baseSuccess = "Success";
$this->baseError = "Error";
$this->maxSelect = 25;
$this->selectExpose = null;
$this->overrideInsert = null;
$this->overrideSelect = null;
$this->overrideUpdate = null;
$this->onInsert = null;
$this->successInsert = null;
$this->onSelect = null;
$this->onUpdate = null;
$this->successUpdate = null;
$this->onlyUpdateIfOwner = false;
$this->controls = [];
$this->insertControls = [];
$this->selectControls = [];
$this->updateControls = [];

$this->route = $route;
}
function expose($func) {
$this->selectExpose = $func;}

function spawnControl($cls, $field) {


			return new $cls($field->realName, $field->fieldName, $field);
		}

function authPermission($perm) {
$this->hasAuth = true;
$this->permission = $perm;}

function autoControl($info) {
for ($i = 0; $i < count($info->fields); $i++) {
$field = _c_lib__arrUtils::readIndex($info->fields, $i);
if ($field->structure->hasFlag("edit")) {
if ($field->isPrimitive) {
array_push($this->controls, $field->structure->type->autoControl($field));}else if ($field->isComplex) {
array_push($this->controls, $this->spawnControl($field->controlClass, $field));}}}}


}class Websom_InputRestriction {
public $mode;

public $simple;

public $field;

public $key;

public $value;

public $callback;

function __construct($mode, $field) {
$this->mode = "global";
$this->simple = false;
$this->field = "";
$this->key = "";
$this->value = "";
$this->callback = null;

$this->mode = $mode;
$this->field = $field;
}

}class Websom_Control {
public $server;

public $container;

function __construct(...$arguments) {
$this->server = null;
$this->container = null;


}
function insert($input, $data, $key) {
}

function update($input, $data) {
}

function message($input, $name, $data, $send) {
$send->__invoke(null);}

function _c__use($inputChain) {
}


}class Websom_MessageControl {
public $server;

public $container;

function __construct(...$arguments) {
$this->server = null;
$this->container = null;


}
function validate($input, $done) {
$done->__invoke(null);}

function fill($input, $values, $done) {
$done->__invoke();}

function filter($input, $select, $done) {
$done->__invoke(null);}

function insert($input, $data, $key) {
}

function update($input, $data) {
}

function message($input, $name, $data, $send) {
$send->__invoke(null);}

function _c__use($inputChain) {
}


}class Websom_FieldControl {
public $required;

public $name;

public $field;

public $logic;

public $fieldInfo;

public $server;

public $container;

function __construct(...$arguments) {
$this->required = false;
$this->name = "";
$this->field = "";
$this->logic = "or";
$this->fieldInfo = null;
$this->server = null;
$this->container = null;

if (count($arguments) == 1 and (gettype($arguments[0]) == 'string' or gettype($arguments[0]) == 'NULL')) {
$field = $arguments[0];
$this->name = $field;
$this->field = $field;
}
else if (count($arguments) == 2 and (gettype($arguments[0]) == 'string' or gettype($arguments[0]) == 'NULL') and (gettype($arguments[1]) == 'string' or gettype($arguments[1]) == 'NULL')) {
$field = $arguments[0];
$logic = $arguments[1];
$this->name = $field;
$this->field = $field;
$this->logic = $logic;
}
else if (count($arguments) == 3 and (gettype($arguments[0]) == 'string' or gettype($arguments[0]) == 'NULL') and (gettype($arguments[1]) == 'string' or gettype($arguments[1]) == 'NULL') and ((_c_lib_run::getClass($arguments[2]) == 'Websom_FieldInfo') or gettype($arguments[2]) == 'NULL')) {
$name = $arguments[0];
$field = $arguments[1];
$fieldInfo = $arguments[2];
$this->name = $name;
$this->field = $field;
$this->fieldInfo = $fieldInfo;
}

}
function validate($input, $done) {
if (isset($input->raw[$this->name])) {
$this->validateField($input, $input->raw[$this->name], $done);}else if ($this->required) {
$done->__invoke(new Websom_InputValidation(true, "Missing field " . $this->name));}else{
$done->__invoke(new Websom_InputValidation(false, ""));}}

function fill($input, $values, $done) {
$this->fillField($input->raw[$this->name], $values);
$done->__invoke();}

function filter($input, $select, $done) {
if (isset($input->raw[$this->name])) {
if ($this->logic == "and") {
$select->and();}else{
$select->or();}
$val = $this->filterField($input->raw[$this->name], $select, $done);}else if ($this->required) {
$done->__invoke(new Websom_InputValidation(true, "Missing field " . $this->name));}else{
$done->__invoke(null);}}

function validateField($input, $value, $done) {
$done->__invoke(new Websom_InputValidation(false, ""));}

function fillField($value, $values) {
}

function filterField($value, $select, $done) {
}

function insert($input, $data, $key) {
}

function update($input, $data) {
}

function message($input, $name, $data, $send) {
$send->__invoke(null);}

function _c__use($inputChain) {
}


}class Websom_Controls {

function __construct(...$arguments) {


}

}class Websom_Controls_Search {
public $required;

public $name;

public $field;

public $logic;

public $fieldInfo;

public $server;

public $container;

function __construct(...$arguments) {
$this->required = false;
$this->name = "";
$this->field = "";
$this->logic = "or";
$this->fieldInfo = null;
$this->server = null;
$this->container = null;

if (count($arguments) == 1 and (gettype($arguments[0]) == 'string' or gettype($arguments[0]) == 'NULL')) {
$field = $arguments[0];
$this->name = $field;
$this->field = $field;
}
else if (count($arguments) == 2 and (gettype($arguments[0]) == 'string' or gettype($arguments[0]) == 'NULL') and (gettype($arguments[1]) == 'string' or gettype($arguments[1]) == 'NULL')) {
$field = $arguments[0];
$logic = $arguments[1];
$this->name = $field;
$this->field = $field;
$this->logic = $logic;
}
else if (count($arguments) == 3 and (gettype($arguments[0]) == 'string' or gettype($arguments[0]) == 'NULL') and (gettype($arguments[1]) == 'string' or gettype($arguments[1]) == 'NULL') and ((_c_lib_run::getClass($arguments[2]) == 'Websom_FieldInfo') or gettype($arguments[2]) == 'NULL')) {
$name = $arguments[0];
$field = $arguments[1];
$fieldInfo = $arguments[2];
$this->name = $name;
$this->field = $field;
$this->fieldInfo = $fieldInfo;
}

}
function filterField($value, $select, $done) {
$select->where($this->field)->wildLike($value);
$done->__invoke(null);}

function validate($input, $done) {
if (isset($input->raw[$this->name])) {
$this->validateField($input, $input->raw[$this->name], $done);}else if ($this->required) {
$done->__invoke(new Websom_InputValidation(true, "Missing field " . $this->name));}else{
$done->__invoke(new Websom_InputValidation(false, ""));}}

function fill($input, $values, $done) {
$this->fillField($input->raw[$this->name], $values);
$done->__invoke();}

function filter($input, $select, $done) {
if (isset($input->raw[$this->name])) {
if ($this->logic == "and") {
$select->and();}else{
$select->or();}
$val = $this->filterField($input->raw[$this->name], $select, $done);}else if ($this->required) {
$done->__invoke(new Websom_InputValidation(true, "Missing field " . $this->name));}else{
$done->__invoke(null);}}

function validateField($input, $value, $done) {
$done->__invoke(new Websom_InputValidation(false, ""));}

function fillField($value, $values) {
}

function insert($input, $data, $key) {
}

function update($input, $data) {
}

function message($input, $name, $data, $send) {
$send->__invoke(null);}

function _c__use($inputChain) {
}


}class Websom_Controls_Component {
public $parentContainer;

public $componentContainer;

public $server;

public $container;

function __construct($parentContainer, $componentContainer) {
$this->parentContainer = null;
$this->componentContainer = null;
$this->server = null;
$this->container = null;

$this->parentContainer = $parentContainer;
$this->componentContainer = $componentContainer;
}
function validate($input, $done) {
$that = $this;
if (isset($input->raw["parent"]) and (gettype($input->raw["parent"]) == 'double' ? 'float' : (gettype($input->raw["parent"]) == 'array' ? (isset($input->raw["parent"]['_c__mapC']) ? 'map' : 'array') : gettype($input->raw["parent"]))) == "string") {
$this->parentContainer->from()->where("publicId")->equals($input->raw["parent"])->run(function ($err, $docs) use (&$input, &$done, &$that) {if ($err != null) {
$done->__invoke(new Websom_InputValidation(true, "Server error"));}else{
if (count($docs) > 0) {
$that->componentContainer->from()->where("parentId")->equals(_c_lib__arrUtils::readIndex($docs, 0)["id"])->run(function ($err2, $docs2) use (&$err, &$docs, &$input, &$done, &$that) {if ($err2 != null or count($docs2) == 0) {
$done->__invoke(new Websom_InputValidation(true, "Parent value not found"));}else{
$input->raw[$that->parentContainer->table . "parentId"] = _c_lib__arrUtils::readIndex($docs2, 0)["id"];
$done->__invoke(null);}});}else{
$done->__invoke(new Websom_InputValidation(true, "Parent value not found"));}}});}else{
$done->__invoke(new Websom_InputValidation(true, "Invalid parent value"));}}

function fill($input, $values, $done) {
$values["parentId"] = $input->raw[$this->parentContainer->table . "parentId"];
$done->__invoke();}

function filter($input, $select, $done) {
$that = $this;
if (isset($input->raw["parent"]) and (gettype($input->raw["parent"]) == 'double' ? 'float' : (gettype($input->raw["parent"]) == 'array' ? (isset($input->raw["parent"]['_c__mapC']) ? 'map' : 'array') : gettype($input->raw["parent"]))) == "string") {
$this->parentContainer->from()->where("publicId")->equals($input->raw["parent"])->run(function ($err, $docs) use (&$input, &$select, &$done, &$that) {if ($err != null) {
$done->__invoke(new Websom_InputValidation(true, "Server error"));}else{
if (count($docs) > 0) {
$that->componentContainer->from()->where("parentId")->equals(_c_lib__arrUtils::readIndex($docs, 0)["id"])->run(function ($err2, $docs2) use (&$err, &$docs, &$input, &$select, &$done, &$that) {if ($err2 != null or count($docs2) == 0) {
$done->__invoke(new Websom_InputValidation(true, "Parent value not found"));}else{
$select->where("parentId")->equals(_c_lib__arrUtils::readIndex($docs2, 0)["id"]);
$done->__invoke(null);}});}else{
$done->__invoke(new Websom_InputValidation(true, "Parent value not found"));}}});}else{
$done->__invoke(new Websom_InputValidation(true, "Invalid parent value"));}}

function insert($input, $data, $key) {
}

function update($input, $data) {
}

function message($input, $name, $data, $send) {
$send->__invoke(null);}

function _c__use($inputChain) {
}


}class Websom_CallContext {
public $subContainerCall;

public $data;

function __construct() {
$this->subContainerCall = false;
$this->data = null;


}

}class Websom_Data {
public $websomServer;

public $websomFieldInfo;

public $websomParentData;

public $websomContainer;

function __construct($server) {
$this->websomServer = null;
$this->websomFieldInfo = null;
$this->websomParentData = null;
$this->websomContainer = null;

$this->websomServer = $server;
}
function read($value) {
}

function write() {
}

function setField($name, $value) {


			$this->$name = $value;
		}

function getContainer($realFieldName) {
$info = $this->fetchFieldInfo();
for ($i = 0; $i < count($info->fields); $i++) {
$field = _c_lib__arrUtils::readIndex($info->fields, $i);
if ($field->realName == $realFieldName) {
$thisTable = $this->websomContainer;
if ($field->structure->hasFlag("linked")) {
$linked = $field->structure->getFlag("linked");
$typeInfo = Websom_DataInfo::getDataInfoFromRoute($linked->fieldType);
return new Websom_Containers_Table($this->websomServer, $thisTable->table . "_" . $field->fieldName, $typeInfo);}}}
return null;}

function onInputInterface($input, $route, $data, $respond) {


			if (method_exists($this, "onInputInterfaceAuto"))
				$this->onInputInterfaceAuto($input, $route, $data, $respond);
			else
				$respond(null);
		}

function getField($name) {


			return property_exists($this, $name) ? $this->$name : null;
		}

function getPublicId() {
return $this->getField("publicId");}

function callLoadFromMap($raw, $callback) {


			return $this->loadFromMap($raw, $callback);
		}

static function getDataInfo() {


			return self::getInfo();
		}

function fromPrimary($key, $done) {
}

function loadFromPublicKey($parent, $key, $done) {
$that = $this;
$that->websomContainer = $parent;
$parent->server->database->primary->from($parent->table)->where("publicId")->equals($key)->run(function ($err, $res) use (&$parent, &$key, &$done, &$that) {if (count($res) == 0) {
$done->__invoke("No data found");}else{
$that->callLoadFromMap(_c_lib__arrUtils::readIndex($res, 0), $done);}});}

function loadFromId($parent, $id, $done) {
$that = $this;
$that->websomContainer = $parent;
$parent->server->database->primary->from($parent->table)->where("id")->equals($id)->run(function ($err, $res) use (&$parent, &$id, &$done, &$that) {if (count($res) == 0) {
$done->__invoke("No data found");}else{
$that->callLoadFromMap(_c_lib__arrUtils::readIndex($res, 0), $done);}});}

static function registerInterfaces($parent, $component, $getFieldContainer) {
}

static function spawnFromId($server, $table, $id, $done) {
$dataInfo = null;


			$dataInfo = self::getInfo();
		
$container = new Websom_Containers_Table($server, $table, $dataInfo);
$data = $dataInfo->spawn($server);
$data->websomContainer = $container;
$data->loadFromId($container, $id, function ($err) use (&$server, &$table, &$id, &$done, &$dataInfo, &$container, &$data) {$done->__invoke($err, $data);});}

function onSend($req, $exposed, $send) {
$this->onComponentSend($req, $exposed, $send);}

function onComponentSend($req, $data, $send) {
$info = $this->fetchFieldInfo();
$componentFields = [];
for ($i = 0; $i < count($info->fields); $i++) {
$field = _c_lib__arrUtils::readIndex($info->fields, $i);
if ($field->singleLink) {
$fieldType = Websom_DataInfo::getDataInfoFromRoute($field->typeRoute);
if (isset($fieldType->attributes["Component"])) {
if ($this->getField($field->realName) != null) {
array_push($componentFields, $field);}}}}
$completed = count($componentFields);
if ($completed == 0) {
$send->__invoke($data);
return null;}
$checkSend = function () use (&$req, &$data, &$send, &$info, &$componentFields, &$completed, &$checkSend) {$completed--;
if ($completed == 0) {
$send->__invoke($data);}};
for ($i = 0; $i < count($componentFields); $i++) {
$field = _c_lib__arrUtils::readIndex($componentFields, $i);
$component = $this->getField($field->realName);
$component->onSend($req, $data[$field->realName], function ($newData) use (&$i, &$field, &$component, &$req, &$data, &$send, &$info, &$componentFields, &$completed, &$checkSend) {$data[$field->realName] = $newData;
$checkSend->__invoke();});}}

static function structureTable() {
}

function getFieldContainer($fieldName) {
$dataInfo = $this->fetchFieldInfo();
$fieldInfo = $dataInfo->getField($fieldName);
$link = $fieldInfo->structure->getFlag("linked");
if ($link == null) {
return null;}
$cast = $this->websomContainer;
return new Websom_Containers_Table($this->websomServer, $cast->table . "_" . $fieldName, Websom_DataInfo::getDataInfoFromRoute($link->fieldType));}

function nativeLoadFromMap($raw, $done) {


			$this->loadFromMap($raw, $done);
		}

function &exposeToClient() {


			return $this->exposeToClientBase();
		}

function linkedExpose() {
}

function fetchFieldInfo() {
$info = null;


			$info = self::getInfo();
		
return $info;}

function getPrimary() {
$fi = $this->fetchFieldInfo();
for ($i = 0; $i < count($fi->fields); $i++) {
$field = _c_lib__arrUtils::readIndex($fi->fields, $i);
for ($f = 0; $f < count($field->structure->flags); $f++) {
if (_c_lib__arrUtils::readIndex($field->structure->flags, $f)->type == "primary") {
return $field;}}}
return null;}

function getFieldFromName($realName) {

 return $this->$realName; }

function containerInsert($input, $container, $insert, $data, $done) {
$done->__invoke();}

function containerUpdate($input, $container, $update, $data, $done) {
$done->__invoke();}

function update($done) {
if ($this->websomContainer) {
$field = $this->getPrimary();
$cast = $this->websomContainer;
$table = "unkown";
$table = $cast->table;
if ($field) {
$update = $this->websomContainer->server->database->primary->from($table)->where($field->fieldName)->equals($this->getFieldFromName($field->realName))->update();
$this->buildUpdate($update);
$update->run(function ($err, $docs) use (&$update, &$field, &$cast, &$table, &$done) {$done->__invoke($err);});}}}

function insert($done) {
if ($this->websomContainer) {
$cast = $this->websomContainer;
$table = "unkown";
$table = $cast->table;
$insert = $this->websomContainer->server->database->primary->into($table);
$this->buildInsert($insert);
$insert->run(function ($err, $key) use (&$cast, &$table, &$insert, &$done) {$done->__invoke($err, $key);});}}

function buildInsert($insert) {
$info = $this->fetchFieldInfo();


			if (property_exists($this, "parentId"))
				$insert->set("parentId", $this->parentId);
		
for ($i = 0; $i < count($info->fields); $i++) {
$field = _c_lib__arrUtils::readIndex($info->fields, $i);
$value = null;


				$real = $field->realName;
				$value = $this->$real;
			
$type = (gettype($value) == 'double' ? 'float' : (gettype($value) == 'array' ? (isset($value['_c__mapC']) ? 'map' : 'array') : gettype($value)));
if ($type == "integer" or $type == "float" or $type == "string") {
$insert->set($field->fieldName, $value);}else if ($type == "boolean") {
$setVal = 0;
if ($value) {
$setVal = 1;}
$insert->set($field->fieldName, $setVal);}}}

function buildUpdate($select) {
$info = $this->fetchFieldInfo();


			if (property_exists($this, "parentId"))
				$update->set("parentId", $this->parentId);
		
for ($i = 0; $i < count($info->fields); $i++) {
$field = _c_lib__arrUtils::readIndex($info->fields, $i);
$value = null;


				$real = $field->realName;
				$value = $this->$real;
			
$type = (gettype($value) == 'double' ? 'float' : (gettype($value) == 'array' ? (isset($value['_c__mapC']) ? 'map' : 'array') : gettype($value)));
if ($type == "integer" or $type == "float" or $type == "string") {
$select->set($field->fieldName, $value);}else if ($type == "boolean") {
$setVal = 0;
if ($value) {
$setVal = 1;}
$select->set($field->fieldName, $setVal);}}}


}class Websom_DataInfo {
public $info;

public $name;

public $linked;

public $linkedTable;

public $attributes;

public $fields;

function __construct($name) {
$this->info = null;
$this->name = "";
$this->linked = false;
$this->linkedTable = "";
$this->attributes = new _carb_map();
$this->fields = [];

$this->name = $name;
}
function loadFromMap($info) {
$this->info = $info;}

function getField($name) {
for ($i = 0; $i < count($this->fields); $i++) {
if (_c_lib__arrUtils::readIndex($this->fields, $i)->realName == $name) {
return _c_lib__arrUtils::readIndex($this->fields, $i);}}
return null;}

function hasField($name) {
for ($i = 0; $i < count($this->fields); $i++) {
if (_c_lib__arrUtils::readIndex($this->fields, $i)->realName == $name) {
return true;}}
return false;}

function buildStructure() {
$str = new Websom_DatabaseStructure(null, "");
for ($i = 0; $i < count($this->fields); $i++) {
$hasField = true;
if (_c_lib__arrUtils::readIndex($this->fields, $i)->singleLink) {
$subInfo = Websom_DataInfo::getDataInfoFromRoute(_c_lib__arrUtils::readIndex($this->fields, $i)->typeRoute);
if (isset($subInfo->attributes["Component"])) {
$hasField = false;
for ($j = 0;$j < count($subInfo->fields);$j++) {
$sField = _c_lib__arrUtils::readIndex($subInfo->fields, $j);
if (isset($sField->attributes["Parent"])) {
array_push($str->fields, $sField->structure);}}}}
if (isset(_c_lib__arrUtils::readIndex($this->fields, $i)->attributes["Parent"])) {
$hasField = false;}
if ($hasField) {
array_push($str->fields, _c_lib__arrUtils::readIndex($this->fields, $i)->structure);}}
return $str;}

function spawn($server) {


			$clsName = str_replace(".", "_", $this->name);
			return new $clsName($server);
		}

static function getDataInfoFromRoute($route) {


			$clsName = str_replace(".", "_", $route);
			return $clsName::getInfo();
		}

function &buildLinkedStructures($parentName) {
$strs = [];
for ($i = 0; $i < count($this->fields); $i++) {
$field = _c_lib__arrUtils::readIndex($this->fields, $i);
for ($f = 0; $f < count($field->structure->flags); $f++) {
$flag = _c_lib__arrUtils::readIndex($field->structure->flags, $f);
if ($flag->type == "linked") {
$linked = $flag;
if ($linked->name == null) {
$dataInfo = Websom_DataInfo::getDataInfoFromRoute($linked->fieldType);
$str = $dataInfo->buildStructure();
if ($linked->linkType == "array") {
if (isset($dataInfo->attributes["Linked"])) {
$str = new Websom_DatabaseStructure(null, "");
$id = new Websom_DatabaseField("id", new Websom_DatabaseTypes_Int());
array_push($id->flags, new Websom_DatabaseFlags_Primary());
array_push($id->flags, new Websom_DatabaseFlags_AutoIncrement());
array_push($str->fields, $id);
array_push($str->fields, new Websom_DatabaseField("linkedId", new Websom_DatabaseTypes_Int()));}
array_push($str->fields, new Websom_DatabaseField("parentId", new Websom_DatabaseTypes_Int()));
array_push($str->fields, new Websom_DatabaseField("arrayIndex", new Websom_DatabaseTypes_Int()));}else if ($linked->linkType == "map") {
array_push($str->fields, new Websom_DatabaseField("parentId", new Websom_DatabaseTypes_Int()));
array_push($str->fields, new Websom_DatabaseField("mapKey", new Websom_DatabaseTypes_Varchar(256)));}else if (isset($dataInfo->attributes["Component"])) {
array_push($str->fields, new Websom_DatabaseField("parentId", new Websom_DatabaseTypes_Int()));}
if (isset($dataInfo->attributes["Linked"]) == false) {
$subs = &$dataInfo->buildLinkedStructures($field->realName);
for ($s = 0; $s < count($subs); $s++) {
$sub = _c_lib__arrUtils::readIndex($subs, $s);
$sub->table = $field->realName . "_" . $sub->table;
array_push($strs, $sub);}}
$str->table = $field->realName;
array_push($strs, $str);}}}}
return $strs;}

function expose($raw) {
$out = [];
for ($i = 0; $i < count($this->fields); $i++) {
$field = _c_lib__arrUtils::readIndex($this->fields, $i);
if ($field->expose) {
$type = (gettype($raw[$field->fieldName]) == 'double' ? 'float' : (gettype($raw[$field->fieldName]) == 'array' ? (isset($raw[$field->fieldName]['_c__mapC']) ? 'map' : 'array') : gettype($raw[$field->fieldName])));
if ($type == "string") {
$cast = $raw[$field->fieldName];
array_push($out, "\"" . $field->realName . "\": " . Websom_Json::encode($cast));}else if ($type == "bool") {
$val = "false";
if ($raw[$field->fieldName] == 1) {
$val = "true";}
array_push($out, "\"" . $field->realName . "\": " . $val);}else if ($type == "float" or $type == "integer") {
array_push($out, "\"" . $field->realName . "\": " . $raw[$field->fieldName]);}}}
return "{" . implode(", ", $out) . "}";}


}class Websom_FieldInfo {
public $realName;

public $fieldName;

public $typeRoute;

public $controlClass;

public $isPrimitive;

public $isComplex;

public $onlyServer;

public $singleLink;

public $canBeNull;

public $expose;

public $attributes;

public $structure;

public $_c__default;

function __construct($realName, $fieldName, $typeRoute, $structure) {
$this->realName = "";
$this->fieldName = "";
$this->typeRoute = "";
$this->controlClass = "";
$this->isPrimitive = true;
$this->isComplex = false;
$this->onlyServer = false;
$this->singleLink = false;
$this->canBeNull = false;
$this->expose = true;
$this->attributes = new _carb_map();
$this->structure = null;
$this->_c__default = null;

$this->realName = $realName;
$this->fieldName = $fieldName;
$this->typeRoute = $typeRoute;
$this->structure = $structure;
}
function isComponent() {
if ($this->singleLink) {
$linked = $this->structure->getFlag("linked");
if ($linked != null and $linked->fieldType != null) {
$dataInfo = Websom_DataInfo::getDataInfoFromRoute($linked->fieldType);
if (isset($dataInfo->attributes["Component"])) {
return true;}else{
return false;}}else{
return false;}}else{
return false;}}


}class Websom_DataValidator {
public $info;

function __construct($info) {
$this->info = null;

$this->info = $info;
}
function validate($input, $pass) {
$that = $this;
$first = null;
$waits = count($this->info->fields);
$done = function ($iv) use (&$input, &$pass, &$that, &$first, &$waits, &$done) {if ($first == null) {
$first = $iv;}
$waits--;
if ($waits == 0) {
if ($first == null) {
$first = new Websom_InputValidation(false, "");}
$pass->__invoke($first);}};
for ($ii = 0; $ii < count($this->info->fields); $ii++) {
$close = function ($i) use (&$ii, &$close, &$input, &$pass, &$that, &$first, &$waits, &$done) {$field = _c_lib__arrUtils::readIndex($that->info->fields, $i);
if (isset($input->raw[$field->realName])) {
if ($field->structure->hasFlag("edit") == false) {
}else{
if ($field->isPrimitive and $field->isComplex == false and $field->singleLink == false) {
$typeCompare = $field->typeRoute;
if ($typeCompare == "bool") {
$typeCompare = "boolean";
$input->raw[$field->realName] = $input->raw[$field->realName] == "true";}
if ($typeCompare == "int") {
$input->raw[$field->realName] = intval($input->raw[$field->realName]);
}else if ($typeCompare == "float") {
$input->raw[$field->realName] = floatval($input->raw[$field->realName]);
}else if ((gettype($input->raw[$field->realName]) == 'double' ? 'float' : (gettype($input->raw[$field->realName]) == 'array' ? (isset($input->raw[$field->realName]['_c__mapC']) ? 'map' : 'array') : gettype($input->raw[$field->realName]))) != $typeCompare) {
$done->__invoke(new Websom_InputValidation(true, "Invalid type", $field));
return null;}
if (isset($field->attributes["Length"])) {
$max = $field->attributes["Length"];
$cast = $input->raw[$field->realName];
if (strlen($cast) > $max) {
$done->__invoke(new Websom_InputValidation(true, "Value length must be less than " . $max, $field));
return null;}}
if (isset($field->attributes["Min"])) {
$min = $field->attributes["Min"];
if ($field->typeRoute == "string") {
$cast = $input->raw[$field->realName];
if (strlen($cast) < $min) {
$done->__invoke(new Websom_InputValidation(true, "Value length must be more than " . $min, $field));
return null;}}else{
$cast = $input->raw[$field->realName];
if ($cast < $min) {
$done->__invoke(new Websom_InputValidation(true, "Value must be more than " . $min, $field));
return null;}}}
if (isset($field->attributes["Max"])) {
$cast = $input->raw[$field->realName];
$max = $field->attributes["Max"];
if ($cast > $max) {
$done->__invoke(new Websom_InputValidation(true, "Value must be less than " . $max, $field));
return null;}}
if (isset($field->attributes["Match"])) {
$cast = $input->raw[$field->realName];
$reg = $field->attributes["Match"];
if ((preg_match('/'.$reg.'/', $cast) === 1 ? true : false) == false) {
$err = "Value must match " . $reg;
if (isset($field->attributes["MatchError"])) {
$err = $field->attributes["MatchError"];}
$done->__invoke(new Websom_InputValidation(true, $err, $field));
return null;}}}else if ($field->singleLink) {
if ((gettype($input->raw[$field->realName]) == 'double' ? 'float' : (gettype($input->raw[$field->realName]) == 'array' ? (isset($input->raw[$field->realName]['_c__mapC']) ? 'map' : 'array') : gettype($input->raw[$field->realName]))) != "string" and (gettype($input->raw[$field->realName]) == 'double' ? 'float' : (gettype($input->raw[$field->realName]) == 'array' ? (isset($input->raw[$field->realName]['_c__mapC']) ? 'map' : 'array') : gettype($input->raw[$field->realName]))) != "integer") {
$done->__invoke(new Websom_InputValidation(true, "Invalid type", $field));
return null;}
$linkInfo = Websom_DataInfo::getDataInfoFromRoute($field->typeRoute);
$linked = $field->structure->getFlag("linked");
$linkedTable = $linked->name;
$tbl = new Websom_Containers_Table($input->server, $linkedTable, $linkInfo);
$obj = $linkInfo->spawn($input->server);
$obj->websomContainer = $tbl;
$obj->websomServer = $tbl->server;
$close2 = function ($ffield) use (&$linkInfo, &$linked, &$linkedTable, &$tbl, &$obj, &$close2, &$i, &$field, &$ii, &$close, &$input, &$pass, &$that, &$first, &$waits, &$done) {$obj->loadFromPublicKey($tbl, $input->raw[$ffield->realName], function ($err) use (&$ffield, &$linkInfo, &$linked, &$linkedTable, &$tbl, &$obj, &$close2, &$i, &$field, &$ii, &$close, &$input, &$pass, &$that, &$first, &$waits, &$done) {if (strlen($err) > 0) {
$done->__invoke(new Websom_InputValidation(true, "No " . $ffield->realName . " found", $ffield));
return null;}
$input->raw[$ffield->realName] = $obj->getField("id");});};
$close2->__invoke($field);}}}else if ($field->canBeNull == false) {
if ($field->structure->hasFlag("edit")) {
if ($field->typeRoute == "array") {
$input->raw[$field->fieldName] = [];
$done->__invoke(null);}else{
$done->__invoke(new Websom_InputValidation(true, "No value", $field));
return null;}}}
$done->__invoke(null);};
$close->__invoke($ii);}}


}class Websom_Databases {

function __construct(...$arguments) {


}

}class Websom_Database {
public $server;

public $config;

public $name;

public $open;

public $connecting;

public $waits;

function __construct($server) {
$this->server = null;
$this->config = null;
$this->name = "";
$this->open = false;
$this->connecting = false;
$this->waits = [];

$this->server = $server;
}
static function make($server, $type) {
if ($type == "mysql") {
return new Websom_Databases_MySql($server);}}

function wait($func) {
array_push($this->waits, $func);}

function load($config) {
$this->config = $config;
$this->name = $this->config["name"];}

function connected() {
for ($i = 0; $i < count($this->waits); $i++) {
_c_lib__arrUtils::readIndex($this->waits, $i)->__invoke();}}

function structure($table) {
return new Websom_DatabaseStructure($this, $table);}


}class Websom_InputChain {
public $handler;

public $hasCaptcha;

public $successCallback;

public $errorCallback;

public $restricts;

public $keys;

function __construct($ih) {
$this->handler = null;
$this->hasCaptcha = false;
$this->successCallback = null;
$this->errorCallback = null;
$this->restricts = [];
$this->keys = [];

$this->handler = $ih;
}
function _c__use($control) {
$control->_c__use($this);
return $this;}

function captcha() {
$this->hasCaptcha = true;
return $this;}

function restrict() {
$restrict = new Websom_InputRestriction("global", "");
array_push($this->restricts, $restrict);
return $this;}

function to(...$arguments) {
if (count($arguments) == 2 and (gettype($arguments[0]) == 'string' or gettype($arguments[0]) == 'NULL') and (gettype($arguments[1]) == 'string' or gettype($arguments[1]) == 'NULL')) {
$key = $arguments[0];
$value = $arguments[1];
if (count($this->restricts) > 0) {
$r = _c_lib__arrUtils::readIndex($this->restricts, count($this->restricts) - 1);
$r->simple = true;
$r->key = $key;
$r->value = $value;}
return $this;
}
else if (count($arguments) == 1 and (gettype($arguments[0]) == 'string' or gettype($arguments[0]) == 'NULL')) {
$permission = $arguments[0];
return $this->to("permission", $permission);
}
else if (count($arguments) == 1 and (is_callable($arguments[0]) or gettype($arguments[0]) == 'NULL')) {
$callback = $arguments[0];
if (count($this->restricts) > 0) {
$r = _c_lib__arrUtils::readIndex($this->restricts, count($this->restricts) - 1);
$r->simple = false;
$r->callback = $callback;}
return $this;
}
}

function multipart() {
return $this;}

function key($key) {
array_push($this->keys, new Websom_InputKey($key));
return $this;}

function is(...$arguments) {
if (count($arguments) == 1 and ((_c_lib_run::getClass($arguments[0]) == 'Websom_Container' or (_c_lib_run::getClass($arguments[0]) == 'Websom_Containers_Table')) or gettype($arguments[0]) == 'NULL')) {
$dataTypeContainer = $arguments[0];
return $this->is(new Websom_InputFilters_Data($dataTypeContainer));
}
else if (count($arguments) == 1 and ((_c_lib_run::getClass($arguments[0]) == 'Websom_InputKeyFilter' or (_c_lib_run::getClass($arguments[0]) == 'Websom_InputFilters_Data') or (_c_lib_run::getClass($arguments[0]) == 'Websom_InputFilters_String')) or gettype($arguments[0]) == 'NULL')) {
$filter = $arguments[0];
if (count($this->keys) > 0) {
_c_lib__arrUtils::readIndex($this->keys, count($this->keys) - 1)->setFilter($filter);}
return $this;
}
else if (count($arguments) == 1 and (gettype($arguments[0]) == 'string' or gettype($arguments[0]) == 'NULL')) {
$typeName = $arguments[0];
if (count($this->keys) > 0) {
if ($typeName == "string") {
_c_lib__arrUtils::readIndex($this->keys, count($this->keys) - 1)->setFilter(new Websom_InputFilters_String());}else{
throw new Exception("Unknown is typeName " . $typeName);}}
return $this;
}
}

function length($min, $max) {
if (count($this->keys) > 0) {
$filter = _c_lib__arrUtils::readIndex($this->keys, count($this->keys) - 1)->filter;
$filter->minLength = $min;
$filter->maxLength = $max;}
return $this;}

function only($values) {
if (count($this->keys) > 0) {
$filter = _c_lib__arrUtils::readIndex($this->keys, count($this->keys) - 1)->filter;
$filter->only = $values;}
return $this;}

function not($values) {
if (count($this->keys) > 0) {
$filter = _c_lib__arrUtils::readIndex($this->keys, count($this->keys) - 1)->filter;
$filter->not = $values;}
return $this;}

function matches($regex) {
if (count($this->keys) > 0) {
$filter = _c_lib__arrUtils::readIndex($this->keys, count($this->keys) - 1)->filter;
$filter->matches = $regex;}
return $this;}

function success($callback) {
$this->successCallback = $callback;
return $this;}

function error($callback) {
$this->errorCallback = $callback;
return $this;}

function received($input) {
$that = $this;
$hasKeys = true;
for ($i = 0; $i < count($this->keys); $i++) {
$key = _c_lib__arrUtils::readIndex($this->keys, $i);
if (isset($input->raw[$key->key]) == false) {
$hasKeys = false;}}
if ($hasKeys == false) {
$input->sendError("Invalid keys");
return null;}
$dones = count($this->keys) + count($this->restricts);
$validation = null;
$putData = new _carb_map();
$checkDone = function () use (&$input, &$that, &$hasKeys, &$dones, &$validation, &$putData, &$checkDone) {if ($dones <= 0) {
$sent = false;
if ($validation != null and $validation->hadError) {
if ($that->errorCallback != null) {
$that->errorCallback->__invoke($input, $validation);}else{
$input->sendError($validation->stringify());}}else{
if ($that->successCallback != null) {
$that->successCallback->__invoke($input, $putData);}else{
$input->sendSuccess("No success handler registered");}}}};
for ($i = 0; $i < count($this->keys); $i++) {
$key = _c_lib__arrUtils::readIndex($this->keys, $i);
if ($key->filter != null) {
$key->filter->filter($input, $input->raw, $key->key, $putData, function ($iv) use (&$i, &$key, &$input, &$that, &$hasKeys, &$dones, &$validation, &$putData, &$checkDone) {if ($iv != null and $iv->hadError) {
$dones = 0;
$validation = $iv;
$checkDone->__invoke();}else{
$dones--;
$checkDone->__invoke();}});}else{
$putData[$key->key] = $input->raw[$key->key];
$dones--;
$checkDone->__invoke();}}
for ($i = 0; $i < count($this->restricts); $i++) {
$r = _c_lib__arrUtils::readIndex($this->restricts, $i);
if ($r->simple) {
$ct = &$input->server->input->restrictHandlers;
if (isset($ct[$r->key])) {
$handler = $input->server->input->restrictHandlers[$r->key];
$handler->__invoke($r->value, $input->request, function ($passed) use (&$handler, &$ct, &$i, &$r, &$input, &$that, &$hasKeys, &$dones, &$validation, &$putData, &$checkDone) {if ($passed) {
$dones--;
$checkDone->__invoke();}else{
$input->sendError("No permission");}});
return null;}else{
throw new Exception("Custom restriction " . $r->key . " not found in request to global interface");}}else{
if ($r->callback != null) {
$r->callback->__invoke(function ($passed) use (&$i, &$r, &$input, &$that, &$hasKeys, &$dones, &$validation, &$putData, &$checkDone) {if ($passed) {
$dones--;
$checkDone->__invoke();}else{
$input->sendError("No permission");}});}else{
throw new Exception("Restrict callback on global interface is null. Did you forget interface.to(void () => {})?");}
return null;}}}


}class Websom_InputKey {
public $key;

public $type;

public $filter;

function __construct($key) {
$this->key = null;
$this->type = "raw";
$this->filter = null;

$this->key = $key;
}
function setFilter($filter) {
$this->filter = $filter;}


}class Websom_InputKeyFilter {
public $minLength;

public $maxLength;

public $max;

public $min;

public $only;

public $not;

public $matches;

function __construct(...$arguments) {
$this->minLength = -1;
$this->maxLength = -1;
$this->max = -1;
$this->min = -1;
$this->only = [];
$this->not = [];
$this->matches = "";


}
function filter($input, $data, $key, $putData, $done) {
$putData[$key] = $data[$key];
$done->__invoke(new Websom_InputValidation(false, ""));}


}class Websom_InputFilters {

function __construct(...$arguments) {


}

}class Websom_InputFilters_Data {
public $container;

public $minLength;

public $maxLength;

public $max;

public $min;

public $only;

public $not;

public $matches;

function __construct($container) {
$this->container = null;
$this->minLength = -1;
$this->maxLength = -1;
$this->max = -1;
$this->min = -1;
$this->only = [];
$this->not = [];
$this->matches = "";

$this->container = $container;
}
function filter($input, $data, $key, $putData, $done) {
$invalid = true;
if ((gettype($data[$key]) == 'double' ? 'float' : (gettype($data[$key]) == 'array' ? (isset($data[$key]['_c__mapC']) ? 'map' : 'array') : gettype($data[$key]))) == "string") {
$publicId = $data[$key];
if (strlen($publicId) == 12) {
$invalid = false;}}
if ($invalid) {
$done->__invoke(new Websom_InputValidation(true, "Invalid publicId for key " . $key));}else{
$this->container->loadFromSelect($this->container->from()->where("publicId")->equals($data[$key]), function ($results) use (&$input, &$data, &$key, &$putData, &$done, &$invalid) {if (count($results) != 1) {
$done->__invoke(new Websom_InputValidation(true, "Invalid publicId for key " . $key));}else{
$putData[$key] = _c_lib__arrUtils::readIndex($results, 0);
$done->__invoke(new Websom_InputValidation(false, ""));}});}}


}class Websom_InputFilters_String {
public $minLength;

public $maxLength;

public $max;

public $min;

public $only;

public $not;

public $matches;

function __construct() {
$this->minLength = -1;
$this->maxLength = -1;
$this->max = -1;
$this->min = -1;
$this->only = [];
$this->not = [];
$this->matches = "";


}
function filter($input, $data, $key, $putData, $done) {
$invalid = false;
if ((gettype($data[$key]) == 'double' ? 'float' : (gettype($data[$key]) == 'array' ? (isset($data[$key]['_c__mapC']) ? 'map' : 'array') : gettype($data[$key]))) == "string") {
$value = $data[$key];
if ($this->maxLength != -1) {
if (strlen($value) > $this->maxLength) {
$invalid = true;}}
if ($invalid == false and $this->minLength != -1) {
if (strlen($value) < $this->minLength) {
$invalid = true;}}
if ($invalid == false and count($this->only) > 0) {
$invalid = true;
for ($i = 0; $i < count($this->only); $i++) {
$check = _c_lib__arrUtils::readIndex($this->only, $i);
if ($value == $check) {
$invalid = false;
break;}}}else if ($invalid == false and count($this->not) > 0) {
for ($i = 0; $i < count($this->not); $i++) {
$check = _c_lib__arrUtils::readIndex($this->not, $i);
if ($value == $check) {
$invalid = true;
break;}}}
if ($invalid == false and strlen($this->matches) > 0) {
if ((preg_match('/'.$this->matches.'/', $value) === 1 ? true : false) == false) {
$invalid = true;}}}else{
$invalid = true;}
if ($invalid) {
$done->__invoke(new Websom_InputValidation(true, "Invalid value for key " . $key));}else{
$done->__invoke(new Websom_InputValidation(false, ""));}}


}class Websom_InterfaceChain {
public $parent;

public $upChain;

public $subs;

public $io;

public $currentMode;

function __construct(...$arguments) {
$this->parent = null;
$this->upChain = null;
$this->subs = new _carb_map();
$this->io = null;
$this->currentMode = "interface";

if (count($arguments) == 2 and ((_c_lib_run::getClass($arguments[0]) == 'Websom_Container' or (_c_lib_run::getClass($arguments[0]) == 'Websom_Containers_Table')) or gettype($arguments[0]) == 'NULL') and (gettype($arguments[1]) == 'string' or gettype($arguments[1]) == 'NULL')) {
$parent = $arguments[0];
$route = $arguments[1];
$this->parent = $parent;
$this->io = new Websom_InterfaceOptions($route);
$this->parent->interface($this->io);
}
else if (count($arguments) == 2 and ((_c_lib_run::getClass($arguments[0]) == 'Websom_Container' or (_c_lib_run::getClass($arguments[0]) == 'Websom_Containers_Table')) or gettype($arguments[0]) == 'NULL') and ((_c_lib_run::getClass($arguments[1]) == 'Websom_InterfaceChain') or gettype($arguments[1]) == 'NULL')) {
$parent = $arguments[0];
$upChain = $arguments[1];
$this->parent = $parent;
$this->io = new Websom_InterfaceOptions($upChain->io->route);
$this->upChain = $upChain;
}

}
function captcha() {
if ($this->currentMode == "select") {
$this->io->captchaSelect = true;}else if ($this->currentMode == "insert") {
$this->io->captchaInsert = true;}else{
$this->io->captchaUpdate = true;}
return $this;}

function select() {
$this->currentMode = "select";
$this->io->canSelect = true;
return $this;}

function insert() {
$this->currentMode = "insert";
$this->io->canInsert = true;
return $this;}

function update() {
$this->currentMode = "update";
$this->io->canUpdate = true;
return $this;}

function _c__interface() {
$this->currentMode = "interface";
$this->io->canInterface = true;
return $this;}

function up() {
return $this->upChain;}

function restrict($field) {
$mode = $this->currentMode;
if ($mode == "interface") {
$mode = "global";}
$restrict = new Websom_InputRestriction($mode, $field);
array_push($this->io->restricts, $restrict);
return $this;}

function to(...$arguments) {
if (count($arguments) == 2 and (gettype($arguments[0]) == 'string' or gettype($arguments[0]) == 'NULL') and (gettype($arguments[1]) == 'string' or gettype($arguments[1]) == 'NULL')) {
$key = $arguments[0];
$value = $arguments[1];
if (count($this->io->restricts) > 0) {
$r = _c_lib__arrUtils::readIndex($this->io->restricts, count($this->io->restricts) - 1);
$r->simple = true;
$r->key = $key;
$r->value = $value;}
return $this;
}
else if (count($arguments) == 1 and (gettype($arguments[0]) == 'string' or gettype($arguments[0]) == 'NULL')) {
$permission = $arguments[0];
return $this->to("permission", $permission);
}
else if (count($arguments) == 1 and (is_callable($arguments[0]) or gettype($arguments[0]) == 'NULL')) {
$callback = $arguments[0];
if (count($this->io->restricts) > 0) {
$r = _c_lib__arrUtils::readIndex($this->io->restricts, count($this->io->restricts) - 1);
$r->simple = false;
$r->callback = $callback;}
return $this;
}
}

function multipart() {
$this->io->multipart = true;
return $this;}

function sub($fieldName) {
if ($this->subs[$fieldName] == null) {
$childChain = new Websom_InterfaceChain($this->parent, $this);
$childChain->io->route = $this->io->route;
$this->subs[$fieldName] = $childChain;
$this->io->subs[$fieldName] = $childChain->io;
return $childChain;}else{
$cast = $this->subs[$fieldName];
return $cast;}}

function mustOwn() {
if ($this->currentMode == "insert") {
$this->io->mustOwnInsert = true;}else if ($this->currentMode == "update") {
$this->io->mustOwnUpdate = true;}else if ($this->currentMode == "select") {
$this->io->mustOwnSelect = true;}
return $this;}

function mustLogin() {
$this->io->mustLogin = true;
return $this;}

function unique($key) {
array_push($this->io->uniqueKeys, $key);
$this->control(new Websom_Controls_Unique($key));
return $this;}

function autoPublicId() {
$this->io->autoPublicId = true;
return $this;}

function timestamp() {
$this->io->autoTimestamp = true;
return $this;}

function control($control) {
if ($this->currentMode == "select") {
array_push($this->io->selectControls, $control);}else if ($this->currentMode == "update") {
array_push($this->io->updateControls, $control);}else if ($this->currentMode == "insert") {
array_push($this->io->insertControls, $control);}else if ($this->currentMode == "interface") {
array_push($this->io->controls, $control);}
return $this;}

function success($func) {
if ($this->currentMode == "update") {
$this->io->successUpdate = $func;}else if ($this->currentMode == "insert") {
$this->io->successInsert = $func;}
return $this;}

function on($func) {
if ($this->currentMode == "select") {
$this->io->onSelect = $func;}else if ($this->currentMode == "update") {
$this->io->onUpdate = $func;}else if ($this->currentMode == "insert") {
$this->io->onInsert = $func;}
return $this;}

function expose($func) {
$this->io->expose($func);
return $this;}

function authPermission($perm) {
if ($this->currentMode == "select") {
$this->io->selectPermission = $perm;}else if ($this->currentMode == "update") {
$this->io->updatePermission = $perm;}else if ($this->currentMode == "insert") {
$this->io->insertPermission = $perm;}
$this->io->hasAuth = true;
return $this;}

function autoControl($info) {
$this->io->autoControl($info);
return $this;}


}class Websom_ClientMessage {
public $message;

public $href;

public $doReload;

public $hadError;

public $validations;

function __construct() {
$this->message = "";
$this->href = "";
$this->doReload = false;
$this->hadError = false;
$this->validations = [];


}
static function quickError($msg) {
$err = new Websom_ClientMessage();
$err->message = $msg;
$err->hadError = true;
return $err;}

function navigate($href) {
$this->href = $href;}

function reload() {
$this->doReload = true;}

function add($validation) {
if ($validation->hadError) {
$this->hadError = true;}
array_push($this->validations, $validation);}

function stringify() {
$anon = [];
$status = "success";
if ($this->hadError) {
$status = "error";}
for ($i = 0; $i < count($this->validations); $i++) {
if (_c_lib__arrUtils::readIndex($this->validations, $i)->hadError) {
$status = "error";}
array_push($anon, "\"" . _c_lib__arrUtils::readIndex($this->validations, $i)->stringify() . "\"");}
$add = "";
if (strlen($this->href) > 0) {
$add .= ", \"action\": \"navigate\", \"href\": \"" . $this->href . "\"";
$status = "action";}
if ($this->doReload) {
$add .= ", \"action\": \"reload\"";
$status = "action";}
return "{\"status\": \"" . $status . "\", \"messages\": [" . implode(", ", $anon) . "], \"message\": " . Websom_Json::encode($this->message) . $add . "}";}


}class Websom_Module {
public $server;

public $baseConfig;

public $containers;

public $bridges;

public $name;

public $id;

public $root;

public $version;

public $author;

public $license;

public $repo;

function __construct($server) {
$this->server = null;
$this->baseConfig = null;
$this->containers = [];
$this->bridges = [];
$this->name = "";
$this->id = "";
$this->root = "";
$this->version = "";
$this->author = "";
$this->license = "";
$this->repo = "";

$this->server = $server;
}
function clientData($req, $send) {
return false;}

function spawn($config) {
$this->baseConfig = $config;
$this->name = $config["name"];
$this->id = $config["id"];}

function start() {
}

function stop() {
}

function setupData() {
}

function setupBridge() {
}


}class Websom_Pack {
public $server;

public $name;

public $root;

public $config;

function __construct($server, $name, $root, $config) {
$this->server = null;
$this->name = "";
$this->root = "";
$this->config = null;

$this->server = $server;
$this->name = $name;
$this->root = $root;
$this->config = $config;
}
function start() {
}

function _c__include() {
$dir = $this->server->config->clientResources . "/pack/" . $this->name;
$css = "<link rel=\"stylesheet\" type=\"text/css\" href=\"" . $dir . "/pack.css\"/>";
return "<script src=\"" . $dir . "/pack.js\"></script>" . $css;}

function write($js, $css) {
$dir = $this->server->config->resources . "/pack/" . $this->name;
if (Oxygen_FileSystem::exists($dir) == false) {
Oxygen_FileSystem::makeDir($dir);}
Oxygen_FileSystem::writeSync($dir . "/pack.js", $js);
Oxygen_FileSystem::writeSync($dir . "/pack.css", $css);}

function buildAndSave($callback) {
$that = $this;
$this->build(function ($err, $js, $css) use (&$callback, &$that) {$that->write($js, $css);
$callback->__invoke($err);});}

function &getViews() {
$views = [];
$resources = &$this->config["resources"];
$outputs = &$this->server->resource->compile("Pack." . $this->name, $this->root, $resources);
for ($i = 0; $i < count($outputs); $i++) {
$resource = _c_lib__arrUtils::readIndex($outputs, $i);
if ($resource->type == "view") {
$view = new Websom_View($this->server);
$view->loadFromFile($resource->file);
array_push($views, $view);}}
return $views;}

function build($callback) {
$that = $this;
$dones = 0;
$css = "";
$js = "";
$err = "";
$doneJs = function ($hadError, $results) use (&$callback, &$that, &$dones, &$css, &$js, &$err, &$doneJs, &$doneCss, &$resources, &$outputs) {$dones--;
$js .= $results;
if ($hadError) {
$err .= $results . "\n";}
if ($dones == 0) {
$callback->__invoke($err, $js, $css);}};
$doneCss = function ($hadError, $results) use (&$callback, &$that, &$dones, &$css, &$js, &$err, &$doneJs, &$doneCss, &$resources, &$outputs) {$dones--;
$css .= $results;
if ($hadError) {
$err .= $results . "\n\n";}
if ($dones == 0) {
$callback->__invoke($err, $js, $css);}};
$resources = &$this->config["resources"];
$outputs = &$this->server->resource->compile("Pack." . $this->name, $this->root, $resources);
$dones = count($outputs);
for ($i = 0; $i < count($outputs); $i++) {
$resource = _c_lib__arrUtils::readIndex($outputs, $i);
if ($resource->type == "javascript") {
$resource->build($doneJs);}else if ($resource->type == "less") {
$resource->reference = Oxygen_FileSystem::resolve(Oxygen_FileSystem::dirName($this->server->scriptPath) . "/../../theme/style/main.less");
$resource->build($doneCss);}else if ($resource->type == "css") {
$resource->build($doneCss);}else if ($resource->type == "view") {
$view = new Websom_View($this->server);
$viewErr = $view->loadFromFile($resource->file);
if ($viewErr != null) {
$err .= $viewErr->display() . "\n";}
$view->hasLocalExport = true;
$doneJs->__invoke(false, $view->buildDev());}else if ($resource->isInvalid) {
$err .= "Invalid resource: '" . $resource->file . "'\n";
$dones--;
if ($i == count($outputs) - 1) {
if ($dones == 0) {
$callback->__invoke($err, $js, $css);}}}}}


}class Websom_Request {
public $server;

public $client;

public $sent;

public $path;

public $userCache;

public $response;

public $jsRequest;

public $session;

function __construct($server, $client) {
$this->server = null;
$this->client = null;
$this->sent = false;
$this->path = "";
$this->userCache = null;
$this->response = null;
$this->jsRequest = null;
$this->session = null;

$this->server = $server;
$this->client = $client;
$this->response = new Websom_Response();
$this->session = new Websom_Session($this);
}
function header($name, $value) {


			header($name . ": " . $value);
		}

function code($code) {
$this->response->code = $code;


			http_response_code($code);
		}

function end() {
}

function flush() {
}

function write($content) {


			echo $content;
		}

function send($content) {
if ($this->sent) {
return null;}


			echo $content;
		
$this->sent = true;}

function redirect($route) {


			header("Location: " . $route);
		}

function download($name, $path, $type) {


			header('Content-Type: application/pdf');
			header("Content-Disposition: attachment; filename=" . $name);
			header("Content-Length: " . filesize($path));

			readfile($path);
		}

function getUser($callback) {
if ($this->server->userSystem != null) {
$this->server->userSystem->getLoggedIn($this, $callback);}else{
$callback->__invoke(null);}}


}class Websom_Session {
public $request;

function __construct($req) {
$this->request = null;

$this->request = $req;
}
function set($key, $value) {


			if (!isset($_SESSION)) session_start();
			$_SESSION[$key] = $value;
		}

function delete($key) {


			if (!isset($_SESSION)) session_start();
			unset($_SESSION[$key]);
		}

function get($key) {


			if (!isset($_SESSION)) session_start();
			if (isset($_SESSION[$key]))
				return $_SESSION[$key];
			else
				return NULL;
		}


}class Websom_Response {
public $code;

public $body;

public $message;

function __construct() {
$this->code = 0;
$this->body = "";
$this->message = "";


}

}class Websom_Status {
public $notices;

public $hadError;

function __construct() {
$this->notices = [];
$this->hadError = false;


}
function inherit($status) {
if ($status == null) {
return null;}
for ($i = 0; $i < count($status->notices); $i++) {
array_push($this->notices, _c_lib__arrUtils::readIndex($status->notices, $i));}
$this->hadError = $status->hadError;}

function give(...$arguments) {
if (count($arguments) == 2 and (gettype($arguments[0]) == 'string' or gettype($arguments[0]) == 'NULL') and (gettype($arguments[1]) == 'string' or gettype($arguments[1]) == 'NULL')) {
$module = $arguments[0];
$message = $arguments[1];
$notice = new Websom_Notice($module, $message);
array_push($this->notices, $notice);
return $notice;
}
else if (count($arguments) == 3 and (gettype($arguments[0]) == 'integer' or gettype($arguments[0]) == 'NULL') and (gettype($arguments[1]) == 'string' or gettype($arguments[1]) == 'NULL') and (gettype($arguments[2]) == 'string' or gettype($arguments[2]) == 'NULL')) {
$level = $arguments[0];
$module = $arguments[1];
$message = $arguments[2];
$notice = new Websom_Notice($module, $message);
$notice->level = $level;
array_push($this->notices, $notice);
if ($level == 4) {
$this->hadError = true;}
return $notice;
}
}

function display() {
if (count($this->notices) == 0) {
return "Ok";}
$out = "";
if ($this->hadError) {
$out .= ":Websom: :Error:\n";}
for ($i = 0; $i < count($this->notices); $i++) {
$out .= _c_lib__arrUtils::readIndex($this->notices, $i)->display();}
return $out;}

function clear() {
for ($i = count($this->notices) - 1;$i >= 0;$i--) {
array_pop($this->notices);}}

static function singleError($module, $error) {
$status = new Websom_Status();
$status->give(4, $module, $error);
return $status;}


}class Websom_Notice {
public $code;

public $module;

public $message;

public $line;

public $column;

public $offset;

public $level;

function __construct($module, $message) {
$this->code = 0;
$this->module = "";
$this->message = "";
$this->line = 0;
$this->column = 0;
$this->offset = 0;
$this->level = 2;

$this->module = $module;
$this->message = $message;
}
function display() {
return $this->module . ": " . $this->message;}


}class Websom_Theme {
public $server;

public $name;

public $key;

public $root;

public $config;

function __construct($server, $name, $root, $config) {
$this->server = null;
$this->name = "";
$this->key = "";
$this->root = "";
$this->config = null;

$this->server = $server;
$this->name = $name;
$this->root = $root;
$this->config = $config;
if (isset($this->config["key"])) {
$this->key = $this->config["key"];}
}
function start() {
}

function prefix() {
if (strlen($this->key) > 0) {
return "theme-" . $this->key;}
return "theme";}

function _c__include() {
$dir = $this->server->config->clientResources . "/" . $this->prefix();
return "<script src=\"" . $dir . "/theme.js\"></script><link rel=\"stylesheet\" type=\"text/css\" href=\"" . $dir . "/theme.css\"/>";}

function write($js, $css) {
$dir = $this->server->config->resources . "/" . $this->prefix();
if (Oxygen_FileSystem::exists($dir) == false) {
Oxygen_FileSystem::makeDir($dir);}
Oxygen_FileSystem::writeSync($dir . "/theme.js", $js);
Oxygen_FileSystem::writeSync($dir . "/theme.css", $css);}

function buildAndSave($callback) {
$that = $this;
$this->build(function ($err, $js, $css) use (&$callback, &$that) {$that->write($js, $css);
$callback->__invoke($err);});}

function build($callback) {
$that = $this;
$dones = 0;
$css = "";
$js = "";
$err = "";
$doneJs = function ($hadError, $results) use (&$callback, &$that, &$dones, &$css, &$js, &$err, &$doneJs, &$doneCss, &$resources, &$outputs) {$dones--;
$js .= $results;
if ($hadError) {
$err .= $results . "\n";}
if ($dones == 0) {
$callback->__invoke($err, $js, $css);}};
$doneCss = function ($hadError, $results) use (&$callback, &$that, &$dones, &$css, &$js, &$err, &$doneJs, &$doneCss, &$resources, &$outputs) {$dones--;
$css .= $results;
if ($hadError) {
$err .= $results . "\n\n";}
if ($dones == 0) {
$callback->__invoke($err, $js, $css);}};
$resources = &$this->config["resources"];
$outputs = &$this->server->resource->compile("Theme." . $this->name, $this->root, $resources);
$dones = count($outputs);
for ($i = 0; $i < count($outputs); $i++) {
$resource = _c_lib__arrUtils::readIndex($outputs, $i);
if ($resource->type == "javascript") {
$resource->build($doneJs);}else if ($resource->type == "less") {
$resource->reference = Oxygen_FileSystem::resolve(Oxygen_FileSystem::dirName($this->server->scriptPath) . "/../../theme/style/main.less");
$resource->build($doneCss);}else if ($resource->type == "css") {
$resource->build($doneCss);}else if ($resource->type == "view") {
$view = new Websom_View($this->server);
$viewErr = $view->loadFromFile($resource->file);
if ($viewErr != null) {
$err .= $viewErr->display() . "\n";}
$view->hasLocalExport = true;
$doneJs->__invoke(false, $view->buildDev());}else if ($resource->isInvalid) {
$err .= "Invalid resource: '" . $resource->file . "'\n";
$dones--;
if ($i == count($outputs) - 1) {
if ($dones == 0) {
$callback->__invoke($err, $js, $css);}}}}}


}class Websom_View {
public $server;

public $engine;

public $type;

public $renderView;

public $raw;

public $shallow;

public $renderViewData;

public $handles;

public $greedy;

public $meta;

public $template;

public $serverHandles;

public $client;

public $location;

public $owner;

public $websiteView;

public $hasServerScript;

public $phpScript;

public $jsScript;

public $carbonScript;

public $hasLocalExport;

public $isPage;

public $name;

function __construct($server) {
$this->server = null;
$this->engine = "vue";
$this->type = 0;
$this->renderView = null;
$this->raw = null;
$this->shallow = false;
$this->renderViewData = null;
$this->handles = "";
$this->greedy = false;
$this->meta = null;
$this->template = "";
$this->serverHandles = null;
$this->client = "";
$this->location = "";
$this->owner = null;
$this->websiteView = false;
$this->hasServerScript = false;
$this->phpScript = "";
$this->jsScript = "";
$this->carbonScript = "";
$this->hasLocalExport = false;
$this->isPage = false;
$this->name = "";

$this->server = $server;
}
function render($ctx) {
return $this->server->render->renderView($this, $ctx);}

function &quickParse($raw) {
}

function &parse($raw) {
$this->shallow = false;
$open = false;
$opens = 0;
$name = "";
$block = "";
$openChar = "{";
$closeChar = "}";
$escape = false;
$blocks = new _carb_map();
for ($i = 0;$i < strlen($raw);$i++) {
$char = $raw[$i];
if ($open == false) {
if ($char != "\t" and $char != $openChar and $char != "\n" and $char != "\ r") {
$name .= $char;}else if ($char == $openChar) {
$open = true;}}else{
if ($char == $closeChar) {
if ($opens == 0) {
$name = trim($name, "\n\t\r ");
$blocks[$name] = $block;
$open = false;
$name = "";
$block = "";}else{
$opens--;
$block .= $char;}}else if ($char == $openChar) {
$opens++;
$block .= $char;}else{
$block .= $char;}}}
return $blocks;}

function loadFromFile($location) {
$this->location = $location;
$raw = Oxygen_FileSystem::readSync($location, "utf8");
$output = &$this->parse($raw);
$this->raw = $output;
if (isset($output["info"])) {
$this->meta = Websom_Json::parse("{" . $output["info"] . "}");
if (isset($this->meta["name"])) {
$this->name = $this->meta["name"];}else{
return Websom_Status::singleError("View", "No name provided in view: '" . $location . "'");}
if (isset($this->meta["handles"])) {
$this->handles = $this->meta["handles"];}
if (isset($this->meta["greedy"])) {
$this->greedy = $this->meta["greedy"];}}else{
return Websom_Status::singleError("View", "No info provided in view: '" . $location . "'");}
if (isset($output["template"])) {
$this->template = $output["template"];}
if (isset($output["client"])) {
$this->client = $output["client"];}
if (isset($output["server php"])) {
$this->hasServerScript = true;
$this->phpScript = $output["server php"];}

if (isset($output["server carbon"])) {
$this->hasServerScript = true;
if ($this->server->config->dev) {
}}}

function runServerScript($req) {
if (strlen($this->jsScript) > 0) {
}else if ($this->hasServerScript) {


				$func = require($this->server->config->root . "/pages/scripts_" . $this->name . ".php");
				return $func($this, $this->server, $req);
			}

			                                        
			throw new Exception("Raw php view page scripts are not supported yet.");
		}

function buildDev() {
$opts = "props: ['data'], ";
if (strlen($this->client) > 0) {
$opts = $this->client . ", ";}
return "if (!('" . $this->name . "' in Websom.views.loaded)) {Websom.views.loaded['" . $this->name . "'] = Vue.component('" . $this->name . "', {" . $opts . "template: `" . preg_replace('/'."`".'/', "\\`", $this->template) . "`});}";}

function buildRenderView() {
if ($this->shallow) {
$this->renderView = new Websom_Render_View($this);
$this->renderView->deserialize($this->renderViewData);}else{
$this->renderView = new Websom_Render_View($this);
$this->renderView->parse();}}

function &serialize() {
$mp = new _carb_map();
if ($this->renderView == null) {
$this->buildRenderView();}
$mp["render"] = $this->renderView->serialize();
$mp["meta"] = $this->meta;
return $mp;}

function deserialize($data) {
$this->meta = $data["meta"];
$this->name = $this->meta["name"];
if (isset($this->meta["handles"])) {
$this->handles = $this->meta["handles"];}
if (isset($this->meta["greedy"])) {
$this->greedy = $this->meta["greedy"];}
$this->renderViewData = $data["render"];}


}class Websom_Render_Context {
public $data;

public $props;

public $slotContext;

public $slot;

function __construct() {
$this->data = null;
$this->props = null;
$this->slotContext = null;
$this->slot = null;

$this->data = new _carb_map();
$this->props = new _carb_map();
}
function find($key) {
$splits = explode(".", $key);
$root = null;
if (isset($this->data[_c_lib__arrUtils::readIndex($splits, 0)])) {
$root = $this->data[_c_lib__arrUtils::readIndex($splits, 0)];}else if (isset($this->props[_c_lib__arrUtils::readIndex($splits, 0)])) {
$root = $this->props[_c_lib__arrUtils::readIndex($splits, 0)];}
if ($root == null) {
return "Unkown variable " . $key;}
if (count($splits) == 1) {
return $root;}else{
array_shift($splits);
return $this->findRooted($root, $splits);}}

function findRooted($base, $splits) {
if (count($splits) == 1) {
return $base[_c_lib__arrUtils::readIndex($splits, 0)];}else{
array_shift($splits);
return $this->findRooted($base, $splits);}}


}class Websom_Render_Element {
public $name;

public $attributes;

public $children;

public $isText;

function __construct($server, $name) {
$this->name = "";
$this->attributes = null;
$this->children = null;
$this->isText = false;

$this->name = $name;
$this->children = [];
$this->attributes = new _carb_map();
}
function render($ctx) {
if ($this->name == "slot") {
$children = "";
if ($ctx->slot != null) {
for ($i = 0; $i < count($ctx->slot); $i++) {
$children .= _c_lib__arrUtils::readIndex($ctx->slot, $i)->render($ctx->slotContext);}}
return $children;}
$children = "";
for ($i = 0; $i < count($this->children); $i++) {
$children .= _c_lib__arrUtils::readIndex($this->children, $i)->render($ctx);}
$attrs = "";
foreach ($this->attributes as $key => $_c_v__k0) {
if ($key[0] == ":") {
$attrs .= " " . $key . "=\"" . $ctx->find($this->attributes[$key]) . "\"";}else{
$attrs .= " " . $key . "=\"" . $this->attributes[$key] . "\"";}}
return "<" . $this->name . $attrs . ">" . $children . "</" . $this->name . ">";}

static function parse($server, $html) {


			$content = new DOMDocument();
			libxml_use_internal_errors(true);
			$content->loadHTML($html);
			libxml_clear_errors();
			return self::makeFromObj($server, $content->documentElement->childNodes[0]->childNodes[0]);
		}

static function makeFromObj($server, $arg) {
$isText = false;
$textContent = "";


			if ($arg->nodeType == XML_TEXT_NODE) {
				$isText = true;
				$textContent = $arg->textContent;
			}
		
if ($isText) {
return new Websom_Render_Text($textContent);}else{
$nodeName = "";

				$nodeName = $arg->nodeName;
			

$elem = null;
$renderView = $server->render->findView($nodeName);
if ($renderView != null) {
$elem = new Websom_Render_ViewRef($server, $renderView);}else{
$elem = new Websom_Render_Element($server, $nodeName);}
$children = [];

				if ($arg->attributes)
				foreach ($arg->attributes as $node) {
					$elem->attributes[$node->nodeName] = $node->nodeValue;
				}

				$children = $arg->childNodes;
			

for ($i = 0; $i < count($children); $i++) {

					if ($children[$i]->nodeType == XML_COMMENT_NODE)
						continue;
				

array_push($elem->children, Websom_Render_Element::makeFromObj($server, _c_lib__arrUtils::readIndex($children, $i)));}
return $elem;}}

function &serialize() {
return $this->basicSerialize();}

function deserializeChildren($server, $children) {
$this->children = [];
for ($i = 0; $i < count($children); $i++) {
$child = &_c_lib__arrUtils::readIndex($children, $i);
array_push($this->children, Websom_Render_Node::deserialize($server, $child));}}

function &basicSerialize() {
$mp = new _carb_map();
$mp["t"] = "e";
$mp["n"] = $this->name;
$children = [];
for ($i = 0; $i < count($this->children); $i++) {
$child = _c_lib__arrUtils::readIndex($this->children, $i);
array_push($children, $child->serialize());}
$mp["c"] = $children;
$mp["a"] = $this->attributes;
return $mp;}

static function deserialize($server, $data) {
$type = $data["t"];
if ($type == "e") {
$e = new Websom_Render_Element($server, $data["n"]);
$e->deserializeChildren($server, $data["c"]);
$e->attributes = $data["a"];
return $e;}else if ($type == "t") {
$t = new Websom_Render_Text($data["c"]);
return $t;}else if ($type == "r") {
$e = new Websom_Render_ViewRef($server, $server->render->findView($data["n"]));
$e->deserializeChildren($server, $data["c"]);
$e->attributes = $data["a"];
return $e;}
return null;}


}class Websom_Render_Node {
public $isText;

function __construct(...$arguments) {
$this->isText = false;


}
function render($ctx) {
}

static function deserialize($server, $data) {
$type = $data["t"];
if ($type == "e") {
$e = new Websom_Render_Element($server, $data["n"]);
$e->deserializeChildren($server, $data["c"]);
$e->attributes = $data["a"];
return $e;}else if ($type == "t") {
$t = new Websom_Render_Text($data["c"]);
return $t;}else if ($type == "r") {
$e = new Websom_Render_ViewRef($server, $server->render->findView($data["n"]));
$e->deserializeChildren($server, $data["c"]);
$e->attributes = $data["a"];
return $e;}
return null;}


}class Websom_Render_ViewRef {
public $view;

public $name;

public $attributes;

public $children;

public $isText;

function __construct($server, $view) {
$this->view = null;
$this->name = "";
$this->attributes = null;
$this->children = null;
$this->isText = false;

$this->view = $view;
$this->children = [];
$this->attributes = new _carb_map();
}
function render($ctx) {
$newCtx = new Websom_Render_Context();
$newCtx->slot = $this->children;
$newCtx->slotContext = $ctx;
foreach ($this->attributes as $key => $_c_v__k0) {
if ($key[0] == ":") {
$newCtx->props[substr($key, 1,strlen($key) - 1)] = $ctx->find($this->attributes[$key]);}else{
$newCtx->props[$key] = $ctx->find($this->attributes[$key]);}}
return $this->view->render($newCtx);}

function &serialize(...$arguments) {
if (count($arguments) == 0) {
$mp = &$this->basicSerialize();
$mp["t"] = "r";
return $mp;
}
else if (count($arguments) == 0) {
return $this->basicSerialize();
}
}

static function parse($server, $html) {


			$content = new DOMDocument();
			libxml_use_internal_errors(true);
			$content->loadHTML($html);
			libxml_clear_errors();
			return self::makeFromObj($server, $content->documentElement->childNodes[0]->childNodes[0]);
		}

static function makeFromObj($server, $arg) {
$isText = false;
$textContent = "";


			if ($arg->nodeType == XML_TEXT_NODE) {
				$isText = true;
				$textContent = $arg->textContent;
			}
		
if ($isText) {
return new Websom_Render_Text($textContent);}else{
$nodeName = "";

				$nodeName = $arg->nodeName;
			

$elem = null;
$renderView = $server->render->findView($nodeName);
if ($renderView != null) {
$elem = new Websom_Render_ViewRef($server, $renderView);}else{
$elem = new Websom_Render_Element($server, $nodeName);}
$children = [];

				if ($arg->attributes)
				foreach ($arg->attributes as $node) {
					$elem->attributes[$node->nodeName] = $node->nodeValue;
				}

				$children = $arg->childNodes;
			

for ($i = 0; $i < count($children); $i++) {

					if ($children[$i]->nodeType == XML_COMMENT_NODE)
						continue;
				

array_push($elem->children, Websom_Render_Element::makeFromObj($server, _c_lib__arrUtils::readIndex($children, $i)));}
return $elem;}}

function deserializeChildren($server, $children) {
$this->children = [];
for ($i = 0; $i < count($children); $i++) {
$child = &_c_lib__arrUtils::readIndex($children, $i);
array_push($this->children, Websom_Render_Node::deserialize($server, $child));}}

function &basicSerialize() {
$mp = new _carb_map();
$mp["t"] = "e";
$mp["n"] = $this->name;
$children = [];
for ($i = 0; $i < count($this->children); $i++) {
$child = _c_lib__arrUtils::readIndex($this->children, $i);
array_push($children, $child->serialize());}
$mp["c"] = $children;
$mp["a"] = $this->attributes;
return $mp;}

static function deserialize($server, $data) {
$type = $data["t"];
if ($type == "e") {
$e = new Websom_Render_Element($server, $data["n"]);
$e->deserializeChildren($server, $data["c"]);
$e->attributes = $data["a"];
return $e;}else if ($type == "t") {
$t = new Websom_Render_Text($data["c"]);
return $t;}else if ($type == "r") {
$e = new Websom_Render_ViewRef($server, $server->render->findView($data["n"]));
$e->deserializeChildren($server, $data["c"]);
$e->attributes = $data["a"];
return $e;}
return null;}


}class Websom_Render_Text {
public $text;

public $isText;

function __construct($text) {
$this->text = "";
$this->isText = false;

$this->isText = true;
$this->text = $text;
}
function render($ctx) {
$str = $this->text;

			$str = preg_replace_callback("{{([^}]*)}}", function ($match) {
					return $ctx->find($match[0]);
				}, $str);
		

return $str;}

function &serialize() {
$mp = new _carb_map();
$mp["t"] = "t";
$mp["c"] = $this->text;
return $mp;}

static function deserialize($server, $data) {
$type = $data["t"];
if ($type == "e") {
$e = new Websom_Render_Element($server, $data["n"]);
$e->deserializeChildren($server, $data["c"]);
$e->attributes = $data["a"];
return $e;}else if ($type == "t") {
$t = new Websom_Render_Text($data["c"]);
return $t;}else if ($type == "r") {
$e = new Websom_Render_ViewRef($server, $server->render->findView($data["n"]));
$e->deserializeChildren($server, $data["c"]);
$e->attributes = $data["a"];
return $e;}
return null;}


}class Websom_Render_View {
public $view;

public $root;

function __construct($view) {
$this->view = null;
$this->root = null;

$this->view = $view;
}
function parse() {
$this->root = Websom_Render_Element::parse($this->view->server, $this->view->template);}

function render($ctx) {
return $this->root->render($ctx);}

function &serialize() {
return $this->root->serialize();}

function deserialize($data) {
$this->root = new Websom_Render_Element($this->view->server, $data["n"]);
$this->root::deserialize($this->view->server, $data);}


}class Websom_Controls_AddTo {
public $fieldName;

public $listFieldName;

public $collection;

public $item;

public $check;

public $server;

public $container;

function __construct(...$arguments) {
$this->fieldName = "";
$this->listFieldName = "";
$this->collection = null;
$this->item = null;
$this->check = null;
$this->server = null;
$this->container = null;

if (count($arguments) == 5 and ((_c_lib_run::getClass($arguments[0]) == 'Websom_Containers_Table') or gettype($arguments[0]) == 'NULL') and ((_c_lib_run::getClass($arguments[1]) == 'Websom_Containers_Table') or gettype($arguments[1]) == 'NULL') and (gettype($arguments[2]) == 'string' or gettype($arguments[2]) == 'NULL') and (gettype($arguments[3]) == 'string' or gettype($arguments[3]) == 'NULL') and (is_callable($arguments[4]) or gettype($arguments[4]) == 'NULL')) {
$collection = $arguments[0];
$item = $arguments[1];
$listFieldName = $arguments[2];
$fieldName = $arguments[3];
$check = $arguments[4];
$this->collection = $collection;
$this->item = $item;
$this->listFieldName = $listFieldName;
$this->check = $check;
$this->fieldName = $fieldName;
}
else if (count($arguments) == 4 and ((_c_lib_run::getClass($arguments[0]) == 'Websom_Containers_Table') or gettype($arguments[0]) == 'NULL') and ((_c_lib_run::getClass($arguments[1]) == 'Websom_Containers_Table') or gettype($arguments[1]) == 'NULL') and (gettype($arguments[2]) == 'string' or gettype($arguments[2]) == 'NULL') and (gettype($arguments[3]) == 'string' or gettype($arguments[3]) == 'NULL')) {
$collection = $arguments[0];
$item = $arguments[1];
$listFieldName = $arguments[2];
$fieldName = $arguments[3];
$this->collection = $collection;
$this->item = $item;
$this->listFieldName = $listFieldName;
$this->fieldName = $fieldName;
}

}
function message($inp, $name, $data, $send) {
$send->__invoke(null);}

function addTo($collection, $item) {
$that = $this;
$_c__list = $collection->getFieldContainer($this->listFieldName);
$itemId = $item->getField("id");
$select = $_c__list->from()->where("parentId")->equals($collection->getField("id"))->and()->where($this->fieldName)->equals($itemId);
$select->run(function ($err, $datas) use (&$collection, &$item, &$that, &$_c__list, &$itemId, &$select) {if ($err == null) {
if (count($datas) > 0) {
$select->delete()->run(function ($delErr, $delData) use (&$err, &$datas, &$collection, &$item, &$that, &$_c__list, &$itemId, &$select) {});}else{
$curId = $collection->getField($that->listFieldName);
$_c__list->into()->set("arrayIndex", $curId + 1)->set($that->fieldName, $itemId)->set("parentId", $collection->getField("id"))->run(function ($addErr, $newId) use (&$curId, &$containerCast, &$err, &$datas, &$collection, &$item, &$that, &$_c__list, &$itemId, &$select) {});
$containerCast = $collection->websomContainer;
$containerCast->from()->where("id")->equals($collection->getField("id"))->set($that->listFieldName, $curId + 1)->update()->run(function ($upErr, $upData) use (&$curId, &$containerCast, &$err, &$datas, &$collection, &$item, &$that, &$_c__list, &$itemId, &$select) {});}}});}

function _c__use($ic) {
$that = $this;
$ic->key("collection")->is($this->collection)->key("item")->is($this->item)->success(function ($input, $data) use (&$ic, &$that) {if ($that->check != null) {
$that->check->__invoke($input->request, $data["collection"], $data["item"], function ($shouldContinue) use (&$input, &$data, &$ic, &$that) {if ($shouldContinue) {
$collection = $data["collection"];
$item = $data["item"];
$that->addTo($collection, $item);}else{
$input->sendError("Invalid input");}});}else{
$collection = $data["collection"];
$item = $data["item"];
$that->addTo($collection, $item);}});}

function validate($input, $done) {
$done->__invoke(null);}

function fill($input, $values, $done) {
$done->__invoke();}

function filter($input, $select, $done) {
$done->__invoke(null);}

function insert($input, $data, $key) {
}

function update($input, $data) {
}


}class Websom_Controls_File {
public $keyName;

public $maxSize;

public $validateHook;

public $successHook;

public $server;

public $container;

function __construct($keyName, $maxSize, $validate, $success) {
$this->keyName = "";
$this->maxSize = 0;
$this->validateHook = null;
$this->successHook = null;
$this->server = null;
$this->container = null;

$this->keyName = $keyName;
$this->maxSize = $maxSize;
$this->validateHook = $validate;
$this->successHook = $success;
}
function validate($input, $done) {
if (isset($input->files[$this->keyName])) {
for ($i = 0; $i < count($input->files[$this->keyName]); $i++) {
$file = &$input->files[$this->keyName];
if ($file->size > $this->maxSize) {
$done->__invoke(new Websom_InputValidation(true, "File exceeds limit of " . $this->maxSize / 1024 . "kb"));
return null;}}
$this->validateHook->__invoke($input, $input->files[$this->keyName], function ($validation) use (&$input, &$done) {if ($validation != null and $validation->hadError) {
$done->__invoke($validation);}else{
$done->__invoke(new Websom_InputValidation(false, ""));}});}else{
$done->__invoke(new Websom_InputValidation(true, "No file for field " . $this->keyName));}}

function fill($input, $raw, $done) {
$done->__invoke();}

function insert($input, $data, $key) {
$this->successHook->__invoke(true, $input, $data, $input->files[$this->keyName]);}

function update($input, $data) {
$this->successHook->__invoke(false, $input, $data, $input->files[$this->keyName]);}

function filter($input, $select, $done) {
$done->__invoke(new Websom_InputValidation(false, ""));}

function message($input, $name, $data, $send) {
$send->__invoke(null);}

function _c__use($inputChain) {
}


}class Websom_Controls_Unique {
public $required;

public $name;

public $field;

public $logic;

public $fieldInfo;

public $server;

public $container;

function __construct(...$arguments) {
$this->required = false;
$this->name = "";
$this->field = "";
$this->logic = "or";
$this->fieldInfo = null;
$this->server = null;
$this->container = null;

if (count($arguments) == 1 and (gettype($arguments[0]) == 'string' or gettype($arguments[0]) == 'NULL')) {
$field = $arguments[0];
$this->name = $field;
$this->field = $field;
}
else if (count($arguments) == 2 and (gettype($arguments[0]) == 'string' or gettype($arguments[0]) == 'NULL') and (gettype($arguments[1]) == 'string' or gettype($arguments[1]) == 'NULL')) {
$field = $arguments[0];
$logic = $arguments[1];
$this->name = $field;
$this->field = $field;
$this->logic = $logic;
}
else if (count($arguments) == 3 and (gettype($arguments[0]) == 'string' or gettype($arguments[0]) == 'NULL') and (gettype($arguments[1]) == 'string' or gettype($arguments[1]) == 'NULL') and ((_c_lib_run::getClass($arguments[2]) == 'Websom_FieldInfo') or gettype($arguments[2]) == 'NULL')) {
$name = $arguments[0];
$field = $arguments[1];
$fieldInfo = $arguments[2];
$this->name = $name;
$this->field = $field;
$this->fieldInfo = $fieldInfo;
}

}
function validateField($input, $value, $done) {
$that = $this;
$container = $this->container;
$container->from()->where($this->field)->equals($value)->run(function ($err, $docs) use (&$input, &$value, &$done, &$that, &$container) {if ($err != null) {
$done->__invoke(new Websom_InputValidation(true, "Unable to complete request"));}else{
if (count($docs) > 0) {
$done->__invoke(new Websom_InputValidation(true, "The " . $that->field . " must be unique"));}else{
$done->__invoke(null);}}});}

function validate($input, $done) {
if (isset($input->raw[$this->name])) {
$this->validateField($input, $input->raw[$this->name], $done);}else if ($this->required) {
$done->__invoke(new Websom_InputValidation(true, "Missing field " . $this->name));}else{
$done->__invoke(new Websom_InputValidation(false, ""));}}

function fill($input, $values, $done) {
$this->fillField($input->raw[$this->name], $values);
$done->__invoke();}

function filter($input, $select, $done) {
if (isset($input->raw[$this->name])) {
if ($this->logic == "and") {
$select->and();}else{
$select->or();}
$val = $this->filterField($input->raw[$this->name], $select, $done);}else if ($this->required) {
$done->__invoke(new Websom_InputValidation(true, "Missing field " . $this->name));}else{
$done->__invoke(null);}}

function fillField($value, $values) {
}

function filterField($value, $select, $done) {
}

function insert($input, $data, $key) {
}

function update($input, $data) {
}

function message($input, $name, $data, $send) {
$send->__invoke(null);}

function _c__use($inputChain) {
}


}class Websom_Ini {

function __construct(...$arguments) {


}

}class Websom_Json {

function __construct(...$arguments) {


}
static function parse($input) {

			return json_decode($input, true);
		
}

static function encode($input) {

			return json_encode($input);
		
}


}class Websom_OAuth {

function __construct(...$arguments) {


}

}class Websom_OAuth_Response {
public $failed;

public $errorMessage;

public $data;

function __construct($errorMessage, $data) {
$this->failed = false;
$this->errorMessage = "";
$this->data = null;

$this->data = $data;
if ($this->errorMessage != null or strlen($errorMessage) != 0) {
$this->failed = true;}
$this->errorMessage = $errorMessage;
}

}class Websom_OAuth_Client {
public $clientId;

public $pass;

public $token;

public $tokenUrl;

public $expiration;

public $grantType;

public $stored;

public $storeExpired;

function __construct($tokenUrl, $clientId, $pass) {
$this->clientId = "";
$this->pass = "";
$this->token = "";
$this->tokenUrl = "";
$this->expiration = -1;
$this->grantType = "client_credentials";
$this->stored = false;
$this->storeExpired = true;

$this->clientId = $clientId;
$this->tokenUrl = $tokenUrl;
$this->pass = $pass;
}
function store($filename) {
$this->stored = true;
if (Oxygen_FileSystem::exists($filename)) {
$raw = Websom_Json::parse(Oxygen_FileSystem::readSync($filename, "utf8"));
$cast = $raw["expires"];
if (Websom_Time::now() > $cast) {
$this->storeExpired = true;}else{
$this->storeExpired = false;
$this->token = $raw["token"];}}}

function post($url, $data, $callback) {

			if ($this->storeExpired) { 
				$ch = curl_init();
				curl_setopt($ch, CURLOPT_URL, $this->tokenUrl);
				curl_setopt($ch, CURLOPT_HEADER, false);
				curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
				curl_setopt($ch, CURLOPT_POST, true);
				curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
				curl_setopt($ch, CURLOPT_USERPWD, $this->clientId.":".$this->pass);
				curl_setopt($ch, CURLOPT_POSTFIELDS, "grant_type=" . $this->grantType);
				
				$error = curl_error($ch);
				$response = null;

				if ($error) {
					$response = new Websom_OAuth_Response($error, []);
				}else{
					$cdata = curl_exec($ch);
					$response = new Websom_OAuth_Response(null, json_decode($cdata, false));
				}

				curl_close($ch);

				if ($response->failed) {
					callback($response);
					return;
				}

				$this->token = $response->data["access_token"];
			}

			$curl = curl_init($url);
            curl_setopt($curl, CURLOPT_POST, false);
            curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
            curl_setopt($curl, CURLOPT_HEADER, false);
			curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
            curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($curl, CURLOPT_HTTPHEADER, [
                'Authorization: Bearer ' . $this->token,
                'Accept: application/json',
                'Content-Type: application/json'
			]);
            $cdata = curl_exec($curl);
			$error = curl_error($ch);
            curl_close($curl);
			
			if ($error) {
				$callback(new Websom_OAuth_Response($error, []));
			}else{
				$callback(new Websom_OAuth_Response(null, json_decode($cdata, false)));
			}
		}


}class Websom_Path {

function __construct(...$arguments) {


}
static function relativePath($from, $to) {
                                                                                                           
			$from = is_dir($from) ? rtrim($from, '\/') . '/' : $from;
			$to = is_dir($to)   ? rtrim($to, '\/') . '/'   : $to;
			$from = str_replace('\\', '/', $from);
			$to = str_replace('\\', '/', $to);

			$from = explode('/', $from);
			$to = explode('/', $to);
			$relPath = $to;

			foreach ($from as $depth => $dir) {
				if ($dir === $to[$depth]) {
					array_shift($relPath);
				}else{
					$remaining = count($from) - $depth;
					if ($remaining > 1) {
						$padLength = (count($relPath) + $remaining - 1) * -1;
						$relPath = array_pad($relPath, $padLength, '..');
						break;
					}else{
						$relPath[0] = './' . $relPath[0];
					}
				}
			}
			return implode('/', $relPath);
		
}


}class Websom_PHP {

function __construct(...$arguments) {


}
static function load() {

			require __DIR__  . '/../../vendor/autoload.php';
		}


}class Websom_Http {

function __construct(...$arguments) {


}
static function postJson($server, $url, $data, $callback) {


			try {
				$ch = curl_init($url);
				$str = json_encode($data["body"]);

				if (!$server->config->sslVerifyPeer)
					curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
				
				curl_setopt($ch, CURLOPT_POST, 1);
				curl_setopt($ch, CURLOPT_POSTFIELDS, $str);
				curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
				curl_setopt($ch, CURLOPT_USERPWD, $data["auth"]["user"] . ":" . $data["auth"]["pass"]);
				curl_setopt($ch, CURLOPT_HTTPHEADER, [
					"Content-Type: application/json",
					"Content-Length: " . strlen($str)
				]);

				$response = curl_exec($ch);
				
				if ($response === false) {
					throw new Exception(curl_error($ch), curl_errno($ch));
				}

				curl_close($ch);

				$callback(json_decode($response, true));
			} catch(Exception $e) {
				if ($server->config->dev)
					throw $e;
				
				return $e;
			}
		}

static function get($url, $data, $callback) {
}


}class Websom_Result {
public $error;

public $hadError;

public $status;

public $data;

function __construct($error, $data) {
$this->error = "";
$this->hadError = false;
$this->status = 200;
$this->data = null;

$this->error = $error;
if ($error != null and strlen($error) > 0) {
$this->hadError = true;}
$this->data = $data;
}

}class Websom_RequestChain {
public $server;

public $url;

public $urlencode;

public $jsonencode;

public $data;

public $doAuth;

public $user;

public $pass;

public $bearer;

public $doParse;

public $_headers;

function __construct($server, $url) {
$this->server = null;
$this->url = "";
$this->urlencode = false;
$this->jsonencode = false;
$this->data = new _carb_map();
$this->doAuth = false;
$this->user = null;
$this->pass = null;
$this->bearer = null;
$this->doParse = false;
$this->_headers = new _carb_map();

$this->server = $server;
$this->url = $url;
}
function auth(...$arguments) {
if (count($arguments) == 2 and (gettype($arguments[0]) == 'string' or gettype($arguments[0]) == 'NULL') and (gettype($arguments[1]) == 'string' or gettype($arguments[1]) == 'NULL')) {
$user = $arguments[0];
$pass = $arguments[1];
$this->doAuth = true;
$this->user = $user;
$this->pass = $pass;
return $this;
}
else if (count($arguments) == 1 and (gettype($arguments[0]) == 'string' or gettype($arguments[0]) == 'NULL')) {
$bearer = $arguments[0];
$this->doAuth = true;
$this->bearer = $bearer;
return $this;
}
}

function parseJson() {
$this->doParse = true;
return $this;}

function json($data) {
$this->jsonencode = true;
$this->data = $data;}

function form(...$arguments) {
if (count($arguments) == 1 and ((gettype($arguments[0]) == 'array' ? _c_lib__mapUtils::isMap($arguments[0]) : (gettype($arguments[0]) == 'object' ? get_class($arguments[0]) == '_carb_map' : false)) or gettype($arguments[0]) == 'NULL')) {
$data = $arguments[0];
$this->urlencode = true;
$this->data = $data;
return $this;
}
else if (count($arguments) == 2 and (gettype($arguments[0]) == 'string' or gettype($arguments[0]) == 'NULL') and (((gettype($arguments[1]) == 'array') or gettype($arguments[1]) == 'boolean' or gettype($arguments[1]) == 'double' or gettype($arguments[1]) == 'integer' or (gettype($arguments[1]) == 'array' ? _c_lib__mapUtils::isMap($arguments[1]) : (gettype($arguments[1]) == 'object' ? get_class($arguments[1]) == '_carb_map' : false)) or gettype($arguments[1]) == 'string') or gettype($arguments[1]) == 'NULL')) {
$key = $arguments[0];
$value = $arguments[1];
$this->urlencode = true;
$this->data[$key] = $value;
return $this;
}
}

function header($key, $value) {
$this->_headers[$key] = $value;
return $this;}

function headers($headers) {
$this->_headers = $headers;
return $this;}

function makeRequest($method, $callback) {

			$ch = curl_init($this->url);
			$data = "";
			if ($this->urlencode) {
				$data = http_build_query($this->data->data);                        
				$this->header("Content-Type", "application/x-www-form-urlencoded");
			}else if ($this->jsonencode) {
				$data = json_encode($this->data);
				$this->header("Content-Type", "application/json");
			}
			$this->header("Content-Length", strlen($data));

			if (!$this->server->config->sslVerifyPeer)
				curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
			
			if ($method == "POST") {
				curl_setopt($ch, CURLOPT_POST, 1);
			}else if ($method == "GET") {
				curl_setopt($ch, CURLOPT_GET, 1);
			}

			curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
			curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
			
			if ($this->doAuth) {
				if ($this->bearer == null) {
					curl_setopt($ch, CURLOPT_USERPWD, $this->user . ":" . $this->pass);
				}else{
					$this->header("Authorization", "Bearer " . $this->bearer);
				}
			}

			$headers = [];
			
			foreach ($this->_headers as $key => $val) {
				$headers[] = $key . ": " . $val;
			}

			curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

			$response = curl_exec($ch);
			$error = null;
			
			if ($response === false) {
				$error = curl_error($ch);
			}else{
				if ($this->doParse)
					$response = json_decode($response, true);
			}

			$res = new Websom_Result($error, $response);
			$res->status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
			curl_close($ch);

			$callback($res);
		
}

function delete($callback) {
$this->makeRequest("DELETE", $callback);
return $this;}

function put($callback) {
$this->makeRequest("PUT", $callback);
return $this;}

function get($callback) {
$this->makeRequest("GET", $callback);
return $this;}

function post($callback) {
$this->makeRequest("POST", $callback);
return $this;}


}class Websom_Time {

function __construct(...$arguments) {


}
static function now() {

			return time();
		
}

static function year() {

			return Date("Y");
		
}


}class Websom_Standard {

function __construct(...$arguments) {


}

}class Websom_StandardModule {
public $server;

public $baseConfig;

public $containers;

public $bridges;

public $name;

public $id;

public $root;

public $version;

public $author;

public $license;

public $repo;

function __construct($server) {
$this->server = null;
$this->baseConfig = null;
$this->containers = [];
$this->bridges = [];
$this->name = "";
$this->id = "";
$this->root = "";
$this->version = "";
$this->author = "";
$this->license = "";
$this->repo = "";

$this->server = $server;
}
function clientData($req, $send) {
return false;}

function spawn($config) {
$this->baseConfig = $config;
$this->name = $config["name"];
$this->id = $config["id"];}

function start() {
}

function stop() {
}

function setupData() {
}

function setupBridge() {
}


}class Websom_StandardData {
public $websomFieldInfo;

public $websomParentData;

public $websomContainer;

public $websomServer;

function __construct($server) {
$this->websomFieldInfo = null;
$this->websomParentData = null;
$this->websomContainer = null;
$this->websomServer = null;

$this->websomServer = $server;
}
function callLoadFromMap($raw, $callback) {


			return $this->loadFromMap($raw, $callback);
		}

function setField($name, $value) {


			$this->$name = $value;
		}

static function getDataInfo() {


			return self::getInfo();
		}

static function spawnFromId($server, $table, $id, $done) {
$dataInfo = null;


			$dataInfo = self::getInfo();
		
$container = new Websom_Containers_Table($server, $table, $dataInfo);
$data = $dataInfo->spawn($server);
$data->websomContainer = $container;
$data->loadFromId($container, $id, function ($err) use (&$server, &$table, &$id, &$done, &$dataInfo, &$container, &$data) {$done->__invoke($err, $data);});}

function &exposeToClient() {


			return $this->exposeToClientBase();
		}


}class Websom_Databases_MySql {
public $connection;

public $server;

public $config;

public $name;

public $open;

public $connecting;

public $waits;

function __construct($server) {
$this->connection = null;
$this->server = null;
$this->config = null;
$this->name = "";
$this->open = false;
$this->connecting = false;
$this->waits = [];

$this->server = $server;
}
function connect($done) {
$host = $this->config["host"];
$database = $this->config["database"];
$username = $this->config["auth"]["admin"]["username"];
$password = $this->config["auth"]["admin"]["password"];
$this->connecting = true;

			$this->connection = new mysqli($host, $username, $password, $database);

			if ($this->connection->connect_error)
				$done(Websom_Status::singleError("Database.MySql", $this->connect_error));
			else {
				$this->open = true;
				$this->connecting = false;
				$done(null);
				$this->connected();
			}
		
}

function close() {
$this->open = false;

			$this->connection->close();
		
}

function from($table) {
return new Websom_MySqlDatabaseSelect($this, $table);}

function into($table) {
return new Websom_MySqlDatabaseInsert($this, $table);}

function flagField($field, $isAlter) {
$sql = "";
$last = " NOT NULL";
$add = "ADD";
if ($isAlter == false) {
$add = "";}
for ($i = 0; $i < count($field->flags); $i++) {
$flag = _c_lib__arrUtils::readIndex($field->flags, $i);
if ($flag->type == "primary") {
$last .= ", " . $add . " PRIMARY KEY(`" . $field->name . "`)";}else if ($flag->type == "autoIncrement") {
$sql .= " AUTO_INCREMENT";}else if ($flag->type == "unsigned") {
$sql .= " UNSIGNED";}}
return $sql . $last;}

function wFieldToMySql($field, $isAlter) {
$type = "";
if ($field->type->type == "varchar") {
$cast = $field->type;
$type = "VARCHAR(" . $cast->length . ")";}else if ($field->type->type == "text") {
$type = "TEXT";}else if ($field->type->type == "int") {
$type = "INT";}else if ($field->type->type == "bigInt") {
$type = "BIGINT";}else if ($field->type->type == "float") {
$type = "DOUBLE";}else if ($field->type->type == "bool") {
$type = "TINYINT(1)";}
return $type . $this->flagField($field, $isAlter);}

function runStructure($str, $callback) {
if ($this->open == false) {
$that = $this;
if ($this->connecting) {
$this->wait(function () use (&$that, &$str, &$callback) {$that->runStructure($str, $callback);});}else{
$this->connect(function ($status) use (&$that, &$str, &$callback) {$that->runStructure($str, $callback);});}
return null;}


			if ($result = $this->connection->query("DESCRIBE " . $str->table)) {          
				$names = [];
				$aQuery = "ALTER TABLE " . $str->table;
				$doQuery = false;

				while($val = $result->fetch_array(MYSQLI_ASSOC)) {
					$names[] = $val["Field"];
				}

				foreach ($str->fields as $field) {
					if (!in_array($field->name, $names)) {
						$aQuery .= " ADD `" . $field->name . "` " . $this->wFieldToMySql($field, true) . ";";
						$doQuery = true;
					}
				}

				$result->free();

				if ($doQuery)
					$this->connection->query($aQuery);
			}else{         
				$fields = [];
				
				foreach ($str->fields as $field) {
					$fields[] = "`" . $field->name . "` " . $this->wFieldToMySql($field, false);
				}

				$cQuery = "CREATE TABLE " . $str->table . " (" . implode(", ", $fields) . ")";
				$this->connection->query($cQuery);
				$callback("");
			}
		}

static function make($server, $type) {
if ($type == "mysql") {
return new Websom_Databases_MySql($server);}}

function wait($func) {
array_push($this->waits, $func);}

function load($config) {
$this->config = $config;
$this->name = $this->config["name"];}

function connected() {
for ($i = 0; $i < count($this->waits); $i++) {
_c_lib__arrUtils::readIndex($this->waits, $i)->__invoke();}}

function structure($table) {
return new Websom_DatabaseStructure($this, $table);}


}class Websom_MySqlDatabaseSelect {
public $currentWhere;

public $notMode;

public $query;

public $multiQuery;

public $values;

public $table;

public $workingField;

public $fields;

public $limitAmount;

public $limitOffset;

public $orderField;

public $orderWay;

public $doUpdate;

public $doDelete;

public $groupLevel;

public $freshGroup;

public $updates;

public $database;

function __construct($database, $table) {
$this->currentWhere = "";
$this->notMode = false;
$this->query = [];
$this->multiQuery = [];
$this->values = [];
$this->table = "";
$this->workingField = "";
$this->fields = "*";
$this->limitAmount = 0;
$this->limitOffset = 0;
$this->orderField = "";
$this->orderWay = "";
$this->doUpdate = false;
$this->doDelete = false;
$this->groupLevel = 0;
$this->freshGroup = false;
$this->updates = [];
$this->database = null;

$this->database = $database;
$this->table = $table;
}
function field($fields) {
$this->fields = $fields;
return $this;}

function _c__new() {
$str = $this->build();
$this->limitAmount = 0;
$this->limitOffset = 0;
$this->orderField = "";
if (strlen($str) > 0) {
array_push($this->multiQuery, $str);}
$this->query = [];
return $this;}

function where($field) {
if (strlen($this->currentWhere) > 0) {
array_push($this->query, $this->currentWhere);}
$this->currentWhere = "";
$this->workingField = $field;
return $this;}

function not() {
$this->notMode = true;
return $this;}

function getNot() {
if ($this->notMode) {
return "NOT";
$this->notMode = false;}else{
return "";}}

function in($values) {
$this->freshGroup = false;
$this->currentWhere .= "`" . $this->workingField . "` " . $this->getNot() . " IN (";
for ($i = 0; $i < count($values); $i++) {
$value = _c_lib__arrUtils::readIndex($values, $i);
$this->currentWhere .= "?";
if ($i != count($values) - 1) {
$this->currentWhere .= ", ";}
array_push($this->values, $value);}
$this->currentWhere .= ")";
return $this;}

function order($field, $order) {
$this->orderField = $field;
$this->orderWay = $order;
return $this;}

function build() {
if (strlen($this->currentWhere) > 0) {
array_push($this->query, $this->currentWhere);}
$this->currentWhere = "";
$whereState = "";
$limit = "";
if ($this->limitAmount != 0) {
if ($this->limitOffset != 0) {
$limit = " LIMIT " . $this->limitOffset . ", " . $this->limitAmount;}else{
$limit = " LIMIT " . $this->limitAmount;}}
$orderBy = "";
if (strlen($this->orderField) > 0) {
$orderBy = " ORDER BY " . $this->orderField . " " . $this->orderWay;}
$search = $this->trim(implode("", $this->query));
if ($this->groupLevel > 0) {
$search .= ")";}
if (strlen($search) > 0) {
$whereState = "WHERE " . $search;}
if ($this->doUpdate) {
$sets = [];
$shiftValues = [];
for ($i = 0; $i < count($this->updates); $i++) {
$update = _c_lib__arrUtils::readIndex($this->updates, $i);
array_push($shiftValues, $update->value);
array_push($sets, "`" . $update->field . "` = ?");}
$this->values = array_merge($shiftValues, $this->values);
return "UPDATE " . $this->table . " SET " . implode(", ", $sets) . " " . $whereState . $orderBy . $limit;}else if ($this->doDelete) {
return "DELETE FROM " . $this->table . " " . $whereState . $orderBy . $limit;}else{
return "SELECT " . $this->fields . " FROM " . $this->table . " " . $whereState . $orderBy . $limit;}}

function trim($query) {

			return preg_replace("~^(AND|OR|\\s)*|(AND|OR|\\s)*$~", "", $query);
		
}

function run($callback) {
$query = "";
if ($this->database->open == false) {
$that = $this;
if ($this->database->connecting) {
$this->database->wait(function () use (&$that, &$callback, &$query) {$that->run($callback);});}else{
$this->database->connect(function ($status) use (&$that, &$callback, &$query) {$that->run($callback);});}
return $this;}
$query = $this->build();
if (count($this->multiQuery) > 0) {
$query = implode(";", $this->multiQuery) . ";" . $query;}

			$prep = $this->database->connection->prepare($query);
			if (!$prep)
				throw new Exception("Error preparing query " . $query);
			
			$types = "";
			foreach ($this->values as $v) {
				$type = gettype($v);
				if ($type == "integer")
					$types .= "i";
				else if ($type == "string")
					$types .= "s";
				else if ($type == "double")
					$types .= "d";
				else if ($type == "boolean")
					$types .= "i";
				else if ($type == "double")
					$types .= "d";
				else
					throw new Exception("Unable to query values of type " . $type . " in database query " . $query);
			}
			if (count($this->values) > 0)
				$prep->bind_param($types, ...$this->values);
			$prep->execute();

			$result = $prep->get_result();
			$res = [];
			if ($result !== false)
				while($row = $result->fetch_array(MYSQLI_ASSOC)) {
					$res[] = $row;
				}

			$callback($prep->error, $res);
			$prep->close();
		

return $this;}

function or() {
if ($this->freshGroup == false) {
if (strlen($this->currentWhere) > 0) {
$this->currentWhere .= " OR ";}}
return $this;}

function and() {
if ($this->freshGroup == false) {
if (strlen($this->currentWhere) > 0) {
$this->currentWhere .= " AND ";}}
return $this;}

function group() {
$this->groupLevel++;
$this->freshGroup = true;
$this->currentWhere .= "(";
return $this;}

function endGroup() {
$this->groupLevel--;
if ($this->freshGroup) {
$this->currentWhere .= "TRUE";
$this->freshGroup = false;}
if (strlen($this->currentWhere) > 0) {
$this->currentWhere .= ")";}
return $this;}

function equals($value) {
$nt = "";
$this->freshGroup = false;
if ($this->notMode) {
$nt = "!";
$this->notMode = false;}
$this->currentWhere .= "`" . $this->workingField . "` " . $nt . "= ?";
array_push($this->values, $value);
return $this;}

function like($value) {
$this->freshGroup = false;
$this->currentWhere .= "`" . $this->workingField . "` " . $this->getNot() . " LIKE ?";
array_push($this->values, $value);
return $this;}

function wildLike($value) {
$this->freshGroup = false;
$this->currentWhere .= "`" . $this->workingField . "` " . $this->getNot() . " LIKE ?";
array_push($this->values, "%" . preg_replace('/'."\\[".'/', "![", preg_replace('/'."_".'/', "!_", preg_replace('/'."%".'/', "!%", $value))) . "%");
return $this;}

function greater($value) {
$this->freshGroup = false;
$this->currentWhere .= $this->workingField . " > ?";
array_push($this->values, $value);
return $this;}

function lesser($value) {
$this->freshGroup = false;
$this->currentWhere .= "`" . $this->workingField . "` < ?";
array_push($this->values, $value);
return $this;}

function set($field, $value) {
if ((gettype($value) == 'double' ? 'float' : (gettype($value) == 'array' ? (isset($value['_c__mapC']) ? 'map' : 'array') : gettype($value))) == "boolean") {
if ($value == true) {
$value = 1;}else{
$value = 0;}}
array_push($this->updates, new Websom_DatabaseUpdate($field, $value));
return $this;}

function doesSet($field) {
for ($i = 0; $i < count($this->updates); $i++) {
if (_c_lib__arrUtils::readIndex($this->updates, $i)->field == $field) {
return true;}}
return false;}

function limit(...$arguments) {
if (count($arguments) == 1 and (gettype($arguments[0]) == 'integer' or gettype($arguments[0]) == 'NULL')) {
$documents = $arguments[0];
$this->limitAmount = $documents;
return $this;
}
else if (count($arguments) == 2 and (gettype($arguments[0]) == 'integer' or gettype($arguments[0]) == 'NULL') and (gettype($arguments[1]) == 'integer' or gettype($arguments[1]) == 'NULL')) {
$offset = $arguments[0];
$documents = $arguments[1];
$this->limitAmount = $documents;
$this->limitOffset = $offset;
return $this;
}
}

function update() {
$this->doUpdate = true;
return $this;}

function delete() {
$this->doDelete = true;
return $this;}


}class Websom_MySqlDatabaseInsert {
public $table;

public $number;

public $isMulti;

public $values;

public $multiKeys;

public $inserts;

public $multiInserts;

public $database;

function __construct($database, $table) {
$this->table = "";
$this->number = 1;
$this->isMulti = false;
$this->values = [];
$this->multiKeys = new _carb_map();
$this->inserts = [];
$this->multiInserts = [];
$this->database = null;

$this->database = $database;
$this->table = $table;
}
function build() {
$sets = [];
$shiftValues = [];
$value = "";
$values = [];
if ($this->isMulti == false) {
for ($i = 0; $i < count($this->inserts); $i++) {
$insert = _c_lib__arrUtils::readIndex($this->inserts, $i);
array_push($this->values, $insert->value);
array_push($sets, "`" . $insert->field . "`");
$value .= "?";
if ($i != count($this->inserts) - 1) {
$value .= ", ";}}
for ($i = 0;$i < $this->number;$i++) {
array_push($values, "(" . $value . ")");}}else{
foreach ($this->multiKeys as $field => $_c_v__k0) {
array_push($sets, "`" . $field . "`");}
for ($mi = 0; $mi < count($this->multiInserts); $mi++) {
$curValue = "";
for ($i = 0; $i < count(_c_lib__arrUtils::readIndex($this->multiInserts, $mi)); $i++) {
$insert = _c_lib__arrUtils::readIndex(_c_lib__arrUtils::readIndex($this->multiInserts, $mi), $i);
array_push($this->values, $insert->value);
$curValue .= "?";
if ($i != count(_c_lib__arrUtils::readIndex($this->multiInserts, $mi)) - 1) {
$curValue .= ", ";}}
array_push($values, "(" . $curValue . ")");}}
return "INSERT INTO " . $this->table . " (" . implode(", ", $sets) . ") VALUES " . implode(", ", $values);}

function run($callback) {
$query = "";
if ($this->database->open == false) {
$that = $this;
if ($this->database->connecting) {
$this->database->wait(function () use (&$that, &$callback, &$query) {$that->run($callback);});}else{
$this->database->connect(function ($status) use (&$that, &$callback, &$query) {$that->run($callback);});}
return $this;}
$query = $this->build();

			$prep = $this->database->connection->prepare($query);
			if (!$prep)
				throw new Exception("Error preparing query " . $query);
			
			$types = "";
			foreach ($this->values as $v) {
				$type = gettype($v);
				if ($type == "integer")
					$types .= "i";
				else if ($type == "string")
					$types .= "s";
				else if ($type == "double")
					$types .= "d";
				else if ($type == "boolean")
					$types .= "i";
				else if ($type == "double")
					$types .= "d";
				else
					throw new Exception("Unable to query values of type " . $type . " in database query " . $query);
			}
			$prep->bind_param($types, ...$this->values);
			$prep->execute();

			$callback($prep->error, $prep->insert_id);
			$prep->close();
		

return $this;}

function _c__new() {
array_push($this->multiInserts, []);
return $this;}

function get($field) {
for ($i = 0; $i < count($this->inserts); $i++) {
if (_c_lib__arrUtils::readIndex($this->inserts, $i)->field == $field) {
return _c_lib__arrUtils::readIndex($this->inserts, $i)->value;}}
return null;}

function set($field, $value) {
if ((gettype($value) == 'double' ? 'float' : (gettype($value) == 'array' ? (isset($value['_c__mapC']) ? 'map' : 'array') : gettype($value))) == "boolean") {
if ($value == true) {
$value = 1;}else{
$value = 0;}}
if ($this->isMulti) {
$this->multiKeys[$field] = true;
array_push(_c_lib__arrUtils::readIndex($this->multiInserts, count($this->multiInserts) - 1), new Websom_DatabaseUpdate($field, $value));}else{
array_push($this->inserts, new Websom_DatabaseUpdate($field, $value));}
return $this;}

function doesSet($field) {
for ($i = 0; $i < count($this->inserts); $i++) {
if (_c_lib__arrUtils::readIndex($this->inserts, $i)->field == $field) {
return true;}}
return false;}

function amount($number) {
$this->number = $number;
return $this;}

function multi() {
$this->isMulti = true;
return $this;}


}class Oxygen_FileSystem {

function __construct(...$arguments) {


}
static function readSync($location, $format) {
return file_get_contents($location);}

static function read($location, $format, $callback) {
$callback(file_get_contents($location));}

static function write($location, $content, $callback) {
$callback(file_put_contents($location, $content));}

static function writeSync($location, $content) {
file_put_contents($location, $content);}

static function statSync($location) {
}

function stat($location, $callback) {
}

function openSync($location, $flags) {
}

function open($location, $flags, $callback) {
}

static function readDirSync($location) {
return scandir($location);}

static function dirName($location) {
return dirname($location);}

static function isDir($location) {
return is_dir($location);}

static function normalize($path) {
return realpath($path);}

static function resolve($path) {
return realpath($path);}

static function exists($location) {
return file_exists($location);}

static function basename($location) {
return basename($location);}

static function makeDir($location) {
mkdir($location);}


}class Oxygen_FileSystem_Stat {
public $dev;

public $ino;

public $mode;

public $nlink;

public $uid;

public $gid;

public $rdev;

public $size;

public $blksize;

public $blocks;

public $atime;

public $mtime;

public $ctime;

public $birthtime;

function __construct() {
$this->dev = 0;
$this->ino = 0;
$this->mode = 0;
$this->nlink = 0;
$this->uid = 0;
$this->gid = 0;
$this->rdev = 0;
$this->size = 0;
$this->blksize = 0;
$this->blocks = 0;
$this->atime = 0;
$this->mtime = 0;
$this->ctime = 0;
$this->birthtime = 0;


}
static function fromMap($data) {
$stat = new Oxygen_FileSystem_Stat();
$stat->dev = $data["dev"];
$stat->ino = $data["ino"];
$stat->mode = $data["mode"];
$stat->nlink = $data["nlink"];
$stat->uid = $data["uid"];
$stat->gid = $data["gid"];
$stat->rdev = $data["rdev"];
$stat->size = $data["size"];
$stat->blksize = $data["blksize"];
$stat->blocks = $data["blocks"];
$stat->atime = $data["atime"];
$stat->mtime = $data["mtime"];
$stat->ctime = $data["ctime"];
$stat->birthtime = $data["birthtime"];
return $stat;}


}class Websom_Micro_Command {
public $commands;

public $server;

function __construct($server) {
$this->commands = [];
$this->server = null;

$this->server = $server;
}
function start() {
$that = $this;
$this->register("help")->command("[command]")->on(function ($invo) use (&$that) {$name = $invo->get("command");
$invo->output("----------- HELP -----------");
$invo->output("\t- Commands:");
if ($name != null) {
}else{
for ($i = 0; $i < count($that->commands); $i++) {
$cmd = _c_lib__arrUtils::readIndex($that->commands, $i);
$invo->output("\t\t- <b>" . $cmd->name . "</b>");
for ($j = 0; $j < count($cmd->patterns); $j++) {
$ptrn = _c_lib__arrUtils::readIndex($cmd->patterns, $j);
$invo->output("\t\t\t- " . preg_replace('/'."]".'/', "]</span>", preg_replace('/'."[".'/', "<span style='color: #9fd0ff'>[", preg_replace('/'."<([^>]*)>".'/', "<span style='color: lime'>&lt;\$1&gt;</span>", $ptrn->pattern))));}}}
$invo->finish();});
$this->register("deploy")->command("<name>")->on(function ($invo) use (&$that) {$that->server->resource->deploy($invo->get("name"), function ($msg) use (&$invo, &$that) {$invo->output($msg);}, function () use (&$invo, &$that) {$invo->output("<span style='color: lime;'>Complete</span>");
$invo->finish();});});
$this->register("theme")->command("init <name> <author> [version=\"1.0\"]")->flag("option")->_c__default("Value")->cook()->on(function ($invo) use (&$that) {});
$this->register("test")->command("<name>")->on(function ($invo) use (&$that) {$invo->output("Starting command with name " . $invo->get("name"));
$invo->output("Waiting 2 seconds");


					sleep(2);
					$invo->output("After");
					$invo->finish();
				});}

function register($topName) {
$cmd = new Websom_Command($this->server, $topName);
array_push($this->commands, $cmd);
return $cmd;}

function exec(...$arguments) {
if (count($arguments) == 2 and (gettype($arguments[0]) == 'string' or gettype($arguments[0]) == 'NULL') and ((_c_lib_run::getClass($arguments[1]) == 'Websom_Request') or gettype($arguments[1]) == 'NULL')) {
$command = $arguments[0];
$req = $arguments[1];
$inv = new Websom_CommandInvocation($this->server, $command);
$inv->request = $req;
$inv->sender = "Console";
$inv->local = false;
$inv->parse();
$found = $inv->search($this->commands);
if ($found != null) {
$found->cook();
$out = $found->run($inv);
if ($out == null) {
$found->handler->__invoke($inv);}else{
$req->send("{\"status\": \"error\", \"message\": " . Websom_Json::encode($out) . "}");}}else{
$req->send("{\"status\": \"error\", \"message\": \"Unknown command\"}");}
}
else if (count($arguments) == 1 and (gettype($arguments[0]) == 'string' or gettype($arguments[0]) == 'NULL')) {
$command = $arguments[0];
$inv = new Websom_CommandInvocation($this->server, $command);
$inv->parse();
$found = $inv->search($this->commands);
if ($found != null) {
$found->cook();
$output = $found->run($inv);
$found->handler->__invoke($inv);
;}
}
}


}class Websom_Command {
public $server;

public $name;

public $patterns;

function __construct($server, $name) {
$this->server = null;
$this->name = "";
$this->patterns = [];

$this->server = $server;
$this->name = $name;
}
function command($pattern) {
$pat = new Websom_CommandPattern($this, $pattern);
array_push($this->patterns, $pat);
return $pat;}


}class Websom_CommandFlag {
public $parent;

public $name;

public $_type;

public $_default;

function __construct($parent, $name, $type, $defVal) {
$this->parent = null;
$this->name = "";
$this->_type = "";
$this->_default = null;

$this->parent = $parent;
$this->name = $name;
$this->_type = $type;
$this->_default = $defVal;
}
function type($type) {
$this->_type = $type;
return $this;}

function _c__default($val) {
$this->_default = $val;
return $this;}

function flag($name) {
return $this->parent->flag($name);}

function command($pattern) {
return $this->parent->parent->command($pattern);}

function cook() {
$this->parent->cook();
return $this;}

function on($run) {
return $this->parent->on($run);}


}class Websom_CommandPart {
public $type;

public $optional;

public $_c__default;

public $name;

function __construct($name, $type) {
$this->type = 2;
$this->optional = false;
$this->_c__default = null;
$this->name = "";

$this->name = $name;
$this->type = $type;
}

}class Websom_CommandPattern {
public $cooked;

public $parent;

public $pattern;

public $flags;

public $handler;

public $parts;

function __construct($parent, $pattern) {
$this->cooked = false;
$this->parent = null;
$this->pattern = null;
$this->flags = [];
$this->handler = null;
$this->parts = [];

$this->parent = $parent;
$this->pattern = $pattern;
}
function flag($name) {
$flag = new Websom_CommandFlag($this, $name, "string", null);
array_push($this->flags, $flag);
return $flag;}

function command($pattern) {
return $this->parent->command($pattern);}

function on($run) {
$this->handler = $run;
return $this;}

function run($invocation) {
for ($i = 0; $i < count($this->parts); $i++) {
$part = _c_lib__arrUtils::readIndex($this->parts, $i);
if (count($invocation->arguments) - 1 > $i) {
$arg = _c_lib__arrUtils::readIndex($invocation->arguments, $i + 1);
if ($part->type == 1) {
}else{
$invocation->values[$part->name] = $arg;}}else{
if ($part->type != 2 or $part->optional == false) {
return $part->name . " argument required on command";}else{
$invocation->values[$part->name] = $part->_c__default;}}}
return null;}

function match($invocation) {
for ($i = 0; $i < count($this->parts); $i++) {
$part = _c_lib__arrUtils::readIndex($this->parts, $i);
if (count($invocation->arguments) - 1 >= $i) {
$arg = _c_lib__arrUtils::readIndex($invocation->arguments, $i + 1);
if ($part->type == 1) {
if ($arg != $part->name) {
return false;}}}}
return true;}

function buildParts() {
$isOpen = false;
$isEquals = false;
$openPart = "";
$closePart = "";
$build = "";
$equals = "";
for ($i = 0;$i < strlen($this->pattern);$i++) {
$char = $this->pattern[$i];
if (strlen($openPart) > 0 and $closePart != $char) {
if ($isEquals) {
$equals .= $char;}else{
$build .= $char;}
if ($char == "=") {
$isEquals = true;}}else if (strlen($openPart) == 0 and $char != " ") {
if ($char == "<") {
$openPart = "<";
$closePart = ">";
$isOpen = true;}else if ($char == "[") {
$openPart = "[";
$closePart = "]";
$isOpen = true;}else{
$isOpen = true;
$build .= $char;}}else if ($isOpen == true and $char == " " or $closePart == $char) {
$isOpen = false;
$type = 2;
if ($openPart == "") {
$type = 1;}
$part = new Websom_CommandPart($build, $type);
$part->optional = $openPart == "[";
if (strlen($equals) > 0) {
$part->_c__default = Websom_Json::parse($equals);}
array_push($this->parts, $part);
$openPart = "";
$closePart = "";
$isOpen = false;
$isEquals = false;
$build = "";
$equals = "";}}}

function cook() {
if ($this->cooked) {
return $this;}
$this->cooked = true;
$this->buildParts();
return $this;}


}class Websom_CommandInvocation {
public $local;

public $request;

public $sender;

public $handler;

public $pattern;

public $server;

public $flags;

public $values;

public $rawOutput;

public $arguments;

public $raw;

function __construct($server, $raw) {
$this->local = true;
$this->request = null;
$this->sender = "Unknown";
$this->handler = null;
$this->pattern = null;
$this->server = null;
$this->flags = new _carb_map();
$this->values = new _carb_map();
$this->rawOutput = [];
$this->arguments = [];
$this->raw = "";

$this->server = $server;
$this->raw = $raw;
}
function get($name) {
if (isset($this->values[$name])) {
return $this->values[$name];}else{
return null;}}

function error($message) {
if ($this->local) {
$this->handler->__invoke(true, $message);}else{
$this->request->send("{\"status\": \"error\", \"message\": " . Websom_Json::encode($message) . "}");}}

function output($message) {
if ($this->local) {
$this->handler->__invoke(false, $message);}else{
array_push($this->rawOutput, "{\"status\": \"chunk\", \"message\": " . Websom_Json::encode($message) . "}");}}

function finish() {
if ($this->local == false) {
$this->request->send("[" . implode(", ", $this->rawOutput) . "]");}}

function searchPatterns($patterns) {
for ($i = 0; $i < count($patterns); $i++) {
$pattern = _c_lib__arrUtils::readIndex($patterns, $i);
if ($pattern->match($this)) {
return $pattern;}}
return null;}

function search($commands) {
for ($i = 0; $i < count($commands); $i++) {
$command = _c_lib__arrUtils::readIndex($commands, $i);
if ($command->name == _c_lib__arrUtils::readIndex($this->arguments, 0)) {
return $this->searchPatterns($command->patterns);}}
return null;}

function parse() {
$build = "";
$builds = [];
$isOpen = false;
$openString = "";
$escape = false;
$flagName = "";
for ($i = 0;$i < strlen($this->raw);$i++) {
$char = $this->raw[$i];
if ($isOpen == false and $char == " ") {
if (strlen($build) > 0) {
if ($openString == "" and strlen($build) > 2 and $build[0] == "-" and $build[1] == "-") {
$flagName = substr($build, 2,strlen($build) - 1);}else if ($flagName == "") {
array_push($builds, $build);}else{
$this->flags[$flagName] = $build;
$flagName = "";}
$build = "";
$openString = "";
$escape = false;}}else{
if ($char == "\"" or $char == "'") {
if ($escape) {
$build .= $char;
$escape = false;}else if ($isOpen and $char == $openString) {
$isOpen = false;}else if ($char == "\\") {
$escape = true;}else{
$isOpen = true;
$openString = $char;}}else{
$build .= $char;}}}
if (strlen($build) > 0) {
if (strlen($flagName) > 0) {
$this->flags[$flagName] = $build;}else{
array_push($builds, $build);}}
$this->arguments = $builds;}


}class Websom_Micro_Sitemap {
public $loaded;

public $data;

public $sitemapOptions;

public $sitemapFile;

public $sitemapOutput;

public $server;

function __construct($server) {
$this->loaded = false;
$this->data = null;
$this->sitemapOptions = "";
$this->sitemapFile = "";
$this->sitemapOutput = "/sitemap.xml";
$this->server = null;

$this->server = $server;
}
function start() {
$that = $this;
$sitemapOptions = $this->server->config->root . "/sitemap.json";
$this->sitemapOptions = $sitemapOptions;
$sitemapFile = $this->server->config->root . "/sitemap.txt";
$this->sitemapFile = $sitemapFile;
if ($this->server->config->dev) {
if (Oxygen_FileSystem::exists($sitemapOptions) == false) {
Oxygen_FileSystem::writeSync($sitemapOptions, "{\n\t\"items\": []\n}");}}
$this->server->command("sitemap")->command("build [map=*]")->on(function ($invo) use (&$that, &$sitemapOptions, &$sitemapFile) {$name = $invo->get("command");
$invo->output("- Building sitemap");
$that->load();
$that->build($that->data["items"], $that->server->config->resources . $that->sitemapOutput);
$invo->output("- <span style='color: lime;'>Finished</span>");
$invo->finish();});}

function build($baseUrls, $outputPath) {
$outs = "<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">";
for ($i = 0; $i < count($baseUrls); $i++) {
$outs .= "\n\t<url>\n\t\t<loc>" . $this->server->config->url . _c_lib__arrUtils::readIndex($baseUrls, $i) . "</loc>\n\t</url>";}
Oxygen_FileSystem::writeSync($outputPath, $outs . "\n</urlset>");}

function load() {
$this->data = Websom_Json::parse(Oxygen_FileSystem::readSync($this->sitemapOptions, "utf8"));}


}class Websom_Micro_Text {
public $loaded;

public $data;

public $textFile;

public $server;

function __construct($server) {
$this->loaded = false;
$this->data = null;
$this->textFile = "";
$this->server = null;

$this->server = $server;
}
function start() {
$that = $this;
$textFile = $this->server->config->root . "/text.json";
$this->textFile = $textFile;
if ($this->server->config->dev) {
if (Oxygen_FileSystem::exists($textFile) == false) {
Oxygen_FileSystem::writeSync($textFile, "{}");}
if (Oxygen_FileSystem::exists($this->server->config->resources . "/text.js") == false) {
Oxygen_FileSystem::writeSync($this->server->config->resources . "/text.js", "Websom.text = {\"*\": {}};");}}
$this->server->input->_c__interface("text.edit")->restrict()->to("permission", "text.edit")->key("rule")->is("string")->length(1, 256)->key("name")->is("string")->length(1, 512)->key("text")->is("string")->length(0, 10000)->success(function ($input, $cooked) use (&$that, &$textFile) {$data = &$input->raw;
$that->load();
if (isset($that->data[$data["rule"]]) == false) {
$that->data[$data["rule"]] = new _carb_map();}
$that->data[$data["rule"]][$data["name"]] = $data["text"];
$that->save();
$input->sendSuccess("Saved");});}

function save() {
$encoded = Websom_Json::encode($this->data);
Oxygen_FileSystem::writeSync($this->textFile, $encoded);
Oxygen_FileSystem::writeSync($this->server->config->resources . "/text.js", "Websom.text = " . $encoded . ";");}

function load() {
if ($this->loaded == false) {
$this->data = Websom_Json::parse(Oxygen_FileSystem::readSync($this->textFile, "utf8"));}}


}class Websom_Containers_Table {
public $load;

public $create;

public $info;

public $selectHook;

public $subParent;

public $table;

public $tableEntityName;

public $server;

public $name;

public $dataInfo;

public $parentContainer;

public $interfaces;

function __construct(...$arguments) {
$this->load = null;
$this->create = null;
$this->info = null;
$this->selectHook = null;
$this->subParent = null;
$this->table = "";
$this->tableEntityName = "";
$this->server = null;
$this->name = "";
$this->dataInfo = null;
$this->parentContainer = null;
$this->interfaces = [];

if (count($arguments) == 4 and (gettype($arguments[0]) == 'string' or gettype($arguments[0]) == 'NULL') and (is_callable($arguments[1]) or gettype($arguments[1]) == 'NULL') and (is_callable($arguments[2]) or gettype($arguments[2]) == 'NULL') and (is_callable($arguments[3]) or gettype($arguments[3]) == 'NULL')) {
$tableName = $arguments[0];
$create = $arguments[1];
$load = $arguments[2];
$info = $arguments[3];

}
else if (count($arguments) == 3 and ((_c_lib_run::getClass($arguments[0]) == 'Websom_Server') or gettype($arguments[0]) == 'NULL') and (gettype($arguments[1]) == 'string' or gettype($arguments[1]) == 'NULL') and ((_c_lib_run::getClass($arguments[2]) == 'Websom_DataInfo') or gettype($arguments[2]) == 'NULL')) {
$server = $arguments[0];
$tableName = $arguments[1];
$info = $arguments[2];
$this->server = $server;
$this->table = $tableName;
$this->name = $tableName;
$this->dataInfo = $info;
$this->tableEntityName = $tableName;
}

}
function realize($db, $done) {
$str = $this->dataInfo->buildStructure();
$subs = &$this->dataInfo->buildLinkedStructures($this->tableEntityName);
$str->database = $db;
$str->table = $this->table;
$builts = 0;
$errors = "";
$built = function ($err) use (&$db, &$done, &$str, &$subs, &$builts, &$errors, &$built) {$builts--;
if (strlen($err) > 0) {
$errors .= $err . "\n";}
if ($builts == 0) {
$done->__invoke($errors);}};
$builts++;
$builts+=count($subs);
$str->run($built);
for ($i = 0; $i < count($subs); $i++) {
$subStr = _c_lib__arrUtils::readIndex($subs, $i);
$subStr->database = $db;
$subStr->table = $this->table . "_" . $subStr->table;
$subStr->run($built);}}

static function loadArray($query, $type, $callback) {
$db = $query->database;
$table = $query->table;
$dataInfo = Websom_DataInfo::getDataInfoFromRoute($type);
$container = new Websom_Containers_Table($db->server, $table, $dataInfo);
$arr = [];
$query->run(function ($err, $docs) use (&$query, &$type, &$callback, &$db, &$table, &$dataInfo, &$container, &$arr) {$dones = count($docs);
if (count($docs) == 0) {
$callback->__invoke($arr);}
for ($i = 0; $i < count($docs); $i++) {
$doc = &_c_lib__arrUtils::readIndex($docs, $i);
$obj = $dataInfo->spawn($db->server);
$obj->websomContainer = $container;
array_push($arr, $obj);
$obj->nativeLoadFromMap($doc, function ($err2) use (&$i, &$doc, &$obj, &$err, &$docs, &$dones, &$query, &$type, &$callback, &$db, &$table, &$dataInfo, &$container, &$arr) {$dones--;
if ($dones == 0) {
$callback->__invoke($arr);}});}});}

function insert($data, $done) {
$insert = $this->server->database->primary->into($this->table);
for ($i = 0; $i < count($this->dataInfo->fields); $i++) {
$field = _c_lib__arrUtils::readIndex($this->dataInfo->fields, $i);
$value = null;
if ($field->isPrimitive) {


					$inter = $field->realName;
					$value = $data->$inter;
				}
$insert->set($field->fieldName, $value);}
$insert->run($done);}

function &setupSubSorts($data) {
for ($i = 0; $i < count($this->dataInfo->fields); $i++) {
$field = _c_lib__arrUtils::readIndex($this->dataInfo->fields, $i);
if (isset($field->attributes["NoLoad"])) {
$mp = new _carb_map();
$mp["container"] = $this->table;
$mp["sub"] = $field->fieldName;
$mp["target"] = "";
$data[$field->fieldName] = $mp;}}}

function handleInlineSubSelects($opts, $input, $parent, $docData, $subFields, $loaded) {
$that = $this;
$fields = count($subFields);
$checkDone = function () use (&$opts, &$input, &$parent, &$docData, &$subFields, &$loaded, &$that, &$fields, &$checkDone) {$fields--;
if ($fields <= 0) {
$loaded->__invoke($docData);}};
for ($si = 0; $si < count($subFields); $si++) {
$close = function ($i) use (&$si, &$close, &$opts, &$input, &$parent, &$docData, &$subFields, &$loaded, &$that, &$fields, &$checkDone) {$field = _c_lib__arrUtils::readIndex($subFields, $i);
$subOpts = $opts->subs[$field->fieldName];
$link = $field->structure->getFlag("linked");
$subInfo = Websom_DataInfo::getDataInfoFromRoute($link->fieldType);
$tbl = new Websom_Containers_Table($that->server, $that->table . "_" . $field->fieldName, $subInfo);
$tbl->subParent = $parent;
$tbl->selectHook = function ($subDocs) use (&$i, &$field, &$subOpts, &$link, &$subInfo, &$tbl, &$si, &$close, &$opts, &$input, &$parent, &$docData, &$subFields, &$loaded, &$that, &$fields, &$checkDone) {$docData[$field->fieldName] = $subDocs;
$checkDone->__invoke();};
$tbl->interfaceSelect($subOpts, new Websom_Input("", $input->raw[$field->fieldName], $input->request), new Websom_CallContext());};
$close->__invoke($si);}
if (count($subFields) == 0) {
$loaded->__invoke($docData);}}

function handleSubSelect($opts, $input, $ctx) {
$that = $this;
if ((gettype($input->raw["parentDocument"]) == 'double' ? 'float' : (gettype($input->raw["parentDocument"]) == 'array' ? (isset($input->raw["parentDocument"]['_c__mapC']) ? 'map' : 'array') : gettype($input->raw["parentDocument"]))) != "string") {
$input->sendError("Invalid parentDocument input");
return null;}
$docPublicId = $input->raw["parentDocument"];
$parentTable = $this->parentContainer;
$parentTable->loadFromSelect($parentTable->from()->where("publicId")->equals($docPublicId), function ($docs) use (&$opts, &$input, &$ctx, &$that, &$docPublicId, &$parentTable) {if (count($docs) == 0) {
$input->sendError("Invalid document");
return null;}
$ctx->subContainerCall = true;
$ctx->data = _c_lib__arrUtils::readIndex($docs, 0);
$that->interfaceSelect($opts, $input, $ctx);});}

function handleSubInsert($opts, $input, $values, $message, $fieldInfo, $parentData, $callback, $ctx) {
$that = $this;
if ((gettype($input->raw["parentDocument"]) == 'double' ? 'float' : (gettype($input->raw["parentDocument"]) == 'array' ? (isset($input->raw["parentDocument"]['_c__mapC']) ? 'map' : 'array') : gettype($input->raw["parentDocument"]))) != "string") {
$input->sendError("Invalid parentDocument input");
return null;}
$docPublicId = $input->raw["parentDocument"];
$parentTable = $this->parentContainer;
$parentTable->loadFromSelect($parentTable->from()->where("publicId")->equals($docPublicId), function ($docs) use (&$opts, &$input, &$values, &$message, &$fieldInfo, &$parentData, &$callback, &$ctx, &$that, &$docPublicId, &$parentTable) {if (count($docs) == 0) {
$input->sendError("Invalid document");
return null;}
$doCall = function () use (&$docs, &$doCall, &$opts, &$input, &$values, &$message, &$fieldInfo, &$parentData, &$callback, &$ctx, &$that, &$docPublicId, &$parentTable) {$ctx->subContainerCall = true;
$ctx->data = _c_lib__arrUtils::readIndex($docs, 0);
$that->insertFromInterfaceCallback($opts, $input, $values, $message, $fieldInfo, $parentData, $callback, $ctx);};
if ($opts->mustOwnInsert) {
$that->server->userSystem->getLoggedIn($input->request, function ($user) use (&$docs, &$doCall, &$opts, &$input, &$values, &$message, &$fieldInfo, &$parentData, &$callback, &$ctx, &$that, &$docPublicId, &$parentTable) {if ($user != null) {
if ($user->id == _c_lib__arrUtils::readIndex($docs, 0)->getField("id")) {
$doCall->__invoke();}else{
$input->sendError("You do not own this.");}}else{
$input->sendError("Please login.");}});}else{
$doCall->__invoke();}});}

function interfaceSelect($opts, $input, $ctx) {
$that = $this;
if ($opts->canSelect) {
if ($opts->overrideSelect != null) {
$opts->overrideSelect->__invoke($input);}else{
$subParent = null;
if (isset($input->raw["parentDocument"]) and $input->raw["parentDocument"] != null and $ctx->subContainerCall == false) {
$this->handleSubSelect($opts, $input, $ctx);
return null;}
if ($ctx->subContainerCall) {
$subParent = $ctx->data;}
$subFields = [];
$publicFields = [];
for ($i = 0; $i < count($this->dataInfo->fields); $i++) {
$field = _c_lib__arrUtils::readIndex($this->dataInfo->fields, $i);
if (isset($input->raw[$field->fieldName]) and (gettype($input->raw[$field->fieldName]) == 'double' ? 'float' : (gettype($input->raw[$field->fieldName]) == 'array' ? (isset($input->raw[$field->fieldName]['_c__mapC']) ? 'map' : 'array') : gettype($input->raw[$field->fieldName]))) == "map") {
if (isset($opts->subs[$field->fieldName])) {
array_push($subFields, $field);}else{
if ($that->server->config->dev) {
throw new Exception("Illegal sub query sent on field '" . $field->fieldName . "' with query " . Websom_Json::encode($input->raw[$field->fieldName]));}}}else if (isset($input->raw[$field->fieldName]) and (gettype($input->raw[$field->fieldName]) == 'double' ? 'float' : (gettype($input->raw[$field->fieldName]) == 'array' ? (isset($input->raw[$field->fieldName]['_c__mapC']) ? 'map' : 'array') : gettype($input->raw[$field->fieldName]))) == "string") {
if ($field->singleLink) {
array_push($publicFields, $field);}}}
$select = $this->server->database->primary->from($this->table);
$callingSelect = function () use (&$subParent, &$subFields, &$publicFields, &$select, &$callingSelect, &$opts, &$input, &$ctx, &$that) {if ($subParent != null) {
$select->where("parentId")->equals($subParent->getField("id"))->and()->group();}
$offset = 0;
if (isset($input->raw["_w_loadMore"])) {
if ((gettype($input->raw["_w_loadMore"]) == 'double' ? 'float' : (gettype($input->raw["_w_loadMore"]) == 'array' ? (isset($input->raw["_w_loadMore"]['_c__mapC']) ? 'map' : 'array') : gettype($input->raw["_w_loadMore"]))) == "string") {
$offset = $opts->maxSelect * intval($input->raw["_w_loadMore"]);}}
$select->limit($offset, $offset + $opts->maxSelect + 1);
$message = new Websom_ClientMessage();
$hadError = false;
$valids = count($opts->controls) + count($opts->selectControls);
$ready = function () use (&$offset, &$message, &$hadError, &$valids, &$ready, &$grouped, &$runControl, &$subParent, &$subFields, &$publicFields, &$select, &$callingSelect, &$opts, &$input, &$ctx, &$that) {if ($opts->hasPublicIdSelect) {
if (isset($input->raw["publicId"]) and $that->dataInfo->hasField("publicId") and (gettype($input->raw["publicId"]) == 'double' ? 'float' : (gettype($input->raw["publicId"]) == 'array' ? (isset($input->raw["publicId"]['_c__mapC']) ? 'map' : 'array') : gettype($input->raw["publicId"]))) == "string") {
$publicId = $input->raw["publicId"];
if (strlen($publicId) > 3 and strlen($publicId) < 255) {
$select->and()->where("publicId")->equals($input->raw["publicId"]);}}}
if ($hadError) {
$input->send($message->stringify());}else{
if ($subParent != null) {
$select->endGroup();}
$select->run(function ($err, $docs) use (&$offset, &$message, &$hadError, &$valids, &$ready, &$grouped, &$runControl, &$subParent, &$subFields, &$publicFields, &$select, &$callingSelect, &$opts, &$input, &$ctx, &$that) {$loadMore = false;
if (count($docs) > $opts->maxSelect) {
$loadMore = true;}
$sends = [];
$datas = [];
$loads = 0;
$checkDone = function ($err3) use (&$err, &$docs, &$loadMore, &$sends, &$datas, &$loads, &$checkDone, &$offset, &$message, &$hadError, &$valids, &$ready, &$grouped, &$runControl, &$subParent, &$subFields, &$publicFields, &$select, &$callingSelect, &$opts, &$input, &$ctx, &$that) {$loads--;
if ($loads == 0) {
if ($that->selectHook == null) {
$castSends = &$sends;
if ($loadMore) {
array_push($castSends, "{\"_w_loadMore\": true}");}
$that->server->security->countRequest("select", $opts, $input);
$input->send("{\"documents\": [" . implode(", ", $castSends) . "]}");}else{
$that->selectHook->__invoke($sends);}}};
$loads+=count($docs);
if ($loadMore) {
$loads--;}
for ($doc = 0; $doc < count($docs); $doc++) {
$close = function ($doci) use (&$doc, &$close, &$should, &$err, &$docs, &$loadMore, &$sends, &$datas, &$loads, &$checkDone, &$offset, &$message, &$hadError, &$valids, &$ready, &$grouped, &$runControl, &$subParent, &$subFields, &$publicFields, &$select, &$callingSelect, &$opts, &$input, &$ctx, &$that) {$data = $that->dataInfo->spawn($that->server);
$data->websomContainer = $that;
$data->websomServer = $that->server;
array_push($datas, $data);
$data->nativeLoadFromMap(_c_lib__arrUtils::readIndex($docs, $doci), function ($err2) use (&$doci, &$data, &$doc, &$close, &$should, &$err, &$docs, &$loadMore, &$sends, &$datas, &$loads, &$checkDone, &$offset, &$message, &$hadError, &$valids, &$ready, &$grouped, &$runControl, &$subParent, &$subFields, &$publicFields, &$select, &$callingSelect, &$opts, &$input, &$ctx, &$that) {$data->onSend($input->request, $data->exposeToClient(), function ($sendData) use (&$err2, &$doci, &$data, &$doc, &$close, &$should, &$err, &$docs, &$loadMore, &$sends, &$datas, &$loads, &$checkDone, &$offset, &$message, &$hadError, &$valids, &$ready, &$grouped, &$runControl, &$subParent, &$subFields, &$publicFields, &$select, &$callingSelect, &$opts, &$input, &$ctx, &$that) {if ($opts->selectExpose == null) {
$that->handleInlineSubSelects($opts, $input, $data, $sendData, $subFields, function ($outData) use (&$sendData, &$err2, &$doci, &$data, &$doc, &$close, &$should, &$err, &$docs, &$loadMore, &$sends, &$datas, &$loads, &$checkDone, &$offset, &$message, &$hadError, &$valids, &$ready, &$grouped, &$runControl, &$subParent, &$subFields, &$publicFields, &$select, &$callingSelect, &$opts, &$input, &$ctx, &$that) {if ($that->selectHook == null) {
array_push($sends, Websom_Json::encode($outData));}else{
array_push($sends, $outData);}
$checkDone->__invoke($err2);});}else{
$opts->selectExpose->__invoke($sendData, $data, function ($exposeData) use (&$sendData, &$err2, &$doci, &$data, &$doc, &$close, &$should, &$err, &$docs, &$loadMore, &$sends, &$datas, &$loads, &$checkDone, &$offset, &$message, &$hadError, &$valids, &$ready, &$grouped, &$runControl, &$subParent, &$subFields, &$publicFields, &$select, &$callingSelect, &$opts, &$input, &$ctx, &$that) {$that->handleInlineSubSelects($opts, $input, $data, $exposeData, $subFields, function ($outData) use (&$exposeData, &$sendData, &$err2, &$doci, &$data, &$doc, &$close, &$should, &$err, &$docs, &$loadMore, &$sends, &$datas, &$loads, &$checkDone, &$offset, &$message, &$hadError, &$valids, &$ready, &$grouped, &$runControl, &$subParent, &$subFields, &$publicFields, &$select, &$callingSelect, &$opts, &$input, &$ctx, &$that) {if ($that->selectHook == null) {
array_push($sends, Websom_Json::encode($outData));}else{
array_push($sends, $outData);}
$checkDone->__invoke($err2);});});}});});};
$should = true;
if ($loadMore and $doc == count($docs) - 1) {
$should = false;}
if ($should) {
$close->__invoke($doc);}}
if (count($docs) == 0) {
$loads++;
$checkDone->__invoke("");}});}};
$grouped = false;
$runControl = function ($control) use (&$offset, &$message, &$hadError, &$valids, &$ready, &$grouped, &$runControl, &$subParent, &$subFields, &$publicFields, &$select, &$callingSelect, &$opts, &$input, &$ctx, &$that) {$control->filter($input, $select, function ($val) use (&$control, &$offset, &$message, &$hadError, &$valids, &$ready, &$grouped, &$runControl, &$subParent, &$subFields, &$publicFields, &$select, &$callingSelect, &$opts, &$input, &$ctx, &$that) {$valids--;
if ($val != null) {
if ($val->hadError) {
$hadError = true;}
$message->add($val);}
if ($valids == 0) {
if ($grouped) {
$select->endGroup();}
$ready->__invoke();}});};
if ($opts->hasPublicIdSelect) {
if (count($publicFields) > 0) {
$valids+=count($publicFields);
for ($fi = 0; $fi < count($publicFields); $fi++) {
$close = function ($i) use (&$fi, &$close, &$offset, &$message, &$hadError, &$valids, &$ready, &$grouped, &$runControl, &$subParent, &$subFields, &$publicFields, &$select, &$callingSelect, &$opts, &$input, &$ctx, &$that) {$field = _c_lib__arrUtils::readIndex($publicFields, $i);
$subInfo = Websom_DataInfo::getDataInfoFromRoute($field->typeRoute);
if (isset($subInfo->attributes["Linked"])) {
$tbl = new Websom_Containers_Table($that->server, $subInfo->attributes["Linked"], $subInfo);
$tbl->loadFromSelect($tbl->from()->where("publicId")->equals($input->raw[$field->fieldName]), function ($docs) use (&$tbl, &$i, &$field, &$subInfo, &$fi, &$close, &$offset, &$message, &$hadError, &$valids, &$ready, &$grouped, &$runControl, &$subParent, &$subFields, &$publicFields, &$select, &$callingSelect, &$opts, &$input, &$ctx, &$that) {if (count($docs) > 0) {
$select->and()->where($field->fieldName)->equals(_c_lib__arrUtils::readIndex($docs, 0)->getField("id"))->and();}
$valids--;
if ($valids == 0) {
$ready->__invoke();}});}else{
$valids--;
if ($valids == 0) {
$ready->__invoke();}}};
$close->__invoke($fi);}}}
for ($i = 0; $i < count($opts->controls); $i++) {
if ($grouped == false) {
$select->group();
$grouped = true;}
$control = _c_lib__arrUtils::readIndex($opts->controls, $i);
$runControl->__invoke($control);}
for ($i = 0; $i < count($opts->selectControls); $i++) {
if ($grouped == false) {
$select->group();
$grouped = true;}
$control = _c_lib__arrUtils::readIndex($opts->selectControls, $i);
$runControl->__invoke($control);}
if (count($opts->controls) + count($opts->selectControls) == 0) {
$ready->__invoke();}};
if ($opts->onSelect != null) {
$select->group();
$opts->onSelect->__invoke($input, $select, function ($err) use (&$subParent, &$subFields, &$publicFields, &$select, &$callingSelect, &$opts, &$input, &$ctx, &$that) {$select->endGroup()->and();
if ($err != null) {
$input->send("{\"error\": " . Websom_Json::encode($err) . "}");}else{
$callingSelect->__invoke();}});}else{
$callingSelect->__invoke();}}}}

function insertFromInterface($opts, $input, $values, $message, $fieldInfo, $parentData, $ctx) {
$this->insertFromInterfaceCallback($opts, $input, $values, $message, $fieldInfo, $parentData, null, $ctx);}

function insertFromInterfaceCallback($opts, $input, $values, $message, $fieldInfo, $parentData, $callback, $ctx) {
$that = $this;
$obj = $this->dataInfo->spawn($this->server);
$obj->websomServer = $this->server;
$obj->websomParentData = $parentData;
$subParent = null;
if (isset($input->raw["parentDocument"]) and $input->raw["parentDocument"] != null and $ctx->subContainerCall == false) {
$this->handleSubInsert($opts, $input, $values, $message, $fieldInfo, $parentData, $callback, $ctx);
return null;}
if ($ctx->subContainerCall) {
$subParent = $ctx->data;}
if ($fieldInfo != null) {
$obj->websomFieldInfo = $fieldInfo;}
$insert = $this->server->database->primary->into($this->table);
if ($opts != null) {
if ($opts->autoTimestamp) {
$now = Websom_Time::now();
$insert->set("timestamp", $now);
$obj->setField("timestamp", $now);}}
if ($subParent != null) {
$insert->set("parentId", $subParent->getField("id"));}
$obj->websomContainer = $this;
$obj->containerInsert($input, $this, $insert, $values, function () use (&$opts, &$input, &$values, &$message, &$fieldInfo, &$parentData, &$callback, &$ctx, &$that, &$obj, &$subParent, &$insert) {$call = function () use (&$call, &$opts, &$input, &$values, &$message, &$fieldInfo, &$parentData, &$callback, &$ctx, &$that, &$obj, &$subParent, &$insert) {$fieldWaits = 0;
for ($f = 0; $f < count($that->dataInfo->fields); $f++) {
$field = _c_lib__arrUtils::readIndex($that->dataInfo->fields, $f);
if (isset($field->attributes["Parent"]) == false) {
if ($field->onlyServer == false and $field->structure->hasFlag("edit")) {
$fieldWaits++;}else{
if ($insert->doesSet($field->fieldName) == false) {
$fieldWaits++;}}}}
$insertReady = function () use (&$fieldWaits, &$insertReady, &$call, &$opts, &$input, &$values, &$message, &$fieldInfo, &$parentData, &$callback, &$ctx, &$that, &$obj, &$subParent, &$insert) {$fieldWaits--;
if ($fieldWaits != 0) {
return null;}
if ($values["parentId"] != null) {
$insert->set("parentId", $values["parentId"]);}
if ($values["arrayIndex"] != null) {
$insert->set("arrayIndex", $values["arrayIndex"]);}
$insert->run(function ($err, $key) use (&$fieldWaits, &$insertReady, &$call, &$opts, &$input, &$values, &$message, &$fieldInfo, &$parentData, &$callback, &$ctx, &$that, &$obj, &$subParent, &$insert) {$obj->setField("id", $key);
if ($opts != null) {
for ($iControl = 0; $iControl < count($opts->controls); $iControl++) {
_c_lib__arrUtils::readIndex($opts->controls, $iControl)->insert($input, $obj, $key);}
for ($iControl = 0; $iControl < count($opts->insertControls); $iControl++) {
_c_lib__arrUtils::readIndex($opts->insertControls, $iControl)->insert($input, $obj, $key);}}
$that->insertAutoFields($key, $input, $obj, function () use (&$err, &$key, &$fieldWaits, &$insertReady, &$call, &$opts, &$input, &$values, &$message, &$fieldInfo, &$parentData, &$callback, &$ctx, &$that, &$obj, &$subParent, &$insert) {for ($f = 0; $f < count($that->dataInfo->fields); $f++) {
$field = _c_lib__arrUtils::readIndex($that->dataInfo->fields, $f);
if ($field->onlyServer == false and $field->structure->hasFlag("edit")) {
if ($field->structure->hasFlag("linked")) {
$link = $field->structure->getFlag("linked");
if ($link->linkType == "array") {
$value = &$input->raw[$field->realName];
if ((gettype($value) == 'double' ? 'float' : (gettype($value) == 'array' ? (isset($value['_c__mapC']) ? 'map' : 'array') : gettype($value))) == "array") {
$itemDataInfo = Websom_DataInfo::getDataInfoFromRoute($link->fieldType);
$tempContainer = new Websom_Containers_Table($that->server, $that->table . "_" . $field->fieldName, $itemDataInfo);
if (isset($itemDataInfo->attributes["Linked"])) {
for ($i = 0; $i < count($value); $i++) {
if ((gettype(_c_lib__arrUtils::readIndex($value, $i)) == 'double' ? 'float' : (gettype(_c_lib__arrUtils::readIndex($value, $i)) == 'array' ? (isset(_c_lib__arrUtils::readIndex($value, $i)['_c__mapC']) ? 'map' : 'array') : gettype(_c_lib__arrUtils::readIndex($value, $i)))) == "string") {
$linkedTable = $link->name;
$tbl = new Websom_Containers_Table($that->server, $linkedTable, $itemDataInfo);
$sobj = $itemDataInfo->spawn($that->server);
$sobj->websomContainer = $tbl;
$sobj->websomServer = $that->server;
$sobj->loadFromPublicKey($tbl, _c_lib__arrUtils::readIndex($value, $i), function ($err2) use (&$linkedTable, &$tbl, &$sobj, &$i, &$itemDataInfo, &$tempContainer, &$value, &$link, &$f, &$field, &$err, &$key, &$fieldWaits, &$insertReady, &$call, &$opts, &$input, &$values, &$message, &$fieldInfo, &$parentData, &$callback, &$ctx, &$that, &$obj, &$subParent, &$insert) {if ($err2 != null and strlen($err2) > 0) {
$input->send("Invalid field " . $field->realName);}else{
$tempMap = new _carb_map();
$tempMap["parentId"] = $key;
$tempMap["arrayIndex"] = $i;
$tempMap["linkedId"] = _c_lib__arrUtils::readIndex($value, $i);
$tempContainer->insertFromInterface(null, new Websom_Input("", $tempMap, $input->request), $tempMap, null, $field, $sobj, new Websom_CallContext());}});}}}else{
for ($i = 0; $i < count($value); $i++) {
_c_lib__arrUtils::readIndex($value, $i)["parentId"] = $key;
_c_lib__arrUtils::readIndex($value, $i)["arrayIndex"] = $i;
$tempContainer->insertFromInterface(null, new Websom_Input("", _c_lib__arrUtils::readIndex($value, $i), $input->request), _c_lib__arrUtils::readIndex($value, $i), null, $field, $obj, new Websom_CallContext());}}}}}}}});
if ($callback != null) {
$callback->__invoke($key);}
if ($message != null) {
if ($opts->successInsert) {
$opts->successInsert->__invoke($input, $obj, $message, function ($msg) use (&$err, &$key, &$fieldWaits, &$insertReady, &$call, &$opts, &$input, &$values, &$message, &$fieldInfo, &$parentData, &$callback, &$ctx, &$that, &$obj, &$subParent, &$insert) {$input->send($msg->stringify());});}else{
$input->send($message->stringify());}}});};
for ($ff = 0; $ff < count($that->dataInfo->fields); $ff++) {
$close = function ($f) use (&$ff, &$close, &$fieldWaits, &$insertReady, &$call, &$opts, &$input, &$values, &$message, &$fieldInfo, &$parentData, &$callback, &$ctx, &$that, &$obj, &$subParent, &$insert) {$field = _c_lib__arrUtils::readIndex($that->dataInfo->fields, $f);
if (isset($field->attributes["Parent"]) == false) {
if ($field->onlyServer == false and $field->structure->hasFlag("edit")) {
if ($field->structure->hasFlag("linked")) {
$link = $field->structure->getFlag("linked");
if ($link->linkType == "array") {
$value = &$input->raw[$field->realName];
if ((gettype($value) == 'double' ? 'float' : (gettype($value) == 'array' ? (isset($value['_c__mapC']) ? 'map' : 'array') : gettype($value))) == "array") {
$insert->set($field->fieldName, count($value));}else{
$insert->set($field->fieldName, 0);}
$insertReady->__invoke();}else{
if ((gettype($values[$field->realName]) == 'double' ? 'float' : (gettype($values[$field->realName]) == 'array' ? (isset($values[$field->realName]['_c__mapC']) ? 'map' : 'array') : gettype($values[$field->realName]))) == "string") {
$linkInfo = Websom_DataInfo::getDataInfoFromRoute($field->typeRoute);
$linkedTable = $link->name;
$tbl = new Websom_Containers_Table($that->server, $linkedTable, $linkInfo);
$sobj = $linkInfo->spawn($that->server);
$sobj->websomContainer = $tbl;
$sobj->websomServer = $that->server;
$sobj->loadFromPublicKey($tbl, $values[$field->realName], function ($err) use (&$linkInfo, &$linkedTable, &$tbl, &$sobj, &$link, &$f, &$field, &$ff, &$close, &$fieldWaits, &$insertReady, &$call, &$opts, &$input, &$values, &$message, &$fieldInfo, &$parentData, &$callback, &$ctx, &$that, &$obj, &$subParent, &$insert) {if ($err != null and strlen($err) > 0) {
$input->send("Invalid field " . $field->realName);}else{
$insert->set($field->fieldName, $sobj->getField("id"));
$insertReady->__invoke();}});}else{
$insert->set($field->fieldName, $values[$field->realName]);
$insertReady->__invoke();}}}else{
if (isset($values[$field->realName])) {
$obj->setField($field->realName, $values[$field->realName]);}
$insert->set($field->fieldName, $obj->getField($field->realName));
$insertReady->__invoke();}}else{
if ($insert->doesSet($field->fieldName) == false) {
if ($field->structure->hasFlag("linked")) {
$link = $field->structure->getFlag("linked");
if ($link->linkType == "array") {
$insert->set($field->fieldName, 0);}}else{
$insert->set($field->fieldName, $obj->getField($field->realName));}
$insertReady->__invoke();}}}};
$close->__invoke($ff);}};
if ($opts != null) {
$nextCall = function () use (&$nextCall, &$call, &$opts, &$input, &$values, &$message, &$fieldInfo, &$parentData, &$callback, &$ctx, &$that, &$obj, &$subParent, &$insert) {if ($opts->onInsert != null) {
$opts->onInsert->__invoke($input, $insert, function ($err) use (&$nextCall, &$call, &$opts, &$input, &$values, &$message, &$fieldInfo, &$parentData, &$callback, &$ctx, &$that, &$obj, &$subParent, &$insert) {if ($err != null and strlen($err) > 0) {
$input->send($err);}else{
$call->__invoke();}});}else{
$call->__invoke();}};
if ($opts->autoPublicId) {
$that->getPublicId(function ($key) use (&$nextCall, &$call, &$opts, &$input, &$values, &$message, &$fieldInfo, &$parentData, &$callback, &$ctx, &$that, &$obj, &$subParent, &$insert) {$insert->set("publicId", $key);
$obj->setField("publicId", $key);
$nextCall->__invoke();});}else{
$nextCall->__invoke();}}else{
$call->__invoke();}});}

function getPublicId($found) {
$that = $this;
$this->server->crypto->smallId(function ($key) use (&$found, &$that) {$that->from()->where("publicId")->equals($key)->run(function ($err, $docs) use (&$key, &$found, &$that) {if (count($docs) == 0) {
$found->__invoke($key);}else{
$that->getPublicId($found);}});});}

function insertAutoFields($key, $input, $data, $done) {
$that = $this;
$autos = [];
for ($i = 0; $i < count($this->dataInfo->fields); $i++) {
$field = _c_lib__arrUtils::readIndex($this->dataInfo->fields, $i);
if ($field->singleLink) {
if (isset($field->attributes["AutoCreate"])) {
array_push($autos, $field);}}}
if (count($autos) == 0) {
$done->__invoke();}else{
$completed = count($autos);
$checkDone = function () use (&$completed, &$checkDone, &$key, &$input, &$data, &$done, &$that, &$autos) {$completed--;
if ($completed == 0) {
$done->__invoke();}};
for ($ii = 0; $ii < count($autos); $ii++) {
$close = function ($i) use (&$ii, &$close, &$completed, &$checkDone, &$key, &$input, &$data, &$done, &$that, &$autos) {$auto = _c_lib__arrUtils::readIndex($autos, $i);
$autoInfo = Websom_DataInfo::getDataInfoFromRoute($auto->typeRoute);
$tempContainer = new Websom_Containers_Table($that->server, $that->table . "_" . $auto->fieldName, $autoInfo);
$mapData = new _carb_map();
$mapData["parentId"] = $key;
$tempContainer->insertFromInterfaceCallback(null, new Websom_Input("", $input->raw, $input->request), $mapData, null, $auto, $data, function ($primaryKey) use (&$i, &$auto, &$autoInfo, &$tempContainer, &$mapData, &$ii, &$close, &$completed, &$checkDone, &$key, &$input, &$data, &$done, &$that, &$autos) {$checkDone->__invoke();}, new Websom_CallContext());};
$close->__invoke($ii);}}}

function updateFromInterface($opts, $update, $obj, $input, $values, $message) {
$that = $this;
$obj->containerUpdate($input, $that, $update, $values, function () use (&$opts, &$update, &$obj, &$input, &$values, &$message, &$that) {$fieldWaits = 0;
for ($f = 0; $f < count($that->dataInfo->fields); $f++) {
$field = _c_lib__arrUtils::readIndex($that->dataInfo->fields, $f);
if (isset($field->attributes["Parent"]) == false) {
$fieldWaits++;}}
$updateReady = function ($readyField, $readyValue) use (&$fieldWaits, &$updateReady, &$opts, &$update, &$obj, &$input, &$values, &$message, &$that) {$callUpdate = function () use (&$readyField, &$readyValue, &$callUpdate, &$fieldWaits, &$updateReady, &$opts, &$update, &$obj, &$input, &$values, &$message, &$that) {$that->checkRestrictions($opts, $input, "update", $readyField, function ($doChange) use (&$readyField, &$readyValue, &$callUpdate, &$fieldWaits, &$updateReady, &$opts, &$update, &$obj, &$input, &$values, &$message, &$that) {if ($doChange == true and $readyValue != null) {
$update->set($readyField->fieldName, $readyValue);}
$fieldWaits--;
if ($fieldWaits <= 0) {
if ($values["parentId"] != null) {
$update->set("parentId", $values["parentId"]);}
if ($values["arrayIndex"] != null) {
$update->set("arrayIndex", $values["arrayIndex"]);}
$update->run(function ($err, $res) use (&$doChange, &$readyField, &$readyValue, &$callUpdate, &$fieldWaits, &$updateReady, &$opts, &$update, &$obj, &$input, &$values, &$message, &$that) {if ($opts != null) {
for ($iControl = 0; $iControl < count($opts->controls); $iControl++) {
_c_lib__arrUtils::readIndex($opts->controls, $iControl)->update($input, $obj);}
for ($iControl = 0; $iControl < count($opts->updateControls); $iControl++) {
_c_lib__arrUtils::readIndex($opts->updateControls, $iControl)->update($input, $obj);}}
for ($ff = 0; $ff < count($that->dataInfo->fields); $ff++) {
$fieldClose = function ($f) use (&$ff, &$fieldClose, &$err, &$res, &$doChange, &$readyField, &$readyValue, &$callUpdate, &$fieldWaits, &$updateReady, &$opts, &$update, &$obj, &$input, &$values, &$message, &$that) {$field = _c_lib__arrUtils::readIndex($that->dataInfo->fields, $f);
if ($field->onlyServer == false and $field->structure->hasFlag("edit")) {
if ($field->structure->hasFlag("linked")) {
$link = $field->structure->getFlag("linked");
if ($link->linkType == "array") {
$value = &$input->raw[$field->realName];
if ((gettype($value) == 'double' ? 'float' : (gettype($value) == 'array' ? (isset($value['_c__mapC']) ? 'map' : 'array') : gettype($value))) == "array") {
$tempContainer = new Websom_Containers_Table($that->server, $that->table . "_" . $field->fieldName, Websom_DataInfo::getDataInfoFromRoute($link->fieldType));
for ($ii = 0; $ii < count($value); $ii++) {
$close = function ($i) use (&$ii, &$close, &$tempContainer, &$value, &$link, &$f, &$field, &$ff, &$fieldClose, &$err, &$res, &$doChange, &$readyField, &$readyValue, &$callUpdate, &$fieldWaits, &$updateReady, &$opts, &$update, &$obj, &$input, &$values, &$message, &$that) {_c_lib__arrUtils::readIndex($value, $i)["parentId"] = $obj->getField("id");
_c_lib__arrUtils::readIndex($value, $i)["arrayIndex"] = $i;
$subSelect = $that->server->database->primary->from($that->table . "_" . $field->fieldName)->where("parentId")->equals(_c_lib__arrUtils::readIndex($value, $i)["parentId"])->and()->where("arrayIndex")->equals(_c_lib__arrUtils::readIndex($value, $i)["arrayIndex"]);
$subObj = $tempContainer->dataInfo->spawn($that->server);
$subObj->websomFieldInfo = $field;
$subObj->websomServer = $that->server;
$subObj->websomParentData = $obj;
$subObj->websomContainer = $tempContainer;
$subSelect->run(function ($err2, $sres) use (&$i, &$subSelect, &$subObj, &$ii, &$close, &$tempContainer, &$value, &$link, &$f, &$field, &$ff, &$fieldClose, &$err, &$res, &$doChange, &$readyField, &$readyValue, &$callUpdate, &$fieldWaits, &$updateReady, &$opts, &$update, &$obj, &$input, &$values, &$message, &$that) {if ($err2 != null) {

$input->send("Internal Error");}else if (count($sres) == 0) {
$tempContainer->insertFromInterface(null, new Websom_Input("", _c_lib__arrUtils::readIndex($value, $i), $input->request), _c_lib__arrUtils::readIndex($value, $i), null, $field, $obj, new Websom_CallContext());}else{
$subObj->nativeLoadFromMap(_c_lib__arrUtils::readIndex($sres, 0), function ($err3) use (&$err2, &$sres, &$i, &$subSelect, &$subObj, &$ii, &$close, &$tempContainer, &$value, &$link, &$f, &$field, &$ff, &$fieldClose, &$err, &$res, &$doChange, &$readyField, &$readyValue, &$callUpdate, &$fieldWaits, &$updateReady, &$opts, &$update, &$obj, &$input, &$values, &$message, &$that) {if (strlen($err3) > 0) {

$input->send("Internal Error");}else{
$subUpdate = $subSelect->update();
$tempContainer->updateFromInterface(null, $subUpdate, $subObj, new Websom_Input("", _c_lib__arrUtils::readIndex($value, $i), $input->request), _c_lib__arrUtils::readIndex($value, $i), null);}});}});};
$close->__invoke($ii);}
$that->server->database->primary->from($tempContainer->table)->where("parentId")->equals($obj->getField("id"))->and()->where("arrayIndex")->greater(count($value) - 1)->delete()->run(function ($err2, $res2) use (&$tempContainer, &$value, &$link, &$f, &$field, &$ff, &$fieldClose, &$err, &$res, &$doChange, &$readyField, &$readyValue, &$callUpdate, &$fieldWaits, &$updateReady, &$opts, &$update, &$obj, &$input, &$values, &$message, &$that) {});}}}}};
$fieldClose->__invoke($ff);}
if ($message != null) {
if ($opts->successUpdate) {
$opts->successUpdate->__invoke($input, $obj, $message, function ($msg) use (&$err, &$res, &$doChange, &$readyField, &$readyValue, &$callUpdate, &$fieldWaits, &$updateReady, &$opts, &$update, &$obj, &$input, &$values, &$message, &$that) {$input->send($msg->stringify());});}else{
$input->send($message->stringify());}}});}});};
if ($opts != null) {
if ($opts->onUpdate != null) {
$input->updateData = $obj;
$opts->onUpdate->__invoke($input, $update, function ($err) use (&$readyField, &$readyValue, &$callUpdate, &$fieldWaits, &$updateReady, &$opts, &$update, &$obj, &$input, &$values, &$message, &$that) {if ($err != null and strlen($err) > 0) {
$input->send($err);}else{
$callUpdate->__invoke();}});}else{
$callUpdate->__invoke();}}else{
$callUpdate->__invoke();}};
for ($ff = 0; $ff < count($that->dataInfo->fields); $ff++) {
$close = function ($f) use (&$ff, &$close, &$fieldWaits, &$updateReady, &$opts, &$update, &$obj, &$input, &$values, &$message, &$that) {$field = _c_lib__arrUtils::readIndex($that->dataInfo->fields, $f);
if (isset($field->attributes["Parent"]) == false) {
if ($field->onlyServer == false and $field->structure->hasFlag("edit") and isset($input->raw[$field->realName])) {
if ($field->structure->hasFlag("linked")) {
$link = $field->structure->getFlag("linked");
if ($link->linkType == "array") {
$value = &$input->raw[$field->realName];
$setValue = count($value);
if ((gettype($value) == 'double' ? 'float' : (gettype($value) == 'array' ? (isset($value['_c__mapC']) ? 'map' : 'array') : gettype($value))) != "array") {
$setValue = 0;}
$updateReady->__invoke($field, $setValue);}else{
if ((gettype($values[$field->realName]) == 'double' ? 'float' : (gettype($values[$field->realName]) == 'array' ? (isset($values[$field->realName]['_c__mapC']) ? 'map' : 'array') : gettype($values[$field->realName]))) == "string") {
$linkInfo = Websom_DataInfo::getDataInfoFromRoute($field->typeRoute);
$linkedTable = $link->name;
$tbl = new Websom_Containers_Table($that->server, $linkedTable, $linkInfo);
$sobj = $linkInfo->spawn($that->server);
$sobj->websomContainer = $tbl;
$sobj->websomServer = $that->server;
$sobj->loadFromPublicKey($tbl, $values[$field->realName], function ($err) use (&$linkInfo, &$linkedTable, &$tbl, &$sobj, &$link, &$f, &$field, &$ff, &$close, &$fieldWaits, &$updateReady, &$opts, &$update, &$obj, &$input, &$values, &$message, &$that) {if ($err != null and strlen($err) > 0) {
$input->sendError("Invalid field " . $field->realName);}else{
$updateReady->__invoke($field, $sobj->getField("id"));}});}else{
$updateReady->__invoke($field, $values[$field->realName]);}}}else{
if (isset($values[$field->realName])) {
$obj->setField($field->realName, $values[$field->realName]);}
$updateReady->__invoke($field, $obj->getField($field->realName));}}else{
if ($field->singleLink) {
if ($field->isComponent() == false) {
$objId = -1;

 $objId = $obj->getField($field->realName)->id; 
$updateReady->__invoke($field, $objId);}else{
$updateReady->__invoke($field, null);}}else{
$updateReady->__invoke($field, null);}}}};
$close->__invoke($ff);}});}

function from() {
return $this->server->database->primary->from($this->table);}

function into() {
return $this->server->database->primary->into($this->table);}

function loadFromId($id, $callback) {
$select = $this->from()->where("id")->equals($id);
$this->loadFromSelect($select, function ($datas) use (&$id, &$callback, &$select) {if (count($datas) > 0) {
$callback->__invoke(_c_lib__arrUtils::readIndex($datas, 0));}else{
$callback->__invoke(null);}});}

function loadFromPublicId($id, $callback) {
$select = $this->from()->where("publicId")->equals($id);
$this->loadFromSelect($select, function ($datas) use (&$id, &$callback, &$select) {if (count($datas) > 0) {
$callback->__invoke(_c_lib__arrUtils::readIndex($datas, 0));}else{
$callback->__invoke(null);}});}

function loadFromSelect($select, $callback) {
$that = $this;
$select->run(function ($err, $docs) use (&$select, &$callback, &$that) {$datas = [];
$loads = 0;
$checkDone = function ($err3) use (&$err, &$docs, &$datas, &$loads, &$checkDone, &$select, &$callback, &$that) {$loads--;
if ($loads == 0) {
$callback->__invoke($datas);}};
$loads+=count($docs);
for ($doc = 0; $doc < count($docs); $doc++) {
$close = function ($doci) use (&$doc, &$close, &$err, &$docs, &$datas, &$loads, &$checkDone, &$select, &$callback, &$that) {$data = $that->dataInfo->spawn($that->server);
$data->websomContainer = $that;
$data->websomServer = $that->server;
array_push($datas, $data);
$data->nativeLoadFromMap(_c_lib__arrUtils::readIndex($docs, $doci), function ($err2) use (&$doci, &$data, &$doc, &$close, &$err, &$docs, &$datas, &$loads, &$checkDone, &$select, &$callback, &$that) {$checkDone->__invoke($err2);});};
$close->__invoke($doc);}
if (count($docs) == 0) {
$loads++;
$checkDone->__invoke("");}});}

function expose($req, $datas, $callback) {
$loads = count($datas);
$sends = [];
$checkDone = function ($err3) use (&$req, &$datas, &$callback, &$loads, &$sends, &$checkDone) {$loads--;
if ($loads == 0) {
$callback->__invoke($sends);}};
for ($i = 0; $i < count($datas); $i++) {
$data = _c_lib__arrUtils::readIndex($datas, $i);
$data->onSend($req, $data->exposeToClient(), function ($sendData) use (&$i, &$data, &$req, &$datas, &$callback, &$loads, &$sends, &$checkDone) {array_push($sends, $sendData);
$checkDone->__invoke("");});}}

function checkRestrictions($opts, $inp, $mode, $field, $callback) {
for ($i = 0; $i < count($opts->restricts); $i++) {
$r = _c_lib__arrUtils::readIndex($opts->restricts, $i);
if ($r->field == $field->realName and $r->mode == "global" or $r->mode == $mode) {
if ($r->simple) {
$ct = &$this->server->input->restrictHandlers;
if (isset($ct[$r->key])) {
$handler = $this->server->input->restrictHandlers[$r->key];
$handler->__invoke($r->value, $inp->request, function ($passed) use (&$handler, &$ct, &$i, &$r, &$opts, &$inp, &$mode, &$field, &$callback) {$callback->__invoke($passed);});
return null;}else{
throw new Exception("Custom restriction " . $r->key . " not found in request to container " . $this->name);}}else{
if ($r->callback != null) {
$r->callback->__invoke(function ($passed) use (&$i, &$r, &$opts, &$inp, &$mode, &$field, &$callback) {$callback->__invoke($passed);});}else{
throw new Exception("Restrict callback on field " . $field->realName . " in container interface " . $this->name . " is null. Did you forget interface.to(void () => {})?");}
return null;}}}
$callback->__invoke(true);}

function interfaceInsert($opts, $input) {
$that = $this;
if ($opts->canInsert) {
if ($opts->overrideInsert != null) {
$opts->overrideInsert->__invoke($input);}else{
if ($opts->mustLogin or $opts->mustOwnInsert) {
if ($this->server->userSystem->isLoggedIn($input->request) == false) {
$msg = Websom_ClientMessage::quickError("Please login.");
$input->send($msg->stringify());
return null;}}
$this->server->security->request("insert", $opts, $input, function () use (&$opts, &$input, &$that) {$v = new Websom_DataValidator($that->dataInfo);
$v->validate($input, function ($msg) use (&$v, &$opts, &$input, &$that) {if ($msg->hadError) {
$input->sendError($msg->stringify());}else{
$dones = 0;
$values = &$input->raw;
$clientMessage = new Websom_ClientMessage();
$clientMessage->message = $opts->baseSuccess;
$dones+=count($opts->controls) + count($opts->insertControls);
$checkDone = function () use (&$dones, &$values, &$clientMessage, &$checkDone, &$runControl, &$msg, &$v, &$opts, &$input, &$that) {if ($dones == 0) {
if ($clientMessage->hadError) {
$input->send($clientMessage->stringify());}else{
$that->insertFromInterface($opts, $input, $values, $clientMessage, null, null, new Websom_CallContext());}}};
$runControl = function ($control) use (&$dones, &$values, &$clientMessage, &$checkDone, &$runControl, &$msg, &$v, &$opts, &$input, &$that) {$control->validate($input, function ($cMsg) use (&$control, &$dones, &$values, &$clientMessage, &$checkDone, &$runControl, &$msg, &$v, &$opts, &$input, &$that) {$dones--;
if ($cMsg != null and $cMsg->hadError) {
$clientMessage->add($cMsg);
$checkDone->__invoke();}else{
$control->fill($input, $values, function () use (&$cMsg, &$control, &$dones, &$values, &$clientMessage, &$checkDone, &$runControl, &$msg, &$v, &$opts, &$input, &$that) {$checkDone->__invoke();});}});};
for ($i = 0; $i < count($opts->controls); $i++) {
$control = _c_lib__arrUtils::readIndex($opts->controls, $i);
$runControl->__invoke($control);}
for ($i = 0; $i < count($opts->insertControls); $i++) {
$control = _c_lib__arrUtils::readIndex($opts->insertControls, $i);
$runControl->__invoke($control);}
if (count($opts->controls) + count($opts->insertControls) == 0) {
if ($dones == 0) {
$that->server->security->countRequest("insert", $opts, $input);
$that->insertFromInterface($opts, $input, $values, $clientMessage, null, null, new Websom_CallContext());}}}});});}}else{
if ($this->server->config->dev) {
$input->send("Invalid(Dev: This container has no insert interface)");}else{
$input->send("Invalid");}}}

function interfaceSend($opts, $input) {
$that = $this;
if ($opts->canInterface) {
if (isset($input->raw["publicId"]) and isset($input->raw["route"]) and isset($input->raw["data"])) {
$obj = $that->dataInfo->spawn($that->server);
$obj->websomServer = $this->server;
$obj->loadFromPublicKey($that, $input->raw["publicId"], function ($err) use (&$obj, &$opts, &$input, &$that) {$talkingTo = $obj;
if (isset($input->raw["sub"])) {


							if (gettype($input->raw["sub"])) {
								$splits = explode(".", $input->raw["sub"]);
								for ($i = 0; $i < count($splits); $i++) {
									$split = $splits[$i];
									if (method_exists($talkingTo->$split, "getField")) {
										$talkingTo = $talkingTo->$split;
									}else{
										break;
									}
								}
							}
						}
$talkingTo->onInputInterface($input, $input->raw["route"], $input->raw["data"], function ($response) use (&$err, &$talkingTo, &$obj, &$opts, &$input, &$that) {$input->send(Websom_Json::encode($response));});});}else{
if ($this->server->config->dev) {
$input->send("Invalid(Dev: No 'publicId', 'route', or 'data' key found in query)");}else{
$input->send("Invalid");}}}}

function interfaceUpdate($opts, $input) {
$that = $this;
if ($opts->canUpdate) {
if ($opts->overrideUpdate != null) {
$opts->overrideUpdate->__invoke($input);}else{
if ($opts->mustLogin or $opts->mustOwnUpdate) {
if ($this->server->userSystem->isLoggedIn($input->request) == false) {
$cMsg = Websom_ClientMessage::quickError("Please login.");
$input->send($cMsg->stringify());
return null;}}
if (isset($input->raw["publicId"]) == false or (gettype($input->raw["publicId"]) == 'double' ? 'float' : (gettype($input->raw["publicId"]) == 'array' ? (isset($input->raw["publicId"]['_c__mapC']) ? 'map' : 'array') : gettype($input->raw["publicId"]))) != "string") {
$qMsg = Websom_ClientMessage::quickError("Invalid publicId");
$input->send($qMsg->stringify());
return null;}
$publicId = $input->raw["publicId"];
if (strlen($publicId) < 10 or strlen($publicId) > 256) {
$qMsg = Websom_ClientMessage::quickError("Invalid publicId");
$input->send($qMsg->stringify());
return null;}
$this->server->security->request("update", $opts, $input, function () use (&$publicId, &$opts, &$input, &$that) {$v = new Websom_DataValidator($that->dataInfo);
$v->validate($input, function ($msg) use (&$v, &$publicId, &$opts, &$input, &$that) {if ($msg->hadError) {
$input->sendError($msg->stringify());}else{
$dones = 0;
$values = &$input->raw;
$clientMessage = new Websom_ClientMessage();
$clientMessage->message = $opts->baseSuccess;
$dones+=count($opts->controls) + count($opts->updateControls);
$cast = $that;
$update = $that->server->database->primary->from($cast->table)->where("publicId")->equals($publicId)->update();
$obj = $that->dataInfo->spawn($that->server);
$checkDone = function () use (&$dones, &$values, &$clientMessage, &$cast, &$update, &$obj, &$checkDone, &$msg, &$v, &$publicId, &$opts, &$input, &$that) {if ($dones == 0) {
if ($clientMessage->hadError) {
$input->send($clientMessage->stringify());}else{
$that->updateFromInterface($opts, $update, $obj, $input, $values, $clientMessage);}}};
$obj->loadFromPublicKey($that, $publicId, function ($err) use (&$dones, &$values, &$clientMessage, &$cast, &$update, &$obj, &$checkDone, &$msg, &$v, &$publicId, &$opts, &$input, &$that) {$shouldContinue = true;
$doContinue = function () use (&$err, &$shouldContinue, &$doContinue, &$dones, &$values, &$clientMessage, &$cast, &$update, &$obj, &$checkDone, &$msg, &$v, &$publicId, &$opts, &$input, &$that) {$runControl = function ($control) use (&$runControl, &$err, &$shouldContinue, &$doContinue, &$dones, &$values, &$clientMessage, &$cast, &$update, &$obj, &$checkDone, &$msg, &$v, &$publicId, &$opts, &$input, &$that) {$control->validate($input, function ($cMsg) use (&$control, &$runControl, &$err, &$shouldContinue, &$doContinue, &$dones, &$values, &$clientMessage, &$cast, &$update, &$obj, &$checkDone, &$msg, &$v, &$publicId, &$opts, &$input, &$that) {$dones--;
if ($cMsg != null and $cMsg->hadError) {
$clientMessage->add($cMsg);
$checkDone->__invoke();}else{
$control->fill($input, $values, function () use (&$cMsg, &$control, &$runControl, &$err, &$shouldContinue, &$doContinue, &$dones, &$values, &$clientMessage, &$cast, &$update, &$obj, &$checkDone, &$msg, &$v, &$publicId, &$opts, &$input, &$that) {$checkDone->__invoke();});}});};
for ($i = 0; $i < count($opts->controls); $i++) {
$control = _c_lib__arrUtils::readIndex($opts->controls, $i);
$runControl->__invoke($control);}
for ($i = 0; $i < count($opts->updateControls); $i++) {
$runControl->__invoke(_c_lib__arrUtils::readIndex($opts->updateControls, $i));}
if (count($opts->controls) + count($opts->updateControls) == 0) {
if ($dones == 0) {
$that->server->security->countRequest("update", $opts, $input);
$that->updateFromInterface($opts, $update, $obj, $input, $values, $clientMessage);}}};
if ($opts->mustOwnUpdate) {
$that->server->userSystem->getLoggedIn($input->request, function ($user) use (&$err, &$shouldContinue, &$doContinue, &$dones, &$values, &$clientMessage, &$cast, &$update, &$obj, &$checkDone, &$msg, &$v, &$publicId, &$opts, &$input, &$that) {

											if ($user->id != $obj->owner->id) {
												$shouldContinue = false;
											}
										
if ($shouldContinue == false) {
$cMsg = Websom_ClientMessage::quickError("You do not own this.");
$input->send($cMsg->stringify());}else{
$doContinue->__invoke();}});}else{
$doContinue->__invoke();}});}});});}}else{
if ($this->server->config->dev) {
$input->send("Invalid(Dev: This container has no update interface)");}else{
$input->send("Invalid");}}}

function interface(...$arguments) {
if (count($arguments) == 1 and (gettype($arguments[0]) == 'string' or gettype($arguments[0]) == 'NULL')) {
$route = $arguments[0];
return new Websom_InterfaceChain($this, $route);
}
else if (count($arguments) == 1 and ((_c_lib_run::getClass($arguments[0]) == 'Websom_InterfaceOptions') or gettype($arguments[0]) == 'NULL')) {
$opts = $arguments[0];
array_push($this->interfaces, $opts);
}
}

function getInterface($route) {
for ($i = 0; $i < count($this->interfaces); $i++) {
if (_c_lib__arrUtils::readIndex($this->interfaces, $i)->route == $route) {
return _c_lib__arrUtils::readIndex($this->interfaces, $i);}}
return null;}

function getDataFromRoute($route) {


			$clsName = str_replace(".", "_", $route);
			return $clsName;
		}

function registerSubContainer($field, $routeInfo) {
$that = $this;
$name = $this->name . "_" . $field->fieldName;
$subContainer = new Websom_Containers_Table($this->server, $name, $routeInfo);
$subContainer->parentContainer = $this;
for ($i = 0; $i < count($this->interfaces); $i++) {
$_c__interface = _c_lib__arrUtils::readIndex($this->interfaces, $i);
if ($_c__interface->subs[$field->fieldName] != null) {
$subContainer->interface($_c__interface->subs[$field->fieldName]);}}
if (count($subContainer->interfaces) > 0) {
$handler = $subContainer->register();
$handler->containerInterface = $subContainer;
return $handler;}}

function register() {
$that = $this;
for ($i = 0; $i < count($this->dataInfo->fields); $i++) {
$f = _c_lib__arrUtils::readIndex($this->dataInfo->fields, $i);
if ($f->singleLink and $f->isPrimitive == false) {
$t = Websom_DataInfo::getDataInfoFromRoute($f->typeRoute);
$fi = $this->getDataFromRoute($f->typeRoute);
if (isset($t->attributes["Component"])) {
$name = $this->name . "_" . $f->fieldName;
$componentContainer = new Websom_Containers_Table($that->server, $name, $t);
$close = function ($fix, $type, $field) use (&$name, &$componentContainer, &$close, &$t, &$fi, &$i, &$f, &$that, &$handler) {$getContainer = function ($fieldName) use (&$fix, &$type, &$field, &$getContainer, &$name, &$componentContainer, &$close, &$t, &$fi, &$i, &$f, &$that, &$handler) {$fieldInfo = null;
for ($fii = 0; $fii < count($type->fields); $fii++) {
if (_c_lib__arrUtils::readIndex($type->fields, $fii)->realName == $fieldName) {
$fieldInfo = _c_lib__arrUtils::readIndex($type->fields, $fii);}}
$linked = $fieldInfo->structure->getFlag("linked");
$fieldType = Websom_DataInfo::getDataInfoFromRoute($linked->fieldType);
$subContainer = new Websom_Containers_Table($that->server, $name . "_" . $fieldInfo->fieldName, $fieldType);
return $subContainer;};


							$fi::registerInterfaces($that, $componentContainer, $getContainer);
						};
$close->__invoke($f, $t, $fi);}}else if ($f->typeRoute == "array" and isset($f->attributes["NoLoad"])) {
$linked = $f->structure->getFlag("linked");
$t = Websom_DataInfo::getDataInfoFromRoute($linked->fieldType);
$this->registerSubContainer($f, $t);}}
for ($i = 0; $i < count($this->interfaces); $i++) {
$opts = _c_lib__arrUtils::readIndex($this->interfaces, $i);
for ($c = 0; $c < count($opts->controls); $c++) {
_c_lib__arrUtils::readIndex($opts->controls, $c)->container = $this;}
for ($c = 0; $c < count($opts->selectControls); $c++) {
_c_lib__arrUtils::readIndex($opts->selectControls, $c)->container = $this;}
for ($c = 0; $c < count($opts->updateControls); $c++) {
_c_lib__arrUtils::readIndex($opts->updateControls, $c)->container = $this;}
for ($c = 0; $c < count($opts->insertControls); $c++) {
_c_lib__arrUtils::readIndex($opts->insertControls, $c)->container = $this;}}
$handler = $this->server->input->register($this->name, function ($input) use (&$that, &$handler) {if (isset($input->raw["_w_type"]) and isset($input->raw["_w_route"])) {
$type = $input->raw["_w_type"];
$route = $input->raw["_w_route"];
$opts = $that->getInterface($route);
if ($opts != null) {
$that->checkAuth($opts, $input, $type, function ($success) use (&$type, &$route, &$opts, &$input, &$that, &$handler) {if ($success) {
if ($type == "insert") {
$that->interfaceInsert($opts, $input);}else if ($type == "update") {
$that->interfaceUpdate($opts, $input);}else if ($type == "select") {
$that->server->security->request("select", $opts, $input, function () use (&$success, &$type, &$route, &$opts, &$input, &$that, &$handler) {$that->interfaceSelect($opts, $input, new Websom_CallContext());});}else if ($type == "interface") {
$that->interfaceSend($opts, $input);}else{
$input->request->code(400);
if ($that->server->config->dev) {
$input->send("Invalid(Dev: Interface of type '" . $type . "' not found)");}else{
$input->send("Invalid");}}}else{
$input->request->code(403);
$input->send("Unauthorized");}});}else{
$input->request->code(400);
if ($that->server->config->dev) {
$input->send("Invalid(Dev: No interface found with the route '" . $route . "')");}else{
$input->send("Invalid");}}}else{
$input->request->code(400);
if ($that->server->config->dev) {
$input->send("Invalid(Dev: No '_w_type' or '_w_route' found in query)");}else{
$input->send("Invalid");}}});
$handler->containerInterface = $this;
return $handler;}

function checkAuth($opts, $input, $type, $callback) {
if ($opts->hasAuth) {
$perms = "";
if ($type == "insert") {
$perms = $opts->insertPermission;}else if ($type == "update") {
$perms = $opts->updatePermission;}else if ($type == "select") {
$perms = $opts->selectPermission;}
if (strlen($perms) > 0) {
if ($input->request->session->get("dashboard") != null) {
$callback->__invoke(true);}else if ($input->server->userSystem->isLoggedIn($input->request)) {
$input->server->userSystem->getLoggedIn($input->request, function ($user) use (&$perms, &$opts, &$input, &$type, &$callback) {$user->hasPermission($perms, function ($yes) use (&$user, &$perms, &$opts, &$input, &$type, &$callback) {$callback->__invoke($yes);});});}else{
$callback->__invoke(false);}}else{
$callback->__invoke(true);}}else{
$callback->__invoke(true);}}


}class Websom_DatabaseDocument {

function __construct(...$arguments) {


}

}class Websom_DatabaseInsert {
public $table;

public $number;

public $isMulti;

public $values;

public $multiKeys;

public $inserts;

public $multiInserts;

public $database;

function __construct($database, $table) {
$this->table = "";
$this->number = 1;
$this->isMulti = false;
$this->values = [];
$this->multiKeys = new _carb_map();
$this->inserts = [];
$this->multiInserts = [];
$this->database = null;


}
function doesSet($field) {
for ($i = 0; $i < count($this->inserts); $i++) {
if (_c_lib__arrUtils::readIndex($this->inserts, $i)->field == $field) {
return true;}}
return false;}

function amount($number) {
$this->number = $number;
return $this;}

function multi() {
$this->isMulti = true;
return $this;}


}class Websom_DatabaseInterface {
public $database;

function __construct(...$arguments) {
$this->database = null;


}

}class Websom_DatabaseSelect {
public $table;

public $workingField;

public $fields;

public $limitAmount;

public $limitOffset;

public $orderField;

public $orderWay;

public $doUpdate;

public $doDelete;

public $groupLevel;

public $freshGroup;

public $updates;

public $database;

function __construct($database, $table) {
$this->table = "";
$this->workingField = "";
$this->fields = "*";
$this->limitAmount = 0;
$this->limitOffset = 0;
$this->orderField = "";
$this->orderWay = "";
$this->doUpdate = false;
$this->doDelete = false;
$this->groupLevel = 0;
$this->freshGroup = false;
$this->updates = [];
$this->database = null;


}
function doesSet($field) {
for ($i = 0; $i < count($this->updates); $i++) {
if (_c_lib__arrUtils::readIndex($this->updates, $i)->field == $field) {
return true;}}
return false;}

function limit(...$arguments) {
if (count($arguments) == 1 and (gettype($arguments[0]) == 'integer' or gettype($arguments[0]) == 'NULL')) {
$documents = $arguments[0];
$this->limitAmount = $documents;
return $this;
}
else if (count($arguments) == 2 and (gettype($arguments[0]) == 'integer' or gettype($arguments[0]) == 'NULL') and (gettype($arguments[1]) == 'integer' or gettype($arguments[1]) == 'NULL')) {
$offset = $arguments[0];
$documents = $arguments[1];
$this->limitAmount = $documents;
$this->limitOffset = $offset;
return $this;
}
}

function update() {
$this->doUpdate = true;
return $this;}

function delete() {
$this->doDelete = true;
return $this;}


}class Websom_DatabaseStructure {
public $database;

public $table;

public $fields;

function __construct($database, $table) {
$this->database = null;
$this->table = "";
$this->fields = [];

$this->database = $database;
$this->table = $table;
}
function field($name, $type) {
$field = new Websom_DatabaseField($name, $type);
array_push($this->fields, $field);
return $this;}

function flag($flag) {
if (count($this->fields) > 0) {
array_push(_c_lib__arrUtils::readIndex($this->fields, count($this->fields) - 1)->flags, $flag);}
return $this;}

function run($callback) {
$this->database->runStructure($this, $callback);}


}class Websom_DatabaseFlags {

function __construct(...$arguments) {


}

}class Websom_DatabaseFlag {
public $type;

function __construct() {
$this->type = "flag";


}

}class Websom_DatabaseFlags_AutoIncrement {
public $type;

function __construct() {
$this->type = "autoIncrement";


}

}class Websom_DatabaseFlags_Primary {
public $type;

function __construct() {
$this->type = "primary";


}

}class Websom_DatabaseFlags_Edit {
public $type;

function __construct() {
$this->type = "edit";


}

}class Websom_DatabaseFlags_Linked {
public $type;

public $name;

public $linkType;

public $fieldType;

function __construct($name, $linkType, $fieldType) {
$this->type = "linked";
$this->name = "";
$this->linkType = "";
$this->fieldType = "";

$this->name = $name;
$this->linkType = $linkType;
$this->fieldType = $fieldType;
}

}class Websom_DatabaseFlags_Unsigned {
public $type;

function __construct() {
$this->type = "unsigned";


}

}class Websom_DatabaseField {
public $name;

public $type;

public $flags;

function __construct($name, $type) {
$this->name = "";
$this->type = null;
$this->flags = [];

$this->name = $name;
$this->type = $type;
}
function hasFlag($name) {
for ($i = 0; $i < count($this->flags); $i++) {
if (_c_lib__arrUtils::readIndex($this->flags, $i)->type == $name) {
return true;}}
return false;}

function getFlag($name) {
for ($i = 0; $i < count($this->flags); $i++) {
if (_c_lib__arrUtils::readIndex($this->flags, $i)->type == $name) {
return _c_lib__arrUtils::readIndex($this->flags, $i);}}
return null;}


}class Websom_DatabaseTypes {

function __construct(...$arguments) {


}

}class Websom_DatabaseType {
public $type;

function __construct() {
$this->type = "";


}
function autoControl($info) {
}


}class Websom_DatabaseTypes_Varchar {
public $type;

public $length;

function __construct($length) {
$this->type = "varchar";
$this->length = 0;

$this->length = $length;
}
function autoControl($field) {
return new Websom_Controls_String($field->realName, $field->fieldName, $field);}


}class Websom_DatabaseTypes_Text {
public $type;

function __construct() {
$this->type = "text";


}
function autoControl($field) {
return new Websom_Controls_String($field->realName, $field->fieldName, $field);}


}class Websom_Controls_String {
public $required;

public $name;

public $field;

public $logic;

public $fieldInfo;

public $server;

public $container;

function __construct(...$arguments) {
$this->required = false;
$this->name = "";
$this->field = "";
$this->logic = "or";
$this->fieldInfo = null;
$this->server = null;
$this->container = null;

if (count($arguments) == 1 and (gettype($arguments[0]) == 'string' or gettype($arguments[0]) == 'NULL')) {
$field = $arguments[0];
$this->name = $field;
$this->field = $field;
}
else if (count($arguments) == 2 and (gettype($arguments[0]) == 'string' or gettype($arguments[0]) == 'NULL') and (gettype($arguments[1]) == 'string' or gettype($arguments[1]) == 'NULL')) {
$field = $arguments[0];
$logic = $arguments[1];
$this->name = $field;
$this->field = $field;
$this->logic = $logic;
}
else if (count($arguments) == 3 and (gettype($arguments[0]) == 'string' or gettype($arguments[0]) == 'NULL') and (gettype($arguments[1]) == 'string' or gettype($arguments[1]) == 'NULL') and ((_c_lib_run::getClass($arguments[2]) == 'Websom_FieldInfo') or gettype($arguments[2]) == 'NULL')) {
$name = $arguments[0];
$field = $arguments[1];
$fieldInfo = $arguments[2];
$this->name = $name;
$this->field = $field;
$this->fieldInfo = $fieldInfo;
}

}
function validateField($input, $value, $done) {
if ((gettype($value) == 'double' ? 'float' : (gettype($value) == 'array' ? (isset($value['_c__mapC']) ? 'map' : 'array') : gettype($value))) == "string") {
$val = $value;
$ok = true;
if (isset($this->fieldInfo->attributes["Min"])) {
$min = $this->fieldInfo->attributes["Min"];
if (strlen($val) < $min) {
$done->__invoke(new Websom_InputValidation(true, "Length must be greater than " . $min));
$ok = false;}}
if (isset($this->fieldInfo->attributes["Length"])) {
$max = $this->fieldInfo->attributes["Length"];
if (strlen($val) > $max) {
$done->__invoke(new Websom_InputValidation(true, "Length must be less than " . $max));
$ok = false;}}
if (isset($this->fieldInfo->attributes["Match"])) {
$match = $this->fieldInfo->attributes["Match"];
if ((preg_match('/'.$match.'/', $val) === 1 ? true : false) == false) {
$err = "Value must match " . $match;
if (isset($this->fieldInfo->attributes["MatchError"])) {
$err = $this->fieldInfo->attributes["MatchError"];}
$done->__invoke(new Websom_InputValidation(true, $err, $this->fieldInfo));
$ok = false;}}
if ($ok) {
$done->__invoke(new Websom_InputValidation(false, ""));}}else{
$done->__invoke(new Websom_InputValidation(true, "Not a string type"));}}

function fillField($value, $values) {
$values[$this->field] = $value;}

function filterField($value, $select, $done) {
$select->where($this->field)->equals($value);
$done->__invoke(null);}

function validate($input, $done) {
if (isset($input->raw[$this->name])) {
$this->validateField($input, $input->raw[$this->name], $done);}else if ($this->required) {
$done->__invoke(new Websom_InputValidation(true, "Missing field " . $this->name));}else{
$done->__invoke(new Websom_InputValidation(false, ""));}}

function fill($input, $values, $done) {
$this->fillField($input->raw[$this->name], $values);
$done->__invoke();}

function filter($input, $select, $done) {
if (isset($input->raw[$this->name])) {
if ($this->logic == "and") {
$select->and();}else{
$select->or();}
$val = $this->filterField($input->raw[$this->name], $select, $done);}else if ($this->required) {
$done->__invoke(new Websom_InputValidation(true, "Missing field " . $this->name));}else{
$done->__invoke(null);}}

function insert($input, $data, $key) {
}

function update($input, $data) {
}

function message($input, $name, $data, $send) {
$send->__invoke(null);}

function _c__use($inputChain) {
}


}class Websom_DatabaseTypes_BigInt {
public $type;

function __construct() {
$this->type = "bigInt";


}
function autoControl($field) {
return new Websom_Controls_Number($field->realName, $field->fieldName, $field);}


}class Websom_DatabaseTypes_Int {
public $type;

function __construct() {
$this->type = "int";


}
function autoControl($field) {
return new Websom_Controls_Number($field->realName, $field->fieldName, $field);}


}class Websom_DatabaseTypes_Float {
public $type;

function __construct() {
$this->type = "float";


}
function autoControl($field) {
return new Websom_Controls_Number($field->realName, $field->fieldName, $field);}


}class Websom_Controls_Number {
public $required;

public $name;

public $field;

public $logic;

public $fieldInfo;

public $server;

public $container;

function __construct(...$arguments) {
$this->required = false;
$this->name = "";
$this->field = "";
$this->logic = "or";
$this->fieldInfo = null;
$this->server = null;
$this->container = null;

if (count($arguments) == 1 and (gettype($arguments[0]) == 'string' or gettype($arguments[0]) == 'NULL')) {
$field = $arguments[0];
$this->name = $field;
$this->field = $field;
}
else if (count($arguments) == 2 and (gettype($arguments[0]) == 'string' or gettype($arguments[0]) == 'NULL') and (gettype($arguments[1]) == 'string' or gettype($arguments[1]) == 'NULL')) {
$field = $arguments[0];
$logic = $arguments[1];
$this->name = $field;
$this->field = $field;
$this->logic = $logic;
}
else if (count($arguments) == 3 and (gettype($arguments[0]) == 'string' or gettype($arguments[0]) == 'NULL') and (gettype($arguments[1]) == 'string' or gettype($arguments[1]) == 'NULL') and ((_c_lib_run::getClass($arguments[2]) == 'Websom_FieldInfo') or gettype($arguments[2]) == 'NULL')) {
$name = $arguments[0];
$field = $arguments[1];
$fieldInfo = $arguments[2];
$this->name = $name;
$this->field = $field;
$this->fieldInfo = $fieldInfo;
}

}
function validateField($input, $value, $done) {
if ((gettype($value) == 'double' ? 'float' : (gettype($value) == 'array' ? (isset($value['_c__mapC']) ? 'map' : 'array') : gettype($value))) == "float" or (gettype($value) == 'double' ? 'float' : (gettype($value) == 'array' ? (isset($value['_c__mapC']) ? 'map' : 'array') : gettype($value))) == "integer") {
$val = $value;
$ok = true;
if (isset($this->fieldInfo->attributes["Min"])) {
$min = $this->fieldInfo->attributes["Min"];
if ($val < $min) {
$done->__invoke(new Websom_InputValidation(true, "Number must be greater than " . $min));
$ok = false;}}
if (isset($this->fieldInfo->attributes["Max"])) {
$max = $this->fieldInfo->attributes["Max"];
if ($val > $max) {
$done->__invoke(new Websom_InputValidation(true, "Number must be less than " . $max));
$ok = false;}}
if ($ok) {
$done->__invoke(new Websom_InputValidation(false, ""));}}else{
if ($this->fieldInfo->structure->hasFlag("linked")) {
$val = &$value;
$link = $this->fieldInfo->structure->getFlag("linked");
$subInfo = Websom_DataInfo::getDataInfoFromRoute($link->fieldType);
$dv = new Websom_DataValidator($subInfo);
$valids = count($val);
$firstError = null;
for ($i = 0; $i < count($val); $i++) {
$inp = new Websom_Input("", _c_lib__arrUtils::readIndex($val, $i), $input->request);
$dv->validate($inp, function ($validation) use (&$i, &$inp, &$val, &$link, &$subInfo, &$dv, &$valids, &$firstError, &$input, &$value, &$done) {$valids--;
if ($validation->hadError) {
if ($firstError == null) {
$firstError = $validation;}}
if ($valids == 0) {
if ($firstError != null) {
$done->__invoke($firstError);}else{
$done->__invoke(new Websom_InputValidation(false, ""));}}});}}else{
$done->__invoke(new Websom_InputValidation(true, "Not a number type"));}}}

function fillField($value, $values) {
$values[$this->field] = $value;}

function filterField($value, $select, $done) {
$select->where($this->field)->equals($value);
$done->__invoke(null);}

function validate($input, $done) {
if (isset($input->raw[$this->name])) {
$this->validateField($input, $input->raw[$this->name], $done);}else if ($this->required) {
$done->__invoke(new Websom_InputValidation(true, "Missing field " . $this->name));}else{
$done->__invoke(new Websom_InputValidation(false, ""));}}

function fill($input, $values, $done) {
$this->fillField($input->raw[$this->name], $values);
$done->__invoke();}

function filter($input, $select, $done) {
if (isset($input->raw[$this->name])) {
if ($this->logic == "and") {
$select->and();}else{
$select->or();}
$val = $this->filterField($input->raw[$this->name], $select, $done);}else if ($this->required) {
$done->__invoke(new Websom_InputValidation(true, "Missing field " . $this->name));}else{
$done->__invoke(null);}}

function insert($input, $data, $key) {
}

function update($input, $data) {
}

function message($input, $name, $data, $send) {
$send->__invoke(null);}

function _c__use($inputChain) {
}


}class Websom_DatabaseTypes_Bool {
public $type;

function __construct() {
$this->type = "bool";


}
function autoControl($field) {
return new Websom_Controls_Bool($field->realName, $field->fieldName, $field);}


}class Websom_Controls_Bool {
public $required;

public $name;

public $field;

public $logic;

public $fieldInfo;

public $server;

public $container;

function __construct(...$arguments) {
$this->required = false;
$this->name = "";
$this->field = "";
$this->logic = "or";
$this->fieldInfo = null;
$this->server = null;
$this->container = null;

if (count($arguments) == 1 and (gettype($arguments[0]) == 'string' or gettype($arguments[0]) == 'NULL')) {
$field = $arguments[0];
$this->name = $field;
$this->field = $field;
}
else if (count($arguments) == 2 and (gettype($arguments[0]) == 'string' or gettype($arguments[0]) == 'NULL') and (gettype($arguments[1]) == 'string' or gettype($arguments[1]) == 'NULL')) {
$field = $arguments[0];
$logic = $arguments[1];
$this->name = $field;
$this->field = $field;
$this->logic = $logic;
}
else if (count($arguments) == 3 and (gettype($arguments[0]) == 'string' or gettype($arguments[0]) == 'NULL') and (gettype($arguments[1]) == 'string' or gettype($arguments[1]) == 'NULL') and ((_c_lib_run::getClass($arguments[2]) == 'Websom_FieldInfo') or gettype($arguments[2]) == 'NULL')) {
$name = $arguments[0];
$field = $arguments[1];
$fieldInfo = $arguments[2];
$this->name = $name;
$this->field = $field;
$this->fieldInfo = $fieldInfo;
}

}
function validateField($input, $value, $done) {
if ((gettype($value) == 'double' ? 'float' : (gettype($value) == 'array' ? (isset($value['_c__mapC']) ? 'map' : 'array') : gettype($value))) == "boolean") {
$done->__invoke(new Websom_InputValidation(false, ""));}else{
$done->__invoke(new Websom_InputValidation(true, "Not a boolean type"));}}

function fillField($value, $values) {
$values[$this->field] = $value;}

function filterField($value, $select, $done) {
$val = 0;
if ($value == true) {
$val = 1;}
$select->where($this->field)->equals($val);
$done->__invoke(null);}

function validate($input, $done) {
if (isset($input->raw[$this->name])) {
$this->validateField($input, $input->raw[$this->name], $done);}else if ($this->required) {
$done->__invoke(new Websom_InputValidation(true, "Missing field " . $this->name));}else{
$done->__invoke(new Websom_InputValidation(false, ""));}}

function fill($input, $values, $done) {
$this->fillField($input->raw[$this->name], $values);
$done->__invoke();}

function filter($input, $select, $done) {
if (isset($input->raw[$this->name])) {
if ($this->logic == "and") {
$select->and();}else{
$select->or();}
$val = $this->filterField($input->raw[$this->name], $select, $done);}else if ($this->required) {
$done->__invoke(new Websom_InputValidation(true, "Missing field " . $this->name));}else{
$done->__invoke(null);}}

function insert($input, $data, $key) {
}

function update($input, $data) {
}

function message($input, $name, $data, $send) {
$send->__invoke(null);}

function _c__use($inputChain) {
}


}class Websom_DatabaseUpdate {
public $field;

public $value;

function __construct($field, $value) {
$this->field = "";
$this->value = null;

$this->field = $field;
$this->value = $value;
}

}class Websom_Standard_Dashboard {

function __construct(...$arguments) {


}

}//Relative Module
//Relative Tab
class Websom_Standard_UserSystem {

function __construct(...$arguments) {


}

}//Relative Module
//Relative User
//Relative Confirmation
//Relative UserControl
//Relative Group
//Relative Admission
class Websom_Standard_PaymentSystem {

function __construct(...$arguments) {


}

}//Relative Module
//Relative Charge
//Relative Item
//Relative Payment
//Relative RichText
//Relative RichTextControl
class Websom_Standard_Rating {

function __construct(...$arguments) {


}

}//Relative Likes
//Relative Comments
//Relative Comment
//Relative Image
//Relative ImageControl
//Relative Forum
//Relative ForumThread
//Relative ForumReply

?>