const assert = require("assert");
const path = require("path");
const CardBox = require("../../../dist/cardbox.cjs.js");
const fs = require("fs-extra");

const test_options = async () => {
	// Test nested path
	const dir_path = path.resolve(__dirname, "./data/nested");
	const cb = new CardBox({ path: dir_path });

	await cb.load();

	const cards = cb.read();
	assert.strictEqual(cards.length, 2);

	// Custom spacesand random id
	const new_id = () => String(Math.round(Math.random() * 10000));

	const my_cb_path = path.resolve(__dirname, "./mydata/");

	const my_cb = new CardBox({
		path: my_cb_path,
		spaces: null,
		random: new_id
	});

	await my_cb.init();

	let namey = await my_cb.create({
		name: "Namey McNameFace"
	});

	assert.strictEqual(!isNaN(Number(namey.id)), true);

	const file_namey = await fs.readFile(`${my_cb_path}/${namey.id}.json`, "utf-8");
	assert.strictEqual(file_namey, `{"name":"Namey McNameFace","id":"${namey.id}"}\n`);

	// Cleanup
	fs.remove(my_cb_path);

	console.log('Options ✔');
}

module.exports.test_options = test_options;
