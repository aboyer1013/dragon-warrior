import fill from 'lodash/fill';

import { targetFps } from '~/global.constants';

class MainMenuModel {
	menus = []

	name

	constructor (options) {
		this.scene = options.scene;
	}

	maskRate = (1 / targetFps) * 1000

	addMenu (id, entity) {
		const obj = { id, entity };

		this.menus.push(obj);
		this.selectedMenu = obj;
		this.scene.sys.updateList.add(entity);
		return entity;
	}

	get curtainDeltaY () {
		const topY = this.topMostMenu.entity.y;
		const delta = 16;
		const result = [delta, delta * 2, delta * 2];
		let startY = this.scene.game.config.height - result.reduce((accumulator, val) => accumulator + val);
		let fillCount = 0;

		while (startY > topY) {
			fillCount += 1;
			startY -= delta;
		}
		result.splice(2, 0, ...fill(Array(fillCount), delta)).map(datum => datum * -1);
		return result;
	}

	// This may be a generic reset
	get curtainDeltaYResetBeginQuest () {
		const topY = this.topMostMenu.entity.y;
		const delta = 16;
		const result = [];
		let startY = this.scene.game.config.height;

		while (startY > topY) {
			result.push(delta);
			startY -= delta;
		}
		return result;
	}

	get curtainDeltaYRevealNameRegistration () {
		let startY = this.getMenuById('nameMenu').y;
		const delta = 16;
		const result = [];
		// const alphabetMenu = this.getMenuById('alphabetMenu');
		// const endY = alphabetMenu.y + alphabetMenu.model.actualHeight;
		const endY = this.getMenuById('nameMenu').model.actualHeight;

		while (startY < endY) {
			result.push(delta);
			startY += delta;
		}
		return result;
	}

	get topMostMenu () {
		let topMostY = Infinity;
		let topMostMenu;

		this.menus.forEach((menu) => {
			const entityY = menu.entity.y;

			if (entityY < topMostY) {
				topMostY = entityY;
				topMostMenu = menu;
			}
		});
		return topMostMenu;
	}

	setSelectedMenu (id) {
		const result = {
			id,
			entity: this.getMenuById(id),
		};

		this.selectedMenu = result;
		this.scene.data.set('selectedMenu', id);
	}

	get unselectedMenus () {
		return this.menus.filter(menu => menu.id !== this.selectedMenu.id);
	}

	get selectedMenuItemId () {
		return this.selectedMenu?.entity?.model?.contentModel?.selectedItem?.item?.id;
	}

	clearMenusMask (menus = 'all') {
		const loopableMenus = menus === 'all' ? this.menus : menus;

		loopableMenus.forEach(menu => menu.entity.curtainMask.clearMask());
	}

	setMenusMask (menus = 'all') {
		const loopableMenus = menus === 'all' ? this.menus : menus;

		loopableMenus.forEach(menu => menu.entity.curtainMask.setMask());
	}

	getMenuById (id) {
		return this.menus.find(menu => menu.id === id).entity;
	}
}

export { MainMenuModel };
