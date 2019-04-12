const CardBox = require('../../src/index.js');
const data = require('./data.js');

(async () => {
	// Init
	const cb = new CardBox();
	
	await cb.init();
	await cb.load();

	// Create
	data.forEach(async card => {
		await cb.create(card);
	})

	const created = await cb.create({
		name: "Derp Pilkinsson",
		color: "limegreen"
	});

	// Read
	const cards = await cb.read();
	console.log(JSON.stringify(cards, null, 2));

	const card = await cb.read('AA123');
	console.log(JSON.stringify(card, null, 2));

	// Update

	// Delete
	await cb.delete(created.id);
})();
