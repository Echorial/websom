const basicRipple = "<span class='ripple-effect'></span>";

var themeToasts = [];
$(document).on("click", function () { $(".tooltip").remove(); });

Websom.Theme.handle(".theme", (config) => {
	return {
		"/toast": function (msg, dur) {
			dur = dur || 3000;
			themeToasts.push({message: msg, duration: dur});
			var log = $(".toast-log");
			if (log.length == 0) {
				log = $("<div class='toast-log'></div>").appendTo("body");
			}
			var toast = $("<div class='toast'>" + msg + "</div>").appendTo(log).css("left", "300px");
			setTimeout(() => {
				toast.css("left", "0px");
			}, 10);
			var timeOut;
			toast.on("destroy", () => {
				clearTimeout(timeOut);
				toast.css("position", "relative");
				toast.css({left: "300px", opacity: 0});
				setTimeout(() => {
					toast.remove();
				}, 600);
			});

			timeOut = setTimeout(() => {
				toast.trigger("destroy");
			}, dur);
		},
		".nav-expand": {
			"click": function (e) {
				$(this).closest("nav").find(".nav-mobile").toggleClass("open");
				if ($(".nav-shade").length > 0) {
					$(".nav-shade").animate({opacity: 0}, 300, () => {
						$(".nav-shade").remove();
					});
				}else{
					$("<div class='nav-shade'></div>").appendTo($(this).closest("nav")).animate({opacity: 1}, 300);
				}
			}
		},
		".form-close": {
			"success": function (e) {
				$(this).removeClass("open");
				
				if ($(".modal-shade").length > 0) {
					$(".modal-shade").animate({opacity: 0}, 300, () => {
						$(".modal-shade").remove();
					});
				}
			}
		},
		".modal-trigger": {
			"click": function (e) {
				e.stopPropagation();
				let modal = null;
				
				if ($(this).closest(".modal-trigger").attr("href"))
					modal = $($(this).closest(".modal-trigger").attr("href"));
				else
					modal = $(this).closest(".modal");

				modal.toggleClass("open");

				if ($(".modal-shade").length > 0) {
					$(".modal-shade").animate({opacity: 0}, 300, () => {
						$(".modal-shade").remove();
					});
				}else{
					let focus = "";
					if (modal.is("[focus]")) {
						focus = modal.attr("focus");
					}
					
					$("<div class='modal-shade " + focus + "' data-target='" + $(this).closest(".modal-trigger").attr("href") + "'></div>").appendTo(document.body).animate({opacity: 1}, 300);
				}
			}
		},
		".nav-shade": {
			"click": function (e) {
				$(this).closest("nav").find(".nav-mobile").removeClass("open");
				$(this).animate({opacity: 0}, 300, () => {
					$(this).remove();
				});
			}
		},
		".modal-shade": {
			"click": function (e) {
				$($(this).attr("data-target")).removeClass("open");
				$(this).animate({opacity: 0}, 300, () => {
					$(this).remove();
				});
			}
		},
		".accordion > li > div:nth-child(1)": {
			click: function (e) {
				var open = $(this).parent().hasClass("open");
				$(this).parent().parent().children("li").removeClass("open");
				if (!open)
					$(this).parent().toggleClass("open");
			}
		},
		".button.ripple, .dropdown.ripple": {
			click: function (e) {
				var r = $(basicRipple).appendTo(this);
				var size = 10;
				var rx = e.clientX - $(this).offset().left;
				var ry = e.clientY - $(this).offset().top;
				r.css({left: (rx - (size/2)) + "px", top: (ry - (size/2)) + "px", padding: size, transform: "scale(15)"});
				setTimeout(() => {
					r.css("opacity", 0);
					setTimeout(() => {
						r.remove();
					}, 1200);
				}, 1200);
			}
		},
		".image-input > input": {
			dragstart: function (e) {
				$(this).closest(".image-input").addClass("ready");
			},
			dragend: function () {
				$(this).closest(".image-input").removeClass("ready");
			},
			"dragover dragenter": function () {
				$(this).closest(".image-input").addClass("over");
			},
			dragleave: function () {
				$(this).closest(".image-input").removeClass("over");
			},
			change: function () {
				$(this).closest(".image-input").removeClass("over");
				$(this).closest(".image-input:not(.image-add)").addClass("done");
			}
		},
		".expandable, .expandable > *:not(.expand)": {
			click: function () {
				var expandable = $(this).closest(".expandable");
				if (expandable.hasClass("explode"))
					return;
					
				var expand = expandable.children(".expand");
				var open = expand.hasClass("open");

				expand.removeClass("expand");
				expand.css("height", "auto");
				var height = expand.outerHeight();
				expand.addClass("expand");
				expand.css("height", "0px");

				if (open)
					expand.css("height", height + "px");
				
				setTimeout(function () {
					expand.css("height", (open ? 0 : height) + "px");
				}, 10);

				setTimeout(function () {
					expand.css("height", open ? "default" : "auto");
					expand.toggleClass("open");
				}, 310);
			}
		},
		".activate-popover": {
			click: function (e) {
				let that = $(this).closest(".activate-popover");
				let target = null;
				if (that.attr("href")[0] == "~")
					target = that.parent().find(that.attr("href").substr(1));
				else
					target = $(that.attr("href"));
				
				let offset = that.offset();
				if (offset.left + target.outerWidth() > window.innerWidth)
					offset.left = window.innerWidth - target.outerWidth();

				if (offset.top + target.outerHeight() > window.innerHeight)
					offset.top = window.innerHeight - target.outerHeight();
					
				target.css({top: offset.top + that.outerHeight(), left: offset.left});
				target.addClass("open");
				
				setTimeout(function () {
					$(document).on("click.popover", function (e) {
						if ($(e.target).closest(".popover").length == 0) {
							$(document).off("click.popover");
							target.removeClass("open");
						}
					});
				});
			}
		},
		".dropdown": {
			click: function (e) {
				var that = $(this);
				if (that.closest(".dropdown").parent().hasClass("input-select"))
					return;

				var drop = $(this).closest(".dropdown");
				if (!drop.is("a"))
					drop.css({
						top: drop.offset().top,
						left: drop.offset().left
					});
				var init = drop.height();
				drop.toggleClass("open");
				
				if (!drop.is("a"))
				if (drop.hasClass("open")) {
					var h = drop.height();
					drop.css("height", init + "px");
					if (h > window.innerHeight - 20) {
						h = window.innerHeight - 20;
						drop.css("overflow", "auto");
					}
					drop.animate({height: h}, 200);
				}else{
					drop.removeAttr("style");
				}
				if (!drop.parent().hasClass("input-select"))
				setTimeout(function () {
					$(document).on("click.dropdown", function (e) {
						e.stopImmediatePropagation();
						$(document).off("click.dropdown");
						drop.removeAttr("style");
						drop.removeClass("open");
					});
				});
			}
		},
		"*[data-tooltip]": {
			mouseover: function (e) { //Clean up
				var elem = $(this);
				var top = elem.offset().top - elem.height()/1.5;
				var dir = false;
				var above = top + 10;

				if (top - window.scrollY < 0) {
					dir = true;
					top = elem.offset().top + elem.height()*1.05;
					above = top - 10;
				}
				
				var tip = $("<span class='tooltip'>" + elem.attr("data-tooltip") + "</span>").css({position: "absolute", opacity: 0, left: elem.offset().left, top: above});
				
				tip.appendTo("body");
				tip.css({left: elem.offset().left + (elem.outerWidth()/2-tip.outerWidth()/2)});
				
				if (!dir)
					top -= tip.height();

				tip.animate({top: top, opacity: 0.95}, 200);
				elem.data("tooltip", tip);
			},
			mouseout: function (e) {
				var elem = $(this);
				var tt = elem.data("tooltip");
				if (tt)
					$(".tooltip").remove();
			}
		},
		"document": {
			click: function (e) {
				
			}
		},
		".tabs > ul > li": {
			click: function (e) {
				var that = $(this);
				var index = that.attr("data-tab");
				if (!index)
					index = "0";
				var root = that.parent().parent();
				var oldIndex = root.find("> div > div.open").attr("data-tab") || 0;
				if (oldIndex == index)
					return;

				root.find("> div > div").removeClass("open");
				root.find("> div > div[data-tab='" + index + "']").addClass("open");
				var head = that.parent().children("span");

				if (head.length == 0)
					head = $("<span class='tab-head'></span>").appendTo(that.parent());
				var flex = that.width();
				var first = "width";
				var last = "left";
				if (parseInt(index) < parseInt(oldIndex)) {
					head.css(first, (flex*2) + "px");
					head.css(last, flex*(parseInt(index)));
					setTimeout(() => {
						head.css(first, (flex) + "px");
					}, 200);
				}else{
					head.css(first, (flex*2) + "px");
					setTimeout(() => {
						head.css(last, flex*(parseInt(index)));
						head.css(first, (flex) + "px");
					}, 200);
				}
			}
		},
		"p.input-select": {
			"click": function (e) {
				var that = $(this);
				if (that.hasClass("input-select")) {
					var parent = that;

					// Setup dropdown element
					if (!that.children("select").hasClass("theme-initialized")) {
						that.children("select").addClass("theme-initialized");
						var drop = $("<ul class='dropdown'><span></span></ul>").appendTo(parent);
						that.children("select").children("option").each(function () {
							var li = $("<li data-value='" + $(this).attr("value") + "'>" + $(this).html() + "</li>");
							if ($(this).is("[disabled]"))
								li.attr("disabled", "disabled");
								
							drop.append(li);
						});
					}

					var init = parent.children("select").height();
					var drop = parent.children("ul");
					drop.toggleClass("open");
					if (drop.hasClass("open")) {
						var h = drop.height();
						drop.css("height", init + "px");
						if (h > window.innerHeight - 20) {
							h = window.innerHeight - 20;
							drop.css("overflow", "auto");
						}
						drop.show();
						drop.animate({height: h}, 200);
					}else{
						drop.removeAttr("style");
						drop.hide();
					}
					setTimeout(function () {
						$(document).on("click.dropdown", function () {
							$(document).off("click.dropdown");
							drop.removeAttr("style");
							drop.removeClass("open");
						});
					});
				}else if (that.is("li")) {
					if (that.is("[disabled]"))
						return;
					
					var select = that.closest(".input-select").children("select");
					select.children("option[selected]").removeAttr("selected");
					select.val(that.attr("data-value"));
					
					let evt = document.createEvent('Events');
					evt.initEvent("change", true, false);
					select[0].dispatchEvent(evt);
				}
			}
		},
		".v-tabs > ul > li": {
			click: function (e) {
				var that = $(this);
				var index = that.attr("data-tab");
				if (!index)
					index = "0";
				var root = that.parent().parent();
				var oldIndex = root.find("> div > div.open").attr("data-tab") || 0;
				if (oldIndex == index)
					return;

				root.find("> div > div").removeClass("open");
				root.find("> ul > li").removeClass("open");
				root.find("> div > div[data-tab='" + index + "']").addClass("open");
				root.find("> ul > li[data-tab='" + index + "']").addClass("open");
				var head = that.parent().children("span");

				if (head.length == 0)
					head = $("<span class='v-tab-head'></span>").appendTo(that.parent());
				var flex = 31;
				var first = "height";
				var last = "top";
				if (parseInt(index) < parseInt(oldIndex)) {
					head.css(first, (flex*2) + "px");
					head.css(last, flex*(parseInt(index)));
					setTimeout(() => {
						head.css(first, (flex) + "px");
					}, 200);
				}else{
					head.css(first, (flex*2) + "px");
					setTimeout(() => {
						head.css(last, flex*(parseInt(index)));
						head.css(first, (flex) + "px");
					}, 200);
				}
			}
		},
		"input.input": {
			"input": function (e) { //TODO: WARN: Does not work on nested input-array
				return; // Old
				
				var that = $(this);
				var form = that.closest("form");
				if (form.attr("data-validate")) {
					var type = Websom.inputValidation[form.attr("data-validate")];
					var name = "";
					if (that.attr("key-name")) {
						type = Websom.inputValidation[type[that.closest("[name]").attr("name")].type];
						name = that.attr("key-name");
					}else
						name = that.attr("name");

					var key = type[name];

					var invalid = false;
					var message = "";
					if ("Length" in key) {
						if (that.val().length > key["Length"]) {
							invalid = true;
							message = "Must be at shorter than " + key.Length + " characters long.";
						}
					}
					if ("Max" in key) {
						if (parseFloat(that.val()) > key["Max"]) {
							invalid = true;
							message = "Must be at smaller than " + key.Length + ".";
						}
					}
					if ("Min" in key) {
						if (that.val().length < key["Min"]) {
							invalid = true;
							message = "Must be at least " + key.Min + " characters long.";
						}
					}
					if ("Match" in key) {
						if (!(new RegExp(key["Match"]).test(that.val()))) {
							invalid = true;
							message = (key.MatchMessage ? key.MatchMessage : "Must match " + key.Match);
						}
					}

					if (invalid) {
						that.addClass("invalid");
						if (that.parent().children(".validation-error").length == 0) {
							that.after("<div class='validation-error'>" + message + "</div>");
						}
					}else{
						that.parent().children(".validation-error").remove();
						that.removeClass("invalid");
					}
				}
			}
		}
	};
});