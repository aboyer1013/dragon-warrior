import Phaser from 'phaser';

import { advLogMenuContent, newQuestMenuContent } from '~/TextBox/menuData';
import peacefulVillage from '~/assets/bgm/peaceful-village.mp3';
import { volume, keys } from '~/global.constants';
import textbox from '~/assets/textbox.png';
import uiSprite from '~/assets/sprite.png';
import { TextBoxFactory } from '~/TextBox/TextBox';
import { fontImage, fontData } from '~/fonts';
import { MainMenuModel } from '~/Scenes/MainMenu.model';
import { CurtainMaskFactory } from '~/util/CurtainMask';
import { UpdateInterval } from '~/util/UpdateInterval';

class MainMenuScene extends Phaser.Scene {
	constructor () {
		super({ key: 'MainMenuScene' });
		const rate = this.model.maskRate;
		this.state = 'idle';
		this.maskAnimInterval = new UpdateInterval(rate, (interval) => {
			if (this.state === 'resetting') {
				if (interval.callbackCounter > this.model.curtainDeltaYResetBeginQuest.length) {
					const questMenu = this.model.getMenuById('questMenu');
					const advLogMenu = this.model.getMenuById('advLogMenu');

					questMenu.quickClose();
					advLogMenu.quickClose();
					this.curtainMask.clearMask();
					this.model.setMenusMask();
					questMenu.open();
					this.state = 'resetted';
				}
				this.onResetting(interval);
				interval.callbackCounter += 1;
			} else if (this.state === 'resetted') {
				interval.reset();
				this.state = 'idle';
			}
		});
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

	model = new MainMenuModel({ scene: this });

	update (time, deltaTime) {
		this.maskAnimInterval.poll(deltaTime);
	}

	create () {
		this.sound.add('peacefulVillage');
		this.sound.play('peacefulVillage', { volume, loop: true });
		this.sfx = this.sound.addAudioSprite('sfx', { volume });

		window.questMenu = this.model.addMenu('questMenu', TextBoxFactory.create(this, 24, 56, 'textbox', {
			content: newQuestMenuContent,
		}));
		window.advLogMenu = this.model.addMenu('advLogMenu', TextBoxFactory.create(this, 72, 136, 'textbox', {
			content: advLogMenuContent,
		}));
		this.model.setMenusMask();
		this.model.setSelectedMenu('questMenu');
		this.initEvents();
		this.curtainMask = CurtainMaskFactory.create(
			this,
			0,
			this.game.config.height,
			this.game.config.width,
			this.game.config.height,
			this.children.getChildren(),
		);
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
				this.model.clearMenusMask();
				this.curtainMask.setMask();
				this.state = 'resetting';
				this.model.setSelectedMenu('questMenu');
			}
		});
	}

	onResetting (interval) {
		const idx = interval.callbackCounter - 1;
		const newY = this.curtainMask.curtain.y - this.model.curtainDeltaYResetBeginQuest[idx];

		this.curtainMask.curtain.y = Math.max(newY, this.model.topMostMenu.entity.y);
	}
}

export { MainMenuScene };
