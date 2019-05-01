const assert = require("assert");
const path = require("path");
const CardBox = require("../../../dist/cardbox.cjs.js");

const test_read = async () => {
	const dir_path = path.resolve(__dirname, "./data/");
	const cb = new CardBox({ path: dir_path });
	await cb.load();

	const all = cb.read();
	assert.strictEqual(all.length, 2);

	const foo = cb.read("AAAAAA");
	assert.strictEqual(foo.id, "AAAAAA");
	assert.strictEqual(foo.name, "foo");

	const bar = cb.read("BBBBBB");
	assert.strictEqual(bar.id, "BBBBBB");
	assert.strictEqual(bar.name, "bar");

	console.log('Read ✔');
}

module.exports.test_read = test_read;
