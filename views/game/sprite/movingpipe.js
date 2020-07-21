class MovingPipe extends Obstacle {
	constructor({
		objectClass,
		bird,
		canvasX = 0,
		height = random(230, Height - 230),
		speedY = 3,
		direction = ['up', 'down'][Math.round(random(0, 1))],
		index = 0,
		aliveTime = 9999999,
		x = Width
	} = {}) {
		super({
			bird: bird
		});
		this.index = index;
		this.name = 'MovingPipe';
		this.objectClass = objectClass;
		this.x = x;
		this.width = 50;
		this.openness = 200; // the distance of two pipes
		this.height = height; // just height of the first (top) pipe!!
		this.speedY = speedY;
		this.direction = direction;
		this.canvasX = canvasX;
	}

	update() {
		super.update();
		if (this.direction == "up")
			this.height -= this.speedY;
		if (this.direction == "down")
			this.height += this.speedY;
		if (this.height < 0)
			this.direction = "down";
		if (this.height + this.openness > Height)
			this.direction = "up";
	}

	draw() {
		image(images.bodypipe, this.x, 0, this.width, this.height);
		image(images.headpipe, this.x - 70 / 2 + this.width / 2, this.height - 30); // downside pipe

		image(images.bodypipe, this.x, this.height + this.openness, this.width, Height - this.height - this.openness);
		image(images.headpipe, this.x - 70 / 2 + this.width / 2, this.height + this.openness); //upside pipe

		super.draw(); //should be drawn score
	}

	drawScore() {
		super.configTextBeforeDrawScore();
		if (this.height > Height - this.height - this.openness) {
			text(this.index, this.x + this.width / 2, this.height - 60);
		} else {
			text(this.index, this.x + this.width / 2, this.height + this.openness + 50);
		}
	}

	screenOverPass() {
		return this.x + this.width < this.canvasX;
	}

	overCome() {
		return this.bird.x > this.x + this.width / 2;
	}

	collideBird(debug) {
		var poly = this.bird.getPolyPoints();
		var collideUp = collideRectPoly(this.x, 0, this.width, this.height, poly);
		var collideUp_hole = collideRectPoly(this.x - 70 / 2 + this.width / 2, this.height - 30, 70, 30, poly);
		var collideDown = collideRectPoly(this.x, this.height + this.openness, this.width, Height - this.height - this.openness, poly);
		var collideDown_hole = collideRectPoly(this.x - 70 / 2 + this.width / 2, this.height + this.openness, 70, 30, poly);

		if (debug) {
			push();
			noFill();
			stroke('red');
			strokeWeight(5);
			if (collideUp || collideDown || collideUp_hole || collideDown_hole)
				stroke('green');
			rect(this.x, 0, this.width, this.height);
			rect(this.x - 70 / 2 + this.width / 2, this.height - 30, 70, 30);
			rect(this.x, this.height + this.openness, this.width, Height - this.height - this.openness);
			rect(this.x - 70 / 2 + this.width / 2, this.height + this.openness, 70, 30);
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