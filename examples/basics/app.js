const CardBox = require('../../src/index.js');
const data = require('./data.js');

(async () => {
	// Init
	const cb = new CardBox();

	await cb.load();

	const created = await cb.create({
		name: "Derp Pilkinsson",
		color: "limegreen"
	});

	// Read
	const cards = await cb.read();
	console.log(JSON.stringify(cards, null, 2));

	let card = await cb.read(created.id);
	console.log(JSON.stringify(card, null, 2));

	// Update
	card = await cb.update(Object.assign({}, card, { color: "hotpink" }))
	console.log(JSON.stringify(card, null, 2));

	card = await cb.update(Object.assign({}, card, { color: "skyblue" }))
	console.log(JSON.stringify(card, null, 2));

	// Delete
	setTimeout(async () => {
		const deleted = await cb.delete(created.id);
		console.log({ deleted })
	}, 1337);
})();
