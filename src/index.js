const fs = require('fs-extra')
const glob = require('glob');
const { create_random_id } = require('./utils/random.js');

// Options
const default_options = {
	path: './data/',
	spaces: 2, // TODO: null by default?
	random: () => create_random_id(5), // TODO: use 16 or 12 by default?
	cache: true, // TODO: use this
	autosave: true,
	sync: {
		create: false,
		read: true,
		update: true,
		delete: true
	},
	format: {
		write: null,
		open: null
	}
};

// CardBox
class CardBox {
	constructor(options = default_options) {
		// Options
		this.options = Object.assign(
			{},
			default_options,
			options,
			{ sync: Object.assign({}, default_options.sync, options.sync) },
			{ format: Object.assign({}, default_options.format, options.format) }
		);

		// Path
		this.options.path += this.options.path.endsWith("/") ? "" : "/";

		// Cards
		this.cards = {};

		// Changed
		this.changed = [];
	};

	// Helpers
	card_path(path, card_id) {
		return `${path}${card_id}.json`;
	}

	// Init
	async init() {
		return new Promise(resolve => {
			fs.ensureDir(this.options.path, error => {
				if (error) console.error(error);
				resolve();
			})
		})
	};

	// Load
	async load() {
		await this.init();

		return new Promise(resolve => {
			glob(`${this.options.path}**/*.json`, {}, (error, files) => {
				if (error) console.error(error);

				files.forEach(filePath => {
					const card = fs.readJsonSync(filePath, error => {
						if (error) console.error(error);
						resolve(false);
					});
					this.cards[card.id] = card;
				});

				resolve(true);
			});
		});
	};

	// Save
	async save() {
		return new Promise(resolve => {
			this.changed.forEach(card_id => {
				if (this.cards[card_id]) {
					fs.writeJsonSync(
						new_card_path,
						new_card,
						{ spaces: this.options.spaces },
						error => {
							if (error) console.error(error);
							resolve(false);
						});
				}
			})

			this.changed = [];
			resolve(true);
		});
	}

	// Create
	async create(
		new_card = {}
	) {
		if (!new_card.id) {
			new_card.id = this.options.random();
		}

		return new Promise(resolve => {
			const new_card_path = this.card_path(this.options.path, new_card.id);

			fs.writeJson(
				new_card_path,
				new_card,
				{ spaces: this.options.spaces },
				error => {
					if (error) console.error(error);

					// TODO: create sync resolve here
				});

			this.cards[new_card.id] = new_card;
			resolve(new_card);
		})
	}

	// Read
	async read(card_id) {
		return new Promise(resolve => {
			// Read all cards
			if (!card_id) {
				resolve(Object.values(this.cards));
			}

			// Read a specific card
			resolve(this.cards[card_id]);
		})
	}

	// Update
	async update(new_card) {
		return new Promise(async resolve => {
			const created_card = await this.create(new_card);
			resolve(created_card);
		});
	}

	// Delete
	async delete(card_id) {
		return new Promise(resolve => {
			if (!card_id || !this.cards[card_id]) {
				resolve(false)
			}

			const card_path = this.card_path(this.options.path, card_id);

			fs.remove(card_path, error => {
				if (error) console.error(error);

				// TODO: delete sync resolve here
			});

			resolve(delete this.cards[card_id]);
		});
	}
};

module.exports = CardBox;