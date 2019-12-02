import Phaser from 'phaser';

import { advLogMenuContent, newQuestMenuContent } from '~/TextBox/menuData';
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
		// this.load.audioSprite('sfx', sfxJson, [...sfxAudio]);
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

	model = new MainMenuModel({ scene: this });

	create () {
		this.curtain = this.add.existing;

		this.sound.add('peacefulVillage');
		this.sound.play('peacefulVillage', { volume, loop: true });
		this.sfx = this.sound.addAudioSprite('sfx', { volume });

		window.questMenu = this.model.addMenu('questMenu', TextBoxFactory.create(this, 24, 56, 'textbox', {
			content: newQuestMenuContent,
		}));
		window.advLogMenu = this.model.addMenu('advLogMenu', TextBoxFactory.create(this, 72, 136, 'textbox', {
			content: advLogMenuContent,
		}));
		this.model.setSelectedMenu('questMenu');
		this.initEvents();
	}

	initEvents () {
		const questMenu = this.model.getMenuById('questMenu');

		this.events.on(Phaser.Scenes.Events.TRANSITION_COMPLETE, () => {
			questMenu.open(false);
		});
		this.events.on('changedata-selectedMenu', () => {
			this.model.unselectedMenus.forEach((unselectedMenu) => {
				unselectedMenu.entity.selector.play('selectorShown');
			});
			this.model.selectedMenu.entity.selector.play('selectorBlinking');
		});
		this.initInputEvents();
	}

	initInputEvents () {
		const advLogMenu = this.model.getMenuById('advLogMenu');

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
		this.input.keyboard.on(`keyup-${keys.CONFIRM}`, () => {
			if (this.model.selectedMenu.id === 'questMenu') {
				if (this.model.selectedMenuItemId === 'beginANewQuest') {
					this.model.setSelectedMenu('advLogMenu');
					advLogMenu.open();
				}
			}
		});
		this.input.keyboard.on(`keyup-${keys.CANCEL}`, () => {
			if (this.model.selectedMenu.id === 'advLogMenu') {
				advLogMenu.close();
				this.model.setSelectedMenu('questMenu');
				// questMenu.close();
			}
		});
	}
}

export { MainMenuScene };
