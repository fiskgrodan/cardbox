const fs = require('fs-extra')
const glob = require('glob');
const { create_random_id } = require('./utils/random.js');

const default_options = {
	path: './data/',
	spaces: 2, // TODO: null by default?
	random: () => create_random_id(5), // TODO: use 16 by default
	cache: true, // TODO: use this
	truth: 'memory' // TODO: use this
};

class CardBox {
	// Init
	constructor(options = default_options) {
		// Options
		this.options = Object.assign({}, default_options, options);

		// Path
		this.options.path += this.options.path.endsWith("/") ? "" : "/";

		// Cards
		this.cards = {};
	};

	async init() {
		return new Promise(resolve => {
			fs.ensureDir(this.options.path, error => {
				if (error) console.error(error);
				resolve();
			})
		})
	};

	async load() {
		await this.init();

		return new Promise(resolve => {
			glob(`${this.options.path}**/*.json`, {}, (error, files) => {
				if (error) console.error(error);

				files.forEach(filePath => {
					const card = fs.readJsonSync(filePath);
					this.cards[card.id] = card;
				});

				resolve();
			});
		});
	};

	// Create
	async create(
		new_card = {}
	) {
		if (!new_card.id) {
			new_card.id = this.options.random();
		}

		return new Promise(resolve => {
			const new_card_path = `${this.options.path}${new_card.id}.json`;

			fs.outputJson(
				new_card_path,
				new_card,
				{ spaces: this.options.spaces },
				error => {
					if (error) console.error(error);
				});

			this.cards[new_card.id] = new_card;
			resolve(new_card);
		})
	}

	// Read
	async read(card_id) {
		return new Promise(resolve => {
			if (!card_id) {
				resolve(Object.values(this.cards));
			}
			 resolve(this.cards[card_id]);
		})
	}

	// Update

};

module.exports = CardBox;
