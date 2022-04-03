//let flows = [scribbleOnImage, eraseImage, addStickers, cutImage, pasteCopies, smearImage];
let flows = [scribbleOnImage, eraseImage, addStickers, smearImage];

let img;
let imgX;
let imgY;
let newImg;
let imageContainer = document.getElementById("img-container")

let timeToFinishTheCover = false;


let feelingsText = [
    "It sure would be a shame if someone scribbled all over it...",
    "Clumsy me! Here, let’s try to erase some of that mess.",
    "It looks worse than it is. We can cover it with a sticker or two.",
    //"If you don’t care for the stickers, we can just cut them out.",
    "Calm down. We can just smudge over that.",
    "I actually like it better than the original."

]

let buttonsText = [
    "oh, i’ve made a mess",
    "Oh dear, erased a bit too much there.",
    "Better than the original! Don't you think?",
    "I actually really like it.",
    "This looks so good.",
    "Huh, is that the best-seller?"
]

let flowButtonDisplay = document.getElementById("flow-button");
let feelingsDisplay = document.getElementById("feelings");

flowButtonDisplay.addEventListener('click', function () {
    console.log("flowCount:", flowCount);
    flowCount += 1;
    if (flowCount === flows.length) {
        console.log("All the flows have run");
        timeToFinishTheCover = true;
        flowCount = 0;
    }

    flowButtonDisplay.innerHTML = buttonsText[flowCount];
    let currentFlow = flows[flowCount].name;
    console.log(currentFlow);

    feelingsDisplay.innerHTML = feelingsText[flowCount];
    flowStart = true;
});

//--------------------------------------------------------------
//p5 functions

let sticker1;
let sticker2;
let sticker3;
let stickers = [];
let imageSlices = [];

let startImage;
let bookImageCopy;

let flowCount = 0;
let flowStart = true;

let backgroundColor = [255];
let startP5 = true;

let imageJSON;
let allImages = []

function preload() {
    let jsonURL = "/bookCovers"
    imageJSON = loadJSON(jsonURL, populateImages); //load images as promise after this loaddddss
    //img = loadImage("assets/combined-print-and-e-book-fiction.jpg");
    sticker1 = loadImage("assets/stickers-01.png");
    sticker2 = loadImage("assets/stickers-02.png");
    sticker3 = loadImage("assets/stickers-03.png");

}

function populateImages() {
    console.log(imageJSON);
    for (let key in imageJSON) {
        let coverImage = loadImage(imageJSON[key].new_book_image);
        allImages.push(coverImage);

        if (imageJSON[key].order == 0) {
            let displayAuthor = document.getElementById("bestseller-author-name");
            displayAuthor.innerHTML = imageJSON[key].author;

            let displayBookTitle = document.getElementById("bestseller-book-title");
            displayBookTitle.innerHTML = imageJSON[key].title;

            let displayListName = document.getElementById("bestseller-list-name");
            displayListName.innerHTML = imageJSON[key].list_name;
        }
    }

    console.log()
    img = allImages[0];
}

function setup() {
    pixelDensity(2.5);
    let myCanvas = createCanvas(800, 400);
    myCanvas.parent('data_container');
    background(backgroundColor);

    rectMode(CENTER);
    noStroke();
    img.width = img.width * .75;
    img.height = img.height * .75;
    imgX = (800 - img.width) / 2;
    imgY = (400 - img.height) / 2;

    image(img, imgX, imgY);


    stickers.push(new Sticker(sticker1, 0, imgX - (sticker1.width * .3), imgY + 100 * 0));
    stickers.push(new Sticker(sticker2, 1, imgX - (sticker2.width * .3), imgY + 100 * 1));
    stickers.push(new Sticker(sticker3, 2, imgX - (sticker3.width * .3), imgY + 100 * 2));

}

function draw() {

    if (timeToFinishTheCover) {
        finishTheCover();
    } else {
        let runningFunction = flows[flowCount];
        runningFunction();
    }

}

//--------------------------------------------------------------
function scribbleOnImage() {
    if (mouseIsPressed) {
        flowButtonDisplay.style.display = "flex";
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
    if (flowStart) {
        flowButtonDisplay.style.display = "none";
        flowStart = false;
    }
    if (mouseIsPressed) {
        flowButtonDisplay.style.display = "flex";
        push();
        stroke(backgroundColor);
        strokeWeight(20);
        line(mouseX, mouseY, pmouseX, pmouseY);
        pop();
    }
}

//--------------------------------------------------------------
function addStickers() {
    if (flowStart) {
        flowButtonDisplay.style.display = "none";
        captureStartImage();
    } else {
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
}

//--------------------------------------------------------------
let activeCutOut = [];
let imageCutOut;
let rectCutOut;
let imageIsBeingMoved = false;

function cutImage() {
    if (flowStart) {
        captureStartImage();
    } else {
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
}


//--------------------------------------------------------------
function pasteCopies() {
    console.log("pasting copies");
}

//--------------------------------------------------------------
let focusSize = 10;
function smearImage() {
    if (flowStart) {
        flowButtonDisplay.style.display = "none";
        captureStartImage();
    } else {
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
}

//--------------------------------------------------------------
function captureStartImage() {
    startImage = get();
    flowStart = false;
    flowButtonDisplay.style.display = "flex";
}

//--------------------------------------------------------------
let captureFinalImage = true;
function finishTheCover() {
    flowButtonDisplay.style.display = "none";
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
        flowButtonDisplay.style.display = "flex";
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