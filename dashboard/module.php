<?php
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
class Dashboard {

function __construct(...$arguments) {


}

}class Websom_Standard_Dashboard_Module {
public $tabs;

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
$this->tabs = [];
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
function start() {
$that = $this;

$this->register(new Websom_Standard_Dashboard_Tab("Home", "Home", function ($req) use (&$that, &$builder, &$designer) {$rtn = new _carb_map();
$rtn["view"] = "dashboard-home";
$rtn["image"] = "/resources/dashboard/Websom.svg";
$rtn["sub"] = new _carb_map();
$rtn["sub"]["Account"] = new _carb_map();
$rtn["sub"]["Account"]["view"] = "dashboard-account";
$rtn["sub"]["Notifications"] = new _carb_map();
$rtn["sub"]["Notifications"]["view"] = "dashboard-notifications";
$rtn["sub"]["Build"] = new _carb_map();
$rtn["sub"]["Build"]["view"] = "dashboard-build";
return $rtn;}));
$this->register(new Websom_Standard_Dashboard_Tab("Stats", "Stats", function ($req) use (&$that, &$builder, &$designer) {$rtn = new _carb_map();
$rtn["view"] = "dashboard-stats";
$rtn["image"] = "/resources/dashboard/Analytics.svg";
return $rtn;}));
$this->register(new Websom_Standard_Dashboard_Tab("Modules", "Modules", function ($req) use (&$that, &$builder, &$designer) {$rtn = new _carb_map();
$rtn["view"] = "dashboard-modules";
$rtn["image"] = "/resources/dashboard/Modules.svg";
return $rtn;}));
$this->register(new Websom_Standard_Dashboard_Tab("Themes", "Themes", function ($req) use (&$that, &$builder, &$designer) {$rtn = new _carb_map();
$rtn["view"] = "dashboard-themes";
$rtn["image"] = "/resources/dashboard/Themes.svg";
return $rtn;}));
$this->register(new Websom_Standard_Dashboard_Tab("Builder", "Builder", function ($req) use (&$that, &$builder, &$designer) {$rtn = new _carb_map();
$rtn["view"] = "dashboard-editor";
$rtn["image"] = "/resources/dashboard/Builder.svg";
$rtn["studio"] = false;
$rtn["builder"] = true;
return $rtn;}));
$this->register(new Websom_Standard_Dashboard_Tab("Designer", "Designer", function ($req) use (&$that, &$builder, &$designer) {$rtn = new _carb_map();
$rtn["view"] = "dashboard-editor";
$rtn["image"] = "/resources/dashboard/Builder.svg";
$rtn["studio"] = false;
$rtn["designer"] = true;
return $rtn;}));
$this->register(new Websom_Standard_Dashboard_Tab("Studio", "Studio", function ($req) use (&$that, &$builder, &$designer) {$rtn = new _carb_map();
$rtn["view"] = "dashboard-editor";
$rtn["image"] = "/resources/dashboard/Studio.svg";
$rtn["studio"] = true;
return $rtn;}));
$this->register(new Websom_Standard_Dashboard_Tab("Pages", "Pages", function ($req) use (&$that, &$builder, &$designer) {$rtn = new _carb_map();
$rtn["view"] = "dashboard-pages";
$rtn["image"] = "/resources/dashboard/Pages.svg";
return $rtn;}));
$this->register(new Websom_Standard_Dashboard_Tab("Security", "Security", function ($req) use (&$that, &$builder, &$designer) {$rtn = new _carb_map();
$rtn["view"] = "dashboard-security";
$rtn["image"] = "/resources/dashboard/Locked.svg";
return $rtn;}));
$this->register(new Websom_Standard_Dashboard_Tab("Files", "Files", function ($req) use (&$that, &$builder, &$designer) {$rtn = new _carb_map();
$rtn["view"] = "dashboard-studio-explorer";
$rtn["image"] = "/resources/dashboard/Files.svg";
return $rtn;}));
$this->register(new Websom_Standard_Dashboard_Tab("Database", "Database", function ($req) use (&$that, &$builder, &$designer) {$rtn = new _carb_map();
$rtn["view"] = "dashboard-database";
$rtn["image"] = "/resources/dashboard/Database.svg";
return $rtn;}));
$this->register(new Websom_Standard_Dashboard_Tab("Containers", "Containers", function ($req) use (&$that, &$builder, &$designer) {$rtn = new _carb_map();
$rtn["view"] = "dashboard-containers";
$rtn["image"] = "/resources/dashboard/Buckets.svg";
return $rtn;}));
$this->register(new Websom_Standard_Dashboard_Tab("Buckets", "Buckets", function ($req) use (&$that, &$builder, &$designer) {$rtn = new _carb_map();
$rtn["view"] = "dashboard-buckets";
$rtn["image"] = "/resources/dashboard/File.svg";
return $rtn;}));
$this->register(new Websom_Standard_Dashboard_Tab("User System", "UserSystem", function ($req) use (&$that, &$builder, &$designer) {$rtn = new _carb_map();
$rtn["view"] = "dashboard-module";
$rtn["image"] = "/resources/dashboard/Modules.svg";
$rtn["module"] = "UserSystem";
$rtn["sub"] = new _carb_map();
$rtn["sub"]["Users"] = new _carb_map();
$rtn["sub"]["Users"]["view"] = "user-system-user-search";
$rtn["sub"]["Groups"] = new _carb_map();
$rtn["sub"]["Groups"]["view"] = "user-system-group-editor";
return $rtn;}));
$this->server->router->quickRoute("/websom.console", "websom-console");
$this->server->router->post("/websom.run.command", function ($inp) use (&$that, &$builder, &$designer) {$req = $inp->request;
if ($req->session->get("dashboard") != null) {
$req->header("Content-Type", "text/json");
$that->server->micro->command->exec($inp->raw["command"], $inp->request);}else{
$req->send("{\"status\": \"error\", \"message\": \"Not logged in\"}");}});
$this->server->router->quickRoute("/websom.dashboard", "dashboard");
$this->server->router->quickRoute("/websom.studio", "dashboard-studio");
$builder = $this->server->router->quickRoute("/websom.builder", "dashboard-builder");
$builder->greedy = true;
$designer = $this->server->router->quickRoute("/websom.designer", "dashboard-designer");
$designer->greedy = true;}

function register($tab) {
array_push($this->tabs, $tab);}

function &mapTabs($req) {
$rtn = new _carb_map();
for ($i = 0; $i < count($this->tabs); $i++) {
$rtn[_c_lib__arrUtils::readIndex($this->tabs, $i)->display] = _c_lib__arrUtils::readIndex($this->tabs, $i)->handler->__invoke($req);}
return $rtn;}

function clientData($req, $send) {
return false;}

function spawn($config) {
$this->baseConfig = $config;
$this->name = $config["name"];
$this->id = $config["id"];}

function stop() {
}

function setupData() {
}

function setupBridge() {
}

function &setupBridges() {
$bridges = [];
array_push($bridges, new DashboardBridge($this->server));
return $bridges;}


}class Websom_Standard_Dashboard_Tab {
public $name;

public $display;

public $handler;

function __construct($name, $display, $handler) {
$this->name = "";
$this->display = "";
$this->handler = null;

$this->name = $name;
$this->display = $display;
$this->handler = $handler;
}

}//Relative Carbon
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
class DashboardBridge {
public $server;

public $name;

function __construct($server) {
$this->server = null;
$this->name = "DashboardBridge";

$this->server = $server;
}
function &getInfo($req) {
$rtn = new _carb_map();
$rtn["status"] = false;
if ($req->session->get("dashboard") == null) {
}else{
$rtn["status"] = true;
$rtn["websomRoot"] = $this->server->websomRoot;
$rtn["tabs"] = $this->server->dashboard->mapTabs($req);
$rtn["version"] = $this->server->version;
$rtn["platform"] = "node";


				$rtn["platform"] = "php";
				$rtn["platform"] = phpversion();
			}
return $rtn;}

function &getFileInfo($req, $dir) {
if ($req->session->get("dashboard") != null and (preg_match('/'."\\.\\.".'/', $dir) === 1 ? true : false) == false) {
$rtn = new _carb_map();
$files = [];
$resolve = Oxygen_FileSystem::resolve($this->server->config->root . "/" . $dir);
$rtn["dir"] = $dir;
$reals = Oxygen_FileSystem::readDirSync($resolve);
for ($i = 0; $i < count($reals); $i++) {
$file = new _carb_map();
$file["name"] = _c_lib__arrUtils::readIndex($reals, $i);
$file["isDir"] = Oxygen_FileSystem::isDir($resolve . "/" . _c_lib__arrUtils::readIndex($reals, $i));
array_push($files, $file);}
$rtn["files"] = $files;
return $rtn;}}

function readFile($req, $file) {
if ($req->session->get("dashboard") != null and (preg_match('/'."\\.\\.".'/', $file) === 1 ? true : false) == false) {
$res = Oxygen_FileSystem::resolve($this->server->config->root . "/" . $file);
if (Oxygen_FileSystem::exists($res)) {
return Oxygen_FileSystem::readSync($res, "utf8");}}}

function writePackFile($req, $pack, $name, $content) {
if ($req->session->get("dashboard") != null) {
$res = Oxygen_FileSystem::resolve($this->server->config->root . "/packs/" . $pack . "/view/" . $name);
Oxygen_FileSystem::writeSync($res, $content);}}

function &getContainers($req) {
if ($req->session->get("dashboard") != null) {
$containers = [];
for ($i = 0; $i < count($this->server->module->modules); $i++) {
$module = _c_lib__arrUtils::readIndex($this->server->module->modules, $i);
for ($c = 0; $c < count($module->containers); $c++) {
$container = _c_lib__arrUtils::readIndex($module->containers, $c);
$mp = new _carb_map();
$mp["module"] = $module->name;
$mp["name"] = $container->name;
array_push($containers, $mp);}}
return $containers;}}

function loadContainers($req) {
if ($req->session->get("dashboard") != null) {
return $this->server->module->loadAllContainers();}}

function exportResources($req) {
if ($req->session->get("dashboard") != null) {
$this->server->resource->exportToFolder($this->server->config->resources, function ($hadError, $errMsg) use (&$req) {;});}}

function rebuildAll($req) {
if ($req->session->get("dashboard") != null) {
$this->server->module->rebuild();}}

function &getModules($req) {
if ($req->session->get("dashboard") != null) {
$modules = [];
for ($i = 0; $i < count($this->server->module->modules); $i++) {
$module = _c_lib__arrUtils::readIndex($this->server->module->modules, $i);
$mp = new _carb_map();
$mp["name"] = $module->name;
$mp["config"] = $module->baseConfig;
array_push($modules, $mp);}
return $modules;}}

function &getBuilderViews($req) {
if ($req->session->get("dashboard") != null) {
$views = [];
$pages = [];
$website = [];
for ($i = 0; $i < count($this->server->view->views); $i++) {
$view = _c_lib__arrUtils::readIndex($this->server->view->views, $i);
$data = new _carb_map();
$data["name"] = $view->name;
$data["meta"] = $view->meta;
$data["location"] = Websom_Path::relativePath($this->server->config->root, $view->location);
if ($view->isPage) {
array_push($pages, $data);}else if ($view->websiteView) {
array_push($website, $data);}else{
array_push($views, $data);}}
$moduleViews = &$this->server->view->getModuleViews();
for ($i = 0; $i < count($moduleViews); $i++) {
$view = _c_lib__arrUtils::readIndex($moduleViews, $i);
$data = new _carb_map();
$data["name"] = $view->name;
$data["meta"] = $view->meta;
$data["module"] = $view->owner->name;
$data["location"] = Websom_Path::relativePath($this->server->config->root, $view->location);
if ($view->isPage) {
array_push($pages, $data);}else if ($view->websiteView) {
array_push($website, $data);}else{
array_push($views, $data);}}
$output = new _carb_map();
$output["views"] = $views;
$output["pages"] = $pages;
$output["website"] = $website;
return $output;}}

function &getPacks($req) {
if ($req->session->get("dashboard") != null) {
$packs = [];
for ($i = 0; $i < count($this->server->pack->packs); $i++) {
$pack = _c_lib__arrUtils::readIndex($this->server->pack->packs, $i);
$data = new _carb_map();
$data["name"] = $pack->name;
$dataViews = [];
$views = &$pack->getViews();
for ($j = 0; $j < count($views); $j++) {
$view = _c_lib__arrUtils::readIndex($views, $j);
$vData = new _carb_map();
$vData["name"] = $view->name;
$vData["meta"] = $view->meta;
$vData["template"] = $view->template;
$vData["client"] = $view->client;
$vData["location"] = Websom_Path::relativePath($this->server->config->root, $view->location);
$vData["filename"] = Oxygen_FileSystem::basename($view->location);
array_push($dataViews, $vData);}
$data["views"] = $dataViews;
array_push($packs, $data);}
return $packs;}}

function &getDatabaseFile($req) {
if ($req->session->get("dashboard") != null) {
return Websom_Json::parse(Oxygen_FileSystem::readSync($this->server->config->databaseFile, "utf8"));}}

function setDatabaseFile($req, $content) {
if ($req->session->get("dashboard") != null) {
Oxygen_FileSystem::writeSync($this->server->config->databaseFile, $content);}}

function &getBucketFile($req) {
if ($req->session->get("dashboard") != null) {
return Websom_Json::parse(Oxygen_FileSystem::readSync($this->server->config->bucketFile, "utf8"));}}

function setBucketFile($req, $content) {
if ($req->session->get("dashboard") != null) {
Oxygen_FileSystem::writeSync($this->server->config->bucketFile, $content);}}

function &login($req, $username, $password) {
$root = $this->server->dashboard->root;
if (Oxygen_FileSystem::exists($root . "/auth.json") == false) {
Oxygen_FileSystem::writeSync($root . "/auth.json", "{\n\t\"username\": \"websom\",\n\t\"password\": \"admin\"\n}");}
$auth = Websom_Json::parse(Oxygen_FileSystem::readSync($root . "/auth.json", "utf8"));
if ($auth["username"] == $username and $auth["password"] == $password) {
$req->session->set("dashboard", true);
return $this->getInfo($req);}else{
$msg = new _carb_map();
$msg["hadError"] = true;
$msg["error"] = "Invalid username or password";
return $msg;}}

function &upload($req, $dir, $files) {
if ($req->session->get("dashboard") != null and (preg_match('/'."\\.\\.".'/', $dir) === 1 ? true : false) == false) {
for ($i = 0; $i < count($files); $i++) {
$name = _c_lib__arrUtils::readIndex(_c_lib__arrUtils::readIndex($files, $i), 0);
$content = _c_lib__arrUtils::readIndex(_c_lib__arrUtils::readIndex($files, $i), 1);
$res = Oxygen_FileSystem::resolve($this->server->config->root . "/" . $dir);
$raw = "";

					$raw = base64_decode($content);
				

Oxygen_FileSystem::writeSync($res . "/" . $name, $raw);}
return $this->getFileInfo($req, $dir);}}

function awaitInfo() {
}

function getName() {
return $this->name;
}

function getServerMethods() {


			return $this->serverMethods();
		}

function &clientMethods() {
$methods = new _carb_map();
$methods["awaitInfo"] = "function () {\n\n\t\t\treturn this.getInfo();\n\t\t\n}";
return $methods;}

function serverMethods() {
return ["getInfo", "getFileInfo", "readFile", "writePackFile", "getContainers", "loadContainers", "exportResources", "rebuildAll", "getModules", "getBuilderViews", "getPacks", "getDatabaseFile", "setDatabaseFile", "getBucketFile", "setBucketFile", "login", "upload"];}


}
?>
<?php return 'Websom_Standard_Dashboard_Module'; ?>