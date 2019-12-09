export const newQuestMenuContent = {
	items: [
		{
			id: 'beginANewQuest',
			// text: 'BEGIN A NEW QUEST',
			text: [
				'Erdrick, listen now',
				'to my words.\'',
				'',
				'`It is told that in',
				'ages past Erdrick',
				'fought demons with a',
				'Ball of Light.\'',
			],
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
			text: '4o»0x',
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
		nextInteractable: [null, 'F', 'P', 'D'],
	},
	{
		id: 'F',
		text: 'F',
		nextInteractable: [null, 'G', 'Q', 'E'],
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
	{
		id: 'N',
		text: 'N',
		nextInteractable: ['C', 'O', 'Y', 'M'],
	},
	{
		id: 'O',
		text: 'O',
		nextInteractable: ['D', 'P', 'Z', 'N'],
	},
	{
		id: 'P',
		text: 'P',
		nextInteractable: ['E', 'Q', '-', 'O'],
	},
	{
		id: 'Q',
		text: 'Q',
		nextInteractable: ['F', 'R', "'", 'P'],
	},
	{
		id: 'R',
		text: 'R',
		nextInteractable: ['G', 'S', '!', 'Q'],
	},
	{
		id: 'S',
		text: 'S',
		nextInteractable: ['H', 'T', '?', 'R'],
	},
	{
		id: 'T',
		text: 'T',
		nextInteractable: ['I', 'U', '(', 'S'],
	},
	{
		id: 'U',
		text: 'U',
		nextInteractable: ['J', 'V', ')', 'T'],
	},
	{
		id: 'V',
		text: 'V',
		nextInteractable: ['K', null, ' ', 'U'],
	},
	{
		id: 'W',
		text: 'W',
		nextInteractable: ['L', 'X', 'a', null],
	},
	{
		id: 'X',
		text: 'X',
		nextInteractable: ['M', 'Y', 'b', 'W'],
	},
	{
		id: 'Y',
		text: 'Y',
		nextInteractable: ['N', 'Z', 'c', 'X'],
	},
	{
		id: 'Z',
		text: 'Z',
		nextInteractable: ['O', '-', 'd', 'Y'],
	},
	{
		id: '-',
		text: '-',
		nextInteractable: ['P', "'", 'e', 'Z'],
	},
	{
		id: "'",
		text: "'",
		nextInteractable: ['Q', '!', 'f', '-'],
	},
	{
		id: '!',
		text: '!',
		nextInteractable: ['R', '?', 'g', "'"],
	},
	{
		id: '?',
		text: '?',
		nextInteractable: ['S', '(', 'h', '!'],
	},
	{
		id: '(',
		text: '(',
		nextInteractable: ['T', ')', 'i', '?'],
	},
	{
		id: ')',
		text: ')',
		nextInteractable: ['U', ' ', 'j', '('],
	},
	{
		id: ' ',
		text: ' ',
		nextInteractable: ['V', null, 'k', ')'],
	},
	{
		id: 'a',
		text: 'a',
		nextInteractable: ['W', 'b', 'l', null],
	},
	{
		id: 'b',
		text: 'b',
		nextInteractable: ['X', 'c', 'm', 'a'],
	},
	{
		id: 'c',
		text: 'c',
		nextInteractable: ['Y', 'd', 'n', 'b'],
	},
	{
		id: 'd',
		text: 'd',
		nextInteractable: ['Z', 'e', 'o', 'c'],
	},
	{
		id: 'e',
		text: 'e',
		nextInteractable: ['-', 'f', 'p', 'd'],
	},
	{
		id: 'f',
		text: 'f',
		nextInteractable: ["'", 'g', 'q', 'e'],
	},
	{
		id: 'g',
		text: 'g',
		nextInteractable: ['!', 'h', 'r', 'f'],
	},
	{
		id: 'h',
		text: 'h',
		nextInteractable: ['?', 'i', 's', 'g'],
	},
	{
		id: 'i',
		text: 'i',
		nextInteractable: ['(', 'j', 't', 'h'],
	},
	{
		id: 'j',
		text: 'j',
		nextInteractable: [')', 'k', 'u', 'i'],
	},
	{
		id: 'k',
		text: 'k',
		nextInteractable: [' ', null, 'v', 'j'],
	},
	{
		id: 'l',
		text: 'l',
		nextInteractable: ['a', 'm', 'w', null],
	},
	{
		id: 'm',
		text: 'm',
		nextInteractable: ['b', 'n', 'x', 'l'],
	},
	{
		id: 'n',
		text: 'n',
		nextInteractable: ['c', 'o', 'y', 'm'],
	},
	{
		id: 'o',
		text: 'o',
		nextInteractable: ['d', 'p', 'z', 'n'],
	},
	{
		id: 'p',
		text: 'p',
		nextInteractable: ['e', 'q', ',', 'o'],
	},
	{
		id: 'q',
		text: 'q',
		nextInteractable: ['f', 'r', '.', 'p'],
	},
	{
		id: 'r',
		text: 'r',
		nextInteractable: ['g', 's', 'BACK', 'q'],
	},
	{
		id: 's',
		text: 's',
		nextInteractable: ['h', 't', 'BACK', 'r'],
	},
	{
		id: 't',
		text: 't',
		nextInteractable: ['i', 'u', 'END', 's'],
	},
	{
		id: 'u',
		text: 'u',
		nextInteractable: ['j', 'v', 'END', 't'],
	},
	{
		id: 'v',
		text: 'v',
		nextInteractable: ['k', null, 'END', 'u'],
	},
	{
		id: 'w',
		text: 'w',
		nextInteractable: ['l', 'x', null, null],
	},
	{
		id: 'x',
		text: 'x',
		nextInteractable: ['m', 'y', null, 'w'],
	},
	{
		id: 'y',
		text: 'y',
		nextInteractable: ['n', 'z', null, 'x'],
	},
	{
		id: 'z',
		text: 'z',
		nextInteractable: ['o', ',', null, 'y'],
	},
	{
		id: ',',
		text: ',',
		nextInteractable: ['p', '.', null, 'z'],
	},
	{
		id: '.',
		text: '.',
		nextInteractable: ['q', 'BACK', null, ','],
	},
	{
		id: 'BACK',
		text: 'BACK',
		nextInteractable: ['r', 'END', null, '.'],
	},
	{
		id: 'END',
		text: 'END',
		nextInteractable: ['u', null, null, 'BACK'],
	},
];
let alphabetY = 0;

export const alphabetMenuContent = {
	layoutType: 'explicit',
	items: alphabetItems.map((item, i) => {
		const maxCols = 11;
		const alphabetX = i % maxCols;
		const padding = [1, 0, 0, 1];
		let offsetX = 0;
		let offsetY = 0;

		if (i > 0 && i % maxCols === 0) {
			alphabetY += 1;
		}
		if (item.id === 'END') {
			offsetX = 4;
			offsetY = 0;
		}
		const finalX = alphabetX + (padding[3] * alphabetX) + 1 + offsetX;
		const finalY = alphabetY + (padding[0] * alphabetY) + 1 + offsetY;

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
