function logger(txt, enabled = true) {
	if (enabled) {
		console.log(txt);
	}
}

module.exports = logger;