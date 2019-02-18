/**
 * Wrapper for the recursive algorithm
 */

function decompose(string, symbols) {
	return decomposeR(string, symbols).filter(decomp => decomp.indexOf(false) === -1 && decomp.length !== 0);
}

/**
 * Return a decomposition of string in array form
 * If impossible, returns false
 */

function decomposeR(string, symbols) {
	// Recursive stop
	if (string === "") return [[]];

	// Search for an element
	// by matching every substring
	let found = false;
	let decomps = [];

	for (let i = 1; i <= string.length; ++i) {
		const substr = string.substr(0, i);
		const elementIndex = symbols.indexOf(substr);

		// Found a potential element
		if (elementIndex !== -1) {
			found = true;
			const _decomps = decomposeR(string.substr(i), symbols);

			for (let _decomp of _decomps) {
				if (_decomp === false) {
					// Decomposition is impossible
					// Propagate the error upwards
					decomps.push([false]);
				} else {
					// Add element to decomposition
					_decomp.unshift(symbols[elementIndex]);
					// Add decomposition to solutions if one
					// if (string === substr) {
					// 	solutions.push(_decomp);
					// }
					// Add to decomposition
					decomps.push(_decomp);
				}
			}
		}
	}

	// No element has been found
	// Decomposition is impossible
	if (found === false) return [false];

	// Return all deocmpositions found
	return decomps;
}

module.exports = decompose;