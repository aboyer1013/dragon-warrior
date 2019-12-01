import { TextBoxContentModel } from '~/TextBox/TextBoxContent.model';

class TextBoxModel {
	constructor (options) {
		const config = {
			// width: 192,
			// height: 32,
			width: 'auto',
			height: 'auto',
			padding: [1, 1, 0, 1],
			active: true,
			selectorTextureKey: 'selector',
			...options,
		};

		this.width = config.width;
		this.height = config.height;
		this.padding = config.padding;
		this.scene = config.scene;
		this.x = config.x;
		this.y = config.y;
		this.texture = config.texture;
		this.active = config.active;
		this.selectorTextureKey = config.selectorTextureKey;
		this.contentModel = new TextBoxContentModel({
			x: this.x,
			y: this.y,
			content: config.content,
		});
	}

	charUnit = 8

	fontKey = 'font'

	openCloseRate = 16.6667

	lineSpacing = 2

	get numBlankLines () {
		return (this.lineSpacing - 1) * (this.numLines - 1);
	}

	get numLinesWithLineSpacing () {
		return this.numLines + this.numBlankLines;
	}

	get numLines () {
		return this.text.length;
	}

	get text () {
		return this.contentModel.content.items.map(c => c.text);
	}

	get textWithLineSpacing () {
		const result = [];

		if (!this.numBlankLines) {
			return this.text;
		}
		this.text.forEach((text, i) => {
			result.push(text);
			if (i !== this.text.length - 1) {
				Array.from({ length: this.lineSpacing - 1 }, () => result.push(''));
			}
		});
		return result;
	}

	getTextPosByLineNum (lineNum = 0) {
		const borderLeft = 1;
		const borderTop = 1;
		const lineSpacing = lineNum > 0 ? this.lineSpacing * lineNum : 0;

		return {
			x: this.x + this.toPixels(this.paddingLeft + borderLeft),
			y: this.y + this.toPixels(this.paddingTop + borderTop + lineSpacing),
		};
	}

	getCursorPosByLineNum (lineNum = 0) {
		const textPos = this.getTextPosByLineNum(lineNum);

		return {
			x: textPos.x - this.charUnit,
			y: textPos.y,
		};
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
			const leftRightBorder = 2;

			return this.paddingLeft + this.paddingRight + this.longestTextLength + leftRightBorder;
		}
		return this.toCharUnits(this.width);
	}

	get charHeight () {
		if (this.height === 'auto') {
			const topBottomBorder = 2;

			return this.paddingTop + this.paddingBottom + this.numLinesWithLineSpacing + topBottomBorder;
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
