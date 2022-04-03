//--------------------------------------------------------------
//Server
let express = require('express');
let app = express();
let port = process.env.PORT || 3000;

// app.get('/', (request, response) => {
//     response.send("This is a page.")
// });

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
    for (let i = 0; i < 5; i++) {
        listNames.push(data.results[i]);
    };
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
                let indexValue = 0;
                let newImage;
                let image_path = './public/assets/' + data.results.list_name_encoded + '.jpg';
                newImage = saveImageToDisk(data.results.books[0].book_image, image_path);


                dataToPush.push({
                    order: dataToPush.length,
                    list_name: data.results.list_name,
                    list_name_encoded: data.results.list_name_encoded,
                    title: data.results.books[0].title,
                    author: data.results.books[0].author,
                    book_image: data.results.books[0].book_image,
                    new_book_image: "./assets/" + data.results.list_name_encoded + ".jpg",
                    //new_book_image: image_path, 
                    book_image_width: data.results.books[0].book_image_width,
                    book_image_height: data.results.books[0].book_image_height,
                    weeks_on_list: data.results.books[0].weeks_on_list
                })

                app.get('/bookCovers', (request, response) => {
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