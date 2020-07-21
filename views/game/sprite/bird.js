class Bird extends Animation {
	constructor({
		objectClass,
		x = 100,
		y = height / 2,
		bloodBar,
		birdName = '',
		bloodable = true
	} = {}) {
		super();
		this.name = 'Bird';
		this.birdName = birdName;
		this.objectClass = objectClass;
		this.x = x;
		this.y = y;
		this.velY = 0;
		this.width = 93;
		this.height = 56;
		this.degree = -30;
		this.blood = 100;
		this.blockFly = false;
		this.freze = false;
		this.bloodBar = bloodBar;
		this.bloodable = bloodable;
	}

	update() {
		if (this.freze) return;
		this.velY += 0.8;
		// if (this.velY>5)
		//     this.velY=5;
		// if (this.velY<-10)
		//     this.velY = -10;
		this.y += this.velY;
		if (!this.blockFly) {
			if (this.velY < 0)
				this.degree = lerp(this.degree, -30, 0.1);
			else
				this.degree = lerp(this.degree, 30, 0.1);
			if (this.y < 0 || this.y > Height) {
				this.hurt(1);
			}
		}

	}

	draw() {
		push();
		translate(this.x, this.y);
		// stroke('red');
		// strokeWeight(6)
		textAlign(CENTER, CENTER);
		// ellipse(0, -60, 10)
		textSize(16);
		text(this.birdName, 0, -60)
		rotate(this.degree);
		image(images.bird, -this.width / 2, -this.height / 2);
		// translate(this.x, this.y);
		pop();
		// noLoop();
	}

	fly() {
		if (this.blockFly) return;
		this.velY = -11.5;
	}

	hurt(amount) {
		for (var i = 0; i < 3; i++) {
			image(images.blood, this.x - 70 / 2 + random(-20, 20), this.y - this.height / 2 - 50 / 2 + random(-20, 20));
			if (game.name != 'menu')
				this.blood -= amount;

			if (this.blood % 2 == 0 && this.bloodable) {
				animation.push(new class extends Animation {
					constructor({
						objectClass
					} = {}) {
						super(100); // set aliveTime is 100
						this.name = 'blood';
						// this.objectClass = objectClass;
						this.objectClass = 'none';
						this.x = random(0, width);
						this.y = random(0, height);
						this.degree = random(0, 360);
						this.width = 130;
						this.height = 87;
					}

					draw() {
						push();
						translate(this.x, this.y);
						rotate(this.degree);
						image(images.blood, -this.width / 2, -this.height / 2);
						pop();
					}
				}(this))
			}

			if (this.blood < 0) {
				game.lose();
				return;
			}
			if (this.bloodBar)
				this.bloodBar.updateBlood(this.blood, true);
		}
	}

	getPolyPoints() {
		var poly = [];
		var curX = -this.width / 2,
			curY = -this.height / 2; // curX,Y is position when rotate
		poly[0] = c_a_r(curX + 20, curY, this.degree); //A
		poly[1] = c_a_r(curX + this.width - 10, curY, this.degree); //B
		poly[2] = c_a_r(curX + this.width - 10, curY + this.height - 5, this.degree); //C
		poly[3] = c_a_r(curX + 20, curY + this.height - 5, this.degree); //D
		poly[0].add(this.x, this.y);
		poly[1].add(this.x, this.y);
		poly[2].add(this.x, this.y);
		poly[3].add(this.x, this.y);
		return poly;
	}
}