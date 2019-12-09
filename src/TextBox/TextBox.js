import Phaser from 'phaser';

import { TextBoxModel } from '~/TextBox/TextBox.model';
import { targetFps } from '~/global.constants';
import { UpdateInterval } from '~/util/UpdateInterval';
import { CurtainMaskFactory } from '~/util/CurtainMask';

class TextBox extends Phaser.GameObjects.Image {
	constructor (scene, x, y, texture, options) {
		super(scene, x, y, texture);

		this.model = new TextBoxModel({
			scene,
			x,
			y,
			texture,
			useMask: true,
			...options,
		});
		this.maskAnimInterval = new UpdateInterval(this.model.openCloseRate, () => {
			switch (this.state) {
				case 'opening':
					this.onOpening();
					break;
				case 'closing':
					this.onClosing();
					break;
				default:
					break;
			}
		});
	}

	preUpdate (time, deltaTime) {
		this.maskAnimInterval.poll(deltaTime);
		if (this.inputSelector) {
			this.inputSelector.x = this.model.inputSelectorPos.x;
			this.inputSelector.y = this.model.inputSelectorPos.y;
		}
	}

	open (playSfx = true) {
		this.state = 'opening';
		this.maskAnimInterval.execute();
		if (playSfx) {
			this.scene.sfx.play('menuConfirm');
		}
	}

	get isClosed () {
		return this.state === 'closed';
	}

	get isOpen () {
		return this.state === 'opened';
	}

	quickOpen () {
		this.state = 'opened';
		if (this.model.useMask) {
			this.curtainMask.curtain.y = this.model.y + this.model.actualHeight;
		}
	}

	close () {
		this.state = 'closing';
		if (this.model.useMask) {
			this.maskAnimInterval.execute();
		}
	}

	quickClose () {
		this.state = 'closed';
		if (this.model.useMask) {
			this.curtainMask.curtain.y = this.model.y;
		}
	}

	moveCursor (direction) {
		const directionMap = {
			up: 0,
			right: 1,
			down: 2,
			left: 3,
		};
		const nextInteractable = this.model.contentModel.selectedItem.item?.nextInteractable?.[directionMap?.[direction]];

		if (!nextInteractable) {
			return;
		}
		const selectedItem = this.model.contentModel.setSelectedItem(nextInteractable);
		let newSelectorPos;

		if (this.model.contentModel.isLayoutExplicit) {
			newSelectorPos = this.model.getCursorPosBySelectedItemPos(selectedItem);
		} else {
			newSelectorPos = this.model.getTextPosByLineNum(selectedItem.lineNum);
			newSelectorPos.x -= this.model.charUnit;
		}

		this.selector.anims.play('selectorShown');
		this.selector.x = newSelectorPos.x;
		this.selector.y = newSelectorPos.y;
		this.selector.anims.play('selectorBlinking');
	}

	moveCursorUp () {
		this.moveCursor('up');
	}

	moveCursorRight () {
		this.moveCursor('right');
	}

	moveCursorDown () {
		this.moveCursor('down');
	}

	moveCursorLeft () {
		this.moveCursor('left');
	}

	onClosing () {
		if (!this.model.useMask) {
			return;
		}
		const mask = this.curtainMask.curtain;

		mask.y -= 16;
		if (mask.y <= this.model.y) {
			this.state = 'closed';
			this.emit('closed');
			this.scene.time.delayedCall(this.model.openCloseRate, () => {
				this.emit('afterClosed');
			});
		}
	}

	onOpening () {
		if (!this.model.useMask) {
			return;
		}
		const mask = this.curtainMask.curtain;

		mask.y += 16;
		if (mask.y >= this.model.y + this.model.actualHeight) {
			this.state = 'opened';
			this.emit('opened');
			this.scene.time.delayedCall(this.model.openCloseRate, () => {
				this.emit('afterOpened');
			});
		}
	}

	createTextureFrames () {
		this.model.textureFrames.forEach((textureFrame) => {
			const {
				name, pos, width, height,
			} = textureFrame;
			this.scene.textures.get(this.model.texture).add(name, 0, pos.x, pos.y, width, height);
		});
	}

	createBorder () {
		this.createBorderBody();
		this.createBorderTop();
		this.createBorderBottom();
	}

	maskGroup = []

	getBorderTopFrameNameByCharIdx (idx) {
		let frameName = 'north';
		const titleStartIdx = this.model.titleCharIndices.findIndex(item => Boolean(item));

		if (titleStartIdx === 0) {
			console.warn('Missing frame: northwestTitle');
		} else if (idx === titleStartIdx - 1) {
			frameName = 'northTitle';
		} else if (idx === 0) {
			frameName = 'northwest';
		} else if (idx === this.model.charWidth - 1) {
			frameName = 'northeast';
		}
		return frameName;
	}

	createBorderTop () {
		Array.from({ length: this.model.charWidth }, (_, i) => {
			const x = (this.model.charUnit * i) + this.model.x;
			const { y } = this.model;
			const writeTitleInstead = Boolean(this.model.titleCharIndices[i]);
			const frameName = this.getBorderTopFrameNameByCharIdx(i);
			let data;
			let image;

			if (writeTitleInstead) {
				this.maskGroup.push(
					this.scene.add.bitmapText(x, y, this.model.fontKey, this.model.titleCharIndices[i]),
				);
			} else {
				data = this.model.textureFrames.find(textureFrame => textureFrame.name === frameName);
				image = this.scene.add.image(x, y, this.model.texture, frameName).setOrigin(0);
				image.flipX = data.flipX;
				image.flipY = data.flipY;
				this.maskGroup.push(image);
			}

			return true;
		});
	}

	createBorderBody () {
		Array.from({ length: this.model.charHeight - 2 }, (_, i) => {
			Array.from({ length: this.model.charWidth }, (__, j) => {
				const x = (this.model.charUnit * j) + this.model.x;
				const y = (this.model.charUnit * i) + this.model.y + this.model.charUnit;
				const frameName = j === 0 ? 'west' : 'east';
				const data = this.model.textureFrames.find(textureFrame => textureFrame.name === frameName);
				let image;

				if (j === 0 || j === this.model.charWidth - 1) {
					image = this.scene.add.image(x, y, this.model.texture, frameName).setOrigin(0);
					image.flipX = data.flipX;
					image.flipY = data.flipY;
				} else {
					// image = this.scene.add.rectangle(x, y, this.model.charUnit, this.model.charUnit, 0x000000);
					image = this.scene.add.image(x, y, this.model.texture, 'blank').setOrigin(0);
				}
				this.maskGroup.push(image);
				return true;
			});
			return true;
		});
	}

	createBorderBottom () {
		Array.from({ length: this.model.charWidth }, (_, i) => {
			const x = (this.model.charUnit * i) + this.model.x;
			const y = (this.model.charUnit * (this.model.charHeight - 1)) + this.model.y;
			let frameName = 'south';

			if (i === 0) {
				frameName = 'southwest';
			} else if (i === this.model.charWidth - 1) {
				frameName = 'southeast';
			}
			const data = this.model.textureFrames.find(textureFrame => textureFrame.name === frameName);
			const image = this.scene.add.image(x, y, this.model.texture, frameName).setOrigin(0);

			image.flipX = data.flipX;
			image.flipY = data.flipY;
			this.maskGroup.push(image);
			return true;
		});
	}

	createText () {
		if (this.model.contentModel.layoutType === 'explicit') {
			this.createExplicitText();
		} else if (this.model.isInputType) {
			const { x, y } = this.model.getTextPosByLineNum();

			this.maskGroup.push(
				this.scene.add.bitmapText(x, y, this.model.fontKey, this.model.inputTextWithPadding),
			);
		} else {
			this.model.textWithLineSpacing.forEach((text, i) => {
				const { x, y } = this.model.getTextPosByLineNum();
				const bmText = this.scene.add.bitmapText(
					x, y + (i * this.model.charUnit),
					this.model.fontKey,
					text,
				);

				// bmText.fontData
				this.maskGroup.push(bmText);
			});
		}
	}

	createExplicitText () {
		this.model.contentModel.content.items.forEach((item, i) => {
			const { x, y } = this.model.getTextPosByLineNum();
			const { x: charX, y: charY } = item.charPos;
			const posX = this.model.toCharUnits(x);
			const posY = this.model.toCharUnits(y);
			const finalX = posX + charX;
			const finalY = posY + charY;
			const actualX = this.model.toPixels(finalX);
			const actualY = this.model.toPixels(finalY);

			this.maskGroup.push(
				this.scene.add.bitmapText(actualX, actualY, this.model.fontKey, item.text),
			);
		});
	}

	setMask () {
		this.maskGroup.forEach(obj => obj.setMask());
	}

	clearMask () {
		this.maskGroup.forEach(obj => obj.clearMask());
	}

	createSelector () {
		const selectedMenuItem = this.model.contentModel.selectedItem;
		let cursorPos;

		if (this.model.contentModel.isLayoutExplicit) {
			cursorPos = this.model.getCursorPosBySelectedItemPos(selectedMenuItem);
		} else {
			cursorPos = this.model.getCursorPosByLineNum(selectedMenuItem.lineNum);
		}

		this.scene.anims.create({
			key: 'selectorShown',
			frames: this.scene.anims.generateFrameNumbers('uiSprite', { frames: [4] }),
			frameRate: targetFps,
			repeat: -1,
		});
		this.scene.anims.create({
			key: 'selectorBlinking',
			frames: this.scene.anims.generateFrameNumbers('uiSprite', { frames: [4, 0] }),
			frameRate: targetFps / 16,
			repeat: -1,
		});
		this.selector = this.scene.add.sprite(cursorPos.x, cursorPos.y, this.model.selectorTextureKey).setOrigin(0);
		this.selector.play('selectorBlinking');
		this.maskGroup.push(this.selector);
	}

	createInputSelector () {
		this.inputSelector = this.scene.add.image(
			this.model.inputSelectorPos.x,
			this.model.inputSelectorPos.y,
			this.model.texture,
			'north',
		);
		this.inputSelector.setOrigin(0).setVisible(false);
		this.maskGroup.push(this.inputSelector);
	}

	showInputSelector () {
		this.inputSelector.setVisible(true);
	}
}

export const TextBoxFactory = {
	create (scene, x, y, texture, options) {
		const textbox = new TextBox(scene, x, y, texture, options);

		textbox.createTextureFrames();
		textbox.createBorder();
		textbox.createText();
		if (textbox.model.contentModel.hasInteractableItems) {
			textbox.createSelector();
		}
		if (textbox.model.isInputType) {
			textbox.createInputSelector();
		}
		if (textbox.model.useMask) {
			textbox.curtainMask = CurtainMaskFactory.create(
				textbox.model.scene,
				textbox.model.x,
				textbox.model.y,
				textbox.model.actualWidth,
				textbox.model.actualHeight,
				textbox.maskGroup,
			);
		}
		return textbox;
	},
};
