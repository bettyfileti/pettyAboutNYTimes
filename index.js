//--------------------------------------------------------------
//Server
let express = require('express');
let app = express();
let port = process.env.PORT || 3000;

app.use('/', express.static('public'));

app.get('/about', (request, response) => {
    response.send("This is an about page.");
});

app.listen(port, () => {
    console.log("The app is listening at", port);
})

//--------------------------------------------------------------
// loading data
var fs = require('fs');
var https = require('https');


let urlStart = "https://api.nytimes.com/svc/books/v3/";
let urlMid = "lists/names.json";
let urlEnd = "?api-key=CGtQDaGOMTCWEGBZssI2E7p4mPFu7tmK";
let listNames = [];
let url = urlStart + urlMid + urlEnd;
let bookCovers;
let dataToPush = [];
// url = url + "lists/current/hardcover-fiction.json";

const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

fetch(url, {
    method: "GET",
})
    .then(response => {
        return response.json();
    })
    .then(data => {
        makeArrayOfListNames(data);
        fetchLists();
    })
    .catch(function (error) {
        console.log(error);
    })

function makeArrayOfListNames(data) {
    let allLists = data.num_results;
    listNames.push(data.results[0]);  //combined-print-and-e-book-fiction
    listNames.push(data.results[1]);  //combined-print-and-e-book-nonfiction
    listNames.push(data.results[11]); //advice-how-to-and-miscellaneous
    listNames.push(data.results[23]); //picture-books
    listNames.push(data.results[25]); //young-adult
    // for (let i = 0; i < 5; i++) {
    //     listNames.push(data.results[i]);
    // };
};

function fetchLists() {
    for (let i = 0; i < listNames.length; i++) {
        urlMid = "lists/current/" + listNames[i].list_name_encoded + ".json";
        let listURL = urlStart + urlMid + urlEnd;

        fetch(listURL, {
            method: "GET",
        })
            .then(response => {
                return response.json();
            })
            .then(data => {
                let booksPerList = 5;
                for (let i = 0; i < booksPerList; i++){
                    let newImage;
                    let image_path = './public/assets/' + data.results.list_name_encoded + '/' + data.results.books[i].rank + '.jpg';
                    console.log(image_path);
                    newImage = saveImageToDisk(data.results.books[i].book_image, image_path);
    
                    dataToPush.push({
                        order: dataToPush.length,
                        list_name: data.results.list_name,
                        list_name_encoded: data.results.list_name_encoded,
                        title: data.results.books[i].title,
                        author: data.results.books[i].author,
                        book_image: data.results.books[i].book_image,
                        new_book_image: './assets/' + data.results.list_name_encoded + '/' + data.results.books[i].rank + '.jpg',
                        book_image_width: data.results.books[i].book_image_width,
                        book_image_height: data.results.books[i].book_image_height,
                        weeks_on_list: data.results.books[i].weeks_on_list,
                        rank: data.results.books[i].rank
                    })
                }


                app.get('/bookCovers', (request, response) => {
                    response.json(dataToPush);
                })

                app.get('/bookShelf', (request, response) => {
                    response.json(dataToPush);
                })

            })
            .catch(function (error) {
                console.log(error);
            })
    }
}


//--------------------------------------------------------------
//Node.js Function to save image from External URL.
function saveImageToDisk(url, localPath) {
    var fullUrl = url;
    var file = fs.createWriteStream(localPath);
    var request = https.get(url, function (response) {
        response.pipe(file);
    });
}