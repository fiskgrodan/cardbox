const fs = require('fs-extra')
const glob = require('glob');
const { create_random_id } = require('./utils/random.js');

// Options
const default_options = {
	path: './data/',
	spaces: 2,
	random: () => create_random_id(5),
	sync: {
		create: true,
		read: false, // Not used currently
		update: true,
		delete: true
	}
};

// CardBox
class CardBox {
	constructor(options = default_options) {
		// Options
		this._options = Object.assign(
			{},
			default_options,
			options,
			{ sync: Object.assign({}, default_options.sync, options.sync) },
			{ format: Object.assign({}, default_options.format, options.format) }
		);

		// Path
		this._options.path += this._options.path.endsWith("/") ? "" : "/";

		// Cards
		this._cards = {};
	};

	// Helpers
	_card_path(path, card_id) {
		return `${path}${card_id}.json`;
	}

	// Init
	async _init() {
		return new Promise(resolve => {
			fs.ensureDir(this._options.path, error => {
				if (error) console.error(error);
				resolve();
			})
		})
	};

	// Load
	async load() {
		await this._init();

		return new Promise(resolve => {
			glob(`${this._options.path}**/*.json`, {}, (error, files) => {
				if (error) console.error(error);

				files.forEach(filePath => {
					const card = fs.readJsonSync(filePath, error => {
						if (error) console.error(error);
					});
					this._cards[card.id] = card;
				});

				resolve(true);
			});
		});
	};

	// Create
	async create(
		new_card = {},
		sync = this._options.sync.create
	) {
		if (!new_card.id) {
			new_card.id = this._options.random();
		}

		return new Promise(resolve => {
			const new_card_path = this._card_path(this._options.path, new_card.id);

			fs.writeJson(
				new_card_path,
				new_card,
				{ spaces: this._options.spaces },
				error => {
					if (error) console.error(error);

					if (sync === true) {
						setTimeout(() => resolve(new_card));
					}
				});

			this._cards[new_card.id] = new_card;

			if (sync === false) {
				setTimeout(() => resolve(new_card));
			}
		})
	}

	// Read
	async read(card_id) {
		return new Promise(resolve => {
			// Read all cards
			if (!card_id) {
				resolve(Object.values(this._cards));
			}

			// Read a specific card
			resolve(this._cards[card_id]);
		})
	}

	// Update
	async update(new_card, sync = this._options.sync.update) {
		return new Promise(async resolve => {
			const created_card = await this.create(new_card, sync);
			resolve(created_card);
		});
	}

	// Delete
	async delete(card_id, sync = this._options.sync.update) {
		return new Promise(resolve => {
			if (!card_id || !this._cards[card_id]) {
				resolve(false)
			}

			const card_path = this._card_path(this._options.path, card_id);

			fs.remove(card_path, error => {
				if (error) console.error(error);

				if (sync === true) {
					resolve(true);
				}
			});

			delete this._cards[card_id]

			if (sync === false) {
				resolve(true);
			}
		});
	}
};

module.exports = CardBox;
