# 🗃️ CardBox
A simple in-memory database with persistant storage in json files.

The main use case is for simple demos and prototypes.

## Terminology
**Card**: is a plain old javascript object in memory and a json-file on the filesystem.

**CardBox**: is a collection of cards that can be manipulated. Cards can be created, read, updated, and deleted from the CardBox.

## Installation
1. `npm install --save cardbox`

## Basic example
```javascript
const CardBox = require('cardbox');

(async () => {
	const cb = new CardBox({ path: "./mydata/" }); // Default path is "./data/"

	// Load all existing card files in the path folder
	cb.load();

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
	const users = await cb.read();

	// Read a specific ucarder
	let user = await cb.read("12345");

	// Update an existing card
	user = await cb.update(Object.assign({}, user, { name: "Namey McNameFace" }));

	// Upsert a new card with update
	const new_user = await cb.update({ name: "Bronald Dingus" });

	// Delete a card
	await cb.delete("12345");
	await cb.delete(randy.id);
	await cb.delete(new_user.id);
})();

```

## Roadmap
1. Add more tests.
2. Add rest and a graphql examples.
3. Publish to NPM.

## Possible future additions
1. Add autosave options with an changes array and a save changes method.
2. Add format options for writing and opening files with optional file endings. And a reformat existing files method.
3. Add option to use custom file extensions other than ".json".

## License
[ISC](LICENSE)
