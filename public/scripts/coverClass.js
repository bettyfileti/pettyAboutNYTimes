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
        if (this.width < 100){
            this.width = 164.5;
            this.height = 250;
            this.x = 317.75;
            this.y = 12.5;
        }
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

        //This is taking too long, and then the books are reshelved and this was updated afterwards.
        // console.log("The active list is", selectedList.value);
        // console.log("This list is ", this.listname);
    }

    updateFlow() {
        console.log("updating flow");
        flowButton.style.display = "none";

        let canvas = document.getElementById("data-container");
        canvas.classList.remove("cursor-redpen");
        canvas.classList.remove("cursor-eraser");
        canvas.classList.remove("cursor-smudge");

        if (this.flowTracker >= flows.length) {
            this.finished = true;
            let textList = [
                "Just walk away slowly. No one will notice.", 
                "Some people are so petty.", 
                "No one was going to buy it anyway.", 
                "I'll just put it in the trash, where it belongs.", 
                "I'm really more of a movie person, myself.",
                "I think it's a massive improvement.",
                "Well, clearly taste is subjective.",
                "We can all agree that this is better.",
                "What do they know anyways.",
                "I don't see what the fuss is about.",
                "The author will thank me later.",
                "Amazing what a good editor can do.",
                "Popular isn't always good, you know."]
            feelingsDisplay.innerHTML = random(textList);
            currentFlow = "finalFlow";

            let tweetBtn = document.getElementById("tweet-button-container");
            tweetBtn.classList.remove("notvisible");
            tweetBtn.classList.add("visible");

        } else {
            let tweetBtn = document.getElementById("tweet-button-container");
            tweetBtn.classList.remove("visible");
            tweetBtn.classList.add("notvisible");

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

let scribbleText = [
    "It sure would be a shame if someone <span class='red-text'>scribbled </span> all over this beautiful book cover..."
]
//COME BACK HERE!

let feelingsText = [
    getRandom(scribbleText),
    "Clumsy me! Here, let???s try to erase some of that mess.",
    "It looks worse than it is. We can cover it with a sticker or two.",
    //"If you don???t care for the stickers, we can just cut them out.",
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
        let imageSize = focusSize * 1.05;
        image(pixelArray, pmouseX, pmouseY, imageSize, imageSize);
        rect(mouseX, mouseY, focusSize, focusSize);
        focusSize += .2;
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

function touchMoved(){
    // push();
    // fill(random(255), random(255), random(255));
    // rect(0, 0, 10, 10);
    // pop();
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