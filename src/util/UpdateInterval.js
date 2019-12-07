class UpdateInterval {
	constructor (speed, callback) {
		this.speed = speed;
		this.callback = callback;
	}

	time = 0

	callbackExecuted = false

	callbackCounter = 1

	poll (deltaTime) {
		this.time += deltaTime;
		if (!this.callbackExecuted) {
			this.callback(this);
			this.callbackExecuted = true;
			return;
		}
		if (this.time < this.speed) {
			return;
		}
		this.time = this.time - this.speed;
		this.callback(this);
	}

	execute () {
		this.reset();
		this.callback(this);
	}

	reset () {
		this.time = 0;
		this.callbackCounter = 1;
	}
}

export { UpdateInterval };
