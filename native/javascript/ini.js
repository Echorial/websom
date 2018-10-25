/*
* Basic ini parser for websom.
* Groups, single quotes, and more are not supported.
*/
module.exports = {
	parse: input => { //Quick hack, needs fixing. Maybe use a lib?
		let regex = /([^=: ]*)\s*[=:]\s*([^\n]*)/;
		let output = {};

		for (let line of input.split(/\n/))
			if (line.length > 0 && line != "\r" && line[0] != ";" && line[0] != "#") {
				let match = line.match(regex);
				let out = match[2];
				try {out = JSON.parse(out); if (out == true || out == false) out = out ? "1" : "0";} catch(e) {}
				output[match[1]] = out;
			}			

		return output;
	}
};