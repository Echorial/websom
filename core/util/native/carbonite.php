<?php

include(dirname(__FILE__)."/compiler.php");

return [
	"buildModule" => function ($module) {
		$c = new WebsomCarbonite\Carbonite_Compiler();
		$moduleName = "Unkown";
		$c->buildScript->setVar("websomRegister", function ($args) use ($moduleName) {
			$moduleName = $args[0]->value;
		});

		$base = "C:\Users\Jeremy\Documents\Programing\Carbonite/Carbonite/src/library/library.carb";
		$native = $c->addSource("Native", file_get_contents($base));
		$native->file = $base;
		$native->process();
		$decode = json_decode(file_get_contents("C:\Users\Jeremy\Documents\Programing\Carbonite/Websom/www/Websom/Project/header.json"), true);
		$decode["_c__mapC"] = true;
		//$c->loadHeader($decode);
		$source = $c->addSource($module, "class everything {} class Test {}");//file_get_contents($module));
		$source->file = $module;
		//$source->process();
		$c->build("php.source.memory", ["_c__mapC" => true]);
		if (!$c->status->hadError) {
			file_put_contents(dirname($module) . "/module.php", $c->rawOutput . "\nreturn " . $moduleName . ";");
		}
		echo $c->status->stringify();
		return $c->status->stringify();
	}
];

?>