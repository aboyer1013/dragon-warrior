class UpdateInterval {
	constructor (speed, callback) {
		this.speed = speed;
		this.callback = callback;
	}

	time = 0

	callbackExecuted = false

	poll (deltaTime) {
		this.time += deltaTime;
		if (!this.callbackExecuted) {
			this.callback();
			this.callbackExecuted = true;
			return;
		}
		if (this.time < this.speed) {
			return;
		}
		this.time = this.time - this.speed;
		this.callback();
	}

	execute () {
		this.reset();
		this.callback();
	}

	reset () {
		this.time = 0;
	}
}

export { UpdateInterval };
