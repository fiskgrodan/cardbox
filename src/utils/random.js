const default_length = 16;

// Returns a string of X random hexadecimal uppercase characters
export const create_random_id = (length = default_length) => {
	if (length <= 0 || typeof length !== 'number') {
		length = default_length;
	}

	let new_id = "";

	while (length--) {
		new_id += Math.floor(Math.random() * 16 + 1).toString(16).toUpperCase();
	}

	return new_id;
}
