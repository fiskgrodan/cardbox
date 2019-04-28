const generate_random_object = () => ({
	foo: Math.random(),
	bar: Math.random(),
	baz: Math.random()
});

const generate_random_objects = (count = 10) => {
	const objects = [];

	while (count--) {
		objects.push(generate_random_object());
	}

	return objects;
}

module.exports = {
	generate_random_object,
	generate_random_objects
}