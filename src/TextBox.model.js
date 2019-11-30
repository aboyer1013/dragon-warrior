class TextBoxModel {
	constructor (options) {
		const config = {
			// width: 192,
			// height: 32,
			width: 'auto',
			height: 'auto',
			padding: [1, 1, 1, 1],
			...options,
		};

		this.width = config.width;
		this.height = config.height;
		this.padding = config.padding;
		this.scene = config.scene;
		this.x = config.x;
		this.y = config.y;
		this.texture = config.texture;

		this.content = [
			{ text: 'first line' },
			{ text: 'second line' },
			{ text: 'third line' },
		];
	}

	charUnit = 8

	get text () {
		return this.content.map(c => c.text);
	}

	get paddingTop () {
		return this.padding[0];
	}

	get paddingRight () {
		return this.padding[1];
	}

	get paddingBottom () {
		return this.padding[2];
	}

	get paddingLeft () {
		return this.padding[3];
	}

	get longestTextLength () {
		let longest = 0;

		this.text.forEach((text) => {
			longest = text.length > longest ? text.length : longest;
		});
		return longest;
	}

	get charWidth () {
		if (this.width === 'auto') {
			return this.paddingLeft + this.paddingRight + this.longestTextLength + 2;
		}
		return this.toCharUnits(this.width);
	}

	get charHeight () {
		if (this.height === 'auto') {
			return this.paddingTop + this.paddingBottom + this.text.length + 2;
		}
		return this.toCharUnits(this.height);
	}

	get actualHeight () {
		return this.toPixels(this.charHeight);
	}

	get actualWidth () {
		return this.toPixels(this.charWidth);
	}

	get textureFrames () {
		const data = [
			{
				name: 'north',
				pos: { x: 0, y: 0 },
				flipX: false,
				flipY: false,
			},
			{
				name: 'northeast',
				pos: { x: 8, y: 0 },
				flipX: true,
				flipY: false,
			},
			{
				name: 'east',
				pos: { x: 16, y: 0 },
				flipX: true,
				flipY: false,
			},
			{
				name: 'southeast',
				pos: { x: 8, y: 0 },
				flipX: true,
				flipY: true,
			},
			{
				name: 'south',
				pos: { x: 0, y: 0 },
				flipX: false,
				flipY: true,
			},
			{
				name: 'southwest',
				pos: { x: 8, y: 0 },
				flipX: false,
				flipY: true,
			},
			{
				name: 'west',
				pos: { x: 16, y: 0 },
				flipX: false,
				flipY: false,
			},
			{
				name: 'northwest',
				pos: { x: 8, y: 0 },
				flipX: false,
				flipY: false,
			},
		];

		return data.map(datum => ({
			...datum,
			width: this.charUnit,
			height: this.charUnit,
		}));
	}

	toCharUnits (measurement) {
		return measurement / this.charUnit;
	}

	toPixels (measurement) {
		return measurement * this.charUnit;
	}
}

export { TextBoxModel };
