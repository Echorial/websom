<?php
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

function setupData() {
}

function setupBridge() {
}

function &setupBridges() {
$bridges = [];
return $bridges;}


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
class Websom_Standard_RichText {
public $type;

public $content;

public $websomFieldInfo;

public $websomParentData;

public $websomContainer;

public $websomServer;

function __construct($server) {
$this->type = "";
$this->content = "";
$this->websomFieldInfo = null;
$this->websomParentData = null;
$this->websomContainer = null;
$this->websomServer = null;

$this->websomServer = $server;
}
function read($value) {
$this->type = $value[0];
$this->content = substr($value, 1,strlen($value) - 1);}

function exposeToClient() {
return $this->type . $this->content;}

function write() {
return $this->type . $this->content;}

function callLoadFromMap(...$arguments) {
if (count($arguments) == 2 and ((gettype($arguments[0]) == 'array' ? _c_lib__mapUtils::isMap($arguments[0]) : get_class($arguments[0]) == '_carb_map') or gettype($arguments[0]) == 'NULL') and (is_callable($arguments[1]) or gettype($arguments[1]) == 'NULL')) {
$raw = $arguments[0];
$callback = $arguments[1];


			return $this->loadFromMap($raw, $callback);
		
}
else if (count($arguments) == 2 and ((gettype($arguments[0]) == 'array' ? _c_lib__mapUtils::isMap($arguments[0]) : get_class($arguments[0]) == '_carb_map') or gettype($arguments[0]) == 'NULL') and (is_callable($arguments[1]) or gettype($arguments[1]) == 'NULL')) {
$raw = $arguments[0];
$callback = $arguments[1];


			return $this->loadFromMap($raw, $callback);
		
}
}

function setField($name, $value) {


			$this->$name = $value;
		}

static function getDataInfo(...$arguments) {
if (count($arguments) == 0) {


			return self::getInfo();
		
}
else if (count($arguments) == 0) {


			return self::getInfo();
		
}
}

static function spawnFromId($server, $table, $id, $done) {
$dataInfo = null;


			$dataInfo = self::getInfo();
		
$container = new Websom_Containers_Table($server, $table, $dataInfo);
$data = $dataInfo->spawn($server);
$data->websomContainer = $container;
$data->loadFromId($container, $id, function ($err) use (&$server, &$table, &$id, &$done, &$dataInfo, &$container, &$data) {$done->__invoke($err, $data);});}

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


			return $this->$name;
		}

function getPublicId() {
return $this->getField("publicId");}

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

function nativeLoadFromMap($raw, $done) {


			$this->loadFromMap($raw, $done);
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

static function getInfo() {
$info = new Websom_DataInfo("Websom.Standard.RichText");
$info->attributes["Structure"] = "string";
$info->attributes["Control"] = "Websom.Standard.RichTextControl";
return $info;}

function loadFromMap($raw, $done) {
$that = $this;
$dataInfo = Websom_Standard_RichText::getDataInfo();
$dones = 0;
$checkDone = function ($err) use (&$raw, &$done, &$that, &$dataInfo, &$dones, &$checkDone) {$dones--;
if ($dones == 0) {
$done->__invoke($err);}};
$dones++;
$checkDone->__invoke("");}

function &exposeToClientBase() {
$raw = new _carb_map();
return $raw;}


}class Websom_Standard_RichTextControl {
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
else if (count($arguments) == 3 and (gettype($arguments[0]) == 'string' or gettype($arguments[0]) == 'NULL') and (gettype($arguments[1]) == 'string' or gettype($arguments[1]) == 'NULL') and ((get_class($arguments[2]) == 'Websom_FieldInfo') or gettype($arguments[2]) == 'NULL')) {
$name = $arguments[0];
$field = $arguments[1];
$fieldInfo = $arguments[2];
$this->name = $name;
$this->field = $field;
$this->fieldInfo = $fieldInfo;
}

}
function fillField(...$arguments) {
if (count($arguments) == 2 and (((gettype($arguments[0]) == 'array') or gettype($arguments[0]) == 'boolean' or gettype($arguments[0]) == 'double' or gettype($arguments[0]) == 'integer' or (gettype($arguments[0]) == 'array' ? _c_lib__mapUtils::isMap($arguments[0]) : get_class($arguments[0]) == '_carb_map') or gettype($arguments[0]) == 'string') or gettype($arguments[0]) == 'NULL') and ((gettype($arguments[1]) == 'array' ? _c_lib__mapUtils::isMap($arguments[1]) : get_class($arguments[1]) == '_carb_map') or gettype($arguments[1]) == 'NULL')) {
$value = $arguments[0];
$values = $arguments[1];
$values[$this->field] = $value;
}
else if (count($arguments) == 2 and (((gettype($arguments[0]) == 'array') or gettype($arguments[0]) == 'boolean' or gettype($arguments[0]) == 'double' or gettype($arguments[0]) == 'integer' or (gettype($arguments[0]) == 'array' ? _c_lib__mapUtils::isMap($arguments[0]) : get_class($arguments[0]) == '_carb_map') or gettype($arguments[0]) == 'string') or gettype($arguments[0]) == 'NULL') and ((gettype($arguments[1]) == 'array' ? _c_lib__mapUtils::isMap($arguments[1]) : get_class($arguments[1]) == '_carb_map') or gettype($arguments[1]) == 'NULL')) {
$value = $arguments[0];
$values = $arguments[1];

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

function filterField($value, $select, $done) {
}

function message($input, $name, $data, $send) {
$send->__invoke(null);}


}class Websom_Standard_Image {
public $caption;

public $websomFieldInfo;

public $websomParentData;

public $websomContainer;

public $websomServer;

function __construct($server) {
$this->caption = "";
$this->websomFieldInfo = null;
$this->websomParentData = null;
$this->websomContainer = null;
$this->websomServer = null;

$this->websomServer = $server;
}
function containerInsert($input, $container, $insert, $data, $done) {
$cast = $data["arrayIndex"];
$writeTo = $cast . ".png";
$bucketReference = $this->websomFieldInfo->attributes["Bucket"];
$bucket = $this->websomServer->getBucketFromReference($bucketReference);
if ($this->websomFieldInfo->structure->hasFlag("linked")) {
$pId = $this->websomParentData->getPublicId();
$bucket->makeDir($pId, function ($ok) use (&$pId, &$input, &$container, &$insert, &$data, &$done, &$cast, &$writeTo, &$bucketReference, &$bucket) {});
$writeTo = $pId . "/" . $writeTo;}
if (isset($input->raw["encoded"])) {
$bucket->write($writeTo, $this->decodePng($input->raw["encoded"]), function ($msg) use (&$input, &$container, &$insert, &$data, &$done, &$cast, &$writeTo, &$bucketReference, &$bucket) {});}
$done->__invoke();}

function containerUpdate($input, $container, $update, $data, $done) {
if (isset($input->raw["encoded"])) {
$bucketReference = $this->websomFieldInfo->attributes["Bucket"];
$bucket = $this->websomServer->getBucketFromReference($bucketReference);
$bucket->write("image.txt", $input->raw["encoded"], function ($msg) use (&$bucketReference, &$bucket, &$input, &$container, &$update, &$data, &$done) {});}
$done->__invoke();}

function decodePng($base64) {


			return base64_decode(preg_replace("~data:image/(png|jpeg|gif);base64,~", "", $raw));
		}

function &exposeToClient() {
$bucketReference = $this->websomFieldInfo->attributes["Bucket"];
$bucket = $this->websomContainer->server->getBucketFromReference($bucketReference);
$publicUrl = $bucket->raw["publicUrl"];
$mp = new _carb_map();
$mp["caption"] = $this->caption;
$mp["arrayIndex"] = $this->getField("arrayIndex");
$url = $publicUrl . $this->getPublicId() . ".png";
if ($this->websomFieldInfo->structure->hasFlag("linked")) {
$cast = $this->getField("arrayIndex");
$ext = $cast . ".png";
$url = $publicUrl . $this->websomParentData->getPublicId() . "/" . $ext;}
$mp["url"] = $url;
return $mp;}

function callLoadFromMap(...$arguments) {
if (count($arguments) == 2 and ((gettype($arguments[0]) == 'array' ? _c_lib__mapUtils::isMap($arguments[0]) : get_class($arguments[0]) == '_carb_map') or gettype($arguments[0]) == 'NULL') and (is_callable($arguments[1]) or gettype($arguments[1]) == 'NULL')) {
$raw = $arguments[0];
$callback = $arguments[1];


			return $this->loadFromMap($raw, $callback);
		
}
else if (count($arguments) == 2 and ((gettype($arguments[0]) == 'array' ? _c_lib__mapUtils::isMap($arguments[0]) : get_class($arguments[0]) == '_carb_map') or gettype($arguments[0]) == 'NULL') and (is_callable($arguments[1]) or gettype($arguments[1]) == 'NULL')) {
$raw = $arguments[0];
$callback = $arguments[1];


			return $this->loadFromMap($raw, $callback);
		
}
}

function setField($name, $value) {


			$this->$name = $value;
		}

static function getDataInfo(...$arguments) {
if (count($arguments) == 0) {


			return self::getInfo();
		
}
else if (count($arguments) == 0) {


			return self::getInfo();
		
}
}

static function spawnFromId($server, $table, $id, $done) {
$dataInfo = null;


			$dataInfo = self::getInfo();
		
$container = new Websom_Containers_Table($server, $table, $dataInfo);
$data = $dataInfo->spawn($server);
$data->websomContainer = $container;
$data->loadFromId($container, $id, function ($err) use (&$server, &$table, &$id, &$done, &$dataInfo, &$container, &$data) {$done->__invoke($err, $data);});}

function read($value) {
}

function write() {
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

function nativeLoadFromMap($raw, $done) {


			$this->loadFromMap($raw, $done);
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

static function getInfo() {
$info = new Websom_DataInfo("Websom.Standard.Image");
$captionStructure = new Websom_DatabaseField("caption", null);
$captionStructure->type = new Websom_DatabaseTypes_Varchar(256);
array_push($captionStructure->flags, new Websom_DatabaseFlags_Edit());
array_push($info->fields, new Websom_FieldInfo("caption", "caption", "string", $captionStructure));
_c_lib__arrUtils::readIndex($info->fields, count($info->fields) - 1)->attributes["Length"] = 256;
return $info;}

function loadFromMap($raw, $done) {
$that = $this;
$dataInfo = Websom_Standard_Image::getDataInfo();
$dones = 0;
$checkDone = function ($err) use (&$raw, &$done, &$that, &$dataInfo, &$dones, &$checkDone) {$dones--;
if ($dones == 0) {
$done->__invoke($err);}};
$this->caption = $raw["caption"];
$dones++;
$checkDone->__invoke("");}

function &exposeToClientBase() {
$raw = new _carb_map();
$raw["caption"] = $this->caption;
return $raw;}


}class Websom_Standard_ImageControl {
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
else if (count($arguments) == 3 and (gettype($arguments[0]) == 'string' or gettype($arguments[0]) == 'NULL') and (gettype($arguments[1]) == 'string' or gettype($arguments[1]) == 'NULL') and ((get_class($arguments[2]) == 'Websom_FieldInfo') or gettype($arguments[2]) == 'NULL')) {
$name = $arguments[0];
$field = $arguments[1];
$fieldInfo = $arguments[2];
$this->name = $name;
$this->field = $field;
$this->fieldInfo = $fieldInfo;
}

}
function fillField(...$arguments) {
if (count($arguments) == 2 and (((gettype($arguments[0]) == 'array') or gettype($arguments[0]) == 'boolean' or gettype($arguments[0]) == 'double' or gettype($arguments[0]) == 'integer' or (gettype($arguments[0]) == 'array' ? _c_lib__mapUtils::isMap($arguments[0]) : get_class($arguments[0]) == '_carb_map') or gettype($arguments[0]) == 'string') or gettype($arguments[0]) == 'NULL') and ((gettype($arguments[1]) == 'array' ? _c_lib__mapUtils::isMap($arguments[1]) : get_class($arguments[1]) == '_carb_map') or gettype($arguments[1]) == 'NULL')) {
$value = $arguments[0];
$values = $arguments[1];
$values[$this->field] = $value;
}
else if (count($arguments) == 2 and (((gettype($arguments[0]) == 'array') or gettype($arguments[0]) == 'boolean' or gettype($arguments[0]) == 'double' or gettype($arguments[0]) == 'integer' or (gettype($arguments[0]) == 'array' ? _c_lib__mapUtils::isMap($arguments[0]) : get_class($arguments[0]) == '_carb_map') or gettype($arguments[0]) == 'string') or gettype($arguments[0]) == 'NULL') and ((gettype($arguments[1]) == 'array' ? _c_lib__mapUtils::isMap($arguments[1]) : get_class($arguments[1]) == '_carb_map') or gettype($arguments[1]) == 'NULL')) {
$value = $arguments[0];
$values = $arguments[1];

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

function filterField($value, $select, $done) {
}

function message($input, $name, $data, $send) {
$send->__invoke(null);}


}
?>
<?php return 'CoreModule_Module'; ?>