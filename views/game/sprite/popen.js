class Popen extends Obstacle {
	constructor({
		objectClass,
		bird,
		canvasX = 0,
		height = random(200, Height - 230),
		open = Boolean(Math.round(random(0, 1))),
		index = 0,
		aliveTime = 9999999,
		x = Width
	} = {}) { //depth is the HEIGHT of the top pipe!
		super({
			bird: bird
		});
		this.index = index;
		this.name = 'Popen';
		this.objectClass = objectClass;
		this.x = x;
		this.width = 50;
		this.openness = 0; // the distance of two pipes 
		this.default_openness = 200; // (default is 230)
		this.height = height; // just height of the first (top) pipe!!
		this.open = open;

		if (!open) { //open or closing?
			this.openness = this.default_openness + 250; // this is closing
			this.default_openness -= 40;
		}

		this.canvasX = canvasX;

	}

	update() {
		super.update();
	}

	draw() {
		image(images.bodypipe, this.x, 0, this.width, this.height - this.openness / 2);
		image(images.headpipe, this.x - 70 / 2 + this.width / 2, this.height - 30 - this.openness / 2); // downside pipe

		image(images.bodypipe, this.x, this.height + this.openness / 2, this.width, Height - this.height - this.openness / 2);
		image(images.headpipe, this.x - 70 / 2 + this.width / 2, this.height + this.openness / 2); //upside pipe

		super.draw();
	}

	drawScore() {
		super.configTextBeforeDrawScore();
		if (this.height - this.openness / 2 > this.height - 30 - this.openness / 2) {
			text(this.index, this.x + this.width / 2, this.height - this.openness / 2 - 60);
		} else {
			text(this.index, this.x + this.width / 2, this.height + this.openness / 2 + 60);
		}
	}

	screenOverPass() {
		return this.x + this.width < this.canvasX;
	}

	overCome() {
		return this.bird.x > this.x + this.width / 2;
	}

	openPipes() {
		animation.push(new class extends Animation {
			constructor(popenAbove) {
				super();
				this.popenAbove = popenAbove;
			}

			update() {
				let speed = this.popenAbove.open ? 0.0125 : 0.03;
				this.popenAbove.openness = lerp(this.popenAbove.openness, this.popenAbove.default_openness, speed);
				if (Math.abs(this.popenAbove.openness - this.popenAbove.default_openness) < speed)
					this.destroy();
			}
		}(this))
	}

	collideBird(debug) {
		var poly = this.bird.getPolyPoints();
		var collideUp = collideRectPoly(this.x, 0, this.width, this.height - this.openness / 2, poly);
		var collideUp_hole = collideRectPoly(this.x - 70 / 2 + this.width / 2, this.height - 30 - this.openness / 2, 70, 30, poly);
		var collideDown = collideRectPoly(this.x, this.height + this.openness / 2, this.width, Height - this.height - this.openness / 2, poly);
		var collideDown_hole = collideRectPoly(this.x - 70 / 2 + this.width / 2, this.height + this.openness / 2, 70, 30, poly);

		if (debug) {
			push();
			noFill();
			stroke('red');
			strokeWeight(5);
			if (collideUp || collideDown || collideUp_hole || collideDown_hole)
				stroke('green');
			rect(this.x, 0, this.width, this.height - this.openness / 2);
			rect(this.x - 70 / 2 + this.width / 2, this.height - 30 - this.openness / 2, 70, 30);
			rect(this.x, this.height + this.openness / 2, this.width, Height - this.height - this.openness / 2);
			rect(this.x - 70 / 2 + this.width / 2, this.height + this.openness / 2, 70, 30);
			beginShape();
			for (let i = 0; i < poly.length; i++) {
				vertex(poly[i].x, poly[i].y);
			}
			endShape(CLOSE);
			pop();
		}
		return collideUp || collideDown || collideUp_hole || collideDown_hole;
	}
}