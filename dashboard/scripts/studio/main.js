Websom.Studio = function () {
	this.name = "Studio";
	this.root = null;
};

Websom.Studio.prototype.setup = function (elem) {
	var that = this;
	$("body").addClass("studio");
	$("<link rel='stylesheet' href='https://golden-layout.com/files/latest/css/goldenlayout-base.css' />").appendTo("body");
	//$("<link rel='stylesheet' href='https://golden-layout.com/files/latest/css/goldenlayout-dark-theme.css' />").appendTo("body");
	$.getScript("https://golden-layout.com/files/latest/js/goldenlayout.min.js", function () {
		$.getScript("https://cdn.jsdelivr.net/npm/interactjs@1.3.3/dist/interact.min.js", function () {
			console.log("Loaded");
			that.layout();
		});
	});
	this.root = elem;
};

Websom.Studio.prototype.open = function (file) {
	var welcome = layout.root.contentItems[0].contentItems[0].contentItems[0].contentItems[1];
	welcome.addChild({
		"type": "component",
		"componentName": "vue",
		"componentState": {
			"component": "view-editor",
			"title": "View editor " + file,
			"file": file
		}
	});
	var inner = $(welcome.contentItems[welcome.contentItems.length - 1].element);
	console.log(inner);
	inner.children(".lm_content").addClass("editor-check");
};

Websom.Studio.prototype.layout = function () {
	var that = this;
	var base = {
		el: "",
		data: {

		}
	};
	
	var config = {
		content: [
			{
				"type": "row",
				"height": 100,
				"content": [
					{
						"type": "column",
						"width": 80,
						"content": [
							{
								"type": "row",
								"height": 70,
								"content": [
									{
										"type": "stack",
										"width": 15,
										"content": [
											{
												"type": "component",
												"componentName": "vue",
												"componentState": {
													"component": "view-toolbox",
													"title": "Toolbox"
												},
												"isClosable": false
											}
										]
									},
									{
										"type": "stack",
										"header": {},
										"isClosable": true,
										"reorderEnabled": true,
										"title": "",
										"activeItemIndex": 0,
										"width": 85,
										"height": 50,
										"content": [
											{
												"type": "component",
												"componentName": "welcome",
												"componentState": {}
											}
										]
									}
								]
							},
							{
								"type": "stack",
								"height": 25,
								"content": [
									{
										"type": "component",
										"componentName": "vue",
										"componentState": {
											"component": "dashboard-studio-explorer",
											"title": "Files"
										}
									}
								]
							}
						]
					},
					{
						"type": "column",
						"width": 18,
						"content": [
							{
								"type": "stack",
								"width": 17,
								"height": 60,
								"content": [
									{
										"type": "component",
										"componentName": "vue",
										"componentState": {
											"component": "view-properties",
											"title": "Properties"
										}
									}
								]
							},
							{
								"type": "stack",
								"height": 35,
								"content": [
									{
										"type": "component",
										"componentName": "vue",
										"componentState": {
											"component": "stats",
											"title": "Tools"
										}
									}
								]
							}
						]
					}
				]
			}
		]
	};

	var layout = new GoldenLayout(config);

	layout.registerComponent("welcome", function (container, state) {
		container.getElement().html("<div class='card'><h3>Welcome to the Websom Studio</h3><ul><li><a href='#'>Getting started</a></li></ul></div>");
	});
	var vues = 0;
	layout.registerComponent("vue", function (container, state) {
		var index = vues;
		vues++;
		const html = `<div id="${state.component + index}"><${state.component} :studio='studio' :state='state'></${state.component}></div>`;
		container.getElement().html(html);
		if (state.title)
			container.setTitle(state.title);
			
		setTimeout(() => {
			base.el = "#" + state.component + index;
			new Vue(Object.assign({}, base, {data: {studio: that, state: state}}));
		});
	});

	layout.init();

	window.layout = layout;

	window.addEventListener("resize", () => {
		layout.updateSize();
	});

	this.layout = layout;
	this.selected = false;

	document.onkeydown = function (e) {
		if (e.keyCode == 83)
			if (e.ctrlKey) {
				e.preventDefault();
				var editors = layout.root.contentItems[0].contentItems[0].contentItems[0].contentItems[1].contentItems;
				for (var editor of editors) {
					if (editor.tab.isActive) {
						if (editor.config.componentState.component == "view-editor") {
							var root = $($(editor.element.children()[0]).children()[0]).children()[0].editorBlock;
							console.log(root.serialize(0));
						}
					}
				}
			}
	};
};