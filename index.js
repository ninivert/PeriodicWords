/**
 * Modules
 */

const fs = require("fs");
const path = require("path");

const decompose = require("./lib/decompose");
const generateImage = require("./lib/generateImage");
const mkdir = require("./lib/mkdir");
const logger = require("./lib/logger");

/**
 * Prepare data from files
 */

const config = JSON.parse(fs.readFileSync(path.join(__dirname, "config.json"), "utf-8"));
const table = fs.readFileSync(path.join(__dirname, "assets", config.dict_file), "utf-8")
	.split("\n")
	.map(entry => entry.split(", "));
const names = table.map(entry => entry[0]);
const symbols = table.map(entry => entry[1].toLowerCase());
const sentences = config.use_words_file ? fs.readFileSync(path.join(__dirname, "assets", config.words_file), "utf-8").split("\n") : config.words;
let strings = [];
for (let sentence of sentences) strings = strings.concat(sentence.split(" ").map(word => word.toLowerCase()));

mkdir(path.join(__dirname, config.output_dir));

/**
 * Generate the decompositions and images
 */

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

		generateImage(
			decompNames,
			path.join(__dirname, config.output_dir, `${string}_${n+1}.png`),
			path.join(__dirname, "assets", "tiles"),
			config.tile_size
		);
	}

	logger(`Generating ${n} images for ${string} in ${Date.now() - start} ms`, config.logger);
}