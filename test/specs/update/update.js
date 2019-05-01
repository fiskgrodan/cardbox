const assert = require("assert");
const path = require("path");
const CardBox = require("../../../dist/cardbox.cjs.js");
const fs = require("fs-extra");

const test_update = async () => {
	const dir_path = path.resolve(__dirname, "./data/");
	const cb = new CardBox({ path: dir_path });

	await cb.init();

	// Create a card
	let namey = await cb.create({
		id: "12345",
		name: "Namey McNameFace"
	});


	namey = await cb.update(Object.assign({}, namey, { name: "Namey von NameFace" }));
	assert.strictEqual(namey.id, "12345");
	assert.strictEqual(namey.name, "Namey von NameFace");

	const file_namey = await fs.readJson(path.resolve(__dirname, `./data/${namey.id}.json`));
	assert.strictEqual(file_namey.id, "12345");
	assert.strictEqual(file_namey.id, namey.id);
	assert.strictEqual(file_namey.name, "Namey von NameFace");
	assert.notStrictEqual(file_namey.name, "Namey McNameFace");

	// Cleanup
	fs.remove(dir_path);

	console.log('Update ✔');
}

module.exports.test_update = test_update;
