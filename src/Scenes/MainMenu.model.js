class MainMenuModel {
	menus = []

	constructor (options) {
		this.scene = options.scene;
	}

	addMenu (id, entity) {
		const obj = { id, entity };

		this.menus.push(obj);
		this.selectedMenu = obj;
		this.scene.sys.updateList.add(entity);
		return entity;
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

	getMenuById (id) {
		return this.menus.find(menu => menu.id === id).entity;
	}
}

export { MainMenuModel };
