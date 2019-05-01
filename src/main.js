import fs from "fs-extra";
import glob from "glob";
import { create_random_id } from "./utils/random.js";

// Options
const default_options = {
	path: './data/',
	spaces: 2,
	random: () => create_random_id(6)
};

// CardBox
class CardBox {
	constructor(options = default_options) {
		// Options
		this._options = Object.assign(
			{},
			default_options,
			options
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
			glob(`${this._options.path}**/*.json`, {}, async (_, files) => {
				await Promise.all(files.map(async file_path => {
					const card = await fs.readJson(file_path);
					this._cards[card.id] = card;
				}))

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

		await fs.writeJson(
			this._card_path(new_card.id),
			new_card,
			{ spaces: this._options.spaces });

		this._cards[new_card.id] = new_card;

		return new_card;
	}

	// Read
	read(card_id) {
		// Read all cards
		if (!card_id) {
			return Object.values(this._cards);
		}

		// Read a specific card
		return this._cards[card_id]
	}

	// Update
	async update(new_card) {
		// Upsert the card
		const upserted_card = await this.create(new_card);

		return upserted_card;
	}

	// Delete
	async delete(card_id) {
		if (!card_id || !this._cards[card_id]) {
			return false;
		}

		await fs.remove(this._card_path(card_id));
		delete this._cards[card_id];

		return true;
	}
};

export default CardBox;
