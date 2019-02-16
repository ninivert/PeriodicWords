const fs = require("fs");

function mkdir(dir) {
	try {
		fs.mkdirSync(dir);
	}
	catch (err) {
		if (err.code !== "EEXIST") throw err;
	}
}

module.exports = mkdir;