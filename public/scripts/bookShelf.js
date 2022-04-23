//--------------------------------------------------------------
// BOOKSHELF
//--------------------------------------------------------------
let activeBook = false;
let myNewBook;

let printEbookFictionTitleDisplay = document.getElementById("print-and-e-book-fiction-title");
let printEbookFictionAuthorDisplay = document.getElementById("print-and-e-book-fiction-author");
let printEbookNonfictionTitleDisplay = document.getElementById("print-and-e-book-nonfiction-title");
let printEbookNonfictionAuthorDisplay = document.getElementById("print-and-e-book-nonfiction-author");
let hardcoverFictionTitleDisplay = document.getElementById("hardcover-fiction-title");
let hardcoverFictionAuthorDisplay = document.getElementById("hardcover-fiction-author");
let hardcoverNonfictionTitleDisplay = document.getElementById("hardcover-nonfiction-title");
let hardcoverNonfictionAuthorDisplay = document.getElementById("hardcover-nonfiction-author");
let tradeFictionPaperbackTitleDisplay = document.getElementById("trade-fiction-paperback-title");
let tradeFictionPaperbackAuthorDisplay = document.getElementById("trade-fiction-paperback-author");

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

    Object.keys(imageJSON2).forEach(function (key) {
        let jsonListName = imageJSON2[key].list_name_encoded;

        //create bookCovers as classes
        loadImage(imageJSON2[key].new_book_image, function (loadedImage) {
            bookCovers.push(new CoverClass(loadedImage, imageJSON2[key].list_name_encoded, false));
        });

        //Set up bookshelf display
        if (jsonListName == "trade-fiction-paperback") {
            tradeFictionPaperbackTitleDisplay.innerHTML = imageJSON2[key].title;
            tradeFictionPaperbackAuthorDisplay.innerHTML = imageJSON2[key].author;
        } else if (jsonListName == "combined-print-and-e-book-fiction") {
            printEbookFictionTitleDisplay.innerHTML = imageJSON2[key].title;
            printEbookFictionAuthorDisplay.innerHTML = imageJSON2[key].author;
        } else if (jsonListName == "hardcover-fiction") {
            hardcoverFictionTitleDisplay.innerHTML = imageJSON2[key].title;
            hardcoverFictionAuthorDisplay.innerHTML = imageJSON2[key].author;
        } else if (jsonListName == "hardcover-nonfiction") {
            hardcoverNonfictionTitleDisplay.innerHTML = imageJSON2[key].title;
            hardcoverNonfictionAuthorDisplay.innerHTML = imageJSON2[key].author;
        } else if (jsonListName == "combined-print-and-e-book-nonfiction") {
            printEbookNonfictionTitleDisplay.innerHTML = imageJSON2[key].title;
            printEbookNonfictionAuthorDisplay.innerHTML = imageJSON2[key].author;
        } else {
            console.log("Wasn't able to match books to lists");
        }
    });

    var myElem = document.getElementsByClassName('column-5th')

    for (let i = 0; i < myElem.length; i++) {

        myElem[i].onclick = function () {
            takeBookOffShelf(myElem[i]);
        }
    }

}


function takeBookOffShelf(book) {
    //Set book to active
    for (let bookCover of bookCovers) {
        if (book.id != bookCover.listname) {
            bookCover.active = false;
        } else {
            bookCover.active = true;
            bookCover.imageSetup = true;
            console.log("clicked: ", bookCover.listname);
        }
    }
    //Change book info to reflect active book
    let bookInfo = book.children[1];
    let bookTitle = bookInfo.children[0].innerHTML;
    let bookAuthor = bookInfo.children[1].innerHTML;

    document.getElementById("displayCover").style.display = "block";
    document.getElementById("active-book-info").style.display = "flex";

    let displayAuthor = document.getElementById("bestseller-author-name");
    displayAuthor.innerHTML = bookAuthor;

    let displayBookTitle = document.getElementById("bestseller-book-title");
    displayBookTitle.innerHTML = bookTitle;

    let displayListName = document.getElementById("bestseller-list-name");
}

//--------------------------------------------------------------
// p5 Functions
//--------------------------------------------------------------

let newCanvas = true;

function preload() {
    let jsonURL = "/bookCovers"
    console.log("preloading...", jsonURL);
    imageJSON2 = loadJSON(jsonURL, buildBookShelf); //load images as promise after this loaddddss

    let sticker1 = loadImage("assets/stickers-01.png");
    let sticker2 = loadImage("assets/stickers-02.png");
    let sticker3 = loadImage("assets/stickers-03.png");

    stickers.push(new Sticker(sticker1, 0, 0, 100 * 0));
    stickers.push(new Sticker(sticker2, 1, 0, 100 * 1));
    stickers.push(new Sticker(sticker3, 2, 0, 100 * 2));

    // stickers.push(new Sticker(sticker1, 0, imgX - (sticker1.width * .3), imgY + 100 * 0));
    // stickers.push(new Sticker(sticker2, 1, imgX - (sticker2.width * .3), imgY + 100 * 1));
    // stickers.push(new Sticker(sticker3, 2, imgX - (sticker3.width * .3), imgY + 100 * 2));
}

function setup() {
    pixelDensity(2.5);
    let myCanvas = createCanvas(800, 300); //300
    myCanvas.parent('data_container');
    background(backgroundColor);

    rectMode(CENTER);
    noStroke();
}

function draw() {

    for (let bookCover of bookCovers) {
        bookCover.draw();
    }
}

//--------------------------------------------------------------


function captureBookImage() {
    let bookImage = get();
    return bookImage;
}

