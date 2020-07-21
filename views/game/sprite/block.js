class Block extends Obstacle {
    constructor({ objectClass, bird, canvasX = 0, index = 0, width = random(50, 100), y = random(0, height), speedY = random(5, 10), direction = ['up', 'down'][Math.floor(random(0, 1))], aliveTime = 9999999, x = Width } = {}) {
        super({ bird: bird });
        this.index = index;
        this.name = 'Block';
        this.objectClass = objectClass;
        this.canvasX = canvasX;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = this.width / 0.701; //maintain aspect ratio
        this.speedY = speedY;
        this.direction = direction;
    }

    update() {
        super.update();
        if (this.direction == "up")
            this.y -= this.speedY;
        if (this.direction == "down")
            this.y += this.speedY;
        if (this.y < 0)
            this.direction = "down";
        if (this.y + this.height > height)
            this.direction = "up";
    }

    draw() {
        image(images.death_block, this.x, this.y, this.width, this.height);
        super.draw(); // should be drawing score
    }

    drawScore() {
        super.configTextBeforeDrawScore();
        text(this.index, this.x + this.width / 2, this.y + this.height / 2 - this.speedY);
    }

    screenOverPass() {
        return this.x + this.width < this.canvasX;
    }

    overCome() {
        return this.bird.x > this.x + this.width / 2;
    }

    collideBird(debug) {
        var poly = this.bird.getPolyPoints();
        var collide = collideRectPoly(this.x, this.y, this.width, this.height, poly);

        if (debug) {
            push();
            noFill();
            stroke('red');
            strokeWeight(5);
            if (collide)
                stroke('green');
            rect(this.x, this.y, this.width, this.height);
            beginShape();
            for (let i = 0; i < poly.length; i++) {
                vertex(poly[i].x, poly[i].y);
            }
            endShape(CLOSE);
            pop();
        }
        return collide;
    }
}