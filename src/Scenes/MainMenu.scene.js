import Phaser from 'phaser';

import peacefulVillage from '~/assets/bgm/peaceful-village.mp3';
import { volume } from '~/global.constants';

class MainMenuScene extends Phaser.Scene {
	constructor () {
		super({ key: 'MainMenuScene' });
	}

	preload () {
		this.load.audio('peacefulVillage', peacefulVillage);
	}

	create () {
		this.sound.add('peacefulVillage');
		this.sound.play('peacefulVillage', { volume, loop: true });

		this.events.on(Phaser.Scenes.Events.TRANSITION_COMPLETE, () => {
			console.log(volume);
		});
	}
}

export { MainMenuScene };
