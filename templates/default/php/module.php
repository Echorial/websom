<?php

class App extends Websom_Module {
	start() {
		// Do some basic initialization here
	}

	permissions() {
		// Register your module permissions here
	}

	collections() {
		// Register your DB collections here
	}

	api() {
		// Register some API endpoints here
		
		$this->server->api->route("/example/endpoint")
			->auth(function ($req) {
				$user = $req->user();
				return !is_null($user);
			})
			->executes(function ($ctx) {
				$ctx->request->endWithData([ "message" => "Hello World!" ]);
			});
	}
}