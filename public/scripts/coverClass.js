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
            this.imageSetup = true,
            this.flowTracker = 0,
            this.editedImg = img,
            this.hasBeenEdited = false
    }

    draw() {
        if (this.active) {
            if (this.imageSetup) {
                background(backgroundColor);
                image(this.editedImg, this.x, this.y, this.width, this.height);
                flowButton.style.display = "none";
                this.hasBeenEdited = true;
                this.imageSetup = false;
            }

            let runningFunction = flows[this.flowTracker];
            currentFlow = flows[this.flowTracker].name;
            runningFunction(this.editedImg, this.x, this.y, this.width, this.height);
        }
    }

    update() {
        if (this.listname != selectedList.value){
            this.activeList = false;
        } else if (this.listname == selectedList.value){
            this.activeList = true;
        }
    }


    buttonClicked() {
        console.log("button was clicked for", this.rank);

        //updated this.editedImg to be current canvas
        this.editedImg = get(this.x, this.y, this.width, this.height);

        //update bookshelf image
        let newImage = this.editedImg.canvas;
        let idToUpdate = "image-" + this.rank;
        console.log(idToUpdate);
        let imageToUpdate = document.getElementById(idToUpdate);
        imageToUpdate.src = newImage.toDataURL();

        //update text
        flowButton.innerHTML = buttonsText[this.flowTracker];
        feelingsDisplay.innerHTML = feelingsText[this.flowTracker];

        //start next flow
        this.flowTracker = this.flowTracker + 1;
    }
}



//--------------------------------------------------------------
// FLOWS
//--------------------------------------------------------------

// let flows = [scribbleOnImage, eraseImage, addStickers, cutImage, pasteCopies, smearImage];
let flows = [scribbleOnImage, eraseImage, addStickers, smearImage];
let flowCount = 0;
let timeToFinishTheCover = false;

let flowButton = document.getElementById("flow-button");
let feelingsDisplay = document.getElementById("feelings");

flowButton.addEventListener("click", function () {
    for (let bookCover of bookCovers) {
        if (bookCover.active) {
            bookCover.buttonClicked();
        }
    }
})

let feelingsText = [
    "Clumsy me! Here, let’s try to erase some of that mess.",
    "It looks worse than it is. We can cover it with a sticker or two.",
    //"If you don’t care for the stickers, we can just cut them out.",
    "Calm down. We can just smudge over that.",
    "I actually like it better than the original."

]

let buttonsText = [
    "Oh dear, erased a bit too much there.",
    "Better than the original! Don't you think?",
    "I actually really like it.",
    "This looks so good.",
    "Huh, is that the best-seller?"
]

//--------------------------------------------------------------
function scribbleOnImage(img, x, y, width, height) {
    if (mouseIsPressed) {
        flowButton.style.display = "flex";
        push();
        stroke("red");
        strokeWeight(3);
        line(mouseX, mouseY, pmouseX, pmouseY);
        pop();
    }
}

//--------------------------------------------------------------
//Erase Image Function
function eraseImage(img, x, y, width, height) {

    if (mouseIsPressed) {
        flowButton.style.display = "flex";
        push();
        stroke(backgroundColor);
        strokeWeight(20);
        line(mouseX, mouseY, pmouseX, pmouseY);
        pop();
    }
}

//--------------------------------------------------------------
function addStickers(img, x, y, width, height) {
    background(backgroundColor);
    image(img, x, y, width, height);

    for (let sticker of stickers) {
        sticker.show();
    }
}


//--------------------------------------------------------------
let activeCutOut = [];
let imageCutOut;
let rectCutOut;
let imageIsBeingMoved = false;

function cutImage(img, x, y, width, height) {
    if (!imageIsBeingMoved) {
        if (activeCutOut.length === 4) {
            let x = activeCutOut[0];
            let y = activeCutOut[1];
            let w = activeCutOut[2] - activeCutOut[0];
            let h = activeCutOut[3] - activeCutOut[1];

            if (w < 0) {
                x = x + w;
                y = y + h;
                w = w * -1;
                h = h * -1;
            }
            imageCutOut = get(x, y, w, h);
            imageSlices.push(new imageSlice(imageCutOut, x, y, w, h));
            console.log(imageSlices)
            imageIsBeingMoved = true;
        }
    }
    for (let imageSlice of imageSlices) {
        if (imageSlice.isDraggable) {
            imageSlice.over();
            imageSlice.update();
            imageSlice.show();
        }
    }
}



//--------------------------------------------------------------
function pasteCopies(img, x, y, width, height) {
    console.log("pasting copies");
}

//--------------------------------------------------------------
let focusSize = 10;
function smearImage(img, x, y, width, height) {

    fill("white");
    rect(this.x - 100, this.y, 200, this.height * 2); //This is not a permanent solution!
    noFill();
    if (mouseIsPressed) {
        let pixelArray = get(mouseX, mouseY, focusSize, focusSize);

        image(pixelArray, mouseX, mouseY, focusSize * 1.05, focusSize * 1.05);
        rect(mouseX, mouseY, focusSize, focusSize);
        focusSize += .25;
    } else {
        focusSize = 10;
    }

}


//--------------------------------------------------------------
let captureFinalImage = true;
function finishTheCover(img, x, y, width, height) {
    flowButton.style.display = "none";
    feelingsDisplay.innerHTML = "It wasn't that good in the first place."

    if (captureFinalImage) {

        // let newCover = document.createElement('img');
        // newCover = get();
        // console.log(newCover);
        // imageContainer.append(newCover);
        // let newCoverImg = createImage(0, 0);

        // let newCover = document.createElement('img');
        // newCover = newCoverImg;
        // imageContainer.append(newCoverImg);

        captureFinalImage = false;
    }

}

//--------------------------------------------------------------
function mouseDragged() {
    if (currentFlow === "addStickers") {
        stickers[stickers.length - 1].placeSticker();
        stickers.push(new Sticker(stickerImg));
    }

    if (currentFlow === "cutImage") {
        if (!imageIsBeingMoved) {
            let x = activeCutOut[0];
            let y = activeCutOut[1];
            push();
            noFill();
            stroke(255, 0, 0);
            strokeWeight(2);
            drawingContext.setLineDash([5, 10]);
            rectMode(CORNER);
            image(startImage, 0, 0);
            rect(x, y, mouseX - x, mouseY - y);
            pop();
        }
    }
}

function mouseClicked() {
    if (currentFlow === "addStickers") {
        stickers[stickers.length - 1].placeSticker();
        stickers.push(new Sticker(stickerImg));
    }
}

function mousePressed() {

    if (currentFlow === "addStickers") {
        flowButton.style.display = "flex";
        stickers[stickers.length - 1].placeSticker();
    }

    //------
    if (currentFlow === "cutImage") {
        for (let imageSlice of imageSlices) {
            imageSlice.pressed();
        }
        if (activeCutOut.length === 4) {
            activeCutOut = [];
        }
        activeCutOut.push(mouseX, mouseY);
    }
}

function mouseReleased() {
    if ((flows[flowCount].name === "addStickers")) {
        for (let sticker of stickers) {
            sticker.released();
        }
    }

    //------
    if (currentFlow === "cutImage") {
        for (let imageSlice of imageSlices) {
            imageSlice.released();
        }
        if (!imageIsBeingMoved) {
            activeCutOut.push(mouseX, mouseY);
        }

    }
}