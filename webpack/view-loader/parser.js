module.exports = (str, breakOn) => {
	this.shallow = false;
	let open = false;
	let opens = 0;
	let name = "";
	let block = "";
	let openChar = "{";
	let closeChar = "}";
	let openOpt = "[";
	let closeOpt = "]";
	let setOpt = "=";
	let escape = false;

	let option = false;
	let optionSet = false;
	let optionEscape = false;
	let optionQuote = false;
	let optionName = "";
	let optionValue = "";

	let options = null;

	let blocks = {};

	for (let i = 0; i < str.length; i++) {
		let char = str[i];
		if (option) {
			if (optionSet) {
				if (optionEscape) {
					// Skip checking
				}else if (!optionQuote && char == "\"") {
					optionQuote = true;
					continue
				}else if (char == "\"") {
					optionQuote = false;
					optionSet = false;
					options[optionName] = optionValue;
					optionName = "";
					optionValue = false;
					continue;
				}else if (char == closeOpt) {
					if (optionName != "")
						options[optionName] = true;
					option = false;
					continue;
				}

				optionValue += char;
			}else{
				if (char == " ") {
					options[optionName] = true;
					optionName = "";
					continue;
				}else if (char == setOpt) {
					optionSet = true;
					continue;
				}else if (char == closeOpt) {
					if (optionName != "")
						options[optionName] = true;
					option = false;
					continue;
				}

				optionName += char;
			}
		}else if (open == false) {
			if (char == openOpt) {
				options = {};
				option = true;
			}else if (char != "\t" && char != openChar && char != "\n" && char != "\r")
				name += char;
			else if (char == openChar)
				open = true;
		}else{
			if (char == closeChar) {
				if (opens == 0) {
					name = name.trim();
					blocks[name] = {block: block, options: options};

					if (breakOn === name) {
						return blocks;
					}

					options = null;
					open = false;
					name = "";
					block = "";
				}else{
					opens--;
					block += char;
				}
			}else if (char == openChar) {
				opens++;
				block += char;
			}else{
				block += char;
			}
		}
	}

	return blocks;
};