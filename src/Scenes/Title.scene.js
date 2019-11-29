import Phaser from 'phaser';
import times from 'lodash/times';
import fill from 'lodash/fill';

import border from '~/assets/title-border.png';
import copyright from '~/assets/title-copyright.png';
import dragonHead from '~/assets/title-dragon-head.png';
import title from '~/assets/title-dragon-warrior.png';
import rock from '~/assets/title-rock.png';
import glint from '~/assets/title-glint.png';
import overture from '~/assets/bgm/overture.mp3';
import { overtureJson } from '~/assets/bgm/overture';
import { volume } from '~/global.constants';

class TitleScene extends Phaser.Scene {
	constructor () {
		super({
			key: 'TitleScene',
		});
	}

	introStarted = false

	copyrightStarted = false

	dragonHeaderStarted = false

	glintStarted = false

	get hasEverythingStarted () {
		return this.introStarted && this.copyrightStarted && this.dragonHeadStarted && this.glintStarted;
	}

	preload () {
		this.load.image('border', border);
		this.load.image('copyright', copyright);
		this.load.image('dragonHead', dragonHead);
		this.load.image('title', title);
		this.load.image('rock', rock);
		this.load.spritesheet({
			key: 'glint',
			url: glint,
			frameConfig: {
				frameWidth: 36,
				frameHeight: 60,
			},
		});
		this.load.audioSprite('overture', overtureJson, overture);
	}

	create () {
		const sound = this.sound.addAudioSprite('overture', { volume });

		sound.play('intro');
		sound.on('complete', () => {
			sound.play('bgLoop');
		});
		this.initEvents();
		this.createTitle();
		this.copyright = this.add.image(24, 144, 'copyright').setOrigin(0).setVisible(false);
		this.dragonHead = this.add.image(33, 53, 'dragonHead').setOrigin(0).setVisible(false);
		this.createGlint();
	}

	initEvents () {
		this.time.delayedCall(0.0167, this.onIntroStart.bind(this));
		this.time.delayedCall(10333.3333, this.onCopyrightStart.bind(this));
		this.time.delayedCall(10350, this.onDragonHeadStart.bind(this));
		this.time.delayedCall(10900, this.onGlintStart.bind(this));
		this.input.keyboard.on('keyup-FORWARD_SLASH', () => {
			if (!this.hasEverythingStarted) {
				this.onCopyrightStart();
				this.onDragonHeadStart();
				this.onGlintStart();
				this.titleScreenFull = true;
			} else {
				this.scene.transition({
					target: 'MainMenuScene',
					transition: 400,
					onUpdate: this.transitionOut,
					onUpdateScope: this,
				});
				this.sound.stopAll();
			}
		});
		this.events.on(Phaser.Scenes.Events.TRANSITION_COMPLETE, () => {
			console.log('title trans complete!');
		});
	}

	transitionOut () {
		if (this.curtain) {
			this.curtain.setPosition(0, 0);
		} else {
			this.time.delayedCall(0.0167, () => {
				this.curtain = this.add.rectangle(0, 36, 240, 224, 0x000000).setOrigin(0);
			});
		}
	}

	createTitle () {
		const titleChildren = [];

		// top border
		times(30, (x) => {
			titleChildren.push(this.add.image(8 * x, 34, 'border'));
		});
		// rock texture
		times(5, (y) => {
			times(15, (x) => {
				titleChildren.push(this.add.image(16 * x, 40 + (16 * y), 'rock'));
			});
		});
		// bottom border
		times(30, (x) => {
			titleChildren.push(this.add.image(8 * x, 121, 'border'));
		});
		titleChildren.push(this.add.image(16, 72, 'title'));
		this.titleGroup = this.add.group(titleChildren).setVisible(false);
		this.titleGroup.getChildren().forEach(child => child.setOrigin(0));
	}

	createGlint () {
		const glintSlow = [0, 1, 1, 2, 2, 2, 2, 3, 3, 3, 4, 4, 4, 4, 4, 4, 3, 3, 3, 3, 2, 2, 1, 1];
		const glintIdle = fill(Array(104), 0);
		const glintFast = [0, 1, 2, 2, 3, 3, 4, 4, 4, 3, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 3, 3, 4, 4, 4, 3, 2, 1, 0];

		this.anims.create({
			key: 'glint',
			frames: this.anims.generateFrameNumbers('glint', { frames: glintSlow.concat(glintIdle, glintFast, glintIdle) }),
			frameRate: 60,
			repeat: -1,
		});
		this.glint = this.add.sprite(173, 52, 'glint').setOrigin(0).setVisible(false);
		this.glint.play('glint');
	}

	onIntroStart () {
		this.titleGroup.setVisible(true);
		this.introStarted = true;
	}

	onCopyrightStart () {
		this.copyright.setVisible(true);
		this.copyrightStarted = true;
	}

	onDragonHeadStart () {
		this.dragonHead.setVisible(true);
		this.dragonHeadStarted = true;
	}

	onGlintStart () {
		this.glint.setVisible(true);
		this.glintStarted = true;
	}
}

export { TitleScene };
