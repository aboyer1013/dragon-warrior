import Phaser from 'phaser';

import { targetFps } from '~/global.constants';
import { TitleScene } from '~/Scenes/Title.scene';
import { MainMenuScene } from '~/Scenes/MainMenu.scene';

class Boot extends Phaser.Scene {
	preload () {

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
	height: 224,
	render: {
		pixelArt: true,
	},
	scene: [Boot, TitleScene, MainMenuScene],
	type: Phaser.AUTO,
	width: 240,
	zoom: 4,
};
const game = new Phaser.Game(config);

window.game = game;

Object.defineProperty(window, 'scene', {
	get () {
		return game.scene.getScenes(true)[0];
	},
});
