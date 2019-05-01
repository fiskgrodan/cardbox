const { performance } = require("perf_hooks");
const { test_options } = require("./specs/options/options.js");
const { test_create } = require("./specs/create/create.js");
const { test_read } = require("./specs/read/read.js");
const { test_update } = require("./specs/update/update.js");
const { test_delete } = require("./specs/delete/delete.js");

(async () => {
	console.clear();
	const start = performance.now();

	await Promise.all([
		test_options(),
		test_create(),
		test_read(),
		test_update(),
		test_delete()
	]);

	const end = performance.now();
	console.log(end - start);
})();
