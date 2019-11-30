class MainMenuModel {
	constructor (options) {
		const config = {
			...options,
		};
	}

	menus = []

	addMenu (id, entity) {
		const obj = { id, entity };

		this.menus.push(obj);
		this.selectedMenu = obj;
		return entity;
	}

	getMenuById (id) {
		return this.menus.find(menu => menu.id === id).entity;
	}
}

export { MainMenuModel };
