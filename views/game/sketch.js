var animation = [],
    bird,
    i, flappyFont, socket = io();
// stop_running = false,
// level = 5,
// camera,
// bloodBar,
// updateBloodBar, 
// zoom=1;

function preload() {
    images = new Images();
    flappyFont = loadFont('fonts/Robot Crush.otf');
    //socket.on ...
}

function setup() {
    var canv = createCanvas(1366, 659);
    Width = width;
    Height = height;
    windowResized();
    canv.parent('game');
    // $('#game').append(`<div id="menu_button" style="text-align: center" class="center"> <input type="submit" class="button" id='pvp' value="PvP"><br> <input type="submit" class="button" id="single" value="SINGLE"><br> <input type="submit" class="button" id='help' value="HELP"> </div>`);
    angleMode(DEGREES);
    noStroke();
    textStyle(BOLD);
    textFont(flappyFont);

    socket.on('game res pvp', ({ gameRecord } = {}) => { //  {playerID: ..., gameRecord: gameRecord}
        // alert(1);
        console.log(gameRecord)
        var bird = { ...game.bird };
        game = new PvpGame(gameRecord);
        Object.assign(game.bird, bird); // game.bird  <<<------------ bird
        game.bird.bloodBar = game.bloodBar;
        game.bird.fly();
        game.recordGame.input.push({ name: 'bird.fly', frame: 0, birdY: game.bird.y });
        // game.opponent_bird.fly();
    })

    socket.on('alert', config => {
        config.onDestroy = function() {
            eval(config._onDestroy);
        }
        console.log(config)
        Swal.fire(config);
    })

    socket.on('game online', count => {
        $('#online_count').html(count);
    })

    background = new class {
        constructor() {
            this.name = 'background';
            this.cW = images.city.width;
            this.cH = images.city.height;
            this.tW = images.tree.width;
            this.tH = images.tree.height;
            this.posX = {
                city: 0,
                tree: 0
            }
            this.city = createGraphics(this.cW * (Math.floor(width / this.cW) + 2), this.cH);
            for (let i = 0; i <= Math.floor(width / this.cW) + 1; i++) {
                this.city.image(images.city, this.cW * i, 0);
            }
            this.tree = createGraphics(this.tW * (Math.floor(width / this.tW) + 2), this.tH);
            for (let i = 0; i <= Math.floor(width / this.tW) + 1; i++) {
                this.tree.image(images.tree, this.tW * i, 0);
                // console.log(i)
            }
        }

        update() {
            this.posX.city -= 0.5;
            this.posX.tree -= 2;
            if (this.posX.city < -this.cW) this.posX.city = 0;
            if (this.posX.tree < -this.tW) this.posX.tree = 0;
            // console.log(this.posX)
        }

        draw() {
            image(this.city, this.posX.city, 0);
            image(this.tree, this.posX.tree, height - this.tH + 60);
        }
    }

    // bird = new Bird();
    // camera = new Camera();
    // bloodBar = new BloodBar();
    game = new Menu();
    // noLoop();
    i = -1;
    // canv.parent("canvas");
    // frameRate(10);
}

function windowResized() {
    let newWidth = window.innerWidth;
    let newHeight = window.innerHeight;
    let scaleW = newWidth / width;
    let scaleH = newHeight / height;
    let scale = 1;
    if (scaleW < scaleH)
        scale = scaleW;
    else
        scale = scaleH;
    let config = { 'width': width * scale, 'height': height * scale };
    $('#defaultCanvas0').css(config);
    $('#game').css(config);
    // Width = config.width;
    // Height = config.height;
}

function mouseWheel(event) {
    // zoom += 0.1*(abs(event.delta)/event.delta);
    // camera.zoomTo(zoom);
}

function mousePressed() {
    if (game)
        game.mousePressed();
    // bird.fly();
}

function keyPressed() {
    // bird.fly();
    if (game)
        game.keyPressed();
}

function draw() {

    game.run();
    game.frameCount++;

    // animation
    i = 0;
    while (i < animation.length) {
        try {
            animation[i].frameCount++;

            animation[i].update();
            animation[i].draw();

            animation[i].aliveTime--;
            if (animation[i].delete == true || animation[i].aliveTime < 0) {
                animation[i].onDestroy();
                animation.splice(i, 1);
                i--;
            }
            i++;
        } catch (err) {
            alert(err)
            console.error(animation[i])
            noLoop();
            break;
        }
    }
}