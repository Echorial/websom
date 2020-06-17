module.exports = (data) =>
`
<!DOCTYPE html>
<html lang="${data.lang || "en"}">
	<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<meta name="description" content="{{metaDescription}}">
		<link rel="canonical" href="{{canonicalURL}}" />
		{{{ headElements }}}
		{{{ renderResourceHints() }}}
		{{{ renderStyles() }}}
		<title>{{title}}</title>
		{{{ renderHeadElements() }}}
		${data.style ? `<link rel="stylesheet" type="text/css" href="${data.style}"></link>` : ``}
	</head>

	<body>
		<!--vue-ssr-outlet-->
		{{{ renderState() }}}
	</body>
</html>
`;