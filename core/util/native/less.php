<?php
$path = dirname(__FILE__) . "/lessc.inc.php";

include($path);

return [
	"compileLess" => function ($file, $callback) {
		$less = new lessc;
		try {
			$css = $less->compileFile($file);
			$callback(false, $css);
		}catch (Exception $e) {
			$callback(true, $e->getMessage());
		}
	}
];

?>