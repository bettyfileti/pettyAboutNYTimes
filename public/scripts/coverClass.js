class CoverClass {
    constructor(img, listname, active) {
        this.img = img,
            this.width = this.img.width * .5,
            this.height = this.img.height * .5,
            this.x = (800 - this.width) / 2,
            this.y = (275 - this.height) / 2,
            this.listname = listname,
            this.active = false,
            this.imageSetup = true,
            this.flowTracker = 0,
            this.editedImg = img
    }

    draw() {
        if (this.active) {
            //for stickers, captureStartImage();
            if (this.imageSetup) {
                background(backgroundColor);
                image(this.editedImg, this.x, this.y, this.width, this.height);
                flowButton.style.display = "none";
                this.imageSetup = false;
            }

            let runningFunction = flows[this.flowTracker];
            runningFunction();
        }
    }


    buttonClicked() {
        console.log("button was clicked for", this.listname);
        //grab canvas
        //updated this.editedImg to be that canvas
        this.editedImg = get(this.x, this.y, this.width, this.height);

        //update bookshelf image
        let newImage = this.editedImg.canvas;
        let imageToUpdate = document.getElementById(this.listname).getElementsByTagName("img")[0];
        imageToUpdate.src = newImage.toDataURL();

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

//--------------------------------------------------------------
function scribbleOnImage() {
    if (mouseIsPressed) {
        flowButton.style.display = "flex";
        push();
        stroke("red");
        strokeWeight(2);
        line(mouseX, mouseY, pmouseX, pmouseY);
        pop();
    }
}

//--------------------------------------------------------------
//Erase Image Function
function eraseImage() {

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
function addStickers() {
    for (let sticker of stickers) {
        sticker.over();
        sticker.update();
        if (sticker.new) {
            if (sticker.dragging) {
                stickers.push(
                    new Sticker(sticker.img, stickers.length, sticker.x, sticker.y)
                );
                sticker.new = false;
            }
        }
        sticker.show();
    }
}


//--------------------------------------------------------------
let activeCutOut = [];
let imageCutOut;
let rectCutOut;
let imageIsBeingMoved = false;

function cutImage() {
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
function pasteCopies() {
    console.log("pasting copies");
}

//--------------------------------------------------------------
let focusSize = 10;
function smearImage() {

    fill("white");
    rect(imgX - 100, imgY, 200, img.height * 2); //This is not a permanent solution!
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
function captureStartImage() {
    startImage = get();
    //flowStart = false;
    //flowButton.style.display = "flex";
}

//--------------------------------------------------------------
let captureFinalImage = true;
function finishTheCover() {
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
    let currentFlow = flows[flowCount].name;

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

function mousePressed() {
    let currentFlow = flows[flowCount].name;

    if (currentFlow === "addStickers") {
        flowButton.style.display = "flex";
        for (let sticker of stickers) {
            sticker.pressed();
        }
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
    let currentFlow = flows[flowCount].name;

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