import Phaser from 'phaser';

import { debugMode } from '~/global.constants';

class CurtainMask {
	constructor (scene, x, y, width, height, appliedObjects, options) {
		const config = {
			invertAlpha: true,
			...options,
		};

		this.scene = scene;
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.appliedObjects = appliedObjects || [];
		this.config = config;
	}

	createCurtain () {
		this.curtain = this.scene.make.graphics();
		this.curtain.fillRect(0, 0, this.width, this.height);
		this.curtain.x = this.x;
		this.curtain.y = this.y;
		this.curtainMask = new Phaser.Display.Masks.GeometryMask(this.scene, this.curtain);
		if (this.config.invertAlpha) {
			this.curtainMask.setInvertAlpha();
		}
	}

	clearMask () {
		this.appliedObjects.forEach(obj => obj.clearMask());
	}

	setMask () {
		this.appliedObjects.forEach(obj => obj.setMask(this.curtainMask));
	}

	createCurtainDebug () {
		this.curtain = this.scene.add.image(this.x, this.y, 'curtain').setOrigin(0);
		this.curtain.displayWidth = this.width;
		this.curtain.displayHeight = this.height;
	}
}

export const CurtainMaskFactory = {
	create (scene, x, y, width, height, appliedObjects, options) {
		const curtainMask = new CurtainMask(scene, x, y, width, height, appliedObjects, options);

		if (debugMode) {
			curtainMask.createCurtainDebug();
		} else {
			curtainMask.createCurtain();
		}
		return curtainMask;
	},
};
