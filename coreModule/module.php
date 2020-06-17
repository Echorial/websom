<?php
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
class CoreModule {

function __construct(...$arguments) {


}

}class CoreModule_Module {
public $groups;

public $confirmations;

public $objects;

public $mediaFiles;

public $tags;

public $categories;

public $dashboardView;

public $commentEdit;

public $commentCreate;

public $commentRead;

public $groupRead;

public $groupCreate;

public $groupEdit;

public $corePublic;

public $media;

public $transientAccessCode;

public $server;

public $baseConfig;

public $containers;

public $bridges;

public $registeredCollections;

public $registeredPermissions;

public $registeredBuckets;

public $name;

public $id;

public $root;

public $version;

public $author;

public $license;

public $repo;

function __construct($server) {
$this->groups = null;
$this->confirmations = null;
$this->objects = null;
$this->mediaFiles = null;
$this->tags = null;
$this->categories = null;
$this->dashboardView = null;
$this->commentEdit = null;
$this->commentCreate = null;
$this->commentRead = null;
$this->groupRead = null;
$this->groupCreate = null;
$this->groupEdit = null;
$this->corePublic = null;
$this->media = null;
$this->transientAccessCode = "";
$this->server = null;
$this->baseConfig = null;
$this->containers = [];
$this->bridges = [];
$this->registeredCollections = [];
$this->registeredPermissions = [];
$this->registeredBuckets = [];
$this->name = "";
$this->id = "";
$this->root = "";
$this->version = "";
$this->author = "";
$this->license = "";
$this->repo = "";

$this->server = $server;
$this->registerWithServer();
}
function permissions() {
$this->dashboardView = new Websom_Permission("Dashboard.View");
$this->commentEdit = new Websom_Permission("Comment.Edit");
$this->commentEdit->description = "Allows users to edit any comment";
$this->commentCreate = new Websom_Permission("Comment.Create");
$this->commentCreate->description = "Allows users to create a comment";
$this->commentRead = new Websom_Permission("Comment.Read");
$this->commentRead->description = "Read permissions on any comment anywhere";
$this->commentRead->_c__public = true;
$this->registerPermission($this->dashboardView);
$this->registerPermission($this->commentEdit);
$this->registerPermission($this->commentCreate);
$this->registerPermission($this->commentRead);
$this->corePublic = $this->registerPermission("Core.Public")->isPublic()->setDescription("Base public permission providing access to tags, categories and more.");
$this->groupRead = $this->registerPermission("Group.Read")->setDescription("Allows users to read permission group information.");
$this->groupCreate = $this->registerPermission("Group.Create")->setDescription("Allows users to create permission groups. WARNING This is an admin level permission.");
$this->groupEdit = $this->registerPermission("Group.Edit")->setDescription("Allows users to edit permission groups. WARNING This is an admin level permission.");}

function collections() {
$db = $this->server->database->central;
$this->tags = $db->collection("tags");
$this->tags->schema()->field("name", "string")->field("namespace", "string")->field("description", "string")->field("color", "string")->field("created", "time")->field("objects", "int");
$fieldsForSearching = [];
array_push($fieldsForSearching, "name");
array_push($fieldsForSearching, "namespace");
array_push($fieldsForSearching, "description");
array_push($fieldsForSearching, "color");
array_push($fieldsForSearching, "created");
array_push($fieldsForSearching, "objects");
$this->tags->enableSearching($fieldsForSearching);
$this->registerCollection($this->tags);
$this->server->api->_c__interface($this->tags, "/tags")->route("/insert")->auth($this->dashboardView)->executes("insert")->write("name")->write("namespace")->write("description")->write("color")->setComputed("created", function ($req) use (&$db, &$fieldsForSearching, &$confirmationSchema) {return Websom_Time::now();})->route("/delete")->auth($this->dashboardView)->executes("delete")->filter("default")->field("id", "in")->route("/view")->auth($this->dashboardView)->executes("select")->read("*")->filter("default")->field("namespace", "==")->route("/search")->auth($this->corePublic)->executes("search")->read("*")->filter("default")->field("name", "==")->field("namespace", "==")->route("/get")->auth($this->dashboardView)->executes("select")->read("*")->filter("default")->field("id", "==");
$this->categories = $db->collection("categories");
$this->categories->schema()->field("name", "string")->field("namespace", "string")->field("description", "string")->field("color", "string")->field("created", "time")->field("objects", "int")->field("parent", "string");
$this->registerCollection($this->categories);
$this->server->api->_c__interface($this->categories, "/categories")->route("/insert")->auth($this->dashboardView)->executes("insert")->write("name")->write("namespace")->write("description")->write("color")->write("parent")->setComputed("created", function ($req) use (&$db, &$fieldsForSearching, &$confirmationSchema) {return Websom_Time::now();})->route("/delete")->auth($this->dashboardView)->executes("delete")->filter("default")->field("id", "in")->route("/view")->auth($this->dashboardView)->executes("select")->read("*")->filter("default")->field("namespace", "==")->route("/get")->auth($this->dashboardView)->executes("select")->read("*")->filter("default")->field("id", "==");
$this->objects = $db->collection("websom_bucket_objects");
$this->objects->schema()->field("filename", "string")->field("bucket", "string")->field("acl", "string")->field("uploaded", "boolean")->field("token", "string")->field("sizeLimit", "int");
$this->registerCollection($this->objects);
$this->mediaFiles = $db->collection("websom_media");
$this->mediaFiles->schema()->field("name", "string")->field("file", "string")->field("size", "int")->field("created", "time")->field("owner", "string")->field("type", "string");
$this->registerCollection($this->mediaFiles);
$this->server->api->_c__interface($this->mediaFiles, "/media")->route("/insert")->auth($this->dashboardView)->executes("insert")->write("name")->write("file")->write("size")->write("type")->setComputed("user", function ($req) use (&$db, &$fieldsForSearching, &$confirmationSchema) {return $req->user()->id;})->setComputed("created", function ($req) use (&$db, &$fieldsForSearching, &$confirmationSchema) {return Websom_Time::now();})->route("/delete")->auth($this->dashboardView)->executes("delete")->filter("default")->field("id", "in")->on("success", function ($req, $docs) use (&$db, &$fieldsForSearching, &$confirmationSchema) {for ($i = 0; $i < count($docs); $i++) {
$doc = _c_lib__arrUtils::readIndex($docs, $i);
$this->media->deleteObject($doc->get("name"));}})->route("/view")->auth($this->dashboardView)->executes("select")->read("*")->filter("default")->order("*", "dsc")->route("/get")->auth($this->dashboardView)->executes("select")->read("*")->filter("default")->field("file", "==");
$this->confirmations = $db->collection("confirmations");
$confirmationSchema = $this->confirmations->schema()->field("secret", "string")->field("key", "string")->field("ip", "string")->field("created", "time")->field("storage", "string")->field("expires", "time")->field("confirmed", "boolean")->field("service", "string")->field("method", "string")->field("to", "string");
$this->registerCollection($this->confirmations);
$this->groups = $db->collection("groups");
Websom_Group::applySchema($this->groups);
$this->registerCollection($this->groups);
$this->server->api->_c__interface($this->groups, "/groups")->route("/create")->auth($this->groupCreate)->executes("insert")->write("name")->write("description")->write("permissions")->write("rules")->write("public")->write("user")->setComputed("created", function ($req) use (&$db, &$fieldsForSearching, &$confirmationSchema) {return Websom_Time::now();})->route("/find")->auth($this->groupRead)->executes("select")->read("*")->filter("default")->order("created", "dsc", true)->route("/read")->auth($this->groupRead)->executes("select")->read("*")->filter("default")->field("id", "==");
$this->server->api->route("/dashboard/view")->auth($this->dashboardView)->executes(function ($ctx) use (&$db, &$fieldsForSearching, &$confirmationSchema) {$data = new _carb_map();
$data["website"] = $this->server->config->name;
$data["dev"] = $this->server->config->dev;
$data["config"] = $this->server->configService->cacheOptions();
$data["options"] = $this->server->configService->getConfiguredOptions();
$ctx->request->endWithData($data);});
$this->server->api->route("/dashboard/access")->executes(function ($ctx) use (&$db, &$fieldsForSearching, &$confirmationSchema) {if ($this->server->config->dev) {
$data = new _carb_map();
$str = "";
for ($i = 0;$i < 4;$i++) {
$str .= (floor((mt_rand() / mt_getrandmax()) * 10));}
$this->transientAccessCode = $str;
;
$ctx->request->endWithSuccess("Generated");}else{
$ctx->request->endWithError("Nice try.");}});
$this->server->api->route("/dashboard/login-with-access-code")->input("code")->type("string")->executes(function ($ctx) use (&$db, &$fieldsForSearching, &$confirmationSchema) {if ($this->server->config->dev) {
if ($this->transientAccessCode != "") {
$code = $ctx->get("code");
if ($code == $this->transientAccessCode) {
$this->transientAccessCode = "";
$ctx->request->grantSessionRole("admin");
$ctx->request->endWithSuccess("Success");}else{
$ctx->request->endWithError("Invalid");}}else{
$ctx->request->endWithError("Invalid");}}else{
$ctx->request->endWithError("This feature is only available on dev servers.");}});}

function registerWithServer() {
$adapter = new CoreModule_Confirmation($this->server);
$adapter->module = $this;
$this->server->confirmation->confirmation = $adapter;
$adapter->registerCollection();}

function start() {
$this->media = $this->registerBucket("media");
$this->server->api->route("/media/upload")->auth($this->dashboardView)->input("filename")->type("string")->input("type")->type("string")->input("size")->type("integer")->executes(function ($ctx)  {$filename = $ctx->get("filename");
$res = $this->mediaFiles->where("name", "==", $filename)->get();
$data = new _carb_map();
$data["uploadURL"] = $this->media->uploadObject()->name($filename)->access("public")->generateUploadURL();
$data["conflict"] = false;
if (count($res->documents) > 0) {
$data["conflict"] = true;}else{
$this->mediaFiles->insert()->set("name", $filename)->set("file", $this->media->serve($filename))->set("type", $ctx->get("type"))->set("size", $ctx->get("size"))->set("created", Websom_Time::now())->set("owner", $ctx->request->user()->id)->run();}
$ctx->request->endWithData($data);});}

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

function registerCollection($collection) {
array_push($this->registeredCollections, $collection);
if ($this->server->config->dev) {
if ($collection->appliedSchema != null) {
$collection->appliedSchema->register();}}}

function registerPermission(...$arguments) {
if (count($arguments) == 1 and ((_c_lib_run::getClass($arguments[0]) == 'Websom_Permission') or gettype($arguments[0]) == 'NULL')) {
$permission = $arguments[0];
array_push($this->registeredPermissions, $permission);
}
else if (count($arguments) == 1 and (gettype($arguments[0]) == 'string' or gettype($arguments[0]) == 'NULL')) {
$permission = $arguments[0];
$perm = new Websom_Permission($permission);
array_push($this->registeredPermissions, $perm);
return $perm;
}
}

function registerBucket($name) {
$bucket = new Websom_Bucket($this->server, $name, $this->name);
array_push($this->registeredBuckets, $bucket);
$this->server->registerBucket($bucket);
return $bucket;}

function setupData() {
}

function setupBridge() {
}

function pullFromGlobalScope($name) {
}

function &setupBridges() {
$bridges = [];
return $bridges;}


}//Relative Carbon
//Relative Context
//Relative Error
//Relative FileSystem
//Relative Buffer
//Relative File
//Relative Stat
//Relative primitive
//Relative object
//Relative Math
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
class CoreModule_LokiCollection {
public $lokiCollection;

public $database;

public $appliedSchema;

public $searchable;

public $replicatedSearchFields;

public $name;

public $entityTemplate;

function __construct($database, $name) {
$this->lokiCollection = null;
$this->database = null;
$this->appliedSchema = null;
$this->searchable = false;
$this->replicatedSearchFields = null;
$this->name = "";
$this->entityTemplate = null;

$this->database = $database;
$this->name = $name;
}
function lazilyGetCollection() {
}

function makeDocumentFromMap($id, $data) {
$doc = new CoreModule_LokiDocument($this, $id);
$data["id"] = $id;
$doc->rawData = $data;
return $doc;}

function document($id) {
$this->lazilyGetCollection();
$doc = null;

if ($doc == null) {
return null;}
return $this->documentFromRaw($doc);}

function &getAll($ids) {
$this->lazilyGetCollection();
$docs = null;

$outputs = [];
for ($i = 0; $i < count($docs); $i++) {
$doc = &_c_lib__arrUtils::readIndex($docs, $i);
array_push($outputs, $this->documentFromRaw($doc));}
return $outputs;}

function meta($key) {
$this->lazilyGetCollection();
$doc = null;

if ($doc == null) {
}
$meta = new CoreModule_MetaDocument($key);
$meta->raw = $doc;
$meta->collection = $this;
return $meta;}

function documentFromRaw($raw) {
$idVal = $raw["\$loki"];
$doc = new CoreModule_LokiDocument($this, strval($idVal));
$raw["id"] = strval($idVal);
$doc->rawData = $raw;
return $doc;}

function registerSchema(...$arguments) {
if (count($arguments) == 1 and ((_c_lib_run::getClass($arguments[0]) == 'Websom_Adapters_Database_Schema') or gettype($arguments[0]) == 'NULL')) {
$schema = $arguments[0];

}
else if (count($arguments) == 1 and ((_c_lib_run::getClass($arguments[0]) == 'Websom_Adapters_Database_Schema') or gettype($arguments[0]) == 'NULL')) {
$schema = $arguments[0];

}
}

function &commitBatch($query) {
for ($u = 0; $u < count($query->updates); $u++) {
$this->executeUpdate(_c_lib__arrUtils::readIndex($query->updates, $u));}
$inserts = [];
for ($i = 0; $i < count($query->inserts); $i++) {
array_push($inserts, $this->executeInsert(_c_lib__arrUtils::readIndex($query->inserts, $i)));}}

function executeUpdate($query) {
$this->lazilyGetCollection();
$docs = &$this->executeSelect($query)->documents;
$updates = [];
$keys = [];
foreach ($query->sets as $k => $_c_v__k0) {
array_push($keys, $k);}

if ($this->searchable) {
$this->updateSearch($updates, $keys);}
$res = new Websom_Adapters_Database_UpdateQueryResult(true, "");
$res->updateCount = count($docs);
return $res;}

function executeDelete($query) {
$this->lazilyGetCollection();
$docs = &$this->executeSelect($query)->documents;
$ids = [];
for ($i = 0; $i < count($docs); $i++) {
$doc = _c_lib__arrUtils::readIndex($docs, $i);
array_push($ids, $doc->id);

if ($this->appliedSchema != null) {
for ($j = 0; $j < count($this->appliedSchema->calculators); $j++) {
$calc = _c_lib__arrUtils::readIndex($this->appliedSchema->calculators, $j);
$calc->delete($doc, $this);}}}

$this->deleteSearch($ids);
$results = new Websom_Adapters_Database_DeleteQueryResult(true, "");
$results->documents = $docs;
return $results;}

function executeInsert($query) {
$this->lazilyGetCollection();
$id = "";

if ($this->appliedSchema != null) {
$doc = $this->documentFromRaw($query->sets);
for ($i = 0; $i < count($this->appliedSchema->calculators); $i++) {
$calc = _c_lib__arrUtils::readIndex($this->appliedSchema->calculators, $i);
$calc->insert($doc, $this);}
$this->insertSearch($doc);}
$res = new Websom_Adapters_Database_InsertQueryResult(true, "", $id);
return $res;}

function executeSelect($query) {
$this->lazilyGetCollection();
$res = new Websom_Adapters_Database_SelectQueryResult(true, "");

return $res;}

function makeEntity($document) {
$entity = null;


			$cls = $this->entityTemplate;
			$entity = new $cls();
		
$entity->collection = $this;
$entity->id = $document->id;
$entity->loadFromMap($document->data());
return $entity;}

function enableSearching($fields) {
$this->searchable = true;
$this->replicatedSearchFields = $fields;}

function insertSearch($document) {
if ($this->searchable) {
if ($this->database->server->database->search != null) {
$this->database->server->database->search->insertDocument($document);}}}

function updateSearch($documents, $keys) {
if ($this->searchable) {
if ($this->database->server->database->search != null) {
$this->database->server->database->search->updateDocuments($documents, $keys);}}}

function deleteSearch($ids) {
if ($this->searchable) {
if ($this->database->server->database->search != null) {
$this->database->server->database->search->deleteDocuments($ids);}}}

function schema() {
$this->appliedSchema = new Websom_Adapters_Database_Schema($this);
return $this->appliedSchema;}

function insert() {
return new Websom_Adapters_Database_InsertQuery($this);}

function select() {
return new Websom_Adapters_Database_SelectQuery($this);}

function where($field, $operator, $value) {
$q = $this->select();
$q->where($field, $operator, $value);
return $q;}

function update() {
return new Websom_Adapters_Database_UpdateQuery($this);}

function delete() {
return new Websom_Adapters_Database_DeleteQuery($this);}

function batch() {
return new Websom_Adapters_Database_BatchQuery($this);}

function entity() {
$entity = null;


			$clsName = $this->entityTemplate;
			$entity = new $clsName();
		
$entity->collection = $this;
return $entity;}

function getEntity($id) {
$doc = $this->document($id);
if ($doc == null) {
return null;}
return $this->makeEntity($doc);}


}class CoreModule_LokiDB {
public $loki;

public $route;

public $server;

public $adapterKey;

function __construct($server) {
$this->loki = null;
$this->route = "adapter.database.loki";
$this->server = null;
$this->adapterKey = "";

$this->server = $server;
}
function initialize() {
if ($this->server->config->verbose) {
;}
$this->loadDB();}

function loadDB() {
}

function stopLoki() {
if ($this->server->config->verbose) {
;}
}

function shutdown() {
$this->stopLoki();}

function collection($name) {
return new CoreModule_LokiCollection($this, $name);}


}class CoreModule_LokiDocument {
public $rawData;

public $collection;

public $id;

function __construct($collection, $id) {
$this->rawData = null;
$this->collection = null;
$this->id = "";

$this->collection = $collection;
$this->id = $id;
}
function get($field) {
return $this->rawData[$field];}

function &data() {
return $this->rawData;}

function calc($field) {
if ($this->collection->appliedSchema == null) {
throw "No schema on collection";
return null;}
for ($i = 0; $i < count($this->collection->appliedSchema->calculators); $i++) {
$calc = _c_lib__arrUtils::readIndex($this->collection->appliedSchema->calculators, $i);
if ($calc->getterName == $field) {
return $calc->get($this->collection);}}}


}class CoreModule_MetaDocument {
public $raw;

public $sets;

public $collection;

public $id;

function __construct($id) {
$this->raw = new _carb_map();
$this->sets = new _carb_map();
$this->collection = null;
$this->id = "";

$this->id = $id;
}
function incrementNumberField($index, $value) {
$curValue = $this->raw["number" . $index];
$this->sets["number" . $index] = $curValue + $value;}

function setNumberField($index, $value) {
$this->sets["number" . $index] = $value;}

function numberField($index) {
return $this->raw["number" . $index];}

function setStringField($index, $value) {
$this->sets["string" . $index] = $value;}

function stringField($index) {
return $this->raw["string" . $index];}

function setArrayField($index, $value) {
$this->sets["array" . $index] = $value;}

function &arrayField($index) {
return $this->raw["array" . $index];}

function update() {
}


}class CoreModule_FirestoreCollection {
public $firestoreCollection;

public $database;

public $appliedSchema;

public $searchable;

public $replicatedSearchFields;

public $name;

public $entityTemplate;

function __construct($database, $name) {
$this->firestoreCollection = null;
$this->database = null;
$this->appliedSchema = null;
$this->searchable = false;
$this->replicatedSearchFields = null;
$this->name = "";
$this->entityTemplate = null;

$this->database = $database;
$this->name = $name;
}
function lazilyGetCollection() {
}

function makeDocumentFromMap($id, $data) {
return $this->documentFromRaw($id, $data);}

function document($id) {
$this->lazilyGetCollection();
$doc = null;

if ($doc == null) {
return null;}
return $this->documentFromRaw($id, $doc);}

function &getAll($ids) {
$this->lazilyGetCollection();
$docs = null;

$outputs = [];
for ($i = 0; $i < count($docs); $i++) {
$doc = &_c_lib__arrUtils::readIndex($docs, $i);
}
return $outputs;}

function meta($key) {
$this->lazilyGetCollection();
$doc = null;

if ($doc == null) {
}
$meta = new CoreModule_FirestoreMetaDocument($key);
$meta->raw = $doc;
$meta->collection = $this;
return $meta;}

function documentFromRaw($id, $raw) {
$doc = new CoreModule_FirestoreDocument($this, $id);
$doc->rawData = $raw;
return $doc;}

function registerSchema(...$arguments) {
if (count($arguments) == 1 and ((_c_lib_run::getClass($arguments[0]) == 'Websom_Adapters_Database_Schema') or gettype($arguments[0]) == 'NULL')) {
$schema = $arguments[0];

}
else if (count($arguments) == 1 and ((_c_lib_run::getClass($arguments[0]) == 'Websom_Adapters_Database_Schema') or gettype($arguments[0]) == 'NULL')) {
$schema = $arguments[0];

}
}

function &commitBatch($query) {
}

function executeUpdate($query) {
$this->lazilyGetCollection();
return $this->runUpdate($query, $this->firestoreCollection);}

function runUpdate($query, $ctx) {
$this->lazilyGetCollection();
$docs = &$this->executeSelect($query)->documents;
$updates = [];
$keys = [];
foreach ($query->sets as $k => $_c_v__k0) {
array_push($keys, $k);}

if ($this->searchable) {
$this->updateSearch($updates, $keys);}
$res = new Websom_Adapters_Database_UpdateQueryResult(true, "");
$res->updateCount = count($docs);
return $res;}

function executeDelete($query) {
$this->lazilyGetCollection();
$docs = &$this->executeSelect($query)->documents;
$ids = [];
for ($i = 0; $i < count($docs); $i++) {
$doc = _c_lib__arrUtils::readIndex($docs, $i);
array_push($ids, $doc->id);

if ($this->appliedSchema != null) {
for ($j = 0; $j < count($this->appliedSchema->calculators); $j++) {
$calc = _c_lib__arrUtils::readIndex($this->appliedSchema->calculators, $j);
$calc->delete($doc, $this);}}}
$this->deleteSearch($ids);
$results = new Websom_Adapters_Database_DeleteQueryResult(true, "");
$results->documents = $docs;
return $results;}

function executeInsert($query) {
$this->lazilyGetCollection();
return $this->runInsert($query, $this->firestoreCollection);}

function runInsert($query, $ctx) {
$this->lazilyGetCollection();
$id = "";

if ($this->appliedSchema != null) {
$doc = $this->documentFromRaw($id, $query->sets);
for ($i = 0; $i < count($this->appliedSchema->calculators); $i++) {
$calc = _c_lib__arrUtils::readIndex($this->appliedSchema->calculators, $i);
$calc->insert($doc, $this);}
$this->insertSearch($doc);}
$res = new Websom_Adapters_Database_InsertQueryResult(true, "", $id);
return $res;}

function executeSelect($query) {
$this->lazilyGetCollection();
$res = new Websom_Adapters_Database_SelectQueryResult(true, "");

return $res;}

function makeEntity($document) {
$entity = null;


			$cls = $this->entityTemplate;
			$entity = new $cls();
		
$entity->collection = $this;
$entity->id = $document->id;
$entity->loadFromMap($document->data());
return $entity;}

function enableSearching($fields) {
$this->searchable = true;
$this->replicatedSearchFields = $fields;}

function insertSearch($document) {
if ($this->searchable) {
if ($this->database->server->database->search != null) {
$this->database->server->database->search->insertDocument($document);}}}

function updateSearch($documents, $keys) {
if ($this->searchable) {
if ($this->database->server->database->search != null) {
$this->database->server->database->search->updateDocuments($documents, $keys);}}}

function deleteSearch($ids) {
if ($this->searchable) {
if ($this->database->server->database->search != null) {
$this->database->server->database->search->deleteDocuments($ids);}}}

function schema() {
$this->appliedSchema = new Websom_Adapters_Database_Schema($this);
return $this->appliedSchema;}

function insert() {
return new Websom_Adapters_Database_InsertQuery($this);}

function select() {
return new Websom_Adapters_Database_SelectQuery($this);}

function where($field, $operator, $value) {
$q = $this->select();
$q->where($field, $operator, $value);
return $q;}

function update() {
return new Websom_Adapters_Database_UpdateQuery($this);}

function delete() {
return new Websom_Adapters_Database_DeleteQuery($this);}

function batch() {
return new Websom_Adapters_Database_BatchQuery($this);}

function entity() {
$entity = null;


			$clsName = $this->entityTemplate;
			$entity = new $clsName();
		
$entity->collection = $this;
return $entity;}

function getEntity($id) {
$doc = $this->document($id);
if ($doc == null) {
return null;}
return $this->makeEntity($doc);}


}class CoreModule_Firestore {
public $firestore;

public $route;

public $server;

public $adapterKey;

function __construct($server) {
$this->firestore = null;
$this->route = "adapter.database.firestore";
$this->server = null;
$this->adapterKey = "";

$this->server = $server;
}
function initialize() {
$this->loadDB();}

function loadDB() {
}

function shutdown() {
}

function collection($name) {
return new CoreModule_FirestoreCollection($this, $name);}


}class CoreModule_FirestoreDocument {
public $rawData;

public $collection;

public $id;

function __construct($collection, $id) {
$this->rawData = null;
$this->collection = null;
$this->id = "";

$this->collection = $collection;
$this->id = $id;
}
function get($field) {
if ($field == "id") {
return $this->id;}
return $this->rawData[$field];}

function &data() {
return $this->rawData;}

function calc($field) {
if ($this->collection->appliedSchema == null) {
throw "No schema on collection";
return null;}
for ($i = 0; $i < count($this->collection->appliedSchema->calculators); $i++) {
$calc = _c_lib__arrUtils::readIndex($this->collection->appliedSchema->calculators, $i);
if ($calc->getterName == $field) {
return $calc->get($this->collection);}}}


}class CoreModule_FirestoreMetaDocument {
public $raw;

public $sets;

public $collection;

public $id;

function __construct($id) {
$this->raw = new _carb_map();
$this->sets = new _carb_map();
$this->collection = null;
$this->id = "";

$this->id = $id;
}
function incrementNumberField($index, $value) {
$curValue = $this->raw["number" . $index];
}

function setNumberField($index, $value) {
$this->sets["number" . $index] = $value;}

function numberField($index) {
return $this->raw["number" . $index];}

function setStringField($index, $value) {
$this->sets["string" . $index] = $value;}

function stringField($index) {
return $this->raw["string" . $index];}

function setArrayField($index, $value) {
$this->sets["array" . $index] = $value;}

function &arrayField($index) {
return $this->raw["array" . $index];}

function update() {
}


}class CoreModule_SendGrid {
public $sendGrid;

public $route;

public $server;

public $adapterKey;

function __construct($server) {
$this->sendGrid = null;
$this->route = "adapter.email.sendGrid";
$this->server = null;
$this->adapterKey = "";

$this->server = $server;
}
function initialize() {
}

function loadSendGrid() {
}

function send($email) {
$this->loadSendGrid();
}

function email() {
return new Websom_Adapters_Email_Email($this);}

function template($title) {
return new Websom_Adapters_Email_EmailTemplate($this, $title);}

function shutdown() {
}


}class CoreModule_Confirmation {
public $route;

public $module;

public $handlers;

public $server;

public $adapterKey;

function __construct($server) {
$this->route = "adapter.confirmation";
$this->module = null;
$this->handlers = [];
$this->server = null;
$this->adapterKey = "";

$this->server = $server;
}
function registerCollection() {
$this->server->api->route("/confirmations/confirm")->input("secret")->type("string")->limit(500, 512)->executes(function ($ctx)  {$res = $this->module->confirmations->where("secret", "==", $ctx->get("secret"))->get();
if (count($res->documents) == 0) {
$ctx->request->endWithError("Invalid secret");
return null;}
$doc = _c_lib__arrUtils::readIndex($res->documents, 0);
$expires = $doc->get("expires");
if (Websom_Time::now() > $expires) {
$ctx->request->endWithError("Confirmation expired");
return null;}
if ($doc->get("confirmed")) {
$ctx->request->endWithError("Confirmation already used");
return null;}
for ($i = 0; $i < count($this->handlers); $i++) {
$handler = _c_lib__arrUtils::readIndex($this->handlers, $i);
if ($handler->key == $doc->get("key")) {
$confirmationExec = new Websom_Adapters_Confirmation_Execution($ctx->request, $doc->get("key"), Websom_Json::parse($doc->get("storage")));
if ($ctx->request->body["params"]) {
$confirmationExec->params = $ctx->request->body["params"];}
$handler->handler->__invoke($confirmationExec);
if ($ctx->request->sent == false) {
$this->module->confirmations->update()->where("id", "==", $doc->get("id"))->set("confirmed", true)->run();}}}
$ctx->request->endWithSuccess("Success");});}

function dispatch(...$arguments) {
if (count($arguments) == 1 and ((_c_lib_run::getClass($arguments[0]) == 'Websom_Adapters_Confirmation_Confirmation') or gettype($arguments[0]) == 'NULL')) {
$confirmation = $arguments[0];
$secret = $this->server->crypto->getRandomHex(255);
$url = $this->server->clientHost . "/confirmations/confirm/" . $confirmation->key . "/" . $secret;
$results = new Websom_Adapters_Confirmation_ConfirmationResults($secret, $url, "success", "Confirmation created");
$this->module->confirmations->insert()->set("secret", $secret)->set("key", $confirmation->key)->set("ip", $confirmation->ip)->set("created", Websom_Time::now())->set("storage", Websom_Json::encode($confirmation->storage))->set("expires", Websom_Time::now() + $confirmation->ttl)->set("confirmed", false)->set("service", $confirmation->notificationService)->set("method", $confirmation->method)->set("to", $confirmation->recipient)->run();
if ($confirmation->notificationService == "direct") {
return $results;}else if ($confirmation->notificationService == "email") {
if ($confirmation->method == "link") {
$this->sendLinkEmail($url, $confirmation);}else if ($confirmation->method == "code") {
}
return $results;}else if ($confirmation->notificationService == "sms") {
}
return new Websom_Adapters_Confirmation_ConfirmationResults("", "", "error", "Invalid notificationService");
}
else if (count($arguments) == 1 and ((_c_lib_run::getClass($arguments[0]) == 'Websom_Adapters_Confirmation_Confirmation') or gettype($arguments[0]) == 'NULL')) {
$confirmation = $arguments[0];

}
}

function sendLinkEmail($url, $confirmation) {
$from = $this->server->getConfigString("adapter.core.confirmation", "fromEmail");
if ($from == "") {
$from = "no-reply@example.com";}
$this->server->notification->email->template("confirmation")->row()->column()->column()->paragraph($confirmation->confirmationMessage)->button("Confirm", $url)->column()->email()->setTextBody("Click here to confirm your email address: " . $url)->addRecipient($confirmation->recipient)->setFrom($from, $this->server->websiteName)->setSubject($confirmation->emailSubject)->send();}

function confirm($key) {
return new Websom_Adapters_Confirmation_Confirmation($this, $key);}

function handleConfirmation($key, $handler) {
array_push($this->handlers, new Websom_Adapters_Confirmation_Handler($key, $handler));}

function initialize() {
}

function shutdown() {
}


}class CoreModule_FileSystemBucket {
public $coreModule;

public $server;

public $adapterKey;

function __construct($server) {
$this->coreModule = null;
$this->server = null;
$this->adapterKey = "";

$this->server = $server;
}
function initialize() {
$this->coreModule = $this->server->module->getModule("coreModule");
$this->server->api->route("/objects/upload/:token", function ($req)  {$splits = explode("/", $req->path);
if (count($splits) == 4) {
$token = _c_lib__arrUtils::readIndex($splits, 3);
if (strlen($token) != 256) {
$req->endWithError("Invalid token");
return null;}
$this->handleUpload($req, $token);}else{
$req->endWithError("Invalid path");}});
$this->server->api->get("/buckets/*", function ($req)  {$splits = explode("/", $req->path);
if (count($splits) < 4) {
$req->endWithError("Invalid filename");
return null;}
$bucket = _c_lib__arrUtils::readIndex($splits, 2);
$filename = implode("/", array_slice($splits, 3, count($splits)));
$filename = preg_replace('/'."../".'/', "", $filename);
$realFile = $this->server->config->devBuckets . "/" . $bucket . "/" . $filename;
$name = _c_lib__arrUtils::readIndex($splits, count($splits) - 1);
if (Oxygen_FileSystem::exists($realFile)) {
$req->serve($realFile);}else{
$req->endWithError("Unknown file " . $name);}});}

function handleUpload($req, $token) {
$objects = $this->coreModule->objects->where("token", "==", $token)->get();
if (count($objects->documents) == 1) {
$obj = _c_lib__arrUtils::readIndex($objects->documents, 0);
if ($obj->get("uploaded") == true) {
$req->endWithError("Object already uploaded");
return null;}
$objectPath = $this->server->config->devBuckets . "/" . $obj->get("bucket") . "/" . $obj->get("filename");
if ($req->files["upload"] != null) {
Oxygen_FileSystem::writeSync($objectPath, Oxygen_FileSystem::readSync($req->files["upload"], null));
$this->coreModule->objects->update()->where("id", "==", $obj->get("id"))->set("uploaded", true)->run();
$req->endWithSuccess("Uploaded");}else{
$req->endWithError("Invalid payload");}}else{
$req->endWithError("Invalid token");}}

function generateUploadURL($upload) {
$token = $this->server->crypto->getRandomHex(256 / 2);
$this->coreModule->objects->insert()->set("filename", $upload->filename)->set("bucket", $upload->bucket->name)->set("acl", $upload->acl)->set("uploaded", false)->set("token", $token)->set("sizeLimit", $upload->fileSizeLimit)->run();
return $this->server->apiHost . "/objects/upload/" . $token;}

function deleteObject($bucket, $filename) {
$bucketPath = $this->server->config->devBuckets . "/" . $bucket->name;
Oxygen_FileSystem::unlink($bucketPath . "/" . $filename);}

function createDirectory($bucket, $path) {
$bucketPath = $this->server->config->devBuckets . "/" . $bucket->name;
if (Oxygen_FileSystem::exists($bucketPath . "/" . $path) == false) {
Oxygen_FileSystem::makeDir($bucketPath . "/" . $path);}}

function setObjectACL($bucket, $filename, $acl) {
$this->coreModule->objects->update()->where("filename", "==", $filename)->set("acl", $acl)->run();}

function registerBucket($bucket) {
if (Oxygen_FileSystem::exists($this->server->config->devBuckets . "/" . $bucket->name) == false) {
Oxygen_FileSystem::makeDir($this->server->config->devBuckets . "/" . $bucket->name);}}

function serve($bucket, $filename) {
return $this->server->apiHost . "/buckets/" . $bucket->name . "/" . $filename;}

function shutdown() {
}


}class CoreModule_Algolia {
public $firestore;

public $route;

public $server;

public $adapterKey;

function __construct($server) {
$this->firestore = null;
$this->route = "adapter.search.algolia";
$this->server = null;
$this->adapterKey = "";

$this->server = $server;
}
function initialize() {
}

function shutdown() {
}

function getAlgoliaIndex($collection) {
}

function initializeCollection(...$arguments) {
if (count($arguments) == 1 and ((_c_lib_run::getClass($arguments[0]) == 'Websom_Adapters_Database_Collection' or (_c_lib_run::getClass($arguments[0]) == 'CoreModule_LokiCollection') or (_c_lib_run::getClass($arguments[0]) == 'CoreModule_FirestoreCollection')) or gettype($arguments[0]) == 'NULL')) {
$collection = $arguments[0];

}
else if (count($arguments) == 1 and ((_c_lib_run::getClass($arguments[0]) == 'Websom_Adapters_Database_Collection' or (_c_lib_run::getClass($arguments[0]) == 'CoreModule_LokiCollection') or (_c_lib_run::getClass($arguments[0]) == 'CoreModule_FirestoreCollection')) or gettype($arguments[0]) == 'NULL')) {
$collection = $arguments[0];

}
}

function insertDocument($document) {
}

function updateDocuments($documents, $keys) {
}

function deleteDocuments($ids) {
}

function search($collection, $query) {
$qr = new Websom_Adapters_Search_QueryResult(false, "Success");

return $qr;}


}
?>
<?php return 'CoreModule_Module'; ?>