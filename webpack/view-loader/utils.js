const qs = require('querystring');

// these are built-in query parameters so should be ignored
// if the user happen to add them as attrs
const ignoreList = [
	'id',
	'index',
	'src',
	'type'
];

exports.attrsToQuery = (attrs, langFallback) => {
	let query = ``;

	for (const name in attrs) {
		const value = attrs[name];

		if (!ignoreList.includes(name)) {
			query += `&${qs.escape(name)}=${value ? qs.escape(value) : ``}`;
		}
	}

	if (langFallback && !(`lang` in attrs)) {
		query += `&lang=${langFallback}`;
	}

	return query;
};