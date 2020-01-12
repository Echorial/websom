function offset(el) {
	if (el.offsetParent) {
		let offsetOfParent = offset(el.offsetParent);
		return {
			left: el.offsetLeft + offsetOfParent.left,
			top: el.offsetTop + offsetOfParent.top
		};
	}

	return {
		left: el.offsetLeft,
		top: el.offsetTop
	};
}

export default offset