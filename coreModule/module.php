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
class CoreModule {

function __construct(...$arguments) {


}

}class CoreModule_Module {
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
function start() {
}

function clientData($req, $send) {
return false;}

function spawn($config) {
$this->baseConfig = $config;
$this->name = $config["name"];
$this->id = $config["id"];}

function stop() {
}

function configure() {
}

function setupData() {
}

function setupBridge() {
}

function pullFromGlobalScope($name) {
}

function &setupBridges() {
$bridges = [];
return $bridges;}


}class test {

function __construct(...$arguments) {


}

}//Relative Carbon
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
class CoreModule_LokiDB {
public $server;

function __construct($server) {
$this->server = null;

$this->server = $server;
}
function initialize() {
;}

function collection($name) {
}


}
?>
<?php return 'CoreModule_Module'; ?>