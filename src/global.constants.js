const volume = 0.01;
const targetFps = 60;
const frameSpeed = 1 / targetFps;
const keys = {
	CONFIRM: 'X',
	CANCEL: 'Z',
	DOWN: 'DOWN',
	LEFT: 'LEFT',
	RIGHT: 'RIGHT',
	SELECT: 'PERIOD',
	START: 'FORWARD_SLASH',
	UP: 'UP',
};

export {
	frameSpeed,
	keys,
	targetFps,
	volume,
};
