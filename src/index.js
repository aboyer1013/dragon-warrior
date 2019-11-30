import Phaser from 'phaser';
// import fontImg from './assets/ffffff.font.png';
// import fontData from './assets/font.xml';
import { TitleScene } from '~/Scenes/Title.scene';
import { MainMenuScene } from '~/Scenes/MainMenu.scene';

// function preload () {
// 	this.load.bitmapFont('font', fontImg, fontData);
// }

// function create () {
// 	this.add.bitmapText(0, 0, 'font', ['!\'()*,-.0123456789:?ABCDEFGHIJ', 'KLMNOPQRSTUVWXYZ`abcdefghijklm', 'nopqrstuvwxyz']);
// }

const config = {
	// backgroundColor: 0xbada55,
	disableContextMenu: true,
	height: 224,
	input: {
		keyboard: true,
	},
	parent: 'phaser-example',
	render: {
		pixelArt: true,
	},
	scene: [TitleScene, MainMenuScene],
	type: Phaser.AUTO,
	width: 240,
	zoom: 4,
};
const game = new Phaser.Game(config);

// game.events.on(Phaser.Core.Events.FOCUS, () => {
// 	document.title = 'FOCUS';
// });
// game.events.on(Phaser.Core.Events.BLUR, () => {
// 	document.title = 'BLUR';
// });
window.game = game;

Object.defineProperty(window, 'scene', {
	get () {
		return game.scene.getScenes(true)[0];
	},
});
