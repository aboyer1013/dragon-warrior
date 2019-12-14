import Phaser from 'phaser';

import {
	advLogMenuContent, newQuestMenuContent, continueQuestMenuContent, nameMenuContent, alphabetMenuContent,
} from '~/TextBox/menuData';
import { advLogs } from '~/AdvLogs.model';
import peacefulVillage from '~/assets/bgm/peaceful-village.mp3';
import { volume, keys } from '~/global.constants';
import uiSprite from '~/assets/sprite.png';
import { TextBoxFactory } from '~/TextBox/TextBox';
import { fontImage, fontData } from '~/fonts';
import { MainMenuModel } from '~/Scenes/MainMenu.model';
import { CurtainMaskFactory } from '~/util/CurtainMask';
import { UpdateInterval } from '~/util/UpdateInterval';

class MainMenuScene extends Phaser.Scene {
	constructor () {
		super({ key: 'MainMenuScene' });
		this.state = 'idle';
		this.maskAnimInterval = new UpdateInterval(this.model.maskRate, (interval) => {
			switch (this.state) {
				case 'resetting':
					this.onResetting(interval);
					break;
				case 'resetted':
					this.onResetted(interval);
					break;
				case 'revealingNameRegistration':
					this.onRevealingNameRegistration(interval);
					break;
				case 'revealedNameRegistration':
					this.onRevealedNameRegistration(interval);
					break;
				default:
					break;
			}
		});
	}

	preload () {
		this.load.audio('peacefulVillage', peacefulVillage);
		this.load.image('sprite', uiSprite);
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

		this.initMenus();
		this.initEvents();
		this.curtainMask = CurtainMaskFactory.create(
			this,
			0,
			this.game.config.height,
			this.game.config.width,
			this.game.config.height,
			this.children.getChildren(),
		);
		this.curtainNameRegMask = CurtainMaskFactory.create(
			this,
			0,
			window.nameMenu.model.y,
			this.game.config.width,
			this.game.config.height,
			window.nameMenu.maskGroup,
		);
	}

	initMenus () {
		const menuConfig = {
			questMenu: {
				x: advLogs.hasSavedLogs ? 32 : 24,
				y: 56,
			},
			advLogMenu: {
				x: advLogs.hasSavedLogs ? 80 : 72,
				y: 136,
			},
		};
		window.questMenu = this.model.addMenu('questMenu', TextBoxFactory.create(this, menuConfig.questMenu.x, menuConfig.questMenu.y, 'sprite', {
			content: newQuestMenuContent,
			...(!advLogs.hasSavedLogs) && {
				padding: [1, 4, 0, 1],
			},
		}));
		window.advLogMenu = this.model.addMenu('advLogMenu', TextBoxFactory.create(this, menuConfig.advLogMenu.x, menuConfig.advLogMenu.y, 'sprite', {
			content: advLogMenuContent,
			padding: [1, 2, 0, 1],
		}));
		const nameMenu = this.model.addMenu('nameMenu', TextBoxFactory.create(this, 80, 40, 'sprite', {
			title: 'NAME',
			content: nameMenuContent,
			type: 'input',
			padding: [1, 1, 0, 1],
		}));

		nameMenu.maskGroup.push(this.add.image(137, 72, nameMenu.model.texture, 'north').setOrigin(0));
		nameMenu.maskGroup.push(this.add.image(145, 72, nameMenu.model.texture, 'north').setOrigin(0));
		nameMenu.maskGroup.push(this.add.image(153, 72, nameMenu.model.texture, 'north').setOrigin(0));
		nameMenu.maskGroup.push(this.add.image(161, 72, nameMenu.model.texture, 'north').setOrigin(0));
		window.nameMenu = nameMenu;
		window.alphabetMenu = this.model.addMenu('alphabetMenu', TextBoxFactory.create(this, 24, 72, 'sprite', {
			content: alphabetMenuContent,
			padding: [0, 0, 0, 0],
			width: 192,
			height: 112,
			lineSpacing: 0,
		}));
		this.model.setMenusMask();
		this.model.setSelectedMenu('questMenu');
	}

	initEvents () {
		const questMenu = this.model.getMenuById('questMenu');
		const nameMenu = this.model.getMenuById('nameMenu');
		const alphabetMenu = this.model.getMenuById('alphabetMenu');

		this.events.on(Phaser.Scenes.Events.TRANSITION_COMPLETE, () => {
			questMenu.open(false);
		});
		this.events.on('changedata-selectedMenu', () => {
			this.model.unselectedMenus.forEach((unselectedMenu) => {
				unselectedMenu.entity?.selector?.play?.('selectorShown');
			});
			this.model.selectedMenu.entity?.selector?.play?.('selectorBlinking');
		});
		this.events.on('changedata-inputText', () => {
			nameMenu.createText();
		});
		nameMenu.on('afterOpened', () => {
			alphabetMenu.open(false);
			this.model.setSelectedMenu('alphabetMenu');
		});
		alphabetMenu.on('opened', () => {
			nameMenu.showInputSelector();
		});

		this.initInputEvents();
	}

	initInputEvents () {
		const advLogMenu = this.model.getMenuById('advLogMenu');
		const nameMenu = this.model.getMenuById('nameMenu');
		const alphabetMenu = this.model.getMenuById('alphabetMenu');

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
			switch (this.model.selectedMenu.id) {
				case 'questMenu':
					if (this.model.selectedMenuItemId === 'beginANewQuest') {
						this.model.setSelectedMenu('advLogMenu');
						advLogMenu.open();
					}
					break;
				case 'advLogMenu':
					this.model.setSelectedMenu('nameMenu');
					nameMenu.open();
					break;
				case 'alphabetMenu':
					alphabetMenu.model.inputText += alphabetMenu.model.contentModel.selectedItem.item.text;
					break;
				default:
					break;
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

		// Done animating. Close menus up.
		if (interval.callbackCounter > this.model.curtainDeltaYResetBeginQuest.length) {
			const questMenu = this.model.getMenuById('questMenu');
			const advLogMenu = this.model.getMenuById('advLogMenu');

			questMenu.quickClose();
			advLogMenu.quickClose();
			this.curtainMask.clearMask();
			this.model.setMenusMask();
			questMenu.open(false);
			this.state = 'resetted';
		}
		this.curtainMask.curtain.y = Math.max(newY, this.model.topMostMenu.entity.y);
		interval.callbackCounter += 1;
	}

	onResetted (interval) {
		interval.reset();
		this.curtainMask.curtain.y = this.game.config.height;
		this.state = 'idle';
	}

	onRevealingNameRegistration (interval) {
		const idx = interval.callbackCounter - 1;
		const newY = this.curtainNameRegMask.curtain.y + this.model.curtainDeltaYRevealNameRegistration[idx];

		if (interval.callbackCounter > this.model.curtainDeltaYRevealNameRegistration.length) {
			this.state = 'revealedNameRegistration';
		}
		this.curtainNameRegMask.curtain.y = Math.min(newY, this.game.config.height);
		interval.callbackCounter += 1;
	}

	// onRevealedNameRegistration (interval) {

	// }
}

export { MainMenuScene };
