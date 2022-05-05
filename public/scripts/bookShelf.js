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

function redrawCanvas() {
    let currentBook;
    for (let bookCover of bookCovers) {
        if (bookCover.active) {
            currentBook = bookCover;
        }

        bookCover.img.resize(264, 0);
        bookCover.width = bookCover.img.width;
        bookCover.height = bookCover.img.height;
        bookCover.x = (width - bookCover.width) / 2;

    }
    if (currentBook) {
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
        resizeCanvas(windowWidth * .75, 400);
        redrawCanvas()
    }

}

//--------------------------------------------------------------
// Super spaghetti twitter code that should be re-written.

const settings = {
    node: "<a href='#'>Tweet</a>", //node defines the element that will be contained in the button that pops up
    maxLength: 280, //maxLength is the max length allowed for the tweet
    extra: null, //extra is simply some extra text that you want to include in your tweets
    via: null, //via defines the handler for twitter, if you want to be tagged whenever a user tweets something from your site
    popupArgs: 'width=400,height=400,toolbar=0,location=0', //popupArgs is used to define the twitter popup
}

let url = ''
let tweetableText = [
    "Look at me not being petty about this week's bestsellers. @NYTimesBooks. #notpetty",
    "Once again, @NYTimesBooks has neglected to include me on a list. #notpetty",
    "Judging books by their cover is my love language. #notpetty @NYTimesBooks",
    "I'm #notpetty but *real* writers would rather have 1 person *really read* their work then be on a list. @NYTimesBooks",
    "Would a petty person even look at the @NYTimesBooks best seller list? No. #notpetty",
    "Personally attacked by @NYTimesBooks snub of my not-yet-finished but definitely started novella. #notpetty",
    "#notpetty #notpetty #notpetty #notpetty #notpetty @NYTimesBooks",
    "@NYTimesBooks, Best Feller List > Best Seller List. Every think of that? #notpetty",
    "A brilliant, unappreciated literary genius walks into a bar and sells no books. #notpetty @NYTimesBooks",
    "bEsTsElLiNg AuThOr isn't the flex you think it is, @NYTimesBooks",
    "@NYTimesBooks, all these best SHELLING authors on the best SHELLERS list. #notpetty",
    "@NYTimesBooks 'DEFINING CULTURE THROUGH LISTS' ... #notpetty tho",
    "To this week's @NYTimesBooks best sellers, congratulations on your continued (MARKETING) success. #notpetty"
]


const getTweetURL = function (text, extra, via) {
    let url = 'https://twitter.com/intent/tweet?text='
    // trim the text to fit in the max allowed 280 characters
    const viaUrl = `&via=${via}`
    const maxLength = settings.maxLength > 280 ? 280 : settings.maxLength
    const maxAllowedLength = maxLength - viaUrl.length
    let textToTweet = getRandom(text)
    if (text.length > maxAllowedLength) {
        textToTweet = text.substring(0, maxAllowedLength - 1)
    }
    url += encodeURIComponent(textToTweet)
    if (extra) url += encodeURIComponent(' ' + extra)
    if (via) url += viaUrl
    return url
}


let btnToTweet = document.getElementById("tweet-btn");
btnToTweet.addEventListener("click", (e) => {
    e.preventDefault()
    e.stopPropagation()
    url = getTweetURL(tweetableText, settings.extra, settings.via);
    window.open(url, '_blank', settings.popupArgs)
});

//--------------------------------------------------------------
// Safari Pop-up Handler
//--------------------------------------------------------------
let popup = document.getElementById("popup-container"); 
let popupClose = document.getElementById("popup-close");
popupClose.addEventListener("click", closePopup);

if (window.innerWidth < 400){
    console.log("small window");
    popup.style.display = "inline";
} else {
    popup.classList.add("notvisible");
}

function closePopup(){
    console.log("closing");
    popup.style.display = "none";
}


//--------------------------------------------------------------
function getRandom(list) {
    return list[Math.floor((Math.random() * list.length))];
}
