import Phaser from 'phaser';

import peacefulVillage from '~/assets/bgm/peaceful-village.mp3';
import { volume, keys } from '~/global.constants';
import textbox from '~/assets/textbox.png';
import uiSprite from '~/assets/sprite.png';
import { TextBoxFactory } from '~/TextBox/TextBox';
import { fontImage, fontData } from '~/fonts';
import { MainMenuModel } from '~/Scenes/MainMenu.model';

class MainMenuScene extends Phaser.Scene {
	constructor () {
		super({ key: 'MainMenuScene' });
	}

	preload () {
		this.load.audio('peacefulVillage', peacefulVillage);
		// TODO use uiSprite instead of textbox
		this.load.image('textbox', textbox);
		this.load.bitmapFont('font', fontImage, fontData);
		this.load.spritesheet({
			key: 'uiSprite',
			url: uiSprite,
			frameConfig: {
				frameWidth: 8,
				frameHeight: 8,
			},
		});
	}

	model = new MainMenuModel();

	create () {
		this.sound.add('peacefulVillage');
		this.sound.play('peacefulVillage', { volume, loop: true });
		const questMenu = this.model.addMenu('questMenu', TextBoxFactory.create(this, 24, 56, 'textbox'));

		this.sys.updateList.add(questMenu);
		this.events.on(Phaser.Scenes.Events.TRANSITION_COMPLETE, () => {
			questMenu.open();
		});
		this.input.keyboard.on(`keyup-${keys.UP}`, () => {
			this.model.selectedMenu.entity.moveCursorUp();
		});
		this.input.keyboard.on(`keyup-${keys.RIGHT}`, () => {
			this.model.selectedMenu.entity.moveCursorRight();
		});
		this.input.keyboard.on(`keyup-${keys.DOWN}`, () => {
			this.model.selectedMenu.entity.moveCursorDown();
		});
		this.input.keyboard.on(`keyup-${keys.LEFT}`, () => {
			this.model.selectedMenu.entity.moveCursorLeft();
		});
	}
}

export { MainMenuScene };
