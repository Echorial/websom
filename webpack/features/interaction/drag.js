import "./drag.less";

const limits = {
	parent(selector, e, config) {
		let el = e.el.closest(selector);
		let boundingRect = el.getBoundingClientRect();
		let marginLeft = (config.limitMargin && config.limitMargin.x) ? config.limitMargin.x * e.start.rect.width : 0;
		let marginRight = marginLeft;
		let marginTop = (config.limitMargin && config.limitMargin.y) ? config.limitMargin.y * e.start.rect.height : 0;
		let marginBottom = marginTop;
		let x = Math.max(boundingRect.left - marginLeft + e.start.ox, Math.min(boundingRect.right + marginRight - (e.start.rect.width -  e.start.ox), e.x));
		let y = Math.max(boundingRect.top - marginTop + e.start.oy, Math.min(boundingRect.bottom + marginBottom - e.start.oy, e.y));

		return {
			x,
			y,
			percentageX: (x - boundingRect.x)/boundingRect.width,
			percentageY: (y - boundingRect.y)/boundingRect.height
		};
	}
};

const movers = {
	"relative-absolute"(e) {
		let { left, top } = e.start.style;
		
		left = parseFloat(left);
		top = parseFloat(top);

		e.el.style.top = top + e.dy + 'px';
		e.el.style.left = left + e.dx + 'px';
	}
};

export default (Vue, options) => {
	if (typeof window === 'undefined')
		return;

	let uid = 1;
	let getUid = () => uid++;

	let listeners = {};

	let addDocumentListener = (event) => {
		document.addEventListener(event, (e) => {
			for (let key in listeners)
				if (listeners.hasOwnProperty(key))
					listeners[key](event, e);
		});
	};

	addDocumentListener("mousemove");
	addDocumentListener("touchmove");
	addDocumentListener("mouseup");
	addDocumentListener("touchend");
	addDocumentListener("touchcancel");

	Vue.directive("draggable", {
		inserted(el, binding) {
			let config = binding.value;

			if (!config.axis)
				config.axis = {
					x: 1,
					y: 1
				};
			
			let myUid = getUid();

			el.classList.add("websom-draggable");

			let state = {
				dragging: false,
				moved: false,
				start: {
					x: 0,
					y: 0,
					ox: 0,
					oy: 0,
					rect: {},
					style: {
						top: 0,
						left: 0,
						right: 0,
						bottom: 0
					}
				}
			};

			let downListener = (e) => {
				e.preventDefault();
				el.classList.add("websom-dragging");
				state.dragging = true;

				state.start.x = e.clientX;
				state.start.y = e.clientY;
				if (e.type == "touchstart") {
					state.start.x = e.touches[0].clientX;
					state.start.y = e.touches[0].clientY;
				}
				state.start.rect = el.getBoundingClientRect();

				state.start.ox = state.start.x - state.start.rect.x;
				state.start.oy = state.start.y - state.start.rect.y;

				if (config.overrideOffset) {
					if (config.overrideOffset.x === "center")
						state.start.ox = state.start.rect.width / 2;
					else
						state.start.ox = config.overrideOffset.x;

					if (config.overrideOffset.y === "center")
						state.start.oy = state.start.rect.height / 2;
					else
						state.start.oy = config.overrideOffset.y;
				}

				let computedStyle = getComputedStyle(el);
				state.start.style.top = computedStyle.top;
				state.start.style.bottom = computedStyle.bottom;
				state.start.style.left = computedStyle.left;
				state.start.style.right = computedStyle.right;

				state.moved = false;

				if (config.start)
					config.start({
						event: e,
						el,
						...state,
						dx: 0,
						dy: 0,
						x: e.clientX,
						y: e.clientY
					});
			};

			el.addEventListener("mousedown", downListener);
			el.addEventListener("touchstart", downListener);

			listeners[myUid] = (type, e) => {
				if (type == "mouseup" || type == "touchend" || type == "touchcancel") {
					e.preventDefault();

					el.classList.remove("websom-dragging");
					
					if (config.end && state.dragging) {
						let { clientX, clientY } = e;

						config.end({
							event: e,
							el,
							...state,
							dx: (clientX - state.start.x) * config.axis.x,
							dy: (clientY - state.start.y) * config.axis.y,
							x: clientX,
							y: clientY
						});
					}
					
					state.dragging = false;
				}else if (type == "mousemove" || type == "touchmove") {

					state.moved = true;

					let { clientX, clientY } = e;
					if (e.type == "touchmove") {
						clientX = e.touches[0].clientX;
						clientY = e.touches[0].clientY;
					}else e.preventDefault();
					
					let percentageX = 0;
					let percentageY = 0;

					if (typeof config.limit === "string") {
						let result = limits.parent(config.limit, {el, event: e, x: clientX, y: clientY, ...state}, config);
						clientX = result.x;
						clientY = result.y;
						percentageX = result.percentageX;
						percentageY = result.percentageY;
					}

					let eventData = {
						...state,
						el,
						dx: (clientX - state.start.x) * config.axis.x,
						dy: (clientY - state.start.y) * config.axis.y,
						x: clientX,
						y: clientY,
						percentageX,
						percentageY
					};

					if (state.dragging && config.move)
						config.move(eventData);

					if (state.dragging && config.position)
						if (movers[config.position])
							movers[config.position](eventData);
						else
							throw new Error("Invalid position mover for v-draggable: " + config.position);
				}
			};

			el.dataset.dragUid = myUid;
		},
		unbind(el, binding) {
			if (el.dataset.dragUid)
				delete listeners[el.dataset.dragUid];
		}
	});
};