import Phaser from 'phaser';

import { TextBoxModel } from '~/TextBox/TextBox.model';
import { targetFps, debugMode } from '~/global.constants';
import { UpdateInterval } from '~/util/UpdateInterval';

class TextBox extends Phaser.GameObjects.Image {
	constructor (scene, x, y, texture, options) {
		super(scene, x, y, texture);

		this.model = new TextBoxModel({
			scene,
			x,
			y,
			texture,
			...options,
		});
		this.maskAnimInterval = new UpdateInterval(this.model.openCloseRate, () => {
			if (this.state === 'opening') {
				this.onOpening();
			} else if (this.state === 'closing') {
				this.onClosing();
			}
		});
	}

	preUpdate (time, deltaTime) {
		this.maskAnimInterval.poll(deltaTime);
	}

	open () {
		this.state = 'opening';
		this.maskAnimInterval.execute();
	}

	close () {
		this.state = 'closing';
		this.maskAnimInterval.execute();
	}

	moveCursor (direction) {
		const directionMap = {
			up: 0,
			right: 1,
			down: 2,
			left: 3,
		};
		const nextInteractable = this.model.contentModel.selectedItem.item?.nextInteractable?.[directionMap[direction]];

		if (!nextInteractable) {
			return;
		}
		const selectedItem = this.model.contentModel.setSelectedItem(nextInteractable);
		const newSelectorPos = this.model.getTextPosByLineNum(selectedItem.lineNum);

		this.selector.anims.play('selectorShown');
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
		const mask = debugMode ? this.curtainMask : this.curtain;

		mask.y -= 16;
		if (mask.y <= this.model.y) {
			this.state = 'closed';
		}
	}

	onOpening () {
		const mask = debugMode ? this.curtainMask : this.curtain;

		mask.y += 16;
		if (mask.y >= this.model.y + this.model.actualHeight) {
			this.state = 'opened';
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
		this.createBorderTop();
		this.createBorderBody();
		this.createBorderBottom();
	}

	maskGroup = []

	createBorderTop () {
		Array.from({ length: this.model.charWidth }, (_, i) => {
			const x = (this.model.charUnit * i) + this.model.x;
			const { y } = this.model;
			let frameName = 'north';

			if (i === 0) {
				frameName = 'northwest';
			} else if (i === this.model.charWidth - 1) {
				frameName = 'northeast';
			}
			const data = this.model.textureFrames.find(textureFrame => textureFrame.name === frameName);
			const image = this.scene.add.image(x, y, this.model.texture, frameName).setOrigin(0);

			image.flipX = data.flipX;
			image.flipY = data.flipY;
			this.maskGroup.push(image);
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
					image = this.scene.add.rectangle(x, y, this.model.charUnit, this.model.charUnit, 0x000000);
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

	createCurtain () {
		this.curtain = this.scene.make.graphics();
		this.curtain.fillRect(0, 0, this.model.actualWidth, this.model.actualHeight);
		this.curtain.x = this.model.x;
		this.curtain.y = this.model.y;
		this.curtainMask = new Phaser.Display.Masks.GeometryMask(this.scene, this.curtain);
		this.maskGroup.forEach(border => border.setMask(this.curtainMask));
		this.curtainMask.setInvertAlpha();
	}

	createCurtainDebug () {
		// this.curtain = this.scene.make.graphics();
		// this.curtain.fillStyle(0xff0000, 1);
		// this.curtain.fillRect(
		// 	this.model.x,
		// 	this.model.y,
		// 	this.model.actualWidth,
		// 	this.model.actualHeight,
		// );
		// this.curtain.generateTexture('curtain', 100, 100);
		this.curtain = this.scene.add.image(this.model.x, this.model.y, 'curtain').setOrigin(0);
		this.curtain.displayWidth = this.model.actualWidth;
		this.curtain.displayHeight = this.model.actualHeight;
		// this.scene.add.existing(this.curtain);
		this.curtainMask = this.curtain;
	}

	createText () {
		this.model.textWithLineSpacing.forEach((text, i) => {
			const { x, y } = this.model.getTextPosByLineNum();

			this.maskGroup.push(
				this.scene.add.bitmapText(
					x, y + (i * this.model.charUnit),
					this.model.fontKey,
					text,
				),
			);
		});
	}

	createSelector () {
		const selectedMenuItem = this.model.contentModel.selectedItem;
		const cursorPos = this.model.getCursorPosByLineNum(selectedMenuItem.lineNum);

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
		if (debugMode) {
			textbox.createCurtainDebug();
		} else {
			textbox.createCurtain();
		}
		return textbox;
	},
};
