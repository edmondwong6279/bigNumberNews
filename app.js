// Set up server, GET method is just a JSON object with a url.
// Example numbers:
// 10m, 350 trillion, 5,500,000, 17.5 million
// comma separated then period eg 123,456.98 

const express = require("express");
// npm i node-fetch@2
const fetch = require("node-fetch");
const extractor = require("unfluff");
const bodyParser = require("body-parser");
const { URL, URLSearchParams } = require("url");

const port = 3000;
const app = express();

// so we can access request body
app.use(bodyParser.json());

const searchRegex = [
    /(\d*\.?\d*)+ ?thousands*/gi,
    /(\d*\.?\d*)+( ?millions*|m)/gi,
    /(\d*\.?\d*)+( ?billions*|bn)/gi,
    /(\d*\.?\d*)+( ?trillions*|tn)/gi,
    // any number over 1,000
    /([1-9]{1}\d{0,2})(\,\d{3})+(\.\d*)*/g
];

app.get("/", async (req, res) => {
    const fullUrl = req.body.url;
    const res1 = await fetch(fullUrl);
    const html = await res1.text();
    const body = extractor(html).text;

    let allResults = [];

    searchRegex.forEach((currentRegex) => {
        const resultsArray = body.match(currentRegex);

        console.log(resultsArray);

        if (resultsArray) {
            resultsArray.map((result) => {
                allResults = allResults.concat(`${result}`);
            });
        }
    });

    console.log(`Total matches: ${allResults.length}`);
    res.send(allResults);
    console.log("end of the search");
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
