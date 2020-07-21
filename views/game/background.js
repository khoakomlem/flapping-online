class Background {
    constructor() {
        super();
        this.name = 'background';
        this.posX = {
            city: 0,
            tree: 0
        }
        this.city = createGraphics(cW * (Math.floor(width / cW) + 1), images.city.height);
        for (var i = 0; i <= Math.floor(width / cW) + 1; i++) {
            this.city.image(images.city, cW * i, 0);
        }
        this.tree = createGraphics(tW * i, images.tree.height);
        for (var i = 0; i <= Math.floor(width / tW) + 1; i++) {
            this.tree.image(images.tree, tW * i, 0);
        }
    }

    update() {
        this.posX.city -= 0.5;
        this.posX.tree -= 2;
        if (this.posX.city < -images.city.width) this.posX.city = 0;
        if (this.posX.tree < -images.tree.width) this.posX.tree = 0;
    }

    draw() {
        clear();
        image(this.city, this.posX.city + cW * i, 0);
        image(this.tree, this.posX.tree + tW * i, height - tH + 60);
    }
}