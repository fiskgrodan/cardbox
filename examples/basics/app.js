const CardBox = require('../../dist/cardbox.cjs.js');
const data = require('./data.js');

const recreate = false;

(async () => {
	// Init
	const cb = new CardBox();

	await cb.load();

	// Create
	if (recreate) {
		data.forEach(async card => {
			await cb.create(card);
		})
	}

	const created = await cb.create({
		name: "Derp Pilkinsson",
		color: "limegreen"
	});

	// Read
	const cards = cb.read();
	console.log(JSON.stringify(cards, null, 2));

	let card = cb.read(created.id);
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
	}, 0);
})();
