class Animation {
	constructor(aliveTime = 9999999) {
		this.delete = false;
		this.onBorn_runned = false; // check if onBorn function have been runned
		this.aliveTime = aliveTime; // infinity alive Time
		this.frameCount = 0;
	}

	onBorn() {

	}

	update() {

	}

	draw() {

	}

	onDestroy() {

	}

	destroy() {
		this.delete = true;
	}
}
