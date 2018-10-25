Websom.Editor = {
	listenForToolbox: function () {
		function dragMoveListener (event) {
			var target = $(".editor-dragging")[0],
				x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
				y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;
			var container = target.container;
			if (container && $(target).hasClass("editor-can-drop")) {
				container = $(container);
				var loc = window.getLocation(event, target, container);
				var bar = $(".editor-bar");
				if (bar.length == 0) {
					$("<div class='editor-bar'></div>").appendTo("body");
				}
				$(".editor-bar").removeClass("off");
				var hPad = container.innerHeight() - container.height();
				var top = container.offset().top + hPad/2;
				if ("splice" in loc) {
					$(container).removeClass("bar-top");
					$(container).removeClass("bar-bottom");

					top = loc.range.start + (loc.range.end - loc.range.start)/2 - 2;
				}else if (loc.append) {
					$(container).removeClass("bar-top");
					$(container).addClass("bar-bottom");
					top = container.offset().top + container.outerHeight() - hPad/2;
				}else{
					$(container).addClass("bar-top");
					$(container).removeClass("bar-bottom");
				}
				var pad = container.innerWidth() - container.width();
				if (pad == 0)
					pad = 10;
				bar.css({top: top, left: container.offset().left + pad/2, width: container.outerWidth() - pad});
			}
			if (!$(target).is(".cloned"))
				target.style.webkitTransform = target.style.transform = 'translate(' + x + 'px, ' + y + 'px)';
			target.setAttribute('data-x', x);
			target.setAttribute('data-y', y);

			$(target).css({left: event.clientX, top: event.clientY});
		}

		window.dragMoveListener = dragMoveListener;

		interact(".editor-block:not(.root-block)").draggable({
			onstart: function (e) {
				var c = $(e.target).clone();
				
				c.css("width", $(e.target).width());
				c.css("position", "absolute");
				c.addClass("editor-dragging");
				c.addClass("cloned");
				$(".builder-toolbox").addClass("dragging");
				c.appendTo(".dashboard-builder");
			},
			onmove: dragMoveListener,
			onend: function (e) {
				$(".builder-toolbox").removeClass("dragging");
				var block = $(e.target);
				block.removeClass("editor-dragging");
				block.css("transform", "none");
				block.css("width", null);
				block.attr("data-x", null);
				block.attr("data-y", null);
				delete block[0].container;
				$(".editor-bar").addClass("off");
				$(".bar-top").removeClass("bar-top");
				$(".bar-bottom").removeClass("bar-bottom");
				$(".editor-dragging").remove();
			}
		});
	},
	indent: function (num, i) { //TODO: Add spaces option
		if (typeof num == "string") {
			return num.replace(/\n(?=.*\n)/g, "\n" + this.indent(i));
		}else
			return (new Array(num + 2)).join("	");
	},
	viewParser: function (raw) {
		var open = false;
		var opens = 0;
		var name = "";
		var block = "";
		var openChar = "{";
		var closeChar = "}";
		var escape = false;
		var blocks = {};
		for (var i = 0; i < raw.length; i++) {
			var char = raw[i];
			if (open == false) {
				if (char != "	" && char != openChar && char != "\n" && char != "\\r") {
					name += char;
				} else if (char == openChar) {
					open = true;
				}
			} else {
				if (char == closeChar) {
					if (opens == 0) {
						name = name.trim();
						blocks[name] = block;
						open = false;
						name = "";
						block = "";
					} else {
						opens--;
						block += char;
					}
				} else if (char == openChar) {
					opens++;
					block += char;
				} else {
					block += char;
				}
			}
		}
		return blocks;
	}
};

window.editorIndex = 0;

function genComponent(nodeName) {
	if (!Websom.views.editor)
		Websom.views.editor = {};
	var componentName = "editor--" + nodeName;
	if (!(componentName in Websom.views.editor))
		Websom.views.editor[componentName] = Vue.component(componentName, Websom.views.loaded[nodeName].extendOptions.editor);
	return componentName;
}

Websom.Editor.Block = class {
	constructor() {
		this.attributes = {};
		this.modifiers = [];
		this.style = {};
		this.editorData = {};
		this.children = [];
		this.vue = null;
		this.id = ++window.editorIndex;
	}

	nodeName() {return "node"};

	simpleRender(nodeName, createElement, vm, drop, subView) {
		this.vue = vm;
		drop = drop || false;
		var nodes = [];
		
		for (var child of this.children)
			nodes.push(child.render(createElement, vm));

		var attrs = Object.assign({}, this.attributes);
		var opts = {
			domProps: {editorBlock: this}
		};
		if (drop)
			opts.class = " editor-container";
		
		if (nodes.length == 0 && drop)
			opts.class += " empty";

		if (this.isRoot || this.rootObject) {
			opts.class += " root-block";
		}

		if (Object.keys(this.style).length > 0) {
			var style = [];
			for (var name in this.style)
				style.push(name + ": " + this.style[name] + ";");

			attrs["style"] = style.join(" ");
		}

		if (attrs.class) {
			opts.class = attrs.class;
			if (drop)
				opts.class += " editor-container";

			delete attrs.class;
		}

		if (subView) {
			var view = Websom.views.loaded[nodeName].extendOptions;
			if (!("class" in opts))
				opts.class = "";
			if (!view.editor)
				opts.class += " editor-view";
		}

		if (this.locked) {
			if (!("class" in opts))
				opts.class = "";
			opts.class += " editor-locked";
		}

		opts.attrs = attrs;

		var props = this.props();
		if (props)
			for (var key in props) {
				var prop = props[key];
				if (prop.type == "attribute") {
					if (!(prop.name in attrs))
						attrs[prop.name] = prop.default || "";
				}
			}

		
		for (var mod of this.modifiers)
			mod.attribute(attrs);

		if (nodes.length == 0 && !this.rootObject)
			if (!subView)
				nodes.push(createElement("label", {class: "container-insert"}, [createElement("i", {class: "fa fa-edit"})]));

		var n;

		if (subView) {
			/*var v = new Websom.views.loaded[nodeName]();
			var attrs = "";
			for (var k in opts.attrs) {
				if (k != "data")
				attrs += k + "='" + opts.attrs[k] + "' ";
			}
			if (opts.class) {
				attrs += "class='" + opts.class + "'";
			}
			n = createElement(Vue.compile("<component is='" + nodeName + "' " + attrs + " :data='{}' :editMode='false'/>"));*/
			var view = Websom.views.loaded[nodeName].extendOptions;
			if (view.editor) {
				if (!Websom.views.editor)
					Websom.views.editor = {};
				
				if (!("editor-slot" in Websom.views.editor))
					Websom.views.editor["editor-slot"] = Vue.component("editor-slot", {
						props: ["slot"],
						render: function (createElement) {
							this.slot.locked = true;
							return this.slot.render(createElement);
						}
					});

				var componentName = genComponent(nodeName);
				if (!this.editorComponent)
					this.editorComponent = new Websom.views.editor[componentName]();

				n = createElement(this.editorComponent.$options, opts, [], this.editorData);
				setTimeout(() => { //Hack
					if (this.editorComponent.$vnode) {
						for (var dKey in this.editorComponent.$options.data())
							n.child[dKey] = this.editorComponent.$vnode.child[dKey];
					}
					this.editorComponent.$vnode = n;
				});
			}else{
				n = createElement(nodeName, opts, nodes);
			}
		}else
			n = createElement(nodeName, opts, nodes);
		
		return n;
	}

	props() {
		
	}

	addChild(child, append) {
		child.parent = this;

		if (append === true)
			this.children.push(child);
		else if (append === false)
			this.children.unshift(child);
		else
			this.children.splice(append + 1, 0, child);
		
		if (this.vue)
			this.vue.$forceUpdate();
	}

	loadChildren(xml) {
		for (var child of xml) {
			if (child.nodeName == "#text")
				if ((/^[\t\s\n]*$/g).test(child.wholeText))
					continue;
			
			var b = Websom.Editor.loadBlock(child);
			b.parent = this;
			this.children.push(b);
		}
	}

	render(createElement, vm) {

	}

	serialize(root) {
		return this.simpleSerialize(root, this.nodeName());
	}

	simpleSerialize(root, elemName) {
		var children = "";
		var indents = Websom.Editor.indent(root);
		var nl = "\n" + indents;
		if (this.children.length == 0)
			nl = "";

		for (var child of this.children) {
			children += "\n" + child.serialize(root + 1);
		}
		
		var attrs = "";
		for (var attr in this.attributes) {
			attrs += " " + attr + "=\"" + this.attributes[attr] + "\""; //TODO: Escape "
		}

		return indents + `<${elemName}${attrs}>${children}${nl}</${elemName}>`
	}

	deserialize(xml) {
		if (this.elemName in Websom.views.loaded) {
			if (Websom.views.loaded[this.elemName].extendOptions.editor) {
				var componentName = genComponent(this.elemName);
				if (!this.editorComponent)
					this.editorComponent = new Websom.views.editor[componentName]();
				this.editorComponent.$vnode = {child: Websom.views.editor[componentName].extendOptions.data()};
				Websom.views.editor[componentName].extendOptions.methods.deserialize.call(this.editorComponent.$vnode.child, xml);
			}
		}

		this.loadChildren(xml.childNodes);

		if (xml.attributes)
		for (var i = 0; i < xml.attributes.length; i++) {
			var attr = xml.attributes[i];
			this.attributes[attr.name] = attr.value;
		}
	}
};

function genClass(node, group, icon, desc) {
	return class extends Websom.Editor.Block {
		isContainer() {return true;}
		nodeName() {return node;}
		static display() {return node};
		static description() {return desc};
		static group() {return group};
		static displayIcon() {return icon;}

		render(createElement, vm) {
			var has = null;
			this.elemName = node;
			if (node in Websom.views.loaded)
				has = true;
			return super.simpleRender(node, createElement, vm, true, has);
		}

		props() {
			return {
				
			};
		}

		deserialize(xml) {
			this.elemName = node;
			super.deserialize(xml);
		}
	};
}

$(document).on("blur", "p.text-editor", function (e) {
	this.textBlock.text = this.innerHTML;
});

Websom.Editor.Blocks = {
	"#text": class extends Websom.Editor.Block {
		nodeName() {
			return "#text";
		}
		static displayIcon() {return "text";}

		constructor() {
			super();

			this.text = "";
		}

		render(createElement, vm) {
			return createElement("p", {attrs: {contenteditable: true}, domProps: {textBlock: this}, class: "text-editor"}, [this.text]);
		}

		deserialize(xml) {
			this.text = xml.wholeText;
		}

		serialize(root) {
			return Websom.Editor.indent(root) +  this.text;
		}
	},
	"#comment": class extends Websom.Editor.Block {
		nodeName() {
			return "#comment";
		}

		constructor() {
			super();

			this.text = "";
		}

		render(createElement, vm) {
			
		}

		deserialize(xml) {
			this.text = xml.wholeText;
		}

		serialize(root) {
			return Websom.Editor.indent(root) + "<!--" + this.text + "-->";
		}
	},
	"img": class extends Websom.Editor.Block {
		nodeName() {return "img";}
		static display() {return "🖼️"};
		static displayIcon() {return "image";}
		static description() {return "image display painting picture"};
		static group() {return "Blocks"};

		render(createElement, vm) {
			return super.simpleRender("img", createElement, vm, false);
		}

		props() {
			return {
				"Image url": {
					type: "attribute",
					name: "src",
					valueType: "text",
					default: "http://via.placeholder.com/350x150"
				}
			};
		}
	},
	"p": class extends Websom.Editor.Block {
		nodeName() {return "p";}
		static display() {return "¶"};
		static displayIcon() {return "paragraph";}
		static description() {return "paragraph block text"};
		static group() {return "Blocks"};

		constructor() {
			super();

			this.text = "";
		}

		render(createElement, vm) {
			return createElement("p", {attrs: {contenteditable: true}, domProps: {textBlock: this, innerHTML: this.text}, class: "text-editor"});
		}

		props() {
			return {
				"Content": {
					type: "custom",
					update: function (block, elem) {
						if (block.children.length == 0)
							block.addChild(new Websom.Editor.Blocks["#text"](), true);

						block.children[0].text = elem.value;
					},
					fill: function (block) {
						if (block.children.length == 0)	return "";
						return block.children[0].text;
					},
					valueType: "textarea"
				}
			};
		}
	},
	"div": class extends Websom.Editor.Block {
		isContainer() {return true;}
		nodeName() {return "div";}
		static display() {return "div"};
		static description() {return "divider block container"};
		static group() {return "Blocks"};
		static displayIcon() {return "object-group";}

		render(createElement, vm) {
			return super.simpleRender("div", createElement, vm, true);
		}

		props() {
			return {
				
			};
		}
	},
	"card": class extends Websom.Editor.Block {
		isContainer() {return true;}
		nodeName() {return "card";}
		static display() {return "card"};
		static description() {return "card block container panel"};
		static group() {return "Blocks"};
		static displayIcon() {return "square";}

		render(createElement, vm) {
			return super.simpleRender("card", createElement, vm, true);
		}

		props() {
			return {
				
			};
		}
	},
	"button": class extends Websom.Editor.Block {
		isContainer() {return true;}
		nodeName() {return "button";}
		static display() {return "button"};
		static description() {return "button push interact click"};
		static group() {return "Input"};
		static displayIcon() {return "mouse-pointer";}

		render(createElement, vm) {
			return super.simpleRender("button", createElement, vm, true);
		}

		props() {
			return {
				
			};
		}
	},
	accordion: genClass("accordion", "Interactive", "bars", "list fold expand expandable click show spoiler"),
	tabs: genClass("tabs", "Interactive", "window-maximize", "tabs expand expandable click show spoiler switch")
};

Websom.Editor.ValueTypes = {
	text: {
		listen: function (elem, change) {
			elem.onchange = change;
		},
		create: function (opts, val) {
			return "<input class='editor-input' value='" + val + "' placeholder='" + (opts.placeholder || "") + "'></input>"; //Warn needs ' escape
		},
		get: function (elem) {
			return elem.value;
		}
	},
	textarea: {
		listen: function (elem, change) {
			elem.onchange = change;
		},
		create: function (opts, val) {
			return "<textarea class='editor-input' placeholder='" + (opts.placeholder || "") + "'>" + val + "</textarea>"; //Warn needs ' escape
		},
		get: function (elem) {
			return elem.value;
		}
	}
};

Websom.Editor.DynamicBlock = class extends Websom.Editor.Block {
	constructor(name) {
		super();
		this.elemName = name;
		this.rawSlot = "";
	}

	nodeName() {
		return this.elemName;
	}

	render(createElement, vm) {
		var has = null;
		if (this.elemName in Websom.views.loaded)
			has = true;
		return super.simpleRender(this.elemName, createElement, vm, true, has);
	}

	serialize(root) {
		return super.simpleSerialize(root, this.elemName);
	}

	deserialize(xml) {
		super.deserialize(xml);
	}
};

Websom.Editor.parseBlock = function (raw) {
	var parser = new DOMParser();
	var p = parser.parseFromString(raw, "text/html").children[0].children[1].children[0];
	return p;
};

Websom.Editor.loadBlock = function (xml) {
	for (var b in Websom.Editor.Blocks) {
		var block = Websom.Editor.Blocks[b];
		if (block.prototype.nodeName() == xml.nodeName.toLowerCase()) {
			var rtn = new block();
			rtn.deserialize(xml);
			return rtn;
		}
	}

	var rtn = new Websom.Editor.DynamicBlock(xml.nodeName.toLowerCase());
	rtn.deserialize(xml);
	return rtn;
};