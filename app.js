// Set up server, GET method is just a JSON object with a url.
// In the extracted stuff (stream probably), look for the words:
//      [thousand(s), million(s), billions(s), trillion(s),quadrillion(s)]
// Also set up regex for numbers more than 3 digits long, using comma
// separations (of period for european).
// https://www.npmjs.com/package/extract-numbers Maybe this?
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/search
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/slice

const express = require("express");
// npm i node-fetch@2
const fetch = require("node-fetch");
const bodyParser = require("body-parser");
const { URL, URLSearchParams } = require("url");

const port = 3000;
const app = express();

// so we can access request body
app.use(bodyParser.json());

const searchRegex = [/thousand/gi, /million/gi, /billion/gi, /trillion/gi];

app.get("/", async (req, res) => {
    const fullUrl = req.body.url;
    const res1 = await fetch(fullUrl);
    const html = await res1.text();

    const bot = html.indexOf("<body>");
    const top = html.indexOf("</body>");
    const body = html.substring(bot, top + 7);

    let allResults = [];

    searchRegex.forEach((currentRegex) => {
        const resultsArray = [...body.matchAll(currentRegex)];

        resultsArray.map((result) => {
            allResults = allResults.concat(
                `${body.slice(result.index, result.index + 20)}`
            );
        });
    });

    console.log(`Total matches: ${allResults.length}`);
    res.send(allResults);
    console.log("end of the search");
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
