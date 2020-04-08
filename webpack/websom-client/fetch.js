export default (store, context) => {
	return (route, body, opts) => {
		if (typeof window === "undefined")
			return context.server.api.hit(context.server.makeRequestFromExpress(context.ssrRequest), route, body);
		
		opts = opts || {};

		let session = sessionStorage.getItem("Websom-Session");
		
		if (!session)
			session = localStorage.getItem("Websom-Session");

		let addHeaders = {};

		if (session) {
			addHeaders["X-Session"] = session;
		}
		
		return fetch(store.state.websom.api + route, {
			method: opts.method || "POST",
			body: JSON.stringify(body),
			credentials: "same-origin",
			headers: {
				"Content-Type": "application/json",
				...(opts.headers || {}),
				...addHeaders
			}
		}).then(res => {
			if (res.headers.get("X-Set-Session")) {
				if (opts.useLocalStorage)
					localStorage.setItem("Websom-Session", res.headers.get("X-Set-Session"));
				else
					sessionStorage.setItem("Websom-Session", res.headers.get("X-Set-Session"));
				
				document.cookie = `wbsm_session=${res.headers.get("X-Set-Session")}`;
			}

			return res.json().then((data) => {
				return new Promise((resolve, rej) => {
					resolve(data);
				});
			});
		}).catch(() => {console.error("Invalid endpoint " + route)});
	};
};