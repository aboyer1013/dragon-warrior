import isString from 'lodash/isString';

class TextBoxContentModel {
	constructor (options) {
		const config = {
			...options,
		};

		this.layoutType = config.content?.layoutType || 'dialog';
		this.x = config.x;
		this.y = config.y;
		this.content = config.content;
		this.setDefaultSelectedItem();
	}

	selectedItem = null

	getItemById (id) {
		return this.content.find(item => item.id === id);
	}

	setSelectedItem (identifier) {
		const result = {};

		if (!identifier) {
			return result;
		}
		if (isString(identifier)) {
			result.item = this.content.items.find((item, i) => {
				if (this.isLayoutExplicit) {
					result.lineNum = 0;
				} else {
					result.lineNum = i;
				}
				return item.id === identifier;
			});
		}
		this.selectedItem = result;
		return this.selectedItem;
	}

	setDefaultSelectedItem () {
		let lineNum;
		let selected = this.content.items.find((item, i) => {
			if (this.isLayoutExplicit) {
				lineNum = 0;
			} else {
				lineNum = i;
			}
			return item.interactable && item.defaultSelected;
		});

		if (!selected) {
			selected = this.content.items.find((item, i) => {
				if (this.isLayoutExplicit) {
					lineNum = 0;
				} else {
					lineNum = i;
				}
				return item.interactable;
			});
		}
		this.selectedItem = {
			lineNum,
			item: selected,
		};
	}

	get isLayoutExplicit () {
		return this.layoutType === 'explicit';
	}

	get hasInteractableItems () {
		return this.content.items.some(item => item.interactable);
	}
}

export { TextBoxContentModel };
