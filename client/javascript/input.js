Websom.Input = {
	getNativeValue: function (elem) {
		let val = null;
		if ($(elem).attr("type") === "checkbox")
			val = $(elem).is(":checked");
		else
			val = $(elem).val();
		
		if ($(elem).attr("data-value-type") == "Number")
			val = parseFloat(val);
		
		if ($(elem).attr("type") == "date")
			val = elem.valueAsNumber;

		return val;
	},
	post: function (key, query, callback) {
		query._w_raw_request = true;
		$.post("/postInput",
			{
				inputKey: key,
				data: query
			},
			(d) => {
				callback(d);
			});
	}
};

Websom.interface = function (key, type, query, w_route, found) {
	query._w_type = type;
	query._w_route = w_route;
	if (!found)
		query._w_route = "default";
	
	var f = found || w_route;
	$.post("/postInput",
		{
			inputKey: key,
			data: query
		},
		(d) => {
			var parsed = JSON.parse(d);
			if (!parsed)
				f(parsed);
			else
				f(parsed.documents || parsed);
		});
};

Websom.dispatchEvent = function (el, eventName) {
	var event = new Event(eventName);
	(el.length ? el[0] : el).dispatchEvent(event);
};

function handleMessage(form, button, data) {
	if (data.status == "error") {
		Websom.dispatchEvent(button, "error");
		if (data.messages && data.messages.length > 0) {
			for (var message of data.messages)
				$("<div class='card error red white-text'>" + message + "</div>").appendTo(form).animate({opacity: 0}, 9000, function () { $(this).remove(); });
		}else if (!data.format)
			if (data.message)
				$("<div class='card error red white-text'>" + data.message + "</div>").appendTo(form).animate({opacity: 0}, 9000, function () { $(this).remove(); });
	}else if (data.status == "success") {
		Websom.dispatchEvent(button, "success");
		var noClear = false;
		
		if ($(form).attr("no-clear") !== "false" && typeof $(form).attr("no-clear") != "undefined")
			noClear = true;
		
		if (!noClear) {
			form[0].reset();
			form.find("[names]").each(function (i) {
				var input = $(this);
				if (this.__vue__) {
					this.__vue__.setValue(null);
				}
			});
		}
		if (!data.format)
			if (data.message)
				$("<div class='card success green'>" + data.message + "</div>").appendTo(form).animate({opacity: 0}, 9000, function () { $(this).remove(); });
	}else if (data.status == "action") {
		//TODO: Allow custom actions
		if (data.action == "reload")
			location.reload();
		else if (data.action == "navigate")
			location.href = data.href;
	}
}

Websom.submitForm = function (form, button, extraQuery) {
	var route = "default";
	var key = form.attr("form-key");

	button.addClass("disabled");
	button.addClass("loading");
	if (button.attr("data-submit") != "")
		route = button.attr("data-submit");
	
	var query = {};
	if (form.attr("query"))
		query = JSON.parse(form.attr("query"));
	
	if (typeof button.attr("data-base-query") == "string")
		query = JSON.parse(button.attr("data-base-query"));
		
	query._w_route = route;

	if (typeof extraQuery == "object")
		Object.assign(query, extraQuery);

	if (button.is("[data-interface]"))
		query._w_type = button.attr("data-interface");
	
	if (form.attr("parent"))
		query.parentDocument = form.attr("parent");

	var dones = 0;
	
	var send = function () {
		if (form.is("[multipart]")) {
			var data = new FormData();
			data.append("inputKey", key);
			data.append("data", JSON.stringify(query));
			
			form.find("input[type=file]").each(function () {
				for (var i = 0; i < this.files.length; i++) {
					data.append($(this).attr("name"), this.files[i], this.files[i].name);
				}
			});

			$.ajax({
				type: "POST",
				enctype: 'multipart/form-data',
				url: "/postInputM",
				data: data,
				processData: false,
				contentType: false,
				cache: false,
				timeout: 1000 * 60 * 10,
				success: function (d) {
					button.removeClass("loading");
					button.removeClass("disabled");
					try {
						var data = JSON.parse(d);
					}catch(e) {
						console.error(d);
						return;
					}
					handleMessage(form, button, data);

					if (query._w_type == "insert" || query._w_type == "update")
						$(".sort").each(function () {
							if (this.__vue__.container == form.attr("form-key"))
								this.__vue__.sort();
						});
				},
				error: function (e) {
					
				}
			});
		}else
			$.post("/postInput",
			{
				inputKey: key,
				data: query
			},
			(d) => {
				button.removeClass("loading");
				button.removeClass("disabled");
				try {
					var data = JSON.parse(d);
				}catch(e) {
					console.error(d);
					return;
				}
				handleMessage(form, button, data);

				if (query._w_type == "insert" || query._w_type == "update")
					$(".sort").each(function () {
						if (this.__vue__.container == form.attr("form-key"))
							this.__vue__.sort();
					});
			});
	};
	
	var done = function (input, value) {
		dones--;
		query[input.attr("name")] = value;
		if (dones == 0) {
			send();
		}
	};

	var names = form.find("[name]");
	names.each(function (i) {
		dones++;
	});
	
	names.each(function (i) {
		var input = $(this);
		if (this.__vue__) {
			this.__vue__.getValue((value) => {done(input, value);});
		}else{
			query[input.attr("name")] = Websom.Input.getNativeValue(input[0]);
			dones--;

			if (dones == 0)
				send();
		}
	});
};

document.addEventListener("DOMContentLoaded", function (e) {
	$(document).on("submit", "form[form-key]", function(e) {
		e.preventDefault();
		return false;
	});

	$(document).on("click", "[data-form][data-submit]", function (e) {
		let button = $(this);
		let key = button.attr("data-form");
		let route = "default";
		let query = {};
		if (button.attr("query"))
			query = JSON.parse(button.attr("query"));

		query._w_route = "default";
		if (button.attr("data-submit") != "")
			query._w_route = button.attr("data-submit");

		if (button.is("[data-interface]"))
			query._w_type = button.attr("data-interface");

		button.addClass("disabled");
		button.addClass("loading");
		
		$.post("/postInput",
		{
			inputKey: key,
			data: query
		},
		(d) => {
			button.removeClass("disabled");
			button.removeClass("loading");
			var data = JSON.parse(d);
			handleMessage(button, button, data);
		});
	});

	$(document).on("click", "form[form-key] [data-submit]", function (e) {
		var button = $(this);
		var form = button.closest("form");

		Websom.submitForm(form, button);
	});
});