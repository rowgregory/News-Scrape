const axios = require('axios');
const cheerio = require('cheerio');

function scrape() {

    axios.get("http://www.nytimes.com/section/world").then(function (response) {
        var $ = cheerio.load(response.data);
        let articles = [];

        $("div.story-body").each(function (i, element) {

            var result = {};

            // Add the text and href of every link, and save them as properties of the result object
            result.title = $(this)
                .find("h2")
                .text().trim();
            result.link = $(this)
                .children("a")
                .attr("href");
            result.summary = $(this)
                .find(".summary")
                .text().trim()
            console.log('===================================')
            console.log(result);
            articles.push(result);
        });
        return articles;
    });
    
}

module.exports = scrape;