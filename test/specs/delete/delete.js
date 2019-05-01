const assert = require("assert");
const path = require("path");
const CardBox = require("../../../dist/cardbox.cjs.js");
const fs = require("fs-extra");

const test_delete = async () => {
	const dir_path = path.resolve(__dirname, "./data/");
	const cb = new CardBox({ path: dir_path });

	await cb.init();

	const id = "12345";

	// Create a card
	let namey = await cb.create({
		id,
		name: "Namey McNameFace"
	});

	assert.strictEqual(namey.id, id);

	let exists = await fs.pathExists(`${dir_path}/${id}.json`);
	assert.strictEqual(exists, true);

	let result = await cb.delete("12345");
	assert.strictEqual(result, true);

	exists = await fs.pathExists(`${dir_path}/${id}.json`);
	assert.strictEqual(exists, false);

	result = await cb.delete("12345");
	assert.strictEqual(result, false);

	result = await cb.delete("ABCDE");
	assert.strictEqual(result, false);


	// Cleanup
	fs.remove(dir_path);

	console.log('Delete ✔');
}

module.exports.test_delete = test_delete;
