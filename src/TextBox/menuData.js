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
