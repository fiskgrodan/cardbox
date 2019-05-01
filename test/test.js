const { performance } = require("perf_hooks");
const { test_create } = require("./specs/create/create.js");

const test = async () => {
	console.clear();

	const start = performance.now();

	await test_create();

	const end = performance.now();
	console.log(end - start);
}
