class Sticker {
    constructor(img) {
        this.img = img,
            this.x,
            this.y,
            this.isPlaced = false
    }


    show() {
        if (this.isPlaced) {
            image(this.img, this.x, this.y, 30, 30);
        } else {
            image(this.img, mouseX - 15, mouseY - 15, 30, 30);
        }

    }

    placeSticker() {
        this.x = mouseX - 15;
        this.y = mouseY - 15;
        this.isPlaced = true;
    }


}