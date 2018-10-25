const fs = require("fs");
var change = 0;
var compOn = false;

module.exports = {
	compileLess: (ref, file, callback) => {
		var less = require("less");
		var str = fs.readFileSync(file, "utf8");
		if (ref.length > 0)
			str = str + "@import (reference) \"" + ref + "\";";
		change++;
		less.render(str, {filename: file + "js" + change}, function(err, output) {
			if (err) {
				callback(true, err.toString());
			}else{
				callback(false, output.css);
			}
		});
	}
};