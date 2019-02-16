/**
 * Generate the image for the decomposition
 * and save it to the give path
 */

const path = require("path");
const images = require("images");

function generateImage(decompNames, savePath, tilePath, tileSize) {
	let img = images(decompNames.length * tileSize, tileSize);

	let pos = 0;
	for (let element of decompNames) {
		const elementImg = images(path.join(tilePath, `${element}.png`)).size(tileSize);
		img.draw(elementImg, pos, 0);

		pos += tileSize;
	}

	img.save(savePath);
}

module.exports = generateImage;