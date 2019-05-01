import fs from "fs-extra";
import glob from "glob";
import { create_random_id } from "./utils/random.js";

// Options
const default_options = {
	path: './data/',
	spaces: 2,
	random: () => create_random_id(6),
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
	_card_path(card_id) {
		return `${this._options.path}${card_id}.json`;
	}

	// Init
	async init() {
		await fs.ensureDir(this._options.path);
	};

	// Load
	async load() {
		await this.init();

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
		new_card = {}
	) {
		if (!new_card.id) {
			new_card.id = this._options.random();
		}

		this._cards[new_card.id] = new_card;

		await fs.writeJson(
			this._card_path(new_card.id),
			new_card,
			{ spaces: this._options.spaces });

		return new_card;
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

			const card_path = this._card_path(card_id);

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
