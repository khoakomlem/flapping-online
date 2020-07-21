class Coin extends Animation {
    constructor({ objectClass, bird, canvasX = 0, index = 0, y = random(50, height - 50), x = Width } = {}) { //depth is the HEIGHT of the top pipe!
        super({ bird: bird });
        this.index = index;
        this.name = 'Coin';
        this.objectClass = objectClass;
        this.x = x;
        this.y = y;
        this.diameter = 25;
        this.velY = 0;
        this.velY_dir = 'up';
        this.canvasX = canvasX;
        this.bird = bird;
    }

    update() {
        this.x -= game.level;
        if (this.velY >= 2)
            this.velY_dir = 'up';
        if (this.velY <= -2)
            this.velY_dir = 'down';
        if (this.velY_dir == 'up')
            this.velY -= 0.1;
        if (this.velY_dir == 'down')
            this.velY += 0.1;
        this.y += this.velY;

        if (this.screenOverPass())
            this.destroy();

        if (this.collideBird()) {
            coin++;
            // alert(1)
            animation.push(new class CoinEarned extends Animation {
                constructor({ x, y, diameter } = {}) {
                    super();
                    this.x = x;
                    this.y = y;
                    // this.toX = x-50
                    this.toY = y - 100;
                    this.diameter = diameter;
                }
                update() {
                    // this.x  = $('#coin_wrap').offset().left;
                    this.x -= game.level / 2;
                    // this.x = lerp(this.x, this.toX, 0.1);
                    this.y = lerp(this.y, this.toY, 0.1);
                    if (abs(this.y - this.toY) < 1)
                        this.destroy();
                }
                draw() {
                    push()
                    imageMode(CENTER);
                    image(images.coin, this.x, this.y, this.diameter, this.diameter);
                    pop();
                }
                onDestroy() {
                    $('#coin').html(coin);
                    setCookie('coin', coin, 365);
                }
            }(this))
            // console.log(animation[animation.length-1]);
            this.destroy();
        }
    }

    draw() {
        push()
        imageMode(CENTER);
        image(images.coin, this.x, this.y, this.diameter, this.diameter);
        pop();
    }

    screenOverPass() {
        return this.x + this.diameter < this.canvasX;
    }

    collideBird(debug) {
        var poly = this.bird.getPolyPoints();
        var collide = collideCirclePoly(this.x, this.y, this.diameter, poly);

        if (debug) {
            push();
            noFill();
            stroke('red');
            strokeWeight(5);
            if (collide)
                stroke('green');
            ellipse(this.x, this.y, this.diameter);
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