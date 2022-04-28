class CoverClass {
    constructor(img, title, author, listname, listnameDisplay, rank) {
        this.img = img,
            this.title = title,
            this.author = author,
            this.width = this.img.width * .5,
            this.height = this.img.height * .5,
            this.x = (800 - this.width) / 2,
            this.y = (275 - this.height) / 2,
            this.listname = listname,
            this.listnameDisplay = listnameDisplay,
            this.rank = rank,
            this.active = false,
            this.activeList = false,
            this.flowTracker = 0,
            this.editedImg = img,
            this.finished = false,
            this.hasBeenEdited = false
    }

    setupBook() {
        console.log("setting up book: ", this.title);
        this.active = true;
        background(backgroundColor);
        image(this.editedImg, this.x, this.y, this.width, this.height);
        flowButton.style.display = "none";
        this.hasBeenEdited = true;
        this.updateFlow();
    }

    draw() {
        if (this.active) {
            if ((this.flowTracker < flows.length)){
                let runningFunction = flows[this.flowTracker];
                runningFunction(this.editedImg, this.x, this.y, this.width, this.height);
            } 
        } 
    }

    update() {
        //Check for active bookshelf list
        if (this.listname != selectedList.value) {
            this.activeList = false;
        } else if (this.listname == selectedList.value) {
            this.activeList = true;
        }
    }


    buttonClicked() {
        //updated this.editedImg to be current canvas
        this.editedImg = get(this.x, this.y, this.width, this.height);

        //update bookshelf image
        this.updateBookshelfImage();

        //start next flow
        this.flowTracker = this.flowTracker + 1;
        this.updateFlow();

    }

    bookGoesBack() {
        //Turn off book
        this.active = false;

        console.log("//------");
        console.log("reshelving: ", this.title);

        //Reset stickers
        stickers = [];
        stickers.push(new Sticker(stickerImg));

    }

    updateBookshelfImage(){
        let newImage = this.editedImg.canvas;
        let idToUpdate = "image-" + this.rank;
        let imageToUpdate = document.getElementById(idToUpdate);
        imageToUpdate.src = newImage.toDataURL();
    }

    updateFlow() {
        console.log("updating flow");
        flowButton.style.display = "none";

        let canvas = document.getElementById("data-container");
        canvas.classList.remove("cursor-redpen");
        canvas.classList.remove("cursor-eraser");
        canvas.classList.remove("cursor-smudge");

        if (this.flowTracker >= flows.length) {
            // console.log("final");
            this.finished = true;

            feelingsDisplay.innerHTML = "Just walk away slowly. No one will notice."
            currentFlow = "finalFlow";

        } else {
            //update text
            flowButton.innerHTML = buttonsText[this.flowTracker];
            feelingsDisplay.innerHTML = feelingsText[this.flowTracker];

            //update global currentFlow
            currentFlow = flows[this.flowTracker].name;
            // console.log(flows[this.flowTracker].name, this.flowTracker, currentFlow);
            // console.log("//------");
        }

    }
}



//--------------------------------------------------------------
// FLOWS
//--------------------------------------------------------------

let flowButton = document.getElementById("flow-button");
let feelingsDisplay = document.getElementById("feelings");

flowButton.addEventListener("click", function () {
    for (let bookCover of bookCovers) {
        if (bookCover.active) {
            bookCover.buttonClicked();
        } else {

        }
    }
})

let flows = [scribbleOnImage, eraseImage, addStickers, smearImage];


let feelingsText = [
    "It sure would be a shame if someone <span class='red-text'>scribbled </span> all over your beautiful cover...",
    "Clumsy me! Here, let’s try to erase some of that mess.",
    "It looks worse than it is. We can cover it with a sticker or two.",
    //"If you don’t care for the stickers, we can just cut them out.",
    "Calm down. We can just smudge over that."

]

let buttonsText = [
    "Oh nooo, I made a mess.",
    "Oh dear, erased a bit too much there.",
    "Stickers helped. Better than the orig.",
    "I actually really like it.",
    "This looks so good."
]

//--------------------------------------------------------------
function scribbleOnImage(img, x, y, width, height) {
    let canvas = document.getElementById("data-container");
    canvas.classList.add("cursor-redpen");
    if (mouseIsPressed) {
        push();
        stroke("red");
        strokeWeight(3);
        line(mouseX, mouseY, pmouseX, pmouseY);
        pop();
        flowButton.style.display = "flex";
    }
}

//--------------------------------------------------------------
//Erase Image Function
function eraseImage(img, x, y, width, height) {
    let canvas = document.getElementById("data-container");
    canvas.classList.remove("cursor-redpen");
    canvas.classList.add("cursor-eraser");
    if (mouseIsPressed) {
        push();
        stroke(255, 255, 255, 255/3);
        strokeWeight(15);
        line(mouseX, mouseY, pmouseX, pmouseY);
        pop();

        push();
        stroke(255, 255, 255, 255/3);
        strokeWeight(14);
        line(mouseX, mouseY, pmouseX, pmouseY);
        pop();

        push();
        stroke(255, 255, 255, 255/2);
        strokeWeight(13);
        line(mouseX, mouseY, pmouseX, pmouseY);
        pop();

        push();
        stroke(255, 255, 255, 255/2);
        strokeWeight(12);
        line(mouseX, mouseY, pmouseX, pmouseY);
        pop();

        flowButton.style.display = "flex";
    }
}

//--------------------------------------------------------------
function addStickers(img, x, y, width, height) {
    let canvas = document.getElementById("data-container");
    canvas.classList.remove("cursor-eraser");

    background(backgroundColor);
    image(img, x, y, width, height);

    for (let sticker of stickers) {
        sticker.show();
    }

    if (mouseIsPressed){
        flowButton.style.display = "flex";
    }
}

//--------------------------------------------------------------
let focusSize = 15;
function smearImage(img, x, y, width, height) {
    let canvas = document.getElementById("data-container");
    canvas.classList.add("cursor-smudge");

    noFill();
    if (mouseIsPressed) {
        let pixelArray = get(mouseX, mouseY, focusSize, focusSize);

        image(pixelArray, mouseX, mouseY, focusSize * 1.05, focusSize * 1.05);
        rect(mouseX, mouseY, focusSize, focusSize);
        focusSize += .25;
        flowButton.style.display = "flex";

    } else {
        focusSize = 10;
    }

}

//--------------------------------------------------------------
// Mouse Functions
//--------------------------------------------------------------

function mouseDragged() {
    if (currentFlow === "addStickers") {
        stickers[stickers.length - 1].placeSticker();
        stickers.push(new Sticker(stickerImg));
    }

}

function mouseClicked() {
    if (currentFlow === "addStickers") {
        stickers[stickers.length - 1].placeSticker();
        stickers.push(new Sticker(stickerImg));
    }
}