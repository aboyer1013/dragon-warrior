import isString from 'lodash/isString';

import { TextBoxContentModel } from '~/TextBox/TextBoxContent.model';
import { targetFps } from '~/global.constants';

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
			useMask: true,
			title: '',
			...options,
		};

		this.title = config.title;
		this.width = config.width;
		this.height = config.height;
		this.padding = config.padding;
		this.scene = config.scene;
		this.x = config.x;
		this.y = config.y;
		this.texture = config.texture;
		this.active = config.active;
		this.selectorTextureKey = config.selectorTextureKey;
		this.useMask = config.useMask;
		this.contentModel = new TextBoxContentModel({
			x: this.x,
			y: this.y,
			content: config.content,
		});
	}

	charUnit = 8

	fontKey = 'font'

	openCloseRate = (1 / targetFps) * 1000

	lineSpacing = 2

	get titleCharIndices () {
		const result = Array(this.charWidth);

		if (!this.title) {
			return result;
		}
		const borderLen = this.charWidth - this.title.length;
		const start = Math.ceil(borderLen / 2);
		const titleArr = this.title.split('');

		for (let i = start; i < this.charWidth; i += 1) {
			result[i] = titleArr.shift();
		}
		return result;
	}

	get numBlankLines () {
		return (this.lineSpacing - 1) * (this.numLines - 1);
	}

	get numLinesWithLineSpacing () {
		return this.numLines + this.numBlankLines;
	}

	get numLines () {
		let totalLen = 0;

		this.text.forEach((val) => {
			if (isString(val)) {
				totalLen += 1;
			} else {
				totalLen += val.length;
			}
		});
		return totalLen;
	}

	get text () {
		return this.contentModel.content.items.map((item) => {
			if (isString(item) || Array.isArray(item)) {
				return item;
			}
			return item.text;
		});
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

	getCursorPosBySelectedItemPos (selectedItem) {
		const { x, y } = this.getTextPosByLineNum(0);
		const { charPos } = selectedItem.item;
		const charX = this.toCharUnits(x);
		const charY = this.toCharUnits(y);
		const finalX = charX + charPos.x - 1;
		const finalY = charY + charPos.y;

		return {
			x: this.toPixels(finalX),
			y: this.toPixels(finalY),
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
			if (Array.isArray(text)) {
				text.forEach((innerText) => {
					longest = Math.max(innerText.length, longest);
				});
			} else {
				longest = Math.max(text.length, longest);
			}
		});
		longest = Math.max(this.title?.length, longest);
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
				name: 'blank',
				pos: { x: 0, y: 0 },
				flipX: false,
				flipY: false,
			},
			{
				name: 'northTitle',
				pos: { x: 40, y: 0 },
				flipX: false,
				flipY: false,
			},
			{
				name: 'north',
				pos: { x: 8, y: 0 },
				flipX: false,
				flipY: false,
			},
			{
				name: 'northeast',
				pos: { x: 16, y: 0 },
				flipX: true,
				flipY: false,
			},
			{
				name: 'east',
				pos: { x: 24, y: 0 },
				flipX: true,
				flipY: false,
			},
			{
				name: 'southeast',
				pos: { x: 16, y: 0 },
				flipX: true,
				flipY: true,
			},
			{
				name: 'south',
				pos: { x: 8, y: 0 },
				flipX: false,
				flipY: true,
			},
			{
				name: 'southwest',
				pos: { x: 16, y: 0 },
				flipX: false,
				flipY: true,
			},
			{
				name: 'west',
				pos: { x: 24, y: 0 },
				flipX: false,
				flipY: false,
			},
			{
				name: 'northwest',
				pos: { x: 16, y: 0 },
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
