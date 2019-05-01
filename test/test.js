const { performance } = require("perf_hooks");
const { test_create } = require("./specs/create/create.js");
const { test_read } = require("./specs/read/read.js");

(async () => {
	console.clear();
	const start = performance.now();

	await Promise.all([
		test_create(),
		test_read()
	]);

	const end = performance.now();
	console.log(end - start);
})();
