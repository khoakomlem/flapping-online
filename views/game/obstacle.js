class Obstacle extends Animation {
    constructor({ aliveTime = 999999999, bird } = {}) {
        super(aliveTime);
        this.freze = false;
        this.isObstacle = true;
        this.isOverComed = false;
        this.bird = bird;
    }

    update() {
        if (this.freze)
            return;
        this.x -= game.level;
        if (this.screenOverPass())
            this.destroy();
        this.checkCollide();
        this.checkOverCome();
    }

    draw() {
        if (this.index % 1 == 0) { // draw score when reach score % 10 == 0 score
            this.drawScore();
        }
    }

    configTextBeforeDrawScore() {
        stroke('white');
        strokeWeight(4);
        textAlign(CENTER, CENTER);
        textSize(50);
    }

    checkCollide() {
        if (this.collideBird(gameDebug)) {
            this.bird.hurt(2);
        }
    }

    checkOverCome() {
        if (this.overCome()) { // is overcoming
            if (!this.isOverComed) { // this event trigger when the bird overpass the obstacle
                for (let i = animation.indexOf(this) + 1; i < animation.length; i++) { // check if the following obstacle is popen
                    let a = animation[i];
                    if (a.isObstacle) {
                        if (a.name == 'Popen') {
                            // alert(2);
                            a.openPipes();

                        }
                        break;
                    }
                }
                // alert(1)
            }
            this.isOverComed = true;
        }
    }
}