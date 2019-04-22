const assert = require("assert");
const CardBox = require("../../../dist/cardbox.cjs.js");
const fs = require("fs-extra")
const path = require("path");

const test_create = async () => {
	const cb = new CardBox({ path: path.resolve(__dirname, "./data/") });

	cb.init();

	// Create a card
	const namey = await cb.create({
		id: "12345",
		name: "Namey McNameFace"
	});

	assert.strictEqual(namey.id, "12345");
	assert.strictEqual(namey.name, "Namey McNameFace");

	const file_namey = await fs.readJsonSync(path.resolve(__dirname, "./data/12345.json"));
	assert.strictEqual(file_namey.id, "12345");
	assert.strictEqual(file_namey.name, "Namey McNameFace");

	// Create a card with a randomly generated "id"
	const randy = await cb.create({
		name: "Randy McRandom"
	});

	assert.ok(randy.hasOwnProperty("id"));
	assert.ok(randy.id !== undefined);
	assert.ok(randy.id !== null);
	assert.ok(typeof randy.id === "string");
	assert.strictEqual(randy.name, "Randy McRandom");

	const file_randy = await fs.readJsonSync(path.resolve(__dirname, `./data/${randy.id}.json`));
	assert.strictEqual(file_randy.name, "Randy McRandom");
	assert.notStrictEqual(file_randy.name, "foo");

	console.log('Create ✔');
}

module.exports.test_create = test_create;
