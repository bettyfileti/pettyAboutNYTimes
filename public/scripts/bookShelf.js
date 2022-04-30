let currentFlow;

//--------------------------------------------------------------
// BOOKSHELF
//--------------------------------------------------------------
let selectedList = document.getElementById("select-list");
selectedList.addEventListener("change", updateList);

function updateList() {
    puttingBooksOnShelf();
}

let title1Display = document.getElementById("title-1");
let author1Display = document.getElementById("author-1");
let image1Display = document.getElementById("image-1");
let title2Display = document.getElementById("title-2");
let author2Display = document.getElementById("author-2");
let image2Display = document.getElementById("image-2");
let title3Display = document.getElementById("title-3");
let author3Display = document.getElementById("author-3");
let image3Display = document.getElementById("image-3");
let title4Display = document.getElementById("title-4");
let author4Display = document.getElementById("author-4");
let image4Display = document.getElementById("image-4");
let title5Display = document.getElementById("title-5");
let author5Display = document.getElementById("author-5");
let image5Display = document.getElementById("image-5");


console.log("bookShelf is loading");

let imageJSON2;
let activeListName;
let imageContainer = document.getElementById("img-container");
let backgroundColor = [255];

let stickers = [];
let bookCovers = [];


//--------------------------------------------------------------
// Setting up Bookshelf
//--------------------------------------------------------------


function buildBookShelf() {
    console.log("building a shelf", imageJSON2);

    //Making bookCovers[]
    Object.keys(imageJSON2).forEach(function (key) {
        let jsonListName = imageJSON2[key].list_name_encoded;

        //create bookCovers as classes
        loadImage(imageJSON2[key].new_book_image, function (loadedImage) {
            bookCovers.push(new CoverClass(loadedImage, imageJSON2[key].title, imageJSON2[key].author, imageJSON2[key].list_name_encoded, imageJSON2[key].list_name, imageJSON2[key].rank));
            if (bookCovers.length >= 25) { //kind of a clunky way to avoid redundancy but effective.
                puttingBooksOnShelf();
            }
        });
    });

    var myElem = document.getElementsByClassName('column-5th')

    for (let i = 0; i < myElem.length; i++) {

        myElem[i].onclick = function () {
            takeBookOffShelf(myElem[i]);
        }
    }

}

function puttingBooksOnShelf() {
    console.log("shelving books");

    let myList = selectedList.value;
    for (let bookCover of bookCovers) {
        if (bookCover.active) {
            bookCover.updateBookshelfImage();
            bookCover.bookGoesBack();
        }
    }
    for (let bookCover of bookCovers) {
        if (bookCover.listname == selectedList.value) {
            if (bookCover.rank === 1) {
                title1Display.innerHTML = bookCover.title;
                author1Display.innerHTML = bookCover.author;
                if (bookCover.hasBeenEdited) {
                    bookCover.updateBookshelfImage();
                } else {
                    image1Display.src = "./assets/" + bookCover.listname + "/" + bookCover.rank + ".jpg";
                }
            } else if (bookCover.rank === 2) {
                title2Display.innerHTML = bookCover.title;
                author2Display.innerHTML = bookCover.author;
                if (bookCover.hasBeenEdited) {
                    bookCover.updateBookshelfImage();
                } else {
                    image2Display.src = "./assets/" + bookCover.listname + "/" + bookCover.rank + ".jpg";
                }
            } else if (bookCover.rank === 3) {
                title3Display.innerHTML = bookCover.title;
                author3Display.innerHTML = bookCover.author;
                if (bookCover.hasBeenEdited) {
                    bookCover.updateBookshelfImage();
                } else {
                    image3Display.src = "./assets/" + bookCover.listname + "/" + bookCover.rank + ".jpg";
                }
            } else if (bookCover.rank === 4) {
                title4Display.innerHTML = bookCover.title;
                author4Display.innerHTML = bookCover.author;
                if (bookCover.hasBeenEdited) {
                    bookCover.updateBookshelfImage();
                } else {
                    image4Display.src = "./assets/" + bookCover.listname + "/" + bookCover.rank + ".jpg";
                }
            } else if (bookCover.rank === 5) {
                title5Display.innerHTML = bookCover.title;
                author5Display.innerHTML = bookCover.author;
                if (bookCover.hasBeenEdited) {
                    bookCover.updateBookshelfImage();
                } else {
                    image5Display.src = "./assets/" + bookCover.listname + "/" + bookCover.rank + ".jpg";
                }
            } else {
                console.log("Wasn't able to match books to lists");
            }
        }
    }
    stickers = [];
    stickers.push(new Sticker(stickerImg));

}


function takeBookOffShelf(book) {
    console.log(book);
    let footer = document.getElementsByClassName("footer")[0];
    footer.classList.add("remove-margin-top");

    let rankFromID = book.id.charAt(book.id.length - 1);
    for (let bookCover of bookCovers) {
        if (bookCover.activeList) {
            if (bookCover.active) {
                bookCover.bookGoesBack();
            }
            if (rankFromID == bookCover.rank) {
                bookCover.setupBook();

                //Change text display
                document.getElementById("displayCover").style.display = "block";
                document.getElementById("active-book-info").style.display = "flex";

                let displayListName = document.getElementById("bestseller-list-name");
                displayListName.innerHTML = bookCover.listnameDisplay;

                let displayAuthor = document.getElementById("bestseller-author-name");
                displayAuthor.innerHTML = bookCover.author;

                let displayBookTitle = document.getElementById("bestseller-book-title");
                displayBookTitle.innerHTML = bookCover.title;
            }
        }
    }
}

function redrawCanvas(){
    let currentBook;
    for (let bookCover of bookCovers){
        if (bookCover.active){
            currentBook = bookCover;
        }
       
        bookCover.img.resize(264, 0);
        bookCover.width = bookCover.img.width;
        bookCover.height = bookCover.img.height;
        bookCover.x = (width - bookCover.width)/2;

    }
    if (currentBook){
        currentBook = document.getElementById("column-5th-" + currentBook.rank);
        takeBookOffShelf(currentBook);
    }

}

//--------------------------------------------------------------
// p5 Functions
//--------------------------------------------------------------

let newCanvas = true;
let stickerImg;

function preload() {
    let jsonURL = "/bookCovers"
    console.log("preloading...", jsonURL);
    imageJSON2 = loadJSON(jsonURL, buildBookShelf); //load images as promise after this loaddddss

    stickerImg = loadImage("assets/goldstar.png");
    stickers.push(new Sticker(stickerImg));

}

function setup() {
    pixelDensity(2.5);
    let myCanvas;
    if (windowWidth < 800) {
        myCanvas = createCanvas(windowWidth * .75, 460);
        redrawCanvas()
    } else {
        myCanvas = createCanvas(800, 280); //300
    }
    myCanvas.parent('data-container');
    background(backgroundColor);

    rectMode(CENTER);
    noStroke();
}

function draw() {

    for (let bookCover of bookCovers) {
        bookCover.draw();
        bookCover.update();
    }
}

function windowResized() {
    if (windowWidth < 800) {
        resizeCanvas(windowWidth * .75, 460);
        redrawCanvas()
    }

}




