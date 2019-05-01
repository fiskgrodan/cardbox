const CardBox = require('../../dist/cardbox.cjs.js');

(async () => {
	const cb = new CardBox({ path: "./mydata/" }); // Default path is "./data/"

	// Load all existing card files in the path folder
	await cb.load();

	// Create a card
	const namey = await cb.create({
		id: "12345",
		name: "Namey McName"
	});
	console.log(namey);

	// Create a card with a randomly generated "id"
	const randy = await cb.create({
		name: "Randy McRandom"
	});

	// Read all cards as an array of cards
	const users = cb.read();

	// Read a specific ucarder
	let user = cb.read("12345");

	// Update an existing card
	user = await cb.update(Object.assign({}, user, { name: "Namey McNameFace" }));

	// Upsert a new card with update
	const new_user = await cb.update({ name: "Bronald Dingus" });

	// Delete a card
	await cb.delete("12345");
	await cb.delete(randy.id);
	await cb.delete(new_user.id);
})();
