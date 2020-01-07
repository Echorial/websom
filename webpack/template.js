module.exports = (data) =>
`
<!DOCTYPE html>
<html lang="${data.lang || "en"}">
	<head>
		<meta name="viewport" content="width=device-width, initial-scale=1">
		{{{ renderResourceHints() }}}
		{{{ renderStyles() }}}
	</head>

	<body>
		<!--vue-ssr-outlet-->
		{{{ renderState() }}}
	</body>
</html>
`;