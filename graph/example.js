let exampleServerRequest = {
	"collections": {
		"users": {
			"filter": {
				"username": {
					"query": "equals",
					"value": "abc"
				}
			},
			"select": {
				"posts": {
					"filter": {
						"$count": {
							"query": "limit",
							"value": 5
						}
					},
					"select": {
						"name": {}
					}
				}
			}
		}
	}
};

let exampleClientQuery = websom.api.find()
	.collection("users")
		.where("username").equals("abc")
		.select("posts")
			.select("name")
			.limit(5)
		.end()
	.end();

let exampleQueryString = `
	{
		users {
			id = {userId}

			posts {
				limit(5)

				name
			}
		}
	}
`;