import "./drag.less";

export default (Vue, options) => {
	if (typeof window === 'undefined')
		return;

	let uid = 1;
	let getUid = () => uid++;

	let listeners = {};

	document.addEventListener("mouseup", (e) => {
		for (let key in listeners)
			if (listeners.hasOwnProperty(key))
				listeners[key]("mouseup", e);
	});

	document.addEventListener("mousemove", (e) => {
		for (let key in listeners)
			if (listeners.hasOwnProperty(key))
				listeners[key]("mousemove", e);
	});

	Vue.directive("draggable", {
		inserted(el, binding) {
			let config = binding.value;
			console.log(config);
			let myUid = getUid();

			el.classList.add("websom-draggable");

			let state = {
				dragging: false,
				start: {
					x: 0,
					y: 0,
				}
			};

			el.addEventListener("mousedown", (e) => {
				el.classList.add("websom-dragging");
				state.dragging = true;

				state.start.x = e.clientX;
				state.start.y = e.clientY;
			});

			listeners[myUid] = (type, e) => {
				if (type == "mouseup") {
					el.classList.remove("websom-dragging");
					state.dragging = false;
				}else if (type == "mousemove") {
					if (state.dragging)
						config.update(
							{
								...state,
								dx: e.clientX - state.start.x,
								dy: e.clientY - state.start.y,
								x: e.clientX,
								y: e.clientY
							}
						);
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