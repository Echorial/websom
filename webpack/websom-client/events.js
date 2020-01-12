export default {
	bind(instance) {
		instance.$websomGlobalHandlers = {};

		return function on(event, handler, all) {
			instance.$websomGlobalHandlers[event] = handler;
			document.addEventListener(event, handler, all);
		};
	},
	unbind(isntance) {
		const handlers = instance.$websomGlobalHandlers;

		if (handlers)
			for (let handle in handlers)
				if (handlers.hasOwnProperty(handle))
					document.removeEventListener(handlers[handle]);
	}
}