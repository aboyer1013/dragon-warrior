import Phaser from 'phaser';

import peacefulVillage from '~/assets/bgm/peaceful-village.mp3';
import { volume } from '~/global.constants';
import textbox from '~/assets/textbox.png';
import { TextBoxFactory } from '~/TextBox';

class MainMenuScene extends Phaser.Scene {
	constructor () {
		super({ key: 'MainMenuScene' });
	}

	preload () {
		this.load.audio('peacefulVillage', peacefulVillage);
		this.load.image('textbox', textbox);
	}

	update (time, delta) {
	}

	create () {
		this.sound.add('peacefulVillage');
		this.sound.play('peacefulVillage', { volume, loop: true });
		this.questMenu = TextBoxFactory.create(this, 24, 56, 'textbox');
		this.sys.updateList.add(this.questMenu);
		this.events.on(Phaser.Scenes.Events.TRANSITION_COMPLETE, () => {
			console.log('trans complete');

			this.questMenu.open();
		});
	}
}

export { MainMenuScene };
