class FlappyGame {
	constructor() {
		this.frameCount = 0;
		this.freze = false;
		this.delete = false;
		this.camera = new Camera();
	}

	run() {
		background(0)
	}
	keyPressed() {}
	mousePressed() {}
}

class Menu extends FlappyGame {
	constructor() {
		super();
		this.bird = new Bird({
			bloodable: false
		});
		this.name = 'menu';
	}

	run() {
		clear();
		// fill(0)
		// rect(0,0,width,height);
		// return;
		// image(ximages.menuBackground, this.posX.tree-=2, 0);
		// image(images.menuBackground, this.posX.tree+1366, 0);
		// if (this.posX.tree < -1366) this.posX.tree = 0;
		background.update();
		background.draw();

		this.bird.update();
		this.camera.update();
		this.bird.draw();
		if (this.bird.y > Height / 2 + 20) {
			this.bird.fly();
		}
		if (this.bird.y <= 0) {
			this.bird.y = 0;
		}
	}
	keyPressed() {
		this.bird.fly();
	}
}


class PvpGame extends FlappyGame {
	constructor({
		playerID,
		gameRecord
	} = {}) {
		super();
		this.name = 'pvp game';
		this.level = 5;
		this.bloodBar = new BloodBar(100);
		this.queue_obstacles = gameRecord.queue_obstacles;
		this.bird = new Bird({
			bloodBar: this.bloodBar
		});
		this.opponent_bird = new Bird({
			x: 200,
			y: gameRecord.input[0].birdY,
			birdName: playerID,
			bloodable: false
		});
		this.opponent_input = gameRecord.input;
		this.isLosed = false;
		this.recordGame = {
			input: [],
			queue_obstacles: gameRecord.queue_obstacles
		};
		this.onDestroy = function () {
			socket.emit('game record', this.recordGame);
			let j = 0;
			while (j < animation.length) {
				if (animation[j].objectClass == 'pvp game') {
					animation.splice(j, 1);
					j--;
				}
				j++;
			}
			$('#menu_button').fadeIn(() => {
				$("#pvp").prop('disabled', false);
				let bird = {
					...game.bird
				};
				if (bird.y > Height) bird.y = Height * 1.5;
				game = new Menu();
				Object.assign(game.bird, {
					y: Height
				});
			});
		}


		this.loseAnimation = class extends Animation {
			constructor() {
				super();
				this.name = 'lose animation';
				this.objectClass = 'pvp game';
				game.camera.shake();
				game.bird.blockFly = true;
				if (game.opponent_bird.blockFly) {
					game.isLosed = true;
					for (let i in animation)
						if (animation[i].isObstacle) {
							animation[i].freze = true;
						}
				}
			}

			update() {
				if (game.bird.y >= height + game.bird.height)
					this.destroy();
				game.bird.degree -= 10;
			}

			onDestroy() {
				if (game.opponent_bird.blockFly)
					game.onDestroy();
			}
		}

		this.loseAnimation_opponent = class extends Animation {
			constructor() {
				super(45);
				this.name = 'lose animation for opponent_bird';
				this.objectClass = 'pvp game';
				game.opponent_bird.blockFly = true;
				if (game.bird.blockFly) {
					game.isLosed = true;
					for (let i in animation)
						if (animation[i].isObstacle) {
							animation[i].freze = true;
						}
				}
			}

			update() {
				game.opponent_bird.degree -= 10;
			}

			onDestroy() {
				if (game.bird.blockFly)
					game.onDestroy();
			}
		}

		//create pipe and block
		// this.queue_obstacles.push(new Pipe(config));

		let animate = {
			'Pipe': Pipe,
			'MovingPipe': MovingPipe,
			'Block': Block,
			'Popen': Popen,
			'Coin': Coin,
			'FrameWait': FrameWait
		}

		let start_index = 1;
		for (let i in this.queue_obstacles) {
			this.queue_obstacles[i] = new animate[this.queue_obstacles[i].name](this.queue_obstacles[i]);
			if (this.queue_obstacles[i].name == 'FrameWait')
				continue;
			// this.queue_obstacles[i].x = Width;
			this.queue_obstacles[i].objectClass = "pvp game";
			this.queue_obstacles[i].bird = this.bird;
			if (this.queue_obstacles[i].isObstacle) {
				start_index = this.queue_obstacles[i].index + 1;
			}
		}

		this.queue_obstacles.push(new FrameWait({
			amount: 120
		}));

		let config = {
			objectClass: 'pvp game',
			bird: this.bird
		}

		for (let i = start_index; i <= start_index + 100; i++) {
			config.index = i;
			let arr = [new Pipe(config), new Block(config), new MovingPipe(config), new Popen(config)];
			this.queue_obstacles.push(arr[Math.round(random(0, arr.length - 1))]);
			if (Math.round(random(1, 2)) == 1) {
				this.queue_obstacles.push(new FrameWait({
					amount: 120
				}));
			} else {
				this.queue_obstacles.push(new FrameWait({
					amount: 60
				}));
				this.queue_obstacles.push(new Coin(config));
				this.queue_obstacles.push(new FrameWait({
					amount: 60
				}));
			}
		}
		this.recordGame.queue_obstacles = JSON.parse(JSON.stringify(this.queue_obstacles));
	}

	run() {
		// game.camera.moveTo(game.bird, true, true);
		clear();
		// this.frameCount++;
		background.update();
		background.draw();

		this.bird.update();
		this.opponent_bird.update();

		this.camera.update();
		this.bloodBar.draw();
		this.bird.draw();
		this.opponent_bird.draw();

		if (!this.opponent_bird.blockFly && this.frameCount >= this.opponent_input[0].frame - 100 / this.level) {
			// debugger;
			this.opponent_bird.y = this.opponent_input[0].birdY;
			if (this.opponent_input[0].name == 'bird.fly')
				this.opponent_bird.fly();
			if (this.opponent_input[0].name == 'bird.lose') {
				animation.push(new this.loseAnimation_opponent());
			}
			this.opponent_input.splice(0, 1);
		}

		if (!this.opponent_bird.blockFly || !this.bird.blockFly) {
			if (this.queue_obstacles[0].name == 'FrameWait') {
				this.queue_obstacles[0].frameCount++;
				if (this.queue_obstacles[0].frameCount > this.queue_obstacles[0].amount) {
					this.queue_obstacles.splice(0, 1);
				}
			} else {
				animation.push(this.queue_obstacles[0]);
				this.queue_obstacles.splice(0, 1);
			}
		}
	}

	lose() {
		animation.push(new this.loseAnimation());
		this.recordGame.input.push({
			name: 'bird.lose',
			frame: this.frameCount,
			birdY: this.bird.y
		});
	}

	keyPressed() {
		this.bird.fly();
		this.recordGame.input.push({
			name: 'bird.fly',
			frame: this.frameCount,
			birdY: this.bird.y
		});
	}

	mousePressed() {
		this.bird.fly();
		this.recordGame.input.push({
			name: 'bird.fly',
			frame: this.frameCount,
			birdY: this.bird.y
		});
	}
}


class ClassicGame extends FlappyGame {
	constructor({} = {}) {
		super();
		this.name = 'classic game';
		this.level = 5;
		this.bloodBar = new BloodBar(100);
		this.queue_obstacles = [];
		this.bird = new Bird({
			bloodBar: this.bloodBar
		});
		this.isLosed = false;
		this.recordGame = {
			input: [],
			queue_obstacles: []
		};


		this.loseAnimation = class extends Animation {
			constructor() {
				super();
				this.name = 'lose animation';
				this.objectClass = 'classic game';
				game.camera.shake();
				game.isLosed = true;
				game.bird.blockFly = true;
				for (let i in animation)
					if (animation[i].isObstacle) {
						animation[i].freze = true;
					}
			}

			update() {
				if (game.bird.y >= height + game.bird.height)
					this.destroy();
				game.bird.degree -= 10;
			}

			onDestroy() {
				let j = 0;
				while (j < animation.length) {
					if (animation[j].objectClass == 'classic game') {
						animation.splice(j, 1);
						j--;
					}
					j++;
				}
				$('#menu_button').fadeIn(() => {
					$("#single").prop('disabled', false);
					let bird = {
						...game.bird
					};
					if (bird.y > Height) bird.y = Height * 1.5;
					game = new Menu();
					Object.assign(game.bird, {
						y: Height
					});

				});
				socket.emit('game record', game.recordGame);
			}
		}

		let config = {
			objectClass: 'classic game',
			bird: this.bird
		}

		//create pipe and block
		// this.queue_obstacles.push(new Pipe(config));
		for (let i = 1; i <= 1000; i++) {
			config.index = i;
			// let arr = [new Block(config)];
			let arr = [new Pipe(config), new Block(config), new MovingPipe(config), new Popen(config)];
			if (i == 1)
				arr = [new Pipe(config), new Block(config), new MovingPipe(config)];
			this.queue_obstacles.push(arr[Math.round(random(0, arr.length - 1))]);
			if (Math.round(random(1, 2)) == 1) {
				this.queue_obstacles.push(new FrameWait({
					amount: 120
				}));
			} else {
				this.queue_obstacles.push(new FrameWait({
					amount: 60
				}));
				this.queue_obstacles.push(new Coin(config));
				this.queue_obstacles.push(new FrameWait({
					amount: 60
				}));
			}
		}
		this.recordGame.queue_obstacles = JSON.parse(JSON.stringify(this.queue_obstacles));
	}

	run() {
		clear();
		background.update();
		background.draw();

		this.bird.update();
		this.camera.update();
		this.bloodBar.draw();
		this.bird.draw();
		if (!this.isLosed) {
			if (this.queue_obstacles[0].name == 'FrameWait') {
				this.queue_obstacles[0].frameCount++;
				if (this.queue_obstacles[0].frameCount > this.queue_obstacles[0].amount) {
					this.queue_obstacles.splice(0, 1);
				}
			} else {
				animation.push(this.queue_obstacles[0]);
				this.queue_obstacles.splice(0, 1);
			}
		}
	}

	lose() {
		animation.push(new this.loseAnimation());
		this.recordGame.input.push({
			name: 'bird.lose',
			frame: this.frameCount,
			birdY: this.bird.y
		});
	}

	keyPressed() {
		this.bird.fly();
		this.recordGame.input.push({
			name: 'bird.fly',
			frame: this.frameCount,
			birdY: this.bird.y
		});
	}

	mousePressed() {
		this.bird.fly();
		this.recordGame.input.push({
			name: 'bird.fly',
			frame: this.frameCount,
			birdY: this.bird.y
		});
	}
}