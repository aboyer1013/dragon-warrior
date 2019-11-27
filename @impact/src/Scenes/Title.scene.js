import Phaser from 'phaser';
import times from 'lodash/times';

import border from '~/assets/title-border.png';
import copyright from '~/assets/title-copyright.png';
import dragonHead from '~/assets/title-dragon-head.png';
import title from '~/assets/title-dragon-warrior.png';
import rock from '~/assets/title-rock.png';

class TitleScene extends Phaser.Scene {
	constructor () {
		super({
			key: 'TitleScene',
			active: true,
		});
	}

	title = []

	showTitle = false

	showDragonHead = false

	showCopyright = false

	preload () {
		this.load.image('border', border);
		this.load.image('copyright', copyright);
		this.load.image('dragonHead', dragonHead);
		this.load.image('title', title);
		this.load.image('rock', rock);
	}

	update () {

	}

	create () {
		// this.time.addEvent({
		// 	delay: 3000.0002,
		// 	callback: this.onIntroStart,
		// 	callbackScope: this,
		// });
		// this.time.addEvent({
		// 	delay: 10333.3333,
		// 	callback: this.onCopyrightStart,
		// 	callbackScope: this,
		// });
		// this.time.addEvent({
		// 	delay: 10350,
		// 	callback: this.onDragonHeadStart,
		// 	callbackScope: this,
		// });
		// // top border
		// times(30, (x) => {
		// 	this.title.push(this.add.image(8 * x, 34, 'border'));
		// });
		// // rock texture
		// times(5, (y) => {
		// 	times(15, (x) => {
		// 		this.title.push(this.add.image(16 * x, 40 + (16 * y), 'rock'));
		// 	});
		// });
		// // bottom border
		// times(30, (x) => {
		// 	this.title.push(this.add.image(8 * x, 121, 'border'));
		// });
		// this.title.push(
		// 	// title
		// 	this.add.image(16, 72, 'title'),
		// 	// dragon head
		// 	this.add.image(33, 53, 'dragonHead'),
		// );
		// this.children.getAll().forEach(t => t.setOrigin(0, 0));
		this.titleGroup = this.add.group({
			key: 'title',
		});
		Phaser.Actions.SetOrigin(this.titleGroup.getChildren(), 0, 0);
		// this.titleGroup.add(new Phaser.GameObjects.Image(this, 0, 0, 'title'));
		// this.titleGroup.setOrigin(0, 0);
		// TODO setOrigin on groups do not work as expected
		// this.titleGroup.setOrigin(0, 0);
		// this.title = this.add.image(16, 72, 'title');
		// this.title.setOrigin(0, 0);
		// this.dragonHead = this.add.image(33, 53, 'dragonHead');
		// this.dragonHead.setOrigin(0, 0);
		// this.copyright = this.add.image(24, 144, 'copyright');
		// this.copyright.setOrigin(0, 0);
		// if (!this.state.get('isCopyrightHidden') || this.fullTitleTime.delta() >= 0) {
		// 	if (this.state.get('isCopyrightHidden')) {
		// 		this.state.set('isCopyrightHidden', false);
		// 	}
		// 	this.copyright.draw(24, 144);
		// 	if (!this.state.get('isCopyrightHidden') || this.fullTitleTime.delta() + ig.system.tick >= 0) {
		// 		this.dragonHead.draw(33, 53);
		// 	}
		// }
		// // glint
		// if (!this.state.get('isCopyrightHidden') || this.glintTime.delta() >= 0) {
		// 	this.glint.draw(173, 52);
		// }
	}

	onIntroStart () {
		// this.titleGroup.setVisible(true);
	}
}

export { TitleScene };
