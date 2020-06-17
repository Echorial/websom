export default (store, context) => {
	let queryCache = {};
	
	return (route, body, opts) => {
		if (typeof window === "undefined")
			return context.server.api.hit(context.server.makeRequestFromExpress(context.ssrRequest), route, body);
		
		let fetchURL = route;

		if (route[0] == "/") {
			fetchURL = store.state.websom.api + route;
		}

		opts = opts || {};

		let cacheKey = route + JSON.stringify(body);

		if (opts.cache && !opts.ignoreCache && queryCache[cacheKey]) {
			return queryCache[cacheKey];
		}

		let session = sessionStorage.getItem("Websom-Session");
		
		if (!session)
			session = localStorage.getItem("Websom-Session");

		let addHeaders = {};

		if (session) {
			addHeaders["X-Session"] = session;
		}

		let fetchBody = {
			method: opts.method || "POST",
			credentials: "same-origin",
			headers: {
				...(opts.headers || {}),
				...addHeaders
			}
		};
		
		if (body instanceof FormData) {
			fetchBody.body = body;
		}else{
			if (body.fields === "*")
				body.fields = {
					"*": true
				};

			fetchBody.body = JSON.stringify(body);
			fetchBody.headers["Content-Type"] = "application/json";
		}
		
		return fetch(fetchURL, fetchBody).then(res => {
			if (res.headers.get("X-Set-Session")) {
				if (opts.useLocalStorage)
					localStorage.setItem("Websom-Session", res.headers.get("X-Set-Session"));
				else
					sessionStorage.setItem("Websom-Session", res.headers.get("X-Set-Session"));
				
				document.cookie = `wbsm_session=${res.headers.get("X-Set-Session")}`;
			}

			return res.json().then((data) => {
				return new Promise((resolve, rej) => {
					if (opts.cache) {
						queryCache[cacheKey] = data;
					}

					resolve(data);
				});
			});
		}).catch(() => {console.error("Invalid endpoint " + route)});
	};
};