const { performance } = require("perf_hooks");
const CheapWatch = require("cheap-watch");
const { test_create } = require("./specs/create/create.js");

const test = async () => {
  console.clear();

  const start = performance.now();

	await test_create();
  
  const end = performance.now();
  console.log(end - start);
}

const watch = async () => {
	// Run tests initially
	await test();

	// Watch dist changes
  const dist_watch = new CheapWatch({ 
    dir: './dist/', 
    debounce: 0,
    filter: ({path}) => path === 'cardbox.cjs.js'
  });
	await dist_watch.init();
	dist_watch.on('+', async () => await test());
}

watch();
