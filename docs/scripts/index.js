"use strict";

/**
 * Config and files
 */

var config = {
	// "output_dir": "outputs",
	// "tile_size": 150,
	// "words": ["ra", "ra", "rasputin"],
	// "words_file": "Words_10k.txt",
	// "dict_file": "PeriodicTable.txt",
	// "use_words_file": false,
	"logger": true,
	"words_input": document.getElementById("words_input"),
	"tile_size_input": document.getElementById("tile_size_input"),
	"tile_size_value": document.getElementById("tile_size_value"),
	"loader": document.getElementById("loader"),
	"progress": document.getElementById("progress"),
	"output": document.getElementById("output")
};

var table = [["Lead", "pb"], ["Thallium", "tl"], ["Lutetium", "lu"], ["Thulium", "tm"], ["Americium", "am"], ["Livermorium", "lv"], ["Samarium", "sm"], ["Flerovium", "fl"], ["Palladium", "pd"], ["Chlorine", "cl"], ["Phosphorus", "p"], ["Bismuth", "bi"], ["Radon", "rn"], ["Tantalum", "ta"], ["Magnesium", "mg"], ["Fermium", "fm"], ["Krypton", "kr"], ["Copper", "cu"], ["Aluminium", "al"], ["Rhenium", "re"], ["Neon", "ne"], ["Lawrencium", "lr"], ["Gadolinium", "gd"], ["Nitrogen", "n"], ["Platinum", "pt"], ["Sodium", "na"], ["Sulfur", "s"], ["Rhodium", "rh"], ["Yttrium", "y"], ["Nickel", "ni"], ["Oxygen", "o"], ["Barium", "ba"], ["Thorium", "th"], ["Bromine", "br"], ["Ununseptium", "uus"], ["Protactinium", "pa"], ["Einsteinium", "es"], ["Rutherfordium", "rf"], ["Francium", "fr"], ["Erbium", "er"], ["Silicon", "si"], ["Manganese", "mn"], ["Indium", "in"], ["Rubidium", "rb"], ["Radium", "ra"], ["Curium", "cm"], ["Ununoctium", "uuo"], ["Germanium", "ge"], ["Titanium", "ti"], ["Arsenic", "as"], ["Helium", "he"], ["Neodymium", "nd"], ["Mendelevium", "md"], ["Antimony", "sb"], ["Europium", "eu"], ["Iron", "fe"], ["Seaborgium", "sg"], ["Nobelium", "no"], ["Cerium", "ce"], ["Osmium", "os"], ["Copernicium", "cn"], ["Beryllium", "be"], ["Polonium", "po"], ["Ruthenium", "ru"], ["Potassium", "k"], ["Dubnium", "db"], ["Argon", "ar"], ["Darmstadtium", "ds"], ["Scandium", "sc"], ["Carbon", "c"], ["Neptunium", "np"], ["Lanthanum", "la"], ["Uranium", "u"], ["Zirconium", "zr"], ["Niobium", "nb"], ["Calcium", "ca"], ["Iridium", "ir"], ["Cesium", "cs"], ["Plutonium", "pu"], ["Gold", "au"], ["Ununtrium", "uut"], ["Cobalt", "co"], ["Praseodymium", "pr"], ["Zinc", "zn"], ["Berkelium", "bk"], ["Roentgenium", "rg"], ["Chromium", "cr"], ["Fluorine", "f"], ["Hafnium", "hf"], ["Selenium", "se"], ["Technetium", "tc"], ["Meitnerium", "mt"], ["Tin", "sn"], ["Terbium", "tb"], ["Actinium", "ac"], ["Holmium", "ho"], ["Californium", "cf"], ["Lithium", "li"], ["Ununpentium", "uup"], ["Vanadium", "v"], ["Bohrium", "bh"], ["Hassium", "hs"], ["Strontium", "sr"], ["Cadmium", "cd"], ["Boron", "b"], ["Tungsten", "w"], ["Silver", "ag"], ["Promethium", "pm"], ["Ytterbium", "yb"], ["Molybdenum", "mo"], ["Gallium", "ga"], ["Tellurium", "te"], ["Xenon", "xe"], ["Mercury", "hg"], ["Dysprosium", "dy"], ["Iodine", "i"], ["Hydrogen", "h"], ["Astatine", "at"]];

var names = table.map(function (entry) {
	return entry[0];
});
var symbols = table.map(function (entry) {
	return entry[1].toLowerCase();
});

/**
 * Image preload
 */

config.words_input.disabled = true;
config.tile_size_input.disabled = true;
config.tile_size_input.value = 150;
config.progress.max = names.length;

var preloadCount = 0;
var images = names.map(function (name, i) {
	var img = new Image();
	img.src = "assets/tiles/" + name + ".png";
	img.onload = function () {
		++preloadCount;
		config.progress.value = preloadCount;
		if (preloadCount === names.length) {
			logger("Preloaded " + names.length + " images");
			config.loader.style.display = "none";
			init();
		}
	};

	return img;
});

/**
 * Init
 */

function init() {
	config.words_input.disabled = false;
	config.tile_size_input.disabled = false;
	config.tile_size_value.innerHTML = config.tile_size_input.value;

	config.tile_size_input.oninput = function () {
		config.tile_size_value.innerHTML = config.tile_size_input.value;
		doStuff();
	};
	config.words_input.oninput = doStuff;

	doStuff();
}

/**
 * Main
 * Take the strings, decompose them, generate images and display
 */

function doStuff() {
	var strings = config.words_input.value.split(" ").map(function (word) {
		return word.toLowerCase();
	});
	config.output.innerHTML = "";

	var _iteratorNormalCompletion = true;
	var _didIteratorError = false;
	var _iteratorError = undefined;

	try {
		for (var _iterator = strings[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
			var string = _step.value;

			var decomps = decompose(string, symbols);
			var start = Date.now();
			var n = 0;

			for (; n < decomps.length; ++n) {
				var decomp = decomps[n];
				var decompNames = [];

				var _iteratorNormalCompletion2 = true;
				var _didIteratorError2 = false;
				var _iteratorError2 = undefined;

				try {
					for (var _iterator2 = decomp[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
						var element = _step2.value;

						var index = symbols.indexOf(element);
						decompNames.push(names[index]);
					}
				} catch (err) {
					_didIteratorError2 = true;
					_iteratorError2 = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion2 && _iterator2.return) {
							_iterator2.return();
						}
					} finally {
						if (_didIteratorError2) {
							throw _iteratorError2;
						}
					}
				}

				var data = getImageData(decompNames, images, parseInt(config.tile_size_input.value));

				var link = document.createElement("a");
				link.download = string + "_" + (n + 1);
				link.href = data;

				var img = document.createElement("img");
				img.src = data;

				link.appendChild(img);
				config.output.appendChild(link);
			}

			logger("Generating " + n + " images for " + string + " in " + (Date.now() - start) + " ms", config.logger);
		}
	} catch (err) {
		_didIteratorError = true;
		_iteratorError = err;
	} finally {
		try {
			if (!_iteratorNormalCompletion && _iterator.return) {
				_iterator.return();
			}
		} finally {
			if (_didIteratorError) {
				throw _iteratorError;
			}
		}
	}
}

/**
 * Image generator
 */

function getImageData(decompNames, spritePool, tileSize) {
	var canvas = document.createElement("canvas");
	var ctx = canvas.getContext("2d");
	canvas.width = decompNames.length * tileSize;
	canvas.height = tileSize;

	var pos = 0;

	var _iteratorNormalCompletion3 = true;
	var _didIteratorError3 = false;
	var _iteratorError3 = undefined;

	try {
		for (var _iterator3 = decompNames[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
			var element = _step3.value;

			var elementIndex = names.indexOf(element);
			ctx.drawImage(spritePool[elementIndex], pos, 0, tileSize, tileSize);

			pos += tileSize;
		}
	} catch (err) {
		_didIteratorError3 = true;
		_iteratorError3 = err;
	} finally {
		try {
			if (!_iteratorNormalCompletion3 && _iterator3.return) {
				_iterator3.return();
			}
		} finally {
			if (_didIteratorError3) {
				throw _iteratorError3;
			}
		}
	}

	return canvas.toDataURL("image/png");
}

/**
 * Decomposer
 */

/**
 * Wrapper for the recursive algorithm
 */

function decompose(string, symbols) {
	return decomposeR(string, symbols).filter(function (decomp) {
		return decomp.indexOf(false) === -1 && decomp.length !== 0;
	});
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
	var found = false;
	var decomps = [];

	for (var i = 1; i <= string.length; ++i) {
		var substr = string.substr(0, i);
		var elementIndex = symbols.indexOf(substr);

		// Found a potential element
		if (elementIndex !== -1) {
			found = true;
			var _decomps = decomposeR(string.substr(i), symbols);

			var _iteratorNormalCompletion4 = true;
			var _didIteratorError4 = false;
			var _iteratorError4 = undefined;

			try {
				for (var _iterator4 = _decomps[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
					var _decomp = _step4.value;

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
			} catch (err) {
				_didIteratorError4 = true;
				_iteratorError4 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion4 && _iterator4.return) {
						_iterator4.return();
					}
				} finally {
					if (_didIteratorError4) {
						throw _iteratorError4;
					}
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

/**
 * Logger
 */

function logger(txt) {
	var enabled = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

	if (enabled) {
		console.log(txt);
	}
}
//# sourceMappingURL=index.js.map