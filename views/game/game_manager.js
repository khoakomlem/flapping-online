class FrameWait {
    constructor({ amount } = {}) {
        this.frameCount = 0;
        this.name = 'FrameWait';
        this.amount = amount; //how many frame do you want to delay
    }
}

class Images {
    constructor() {
        this.bodypipe = loadImage('game/image/pipe1.jpg');
        this.headpipe = loadImage('game/image/pipe2.jpg');
        this.death_block = loadImage('game/image/death_block.png');
        this.bird = loadImage('game/image/bird.png');
        this.background = loadImage('game/image/bg.png');
        this.tree = loadImage('game/image/menu1.png');
        this.city = loadImage('game/image/menu2.png');
        this.menuBackground = loadImage('game/image/menu.png');
        this.blood = loadImage('game/image/blood.png'); //
        this.blood_bar = loadImage('game/image/blood_bar.png'); // 50 x 162
        this.button = loadImage('game/image/button2.png');
        this.buttonOnHover = loadImage('game/image/button1.png');
        this.coin = loadImage('game/image/coin.png');
    }
}

class Camera {
    constructor({ pointA = { x: 0, y: 0 }, pointC = { x: width, y: height } } = {}) {
        this.pointA = pointA;
        this.pointC = pointC;
        //middle point show me the position of the midpoint at the screen
        this._middleX = (this.pointA.x + this.pointC.x) / 2; // default middleX at scale 1
        this._middleY = (this.pointA.y + this.pointC.y) / 2; // default middleY at scale 1
        this.middleX = (this.pointA.x + this.pointC.x) / 2; // changed middleX
        this.middleY = (this.pointA.y + this.pointC.y) / 2; // changed middleY
        this.x = 0; // current position
        this.y = 0;
        this.toX = 0; // position to move Camera
        this.toY = 0;
        this.scale = 1;
        this.toScale = 1;
        this.smooth = true;
        this.isShaking = false;
        this.isFollowing = false;
        this.followObject = { x: 0, y: 0 };
    }

    update() {
        this.scale = lerp(this.scale, this.toScale, 0.1);
        this.middleX = this._middleX * this.toScale;
        this.middleY = this._middleY * this.toScale;

        if (this.isFollowing) {
            let { x, y } = this.followObject;
            this.toX = x;
            this.toY = y;
        }

        this.x = lerp(this.x, this.toX, 0.1);
        this.y = lerp(this.y, this.toY, 0.1);
        if (this.smooth) {
            translate(this.x, this.y);
            scale(this.scale);
        } else {
            translate(this.toX * this.toScale, this.toY * this.toScale);
            scale(this.toScale);
        }
    }

    follow(object) {
        this.isFollowing = true;
        this.followObject = object;
    }

    unFollow() {
        this.isFollowing = false;
        this.followObject = { x: 0, y: 0 };
    }

    shake() {
        this.isShaking = true;
        var cX = this.toX; // current X
        var cY = this.toY; // current Y
        for (var i = 0; i < 20; i++) {
            setTimeout(() => {
                this.x = random(cX - 20, cX + 20);
                this.y = random(cY - 20, cY + 20);
            }, 20 * i);
        }
        setTimeout(() => {
            this.x = random(cX - 20, cX + 20);
            this.y = random(cY - 20, cY + 20);
            this.isShaking = false;
        }, 20 * 20);
    }

    moveTo({ x = 0, y = 0 } = {}, mx, my) { // mx = wanna middleX? my = wanna middleY?
        this.toX = x;
        this.toY = y;

        if (mx)
            this.toX = (this.middleX - x);
        if (my)
            this.toY = (this.middleY - y);
    }

    zoomTo(scale) {
        this.toScale = scale;
    }
}

class BloodBar extends Animation {
    constructor({ blood = 100, x = 10, y = 10 } = {}) {
        super();
        this.blood = 100;
        this.x = x;
        this.y = y;
        this.width = 50;
        this.height = 162;
        this.blood_tmp = 100;
        this.delayUpdate;
    }

    updateBlood(blood, smoothDelay) {
        if (smoothDelay) {
            clearTimeout(this.delayUpdate);
            this.delayUpdate = setTimeout(() => this.blood_tmp = blood, 200);
        } else {
            this.blood = blood;
        }
    }

    draw() {
        this.blood = lerp(this.blood, this.blood_tmp, 0.1);
        push();
        fill('red');
        rect(this.x + 9, this.y + this.height - 37, this.width - 18, (-this.height + 45) * (this.blood / 100));
        image(images.blood_bar, this.x, this.y);
        pop();
    }
}

class loseAnimation {
    constructor() {
        this.frame = 0;
        camera.moveTo(bird, true, true);
    }

    update() {
        camera.zoomTo(camera.scale += 0.0001);
        this.frame++;
        bird.degree += 0.5;
    }

    draw() {

    }
}