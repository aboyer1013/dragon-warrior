export const newQuestMenuContent = {
	items: [
		{
			id: 'beginANewQuest',
			text: 'BEGIN A NEW QUEST',
			interactable: true,
			nextInteractable: [null, null, null, null],
		},
	],
};

export const continueQuestMenuContent = {
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
};

export const advLogMenuContent = {
	items: [
		{
			id: 'advLog1',
			text: 'ADVENTURE LOG 1',
			interactable: true,
			nextInteractable: [null, null, 'advLog2', null],
		},
		{
			id: 'advLog2',
			text: 'ADVENTURE LOG 2',
			interactable: true,
			nextInteractable: ['advLog1', null, 'advLog3', null],
		},
		{
			id: 'advLog3',
			text: 'ADVENTURE LOG 3',
			interactable: true,
			nextInteractable: ['advLog2', null, null, null],
		},
	],
};

export const nameMenuContent = {
	items: [
		{
			id: 'name',
			text: '********',
		},
		{
			id: 'wtf',
			text: '4o 0x    ',
		},
	],
};

const alphabetItems = [
	{
		id: 'A',
		text: 'A',
		nextInteractable: [null, 'B', 'L', null],
	},
	{
		id: 'B',
		text: 'B',
		nextInteractable: [null, 'C', 'M', 'A'],
	},
	{
		id: 'C',
		text: 'C',
		nextInteractable: [null, 'D', 'N', 'B'],
	},
	{
		id: 'D',
		text: 'D',
		nextInteractable: [null, 'E', 'O', 'C'],
	},
	{
		id: 'E',
		text: 'E',
		nextInteractable: [null, 'F', 'Q', 'D'],
	},
	{
		id: 'F',
		text: 'F',
		nextInteractable: [null, 'G', 'R', 'E'],
	},
	{
		id: 'G',
		text: 'G',
		nextInteractable: [null, 'H', 'R', 'F'],
	},
	{
		id: 'H',
		text: 'H',
		nextInteractable: [null, 'I', 'S', 'G'],
	},
	{
		id: 'I',
		text: 'I',
		nextInteractable: [null, 'J', 'T', 'H'],
	},
	{
		id: 'J',
		text: 'J',
		nextInteractable: [null, 'K', 'U', 'I'],
	},
	{
		id: 'K',
		text: 'K',
		nextInteractable: [null, null, 'V', 'J'],
	},
	{
		id: 'L',
		text: 'L',
		nextInteractable: ['A', 'M', 'W', null],
	},
	{
		id: 'M',
		text: 'M',
		nextInteractable: ['B', 'N', 'X', 'L'],
	},
];
let alphabetY = 0;

export const alphabetMenuContent = {
	layoutType: 'explicit',
	items: alphabetItems.map((item, i) => {
		const maxCols = 11;
		const alphabetX = i % maxCols;
		const padding = [1, 0, 0, 1];

		if (i > 0 && i % maxCols === 0) {
			alphabetY += 1;
		}
		const finalX = alphabetX + (padding[3] * alphabetX) + 1;
		const finalY = alphabetY + (padding[0] * alphabetY) + 1;

		return {
			...item,
			interactable: true,
			padding,
			charPos: {
				x: finalX,
				y: finalY,
			},
		};
	}),
};
