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

function preload() {
    let jsonURL = "/bookCovers"
    console.log("preloading...", jsonURL);
    imageJSON2 = loadJSON(jsonURL, buildBookShelf); //load images as promise after this loaddddss
}

function buildBookShelf() {
    console.log("building a shelf", imageJSON2);

    Object.keys(imageJSON2).forEach(function(key) {
        let jsonListName = imageJSON2[key].list_name_encoded;
        if (jsonListName == "trade-fiction-paperback"){
            tradeFictionPaperbackTitleDisplay.innerHTML = imageJSON2[key].title;
            tradeFictionPaperbackAuthorDisplay.innerHTML = imageJSON2[key].author;
        } else if (jsonListName == "combined-print-and-e-book-fiction"){
            printEbookFictionTitleDisplay.innerHTML = imageJSON2[key].title;
            printEbookFictionAuthorDisplay.innerHTML = imageJSON2[key].author;
        } else if (jsonListName == "hardcover-fiction"){
            hardcoverFictionTitleDisplay.innerHTML = imageJSON2[key].title;
            hardcoverFictionAuthorDisplay.innerHTML = imageJSON2[key].author;
        } else if (jsonListName == "hardcover-nonfiction"){
            hardcoverNonfictionTitleDisplay.innerHTML = imageJSON2[key].title;
            hardcoverNonfictionAuthorDisplay.innerHTML = imageJSON2[key].author;
        } else if (jsonListName == "combined-print-and-e-book-nonfiction"){
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
    let bookImg = book.children[0].src;
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

    Object.keys(imageJSON2).forEach(function(key) {
        if (imageJSON2[key].list_name_encoded == book.id){
            displayListName.innerHTML = imageJSON2[key].list_name;
        }
    });
}

