export default (store) => {
	return (route, body, opts) => {
		opts = opts || {};
		
		return fetch(store.state.websom.api + route, {
			method: opts.method || "POST",
			body: JSON.stringify(body),
			headers: {
				"Content-Type": "application/json",
				...(opts.headers || {})
			}
		}).then(raw => raw.json()).catch(() => {console.error("Invalid endpoint " + route)}).then((data) => {
			return new Promise((res, rej) => {
				res(data);
			});
		});
	};
};