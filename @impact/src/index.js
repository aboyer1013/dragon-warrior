import Phaser from 'phaser';
import fontImg from './assets/ffffff.font.png';
import fontData from './assets/font.xml';
import { TitleScene } from '~/Scenes/Title.scene';

function preload () {
	this.load.bitmapFont('font', fontImg, fontData);
}

function create () {
	this.add.bitmapText(0, 0, 'font', ['!\'()*,-.0123456789:?ABCDEFGHIJ', 'KLMNOPQRSTUVWXYZ`abcdefghijklm', 'nopqrstuvwxyz']);
}

const config = {
	// backgroundColor: 0xbada55,
	disableContextMenu: true,
	height: 224,
	parent: 'phaser-example',
	render: {
		pixelArt: true,
	},
	scene: [TitleScene],
	type: Phaser.AUTO,
	width: 240,
	zoom: 4,
};

window.game = new Phaser.Game(config);
