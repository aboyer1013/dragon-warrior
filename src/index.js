import Phaser from 'phaser';

import { targetFps } from '~/global.constants';
import { TitleScene } from '~/Scenes/Title.scene';
import { MainMenuScene } from '~/Scenes/MainMenu.scene';
import { sfxAudio, sfxJson } from '~/assets/audio/sfx/sfx';

class Boot extends Phaser.Scene {
	preload () {
		const curtain = new Phaser.GameObjects.Graphics(this);

		curtain.fillStyle(0xff0000, 1);
		curtain.fillRect(0, 0, 1, 1);
		curtain.generateTexture('curtain', 1, 1);
		this.load.image('curtain', curtain);
		this.load.audioSprite('sfx', sfxJson, [...sfxAudio]);
	}

	create () {
		// this.scene.start('TitleScene');
		// this.add.bitmapText(0, 0, 'font', ['!\'()*,-.0123456789:?ABCDEFGHIJ', 'KLMNOPQRSTUVWXYZ`abcdefghijklm', 'nopqrstuvwxyz']);
		this.scene.transition({
			target: 'MainMenuScene',
			duration: 367,
			onUpdate: () => {},
			onUpdateScope: this,
		});
	}
}
const config = {
	// backgroundColor: 0xbada55,
	disableContextMenu: true,
	fps: {
		target: targetFps,
	},
	render: {
		pixelArt: true,
	},
	scene: [Boot, TitleScene, MainMenuScene],
	type: Phaser.AUTO,
	width: 256,
	height: 224,
	zoom: 4,
};
const game = new Phaser.Game(config);

window.game = game;

Object.defineProperty(window, 'scene', {
	get () {
		return game.scene.getScenes(true)[0];
	},
});
