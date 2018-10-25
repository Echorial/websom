Websom.Designer = {
	triggers: {},
	actions: {},
	registerTrigger: (name, trigger) => {
		Websom.Designer.triggers[name] = trigger;
	},
	registerAction: (name, action) => {
		Websom.Designer.actions[name] = action;
	}
};

Websom.Designer.registerTrigger("click", {
	name: "Click",
	props: {
		double: {
			type: "attribute",
			valueType: "boolean",
			name: "Double click",
			default: false
		},
		button: {
			type: "attribute",
			valueType: "number",
			name: "Button",
			default: 0,
			combo: {"Left": 0, "Middle": 1, "Right": 2}
		}
	},
	trigger: function (props) {
		let button = ({0: "left", 1: "middle", 2: "right"})[props.button];
		if (props.double)
			return {type: "attribute", name: "@dblclick." + button};
		
		return {type: "attribute", name: "@click." + button};
	}
});

Websom.Designer.registerTrigger("timeout-after-click", {
	name: "Click timeout",
	trigger: function () {
		return {
			type: "script",
			source: `$el.onclick = function () {setTimeout(() => {$trigger()}, 1000)};`
		}
	}
});

Websom.Designer.registerAction("open", {
	name: "Open",
	props: {
		cls: {
			type: "attribute",
			valueType: "string",
			name: "Class",
			default: ""
		},
	},
	action: function () {
		return `$el.classList.add('open')`;
	}
});

Websom.Designer.registerAction("alert", {
	name: "Alert",
	props: {
		message: {
			type: "attribute",
			valueType: "string",
			name: "Message",
			default: ""
		},
	},
	action: function (props) {
		return `alert(${JSON.stringify(props.message)})`;
	}
});

Websom.Designer.registerAction("toast", {
	name: "Toast",
	props: {
		message: {
			type: "attribute",
			valueType: "string",
			name: "Message",
			default: ""
		},
	},
	action: function (props) {
		return `Websom.Theme.toast(${JSON.stringify(props.message)})`;
	}
});

Websom.Designer.loadBlock = (xml, parent, pView) => {
	let name = xml.nodeName.toLowerCase();
	let block;

	if (name == "div") {
		if (xml.classList.contains("design-rect")) {
			block = new Websom.Designer.Rectangle(parent, "");
		}else if (xml.classList.contains("design-circle")) {
			block = new Websom.Designer.Circle(parent, "");
		}else if (xml.classList.contains("design-group")) {
			block = new Websom.Designer.Group(parent, "");
		}else{
			block = new Websom.Designer.Root(parent, "");
		}
	}else if (name == "p") {
		block = new Websom.Designer.Text(parent, "");
	}else{
		block = new Websom.Designer.Blocks[name](parent, "");
	}
	
	block.parentView = pView || block.parentView;

	block.deserialize(xml);

	return block;
};

Websom.Designer.Object = class DesignerObject {
	constructor(parent, name) {
		this.parent = parent;
		this.name = name;
		this.attr = {};

		this.xMode = "%";
		this.yMode = "%";
		this.widthMode = "%";
		this.heightMode = "%";

		this.isSelected = false;

		this.rotation = 0;
		
		let d = this.constructor.defaultSize ? this.constructor.defaultSize() : [0, 0];
		
		this.desktop = {x: 0, y: 0, width: d[0], height: d[1], set: false};
		this.mobile = {x: 0, y: 0, width: d[0], height: d[1], set: false,};
		this.tablet = {x: 0, y: 0, width: d[0], height: d[1], set: false};

		this.opacity = 1;
		this.position = "absolute";
		this.color = {r: 255, g: 255, b: 255, a: 1};
		this.borderColor = {r: 0, g: 0, b: 0, a: 1};
		this.borderWidth = 1;
		this.borderStyle = "solid";

		this.borderPosition = "inset";

		this.scrollOverflow = false;
		this.hideOverflow = false;

		this.displayColor = true;
		this.displayBorder = true;

		this.displayShadow = false;
		this.shadowColor = {r: 0, g: 0, b: 0, a: .3};
		this.shadowBlur = 10;
		this.shadowX = 0;
		this.shadowY = 3;

		this.parentView = parent ? parent.parentView : null;

		this.innerText = "";

		this.useMaxSize = false;

		this.borderRadius = 0;
		this.children = [];
		this.element = "element";
		this.z = 0;

		this.templateView = null;
		this.placeMode = false;

		this.triggers = [];

		if (this.props) {
			let props = this.props();
			for (let display in props) {
				let prop = props[display];
				if (prop.type == "attribute") {
					this.attr[prop.name] = prop.default;
				}else if (prop.type == "computed") {
					this.attr["data-prop-" + prop.name] = prop.default;
					prop.execute.call(this, prop.default);
				}
			}
		}
	}

	props() {
		return [];
	}

	computeProp(name) {
		let props = this.props();
		for (let p in props) {
			if (props[p].name == name) {
				props[p].execute.call(this, this.attr["data-prop-" + name]);
			}
		}
	}

	remove() {
		if (this.parent)
			return this.parent.removeChild(this);
		else
			return false;
	}

	removeChild(child) {
		for (let i = 0; i < this.children.length; i++) {
			if (this.children[i].objectId == child.objectId) {
				this.children.splice(i, 1);
				child.parent = null;
				return true;
			}
		}

		return false;
	}

	setProp(prop, val) {
		let md = this.getTopParent().mode;
		this[md].set = true;

		this[md][prop] = val;

		if (md == "desktop") {
			if (!this["mobile"].set) {
				let setVal = val;
				if (prop == "x" || prop == "width")
					setVal = (val / 1920) * 360;
				else if (prop == "y" || prop == "height")
					setVal = (val / 1080) * 720;

				this["mobile"][prop] = setVal;
			}
			
			if (!this["tablet"].set) {
				let setVal = val;
				if (prop == "x" || prop == "width")
					setVal = (val / 1920) * 1080;
				else if (prop == "y" || prop == "height")
					setVal = (val / 1080) * 720;

				this["tablet"][prop] = setVal;
			}
		}
	}

	set x(val) {
		this.setProp("x", val);
	}

	get x() {
		return this[this.getTopParent().mode].x;
	}

	set y(val) {
		this.setProp("y", val);
	}

	get y() {
		return this[this.getTopParent().mode].y;
	}

	set width(val) {
		this.setProp("width", val);
	}

	get width() {
		return this[this.getTopParent().mode].width;
	}

	set height(val) {
		this.setProp("height", val);
	}

	get height() {
		return this[this.getTopParent().mode].height;
	}

	setAll(prop, v) {
		if (this.getTopParent().mode == "desktop") {
			this.setProp(prop, v);
		}else{
			this.desktop[prop] = v;
			this.mobile[prop] = v;
			this.tablet[prop] = v;
		}
	}

	setAllX(v) {
		this.setAll("x", v);
	}

	setAllY(v) {
		this.setAll("y", v);
	}
	
	setAllWidth(v) {
		this.setAll("width", v);
	}

	setAllHeight(v) {
		this.setAll("height", v);
	}

	setX(v) {
		this.x = Math.round(v);
	}

	setY(v) {
		this.y = Math.round(v);
	}

	setWidth(v) {
		this.width = Math.round(v);
	}

	setHeight(v) {
		this.height = Math.round(v);
	}

	getTopParent() {
		if (this.parent && this.parent.getTopParent)
			return this.parent.getTopParent();
		else if (this.parent)
			return this.parent;
		else
			return this;
	}

	getIcon() {
		return "project-diagram";
	}

	addClass() {
		return "";
	}

	getParentSize(mode) {
		if (this.parent) {
			if (this.parent.isRoot) {
				return {width: this.parentView.sizes[mode].width, height: this.parentView.sizes[mode].height};
			}else
				return {width: this.parent[mode].width, height: this.parent[mode].height};
		}else
			return {width: this.parentView.sizes[mode].width, height: this.parentView.sizes[mode].height};
	}

	buildAttrs() {
		if (this.container)
			return {};

		let copy = JSON.parse(JSON.stringify(this.attr));
		let parentSize = this.getParentSize("desktop");

		let top = this.y / (this.yMode == "%" ? parentSize.height : 1);
		let left = this.x / (this.xMode == "%" ? parentSize.width : 1);
		let width = this.width / (this.widthMode == "%" ? parentSize.width : 1);
		let height = this.height / (this.heightMode == "%" ? parentSize.height : 1);
		let tp = this.getTopParent();
		
		let xMul = 100;
		let yMul = 100;
		let wMul = 100;
		let hMul = 100;
		if (this.xMode == "px")
			xMul = 1;
		if (this.yMode == "px")
			yMul = 1;
		if (this.widthMode == "px")
			wMul = 1;
		if (this.heightMode == "px")
			hMul = 1;

		if (tp.mode == "mobile") {
			let ps = this.getParentSize("mobile");
			top = this.mobile.y / (this.yMode == "%" ? ps.height : 1);
			left = this.mobile.x / (this.xMode == "%" ? ps.width : 1);
			width = this.mobile.width / (this.widthMode == "%" ? ps.width : 1);
			height = this.mobile.height / (this.heightMode == "%" ? ps.height : 1);
		}else if (tp.mode == "tablet") {
			let ps = this.getParentSize("tablet");
			top = this.tablet.y / (this.yMode == "%" ? ps.height : 1);
			left = this.tablet.x / (this.xMode == "%" ? ps.width : 1);
			width = this.tablet.width / (this.widthMode == "%" ? ps.width : 1);
			height = this.tablet.height / (this.heightMode == "%" ? ps.height : 1);
		}

		let size = "";
		if (this.borderPosition == "inset") {
			/*top = top + this.borderWidth/2;
			left = left + this.borderWidth/2;*/
		}
		let wText = "width";
		let hText = "height";
		if (this.useMaxSize) {
			wText = "max-width";
			hText = "max-height";
		}

		if (this.position == "relative") {
			top = top + "%";
			left = left + "%";
			size = "position: relative; " + wText + ": " + width + "; " + hText + ": " + height + ";";
		}else if (this.position == "absolute") {
			top = (top * yMul) + this.yMode;
			left = (left * xMul) + this.xMode;
			let offsetX = this.borderWidth*2;
			let offsetY = this.borderWidth*2;
			if (!this.displayBorder)
				offsetX = offsetY = 0;
			size = "position: absolute; " + wText + ": calc(" + (width * wMul) + this.widthMode + " - " + offsetX + "px); " + hText + ": calc(" + (height * hMul) + this.heightMode + " - " + offsetY + "px);";
		}else if (this.position == "shift") {
			top = 0;
			left = 0;
		}

		if (copy.class) {
			copy.class += this.constructor.addClass() + " designer-object ";
		}else{
			copy.class = this.constructor.addClass() + " designer-object ";
		}

		let border = "";
		if (this.displayBorder) {
			border = "border: " + this.toColor(this.borderColor) + " " + this.borderWidth + "px " + this.borderStyle + ";";
		}

		let fill = "";
		if (this.displayColor) {
			fill = "background: " + this.toColor(this.color) + ";";

			if (this.text)
				fill = "color: " + this.toColor(this.color) + ";";
		}

		let shadow = "";
		if (this.displayShadow) {
			shadow = "box-shadow: " + this.toColor(this.shadowColor) + " " + this.shadowX + "px " + this.shadowY + "px " + this.shadowBlur + "px;";
		}

		let style = fill + " " + border + " " + shadow + " top: " + top + "; left: " + left + "; " + size;

		if (this.scrollOverflow) {
			style += "overflow: auto;";
		}else if (this.hideOverflow) {
			style += "overflow: hidden;";
		}
		
		if (this.style)
			style += this.style();

		if (this.placeMode) {
			style += " opacity: .3; pointer-events: none; ";
		}

		if (this.rotation != 0) {
			style += "transform: rotate(" + this.rotation + "deg)";
		}

		if (copy.style) {
			copy.style = style + copy.style;
		}else{
			copy.style = style;
		}

		copy["data-object-id"] = this.objectId;

		return copy;
	}

	toColor(rgb) {
		if (rgb.a == 1) {
			let r = ("0" + Math.floor(rgb.r).toString(16)).slice(-2);
			let g = ("0" + Math.floor(rgb.g).toString(16)).slice(-2);
			let b = ("0" + Math.floor(rgb.b).toString(16)).slice(-2);
			return "#" + r + g + b;
		}else{
			return `rgba(${Math.floor(rgb.r)},${Math.floor(rgb.g)},${Math.floor(rgb.b)},${rgb.a})`;
		}
	}

	render(createElement, vm) {
		let fresh = this.buildAttrs();

		let child = [];
		for (let c of this.children) {
			child.push(c.render(createElement, vm));
		}

		return createElement(this.constructor.nodeName(), {attrs: fresh}, child);
	}

	static defaultSize() {
		return [350, 350];
	}

	static addClass() {
		return " designer-object ";
	}

	serialize(root) {
		return this.simpleSerialize(root || 0, this.constructor.nodeName());
	}

	simpleSerialize(root, elemName, txt) {
		var children = "";
		var indents = Websom.Editor.indent(root);
		var nl = "\n" + indents;
		if (this.children.length == 0)
			nl = "";

		for (var child of this.children) {
			children += "\n" + child.serialize(root + 1);
		}

		if (this.innerText.length > 0)
			children += this.innerText;
		
		var attrs = "";
		let att = this.buildAttrs();

		for (let i = 0; i < this.triggers.length; i++) {
			let trig = this.triggers[i];
			let t = Websom.Designer.triggers[trig.__type__];
			let out = t.trigger.call(this, trig);
			if (out.type == "attribute") {
				att[out.name] = "callAction(" + this.objectId + ", " + i + ", $event)";
			}else if (out.type == "script") {

			}
		}

		if (this.triggers.length > 0)
			attrs += " ref='object-id-" + this.objectId + "' data-triggers='" + JSON.stringify(this.triggers) + "'";

		let offsetX = this.borderWidth*2;
		let offsetY = this.borderWidth*2;

		if (!this.displayBorder) {
			offsetX = offsetY = 0;
		}

		let xMul = 100;
		let yMul = 100;
		let wMul = 100;
		let hMul = 100;
		if (this.xMode == "px")
			xMul = 1;
		if (this.yMode == "px")
			yMul = 1;
		if (this.widthMode == "px")
			wMul = 1;
		if (this.heightMode == "px")
			hMul = 1;
		
		let psm = this.getParentSize("mobile");
		let pst = this.getParentSize("tablet");
		att["data-mobile-style"] = `top: ${(this.mobile.y / (this.yMode == "%" ? psm.height : 1)) * yMul}${this.yMode}; left: ${(this.mobile.x / (this.xMode == "%" ? psm.width : 1)) * xMul}${this.xMode}; width: calc(${(this.mobile.width / (this.widthMode == "%" ? psm.width : 1)) * wMul}${this.widthMode} - ${offsetX}px); height: calc(${(this.mobile.height / (this.heightMode == "%" ? psm.height : 1)) * hMul}${this.heightMode} - ${offsetY}px);`;
		att["data-tablet-style"] = `top: ${(this.tablet.y / (this.yMode == "%" ? pst.height : 1)) * yMul}${this.yMode}; left: ${(this.tablet.x / (this.xMode == "%" ? pst.width : 1)) * xMul}${this.xMode}; width: calc(${(this.tablet.width / (this.widthMode == "%" ? pst.width : 1)) * wMul}${this.widthMode} - ${offsetX}px); height: calc(${(this.tablet.height / (this.heightMode == "%" ? pst.height : 1)) * hMul}${this.heightMode} - ${offsetY}px);`;

		att["data-mobile-set"] = this.mobile.set;
		att["data-tablet-set"] = this.tablet.set;

		att["data-name"] = this.name;
		
		for (var attr in att) {
			attrs += " " + attr + "=" + JSON.stringify(att[attr] ? att[attr].toString() : "");
		}

		if (this.isRoot) {
			attrs = ' style="position: absolute; width: 100%; height: ' + this.parentView.sizes.desktop.height + 'px" data-mobile-style="position: absolute; width: 100%; height: ' + this.parentView.sizes.mobile.height + 'px" data-tablet-style="position: absolute; width: 100%; height: ' + this.parentView.sizes.tablet.height + 'px"';
		}
		
		return indents + `<${elemName}${attrs}>${children}${nl}${txt || ""}</${elemName}>`
	}

	getParentX() {
		if (this.parent)
			return this.parent.x;
		else
			return 0;
	}

	getParentY() {
		if (this.parent)
			return this.parent.y;
		else
			return 0;
	}

	getScreenX() {
		if (this.parent) {
			return this.parent.getScreenX() + this.x;
		}

		return this.x || 0;
	}

	getScreenY() {
		if (this.parent) {
			return this.parent.getScreenY() + this.y;
		}

		return this.y || 0;
	}

	loadChildren(nodes) {
		for (let node of nodes) {
			if (node.nodeName != "#text" && node.nodeName != "#comment")
				this.children.push(Websom.Designer.loadBlock(node, this));
			else if (node.nodeName == "#text") {
				this.innerText += node.textContent.trim();
			}
		}
	}

	parseStyle(style) {
		let parts = style.split(';');
		let out = {};
		for (let i = 0; i < parts.length; i++) {
			let s = parts[i].split(':');
			if (s.length == 2) {
				let name = s[0].trim();
				let val = s[1].trim();
				out[name] = val;
			}
		}

		return out;
	}

	setStyle(mode, x, y, parsed) {
		if (parsed.position) {
			this.position = parsed.position;
		}

		if (parsed["max-width"])
			parsed.width = parsed["max-width"];

		if (parsed["max-height"])
			parsed.height = parsed["max-height"];

		if (parsed.transform) {
			let rot = /rotate\(([0-9.-]*)[^)]*\)/.exec(parsed.transform);
			if (rot) {
				this.rotation = parseFloat(rot[1]);
			}
		}

		if (parsed.overflow) {
			this.scrollOverflow = parsed.overflow == "auto";
			this.hideOverflow = parsed.overflow == "hidden";
		}

		if (parsed.background) {
			this.displayColor = true;
			this.color = this.colorFromString(parsed.background);
		}else if (mode == "desktop") {
			this.displayColor = false;
		}

		if (parsed.border) {
			this.displayBorder = true;
			let splits = parsed.border.split(" ");
			this.borderColor = this.colorFromString(splits[0]);
			this.borderWidth = parseFloat(splits[1]);
			this.borderStyle = splits[2];
		}else if (mode == "desktop") {
			this.displayBorder = false;
		}

		if (parsed["box-shadow"]) {
			this.displayShadow = true;
			let splits = parsed["box-shadow"].split(" ");
			this.shadowColor = this.colorFromString(splits[0]);
			this.shadowX = parseFloat(splits[1]);
			this.shadowX = parseFloat(splits[2]);
			this.shadowBlur = parseFloat(splits[3]);
		}else if (mode == "desktop") {
			this.displayShadow = false;
		}

		if (parsed.left) {
			this.xMode = parsed.left.substr(-1);
			if (this.xMode == "x") this.xMode = "px";
			let div = 1;
			if (this.xMode == "%")
				div = 100;
			

			this[mode].x = (parseFloat(parsed.left.substr(0, parsed.left.length - 1)) / div) * (this.xMode == "%" ? x : 1);
			
		}

		if (parsed.top) {
			this.yMode = parsed.top.substr(-1);
			let div = 1;
			if (this.yMode == "x") this.yMode = "px";
			if (this.yMode == "%")
				div = 100;
			this[mode].y = (parseFloat(parsed.top.substr(0, parsed.top.length - 1)) / div) * (this.yMode == "%" ? y : 1);
		}

		let reg = /calc\(\s*([^ ]*)/;
		
		if (parsed.width) {
			let p = reg.exec(parsed.width);
			let str = parsed.width.substr(0, parsed.width.length - 1);
			if (p != null)
			str = p[1];
			
			this.widthMode = str.substr(-1);
			if (this.widthMode == "x") this.widthMode = "px";
			let div = 1;
			if (this.widthMode == "%")
				div = 100;
			
			this[mode].width = (parseFloat(str) / div) * (this.widthMode == "%" ? x : 1);
		}

		if (parsed.height) {
			let p = reg.exec(parsed.height);
			let str = parsed.height.substr(0, parsed.height.length - 1);
			if (p != null)
			str = p[1];
			
			this.heightMode = str.substr(-1);
			if (this.heightMode == "x") this.heightMode = "px";
			let div = 1;
			if (this.heightMode == "%")
				div = 100;
			
			this[mode].height = (parseFloat(str) / div) * (this.heightMode == "%" ? y : 1);
		}
	}

	deserialize(xml) {
		this.loadChildren(xml.childNodes);

		let attr = {};
		if (xml.attributes)
		for (var i = 0; i < xml.attributes.length; i++) {
			var a = xml.attributes[i];
			attr[a.name] = a.value;
		}

		if (attr["data-triggers"])
			this.triggers = JSON.parse(attr["data-triggers"]);

		if (attr["data-object-id"])
			this.objectId = parseInt(attr["data-object-id"]);

		if (attr["data-name"])
			this.name = attr["data-name"];
		else
			this.name = "Untitled";
		
		if (attr.style) {
			this.setStyle("desktop", 1920/1, 1080/1, this.parseStyle(attr.style));
		}

		if (attr["data-tablet-style"]) {
			this.setStyle("tablet", 1080/1, 720/1, this.parseStyle(attr["data-tablet-style"]));
		}

		if (attr["data-mobile-style"]) {
			this.setStyle("mobile", 360/1, 720/1, this.parseStyle(attr["data-mobile-style"]));
		}

		if (attr["data-mobile-set"]) {
			this.mobile.set = attr["data-mobile-set"] == "true";
		}

		if (attr["data-tablet-set"]) {
			this.tablet.set = attr["data-tablet-set"] == "true";
		}

		if (this.props) {
			let props = this.props();
			for (let name in props) {
				let prop = props[name];
				if (prop.type == "attribute") {
					if (prop.valueType == "string") {
						this.attr[prop.name] = attr[prop.name];
					}
				}else if (prop.type == "computed") {
					prop.deserialize.call(this, xml);
				}
			}
		}
	}

	colorFromString(hex) {
		let rgba = /rgba\(([^)]*)\)/.exec(hex);
		if (rgba) {
			let split = rgba[1].split(",");
			return {r: parseInt(split[0].trim()), g: parseInt(split[1].trim()), b: parseInt(split[2].trim()), a: parseFloat(split[3].trim())}
		}

		let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})?$/i.exec(hex);
		return result ? {
			r: parseInt(result[1], 16),
			g: parseInt(result[2], 16),
			b: parseInt(result[3], 16),
			a: parseInt(result[4] || "ff", 16) / 255
		} : {r: 255, g: 255, b: 255};
	}

	simpleRender(nodeName, createElement, vm, drop, subView) {
		this.vue = vm;
		drop = drop || false;
		var nodes = [];
		
		for (var child of this.children)
			nodes.push(child.render(createElement, vm));

		if (this.innerText.length > 0)
			nodes.push(this.innerText);

		let attrs = this.buildAttrs();

		if (subView) {
			var view = Websom.views.loaded[nodeName].extendOptions;
		}

		var opts = {};

		opts.attrs = attrs;

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
};


Websom.Designer.Blocks = {
	"img": class extends Websom.Designer.Object {
		nodeName() {return "img";}
		static nodeName() {return "img";}
		static display() {return "🖼️"};
		static displayIcon() {return "image";}
		static description() {return "image display painting picture"};
		static group() {return "Blocks"};

		render(createElement, vm) {
			return super.simpleRender("img", createElement, vm, false);
		}

		static defaultSize() {
			return [350, 150];
		}

		props() {
			return {
				"Image url": {
					type: "attribute",
					name: "src",
					valueType: "string",
					default: "http://via.placeholder.com/350x150"
				},
				"Draggable": {
					type: "attribute",
					name: "draggable",
					valueType: "boolean",
					default: false
				},
				"Stretch": {
					type: "computed",
					name: "stretch",
					execute: function(val) {
						this.useMaxSize = !val;
					},
					deserialize: (xml) => {
						return xml.attributes.style.value.includes("max-width");
					},
					valueType: "boolean",
					default: false
				}
			};
		}
	},
	"card": class extends Websom.Designer.Object {
		isContainer() {return true;}
		nodeName() {return "div";}
		static nodeName() {return "div";}
		static display() {return "card"};
		static description() {return "card block container panel"};
		static group() {return "Blocks"};
		static displayIcon() {return "square";}

		style() {
			return "padding: 0; margin: 0;";
		}

		static addClass() {return " card ";}

		spawn() {
			this.displayBorder = false;
			this.displayColor = false;
		}

		render(createElement, vm) {
			return super.simpleRender("card", createElement, vm, true);
		}

		props() {
			return {
				
			};
		}
	},
	"button": class extends Websom.Designer.Object {
		isContainer() {return true;}
		nodeName() {return "button";}
		static nodeName() {return "button";}
		static display() {return "button"};
		static description() {return "button push interact click"};
		static group() {return "Input"};
		static displayIcon() {return "mouse-pointer";}

		static addClass() {return " button ";}

		static defaultSize() {
			return [100, 40];
		}

		spawn() {
			this.innerText = "Button";
			this.displayBorder = false;
			this.displayColor = false;
		}

		render(createElement, vm) {
			return super.simpleRender("button", createElement, vm, true);
		}

		constructor(parent) {
			super(parent);
		}

		props() {
			return {
				
			};
		}
	}
};

Websom.Designer.Group = class DesignerGroup extends Websom.Designer.Object {
	static nodeName() {
		return "div";
	}

	getIcon() {
		return "object-group";
	}

	static addClass() {
		return "design-group";
	}
};

Websom.Designer.Text = class DesignerText extends Websom.Designer.Object {
	constructor() {
		super(...arguments);
		this.fontSize = 12;
		this.color = {r: 0, g: 0, b: 0, a: 1};
		this.text = "Text";
	}

	static nodeName() {
		return "p";
	}

	getIcon() {
		return "paragraph";
	}

	static addClass() {
		return "design-text";
	}

	render(createElement, vm) {
		let fresh = this.buildAttrs();
		fresh.contenteditable = true;

		return createElement(this.constructor.nodeName(), {attrs: fresh, domProps: {designObject: this}}, [
			this.text
		]);
	}

	serialize(root) {
		return this.simpleSerialize(root, this.constructor.nodeName(), this.text);
	}
};

Websom.Designer.Rectangle = class DesignerRectangle extends Websom.Designer.Object {
	static nodeName() {
		return "div";
	}

	getIcon() {
		return "square";
	}

	static addClass() {
		return "design-rect";
	}
};

Websom.Designer.Root = class DesignerRoot extends Websom.Designer.Object {
	constructor(parent, name) {
		super(parent, name);

		this.mode = "desktop";
		this.idBase = 10;
		this.zBase = 0;
	}

	render(createElement, vm) {
		let fresh = this.buildAttrs();

		let child = [];
		for (let c of this.children) {
			child.push(c.render(createElement, vm));
		}

		return createElement(this.constructor.nodeName(), child);
	}

	static nodeName() {
		return "div";
	}

	getIcon() {
		return "square";
	}

	static addClass() {
		return "design-root";
	}
};

Websom.Designer.Circle = class DesignerCircle extends Websom.Designer.Object {
	constructor(parent, name) {
		super(parent, name);
		this.attr.borderRadius = "50%";
	}

	getIcon() {
		return "circle";
	}

	static nodeName() {
		return "div";
	}

	static addClass() {
		return "design-circle";
	}
};

Websom.Designer.Svg = class DesignerSvg extends Websom.Designer.Object {
	constructor(parent, name) {
		super(parent, name);

		this.svgType = "path";
		this.path = [];
		this.image = "";
	}

	getIcon() {
		return "bezier-curve";
	}

	getPath() {
		let str = "M";
		for (let i = 0; i < this.path.length; i++) {
			let p = this.path[i];
			if (p.length == 2) {
				str += p[0] + ", " + p[1];
			}else{
				str += p[0] + ", " + p[1] + ", " + p[2] + ", " + p[3];
			}
		}
		return str + "Z";
	}

	render(createElement, vm) {
		let fresh = this.buildAttrs();

		return createElement(this.constructor.nodeName(), {attrs: fresh}, [
			createElement("path", {attrs: {"d": this.getPath()}})
		]);
	}

	nodeName() {
		return "svg";
	}

	static addClass() {
		return "design-path";
	}
};