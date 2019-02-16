/**
 * Config and files
 */

const config = {
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

const table = [["Lead","pb"],["Thallium","tl"],["Lutetium","lu"],["Thulium","tm"],["Americium","am"],["Livermorium","lv"],["Samarium","sm"],["Flerovium","fl"],["Palladium","pd"],["Chlorine","cl"],["Phosphorus","p"],["Bismuth","bi"],["Radon","rn"],["Tantalum","ta"],["Magnesium","mg"],["Fermium","fm"],["Krypton","kr"],["Copper","cu"],["Aluminium","al"],["Rhenium","re"],["Neon","ne"],["Lawrencium","lr"],["Gadolinium","gd"],["Nitrogen","n"],["Platinum","pt"],["Sodium","na"],["Sulfur","s"],["Rhodium","rh"],["Yttrium","y"],["Nickel","ni"],["Oxygen","o"],["Barium","ba"],["Thorium","th"],["Bromine","br"],["Ununseptium","uus"],["Protactinium","pa"],["Einsteinium","es"],["Rutherfordium","rf"],["Francium","fr"],["Erbium","er"],["Silicon","si"],["Manganese","mn"],["Indium","in"],["Rubidium","rb"],["Radium","ra"],["Curium","cm"],["Ununoctium","uuo"],["Germanium","ge"],["Titanium","ti"],["Arsenic","as"],["Helium","he"],["Neodymium","nd"],["Mendelevium","md"],["Antimony","sb"],["Europium","eu"],["Iron","fe"],["Seaborgium","sg"],["Nobelium","no"],["Cerium","ce"],["Osmium","os"],["Copernicium","cn"],["Beryllium","be"],["Polonium","po"],["Ruthenium","ru"],["Potassium","k"],["Dubnium","db"],["Argon","ar"],["Darmstadtium","ds"],["Scandium","sc"],["Carbon","c"],["Neptunium","np"],["Lanthanum","la"],["Uranium","u"],["Zirconium","zr"],["Niobium","nb"],["Calcium","ca"],["Iridium","ir"],["Cesium","cs"],["Plutonium","pu"],["Gold","au"],["Ununtrium","uut"],["Cobalt","co"],["Praseodymium","pr"],["Zinc","zn"],["Berkelium","bk"],["Roentgenium","rg"],["Chromium","cr"],["Fluorine","f"],["Hafnium","hf"],["Selenium","se"],["Technetium","tc"],["Meitnerium","mt"],["Tin","sn"],["Terbium","tb"],["Actinium","ac"],["Holmium","ho"],["Californium","cf"],["Lithium","li"],["Ununpentium","uup"],["Vanadium","v"],["Bohrium","bh"],["Hassium","hs"],["Strontium","sr"],["Cadmium","cd"],["Boron","b"],["Tungsten","w"],["Silver","ag"],["Promethium","pm"],["Ytterbium","yb"],["Molybdenum","mo"],["Gallium","ga"],["Tellurium","te"],["Xenon","xe"],["Mercury","hg"],["Dysprosium","dy"],["Iodine","i"],["Hydrogen","h"],["Astatine","at"]];

const names = table.map(entry => entry[0]);
const symbols = table.map(entry => entry[1].toLowerCase());

/**
 * Image preload
 */

config.words_input.disabled = true;
config.tile_size_input.disabled = true;
config.tile_size_input.value = 150;
config.progress.max = names.length;

let preloadCount = 0;
let images = names.map((name, i) => {
	const img = new Image();
	img.src = `assets/tiles/${name}.png`;
	img.onload = function() {
		++preloadCount;
		config.progress.value = preloadCount;
		if (preloadCount === names.length) {
			logger(`Preloaded ${names.length} images`);
			config.loader.style.display = "none";
			init();
		}
	}

	return img;
});

/**
 * Init
 */

function init() {
	config.words_input.disabled = false;
	config.tile_size_input.disabled = false;
	config.tile_size_value.innerHTML = config.tile_size_input.value;

	config.tile_size_input.oninput = function() {
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
	const strings = config.words_input.value.split(" ").map(word => word.toLowerCase());
	config.output.innerHTML = "";

	for (let string of strings) {
		const decomps = decompose(string, symbols);

		let start = Date.now();
		let n = 0;

		for (; n < decomps.length; ++n) {
			const decomp = decomps[n];
			const decompNames = [];

			for (let element of decomp) {
				const index = symbols.indexOf(element);
				decompNames.push(names[index]);
			}

			const data = getImageData(
				decompNames,
				images,
				parseInt(config.tile_size_input.value)
			);

			const link = document.createElement("a");
			link.download = `${string}_${n+1}`;
			link.href = data;

			const img = document.createElement("img");
			img.src = data;

			link.appendChild(img);
			config.output.appendChild(link);
		}

		logger(`Generating ${n} images for ${string} in ${Date.now() - start} ms`, config.logger);
	}
}

/**
 * Image generator
 */

function getImageData(decompNames, spritePool, tileSize) {
	const canvas = document.createElement("canvas");
	const ctx = canvas.getContext("2d");
	canvas.width = decompNames.length * tileSize;
	canvas.height = tileSize;

	let pos = 0;

	for (let element of decompNames) {
		let elementIndex = names.indexOf(element);
		ctx.drawImage(spritePool[elementIndex], pos, 0, tileSize, tileSize)

		pos += tileSize;
	}

	return canvas.toDataURL("image/png");
}

/**
 * Decomposer
 */

// Wrapper for the recursive algorithm
function decompose(string, symbols) {
	let solutions = [];
	decomposeR(string, symbols, solutions);
	return solutions;
}


// Return a decomposition of string in array form
// If impossible, returns [false]
function decomposeR(string, symbols, solutions) {
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
			const _decomps = decomposeR(string.substr(i), symbols, solutions);

			for (let _decomp of _decomps) {
				if (_decomp === false) {
					// Decomposition is impossible
					// Propagate the error upwards
					decomps.push([false]);
				} else {
					// Add element to decomposition
					_decomp.unshift(symbols[elementIndex]);
					// Add decomposition to solutions if one
					if (string === substr) {
						solutions.push(_decomp);
					}
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

/**
 * Logger
 */

function logger(txt, enabled = true) {
	if (enabled) {
		console.log(txt);
	}
}