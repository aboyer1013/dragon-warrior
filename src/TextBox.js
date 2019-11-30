import Phaser from 'phaser';

import { TextBoxModel } from '~/TextBox.model';

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
	}

	preUpdate (time, delta) {
		// console.log(time, delta);
		/*
		10713.679999986198 6.844000000273809
		10720.66500002984 6.93950000568293
		10727.019999991171 6.878500001039356
		10734.105000039563 6.879500002833083
		10741.455000010319 6.92200000048615
		10748.680000018794 6.94700000458397
		10755.645000026561 6.999500002712011
		*/
		return;
		if (this.state === 'opening') {
			// const rate = 0.0167;
			const rate = 16.6667;
			const mask = this.curtainMask.geometryMask;

			if (mask.y >= this.model.actualHeight) {
				return false;
			}
			if (mask.y === this.model.y) {
				mask.y += 16;
				return this.open();
			}
			return this.scene.time.delayedCall(rate, () => {
				mask.y += 16;
				this.open();
			}, this);
		}
	}

	open () {
		this.state = 'opening';
	}

	close () {
		const mask = this.curtainMask.geometryMask;

		if (mask.y <= this.model.y) {
			return false;
		}
		if (mask.y === this.model.y) {
			mask.y -= 16;
			return true;
		}
		return this.scene.time.delayedCall(16.6667, () => {
			mask.y += 16;
			this.close();
		}, this);
	}

	raiseCurtain () {
		this.curtainMask.geometryMask.y += 16;
	}

	createTextureFrames () {
		this.model.textureFrames.forEach((textureFrame) => {
			const {
				name, pos, width, height,
			} = textureFrame;
			this.scene.textures.get(this.model.texture).add(name, 0, pos.x, pos.y, width, height);
		});
	}

	addBorder () {
		this.addBorderTop();
		this.addBorderBody();
		this.addBorderBottom();
	}

	borders = []

	addBorderTop () {
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
			this.borders.push(image);
			return true;
		});
	}

	addBorderBody () {
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
				this.borders.push(image);
				return true;
			});
			return true;
		});
	}

	addBorderBottom () {
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
			this.borders.push(image);
			return true;
		});
	}

	createCurtain () {
		this.curtain = this.scene.make.graphics();
		this.curtainMask = new Phaser.Display.Masks.GeometryMask(this.scene, this.curtain.fillRect(this.model.x, this.model.y, this.model.actualWidth, this.model.actualHeight));
		this.borders.forEach(border => border.setMask(this.curtainMask));
		this.curtainMask.setInvertAlpha();
	}

	init () {
		console.log('init');
	}

	preload () {
		console.log('preload');
	}

	create () {
		console.log('create');
	}
}

export const TextBoxFactory = {
	create (scene, x, y, texture, options) {
		const textbox = new TextBox(scene, x, y, texture, options);

		textbox.createTextureFrames();
		textbox.addBorder();
		textbox.createCurtain();
		return textbox;
	},
};
