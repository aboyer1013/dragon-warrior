import isString from 'lodash/isString';

class TextBoxContentModel {
	constructor (options) {
		const config = {
			...options,
			content: {
				items: [
					{
						id: 'continueAQuest',
						text: 'CONTINUE A QUEST',
						interactable: true,
						nextInteractable: [null, null, 'changeMessageSpeed', null],
					},
					{
						id: 'changeMessageSpeed',
						text: 'CHANGE MESSAGE SPEED',
						interactable: true,
						nextInteractable: ['continueAQuest', null, 'beginANewQuest', null],
					},
					{
						id: 'beginANewQuest',
						text: 'BEGIN A NEW QUEST',
						interactable: true,
						nextInteractable: ['changeMessageSpeed', null, 'copyAQuest', null],
					},
					{
						id: 'copyAQuest',
						text: 'COPY A QUEST',
						interactable: true,
						nextInteractable: ['beginANewQuest', null, 'eraseAQuest', null],
					},
					{
						id: 'eraseAQuest',
						text: 'ERASE A QUEST',
						interactable: true,
						nextInteractable: ['copyAQuest', null, null, null],
					},
				],
			},
		};

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
				result.lineNum = i;
				return item.id === identifier;
			});
		}
		this.selectedItem = result;
		return this.selectedItem;
	}

	setDefaultSelectedItem () {
		let lineNum;
		let selected = this.content.items.find((item, i) => {
			lineNum = i;
			return item.interactable && item.defaultSelected;
		});

		if (!selected) {
			selected = this.content.items.find((item, i) => {
				lineNum = i;
				return item.interactable;
			});
		}
		this.selectedItem = {
			lineNum,
			item: selected,
		};
	}

	get hasInteractableItems () {
		return this.content.items.some(item => item.interactable);
	}
}

export { TextBoxContentModel };
